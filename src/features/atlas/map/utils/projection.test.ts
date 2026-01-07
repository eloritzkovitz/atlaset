import type { Feature, FeatureCollection, Geometry, Point } from "geojson";

import type { Coordinates } from "../types";
import * as d3Geo from "d3-geo";
import * as projectionModule from "./projection";

import {
  makeProjection,
  getProjection,
  getGeoCoordsFromMouseEvent,
  getFeatureCentroid,
  getCountryCenterAndZoom,
  getScaleBarLabel,
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
    // Use a real d3-geo projection to satisfy the GeoProjection type
    const customProj = vi.fn(() => d3Geo.geoMercator());
    const proj = makeProjection({ projection: customProj });
    expect(customProj).toHaveBeenCalled();
    expect(typeof proj.invert).toBe("function");
  });

  it("throws on unknown projection name", () => {
    expect(() => makeProjection({ projection: "notAProjection" })).toThrow(
      /Unknown projection/
    );
  });

  it("applies projectionConfig center, rotate, scale, and parallels", () => {
    // Mock a projection with all config methods
    const mockProj: any = {
      translate: vi.fn(() => mockProj),
      center: vi.fn(() => mockProj),
      rotate: vi.fn(() => mockProj),
      scale: vi.fn(() => mockProj),
      parallels: vi.fn(() => mockProj),
    };
    const mockCtor = vi.fn(() => mockProj);
    // Patch projectionMap for this test
    projectionModule.projectionMap["geoTest"] = mockCtor;
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
    // Clean up
    delete projectionModule.projectionMap["geoTest"];
  });

  it("ignores projectionConfig keys with invalid values", () => {
    const mockProj: any = {
      translate: vi.fn(() => mockProj),
      center: vi.fn(() => mockProj),
      rotate: vi.fn(() => mockProj),
      scale: vi.fn(() => mockProj),
      parallels: vi.fn(() => mockProj),
    };
    const mockCtor = vi.fn(() => mockProj);
    projectionModule.projectionMap["geoTest2"] = mockCtor;
    // Invalid values (should not call the methods)
    const config = {
      center: [1, undefined] as unknown as Coordinates,
      rotate: [2, undefined, undefined] as unknown as [number, number, number],
      scale: "notANumber" as unknown as number,
      parallels: [3, undefined] as unknown as Coordinates,
    };
    makeProjection({ projection: "geoTest2", projectionConfig: config });
    expect(mockProj.center).toHaveBeenCalledWith([1, undefined]);
    expect(mockProj.rotate).toHaveBeenCalledWith([2, undefined, undefined]);
    expect(mockProj.scale).not.toHaveBeenCalled();
    expect(mockProj.parallels).toHaveBeenCalledWith([3, undefined]);
    delete projectionModule.projectionMap["geoTest2"];
  });
});

describe("getProjection", () => {
  it("returns a mercator projection by default", () => {
    const proj = getProjection("mercator", 800, 400, 2);
    expect(typeof proj).toBe("function");
    expect(proj.center()).toEqual([0, 0]);
  });

  it("returns a naturalEarth1 projection", () => {
    const proj = getProjection("naturalEarth1", 800, 400, 2, 1, [
      10, 20,
    ] as Coordinates);
    expect(proj.center()).toEqual([10, 20]);
  });

  it("returns an equirectangular projection", () => {
    const proj = getProjection("equirectangular", 800, 400, 2, 1, [
      5, 5,
    ] as Coordinates);
    expect(proj.center()).toEqual([5, 5]);
  });

  it("applies scale and translate", () => {
    const proj = getProjection("mercator", 800, 400, 2, 2);
    expect(proj.translate()).toEqual([800 / 2, 400 / 2]);
  });

  it("uses custom geoFns if provided", () => {
    const customFn = vi.fn(() => d3Geo.geoMercator());
    const proj = getProjection(
      "naturalEarth1",
      800,
      400,
      2,
      1,
      [0, 0] as Coordinates,
      { geoNaturalEarth1: customFn }
    );
    expect(customFn).toHaveBeenCalled();
    expect(typeof proj.invert).toBe("function");
  });
});

