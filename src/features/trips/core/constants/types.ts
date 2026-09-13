import { ABROAD_TRIP_COLOR, LOCAL_TRIP_COLOR } from "@constants/colors";
import { ICONS } from "@constants/icons";

export const TRIP_TYPE_CONFIG = {
  local: {
    label: "Local",
    color: LOCAL_TRIP_COLOR,
    icon: ICONS.tripLocal,
    colorClass: "bg-type-local/90 hover:bg-type-local",
  },
  abroad: {
    label: "Abroad",
    color: ABROAD_TRIP_COLOR,
    icon: ICONS.tripAbroad,
    colorClass: "bg-type-abroad/90 hover:bg-type-abroad",
  },
} as const;
