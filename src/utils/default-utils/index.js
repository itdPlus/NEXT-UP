// Source: https://framerusercontent.com/modules/G4IfyjvwmaeSBpdb4TWu/OIjZRBmWDcIE2B6qgG1j/index.js
import {
  defaultEvents,
  localeOptions,
  fontControls,
  fontSizeOptions,
  emptyStateStyle,
  containerStyles,
  fontStack,
} from "./constants.js"
import { useOnEnter, useOnExit } from "./useOnNavigationTargetChange.js"
import { useConstant } from "./useConstant.js"
import { colorTokentoValue, colorFromToken } from "./colorFromToken.js"
import { isMotionValue } from "./isMotionValue.js"
import { useUniqueClassName, randomID } from "./useUniqueClassName.js"
import { getVariantControls } from "./variantUtils.js"
import { useIsBrowserSafari } from "./isBrowser.js"
import { useMultiOnChange, useOnChange } from "./useOnChange.js"
import { mstoMinAndSec, secondsToMinutes } from "./time.js"
import { useAutoMotionValue } from "./useAutoMotionValue.js"
import { useFontControls } from "./useFontControls.js"
import { useRenderTarget, useIsInPreview, useIsOnCanvas } from "./useRenderTarget.js"
import { useControlledState } from "./useControlledState.js"
import { usePadding, useRadius, paddingControl, borderRadiusControl } from "./propUtils.js"
import { detectAutoSizingAxis } from "./detectAutoSizingAxis.js"
export {
  useOnEnter,
  useOnExit,
  defaultEvents,
  isMotionValue,
  colorFromToken,
  colorTokentoValue,
  localeOptions,
  fontControls,
  fontSizeOptions,
  emptyStateStyle,
  containerStyles,
  fontStack,
  useUniqueClassName,
  getVariantControls,
  useIsBrowserSafari,
  randomID,
  useConstant,
  useMultiOnChange,
  useOnChange,
  usePadding,
  useRadius,
  paddingControl,
  borderRadiusControl,
  mstoMinAndSec,
  useFontControls,
  secondsToMinutes,
  useAutoMotionValue,
  useRenderTarget,
  useIsInPreview,
  useControlledState,
  detectAutoSizingAxis,
  useIsOnCanvas,
}
export const __FramerMetadata__ = {
  exports: {
    useConstant: { type: "variable", annotations: { framerContractVersion: "1" } },
    isMotionValue: { type: "variable", annotations: { framerContractVersion: "1" } },
    fontControls: { type: "variable", annotations: { framerContractVersion: "1" } },
    defaultEvents: { type: "variable", annotations: { framerContractVersion: "1" } },
    useUniqueClassName: { type: "variable", annotations: { framerContractVersion: "1" } },
    useMultiOnChange: { type: "variable", annotations: { framerContractVersion: "1" } },
    useOnChange: { type: "variable", annotations: { framerContractVersion: "1" } },
    useIsOnCanvas: { type: "variable", annotations: { framerContractVersion: "1" } },
    useOnExit: { type: "variable", annotations: { framerContractVersion: "1" } },
    fontSizeOptions: { type: "variable", annotations: { framerContractVersion: "1" } },
    colorTokentoValue: { type: "variable", annotations: { framerContractVersion: "1" } },
    useRadius: { type: "variable", annotations: { framerContractVersion: "1" } },
    getVariantControls: { type: "variable", annotations: { framerContractVersion: "1" } },
    colorFromToken: { type: "variable", annotations: { framerContractVersion: "1" } },
    containerStyles: { type: "variable", annotations: { framerContractVersion: "1" } },
    usePadding: { type: "variable", annotations: { framerContractVersion: "1" } },
    fontStack: { type: "variable", annotations: { framerContractVersion: "1" } },
    useControlledState: { type: "variable", annotations: { framerContractVersion: "1" } },
    useFontControls: { type: "variable", annotations: { framerContractVersion: "1" } },
    useAutoMotionValue: { type: "variable", annotations: { framerContractVersion: "1" } },
    emptyStateStyle: { type: "variable", annotations: { framerContractVersion: "1" } },
    useIsInPreview: { type: "variable", annotations: { framerContractVersion: "1" } },
    useIsBrowserSafari: { type: "variable", annotations: { framerContractVersion: "1" } },
    detectAutoSizingAxis: { type: "variable", annotations: { framerContractVersion: "1" } },
    borderRadiusControl: { type: "variable", annotations: { framerContractVersion: "1" } },
    mstoMinAndSec: { type: "variable", annotations: { framerContractVersion: "1" } },
    randomID: { type: "variable", annotations: { framerContractVersion: "1" } },
    localeOptions: { type: "variable", annotations: { framerContractVersion: "1" } },
    useOnEnter: { type: "variable", annotations: { framerContractVersion: "1" } },
    secondsToMinutes: { type: "variable", annotations: { framerContractVersion: "1" } },
    useRenderTarget: { type: "variable", annotations: { framerContractVersion: "1" } },
    paddingControl: { type: "variable", annotations: { framerContractVersion: "1" } },
  },
}
