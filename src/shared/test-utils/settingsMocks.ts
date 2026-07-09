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

vi.mock("@features/settings/localization/hooks/useLanguage", () => ({
  useLanguage: languageMockTracker,
  isRtl: (_lng?: string) => false,
}));

/**
 * Mocks the language direction for testing purposes.
 * @param isRtl - A boolean indicating whether the language direction should be right-to-left (true) or left-to-right (false).
 */
export const mockLanguageDirection = (isRtl: boolean) => {
  languageMockTracker.mockReturnValue({
    current: "en",
    name: "English",
    isRtl,
    change: vi.fn(),
    toggle: vi.fn(),
  });
};
