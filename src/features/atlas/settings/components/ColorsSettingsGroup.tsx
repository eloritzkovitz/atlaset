import React from "react";
import { useTranslation } from "react-i18next";
import {
  CollapsibleHeader,
  DropdownSelectInput,
  NumberInput,
  SectionHeader,
} from "@components";
import { COLOR_PALETTE_GROUPS } from "@constants/colorPalettes";
import { ICONS } from "@constants/icons";
import type { ColorMode } from "@features/atlas/shared";
import { PaletteDots } from "./PaletteDots";
import { useMapColors } from "../hooks/useMapColors";

const COLOR_MODES: ColorMode[] = ["standard", "atlas", "cumulative", "yearly"];

export function ColorsSettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const { numAtlasColors, setNumAtlasColors, colorPalettes, setPalette } =
    useMapColors();
  const { t } = useTranslation("atlas");

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
        icon={<ICONS.mapSettings.colors />}
        label={t("mapSettings.colors.title")}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <div className="space-y-6">
          {/* Rules Section */}
          <section>
            <SectionHeader title={t("mapSettings.colors.rules.title")} />
            <div className="flex items-center gap-2">
              <span>{t("mapSettings.colors.rules.numAtlasColors")}</span>
              <NumberInput
                label=""
                value={numAtlasColors}
                min={4}
                max={5}
                onChange={(v) => setNumAtlasColors(v)}
              />
            </div>
          </section>

          {/* Color Palettes Section */}
          <section>
            <SectionHeader
              title={t("mapSettings.colors.colorPalettes.title")}
            />
            <div className="mb-2">
              {COLOR_MODES.map((mode) => (
                <div key={mode} className="mb-4">
                  <label className="font-medium block mb-1">
                    {t(`mapSettings.colors.colorPalettes.${mode}`)}
                  </label>
                  <DropdownSelectInput
                    options={groupedPaletteOptions}
                    value={colorPalettes[mode]}
                    onChange={(val: string | string[]) =>
                      setPalette(mode, Array.isArray(val) ? val[0] : val)
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
