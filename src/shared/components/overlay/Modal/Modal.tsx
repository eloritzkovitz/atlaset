import React, {
  isValidElement,
  useRef,
  useEffect,
  type ReactNode,
  type ReactElement,
} from "react";
import { useUI } from "@app/contexts/UIContext";
import {
  useBodyScrollLock,
  useClickOutside,
  useDismiss,
  usePointerDrag,
} from "@hooks";
import { ModalHeader } from "./ModalHeader";
import { OverlayPortal } from "../OverlayPortal/OverlayPortal";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  closing?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
  children: ReactNode;
  floatingChildren?: ReactElement;
  disableScroll?: boolean;
  disableClose?: boolean;
  position?: "center" | "custom";
  className?: string;
  containerZIndex?: number;
  backdropZIndex?: number;
  style?: React.CSSProperties;
  containerRef?: React.Ref<HTMLDivElement>;
  extraRefs?: React.RefObject<HTMLElement | null>[];
  draggable?: boolean;
}

/** Renders a modal component. */
export function Modal({
  isOpen,
  closing,
  onMouseEnter,
  onMouseLeave,
  onClose,
  children,
  floatingChildren,
  disableScroll = false,
  disableClose = false,
  position = "center",
  className = "",
  containerZIndex,
  backdropZIndex,
  style,
  containerRef,
  extraRefs = [],
  draggable = false,
}: ModalProps) {
  const { setModalOpen } = useUI();
  const internalRef = useRef<HTMLDivElement | null>(null);

  const setContainerRef = (element: HTMLDivElement | null) => {
    internalRef.current = element;

    if (typeof containerRef === "function") {
      containerRef(element);
    } else if (containerRef) {
      containerRef.current = element;
    }
  };

  // Set modal open state for UI context
  useEffect(() => {
    setModalOpen(isOpen);

    return () => setModalOpen(false);
  }, [isOpen, setModalOpen]);

  useDismiss({
    show: isOpen,
    onHide: onClose,
    isModal: true,
    escEnabled: !disableClose,
  });

  // Draggable modal logic
  const { dragging, handlePointerDown, setModalDomRef, modalStyle } =
    usePointerDrag?.(draggable, isOpen) || {
      dragging: false,
      handlePointerDown: undefined,
      setModalDomRef: undefined,
      modalStyle: {},
    };

  // Handle outside click to close modal
  const handleOutsideClose = () => {
    if (!disableClose && !dragging) {
      onClose();
    }
  };

  // Close modal on outside click
  useClickOutside([internalRef, ...extraRefs], handleOutsideClose);

  // Disable background scroll when modal is open
  useBodyScrollLock(disableScroll && isOpen);

  // Don't render anything if the modal is not open
  if (!isOpen && !closing) return null;

  // Process children to inject onClose into ModalHeader if not already provided
  const processedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type === ModalHeader ||
        (child.type as unknown as { displayName: string }).displayName ===
          "ModalHeader")
    ) {
      const headerElement = child as React.ReactElement<{
        onClose?: () => void;
      }>;

      return React.cloneElement<{ onClose?: () => void }>(headerElement, {
        onClose: headerElement.props.onClose ?? onClose,
      });
    }

    return child;
  });

  return (
    <OverlayPortal>
      <>
        <div
          aria-modal="true"
          inert={!isOpen}
          role="dialog"
          className={`modal-backdrop fixed inset-0 z-[9999] ${
            position === "center" ? "flex items-center justify-center" : ""
          } ${!disableScroll ? "modal-backdrop-scrollable" : ""}`}
          style={{ zIndex: backdropZIndex }}
          onClick={
            !disableScroll
              ? () => {
                  if (!disableClose && !dragging) {
                    onClose();
                  }
                }
              : undefined
          }
        >
          <div
            ref={(element) => {
              setContainerRef(element);

              if (draggable && setModalDomRef) {
                setModalDomRef(element);
              }
            }}
            className={
              "group fixed " +
              "modal max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-4 sm:px-6 py-4 " +
              (isOpen ? "modal-show " : "modal-hide ") +
              (closing ? " modal-closing " : "") +
              className
            }
            style={{
              ...(position === "custom" ? style : {}),
              zIndex: containerZIndex,
              ...modalStyle,
              cursor: draggable ? (dragging ? "grabbing" : "auto") : undefined,
              userSelect: draggable ? "none" : undefined,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPointerDown={draggable ? handlePointerDown : undefined}
          >
            {processedChildren}
          </div>
        </div>

        {isOpen &&
          floatingChildren &&
          isValidElement(floatingChildren) &&
          floatingChildren}
      </>
    </OverlayPortal>
  );
}
