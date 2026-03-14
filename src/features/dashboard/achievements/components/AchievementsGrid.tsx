import { useState, useMemo } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import {
  ActionButton,
  ErrorMessage,
  LoadingSpinner,
  SearchInput,
  SelectInput,
} from "@components";
import { useTrips } from "@contexts/TripsContext";
import { useCountryData } from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { AchievementCard } from "./AchievementCard";
import { useAchievementsData } from "../hooks/useAchievementsData";
import {
  getMergedAchievements,
  getAchievementStatus,
  isCompleted,
} from "../utils/achievements";

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "milestone", label: "Milestone" },
  { value: "general", label: "General" },
  { value: "collection", label: "Collection" },
  { value: "geographic", label: "Geographic" },
  { value: "historic", label: "Historic" },
  { value: "cultural", label: "Cultural" },
  { value: "trips", label: "Trips" },
];
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "locked", label: "Locked" },
  { value: "progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function AchievementsGrid() {
  const { achievementsData, achievementsError, loading } =
    useAchievementsData();
  const { countries } = useCountryData();
  const visited = useVisitedCountries();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const mergedAchievements = useMemo(() => {
    if (!achievementsData) return [];
    return getMergedAchievements(
      achievementsData,
      countries,
      visited,
      trips,
      homeCountry,
    );
  }, [achievementsData, countries, visited, trips, homeCountry]);

  const filteredAchievements = useMemo(() => {
    let filtered = mergedAchievements;
    if (typeFilter !== "all") {
      filtered = filtered.filter((a) => a.type === typeFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (a) =>
          getAchievementStatus(a, countries, visited, trips, homeCountry) ===
          statusFilter,
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)),
      );
    }
    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedAchievements, search, typeFilter, statusFilter]);

  const achievementStatusMap = useMemo(() => {
    if (!achievementsData) return {};
    const map: Record<string, boolean> = {};
    for (const ach of achievementsData) {
      map[ach.id] = isCompleted(ach, countries, visited, trips, homeCountry);
    }
    return map;
  }, [achievementsData, countries, visited, trips, homeCountry]);

  // Reset filters to default
  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  // handle conditional rendering
  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <LoadingSpinner message="Loading achievements..." />
      </div>
    );
  }
  if (achievementsError) {
    return (
      <div className="p-4">
        <ErrorMessage error={achievementsError} />
      </div>
    );
  }

  // Handle case with no data
  if (!achievementsData) {
    return <div className="p-4">No achievements data found.</div>;
  }

  return (
    <div className="mb-4 gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search achievements"
            className="mt-1 rounded-md"
          />
          <div className="flex flex-row gap-2 w-full">
            <SelectInput
              value={typeFilter}
              onChange={(v) => setTypeFilter(String(v))}
              options={typeOptions}
              className="min-w-[150px]"
            />
            <SelectInput
              value={statusFilter}
              onChange={(v) => setStatusFilter(String(v))}
              options={statusOptions}
              className="min-w-[150px]"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-2 sm:mt-0">
          <div className="flex flex-row gap-2 ml-auto justify-end">
            <ActionButton
              onClick={handleResetFilters}
              ariaLabel="Reset Filters"
              title="Reset Filters"
              icon={<FaArrowRotateLeft />}
              variant="toggle"
              rounded
            />
          </div>
        </div>
      </div>
      <div className="text-sm text-muted md:text-sm md:whitespace-nowrap select-none mb-4">
        Showing {filteredAchievements.length} achievements
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => {
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              countries={countries}
              visited={visited}
              trips={trips}
              homeCountry={homeCountry}
              achievementStatusMap={achievementStatusMap}
              allAchievements={mergedAchievements}
            />
          );
        })}
      </div>
    </div>
  );
}
