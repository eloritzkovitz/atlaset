import { mockLayers, mockTimelineLayer } from "@test-utils/mockLayers";
import { getDefaultLayerSelections, isTimelineLayer } from "./layer";

describe("layer utils", () => {
  describe("isTimelineLayer", () => {
    it("isTimelineLayer returns true for TimelineLayer", () => {
      expect(isTimelineLayer(mockTimelineLayer)).toBe(true);
    });

    it("isTimelineLayer returns false for non-TimelineLayer", () => {
      expect(isTimelineLayer(mockLayers[0])).toBe(false);
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
});
