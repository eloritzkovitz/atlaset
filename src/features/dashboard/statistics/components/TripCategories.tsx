import { useTranslation } from "react-i18next";
import { FaChartPie } from "react-icons/fa6";
import { TripPieChartCard } from "./TripPieChartCard";
import { useTripCategoryData } from "../hooks/useTripCategoryData";

export function TripCategories() {
  const { t } = useTranslation("dashboard");

  const { statusData, typeData } = useTripCategoryData();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TripPieChartCard
          icon={FaChartPie}
          iconClass="text-indigo-400"
          title={t("statistics.categories.type.title", {
            defaultValue: "Trip Type Breakdown",
          })}
          subtitle={t("statistics.categories.type.subtitle", {
            defaultValue: "Distribution of trips (local and abroad)",
          })}
          data={typeData}
        />

        <TripPieChartCard
          icon={FaChartPie}
          iconClass="text-lime-500"
          title={t("statistics.categories.status.title", {
            defaultValue: "Trip Status Breakdown",
          })}
          subtitle={t("statistics.categories.status.subtitle", {
            defaultValue: "Distribution of trip statuses",
          })}
          data={statusData}
        />
      </div>
    </div>
  );
}
