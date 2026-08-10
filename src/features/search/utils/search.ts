import type { Country } from "@features/countries/types";
import { getCountryName } from "@features/countries/utils/countryData";
import type { SerializableUser } from "@features/user/auth/types";
import type { Friend } from "@features/user/friends/types";
import type { UserProfile } from "@features/user/profile/types";
import i18n from "@lib/i18n/config";
import type { SearchResult } from "../types";

/**
 * Generates a consistent search results path.
 * @param term - The search term to include in the path.
 * @returns A string representing the search results path.
 */
export function getSearchRoute(term: string): string {
  return `/search?query=${encodeURIComponent(term.trim())}`;
}

/**
 * Renders a search result item based on its type (user, country, currency, region, or subregion).
 * @param item - The search result item to render.
 * @param countries - The list of all countries for looking up sovereign names.
 * @returns A JSX element representing the search result item.
 */
export function getCountryLabel(item: Country, countries: Country[]): string {
  if (
    item.sovereigntyStatus === "dependency" ||
    item.sovereigntyStatus === "overseas_region"
  ) {
    const sovereignName = getCountryName(
      item.sovereignState || "Unknown",
      countries,
    );
    if (sovereignName) {
      return i18n.t(`countries:labels.${item.sovereigntyStatus}_of`, {
        sovereign: sovereignName,
      });
    }
  }
  return i18n.t("countries:labels.country", { defaultValue: "Country" });
}

/**
 * Determines the label for a user based on their relationship to the current user.
 * @param profile - The user profile to label.
 * @param currentUser - The current logged-in user.
 * @param friendList - The list of friends for the current user.
 * @returns The label for the user.
 */
export function getUserLabel(
  profile: UserProfile,
  currentUser: SerializableUser | null,
  friendList: Friend[],
) {
  if (currentUser && profile.uid === currentUser.uid) {
    return "You";
  } else if (currentUser && friendList.some((f) => f.uid === profile.uid)) {
    return "Friend";
  }
  return "";
}

/**
 * Returns a unique key for a search result based on its type and properties.
 * @param item - The search result item to generate a key for.
 * @returns A string representing the unique key for the search result.
 */
export function getSearchResultKey(item: SearchResult): string {
  switch (item.type) {
    case "user":
      return item.uid;
    case "country":
      return item.isoCode || item.name;
    case "currency":
      return item.code || item.name;
    case "region":
      return item.region;
    case "subregion":
      return `${item.region}-${item.subregion}`;
    default:
      return JSON.stringify(item);
  }
}

/**
 * Ranks items by whether their label starts with or contains the search term.
 * Items whose label starts with the search term are ranked higher than those that only contain it.
 * @param items - The array of items to rank.
 * @param getLabel - A function that returns the label for an item.
 * @param searchTerm - The term to search for.
 * @returns A new array of items ranked by relevance to the search term.
 */
export function rankByStartsWithAndContains<T>(
  items: T[],
  getLabel: (item: T) => string | undefined,
  searchTerm: string,
): T[] {
  const lowerTerm = searchTerm.toLowerCase();
  const startsWith = items.filter((item) =>
    getLabel(item)?.toLowerCase().startsWith(lowerTerm),
  );
  const contains = items.filter(
    (item) =>
      !getLabel(item)?.toLowerCase().startsWith(lowerTerm) &&
      getLabel(item)?.toLowerCase().includes(lowerTerm),
  );
  return [...startsWith, ...contains];
}

/**
 * Ranks, deduplicates, and maps items by search term.
 * Items whose label starts with the search term are ranked higher than those that only contain it.
 * @param items - The array of items to rank.
 * @param getLabel - A function that returns the label for an item.
 * @param searchTerm - The term to search for.
 * @param mapFn - Function to map each item to desired result.
 * @returns Array of mapped items ranked and deduplicated.
 */
export function rankAndMap<T, R>(
  items: T[],
  getLabel: (item: T) => string | undefined,
  searchTerm: string,
  mapFn: (item: T) => R,
): R[] {
  return rankByStartsWithAndContains(items, getLabel, searchTerm)
    .filter(
      (item, idx, arr) =>
        arr.findIndex((i) => getLabel(i) === getLabel(item)) === idx,
    )
    .map(mapFn);
}
