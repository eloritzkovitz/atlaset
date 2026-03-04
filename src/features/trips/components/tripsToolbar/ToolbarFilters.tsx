import React from "react";
import { FaHashtag, FaHeart } from "react-icons/fa6";
import { ActionButton, ToolbarToggleGroup } from "@components";
import { ICONS } from "@constants/icons";
import type { ToolbarToggleOption } from "@types";
import type { TripFilterState } from "../../types";

interface ToolbarFiltersProps {
  filters: TripFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TripFilterState>>;
  setGlobalSearch: (search: string) => void;
  resetFilters: () => void;
  showRowNumbers: boolean;
  setShowRowNumbers: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ToolbarFilters({
  filters,
  setFilters,
  setGlobalSearch,
  resetFilters,
  showRowNumbers,
  setShowRowNumbers,
}: ToolbarFiltersProps) {
  // Clear filters handler
  const handleClearFilters = () => {
    resetFilters();
    setGlobalSearch("");
  };

  // Toggle filters
  const toggleLocal = () => setFilters({ ...filters, local: !filters.local });
  const toggleAbroad = () =>
    setFilters({ ...filters, abroad: !filters.abroad });
  const toggleCompleted = () =>
    setFilters({ ...filters, completed: !filters.completed });
  const toggleUpcoming = () =>
    setFilters({ ...filters, upcoming: !filters.upcoming });
  const toggleFavorite = () =>
    setFilters({ ...filters, favorite: !filters.favorite });
  const togglePlanned = () =>
    setFilters({ ...filters, planned: !filters.planned });
  const toggleRowNumbers = () => setShowRowNumbers((v) => !v);

  const filterToggles: ToolbarToggleOption[] = [
    {
      value: "local",
      icon: <ICONS.tripLocal />,
      label: "Local",
      ariaLabel: "Show/Hide Local Trips",
      title: "Toggle Local Trips",
      checked: filters.local,
      onClick: toggleLocal,
    },
    {
      value: "abroad",
      icon: <ICONS.tripAbroad />,
      label: "Abroad",
      ariaLabel: "Show/Hide Abroad Trips",
      title: "Toggle Abroad Trips",
      checked: filters.abroad,
      onClick: toggleAbroad,
    },
    {
      value: "planned",
      icon: <ICONS.tripPlanned />,
      label: "Planned",
      ariaLabel: "Show/Hide Planned Trips",
      title: "Toggle Planned Trips",
      checked: filters.planned,
      onClick: togglePlanned,
    },
    {
      value: "upcoming",
      icon: <ICONS.tripUpcoming />,
      label: "Upcoming",
      ariaLabel: "Show/Hide Upcoming Trips",
      title: "Toggle Upcoming Trips",
      checked: filters.upcoming,
      onClick: toggleUpcoming,
    },
    {
      value: "completed",
      icon: <ICONS.tripCompleted />,
      label: "Completed",
      ariaLabel: "Show/Hide Completed Trips",
      title: "Toggle Completed Trips",
      checked: filters.completed,
      onClick: toggleCompleted,
    },
    {
      value: "favorite",
      icon: <FaHeart />,
      label: "Favorites",
      ariaLabel: "Show/Hide Favorite Trips",
      title: "Toggle Favorite Trips",
      checked: filters.favorite,
      onClick: toggleFavorite,
    },
    {
      value: "rowNumbers",
      icon: <FaHashtag />,
      label: "Row Numbers",
      ariaLabel: showRowNumbers ? "Hide row numbers" : "Show row numbers",
      title: showRowNumbers ? "Hide Numbers" : "Show Numbers",
      checked: showRowNumbers,
      onClick: toggleRowNumbers,
    },
  ];

  return (
    <>
      <ActionButton
        onClick={handleClearFilters}
        ariaLabel="Clear Filters"
        title="Clear Filters"
        icon={<ICONS.reset />}
        variant="toggle"
      />
      <ToolbarToggleGroup options={filterToggles} />
    </>
  );
}