describe("getGeoCoordsFromMouseEvent", () => {
  it("returns geo coords from mouse event", () => {
    // Mock SVG element and event
    const svg = {
      getBoundingClientRect: () => ({ left: 100, top: 50 }),
    } as unknown as SVGSVGElement;

    const event = {
      currentTarget: svg,
      clientX: 150,
      clientY: 70,
    } as React.MouseEvent<SVGSVGElement>;

    // Mock projection with invert
    const proj = () => {};
    (proj as any).invert = () => [10, 20];
    const mockGetProjection = () => proj as any;

    const coords = getGeoCoordsFromMouseEvent(
      event,
      "mercator",
      800,
      400,
      2,
      1,
      [0, 0] as Coordinates,
      mockGetProjection
    );
    expect(coords).toEqual([10, 20]);
  });

  it("returns null if projection has no invert", () => {
    const svg = {
      getBoundingClientRect: () => ({ left: 0, top: 0 }),
    } as unknown as SVGSVGElement;
    const event = {
      currentTarget: svg,
      clientX: 10,
      clientY: 10,
    } as React.MouseEvent<SVGSVGElement>;

    // Mock projection without invert
    const proj = () => {};
    const mockGetProjection = () => proj as any;

    const coords = getGeoCoordsFromMouseEvent(
      event,
      "mercator",
      800,
      400,
      2,
      1,
      [0, 0] as Coordinates,
      mockGetProjection
    );
    expect(coords).toBeNull();
  });
});
describe("getSvgCoordsFromTransform", () => {
  it("converts transformed map coordinates to SVG coordinates", () => {
    const w = 800,
      h = 400,
      t = { x: 10, y: 20, k: 2 };
    const coords = projectionModule.getSvgCoordsFromTransform(w, h, t);
    // Should be a tuple of numbers
    expect(Array.isArray(coords)).toBe(true);
    expect(coords.length).toBe(2);
    expect(typeof coords[0]).toBe("number");
    expect(typeof coords[1]).toBe("number");
  });
});

describe("getFeatureCentroid", () => {
  it("returns centroid from geoCentroid", () => {
    const feature: Feature<Point, { [key: string]: unknown }> = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [1, 2] },
      properties: {},
    };
    const mockGeoCentroid = (_feature: any): [number, number] => [1, 2];
    expect(getFeatureCentroid(feature, mockGeoCentroid)).toEqual([1, 2]);
  });
});

describe("getCountryCenterAndZoom", () => {
  const geoData: FeatureCollection<Geometry, { [key: string]: unknown }> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          "ISO3166-1-Alpha-2": "FR",
          "ISO3166-1-Alpha-3": "FRA",
        },
        geometry: { type: "Polygon", coordinates: [] },
      },
    ],
  };

  it("returns null if country not found", () => {
    expect(getCountryCenterAndZoom(geoData, "US")).toBeNull();
  });

  it("returns center and zoom for found country", () => {
    const mockGeoCentroid = (_feature: any): [number, number] => [2, 3];
    const mockGeoBounds = (
      _feature: any
    ): [[number, number], [number, number]] => [
      [0, 0],
      [10, 5],
    ];
    const result = getCountryCenterAndZoom(
      geoData,
      "FR",
      mockGeoCentroid,
      mockGeoBounds
    );
    expect(result).toEqual({ center: [2, 3], zoom: expect.any(Number) });
  });
});

describe("getScaleBarLabel", () => {
  it("returns a rounded scale with 2 * pow10 (e.g., 200 m)", () => {
    const origLog10 = Math.log10;
    Math.log10 = () => 2; // pow10 = 100
    const label = getScaleBarLabel(10, 0, 2.5);
    expect(label).toBe("200 m");
    Math.log10 = origLog10;
  });

  it("returns a rounded scale in meters for small distances", () => {
    const label = getScaleBarLabel(20, 0, 100);
    expect(label).toMatch(/\d+ m/);
  });

  it("returns a rounded scale in kilometers for large distances", () => {
    const label = getScaleBarLabel(1, 0, 10000);
    expect(label).toMatch(/km/);
  });

  it("returns a dash for invalid latitude", () => {
    expect(getScaleBarLabel(10, NaN)).toBe("—");
    expect(getScaleBarLabel(10, 100)).toBe("—");
  });

  it("returns a dash for non-finite result", () => {
    // Simulate a case where metersPerPixel is not finite
    expect(getScaleBarLabel(10, 0, Infinity)).toBe("—");
  });
});
