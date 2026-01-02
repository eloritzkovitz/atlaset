import { FaArrowsRotate, FaList, FaListCheck } from "react-icons/fa6";
import { ActionButton, ToolbarIconWithCount, ToolbarToggleGroup } from "@components";
import type { ToolbarToggleOption } from "@types";
import { useTimeline } from "@contexts/TimelineContext";

interface CountriesToolbarProps {
  allCount: number;
  visitedCount: number;
  onRefresh?: () => void;
}

export function CountriesToolbar({
  allCount,
  visitedCount,
  onRefresh,
}: CountriesToolbarProps) {
  const { timelineMode, showVisitedOnly, setShowVisitedOnly } = useTimeline();

  // Toolbar toggle options
  const options: ToolbarToggleOption[] = [
    {
      value: "all",
      icon: <ToolbarIconWithCount icon={<FaList />} count={allCount} />,
      label: "Toggle All",
      ariaLabel: `Show all countries (${allCount})`,
      titlePosition: "top",
      checked: !showVisitedOnly,
      disabled: timelineMode,
      onClick: () => setShowVisitedOnly(false),
    },
    {
      value: "visited",
      icon: <ToolbarIconWithCount icon={<FaListCheck />} count={visitedCount} />,
      label: "Toggle Visited",
      ariaLabel: `Show visited countries (${visitedCount})`,
      titlePosition: "top",
      checked: showVisitedOnly,
      onClick: () => setShowVisitedOnly(true),
    },
  ];

  return (
    <div className="flex items-center -mx-4">
      <ActionButton
        onClick={onRefresh}
        ariaLabel="Refresh country data"
        title="Refresh country data"
        titlePosition="top"
        icon={<FaArrowsRotate />}
        variant="toggle"
      />
      <ToolbarToggleGroup options={options} />
    </div>
  );
}
