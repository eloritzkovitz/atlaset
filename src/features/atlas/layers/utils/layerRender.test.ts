import { mockLayers } from "@test-utils/mockLayers";
import {
  getLayerItems,
  groupLayerItemsByIsoCode,
  getTopmostLayerColor,
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

  describe("getTopmostLayerColor", () => {
    it("returns fallback color if layers is empty", () => {
      expect(getTopmostLayerColor([], "#fff")).toBe("#fff");
      expect(getTopmostLayerColor(undefined, "#abc")).toBe("#abc");
    });

    it("returns the only layer color if one is present", () => {
      const layers = [{ isoCode: "US", color: "#789", layerId: "other" }];
      expect(getTopmostLayerColor(layers, "#fff")).toBe("#789");
    });

    it("returns the topmost (last) layer color when multiple layers exist", () => {
      const layers = [
        { isoCode: "US", color: "#ff0000", layerId: "a" },
        { isoCode: "US", color: "#0000ff", layerId: "b" },
      ];
      expect(getTopmostLayerColor(layers)).toBe("#0000ff");
    });

    it("ignores layers with missing or empty color", () => {
      const layers = [
        { isoCode: "US", color: "", layerId: "a" },
        { isoCode: "US", color: undefined, layerId: "b" },
      ] as any;
      expect(getTopmostLayerColor(layers, "#fff")).toBe("#fff");
    });
  });
});
