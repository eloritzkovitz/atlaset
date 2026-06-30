import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaChartPie,
  FaClock,
  FaClockRotateLeft,
  FaRegClock,
  FaStar,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import type { IconType } from "react-icons/lib";
import { Card, PieLegendCard, SegmentedToggle } from "@components";
import {
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
  TRIP_TYPE_ICONS,
  TRIP_TYPE_COLOR_CLASSES,
  TRIP_STATUS_COLORS,
  TRIP_STATUS_LABELS,
  TRIP_STATUS_ICONS,
  TRIP_STATUS_COLOR_CLASSES,
} from "@features/trips/constants/trips";
import { TripList } from "./TripList";
import { TripTypeChip } from "./TripTypeChip";
import { useTripsStats } from "../hooks/useTripsStats";

const PieChart = lazy(() => import("@components/display/PieChart/PieChart"));

export function TripsStats() {
  const { t } = useTranslation("dashboard");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pieMode, setPieMode] = useState<"type" | "status">("type");

  const {
    totalTrips,
    localTrips,
    abroadTrips,
    completedTrips,
    upcomingTrips,
    plannedTrips,
    longestTrip,
    shortestTrip,
    averageTripDuration,
    totalDaysTraveling,
  } = useTripsStats();

  const buildPieData = (
    keys: string[],
    defaultLabels: string[],
    colors: string[],
    icons: IconType[],
    colorClasses: string[],
    counts: number[],
  ) =>
    keys.map((key, i) => {
      const nameKey = key.includes(":")
        ? key
        : key.startsWith("statistics.")
          ? key
          : `statistics.${key}`;
      return {
        name: t(nameKey, { defaultValue: defaultLabels[i] }),
        value: counts[i],
        color: colors[i],
        icon: icons[i],
        colorClass: colorClasses[i],
      };
    });

  const tripTypeData = buildPieData(
    ["trips:types.local", "trips:types.abroad"],
    TRIP_TYPE_LABELS,
    TRIP_TYPE_COLORS,
    TRIP_TYPE_ICONS,
    TRIP_TYPE_COLOR_CLASSES,
    [localTrips.length, abroadTrips.length],
  );

  const tripStatusData = buildPieData(
    [
      "trips:statuses.planned",
      "trips:statuses.upcoming",
      "trips:statuses.completed",
    ],
    TRIP_STATUS_LABELS,
    TRIP_STATUS_COLORS,
    TRIP_STATUS_ICONS,
    [
      TRIP_STATUS_COLOR_CLASSES["planned"],
      TRIP_STATUS_COLOR_CLASSES["upcoming"],
      TRIP_STATUS_COLOR_CLASSES["completed"],
    ],
    [plannedTrips.length, upcomingTrips.length, completedTrips.length],
  );

  const pieData = pieMode === "type" ? tripTypeData : tripStatusData;
  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Trips Overview */}
      <Card
        icon={FaSuitcaseRolling}
        iconClass="text-blue-500"
        title={t("statistics.overview.title", {
          defaultValue: "Trip Overview",
        })}
        subtitle={t("statistics.overview.subtitle", {
          defaultValue: "Summary of all your recorded trips",
        })}
      >
        <div className="flex flex-col items-center">
          <div className="text-5xl font-extrabold text-blue-500 mb-2 mt-6">
            {totalTrips}
          </div>
          <div className="text-muted text-sm mb-4">
            {t("statistics.overview.totalTrips", {
              defaultValue: "Total Trips",
            })}
          </div>
          <div className="flex gap-6 mb-6">
            {tripStatusData.map((d) => (
              <TripTypeChip
                key={d.name}
                icon={d.icon}
                value={d.value}
                label={d.name}
                colorClass={d.colorClass}
              />
            ))}
          </div>
          <div className="flex gap-6">
            {tripTypeData.map((d) => (
              <TripTypeChip
                key={d.name}
                icon={d.icon}
                value={d.value}
                label={d.name}
                colorClass={d.colorClass}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Trip Breakdown Pie Chart */}
      <Card
        icon={FaChartPie}
        iconClass={"text-purple-400"}
        title={t("statistics.overview.breakdown.title", {
          defaultValue: "Trip Breakdown",
        })}
        subtitle={
          pieMode === "type"
            ? t("statistics.overview.breakdown.subtitle.type", {
                defaultValue: "Distribution of trips (local and abroad)",
              })
            : t("statistics.overview.breakdown.subtitle.status", {
                defaultValue: "Distribution of trip statuses",
              })
        }
      >
        <div className="flex flex-col items-center">
          <SegmentedToggle
            value={pieMode}
            onChange={setPieMode}
            options={[
              {
                value: "type",
                label: t("statistics.overview.pieToggle.type", {
                  defaultValue: "Type",
                }),
              },
              {
                value: "status",
                label: t("statistics.overview.pieToggle.status", {
                  defaultValue: "Status",
                }),
              },
            ]}
            className="mt-4 mb-4"
          />
          <div className="flex flex-row justify-center gap-25 min-h-[220px] mt-2">
            {/* Pie Chart */}
            <div className="flex items-center justify-center w-48 h-48 mt-10 mb-10">
              <Suspense
                fallback={
                  <div>
                    {t("statistics.overview.loadingChart", {
                      defaultValue: "Loading chart...",
                    })}
                  </div>
                }
              >
                <PieChart
                  labels={pieData.map((d) => d.name)}
                  data={pieData.map((d) => d.value)}
                  colors={pieData.map((d) => d.color)}
                  hoveredIdx={hoveredIdx}
                  setHoveredIdx={setHoveredIdx}
                />
              </Suspense>
            </div>
            {/* Vertical Legend */}
            <div className="flex flex-col gap-4">
              {pieData.map((d, idx) => (
                <PieLegendCard
                  key={d.name}
                  label={d.name}
                  color={d.color}
                  percentage={total ? (d.value / total) * 100 : 0}
                  isActive={hoveredIdx === idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  direction="horizontal"
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Longest trip card */}
      <Card
        icon={FaClock}
        iconClass="text-indigo-600"
        title={t("statistics.longest.title", { defaultValue: "Longest trip" })}
        subtitle={t("statistics.longest.subtitle", {
          defaultValue: "Your trip with the most days abroad",
        })}
      >
        {longestTrip ? (
          <TripList trips={[longestTrip]} className="mt-2" showDuration />
        ) : (
          <div className="text-4xl font-extrabold text-indigo-400 mb-1">—</div>
        )}
      </Card>

      {/* Shortest trip card */}
      <Card
        icon={FaRegClock}
        iconClass="text-pink-600"
        title={t("statistics.overview.shortest.title", {
          defaultValue: "Shortest trip",
        })}
        subtitle={t("statistics.overview.shortest.subtitle", {
          defaultValue: "Your shortest abroad trip",
        })}
      >
        {shortestTrip ? (
          <TripList trips={[shortestTrip]} className="mt-2" showDuration />
        ) : (
          <div className="text-4xl font-extrabold text-pink-400 mb-1">—</div>
        )}
      </Card>

      {/* Average trip duration */}
      <Card
        icon={FaStar}
        iconClass="text-yellow-400"
        title={t("statistics.overview.average.title", {
          defaultValue: "Average trip duration",
        })}
        subtitle={t("statistics.overview.average.subtitle", {
          defaultValue: "Average days per trip",
        })}
      >
        <div className="text-4xl font-extrabold text-yellow-400 mb-1">
          {averageTripDuration
            ? `${averageTripDuration.toFixed(1)} ${t("statistics.days", { defaultValue: "days" })}`
            : "—"}
        </div>
      </Card>

      {/* Total days spent traveling */}
      <Card
        icon={FaClockRotateLeft}
        iconClass="text-sky-400"
        title={t("statistics.overview.totalDays.title", {
          defaultValue: "Total days traveling",
        })}
        subtitle={t("statistics.overview.totalDays.subtitle", {
          defaultValue: "Sum of all trip durations",
        })}
      >
        <div className="text-4xl font-extrabold text-sky-400 mb-1">
          {totalDaysTraveling
            ? `${totalDaysTraveling} ${t("statistics.overview.days", { defaultValue: "days" })}`
            : "—"}
        </div>
      </Card>
    </div>
  );
}
