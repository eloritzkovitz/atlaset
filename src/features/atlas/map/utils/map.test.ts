import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import {
  getProjection,
  getGeoCoordsFromMouseEvent,
  getFeatureCentroid,
  getCountryCenterAndZoom,
  getScaleBarLabel,
  normalizeGeoDataProperties,
} from "./map";

describe("normalizeGeoDataProperties", () => {
  it("returns null if input is null", () => {
    expect(normalizeGeoDataProperties(null)).toBeNull();
  });

  it("returns a new FeatureCollection with properties as object", () => {
    const input: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: null,
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: { foo: "bar" },
        },
      ],
    };
    const result = normalizeGeoDataProperties(input);
    expect(result).not.toBeNull();
    expect(result?.features.length).toBe(2);
    expect(result?.features[0].properties).toEqual({});
    expect(result?.features[1].properties).toEqual({ foo: "bar" });
  });

  it("does not mutate the original input", () => {
    const input: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: null,
        },
      ],
    };
    const inputCopy = JSON.parse(JSON.stringify(input));
    normalizeGeoDataProperties(input);
    expect(input).toEqual(inputCopy);
  });
});

describe("getProjection", () => {
  it("returns a mercator projection by default", () => {
    const proj = getProjection("mercator", 800, 400, 2);
    expect(typeof proj).toBe("function");
    expect(proj.center()).toEqual([0, 0]);
  });

  it("returns a naturalEarth1 projection", () => {
    const proj = getProjection("naturalEarth1", 800, 400, 2, 1, [10, 20]);
    expect(proj.center()).toEqual([10, 20]);
  });

  it("returns an equirectangular projection", () => {
    const proj = getProjection("equirectangular", 800, 400, 2, 1, [5, 5]);
    expect(proj.center()).toEqual([5, 5]);
  });

  it("applies scale and translate", () => {
    const proj = getProjection("mercator", 800, 400, 2, 2);
    expect(proj.translate()).toEqual([800 / 2, 400 / 2]);
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
      [0, 0],
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
      [0, 0],
      mockGetProjection
    );
    expect(coords).toBeNull();
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
