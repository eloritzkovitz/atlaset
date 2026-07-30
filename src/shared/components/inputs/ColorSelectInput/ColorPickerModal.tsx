import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import { ModalHeader } from "@components";
import { ICONS } from "@constants/icons";
import { hexToRgba } from "@utils/color";
import { ActionButton } from "../Button/ActionButton";
import { ColorDot } from "../../display/ColorDot";
import { Modal } from "../../overlay/Modal/Modal";
import { Tooltip } from "../../overlay/Tooltip/Tooltip";
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
  const { t } = useTranslation("common");

  const [internalColor, setInternalColor] = useState(color);
  const [showRgba, setShowRgba] = useState(true);
  const [copied, setCopied] = useState(false);

  // Copy color value to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Sync internal color with prop when modal opens
  useEffect(() => {
    if (isOpen) setInternalColor(color);
  }, [isOpen, color]);

  // Only update parent when Done is clicked
  const handleDone = () => {
    onChange(internalColor);
    onClose();
  };

  const displayValue = showRgba
    ? hexToRgba(internalColor)
    : internalColor.toUpperCase();
  const displayLabel = showRgba ? "RGBA" : "HEX";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-xl shadow-lg p-6 w-[420px]"
    >
      <ModalHeader
        title={
          <>
            <ICONS.mapSettings.colors />
            {t("components.colorPicker.select")}
          </>
        }
      />
      <div
        className="flex flex-col items-center gap-4"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <HexColorPicker
          color={internalColor}
          onChange={setInternalColor}
          className="colorful-picker"
        />
      </div>
      <div className="flex items-end justify-between mt-6 px-2 gap-4">
        <div className="flex items-center gap-3">
          <ColorDot color={internalColor} size={32} />
          <div className="flex flex-col">
            <span className="text-xs text-muted font-semibold uppercase tracking-wide mb-1 select-none">
              {displayLabel}
            </span>
            <div className="flex items-center gap-1">
              <Tooltip
                content={
                  showRgba
                    ? t("components.colorPicker.toggleRGBA")
                    : t("components.colorPicker.toggleHEX")
                }
                position="top"
              >
                <button
                  type="button"
                  className="bg-input w-[180px] text-xs font-mono px-2 py-1 rounded border-none select-all transition hover:brightness-95"
                  style={{ textAlign: "left" }}
                  onClick={() => setShowRgba((v) => !v)}
                >
                  {displayValue}
                </button>
              </Tooltip>

              <ActionButton
                variant="custom"
                className="p-1 rounded hover:bg-input/70 transition text-inherit text-sm"
                ariaLabel={t("actions.copy")}
                title={copied ? t("actions.copied") : t("actions.copy")}
                titlePosition="top"
                onClick={handleCopy}
                icon={<ICONS.duplicate className="text-xl" />}
                rounded
              />
            </div>
          </div>
        </div>

        <ActionButton
          type="button"
          variant="primary"
          onClick={handleDone}
          className="shrink-0"
        >
          {t("actions.confirm")}
        </ActionButton>
      </div>
    </Modal>
  );
}
