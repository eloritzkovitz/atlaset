import { useTranslation } from "react-i18next";
import { Modal, ModalHeader } from "@components";
import { LegendRow } from "./LegendRow";
import type { LegendItem } from "../types";

interface MapLegendModalProps {
  open: boolean;
  onClose: () => void;
  items: LegendItem[];
}

export function MapLegendModal({ open, onClose, items }: MapLegendModalProps) {
  const { t } = useTranslation("atlas");

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      position="custom"
      className="!bg-bg/50 !shadow-none fixed top-16 end-6 z-50 select-none"
      disableClose
    >
      <ModalHeader title={t("legend.title")} className="!px-0 group" />
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => (
          <LegendRow
            key={idx}
            color={item.color}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Modal>
  );
}
