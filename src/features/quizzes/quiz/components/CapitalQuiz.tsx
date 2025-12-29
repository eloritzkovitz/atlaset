import countryDifficultyRaw from "../constants/countryDifficulty.json";
import {
  CountryFlag,
  getRandomCountry,
  type Country,
} from "@features/countries";
import { CountryQuiz } from "./CountryQuiz";
import { TimedQuizSession } from "./TimedQuizSession";

const countryDifficulty: Record<string, string> = countryDifficultyRaw;

function getCapitalQuizProps(difficulty?: string) {
  return {
    filterCountries: (countries: Country[], diff?: string) => {
      let filtered = countries.filter(
        (c: Country) => c.capital && c.capital.trim() !== ""
      );
      if (diff) {
        filtered = filtered.filter(
          (c) => countryDifficulty[c.isoCode] === diff
        );
      }
      return filtered;
    },
    getNextCountry:
      (capitalCountries: Country[]) => (prevCountry: Country | null) => {
        if (capitalCountries.length <= 1 || !prevCountry) {
          return getRandomCountry(capitalCountries);
        }
        let next;
        do {
          next = getRandomCountry(capitalCountries);
        } while (next && prevCountry && next.isoCode === prevCountry.isoCode);
        return next;
      },
    checkAnswer: (guess: string, country: Country) => {
      if (!country.capital) return false;
      return guess.trim().toLowerCase() === country.capital.toLowerCase();
    },
    prompt: (country: Country) => (
      <>
        <CountryFlag
          flag={{
            isoCode: country.isoCode,
            ratio: "original",
            size: "64",
          }}
          alt={country.name}
          className="block mx-auto mb-8 h-20 w-auto"
        />
        <div className="text-lg font-semibold">{country.name}</div>
      </>
    ),
    resultLabel: (country: Country) => country.capital,
    difficulty,
    noCountriesMessage: "No countries with a capital found.",
    guessPlaceholder: "Enter the capital city",
  };
}

interface CapitalQuizProps {
  difficulty?: string;
  gameMode?: string;
}

export function CapitalQuiz({ difficulty, gameMode }: CapitalQuizProps) {
  const quizProps = getCapitalQuizProps(difficulty);
  if (gameMode === "timed") {
    return (
      <TimedQuizSession duration={300} maxQuestions={25}>
        {({ timeLeft, questionsAnswered, endSession }) => (
          <CountryQuiz
            {...quizProps}
            scoreOverride={questionsAnswered}
            timeLeft={timeLeft}
            questionsAnswered={questionsAnswered}
            maxQuestions={25}
            handleSessionEnd={endSession}
          />
        )}
      </TimedQuizSession>
    );
  }
  return <CountryQuiz {...quizProps} />;
}
