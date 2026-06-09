import { useTranslation } from "react-i18next";
import { Chip } from "@components";
import type { TripStatus } from "../../types";
import "./TripStatusChip.css";

const statusColors: Record<TripStatus, string> = {
  planned: "chip-planned",
  upcoming: "chip-upcoming",
  "in-progress": "chip-inprogress",
  completed: "chip-completed",
  cancelled: "chip-cancelled",
};

export function TripStatusChip({ status }: { status?: TripStatus }) {
  const { t } = useTranslation("trips");

  // If status is undefined or null, render nothing
  if (!status) return null;

  const color = statusColors[status] || statusColors.planned;
  const label = t(`statuses.${status}`, { defaultValue: status });

  return (
    <Chip
      className={`py-1 font-semibold justify-center rounded-full select-none ${color}`}
    >
      {label}
    </Chip>
  );
}
