import { mockCountries } from "@test-utils/mockCountries";
import { mockTrips } from "@test-utils/mockTrips";
import { sortTrips } from "./tripSort";
import type { Trip, TripSortBy, TripSortByKey } from "../types";

function getExpectedOrder(
  trips: Trip[],
  key: TripSortByKey,
  direction: "asc" | "desc" = "asc",
  fallback?: string | number
): string[] {
  const tentative = trips.filter((t) => !t.startDate);
  const sortedNonTentative = trips.filter((t) => t.startDate);
  const getStr = (arr?: string[]) =>
    arr ? arr.join(",") : (fallback as string) || "";
  switch (key) {
    case "name":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? (a.name || "").localeCompare(b.name || "")
          : (b.name || "").localeCompare(a.name || "")
      );
      break;
    case "rating":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? (a.rating ?? 0) - (b.rating ?? 0)
          : (b.rating ?? 0) - (a.rating ?? 0)
      );
      break;
    case "countries":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? getStr(a.countryCodes).localeCompare(getStr(b.countryCodes))
          : getStr(b.countryCodes).localeCompare(getStr(a.countryCodes))
      );
      break;
    case "year":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? (a.startDate ? new Date(a.startDate).getFullYear() : 0) -
            (b.startDate ? new Date(b.startDate).getFullYear() : 0)
          : (b.startDate ? new Date(b.startDate).getFullYear() : 0) -
            (a.startDate ? new Date(a.startDate).getFullYear() : 0)
      );
      break;
    case "categories":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? getStr(a.categories as string[]).localeCompare(
              getStr(b.categories as string[])
            )
          : getStr(b.categories as string[]).localeCompare(
              getStr(a.categories as string[])
            )
      );
      break;
    case "status":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? (a.status ?? "").localeCompare(b.status ?? "")
          : (b.status ?? "").localeCompare(a.status ?? "")
      );
      break;
    case "tags":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? getStr(a.tags as string[]).localeCompare(getStr(b.tags as string[]))
          : getStr(b.tags as string[]).localeCompare(getStr(a.tags as string[]))
      );
      break;
    case "fullDays":
      sortedNonTentative.sort((a, b) =>
        direction === "asc"
          ? (a.fullDays ?? 0) - (b.fullDays ?? 0)
          : (b.fullDays ?? 0) - (a.fullDays ?? 0)
      );
      break;
    default:
      // For unknown sort key, keep original order
      break;
  }
  return [
    ...tentative.map((t) => t.id),
    ...sortedNonTentative.map((t) => t.id),
  ];
}

