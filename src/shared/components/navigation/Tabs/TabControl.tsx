import { useRef } from "react";
import { useDragScroll } from "@hooks";
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const { dragClassName } = useDragScroll(tabsRef, [tabs]);

  return (
    <div
      ref={tabsRef}
      className={`max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide ${dragClassName} ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex w-max gap-2">
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
    </div>
  );
}
