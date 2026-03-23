import { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "./useEventListener";

/**
 * Measures rendered text width (matching input font) and returns the left offset
 * where an inline suffix should be placed (paddingLeft + textWidth).
 */
export function useTextWidth(
  text: string,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  const measurerRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [suffixLeft, setSuffixLeft] = useState(0);

  // Measure text width and compute suffix left offset
  const measure = () => {
    const measurer = measurerRef.current;
    const inputEl = inputRef.current;
    if (!measurer || !inputEl) {
      setSuffixLeft(0);
      return;
    }
    const style = window.getComputedStyle(inputEl);
    measurer.style.font = style.font;
    measurer.style.letterSpacing = style.letterSpacing;
    measurer.style.padding = "0";
    measurer.textContent = text || "";

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const textWidth = measurer.getBoundingClientRect().width;
      const paddingLeft = parseFloat(style.paddingLeft || "0");
      setSuffixLeft(paddingLeft + textWidth);
    });
  };

  // measure on text or input ref change
  useLayoutEffect(() => {
    measure();
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, inputRef]);

  // update on resize
  useEventListener("resize", measure, window);

  return { measurerRef, suffixLeft } as const;
}
