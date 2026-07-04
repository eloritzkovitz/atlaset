import { type ReactNode } from "react";
import { DialogHeader } from "../DialogHeader/DialogHeader";

interface ModalHeaderProps {
  title: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  children?: ReactNode;
  className?: string;
  showSeparator?: boolean;
  closeButtonClassName?: string;
}

export function ModalHeader(props: ModalHeaderProps) {
  return (
    <DialogHeader
      showCloseButton={props.showCloseButton ?? true}
      showSeparator={props.showSeparator ?? true}
      className=""
      closeButtonClassName={props.closeButtonClassName}
      {...props}
    >
      {props.children}
    </DialogHeader>
  );
}

ModalHeader.displayName = "ModalHeader";
