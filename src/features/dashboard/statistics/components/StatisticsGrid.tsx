import { useTranslation } from "react-i18next";
import { SegmentedToggle } from "@components";
import { useQueryParam } from "@hooks";
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

  const [view, setView] = useQueryParam<ViewType>("view", "overview");

  return (
    <div>
      <SegmentedToggle
        value={view}
        onChange={setView}
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
