/** Represents a quiz. */
export type Quiz = {
  /** The type of the quiz. */
  quizType: QuizType;
  /** The difficulty level of the quiz. */
  difficulty: Difficulty;
  /** The game mode of the quiz. */
  gameMode: GameMode;
};

/** Represents the type of quiz. */
export type QuizType = "capital" | "flag";

/** Represents the difficulty level of a quiz. */
export type Difficulty = "easy" | "medium" | "hard" | "expert" | null;

/** Represents the game mode of a quiz. */
export type GameMode = "sandbox" | "timed";
