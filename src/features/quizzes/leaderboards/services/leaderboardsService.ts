import {
  addDoc,
  deleteDoc,
  doc,
  limit,
  orderBy,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { logUserActivity } from "@features/activity";
import {
  db,
  getCollection,
  getCurrentUser,
  getDocData,
  getDocsData,
  isAuthenticated,
} from "@lib/firebase";
import { getArticle } from "@utils";
import type { Difficulty, LeaderboardEntry, QuizType } from "../../types";

const LEADERBOARD_COLLECTION = "leaderboards";
const PLAYER_GAMES_COLLECTION = "playerGames";

/**
 * Service for managing leaderboards and player game history
 */
export const leaderboardsService = {
  /**
   * Retrieves the leaderboard for a specific game mode and difficulty.
   * @param mode - The selected game mode.
   * @param difficulty - The selected difficulty level.
   * @returns Leaderboard entries for the specified mode and difficulty, sorted by score and time.
   */
  async getLeaderboard(
    type: QuizType,
    difficulty: Difficulty,
  ): Promise<LeaderboardEntry[]> {
    if (!isAuthenticated()) return [];

    const colRef = getCollection<LeaderboardEntry>(LEADERBOARD_COLLECTION);

    const q = query(
      colRef,
      where("type", "==", type),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      orderBy("time", "asc"),
      limit(25),
    );

    return await getDocsData<LeaderboardEntry>(q);
  },

  /**
   * Adds a new entry to the leaderboard.
   * @param mode - The selected game mode.
   * @param difficulty - The selected difficulty level.
   * @param entry - New leaderboard entry to add.
   */
  async addLeaderboardEntry(
    type: QuizType,
    difficulty: Difficulty,
    entry: LeaderboardEntry,
  ) {
    const user = getCurrentUser();
    if (!isAuthenticated() || !user) return;

    if (!type || !difficulty) throw new Error("Type and difficulty required.");

    const colRef = getCollection<LeaderboardEntry>("leaderboards");
    await addDoc(colRef, { ...entry, type, difficulty });

    // Enforce top 25 limit: fetch all entries for this mode/difficulty, ordered by score/time
    const q = query(
      colRef,
      where("type", "==", type),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      orderBy("time", "asc"),
    );

    const docs = await getDocsData<LeaderboardEntry>(q);
    if (docs.length > 25) {
      const toDelete = docs.slice(25);
      await Promise.all(toDelete.map((d) => deleteDoc(doc(colRef, d.id))));
    }

    const safeDifficulty = difficulty ?? "";
    const difficultyWithArticle = `${getArticle(safeDifficulty)} ${safeDifficulty}`;
    await logUserActivity(
      301,
      {
        difficultyWithArticle,
        quizType: type,
        score: entry.score,
        time: entry.time,
        playerId: entry.playerId,
        userName: user.displayName,
      },
      user.uid,
    );
  },

  /**
   * Saves a player's game result to their game history.
   * @param playerId - ID of the player.
   * @param entry - New leaderboard entry to add.
   * @param maxGames - Maximum number of games to keep.
   * @returns Updated player games data.
   */
  async savePlayerGame(
    playerId: string,
    entry: LeaderboardEntry,
    maxGames = 10,
  ) {
    if (!isAuthenticated()) return;
    const ref = doc(db, PLAYER_GAMES_COLLECTION, playerId);
    const data = await getDocData<{ games: LeaderboardEntry[] }>(ref);

    const games = data?.games || [];
    games.unshift(entry);
    if (games.length > maxGames) games.length = maxGames;

    await setDoc(ref, { games });
  },

  /**
   * Retrieves a player's game history.
   * @param playerId - ID of the player.
   * @param maxGames - Maximum number of games to retrieve.
   * @returns Player's game history.
   */
  async getPlayerGames(
    playerId: string,
    maxGames = 10,
  ): Promise<LeaderboardEntry[]> {
    if (!isAuthenticated()) return [];

    const ref = doc(db, PLAYER_GAMES_COLLECTION, playerId);
    const data = await getDocData<{ games: LeaderboardEntry[] }>(ref);

    return (data?.games || []).slice(0, maxGames);
  },
};
