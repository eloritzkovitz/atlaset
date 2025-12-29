import { ErrorMessage, LoadingSpinner } from "@components";
import countryDifficultyRaw from "../constants/countryDifficulty.json";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  CountryFlag,
  getRandomCountry,
  getCountriesWithOwnFlag,
  type Country,
} from "@features/countries";
import { useQuiz } from "../hooks/useQuiz";
import { GuessForm } from "../layout/GuessForm";
import { QuizLayout } from "../layout/QuizLayout";
import { ResultMessage } from "../layout/ResultMessage";
import { TimedQuizSession } from "./TimedQuizSession";
import type { GameMode } from "../../types";
import { useNavigate } from "react-router-dom";

const countryDifficulty: Record<string, string> = countryDifficultyRaw;

interface FlagQuizProps {
  difficulty?: string;
  gameMode?: GameMode;
}

export function FlagQuiz({ difficulty, gameMode }: FlagQuizProps) {
    const navigate = useNavigate();
  const { countries, loading, error } = useCountryData();
  let flagCountries = getCountriesWithOwnFlag(countries);
  if (difficulty) {
    flagCountries = flagCountries.filter(
      (c) => countryDifficulty[c.isoCode] === difficulty
    );
  }

  // Define how to get the next country (question)
  const getNextCountry = (prevCountry: Country | null) => {
    if (flagCountries.length <= 1 || !prevCountry) {
      return getRandomCountry(flagCountries);
    }
    let next;
    do {
      next = getRandomCountry(flagCountries);
    } while (next && prevCountry && next.isoCode === prevCountry.isoCode);
    return next;
  };

  // Define how to check the answer
  const checkAnswer = (guess: string, country: Country) =>
    guess.trim().toLowerCase() === country.name.toLowerCase();

  // Use the hook
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
  if (!flagCountries.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <div>No countries with their own flag found.</div>
      </div>
    );
  }
  if (!currentCountry) {
    // Wait for useEffect to set currentCountry
    return null;
  }

  // Timed mode logic
  if (gameMode === "timed") {
    return (
      <TimedQuizSession duration={300} maxQuestions={25}>
        {({
          timeLeft,
          questionsAnswered,
          sessionActive,
          endSession,
          incrementQuestions,
        }) => {
          const handleForfeit = () => {
            endSession();
            navigate("/quizzes");
          };
          return (
            <QuizLayout
              title="Guess the Country!"
              score={questionsAnswered}
              streak={streak}
              timeLeft={timeLeft}
              questionsAnswered={questionsAnswered}
              maxQuestions={25}
              prompt={
                <CountryFlag
                  flag={{
                    isoCode: currentCountry.isoCode,
                    ratio: "original",
                    size: "64",
                  }}
                  alt={currentCountry.name}
                  className="block mx-auto mb-8 h-20 w-auto"
                />
              }
              guessForm={
                <GuessForm
                  guess={guess}
                  setGuess={setGuess}
                  handleGuess={(e) => {
                    handleGuess(e);
                    if (result === null && sessionActive) {
                      incrementQuestions();
                    }
                  }}
                  skipFlag={skipQuestion}
                  handleForfeit={handleForfeit}
                  disabled={!sessionActive || result !== null}
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
                />
              }
            />
          );
        }}
      </TimedQuizSession>
    );
  }

  // Sandbox mode (default)
  return (
    <QuizLayout
      title="Guess the Country!"
      score={score}
      streak={streak}
      prompt={
        <CountryFlag
          flag={{
            isoCode: currentCountry.isoCode,
            ratio: "original",
            size: "64",
          }}
          alt={currentCountry.name}
          className="block mx-auto mb-8 h-20 w-auto"
        />
      }
      guessForm={
        <GuessForm
          guess={guess}
          setGuess={setGuess}
          handleGuess={handleGuess}
          skipFlag={skipQuestion}
          disabled={result !== null}
        />
      }
      feedback={feedback && <div className="text-danger mt-2">{feedback}</div>}
      resultMessage={
        <ResultMessage
          result={result}
          currentCountry={currentCountry}
          nextFlag={nextQuestion}
        />
      }
    />
  );
}
