import React from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { ActionButton } from "../../action/ActionButton";

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
        className="font-semibold bg-transparent border-b border-primary focus:outline-none truncate w-full"
        value={value}
        autoFocus
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      <ActionButton
        variant="toggle"
        onClick={onSave}
        ariaLabel="Save"
        title="Save"
        className="ml-2 text-success hover:text-success-hover"
        icon={<FaCheck className="text-xl" />}
      />
      <ActionButton
        variant="toggle"
        onClick={onCancel}
        ariaLabel="Cancel"
        title="Cancel"
        className="ml-2 text-danger hover:text-danger-hover"
        icon={<FaXmark className="text-xl" />}
      />
    </>
  );
}
