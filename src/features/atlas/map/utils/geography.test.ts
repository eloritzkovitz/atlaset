import * as topojsonClient from "topojson-client";
import { vi, describe, it, expect } from "vitest";
import {
  getFeatures,
  prepareMesh,
  prepareFeatures,
  createConnectorPath,
} from "./geography";
import type { GeographyFeature, Topology } from "../types";

type GeoJsonFeature = import("geojson").Feature<
  import("geojson").Geometry,
  Record<string, unknown>
>;

describe("geography utility suite", () => {
  const mockFeature: GeoJsonFeature = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [1, 2] },
    properties: { foo: "bar" },
  };

  describe("getFeatures", () => {
    it("handles FeatureCollections, raw Features, and loose arrays", () => {
      expect(
        getFeatures({ type: "FeatureCollection", features: [mockFeature] }),
      ).toEqual([mockFeature]);
      expect(getFeatures(mockFeature)).toEqual([mockFeature]);
      expect(getFeatures([mockFeature])).toEqual([mockFeature]);
    });

    it("executes parseGeographies transformation layers", () => {
      const cb = vi.fn((arr) => arr.slice(1));
      expect(getFeatures([mockFeature, mockFeature], cb)).toEqual([
        mockFeature,
      ]);
      expect(cb).toHaveBeenCalledWith([mockFeature, mockFeature]);
    });

    it("unwraps internal structural layers of TopoJSON Topology formats", () => {
      const topo: Topology = {
        type: "Topology",
        objects: { foo: { type: "GeometryCollection", geometries: [] } },
      };
      const spy = vi.spyOn(topojsonClient, "feature").mockReturnValue({
        type: "FeatureCollection",
        features: [mockFeature],
      });

      expect(getFeatures(topo)).toEqual([mockFeature]);
      spy.mockReturnValue(
        null as unknown as import("geojson").FeatureCollection,
      );
      expect(getFeatures(topo)).toEqual([]);
      spy.mockRestore();
    });
  });

  describe("getMesh", () => {
    const topoTemplate: Topology = {
      type: "Topology",
      objects: { foo: { type: "GeometryCollection", geometries: [] } },
    };

    const runWithMeshMock = async (meshImpl: any) => {
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

    it("returns null for non-TopoJSON structures", async () => {
      const { getMesh } = await import("./geography");
      expect(getMesh({ type: "FeatureCollection", features: [] })).toBeNull();
    });

    it("covers all combinations of valid or undefined geometry meshes", async () => {
      const validGeom = { type: "MultiLineString", coordinates: [] };

      let res = await runWithMeshMock(
        (_t: any, _o: any, p: any) => (p({}, {}), validGeom),
      );
      expect(res).toEqual({
        outline: { type: "Feature", geometry: validGeom, properties: {} },
        borders: { type: "Feature", geometry: validGeom, properties: {} },
      });

      let call = 0;
      res = await runWithMeshMock(() => (++call === 1 ? undefined : validGeom));
      expect(res?.outline).toBeUndefined();
      expect(res?.borders).toBeDefined();

      call = 0;
      res = await runWithMeshMock(() => (++call === 1 ? validGeom : undefined));
      expect(res?.outline).toBeDefined();
      expect(res?.borders).toBeUndefined();
    });
  });

  describe("prepareMesh", () => {
    const feat = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [0, 0] },
      properties: {},
    } as GeographyFeature;

    it("configures string maps or bails out with an empty structure if assets are missing", () => {
      const pathSpy = vi.fn().mockReturnValue("M0,0");
      const res = prepareMesh(feat, feat, pathSpy);
      expect(res.outline?.svgPath).toBe("M0,0");
      expect(res.borders?.rsmKey).toBe("borders");

      const nullPathSpy = vi.fn().mockReturnValue(null);
      const fallbackRes = prepareMesh(feat, feat, nullPathSpy);
      expect(fallbackRes.outline?.svgPath).toBe("");

      expect(prepareMesh(undefined, feat, pathSpy)).toEqual({});
    });
  });

  describe("prepareFeatures", () => {
    it("maps items sequentially and defaults null string transformations safely", () => {
      const pathSpy = vi
        .fn()
        .mockReturnValueOnce("M1,2")
        .mockReturnValueOnce(null);
      const result = prepareFeatures([mockFeature, mockFeature], pathSpy);

      expect(result[0].rsmKey).toBe("geo-0");
      expect(result[0].svgPath).toBe("M1,2");
      expect(result[1].svgPath).toBe("");
      expect(prepareFeatures([], pathSpy)).toEqual([]);
    });
  });

  describe("createConnectorPath", () => {
    it("handles individual coordinate factors and tuple curves correctly", () => {
      expect(createConnectorPath()).toContain("M0,0 Q");
      expect(createConnectorPath(10, 20, 0.2)).toContain("M0,0 Q");
      expect(createConnectorPath(10, 20, [0.1, 0.3])).toContain("M0,0 Q");
    });
  });
});
