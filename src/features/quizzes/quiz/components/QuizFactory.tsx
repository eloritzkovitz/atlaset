import { CountryQuiz, type CountryQuizProps } from "../components/CountryQuiz";
import { QuizSession } from "../components/QuizSession";
import type { Difficulty, QuizType, SessionProps } from "../../types";

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
  const { quizType, difficulty, ...restSessionProps } = sessionProps;
  if (sessionProps.gameMode === "sandbox") {
    // Render CountryQuiz directly, no session logic
    return (
      <CountryQuiz
        {...quizProps}
        timeLeft={undefined}
        questionsAnswered={0}
        maxQuestions={0}
        sessionActive={true}
        handleSessionEnd={() => {}}
        incrementQuestions={() => {}}
        setMaxStreak={() => {}}
        setScore={() => {}}
      />
    );
  }
  return (
    <QuizSession
      {...restSessionProps}
      quizType={quizType}
      difficulty={difficulty}
    >
      {(session: SessionProps) => (
        <CountryQuiz
          {...quizProps}
          {...(scoreIsQuestions ? { scoreOverride: session.questionsAnswered } : {})}
          {...session}
        />
      )}
    </QuizSession>
  );
}
