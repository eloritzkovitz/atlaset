import type { ReactNode } from "react";
import { ZoomPanContext, defaultZoomPanValue } from "./ZoomPanContext";

export interface ZoomPanValue {
  x: number;
  y: number;
  k: number;
  transformString: string;
}

export interface ZoomPanProviderProps {
  value?: ZoomPanValue;
  children?: ReactNode;
}

export const ZoomPanProvider = ({
  value = defaultZoomPanValue,
  children,
}: ZoomPanProviderProps) => {
  return (
    <ZoomPanContext.Provider value={value}>
      {children}
    </ZoomPanContext.Provider>
  );
};
