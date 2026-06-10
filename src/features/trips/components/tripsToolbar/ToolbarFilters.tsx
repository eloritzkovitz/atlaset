import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, ToolbarToggleGroup } from "@components";
import { ICONS } from "@constants/icons";
import type { ToolbarToggleOption } from "@types";
import type { TripFilterState } from "../../types";

interface ToolbarFiltersProps {
  filters: TripFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TripFilterState>>;
  setGlobalSearch: (search: string) => void;
  resetFilters: () => void;
}

export function ToolbarFilters({
  filters,
  setFilters,
  setGlobalSearch,
  resetFilters,
}: ToolbarFiltersProps) {
  const { t } = useTranslation("trips");

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

  const filterToggles: ToolbarToggleOption[] = [
    {
      value: "local",
      icon: <ICONS.tripLocal />,
      label: t("table.toolbar.filters.local"),
      ariaLabel: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.local"),
      }),
      title: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.local"),
      }),
      checked: filters.local,
      onClick: toggleLocal,
    },
    {
      value: "abroad",
      icon: <ICONS.tripAbroad />,
      label: t("table.toolbar.filters.abroad"),
      ariaLabel: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.abroad"),
      }),
      title: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.abroad"),
      }),
      checked: filters.abroad,
      onClick: toggleAbroad,
    },
    {
      value: "planned",
      icon: <ICONS.tripPlanned />,
      label: t("table.toolbar.filters.planned"),
      ariaLabel: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.planned"),
      }),
      title: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.planned"),
      }),
      checked: filters.planned,
      onClick: togglePlanned,
    },
    {
      value: "upcoming",
      icon: <ICONS.tripUpcoming />,
      label: t("table.toolbar.filters.upcoming"),
      ariaLabel: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.upcoming"),
      }),
      title: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.upcoming"),
      }),
      checked: filters.upcoming,
      onClick: toggleUpcoming,
    },
    {
      value: "completed",
      icon: <ICONS.tripCompleted />,
      label: t("table.toolbar.filters.completed"),
      ariaLabel: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.completed"),
      }),
      title: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.completed"),
      }),
      checked: filters.completed,
      onClick: toggleCompleted,
    },
    {
      value: "favorite",
      icon: <ICONS.favorite />,
      label: t("table.toolbar.filters.favorites"),
      ariaLabel: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.favorites"),
      }),
      title: t("table.toolbar.filters.filtersToggle", {
        label: t("table.toolbar.filters.favorites"),
      }),
      checked: filters.favorite,
      onClick: toggleFavorite,
    },    
  ];

  return (
    <>
      <ActionButton
        onClick={handleClearFilters}
        ariaLabel={t("table.toolbar.filters.clearFilters")}
        title={t("table.toolbar.filters.clearFilters")}
        icon={<ICONS.reset />}
        variant="toggle"
      />
      <ToolbarToggleGroup options={filterToggles} />
    </>
  );
}
