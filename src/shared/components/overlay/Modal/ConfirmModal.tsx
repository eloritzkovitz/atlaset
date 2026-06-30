import type { ReactNode } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { Modal } from "./Modal";
import { ModalActions } from "./ModalActions";
import { ModalHeader } from "./ModalHeader";

interface ConfirmModalProps {
  isOpen?: boolean;
  title?: ReactNode;
  showWarningIcon?: boolean;
  messageTitle?: ReactNode;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
}

export function ConfirmModal({
  isOpen = true,
  title,
  showWarningIcon = false,
  message,
  messageTitle,
  onConfirm,
  onCancel,
  submitLabel = "Continue",
  cancelLabel = "Cancel",
  submitIcon,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalHeader title={title} />
      <div className="p-4">
        <div className="flex flex-col items-center mb-2">
          {showWarningIcon && (
            <FaCircleExclamation className="text-danger text-6xl mb-2" />
          )}
          {messageTitle && (
            <div className="mb-2 text-2xl font-bold text-center">
              {messageTitle}
            </div>
          )}
        </div>
        <div className="mb-8 text-base text-center text-text">{message}</div>
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
