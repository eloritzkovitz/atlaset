import { useEffect, useState, useCallback } from "react";
import { GameOverCard } from "./GameOverCard";
import { useQuizAudio } from "../hooks/useQuizAudio";
import { useAtomicTimer } from "../hooks/useAtomicTimer";
import { useTickingSound } from "../hooks/useTickingSound";
import { leaderboardsService } from "../../leaderboards/services/leaderboardsService";
import { getCurrentUser } from "@utils/firebase";
import type { QuizType, Difficulty } from "../../types";

interface QuizSessionProps {
  maxQuestions: number;
  duration?: number;
  quizType: QuizType;
  difficulty: Difficulty;
  children: (session: {
    timeLeft?: number;
    questionsAnswered: number;
    sessionActive: boolean;
    endSession: () => void;
    incrementQuestions: () => void;
    score: number;
    setScore: (newScore: number) => void;
    maxStreak: number;
    setMaxStreak: (newMaxStreak: number) => void;    
  }) => React.ReactNode;
}

export function QuizSession({
  maxQuestions,
  duration,
  quizType,
  difficulty,
  children,
}: QuizSessionProps) {
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

  const endSession = () => setSession((s) => ({ ...s, sessionActive: false }));
  const incrementQuestions = () => {
    setSession((s) => {
      if (s.questionsAnswered >= maxQuestions) {
        // Already at max, ensure session is ended
        return {
          ...s,
          questionsAnswered: maxQuestions,
          sessionActive: false,
        };
      }
      const next = s.questionsAnswered + 1;
      if (next >= maxQuestions) {
        return {
          ...s,
          questionsAnswered: maxQuestions,
          sessionActive: false,
        };
      }
      return { ...s, questionsAnswered: next };
    });
  };

  // Provide a setter for score so children can update it
  const setScore = useCallback((newScore: number) => {
    setSession((s) => ({ ...s, score: newScore }));
  }, []);
  
  // Provide a setter for maxStreak so children can update it
  const setMaxStreak = useCallback((newMaxStreak: number) => {
    setSession((s) => ({ ...s, maxStreak: newMaxStreak }));
  }, []);  

  // Ticking sound hook
  useTickingSound(
    typeof timeLeft === "number" ? timeLeft : 0,
    session.sessionActive,
    playTick,
    stopTick,
    playTickX2
  );

  // Play win/lose sound on session end and save game on victory
  useEffect(() => {
    if (!session.sessionActive) {
      if (session.questionsAnswered >= maxQuestions) {
        playWin();
        // Save to leaderboard and player history
        const user = getCurrentUser();
        if (user) {
          const entry = {
            playerId: user.uid,
            playerName: user.displayName || "Anonymous",
            score: session.score,
            time:
              typeof duration === "number" && typeof timeLeft === "number"
                ? duration - timeLeft
                : undefined,
            maxStreak: session.maxStreak,
            date: new Date().toISOString(),
          };
          leaderboardsService.addLeaderboardEntry(quizType, difficulty, entry);
          leaderboardsService.savePlayerGame(user.uid, entry);
        }
      } else {
        playLose();
      }
    }
  }, [
    session.sessionActive,
    session.questionsAnswered,
    session.maxStreak,
    maxQuestions,
    playWin,
    playLose,
    duration,
    timeLeft,
    quizType,
    difficulty,
  ]);

  return session.sessionActive ? (
    <>
      {children({
        timeLeft: typeof duration === "number" ? timeLeft : undefined,
        questionsAnswered: session.questionsAnswered,
        sessionActive: session.sessionActive,
        endSession,
        incrementQuestions, 
        score: session.score,
        setScore,
        maxStreak: session.maxStreak,
        setMaxStreak,
      })}
    </>
  ) : (
    <GameOverCard
      type={session.questionsAnswered >= maxQuestions ? "victory" : "gameover"}
      score={session.score}
      timeUsed={
        typeof duration === "number" && typeof timeLeft === "number"
          ? duration - timeLeft
          : undefined
      }
      streak={session.maxStreak}
      onPlayAgain={() => {
        setSession({ questionsAnswered: 0, sessionActive: true, maxStreak: 0, score: 0 });
        startTimer();
      }}
    />
  );
}
