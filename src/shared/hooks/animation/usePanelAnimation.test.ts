import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePanelAnimation } from "./usePanelAnimation";

describe("usePanelAnimation", () => {
  const runHook = (props: any) =>
    renderHook(() =>
      usePanelAnimation({
        show: true,
        isMobile: false,
        isRtl: false,
        animationsEnabled: true,
        position: "left",
        ...props,
      }),
    ).result.current;

  describe("Mobile Configuration Layouts", () => {
    it("should output standard sliding animation classes when open", () => {
      const cls = runHook({ isMobile: true, show: true });
      expect(cls).toContain("transition-all duration-300");
      expect(cls).toContain("translate-y-0 opacity-100");
    });

    it("should output standard off-screen sliding translation when closed", () => {
      const cls = runHook({ isMobile: true, show: false });
      expect(cls).toContain("translate-y-full opacity-0");
    });

    it("should strip out spatial offsets and motion classes if animations are disabled", () => {
      const cls = runHook({
        isMobile: true,
        show: false,
        animationsEnabled: false,
      });
      expect(cls).toContain("transition-none");
      expect(cls).not.toContain("translate-y-full");
      expect(cls).toContain("opacity-0 pointer-events-none");
    });
  });

  describe("Desktop Configuration Layouts", () => {
    it("should align start margin assets properly on open left sidebars", () => {
      const cls = runHook({ position: "left", show: true });
      expect(cls).toContain("start-16");
      expect(cls).toContain("translate-x-0 opacity-100");
      expect(cls).toContain("will-change-transform");
    });

    it("should align end margin assets properly on right overlays", () => {
      const cls = runHook({ position: "right", show: true });
      expect(cls).toContain("end-0");
    });

    it("should handle directional translation strings dynamically based on RTL direction rules", () => {
      expect(
        runHook({ position: "left", show: false, isRtl: false }),
      ).toContain("-translate-x-full");

      expect(runHook({ position: "left", show: false, isRtl: true })).toContain(
        "translate-x-full",
      );

      expect(
        runHook({ position: "right", show: false, isRtl: false }),
      ).toContain("translate-x-full");

      expect(
        runHook({ position: "right", show: false, isRtl: true }),
      ).toContain("-translate-x-full");
    });

    it("should completely remove layout translations if animations are explicitly disabled", () => {
      const cls = runHook({
        position: "left",
        show: false,
        animationsEnabled: false,
      });
      expect(cls).toContain("transition-none");
      expect(cls).not.toContain("translate-x-");
      expect(cls).not.toContain("will-change-transform");
      expect(cls).toContain("opacity-0 pointer-events-none");
    });
  });
});
