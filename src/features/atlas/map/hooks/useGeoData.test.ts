import { renderHook, waitFor } from "@testing-library/react";
import * as fetchModule from "@lib/api-client";
import { useGeoData } from "./useGeoData";

describe("useGeoData (integration)", () => {
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading initially while fetchWithFallback is pending", () => {
    vi.spyOn(fetchModule, "fetchWithFallback").mockImplementation(
      () => new Promise(() => {}),
    );
    const { result } = renderHook(() => useGeoData());
    expect(result.current.loading).toBe(true);
    expect(result.current.geoData).toBeNull();
    expect(result.current.geoError).toBeNull();
  });

  it("sets geoData and clears loading on successful fetchWithFallback", async () => {
    vi.spyOn(fetchModule, "fetchWithFallback").mockResolvedValue(fakeData);
    const { result } = renderHook(() => useGeoData());
    await waitFor(() => expect(result.current.geoData).not.toBeNull());
    expect(result.current.geoData).toEqual(fakeData);
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBeNull();
  });

  it("sets geoError to error.message when fetchWithFallback throws an Error", async () => {
    vi.spyOn(fetchModule, "fetchWithFallback").mockRejectedValue(
      new Error("Network error"),
    );
    const { result } = renderHook(() => useGeoData());
    await waitFor(() => expect(result.current.geoError).not.toBeNull());
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Network error");
  });

  it("sets geoError to generic message when fetchWithFallback throws non-Error", async () => {
    vi.spyOn(fetchModule, "fetchWithFallback").mockRejectedValue(
      "some string error",
    );
    const { result } = renderHook(() => useGeoData());
    await waitFor(() => expect(result.current.geoError).not.toBeNull());
    expect(result.current.geoData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.geoError).toBe("Failed to load map data");
  });
});
