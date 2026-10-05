// Source: https://framerusercontent.com/modules/7LWPKvSUAOj1RXUxlP0s/OwWtLuSaGUdjIwZiGL3V/aUyUqIJXs-0.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime"
import * as React from "react"
export const v0 = "Realm"
export const v1 =
  "\nuniform float iTime;\nuniform vec3 iResolution;\nvarying vec2 vUv;\nuniform float iTimeDelta;\nuniform vec4 iMouse;\nuniform sampler2D iChannel0;\n"
export const v2 =
  "\nvarying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    gl_Position = vec4(position, 1.0);\n}\n"
export const v3 =
  "\n  \nvec3 palette( float t ) {\n    vec3 a = vec3(0.5, 0.5, 0.5);\n    vec3 b = vec3(0.5, 0.5, 0.5);\n    vec3 c = vec3(1.0, 1.0, 1.0);\n    vec3 d = vec3(0.263,0.416,0.557);\n\n    return a + b*cos( 6.28318*(c*t+d) );\n}\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord ) {\n    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;\n    vec2 uv0 = uv;\n    vec3 finalColor = vec3(0.0);\n    for (float i = 0.0; i < 4.0; i++) {\n        uv = fract(uv * 1.5) - 0.5;\n        float d = length(uv) * exp(-length(uv0));\n        vec3 col = palette(length(uv0) + i*.4 + iTime*.4);\n        d = sin(d*8. + iTime)/8.;\n        d = abs(d);\n        d = pow(0.01 / d, 1.2);\n        finalColor += col * d;\n    }\n    fragColor = vec4(finalColor, 1.0);\n}\n"
