import * as topojsonClient from "topojson-client";
import type { Feature, Geometry } from "geojson";
import { vi, describe, it, expect } from "vitest";
import {
  getFeatures,
  prepareMesh,
  prepareFeatures,
  createConnectorPath,
  isString,
} from "./geography";
import type { GeographyFeature, Topology } from "../types";

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
    const spy = vi.spyOn(topojsonClient, "feature").mockImplementation(() => ({
      type: "FeatureCollection",
      features: [feature],
    }));
    expect(getFeatures(topo)).toEqual([feature]);
    spy.mockRestore();
  });
});

describe("getMesh", () => {
  const topoTemplate: Topology = {
    type: "Topology",
    objects: {
      foo: { type: "GeometryCollection", geometries: [] },
    },
  };

  const runWithMeshMock = async (
    meshImpl: (
      _topo: unknown,
      _obj: unknown,
      predicate: (a: unknown, b: unknown) => boolean,
    ) => Geometry | undefined,
  ) => {
    vi.resetModules();
    vi.doMock("topojson-client", () => ({
      mesh: meshImpl,
      feature: () => ({ type: "FeatureCollection", features: [] }),
    }));
    const { getMesh } = await import("./geography");
    const res = getMesh(topoTemplate);
    vi.resetModules();
    return res;
  };

  it("returns null for non-TopoJSON", async () => {
    const { getMesh } = await import("./geography");
    expect(getMesh({ type: "FeatureCollection", features: [] })).toBeNull();
  });

  it("getMesh: both outline and borders present", async () => {
    const res = await runWithMeshMock((_t, _o, predicate) => {
      predicate({}, {});
      return {
        type: "MultiLineString",
        coordinates: [],
      } as unknown as Geometry;
    });
    expect(res).not.toBeNull();
    expect(res!.outline).toBeDefined();
    expect(res!.borders).toBeDefined();
  });

  it("getMesh: outline undefined, borders defined", async () => {
    let call = 0;
    const res = await runWithMeshMock((_t, _o, predicate) => {
      call++;
      predicate({}, {});
      return call === 1
        ? undefined
        : ({ type: "MultiLineString", coordinates: [] } as unknown as Geometry);
    });
    expect(res).not.toBeNull();
    expect(res!.outline).toBeUndefined();
    expect(res!.borders).toBeDefined();
  });

  it("getMesh: outline defined, borders undefined", async () => {
    let call = 0;
    const res = await runWithMeshMock((_t, _o, predicate) => {
      call++;
      predicate({}, {});
      return call === 1
        ? ({ type: "MultiLineString", coordinates: [] } as unknown as Geometry)
        : undefined;
    });
    expect(res).not.toBeNull();
    expect(res!.outline).toBeDefined();
    expect(res!.borders).toBeUndefined();
  });

  it("getMesh: both outline and borders undefined", async () => {
    const res = await runWithMeshMock((_t, _o, predicate) => {
      predicate({}, {});
      return undefined;
    });
    expect(res).not.toBeNull();
    expect(res!.outline).toBeUndefined();
    expect(res!.borders).toBeUndefined();
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
      /^M0,0 Q/,
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
