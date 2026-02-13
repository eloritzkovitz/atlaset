import type { QuizType, Difficulty } from "@features/quizzes/types";
import type { DropdownOption } from "@types";
import {
  FaFlag,
  FaLandmark,
  FaLeaf,
  FaCompass,
  FaBinoculars,
  FaHatWizard,
  FaQuestion,
} from "react-icons/fa6";
import React from "react";

// Type options with icons
export const TYPE_OPTIONS: Array<
  DropdownOption<QuizType> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
> = [
  { value: "flag", label: "Guess the Flag", icon: FaFlag },
  { value: "capital", label: "Guess the Capital", icon: FaLandmark },
];

// Difficulty options with icons
export const DIFFICULTY_OPTIONS: Array<
  DropdownOption<Exclude<Difficulty, null>> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
> = [
  { value: "easy", label: "Easy", icon: FaLeaf },
  { value: "medium", label: "Medium", icon: FaCompass },
  { value: "hard", label: "Hard", icon: FaBinoculars },
  { value: "expert", label: "Expert", icon: FaHatWizard },
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
          <FaQuestion size={18} />
        </span>
      )}
      <span>{opt.label}</span>
    </span>
  );
}
