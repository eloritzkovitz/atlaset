import {
  DialogHeader,
  type DialogHeaderProps,
} from "../DialogHeader/DialogHeader";

export function ModalHeader(props: DialogHeaderProps) {
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
