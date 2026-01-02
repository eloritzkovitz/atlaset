import { renderHook, act } from "@testing-library/react";
import { useCountryDataSource } from "./useCountryDataSource";

describe("useCountryDataSource", () => {
  const fakeCountries = [
    { isoCode: "US", name: "United States" },
    { isoCode: "CA", name: "Canada" },
  ];
  const fakeCurrencies = { USD: "US Dollar", CAD: "Canadian Dollar" };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns loading initially", () => {
    (fetch as any).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCountryDataSource());
    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.currencies).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it("returns data on successful fetch", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCurrencies) });
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.countries).toEqual(fakeCountries);
    expect(result.current.currencies).toEqual(fakeCurrencies);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch errors", async () => {
    (fetch as any).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.countries).toEqual([]);
    expect(result.current.currencies).toEqual({});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network error");
  });

  it("refreshes data when refreshData is called", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCurrencies) });
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.countries).toEqual(fakeCountries);
    expect(result.current.currencies).toEqual(fakeCurrencies);
    // Now refresh with new data
    const newCountries = [{ isoCode: "FR", name: "France" }];
    const newCurrencies = { EUR: "Euro" };
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(newCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(newCurrencies) });
    await act(async () => {
      result.current.refreshData();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.countries).toEqual(newCountries);
    expect(result.current.currencies).toEqual(newCurrencies);
  });

  it("derives allRegions, allSubregions, allSovereigntyTypes", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCurrencies) });
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(Array.isArray(result.current.allRegions)).toBe(true);
    expect(Array.isArray(result.current.allSubregions)).toBe(true);
    expect(Array.isArray(result.current.allSovereigntyTypes)).toBe(true);
  });
});
