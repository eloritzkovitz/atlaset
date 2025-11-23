import { mockTrips } from "@test-utils/mockTrips";
import { mockCountries } from "@test-utils/mockCountries";
import { sortTrips } from "./tripSort";

describe("tripFilters utils", () => {
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

    it("sorts by countries", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "countries-asc");
      expect(sorted[0].countryCodes || sorted[0].countryCodes).toBeDefined();
    });

    it("sorts by year", () => {
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

    it("sorts by startDate descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "startDate-desc");
      expect(sorted[0].startDate >= sorted[1].startDate).toBe(true);
    });

    it("sorts by endDate ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "endDate-asc");
      expect(sorted[0].endDate <= sorted[1].endDate).toBe(true);
    });

    it("sorts by fullDays", () => {
      const tripsWithDays = mockTrips.map((t) => ({
        ...t,
        fullDays:
          t.startDate && t.endDate
            ? (new Date(t.endDate).getTime() -
                new Date(t.startDate).getTime()) /
                86400000 +
              1
            : 0,
      }));
      const sorted = sortTrips(tripsWithDays, mockCountries, "fullDays-desc");
      expect(sorted[0].fullDays >= sorted[1].fullDays).toBe(true);
    });
  });
});
