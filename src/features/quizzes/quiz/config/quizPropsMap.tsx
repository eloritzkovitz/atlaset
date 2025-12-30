import countryDifficultyRaw from "../constants/countryDifficulty.json";
import {
  CountryFlag,
  getCountriesWithOwnFlag,
  type Country,
} from "@features/countries";
import { filterByProperty } from "../utils/quizUtils";
import { createQuizProps } from "../utils/quizPropsFactory";
import type { Difficulty } from "../../types";

const countryDifficulty: Record<string, string> = countryDifficultyRaw;

/**
 * Factory function to create quiz props specific to the Capital Quiz
 * @param difficulty - Optional difficulty level
 * @returns Quiz props for Capital Quiz
 */
export function getCapitalQuizProps(difficulty?: Difficulty) {
  return createQuizProps({
    filterFn: (countries: Country[]) => filterByProperty(countries, "capital"),
    checkAnswer: (guess: string, country: Country) => {
      if (!country.capital) return false;
      return guess.trim().toLowerCase() === country.capital.toLowerCase();
    },
    promptConfig: {
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
      noCountriesMessage: "No countries with a capital found.",
      guessPlaceholder: "Enter the capital city",
    },
    difficulty,
    countryDifficultyMap: countryDifficulty,
  });
}

/**
 * Factory function to create quiz props specific to the Flag Quiz
 * @param difficulty - Optional difficulty level
 * @returns Quiz props for Flag Quiz
 */
export function getFlagQuizProps(difficulty?: Difficulty) {
  return createQuizProps({
    filterFn: getCountriesWithOwnFlag,
    checkAnswer: (guess: string, country: Country) =>
      guess.trim().toLowerCase() === country.name.toLowerCase(),
    promptConfig: {
      prompt: (country: Country) => (
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
      noCountriesMessage: "No countries with their own flag found.",
      guessPlaceholder: "Enter the country name",
    },
    difficulty,
    countryDifficultyMap: countryDifficulty,
  });
}

export const quizPropsMap = {
  capital: getCapitalQuizProps,
  flag: getFlagQuizProps,
};
