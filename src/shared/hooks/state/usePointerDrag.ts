import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useEventListener } from "../dom/useEventListener";

/** Represents the position of a modal. */
type ModalPosition = { x: number; y: number };

/**
 * Manages the state and behavior for a draggable element. Provides handlers and styles to enable dragging functionality.
 * @param draggable - Whether the element should be draggable.
 * @param isOpen - Whether the element is currently open. Used to reset dragging state when element is closed.
 * @returns An object containing dragging state, pointer down handler, ref setter for the element, computed element style, and current element offset.
 */
export function usePointerDrag(draggable: boolean, isOpen: boolean) {
  const dragState = useRef<null | {
    x: number;
    y: number;
  }>(null);
  const [dragging, setDragging] = useState(false);
  const modalDomRef = useRef<Element | null>(null);
  const [modalOffset, setModalOffset] = useState<ModalPosition | null>(null);

  // Center modal on first open if no position is set, otherwise keep last position
  useLayoutEffect(() => {
    if (isOpen && modalOffset == null && modalDomRef.current) {
      const el = modalDomRef.current;
      let width: number;
      let height: number;
      if (el instanceof HTMLElement) {
        width = el.offsetWidth;
        height = el.offsetHeight;
      } else {
        const rect = el.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
      const x = window.innerWidth / 2 - width / 2;
      const y = window.innerHeight / 2 - height / 2;
      setModalOffset({ x, y });
    }
  }, [isOpen, modalOffset]);

  // Compute the style for the modal (for draggable)
  const modalStyle = useMemo(() => {
    // If not draggable, no special styles needed
    if (!draggable) return {};

    // If draggable but no offset yet, use default fixed positioning
    if (!modalOffset) {
      return {
        position: "fixed" as React.CSSProperties["position"],
        willChange: "transform",
        opacity: 1,
        pointerEvents: "auto" as React.CSSProperties["pointerEvents"],
      };
    }

    // If draggable and we have an offset, apply transform
    return {
      position: "fixed" as React.CSSProperties["position"],
      left: `${modalOffset.x}px`,
      top: `${modalOffset.y}px`,
      transform: "none",
      willChange: "transform",
      opacity: 1,
      transition: "opacity 0.15s ease",
      pointerEvents: "auto" as React.CSSProperties["pointerEvents"],
    };
  }, [draggable, modalOffset]);

  // Pointer down on modal
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<Element>) => {
      if (!draggable || !modalOffset) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragState.current = {
        x: e.clientX - modalOffset.x,
        y: e.clientY - modalOffset.y,
      };
      setDragging(true);
      document.body.style.userSelect = "none";
    },
    [draggable, modalOffset],
  );

  // Reset offset and drag state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      dragState.current = null;
      setModalOffset(null);
      setDragging(false);
    }
  }, [isOpen]);

  // Handle pointer move and pointer up events for dragging
  let animationFrameId: number | null = null;
  const latestPos = { x: 0, y: 0 };
  const updatePosition = () => {
    if (dragState.current) {
      const x = latestPos.x - dragState.current.x;
      const y = latestPos.y - dragState.current.y;
      setModalOffset({ x, y });
    }
    animationFrameId = null;
  };
  const handlePointerMove = (e: Event) => {
    if (!draggable) return;
    const pointerEvent = e as PointerEvent;
    latestPos.x = pointerEvent.clientX;
    latestPos.y = pointerEvent.clientY;
    if (dragState.current) {
      if (animationFrameId == null) {
        animationFrameId = window.requestAnimationFrame(updatePosition);
      }
    }
  };
  const handlePointerUp = () => {
    if (!draggable) return;
    if (dragState.current) {
      dragState.current = null;
      setDragging(false);
    }
    document.body.style.userSelect = "";
    if (animationFrameId != null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  useEventListener("pointermove", handlePointerMove, window);
  useEventListener("pointerup", handlePointerUp, window);

  // Expose a ref setter for the modal element
  const setModalDomRef = useCallback((el: Element | null) => {
    modalDomRef.current = el;
  }, []);

  return {
    dragging,
    handlePointerDown,
    setModalDomRef,
    modalStyle,
    modalOffset,
  };
}
