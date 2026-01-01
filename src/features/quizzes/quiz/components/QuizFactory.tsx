import { CountryQuiz, type CountryQuizProps } from "../components/CountryQuiz";
import { QuizSession } from "../components/QuizSession";
import type { Difficulty, QuizType, SessionProps } from "../../types";
import { useState } from "react";

interface QuizFactoryProps {
  quizProps: Omit<
    CountryQuizProps,
    | "questionNumber"
    | "maxQuestions"
    | "sessionActive"
    | "handleSessionEnd"
    | "incrementQuestions"
    | "timeLeft"
    | "scoreOverride"
    | "setMaxStreak"
  >;
  sessionProps: {
    maxQuestions: number;
    duration?: number;
    quizType: QuizType;
    difficulty: Difficulty;
    [key: string]: unknown;
  };
  scoreIsQuestions?: boolean;
}

export function QuizFactory({
  quizProps,
  sessionProps,
  scoreIsQuestions,
}: QuizFactoryProps) {
  const [score, setScore] = useState(0);

  if (sessionProps.gameMode === "sandbox") {
    const [maxStreak, setMaxStreak] = useState(0);
    return (
      <CountryQuiz
        {...quizProps}
        timeLeft={undefined}
        questionNumber={1}
        maxQuestions={0}
        sessionActive={true}
        handleSessionEnd={() => {}}
        incrementQuestions={() => {}}
        score={score}
        setScore={setScore}
        maxStreak={maxStreak}
        setMaxStreak={setMaxStreak}
      />
    );
  }

  const { quizType, difficulty, ...restSessionProps } = sessionProps;
  return (
    <QuizSession
      {...restSessionProps}
      quizType={quizType}
      difficulty={difficulty}
      score={score}
    >
      {(session: SessionProps) => (
        <CountryQuiz
          {...quizProps}
          {...(scoreIsQuestions ? { scoreOverride: session.questionNumber } : {})}
          {...session}
          score={score}
          setScore={setScore}
          maxStreak={session.maxStreak}
          setMaxStreak={session.setMaxStreak}
        />
      )}
    </QuizSession>
  );
}
