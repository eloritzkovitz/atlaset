import { useEffect, useState } from "react";
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
    maxStreak: number;
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
      setSession((s) => ({ ...s, sessionActive: false }));
    }
  }, [duration, timeLeft, session.sessionActive]);

  const endSession = () => setSession((s) => ({ ...s, sessionActive: false }));
  const incrementQuestions = () => {
    setSession((s) => {
      if (s.questionsAnswered >= maxQuestions) {
        // Already at max, ensure session is ended
        return {
          questionsAnswered: maxQuestions,
          sessionActive: false,
        };
      }
      const next = s.questionsAnswered + 1;
      if (next >= maxQuestions) {
        return {
          questionsAnswered: maxQuestions,
          sessionActive: false,
        };
      }
      return { ...s, questionsAnswered: next };
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

  // Store the last maxStreak value received from children
  const [lastMaxStreak, setLastMaxStreak] = useState(0);

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
            score: session.questionsAnswered,
            time:
              typeof duration === "number" && typeof timeLeft === "number"
                ? duration - timeLeft
                : undefined,
            maxStreak: lastMaxStreak,
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
    maxQuestions,
    playWin,
    playLose,
    duration,
    timeLeft,
    quizType,
    difficulty,
    lastMaxStreak,
  ]);

  return session.sessionActive ? (
    <>
      {((sessionProps) => {
        if (
          typeof sessionProps.maxStreak === "number" &&
          sessionProps.maxStreak > lastMaxStreak
        ) {
          setLastMaxStreak(sessionProps.maxStreak);
        }
        return children(sessionProps);
      })({
        timeLeft: typeof duration === "number" ? timeLeft : undefined,
        questionsAnswered: session.questionsAnswered,
        sessionActive: session.sessionActive,
        endSession,
        incrementQuestions,
        maxStreak: lastMaxStreak,
      })}
    </>
  ) : (
    <GameOverCard
      type={session.questionsAnswered >= maxQuestions ? "victory" : "gameover"}
      score={session.questionsAnswered}
      timeUsed={
        typeof duration === "number" && typeof timeLeft === "number"
          ? duration - timeLeft
          : undefined
      }
      onPlayAgain={() => {
        setSession({ questionsAnswered: 0, sessionActive: true });
        setLastMaxStreak(0);
        startTimer();
      }}
    />
  );
}
