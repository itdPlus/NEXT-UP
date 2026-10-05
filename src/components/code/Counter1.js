// Source: https://framerusercontent.com/modules/DnC8wC4RojxG3jA7KMGH/aY7IBjNV7DifbZfE9Tug/Counter1.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
const CounterStyles = { container: { display: "flex", justifyContent: "center", alignItems: "center" } }
export function Counter(props) {
  const {
    start,
    end,
    speed,
    gapSize,
    prefixText,
    suffixText,
    prefixFont,
    suffixFont,
    prefixColor,
    suffixColor,
    loop,
    decimalSeparatorType,
    textSize,
    selectedFont,
    textColor,
    startOnViewport,
    restartOnViewport,
  } = props
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      setIsVisible(entry.isIntersecting)
    })
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])
  useEffect(() => {
    const updateCount = () => {
      if (count < end) {
        setCount((prevCount) => prevCount + 1)
      } else if (loop) {
        setCount(start)
      }
    }
    if (isVisible || (!startOnViewport && start !== end)) {
      const intervalId = setInterval(updateCount, speed)
      return () => {
        clearInterval(intervalId)
      }
    } else if (startOnViewport && isVisible) {
      setCount(start)
    }
  }, [count, start, end, loop, isVisible, speed, startOnViewport])
  useEffect(() => {
    if (restartOnViewport && isVisible) {
      setCount(start) // Restart the animation when re-entering the viewport
    }
  }, [isVisible, restartOnViewport, start])
  const formatNumber = (number) => {
    if (decimalSeparatorType === "comma") {
      return number.toLocaleString("en-US")
    } else if (decimalSeparatorType === "period") {
      return number.toLocaleString("en-US").replace(/,/g, ".")
    } else {
      return number.toFixed(0)
    }
  }
  return /*#__PURE__*/ _jsxs(motion.div, {
    ref: containerRef,
    style: {
      ...CounterStyles.container,
      gap: `${gapSize}px`,
      flexDirection: "row",
      alignItems: "center",
      fontSize: `${textSize}px`,
      fontFamily: selectedFont.fontFamily,
      fontWeight: selectedFont.fontWeight,
      color: textColor,
    },
    children: [
      /*#__PURE__*/ _jsx("span", {
        style: { fontFamily: prefixFont.fontFamily, fontWeight: prefixFont.fontWeight, color: prefixColor },
        children: prefixText,
      }),
      /*#__PURE__*/ _jsx("span", { children: formatNumber(count) }),
      /*#__PURE__*/ _jsx("span", {
        style: { fontFamily: suffixFont.fontFamily, fontWeight: suffixFont.fontWeight, color: suffixColor },
        children: suffixText,
      }),
    ],
  })
}
Counter.defaultProps = {
  start: 0,
  end: 100,
  speed: 100,
  prefixText: "",
  suffixText: "",
  loop: false,
  decimalSeparatorType: "comma",
  textSize: 36,
  selectedFont: { fontFamily: "Inter", fontWeight: 500, systemFont: true },
  textColor: "#D3D3D3",
  startOnViewport: false,
}
addPropertyControls(Counter, {
  startOnViewport: {
    type: ControlType.Boolean,
    title: "Viewport",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  restartOnViewport: {
    type: ControlType.Boolean,
    title: "Replay",
    defaultValue: false,
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  selectedFont: {
    title: "Font",
    type: ControlType.Font,
    defaultValue: { fontFamily: "Inter", fontWeight: 500, systemFont: true },
  },
  textSize: { title: "Font Size", type: ControlType.Number, min: 8, max: 240, step: 1 },
  textColor: { type: ControlType.Color, title: "Font Color" },
  start: { type: ControlType.Number, title: "Start Number", defaultValue: 0, displayStepper: true },
  end: { type: ControlType.Number, title: "End Number", defaultValue: 10, displayStepper: true },
  decimalSeparatorType: {
    type: ControlType.Enum,
    title: "Separator",
    defaultValue: "comma",
    options: ["comma", "period", "none"],
    optionTitles: ["Comma (1,000)", "Decimal (1.000)", "None"],
  },
  prefixText: { type: ControlType.String, title: "Prefix", defaultValue: "" },
  prefixFont: {
    title: "Prefix Font",
    type: ControlType.Font,
    defaultValue: { fontFamily: "Inter", fontWeight: 500, systemFont: true },
  },
  prefixColor: { type: ControlType.Color, title: "Prefix Color" },
  suffixText: { type: ControlType.String, title: "Suffix", defaultValue: "" },
  suffixFont: {
    title: "Suffix Font",
    type: ControlType.Font,
    defaultValue: { fontFamily: "Inter", fontWeight: 500, systemFont: true },
  },
  suffixColor: { type: ControlType.Color, title: "Suffix Color" },
  gapSize: { type: ControlType.Number, title: "Gap Size", defaultValue: 4, min: 0, max: 100, step: 4 },
  speed: { type: ControlType.Number, title: "Speed (ms)", defaultValue: 100, min: 0, max: 2e3, step: 10 },
  loop: {
    type: ControlType.Boolean,
    title: "Loop Animation",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
    description: "[Built by Asif Kabir](https://www.youtube.com/channel/UCujbStV-Rp-QGfiHOKA9AvA)",
  },
})
export const __FramerMetadata__ = {
  exports: {
    Counter: {
      type: "reactComponent",
      name: "Counter",
      slots: [],
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Counter1.map
