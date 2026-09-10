import { mockTrips } from "@test-utils/mockTrips";
import { getUsedCountryCodes, getUsedYears } from "./tripData";

describe("tripData utils", () => {
  describe("getUsedCountryCodes", () => {
    it("returns a set of all used country codes", () => {
      const codes = getUsedCountryCodes(mockTrips);
      expect(codes).toBeInstanceOf(Set);
      expect(Array.from(codes)).toEqual(
        expect.arrayContaining(["US", "CA", "FR", "DE", "JP"])
      );
    });

    it("returns empty set for empty trips", () => {
      expect(getUsedCountryCodes([])).toEqual(new Set());
    });
  });

  describe("getUsedYears", () => {
    it("returns all years with trips, sorted descending", () => {
      const years = getUsedYears(mockTrips);
      expect(years).toEqual([...years].sort((a, b) => b - a));
      // Should include 2022, 2023, 2099 from mockTrips
      expect(years).toEqual(expect.arrayContaining([2022, 2023, 2099]));
    });

    it("returns empty array for empty trips", () => {
      expect(getUsedYears([])).toEqual([]);
    });
  });
});
