import { useState, useRef } from "react";

/**
 * Handles resizable column widths.
 * @param defaultWidths - Initial column widths
 * @param minWidths - Minimum column widths
 * @returns Current column widths and resize handler
 */
export function useResizableColumns<T extends string>(
  defaultWidths: Record<T, number>,
  minWidths: Record<T, number>
) {
  const [colWidths, setColWidths] = useState(defaultWidths);
  const resizingCol = useRef<T | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Handle mouse down on resizer
  function handleResizeStart(e: React.MouseEvent, key: T) {
    resizingCol.current = key;
    startX.current = e.clientX;
    startWidth.current = colWidths[key];

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Mouse move handler
  function onMouseMove(e: MouseEvent) {
    if (!resizingCol.current) return;
    const dx = e.clientX - startX.current;
    const minWidth = minWidths[resizingCol.current!];
    const newWidth = Math.max(minWidth, startWidth.current + dx);
    setColWidths((prev) => ({
      ...prev,
      [resizingCol.current!]: newWidth,
    }));
  }

  // Mouse up handler
  function onMouseUp() {
    resizingCol.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  return { colWidths, handleResizeStart };
}
