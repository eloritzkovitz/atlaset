import { useTranslation } from "react-i18next";
import { Chip } from "@components";
import { STATUS_COLOR_CLASSES } from "@constants/colors";
import type { TripStatus } from "../types";

export function TripStatusChip({ status }: { status?: TripStatus }) {
  const { t } = useTranslation("trips");

  // If status is undefined or null, render nothing
  if (!status) return null;

  const colorClass =
    STATUS_COLOR_CLASSES[status] || STATUS_COLOR_CLASSES.planned;
  const label = t(`statuses.${status}`, { defaultValue: status });

  return (
    <Chip
      className={`py-1 font-semibold justify-center rounded-full select-none ${colorClass}`}
    >
      {label}
    </Chip>
  );
}
