import type { TabControlItem } from "@components";
import type { TFunction } from "i18next";

export type TripTab =
  | "overview"
  | "destinations"
  | "itinerary"
  | "details"
  | "people"
  | "photos";

export function getTripModalTabs(
  mode: "add" | "edit" | "custom",
  t: TFunction<"trips">,
): TabControlItem<TripTab>[] {
  return [
    {
      value: "overview",
      label: t("sections.overview"),
    },
    {
      value: "destinations",
      label: t("sections.destinations"),
    },
    ...(mode !== "custom"
      ? ([
          {
            value: "itinerary",
            label: t("sections.itinerary"),
          },
          {
            value: "details",
            label: t("sections.details"),
          },
          {
            value: "people",
            label: t("sections.people"),
          },
          {
            value: "photos",
            label: t("sections.photos"),
          },
        ] satisfies TabControlItem<TripTab>[])
      : []),
  ];
}
