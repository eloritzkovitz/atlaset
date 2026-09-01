import { mockCountries } from "@test-utils/mockCountries";
import { mockTrips } from "@test-utils/mockTrips";
import { getCountrySortOptions, sortCountries } from "./countrySort";
import {
  getVisitCountsUpToYear,
  buildVisitContext,
} from "@features/visits/utils/visits";
import type { Country, SovereigntyStatus } from "../../types";

describe("countrySort utils", () => {
  const countries = mockCountries;
  const visitContext = buildVisitContext(mockTrips);

  function sortByField(field: keyof Country, asc = true): string[] {
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
    return getVisitCountsUpToYear(trips, new Date().getFullYear());
  }

  function expectSortedNumbers(values: number[], direction: "asc" | "desc") {
    for (let i = 1; i < values.length; i++) {
      if (direction === "asc") {
        expect(values[i - 1]).toBeLessThanOrEqual(values[i]);
      } else {
        expect(values[i - 1]).toBeGreaterThanOrEqual(values[i]);
      }
    }
  }

  const simpleCases: Array<{
    key: keyof Country;
    stringField?: boolean;
  }> = [
    { key: "name", stringField: true },
    { key: "isoCode", stringField: true },
    { key: "area" },
    { key: "population" },
  ];

  simpleCases.forEach(({ key, stringField }) => {
    ["asc", "desc"].forEach((direction) => {
      const asc = direction === "asc";

      it(`sorts by ${String(key)} ${asc ? "ascending" : "descending"}`, () => {
        const sorted = sortCountries(
          countries,
          `${String(key)}-${direction}` as any,
          visitContext,
        );

        if (stringField) {
          const expected = [...countries]
            .sort((a, b) => {
              const av = String((a as any)[key] || "");
              const bv = String((b as any)[key] || "");
              return asc ? av.localeCompare(bv) : bv.localeCompare(av);
            })
            .map((c) => (c as any)[key]);

          expect(sorted.map((c) => (c as any)[key])).toEqual(expected);
        } else {
          expect(sorted.map((c) => c.isoCode)).toEqual(sortByField(key, asc));
        }
      });
    });
  });

  describe("name sorting", () => {
    it("sorts The Bahamas under B and The Gambia under G", () => {
      const arr = [
        {
          name: "The Bahamas",
          isoCode: "BS",
        },
        {
          name: "The Gambia",
          isoCode: "GM",
        },
        {
          name: "Albania",
          isoCode: "AL",
        },
        {
          name: "France",
          isoCode: "FR",
        },
      ] as Country[];

      const sorted = sortCountries(arr, "name-asc", visitContext);

      expect(sorted.map((c) => c.isoCode)).toEqual(["AL", "BS", "FR", "GM"]);
    });

    it("only ignores The for BS and GM", () => {
      const arr = [
        {
          name: "The Example",
          isoCode: "XX",
        },
        {
          name: "The Bahamas",
          isoCode: "BS",
        },
        {
          name: "The Gambia",
          isoCode: "GM",
        },
      ] as Country[];

      const sorted = sortCountries(arr, "name-asc", visitContext);

      expect(sorted.map((c) => c.isoCode)).toEqual(["BS", "GM", "XX"]);
    });

    it("handles The case-insensitively for BS and GM", () => {
      const arr = [
        {
          name: "THE BAHAMAS",
          isoCode: "BS",
        },
        {
          name: "the gambia",
          isoCode: "GM",
        },
      ] as Country[];

      const sorted = sortCountries(arr, "name-asc", visitContext);

      expect(sorted.map((c) => c.isoCode)).toEqual(["BS", "GM"]);
    });
  });

  it("handles missing isoCode when sorting", () => {
    const arr = [
      {
        name: "NoISO",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "NOI",
      },
      {
        name: "HasISO",
        isoCode: "ZZ",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "sovereign" as SovereigntyStatus,
        callingCode: "+0",
        iso3Code: "ZZZ",
      },
    ] as unknown as Country[];

    const sorted = sortCountries(arr, "isoCode-asc", visitContext);

    expect(sorted.map((c) => c.name)).toEqual(["NoISO", "HasISO"]);
  });

  it.each([
    ["area", "AA", "BB", "NoArea", "HasArea"],
    ["population", "CC", "DD", "NoPop", "HasPop"],
  ] as const)(
    "treats missing %s as 0 when sorting",
    (key, firstCode, secondCode, firstName, secondName) => {
      const value = key === "area" ? 10 : 100;

      const arr = [
        {
          name: firstName,
          isoCode: firstCode,
          region: "X",
          subregion: "Y",
          sovereigntyStatus: "sovereign" as SovereigntyStatus,
          callingCode: "+0",
          iso3Code: firstCode,
        },
        {
          name: secondName,
          isoCode: secondCode,
          [key]: value,
          region: "X",
          subregion: "Y",
          sovereigntyStatus: "sovereign" as SovereigntyStatus,
          callingCode: "+0",
          iso3Code: secondCode,
        },
      ] as Country[];

      expect(
        sortCountries(arr, `${key}-asc` as any, visitContext).map(
          (c) => c.isoCode,
        ),
      ).toEqual([firstCode, secondCode]);

      expect(
        sortCountries(arr, `${key}-desc` as any, visitContext).map(
          (c) => c.isoCode,
        ),
      ).toEqual([secondCode, firstCode]);
    },
  );

  it("sorts by first visit ascending", () => {
    const sorted = sortCountries(countries, "firstVisit-asc", visitContext);

    expect(sorted.map((c) => c.isoCode)).toEqual([
      "GP",
      "CA",
      "US",
      "FR",
      "DE",
      "JP",
    ]);
  });

  it.each(["asc", "desc"] as const)("sorts by visit count %s", (direction) => {
    const sorted = sortCountries(
      countries,
      `visitCount-${direction}`,
      visitContext,
    );
    const counts = sorted.map((c) => getCounts(mockTrips)[c.isoCode] ?? 0);

    expectSortedNumbers(counts, direction);
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

    const arr = [
      {
        name: "A",
        isoCode: "AA",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "sovereign" as SovereigntyStatus,
        callingCode: "+1",
        iso3Code: "AAA",
      },
      {
        name: "B",
        isoCode: "BB",
        region: "X",
        subregion: "Y",
        sovereigntyStatus: "sovereign" as SovereigntyStatus,
        callingCode: "+2",
        iso3Code: "BBB",
      },
    ] as Country[];

    const sorted = sortCountries(
      arr,
      "visitCount-desc",
      buildVisitContext(trips as any),
    );

    expect(sorted[0].isoCode).toBe("AA");
  });

  it.each(["firstVisit-desc", "lastVisit-asc", "lastVisit-desc"] as const)(
    "sorts by %s",
    (sortBy) => {
      const sorted = sortCountries(countries, sortBy, visitContext);

      expect(sorted).toHaveLength(countries.length);
      expect(sorted[0].isoCode).toBeDefined();
    },
  );

  it("returns the original order for an invalid sort key", () => {
    const arr = [
      { name: "Same", isoCode: "AAA" },
      { name: "Same", isoCode: "AAA" },
    ] as Country[];

    expect(sortCountries(arr, "not-a-sort" as any, visitContext)).toEqual(arr);
  });

  describe("getCountrySortOptions", () => {
    it("returns basic options when visitedOnly is false", () => {
      expect(
        getCountrySortOptions(false)[0].options.map((opt) => opt.value),
      ).toEqual(["name", "isoCode", "area", "population"]);
    });

    it("returns all options when visitedOnly is true", () => {
      expect(
        getCountrySortOptions(true)[0].options.map((opt) => opt.value),
      ).toEqual([
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
