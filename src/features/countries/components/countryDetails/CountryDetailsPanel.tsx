import { useState, useEffect } from "react";
import { TabButton } from "@components";
import { CountryDetailsContent, type Country } from "@features/countries";
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
  currencies: Record<string, string>;
  categorizedVisits: {
    past: Visit[];
    upcoming: Visit[];
    tentative: Visit[];
  };
  hasRelationsTab: boolean;
  initialTab?: CountryDetailsTab;
  resetTabOnClose?: boolean;
  isOpen?: boolean;
  onTabChange?: (tab: CountryDetailsTab) => void;
  className?: string;
}

export function CountryDetailsPanel({
  country,
  currencies,
  categorizedVisits,
  hasRelationsTab,
  initialTab = "overview",
  resetTabOnClose = false,
  isOpen = true,
  onTabChange,
  className,
}: CountryDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<CountryDetailsTab>(initialTab);

  // Reset to overview tab when modal is closed, if resetTabOnClose is true
  useEffect(() => {
    if (resetTabOnClose && !isOpen) setActiveTab("overview");
  }, [resetTabOnClose, isOpen]);

  // Handle tab change
  const handleTabChange = (tab: CountryDetailsTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Determine which tabs to show based on dependencies presence
  const tabs: CountryDetailsTab[] = hasRelationsTab
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
            <CountryDetailsContent country={country} currencies={currencies} />
          )}
          {activeTab === "relations" && hasRelationsTab && (
            <CountryRelationsContent country={country} />
          )}
          {activeTab === "visits" && (
            <CountryVisitsContent visits={categorizedVisits} />
          )}
        </div>
      </div>
    </>
  );
}
