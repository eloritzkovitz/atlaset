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

/** Represents the player's game history. */
export type PlayerGames = {
  /** Mapping of player IDs to their game history entries. */
  [playerId: string]: LeaderboardEntry[];
};

/** Represents the properties of a quiz session. */
export interface SessionProps {
  sessionActive: boolean;
  handleSessionEnd: () => void;
  maxQuestions: number;
  questionNumber: number; 
  incrementQuestions: () => void;
  timeLeft?: number;
  maxStreak: number;
  setMaxStreak: (newMaxStreak: number) => void;
}

/** Represents an entry in the leaderboard. */
export type LeaderboardEntry = {
  /** Unique identifier for the player. */
  playerId: string;
  /** Name of the player. */
  playerName: string;
  /** Score achieved by the player. */
  score: number;
  /** Time taken by the player (optional). */
  time?: number;
  /** Maximum streak achieved by the player (optional). */
  maxStreak?: number;
  /** Date of the game entry. */
  date: string;
};

/** Represents the leaderboard data structure. */
export type Leaderboard = {
  /** Mapping of game modes to their respective difficulty leaderboards. */
  [mode: string]: {
    [difficulty: string]: LeaderboardEntry[];
  };
};

/** Represents a row in the leaderboard with an added rank property. */
export type LeaderboardRow = LeaderboardEntry & { rank: number };
