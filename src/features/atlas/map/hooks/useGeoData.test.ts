import { renderHook, waitFor } from "@testing-library/react";
import { useGeoData } from "./useGeoData";
import { act } from "react";

describe("useGeoData", () => {
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

  beforeEach(() => {
    (import.meta.env as any).VITE_MAP_GEO_URL = "https://dummy-backend-url";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns loading initially", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    const { result } = renderHook(() => useGeoData());
    expect(result.current.loading).toBe(true);
    expect(result.current.geoData).toBeNull();
    expect(result.current.geoError).toBeNull();
  });

  it("returns geoData on successful static fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(fakeData),
    }));
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await waitFor(() => result.current.geoData !== null);
    });
    expect(result.current.geoData).toEqual(fakeData);
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBeNull();
  });

  it("returns geoData on backend fetch if static fails", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) }) // static fails
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeData) }) // backend succeeds
    );
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await waitFor(() => result.current.geoData !== null);
    });
    expect(result.current.geoData).toEqual(fakeData);
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBeNull();
  });

  it("returns geoError if both static and backend fail", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) }) // static fails
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) }) // backend fails
    );
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await waitFor(() => result.current.geoError !== null);
    });
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Failed to load map data from backend");
  });

  it("returns geoError if both static and backend URLs are missing", async () => {
    // Remove backend URL
    (import.meta.env as any).VITE_MAP_GEO_URL = undefined;
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) }) // static fails
    );
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await waitFor(() => result.current.geoError !== null);
    });
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toMatch(/Cannot read properties of undefined|Failed to load map data/);
  });

  it("returns geoError on fetch exception", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await waitFor(() => result.current.geoError !== null);
    });
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Network error");
  });

  it("returns geoError 'Failed to load map data' if fetch throws a non-Error value (covers catch fallback)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue("some string error"));
    const { result } = renderHook(() => useGeoData());
    await act(async () => {
      await waitFor(() => result.current.geoError !== null);
    });
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Failed to load map data");
  });
});
