import { ActionButton, Modal, PanelHeader } from "@components";
import { ICONS } from "@constants/icons";
import { LegendRow } from "./LegendRow";
import type { LegendItem } from "../types";

interface MapLegendModalProps {
  open: boolean;
  onClose: () => void;
  items: LegendItem[];
}

export function MapLegendModal({ open, onClose, items }: MapLegendModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      position="custom"
      className="!bg-bg/50 !shadow-none fixed top-16 end-6 z-50 select-none"
      disableClose
    >
      <PanelHeader title="Legend" className="!px-0 group">
        <div className="flex items-center justify-between w-full">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <ActionButton
              onClick={onClose}
              ariaLabel="Close Legend"
              icon={<ICONS.close className="text-2xl" />}
              rounded
            />
          </span>
        </div>
      </PanelHeader>
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
