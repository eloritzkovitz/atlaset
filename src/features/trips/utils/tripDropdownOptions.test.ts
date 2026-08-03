import { describe, it, expect } from "vitest";
import type { TFunction } from "i18next";
import {
  getCountryDropdownOptions,
  getYearDropdownOptions,
  getParticipantsDropdownOptions,
  getCategoryDropdownOptions,
  getStatusDropdownOptions,
  getTagDropdownOptions,
} from "./tripDropdownOptions";

const mockT = ((_key: string, defaultValue: string) =>
  defaultValue) as TFunction;

describe("Trip Filter Dropdown Utilities", () => {
  it("getCountryDropdownOptions filters and sorts matching countries", () => {
    const countries = [
      { isoCode: "US", name: "United States" },
      { isoCode: "CA", name: "Canada" },
      { isoCode: "MX", name: "Mexico" },
    ];
    const usedCodes = new Set(["MX", "CA"]);
    const result = getCountryDropdownOptions(countries as any, usedCodes);
    expect(result).toEqual([
      { value: "CA", label: "Canada" },
      { value: "MX", label: "Mexico" },
    ]);
  });

  it("getYearDropdownOptions converts numbers to string dropdown options", () => {
    const result = getYearDropdownOptions([2024, 2026]);
    expect(result).toEqual([
      { value: "2024", label: "2024" },
      { value: "2026", label: "2026" },
    ]);
  });

  it("getParticipantsDropdownOptions matches profiles and falls back safely to UID", () => {
    const uids = ["user-1", "user-2"];
    const profiles = [{ uid: "user-1", displayName: "Alice" }];
    const result = getParticipantsDropdownOptions(uids, profiles as any);
    expect(result).toEqual([
      { value: "user-1", label: "Alice" },
      { value: "user-2", label: "user-2" },
    ]);
  });

  it("getStatusDropdownOptions includes an empty default 'All' placeholder option", () => {
    const result = getStatusDropdownOptions(mockT);
    expect(result[0]).toEqual({ value: "", label: "All Statuses" });
    expect(result).toContainEqual({
      value: "in-progress",
      label: "In Progress",
    });
  });

  it("getTagDropdownOptions transforms tag strings with words capitalized", () => {
    const dummyTrips = [{ tags: ["national-park"] }] as any;
    const result = getTagDropdownOptions(dummyTrips, mockT);

    expect(result).toContainEqual({
      value: "national-park",
      label: "National Park",
    });
  });

  it("getCategoryDropdownOptions transforms raw strings cleanly with explicit translation function", () => {
    const dummyTrips = [{ categories: ["roadtrip"] }] as any;
    const result = getCategoryDropdownOptions(dummyTrips, mockT);

    expect(result).toContainEqual({ value: "roadtrip", label: "Roadtrip" });
  });
});
