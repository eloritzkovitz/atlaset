import { vi } from "vitest";

const { languageMockTracker } = vi.hoisted(() => ({
  languageMockTracker: vi.fn(() => ({
    current: "en",
    name: "English",
    isRtl: false,
    change: vi.fn(),
    toggle: vi.fn(),
  })),
}));

/** Mocks the language direction for testing purposes. */
export const mockLanguageDirection = (isRtl: boolean) => {
  languageMockTracker.mockReturnValue({
    current: "en",
    name: "English",
    isRtl,
    change: vi.fn(),
    toggle: vi.fn(),
  });
};

const { accessibilityMockTracker } = vi.hoisted(() => ({
  accessibilityMockTracker: vi.fn(() => ({
    singleKeyShortcutsEnabled: true,
    setSingleKeyShortcutsEnabled: vi.fn(),
    toggleSingleKeyShortcuts: vi.fn(),
    animationsEnabled: true,
    setAnimationsEnabled: vi.fn(),
    toggleAnimations: vi.fn(),
  })),
}));

/** Dynamically updates the global animationsEnabled setting for testing hooks. */
export const mockAnimationsEnabled = (enabled: boolean) => {
  accessibilityMockTracker.mockReturnValue({
    singleKeyShortcutsEnabled: true,
    setSingleKeyShortcutsEnabled: vi.fn(),
    toggleSingleKeyShortcuts: vi.fn(),
    animationsEnabled: enabled,
    setAnimationsEnabled: vi.fn(),
    toggleAnimations: vi.fn(),
  });
};

vi.mock("@features/settings", () => ({
  useAccessibility: accessibilityMockTracker,
  useLanguage: languageMockTracker,
  isRtl: () => languageMockTracker().isRtl,
}));

vi.mock("@features/settings/localization/hooks/useLanguage", () => ({
  useLanguage: languageMockTracker,
  isRtl: () => languageMockTracker().isRtl,
}));
