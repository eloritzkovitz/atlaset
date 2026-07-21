import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { sessionService } from "../services/sessionService";
import { clearLocalSession, isCurrentSession } from "../utils/session";
import type { UserSession } from "../../types";

interface UserSessionsProps {
  sessions: UserSession[];
  isLoading: boolean;
  terminateSession: (session: UserSession) => Promise<void>;
}

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

  // Update the lastActive timestamp for the current session on user activity
  useEffect(() => {
    if (!userId) return;

    // Keeps track of the last fire timestamp strictly in-memory
    let lastWriteTime = 0;
    const THROTTLE_DURATION = 5 * 60 * 1000;

    const triggerActivityUpdate = async () => {
      const now = Date.now();

      // Only execute the database transaction if the 5-minute window has passed
      if (now - lastWriteTime > THROTTLE_DURATION) {
        lastWriteTime = now;
        await sessionService.updateCurrentSession(userId);
      }
    };

    // Run once immediately when the hook mounts or the user signs in
    triggerActivityUpdate();

    // Listen to natural user interaction points across the window interface
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];

    activityEvents.forEach((event) => {
      window.addEventListener(event, triggerActivityUpdate);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, triggerActivityUpdate);
      });
    };
  }, [userId]);

  // Terminate a specific session by its document ID and optionally its internal session ID
  const terminateSession = useCallback(async (session: UserSession) => {
    try {
      const isCurrent = isCurrentSession(session.sessionId);

      if (isCurrent) {
        await authService.logout();
        clearLocalSession();
      } else {
        await sessionService.removeSessionById(session.id);
        setSessions((prev) => prev.filter((s) => s.id !== session.id));
      }
    } catch (error) {
      console.error("Failed to safely terminate session:", error);
    }
  }, []);

  return { sessions, isLoading, terminateSession };
}
