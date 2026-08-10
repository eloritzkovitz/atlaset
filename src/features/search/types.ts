import type { Country, Currency, Timezone } from "@features/countries/types";
import type { UserProfile } from "@features/user/profile/types";
import type { Language } from "@types";

/** Represents the type of a search result. */
export type SearchResultType =
  | "user"
  | "country"
  | "currency"
  | "language"
  | "timezone"
  | "region"
  | "subregion";

export type UserSearchResult = UserProfile & { type: "user" };
export type CountrySearchResult = Country & { type: "country" };
export type CurrencySearchResult = Currency & { type: "currency" };
export type LanguageSearchResult = Language & { type: "language" };
export type TimezoneSearchResult = Timezone & { type: "timezone" };

export type RegionSearchResult = {
  type: "region";
  region: string;
};

export type SubregionSearchResult = {
  type: "subregion";
  region: string;
  subregion: string;
};

/** Represents a generic search result. */
export type SearchResult =
  | UserSearchResult
  | CountrySearchResult
  | CurrencySearchResult
  | LanguageSearchResult
  | TimezoneSearchResult
  | RegionSearchResult
  | SubregionSearchResult;
