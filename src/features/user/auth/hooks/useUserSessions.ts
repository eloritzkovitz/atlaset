import { useEffect, useState } from "react";
import { sessionService } from "../services/sessionService";
import type { UserSession } from "../../types";
import { clearLocalSession, isCurrentSession } from "../utils/session";

interface UseUserSessionsProps {
  sessions: UserSession[];
  isLoading: boolean;
  terminateSession: (id: string, internalSessionId?: string) => Promise<void>;
}

/**
 * Manages the state of user sessions for a given user ID.
 * @param userId - The ID of the user whose sessions are to be tracked.
 * @returns An array of Session objects representing the user's sessions.
 */
export function useUserSessions(userId?: string): UseUserSessionsProps {
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

  // Terminate a specific session by its document ID and optionally its internal session ID
  const terminateSession = async (id: string, internalSessionId?: string) => {
    try {
      // Remove it from Firestore via its document ID
      await sessionService.removeSessionById(id);

      // If it was the current browser session, clean up local storage matching your service logic
      if (internalSessionId && isCurrentSession(internalSessionId)) {
        clearLocalSession();
      }

      // Filter out the terminated session from the UI array state immediately
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to terminate session:", error);
    }
  };

  return { sessions, isLoading, terminateSession };
}
