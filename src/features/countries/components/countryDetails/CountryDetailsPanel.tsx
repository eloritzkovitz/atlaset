import { useState, useEffect } from "react";
import { TabButton } from "@components";
import {
  CountryDetailsContent,
  getCountryRelations,
  type Country,
  type Currency,
} from "@features/countries";
import type { Visit } from "@features/visits";
import { CountryRelationsContent } from "./CountryRelationsContent";
import { CountryVisitsContent } from "./CountryVisitsContent";

const tabLabels: Record<CountryDetailsTab, string> = {
  overview: "Overview",
  relations: "Relations",
  visits: "Visits",
};

type CountryDetailsTab = "overview" | "relations" | "visits";

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

  // Recalculate hasRelationsTab for the current country
  const getRelationsTab = (country: Country) => {
    try {
      const rel =
        country && country.isoCode
          ? getCountryRelations(country.isoCode)
          : undefined;
      return rel && rel.hasRelations;
    } catch {
      return false;
    }
  };

  const currentHasRelationsTab = getRelationsTab(country);
  const tabs: CountryDetailsTab[] = currentHasRelationsTab
    ? ["overview", "relations", "visits"]
    : ["overview", "visits"];

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
          {activeTab === "relations" && currentHasRelationsTab && (
            <CountryRelationsContent
              country={country}
              onSelectCountry={onSelectCountry}
            />
          )}
          {activeTab === "visits" && (
            <CountryVisitsContent visits={categorizedVisits} />
          )}
        </div>
      </div>
    </>
  );
}
