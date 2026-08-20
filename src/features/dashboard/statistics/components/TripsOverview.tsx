import { useTranslation } from "react-i18next";
import {
  FaCalendarDay,
  FaCalendarDays,
  FaClock,
  FaClockRotateLeft,
  FaFlag,
  FaHourglassEnd,
  FaHourglassStart,
  FaNoteSticky,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { Card, Chip, SectionHeader } from "@components";
import { CountryWithFlag } from "@features/countries";
import { useAnimatedNumber } from "@hooks";
import { TripList } from "./TripList";
import { TripTypeChip } from "./TripTypeChip";
import { useTripCategoryData } from "../hooks/useTripCategoryData";
import { useTripsStats } from "../hooks/useTripsStats";

export function TripsOverview() {
  const { t } = useTranslation("dashboard");

  const { statusData, typeData } = useTripCategoryData();
  const {
    totalTrips,
    averageTripDuration,
    totalDaysTraveling,
    recentTrips,
    longestTrip,
    shortestTrip,
    firstTrip,
    mostVisitedCountries,
    maxCount,
  } = useTripsStats();

  // Animated numbers for display
  const animatedTotalTrips = useAnimatedNumber(totalTrips);
  const animatedTotalDays = useAnimatedNumber(totalDaysTraveling ?? 0);
  const animatedAvgDuration = useAnimatedNumber(
    Math.round((averageTripDuration ?? 0) * 10),
  );
  const formattedAvgDuration = (animatedAvgDuration / 10).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Trips */}
        <Card
          icon={FaSuitcaseRolling}
          iconClass="text-blue-700"
          title={t("statistics.overview.totalTrips", {
            defaultValue: "Total Trips",
          })}
        >
          <p className="text-2xl font-bold">{animatedTotalTrips}</p>
        </Card>

        {/* Total Days Traveling */}
        <Card
          icon={FaCalendarDays}
          iconClass="text-sky-400"
          title={t("statistics.overview.totalDays.title", {
            defaultValue: "Total days traveling",
          })}
        >
          <p className="text-2xl font-bold">
            {totalDaysTraveling ? animatedTotalDays : "—"}
            <span className="ms-1 text-sm font-normal text-muted">
              {t("statistics.overview.days", { defaultValue: "days/trip" })}
            </span>
          </p>
        </Card>

        {/* Average Duration */}
        <Card
          icon={FaClock}
          iconClass="text-amber-500"
          title={t("statistics.overview.average.title", {
            defaultValue: "Average Duration",
          })}
        >
          <p className="text-2xl font-bold">
            {averageTripDuration ? formattedAvgDuration : "0.0"}{" "}
            <span className="text-sm font-normal text-muted">
              {t("statistics.overview.days", { defaultValue: "days/trip" })}
            </span>
          </p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Trip Overview */}
        <Card
          icon={FaNoteSticky}
          iconClass="text-pink-400"
          title={t("statistics.overview.tripOverview.title", {
            defaultValue: "Trip Categories",
          })}
          subtitle={t("statistics.overview.tripOverview.subtitle", {
            defaultValue: "Breakdown by status and geography",
          })}
        >
          <div className="flex flex-col gap-4">
            <div>
              <SectionHeader
                title={t("statistics.overview.tripOverview.byStatus", {
                  defaultValue: "By Status",
                })}
              />
              <div className="flex flex-wrap gap-3">
                {statusData.map((chip) => (
                  <TripTypeChip
                    key={chip.key}
                    icon={chip.icon}
                    value={chip.value}
                    label={chip.name}
                    colorClass={chip.colorClass}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                title={t("statistics.overview.tripOverview.byType", {
                  defaultValue: "By Type",
                })}
              />
              <div className="flex flex-wrap gap-3">
                {typeData.map((chip) => (
                  <TripTypeChip
                    key={chip.key}
                    icon={chip.icon}
                    value={chip.value}
                    label={chip.name}
                    colorClass={chip.colorClass}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Trips */}
        <Card
          icon={FaClockRotateLeft}
          iconClass="text-yellow-600"
          title={t("statistics.overview.recent.title", {
            defaultValue: "Recent trips",
          })}
          subtitle={t("statistics.overview.recent.subtitle", {
            defaultValue: "Your last 3 recorded trips",
          })}
        >
          <TripList trips={recentTrips} className="mt-4" />
        </Card>

        {/* Most visited country card */}
        <Card
          icon={FaFlag}
          iconClass="text-orange-500"
          title={t("statistics.overview.mostVisited.title", {
            defaultValue: "Most visited countries",
          })}
          subtitle={t("statistics.overview.mostVisited.subtitle", {
            defaultValue: "Based on completed abroad trips",
          })}
        >
          <div className="flex flex-wrap gap-2 items-center mt-2">
            {mostVisitedCountries.length > 0 ? (
              mostVisitedCountries.map((country) => (
                <Chip
                  key={country.isoCode}
                  className="flex items-center gap-2 px-3 py-2 bg-surface"
                >
                  <CountryWithFlag country={country} />
                  <span className="text-xs text-muted">
                    ({maxCount}{" "}
                    {t("statistics.overview.visits", {
                      defaultValue: "visits",
                    })}
                    )
                  </span>
                </Chip>
              ))
            ) : (
              <span className="text-muted">—</span>
            )}
          </div>
        </Card>

        {/* First trip */}
        <Card
          icon={FaCalendarDay}
          iconClass="text-green-400"
          title={t("statistics.overview.first.title", {
            defaultValue: "First trip",
          })}
          subtitle={t("statistics.overview.first.subtitle", {
            defaultValue: "Your earliest recorded trip",
          })}
        >
          <TripList trips={firstTrip ? [firstTrip] : []} className="mt-2" />
        </Card>

        {/* Longest Trip */}
        <Card
          icon={FaHourglassStart}
          iconClass="text-indigo-600"
          title={t("statistics.overview.longest.title", {
            defaultValue: "Longest trip",
          })}
          subtitle={t("statistics.overview.longest.subtitle", {
            defaultValue: "Your trip with the most days abroad",
          })}
        >
          {longestTrip ? (
            <TripList trips={[longestTrip]} className="mt-2" showDuration />
          ) : (
            <div className="mb-1 text-4xl font-extrabold text-indigo-400">
              —
            </div>
          )}
        </Card>

        {/* Shortest Trip */}
        <Card
          icon={FaHourglassEnd}
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
            <div className="mb-1 text-4xl font-extrabold text-pink-400">—</div>
          )}
        </Card>
      </div>
    </div>
  );
}
