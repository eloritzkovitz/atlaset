import { describe, it, expect } from "vitest";
import { isUsernameFormatValid } from "./username";

describe("isUsernameFormatValid", () => {
  it("accepts valid usernames", () => {
    expect(isUsernameFormatValid("valid_user")).toBe(true);
    expect(isUsernameFormatValid("user-123")).toBe(true);
    expect(isUsernameFormatValid("abc")).toBe(true);
    expect(isUsernameFormatValid("a".repeat(20))).toBe(true);
    expect(isUsernameFormatValid("ClassOf2026")).toBe(true);
  });

  it("rejects usernames that do not match length constraints", () => {
    expect(isUsernameFormatValid("ab")).toBe(false);
    expect(isUsernameFormatValid("a".repeat(21))).toBe(false);
  });

  it("rejects invalid characters and illegal special char placements", () => {
    expect(isUsernameFormatValid("user@123")).toBe(false);
    expect(isUsernameFormatValid("-username")).toBe(false);
    expect(isUsernameFormatValid("_username")).toBe(false);
    expect(isUsernameFormatValid("username-")).toBe(false);
    expect(isUsernameFormatValid("username_")).toBe(false);
  });

  it("rejects consecutive special characters", () => {
    expect(isUsernameFormatValid("user--name")).toBe(false);
    expect(isUsernameFormatValid("user__name")).toBe(false);
    expect(isUsernameFormatValid("user_-name")).toBe(false);
  });

  it("rejects reserved/forbidden usernames case-insensitively", () => {
    expect(isUsernameFormatValid("admin")).toBe(false);
    expect(isUsernameFormatValid("ADMIN")).toBe(false);
  });

  it("rejects direct profane words and profanity with numbers or special characters", () => {
    expect(isUsernameFormatValid("shit")).toBe(false);

    expect(isUsernameFormatValid("shit123")).toBe(false);
    expect(isUsernameFormatValid("shit_420")).toBe(false);
    expect(isUsernameFormatValid("user-shit-99")).toBe(false);
  });
});
