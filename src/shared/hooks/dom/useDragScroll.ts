import { useRef } from "react";
import { useEventListener } from "@hooks";

/**
 * Enables horizontal drag-to-scroll for a scrollable container.
 * @param ref - ref to the scrollable element
 */
export function useDragScroll(ref: React.RefObject<HTMLElement | null>) {
  // Track drag state
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);

  // Mouse events
  useEventListener(
    "mousedown",
    (e: MouseEvent) => {
      dragStartX.current = e.clientX;
      scrollStart.current = ref.current?.scrollLeft || 0;
      const moveHandler = (moveEvent: MouseEvent) => {
        if (ref.current) {
          ref.current.scrollLeft =
            scrollStart.current - (moveEvent.clientX - dragStartX.current);
        }
      };
      const upHandler = () => {
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", upHandler);
      };
      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
    },
    ref.current,
  );
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
}
