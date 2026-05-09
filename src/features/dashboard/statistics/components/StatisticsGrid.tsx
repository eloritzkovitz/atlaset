import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SegmentedToggle } from "@components";
import { TripsStats } from "./TripsStats";
import { TripHistory } from "./TripHistory";
import { TripsByMonth } from "./TripsByMonth";
import { TripsByYear } from "./TripsByYear";

const VIEWS = [
  { value: "overview", label: "Overview" },
  { value: "history", label: "History" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

type ViewType = (typeof VIEWS)[number]["value"];

export function StatisticsGrid() {
  const { t } = useTranslation("dashboard");
  const [view, setView] = useState<ViewType>("overview");

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
        {view === "overview" && <TripsStats />}
        {view === "history" && <TripHistory />}
        {view === "monthly" && <TripsByMonth />}
        {view === "yearly" && <TripsByYear />}
      </div>
    </div>
  );
}
