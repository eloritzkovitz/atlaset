import { type ReactNode } from "react";
import { DialogHeader } from "../DialogHeader/DialogHeader";

interface ModalHeaderProps {
  title: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  children?: ReactNode;
  className?: string;
  showSeparator?: boolean;
}

export function ModalHeader(props: ModalHeaderProps) {
  return (
    <DialogHeader
      showCloseButton={true}
      showSeparator={true}
      className=""
      {...props}
    >
      {props.children}
    </DialogHeader>
  );
}

ModalHeader.displayName = "ModalHeader";
