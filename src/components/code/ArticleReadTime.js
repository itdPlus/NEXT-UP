// Source: https://framerusercontent.com/modules/0kfjwig4zg0uw5I2iK1x/x47H5y0zdsGyavDExlWe/ArticleReadTime.js
import { jsx as _jsx } from "react/jsx-runtime"
import { addPropertyControls, ControlType } from "framer"
import readingTime from "reading-time"
function getTextContentArrayFromReactElement(element) {
  if (!element) {
    return []
  }
  if (typeof element === "string") {
    return [element]
  }
  if (Array.isArray(element)) {
    return element.flatMap(getTextContentArrayFromReactElement)
  }
  if (element.props && element.props.children) {
    const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children]
    return children.flatMap(getTextContentArrayFromReactElement)
  }
  return []
}
/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */ export default function ArticleReadTime(props) {
  let hasText = false
  let strings = []
  if (props.formatted) {
    strings = getTextContentArrayFromReactElement(props.formattedText)
    hasText = !props.formattedText || strings.length == 0 ? false : true
  } else {
    strings.push(props.plainText)
    hasText = props.plainText !== ""
  }
  let timeData = readingTime(strings.join(" "), { wordsPerMinute: props.wpm })
  return /*#__PURE__*/ _jsx("p", {
    style: {
      color: props.fontColor,
      userSelect: props.textSelect ? "auto" : "none",
      margin: 0,
      ...props.font,
    },
    children: hasText
      ? `${props.prefix}
            ${Math.max(Math.round(timeData.minutes), 1)}
            ${props.suffix}`
      : "No text content connected.",
  })
}
ArticleReadTime.displayName = "Article Read Time"
addPropertyControls(ArticleReadTime, {
  formatted: { type: ControlType.Boolean, defaultValue: true },
  formattedText: {
    type: ControlType.RichText,
    title: "Text",
    hidden(props) {
      return !props.formatted
    },
  },
  plainText: {
    type: ControlType.String,
    displayTextArea: true,
    title: "Text",
    hidden(props) {
      return props.formatted
    },
  },
  wpm: {
    type: ControlType.Number,
    defaultValue: 200,
    step: 1,
    min: 1,
    title: "WPM",
    description: "Words per minute",
  },
  fontColor: { type: ControlType.Color, defaultValue: "#000" },
  font: {
    type: "font",
    controls: "extended",
    defaultFontType: "sans-serif",
    defaultValue: { fontSize: 14, lineHeight: 1.4 },
  },
  prefix: { type: ControlType.String },
  suffix: { type: ControlType.String, defaultValue: " min read" },
  textSelect: { type: ControlType.Boolean, defaultValue: true },
})
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "ArticleReadTime",
      slots: [],
      annotations: {
        framerContractVersion: "1",
        framerSupportedLayoutHeight: "any",
        framerSupportedLayoutWidth: "any",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./ArticleReadTime.map
