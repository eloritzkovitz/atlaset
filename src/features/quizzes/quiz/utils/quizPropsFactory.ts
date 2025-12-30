import type { Country } from "@features/countries";
import type { Difficulty } from "../../types";

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
  countryDifficultyMap?: Record<string, string>;
}

/**
 * Factory function to create quiz props for different quiz types
 * @param filterFn - Function to filter countries for the quiz
 * @param checkAnswer - Function to check if the answer is correct
 * @param promptConfig - Configuration for prompts and labels
 * @param difficulty - Optional difficulty level
 * @param countryDifficultyMap - Optional map of country difficulties
 * @returns = Quiz props object
 */
export function createQuizProps({
  filterFn,
  checkAnswer,
  promptConfig,
  difficulty,
  countryDifficultyMap,
}: QuizPropsFactoryConfig) {
  return {
    filterCountries: (countries: Country[], diff?: Difficulty) => {
      let filtered = filterFn(countries);
      if (diff && countryDifficultyMap) {
        filtered = filtered.filter(
          (c) => countryDifficultyMap[c.isoCode] === diff
        );
      }
      return filtered;
    },
    getNextCountry: (countries: Country[]) => (prevCountry: Country | null) => {
      if (countries.length <= 1 || !prevCountry) {
        return countries[Math.floor(Math.random() * countries.length)] || null;
      }
      let next;
      do {
        next = countries[Math.floor(Math.random() * countries.length)];
      } while (next && prevCountry && next.isoCode === prevCountry.isoCode);
      return next;
    },
    checkAnswer,
    ...promptConfig,
    difficulty,
  };
}
