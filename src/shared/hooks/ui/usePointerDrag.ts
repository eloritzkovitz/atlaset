import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEventListener } from "../dom/useEventListener";
import type { Point } from "@types";

/**
 * Manages the state and behavior for a draggable element.
 * @param draggable - Whether the element should be draggable.
 * @param isOpen - Whether the element is currently open.
 * @param excludedRefs - Elements inside which dragging should not start.
 */
export function usePointerDrag(
  draggable: boolean,
  isOpen: boolean,
  excludedRefs: React.RefObject<HTMLElement | null>[] = [],
) {
  const dragState = useRef<Point | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const latestPos = useRef<Point>({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(false);
  const modalDomRef = useRef<Element | null>(null);
  const [modalOffset, setModalOffset] = useState<Point | null>(null);

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

  const modalStyle = useMemo(() => {
    if (!draggable) return {};

    if (!modalOffset) {
      return {
        position: "fixed" as React.CSSProperties["position"],
        willChange: "transform",
        opacity: 1,
        pointerEvents: "auto" as React.CSSProperties["pointerEvents"],
      };
    }

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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<Element>) => {
      if (!draggable || !modalOffset) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const target = e.target;

      if (
        target instanceof Node &&
        excludedRefs.some((ref) => ref.current && ref.current.contains(target))
      ) {
        return;
      }

      dragState.current = {
        x: e.clientX - modalOffset.x,
        y: e.clientY - modalOffset.y,
      };

      setDragging(true);
      document.body.style.userSelect = "none";
    },
    [draggable, modalOffset, excludedRefs],
  );

  useEffect(() => {
    if (!isOpen) {
      dragState.current = null;
      setModalOffset(null);
      setDragging(false);

      if (animationFrameId.current != null) {
        window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      document.body.style.userSelect = "";
    }
  }, [isOpen]);

  const updatePosition = () => {
    if (dragState.current) {
      const x = latestPos.current.x - dragState.current.x;
      const y = latestPos.current.y - dragState.current.y;

      setModalOffset({ x, y });
    }

    animationFrameId.current = null;
  };

  const handlePointerMove = (e: Event) => {
    if (!draggable) return;

    const pointerEvent = e as PointerEvent;

    latestPos.current = {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
    };

    if (dragState.current && animationFrameId.current == null) {
      animationFrameId.current = window.requestAnimationFrame(updatePosition);
    }
  };

  const handlePointerUp = () => {
    if (!draggable) return;

    if (dragState.current) {
      dragState.current = null;
      setDragging(false);
    }

    document.body.style.userSelect = "";

    if (animationFrameId.current != null) {
      window.cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  useEventListener("pointermove", handlePointerMove, window);
  useEventListener("pointerup", handlePointerUp, window);

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
