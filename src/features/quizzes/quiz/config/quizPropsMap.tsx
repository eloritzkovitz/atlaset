import i18n, { type TOptions } from "i18next";
import countryDifficultyRaw from "../constants/countryDifficulty.json";
import {
  CountryFlag,
  getCountriesWithOwnFlag,
  type Country,
} from "@features/countries";
import { normalizeString } from "@utils/string";
import { filterByProperty } from "../utils/quizUtils";
import { createQuizProps } from "../utils/quizPropsFactory";
import type { Difficulty } from "../../types";

const countryDifficulty: Record<string, string> = countryDifficultyRaw;

/**
 * Factory function to create quiz props specific to the Capital Quiz
 * @param difficulty - Optional difficulty level
 * @param gameMode - Optional game mode
 * @returns Quiz props for Capital Quiz
 */
export function getCapitalQuizProps(
  difficulty?: Difficulty,
  gameMode?: string,
) {
  const t = (k: string, opts?: TOptions): string => {
    const res = i18n.t(k, { ns: "quizzes", ...opts }) as unknown;
    if (typeof res === "string") return res;
    try {
      return JSON.stringify(res);
    } catch {
      return String(res);
    }
  };

  return createQuizProps({
    filterFn: (countries: Country[]) => filterByProperty(countries, "capital"),
    checkAnswer: (guess: string, country: Country) => {
      if (!country.capital) return false;
      return normalizeString(guess) === normalizeString(country.capital);
    },
    promptConfig: {
      prompt: (country: Country) => (
        <>
          <CountryFlag
            flag={{
              isoCode: country.isoCode,
              ratio: "original",
              size: "128",
            }}
            className="block mx-auto mb-8 h-40 w-auto"
          />
          <div className="text-lg font-semibold">{country.name}</div>
        </>
      ),
      resultLabel: (country: Country) => country.capital,
      noCountriesMessage: t("play.noCountries.capital", { ns: "quizzes" }),
      guessPlaceholder: t("play.form.capitalPlaceholder", { ns: "quizzes" }),
    },
    difficulty,
    gameMode,
    countryDifficultyMap: countryDifficulty,
  });
}

/**
 * Factory function to create quiz props specific to the Flag Quiz
 * @param difficulty - Optional difficulty level
 * @returns Quiz props for Flag Quiz
 */
export function getFlagQuizProps(difficulty?: Difficulty) {
  const t = (k: string, opts?: TOptions): string => {
    const res = i18n.t(k, { ns: "quizzes", ...opts }) as unknown;
    if (typeof res === "string") return res;
    try {
      return JSON.stringify(res);
    } catch {
      return String(res);
    }
  };

  return createQuizProps({
    filterFn: getCountriesWithOwnFlag,
    checkAnswer: (guess: string, country: Country) => {
      const normalizedGuess = normalizeString(guess);
      const validAnswers = [country.name, ...(country.altNames ?? [])].map(
        normalizeString,
      );
      return validAnswers.includes(normalizedGuess);
    },
    promptConfig: {
      prompt: (country: Country) => (
        <CountryFlag
          flag={{
            isoCode: country.isoCode,
            ratio: "original",
            size: "128",
          }}
          className="block mx-auto mb-8 h-40 w-auto"
        />
      ),
      noCountriesMessage: t("play.noCountries.flag", { ns: "quizzes" }),
      guessPlaceholder: t("play.form.placeholder", { ns: "quizzes" }),
    },
    difficulty,
    countryDifficultyMap: countryDifficulty,
  });
}

export const quizPropsMap = {
  capital: getCapitalQuizProps,
  flag: getFlagQuizProps,
};
