import { Chip } from "@components";
import type { TripStatus } from "../../types";
import "./StatusCell.css"

// Define colors for each status
const statusColors: Record<TripStatus, string> = {
  planned: "chip-planned",
  "in-progress": "chip-inprogress",
  completed: "chip-completed",
  cancelled: "chip-cancelled",
};

export function StatusCell({ status }: { status?: TripStatus }) {
  if (!status) return null;
  const color = statusColors[status] || statusColors.planned;
  const label =
    status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  return (
    <Chip className={`py-1 font-semibold justify-center rounded-full ${color}`}>
      {label}
    </Chip>
  );
}
