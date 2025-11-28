import React, { type ReactNode, type ReactElement, isValidElement } from "react";
import ReactDOM from "react-dom";
import { useFloatingHover as useFloatingHoverHook } from "@hooks/useFloatingHover";
import { usePanelHide } from "@hooks/usePanelHide";
import "./Modal.css";

type FloatingButtonProps = {
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  floatingChildren?: ReactElement<FloatingButtonProps>;
  useFloatingHover?: boolean;
  className?: string;
  position?: "center" | "custom";
  containerClassName?: string;
  backdropClassName?: string;
  style?: React.CSSProperties;
  disableClose?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function Modal({
  isOpen,
  onClose,
  children,
  floatingChildren,
  useFloatingHover = false,
  className = "",
  position = "center",
  containerClassName = "",
  backdropClassName = "",
  style,
  disableClose = false,
  containerRef,
}: ModalProps) {
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

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div
        onClick={() => {
          if (!disableClose) onClose();
        }}
        aria-modal="true"
        inert={!isOpen}
        role="dialog"
        className={`modal-backdrop ${backdropClassName ?? ""}`}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div
          ref={containerRef}
          {...hoverHandlers}
          className={
            "group " +
            (position === "center" ? "modal-center " : "modal-custom ") +
            "modal " +
            (isOpen ? "modal-show " : "modal-hide ") +
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
