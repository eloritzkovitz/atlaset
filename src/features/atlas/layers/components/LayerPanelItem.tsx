import { PanelListItem } from "@components";
import type { Layer } from "../types";

interface LayerPanelItemProps {
  layer: Layer;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
  onDownload?: () => void;
  onEdit?: (layer: Layer) => void;
  onNameChange?: (newName: string) => void;
  onDuplicate?: () => void;
  onCreateList?: (layer: Layer) => void;
  onToggleVisibility?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function LayerPanelItem({
  layer,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  onDownload,
  onEdit,
  onNameChange,
  onDuplicate,
  onCreateList,
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
      onDownload={onDownload}
      onEdit={onEdit ? () => onEdit(layer) : undefined}
      onNameChange={onNameChange}
      onDuplicate={onDuplicate ? () => onDuplicate() : undefined}
      onCreateList={onCreateList ? () => onCreateList(layer) : undefined}
      onRemove={onRemove ? () => onRemove(layer.id) : undefined}
      dragged={dragged}
      onDragStart={onDragStart}
      handleDragOver={handleDragOver}
      handleDragEnd={handleDragEnd}
    />
  );
}
