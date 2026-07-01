import { describe, it, expect, vi } from "vitest";
import {
  filterByDifficulty,
  filterByProperty,
  getNextRandomCountry,
  getSessionProps,
  makeGetNext,
} from "./quizUtils";
import { mockCountries } from "@test-utils/mockCountries";

vi.mock("../constants/countryDifficulty.json", () => {
  return {
    default: {
      US: "easy",
      CA: "easy",
      FR: "easy",
      DE: "medium",
      JP: "easy",
      GP: "hard",
    },
  };
});

describe("Quiz Utilities", () => {
  describe("filterByDifficulty", () => {
    const testDifficulties = { FR: "easy", DE: "medium", GP: "hard" };

    it("should return all countries if difficulty or mapping is missing", () => {
      expect(filterByDifficulty(mockCountries)).toEqual(mockCountries);
    });

    it("should correctly filter countries by matching difficulty", () => {
      const result = filterByDifficulty(
        mockCountries,
        "easy",
        testDifficulties,
      );
      expect(result).toEqual([mockCountries[0]]);
    });
  });

  describe("filterByProperty", () => {
    it("should filter out items where string property is empty or undefined", () => {
      const result = filterByProperty(mockCountries, "capital");
      expect(result.map((c) => c.isoCode)).not.toContain("DE");
      expect(result.map((c) => c.isoCode)).toContain("FR");
    });

    it("should correctly handle numeric values", () => {
      const result = filterByProperty(mockCountries, "population");
      expect(result.length).toBe(mockCountries.length);
    });
  });

  describe("getNextRandomCountry", () => {
    it("should return null safely if array is empty", () => {
      const getNext = getNextRandomCountry([]);
      expect(getNext(null)).toBeNull();
    });

    it("should safely pick the only country available without looping infinitely", () => {
      const singleList = [{ isoCode: "FR" }];
      const getNext = getNextRandomCountry(singleList);
      expect(getNext(singleList[0])).toEqual(singleList[0]);
    });

    it("should not pick the previous country if alternatives exist", () => {
      const pairList = [{ isoCode: "US" }, { isoCode: "CA" }];
      const getNext = getNextRandomCountry(pairList);

      for (let i = 0; i < 10; i++) {
        const result = getNext(pairList[0]);
        expect(result?.isoCode).toBe("CA");
      }
    });
  });

  describe("makeGetNext", () => {
    it("should successfully wrap a getNextCountry execution flow", () => {
      const fakeGetNextCountry = (list: typeof mockCountries) => (_prev: any) =>
        list[0];

      const getNextFn = makeGetNext(fakeGetNextCountry, mockCountries);
      const result = getNextFn(null);

      expect(result).toEqual(mockCountries[0]);
    });

    it("should fall back to null if the underlying random function yields undefined", () => {
      const fakeGetNextCountry = () => () => undefined as any;

      const getNextFn = makeGetNext(fakeGetNextCountry, mockCountries);
      const result = getNextFn(null);

      expect(result).toBeNull();
    });
  });

  describe("getSessionProps", () => {
    it("should return configuration limits if game mode is 'timed'", () => {
      const result = getSessionProps("timed", 10, 120);
      expect(result).toEqual({ maxQuestions: 10, duration: 120 });
    });

    it("should fall back to default constraints for a timed mode if parameters are omitted", () => {
      const result = getSessionProps("timed");
      expect(result).toEqual({ maxQuestions: 25, duration: 300 });
    });

    it("should return an empty object if game mode is 'sandbox' or absent", () => {
      const sandboxResult = getSessionProps("sandbox");
      const emptyResult = getSessionProps();

      expect(sandboxResult).toEqual({});
      expect(emptyResult).toEqual({});
    });
  });
});
