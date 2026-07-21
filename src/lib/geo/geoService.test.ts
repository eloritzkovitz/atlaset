import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { geoService } from "./geoService";

describe("geoService", () => {
  let fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully fetch and map geolocation data", async () => {
    const mockApiResponse = {
      success: true,
      ip: "8.8.8.8",
      country: "United States",
      country_code: "US",
      city: "Mountain View",
    };

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await geoService.getGeoData("8.8.8.8");

    expect(fetchSpy).toHaveBeenCalledWith("https://ipwho.is/8.8.8.8");
    expect(result).toEqual({
      ipAddress: "8.8.8.8",
      countryCode: "US",
      location: "Mountain View, United States",
    });
  });

  it("should return null if the API returns success: false", async () => {
    const mockFailResponse = {
      success: false,
      message: "private range",
    };

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFailResponse,
    } as Response);

    const result = await geoService.getGeoData("127.0.0.1");

    expect(result).toBeNull();
  });

  it("should handle network exceptions gracefully and return null", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("Network connection lost"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await geoService.getGeoData();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
