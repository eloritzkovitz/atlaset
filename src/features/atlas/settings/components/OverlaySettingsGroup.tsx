import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CollapsibleHeader, SectionHeader } from "@components";
import { ICONS } from "@constants/icons";
import { SettingsToggle } from "@features/settings";
import { useMapOverlays } from "../hooks/useMapOverlays";

export function OverlaySettingsGroup() {
  const [expanded, setExpanded] = React.useState(true);
  const {
    showSmallCountryOverlays,
    setShowSmallCountryOverlays,
    includeIntegralRegions,
    setIncludeIntegralRegions,
    showHomeCountry,
    setShowHomeCountry,
    showVisitedCountries,
    setShowVisitedCountries,
    showFutureVisits,
    setShowFutureVisits,
    showWantToVisitCountries,
    setShowWantToVisitCountries,
  } = useMapOverlays();
  const { t } = useTranslation("atlas");

  return (
    <>
      <CollapsibleHeader
        icon={<ICONS.mapSettings.overlays className="text-xl" />}
        label={t("mapSettings.overlays.title", "Overlays")}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <div className="space-y-6">
          <section>
            <div className="flex flex-col gap-3 mb-2">
              <SettingsToggle
                label={t("mapSettings.overlays.showSmallCountryOverlays")}
                tooltip={t(
                  "mapSettings.overlays.showSmallCountryOverlaysTooltip",
                )}
                checked={showSmallCountryOverlays}
                onChange={(checked) => setShowSmallCountryOverlays(checked)}
                variant="input"
              />
              <SettingsToggle
                label={t("mapSettings.overlays.includeIntegralRegions")}
                tooltip={t(
                  "mapSettings.overlays.includeIntegralRegionsTooltip",
                )}
                checked={includeIntegralRegions}
                onChange={(checked) => setIncludeIntegralRegions(checked)}
                variant="input"
              />
            </div>
          </section>

          <section>
            <div className="flex flex-col gap-3 mb-2">
              <SectionHeader title={t("mapSettings.overlays.tracking.title")} />
              <Checkbox
                checked={showHomeCountry}
                onChange={setShowHomeCountry}
                label={t("mapSettings.overlays.tracking.showHomeCountry")}
              />
              <Checkbox
                checked={showVisitedCountries}
                onChange={setShowVisitedCountries}
                label={t("mapSettings.overlays.tracking.showVisitedCountries")}
              />
              <Checkbox
                checked={showFutureVisits}
                onChange={setShowFutureVisits}
                label={t("mapSettings.overlays.tracking.showFutureVisits")}
              />
              <Checkbox
                checked={showWantToVisitCountries}
                onChange={setShowWantToVisitCountries}
                label={t("mapSettings.overlays.tracking.showWantToVisit")}
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
