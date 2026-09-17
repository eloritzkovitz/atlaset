import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ActionsToolbar,
  DropdownSelectInput,
  SearchInput,
  Separator,
} from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarFilters } from "./ToolbarFilters";
import { ToolbarImportExport } from "./ToolbarImportExport";
import type { Trip, TripFilterState, TripViewMode } from "../../../core/types";

interface ToolbarProps {
  trips: Trip[];
  filters: TripFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TripFilterState>>;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  resetFilters: () => void;
  onAddTrip?: () => void;
  viewMode: TripViewMode;
  onViewModeChange: (mode: TripViewMode) => void;
}

export function TripsToolbar({
  trips,
  filters,
  setFilters,
  globalSearch,
  setGlobalSearch,
  resetFilters,
  onAddTrip,
  viewMode,
  onViewModeChange,
}: ToolbarProps) {
  const { toggleCalendar } = useUI();
  const { t } = useTranslation("trips");

  const viewModeOptions = [
    {
      value: "trips" as const,
      label: t("table.toolbar.viewMode.trips", "My Trips"),
    },
    {
      value: "shared" as const,
      label: t("table.toolbar.viewMode.shared", "Shared with Me"),
    },
  ];

  return (
    <div className="trips-toolbar-container px-3 flex items-center justify-between min-h-16 h-[7vh] bg-surface-alt">
      <ActionsToolbar>
        <div className="flex items-center z-90">
          <div className="ms-16" />

          {/* View Mode */}
          <DropdownSelectInput<TripViewMode>
            value={viewMode}
            onChange={(value) => {
              if (!Array.isArray(value)) {
                onViewModeChange(value);
              }
            }}
            options={viewModeOptions}
            isFilter
            className="min-w-[150px]"
          />

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Search */}
          <SearchInput
            value={globalSearch}
            onChange={setGlobalSearch}
            placeholder={t("table.toolbar.search.placeholder")}
            className="!w-64"
          />

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Filters & Toggles */}
          <ToolbarFilters
            filters={filters}
            setFilters={setFilters}
            setGlobalSearch={setGlobalSearch}
            resetFilters={resetFilters}
          />

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Calendar Button */}
          <ActionButton
            onClick={toggleCalendar}
            ariaLabel={t("table.toolbar.calendar.viewCalendar")}
            title={t("table.toolbar.calendar.viewCalendar")}
            icon={<ICONS.calendar />}
            variant="toggle"
            className="ms-2"
          />

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Import/Export */}
          <ToolbarImportExport trips={trips} />

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Action Buttons */}
          <ToolbarActions onAddTrip={onAddTrip} />
        </div>
      </ActionsToolbar>
    </div>
  );
}
