// Source: https://framerusercontent.com/modules/yYpqgnRY2EooCVmSeFoJ/bbAsKSFvwTjCw5pqcB2p/Scroll_to_top.js
import { jsx as _jsx } from "react/jsx-runtime"
export const scrollToTopOnClick = (Component) => {
  return (props) => {
    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    return /*#__PURE__*/ _jsx(Component, { ...props, onClick: handleClick })
  }
}
export const __FramerMetadata__ = {
  exports: {
    scrollToTopOnClick: {
      type: "reactHoc",
      name: "scrollToTopOnClick",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Scroll_to_top.map
