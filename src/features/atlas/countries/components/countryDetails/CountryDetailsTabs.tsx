import { TabButton } from "@components";

interface CountryDetailsTabsProps {
  activeTab: "details" | "visits";
  onTabChange: (tab: "details" | "visits") => void;
}

export function CountryDetailsTabs({
  activeTab,
  onTabChange,
}: CountryDetailsTabsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <TabButton
        active={activeTab === "details"}
        onClick={() => onTabChange("details")}
      >
        Details
      </TabButton>
      <TabButton
        active={activeTab === "visits"}
        onClick={() => onTabChange("visits")}
      >
        Visits
      </TabButton>
    </div>
  );
}
