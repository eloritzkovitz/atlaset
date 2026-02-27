import { useEffect, useState } from "react";
import { GameOverCard } from "./GameOverCard";
import { useQuizSession } from "../hooks/useQuizSession";
import type {
  QuizType,
  Difficulty,
  SessionProps,
  QuizSessionEndType,
} from "../../types";

interface QuizSessionProps {
  maxQuestions: number;
  duration?: number;
  quizType: QuizType;
  difficulty: Difficulty;
  score: number;
  children: (session: SessionProps) => React.ReactNode;
}

export function QuizSession({
  maxQuestions,
  duration,
  quizType,
  difficulty,
  score,
  children,
}: QuizSessionProps) {
  const {
    timeLeft,
    endSession,
    incrementQuestions,
    setMaxStreak,
    questionNumber,
    sessionActive,
    maxStreak,
  } = useQuizSession({ maxQuestions, duration, quizType, difficulty, score });

  // Session end type state
  const [endType, setEndType] = useState<QuizSessionEndType>(null);

  // Determine end type when session ends
  useEffect(() => {
    if (!sessionActive) {
      if (questionNumber >= maxQuestions) {
        setEndType("complete");
      } else if (
        typeof duration === "number" &&
        timeLeft === 0 &&
        questionNumber < maxQuestions
      ) {
        setEndType("gameover");
      }
    } else {
      setEndType(null);
    }
  }, [sessionActive, questionNumber, maxQuestions, duration, timeLeft]);

  // Render game over card if session has ended
  function renderGameOverCard(type: "complete" | "gameover") {
    return (
      <GameOverCard
        type={type}
        score={score}
        timeUsed={
          typeof duration === "number" && typeof timeLeft === "number"
            ? duration - timeLeft
            : undefined
        }
        maxQuestions={maxQuestions}
        streak={maxStreak}
        onPlayAgain={() => {
          const typePath =
            quizType === "flag"
              ? "guess-the-flag"
              : quizType === "capital"
                ? "guess-the-capital"
                : quizType;
          window.location.assign(`/quizzes/${typePath}`);
        }}
      />
    );
  }

  // Render game over card if session has ended
  if (endType === "complete") return renderGameOverCard("complete");
  if (endType === "gameover") return renderGameOverCard("gameover");

  // Only render questions if not finished
  return (
    <>
      {children({
        timeLeft: typeof duration === "number" ? timeLeft : undefined,
        questionNumber,
        maxQuestions,
        sessionActive,
        handleSessionEnd: endSession,
        incrementQuestions,
        maxStreak,
        setMaxStreak,
      })}
    </>
  );
}
