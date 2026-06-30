import React, {
  isValidElement,
  useRef,
  useEffect,
  type ReactNode,
  type ReactElement,
} from "react";
import ReactDOM from "react-dom";
import { useUI } from "@contexts/UIContext";
import {
  useBodyScrollLock,
  useClickOutside,
  usePanelHide,
  usePointerDrag,
} from "@hooks";
import { ModalHeader } from "./ModalHeader";
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
  containerRef?: React.RefObject<HTMLDivElement | null>;
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
  const internalRef = useRef<HTMLDivElement>(null);
  const modalRef = containerRef ?? internalRef;

  // Set modal open state for UI context
  useEffect(() => {
    setModalOpen(isOpen);
    return () => setModalOpen(false);
  }, [isOpen, setModalOpen]);

  // Handle panel hide logic
  usePanelHide({
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
  useClickOutside(
    [
      modalRef as React.RefObject<HTMLElement>,
      ...(extraRefs?.map((ref) => ref as React.RefObject<HTMLElement>) ?? []),
    ],
    handleOutsideClose,
  );

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

  return ReactDOM.createPortal(
    <>
      <div
        aria-modal="true"
        inert={!isOpen}
        role="dialog"
        className={`modal-backdrop fixed inset-0 z-[9999] ${
          !disableScroll ? "modal-backdrop-scrollable" : ""
        }`}
        style={{ zIndex: backdropZIndex }}
        onClick={
          !disableScroll
            ? () => {
                if (!disableClose && !dragging) onClose();
              }
            : undefined
        }
      >
        <div
          ref={(el) => {
            if (modalRef) {
              (
                modalRef as React.MutableRefObject<HTMLDivElement | null>
              ).current = el;
            }
            if (draggable && setModalDomRef) {
              setModalDomRef(el);
            }
          }}
          className={
            "group fixed " +
            (!draggable && position === "center"
              ? "start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
              : "") +
            "modal max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-4 sm:px-6 py-4 " +
            (isOpen ? "modal-show " : "modal-hide ") +
            (closing ? " modal-closing " : "") +
            className +
            " "
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
    </>,
    document.body,
  );
}
