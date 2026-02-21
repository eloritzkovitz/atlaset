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
 * Manages the state and behavior for a draggable modal. Provides handlers and styles to enable dragging functionality.
 * @param draggable - Whether the modal should be draggable.
 * @param isOpen - Whether the modal is currently open. Used to reset dragging state when modal is closed.
 * @returns An object containing dragging state, pointer down handler, ref setter for the modal element, computed modal style, and current modal offset.
 */
export function useDraggableModal(draggable: boolean, isOpen: boolean) {
  const dragState = useRef<null | {
    x: number;
    y: number;
  }>(null);
  const [dragging, setDragging] = useState(false);
  const modalDomRef = useRef<HTMLElement | null>(null);
  const [modalOffset, setModalOffset] = useState<ModalPosition | null>(null);

  // Center modal on first open if no position is set, otherwise keep last position
  useLayoutEffect(() => {
    if (isOpen && modalOffset == null && modalDomRef.current) {
      const width = modalDomRef.current.offsetWidth;
      const height = modalDomRef.current.offsetHeight;
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
    (e: React.PointerEvent<HTMLElement>) => {
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
  const setModalDomRef = useCallback((el: HTMLElement | null) => {
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
