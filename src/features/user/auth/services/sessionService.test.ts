import { vi, describe, it, expect, beforeEach } from "vitest";
import { sessionService } from "./sessionService";
import { getUserCollection } from "@utils/firebase";
import {
  getBrowserSessionInfo,
  getOrCreateSessionId,
  clearLocalSession,
} from "../utils/session";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { type DocumentReference, type DocumentData } from "firebase/firestore";

vi.mock("../utils/session", () => ({
  getBrowserSessionInfo: vi.fn(() => ({
    userAgent: "mock-browser",
    language: "en-US",
    screen: "1920x1080",
  })),
  getOrCreateSessionId: vi.fn(() => "mock-session-id-123"),
  clearLocalSession: vi.fn(),
}));

describe("sessionService", () => {
  const mockUserId = "user-abc-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchUserSessions", () => {
    it("fetches and transforms document data into an array of user sessions", async () => {
      const fakeSessionData = {
        userId: mockUserId,
        sessionId: "sess-1",
        lastActive: 1000,
      };
      fs.getDocs.mockResolvedValueOnce(
        createMockSnapshot([{ id: "doc-id-1", data: fakeSessionData }]),
      );

      const result = await sessionService.fetchUserSessions(mockUserId);

      expect(getUserCollection).toHaveBeenCalledWith("sessions");
      expect(fs.getDocs).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: "doc-id-1",
          userId: mockUserId,
          sessionId: "sess-1",
          lastActive: 1000,
        },
      ]);
    });
  });

  describe("logSession", () => {
    it("creates a brand new document if an existing session is not found", async () => {
      fs.getDocs.mockResolvedValueOnce(createMockSnapshot([]));

      await sessionService.logSession(mockUserId);

      expect(getBrowserSessionInfo).toHaveBeenCalled();
      expect(getOrCreateSessionId).toHaveBeenCalled();
      expect(fs.addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          userId: mockUserId,
          sessionId: "mock-session-id-123",
          userAgent: "mock-browser",
          lastActive: expect.any(Number),
        }),
      );
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("updates the current snapshot document if it already exists", async () => {
      const fakeRef = {} as DocumentReference<DocumentData, DocumentData>;
      fs.getDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{ ref: fakeRef, id: "existing-id", data: () => ({}) }],
      } as any);

      await sessionService.logSession(mockUserId);

      expect(fs.updateDoc).toHaveBeenCalledWith(
        fakeRef,
        expect.objectContaining({
          userId: mockUserId,
          sessionId: "mock-session-id-123",
          lastActive: expect.any(Number),
        }),
      );
      expect(fs.addDoc).not.toHaveBeenCalled();
    });
  });

  describe("updateCurrentSession", () => {
    it("updates the lastActive field for matched live query sessions", async () => {
      const fakeRef = {} as DocumentReference<DocumentData, DocumentData>;
      fs.getDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{ ref: fakeRef, id: "active-id", data: () => ({}) }],
      } as any);

      await sessionService.updateCurrentSession(mockUserId);

      expect(fs.updateDoc).toHaveBeenCalledWith(
        fakeRef,
        expect.objectContaining({ lastActive: expect.any(Number) }),
      );
    });
  });

  describe("removeSessionById", () => {
    it("deletes the targeted collection document directly via ID lookup references", async () => {
      await sessionService.removeSessionById("target-doc-id");

      expect(fs.doc).toHaveBeenCalledWith(undefined, "target-doc-id");
      expect(fs.deleteDoc).toHaveBeenCalled();
    });
  });

  describe("terminateSession", () => {
    it("deletes matching documents and purges local storage tokens when explicit sessionId is omitted", async () => {
      const fakeRef = {} as DocumentReference<DocumentData, DocumentData>;
      fs.getDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{ ref: fakeRef, id: "active-id", data: () => ({}) }],
      } as any);

      await sessionService.terminateSession(mockUserId);

      expect(fs.deleteDoc).toHaveBeenCalledWith(fakeRef);
      expect(clearLocalSession).toHaveBeenCalled();
    });

    it("deletes matching documents but retains local token flags when targeting a different session identifier", async () => {
      const fakeRef = {} as DocumentReference<DocumentData, DocumentData>;
      fs.getDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{ ref: fakeRef, id: "remote-id", data: () => ({}) }],
      } as any);

      await sessionService.terminateSession(
        mockUserId,
        "different-session-id-789",
      );

      expect(fs.deleteDoc).toHaveBeenCalledWith(fakeRef);
      expect(clearLocalSession).not.toHaveBeenCalled();
    });
  });
});
