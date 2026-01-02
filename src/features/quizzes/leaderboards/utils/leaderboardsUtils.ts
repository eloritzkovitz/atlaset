import type {
  Difficulty,
  Leaderboard,
  LeaderboardEntry,
  PlayerGames,
  QuizType,
} from "../../types";

/**
 * Updates the leaderboard with a new entry
 * @param leaderboard - Current leaderboard data
 * @param mode - Game mode
 * @param difficulty - Difficulty level
 * @param newEntry - New leaderboard entry to add
 * @param maxEntries - Maximum number of entries to keep
 * @returns Updated leaderboard
 */
export function updateLeaderboards(
  leaderboard: Leaderboard,
  type: QuizType,
  difficulty: Difficulty,
  newEntry: LeaderboardEntry,
  maxEntries = 25
): Leaderboard {
  if (!difficulty) return leaderboard;
  const typeBoard = leaderboard[type] || {};
  const arr = typeBoard[difficulty] ? [...typeBoard[difficulty]] : [];
  arr.push(newEntry);
  arr.sort(
    (a, b) => b.score - a.score || (a.time ?? Infinity) - (b.time ?? Infinity)
  );
  if (arr.length > maxEntries) arr.length = maxEntries;
  return {
    ...leaderboard,
    [type]: {
      ...typeBoard,
      [difficulty]: arr,
    },
  };
}

/**
 * Saves a player's game result to their game history
 * @param playerGames - Current player games data
 * @param playerId - ID of the player
 * @param gameResult - New game result to add
 * @param maxGames - Maximum number of games to keep
 * @returns Updated player games data
 */
export function savePlayerGame(
  playerGames: PlayerGames,
  playerId: string,
  gameResult: LeaderboardEntry,
  maxGames = 10
): PlayerGames {
  const arr = playerGames[playerId] ? [...playerGames[playerId]] : [];
  arr.unshift(gameResult);
  if (arr.length > maxGames) arr.length = maxGames;
  return {
    ...playerGames,
    [playerId]: arr,
  };
}
