import { describe, it, expect, vi } from "vitest";
import { calculateScaledDimensions } from "./canvas";

describe("calculateScaledDimensions", () => {
  it("calculates dimensions with custom or default parameters", () => {
    expect(
      calculateScaledDimensions({
        width: 200,
        height: 100,
        scale: 2,
        devicePixelRatio: 2,
      }),
    ).toEqual({ width: 800, height: 400 });

    const expectedDpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    expect(calculateScaledDimensions({ width: 100, height: 50 })).toEqual({
      width: Math.round(100 * expectedDpr),
      height: Math.round(50 * expectedDpr),
    });
  });

  it("caps dimensions to maxDimension and logs warning", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = calculateScaledDimensions({
      width: 10000,
      height: 5000,
      scale: 1,
      devicePixelRatio: 1,
      maxDimension: 8192,
    });

    expect(result).toEqual({ width: 8192, height: 4096 });
    expect(warnSpy).toHaveBeenCalledWith(
      "Export capped to 8192px max side; output scaled by 0.82",
    );
  });

  it("handles missing window or falsy devicePixelRatio", () => {
    vi.stubGlobal("window", { ...window, devicePixelRatio: 0 });
    expect(calculateScaledDimensions({ width: 100, height: 100 })).toEqual({
      width: 100,
      height: 100,
    });

    vi.stubGlobal("window", undefined);
    expect(calculateScaledDimensions({ width: 100, height: 100 })).toEqual({
      width: 100,
      height: 100,
    });

    vi.unstubAllGlobals();
  });
});
