import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  clearYearOffsetsCache,
  getCurrentTimeFromOffset,
  getYearOffsets,
  normalizeTzCode,
  timezoneOffsets,
  timezoneRangeForZones,
  timezoneRangeLines,
} from "./timezone";

describe("timezone utils", () => {
  describe("getYearOffsets", () => {
    it("computes jan/jul string offsets and numerical minute equivalents", () => {
      expect(getYearOffsets("Europe/Paris")).toEqual({
        offJan: "+01:00",
        offJul: "+02:00",
        janMin: 60,
        julMin: 120,
      });
    });

    it("falls back to UTC offset (+00:00) when given an invalid or throwing timezone", () => {
      const res = getYearOffsets("Invalid/Timezone_Name");
      expect(res).toEqual({
        offJan: "+00:00",
        offJul: "+00:00",
        janMin: 0,
        julMin: 0,
      });
    });

    it("uses in-memory cache on subsequent calls for the same timezone", () => {
      const firstCall = getYearOffsets("Europe/Berlin");
      const secondCall = getYearOffsets("Europe/Berlin");
      expect(secondCall).toBe(firstCall);
    });

    it("clears the cache when clearYearOffsetsCache is called", () => {
      const initial = getYearOffsets("Europe/Madrid");
      clearYearOffsetsCache();
      const recomputed = getYearOffsets("Europe/Madrid");
      expect(recomputed).toEqual(initial);
      expect(recomputed).not.toBe(initial);
    });
  });

  describe("getCurrentTimeFromOffset", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(Date.UTC(2026, 0, 1, 12, 0, 0)));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([
      [0, "12:00:00"],
      [120, "14:00:00"],
      [-300, "07:00:00"],
      [330, "17:30:00"],
      [-210, "08:30:00"],
      [840, "02:00:00"],
    ])(
      "calculates local time for offset %i minutes -> %s",
      (offset, expected) => {
        expect(getCurrentTimeFromOffset(offset)).toBe(expected);
      },
    );

    it("updates output as time progresses", () => {
      expect(getCurrentTimeFromOffset(120)).toBe("14:00:00");
      vi.advanceTimersByTime(45_000);
      expect(getCurrentTimeFromOffset(120)).toBe("14:00:45");
    });
  });

  describe("timezoneOffsets", () => {
    it.each([
      ["Asia/Tokyo", ["UTC+09:00"]],
      ["Europe/Paris", ["UTC+01:00", "UTC+02:00 (summer)"]],
      ["UTC", ["UTC+00:00"]],
      ["America/New_York", ["UTC-05:00", "UTC-04:00 (summer)"]],
      ["Australia/Sydney", ["UTC+10:00", "UTC+11:00 (summer)"]],
      ["Asia/Kolkata", ["UTC+05:30"]],
    ])("calculates offsets for %s -> %p", (tz, expected) => {
      expect(timezoneOffsets(tz)).toEqual(expected);
    });
  });

  describe("timezoneRangeForZones", () => {
    it.each([
      [["Asia/Tokyo", "UTC"], "UTC+00:00 to UTC+09:00"],
      [[], "—"],
      [["Asia/Tokyo"], "UTC+09:00"],
      [["Europe/Paris", "Europe/Helsinki"], "UTC+01:00 to UTC+03:00"],
    ])(
      "determines flat string layout range for %p -> %s",
      (tzList, expected) => {
        expect(timezoneRangeForZones(tzList)).toBe(expected);
      },
    );
  });

  describe("timezoneRangeLines", () => {
    it.each([
      [[], ["—"]],
      [["Asia/Tokyo", "UTC"], ["UTC+00:00 to UTC+09:00"]],
      [
        ["Europe/Paris", "Europe/Helsinki"],
        ["UTC+01:00 to UTC+02:00", "UTC+02:00 to UTC+03:00 (summer)"],
      ],
      [["Europe/Paris"], ["UTC+01:00", "UTC+02:00 (summer)"]],
      [
        ["Europe/Paris", "Europe/Berlin"],
        ["UTC+01:00", "UTC+02:00 (summer)"],
      ],
      [["Australia/Sydney"], ["UTC+10:00", "UTC+11:00 (summer)"]],
    ])("splits structural line data for %p -> %p", (tzList, expected) => {
      expect(timezoneRangeLines(tzList)).toEqual(expected);
    });
  });

  describe("normalizeTzCode", () => {
    describe("Standard UTC offset patterns", () => {
      it.each([
        ["UTC+02:00", "UTC+02:00"],
        ["UTC-05:00", "UTC-05:00"],
        ["UTC+00:00", "UTC+00:00"],
        ["UTC-00:00", "UTC-00:00"],
        ["UTC+05:30", "UTC+05:30"],
        ["UTC+12:45", "UTC+12:45"],
      ])("returns intact standard offset for %s -> %s", (input, expected) => {
        expect(normalizeTzCode(input)).toBe(expected);
      });
    });

    describe("Stripping suffixes (e.g., summer/DST tags)", () => {
      it.each([
        ["UTC+02:00 (summer)", "UTC+02:00"],
        ["UTC-05:00 (summer)", "UTC-05:00"],
        ["UTC+00:00 (summer)", "UTC+00:00"],
        ["UTC+03:00 (DST)", "UTC+03:00"],
        ["UTC+01:00 Daylight Saving Time", "UTC+01:00"],
      ])("strips suffix from %s -> %s", (input, expected) => {
        expect(normalizeTzCode(input)).toBe(expected);
      });
    });

    describe("Formating non-padded numbers & loose spacing", () => {
      it.each([
        ["UTC+2", "UTC+02:00"],
        ["UTC-5", "UTC-05:00"],
        ["+2", "UTC+02:00"],
        ["-5:00", "UTC-05:00"],
        ["utc+02:00", "UTC+02:00"],
        ["  UTC+02:00  ", "UTC+02:00"],
        ["UTC + 2:00", "UTC+02:00"],
      ])("formats loosely formatted inputs %s -> %s", (input, expected) => {
        expect(normalizeTzCode(input)).toBe(expected);
      });
    });

    describe("Zulu time handling", () => {
      it.each([
        ["Z", "UTC+00:00"],
        ["z", "UTC+00:00"],
        ["  Z  ", "UTC+00:00"],
      ])("normalizes Zulu time %s -> %s", (input, expected) => {
        expect(normalizeTzCode(input)).toBe(expected);
      });
    });

    describe("Edge cases & invalid inputs", () => {
      it.each([
        ["", ""],
        ["   ", ""],
        ["EST", "EST"],
        ["InvalidTimezone", "InvalidTimezone"],
      ])("handles missing or non-matching string '%s'", (input, expected) => {
        expect(normalizeTzCode(input)).toBe(expected);
      });

      it("handles null and undefined safely", () => {
        expect(normalizeTzCode(null)).toBe("");
        expect(normalizeTzCode(undefined)).toBe("");
      });

      describe("Regex fallback branches (missing sign and missing hours)", () => {
        it("defaults sign to '+' when omitted in loose offset format", () => {
          expect(normalizeTzCode("2:00")).toBe("UTC+02:00");
        });

        it("defaults hours to '00' when hour digits are omitted", () => {
          expect(normalizeTzCode("+:30")).toBe("UTC+00:30");
        });

        it("defaults sign to '+' and pads single digit hour", () => {
          expect(normalizeTzCode("5")).toBe("UTC+05:00");
        });
      });
    });
  });
});
