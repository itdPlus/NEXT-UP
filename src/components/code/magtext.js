// Source: https://framerusercontent.com/modules/FCYp8FRx320SWq9QcLcn/qpET2t2Z0ryTCtBpcD2G/magtext.js
import { jsx as _jsx } from "react/jsx-runtime"
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  transform,
} from "framer-motion"
import { useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */ export default function MagText(props) {
  const mouseX = useMotionValue(0)
  return /*#__PURE__*/ _jsx("div", {
    style: {
      position: "relative",
      cursor: "default",
      whiteSpace: "pre",
      fontFamily: props.font.fontFamily,
      color: props.color,
      fontSize: props.font.fontSize,
      fontWeight: props.font.fontWeight,
      letterSpacing: props.font.letterSpacing,
      lineHeight: props.font.lineHeight,
    },
    onMouseLeave: () => {
      mouseX.set(Infinity)
    },
    onMouseMove: (e) => {
      mouseX.set(e.clientX)
    },
    children: props.text
      .split("")
      .map((c, idx) => /*#__PURE__*/ _jsx(Character, { c: c, mouseX: mouseX }, idx)),
  })
}
function Character({ c, mouseX }) {
  const ref = useRef(null)
  const scaleRange = [1, 1.2]
  const scaleX = useSpring(1, { stiffness: 350, damping: 40 })
  const w = useTransform(scaleX, scaleRange, [0, 0.07])
  const padding = useTransform(scaleX, scaleRange, [0, 0.05])
  const scaleY = useTransform(scaleX, scaleRange, [1, 0.95])
  useMotionValueEvent(mouseX, "change", (mx) => {
    if (ref.current) {
      const { left, width } = ref.current.getBoundingClientRect()
      const characterCenter = left + width / 2
      const distance = Math.abs(characterCenter - mx)
      scaleX.set(transform(distance, [70, 0], scaleRange))
    }
  })
  return /*#__PURE__*/ _jsx(motion.span, {
    ref: ref,
    style: {
      display: "inline-block",
      scaleX: scaleX,
      scaleY: scaleY,
      WebkitTextStrokeColor: "currentColor",
      WebkitTextStrokeWidth: useMotionTemplate`${w}em`,
      paddingInline: useMotionTemplate`${padding}em`,
    },
    children: c,
  })
}
MagText.displayName = "MagText"
MagText.defaultProps = { text: "Colorless green ideas sleep furiously", color: "black" }
addPropertyControls(MagText, {
  text: {
    type: ControlType.String,
    title: "Text",
    defaultValue: "Colorless green ideas sleep furiously",
    displayTextArea: true,
  },
  font: { title: "Font", type: "font", controls: "extended" },
  color: { type: ControlType.Color, defaultValue: "#000" },
})
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "MagText",
      slots: [],
      annotations: {
        framerContractVersion: "1",
        framerDisableUnlink: "* @framerSupportedLayoutWidth auto",
        framerSupportedLayoutHeight: "auto",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./magtext.map
