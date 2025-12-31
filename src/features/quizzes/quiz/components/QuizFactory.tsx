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

interface SessionRenderProps {
  timeLeft?: number;
  questionsAnswered: number;
  sessionActive: boolean;
  endSession: () => void;
  incrementQuestions: () => void;
  setMaxStreak: (newMaxStreak: number) => void;
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
      />
    );
  }
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
        setMaxStreak,
        score,
        setScore,
      }: SessionRenderProps & {
        score: number;
        setScore: (score: number) => void;
      }) => (
        <CountryQuiz
          {...quizProps}
          {...(scoreIsQuestions
            ? { scoreOverride: questionsAnswered }
            : { score, setScore })}
          timeLeft={timeLeft}
          questionsAnswered={questionsAnswered}
          maxQuestions={sessionProps.maxQuestions}
          sessionActive={sessionActive}
          handleSessionEnd={endSession}
          incrementQuestions={incrementQuestions}
          setMaxStreak={setMaxStreak}
        />
      )}
    </QuizSession>
  );
}
