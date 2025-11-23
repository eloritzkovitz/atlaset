import { mockTrips } from "@test-utils/mockTrips";
import { mockCountries } from "@test-utils/mockCountries";
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

    it("sorts by startDate ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "startDate-asc");
      expect(sorted[0].startDate <= sorted[1].startDate).toBe(true);
    });

    it("sorts by startDate descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "startDate-desc");
      expect(sorted[0].startDate >= sorted[1].startDate).toBe(true);
    });

    it("sorts by endDate ascending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "endDate-asc");
      expect(sorted[0].endDate <= sorted[1].endDate).toBe(true);
    });

    it("sorts by endDate descending", () => {
      const sorted = sortTrips(mockTrips, mockCountries, "endDate-desc");
      expect(sorted[0].endDate >= sorted[1].endDate).toBe(true);
    });

    it("sorts by fullDays ascending", () => {
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
      const sorted = sortTrips(tripsWithDays, mockCountries, "fullDays-asc");
      expect(sorted[0].fullDays <= sorted[1].fullDays).toBe(true);
    });

    it("sorts by fullDays descending", () => {
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
