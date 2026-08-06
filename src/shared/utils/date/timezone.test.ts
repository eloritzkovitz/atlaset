import { describe, it, expect, vi } from "vitest";

vi.mock("date-fns-tz", () => ({
  format: (date: Date, _fmt: string, opts: { timeZone: string }) => {
    const tz = opts.timeZone;
    const month = date.getUTCMonth();
    const map: Record<string, { jan: string; jul: string }> = {
      NoDst: { jan: "+09:00", jul: "+09:00" },
      "Europe/Paris": { jan: "+01:00", jul: "+02:00" },
      "Europe/Berlin": { jan: "+01:00", jul: "+02:00" },
      "Europe/Helsinki": { jan: "+02:00", jul: "+03:00" },
      South: { jan: "+11:00", jul: "+10:00" },
      HalfHour: { jan: "+05:30", jul: "+05:30" },
      SmallMin: { jan: "+05:03", jul: "+05:03" },
      NegMin: { jan: "-00:05", jul: "-00:05" },
      GMTZ: { jan: "Z", jul: "Z" },
      West: { jan: "-05:00", jul: "-04:00" },
      Default: { jan: "+00:00", jul: "+00:00" },
      MissingHr: { jan: "+", jul: "+" },
      MissingMin: { jan: "+12", jul: "+12" },
    };
    const entry = map[tz] ?? map["Default"];
    return month === 0 ? entry.jan : entry.jul;
  },
}));

import {
  getCurrentTimeFromOffset,
  normalizeTzCode,
  timezoneOffsets,
  timezoneRangeForZones,
  timezoneRangeLines,
} from "./timezone";

describe("timezone utils", () => {
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
      vi.advanceTimersByTime(45000);
      expect(getCurrentTimeFromOffset(120)).toBe("14:00:45");
    });
  });

  describe("timezoneOffsets", () => {
    it.each([
      ["NoDst", ["UTC+09:00"]],
      ["Europe/Paris", ["UTC+01:00", "UTC+02:00 (summer)"]],
      ["GMTZ", ["UTC+00:00"]],
      ["West", ["UTC-05:00", "UTC-04:00 (summer)"]],
      ["South", ["UTC+10:00", "UTC+11:00 (summer)"]],
      ["HalfHour", ["UTC+05:30"]],
    ])("calculates offsets for %s -> %p", (tz, expected) => {
      expect(timezoneOffsets(tz)).toEqual(expected);
    });
  });

  describe("timezoneRangeForZones", () => {
    it.each([
      [["NoDst", "Default"], "UTC+00:00 to UTC+09:00"],
      [[], "—"],
      [["NoDst"], "UTC+09:00"],
      [["Europe/Paris", "Europe/Helsinki"], "UTC+01:00 to UTC+03:00"],
      [["SmallMin"], "UTC+05:03"],
      [["NegMin"], "UTC-00:05"],
      [["MissingHr"], "UTC+00:00"],
      [["MissingMin"], "UTC+12:00"],
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
      [["NoDst", "Default"], ["UTC+00:00 to UTC+09:00"]],
      [
        ["Europe/Paris", "Europe/Helsinki"],
        ["UTC+01:00 to UTC+02:00", "UTC+02:00 to UTC+03:00 (summer)"],
      ],
      [["Europe/Paris"], ["UTC+01:00", "UTC+02:00 (summer)"]],
      [
        ["Europe/Paris", "Europe/Berlin"],
        ["UTC+01:00", "UTC+02:00 (summer)"],
      ],
      [["South"], ["UTC+10:00", "UTC+11:00 (summer)"]],
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
    });
  });
});
