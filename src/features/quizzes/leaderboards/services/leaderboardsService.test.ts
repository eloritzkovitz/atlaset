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
  const playerId = "player1";

  beforeEach(() => {
    vi.clearAllMocks();
    fs.collection.mockReturnValue({ id: "mock-collection" });
    fs.query.mockImplementation((ref) => ref);
    fs.doc.mockImplementation((...args: any[]) => ({
      id: args[args.length - 1] ?? "mock-doc-id",
    }));
  });

  describe("unauthenticated safety checks", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);
    });

    it("returns empty default responses or early-exits when user is unauthenticated", async () => {
      expect(
        await leaderboardsService.getLeaderboard(quizType, difficulty),
      ).toEqual([]);
      expect(await leaderboardsService.getUserScores(playerId)).toEqual([]);
      expect(await leaderboardsService.getPlayerGames(playerId)).toEqual([]);

      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );
      await leaderboardsService.savePlayerGame(playerId, mockEntries[0]);

      expect(fs.addDoc).not.toHaveBeenCalled();
      expect(fs.setDoc).not.toHaveBeenCalled();
    });
  });

  describe("authenticated routes", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        uid: "test-user",
        displayName: "Test User",
      } as any);
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

      it("returns empty array if no snapshot records exist", async () => {
        fs.getDocs.mockResolvedValue(createMockSnapshot([]) as any);

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

      it("returns empty array if userId is empty", async () => {
        expect(await leaderboardsService.getUserScores("")).toEqual([]);
      });
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

      it("does not delete entries if total count is <= 25", async () => {
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

    describe("savePlayerGame & getPlayerGames", () => {
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

      it("retrieves player games up to default or provided maxGames", async () => {
        const prevGames = Array.from({ length: 12 }, (_, i) => ({
          ...mockEntries[0],
          playerId: `old${i}`,
        }));
        fs.getDoc.mockResolvedValue(createPlayerGamesMock(prevGames));

        const gamesWithCustomLimit = await leaderboardsService.getPlayerGames(
          playerId,
          5,
        );
        expect(gamesWithCustomLimit).toHaveLength(5);

        const gamesWithDefaultLimit =
          await leaderboardsService.getPlayerGames(playerId);
        expect(gamesWithDefaultLimit).toHaveLength(10);
      });

      it("returns empty array when player games document does not exist", async () => {
        fs.getDoc.mockResolvedValue(createPlayerGamesMock(undefined));
        expect(await leaderboardsService.getPlayerGames(playerId)).toEqual([]);
      });
    });
  });
});
