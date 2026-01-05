import React from "react";
import { FaLayerGroup } from "react-icons/fa6";
import { Checkbox, CollapsibleHeader, DropdownSelectInput } from "@components";
import { COLOR_PALETTE_GROUPS } from "@constants/colors";
import type { LayerMode } from "@features/atlas/layers";
import { PaletteDots } from "./PaletteDots";
import { useLayerColors } from "../../hooks/useLayerColors";

// Layer modes
const LAYER_MODES: { key: LayerMode; label: string }[] = [
  { key: "standard", label: "Standard" },
  { key: "cumulative", label: "Timeline (Cumulative)" },
  { key: "yearly", label: "Timeline (Yearly)" },
];

export function LayerSettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const {
    colorHomeCountry,
    setColorHomeCountry,
    colorUpcomingVisits,
    setColorUpcomingVisits,
    layerPalettes,
    setPalette,
  } = useLayerColors();

  // Prepare options for DropdownSelectInput
  const groupedPaletteOptions = COLOR_PALETTE_GROUPS.map((group) => ({
    label: group.label,
    options: group.palettes.map((palette) => ({
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <PaletteDots colors={palette.colors} />
          <span>{palette.name}</span>
        </span>
      ),
      value: palette.name,
    })),
  }));

  return (
    <>
      <CollapsibleHeader
        icon={<FaLayerGroup />}
        label="Layers"
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <div className="space-y-6">
          {/* Display Options Section */}
          <section>
            <h4 className="font-semibold text-sm text-muted mb-2">DISPLAY OPTIONS</h4>
            <div className="flex flex-col gap-3 mb-2">
              <Checkbox
                checked={!!colorHomeCountry}
                onChange={setColorHomeCountry}
                label="Show home country"
              />
              <Checkbox
                checked={!!colorUpcomingVisits}
                onChange={setColorUpcomingVisits}
                label="Show upcoming new visits"
              />
            </div>
          </section>

          {/* Color Palettes Section */}
          <section>
            <h4 className="font-semibold text-sm text-muted mb-2">COLOR PALETTES</h4>
            <div className="mb-2">
              {LAYER_MODES.map((mode) => (
                <div key={mode.key} className="mb-4">
                  <label className="font-medium block mb-1">{mode.label}</label>
                  <DropdownSelectInput
                    options={groupedPaletteOptions}
                    value={layerPalettes[mode.key]}
                    onChange={(val: string | string[]) =>
                      setPalette(mode.key, Array.isArray(val) ? val[0] : val)
                    }
                    className="min-w-[180px]"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
