import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ActionsToolbar,
  SearchInput,
  ToolbarSeparator,
} from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@contexts/UIContext";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarFilters } from "./ToolbarFilters";
import { ToolbarImportExport } from "./ToolbarImportExport";
import type { Trip, TripFilterState } from "../../types";

interface ToolbarProps {
  trips: Trip[];
  filters: TripFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TripFilterState>>;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  resetFilters: () => void;
  onAddTrip?: () => void;
}

export function TripsToolbar({
  trips,
  filters,
  setFilters,
  globalSearch,
  setGlobalSearch,
  resetFilters,
  onAddTrip,
}: ToolbarProps) {
  const { toggleCalendar } = useUI();

  const { t } = useTranslation("trips");

  return (
    <div className="trips-toolbar-container px-3 flex items-center justify-between min-h-16 h-[7vh] bg-surface-alt">
      <ActionsToolbar>
        <div className="flex items-center z-90">
          <div className="ms-16 " />

          {/* Search */}
          <SearchInput
            value={globalSearch}
            onChange={setGlobalSearch}
            placeholder={t("table.toolbar.search.placeholder")}
            className="w-64 h-8 rounded-full"
          />
          <ToolbarSeparator />

          {/* Filters & Toggles */}
          <ToolbarFilters
            filters={filters}
            setFilters={setFilters}
            setGlobalSearch={setGlobalSearch}
            resetFilters={resetFilters}
          />
          <ToolbarSeparator />

          {/* Calendar Button */}
          <ActionButton
            onClick={toggleCalendar}
            ariaLabel={t("table.toolbar.calendar.viewCalendar")}
            title={t("table.toolbar.calendar.viewCalendar")}
            icon={<ICONS.calendar />}
            variant="toggle"
            className="ms-2"
          />
          <ToolbarSeparator />

          {/* Import/Export */}
          <ToolbarImportExport trips={trips} />
          <ToolbarSeparator />

          {/* Action Buttons */}
          <ToolbarActions onAddTrip={onAddTrip} />
        </div>
      </ActionsToolbar>
    </div>
  );
}
