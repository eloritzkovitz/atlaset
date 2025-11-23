import { mockCountries } from "@test-utils/mockCountries";
import {
  sortCountries,
} from "./countrySort";
import type { Country, SovereigntyType } from "@types";

describe("countrySort utils", () => {
  const countries = mockCountries;  

  describe("sortCountries", () => {
    it("sorts by name ascending", () => {
      const sorted = sortCountries(countries, "name-asc");
      expect(sorted.map((c) => c.name)).toEqual([
        "France",
        "Germany",
        "Guadeloupe",
      ]);
    });

    it("sorts by name descending", () => {
      const sorted = sortCountries(countries, "name-desc");
      expect(sorted.map((c) => c.name)).toEqual([
        "Guadeloupe",
        "Germany",
        "France",
      ]);
    });

    it("sorts by iso ascending", () => {
      const sorted = sortCountries(countries, "iso-asc");
      expect(sorted.map((c) => c.isoCode)).toEqual(["DE", "FR", "GP"]);
    });

    it("sorts by iso descending", () => {
      const sorted = sortCountries(countries, "iso-desc");
      expect(sorted.map((c) => c.isoCode)).toEqual(["GP", "FR", "DE"]);
    });

    it("calls the default case in sortCountries (return 0)", () => {
      const arr: Country[] = [
        {
          name: "A",
          isoCode: "A",
          region: "X",
          subregion: "Y",
          sovereigntyType: "Sovereign" as SovereigntyType,
          flag: "a",
          callingCode: "+1",
          iso3Code: "AAA",
        },
        {
          name: "B",
          isoCode: "B",
          region: "X",
          subregion: "Y",
          sovereigntyType: "Sovereign" as SovereigntyType,
          flag: "b",
          callingCode: "+2",
          iso3Code: "BBB",
        },
      ];
      // @ts-expect-error purposely passing an invalid sortBy
      const result = sortCountries(arr, "not-a-sort");
      expect(result).toEqual(arr);
    });    
  });
});
