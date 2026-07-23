import React from "react";
import { ICONS } from "@constants/icons";
import { ActionButton } from "../../inputs/Button/ActionButton";

interface RenameControlsProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function RenameControls({
  value,
  onChange,
  onBlur,
  onKeyDown,
  onSave,
  onCancel,
}: RenameControlsProps) {
  return (
    <>
      <input
        id="rename-input"
        name="rename-input"
        type="text"
        value={value}
        autoFocus
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="font-semibold bg-transparent border-b border-primary focus:outline-none truncate w-full"
      />
      <ActionButton
        variant="toggle"
        onClick={onSave}
        ariaLabel="Save"
        title="Save"
        className="ms-2 text-success hover:text-success-hover"
        icon={<ICONS.selected className="text-xl" />}
      />
      <ActionButton
        variant="toggle"
        onClick={onCancel}
        ariaLabel="Cancel"
        title="Cancel"
        className="ms-2 text-danger hover:text-danger-hover"
        icon={<ICONS.close className="text-xl" />}
      />
    </>
  );
}
