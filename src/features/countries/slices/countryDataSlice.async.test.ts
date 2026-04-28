import { beforeAll } from "vitest";

beforeAll(() => {
  process.on("unhandledRejection", () => {});
});
import { vi } from "vitest";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import type { Middleware } from "@reduxjs/toolkit";
import { mockCountries } from "../../../shared/test-utils/mockCountries";

describe("countryDataSlice async thunk - integration (minimal)", () => {
  const middlewares: Middleware[] = [thunk as Middleware];
  const mockStore = configureStore(middlewares);

  afterEach(() => vi.restoreAllMocks());

  const runIsolated = async (
    envOverrides: Record<string, any> | undefined,
    setupFetch: (f: any) => void,
  ) => {
    vi.resetModules();
    if (envOverrides) {
      for (const k of Object.keys(envOverrides)) {
        (import.meta.env as any)[k] = envOverrides[k];
      }
    } else {
      (import.meta.env as any).VITE_COUNTRY_DATA_URL = "http://dummy";
      (import.meta.env as any).VITE_CURRENCY_DATA_URL = "http://dummy";
    }
    const { fetchCountryData } = await import("./countryDataSlice");
    const store = mockStore({ countryData: undefined });
    global.fetch = vi.fn();
    setupFetch(global.fetch as any);
    try {
      await (store.dispatch as any)(fetchCountryData());
    } catch (e) {
      // ignore; we assert actions
    }
    return store.getActions();
  };

  it("fulfilled - maps payload and dispatches fulfilled", async () => {
    const actions = await runIsolated(undefined, (f) =>
      f
        .mockResolvedValueOnce({ ok: true, json: async () => mockCountries })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ USD: "United States Dollar" }),
        }),
    );
    expect(actions[0].type).toBe("countryData/fetchCountryData/pending");
    expect(actions[1].type).toBe("countryData/fetchCountryData/fulfilled");
    expect(actions[1].payload.countries).toEqual(mockCountries);
  });

  it("rejected - static missing and no backend -> reports failure", async () => {
    const actions = await runIsolated(
      { VITE_COUNTRY_DATA_URL: undefined, VITE_CURRENCY_DATA_URL: undefined },
      (f) =>
        f
          .mockResolvedValueOnce({ ok: false })
          .mockResolvedValueOnce({ ok: true, json: async () => ({}) }),
    );
    expect(actions[0].type).toBe("countryData/fetchCountryData/pending");
    expect(actions[1].type).toBe("countryData/fetchCountryData/rejected");
    expect(actions[1].error.message).toMatch(/Failed to load country data/);
  });
});
