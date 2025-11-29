import { mockOverlays, mockTimelineOverlay } from "@test-utils/mockOverlays";
import { getDefaultOverlaySelections, isTimelineOverlay } from "./overlay";

describe("overlay utils", () => {
  describe("isTimelineOverlay", () => {
    it("isTimelineOverlay returns true for TimelineOverlay", () => {
      expect(isTimelineOverlay(mockTimelineOverlay)).toBe(true);
    });

    it("isTimelineOverlay returns false for non-TimelineOverlay", () => {
      expect(isTimelineOverlay(mockOverlays[0])).toBe(false);
    });
  });

  describe("getDefaultOverlaySelections", () => {
    it("returns an object mapping each overlay id to 'all'", () => {
      const overlays = [{ id: "a" }, { id: "b" }, { id: "c" }] as any[];
      const result = getDefaultOverlaySelections(overlays);
      expect(result).toEqual({ a: "all", b: "all", c: "all" });
    });

    it("returns an empty object for an empty overlays array", () => {
      expect(getDefaultOverlaySelections([])).toEqual({});
    });
  });
});
