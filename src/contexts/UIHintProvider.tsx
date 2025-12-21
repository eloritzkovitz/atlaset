import React, { useState, type ReactNode, useCallback } from "react";
import { UIHintContext, type UIHint } from "./UIHintContext";

export const UIHintProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hints, setHints] = useState<UIHint[]>([]);

  const addHint = useCallback((hint: UIHint) => {
    setHints((prev) => {
      // Update the hint if it exists, otherwise add it
      const idx = prev.findIndex((h) => h.id === hint.id);
      if (idx !== -1) {
        // Only update if something actually changed
        if (
          prev[idx].content !== hint.content ||
          prev[idx].dismissable !== hint.dismissable ||
          prev[idx].duration !== hint.duration ||
          prev[idx].style !== hint.style
        ) {
          const updated = [...prev];
          updated[idx] = hint;
          return updated;
        }
        return prev;
      }
      return [...prev, hint];
    });

    // Auto-remove after duration if specified
    if (hint.duration && hint.duration > 0) {
      setTimeout(() => {
        setHints((prev) => prev.filter((h) => h.id !== hint.id));
      }, hint.duration);
    }
  }, []);

  const removeHint = useCallback((id: string) => {
    setHints((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHints = useCallback(() => setHints([]), []);

  return (
    <UIHintContext.Provider value={{ hints, addHint, removeHint, clearHints }}>
      {children}
    </UIHintContext.Provider>
  );
};
