import React from "react";
import { ICONS } from "@constants/icons";
import type { QuizType, Difficulty } from "@features/quizzes/types";
import type { DropdownOption } from "@types";

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
export function renderOption(opt: {
  label: React.ReactNode;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  const Icon = opt.icon;
  return (
    <span className="flex items-center">
      {Icon ? (
        <span className="mr-2">
          <Icon size={18} />
        </span>
      ) : (
        <span className="mr-2">
          <ICONS.quizzes size={18} />
        </span>
      )}
      <span>{opt.label}</span>
    </span>
  );
}
