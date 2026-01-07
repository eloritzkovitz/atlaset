import * as topojsonClient from "topojson-client";
import type { Feature, Geometry } from "geojson";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareMesh,
  prepareFeatures,
  createConnectorPath,
  isString,
} from "./geography";
import type { GeographyFeature, Topology } from "../types";

describe("fetchGeographies", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("returns data on success", async () => {
    (global.fetch as unknown as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ foo: "bar" }),
    });
    const data = await fetchGeographies("/test");
    expect(data).toEqual({ foo: "bar" });
  });

  it("returns undefined on fetch error", async () => {
    (global.fetch as unknown as Mock).mockRejectedValue(new Error("fail"));
    const data = await fetchGeographies("/test");
    expect(data).toBeUndefined();
  });

  it("returns undefined on non-ok response", async () => {
    (global.fetch as unknown as Mock).mockResolvedValue({
      ok: false,
      statusText: "Bad",
    });
    const data = await fetchGeographies("/test");
    expect(data).toBeUndefined();
  });
});

describe("getFeatures", () => {
  const feature: Feature<Geometry, Record<string, unknown>> = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [1, 2] },
    properties: { foo: "bar" },
  };
  const featureCollection = {
    type: "FeatureCollection",
    features: [feature],
  };

  it("returns features from FeatureCollection", () => {
    expect(getFeatures(featureCollection)).toEqual([feature]);
  });

  it("returns features from Feature", () => {
    expect(getFeatures(feature)).toEqual([feature]);
  });

  it("returns features from array", () => {
    expect(getFeatures([feature])).toEqual([feature]);
  });

  it("applies parseGeographies callback", () => {
    const cb = vi.fn((arr) => arr.slice(1));
    expect(getFeatures([feature, feature], cb)).toEqual([feature]);
    expect(cb).toHaveBeenCalledWith([feature, feature]);
  });

  it("returns features from TopoJSON", () => {
    const topo: Topology = {
      type: "Topology",
      objects: {
        foo: {
          type: "GeometryCollection",
          geometries: [],
        },
      },
    };
    // Mock feature to return a FeatureCollection
    const spy = vi.spyOn(topojsonClient, "feature").mockImplementation(() => ({
      type: "FeatureCollection",
      features: [feature],
    }));
    expect(getFeatures(topo)).toEqual([feature]);
    spy.mockRestore();
  });
});

describe("getMesh", () => {
  it("returns null for non-TopoJSON", () => {
    expect(getMesh({ type: "FeatureCollection", features: [] })).toBeNull();
  });

  it("returns outline and borders for TopoJSON", () => {
    const topo: Topology = {
      type: "Topology",
      objects: {
        foo: {
          type: "GeometryCollection",
          geometries: [],
        },
      },
    };
    // Mock mesh to return MultiLineString
    const spy = vi.spyOn(topojsonClient, "mesh").mockImplementation((() => ({
      type: "MultiLineString",
      coordinates: [],
    })) as typeof topojsonClient.mesh);
    const result = getMesh(topo);
    expect(result).not.toBeNull();
    expect(result!.outline).toBeDefined();
    expect(result!.borders).toBeDefined();
    spy.mockRestore();
  });

  it("returns object with undefined outline if mesh returns undefined for outlineGeometry", () => {
    const topo: Topology = {
      type: "Topology",
      objects: {
        foo: {
          type: "GeometryCollection",
          geometries: [],
        },
      },
    };
    let call = 0;
    const spy = vi.spyOn(topojsonClient, "mesh").mockImplementation((() => {
      call++;
      return call === 1
        ? undefined
        : { type: "MultiLineString", coordinates: [] };
    }) as typeof topojsonClient.mesh);
    // outlineGeometry is undefined, bordersGeometry is valid
    const result = getMesh(topo);
    expect(result).not.toBeNull();
    expect(result!.outline).toBeUndefined();
    expect(result!.borders).toBeDefined();
    spy.mockRestore();
  });

  it("returns object with undefined borders if mesh returns undefined for bordersGeometry", () => {
    const topo: Topology = {
      type: "Topology",
      objects: {
        foo: {
          type: "GeometryCollection",
          geometries: [],
        },
      },
    };
    let call = 0;
    const spy = vi.spyOn(topojsonClient, "mesh").mockImplementation((() => {
      call++;
      return call === 1
        ? { type: "MultiLineString", coordinates: [] }
        : undefined;
    }) as typeof topojsonClient.mesh);
    // outlineGeometry is valid, bordersGeometry is undefined
    const result = getMesh(topo);
    expect(result).not.toBeNull();
    expect(result!.outline).toBeDefined();
    expect(result!.borders).toBeUndefined();
    spy.mockRestore();
  });

  it("returns object with both undefined if mesh returns undefined for both", () => {
    const topo: Topology = {
      type: "Topology",
      objects: {
        foo: {
          type: "GeometryCollection",
          geometries: [],
        },
      },
    };
    const spy = vi
      .spyOn(topojsonClient, "mesh")
      .mockImplementation(
        (() => undefined) as unknown as typeof topojsonClient.mesh
      );
    // both outlineGeometry and bordersGeometry are undefined
    const result = getMesh(topo);
    expect(result).not.toBeNull();
    expect(result!.outline).toBeUndefined();
    expect(result!.borders).toBeUndefined();
    spy.mockRestore();
  });
});

describe("prepareMesh", () => {
  const outline: GeographyFeature = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
    properties: {},
    rsmKey: "",
    svgPath: "",
  };
  const borders: GeographyFeature = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3, 4],
        [5, 6],
      ],
    },
    properties: {},
    rsmKey: "",
    svgPath: "",
  };
  const path = vi.fn(() => "M0,0");

  it("returns prepared mesh with keys and paths", () => {
    const result = prepareMesh(outline, borders, path);
    expect(result.outline?.rsmKey).toBe("outline");
    expect(result.outline?.svgPath).toBe("M0,0");
    expect(result.borders?.rsmKey).toBe("borders");
    expect(result.borders?.svgPath).toBe("M0,0");
  });

  it("returns empty object if outline or borders missing", () => {
    expect(prepareMesh(undefined, borders, path)).toEqual({});
    expect(prepareMesh(outline, undefined, path)).toEqual({});
  });
});

describe("prepareFeatures", () => {
  const feature: Feature<Geometry, Record<string, unknown>> = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [1, 2] },
    properties: {},
  };
  const path = vi.fn(() => "M1,2");

  it("returns prepared features with keys and paths", () => {
    const result = prepareFeatures([feature], path);
    expect(result[0].rsmKey).toBe("geo-0");
    expect(result[0].svgPath).toBe("M1,2");
  });

  it("returns empty array for empty input", () => {
    expect(prepareFeatures([], path)).toEqual([]);
  });
});

describe("createConnectorPath", () => {
  it("returns default connector path", () => {
    expect(createConnectorPath()).toMatch(/^M0,0 Q/);
  });

  it("returns connector path with custom dx/dy/curve", () => {
    expect(createConnectorPath(10, 20, 0.2)).toMatch(/^M0,0 Q/);
    expect(createConnectorPath(10, 20, [0.1, 0.3] as [number, number])).toMatch(
      /^M0,0 Q/
    );
  });
});

describe("isString", () => {
  it("returns true for string", () => {
    expect(isString("foo")).toBe(true);
  });
  it("returns false for non-string", () => {
    expect(isString(123)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(null)).toBe(false);
  });
});
