import { useState, useRef } from "react";
import { useEventListener } from "../dom/useEventListener";

/**
 * Handles resizable column widths.
 * @param defaultWidths - Initial column widths
 * @param minWidths - Minimum column widths
 * @returns Current column widths and resize handler
 */
export function useResizableColumns<T extends string>(
  defaultWidths: Record<T, number>,
  minWidths: Record<T, number>,
) {
  const [colWidths, setColWidths] = useState(defaultWidths);
  const resizingCol = useRef<T | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Track if resizing is active
  const resizingActive = useRef(false);

  // Handle mouse down on resizer
  function handleResizeStart(e: React.MouseEvent, key: T) {
    resizingCol.current = key;
    startX.current = e.clientX;
    startWidth.current = colWidths[key];
    resizingActive.current = true;
  }

  // Mouse move handler
  const onMouseMove = (e: Event) => {
    if (!resizingActive.current || !resizingCol.current) return;
    const mouseEvent = e as MouseEvent;
    const dx = mouseEvent.clientX - startX.current;
    const minWidth = minWidths[resizingCol.current!];
    const newWidth = Math.max(minWidth, startWidth.current + dx);
    setColWidths((prev) => ({
      ...prev,
      [resizingCol.current!]: newWidth,
    }));
  };

  // Mouse up handler
  const onMouseUp = () => {
    resizingCol.current = null;
    resizingActive.current = false;
  };

  useEventListener("mousemove", onMouseMove, window);
  useEventListener("mouseup", onMouseUp, window);

  return { colWidths, handleResizeStart };
}
