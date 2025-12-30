import { useEffect, useState } from "react";
import { GameOverCard } from "./GameOverCard";
import { useQuizAudio } from "../hooks/useQuizAudio";
import { useAtomicTimer } from "../hooks/useAtomicTimer";
import { useTickingSound } from "../hooks/useTickingSound";

interface QuizSessionProps {
  maxQuestions: number;
  duration?: number;
  children: (session: {
    timeLeft?: number;
    questionsAnswered: number;
    sessionActive: boolean;
    endSession: () => void;
    incrementQuestions: () => void;
  }) => React.ReactNode;
}

export function QuizSession({
  maxQuestions,
  duration,
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

  // Play win/lose sound on session end
  useEffect(() => {
    if (!session.sessionActive) {
      if (session.questionsAnswered >= maxQuestions) {
        playWin();
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
  ]);

  return session.sessionActive ? (
    <>
      {children({
        timeLeft: typeof duration === "number" ? timeLeft : undefined,
        questionsAnswered: session.questionsAnswered,
        sessionActive: session.sessionActive,
        endSession,
        incrementQuestions,
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
        startTimer();
      }}
    />
  );
}
