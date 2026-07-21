import { vi } from "vitest";

/** Mock tracker for user activity logging. */
const { activityMockTracker } = vi.hoisted(() => ({
  activityMockTracker: vi.fn<(...args: any[]) => any>(async () => {
    return Promise.resolve();
  }),
}));

/** Mock behavior for user activity logging. */
export const mockActivityBehavior = (
  customImplementation: (
    code: number,
    payload: any,
    userId: string,
  ) => Promise<void>,
) => {
  activityMockTracker.mockImplementation(customImplementation);
};

export { activityMockTracker };

vi.mock("@features/activity/utils/activity", () => ({
  logUserActivity: activityMockTracker,
}));
