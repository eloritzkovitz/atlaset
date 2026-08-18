import { useMemo } from "react";
import { ACTIONS } from "@constants/actions";
import { useAuth } from "@features/user/auth";
import { useUserActivity } from "../hooks/useUserActivity";
import type { UserActivity } from "../types";

/**
 * Resolves the last login timestamp and method for the current user.
 */
export function useLastLogin() {
  const { user } = useAuth();
  const { activity } = useUserActivity();

  // Find the most recent login activity to extract last login details
  const last = useMemo(
    () => activity.find((a) => a.action === ACTIONS.SIGNED_IN) ?? null,
    [activity],
  );

  // Resolve display values with sensible fallbacks
  const timestamp = last?.timestamp ?? user?.lastSignInTime ?? null;

  const method =
    (last &&
      last.details &&
      (last.details as Record<string, unknown>).method) ||
    user?.providerId ||
    null;

  return { timestamp, method, activity: last as UserActivity | null };
}
