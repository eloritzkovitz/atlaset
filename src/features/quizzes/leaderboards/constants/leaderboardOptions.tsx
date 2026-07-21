import React from "react";
import { ICONS } from "@constants/icons";
import type { DropdownOption, Option } from "@types";
import type { QuizType, Difficulty } from "../../types";

// Type options with icons
export const TYPE_OPTIONS: Array<
  DropdownOption<QuizType> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
> = [
  { value: "flag", label: "Guess the Flag", icon: ICONS.quizFlag },
  { value: "capital", label: "Guess the Capital", icon: ICONS.quizCapital },
];

// Difficulty options with icons
export const DIFFICULTY_OPTIONS: Array<
  DropdownOption<Exclude<Difficulty, null>> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
> = [
  { value: "easy", label: "Easy", icon: ICONS.quizEasy },
  { value: "medium", label: "Medium", icon: ICONS.quizMedium },
  { value: "hard", label: "Hard", icon: ICONS.quizHard },
  { value: "expert", label: "Expert", icon: ICONS.quizExpert },
];

/** Renders a dropdown option with an optional icon */
export function renderOption<T>(opt: DropdownOption<T>) {
  if ("options" in opt) {
    return <span className="font-bold text-muted px-1">{opt.label ?? ""}</span>;
  }

  const flatOpt = opt as Option<T> & {
    icon?: React.ComponentType<{ size?: number }>;
  };
  const Icon = flatOpt.icon;

  return (
    <span className="flex items-center">
      {Icon ? (
        <span className="me-2">
          <Icon size={18} />
        </span>
      ) : (
        <span className="me-2">
          <ICONS.quizzes size={18} />
        </span>
      )}
      <span>{flatOpt.label}</span>
    </span>
  );
}