describe("tripSort utils", () => {
  const sortKeys: TripSortByKey[] = [
    "name",
    "rating",
    "countries",
    "year",
    "categories",
    "status",
    "tags",
    "fullDays",
  ];
  const directions: ("asc" | "desc")[] = ["asc", "desc"];

  it.each(sortKeys.flatMap((key) => directions.map((dir) => [key, dir])))(
    "sorts by %s %s, tentative first",
    (key, direction) => {
      const sortBy = `${key}-${direction}` as TripSortBy;
      const sorted = sortTrips(mockTrips, mockCountries, sortBy);
      const expectedOrder = getExpectedOrder(
        mockTrips,
        key as TripSortByKey,
        direction as "asc" | "desc"
      );
      expect(sorted.map((t) => t.id)).toEqual(expectedOrder);
    }
  );

  it.each([
    ["startDate-asc", "startDate"],
    ["endDate-asc", "endDate"],
  ])("sorts by %s, stable for tentative", (sortKey, dateKey) => {
    const tentativeTripA = { ...mockTrips[0], [dateKey]: undefined };
    const tentativeTripB = { ...mockTrips[1], [dateKey]: undefined };
    const trips = [tentativeTripA, tentativeTripB];
    const sorted = sortTrips(trips, mockCountries, sortKey as TripSortBy);
    expect(sorted[0]).toBe(tentativeTripA);
    expect(sorted[1]).toBe(tentativeTripB);
  });

  it("sorts by startDate ascending, tentative first", () => {
    const tripWithDate = { ...mockTrips[0], startDate: "2025-01-01" };
    const tentativeTrip = { ...mockTrips[1], startDate: undefined };
    const trips = [tentativeTrip, tripWithDate];
    const sorted = sortTrips(trips, mockCountries, "startDate-asc");
    expect(sorted[0]).toBe(tentativeTrip);
    expect(sorted[1]).toBe(tripWithDate);
  });

  it("sorts by startDate ascending, both tentative remain in order (stable)", () => {
    const tentativeTripA = { ...mockTrips[0], startDate: undefined };
    const tentativeTripB = { ...mockTrips[1], startDate: undefined };
    const trips = [tentativeTripA, tentativeTripB];
    const sorted = sortTrips(trips, mockCountries, "startDate-asc");
    expect(sorted[0]).toBe(tentativeTripA);
    expect(sorted[1]).toBe(tentativeTripB);
  });

  it("sorts by endDate ascending, trip with endDate comes before tentative", () => {
    const tripWithEndDate = { ...mockTrips[0], endDate: "2025-01-01" };
    const tentativeTrip = { ...mockTrips[1], endDate: undefined };
    const trips = [tentativeTrip, tripWithEndDate];
    const sorted = sortTrips(trips, mockCountries, "endDate-asc");
    expect(sorted[0]).toBe(tripWithEndDate);
    expect(sorted[1]).toBe(tentativeTrip);
  });

  it.each([
    ["startDate-asc", "startDate"],
    ["endDate-asc", "endDate"],
  ])("sorts by %s, stable for tentative", (sortKey, dateKey) => {
    const tentativeTripA = { ...mockTrips[0], [dateKey]: undefined };
    const tentativeTripB = { ...mockTrips[1], [dateKey]: undefined };
    const trips = [tentativeTripA, tentativeTripB];
    const sorted = sortTrips(trips, mockCountries, sortKey as TripSortBy);
    expect(sorted[0]).toBe(tentativeTripA);
    expect(sorted[1]).toBe(tentativeTripB);
  });

  it("sorts by fullDays ascending, tentative first", () => {
    const tripWithFullDays = {
      ...mockTrips[0],
      fullDays: 5,
      startDate: "2023-01-01",
    };
    const tentativeTrip = {
      ...mockTrips[1],
      fullDays: undefined,
      startDate: undefined,
    };
    const trips = [tentativeTrip, tripWithFullDays];
    const sorted = sortTrips(trips, mockCountries, "fullDays-asc");
    expect(sorted[0]).toBe(tentativeTrip);
    expect(sorted[1]).toBe(tripWithFullDays);
  });

  it("sorts by fullDays ascending, tentative first", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "fullDays-asc");
    const tentative = mockTrips.filter((t) => !t.startDate);
    const nonTentative = mockTrips.filter((t) => t.startDate);
    const sortedNonTentative = [...nonTentative]
      .sort((a, b) => (a.fullDays || 0) - (b.fullDays || 0))
      .map((t) => t.id);
    const expected = [...tentative.map((t) => t.id), ...sortedNonTentative];
    expect(sorted.map((t) => t.id)).toEqual(expected);
  });

  it("sorts by fullDays descending, tentative first", () => {
    const tripWithFullDays = {
      ...mockTrips[0],
      fullDays: 5,
      startDate: "2023-01-01",
    };
    const tentativeTrip = {
      ...mockTrips[1],
      fullDays: undefined,
      startDate: undefined,
    };
    const trips = [tentativeTrip, tripWithFullDays];
    const sorted = sortTrips(trips, mockCountries, "fullDays-desc");
    expect(sorted[0]).toBe(tentativeTrip);
    expect(sorted[1]).toBe(tripWithFullDays);
  });

  it("sorts by categories ascending", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "categories-asc");
    const sortedCategories = sorted.map((t) => t.categories?.join(",") ?? "");
    const expected = [...mockTrips]
      .sort((a, b) =>
        (a.categories?.join(",") ?? "").localeCompare(
          b.categories?.join(",") ?? ""
        )
      )
      .map((t) => t.categories?.join(",") ?? "");
    expect(sortedCategories).toEqual(expected);
  });

  it("sorts by categories descending", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "categories-desc");
    const sortedCategories = sorted.map((t) => t.categories?.join(",") ?? "");
    const expected = [...mockTrips]
      .sort((a, b) =>
        (b.categories?.join(",") ?? "").localeCompare(
          a.categories?.join(",") ?? ""
        )
      )
      .map((t) => t.categories?.join(",") ?? "");
    expect(sortedCategories).toEqual(expected);
  });

  it("sorts by status ascending, tentative first", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "status-asc");
    const tentative = mockTrips
      .filter((t) => !t.startDate)
      .map((t) => t.status ?? "");
    const nonTentative = mockTrips.filter((t) => t.startDate);
    const sortedNonTentative = [...nonTentative]
      .sort((a, b) => (a.status ?? "").localeCompare(b.status ?? ""))
      .map((t) => t.status ?? "");
    expect(sorted.map((t) => t.status ?? "")).toEqual([
      ...tentative,
      ...sortedNonTentative,
    ]);
  });

  it("sorts by status descending, tentative first", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "status-desc");
    const tentative = mockTrips
      .filter((t) => !t.startDate)
      .map((t) => t.status ?? "");
    const nonTentative = mockTrips.filter((t) => t.startDate);
    const sortedNonTentative = [...nonTentative]
      .sort((a, b) => (b.status ?? "").localeCompare(a.status ?? ""))
      .map((t) => t.status ?? "");
    expect(sorted.map((t) => t.status ?? "")).toEqual([
      ...tentative,
      ...sortedNonTentative,
    ]);
  });

  it("sorts by tags ascending", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "tags-asc");
    const sortedTags = sorted.map((t) => t.tags?.join(",") ?? "");
    const expected = [...mockTrips]
      .sort((a, b) =>
        (a.tags?.join(",") ?? "").localeCompare(b.tags?.join(",") ?? "")
      )
      .map((t) => t.tags?.join(",") ?? "");
    expect(sortedTags).toEqual(expected);
  });

  it("sorts by tags descending", () => {
    const sorted = sortTrips(mockTrips, mockCountries, "tags-desc");
    const sortedTags = sorted.map((t) => t.tags?.join(",") ?? "");
    const expected = [...mockTrips]
      .sort((a, b) =>
        (b.tags?.join(",") ?? "").localeCompare(a.tags?.join(",") ?? "")
      )
      .map((t) => t.tags?.join(",") ?? "");
    expect(sortedTags).toEqual(expected);
  });

  it("returns original array for unknown sort key, tentative first", () => {
    // @ts-expect-error purposely passing an invalid sortBy
    const sorted = sortTrips(mockTrips, mockCountries, "not-a-sort");
    const tentative = mockTrips.filter((t) => !t.startDate);
    const nonTentative = mockTrips.filter((t) => t.startDate);
    expect(sorted).toEqual([...tentative, ...nonTentative]);
  });

  it("sorts by startDate ascending, sorts correctly (mockTrips)", () => {
    // Only use non-tentative trips from mockTrips
    const trips = mockTrips.filter((t) => t.startDate);
    const sorted = sortTrips(trips, mockCountries, "startDate-asc");
    const expected = [...trips]
      .sort((a, b) => {
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return a.startDate.localeCompare(b.startDate);
      })
      .map((t) => t.id);
    expect(sorted.map((t) => t.id)).toEqual(expected);
    const sortedDesc = sortTrips(trips, mockCountries, "startDate-desc");
    const expectedDesc = [...trips]
      .sort((a, b) => {
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return b.startDate.localeCompare(a.startDate);
      })
      .map((t) => t.id);
    expect(sortedDesc.map((t) => t.id)).toEqual(expectedDesc);
  });

  it("sorts by endDate ascending, sorts correctly and handles missing endDate (mockTrips)", () => {
    // Only use non-tentative trips from mockTrips
    const trips = mockTrips.filter((t) => t.startDate);
    const sorted = sortTrips(trips, mockCountries, "endDate-asc");
    // Custom sort logic for endDate
    const expected = [...trips]
      .sort((a, b) => {
        if (a.endDate && b.endDate) {
          return a.endDate.localeCompare(b.endDate);
        }
        if (!a.endDate && b.endDate) return 1;
        if (a.endDate && !b.endDate) return -1;
        return 0;
      })
      .map((t) => t.id);
    expect(sorted.map((t) => t.id)).toEqual(expected);
    const sortedDesc = sortTrips(trips, mockCountries, "endDate-desc");
    const expectedDesc = [...trips]
      .sort((a, b) => {
        if (a.endDate && b.endDate) {
          return b.endDate.localeCompare(a.endDate);
        }
        if (!a.endDate && b.endDate) return 1;
        if (a.endDate && !b.endDate) return -1;
        return 0;
      })
      .map((t) => t.id);
    expect(sortedDesc.map((t) => t.id)).toEqual(expectedDesc);
  });

  it("returns non-tentative unsorted for unknown sort key (default case, mockTrips)", () => {
    // Should return [tentative, ...nonTentative in original order]
    // @ts-expect-error purposely passing an invalid sortBy
    const sorted = sortTrips(mockTrips, mockCountries, "not-a-sort");
    const tentative = mockTrips.filter((t) => !t.startDate);
    const nonTentative = mockTrips.filter((t) => t.startDate);
    expect(sorted).toEqual([...tentative, ...nonTentative]);
  });

  it.each([
    ["name-asc", { name: "" }, "name", "asc", ""],
    ["rating-asc", { rating: null }, "rating", "asc", 0],
    ["countries-asc", { countryCodes: [] }, "countries", "asc", ""],
    ["year-asc", { startDate: "" }, "year", "asc", 0],
    ["categories-asc", { categories: [] }, "categories", "asc", ""],
    ["status-asc", { status: undefined }, "status", "asc", ""],
    ["tags-asc", { tags: [] }, "tags", "asc", ""],
    ["fullDays-asc", { fullDays: 0 }, "fullDays", "asc", 0],
  ] as [TripSortBy, Partial<Trip>, TripSortByKey, "asc", string | number][])(
    "sorts by %s, covers missing property",
    (sortKey, mutation, key, direction, fallback) => {
      const trips: Trip[] = mockTrips.map((t, i) =>
        i === mockTrips.length - 1 ? { ...t, ...mutation } : t
      );
      const sorted = sortTrips(trips, mockCountries, sortKey as TripSortBy);
      const expected = getExpectedOrder(trips, key, direction, fallback);
      expect(sorted.map((t: Trip) => t.id)).toEqual(expected);
    }
  );
});
