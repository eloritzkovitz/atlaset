import React from "react";

interface MapCoordinatesDisplayProps {
  coords: [number, number] | null;
}

export const MapCoordinatesDisplay: React.FC<MapCoordinatesDisplayProps> = ({
  coords,
}) => {
  if (!coords) return null;
  return (
    <div className="fixed right-0 bottom-0 z-50 text-gray-800/50 dark:text-white/50 px-4 py-2 text-xs min-w-[180px] text-center pointer-events-none select-none">
      <span>
        {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
      </span>
    </div>
  );
};
