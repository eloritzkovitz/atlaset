import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { SegmentedToggle } from "@components";
import { TripCategories } from "./TripCategories";
import { TripDestinations } from "./TripDestinations";
import { TripTrends } from "./TripTrends";
import { TripsOverview } from "./TripsOverview";

const VIEWS = [
  { value: "overview", label: "Overview" },
  { value: "visits", label: "Visits" },
  { value: "categories", label: "Categories" },
  { value: "trends", label: "Trends" },
] as const;

type ViewType = (typeof VIEWS)[number]["value"];

export function StatisticsGrid() {
  const { t } = useTranslation("dashboard");
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine the current view based on the URL search parameter
  const currentParam = searchParams.get("view");
  const view: ViewType = VIEWS.some((v) => v.value === currentParam)
    ? (currentParam as ViewType)
    : "overview";

  // Handler to update the view and synchronize it with the URL search parameter
  const handleViewChange = (newView: ViewType) => {
    setSearchParams(
      (prev) => {
        const updated = new URLSearchParams(prev);
        if (newView === "overview") {
          updated.delete("view");
        } else {
          updated.set("view", newView);
        }
        return updated;
      },
      { replace: true },
    );
  };

  return (
    <div>
      <SegmentedToggle
        value={view}
        onChange={handleViewChange}
        options={VIEWS.map((v) => ({
          value: v.value,
          label: t(`statistics.views.${v.value}`, { defaultValue: v.label }),
        }))}
        className="mb-4 mt-2"
      />
      <div>
        {view === "overview" && <TripsOverview />}
        {view === "visits" && <TripDestinations />}
        {view === "categories" && <TripCategories />}
        {view === "trends" && <TripTrends />}
      </div>
    </div>
  );
}
