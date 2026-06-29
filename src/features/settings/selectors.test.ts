import { describe, it, expect } from "vitest";
import { selectSettingsReady } from "./selectors";

describe("selectSettingsReady", () => {
  it("returns false if authentication subsystem is not ready yet", () => {
    const mockState = {
      auth: { ready: false, user: null },
      settings: { ready: true },
    } as any;

    expect(selectSettingsReady(mockState)).toBe(false);
  });

  it("returns true instantly if auth is ready but no user is logged in (guest defaults)", () => {
    const mockState = {
      auth: { ready: true, user: null },
      settings: { ready: false },
    } as any;

    expect(selectSettingsReady(mockState)).toBe(true);
  });

  it("delegates directly to the settings configuration slice state if a user is authenticated", () => {
    const loggedInState = (settingsReady: boolean) =>
      ({
        auth: { ready: true, user: { uid: "user_123" } },
        settings: { ready: settingsReady },
      }) as any;

    expect(selectSettingsReady(loggedInState(false))).toBe(false);
    expect(selectSettingsReady(loggedInState(true))).toBe(true);
  });
});
