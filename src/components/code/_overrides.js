// Source: https://framerusercontent.com/modules/nd3l3l2huSE3GAbHx3LM/aP2XExVFBKADBZvCTG0z/_overrides.js
import { jsx as _jsx } from "react/jsx-runtime"
export function gradientAnimation(Component) {
  return (props) => {
    return /*#__PURE__*/ _jsx(Component, {
      ...props,
      initial: { background: `linear-gradient(200deg, #000000 100%, hsl(0, 0%, 0%) 100%)` },
      animate: { background: `linear-gradient(148deg, #000000 0%, hsl(269, 47%, 74%) 100%)` },
      transition: { ease: "easeInOut", duration: 2.3, delay: 0.5 },
    })
  }
}
export function withCopy(Component) {
  return (props) => {
    return /*#__PURE__*/ _jsx(Component, {
      ...props,
      onClick: () => {
        navigator.clipboard.writeText("https://framer.com/m/Liquid-Effect-lwNl.js")
      },
    })
  }
}
export const __FramerMetadata__ = {
  exports: {
    withCopy: { type: "reactHoc", name: "withCopy", annotations: { framerContractVersion: "1" } },
    gradientAnimation: {
      type: "reactHoc",
      name: "gradientAnimation",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./_overrides.map
