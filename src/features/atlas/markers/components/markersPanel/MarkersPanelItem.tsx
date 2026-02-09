import type { DragEvent } from "react";
import { PanelListItem } from "@components";
import type { Marker } from "../../types";

interface MarkersPanelItemProps {
  marker: Marker;
  idx: number;
  onToggleVisibility?: () => void;
  onCenter: () => void;
  onEdit?: () => void;
  onNameChange?: (newName: string) => void;
  onRemove?: () => void;
  draggedIndex?: number | null;
  handleDragStart?: (idx: number) => void;
  handleDragOver?: (e: React.DragEvent<HTMLLIElement>, idx: number) => void;
  handleDragEnd?: () => void;
}

export function MarkersPanelItem({
  marker,
  idx,
  onToggleVisibility,
  onCenter,
  onEdit,
  onNameChange,
  onRemove,
  draggedIndex,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
}: MarkersPanelItemProps) {
  return (
    <PanelListItem
      color={marker.color || "gray"}
      name={marker.name}
      visible={marker.visible}
      onToggleVisibility={onToggleVisibility}
      onCenter={onCenter}
      onEdit={onEdit}
      onNameChange={onNameChange}
      onRemove={onRemove}
      dragged={draggedIndex === idx}
      onDragStart={handleDragStart ? () => handleDragStart(idx) : undefined}
      handleDragOver={handleDragOver ? (e: DragEvent<HTMLLIElement>) => handleDragOver(e, idx) : undefined}
      handleDragEnd={handleDragEnd}
    />
  );
}
