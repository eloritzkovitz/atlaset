import type { SegmentedToggleOption } from "@components";
import type { CalendarView } from "../types";

export const viewOptions: SegmentedToggleOption<CalendarView>[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];
