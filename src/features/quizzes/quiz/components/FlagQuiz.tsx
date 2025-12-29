import {
  CountryFlag,
  getRandomCountry,
  getCountriesWithOwnFlag,
} from "@features/countries";
import { CountryQuiz } from "./CountryQuiz";
import { TimedQuizSession } from "./TimedQuizSession";
import countryDifficultyRaw from "../constants/countryDifficulty.json";

const countryDifficulty: Record<string, string> = countryDifficultyRaw;

function getFlagQuizProps(difficulty?: string) {
  return {
    filterCountries: (countries: any[], diff?: string) => {
      let filtered = getCountriesWithOwnFlag(countries);
      if (diff) {
        filtered = filtered.filter(
          (c) => countryDifficulty[c.isoCode] === diff
        );
      }
      return filtered;
    },
    getNextCountry: (flagCountries: any[]) => (prevCountry: any | null) => {
      if (flagCountries.length <= 1 || !prevCountry) {
        return getRandomCountry(flagCountries);
      }
      let next;
      do {
        next = getRandomCountry(flagCountries);
      } while (next && prevCountry && next.isoCode === prevCountry.isoCode);
      return next;
    },
    checkAnswer: (guess: string, country: any) =>
      guess.trim().toLowerCase() === country.name.toLowerCase(),
    prompt: (country: any) => (
      <CountryFlag
        flag={{
          isoCode: country.isoCode,
          ratio: "original",
          size: "64",
        }}
        alt={country.name}
        className="block mx-auto mb-8 h-20 w-auto"
      />
    ),
    difficulty,
    noCountriesMessage: "No countries with their own flag found.",
    guessPlaceholder: "Enter the country name",
  };
}

interface FlagQuizProps {
  difficulty?: string;
  gameMode?: string;
}

export function FlagQuiz({ difficulty, gameMode }: FlagQuizProps) {
  const quizProps = getFlagQuizProps(difficulty);

  if (gameMode === "timed") {
    return (
      <TimedQuizSession duration={300} maxQuestions={25}>
        {({ timeLeft, questionsAnswered, endSession }) => {
          return (
            <CountryQuiz
              {...quizProps}
              scoreOverride={questionsAnswered}
              timeLeft={timeLeft}
              questionsAnswered={questionsAnswered}
              maxQuestions={25}
              handleSessionEnd={endSession}
            />
          );
        }}
      </TimedQuizSession>
    );
  }
  return <CountryQuiz {...quizProps} />;
}
