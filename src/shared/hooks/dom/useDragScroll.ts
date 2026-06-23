import { useRef, useState, useEffect } from "react";
import { useEventListener } from "@hooks";

/**
 * Enables horizontal drag-to-scroll for a scrollable container.
 * @param ref - ref to the scrollable element.
 * @param dependencies - dependencies for the effect.
 */
export function useDragScroll(
  ref: React.RefObject<HTMLElement | null>,
  dependencies: unknown[] = [],
) {
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);

  // Drag scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const depsString = JSON.stringify(dependencies);

  // Check if the container is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        const { scrollWidth, clientWidth } = ref.current;
        setIsOverflowing(scrollWidth > clientWidth);
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [ref, depsString]);

  // Mouse events
  useEventListener(
    "mousedown",
    (e: MouseEvent) => {
      if (!isOverflowing) return;

      dragStartX.current = e.clientX;
      scrollStart.current = ref.current?.scrollLeft || 0;
      setIsDragging(true);

      const moveHandler = (moveEvent: MouseEvent) => {
        if (ref.current) {
          ref.current.scrollLeft =
            scrollStart.current - (moveEvent.clientX - dragStartX.current);
        }
      };

      const upHandler = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", upHandler);
      };

      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
    },
    ref.current,
  );

  // Touch events
  useEventListener(
    "touchstart",
    (e: TouchEvent) => {
      dragStartX.current = e.touches[0].clientX;
      scrollStart.current = ref.current?.scrollLeft || 0;

      const moveHandler = (moveEvent: TouchEvent) => {
        if (ref.current) {
          ref.current.scrollLeft =
            scrollStart.current -
            (moveEvent.touches[0].clientX - dragStartX.current);
        }
      };

      const endHandler = () => {
        window.removeEventListener("touchmove", moveHandler);
        window.removeEventListener("touchend", endHandler);
      };

      window.addEventListener("touchmove", moveHandler);
      window.addEventListener("touchend", endHandler);
    },
    ref.current,
  );

  // Determine the appropriate drag class name based on the state
  const dragClassName = isOverflowing
    ? `select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`
    : "cursor-default";

  return {
    isDragging,
    isOverflowing,
    dragClassName,
  };
}
