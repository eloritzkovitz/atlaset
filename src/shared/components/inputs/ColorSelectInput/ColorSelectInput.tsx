import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { OverlayProps } from "@components";
import { ICONS } from "@constants/icons";
import { ColorPickerModal } from "./ColorPickerModal";
import { ActionButton } from "../Button/ActionButton";

interface ColorSelectInputProps extends OverlayProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  onOpen: () => void;
  disabled?: boolean;
  modalRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function ColorSelectInput({
  value,
  onChange,
  isOpen,
  onOpen,
  onClose,
  disabled = false,
  modalRef,
  className = "",
}: ColorSelectInputProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className="w-8 h-8 rounded"
          style={{ background: value }}
          title={value}
        />

        <ActionButton
          type="button"
          icon={<ICONS.editField />}
          title={t("actions.edit")}
          aria-label={t("actions.edit")}
          onClick={onOpen}
          rounded
          disabled={disabled}
        />
      </div>

      {isOpen &&
        createPortal(
          <ColorPickerModal
            isOpen={isOpen}
            color={value}
            onChange={onChange}
            onClose={onClose}
            containerRef={modalRef}
          />,
          document.body,
        )}
    </>
  );
}
