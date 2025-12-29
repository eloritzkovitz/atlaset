import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { useQuiz } from "../hooks/useQuiz";
import { GuessForm } from "../layout/GuessForm";
import { QuizLayout } from "../layout/QuizLayout";
import { ResultMessage } from "../layout/ResultMessage";
import type { Country } from "@features/countries";
import type { ReactNode } from "react";

export interface CountryQuizProps {
  filterCountries: (countries: Country[], difficulty?: string) => Country[];
  getNextCountry: (
    countries: Country[]
  ) => (prevCountry: Country | null) => Country | null;
  checkAnswer: (guess: string, country: Country) => boolean;
  prompt: (country: Country) => ReactNode;
  resultLabel?: (country: Country) => ReactNode;
  difficulty?: string;
  noCountriesMessage: string;
  guessPlaceholder: string;
  scoreOverride?: number;
  timeLeft?: number;
  questionsAnswered?: number;
  maxQuestions?: number;
  handleSessionEnd?: () => void;
  children?: ReactNode;
}

export function CountryQuiz({
  filterCountries,
  getNextCountry,
  checkAnswer,
  prompt,
  resultLabel,
  difficulty,
  noCountriesMessage,
  guessPlaceholder,
  scoreOverride,
  timeLeft,
  questionsAnswered,
  maxQuestions,
  handleSessionEnd,
  children,
}: CountryQuizProps) {
  const { countries, loading, error } = useCountryData();
  const quizCountries = filterCountries(countries, difficulty);

  // Get next country for quiz
  const getNext = (prevCountry: Country | null) => {
    const result = getNextCountry(quizCountries)(prevCountry);
    return result === undefined ? null : result;
  };

  // Use the quiz hook
  const {
    question: currentCountry,
    guess,
    setGuess,
    result,
    score,
    streak,
    feedback,
    handleGuess,
    nextQuestion,
    skipQuestion,
    handleForfeit,
  } = useQuiz({
    getNextQuestion: getNext,
    checkAnswer,
  });

  // Compose forfeit handler: call handleSessionEnd (if provided) then handleForfeit
  const onForfeit = () => {
    if (handleSessionEnd) handleSessionEnd();
    handleForfeit();
  };

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
  if (!currentCountry) {
    // Wait for useEffect to set currentCountry
    return null;
  }

  return (
    <QuizLayout
      title="Quiz"
      score={scoreOverride !== undefined ? scoreOverride : score}
      streak={streak}
      prompt={prompt(currentCountry)}
      guessForm={
        <GuessForm
          guess={guess}
          setGuess={setGuess}
          handleGuess={handleGuess}
          skipFlag={skipQuestion}
          handleForfeit={onForfeit}
          disabled={result !== null}
          placeholder={guessPlaceholder}
        />
      }
      feedback={feedback && <div className="text-danger mt-2">{feedback}</div>}
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
      questionsAnswered={questionsAnswered}
      maxQuestions={maxQuestions}
    >
      {children}
    </QuizLayout>
  );
}
