// Source: https://framerusercontent.com/modules/SWiJaypnxhWLsRxg216W/cJ2MVJsHYUqeipYQSPNx/Navigation.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime"
import { addPropertyControls, ControlType } from "framer"
import { cloneElement } from "react"
import { borderPropertyControl, Border } from "./Shared.js"
/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 40
 * @framerIntrinsicHeight 40
 */ export default function Navigation(props) {
  function navigate() {
    if (window) {
      if (props.mode == "back") {
        window.history.back()
      } else {
        window.history.forward()
      }
    }
  }
  if (props.buttonType == "custom") {
    var _props_custom, _props_style, _props_style1
    let layer =
      (_props_custom = props.custom) === null || _props_custom === void 0 ? void 0 : _props_custom[0]
    if (
      layer &&
      (((_props_style = props.style) === null || _props_style === void 0 ? void 0 : _props_style.width) ||
        ((_props_style1 = props.style) === null || _props_style1 === void 0 ? void 0 : _props_style1.height))
    ) {
      layer = /*#__PURE__*/ cloneElement(layer, { style: { ...layer.props.style, ...props.style } })
    }
    return /*#__PURE__*/ _jsx("div", { onClick: navigate, style: props.style, children: layer })
  }
  return /*#__PURE__*/ _jsxs("div", {
    style: {
      width: props.buttonWidth,
      height: props.buttonHeight,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: props.fill,
      boxSizing: "border-box",
      boxShadow: props.shadows,
      position: "relative",
      borderRadius: props.radiusIsMixed
        ? `${props.topLeft}px ${props.topRight}px ${props.bottomRight}px ${props.bottomLeft}px`
        : `${props.radius}px`,
      ...props.style,
    },
    onClick: navigate,
    children: [
      /*#__PURE__*/ _jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: props.icon.stroke,
        stroke: props.icon.color,
        style: { width: props.icon.size, height: props.icon.size },
        children: /*#__PURE__*/ _jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: props.mode == "back" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5",
        }),
      }),
      /*#__PURE__*/ _jsx(Border, { ...props.border }),
    ],
  })
}
addPropertyControls(Navigation, {
  mode: {
    type: ControlType.Enum,
    defaultValue: "back",
    options: ["back", "forward"],
    optionTitles: ["Back", "Forward"],
    displaySegmentedControl: true,
    description: "*Note:* Does not work in preview",
  },
  buttonType: {
    type: ControlType.Enum,
    defaultValue: "default",
    options: ["default", "custom"],
    optionTitles: ["Default", "Custom"],
    displaySegmentedControl: true,
    title: "Button",
  },
  custom: {
    type: ControlType.ComponentInstance,
    title: "Custom",
    description: "Use a custom button layer.",
    hidden(props) {
      return props.buttonType !== "custom"
    },
  },
  fill: {
    type: ControlType.Color,
    defaultValue: "#EDEDED",
    optional: true,
    hidden(props) {
      return props.buttonType !== "default"
    },
  },
  icon: {
    type: ControlType.Object,
    controls: {
      color: { type: ControlType.Color, defaultValue: "black" },
      size: { type: ControlType.Number, defaultValue: 24, min: 1 },
      stroke: { type: ControlType.Number, defaultValue: 2, min: 1, max: 10, step: 0.1 },
    },
    hidden(props) {
      return props.buttonType !== "default"
    },
  },
  radius: {
    type: ControlType.FusedNumber,
    defaultValue: 20,
    toggleKey: "radiusIsMixed",
    toggleTitles: ["All", "Individual"],
    valueKeys: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
    valueLabels: ["TL", "TR", "BR", "BL"],
    min: 0,
    hidden(props) {
      return props.buttonType !== "default"
    },
  },
  border: borderPropertyControl((props) => props.buttonType != "default"),
  shadows: { type: ControlType.BoxShadow, hidden: (props) => props.buttonType != "default" },
})
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Navigation",
      slots: [],
      annotations: {
        framerContractVersion: "1",
        framerIntrinsicHeight: "40",
        framerSupportedLayoutWidth: "any-prefer-fixed",
        framerIntrinsicWidth: "40",
        framerSupportedLayoutHeight: "any-prefer-fixed",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Navigation.map
