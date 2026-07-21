import { describe, it, expect } from "vitest";
import { vi } from "vitest";
import { resolveBackendUrl } from "./env";
import * as envModule from "./env";

describe("resolveBackendUrl", () => {
  it("returns the string when passed a URL string", () => {
    expect(resolveBackendUrl("http://api.example" as any)).toEqual(
      "http://api.example",
    );
  });

  it("resolves from process.env when descriptor provided", () => {
    const spy = vi
      .spyOn(envModule, "getImportMetaEnv")
      .mockReturnValue(undefined);
    const orig = process.env.VITE_TEST_URL;
    try {
      process.env.VITE_TEST_URL = "http://env-backend";
      expect(resolveBackendUrl({ envVar: "VITE_TEST_URL" })).toEqual(
        "http://env-backend",
      );
    } finally {
      if (orig === undefined) delete process.env.VITE_TEST_URL;
      else process.env.VITE_TEST_URL = orig;
      spy.mockRestore();
    }
  });

  it("returns undefined for missing env var", () => {
    const spy = vi
      .spyOn(envModule, "getImportMetaEnv")
      .mockReturnValue(undefined);
    const orig = process.env.MISSING_VAR_FOR_TEST;
    try {
      delete process.env.MISSING_VAR_FOR_TEST;
      expect(resolveBackendUrl({ envVar: "MISSING_VAR_FOR_TEST" })).toBe(
        undefined,
      );
    } finally {
      if (orig === undefined) delete process.env.MISSING_VAR_FOR_TEST;
      else process.env.MISSING_VAR_FOR_TEST = orig;
      spy.mockRestore();
    }
  });

  it("returns undefined for unsupported descriptor shapes", () => {
    expect(resolveBackendUrl({ notEnvVar: true } as any)).toBe(undefined);
  });

  it("returns undefined when process is undefined (browser-like)", () => {
    const spy = vi
      .spyOn(envModule, "getImportMetaEnv")
      .mockReturnValue(undefined);
    const origProc = (global as any).process;
    try {
      (global as any).process = undefined;
      expect(resolveBackendUrl({ envVar: "ANY" })).toBe(undefined);
    } finally {
      (global as any).process = origProc;
      spy.mockRestore();
    }
  });
});
