import { FaMap } from "react-icons/fa6";
import { PanelListItem, Tooltip } from "@components";
import type { SavedMap } from "../types";
import { useRef } from "react";
import { MapPreview } from "./MapPreview";

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
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <PanelListItem
        name={map.name || "Untitled Map"}
        color="#ffffff"
        icon={
          <Tooltip
            content={
              <div className="flex items-center justify-center border-none rounded p-2">
                <MapPreview map={map} />
              </div>
            }
            position="bottom"
            className="!bg-bg !opacity-100"
          >
            <FaMap className="text-xl" />
          </Tooltip>
        }
        onView={onView}
        onNameChange={
          showEdit && onNameChange
            ? (newName) => onNameChange(newName)
            : undefined
        }
        onRemove={showRemove && onRemove ? () => onRemove(map.id) : undefined}
        removeDisabled={false}
        visible={true}
      />
    </div>
  );
}
