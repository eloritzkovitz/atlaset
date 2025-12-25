import { Modal } from "@components";
import { LegendRow } from "./LegendRow";
import type { LegendItem } from "../../types";

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
      className="!bg-transparent !shadow-none fixed top-16 right-6 z-50"
      disableClose
    >
      <div className="flex flex-col gap-4 py-2">
        <h2 className="text-lg font-semibold">Legend</h2>
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
