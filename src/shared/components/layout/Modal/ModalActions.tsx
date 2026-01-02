import type { ReactNode } from "react";
import { ActionButton } from "../../action/ActionButton";

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitType?: "submit" | "button";
  submitVariant?: "primary" | "secondary";
  submitIcon: ReactNode;
  submitLabel: string;
  cancelLabel?: string;
  disabled?: boolean;
}

export function ModalActions({
  onCancel,
  onSubmit,
  submitType = "submit",
  submitVariant = "primary",
  submitIcon,
  submitLabel,
  cancelLabel = "Cancel",
  disabled = false,
}: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
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
  );
}
