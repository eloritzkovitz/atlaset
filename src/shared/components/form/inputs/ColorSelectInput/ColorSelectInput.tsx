import { useEffect, useState } from "react";
import { ColorPickerModal } from "./ColorPickerModal";
import { ActionButton } from "../../../action/ActionButton";
import { ICONS } from "../../../../constants/icons";

interface ColorSelectInputProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  onModalOpenChange?: (isOpen: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorSelectInput({
  value,
  onChange,
  onModalOpenChange,
  disabled = false,
  className = "",
}: ColorSelectInputProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Notify parent when modal open state changes
  useEffect(() => {
    onModalOpenChange?.(modalOpen);
  }, [modalOpen, onModalOpenChange]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="w-8 h-8 rounded"
        style={{ background: value }}
        title={value}
      />
      <ActionButton
        type="button"
        variant="secondary"
        onClick={() => setModalOpen(true)}
        disabled={disabled}
      >
        <ICONS.edit className="inline" /> Edit
      </ActionButton>
      <ColorPickerModal
        isOpen={modalOpen}
        color={value}
        onChange={(color) => onChange(color)}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
