import { createContext, useContext } from "react";
import type { ZoomPanValue } from "./ZoomPanProvider";

export const defaultZoomPanValue: ZoomPanValue = {
  x: 0,
  y: 0,
  k: 1,
  transformString: "translate(0 0) scale(1)",
};

export const ZoomPanContext = createContext<ZoomPanValue>(defaultZoomPanValue);

export function useZoomPanContext() {
  return useContext(ZoomPanContext);
}
