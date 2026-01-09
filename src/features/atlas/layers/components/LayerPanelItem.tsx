import { PanelListItem } from "@components";
import { VISITED_LAYER_ID } from "../constants/layers";
import type { Layer } from "../types";

interface LayerPanelItemProps {
  layer: Layer;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
  showEdit?: boolean;
  onEdit?: (layer: Layer) => void;
  onToggleVisibility?: (id: string) => void;
  showRemove?: boolean;
  onRemove?: (id: string) => void;
  showCenter?: boolean;
}

export function LayerPanelItem({
  layer,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  showEdit,
  onEdit,
  onToggleVisibility,
  showRemove,
  onRemove,
}: LayerPanelItemProps) {
  const isVisited = layer.id === VISITED_LAYER_ID;

  return (
    <PanelListItem
      color={layer.color}
      name={layer.name}
      visible={layer.visible}
      onToggleVisibility={
        showEdit !== false && onToggleVisibility
          ? () => onToggleVisibility(layer.id)
          : undefined
      }
      onEdit={showEdit !== false && onEdit ? () => onEdit(layer) : undefined}
      onRemove={
        showRemove !== false && onRemove ? () => onRemove(layer.id) : undefined
      }
      removeDisabled={isVisited}
      dragged={dragged}
      onDragStart={onDragStart}
      handleDragOver={handleDragOver}
      handleDragEnd={handleDragEnd}
    />
  );
}
