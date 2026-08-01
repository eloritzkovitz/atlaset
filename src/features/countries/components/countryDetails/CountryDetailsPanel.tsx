import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TabButton } from "@components";
import type { Visit } from "@features/visits";
import { CountryAffiliationsContent } from "./CountryAffiliationsContent";
import { CountryDetailsContent } from "./CountryDetailsContent";
import { CountryTerritoriesContent } from "./CountryTerritoriesContent";
import { CountryVisitsContent } from "./CountryVisitsContent";
import type { Country, CountryDetailsTab, Currency } from "../../types";
import { getCountryTerritoryRelations } from "../../utils/countryData";

interface CountryDetailsPanelProps {
  country: Country;
  countries: Country[];
  currencies: Currency[];
  categorizedVisits: {
    past: Visit[];
    upcoming: Visit[];
    tentative: Visit[];
  };
  initialTab?: CountryDetailsTab;
  activeTab?: CountryDetailsTab;
  resetTabOnClose?: boolean;
  isOpen?: boolean;
  onTabChange?: (tab: CountryDetailsTab) => void;
  onSelectCountry?: (isoCode: string) => void;
  className?: string;
}

export function CountryDetailsPanel({
  country,
  countries,
  currencies,
  categorizedVisits,
  initialTab = "overview",
  activeTab: externalActiveTab,
  resetTabOnClose = false,
  isOpen = true,
  onTabChange,
  onSelectCountry,
  className = "",
}: CountryDetailsPanelProps) {
  const { t } = useTranslation("atlas");

  const tabLabels: Record<CountryDetailsTab, string> = {
    overview: t("countries.details.tabs.overview"),
    territories: t("countries.details.tabs.territories"),
    affiliations: t("countries.details.tabs.affiliations"),
    visits: t("countries.details.tabs.visits"),
  };

  const [internalTab, setInternalTab] = useState<CountryDetailsTab>(initialTab);

  const activeTab = externalActiveTab ?? internalTab;

  // Determine available tabs based on country relations
  const territoryRelations = useMemo(
    () =>
      country?.isoCode ? getCountryTerritoryRelations(country) : undefined,
    [country],
  );

  const currentHasTerritoriesTab = !!territoryRelations?.hasRelations;
  const currentHasAffiliationsTab = !!(
    (country?.memberOf && country.memberOf.length > 0) ||
    country?.unMember
  );

  const tabs = useMemo(() => {
    const availableTabs: CountryDetailsTab[] = ["overview"];
    if (currentHasTerritoriesTab) availableTabs.push("territories");
    if (currentHasAffiliationsTab) availableTabs.push("affiliations");
    availableTabs.push("visits");
    return availableTabs;
  }, [currentHasTerritoriesTab, currentHasAffiliationsTab]);

  // Reset to overview tab when modal is closed, if resetTabOnClose is true
  useEffect(() => {
    if (resetTabOnClose && !isOpen) {
      setInternalTab("overview");
    }
  }, [resetTabOnClose, isOpen]);

  // Reset active tab if country changes or if current active tab is no longer available
  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      if (externalActiveTab) {
        onTabChange?.("overview");
      } else {
        setInternalTab("overview");
      }
    }
  }, [country?.isoCode, tabs, activeTab, externalActiveTab, onTabChange]);

  // Handle tab change
  const handleTabChange = (tab: CountryDetailsTab) => {
    if (externalActiveTab === undefined) {
      setInternalTab(tab);
    }
    onTabChange?.(tab);
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      <div className="flex gap-2 mb-4 shrink-0">
        {tabs.map((tab) => (
          <TabButton
            key={tab}
            active={activeTab === tab}
            onClick={() => handleTabChange(tab)}
          >
            {tabLabels[tab]}
          </TabButton>
        ))}
      </div>

      <div className="relative flex-1 min-h-0 overflow-y-auto px-2">
        <div key={activeTab} className="transition-opacity duration-300">
          {activeTab === "overview" && (
            <CountryDetailsContent
              country={country}
              currencies={currencies}
              onSelectCountry={onSelectCountry}
            />
          )}
          {activeTab === "territories" && currentHasTerritoriesTab && (
            <CountryTerritoriesContent
              country={country}
              countries={countries}
              onSelectCountry={onSelectCountry}
            />
          )}
          {activeTab === "affiliations" && currentHasAffiliationsTab && (
            <CountryAffiliationsContent country={country} />
          )}
          {activeTab === "visits" && (
            <CountryVisitsContent visits={categorizedVisits} />
          )}
        </div>
      </div>
    </div>
  );
}
