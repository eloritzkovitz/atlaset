import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Card,
  HeaderNavigation,
  StarRatingInput,
  type NavigationItem,
} from "@components";
import { ICONS } from "@constants/icons";
import { useCalendarNavigation } from "@features/calendar/hooks/useCalendarNavigation";
import { formatDate } from "@utils";
import { TripIndicators } from "../../core/components/TripIndicators";
import { TripStatusChip } from "../../core/components/TripStatusChip";
import type { Trip } from "../../core/types";

interface TripHeaderProps {
  trip: Trip;
  onEdit: () => void;
  sharedWithMe?: boolean;
  navigation?: {
    previous?: NavigationItem;
    next?: NavigationItem;
  };
}

export function TripHeader({
  trip,
  onEdit,
  sharedWithMe,
  navigation,
}: TripHeaderProps) {
  const { openTripInCalendar } = useCalendarNavigation();
  const { t } = useTranslation("trips");

  const hasDates = trip.startDate && trip.endDate;

  const dateRange = trip.startDate
    ? hasDates
      ? `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`
      : formatDate(trip.startDate)
    : t("common:formatting.date.tbd");

  return (
    <>
      <HeaderNavigation
        previous={navigation?.previous}
        next={navigation?.next}
      />

      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>
            </div>
          </div>

          <div className="flex w-32 flex-col items-stretch gap-2 shrink-0">
            <TripStatusChip status={trip.status} />

            <ActionButton
              variant="secondary"
              className="!w-full !rounded-full text-text hover:bg-surface-hover"
              onClick={onEdit}
              icon={<ICONS.edit className="h-4 w-4" />}
            >
              {t("actions.editTrip", "Edit trip")}
            </ActionButton>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-5">
          <div className="flex items-center gap-2">
            <ICONS.tripDates className="h-5 w-5" />

            <button
              type="button"
              onClick={() => openTripInCalendar(trip.id)}
              className="mt-1 font-medium hover:!text-info"
            >
              {dateRange}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ICONS.tripDuration className="h-5 w-5" />

            <p className="font-medium">
              {hasDates
                ? t("common:formatting.duration.days", {
                    count: trip.fullDays,
                  })
                : t("common:formatting.date.tbd")}
            </p>
          </div>

          <StarRatingInput value={trip.rating} readOnly />

          <TripIndicators
            favorite={trip.favorite}
            sharedWithMe={sharedWithMe}
          />
        </div>
      </Card>
    </>
  );
}
