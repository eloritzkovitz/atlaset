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
      GMTZ: { jan: "Z", jul: "Z" },
      West: { jan: "-05:00", jul: "-04:00" },
      Default: { jan: "+00:00", jul: "+00:00" },
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
  it("returns single offset for zones without DST", () => {
    const offs = timezoneOffsets("NoDst");
    expect(offs).toEqual(["UTC+09:00"]);
  });

  it("returns winter and summer offsets for DST zones", () => {
    const offs = timezoneOffsets("Europe/Paris");
    expect(offs).toEqual(["UTC+01:00", "UTC+02:00 (summer)"]);
  });

  it("normalizes Z to +00:00 and returns UTC+00:00", () => {
    const offs = timezoneOffsets("GMTZ");
    expect(offs).toEqual(["UTC+00:00"]);
  });

  it("computes a single-line range when all mins equal", () => {
    const r = timezoneRangeForZones(["NoDst", "Default"]);
    expect(r).toBe("UTC+00:00 to UTC+09:00");
  });

  it("returns dash for empty zone list", () => {
    const r = timezoneRangeForZones([]);
    expect(r).toBe("—");
  });

  it("returns single offset for a single-zone range", () => {
    const r = timezoneRangeForZones(["NoDst"]);
    expect(r).toBe("UTC+09:00");
  });

  it("handles negative offsets and DST correctly", () => {
    const offs = timezoneOffsets("West");
    expect(offs).toEqual(["UTC-05:00", "UTC-04:00 (summer)"]);
  });

  it("computes min-to-max range across zones", () => {
    const r = timezoneRangeForZones(["Europe/Paris", "Europe/Helsinki"]);
    expect(r).toBe("UTC+01:00 to UTC+03:00");
  });

  it("returns single-line when winter and summer ranges are identical", () => {
    const lines = timezoneRangeLines(["NoDst", "Default"]);
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBe(1);
  });

  it("returns two lines when winter and summer differ", () => {
    const lines = timezoneRangeLines(["Europe/Paris", "Europe/Helsinki"]);
    expect(lines.length).toBe(2);
    expect(lines[0]).toBe("UTC+01:00 to UTC+02:00");
    expect(lines[1]).toBe("UTC+02:00 to UTC+03:00 (summer)");
  });
});
