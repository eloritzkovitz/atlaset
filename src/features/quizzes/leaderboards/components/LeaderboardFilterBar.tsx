import { TableDropdownFilter } from "@components";
import type { QuizType, Difficulty } from "@features/quizzes/types";
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
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
      <TableDropdownFilter
        placeholder="Type"
        value={mode}
        options={TYPE_OPTIONS}
        onChange={(v) => {
          const val = Array.isArray(v) ? v[0] : v;
          setMode(val as QuizType);
        }}
        renderOption={renderOption}
      />
      <TableDropdownFilter
        placeholder="Difficulty"
        value={difficulty}
        options={DIFFICULTY_OPTIONS}
        onChange={(v) => {
          const val = Array.isArray(v) ? v[0] : v;
          setDifficulty(val as Difficulty);
        }}
        renderOption={renderOption}
      />
    </div>
  );
}
