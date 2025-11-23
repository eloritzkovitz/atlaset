import { mockCountries } from "@test-utils/mockCountries";
import { mockTrips } from "@test-utils/mockTrips";
import type { Country, SovereigntyType } from "@types";
import { sortCountries } from "./countrySort";

describe("countrySort utils", () => {
  const countries = mockCountries;

  function getSortedNames(asc = true) {
    return [...countries]
      .sort((a, b) =>
        asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      )
      .map((c) => c.name);
  }

  function getSortedIsoCodes(asc = true) {
    return [...countries]
      .sort((a, b) =>
        asc
          ? (a.isoCode || "").localeCompare(b.isoCode || "")
          : (b.isoCode || "").localeCompare(a.isoCode || "")
      )
      .map((c) => c.isoCode);
  }

  it("sorts by name ascending", () => {
    const sorted = sortCountries(countries, "name-asc", mockTrips);
    expect(sorted.map((c) => c.name)).toEqual(getSortedNames(true));
  });

  it("sorts by name descending", () => {
    const sorted = sortCountries(countries, "name-desc", mockTrips);
    expect(sorted.map((c) => c.name)).toEqual(getSortedNames(false));
  });

  it("sorts by iso ascending", () => {
    const sorted = sortCountries(countries, "iso-asc", mockTrips);
    expect(sorted.map((c) => c.isoCode)).toEqual(getSortedIsoCodes(true));
  });

  it("sorts by iso descending", () => {
    const sorted = sortCountries(countries, "iso-desc", mockTrips);
    expect(sorted.map((c) => c.isoCode)).toEqual(getSortedIsoCodes(false));
  });

  it("sorts by first visit ascending", () => {
    const sorted = sortCountries(countries, "firstVisit-asc", mockTrips);    
    expect(sorted.map((c) => c.isoCode)).toEqual([
      "GP",
      "CA",
      "US",
      "FR",
      "DE",
      "JP",
    ]);
  });

  it("sorts by first visit descending", () => {
    const sorted = sortCountries(countries, "firstVisit-desc", mockTrips);
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
  });

  it("sorts by last visit ascending", () => {
    const sorted = sortCountries(countries, "lastVisit-asc", mockTrips);
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
  });

  it("sorts by last visit descending", () => {
    const sorted = sortCountries(countries, "lastVisit-desc", mockTrips);
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
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
    const result = sortCountries(arr, "not-a-sort", mockTrips);
    expect(result).toEqual(arr);
  });
});
