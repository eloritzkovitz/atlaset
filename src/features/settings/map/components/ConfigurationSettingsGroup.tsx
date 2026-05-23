import React from "react";
import { FaDraftingCompass } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, SelectInput } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { MAP_CONFIG_OPTIONS } from "@features/settings";

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
  } = useMapView();

  return (
    <>
      <CollapsibleHeader
        icon={<FaDraftingCompass />}
        label={t("mapSettings.configuration")}
        expanded={showMapSettings}
        onToggle={() => setShowMapSettings((v) => !v)}
      />
      {showMapSettings && (
        <div>
          <SelectInput
            label={t("mapSettings.projection")}
            value={projection}
            onChange={(v) => setProjection(String(v))}
            options={MAP_CONFIG_OPTIONS.projection}
          />
          <SelectInput
            label={t("mapSettings.baseColor")}
            value={baseColor}
            onChange={(v) => setBaseColor(String(v))}
            options={MAP_CONFIG_OPTIONS.baseColor}
          />
          <SelectInput
            label={t("mapSettings.borderColor")}
            value={borderColor}
            onChange={(v) => setBorderColor(String(v))}
            options={MAP_CONFIG_OPTIONS.strokeColor}
          />
          <SelectInput
            label={t("mapSettings.borderWidth")}
            value={borderWidth}
            onChange={(v) => setBorderWidth(Number(v))}
            options={MAP_CONFIG_OPTIONS.strokeWidth}
          />
        </div>
      )}
    </>
  );
}
