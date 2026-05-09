import { useTranslation } from "react-i18next";
import { TableDropdownFilter } from "@components";
import type { QuizType, Difficulty } from "@features/quizzes/types";
import type { DropdownOption } from "@types";
import {
  TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  renderOption,
} from "../constants/leaderboardOptions";

interface LeaderboardFilterBarProps {
  mode: QuizType;
  setMode: (mode: QuizType) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export function LeaderboardFilterBar({
  mode,
  setMode,
  difficulty,
  setDifficulty,
}: LeaderboardFilterBarProps) {
  const { t } = useTranslation("quizzes");
  const translateOptions = <T,>(
    opts: DropdownOption<T>[],
    keyForValue: (v: T) => string,
  ): DropdownOption<T>[] =>
    opts.map((opt) =>
      "options" in opt
        ? ({
            ...opt,
            options: opt.options.map((o) => ({
              ...o,
              label: t(keyForValue(o.value)),
            })),
          } as DropdownOption<T>)
        : ({
            ...opt,
            label: t(keyForValue(opt.value as T)),
          } as DropdownOption<T>),
    );

  const translatedTypeOptions = translateOptions(
    TYPE_OPTIONS as DropdownOption<QuizType>[],
    (v: QuizType) => `lobby.cards.${v}.title`,
  );
  const translatedDifficultyOptions = translateOptions(
    DIFFICULTY_OPTIONS as DropdownOption<Difficulty>[],
    (v: Difficulty) => `lobby.settings.levels.${v}.label`,
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
      <TableDropdownFilter
        placeholder={t("lobby.settings.selectGameMode")}
        value={mode}
        options={translatedTypeOptions}
        onChange={(v) => {
          const val = Array.isArray(v) ? v[0] : v;
          setMode(val as QuizType);
        }}
        renderOption={renderOption}
      />
      <TableDropdownFilter
        placeholder={t("lobby.settings.selectDifficulty")}
        value={difficulty}
        options={translatedDifficultyOptions}
        onChange={(v) => {
          const val = Array.isArray(v) ? v[0] : v;
          setDifficulty(val as Difficulty);
        }}
        renderOption={renderOption}
      />
    </div>
  );
}
