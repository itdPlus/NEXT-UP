import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      // Рантайм Framer — исходник из source map app.framerstatic.com (та же версия, что на живом сайте).
      // npm-пакет "framer" сильно старше и несовместим с этим сгенерированным кодом.
      { find: /^framer$/, replacement: r("./vendor/framer/framer.mjs") },
      // framer-motion должен быть тем же экземпляром, что внутри рантайма Framer (chunk-7KEO2DXG).
      { find: /^framer-motion$/, replacement: r("./vendor/framer/framer-motion.mjs") },
      // Основной вход reading-time тянет node:stream; браузерная часть — lib/reading-time.js
      { find: /^reading-time$/, replacement: "reading-time/lib/reading-time.js" },
    ],
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["reading-time/lib/reading-time.js"],
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 4096,
  },
})
