// Source: https://framerusercontent.com/modules/cKGD16u2MGB7MfqfVXFp/wiztTCbXokZrMicHAmZc/Grain.js
import { jsx as _jsx } from "react/jsx-runtime"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion } from "framer-motion"
import { steps } from "@motionone/easing"
/**
 * @framerIntrinsicWidth 100
 * @framerIntrinsicHeight 100
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */ export default function Grain(props) {
  const { opacity, style } = props
  const keyframesX = ["0%", "-5%", "-15%", "7%", "-5%", "-15%", "15%", "0%", "3%", "-10%"]
  const keyframesY = ["0%", "-10%", "5%", "-25%", "25%", "10%", "0%", "15%", "35%", "10%"]
  const isCanvas = RenderTarget.current() === RenderTarget.canvas
  return /*#__PURE__*/ _jsx("div", {
    style: { width: "100%", height: "100%", position: "relative", overflow: "hidden" },
    children: /*#__PURE__*/ _jsx(motion.div, {
      style: {
        ...containerStyle,
        opacity: opacity,
        inset: isCanvas ? 0 : "-200%",
        width: isCanvas ? "100%" : "400%",
        height: isCanvas ? "100%" : "400%",
        position: "absolute",
      },
      animate: !isCanvas && { x: keyframesX, y: keyframesY },
      transition: { ease: steps(10, "start"), repeat: Infinity, duration: 8 },
    }),
  })
}
Grain.defaultProps = { opacity: 0.5 }
addPropertyControls(Grain, {
  opacity: { title: "Opacity", type: ControlType.Number, step: 0.1, displayStepper: true, max: 1, min: 0 },
})
const containerStyle = {
  backgroundSize: "256px 256px",
  backgroundRepeat: "repeat",
  background: "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
}
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Grain",
      slots: [],
      annotations: {
        framerSupportedLayoutHeight: "fixed",
        framerIntrinsicHeight: "100",
        framerContractVersion: "1",
        framerDisableUnlink: "*",
        framerIntrinsicWidth: "100",
        framerSupportedLayoutWidth: "fixed",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Grain.map
