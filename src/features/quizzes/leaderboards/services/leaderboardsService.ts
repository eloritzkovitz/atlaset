import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@app/firebase";
import { logUserActivity } from "@features/activity";
import { isAuthenticated, getCurrentUser } from "@lib/firebase";
import { getArticle } from "@utils/string";
import type { Difficulty, LeaderboardEntry, QuizType } from "../../types";

const LEADERBOARD_COLLECTION = "leaderboards";
const PLAYER_GAMES_COLLECTION = "playerGames";

/**
 * Service for managing leaderboards and player game history
 */
export const leaderboardsService = {
  /**
   * Retrieves the leaderboard for a specific game mode and difficulty.
   * @param mode - Game mode
   * @param difficulty - Difficulty level
   * @returns Leaderboard entries
   */
  async getLeaderboard(
    type: QuizType,
    difficulty: Difficulty,
  ): Promise<LeaderboardEntry[]> {
    if (!isAuthenticated()) return [];
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      where("type", "==", type),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      orderBy("time", "asc"),
      limit(25),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as LeaderboardEntry);
  },

  /**
   * Adds a new entry to the leaderboard.
   * @param mode - Game mode
   * @param difficulty - Difficulty level
   * @param entry - New leaderboard entry to add
   */
  async addLeaderboardEntry(
    type: QuizType,
    difficulty: Difficulty,
    entry: LeaderboardEntry,
  ) {
    if (!isAuthenticated()) return;
    const user = getCurrentUser();
    if (!user) return;
    if (typeof type === "undefined" || typeof difficulty === "undefined") {
      throw new Error(
        "Type and difficulty must be defined for leaderboard entry.",
      );
    }
    const ref = collection(db, LEADERBOARD_COLLECTION);
    // Add the new entry
    await setDoc(doc(ref), { ...entry, type, difficulty });
    // Enforce top 25 limit: fetch all entries for this mode/difficulty, ordered by score/time
    const q = query(
      ref,
      where("type", "==", type),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      orderBy("time", "asc"),
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    // Delete entries beyond the top 25
    if (docs.length > 25) {
      const toDelete = docs.slice(25);
      for (const docSnap of toDelete) {
        await deleteDoc(docSnap.ref);
      }
    }
    // Log user activity
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
   * @param playerId - ID of the player
   * @param entry - New leaderboard entry to add
   * @param maxGames - Maximum number of games to keep
   * @returns Updated player games data
   */
  async savePlayerGame(
    playerId: string,
    entry: LeaderboardEntry,
    maxGames = 10,
  ) {
    if (!isAuthenticated()) return;
    const ref = doc(db, PLAYER_GAMES_COLLECTION, playerId);
    const docSnap = await getDoc(ref);
    const games: LeaderboardEntry[] = docSnap.exists()
      ? docSnap.data().games || []
      : [];
    games.unshift(entry);
    if (games.length > maxGames) games.length = maxGames;
    await setDoc(ref, { games });
  },

  /**
   * Retrieves a player's game history.
   * @param playerId - ID of the player
   * @param maxGames - Maximum number of games to retrieve
   * @returns - Player's game history
   */
  async getPlayerGames(
    playerId: string,
    maxGames = 10,
  ): Promise<LeaderboardEntry[]> {
    if (!isAuthenticated()) return [];
    const ref = doc(db, PLAYER_GAMES_COLLECTION, playerId);
    const docSnap = await getDoc(ref);
    return docSnap.exists()
      ? (docSnap.data().games || []).slice(0, maxGames)
      : [];
  },
};
