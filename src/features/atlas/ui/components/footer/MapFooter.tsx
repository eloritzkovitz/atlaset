import React from "react";
import { FaGithub } from "react-icons/fa6";
import { Tooltip } from "@components";
import { getScaleBarLabel } from "@features/atlas/map";
import { getCurrentYear } from "@utils/date";

interface MapFooterProps {
  zoom: number;
  coords: [number, number] | null;
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
      className="bg-gray-950/50 rounded-t-lg fixed right-6 bottom-0 z-50 text-muted px-4 py-0.5 text-xs min-w-[220px] select-none flex items-center justify-between gap-4"
      aria-label="Map footer"
    >
      <div className="flex items-center gap-2">
        <span>© {getCurrentYear()} Atlaset</span>
        <a
          href="https://github.com/eloritzkovitz/atlaset"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-muted hover:text-muted/70 ml-1 inline-flex items-center"
          aria-label="Atlaset GitHub repository"
        >
          <FaGithub className="mr-1" size={14} />
          atlaset
        </a>
      </div>
      <span>
        <Tooltip content={`Zoom: x${zoom.toFixed(1)}`} position="top">
          <span className="mr-2">{`x${zoom.toFixed(1)}`}</span>
        </Tooltip>
        {coords ? (
          <Tooltip content={`Longitude, Latitude`} position="top">
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
