// Source: https://framerusercontent.com/modules/nBUV890nNDWGSDttgRla/zeOIzmGfbX6cRrbn9Qab/Magnetichover.js
import { jsx as _jsx } from "react/jsx-runtime"
import { useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react" // Code override provided by Eleveight Supply. All rights reserved 2024.
export function Followcursor({
  damping = 100,
  stiffness = 1e3,
  effectRange = 2,
  intensity = 5,
  actionableArea = 30,
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping, stiffness })
  const springY = useSpring(y, { damping, stiffness })
  const ref = useRef(null)
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!ref.current) return
      const element = ref.current
      const rect = element.getBoundingClientRect()
      const mouseX = event.clientX
      const mouseY = event.clientY
      const isWithinBounds =
        mouseX >= rect.left - actionableArea &&
        mouseX <= rect.right + actionableArea &&
        mouseY >= rect.top - actionableArea &&
        mouseY <= rect.bottom + actionableArea
      if (isWithinBounds) {
        const displacementX = mouseX - (rect.left + rect.width / 2)
        const displacementY = mouseY - (rect.top + rect.height / 2)
        const normalizedX = (displacementX / (rect.width / 2)) * effectRange * intensity
        const normalizedY = (displacementY / (rect.height / 2)) * effectRange * intensity
        x.set(normalizedX)
        y.set(normalizedY)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [effectRange, intensity, actionableArea, x, y, damping, stiffness])
  return { ref: ref, style: { x: springX, y: springY } }
}
import { useContext as __legacyOverrideHOC_useContext } from "react"
import { DataObserverContext as __legacyOverrideHOC_DataObserverContext } from "framer"
export function withFollowcursor(C) {
  return (props) => {
    __legacyOverrideHOC_useContext(__legacyOverrideHOC_DataObserverContext)
    return _jsx(C, { ...props, ...Followcursor(props) })
  }
}
withFollowcursor.displayName = "Followcursor"
export const __FramerMetadata__ = {
  exports: {
    Followcursor: { type: "override", name: "Followcursor", annotations: { framerContractVersion: "1" } },
    withFollowcursor: {
      type: "reactHoc",
      name: "withFollowcursor",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Magnetichover.map
