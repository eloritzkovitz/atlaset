import type { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { leaderboardsService } from "../services/leaderboardsService";
import type { Difficulty, LeaderboardEntry, QuizType } from "../../types";

vi.mock("@app/firebase", () => ({
  db: {},
  __esModule: true,
}));

const mockEntries: LeaderboardEntry[] = Array.from({ length: 26 }, (_, i) => ({
  playerId: `player${i}`,
  playerName: `Player ${i}`,
  score: 100 - i,
  time: i,
  maxStreak: 10,
  date: new Date().toISOString(),
}));

const snapshotDataInput = mockEntries.map((entry, idx) => ({
  id: `doc${idx}`,
  data: entry,
}));

function createPlayerGamesMock(prevGames: LeaderboardEntry[]) {
  return {
    exists: () => true,
    data: () => ({ games: [...prevGames] }),
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
    fs.collection.mockReturnValue({
      id: "mock-collection",
      path: "mock-collection",
    });
    fs.query.mockImplementation((ref) => ref);
    fs.doc.mockImplementation((...args: any[]) => {
      const docId =
        typeof args[args.length - 1] === "string"
          ? args[args.length - 1]
          : "mock-doc-id";
      return { id: docId, path: `mock-path/${docId}` };
    });
  });

  describe("addLeaderboardEntry", () => {
    it("adds a leaderboard entry and enforces top 25 threshold rules", async () => {
      fs.setDoc.mockResolvedValue(undefined);
      fs.deleteDoc.mockResolvedValue(undefined);
      fs.getDocs.mockResolvedValue(
        createMockSnapshot(snapshotDataInput) as any,
      );

      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );

      expect(fs.setDoc).toHaveBeenCalled();
      expect(fs.getDocs).toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalledTimes(1);
    });

    it("skips submission gracefully if unauthenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );
      expect(fs.setDoc).not.toHaveBeenCalled();
    });

    it("skips submission gracefully if active identity profile context resolves to null", async () => {
      auth.getCurrentUser.mockReturnValue(null);
      await leaderboardsService.addLeaderboardEntry(
        quizType,
        difficulty,
        mockEntries[0],
      );
      expect(fs.setDoc).not.toHaveBeenCalled();
    });

    it("rejects execution with an explicitly handled exception bubble if parameters are missing", async () => {
      await expect(
        leaderboardsService.addLeaderboardEntry(
          undefined as any,
          undefined as any,
          mockEntries[0],
        ),
      ).rejects.toThrow();
      expect(fs.setDoc).not.toHaveBeenCalled();
    });
  });

  describe("getLeaderboard", () => {
    it("retrieves partitioned active entries truncated up to a fixed maximum limit of 25 items", async () => {
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

    it("yields an empty fallback matrix if current context is unauthorized", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      const entries = await leaderboardsService.getLeaderboard(
        quizType,
        difficulty,
      );
      expect(entries).toEqual([]);
    });
  });

  describe("Player Progress Storage Operations", () => {
    const playerId = "player1";

    it("commits safe tracking deltas and updates database arrays capped by custom maximum rules", async () => {
      const prevGames = Array.from({ length: 12 }, (_, i) => ({
        ...mockEntries[0],
        playerId: `old${i}`,
      }));
      fs.getDoc.mockResolvedValue(createPlayerGamesMock(prevGames));
      fs.setDoc.mockResolvedValue(undefined);

      await leaderboardsService.savePlayerGame(playerId, mockEntries[0], 10);

      expect(fs.setDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: "player1" }),
        expect.objectContaining({
          games: expect.arrayContaining([
            expect.objectContaining({ playerId: "player0" }),
          ]),
        }),
      );
    });

    it("bypasses physical state writes when execution blocks fall outside active authenticated constraints", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await leaderboardsService.savePlayerGame(playerId, mockEntries[0], 10);
      expect(fs.setDoc).not.toHaveBeenCalled();
    });

    it("retrieves historical performance arrays bound cleanly by maximum limits", async () => {
      const prevGames = Array.from({ length: 12 }, (_, i) => ({
        ...mockEntries[0],
        playerId: `old${i}`,
      }));
      fs.getDoc.mockResolvedValue(createPlayerGamesMock(prevGames));

      const games = await leaderboardsService.getPlayerGames(playerId, 10);

      expect(games).toHaveLength(10);
      expect(games[0].playerId).toBe("old0");
    });

    it("yields empty structural tracking metrics if connection boundaries fallback to guest context", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      const games = await leaderboardsService.getPlayerGames(playerId, 10);
      expect(games).toEqual([]);
    });
  });
});
