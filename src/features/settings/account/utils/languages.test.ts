import { describe, it, expect, vi } from "vitest";

vi.mock("@constants/languages", () => ({
  LANGUAGES: [
    { code: "en", nativeName: "English", priority: 2 },
    { code: "he", nativeName: "עברית", priority: 1 },
    { code: "es", nativeName: "Español" },
  ],
}));

import { mapLanguages, languageOptions } from "./languages";

describe("Language mapping utilities", () => {
  const mockT = (key: string) => {
    if (key === "languages:en") return "English Localized";
    if (key === "languages:he") return "Hebrew Localized";
    return undefined;
  };
  
  describe("mapLanguages", () => {
    it("maps, sorts by priority, and appends translated names accurately", () => {
      const result = mapLanguages(mockT);

      expect(result).toEqual([
        { code: "he", native: "עברית", localized: "Hebrew Localized" },
        { code: "en", native: "English", localized: "English Localized" },
        { code: "es", native: "Español", localized: "" },
      ]);
    });
  });

  describe("languageOptions", () => {
    it("builds select-ready dropdown objects correctly", () => {
      const options = languageOptions(mockT);

      expect(options).toEqual([
        { value: "he", label: "עברית (Hebrew Localized)" },
        { value: "en", label: "English (English Localized)" },
        { value: "es", label: "Español" },
      ]);
    });
  });
});
