import {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";

/** Represents the position of a modal.
 * @param x - The x-coordinate of the modal.
 * @param y - The y-coordinate of the modal.
 */
type ModalPosition = { x: number; y: number };

const DRAG_THRESHOLD = 5;

/**
 * Manages the state and behavior for a draggable modal. Provides handlers and styles to enable dragging functionality.
 * @param draggable - Whether the modal should be draggable.
 * @param isOpen - Whether the modal is currently open. Used to reset dragging state when modal is closed.
 * @param initialModalPosition - Optional initial position for the modal. If not provided, modal will be centered on first open.
 * @param setModalPosition - Callback to update the modal position in the parent component state.
 * @returns An object containing dragging state, pointer down handler, ref setter for the modal element, computed modal styles, and current modal offset.
 */
export function useDraggableModal(
  draggable: boolean,
  isOpen: boolean,
  initialModalPosition: ModalPosition | null,
  setModalPosition: (pos: ModalPosition | null) => void,
) {
  const dragState = useRef<null | {
    type: "pending" | "active";
    x: number;
    y: number;
  }>(null);
  const modalDomRef = useRef<HTMLElement | null>(null);
  const [modalOffset, setModalOffset] = useState<ModalPosition | null>(null);
  const lastPos = useRef<ModalPosition>({ x: 0, y: 0 });

  // Center modal on first open if no position is set, otherwise keep last position
  useLayoutEffect(() => {
    if (isOpen && modalOffset == null && modalDomRef.current) {
      if (initialModalPosition) {
        setModalOffset(initialModalPosition);
        setModalPosition(initialModalPosition);
      } else {
        const width = modalDomRef.current.offsetWidth;
        const height = modalDomRef.current.offsetHeight;
        const pos = {
          x: window.innerWidth / 2 - width / 2,
          y: window.innerHeight / 2 - height / 2,
        };
        setModalOffset(pos);
        setModalPosition(pos);
      }
    }
  }, [isOpen, setModalPosition, modalOffset, initialModalPosition]);

  // Compute the style for the modal (for draggable)
  const modalStyle = useMemo(() => {
    // If not draggable, no special styles needed
    if (!draggable) return {};

    // If draggable but no offset yet, hide the modal until we can position it
    if (!modalOffset) {
      return {
        position: "fixed" as React.CSSProperties["position"],
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        willChange: "transform",
        opacity: 0,
        pointerEvents: "none" as React.CSSProperties["pointerEvents"],
      };
    }

    // If draggable and we have an offset, apply the transform for dragging
    return {
      position: "fixed" as React.CSSProperties["position"],
      left: 0,
      top: 0,
      transform: `translate(${modalOffset.x}px, ${modalOffset.y}px)`,
      cursor: undefined,
      willChange: "transform",
      opacity: 1,
      transition: "opacity 0.15s ease",
    };
  }, [draggable, modalOffset]);

  // Pointer down on modal
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!draggable || !modalOffset) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragState.current = {
        type: "pending",
        x: e.clientX - modalOffset.x,
        y: e.clientY - modalOffset.y,
      };
      document.body.style.userSelect = "none";
    },
    [draggable, modalOffset],
  );

  // Reset offset and drag state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      dragState.current = null;
      setModalOffset(null);
    }
  }, [isOpen]);

  // Handle pointer move and pointer up events for dragging
  useEffect(() => {
    if (!draggable) return;
    let animationFrameId: number | null = null;
    const latestPos = { x: 0, y: 0 };
    const updatePosition = () => {
      if (dragState.current?.type === "active" && modalDomRef.current) {
        const x = latestPos.x - dragState.current.x;
        const y = latestPos.y - dragState.current.y;
        modalDomRef.current.style.transform = `translate(${x}px, ${y}px)`;
        lastPos.current = { x, y };
      }
      animationFrameId = null;
    };
    const handlePointerMove = (e: PointerEvent) => {
      latestPos.x = e.clientX;
      latestPos.y = e.clientY;
      if (dragState.current?.type === "pending") {
        const dx = e.clientX - (modalOffset?.x ?? 0) - dragState.current.x;
        const dy = e.clientY - (modalOffset?.y ?? 0) - dragState.current.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          dragState.current = {
            type: "active",
            x: dragState.current.x,
            y: dragState.current.y,
          };
        }
        return;
      }
      if (dragState.current?.type === "active") {
        if (animationFrameId == null) {
          animationFrameId = window.requestAnimationFrame(updatePosition);
        }
      }
    };
    const handlePointerUp = () => {
      if (dragState.current?.type === "pending") {
        dragState.current = null;
        document.body.style.userSelect = "";
        return;
      }
      if (dragState.current?.type === "active") {
        dragState.current = null;
        setModalOffset(lastPos.current);
        setModalPosition(lastPos.current);
      }
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      document.body.style.userSelect = "";
    };
  }, [draggable, modalOffset, setModalPosition]);

  // Expose a ref setter for the modal element
  const setModalDomRef = useCallback((el: HTMLElement | null) => {
    modalDomRef.current = el;
  }, []);

  return {
    dragging: dragState.current?.type === "active",
    handlePointerDown,
    setModalDomRef,
    modalStyle,
    modalOffset,
  };
}
