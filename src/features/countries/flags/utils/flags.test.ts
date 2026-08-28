import { getCountriesWithOwnFlag } from "./flags";
import type { Country } from "../../types";

describe("flag utils", () => {
  it("getCountriesWithOwnFlag returns array unchanged when overrides not matched", () => {
    const testCountries = [{ isoCode: "US" }, { isoCode: "FR" }];
    expect(getCountriesWithOwnFlag(testCountries as Country[])).toEqual(
      testCountries,
    );
  });
});
