import React from "react";
import { BrandCopyright, GitHubButton, Tooltip } from "@components";
import { getScaleBarLabel, type Coordinates } from "@features/atlas/map";

interface MapFooterProps {
  zoom: number;
  coords: Coordinates | null;
  latitude: number;
  barPx?: number;
}

export const MapFooter: React.FC<MapFooterProps> = ({
  zoom,
  coords,
  latitude,
  barPx = 100,
}) => {
  return (
    <footer
      className="bg-surface-alt/50 rounded-t-lg fixed end-6 bottom-0 z-50 text-muted px-4 py-0.5 text-xs min-w-[220px] select-none flex items-center justify-between gap-4"
      aria-label="Map footer"
    >
      <div className="flex items-center gap-2">
        <BrandCopyright className="text-xs" logoSize={16} />
        <GitHubButton className="ms-3 !text-muted" />
      </div>
      <span>
        <Tooltip content={`Zoom: x${zoom.toFixed(1)}`} position="top">
          <span className="me-2">{`x${zoom.toFixed(1)}`}</span>
        </Tooltip>
        {coords ? (
          <Tooltip content={`Latitude, Longitude`} position="top">
            <span>{`${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`}</span>
          </Tooltip>
        ) : (
          <span className="opacity-50">—</span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <div
          className="h-1 bg-muted/50 rounded"
          style={{ width: barPx }}
          aria-hidden="true"
        />
        <Tooltip content="Scale bar" position="top">
          <span className="text-xs" aria-label="Scale bar">
            {getScaleBarLabel(zoom, latitude, barPx)}
          </span>
        </Tooltip>
      </div>
    </footer>
  );
};
