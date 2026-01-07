import React from "react";
import { FaMap } from "react-icons/fa";
import { CollapsibleHeader, SelectInput } from "@components";
import { MAP_OPTIONS } from "@constants";
import { useMapView } from "@contexts/MapViewContext";

export function MapSettingsGroup() {
  const [showMapSettings, setShowMapSettings] = React.useState(true);
  const {
    projection,
    setProjection,
    borderColor,
    setBorderColor,
    borderWidth,
    setBorderWidth,
  } = useMapView();

  return (
    <>
      <CollapsibleHeader
        icon={<FaMap />}
        label="Map"
        expanded={showMapSettings}
        onToggle={() => setShowMapSettings((v) => !v)}
      />
      {showMapSettings && (
        <div>
          <SelectInput
            label="Map Projection"
            value={projection}
            onChange={(v) => setProjection(String(v))}
            options={MAP_OPTIONS.projection}
          />
          <SelectInput
            label="Border Color"
            value={borderColor}
            onChange={(v) => setBorderColor(String(v))}
            options={MAP_OPTIONS.strokeColor}
          />
          <SelectInput
            label="Border Width"
            value={borderWidth}
            onChange={(v) => setBorderWidth(Number(v))}
            options={MAP_OPTIONS.strokeWidth}
          />
        </div>
      )}
    </>
  );
}
