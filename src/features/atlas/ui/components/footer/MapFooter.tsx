import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BrandCopyright, GitHubButton, Tooltip } from "@components";
import { useCountryData } from "@features/countries";
import { useExplorationStats } from "@features/dashboard/exploration/hooks/useExplorationStats";

interface MapFooterProps {
  zoom: number;
}

export const MapFooter: React.FC<MapFooterProps> = ({ zoom }) => {
  const [sovereignOnly, setSovereignOnly] = useState(false);
  const { countries } = useCountryData();
  const { totalCountries, visitedCountries } = useExplorationStats(
    countries,
    sovereignOnly,
  );
  const { t } = useTranslation("atlas");

  // Calculate the percentage of visited countries
  const coveragePercent =
    totalCountries > 0
      ? ((visitedCountries / totalCountries) * 100).toFixed(1)
      : "0.0";

  // Handler to toggle the sovereignOnly state
  const handleToggleSovereign = () => {
    setSovereignOnly((prev) => !prev);
  };

  return (
    <footer
      className="fixed bottom-0 end-6 z-50 flex min-w-[220px] select-none items-center justify-between gap-4 rounded-t-lg bg-surface-alt/50 px-4 py-0.5 text-xs text-muted"
      aria-label="Map footer"
    >
      <div className="flex items-center gap-2">
        <BrandCopyright className="text-xs" logoSize={16} />
        <GitHubButton className="ms-3 !text-muted" />
      </div>

      <div className="flex items-center gap-4">
        <Tooltip
          content={
            sovereignOnly
              ? t(
                  "footer.sovereignOnlyTooltip",
                  "World coverage: Sovereign states",
                )
              : t(
                  "footer.allCountriesTooltip",
                  "World coverage: All territories",
                )
          }
          position="top"
        >
          <button
            type="button"
            onClick={handleToggleSovereign}
            className="font-medium text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1"
          >
            {t(
              "footer.countriesExplored",
              "Countries explored: {{visited}}/{{total}} ({{percent}}%)",
              {
                visited: visitedCountries,
                total: totalCountries,
                percent: coveragePercent,
              },
            )}
          </button>
        </Tooltip>

        <Tooltip
          content={t("footer.zoomTooltip", "Zoom level: {{zoom}}x", {
            zoom: zoom.toFixed(1),
          })}
          position="top"
        >
          <span className="text-muted">{zoom.toFixed(1)}x</span>
        </Tooltip>
      </div>
    </footer>
  );
};
