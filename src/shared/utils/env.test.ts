import { describe, it, expect } from "vitest";
import { isWindowDefined } from "./env";

describe("isWindowDefined", () => {
  it("isWindowDefined returns a boolean", () => {
    expect(typeof isWindowDefined()).toBe("boolean");
  });
});
