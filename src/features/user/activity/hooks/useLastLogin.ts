import { useMemo } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useUserActivity, type UserActivity } from "@features/user";

// Action code for login activity
const ACTION_LOGIN = 102;

/**
 * Resolves the last login timestamp and method for the current user.
 * Returns { timestamp, method, activity } where activity is the raw activity entry (if any).
 */
export function useLastLogin() {
  const { user } = useAuth();
  const { activity } = useUserActivity();

  // Find the most recent login activity to extract last login details
  const last = useMemo(
    () => activity.find((a) => a.action === ACTION_LOGIN) ?? null,
    [activity],
  );

  // Resolve display values with sensible fallbacks: activity -> auth metadata -> null
  const timestamp = last?.timestamp ?? user?.metadata?.lastSignInTime ?? null;
  const method =
    (last &&
      last.details &&
      (last.details as Record<string, unknown>).method) ||
    user?.providerData?.[0]?.providerId ||
    null;

  return { timestamp, method, activity: last as UserActivity | null };
}
