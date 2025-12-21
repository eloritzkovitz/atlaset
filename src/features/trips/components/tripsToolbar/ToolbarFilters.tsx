import React from "react";
import {
  FaRotateLeft,
  FaLocationDot,
  FaPlane,
  FaCheck,
  FaCalendar,
  FaHashtag,
  FaHeart,
} from "react-icons/fa6";
import { ActionButton, ToolbarToggleGroup } from "@components";
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
  const toggleRowNumbers = () => setShowRowNumbers((v) => !v);

  const filterToggles: ToolbarToggleOption[] = [
    {
      value: "local",
      icon: <FaLocationDot />,
      label: "Local",
      ariaLabel: "Show/Hide Local Trips",
      title: "Toggle Local Trips",
      checked: filters.local,
      onClick: toggleLocal,
    },
    {
      value: "abroad",
      icon: <FaPlane />,
      label: "Abroad",
      ariaLabel: "Show/Hide Abroad Trips",
      title: "Toggle Abroad Trips",
      checked: filters.abroad,
      onClick: toggleAbroad,
    },
    {
      value: "completed",
      icon: <FaCheck />,
      label: "Completed",
      ariaLabel: "Show/Hide Completed Trips",
      title: "Toggle Completed Trips",
      checked: filters.completed,
      onClick: toggleCompleted,
    },
    {
      value: "upcoming",
      icon: <FaCalendar />,
      label: "Upcoming",
      ariaLabel: "Show/Hide Upcoming Trips",
      title: "Toggle Upcoming Trips",
      checked: filters.upcoming,
      onClick: toggleUpcoming,
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
        icon={<FaRotateLeft />}
        variant="toggle"
      />
      <ToolbarToggleGroup options={filterToggles} />
    </>
  );
}
