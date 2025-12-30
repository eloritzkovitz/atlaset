import { useEffect, useState } from "react";
import { GameOverCard } from "./GameOverCard";
import { useQuizAudio } from "../hooks/useQuizAudio";

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
  const [timeLeft, setTimeLeft] = useState(duration);

  // Audio hooks for end session sounds
  const { playWin, playLose } = useQuizAudio();

  // Timer effect (if duration is provided)
  useEffect(() => {
    if (typeof duration !== "number") return;
    setTimeLeft(duration);
  }, [duration]);

  // Timer countdown effect
  useEffect(() => {
    if (typeof duration !== "number" || !session.sessionActive) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === undefined) return t;
        if (t <= 1) {
          clearInterval(interval);
          setSession((s) => ({ ...s, sessionActive: false }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [duration, session.sessionActive]);

  const endSession = () => setSession((s) => ({ ...s, sessionActive: false }));
  const incrementQuestions = () => {
    setSession((s) => {
      if (s.questionsAnswered >= maxQuestions) {
        // Already at max, ensure session is ended
        const newState = {
          questionsAnswered: maxQuestions,
          sessionActive: false,
        };
        console.log(
          "[QuizSession] incrementQuestions: already at max, forcing end",
          newState
        );
        return newState;
      }
      const next = s.questionsAnswered + 1;
      if (next >= maxQuestions) {
        const newState = {
          questionsAnswered: maxQuestions,
          sessionActive: false,
        };
        console.log(
          "[QuizSession] incrementQuestions: session ending",
          newState
        );
        return newState;
      }
      const newState = { ...s, questionsAnswered: next };
      console.log("[QuizSession] incrementQuestions: incremented", newState);
      return newState;
    });
  };

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
        if (typeof duration === "number") setTimeLeft(duration);
      }}
    />
  );
}
