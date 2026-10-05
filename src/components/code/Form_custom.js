// Source: https://framerusercontent.com/modules/rjpjx0kt9m6UHKQ6jf1a/oLlBMtwNbJiOr12ygVBZ/Form_custom.js
// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime" /**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth 100%
 * @framerSupportedLayoutHeight 100%
 */ // Подключение шрифтов
const fontLink = document.createElement("link")
fontLink.href = "https://fonts.googleapis.com/css2?family=Helvetica+Neue&display=swap"
fontLink.rel = "stylesheet"
document.head.appendChild(fontLink)
export default function Form_custom(props) {
  // This is a React component containing an Example component
  // - Replace <Example /> with your own code
  // - Find inspiration: https://www.framer.com/developers/
  return /*#__PURE__*/ _jsxs("form", {
    action: "https://submit-form.com/lnkRsPeDj",
    style: {
      fontFamily: "Helvetica Neue, sans-serif",
      fontWeight: "500",
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      fontSize: "120%",
      color: "black",
      padding: "0px",
      backgroundColor: "none",
      borderRadius: "8px",
    },
    children: [
      /*#__PURE__*/ _jsx("input", {
        type: "hidden",
        name: "_redirect",
        value: "https://www.nextupmedia.ru/submit-success",
      }),
      /*#__PURE__*/ _jsx("label", { for: "name", style: { marginBottom: "8px" } }),
      /*#__PURE__*/ _jsx("input", {
        type: "text",
        id: "name",
        name: "Имя",
        placeholder: "Ваше имя",
        required: true,
        style: {
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: "500",
          letterSpacing: "-0.07em",
          fontSize: "120%",
          width: "100%",
          color: "#999999",
          padding: "16px",
          marginBottom: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
        },
      }),
      /*#__PURE__*/ _jsx("label", { for: "email", style: { marginBottom: "8px" } }),
      /*#__PURE__*/ _jsx("input", {
        type: "text",
        id: "email",
        name: "Email",
        placeholder: "Email",
        required: true,
        style: {
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: "500",
          letterSpacing: "-0.07em",
          fontSize: "120%",
          width: "100%",
          color: "#999999",
          padding: "16px",
          marginBottom: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
        },
      }),
      /*#__PURE__*/ _jsx("label", { for: "phonenumber", style: { marginBottom: "8px" } }),
      /*#__PURE__*/ _jsx("input", {
        type: "text",
        id: "number",
        name: "Phone",
        placeholder: "Ваш номер",
        required: true,
        style: {
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: "500",
          letterSpacing: "-0.07em",
          fontSize: "120%",
          width: "100%",
          color: "#999999",
          padding: "16px",
          marginBottom: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
        },
      }),
      /*#__PURE__*/ _jsx("label", { for: "name", style: { marginBottom: "8px" } }),
      /*#__PURE__*/ _jsx("input", {
        type: "text",
        id: "brand",
        name: "Brand",
        placeholder: "Бренд",
        required: true,
        style: {
          fontFamily: "Helvetica Neue, sans-serif",
          fontWeight: "500",
          letterSpacing: "-0.07em",
          fontSize: "120%",
          width: "100%",
          color: "#999999",
          padding: "16px",
          marginBottom: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
        },
      }),
      /*#__PURE__*/ _jsxs("label", {
        style: { marginBottom: "12px", color: "white", fontSize: "14px" },
        children: [
          /*#__PURE__*/ _jsx("input", {
            type: "checkbox",
            required: true,
            style: { marginRight: "8px", width: "14px", height: "14px" },
          }),
          "я соглашаюсь на обработку своих персональных данных",
        ],
      }),
      /*#__PURE__*/ _jsx("input", {
        type: "submit",
        value: "отправить заявку",
        style: {
          fontSize: "100%",
          fontFamily: "Helvetica Neue, sans-serif",
          width: "100%",
          padding: "16px",
          backgroundColor: "#2188FF",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        },
      }),
    ],
  })
} // Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
}
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Form_custom",
      slots: [],
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./Form_custom.map
