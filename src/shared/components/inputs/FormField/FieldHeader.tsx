import type { ReactNode } from "react";
import { ICONS } from "@constants/icons";
import { FieldLabel } from "./FieldLabel";
import { ActionButton } from "../Button/ActionButton";

interface FieldHeaderProps {
  label: ReactNode;
  required?: boolean;
  onEdit?: () => void;
  editLabel?: string;
}

/** Renders a field header with a label and an optional edit button. */
export function FieldHeader({
  label,
  required = false,
  onEdit,
  editLabel,
}: FieldHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <FieldLabel required={required}>{label}</FieldLabel>

      {onEdit && (
        <ActionButton
          type="button"
          icon={<ICONS.editField />}
          onClick={onEdit}
          title={editLabel}
          aria-label={editLabel}
          rounded
        />
      )}
    </div>
  );
}
