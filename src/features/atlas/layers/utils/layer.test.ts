import { mockCountries } from "@test-utils/mockCountries";
import { mockLayers, mockTimelineLayer } from "@test-utils/mockLayers";
import {
  getDefaultLayerSelections,
  getLayerFilteredIsoCodes,
  isTimelineLayer,
  normalizeLayers,
} from "./layer";

describe("layer utils", () => {
  describe("isTimelineLayer", () => {
    it("isTimelineLayer returns true for TimelineLayer", () => {
      expect(isTimelineLayer(mockTimelineLayer)).toBe(true);
    });

    it("isTimelineLayer returns false for non-TimelineLayer", () => {
      expect(isTimelineLayer(mockLayers[0])).toBe(false);
    });
  });

  describe("normalizeLayers", () => {
    it("returns undefined for non-array input", () => {
      expect(normalizeLayers(undefined)).toBeUndefined();
      expect(normalizeLayers(null as unknown as any[])).toBeUndefined();
      expect(normalizeLayers(123 as unknown as any[])).toBeUndefined();
    });

    it("normalizes a basic array of partial layers", () => {
      const input = [
        { name: "Visited", countries: "US" },
        { id: "foo", name: "Layer 2", visible: false, countries: ["CA"] },
        { name: 123, color: 456, countries: undefined },
      ];
      const result = normalizeLayers(input);
      expect(result).toHaveLength(3);
      expect(result?.[0].id).toBeDefined();
      expect(result?.[0].name).toBe("Visited");
      expect(result?.[0].countries).toEqual(["US"]);
      expect(result?.[1].id).toBe("foo");
      expect(result?.[1].visible).toBe(false);
      expect(result?.[1].countries).toEqual(["CA"]);
      expect(result?.[2].name).toBe("");
      expect(result?.[2].color).toBe("");
      expect(result?.[2].countries).toEqual([]);
    });

    it("preserves id if present and generates a UUID if missing", () => {
      const input = [
        { id: "foo", name: "Layer 1" },
        { name: "Layer 2" },
        { id: "bar", name: "Layer 3" },
      ];
      const result = normalizeLayers(input);
      expect(result?.[0].id).toBe("foo");
      expect(typeof result?.[1].id).toBe("string");
      expect(result?.[1].id.length).toBeGreaterThan(0);
      expect(result?.[2].id).toBe("bar");
    });
  });

  describe("getDefaultLayerSelections", () => {
    it("returns an object mapping each layer id to 'all'", () => {
      const layers = [{ id: "a" }, { id: "b" }, { id: "c" }] as any[];
      const result = getDefaultLayerSelections(layers);
      expect(result).toEqual({ a: "all", b: "all", c: "all" });
    });

    it("returns an empty object for an empty layers array", () => {
      expect(getDefaultLayerSelections([])).toEqual({});
    });
  });

  describe("getLayerFilteredIsoCodes", () => {
    const layers = [
      { id: "o1", countries: ["FR", "DE"] },
      { id: "o2", countries: ["GP"] },
    ];

    const isoCodes = mockCountries.map((country) => country.isoCode);

    it("returns all iso codes if layers are 'all'", () => {
      expect(
        getLayerFilteredIsoCodes(isoCodes, layers as any, {
          o1: "all",
          o2: "all",
        }),
      ).toEqual(isoCodes);
    });

    it("filters to only layer countries if 'only'", () => {
      expect(
        getLayerFilteredIsoCodes(isoCodes, layers as any, {
          o1: "only",
        }),
      ).toEqual(["FR", "DE"]);
    });

    it("excludes layer countries if 'exclude'", () => {
      const expected = isoCodes.filter((code) => code !== "GP");

      expect(
        getLayerFilteredIsoCodes(isoCodes, layers as any, {
          o2: "exclude",
        }),
      ).toEqual(expected);
    });
  });
});
