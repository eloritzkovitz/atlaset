import { getCountriesWithOwnFlag, resolveFlagIsoCode } from "./flags";
import type { Country, Flag } from "../../types";

describe("flag utils", () => {
  describe("getCountriesWithOwnFlag", () => {
    it("getCountriesWithOwnFlag returns array unchanged when overrides not matched", () => {
      const testCountries = [{ isoCode: "US" }, { isoCode: "FR" }];
      expect(getCountriesWithOwnFlag(testCountries as Country[])).toEqual(
        testCountries,
      );
    });
  });

  describe("resolveFlagIsoCode", () => {
    it("returns the original ISO code when no special cases or overrides apply", () => {
      const flag = { isoCode: "US" } as Flag;

      expect(resolveFlagIsoCode(flag)).toBe("US");
    });

    it("returns the special flag ISO code when one is defined", () => {
      const flag = { isoCode: "GB-ENG" } as Flag;

      expect(resolveFlagIsoCode(flag)).toBe("GBENG");
    });

    it("returns the special sovereign ISO code when no flag is defined", () => {
      const flag = { isoCode: "UM-71" } as Flag;

      expect(resolveFlagIsoCode(flag)).toBe("UM");
    });

    it("returns the sovereign state ISO code when an override applies", () => {
      const flag = {
        isoCode: "BQ",
        sovereignState: "NL",
      } as Flag;

      expect(resolveFlagIsoCode(flag)).toBe("NL");
    });

    it("falls back to the original ISO code when an override has no sovereign state", () => {
      const flag = { isoCode: "BQ" } as Flag;

      expect(resolveFlagIsoCode(flag)).toBe("BQ");
    });
  });
});
