// Source: https://framerusercontent.com/modules/afBE9Yx1W6bY5q32qPxe/m3q7puE2tbo1S2C0s0CT/useRenderTarget.js
import { useMemo } from "react"
import { RenderTarget } from "framer"
export function useRenderTarget() {
  const currentRenderTarget = useMemo(() => RenderTarget.current(), [])
  return currentRenderTarget
}
export function useIsInPreview() {
  const inPreview = useMemo(() => RenderTarget.current() === RenderTarget.preview, [])
  return inPreview
}
export function useIsOnCanvas() {
  const onCanvas = useMemo(() => RenderTarget.current() === RenderTarget.canvas, [])
  return onCanvas
}

export const __FramerMetadata__ = {
  exports: {
    useIsInPreview: { type: "function", annotations: { framerContractVersion: "1" } },
    useRenderTarget: { type: "function", annotations: { framerContractVersion: "1" } },
    useIsOnCanvas: { type: "function", annotations: { framerContractVersion: "1" } },
  },
}
//# sourceMappingURL=./useRenderTarget.map
