import type { UserProfile } from "@features/user/profile/types";
import type { Country } from "@features/countries/types";

/** Represents a search result for a user. */
export type UserSearchResult = UserProfile & { type: "user" };

/** Represents a search result for a country. */
export type CountrySearchResult = Country & { type: "country" };

export type CurrencySearchResult = {
  type: "currency";
  code: string;
  name: string;
};

/** Represents a search result for a region. */
export type RegionSearchResult = {
  type: "region";
  region: string;
};

/** Represents a search result for a subregion. */
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
  | RegionSearchResult
  | SubregionSearchResult;
