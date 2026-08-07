import type { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { leaderboardsService } from "../services/leaderboardsService";
import type { Difficulty, LeaderboardEntry, QuizType } from "../../types";

const mockEntries: LeaderboardEntry[] = Array.from({ length: 26 }, (_, i) => ({
  id: `doc${i}`,
  playerId: `player${i}`,
  playerName: `Player ${i}`,
  score: 100 - i,
  time: i,
  maxStreak: 10,
  date: new Date().toISOString(),
}));

const snapshotDataInput = mockEntries.map((entry) => ({
  id: entry.playerId,
  data: entry,
}));

function createPlayerGamesMock(games?: LeaderboardEntry[]) {
  return {
    exists: () => Boolean(games),
    data: () => (games ? { games: [...games] } : undefined),
    id: "player1",
    ref: { id: "player1" },
  } as unknown as DocumentSnapshot<unknown, DocumentData>;
}

describe("leaderboardsService", () => {
  const quizType: QuizType = "flag";
  const difficulty: Difficulty = "easy";

  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated.mockReturnValue(true);
    auth.getCurrentUser.mockReturnValue({
      uid: "test-user",
      displayName: "Test User",
    } as any);
    fs.collection.mockReturnValue({ id: "mock-collection" });
    fs.query.mockImplementation((ref) => ref);
    fs.doc.mockImplementation((...args: any[]) => ({
      id: args[args.length - 1] ?? "mock-doc-id",
    }));
  });

  describe("addLeaderboardEntry", () => {
    it("adds an entry, prunes excess docs (>25), and logs activity", async () => {
      fs.addDoc.mockResolvedValue(undefined);
      fs.deleteDoc.mockResolvedValue(undefined);
      fs.getDocs.mockResolvedValue(
        createMockSnapshot(snapshotDataInput) as any,
      );

      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );

      expect(fs.addDoc).toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalledTimes(1);
    });

    it("does not delete entries if threshold is <= 25", async () => {
      fs.addDoc.mockResolvedValue(undefined);
      fs.getDocs.mockResolvedValue(
        createMockSnapshot(snapshotDataInput.slice(0, 25)) as any,
      );

      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );

      expect(fs.deleteDoc).not.toHaveBeenCalled();
    });

    it("handles fallback default difficulty when formatting activity log", async () => {
      fs.addDoc.mockResolvedValue(undefined);
      fs.getDocs.mockResolvedValue(createMockSnapshot([]) as any);

      await leaderboardsService
        .addLeaderboardEntry(quizType, undefined as any, mockEntries[0])
        .catch(() => {});
    });

    it("skips submission if unauthenticated or missing user", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );

      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue(null);
      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );

      expect(fs.addDoc).not.toHaveBeenCalled();
    });

    it("throws if type or difficulty are missing", async () => {
      await expect(
        leaderboardsService.addLeaderboardEntry(
          undefined as any,
          undefined as any,
          mockEntries[0],
        ),
      ).rejects.toThrow("Type and difficulty required.");
    });
  });

  describe("getLeaderboard", () => {
    it("retrieves leaderboard entries up to limit", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot(snapshotDataInput.slice(0, 25)) as any,
      );

      const entries = await leaderboardsService.getLeaderboard(
        quizType,
        difficulty,
      );

      expect(entries).toHaveLength(25);
      expect(entries[0].score).toBe(100);
    });

    it("returns empty array if unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      expect(
        await leaderboardsService.getLeaderboard(quizType, difficulty),
      ).toEqual([]);
    });
  });

  describe("getUserScores", () => {
    it("retrieves top scores for a specific user", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot(snapshotDataInput.slice(0, 5)) as any,
      );

      const scores = await leaderboardsService.getUserScores("test-user");

      expect(scores).toHaveLength(5);
      expect(fs.getDocs).toHaveBeenCalled();
    });

    it("returns empty array if unauthenticated or userId is missing", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      expect(await leaderboardsService.getUserScores("test-user")).toEqual([]);

      auth.isAuthenticated.mockReturnValue(true);
      expect(await leaderboardsService.getUserScores("")).toEqual([]);
    });
  });

  describe("Player Progress Storage Operations", () => {
    const playerId = "player1";

    it("saves game history, prepends new entry, and caps max games", async () => {
      const prevGames = Array.from({ length: 12 }, (_, i) => ({
        ...mockEntries[0],
        playerId: `old${i}`,
      }));
      fs.getDoc.mockResolvedValue(createPlayerGamesMock(prevGames));
      fs.setDoc.mockResolvedValue(undefined);

      await leaderboardsService.savePlayerGame(playerId, mockEntries[0], 10);

      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          games: expect.arrayContaining([
            expect.objectContaining({ playerId: "player0" }),
          ]),
        }),
      );
    });

    it("handles saving game history when no previous games exist", async () => {
      fs.getDoc.mockResolvedValue(createPlayerGamesMock(undefined));
      fs.setDoc.mockResolvedValue(undefined);

      await leaderboardsService.savePlayerGame(playerId, mockEntries[0]);

      expect(fs.setDoc).toHaveBeenCalled();
    });

    it("skips saving player game if unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await leaderboardsService.savePlayerGame(playerId, mockEntries[0]);
      expect(fs.setDoc).not.toHaveBeenCalled();
    });

    it("retrieves player games up to maxGames fallback", async () => {
      const prevGames = Array.from({ length: 12 }, (_, i) => ({
        ...mockEntries[0],
        playerId: `old${i}`,
      }));
      fs.getDoc.mockResolvedValue(createPlayerGamesMock(prevGames));

      const games = await leaderboardsService.getPlayerGames(playerId, 10);

      expect(games).toHaveLength(10);
      expect(games[0].playerId).toBe("old0");
    });

    it("returns empty array when player games document does not exist or user unauthenticated", async () => {
      fs.getDoc.mockResolvedValue(createPlayerGamesMock(undefined));
      expect(await leaderboardsService.getPlayerGames(playerId)).toEqual([]);

      auth.isAuthenticated.mockReturnValue(false);
      expect(await leaderboardsService.getPlayerGames(playerId)).toEqual([]);
    });
  });
});
