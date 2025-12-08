import React, {
  type ReactNode,
  type ReactElement,
  isValidElement,
  useRef,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import { useUI } from "@contexts/UIContext";
import { useFloatingHover as useFloatingHoverHook } from "@hooks/useFloatingHover";
import { useClickOutside } from "@hooks/useClickOutside";
import { usePanelHide } from "@hooks/usePanelHide";
import "./Modal.css";

type FloatingButtonProps = {
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
};

interface ModalProps {
  isOpen: boolean;
  closing?: boolean;
  onClose: () => void;
  children: ReactNode;
  floatingChildren?: ReactElement<FloatingButtonProps>;
  useFloatingHover?: boolean;
  scrollable?: boolean;
  disableClose?: boolean;
  position?: "center" | "custom";
  className?: string;
  containerClassName?: string;
  backdropClassName?: string;
  style?: React.CSSProperties;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function Modal({
  isOpen,
  closing,
  onClose,
  children,
  floatingChildren,
  useFloatingHover = false,
  scrollable = false,
  disableClose = false,
  position = "center",
  className = "",
  containerClassName = "",
  backdropClassName = "",
  style,
  containerRef,
}: ModalProps) {
  const { setModalOpen } = useUI();

  // Set modal open state for UI context
  useEffect(() => {
    setModalOpen(isOpen);
    return () => setModalOpen(false);
  }, [isOpen, setModalOpen]);

  // Handle floating hover logic
  const { hoverHandlers, floatingHandlers, shouldShowFloating } =
    useFloatingHoverHook(useFloatingHover);

  // Handle panel hide logic
  usePanelHide({
    show: isOpen,
    onHide: onClose,
    isModal: true,
    escEnabled: disableClose ? false : true,
  });

  const modalRef = containerRef ?? useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useClickOutside([modalRef as React.RefObject<HTMLElement>], () => {
    if (!disableClose) onClose();
  });

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
        } ${backdropClassName ?? ""}`}
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
          {...hoverHandlers}
          className={
            "group " +
            (position === "center" ? "modal-center " : "modal-custom ") +
            "modal " +
            (isOpen ? "modal-show " : "modal-hide ") +
            (closing ? " modal-closing " : "") +
            className +
            " " +
            containerClassName
          }
          style={position === "custom" ? style : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      {isOpen &&
        floatingChildren &&
        isValidElement(floatingChildren) &&
        (useFloatingHover
          ? shouldShowFloating &&
            React.cloneElement(floatingChildren, floatingHandlers)
          : floatingChildren)}
    </>,
    document.body
  );
}
