/** Represents a fact about a country. */
export type CountryFact = {
  id: string;
  countryCodes: string[];
  category: CountryFactCategory;
  description: string;
};

export type CountryFactCategory =
  | "geography"
  | "history"
  | "culture"
  | "agriculture"
  | "economy"
  | "politics"
  | "science"
  | "sports"
  | "miscellaneous";
