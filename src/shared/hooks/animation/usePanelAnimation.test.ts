import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePanelAnimation } from "./usePanelAnimation";

type PanelAnimationProps = Parameters<typeof usePanelAnimation>[0];

describe("usePanelAnimation", () => {
  const runHook = (props: Partial<PanelAnimationProps> = {}) =>
    renderHook(() =>
      usePanelAnimation({
        show: true,
        showSidebar: true,
        isMobile: false,
        animationsEnabled: true,
        position: "left",
        ...props,
      }),
    ).result.current;

  describe("Mobile Configuration", () => {
    it("returns correct visible and hidden animation classes", () => {
      const open = runHook({ isMobile: true, show: true });
      expect(open).toContain("bottom-0 start-0 end-0 z-50");
      expect(open).toContain("transition-all duration-300");
      expect(open).toContain("translate-y-0 opacity-100");

      const closed = runHook({ isMobile: true, show: false });
      expect(closed).toContain(
        "translate-y-full opacity-0 pointer-events-none",
      );
    });

    it("respects disabled animations on mobile", () => {
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

  describe("Desktop Configuration", () => {
    it("handles left position with and without sidebar", () => {
      const withSidebar = runHook({ position: "left", showSidebar: true });
      expect(withSidebar).toContain("start-16");
      expect(withSidebar).toContain("translate-x-0 opacity-100");
      expect(withSidebar).toContain("will-change-transform");

      const noSidebar = runHook({ position: "left", showSidebar: false });
      expect(noSidebar).toContain("start-0");
    });

    it("handles right position layout", () => {
      const cls = runHook({ position: "right" });
      expect(cls).toContain("end-0");
    });

    it("generates correct LTR/RTL CSS variant translation classes when closed", () => {
      const leftClosed = runHook({ position: "left", show: false });
      expect(leftClosed).toContain(
        "ltr:-translate-x-full rtl:translate-x-full",
      );

      const rightClosed = runHook({ position: "right", show: false });
      expect(rightClosed).toContain(
        "ltr:translate-x-full rtl:-translate-x-full",
      );
    });

    it("removes motion classes and transform states when animations are disabled", () => {
      const cls = runHook({
        position: "left",
        show: false,
        animationsEnabled: false,
      });
      expect(cls).toContain("transition-none");
      expect(cls).not.toContain("will-change-transform");
      expect(cls).not.toContain("translate-x-full");
      expect(cls).toContain("opacity-0 pointer-events-none");
    });
  });
});
