/** Represents the scope of country navigation. */
export type CountryNavigationScope = "all" | "region" | "subregion";

/** Represents the origin of a country navigation. */
export type CountryNavigationOrigin = {
  section:
    | "countries"
    | "currencies"
    | "languages"
    | "timezones"
    | "achievements";
  label: string;
  key: string;
};

/** Represents the options for generating explore breadcrumbs. */
export type ExploreBreadcrumbOptions = {
  selectedPanel: string;
  selectedRegion: string | null;
  selectedSubregion: string | null;
  selectedCountry: string | null;
  selectedLanguage: string | null;
  selectedCurrency: string | null;
  selectedTimezone: string | null;
  selectedAchievement: string | null;
  countryNavigationOrigin?: CountryNavigationOrigin;
};
