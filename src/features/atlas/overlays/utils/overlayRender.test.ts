import {
  getOverlayItems,
  groupOverlayItemsByIsoCode,
  getBlendedOverlayColor,
} from "./overlayRender";
import { VISITED_OVERLAY_ID } from "@constants/overlays";
import { blendColors } from "@utils/color";
import { mockOverlays } from "@test-utils/mockOverlays";

vi.mock("@utils/color", () => ({
  blendColors: vi.fn(() => "#abcdef"),
}));

describe("overlayRender utils", () => {
  describe("getOverlayItems", () => {
    it("returns overlay items for each country", () => {
      const overlay = mockOverlays[0];
      const items = getOverlayItems(overlay);
      expect(items).toHaveLength(overlay.countries.length);
      items.forEach((item, idx) => {
        expect(item.isoCode).toBe(overlay.countries[idx]);
        expect(item.color).toBe(overlay.color);
        expect(item.overlayId).toBe(overlay.id);
      });
    });
  });

  describe("groupOverlayItemsByIsoCode", () => {
    it("groups overlay items by isoCode (case-insensitive)", () => {
      const items = [
        { isoCode: "us", color: "#f00", overlayId: "1" },
        { isoCode: "US", color: "#0f0", overlayId: "2" },
        { isoCode: "ca", color: "#00f", overlayId: "1" },
      ];
      const grouped = groupOverlayItemsByIsoCode(items);
      expect(Object.keys(grouped)).toEqual(["US", "CA"]);
      expect(grouped.US).toHaveLength(2);
      expect(grouped.CA).toHaveLength(1);
    });

    it("skips items with empty isoCode", () => {
      const items = [
        { isoCode: "", color: "#f00", overlayId: "1" },
        { isoCode: undefined, color: "#0f0", overlayId: "2" },
      ] as any;
      const grouped = groupOverlayItemsByIsoCode(items);
      expect(grouped).toEqual({});
    });

    it("returns empty object for empty input", () => {
      expect(groupOverlayItemsByIsoCode([])).toEqual({});
      expect(groupOverlayItemsByIsoCode()).toEqual({});
    });
  });

  describe("getBlendedOverlayColor", () => {
    it("returns visited-countries color if present", () => {
      const overlays = [
        {
          isoCode: "US",
          color: "#123",
          overlayId: VISITED_OVERLAY_ID,
        },
        { isoCode: "US", color: "#456", overlayId: "other" },
      ];
      expect(getBlendedOverlayColor(overlays, "#fff")).toBe("#123");
    });

    it("returns fallback color if overlays is empty", () => {
      expect(getBlendedOverlayColor([], "#fff")).toBe("#fff");
      expect(getBlendedOverlayColor(undefined, "#abc")).toBe("#abc");
    });

    it("returns the only overlay color if one present", () => {
      const overlays = [
        { isoCode: "US", color: "#789", overlayId: "other" },
      ];
      expect(getBlendedOverlayColor(overlays, "#fff")).toBe("#789");
    });

    it("blends colors if multiple overlays (excluding visited-countries)", () => {
      const overlays = [
        { isoCode: "US", color: "#111", overlayId: "a" },
        { isoCode: "US", color: "#222", overlayId: "b" },
      ];
      expect(getBlendedOverlayColor(overlays, "#fff")).toBe("#abcdef");
      expect(blendColors).toHaveBeenCalledWith(["#222", "#111"]);
    });

    it("ignores overlays with missing/empty color", () => {
      const overlays = [
        { isoCode: "US", color: "", overlayId: "a" },
        { isoCode: "US", color: undefined, overlayId: "b" },
      ] as any;
      expect(getBlendedOverlayColor(overlays, "#fff")).toBe("#fff");
    });
  });
});
