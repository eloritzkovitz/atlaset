import React from "react";
import { FaBrush } from "react-icons/fa6";
import { Checkbox, CollapsibleHeader, DropdownSelectInput } from "@components";
import { COLOR_PALETTE_GROUPS } from "@constants/colors";
import type { OverlayMode } from "@types";
import { PaletteDots } from "./PaletteDots";
import { useOverlayPaletteSettings } from "../../hooks/useOverlayPaletteSettings";
import { useHomeCountry } from "@features/settings/hooks/useHomeCountry";

// Overlay modes
const OVERLAY_MODES: { key: OverlayMode; label: string }[] = [
  { key: "standard", label: "Standard" },
  { key: "cumulative", label: "Timeline (Cumulative)" },
  { key: "yearly", label: "Timeline (Yearly)" },
];

export function OverlaySettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const { overlayPalettes, setPalette } = useOverlayPaletteSettings();
  const { colorHomeCountry, setColorHomeCountry } = useHomeCountry();

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
        icon={<FaBrush />}
        label="Overlays"
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      <Checkbox
        checked={!!colorHomeCountry}
        onChange={setColorHomeCountry}
        label="Color home country on map"
      />
      <div className="my-2"/>
      {expanded && (
        <div className="mb-4">
          {OVERLAY_MODES.map((mode) => (
            <div key={mode.key} className="mb-4">
              <label className="font-medium block mb-1">{mode.label}</label>
              <DropdownSelectInput
                options={groupedPaletteOptions}
                value={overlayPalettes[mode.key]}
                onChange={(val: string | string[]) =>
                  setPalette(mode.key, Array.isArray(val) ? val[0] : val)
                }
                className="min-w-[180px]"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
