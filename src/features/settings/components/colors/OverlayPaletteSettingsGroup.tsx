import React from "react";
import { FaBrush } from "react-icons/fa6";
import { CollapsibleHeader, DropdownSelectInput } from "@components";
import { COLOR_PALETTES } from "@constants/colors";
import type { OverlayMode } from "@types";
import { PaletteDots } from "./PaletteDots";
import { useOverlayPaletteSettings } from "../../hooks/useOverlayPaletteSettings";

// Overlay modes
const OVERLAY_MODES: { key: OverlayMode; label: string }[] = [
  { key: "standard", label: "Standard" },
  { key: "cumulative", label: "Timeline (Cumulative)" },
  { key: "yearly", label: "Timeline (Yearly)" },  
];

export function OverlayPaletteSettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const { overlayPalettes, setPalette } = useOverlayPaletteSettings();

  // Prepare options for DropdownSelectInput
  const paletteOptions = COLOR_PALETTES.map((palette) => ({
    label: (
      <span style={{ display: "flex", alignItems: "center" }}>
        <PaletteDots colors={palette.colors} />
        <span>{palette.name}</span>
      </span>
    ),
    value: palette.name,
  }));

  return (
    <>
      <CollapsibleHeader
        icon={<FaBrush />}
        label="Overlay Palettes"
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <div className="mb-4">
          {OVERLAY_MODES.map((mode) => (
            <div key={mode.key} className="mb-4">
              <label className="font-medium block mb-1">
                {mode.label}
              </label>
              <DropdownSelectInput
                options={paletteOptions}
                value={overlayPalettes[mode.key]}
                onChange={(val: string | string[]) =>
                  setPalette(mode.key, Array.isArray(val) ? val[0] : val)
                }
                className="min-w-[180px] select-input bg-gray-100"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
