import { renderHook, act } from "@testing-library/react";
import { useCountryDataSource } from "./useCountryDataSource";
import * as dbModule from "@utils/db";

const fakeCountries = [
  { isoCode: "US", name: "United States" },
  { isoCode: "CA", name: "Canada" },
];
const fakeCurrencies = { USD: "US Dollar", CAD: "Canadian Dollar" };
const now = Date.now();

describe("useCountryDataSource", () => {
  let getCountrySpy: any;
  let getCurrencySpy: any;
  let putCountrySpy: any;
  let putCurrencySpy: any;
  let origEnv: string | undefined;

  beforeEach(() => {
    origEnv = process.env.NODE_ENV;
    vi.stubGlobal("fetch", vi.fn());
    getCountrySpy = vi.spyOn(dbModule.appDb.countryData, "get");
    getCurrencySpy = vi.spyOn(dbModule.appDb.currencyData, "get");
    putCountrySpy = vi.spyOn(dbModule.appDb.countryData, "put");
    putCurrencySpy = vi.spyOn(dbModule.appDb.currencyData, "put");
  });

  afterEach(() => {
    process.env.NODE_ENV = origEnv;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns loading initially", () => {
    (fetch as any).mockReturnValue(new Promise(() => {}));
    getCountrySpy.mockResolvedValue(undefined);
    getCurrencySpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCountryDataSource());
    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.currencies).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it("returns data from cache in production", async () => {
    process.env.NODE_ENV = "production";
    getCountrySpy.mockResolvedValue({ data: fakeCountries, ts: now });
    getCurrencySpy.mockResolvedValue({ data: fakeCurrencies, ts: now });
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); });
    expect(result.current.countries).toEqual(fakeCountries);
    expect(result.current.currencies).toEqual(fakeCurrencies);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches and caches data if cache is missing or expired in production", async () => {
    process.env.NODE_ENV = "production";
    getCountrySpy.mockResolvedValue(undefined);
    getCurrencySpy.mockResolvedValue(undefined);
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCurrencies) });
    putCountrySpy.mockResolvedValue(undefined);
    putCurrencySpy.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.countries).toEqual(fakeCountries);
    expect(result.current.currencies).toEqual(fakeCurrencies);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(putCountrySpy).toHaveBeenCalled();
    expect(putCurrencySpy).toHaveBeenCalled();
  });

  it("always fetches fresh data in development", async () => {
    process.env.NODE_ENV = "development";
    getCountrySpy.mockResolvedValue({ data: fakeCountries, ts: now });
    getCurrencySpy.mockResolvedValue({ data: fakeCurrencies, ts: now });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCurrencies) });
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.countries).toEqual(fakeCountries);
    expect(result.current.currencies).toEqual(fakeCurrencies);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(putCountrySpy).not.toHaveBeenCalled();
    expect(putCurrencySpy).not.toHaveBeenCalled();
  });

  it("handles fetch errors", async () => {
    process.env.NODE_ENV = "development";
    (fetch as any).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.countries).toEqual([]);
    expect(result.current.currencies).toEqual({});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network error");
  });
  
  it("refreshes data when refreshData is called", async () => {
    process.env.NODE_ENV = "development";
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
    process.env.NODE_ENV = "development";
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCountries) });
    (fetch as any).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(fakeCurrencies) });
    const { result } = renderHook(() => useCountryDataSource());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(Array.isArray(result.current.allRegions)).toBe(true);
    expect(Array.isArray(result.current.allSubregions)).toBe(true);
    expect(Array.isArray(result.current.allSovereigntyTypes)).toBe(true);
  });
});
