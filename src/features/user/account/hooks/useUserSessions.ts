import { useCallback, useEffect, useRef, useState } from "react";
import { useEventListener } from "@hooks";
import { sessionService } from "../services/sessionService";
import type { UserSession } from "../types";
import { isCurrentSession } from "../utils/session";
import { authService } from "../../auth/services/authService";

interface UserSessionsProps {
  sessions: UserSession[];
  isLoading: boolean;
  terminateSession: (session: UserSession) => Promise<void>;
}

const THROTTLE_DURATION = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"];

/**
 * Manages the state of user sessions for a given user ID.
 * @param userId - The ID of the user whose sessions are to be tracked.
 * @returns An array of Session objects representing the user's sessions.
 */
export function useUserSessions(userId?: string): UserSessionsProps {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user sessions when the userId changes
  useEffect(() => {
    if (!userId) {
      setSessions([]);
      return;
    }

    let isMounted = true;
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const data = await sessionService.fetchUserSessions(userId);
        if (isMounted) setSessions(data);
      } catch (error) {
        console.error("Failed to load user sessions:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSessions();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Throttle session activity updates to avoid excessive writes
  const lastWriteTime = useRef(0);

  // Handle user activity events to update the last active timestamp
  const handleActivity = useCallback(() => {
    if (!userId) return;

    const now = Date.now();
    if (now - lastWriteTime.current > THROTTLE_DURATION) {
      lastWriteTime.current = now;
      sessionService.updateCurrentSession(userId).catch((err) => {
        console.error("Failed to update session activity:", err);
      });
    }
  }, [userId]);

  // Update session activity on mount and when userId changes
  useEffect(() => {
    if (userId) {
      handleActivity();
    }
  }, [userId, handleActivity]);

  // Attach event listeners for user activity events
  useEventListener(ACTIVITY_EVENTS, handleActivity, window, { passive: true });

  // Terminate a session, either by logging out the current session or removing another session
  const terminateSession = useCallback(
    async (session: UserSession) => {
      if (!userId) return;

      try {
        const isCurrent = isCurrentSession(session.sessionId);

        if (isCurrent) {
          await authService.logout();
        } else {
          await sessionService.terminateSession(userId, session.id);

          setSessions((prev) => prev.filter((s) => s.id !== session.id));
        }
      } catch (error) {
        console.error("Failed to safely terminate session:", error);
      }
    },
    [userId],
  );

  return { sessions, isLoading, terminateSession };
}
