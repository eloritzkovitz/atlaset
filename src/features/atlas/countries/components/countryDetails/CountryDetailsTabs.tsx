import { TabButton } from "@components";

export type CountryDetailsTab = "overview" | "relations" | "visits";

interface CountryDetailsTabsProps {
  activeTab: CountryDetailsTab;
  onTabChange: (tab: CountryDetailsTab) => void;
  showDependenciesTab?: boolean;
}

export function CountryDetailsTabs({
  activeTab,
  onTabChange,
  showDependenciesTab = false,
}: CountryDetailsTabsProps) {
  // Tab labels for display
  const tabLabels: Record<CountryDetailsTab, string> = {
    overview: "Overview",
    relations: "Relations",
    visits: "Visits",
  };

  // Determine which tabs to show based on dependencies presence
  const tabs: CountryDetailsTab[] = showDependenciesTab
    ? ["overview", "relations", "visits"]
    : ["overview", "visits"];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          active={activeTab === tab}
          onClick={() => onTabChange(tab)}
        >
          {tabLabels[tab]}
        </TabButton>
      ))}
    </div>
  );
}
