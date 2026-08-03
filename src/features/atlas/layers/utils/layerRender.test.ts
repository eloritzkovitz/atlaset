import { mockLayers } from "@test-utils/mockLayers";
import {
  getLayerItems,
  groupLayerItemsByIsoCode,
  getBlendedLayerColor,
} from "./layerRender";

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
    it("returns fallback color if layers is empty", () => {
      expect(getBlendedLayerColor([], "#fff")).toBe("#fff");
      expect(getBlendedLayerColor(undefined, "#abc")).toBe("#abc");
    });

    it("returns the only layer color if one present", () => {
      const layers = [{ isoCode: "US", color: "#789", layerId: "other" }];
      expect(getBlendedLayerColor(layers, "#fff")).toBe("#789");
    });

    it("blends colors if multiple layers", () => {
      const layers = [
        { isoCode: "US", color: "#ff0000", layerId: "a" },
        { isoCode: "US", color: "#0000ff", layerId: "b" },
      ];
      const blended = getBlendedLayerColor(layers);
      expect(typeof blended).toBe("string");
      expect(blended).toBeDefined();
      expect(blended).not.toBe("#ff0000");
      expect(blended).not.toBe("#0000ff");
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
