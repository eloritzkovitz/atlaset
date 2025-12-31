import { useEffect, useState, useRef } from "react";
import { useQuizAudio } from "../hooks/useQuizAudio";
import { useAtomicTimer } from "../hooks/useAtomicTimer";
import { useTickingSound } from "../hooks/useTickingSound";
import { leaderboardsService } from "../../leaderboards/services/leaderboardsService";
import { getCurrentUser } from "@utils/firebase";
import type { QuizType, Difficulty } from "../../types";

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
}: {
  maxQuestions: number;
  duration?: number;
  quizType: QuizType;
  difficulty: Difficulty;
}) {
  const [session, setSession] = useState({
    questionsAnswered: 0,
    sessionActive: true,
    maxStreak: 0,
    score: 0,
  });
  const { playWin, playLose, playTick, playTickX2, stopTick } = useQuizAudio();
  const { timeLeft, startTimer } = useAtomicTimer(
    typeof duration === "number" ? duration : 0,
    session.sessionActive
  );

  // Track latest session values for use in effects
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

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

  // Update score
  const setScore = (newScore: number) => {
    setSession((s) => ({ ...s, score: newScore }));
  };

  // Update max streak
  const setMaxStreak = (newMaxStreak: number) => {
    setSession((s) => ({ ...s, maxStreak: newMaxStreak }));
  };

  // Increment questions answered
  const incrementQuestions = () => {
    setSession((s) => {
      // Only end session after the last answer is submitted
      const next = s.questionsAnswered + 1;
      return {
        ...s,
        questionsAnswered: next,
        sessionActive: next < maxQuestions + 1,
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

  // Play win/lose sound and save to leaderboard on session end
  useEffect(() => {
    // Only run when session just ended
    if (!session.sessionActive && session.questionsAnswered >= maxQuestions) {
      // Play win sound
      if (playWin) playWin();
      // Save to leaderboard
      const { score, maxStreak } = sessionRef.current;
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
    } else if (
      !session.sessionActive &&
      session.questionsAnswered < maxQuestions
    ) {
      // Play lose sound
      if (playLose) playLose();
    }
  }, [
    session.sessionActive,
    session.questionsAnswered,
    maxQuestions,
    duration,
    timeLeft,
    quizType,
    difficulty,
    playWin,
    playLose,
  ]);

  return {
    session,
    sessionRef,
    timeLeft,
    startTimer,
    endSession,
    setScore,
    setMaxStreak,
    incrementQuestions,
  };
}
