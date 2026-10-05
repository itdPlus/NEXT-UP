// Source: https://framerusercontent.com/modules/eMKhCZD3fNcnyMeFYWzI/j6fKhsuRJTVXVYZhRlC0/Limit_text.js
import { jsx as _jsx } from "react/jsx-runtime"
const truncatedTextPrefix = "Lines:" // Prefix the layer name with this to set the line limit
export function TruncatedText(Component) {
  return (props) => {
    const name = props["data-framer-name"]
    if (name === null || name === void 0 ? void 0 : name.startsWith(truncatedTextPrefix)) {
      const lines = name.replace(new RegExp("^" + truncatedTextPrefix), "").trim()
      return /*#__PURE__*/ _jsx(Component, {
        ...props,
        style: {
          ...props.style,
          display: "-webkit-box",
          WebkitLineClamp: lines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      })
    }
    return /*#__PURE__*/ _jsx(Component, { ...props })
  }
}
export const __FramerMetadata__ = {
  exports: {
    TruncatedText: { type: "reactHoc", name: "TruncatedText", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Limit_text.map
