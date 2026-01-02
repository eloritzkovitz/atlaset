import type { ReactNode } from "react";
import { FaXmark, FaCircleExclamation } from "react-icons/fa6";
import { Modal } from "./Modal";
import { ModalActions } from "./ModalActions";
import { PanelHeader } from "../Panel/PanelHeader";
import { ActionButton } from "../../action/ActionButton";

interface ConfirmModalProps {
  isOpen?: boolean;
  title?: ReactNode;
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
  message,
  onConfirm,
  onCancel,
  submitLabel = "Continue",
  cancelLabel = "Cancel",
  submitIcon,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <PanelHeader title={<>{""}</>}>
        <ActionButton
          onClick={onCancel}
          ariaLabel="Close Edit Profile Modal"
          title="Close"
          icon={<FaXmark className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <div className="p-4">
        <div className="flex flex-col items-center mb-2">
          <FaCircleExclamation className="text-danger text-6xl mb-2" />
          {title && (
            <div className="mb-2 text-2xl font-bold text-center">{title}</div>
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
