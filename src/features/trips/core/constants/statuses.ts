import type { IconType } from "react-icons";
import {
  CANCELLED_COLOR,
  IN_PROGRESS_COLOR,
  PLANNED_VISIT_COLOR,
  UPCOMING_VISIT_COLOR,
  VISITED_COLOR,
} from "@constants/colors";
import { ICONS } from "@constants/icons";
import type { TripStatus } from "../types";

export const ALL_TRIP_STATUSES = [
  "planned",
  "upcoming",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export const FUTURE_TRIP_STATUSES: TripStatus[] = ["in-progress", "upcoming"];

export const TRIP_STATUS_CONFIG: Record<
  TripStatus,
  {
    color: string;
    label: string;
    icon: IconType;
  }
> = {
  planned: {
    color: PLANNED_VISIT_COLOR,
    label: "Planned",
    icon: ICONS.tripPlanned,
  },
  upcoming: {
    color: UPCOMING_VISIT_COLOR,
    label: "Upcoming",
    icon: ICONS.tripUpcoming,
  },
  "in-progress": {
    color: IN_PROGRESS_COLOR,
    label: "In Progress",
    icon: ICONS.tripInProgress,
  },
  completed: {
    color: VISITED_COLOR,
    label: "Completed",
    icon: ICONS.tripCompleted,
  },
  cancelled: {
    color: CANCELLED_COLOR,
    label: "Cancelled",
    icon: ICONS.tripCancelled,
  },
};
