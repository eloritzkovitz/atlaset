import type { Coordinates } from "../types";
import * as d3Geo from "d3-geo";
import * as projectionModule from "./projection";
import {
  makeProjection,
  getProjection,
  getFeatureCentroid,
  getCountryCenterAndZoom,
} from "./projection";

describe("makeProjection", () => {
  it("creates a default geoEqualEarth projection", () => {
    const proj = makeProjection({});
    expect(typeof proj).toBe("function");
    expect(proj.translate()).toEqual([800 / 2, 600 / 2]);
  });

  it("creates a projection with custom width and height", () => {
    const proj = makeProjection({ width: 1000, height: 500 });
    expect(proj.translate()).toEqual([500, 250]);
  });

  it("creates a projection using a custom projection function", () => {
    const customProj = vi.fn(() => d3Geo.geoMercator());
    const proj = makeProjection({ projection: customProj });
    expect(customProj).toHaveBeenCalled();
    expect(typeof proj.invert).toBe("function");
  });

  it("throws on unknown projection name", () => {
    expect(() => makeProjection({ projection: "notAProjection" })).toThrow(
      /Unknown projection/,
    );
  });

  it("applies projectionConfig center, rotate, scale, and parallels", () => {
    const mockProj: any = {
      translate: vi.fn(() => mockProj),
      center: vi.fn(() => mockProj),
      rotate: vi.fn(() => mockProj),
      scale: vi.fn(() => mockProj),
      parallels: vi.fn(() => mockProj),
    };
    projectionModule.projectionMap["geoTest"] = vi.fn(() => mockProj);

    const config = {
      center: [1, 2] as Coordinates,
      rotate: [3, 4, 5] as [number, number, number],
      scale: 123,
      parallels: [6, 7] as Coordinates,
    };
    makeProjection({ projection: "geoTest", projectionConfig: config });
    expect(mockProj.center).toHaveBeenCalledWith([1, 2]);
    expect(mockProj.rotate).toHaveBeenCalledWith([3, 4, 5]);
    expect(mockProj.scale).toHaveBeenCalledWith(123);
    expect(mockProj.parallels).toHaveBeenCalledWith([6, 7]);

    delete projectionModule.projectionMap["geoTest"];
  });

  it("ignores projectionConfig keys with invalid values or missing methods", () => {
    const mockProj: any = { translate: vi.fn(() => mockProj) }; // missing other methods
    projectionModule.projectionMap["geoTest2"] = vi.fn(() => mockProj);

    const config = {
      center: [1] as unknown as Coordinates,
      rotate: "invalid" as unknown as [number, number, number],
      scale: "invalid" as unknown as number,
      parallels: null as unknown as Coordinates,
    };

    expect(() =>
      makeProjection({ projection: "geoTest2", projectionConfig: config }),
    ).not.toThrow();
    delete projectionModule.projectionMap["geoTest2"];
  });
});

describe("getProjection", () => {
  it("handles supported types and falls back to default mercator branch", () => {
    expect(typeof getProjection("mercator", 800, 400, 2)).toBe("function");
    expect(getProjection("naturalEarth1", 800, 400, 2).center()).toEqual([
      0, 0,
    ]);
    expect(getProjection("equirectangular", 800, 400, 2).center()).toEqual([
      0, 0,
    ]);
    expect(getProjection("unknown-fallback", 800, 400, 2).translate()).toEqual([
      400, 200,
    ]);
  });

  it("uses custom geoFns if provided", () => {
    const customFn = vi.fn(() => d3Geo.geoMercator());
    getProjection("naturalEarth1", 800, 400, 2, 1, [0, 0], {
      geoNaturalEarth1: customFn,
    });
    expect(customFn).toHaveBeenCalled();
  });
});

describe("getSvgCoordsFromTransform", () => {
  it("calculates exact inverse spatial conversions", () => {
    const coords = projectionModule.getSvgCoordsFromTransform(800, 400, {
      x: 10,
      y: 20,
      k: 2,
    });
    expect(coords).toEqual([195, 90]);
  });
});

describe("getFeatureCentroid", () => {
  it("proxies execution directly to geoCentroid", () => {
    const feature: any = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [1, 2] },
    };
    expect(getFeatureCentroid(feature, () => [1, 2])).toEqual([1, 2]);
  });
});

describe("getCountryCenterAndZoom", () => {
  const geoData: any = {
    features: [
      { properties: { "ISO3166-1-Alpha-2": "FR" }, geometry: {} },
      { properties: { "ISO3166-1-Alpha-3": "USA" }, geometry: {} },
      { properties: null, geometry: {} },
    ],
  };

  it("safely resolves country targets, missing identifiers, or structural failures", () => {
    const mockCentroid = () => [2, 3] as const;
    const mockBounds = () =>
      [
        [0, 0],
        [10, 5],
      ] as const;

    expect(getCountryCenterAndZoom(null, "FR")).toBeNull();
    expect(getCountryCenterAndZoom(geoData, "UK")).toBeNull();
    expect(
      getCountryCenterAndZoom(
        geoData,
        "FR",
        mockCentroid as any,
        mockBounds as any,
      ),
    ).toEqual({ center: [2, 3], zoom: 6 });
    expect(
      getCountryCenterAndZoom(
        geoData,
        "USA",
        mockCentroid as any,
        mockBounds as any,
      ),
    ).toBeDefined();
  });
});
