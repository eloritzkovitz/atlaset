import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionButton,
  EmptyListMessage,
  ErrorMessage,
  LoadingSpinner,
  SearchInput,
  SegmentedToggle,
  SelectInput,
  SortSelect,
} from "@components";
import { ICONS } from "@constants/icons";
import {
  type AchievementSortKey,
  useAchievementStatus,
} from "@features/achievements";
import { useIncrementalList, useLocalStorageState } from "@hooks";
import type { SortValue } from "@types";
import { AchievementCard } from "./AchievementCard";

const typeOptions = [
  { value: "all", label: "All" },
  { value: "milestone", label: "Milestone", colorClass: "bg-zinc-600" },
  { value: "general", label: "General", colorClass: "bg-yellow-600" },
  { value: "collection", label: "Collection", colorClass: "bg-green-600" },
  { value: "geographic", label: "Geographic", colorClass: "bg-blue-600" },
  { value: "historic", label: "Historic", colorClass: "bg-red-600" },
  { value: "cultural", label: "Cultural", colorClass: "bg-purple-600" },
  { value: "affiliation", label: "Affiliation", colorClass: "bg-teal-600" },
  { value: "trips", label: "Trips", colorClass: "bg-orange-600" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "locked", label: "Locked" },
  { value: "progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function AchievementsGrid() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useLocalStorageState<
    SortValue<AchievementSortKey>
  >("atlaset:achievements_sort", "id-asc");

  const {
    achievements,
    isLoading,
    error,
    mergedAchievements,
    sortedAchievements,
    achievementStatusMap,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  } = useAchievementStatus({
    typeFilter,
    statusFilter,
    search,
    sortBy,
  });

  // Maintain a visible count for incremental loading of achievements
  const visibleAchievements = useIncrementalList(sortedAchievements, {
    initialBatchSize: 6,
    loadBatchSize: 12,
  });

  // Reset filters to default
  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setSortBy("id-asc");
  };

  // handle conditional rendering
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <LoadingSpinner message="Loading achievements..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage error={error} />
      </div>
    );
  }
  if (!achievements) {
    return <EmptyListMessage message="No achievements data found." />;
  }

  return (
    <div className="mb-4 gap-4">
      <div className="flex">
        <SegmentedToggle
          value={typeFilter}
          onChange={(v) => setTypeFilter(String(v))}
          options={typeOptions}
          wrap
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search achievements"
            className="min-w-[250px] mt-1 rounded-md"
          />
          <div className="flex flex-row gap-2 w-full">
            <SelectInput
              value={statusFilter}
              onChange={(v) => setStatusFilter(String(v))}
              options={statusOptions}
              className="min-w-[150px]"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-2 sm:mt-0">
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            keyGroup={[
              { value: "id", label: "ID" },
              { value: "name", label: "Name" },
              { value: "progress", label: "Progress" },
            ]}
            showLabel
          />
          <div className="flex flex-row gap-2 ms-auto justify-end">
            <ActionButton
              onClick={handleResetFilters}
              ariaLabel="Reset Filters"
              title="Reset Filters"
              icon={<ICONS.reset />}
              variant="toggle"
              rounded
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted md:text-sm md:whitespace-nowrap select-none mb-4">
        Showing {sortedAchievements.length} achievements
      </div>

      <div
        key={`${typeFilter}-${statusFilter}-${sortBy}`}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {visibleAchievements.map((achievement) => {
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              countries={countries}
              isVisitedCountry={isVisitedCountry}
              trips={trips}
              homeCountry={homeCountry}
              achievementStatusMap={achievementStatusMap}
              allAchievements={mergedAchievements}
              onClick={() =>
                navigate(`/explore/achievements/${achievement.id}`)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
