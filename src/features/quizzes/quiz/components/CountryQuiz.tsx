import {
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ConfirmModal, ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import type { Country } from "@features/countries";
import { useQuiz } from "../hooks/useQuiz";
import { GuessForm } from "../layout/GuessForm";
import { QuizLayout } from "../layout/QuizLayout";
import { ResultMessage } from "../layout/ResultMessage/ResultMessage";
import { makeGetNext } from "../utils/quizUtils";
import type { Difficulty, QuizType } from "../../types";

export interface CountryQuizProps {
  filterCountries: (countries: Country[], difficulty?: Difficulty) => Country[];
  getNextCountry: (
    countries: Country[]
  ) => (prevCountry: Country | null) => Country | null;
  checkAnswer: (guess: string, country: Country) => boolean;
  prompt: (country: Country) => ReactNode;
  resultLabel?: (country: Country) => ReactNode;
  type?: QuizType;
  difficulty?: Difficulty;
  noCountriesMessage: string;
  guessPlaceholder: string;
  timeLeft?: number;
  maxQuestions: number;
  sessionActive: boolean;
  handleSessionEnd: () => void;
  questionNumber: number;
  incrementQuestions: () => void;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  maxStreak: number;
  setMaxStreak: (newMaxStreak: number) => void;
  children?: ReactNode;
}

export function CountryQuiz({
  filterCountries,
  getNextCountry,
  checkAnswer,
  prompt,
  resultLabel,
  type = "flag",
  difficulty,
  noCountriesMessage,
  guessPlaceholder,
  timeLeft,
  maxQuestions,
  sessionActive,
  handleSessionEnd,
  questionNumber,
  incrementQuestions,
  score,
  setScore,
  maxStreak,
  setMaxStreak,
  children,
}: CountryQuizProps) {
  const { countries, loading, error } = useCountryData();
  const quizCountries = filterCountries(countries, difficulty);

  // Get next country for quiz using utility
  const getNext = makeGetNext(getNextCountry, quizCountries);

  const {
    question: currentCountry,
    guess,
    setGuess,
    result,
    streak,
    feedback,
    nextQuestion,
    skipQuestion,
    handleForfeit,
    handleGuess,
  } = useQuiz({
    getNextQuestion: getNext,
    checkAnswer,
    onQuestionAnswered: incrementQuestions,
    onMaxStreakChange: (newMaxStreak) => {
      if (newMaxStreak > maxStreak) setMaxStreak(newMaxStreak);
    },
    score,
    setScore,
  });

  // Forfeit confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const onForfeit = () => setShowConfirm(true);
  const handleConfirmForfeit = () => {
    setShowConfirm(false);
    handleForfeit(handleSessionEnd);
  };
  const handleCancelForfeit = () => setShowConfirm(false);

  // Show loading or error states
  if (loading) return <LoadingSpinner message="Loading countries..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!quizCountries.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <div>{noCountriesMessage}</div>
      </div>
    );
  }

  // Handle end of session
  if (!sessionActive) return null;

  // Wait for currentCountry to be set
  if (!currentCountry) return null;

  // Determine title based on type
  const quizTitle =
    type === "capital" ? "Guess the Capital!" : "Guess the Flag!";

  return (
    <>
      <QuizLayout
        title={quizTitle}
        score={score}
        streak={streak}
        prompt={prompt(currentCountry)}
        guessForm={
          <GuessForm
            guess={guess}
            setGuess={setGuess}
            handleGuess={handleGuess}
            skipFlag={skipQuestion}
            handleForfeit={onForfeit}
            disabled={result !== null || !sessionActive}
            placeholder={guessPlaceholder}
          />
        }
        feedback={
          feedback && <div className="text-danger mt-2">{feedback}</div>
        }
        resultMessage={
          <ResultMessage
            result={result}
            currentCountry={currentCountry}
            nextFlag={nextQuestion}
            answerLabel={
              resultLabel
                ? (() => {
                    const label = resultLabel(currentCountry);
                    if (typeof label === "string") return label;
                    if (label === null || label === undefined) return undefined;
                    if (typeof label === "number") return label.toString();
                    return undefined;
                  })()
                : undefined
            }
          />
        }
        timeLeft={timeLeft}
        questionNumber={questionNumber}
        maxQuestions={maxQuestions}
      >
        {children}
      </QuizLayout>
      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Are you sure?"
          message="Do you really want to forfeit this quiz? Your progress will be lost."
          onConfirm={handleConfirmForfeit}
          onCancel={handleCancelForfeit}
          submitLabel="Forfeit"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
}
