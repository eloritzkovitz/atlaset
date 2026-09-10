import { TabButton } from "./TabButton";

export type TabControlItem<T extends string> = {
  value: T;
  label: React.ReactNode;
};

interface TabControlProps<T extends string> {
  tabs: TabControlItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

/** Renders a tab control component. */
export function TabControl<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabControlProps<T>) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          active={activeTab === tab.value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </TabButton>
      ))}
    </div>
  );
}
