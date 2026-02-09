import { FaMap } from "react-icons/fa6";
import { PanelListItem } from "@components";
import type { SavedMap } from "../types";

interface SavedMapPanelItemProps {
  map: SavedMap;
  onView?: () => void;
  onNameChange?: (newName: string) => void;
  onRemove?: (id: string) => void;
  showEdit?: boolean;
  showRemove?: boolean;
}

export function SavedMapPanelItem({
  map,
  onView,
  onNameChange,
  onRemove,
  showEdit = true,
  showRemove = true,
}: SavedMapPanelItemProps) {
  return (
    <PanelListItem
      name={map.name || "Untitled Map"}
      color="#ffffff"
      icon={<FaMap className="text-xl" />}
      onView={onView}
      onNameChange={showEdit && onNameChange ? (newName) => onNameChange(newName) : undefined}
      onRemove={showRemove && onRemove ? () => onRemove(map.id) : undefined}
      removeDisabled={false}
      visible={true}
    />
  );
}
