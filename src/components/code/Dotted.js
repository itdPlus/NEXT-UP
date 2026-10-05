// Source: https://framerusercontent.com/modules/hdnyGX3jdvFnOBhsKF4Q/HLQ97r0fkWsAu6okJLar/Dotted.js
import { jsx as _jsx } from "react/jsx-runtime"
export function dotBackground(Component) {
  return (props) => {
    return /*#__PURE__*/ _jsx(Component, {
      ...props,
      style: {
        backgroundColor: "transparent",
        backgroundImage: "radial-gradient(rgba(0,0,0,0) 1px,#000000 1px)",
        backgroundSize: "5px 5px",
      },
    })
  }
}
export const __FramerMetadata__ = {
  exports: {
    dotBackground: { type: "reactHoc", name: "dotBackground", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Dotted.map
