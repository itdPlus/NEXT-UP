// Source: https://framerusercontent.com/modules/7LByfXIq4Wz8XTWRPTTs/VazgZtyKH2EcC0top1Lf/Webgl_Shader_Component.js
// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/
import { jsx as _jsx } from "react/jsx-runtime"
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import * as THREE from "three"
import {
  shaderInputs,
  mainFunction,
  fragmentShaderSource,
  vertexShaderSource,
} from "../../framer-modules/ShaderSource-3JJF.js"
/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 700
 * @framerIntrinsicHeight 400
 */ const fragmentShadersTitle = () => {
  return fragmentShaderSource.map((e) => e.title).sort()
}
export default function Webgl_Shader_Component(props) {
  const { shaderChoose, selectShader, customShader, speed, limitFPS } = props
  const containerRef = useRef(null)
  const getFragmentSelectedData =
    shaderChoose === "List"
      ? fragmentShaderSource.find((x) => x.title === selectShader)
      : { title: customShader.title, value: customShader.fragment }
  useEffect(() => {
    const container = containerRef === null || containerRef === void 0 ? void 0 : containerRef.current
    if (!container) return
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.domElement.setAttribute("role", "img")
    renderer.domElement.setAttribute("aria-label", `${getFragmentSelectedData.title || "Untitled"}`)
    renderer.domElement.setAttribute(
      "aria-labelledby",
      `${(getFragmentSelectedData === null || getFragmentSelectedData === void 0 ? void 0 : getFragmentSelectedData.author) || "Unknown"}`
    )
    container.appendChild(renderer.domElement)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() },
        iMouse: { value: new THREE.Vector4() },
      },
      vertexShader: shaderChoose === "List" ? vertexShaderSource : customShader.vertex,
      fragmentShader:
        shaderChoose === "List"
          ? shaderInputs.concat(getFragmentSelectedData.value, mainFunction)
          : customShader.inputs.concat(customShader.fragment, customShader.mainFunc),
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        renderer.setSize(width, height)
        material.uniforms.iResolution.value.set(width, height)
      }
    })
    resizeObserver.observe(container) // fps limit
    let clock = new THREE.Clock()
    let delta = 0
    let interval = 1 / limitFPS
    const animate = (time) => {
      delta += clock.getDelta()
      material.uniforms.iTime.value = time * 0.001 * speed
      if (delta > interval) {
        renderer.render(scene, camera)
        delta = delta % interval
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
    return () => {
      while (scene.children.length > 0) {
        scene.remove(scene.children[0])
        renderer.forceContextLoss()
        resizeObserver.disconnect()
        renderer.dispose()
        container.removeChild(renderer.domElement)
      }
    }
  }, [shaderChoose, customShader, selectShader, speed, limitFPS])
  return /*#__PURE__*/ _jsx("div", {
    ref: containerRef,
    style: { width: "100%", height: "100%", overflow: "hidden" },
  })
}
Webgl_Shader_Component.displayName = "Shaders"
addPropertyControls(Webgl_Shader_Component, {
  shaderChoose: {
    type: ControlType.Enum,
    title: "Choose",
    options: ["List", "Custom"],
    defaultValue: "List",
    displaySegmentedControl: true,
  },
  selectShader: {
    type: ControlType.Enum,
    title: " ",
    options: fragmentShadersTitle(),
    defaultValue: "2D Clouds",
    description: `Totally *${fragmentShaderSource.length}* Shaders from [Shadertoy](https://www.shadertoy.com/). Free to use.`,
    hidden: (props) => props.shaderChoose != "List",
  },
  customShader: {
    type: ControlType.Object,
    title: " ",
    controls: {
      title: { type: ControlType.String, title: "Title", defaultValue: fragmentShaderSource[2].title },
      inputs: { type: ControlType.String, title: "Inputs", defaultValue: shaderInputs },
      vertex: { type: ControlType.String, title: "Vertex", defaultValue: vertexShaderSource },
      fragment: { type: ControlType.String, title: "Fragment", defaultValue: fragmentShaderSource[2].value },
      mainFunc: { type: ControlType.String, title: "Main Funtion", defaultValue: mainFunction },
    },
    hidden: (props) => props.shaderChoose != "Custom",
  },
  speed: {
    type: ControlType.Number,
    defaultValue: 1,
    min: 0.1,
    max: 10,
    step: 0.1,
    title: "Speed",
    unit: "s",
  },
  limitFPS: {
    type: ControlType.Enum,
    title: "FPS Limit",
    options: [30, 60, 120, 160],
    defaultValue: 120,
    displaySegmentedControl: true,
    description: "Limit FPS if there is any performance issue",
  },
})
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Webgl_Shader_Component",
      slots: [],
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Webgl_Shader_Component.map
