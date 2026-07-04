import React from "react";
import { useTranslation } from "react-i18next";
import { FaPalette } from "react-icons/fa6";
import {
  Checkbox,
  CollapsibleHeader,
  DropdownSelectInput,
  NumberInput,
  SectionHeader,
} from "@components";
import { COLOR_PALETTE_GROUPS } from "@constants/colorPalettes";
import type { ColorMode } from "@features/atlas/map";
import { PaletteDots } from "./PaletteDots";
import { useLayerColors } from "../hooks/useLayerColors";

const COLOR_MODES: { key: ColorMode; label: string }[] = [
  { key: "standard", label: "mapSettings.colors.standard" },
  { key: "atlas", label: "mapSettings.colors.atlas" },
  { key: "cumulative", label: "mapSettings.colors.timelineCumulative" },
  { key: "yearly", label: "mapSettings.colors.timelineYearly" },
];

export function ColorsSettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const {
    colorHomeCountry,
    setColorHomeCountry,
    colorVisitedCountries,
    setColorVisitedCountries,
    colorFutureVisits,
    setColorFutureVisits,
    colorWantToVisitCountries,
    setColorWantToVisitCountries,
    numAtlasColors,
    setNumAtlasColors,
    colorPalettes,
    setPalette,
  } = useLayerColors();
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
        icon={<FaPalette />}
        label={t("mapSettings.colors.title")}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <div className="space-y-6">
          {/* Display Options Section */}
          <section>
            <SectionHeader title={t("mapSettings.colors.displayOptions")} />
            <div className="flex flex-col gap-3 mb-2">
              <Checkbox
                checked={!!colorHomeCountry}
                onChange={setColorHomeCountry}
                label={t("mapSettings.colors.showHomeCountry")}
              />
              <Checkbox
                checked={!!colorVisitedCountries}
                onChange={setColorVisitedCountries}
                label={t("mapSettings.colors.showVisitedCountries")}
              />
              <Checkbox
                checked={!!colorFutureVisits}
                onChange={setColorFutureVisits}
                label={t("mapSettings.colors.showFutureVisits")}
              />
              <Checkbox
                checked={!!colorWantToVisitCountries}
                onChange={setColorWantToVisitCountries}
                label={t("mapSettings.colors.showWantToVisit")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>{t("mapSettings.colors.numAtlasColors")}</span>
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
            <SectionHeader title={t("mapSettings.colors.colorPalette")} />
            <div className="mb-2">
              {COLOR_MODES.map((mode) => (
                <div key={mode.key} className="mb-4">
                  <label className="font-medium block mb-1">
                    {t(mode.label)}
                  </label>
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
