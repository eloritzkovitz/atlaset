import { type ReactNode } from "react";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import type { Country } from "@features/countries";
import { useQuiz } from "../hooks/useQuiz";
import { GuessForm } from "../layout/GuessForm";
import { QuizLayout } from "../layout/QuizLayout";
import { ResultMessage } from "../layout/ResultMessage/ResultMessage";
import type { Difficulty } from "../../types";

export interface CountryQuizProps {
  filterCountries: (countries: Country[], difficulty?: Difficulty) => Country[];
  getNextCountry: (
    countries: Country[]
  ) => (prevCountry: Country | null) => Country | null;
  checkAnswer: (guess: string, country: Country) => boolean;
  prompt: (country: Country) => ReactNode;
  resultLabel?: (country: Country) => ReactNode;
  difficulty?: Difficulty;
  noCountriesMessage: string;
  guessPlaceholder: string;
  scoreOverride?: number;
  timeLeft?: number;
  questionsAnswered: number;
  maxQuestions: number;
  sessionActive: boolean;
  handleSessionEnd: () => void;
  incrementQuestions: () => void;
  children?: ReactNode;
  mode?: 'flag' | 'capital'; // Add mode prop
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
  sessionActive,
  handleSessionEnd,
  incrementQuestions,
  children,
  mode = 'flag', // Default to 'flag' if not provided
}: CountryQuizProps) {
  const { countries, loading, error } = useCountryData();
  const quizCountries = filterCountries(countries, difficulty);

  // Get next country for quiz
  const getNext = (prevCountry: Country | null) => {
    const result = getNextCountry(quizCountries)(prevCountry);
    return result === undefined ? null : result;
  };

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
      onQuestionAnswered: incrementQuestions,
  });

  // Handle forfeit action
  const onForfeit = () => {
    handleSessionEnd();
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

  // Handle end of session
  if (!sessionActive) return null;

  // Wait for currentCountry to be set
  if (!currentCountry) return null;

  // Determine title based on mode
  const quizTitle = mode === 'capital' ? 'Guess the Capital!' : 'Guess the Flag!';

  return (
    <QuizLayout
      title={quizTitle}
      score={scoreOverride !== undefined ? scoreOverride : score}
      streak={streak}
      prompt={prompt(currentCountry)}
      guessForm={
        <GuessForm
          guess={guess}
          setGuess={setGuess}
          handleGuess={handleGuess}
          skipFlag={() => {
            skipQuestion();
            incrementQuestions();
          }}
          handleForfeit={onForfeit}
          disabled={result !== null || !sessionActive}
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
