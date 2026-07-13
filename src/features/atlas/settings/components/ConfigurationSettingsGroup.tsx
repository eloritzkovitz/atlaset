import React from "react";
import { useTranslation } from "react-i18next";
import { FaDraftingCompass } from "react-icons/fa";
import { CollapsibleHeader, SelectInput } from "@components";
import { MAP_CONFIG_OPTIONS, SettingsToggle } from "@features/settings";
import { useMapSettings } from "../hooks/useMapSettings";

export function ConfigurationSettingsGroup() {
  const { t } = useTranslation("atlas");
  const [showMapSettings, setShowMapSettings] = React.useState(true);
  const {
    projection,
    setProjection,
    baseColor,
    setBaseColor,
    borderColor,
    setBorderColor,
    borderWidth,
    setBorderWidth,
    showSmallCountryOverlays,
    setShowSmallCountryOverlays,
  } = useMapSettings();

  return (
    <>
      <CollapsibleHeader
        icon={<FaDraftingCompass />}
        label={t("mapSettings.configuration.title")}
        expanded={showMapSettings}
        onToggle={() => setShowMapSettings((v) => !v)}
      />
      {showMapSettings && (
        <div>
          <SelectInput
            label={t("mapSettings.configuration.projection")}
            value={projection}
            onChange={(v) => setProjection(String(v))}
            options={MAP_CONFIG_OPTIONS.projection}
          />
          <SelectInput
            label={t("mapSettings.configuration.baseColor")}
            value={baseColor}
            onChange={(v) => setBaseColor(String(v))}
            options={MAP_CONFIG_OPTIONS.baseColor}
          />
          <SelectInput
            label={t("mapSettings.configuration.borderColor")}
            value={borderColor}
            onChange={(v) => setBorderColor(String(v))}
            options={MAP_CONFIG_OPTIONS.strokeColor}
          />
          <SelectInput
            label={t("mapSettings.configuration.borderWidth")}
            value={borderWidth}
            onChange={(v) => setBorderWidth(Number(v))}
            options={MAP_CONFIG_OPTIONS.strokeWidth}
          />
          <SettingsToggle
            label={t("mapSettings.configuration.showSmallCountryOverlays")}
            tooltip={t(
              "mapSettings.configuration.showSmallCountryOverlaysTooltip",
            )}
            checked={showSmallCountryOverlays}
            onChange={(checked) => setShowSmallCountryOverlays(checked)}
            variant="input"
          />
        </div>
      )}
    </>
  );
}
