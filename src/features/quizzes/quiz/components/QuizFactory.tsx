import { CountryQuiz, type CountryQuizProps } from "../components/CountryQuiz";
import { QuizSession } from "../components/QuizSession";

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
}

export function QuizFactory({
  quizProps,
  sessionProps,
  scoreIsQuestions,
}: QuizFactoryProps) {
  return (
    <QuizSession {...sessionProps}>
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
