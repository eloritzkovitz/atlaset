import { describe, expect, it, vi } from "vitest";
import { buildTimezonesFromCountries } from "./timezoneData";
import type { Country } from "../../types";

vi.mock("@utils", () => ({
  timezoneOffsets: vi.fn((tz, label) =>
    tz === "Europe/Berlin" ? ["UTC+01:00", `UTC+02:00${label}`] : ["UTC+00:00"],
  ),
  timezoneRangeLines: vi.fn((tzs) =>
    tzs.length > 2 ? ["UTC-05:00", "UTC+01:00"] : ["UTC+00:00 to UTC+02:00"],
  ),
  getYearOffsets: vi.fn((tz: string) => {
    if (tz === "Invalid/Tz") throw new Error("Invalid IANA ID");

    if (tz === "UTC") {
      return { offJan: "+00:00", janMin: 0, offJul: "+00:00", julMin: 0 };
    }

    if (tz === "Southern/DST") {
      return { offJan: "+11:00", janMin: 660, offJul: "+10:00", julMin: 600 };
    }

    return { offJan: "+01:00", janMin: 60, offJul: "+02:00", julMin: 120 };
  }),
}));

describe("buildTimezonesFromCountries", () => {
  const mockCountryA: Country = {
    isoCode: "DE",
    name: "Germany",
    timezones: ["Europe/Berlin"],
  } as Country;

  const mockCountryB: Country = {
    isoCode: "AU",
    name: "Australia",
    timezones: ["Southern/DST"],
  } as Country;

  const mockCountryC: Country = {
    isoCode: "IS",
    name: "Iceland",
    timezones: ["UTC"],
  } as Country;

  it("skips non-array or invalid timezones gracefully", () => {
    const countries = [
      { isoCode: "XX", name: "No TZ" } as Country,
      { isoCode: "YY", name: "Bad TZ", timezones: ["Invalid/Tz"] } as Country,
    ];
    expect(buildTimezonesFromCountries(countries)).toEqual([]);
  });

  it("aggregates, sorts by offset minutes, and handles non-DST and DST entries", () => {
    const countries = [mockCountryA, mockCountryB, mockCountryC, mockCountryA];
    const result = buildTimezonesFromCountries(countries);
    expect(result).toHaveLength(5);
    expect(result[0].code).toBe("UTC+00:00");
    expect(result[0].countries).toEqual([
      { isoCode: "IS", countryName: "Iceland", isDst: false },
    ]);
    expect(result[1].code).toBe("UTC+01:00");
    expect(result[1].countries[0].isDst).toBe(false);
    expect(result[2].code).toBe("UTC+02:00");
    expect(result[2].countries[0].isDst).toBe(true);
    expect(result[3].code).toBe("UTC+10:00");
    expect(result[4].code).toBe("UTC+11:00");
  });
});
