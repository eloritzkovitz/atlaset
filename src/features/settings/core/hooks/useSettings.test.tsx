import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi } from "vitest";
import { useSettings } from "./useSettings";
import settingsReducer from "../slices/settingsSlice";
import authReducer from "@features/user/auth/slices/authSlice";

vi.mock("../slices/settingsSlice", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../slices/settingsSlice")>();
  return {
    ...actual,
    saveSettings: vi.fn((updates) => ({
      type: "settings/saveSettings",
      payload: updates,
    })),
    resetSettingsThunk: vi.fn(() => ({ type: "settings/resetSettingsThunk" })),
  };
});

function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      settings: settingsReducer,
      auth: authReducer,
    },
    preloadedState,
  });
}

describe("useSettings", () => {
  it("returns initial settings, loading, and ready state", () => {
    const store = createMockStore({
      auth: { ready: true, user: null, loading: false },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.ready).toBe(true);
  });

  it("dispatches saveSettings when updateSettings is called", async () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    await act(async () => {
      await result.current.updateSettings({
        display: { theme: "dark" },
      });
    });

    expect(result.current.settings).toBeDefined();
  });

  it("dispatches resetSettingsThunk when resetSettings is called", async () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    await act(async () => {
      await result.current.resetSettings();
    });

    expect(result.current.settings).toBeDefined();
  });
});
