import React from "react";
import { FaPalette } from "react-icons/fa6";
import {
  Checkbox,
  CollapsibleHeader,
  DropdownSelectInput,
  SectionHeader,
} from "@components";
import { COLOR_PALETTE_GROUPS } from "@constants/colors";
import type { ColorMode } from "@features/atlas/map";
import { PaletteDots } from "./PaletteDots";
import { useLayerColors } from "../../hooks/useLayerColors";

// Color modes
const COLOR_MODES: { key: ColorMode; label: string }[] = [
  { key: "standard", label: "Standard" },
  { key: "cumulative", label: "Timeline (Cumulative)" },
  { key: "yearly", label: "Timeline (Yearly)" },
];

export function ColorsSettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const {
    colorHomeCountry,
    setColorHomeCountry,
    colorVisitedCountries,
    setColorVisitedCountries,
    colorUpcomingVisits,
    setColorUpcomingVisits,
    colorPalettes,
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
        icon={<FaPalette />}
        label="Colors"
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <div className="space-y-6">
          {/* Display Options Section */}
          <section>
            <SectionHeader title="Display Options" />
            <div className="flex flex-col gap-3 mb-2">
              <Checkbox
                checked={!!colorHomeCountry}
                onChange={setColorHomeCountry}
                label="Show home country"
              />
              <Checkbox
                checked={!!colorVisitedCountries}
                onChange={setColorVisitedCountries}
                label="Show visited countries"
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
            <SectionHeader title="Color Palettes" />
            <div className="mb-2">
              {COLOR_MODES.map((mode) => (
                <div key={mode.key} className="mb-4">
                  <label className="font-medium block mb-1">{mode.label}</label>
                  <DropdownSelectInput
                    options={groupedPaletteOptions}
                    value={colorPalettes[mode.key]}
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
