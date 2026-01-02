import type { Country } from "@features/countries";
import type { Difficulty } from "../../types";
import { filterByDifficulty, getNextRandomCountry } from "./quizUtils";

interface QuizPromptConfig {
  prompt: (country: Country) => React.ReactNode;
  resultLabel?: (country: Country) => React.ReactNode;
  guessPlaceholder: string;
  noCountriesMessage: string;
}

interface QuizPropsFactoryConfig {
  filterFn: (countries: Country[]) => Country[];
  checkAnswer: (guess: string, country: Country) => boolean;
  promptConfig: QuizPromptConfig;
  difficulty?: Difficulty;
  gameMode?: string;
  countryDifficultyMap?: Record<string, string>;
}

/**
 * Factory function to create quiz props for different quiz types
 * @param filterFn - Function to filter countries for the quiz
 * @param checkAnswer - Function to check if the answer is correct
 * @param promptConfig - Configuration for prompts and labels
 * @param difficulty - Optional difficulty level
 * @param gameMode - Optional game mode
 * @param countryDifficultyMap - Optional map of country difficulties
 * @returns = Quiz props object
 */
export function createQuizProps({
  filterFn,
  checkAnswer,
  promptConfig,
  difficulty,
  gameMode,
  countryDifficultyMap,
}: QuizPropsFactoryConfig) {
  return {
    filterCountries: (countries: Country[], diff?: Difficulty) => {
      let filtered = filterFn(countries);
      if (diff && countryDifficultyMap) {
        filtered = filterByDifficulty(filtered, diff, countryDifficultyMap);
      }
      return filtered;
    },
    getNextCountry: (countries: Country[]) => getNextRandomCountry(countries),
    checkAnswer,
    ...promptConfig,
    difficulty,
    gameMode,
  };
}
