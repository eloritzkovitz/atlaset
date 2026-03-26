import { mockCountries } from "@test-utils/mockCountries";
import { mockTrips } from "@test-utils/mockTrips";
import { getCountrySortOptions, sortCountries } from "./countrySort";
import { getVisitedCountriesUpToYear, buildVisitContext } from "@features/visits/utils/visits";
import type { Country, SovereigntyType } from "../types";

describe("countrySort utils", () => {
  const countries = mockCountries;

  function getSortedNames(asc = true) {
    return [...countries]
      .sort((a, b) =>
        asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
      )
      .map((c) => c.name);
  }

  function getSortedIsoCodes(asc = true) {
    return [...countries]
      .sort((a, b) =>
        asc
          ? (a.isoCode || "").localeCompare(b.isoCode || "")
          : (b.isoCode || "").localeCompare(a.isoCode || ""),
      )
      .map((c) => c.isoCode);
  }

  function getCounts(trips: any) {
    return getVisitedCountriesUpToYear(trips, new Date().getFullYear());
  }

  function assertNonIncreasing(arr: number[]) {
    for (let i = 1; i < arr.length; i++) {
      expect(arr[i - 1]).toBeGreaterThanOrEqual(arr[i]);
    }
  }

  function assertNonDecreasing(arr: number[]) {
    for (let i = 1; i < arr.length; i++) {
      expect(arr[i - 1]).toBeLessThanOrEqual(arr[i]);
    }
  }

  it("sorts by name ascending", () => {
    const sorted = sortCountries(countries, "name-asc", buildVisitContext(mockTrips));
    expect(sorted.map((c) => c.name)).toEqual(getSortedNames(true));
  });

  it("sorts by name descending", () => {
    const sorted = sortCountries(countries, "name-desc", buildVisitContext(mockTrips));
    expect(sorted.map((c) => c.name)).toEqual(getSortedNames(false));
  });

  it("sorts by iso ascending", () => {
    const sorted = sortCountries(countries, "isoCode-asc", buildVisitContext(mockTrips));
    expect(sorted.map((c) => c.isoCode)).toEqual(getSortedIsoCodes(true));
  });

  it("sorts by iso descending", () => {
    const sorted = sortCountries(countries, "isoCode-desc", buildVisitContext(mockTrips));
    expect(sorted.map((c) => c.isoCode)).toEqual(getSortedIsoCodes(false));
  });

  it("handles missing isoCode when sorting", () => {
    const arr = [
      {
        name: "NoISO",
        region: "X",
        subregion: "Y",
        sovereigntyType: "Sovereign" as SovereigntyType,
        callingCode: "+0",
        iso3Code: "NOI",
      },
      {
        name: "HasISO",
        isoCode: "ZZ",
        region: "X",
        subregion: "Y",
        sovereigntyType: "Sovereign" as SovereigntyType,
        callingCode: "+0",
        iso3Code: "ZZZ",
      },
    ] as unknown as Country[];

    const sorted = sortCountries(arr, "isoCode-asc", buildVisitContext(mockTrips));
    expect(sorted.length).toBe(2);
    expect(sorted[0].name).toBe("NoISO");
  });

  it("sorts by first visit ascending", () => {
    const sorted = sortCountries(countries, "firstVisit-asc", buildVisitContext(mockTrips));
    expect(sorted.map((c) => c.isoCode)).toEqual([
      "GP",
      "CA",
      "US",
      "FR",
      "DE",
      "JP",
    ]);
  });

  it("sorts by visit count descending", () => {
    const sorted = sortCountries(countries, "visitCount-desc", buildVisitContext(mockTrips));
    const counts = getCounts(mockTrips);
    const sortedCounts = sorted.map((c) => counts[c.isoCode] ?? 0);
    assertNonIncreasing(sortedCounts);
    expect(sorted.map((c) => c.isoCode).sort()).toEqual(
      countries.map((c) => c.isoCode).sort(),
    );
  });

  it("sorts by visit count ascending", () => {
    const sorted = sortCountries(countries, "visitCount-asc", buildVisitContext(mockTrips));
    const counts = getCounts(mockTrips);
    const sortedCounts = sorted.map((c) => counts[c.isoCode] ?? 0);
    assertNonDecreasing(sortedCounts);
    expect(sorted.map((c) => c.isoCode).sort()).toEqual(
      countries.map((c) => c.isoCode).sort(),
    );
  });

  it("ignores planned/upcoming trips when computing visit counts", () => {
    const trips = [
      {
        id: "a",
        countryCodes: ["AA"],
        startDate: "2020-01-01",
        endDate: "2020-01-02",
        status: "completed",
        fullDays: 0,
      },
      {
        id: "b",
        countryCodes: ["AA"],
        startDate: "2099-01-01",
        endDate: "2099-01-02",
        status: "planned",
        fullDays: 0,
      },
    ];

    const arr: Country[] = [
      {
        name: "A",
        isoCode: "AA",
        region: "X",
        subregion: "Y",
        sovereigntyType: "Sovereign" as SovereigntyType,
        callingCode: "+1",
        iso3Code: "AAA",
      },
      {
        name: "B",
        isoCode: "BB",
        region: "X",
        subregion: "Y",
        sovereigntyType: "Sovereign" as SovereigntyType,
        callingCode: "+2",
        iso3Code: "BBB",
      },
    ];

    const sorted = sortCountries(arr, "visitCount-desc", buildVisitContext(trips as any));
    expect(sorted[0].isoCode).toBe("AA");
  });

  it("sorts by first visit descending", () => {
    const sorted = sortCountries(countries, "firstVisit-desc", buildVisitContext(mockTrips));
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
  });

  it("sorts by last visit ascending", () => {
    const sorted = sortCountries(countries, "lastVisit-asc", buildVisitContext(mockTrips));
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
  });

  it("sorts by last visit descending", () => {
    const sorted = sortCountries(countries, "lastVisit-desc", buildVisitContext(mockTrips));
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
        callingCode: "+1",
        iso3Code: "AAA",
      },
      {
        name: "B",
        isoCode: "B",
        region: "X",
        subregion: "Y",
        sovereigntyType: "Sovereign" as SovereigntyType,
        callingCode: "+2",
        iso3Code: "BBB",
      },
    ];
    // @ts-expect-error purposely passing an invalid sortBy
    const result = sortCountries(arr, "not-a-sort", buildVisitContext(mockTrips));
    expect(result).toEqual(arr);
  });

  describe("getCountrySortOptions", () => {
    it("returns basic sort options when visitedOnly is false or undefined", () => {
      const options = getCountrySortOptions(false);
      const keyGroup = options.find((g) => g.label === "SORT BY");
      expect(keyGroup?.options.map((opt) => opt.value)).toEqual([
        "name",
        "isoCode",
      ]);
    });

    it("returns all sort options when visitedOnly is true", () => {
      const options = getCountrySortOptions(true);
      const keyGroup = options.find((g) => g.label === "SORT BY");
      expect(keyGroup?.options.map((opt) => opt.value)).toEqual([
        "name",
        "isoCode",
        "visitCount",
        "firstVisit",
        "lastVisit",
      ]);
    });
  });
});
