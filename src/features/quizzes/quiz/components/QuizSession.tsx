import { GameOverCard } from "./GameOverCard";
import { useQuizSession } from "../hooks/useQuizSession";
import type { QuizType, Difficulty, SessionProps } from "../../types";

interface QuizSessionProps {
  maxQuestions: number;
  duration?: number;
  quizType: QuizType;
  difficulty: Difficulty;
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
    session,
    sessionRef,
    timeLeft,
    endSession,
    setScore,
    setMaxStreak,
    incrementQuestions,
  } = useQuizSession({ maxQuestions, duration, quizType, difficulty });

  return session.questionsAnswered <= maxQuestions ? (
    <>
      {children({
        timeLeft: typeof duration === "number" ? timeLeft : undefined,
        questionsAnswered: session.questionsAnswered,
        maxQuestions,
        sessionActive: session.sessionActive,
        handleSessionEnd: endSession,
        incrementQuestions,
        score: sessionRef.current.score,
        setScore,
        maxStreak: sessionRef.current.maxStreak,
        setMaxStreak,
      })}
    </>
  ) : (
    <GameOverCard
      type={
        session.questionsAnswered > maxQuestions - 1 ? "victory" : "gameover"
      }
      score={sessionRef.current.score}
      timeUsed={
        typeof duration === "number" && typeof timeLeft === "number"
          ? duration - timeLeft
          : undefined
      }
      streak={sessionRef.current.maxStreak}
      onPlayAgain={() => {
        // Reset session state and timer
        window.location.reload();
      }}
    />
  );
}
