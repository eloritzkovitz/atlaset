import { describe, it, expect } from "vitest";
import { computeSuffix, formatCommittedValue } from "@utils/search";

describe("search utils", () => {
  it("computeSuffix returns null when topSuggestion missing", () => {
    expect(computeSuffix(undefined, "iso")).toBeNull();
  });

  it("computeSuffix returns null when propCandidate missing", () => {
    expect(computeSuffix("isocode", "")).toBeNull();
  });

  it("computeSuffix returns null when no remainder", () => {
    expect(computeSuffix("iso", "iso")).toBeNull();
  });

  it("computeSuffix returns remainder with colon when present", () => {
    expect(computeSuffix("isocode", "iso")).toBe("code:");
    expect(computeSuffix("country_code", "country_")).toBe("code:");
  });

  it("formatCommittedValue recombines prefix and after", () => {
    expect(formatCommittedValue("iso", "es")).toBe("iso:es");
    expect(formatCommittedValue("code", "  123")).toBe("code:  123");
  });
});
