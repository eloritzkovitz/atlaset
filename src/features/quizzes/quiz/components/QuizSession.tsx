import { GameOverCard } from "./GameOverCard";
import { useQuizSession } from "../hooks/useQuizSession";
import type { QuizType, Difficulty, SessionProps } from "../../types";

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

  if (questionNumber >= maxQuestions) {
    return (
      <GameOverCard
        type={"complete"}
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
