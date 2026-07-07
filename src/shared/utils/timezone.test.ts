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
  timezoneOffsets,
  timezoneRangeForZones,
  timezoneRangeLines,
} from "./timezone";

describe("timezone utils", () => {
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
});
