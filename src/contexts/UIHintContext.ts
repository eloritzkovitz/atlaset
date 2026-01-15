import React from "react";

export interface UIHint {
  id: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  position: "top" | "bottom";
  dismissable?: boolean;
  duration?: number;
  style?: React.CSSProperties;
  onHide?: () => void;
}

export interface UIHintContextType {
  hints: UIHint[];
  addHint: (hint: UIHint) => void;
  removeHint: (id: string) => void;
  clearHints: () => void;
}

export const UIHintContext = React.createContext<UIHintContextType | undefined>(
  undefined
);

export function useUIHintContext() {
  const context = React.useContext(UIHintContext);
  if (!context) {
    throw new Error("useUIHint must be used within a UIHintProvider");
  }
  return context;
}
