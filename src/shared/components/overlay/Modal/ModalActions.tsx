import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { ActionButton } from "../../inputs/Button/ActionButton";

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  submitType?: "submit" | "button";
  submitVariant?: "primary" | "secondary";
  submitIcon?: ReactNode;
  submitLabel?: string;
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
  cancelLabel,
  deleteLabel,
  disabled = false,
}: ModalActionsProps) {
  const { t } = useTranslation("common");

  const submitText = submitLabel ?? t("actions.save");
  const cancelText = cancelLabel ?? t("actions.cancel");
  const deleteText = deleteLabel ?? t("actions.delete");  

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
            {deleteText}
          </ActionButton>
        </div>
      )}
      <div className="flex flex-1 justify-end gap-2 mt-4">
        <ActionButton type="button" variant="secondary" onClick={onCancel}>
          {cancelText}
        </ActionButton>
        <ActionButton
          type={submitType}
          variant={submitVariant}
          onClick={onSubmit}
          disabled={disabled}
        >
          {submitIcon} {submitText}
        </ActionButton>
      </div>
    </>
  );
}
