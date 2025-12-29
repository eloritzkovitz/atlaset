import { ErrorMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  CountryFlag,
  getRandomCountry,
  type Country,
} from "@features/countries";
import { useQuiz } from "../hooks/useQuiz";
import { GuessForm } from "../layout/GuessForm";
import { QuizLayout } from "../layout/QuizLayout";
import { ResultMessage } from "../layout/ResultMessage";

export function CapitalQuiz() {
  const { countries, loading, error } = useCountryData();
  // Only use countries with a defined capital
  const capitalCountries = countries.filter(
    (c: Country) => c.capital && c.capital.trim() !== ""
  );

  // Get next country for capital quiz
  const getNextCountry = (prevCountry: Country | null) => {
    if (capitalCountries.length <= 1 || !prevCountry) {
      return getRandomCountry(capitalCountries);
    }
    let next;
    do {
      next = getRandomCountry(capitalCountries);
    } while (next && prevCountry && next.isoCode === prevCountry.isoCode);
    return next;
  };

  // Check if the guess matches the capital (case-insensitive)
  const checkAnswer = (guess: string, country: Country) => {
    if (!country.capital) return false;
    return guess.trim().toLowerCase() === country.capital.toLowerCase();
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
  } = useQuiz({
    getNextQuestion: getNextCountry,
    checkAnswer,
  });

  // Show loading or error states
  if (loading) return <LoadingSpinner message="Loading countries..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!capitalCountries.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <div>No countries with a capital found.</div>
      </div>
    );
  }
  if (!currentCountry) {
    // Wait for useEffect to set currentCountry
    return null;
  }

  return (
    <QuizLayout
      title="Guess the Capital!"
      score={score}
      streak={streak}
      prompt={
        <>
          <CountryFlag
            flag={{
              isoCode: currentCountry.isoCode,
              ratio: "original",
              size: "64",
            }}
            alt={currentCountry.name}
            className="block mx-auto mb-8 h-20 w-auto"
          />
          <div className="text-lg font-semibold">{currentCountry.name}</div>
        </>
      }
      guessForm={
        <GuessForm
          guess={guess}
          setGuess={setGuess}
          handleGuess={handleGuess}
          skipFlag={skipQuestion}
          disabled={result !== null}
          placeholder="Enter the capital city"
        />
      }
      feedback={feedback && <div className="text-danger mt-2">{feedback}</div>}
      resultMessage={
        <ResultMessage
          result={result}
          currentCountry={currentCountry}
          nextFlag={nextQuestion}
          answerLabel={currentCountry.capital}
        />
      }
    />
  );
}
