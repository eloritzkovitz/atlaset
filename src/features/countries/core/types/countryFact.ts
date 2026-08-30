/** Represents a fact about a country. */
export type CountryFact = {
  id: string;
  countryCodes: string[];
  category: CountryFactCategory;
  description: string;
};

export type CountryFactCategory =
  | "agriculture"
  | "archaeology"
  | "architecture"
  | "culture"
  | "economy"
  | "geography"
  | "history"
  | "miscellaneous"
  | "politics"
  | "science"
  | "sports"
  | "technology";
