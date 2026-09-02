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

/** Represents the controls for the explore countries view. */
export interface ExploreCountryViewControls {
  search: string;
  setSearch: (search: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedSovereignOnly: boolean;
  setSelectedSovereignOnly: (value: boolean) => void;
  showVisitedOnly: boolean;
  setShowVisitedOnly: (value: boolean) => void;
  showTranscontinental: boolean;
  setShowTranscontinental: (value: boolean) => void;
  onShowAllCountries?: () => void;
  resetFilters?: () => void;
}
