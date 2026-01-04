import {
  getLayerItems,
  groupLayerItemsByIsoCode,
  getBlendedLayerColor,
} from "./layerRender";
import { blendColors } from "@utils/color";
import { mockLayers } from "@test-utils/mockLayers";
import { VISITED_LAYER_ID } from "../constants/layers";

vi.mock("@utils/color", () => ({
  blendColors: vi.fn(() => "#abcdef"),
}));

describe("layerRender utils", () => {
  describe("getLayerItems", () => {
    it("returns layer items for each country", () => {
      const layer = mockLayers[0];
      const items = getLayerItems(layer);
      expect(items).toHaveLength(layer.countries.length);
      items.forEach((item, idx) => {
        expect(item.isoCode).toBe(layer.countries[idx]);
        expect(item.color).toBe(layer.color);
        expect(item.layerId).toBe(layer.id);
      });
    });
  });

  describe("groupLayerItemsByIsoCode", () => {
    it("groups layer items by isoCode (case-insensitive)", () => {
      const items = [
        { isoCode: "us", color: "#f00", layerId: "1" },
        { isoCode: "US", color: "#0f0", layerId: "2" },
        { isoCode: "ca", color: "#00f", layerId: "1" },
      ];
      const grouped = groupLayerItemsByIsoCode(items);
      expect(Object.keys(grouped)).toEqual(["US", "CA"]);
      expect(grouped.US).toHaveLength(2);
      expect(grouped.CA).toHaveLength(1);
    });

    it("skips items with empty isoCode", () => {
      const items = [
        { isoCode: "", color: "#f00", layerId: "1" },
        { isoCode: undefined, color: "#0f0", layerId: "2" },
      ] as any;
      const grouped = groupLayerItemsByIsoCode(items);
      expect(grouped).toEqual({});
    });

    it("returns empty object for empty input", () => {
      expect(groupLayerItemsByIsoCode([])).toEqual({});
      expect(groupLayerItemsByIsoCode()).toEqual({});
    });
  });

  describe("getBlendedLayerColor", () => {
    it("returns visited-countries color if present", () => {
      const layers = [
        {
          isoCode: "US",
          color: "#123",
          layerId: VISITED_LAYER_ID,
        },
        { isoCode: "US", color: "#456", layerId: "other" },
      ];
      expect(getBlendedLayerColor(layers, "#fff")).toBe("#123");
    });

    it("returns fallback color if layers is empty", () => {
      expect(getBlendedLayerColor([], "#fff")).toBe("#fff");
      expect(getBlendedLayerColor(undefined, "#abc")).toBe("#abc");
    });

    it("returns the only layer color if one present", () => {
      const layers = [{ isoCode: "US", color: "#789", layerId: "other" }];
      expect(getBlendedLayerColor(layers, "#fff")).toBe("#789");
    });

    it("blends colors if multiple layers (excluding visited-countries)", () => {
      const layers = [
        { isoCode: "US", color: "#111", layerId: "a" },
        { isoCode: "US", color: "#222", layerId: "b" },
      ];
      expect(getBlendedLayerColor(layers, "#fff")).toBe("#abcdef");
      expect(blendColors).toHaveBeenCalledWith(["#222", "#111"]);
    });

    it("ignores layers with missing/empty color", () => {
      const layers = [
        { isoCode: "US", color: "", layerId: "a" },
        { isoCode: "US", color: undefined, layerId: "b" },
      ] as any;
      expect(getBlendedLayerColor(layers, "#fff")).toBe("#fff");
    });
  });
});
