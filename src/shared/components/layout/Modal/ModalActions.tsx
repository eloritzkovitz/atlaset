import type { ReactNode } from "react";
import { ICONS } from "@constants/icons";
import { ActionButton } from "../../action/ActionButton";

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  submitType?: "submit" | "button";
  submitVariant?: "primary" | "secondary";
  submitIcon: ReactNode;
  submitLabel: string;
  cancelLabel?: string;
  deleteLabel?: string;
  disabled?: boolean;
}

export function ModalActions({
  onCancel,
  onSubmit,
  onDelete,
  submitType = "submit",
  submitVariant = "primary",
  submitIcon,
  submitLabel,
  cancelLabel = "Cancel",
  deleteLabel = "Delete",
  disabled = false,
}: ModalActionsProps) {
  return (
    <>
      {onDelete && (
        <div className="flex items-start gap-2 mt-4">
          <ActionButton
            type="button"
            icon={<ICONS.remove className="inline" />}
            variant="secondary"
            onClick={onDelete}
            className="!bg-danger/70 hover:!bg-danger-hover/70"
          >
            {deleteLabel}
          </ActionButton>
        </div>
      )}
      <div className="flex flex-1 justify-end gap-2 mt-4">
        <ActionButton type="button" variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </ActionButton>
        <ActionButton
          type={submitType}
          variant={submitVariant}
          onClick={onSubmit}
          disabled={disabled}
        >
          {submitIcon} {submitLabel}
        </ActionButton>
      </div>
    </>
  );
}
