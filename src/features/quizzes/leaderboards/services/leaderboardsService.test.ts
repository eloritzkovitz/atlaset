import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Difficulty, LeaderboardEntry, QuizType } from "../../types";

vi.mock("@utils/firebase", () => ({
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
  __esModule: true,
}));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  where: vi.fn(),
  deleteDoc: vi.fn(),
  __esModule: true,
}));
vi.mock("../../../user", () => ({
  logUserActivity: vi.fn(),
  __esModule: true,
}));
vi.mock("@firebase", () => ({
  db: {},
  __esModule: true,
}));

import { leaderboardsService } from "../services/leaderboardsService";

const mockEntries: LeaderboardEntry[] = Array.from({ length: 26 }, (_, i) => ({
  playerId: `player${i}`,
  playerName: `Player ${i}`,
  score: 100 - i,
  time: i,
  maxStreak: 10,
  date: new Date().toISOString(),
}));

function createMockDoc(entry: LeaderboardEntry, idx: number) {
  return {
    id: `doc${idx}`,
    ref: { id: `doc${idx}` },
    data: () => entry,
    exists: () => true,
    metadata: {
      hasPendingWrites: false,
      fromCache: false,
      isEqual: () => false,
    },
    get: () => undefined,
    toJSON: () => entry,
  } as unknown as import("firebase/firestore").QueryDocumentSnapshot<
    unknown,
    import("firebase/firestore").DocumentData
  >;
}

function createMockSnapshot(entries: LeaderboardEntry[]) {
  const docs = entries.map(createMockDoc);
  return {
    docs,
    metadata: {
      hasPendingWrites: false,
      fromCache: false,
      isEqual: () => false,
    },
    query: {},
    size: docs.length,
    empty: docs.length === 0,
    forEach: (fn: any) => docs.forEach(fn),
    docChanges: () => [],
    isEqual: () => false,
  } as unknown as import("firebase/firestore").QuerySnapshot<
    unknown,
    import("firebase/firestore").DocumentData
  >;
}

const quizType: QuizType = "flag";
const difficulty: Difficulty = "easy";

function createPlayerGamesMock(prevGames: LeaderboardEntry[]) {
  return {
    exists: function () {
      return true;
    } as () => this is import("firebase/firestore").DocumentSnapshot<
      unknown,
      import("firebase/firestore").DocumentData
    >,
    data: () => ({ games: prevGames }),
    metadata: {
      hasPendingWrites: false,
      fromCache: false,
      isEqual: () => false,
    },
    get: () => undefined,
    toJSON: () => ({ games: prevGames }),
    id: "mockDocId",
    ref: { id: "mockDocId" },
  } as unknown as import("firebase/firestore").DocumentSnapshot<
    unknown,
    import("firebase/firestore").DocumentData
  >;
}

import * as firestore from "firebase/firestore";
import * as firebaseUtils from "@utils/firebase";
const setDocMock = vi.mocked(firestore.setDoc);
const deleteDocMock = vi.mocked(firestore.deleteDoc);
const getDocsMock = vi.mocked(firestore.getDocs);
const getDocMock = vi.mocked(firestore.getDoc);
const isAuthenticatedMock = vi.mocked(firebaseUtils.isAuthenticated);
const getCurrentUserMock = vi.mocked(firebaseUtils.getCurrentUser);

describe("leaderboardsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({
      uid: "test-user",
      displayName: "Test User",
    } as unknown as import("firebase/auth").User);
  });

  it("should add a leaderboard entry and enforce top 25 limit", async () => {
    setDocMock.mockResolvedValue(undefined);
    deleteDocMock.mockResolvedValue(undefined);
    getDocsMock.mockResolvedValue(createMockSnapshot(mockEntries));

    await leaderboardsService.addLeaderboardEntry(
      quizType,
      difficulty,
      mockEntries[0],
    );
    expect(setDocMock).toHaveBeenCalled();
    expect(getDocsMock).toHaveBeenCalled();
    expect(deleteDocMock).toHaveBeenCalledTimes(1);
  });

  it("should not add leaderboard entry if unauthenticated", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await leaderboardsService.addLeaderboardEntry(
      quizType,
      difficulty,
      mockEntries[0],
    );
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it("should not add leaderboard entry if user is null", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue(null);
    await leaderboardsService.addLeaderboardEntry(
      quizType,
      difficulty,
      mockEntries[0],
    );
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it("should not add leaderboard entry if type/difficulty undefined", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue({
      uid: "test-user",
      displayName: "Test User",
    } as unknown as import("firebase/auth").User);
    await expect(
      leaderboardsService.addLeaderboardEntry(
        undefined as any,
        undefined as any,
        mockEntries[0],
      ),
    ).rejects.toThrow();
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it("should retrieve leaderboard entries (max 25)", async () => {
    getDocsMock.mockResolvedValue(createMockSnapshot(mockEntries.slice(0, 25)));
    const entries = await leaderboardsService.getLeaderboard(
      quizType,
      difficulty,
    );
    expect(entries.length).toBe(25);
    expect(entries[0].score).toBe(100);
  });

  it("should return empty leaderboard if unauthenticated", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    const entries = await leaderboardsService.getLeaderboard(
      quizType,
      difficulty,
    );
    expect(entries).toEqual([]);
  });

  it("should save player game and trim to maxGames", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const playerId = "player1";
    const entry = mockEntries[0];
    const prevGames = Array.from({ length: 12 }, (_, i) => ({
      ...entry,
      playerId: `old${i}`,
    }));
    const docSnap = createPlayerGamesMock(prevGames);
    getDocMock.mockResolvedValue(docSnap);
    setDocMock.mockResolvedValue(undefined);
    await leaderboardsService.savePlayerGame(playerId, entry, 10);
    expect(setDocMock).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ games: expect.any(Array) }),
    );
    const games = (docSnap.data() as { games: LeaderboardEntry[] }).games;
    expect(games.length).toBe(10);
    expect(games[0]).toEqual(entry);
  });

  it("should not save player game if unauthenticated", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    const playerId = "player1";
    const entry = mockEntries[0];
    await leaderboardsService.savePlayerGame(playerId, entry, 10);
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it("should get player games and trim to maxGames", async () => {
    isAuthenticatedMock.mockReturnValue(true);
    const playerId = "player1";
    const prevGames = Array.from({ length: 12 }, (_, i) => ({
      ...mockEntries[0],
      playerId: `old${i}`,
    }));
    getDocMock.mockResolvedValue(createPlayerGamesMock(prevGames));
    const games = await leaderboardsService.getPlayerGames(playerId, 10);
    expect(games.length).toBe(10);
    expect(games[0].playerId).toBe("old0");
  });

  it("should return empty player games if unauthenticated", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    const playerId = "player1";
    const games = await leaderboardsService.getPlayerGames(playerId, 10);
    expect(games).toEqual([]);
  });
});
