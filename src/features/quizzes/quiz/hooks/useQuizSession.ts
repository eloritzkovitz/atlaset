import { useEffect, useState } from "react";
import { useQuizAudio } from "../hooks/useQuizAudio";
import { useAtomicTimer } from "../hooks/useAtomicTimer";
import { useTickingSound } from "../hooks/useTickingSound";
import { leaderboardsService } from "../../leaderboards/services/leaderboardsService";
import { getCurrentUser } from "@utils/firebase";
import type { QuizType, Difficulty, SessionProps } from "../../types";

/**
 * Manages the state and logic of a quiz session.
 * @param maxQuestions Maximum number of questions in the session
 * @param duration Optional duration of the session in seconds
 * @param quizType Type of the quiz
 * @param difficulty Difficulty level of the quiz
 * @returns Session state and control functions
 */
export function useQuizSession({
  maxQuestions,
  duration,
  quizType,
  difficulty,
  score,
}: {
  maxQuestions: number;
  duration?: number;
  quizType: QuizType;
  difficulty: Difficulty;
  score: number;
}): Omit<SessionProps, "handleSessionEnd"> & {
  timeLeft: number | undefined;
  endSession: () => void;
} {
  const [session, setSession] = useState<
    Pick<SessionProps, "questionNumber" | "sessionActive" | "maxStreak">
  >({
    questionNumber: 0,
    sessionActive: true,
    maxStreak: 0,
  });
  const { playTick, playTickX2, stopTick } = useQuizAudio();
  const { timeLeft } = useAtomicTimer(
    typeof duration === "number" ? duration : 0,
    session.sessionActive
  );

  // End session when timer runs out
  useEffect(() => {
    if (
      typeof duration === "number" &&
      timeLeft === 0 &&
      session.sessionActive
    ) {
      setSession((s) => (s.sessionActive ? { ...s, sessionActive: false } : s));
    }
  }, [duration, timeLeft, session.sessionActive]);

  // End session
  const endSession = () => setSession((s) => ({ ...s, sessionActive: false }));

  // Update max streak
  const setMaxStreak: SessionProps["setMaxStreak"] = (newMaxStreak) => {
    setSession((s) => ({ ...s, maxStreak: newMaxStreak }));
  };

  // Increment questions answered
  const incrementQuestions: SessionProps["incrementQuestions"] = () => {
    setSession((s) => {
      if (!s.sessionActive || s.questionNumber >= maxQuestions) {
        return s;
      }
      const next = s.questionNumber + 1;
      return {
        ...s,
        questionNumber: next,
        sessionActive: next < maxQuestions ? true : false,
      };
    });
  };

  // Ticking sound hook
  useTickingSound(
    typeof timeLeft === "number" ? timeLeft : 0,
    session.sessionActive,
    playTick,
    stopTick,
    playTickX2
  );

  // Save to leaderboard on session end
  useEffect(() => {
    // Only run when session just ended
    if (!session.sessionActive && session.questionNumber >= maxQuestions) {
      const { maxStreak } = session;
      const user = getCurrentUser && getCurrentUser();
      if (user) {
        const entry = {
          playerId: user.uid,
          playerName: user.displayName || "Anonymous",
          score,
          time:
            typeof duration === "number" && typeof timeLeft === "number"
              ? duration - timeLeft
              : undefined,
          maxStreak,
          date: new Date().toISOString(),
        };
        if (leaderboardsService) {
          leaderboardsService.addLeaderboardEntry(quizType, difficulty, entry);
          leaderboardsService.savePlayerGame(user.uid, entry);
        }
      }
    }
  }, [
    session,
    maxQuestions,
    duration,
    timeLeft,
    quizType,
    difficulty,
    score,
  ]);

  return {
    sessionActive: session.sessionActive,
    questionNumber: session.questionNumber,
    maxQuestions,
    incrementQuestions,
    maxStreak: session.maxStreak,
    setMaxStreak,
    timeLeft,
    endSession,
  };
}
