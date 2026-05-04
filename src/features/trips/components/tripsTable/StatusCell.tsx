import { useTranslation } from "react-i18next";
import { Chip } from "@components";
import type { TripStatus } from "../../types";
import "./StatusCell.css";

const statusColors: Record<TripStatus, string> = {
  planned: "chip-planned",
  upcoming: "chip-upcoming",
  "in-progress": "chip-inprogress",
  completed: "chip-completed",
  cancelled: "chip-cancelled",
};

export function StatusCell({ status }: { status?: TripStatus }) {
  const { t } = useTranslation("trips");
  if (!status) return null;
  const color = statusColors[status] || statusColors.planned;

  // Fallback label (Title case, replace hyphen)
  const fallbackLabel =
    status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");

  // Try translation first, fall back to computed label when missing
  const label = t(`statuses.${status}`, { defaultValue: fallbackLabel });

  return (
    <Chip
      className={`py-1 font-semibold justify-center rounded-full select-none ${color}`}
    >
      {label}
    </Chip>
  );
}
