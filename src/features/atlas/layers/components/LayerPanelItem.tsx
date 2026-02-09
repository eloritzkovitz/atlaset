import { PanelListItem } from "@components";
import type { Layer } from "../types";

interface LayerPanelItemProps {
  layer: Layer;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
  showEdit?: boolean;
  onEdit?: (layer: Layer) => void;
  onNameChange?: (newName: string) => void;
  onToggleVisibility?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function LayerPanelItem({
  layer,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  onEdit,
  onNameChange,
  onToggleVisibility,
  onRemove,
}: LayerPanelItemProps) {
  return (
    <PanelListItem
      color={layer.color}
      name={layer.name}
      visible={layer.visible}
      onToggleVisibility={
        onToggleVisibility ? () => onToggleVisibility(layer.id) : undefined
      }
      onEdit={onEdit ? () => onEdit(layer) : undefined}
      onNameChange={onNameChange}
      onRemove={onRemove ? () => onRemove(layer.id) : undefined}
      dragged={dragged}
      onDragStart={onDragStart}
      handleDragOver={handleDragOver}
      handleDragEnd={handleDragEnd}
    />
  );
}
