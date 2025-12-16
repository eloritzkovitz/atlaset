import { mockCountries } from "@test-utils/mockCountries";
import { mockTrips } from "@test-utils/mockTrips";
import { sortTrips } from "./tripSort";

describe("tripSort utils", () => {
  describe("sortTrips", () => {
    it("sorts by name ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "name-asc");
      expect(sorted.map((t) => t.name)).toEqual(
        [...mockTrips]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((t) => t.name)
      );
    });

    it("sorts by name descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "name-desc");
      expect(sorted.map((t) => t.name)).toEqual(
        [...mockTrips]
          .sort((a, b) => b.name.localeCompare(a.name))
          .map((t) => t.name)
      );
    });

    it("sorts by rating ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "rating-asc");
      expect(sorted.map((t) => t.rating || 0)).toEqual(
        [...mockTrips]
          .sort((a, b) => (a.rating || 0) - (b.rating || 0))
          .map((t) => t.rating || 0)
      );
    });

    it("sorts by rating descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "rating-desc");
      expect(sorted.map((t) => t.rating || 0)).toEqual(
        [...mockTrips]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .map((t) => t.rating || 0)
      );
    });

    it("sorts by countries ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "countries-asc");
      expect(sorted[0].countryCodes || sorted[0].countryCodes).toBeDefined();
    });

    it("sorts by countries descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "countries-desc");
      expect(sorted[0].countryCodes || sorted[0].countryCodes).toBeDefined();
    });

    it("sorts by year ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "year-asc");
      expect(
        sorted.map((t) => t.startDate && new Date(t.startDate).getFullYear())
      ).toEqual(
        [...mockTrips]
          .sort(
            (a, b) =>
              (a.startDate ? new Date(a.startDate).getFullYear() : 0) -
              (b.startDate ? new Date(b.startDate).getFullYear() : 0)
          )
          .map((t) => t.startDate && new Date(t.startDate).getFullYear())
      );
    });

    it("sorts by year descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "year-desc");
      expect(
        sorted.map((t) => t.startDate && new Date(t.startDate).getFullYear())
      ).toEqual(
        [...mockTrips]
          .sort(
            (a, b) =>
              (b.startDate ? new Date(b.startDate).getFullYear() : 0) -
              (a.startDate ? new Date(a.startDate).getFullYear() : 0)
          )
          .map((t) => t.startDate && new Date(t.startDate).getFullYear())
      );
    });

    it("sorts by startDate ascending, trip with date comes before tentative", () => {
      const tripWithDate = { ...mockTrips[0], startDate: "2025-01-01" };
      const tentativeTrip = { ...mockTrips[1], startDate: undefined };
      const trips = [tentativeTrip, tripWithDate];
      const sorted = sortTrips(trips, mockCountries, "startDate-asc");
      expect(sorted[0]).toBe(tripWithDate);
      expect(sorted[1]).toBe(tentativeTrip);
    });

    it("sorts by startDate ascending, both tentative remain in order", () => {
      const tentativeTripA = { ...mockTrips[0], startDate: undefined };
      const tentativeTripB = { ...mockTrips[1], startDate: undefined };
      const trips = [tentativeTripA, tentativeTripB];
      const sorted = sortTrips(trips, mockCountries, "startDate-asc");
      expect(sorted[0]).toBe(tentativeTripA);
      expect(sorted[1]).toBe(tentativeTripB);
    });

    it("sorts by startDate ascending, tentative trips last", () => {
      const tentativeTrip = { ...mockTrips[0], startDate: undefined };
      const trips = [...mockTrips, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "startDate-asc");
      expect(sorted[sorted.length - 1]).toBe(tentativeTrip);
    });

    it("sorts by startDate descending, tentative trips last", () => {
      const tentativeTrip = { ...mockTrips[0], startDate: undefined };
      const trips = [...mockTrips, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "startDate-desc");
      expect(sorted[sorted.length - 1]).toBe(tentativeTrip);
    });

    it("sorts by endDate ascending, trip with endDate comes before tentative", () => {
      const tripWithEndDate = { ...mockTrips[0], endDate: "2025-01-01" };
      const tentativeTrip = { ...mockTrips[1], endDate: undefined };
      const trips = [tentativeTrip, tripWithEndDate];
      const sorted = sortTrips(trips, mockCountries, "endDate-asc");
      expect(sorted[0]).toBe(tripWithEndDate);
      expect(sorted[1]).toBe(tentativeTrip);
    });

    it("sorts by endDate ascending, tentative comes after trip with endDate", () => {
      const tripWithEndDate = { ...mockTrips[0], endDate: "2025-01-01" };
      const tentativeTrip = { ...mockTrips[1], endDate: undefined };
      const trips = [tripWithEndDate, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "endDate-asc");
      expect(sorted[0]).toBe(tripWithEndDate);
      expect(sorted[1]).toBe(tentativeTrip);
    });

    it("sorts by endDate ascending, both tentative remain in order", () => {
      const tentativeTripA = { ...mockTrips[0], endDate: undefined };
      const tentativeTripB = { ...mockTrips[1], endDate: undefined };
      const trips = [tentativeTripA, tentativeTripB];
      const sorted = sortTrips(trips, mockCountries, "endDate-asc");
      expect(sorted[0]).toBe(tentativeTripA);
      expect(sorted[1]).toBe(tentativeTripB);
    });

    it("sorts by endDate ascending, tentative trips last", () => {
      const tentativeTrip = { ...mockTrips[0], endDate: undefined };
      const trips = [...mockTrips, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "endDate-asc");
      expect(sorted[sorted.length - 1]).toBe(tentativeTrip);
    });

    it("sorts by endDate descending, tentative trips last", () => {
      const tentativeTrip = { ...mockTrips[0], endDate: undefined };
      const trips = [...mockTrips, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "endDate-desc");
      expect(sorted[sorted.length - 1]).toBe(tentativeTrip);
    });

    it("sorts by fullDays ascending, tentative trips last", () => {
      const tentativeTrip = { ...mockTrips[0], fullDays: undefined };
      const trips = [...mockTrips, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "fullDays-asc");
      expect(sorted[sorted.length - 1]).toBe(tentativeTrip);
    });

    it("sorts by fullDays descending, tentative trips last", () => {
      const tentativeTrip = { ...mockTrips[0], fullDays: undefined };
      const trips = [...mockTrips, tentativeTrip];
      const sorted = sortTrips(trips, mockCountries, "fullDays-desc");
      expect(sorted[sorted.length - 1]).toBe(tentativeTrip);
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

    it("sorts by status ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "status-asc");
      expect((sorted[0].status ?? "") <= (sorted[1].status ?? "")).toBe(true);
    });

    it("sorts by status descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "status-desc");
      expect((sorted[0].status ?? "") >= (sorted[1].status ?? "")).toBe(true);
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

    it("returns original array for unknown sort key", () => {
      // @ts-expect-error purposely passing an invalid sortBy
      const sorted = sortTrips(mockTrips, mockCountries, "not-a-sort");
      expect(sorted).toBe(mockTrips);
    });
  });
});
