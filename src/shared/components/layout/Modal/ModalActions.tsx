import type { ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";
import { FormButton } from "../../form/buttons/FormButton";

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitType?: "submit" | "button";
  submitVariant?: "primary" | "secondary";
  submitIcon: ReactNode;
  submitLabel: string;
  cancelLabel?: string;
  disabled?: boolean;
};

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
      <FormButton type="button" variant="secondary" onClick={onCancel}>
        <FaXmark className="inline" /> {cancelLabel}
      </FormButton>
      <FormButton type={submitType} variant={submitVariant} onClick={onSubmit} disabled={disabled}>
        {submitIcon} {submitLabel}
      </FormButton>
    </div>
  );
}
