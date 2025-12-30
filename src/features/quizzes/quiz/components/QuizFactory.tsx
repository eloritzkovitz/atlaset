import { CountryQuiz, type CountryQuizProps } from "../components/CountryQuiz";
import { QuizSession } from "../components/QuizSession";
import type { Difficulty, QuizType } from "../../types";

interface QuizFactoryProps {
  quizProps: Omit<
    CountryQuizProps,
    | "questionsAnswered"
    | "maxQuestions"
    | "sessionActive"
    | "handleSessionEnd"
    | "incrementQuestions"
    | "timeLeft"
    | "scoreOverride"
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

interface SessionRenderProps {
  timeLeft?: number;
  questionsAnswered: number;
  sessionActive: boolean;
  endSession: () => void;
  incrementQuestions: () => void;
  maxStreak: number;
}

export function QuizFactory({
  quizProps,
  sessionProps,
  scoreIsQuestions,
}: QuizFactoryProps) {
  const { quizType, difficulty, ...restSessionProps } = sessionProps;
  return (
    <QuizSession
      {...restSessionProps}
      quizType={quizType}
      difficulty={difficulty}
    >
      {({
        timeLeft,
        questionsAnswered,
        sessionActive,
        endSession,
        incrementQuestions,
      }: SessionRenderProps) => (
        <CountryQuiz
          {...quizProps}
          {...(scoreIsQuestions ? { scoreOverride: questionsAnswered } : {})}
          timeLeft={timeLeft}
          questionsAnswered={questionsAnswered}
          maxQuestions={sessionProps.maxQuestions}
          sessionActive={sessionActive}
          handleSessionEnd={endSession}
          incrementQuestions={incrementQuestions}
        />
      )}
    </QuizSession>
  );
}
