import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { FaPalette, FaXmark } from "react-icons/fa6";
import { hexToRgba } from "@utils/color";
import { ActionButton } from "../../../action/ActionButton";
import { Modal } from "../../../layout/Modal/Modal";
import { PanelHeader } from "../../../layout/Panel/PanelHeader";
import { ColorDot } from "../../../ui/ColorDot";
import "./ColorPickerModal.css";

interface ColorPickerModalProps {
  isOpen: boolean;
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export function ColorPickerModal({
  isOpen,
  color,
  onChange,
  onClose,
}: ColorPickerModalProps) {
  const [internalColor, setInternalColor] = useState(color);
  const [showRgba, setShowRgba] = useState(true);

  // Sync internal color with prop when modal opens
  useEffect(() => {
    if (isOpen) setInternalColor(color);
  }, [isOpen, color]);

  // Only update parent when Done is clicked
  const handleDone = () => {
    onChange(internalColor);
    onClose();
  };

  // Determine display value
  const displayValue = showRgba
    ? hexToRgba(internalColor)
    : internalColor.toUpperCase();
  const displayLabel = showRgba ? "RGBA" : "HEX";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-xl shadow-2xl p-6 min-w-[320px] max-w-[400px]"
    >
      <PanelHeader
        title={
          <>
            <FaPalette />
            Select Color
          </>
        }
      >
        <ActionButton
          onClick={onClose}
          ariaLabel="Close Overlay Modal"
          title="Close"
          icon={<FaXmark className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <div className="flex flex-col items-center gap-4">
        <HexColorPicker
          color={internalColor}
          onChange={setInternalColor}
          className="colorful-picker"
        />
      </div>
      <div className="flex items-end justify-between mt-6 gap-6">
        {/* Preview & RGBA/HEX */}
        <div className="flex items-center gap-4">
          <ColorDot color={internalColor} size={32} />
          <div className="flex flex-col">
            <span className="text-xs text-muted font-semibold uppercase tracking-wide mb-1 select-none">
              {displayLabel}
            </span>
            <button
              type="button"
              className="bg-input text-xs font-mono px-2 py-1 rounded border-none select-all transition hover:brightness-95 active:scale-95"
              title="Click to toggle between RGBA and HEX"
              style={{ minWidth: 120, textAlign: "left" }}
              onClick={() => setShowRgba((v) => !v)}
            >
              {displayValue}
            </button>
          </div>
        </div>
        {/* Done Button */}
        <ActionButton type="button" variant="primary" onClick={handleDone}>
          Done
        </ActionButton>
      </div>
    </Modal>
  );
}
