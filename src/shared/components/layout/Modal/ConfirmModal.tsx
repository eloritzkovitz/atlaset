import type { ReactNode } from "react";
import { Modal } from "./Modal";
import { ModalActions } from "./ModalActions";

interface ConfirmModalProps {
  isOpen?: boolean;
  title?: ReactNode;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
};

export function ConfirmModal({
  isOpen = true,
  title,
  message,
  onConfirm,
  onCancel,
  submitLabel = "Continue",
  cancelLabel = "Cancel",
  submitIcon,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="p-4">
        {title && <div className="mb-2 text-lg font-bold">{title}</div>}
        <div className="mb-4 text-base">{message}</div>
        <ModalActions
          onCancel={onCancel}
          onSubmit={onConfirm}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          submitIcon={submitIcon}
        />
      </div>
    </Modal>
  );
}
