import { renderHook } from "@testing-library/react";
import { vi, describe, test, expect, afterEach } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";
import { useLastLogin } from "./useLastLogin";

const mockAuth: { user: any } = { user: null };

vi.mock("@features/user/auth", () => ({
  useAuth: () => mockAuth,
}));

vi.mock("./useUserActivity", () => ({
  useUserActivity: () => ({
    activity: activityMockTracker(),
  }),
}));

afterEach(() => {
  mockAuth.user = null;
});

const cases: Array<
  [string, any, any[], string | null, string | null, boolean]
> = [
  [
    "activity method present",
    {
      lastSignInTime: "2024-01-01T00:00:00Z",
      providerId: "google.com",
    },
    [
      {
        action: 110,
        timestamp: "2024-02-02T00:00:00Z",
        details: { method: "email" },
      },
    ],
    "2024-02-02T00:00:00Z",
    "email",
    true,
  ],
  [
    "no details.method falls back to provider",
    {
      lastSignInTime: "2024-01-01T00:00:00Z",
      providerId: "github.com",
    },
    [{ action: 110, timestamp: "2024-03-03T00:00:00Z", details: {} }],
    "2024-03-03T00:00:00Z",
    "github.com",
    true,
  ],
  [
    "no activity uses metadata",
    {
      lastSignInTime: "2024-04-04T00:00:00Z",
      providerId: null,
    },
    [],
    "2024-04-04T00:00:00Z",
    null,
    false,
  ],
  ["no user no activity", null, [], null, null, false],
];

describe("useLastLogin", () => {
  test.each(cases)(
    "%s",
    (_name, user, activityArr, expTs, expMethod, expHas) => {
      mockAuth.user = user;
      (activityMockTracker as any).mockReturnValue(activityArr);

      const { result } = renderHook(() => useLastLogin());

      expect(result.current.timestamp).toBe(expTs);
      expect(result.current.method).toBe(expMethod);
      expect(Boolean(result.current.activity)).toBe(expHas);
    },
  );
});
