import React, {
  type ReactNode,
  type ReactElement,
  isValidElement,
  useRef,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import { useUI } from "@contexts/UIContext";
import { useClickOutside } from "@hooks/useClickOutside";
import { usePanelHide } from "@hooks/usePanelHide";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  closing?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
  children: ReactNode;
  floatingChildren?: ReactElement;
  scrollable?: boolean;
  disableClose?: boolean;
  position?: "center" | "custom";
  className?: string;
  containerZIndex?: number;
  backdropZIndex?: number;
  style?: React.CSSProperties;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  extraRefs?: React.RefObject<HTMLElement | null>[];
}

export function Modal({
  isOpen,
  closing,
  onMouseEnter,
  onMouseLeave,
  onClose,
  children,
  floatingChildren,
  scrollable = false,
  disableClose = false,
  position = "center",
  className = "",
  containerZIndex,
  backdropZIndex,
  style,
  containerRef,
  extraRefs = [],
}: ModalProps) {
  const { setModalOpen } = useUI();

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
    escEnabled: disableClose ? false : true,
  });

  const modalRef = containerRef ?? useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useClickOutside(
    [
      modalRef as React.RefObject<HTMLElement>,
      ...(extraRefs?.map((ref) => ref as React.RefObject<HTMLElement>) ?? []),
    ],
    () => {
      if (!disableClose) onClose();
    }
  );

  // Don't render anything if the modal is not open
  if (!isOpen && !closing) return null;

  return ReactDOM.createPortal(
    <>
      <div
        aria-modal="true"
        inert={!isOpen}
        role="dialog"
        className={`modal-backdrop ${
          scrollable ? "modal-backdrop-scrollable" : ""
        } `}
        style={{ zIndex: backdropZIndex }}
        onClick={
          !scrollable
            ? () => {
                if (!disableClose) onClose();
              }
            : undefined
        }
      >
        <div
          ref={modalRef}
          className={
            "group " +
            (position === "center" ? "modal-center " : "modal-custom ") +
            "modal " +
            (isOpen ? "modal-show " : "modal-hide ") +
            (closing ? " modal-closing " : "") +
            className +
            " "
          }
          style={{
            ...(position === "custom" ? style : {}),
            zIndex: containerZIndex,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </div>
      </div>
      {isOpen &&
        floatingChildren &&
        isValidElement(floatingChildren) &&
        floatingChildren}
    </>,
    document.body
  );
}
