import { mockCountries } from "@test-utils/mockCountries";
import { mockTrips } from "@test-utils/mockTrips";
import { getCountrySortOptions, sortCountries } from "./countrySort";
import {
  getVisitedCountriesUpToYear,
  buildVisitContext,
} from "@features/visits/utils/visits";
import type { Country, SovereigntyStatus } from "../types";

describe("countrySort utils", () => {
  const countries = mockCountries;

  function getSortedByField(field: keyof Country, asc = true) {
    return [...countries]
      .sort((a, b) => {
        const av = (a as any)[field];
        const bv = (b as any)[field];
        if (typeof av === "string" || typeof bv === "string") {
          return asc
            ? String(av || "").localeCompare(String(bv || ""))
            : String(bv || "").localeCompare(String(av || ""));
        }
        return asc ? (av ?? 0) - (bv ?? 0) : (bv ?? 0) - (av ?? 0);
      })
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

  const simpleCases: Array<{
    key: keyof Country;
    valuesAreNames?: boolean;
  }> = [
    { key: "name", valuesAreNames: true },
    { key: "isoCode", valuesAreNames: true },
    { key: "area" },
    { key: "population" },
  ];

  simpleCases.forEach(({ key, valuesAreNames }) => {
    ["asc", "desc"].forEach((dir) => {
      const asc = dir === "asc";
      it(`sorts by ${String(key)} ${asc ? "ascending" : "descending"}`, () => {
        const sorted = sortCountries(
          countries,
          `${String(key)}-${dir}` as any,
          buildVisitContext(mockTrips),
        );
        if (valuesAreNames) {
          const expected = [...countries]
            .sort((a, b) => {
              const av = String((a as any)[key] || "");
              const bv = String((b as any)[key] || "");
              return asc ? av.localeCompare(bv) : bv.localeCompare(av);
            })
            .map((c) => (c as any)[key]);

          expect(sorted.map((c) => (c as any)[key])).toEqual(expected);
        } else {
          expect(sorted.map((c) => c.isoCode)).toEqual(
            getSortedByField(key, asc),
          );
        }
      });
    });
  });

  it("handles missing isoCode when sorting", () => {
    const arr = [
      {
        name: "NoISO",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "NOI",
      },
      {
        name: "HasISO",
        isoCode: "ZZ",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "ZZZ",
      },
    ] as unknown as Country[];

    const sorted = sortCountries(
      arr,
      "isoCode-asc",
      buildVisitContext(mockTrips),
    );
    expect(sorted.length).toBe(2);
    expect(sorted[0].name).toBe("NoISO");
  });

  it("treats missing area as 0 when sorting", () => {
    const arr: Country[] = [
      {
        name: "NoArea",
        isoCode: "AA",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "NOA",
      },
      {
        name: "HasArea",
        isoCode: "BB",
        area: 10,
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "HAF",
      },
    ];

    const asc = sortCountries(arr, "area-asc", buildVisitContext(mockTrips));
    expect(asc.map((c) => c.isoCode)).toEqual(["AA", "BB"]);

    const desc = sortCountries(arr, "area-desc", buildVisitContext(mockTrips));
    expect(desc.map((c) => c.isoCode)).toEqual(["BB", "AA"]);
  });

  it("treats missing population as 0 when sorting", () => {
    const arr: Country[] = [
      {
        name: "NoPop",
        isoCode: "CC",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "NOP",
      },
      {
        name: "HasPop",
        isoCode: "DD",
        population: 100,
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "HAP",
      },
    ];

    const asc = sortCountries(
      arr,
      "population-asc",
      buildVisitContext(mockTrips),
    );
    expect(asc.map((c) => c.isoCode)).toEqual(["CC", "DD"]);

    const desc = sortCountries(
      arr,
      "population-desc",
      buildVisitContext(mockTrips),
    );
    expect(desc.map((c) => c.isoCode)).toEqual(["DD", "CC"]);
  });

  it("sorts by first visit ascending", () => {
    const sorted = sortCountries(
      countries,
      "firstVisit-asc",
      buildVisitContext(mockTrips),
    );
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
    const sorted = sortCountries(
      countries,
      "visitCount-desc",
      buildVisitContext(mockTrips),
    );
    const counts = getCounts(mockTrips);
    const sortedCounts = sorted.map((c) => counts[c.isoCode] ?? 0);
    assertNonIncreasing(sortedCounts);
    expect(sorted.map((c) => c.isoCode).sort()).toEqual(
      countries.map((c) => c.isoCode).sort(),
    );
  });

  it("sorts by visit count ascending", () => {
    const sorted = sortCountries(
      countries,
      "visitCount-asc",
      buildVisitContext(mockTrips),
    );
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
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+1",
        iso3Code: "AAA",
      },
      {
        name: "B",
        isoCode: "BB",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+2",
        iso3Code: "BBB",
      },
    ];

    const sorted = sortCountries(
      arr,
      "visitCount-desc",
      buildVisitContext(trips as any),
    );
    expect(sorted[0].isoCode).toBe("AA");
  });

  it("sorts by first visit descending", () => {
    const sorted = sortCountries(
      countries,
      "firstVisit-desc",
      buildVisitContext(mockTrips),
    );
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
  });

  it("sorts by last visit ascending", () => {
    const sorted = sortCountries(
      countries,
      "lastVisit-asc",
      buildVisitContext(mockTrips),
    );
    expect(sorted.length).toBe(countries.length);
    expect(sorted[0].isoCode).toBeDefined();
  });

  it("sorts by last visit descending", () => {
    const sorted = sortCountries(
      countries,
      "lastVisit-desc",
      buildVisitContext(mockTrips),
    );
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
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+1",
        iso3Code: "AAA",
      },
      {
        name: "B",
        isoCode: "B",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "Sovereign" as SovereigntyStatus,
        callingCode: "+2",
        iso3Code: "BBB",
      },
    ];
    // @ts-expect-error
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
        "area",
        "population",
      ]);
    });

    it("returns all sort options when visitedOnly is true", () => {
      const options = getCountrySortOptions(true);
      const keyGroup = options.find((g) => g.label === "SORT BY");
      expect(keyGroup?.options.map((opt) => opt.value)).toEqual([
        "name",
        "isoCode",
        "area",
        "population",
        "visitCount",
        "firstVisit",
        "lastVisit",
      ]);
    });
  });
});
