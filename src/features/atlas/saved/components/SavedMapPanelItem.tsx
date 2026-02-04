import { PanelListItem } from "@components";
import type { SavedMap } from "../types";

interface SavedMapPanelItemProps {
  map: SavedMap;
  onView?: () => void;
  onEdit?: (map: SavedMap) => void;
  onRemove?: (id: string) => void;
  showEdit?: boolean;
  showRemove?: boolean;
}

export function SavedMapPanelItem({
  map,
  onView,
  onEdit,
  onRemove,
  showEdit = true,
  showRemove = true,
}: SavedMapPanelItemProps) {
  return (
    <PanelListItem
      name={map.name || "Untitled Map"}
      color={"#ffffff"}
      onView={onView}
      onEdit={showEdit && onEdit ? () => onEdit(map) : undefined}
      onRemove={showRemove && onRemove ? () => onRemove(map.id) : undefined}
      removeDisabled={false}
      visible={true}
    />
  );
}
