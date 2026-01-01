import { useSelector } from "react-redux";
import { QuizFactory } from "./QuizFactory";
import { quizPropsMap } from "../config/quizPropsMap";
import { getSessionProps } from "../utils/quizUtils";
import type { RootState } from "../../../../store";

export function QuizEntry() {
  const quizType = useSelector(
    (state: RootState) => state.quizSettings.quizType
  );
  const difficulty = useSelector(
    (state: RootState) => state.quizSettings.difficulty
  );
  const gameMode = useSelector(
    (state: RootState) => state.quizSettings.gameMode
  );

  const getQuizProps = quizPropsMap[quizType];
  if (!getQuizProps) throw new Error(`Unknown quiz type: ${quizType}`);

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
