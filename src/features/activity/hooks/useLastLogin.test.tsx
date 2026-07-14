import { render, screen, cleanup } from "@testing-library/react";
import { vi } from "vitest";
import { activityMockTracker } from "@test-utils/activityMocks";

const mockAuth: { user: any } = { user: null };

vi.mock("@contexts/AuthContext", () => ({
  useAuth: () => mockAuth,
}));
vi.mock("./useUserActivity", () => ({
  useUserActivity: () => ({
    activity: activityMockTracker(), 
  }),
}));

import { useLastLogin } from "./useLastLogin";

function Probe() {
  const { timestamp, method, activity } = useLastLogin();
  return (
    <>
      <div data-testid="ts">{String(timestamp)}</div>
      <div data-testid="m">{String(method)}</div>
      <div data-testid="has">{activity ? "yes" : "no"}</div>
    </>
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockAuth.user = null;
});

const cases: Array<[string, any, any[], string, string, string]> = [
  [
    "activity method present",
    {
      metadata: { lastSignInTime: "2024-01-01T00:00:00Z" },
      providerData: [{ providerId: "google.com" }],
    },
    [
      {
        action: 102,
        timestamp: "2024-02-02T00:00:00Z",
        details: { method: "email" },
      },
    ],
    "2024-02-02T00:00:00Z",
    "email",
    "yes",
  ],
  [
    "no details.method falls back to provider",
    {
      metadata: { lastSignInTime: "2024-01-01T00:00:00Z" },
      providerData: [{ providerId: "github.com" }],
    },
    [{ action: 102, timestamp: "2024-03-03T00:00:00Z", details: {} }],
    "2024-03-03T00:00:00Z",
    "github.com",
    "yes",
  ],
  [
    "no activity uses metadata",
    { metadata: { lastSignInTime: "2024-04-04T00:00:00Z" }, providerData: [] },
    [],
    "2024-04-04T00:00:00Z",
    "null",
    "no",
  ],
  ["no user no activity", null, [], "null", "null", "no"],
];

test.each(cases)("%s", (_name, user, activityArr, expTs, expMethod, expHas) => {
  mockAuth.user = user;
  (activityMockTracker as any).mockReturnValue(activityArr);

  render(<Probe />);

  expect(screen.getByTestId("ts").textContent).toBe(expTs);
  expect(screen.getByTestId("m").textContent).toBe(expMethod);
  expect(screen.getByTestId("has").textContent).toBe(expHas);
});