export const v4 = "\nvoid main() {\n    mainImage(gl_FragColor, vUv * iResolution.xy);\n}\n"
export const v5 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgTWVkaXVt",
      "--framer-font-family": '"HelveticaNeueCyr Medium", "HelveticaNeueCyr Medium Placeholder", sans-serif',
      "--framer-font-size": "160px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "100%",
      "--framer-text-alignment": "right",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "we",
  }),
})
export const v6 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgQm9sZA==",
      "--framer-font-family": '"HelveticaNeueCyr Bold", "HelveticaNeueCyr Bold Placeholder", sans-serif',
      "--framer-font-size": "213px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "100%",
      "--framer-text-alignment": "right",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "*",
  }),
})
export const v7 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgUm9tYW4=",
      "--framer-font-family": '"HelveticaNeueCyr Roman", "HelveticaNeueCyr Roman Placeholder", sans-serif',
      "--framer-font-size": "160px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "100%",
      "--framer-text-alignment": "left",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "are",
  }),
})
export const v8 = /*#__PURE__*/ _jsxs(React.Fragment, {
  children: [
    /*#__PURE__*/ _jsx("p", {
      dir: "auto",
      style: {
        "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgUm9tYW4=",
        "--framer-font-family": '"HelveticaNeueCyr Roman", "HelveticaNeueCyr Roman Placeholder", sans-serif',
        "--framer-font-size": "24px",
        "--framer-text-color": "rgb(255, 255, 255)",
        "--framer-text-transform": "uppercase",
      },
      children: "Step By Step ",
    }),
    /*#__PURE__*/ _jsx("p", {
      dir: "auto",
      style: {
        "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgUm9tYW4=",
        "--framer-font-family": '"HelveticaNeueCyr Roman", "HelveticaNeueCyr Roman Placeholder", sans-serif',
        "--framer-font-size": "24px",
        "--framer-text-color": "rgb(255, 255, 255)",
        "--framer-text-transform": "uppercase",
      },
      children: "to NextUp",
    }),
  ],
})
export const v9 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgQm9sZA==",
      "--framer-font-family": '"HelveticaNeueCyr Bold", "HelveticaNeueCyr Bold Placeholder", sans-serif',
      "--framer-font-size": "160px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "1.17em",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "next up",
  }),
})
export const v10 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgQm9sZA==",
      "--framer-font-family": '"HelveticaNeueCyr Bold", "HelveticaNeueCyr Bold Placeholder", sans-serif',
      "--framer-font-size": "133px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "1em",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "next up",
  }),
})
export const v11 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgQm9sZA==",
      "--framer-font-family": '"HelveticaNeueCyr Bold", "HelveticaNeueCyr Bold Placeholder", sans-serif',
      "--framer-font-size": "96px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "1em",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "next up",
  }),
})
export const v12 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgUm9tYW4=",
      "--framer-font-family": '"HelveticaNeueCyr Roman", "HelveticaNeueCyr Roman Placeholder", sans-serif',
      "--framer-font-size": "160px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "1.17em",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "music",
  }),
})
export const v13 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgUm9tYW4=",
      "--framer-font-family": '"HelveticaNeueCyr Roman", "HelveticaNeueCyr Roman Placeholder", sans-serif',
      "--framer-font-size": "130px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "1em",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "music",
  }),
})
export const v14 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgUm9tYW4=",
      "--framer-font-family": '"HelveticaNeueCyr Roman", "HelveticaNeueCyr Roman Placeholder", sans-serif',
      "--framer-font-size": "73px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "1em",
      "--framer-text-color": "rgb(255, 255, 255)",
      "--framer-text-transform": "inherit",
    },
    children: "music",
  }),
})
export const v15 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgTWVkaXVt",
      "--framer-font-family": '"HelveticaNeueCyr Medium", "HelveticaNeueCyr Medium Placeholder", sans-serif',
      "--framer-font-size": "72px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-text-color": "var(--token-f92a0477-0163-463c-b8d2-581e7fa888a7, rgb(255, 255, 255))",
    },
    children: "Our Services",
  }),
})
export const v16 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgTWVkaXVt",
      "--framer-font-family": '"HelveticaNeueCyr Medium", "HelveticaNeueCyr Medium Placeholder", sans-serif',
      "--framer-font-size": "60px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-text-color": "var(--token-f92a0477-0163-463c-b8d2-581e7fa888a7, rgb(255, 255, 255))",
    },
    children: "Our Services",
  }),
})
export const v17 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("h2", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgTWVkaXVt",
      "--framer-font-family": '"HelveticaNeueCyr Medium", "HelveticaNeueCyr Medium Placeholder", sans-serif',
      "--framer-font-size": "48px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-text-color": "var(--token-f92a0477-0163-463c-b8d2-581e7fa888a7, rgb(255, 255, 255))",
    },
    children: "Our Services",
  }),
})
export const v18 = "Content distribution"
export const v19 = "01"
export const v20 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    dir: "auto",
    children:
      "Promotion of your music on all key digital platforms, ensuring wide reach and maximum accessibility for your audience",
  }),
})
export const v21 = "Organization of concerts"
export const v22 = "02"
export const v23 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    dir: "auto",
    children:
      "Planning and organizing concerts that leave unforgettable impressions, attract fans' attention, and strengthen your brand",
  }),
})
export const v24 = "Merch creation"
export const v25 = "03"
export const v26 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    dir: "auto",
    children:
      "Development of unique and stylish merch that will help you strengthen your connection with fans and increase your brand awareness",
  }),
})
export const v27 = "Media Relations"
export const v28 = "04"
export const v29 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    dir: "auto",
    children: "Effective media engagement to raise awareness of your releases and achieve maximum reach",
  }),
})
export const v30 = "Marketing Support"
export const v31 = "05"
export const v32 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    dir: "auto",
    children:
      "Comprehensive promotion of your brand aimed at increasing the fan base and achieving success in the industry",
  }),
})
export const v33 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgTWVkaXVt",
      "--framer-font-family": '"HelveticaNeueCyr Medium", "HelveticaNeueCyr Medium Placeholder", sans-serif',
      "--framer-font-size": "72px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "110%",
      "--framer-text-color": "rgb(255, 255, 255)",
    },
    children: "Our artists",
  }),
})
export const v34 = /*#__PURE__*/ _jsx(React.Fragment, {
  children: /*#__PURE__*/ _jsx("p", {
    style: {
      "--font-selector": "Q1VTVE9NO0hlbHZldGljYU5ldWVDeXIgTWVkaXVt",
      "--framer-font-family": '"HelveticaNeueCyr Medium", "HelveticaNeueCyr Medium Placeholder", sans-serif',
      "--framer-font-size": "38px",
      "--framer-letter-spacing": "-0.07em",
      "--framer-line-height": "110%",
      "--framer-text-color": "rgb(255, 255, 255)",
    },
    children: "Our artists",
  }),
})
export const __FramerMetadata__ = {
  exports: {
    v31: { type: "variable", annotations: { framerContractVersion: "1" } },
    v34: { type: "variable", annotations: { framerContractVersion: "1" } },
    v16: { type: "variable", annotations: { framerContractVersion: "1" } },
    v26: { type: "variable", annotations: { framerContractVersion: "1" } },
    v12: { type: "variable", annotations: { framerContractVersion: "1" } },
    v23: { type: "variable", annotations: { framerContractVersion: "1" } },
    v9: { type: "variable", annotations: { framerContractVersion: "1" } },
    v7: { type: "variable", annotations: { framerContractVersion: "1" } },
    v22: { type: "variable", annotations: { framerContractVersion: "1" } },
    v30: { type: "variable", annotations: { framerContractVersion: "1" } },
    v1: { type: "variable", annotations: { framerContractVersion: "1" } },
    v2: { type: "variable", annotations: { framerContractVersion: "1" } },
    v13: { type: "variable", annotations: { framerContractVersion: "1" } },
    v25: { type: "variable", annotations: { framerContractVersion: "1" } },
    v32: { type: "variable", annotations: { framerContractVersion: "1" } },
    v4: { type: "variable", annotations: { framerContractVersion: "1" } },
    v20: { type: "variable", annotations: { framerContractVersion: "1" } },
    v0: { type: "variable", annotations: { framerContractVersion: "1" } },
    v18: { type: "variable", annotations: { framerContractVersion: "1" } },
    v33: { type: "variable", annotations: { framerContractVersion: "1" } },
    v17: { type: "variable", annotations: { framerContractVersion: "1" } },
    v21: { type: "variable", annotations: { framerContractVersion: "1" } },
    v15: { type: "variable", annotations: { framerContractVersion: "1" } },
    v19: { type: "variable", annotations: { framerContractVersion: "1" } },
    v24: { type: "variable", annotations: { framerContractVersion: "1" } },
    v8: { type: "variable", annotations: { framerContractVersion: "1" } },
    v6: { type: "variable", annotations: { framerContractVersion: "1" } },
    v10: { type: "variable", annotations: { framerContractVersion: "1" } },
    v14: { type: "variable", annotations: { framerContractVersion: "1" } },
    v28: { type: "variable", annotations: { framerContractVersion: "1" } },
    v3: { type: "variable", annotations: { framerContractVersion: "1" } },
    v11: { type: "variable", annotations: { framerContractVersion: "1" } },
    v29: { type: "variable", annotations: { framerContractVersion: "1" } },
    v27: { type: "variable", annotations: { framerContractVersion: "1" } },
    v5: { type: "variable", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
}
