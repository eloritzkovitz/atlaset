import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  loadSettings,
  saveSettings,
  resetSettingsThunk,
  selectSettings,
  selectSettingsLoading,
} from "./settingsSlice";
import { settingsService } from "../services/settingsService";
import { defaultSettings } from "../constants/defaultSettings";
import type { RootState } from "@app/store";

vi.mock("../services/settingsService", () => ({
  settingsService: {
    load: vi.fn(),
    save: vi.fn(),
  },
}));

describe("settingsSlice", () => {
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () =>
    configureStore({
      reducer: { settings: settingsReducer },
    });

  beforeEach(() => {
    store = createTestStore();
  });

  describe("loadSettings lifecycle", () => {
    it("should handle successful loading state transitions", async () => {
      let resolveLoad: (value: any) => void = () => {};
      const promise = new Promise((resolve) => {
        resolveLoad = resolve;
      });
      vi.mocked(settingsService.load).mockReturnValue(promise as any);

      const dispatchPromise = store.dispatch(loadSettings());

      expect(store.getState().settings.loading).toBe(true);
      expect(store.getState().settings.ready).toBe(false);

      const mockPayload = { ...defaultSettings, display: { theme: "light" } };
      resolveLoad(mockPayload);
      await dispatchPromise;

      expect(store.getState().settings.loading).toBe(false);
      expect(store.getState().settings.ready).toBe(true);
      expect(store.getState().settings.settings).toEqual(mockPayload);
    });

    it("should handle rejected loading states gracefully", async () => {
      vi.mocked(settingsService.load).mockRejectedValue(
        new Error("Network Error"),
      );

      await store.dispatch(loadSettings());

      expect(store.getState().settings.loading).toBe(false);
      expect(store.getState().settings.ready).toBe(false);
    });
  });

  describe("saveSettings thunk", () => {
    it("should bypass saving if updates do not alter the current values", async () => {
      vi.mocked(settingsService.save).mockResolvedValue(undefined);

      await store.dispatch(saveSettings({}));

      expect(settingsService.save).not.toHaveBeenCalled();
    });

    it("should execute saving and update state when changes are detected", async () => {
      vi.mocked(settingsService.save).mockResolvedValue(undefined);

      const updates = { display: { theme: "dark" } };
      await store.dispatch(saveSettings(updates as any));

      expect(settingsService.save).toHaveBeenCalledWith({
        ...defaultSettings,
        ...updates,
        id: "main",
      });

      expect(store.getState().settings.settings.display.theme).toBe("dark");
    });

    it("should fall back to saving if JSON serialization crashes", async () => {
      vi.mocked(settingsService.save).mockResolvedValue(undefined);

      const breakingUpdates = {
        display: { theme: "dark" },
      } as any;

      breakingUpdates.unserializableValue = 42n;

      await store.dispatch(saveSettings(breakingUpdates));

      expect(settingsService.save).toHaveBeenCalled();
    });
  });

  describe("resetSettings thunk", () => {
    it("should overwrite current settings with defaults upon reset", async () => {
      vi.mocked(settingsService.save).mockResolvedValue(undefined);

      await store.dispatch(saveSettings({ display: { theme: "dark" } }));
      expect(store.getState().settings.settings.display.theme).toBe("dark");

      await store.dispatch(resetSettingsThunk());

      expect(settingsService.save).toHaveBeenCalledWith(defaultSettings);
      expect(store.getState().settings.settings).toEqual(defaultSettings);
    });
  });

  describe("selectors", () => {
    const mockRootState = {
      settings: {
        settings: { ...defaultSettings, display: { theme: "system" } },
        loading: true,
        ready: true,
      },
    } as unknown as RootState;

    it("should extract settings via selectSettings", () => {
      expect(selectSettings(mockRootState)).toEqual(
        mockRootState.settings.settings,
      );
    });

    it("should extract loading state via selectSettingsLoading", () => {
      expect(selectSettingsLoading(mockRootState)).toBe(true);
    });
  });
});
