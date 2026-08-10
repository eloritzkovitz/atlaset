import { isUserDeactivated } from "./account";

describe("isUserDeactivated", () => {
  it("returns true if the status flag is exactly 'deactivated'", () => {
    expect(isUserDeactivated("deactivated")).toBe(true);
  });

  it("returns false if the status flag is 'active'", () => {
    expect(isUserDeactivated("active")).toBe(false);
  });

  it("handles an empty string safely", () => {
    expect(isUserDeactivated("")).toBe(false);
  });

  it("handles null or undefined status flags safely", () => {
    expect(isUserDeactivated(null)).toBe(false);
    expect(isUserDeactivated(undefined)).toBe(false);
  });
});
