// Source: https://framerusercontent.com/modules/PD45CKLPmnsDx8y5gGgT/Nn6dIF9RD5PLwDmFlmRh/Text_Opacity_Letters.js
// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime"
import { addPropertyControls, ControlType } from "framer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
const EachCharacter = ({ char, start, end, progress }) => {
  const opacityProgress = useTransform(progress, [start, end], [0.1, 1]) //you can change the start opacity (0.1) to change the benhind text
  return /*#__PURE__*/ _jsx(motion.span, { style: { opacity: opacityProgress }, children: char })
}
const EachWord = ({ word, progress, starting, ending }) => {
  const characters = word.split("")
  const wordLength = word.length
  const amount = ending - starting
  const step = amount / wordLength
  return /*#__PURE__*/ _jsxs(motion.span, {
    children: [
      characters.map((char, idx) => {
        const charStart = starting + step * idx
        const charEnd = starting + step * (idx + 1)
        return /*#__PURE__*/ _jsx(EachCharacter, {
          char: char,
          start: charStart,
          end: charEnd,
          progress: progress,
        })
      }),
      "\xa0",
    ],
  })
}
/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */ export default function Text_Opacity_Letters(props) {
  const text = props.text
  const words = text.split(" ")
  const totalWords = words.length
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "start 0.15"] })
  return /*#__PURE__*/ _jsx("p", {
    ref: ref,
    style: { ...props.font, display: "flex", flexWrap: "wrap", color: props.textColor },
    children: words.map((word, idx) => {
      const starting = idx / totalWords
      const ending = (idx + 1) / totalWords
      return /*#__PURE__*/ _jsx(EachWord, {
        word: word,
        progress: scrollYProgress,
        starting: starting,
        ending: ending,
      })
    }),
  })
}
addPropertyControls(Text_Opacity_Letters, {
  text: { title: "Text", type: ControlType.String, defaultValue: "Мы с 2020 года занимается" },
  font: { type: "font", controls: "extended" },
  textColor: { type: ControlType.Color },
})
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Text_Opacity_Letters",
      slots: [],
      annotations: {
        framerSupportedLayoutWidth: "any",
        framerSupportedLayoutHeight: "any",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Text_Opacity_Letters.map
