import { PanelListItem } from "@components";
import { VISITED_LAYER_ID } from "../constants/layers";
import type { Layer } from "../types";

interface LayerPanelItemProps {
  layer: Layer;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
  onEdit: (layer: Layer) => void;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  showEdit?: boolean;
  showCenter?: boolean;
};

export function LayerPanelItem({
  layer,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  onEdit,
  onToggleVisibility,
  onRemove,
}: LayerPanelItemProps) {
  const isVisited = layer.id === VISITED_LAYER_ID;

  return (
    <PanelListItem
      color={layer.color}
      name={layer.name}
      visible={layer.visible}
      onToggleVisibility={() => onToggleVisibility(layer.id)}
      onEdit={() => onEdit(layer)}
      onRemove={() => onRemove(layer.id)}
      removeDisabled={isVisited}
      dragged={dragged}
      onDragStart={onDragStart}
      handleDragOver={handleDragOver}
      handleDragEnd={handleDragEnd}      
    />
  );
}
