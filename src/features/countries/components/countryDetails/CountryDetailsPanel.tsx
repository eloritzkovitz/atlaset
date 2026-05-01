import { useState, useEffect } from "react";
import { TabButton } from "@components";
import {
  CountryDetailsContent,
  getCountryTerritories,
  type Country,
  type Currency,
} from "@features/countries";
import { useTranslation } from "react-i18next";
import { useCountryData } from "../../hooks/useCountryData";
import type { Visit } from "@features/visits";
import { CountryTerritoriesContent } from "./CountryTerritoriesContent";
import { CountryAffiliationsContent } from "./CountryAffiliationsContent";
import { CountryVisitsContent } from "./CountryVisitsContent";

type CountryDetailsTab = "overview" | "territories" | "affiliations" | "visits";

interface CountryDetailsPanelProps {
  country: Country;
  currencies: Currency[];
  categorizedVisits: {
    past: Visit[];
    upcoming: Visit[];
    tentative: Visit[];
  };
  initialTab?: CountryDetailsTab;
  resetTabOnClose?: boolean;
  isOpen?: boolean;
  onTabChange?: (tab: CountryDetailsTab) => void;
  onSelectCountry?: (isoCode: string) => void;
  className?: string;
}

export function CountryDetailsPanel({
  country,
  currencies,
  categorizedVisits,
  initialTab = "overview",
  resetTabOnClose = false,
  isOpen = true,
  onTabChange,
  onSelectCountry,
  className,
}: CountryDetailsPanelProps) {
  const { t } = useTranslation("atlas");

  const tabLabels: Record<CountryDetailsTab, string> = {
    overview: t("country.tabs.overview"),
    territories: t("country.tabs.territories"),
    affiliations: t("country.tabs.affiliations"),
    visits: t("country.tabs.visits"),
  };

  const { countries } = useCountryData();
  const [activeTab, setActiveTab] = useState<CountryDetailsTab>(initialTab);

  // Reset to overview tab when modal is closed, if resetTabOnClose is true
  useEffect(() => {
    if (resetTabOnClose && !isOpen) setActiveTab("overview");
  }, [resetTabOnClose, isOpen]);

  // Reset to overview tab when country changes
  useEffect(() => {
    setActiveTab("overview");
  }, [country?.isoCode]);

  // Handle tab change
  const handleTabChange = (tab: CountryDetailsTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Determine if the country has territories to show in the Territories tab
  const getTerritoriesTab = (country: Country) => {
    try {
      const rel =
        country && country.isoCode ? getCountryTerritories(country) : undefined;
      return rel && rel.hasRelations;
    } catch {
      return false;
    }
  };

  // Determine which tabs to show based on country data
  const currentHasTerritoriesTab = getTerritoriesTab(country);
  const currentHasAffiliationsTab = !!(
    (country?.memberOf && country.memberOf.length > 0) ||
    country?.unMember
  );

  const tabs: CountryDetailsTab[] = ["overview"];
  if (currentHasTerritoriesTab) tabs.push("territories");
  if (currentHasAffiliationsTab) tabs.push("affiliations");
  tabs.push("visits");

  return (
    <>
      <div className="flex gap-2 mb-4">
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
      <div
        className={`relative flex-1 overflow-y-auto mt-4 -mx-2 ${className || ""}`}
      >
        <div key={activeTab} className="transition-opacity duration-300 px-4">
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
    </>
  );
}
