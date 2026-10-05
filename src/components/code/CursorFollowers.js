// Source: https://framerusercontent.com/modules/mG9DfzzkJdFfaHm8NREr/xqWRYoo0Q7shUpYLlSfI/CursorFollowers.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime"
import { useState, useRef } from "react"
import { motion } from "framer-motion" //
// FROM: https://codesandbox.io/s/2b4sd
//
const css = {
  box: { width: "100%", height: "100%", position: "relative", backgroundColor: "transparent" },
  fly: {
    position: "absolute",
    width: "32px",
    height: "32px",
    margin: "-16px",
    borderRadius: 10,
    filter: "blur(12px)",
    backgroundColor: "black",
  },
}
function getRelativeCoordinates(event, referenceElement) {
  const position = { x: event.pageX, y: event.pageY }
  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
    width: referenceElement.clientWidth,
    height: referenceElement.clientHeight,
  }
  let reference = referenceElement.offsetParent
  while (reference) {
    offset.left += reference.offsetLeft
    offset.top += reference.offsetTop
    reference = reference.offsetParent
  }
  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
    width: offset.width,
    height: offset.height,
    centerX: (position.x - offset.left - offset.width / 2) / (offset.width / 2),
    centerY: (position.y - offset.top - offset.height / 2) / (offset.height / 2),
  }
}
let windowHeight,
  windowWidth = 0
if (window) {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
}
export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({})
  const boxRef = useRef()
  const handleMouseMove = (e) => {
    setMousePosition(getRelativeCoordinates(e, boxRef.current))
  }
  return /*#__PURE__*/ _jsxs(motion.div, {
    ref: boxRef,
    style: { ...css.box, perspective: 600 },
    onMouseMove: (e) => handleMouseMove(e),
    animate: { rotateX: mousePosition.centerX * 20, rotateY: mousePosition.centerY * 20 },
    children: [
      /*#__PURE__*/ _jsx(motion.div, {
        style: { ...css.fly, height: 20, width: 20, filter: "blur(8px)" },
        initial: { x: windowWidth / 2, y: windowHeight / 2 },
        animate: { x: mousePosition.x, y: mousePosition.y },
        transition: { type: "spring" },
      }),
      /*#__PURE__*/ _jsx(motion.div, {
        style: { ...css.fly },
        initial: { x: windowWidth / 2, y: windowHeight / 2 },
        animate: { x: mousePosition.x, y: mousePosition.y },
        transition: { duration: 0 },
      }),
    ],
  })
}
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "CursorFollower",
      slots: [],
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./CursorFollowers.map
