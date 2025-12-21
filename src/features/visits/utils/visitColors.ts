import { HOME_COUNTRY_COLOR } from "@constants/colors";
import type { OverlayMode } from "@features/atlas/overlays";
import type { ColorPalette, VisitColorRoles } from "@types";

/**
 * Get the color for a country based on visit count and mode
 * @param count The number of visits to the country
 * @param isHome Whether the country is the home country
 * @param defaultFill The default fill color for unvisited countries
 * @param mode The visit color mode ("cumulative" or "yearly")
 * @param palette The VisitColorRoles palette to use
 * @param isNewThisYear Whether the visit is new this year (yearly mode)
 * @param isRevisitThisYear Whether the visit is a revisit this year (yearly mode)
 * @param isUpcomingVisit Whether the visit is an upcoming visit (yearly mode)
 * @param isUpcomingRevisit Whether the visit is an upcoming revisit (yearly mode)
 * @returns The color string for the country
 */
export function getVisitColor(
  count: number,
  isHome: boolean,
  defaultFill: string,
  mode: OverlayMode = "cumulative",
  palette: VisitColorRoles,
  isNewThisYear?: boolean,
  isRevisitThisYear?: boolean,
  isUpcomingVisit?: boolean,
  isUpcomingRevisit?: boolean
) {
  if (isHome) return palette.home;

  if (mode === "cumulative") {
    if (count === 1) return palette.visitCounts[0];
    if (count === 2) return palette.visitCounts[1];
    if (count === 3) return palette.visitCounts[2];
    if (count === 4) return palette.visitCounts[3];
    if (count >= 5) return palette.visitCounts[4];
    return defaultFill;
  }

  if (mode === "yearly") {
    if (isUpcomingRevisit) return palette.yearly.upcomingRevisit;
    if (isUpcomingVisit) return palette.yearly.upcoming;
    if (isRevisitThisYear) return palette.yearly.revisit;
    if (isNewThisYear) return palette.yearly.new;
    if (count === 0) return defaultFill;
    return palette.yearly.previous;
  }
}

/**
 * Get VisitColorRoles from a given ColorPalette
 * @param palette The color palette to extract roles from
 * @returns VisitColorRoles object
 */
export function getVisitColorRolesFromPalette(
  palette: ColorPalette
): VisitColorRoles {
  return {
    home: HOME_COUNTRY_COLOR,
    visitCounts: [...palette.colors].reverse(),
    yearly: {
      new: palette.colors[0],
      revisit: palette.colors[1],
      previous: palette.colors[2],
      upcoming: palette.colors[3],
      upcomingRevisit: palette.colors[4],
    },
  };
}
