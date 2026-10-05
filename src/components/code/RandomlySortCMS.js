// Source: https://framerusercontent.com/modules/GdkEVEYRrAoDPvE3hYyf/qra2FpiMFGquca44DJQT/RandomlySortCMS.js
// Apply this code override to the "Collection List" and it will randomly re-order your "Post" containers
// Modified from the following override:
// https://gist.github.com/tswic-highdesert/23e82bdc9f1bc7fa5ef48c1cac0656e2
import { jsx as _jsx } from "react/jsx-runtime"
import { useEffect, useRef } from "react"
export const withShuffledItems = (Component) => {
  const ShuffledComponent = (props) => {
    const componentRef = useRef(null)
    const shuffleAndDisplayItems = () => {
      const container = componentRef.current
      if (!container) return // get child nodes of our collection
      let items = Array.from(container.children) // Shuffle the array
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[items[i], items[j]] = [items[j], items[i]]
      } // Re-append items to the container to reflect the new order in the DOM
      items.forEach((item) => {
        // Move item to the end of the container, effectively reordering them
        container.appendChild(item)
      })
    }
    useEffect(() => {
      shuffleAndDisplayItems() // Shuffle and display items on component mount
    }, []) // Empty dependency array ensures this runs once after the initial render
    return /*#__PURE__*/ _jsx(Component, { ref: componentRef, ...props })
  }
  return ShuffledComponent
}
export const __FramerMetadata__ = {
  exports: {
    withShuffledItems: {
      type: "reactHoc",
      name: "withShuffledItems",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./RandomlySortCMS.map
