import { getSessionProps } from "../utils/quizUtils";
import { QuizFactory } from "./QuizFactory";
import type { Quiz } from "../../types";
import { quizPropsMap } from "../config/quizPropsMap";

export function QuizEntry({ quizType, difficulty, gameMode }: Quiz) {
  const getQuizProps = quizPropsMap[quizType];

  // Safety check in case of an unknown quiz type
  if (!getQuizProps) throw new Error(`Unknown quiz type: ${quizType}`);

  // Generate quiz props and session props
  const quizProps = {
    ...getQuizProps(difficulty, gameMode),
    score: 0,
    setScore: () => {},
    maxStreak: 0,
    setMaxStreak: () => {},
  };
  const sessionProps = {
    ...getSessionProps(gameMode, 25, 300),
    quizType,
    difficulty,
    gameMode,
  };

  return (
    <QuizFactory
      quizProps={quizProps}
      sessionProps={sessionProps}
      scoreIsQuestions={quizType === "flag"}
    />
  );
}
