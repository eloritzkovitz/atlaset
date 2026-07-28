import { useRef } from "react";
import { PanelListItem, Tooltip } from "@components";
import { ICONS } from "@constants/icons";
import { useMapShare } from "@features/atlas/export/hooks/useMapShare";
import { exportMapDataAsJson } from "@features/atlas/export/utils/mapExport";
import { encodeMapData } from "@features/atlas/export/utils/mapShare";
import { useAuth } from "@features/user/auth";
import { useTooltipTarget } from "@hooks";
import { MapPreview } from "./MapPreview";
import type { SavedMap } from "../types";

interface SavedMapPanelItemProps {
  map: SavedMap;
  onView?: () => void;
  onNameChange?: (newName: string) => void;
  onDuplicate?: () => void;
  onRemove?: (id: string) => void;
  showEdit?: boolean;
  showRemove?: boolean;
}

export function SavedMapPanelItem({
  map,
  onView,
  onNameChange,
  onDuplicate,
  onRemove,
  showEdit = true,
  showRemove = true,
}: SavedMapPanelItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { activeTarget, registerTarget } = useTooltipTarget();

  // Encode map data for sharing
  const code = encodeMapData({
    layers: (map.layers || [])
      .filter((l) => l.visible && l.countries && l.countries.length > 0)
      .map((l) => ({
        name: l.name,
        color: l.color,
        countries: l.countries,
      })),
    markers: Array.isArray(map.markers)
      ? map.markers
          .filter((m) => m.visible !== false)
          .map((m) => ({
            name: m.name,
            coordinates: m.coordinates,
            color: m.color,
            description: m.description,
          }))
      : [],
    mapName: map.name,
    sharer: user?.displayName || undefined,
  });
  const { copyShareUrl } = useMapShare(code);

  const handleDownload = () => {
    exportMapDataAsJson(map);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <PanelListItem
        name={map.name || "Untitled Map"}
        color="#ffffff"
        icon={
          <ICONS.savedMaps
            className="text-xl cursor-pointer"
            {...registerTarget("Map Preview")}
          />
        }
        onView={onView}
        onNameChange={
          showEdit && onNameChange
            ? (newName) => onNameChange(newName)
            : undefined
        }
        onCopytoClipboard={copyShareUrl}
        onDownload={handleDownload}
        onDuplicate={onDuplicate}
        onRemove={showRemove && onRemove ? () => onRemove(map.id) : undefined}
        removeDisabled={false}
        visible={true}
      />

      {activeTarget && (
        <Tooltip
          target={activeTarget.element}
          position="bottom"
          className="!bg-bg !opacity-100"
          content={
            <div className="flex items-center justify-center border-none rounded p-2">
              <MapPreview map={map} />
            </div>
          }
        />
      )}
    </div>
  );
}
