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
  } = useQuizSession({ maxQuestions, duration, quizType, difficulty });

  // Get score from props
  const { score } = arguments[0];

  if (questionNumber >= maxQuestions) {
    return (
      <GameOverCard
        type={"victory"}
        score={score}
        timeUsed={
          typeof duration === "number" && typeof timeLeft === "number"
            ? duration - timeLeft
            : undefined
        }
        streak={maxStreak}
        onPlayAgain={() => {
          // Reset session state and timer
          window.location.reload();
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
