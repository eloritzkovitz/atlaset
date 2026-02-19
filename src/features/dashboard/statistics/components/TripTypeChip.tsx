import type { ElementType } from "react";
import { Chip } from "@components";

interface TripTypeChipProps {
  icon: ElementType;
  value: number;
  label: string;
  colorClass: string;
}

export function TripTypeChip({
  icon: Icon,
  value,
  label,
  colorClass,
}: TripTypeChipProps) {
  return (
    <div className="flex flex-col items-center">
      <Chip className={`!text-2xl gap-1 ${colorClass} px-3 py-1 font-semibold`}>
        <Icon className="shrink-0" />
        {value}
      </Chip>
      <span className="text-muted text-xs mt-1">{label}</span>
    </div>
  );
}
