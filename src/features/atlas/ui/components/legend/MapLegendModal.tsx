import { Modal } from "@components";

export interface LegendItem {
  color: string;
  label: string;
  icon?: React.ReactNode;
}

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

function LegendRow({ color, label, icon }: LegendItem) {
  return (
    <div className="flex items-center gap-4">
      {icon ? (
        <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      ) : (
        <span
          className="inline-block w-6 h-6 rounded border border-slate-300"
          style={{ backgroundColor: color }}
        />
      )}
      <span>{label}</span>
    </div>
  );
}
