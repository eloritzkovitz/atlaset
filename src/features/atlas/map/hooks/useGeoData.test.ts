import { renderHook } from "@testing-library/react";
import { useGeoData } from "./useGeoData";
import { act } from "react";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import * as dbModule from "@utils/db";

describe("useGeoData", () => {
  let getSpy: any;
  let putSpy: any;

  const fakeData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 0] },
        properties: { foo: "bar" },
      },
    ],
  };
  const now = Date.now();

  beforeEach(() => {
    process.env.NODE_ENV = "production";
    vi.stubGlobal("fetch", vi.fn());
    getSpy = vi.spyOn(dbModule.appDb.geoData, "get");
    putSpy = vi.spyOn(dbModule.appDb.geoData, "put");
  });

  afterEach(() => {
    process.env.NODE_ENV = "test";
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns loading initially", () => {
    (fetch as any).mockReturnValue(new Promise(() => {}));
    getSpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useGeoData());
    expect(result.current.loading).toBe(true);
    expect(result.current.geoData).toBeNull();
    expect(result.current.geoError).toBeNull();
  });

  it("returns geoData from cache if valid", async () => {
    getSpy.mockResolvedValue({ data: fakeData, ts: now });
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await Promise.resolve();
    });
    // The hook returns normalized geoData, which should match fakeData (already valid)
    expect(result.current.geoData).toEqual(fakeData);
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches and caches geoData if cache is missing or expired", async () => {
    getSpy.mockResolvedValue(undefined); // No cache
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeData),
    });
    putSpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(fetch).toHaveBeenCalledWith(DEFAULT_MAP_SETTINGS.geoUrl, undefined);
    expect(result.current.geoData).toEqual(fakeData);
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBeNull();
    expect(putSpy).toHaveBeenCalledWith({
      id: "geoData",
      data: fakeData,
      ts: expect.any(Number),
    });
  });

  it("returns geoError on fetch failure", async () => {
    getSpy.mockResolvedValue(undefined);
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Failed to load map data");
  });

  it("returns geoError on fetch exception", async () => {
    getSpy.mockResolvedValue(undefined);
    (fetch as any).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Network error");
  });
});
