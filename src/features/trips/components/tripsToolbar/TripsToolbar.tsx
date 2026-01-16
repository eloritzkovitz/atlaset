import React from "react";
import { ActionsToolbar, SearchInput, ToolbarSeparator } from "@components";
import { ToolbarFilters } from "./ToolbarFilters";
import { ToolbarImportExport } from "./ToolbarImportExport";
import { ToolbarActions } from "./ToolbarActions";
import type { Trip, TripFilterState } from "../../types";

interface ToolbarProps {
  trips: Trip[];
  filters: TripFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TripFilterState>>;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  resetFilters: () => void;
  selectedTripIds: string[];
  showRowNumbers: boolean;
  setShowRowNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  onAddTrip?: () => void;
  onBulkDuplicate: () => void;
  onBulkDelete: () => void;
}

export function TripsToolbar({
  trips,
  filters,
  setFilters,
  globalSearch,
  setGlobalSearch,
  resetFilters,
  selectedTripIds,
  showRowNumbers,
  setShowRowNumbers,
  onAddTrip,
  onBulkDuplicate,
  onBulkDelete,
}: ToolbarProps) {
  return (
    <div className="trips-toolbar-container w-full px-3 flex items-center justify-between min-h-16 h-[7vh] bg-surface-alt">
      <ActionsToolbar>
        <div className="flex items-center">
          <div className="ml-16 " />

          {/* Search */}
          <SearchInput
            value={globalSearch}
            onChange={setGlobalSearch}
            placeholder="Search trips"
            className="w-64 h-8 rounded-full"
          />
          <ToolbarSeparator />

          {/* Filters & Toggles */}
          <ToolbarFilters
            filters={filters}
            setFilters={setFilters}
            setGlobalSearch={setGlobalSearch}
            resetFilters={resetFilters}
            showRowNumbers={showRowNumbers}
            setShowRowNumbers={setShowRowNumbers}
          />
          <ToolbarSeparator />

          {/* Import/Export */}
          <ToolbarImportExport trips={trips} />
          <ToolbarSeparator />

          {/* Action Buttons */}
          <ToolbarActions
            selectedTripIds={selectedTripIds}
            onAddTrip={onAddTrip}
            onBulkDuplicate={onBulkDuplicate}
            onBulkDelete={onBulkDelete}
          />
        </div>
      </ActionsToolbar>
    </div>
  );
}
