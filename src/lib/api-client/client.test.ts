import { describe, it, expect, vi, afterEach } from "vitest";
import * as fetchModule from "./client";
import * as envModule from "./env";
const { fetchWithFallback } = fetchModule;

afterEach(() => vi.restoreAllMocks());

const mockFetchSeq = (...responses: Array<any | Promise<any>>) => {
  const fn = vi.fn();
  for (const r of responses) fn.mockResolvedValueOnce(r);
  vi.stubGlobal("fetch", fn as any);
  return fn;
};

describe("fetchWithFallback", () => {
  it("returns static JSON", async () => {
    mockFetchSeq({ ok: true, json: async () => ({ x: 1 }) });
    expect(await fetchWithFallback("/static.json", "http://b", "data")).toEqual(
      { x: 1 },
    );
  });

  it("falls back to backend", async () => {
    mockFetchSeq(
      { ok: false },
      { ok: true, json: async () => ({ from: "backend" }) },
    );
    expect(await fetchWithFallback("/static.json", "http://b", "data")).toEqual(
      { from: "backend" },
    );
  });

  it("throws when no backend and static fails", async () => {
    mockFetchSeq({ ok: false });
    await expect(
      fetchWithFallback("/static.json", undefined, "countries"),
    ).rejects.toThrow("Failed to load countries");
  });

  it("throws backend-specific when backend fails", async () => {
    mockFetchSeq({ ok: false }, { ok: false });
    await expect(
      fetchWithFallback("/static.json", "http://api", "countries"),
    ).rejects.toThrow("Failed to load countries from backend");
  });

  it("resolves backend from env descriptor", async () => {
    vi.spyOn(envModule, "resolveBackendUrl").mockReturnValue(
      "http://env-backend",
    );
    try {
      mockFetchSeq(
        { ok: false },
        { ok: true, json: async () => ({ from: "env" }) },
      );
      expect(
        await fetchWithFallback(
          "/static.json",
          { envVar: "VITE_TEST_URL" },
          "data",
        ),
      ).toEqual({ from: "env" });
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("defaultFetchOpts DEV/prod", () => {
    const orig = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    expect(fetchModule.defaultFetchOpts()).toEqual({ cache: "no-store" });
    process.env.NODE_ENV = "production";
    expect(fetchModule.defaultFetchOpts()).toBeUndefined();
    process.env.NODE_ENV = orig;
  });

  it("uses provided fetch options", async () => {
    const opts = { cache: "no-store" } as RequestInit;
    mockFetchSeq({ ok: false }, { ok: true, json: async () => ({ ok: true }) });
    expect(
      await fetchWithFallback("/static.json", "http://api", "data", opts),
    ).toEqual({ ok: true });
  });

  it("uses defaultFetchOpts when none provided", async () => {
    const orig = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    mockFetchSeq({ ok: true, json: async () => ({ ok: true }) });
    expect(await fetchWithFallback("/static.json", undefined, "data")).toEqual({
      ok: true,
    });
    process.env.NODE_ENV = orig;
  });

  it("static throws then backend recovers", async () => {
    const fn = vi.fn();
    fn.mockRejectedValueOnce(new Error("network down")).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ recovered: true }),
    });
    vi.stubGlobal("fetch", fn as any);
    expect(
      await fetchWithFallback("/static.json", "http://api", "data"),
    ).toEqual({ recovered: true });
  });

  it("static throws and no backend -> generic error", async () => {
    const fn = vi.fn();
    fn.mockRejectedValueOnce(new Error("boom"));
    vi.stubGlobal("fetch", fn as any);
    await expect(
      fetchWithFallback("/static.json", undefined, "countries"),
    ).rejects.toThrow("Failed to load countries");
  });
});
