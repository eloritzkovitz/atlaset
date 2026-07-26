import { vi, describe, it, expect, beforeEach } from "vitest";
import { getDocsData, getPaths, getUserCollection } from "@lib/firebase";
import { geoService } from "@lib/geo";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { sessionService } from "./sessionService";
import { clearLocalSession } from "../utils/session";

vi.mock("../utils/session", () => ({
  getBrowserSessionInfo: () => ({
    userAgent: "mock",
    language: "en",
    screen: "1x1",
  }),
  getOrCreateSessionId: () => "mock-sess-123",
  clearLocalSession: vi.fn(),
}));

describe("sessionService", () => {
  const uid = "user-abc-456";
  const snap = (docs: any[]) => ({ empty: !docs.length, docs }) as any;
  const doc = (id: string) => ({ ref: { id }, id, data: () => ({}) }) as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetchUserSessions: maps documents to clean lists", async () => {
    vi.mocked(getDocsData).mockResolvedValueOnce([
      { id: "d1", userId: uid },
    ] as any);
    expect(await sessionService.fetchUserSessions(uid)).toEqual([
      { id: "d1", userId: uid },
    ]);
    expect(getPaths.sub).toHaveBeenCalledWith(uid, "sessions");
  });

  describe("logSession", () => {
    it.each([
      ["creates doc if session missing", [], "addDoc", "new-d"],
      [
        "updates doc if session exists",
        [doc("exist-d")],
        "updateDoc",
        "exist-d",
      ],
    ])("%s", async (_, docs, method, expectedId) => {
      fs.getDocs.mockResolvedValueOnce(snap(docs));
      fs.addDoc.mockResolvedValueOnce({ id: "new-d" } as any);
      const spy = vi
        .spyOn(sessionService, "enrichSessionMetadata")
        .mockResolvedValueOnce();

      await sessionService.logSession(uid);
      expect((fs as any)[method]).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(uid, expectedId);
    });
  });

  describe("enrichSessionMetadata", () => {
    const runEnrich = (ok: boolean, payload: any) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({ ok, json: async () => payload }),
      );
      return sessionService.enrichSessionMetadata(uid, "target-doc-id");
    };

    it.each([
      [
        "saves city + country",
        { ip: "1.1", city: "TLV", country: "IL" },
        "1.1",
        "TLV, IL",
      ],
      ["falls back to country only", { ip: "1.1", country: "IL" }, "1.1", "IL"],
      ["handles missing keys", {}, "Unknown IP", "Unknown Location"],
    ])("%s", async (_, payload, ipAddress, location) => {
      await runEnrich(true, payload);
      expect(getPaths.subDoc).toHaveBeenCalledWith(
        uid,
        "sessions",
        "target-doc-id",
      );
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        ipAddress,
        location,
      });
    });

    it("exits early on network failure", async () => {
      await runEnrich(false, null);
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("handles rejections quietly", async () => {
      vi.spyOn(geoService, "getGeoData").mockRejectedValueOnce(
        new Error("Net"),
      );
      await sessionService.enrichSessionMetadata(uid, "target-doc-id");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to quietly enrich session metadata:",
        expect.any(Error),
      );
    });
  });

  describe("updateCurrentSession", () => {
    it("patches lastActive on matched sessions", async () => {
      fs.getDocs.mockResolvedValueOnce(snap([doc("a")]));
      await sessionService.updateCurrentSession(uid);
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        lastActive: expect.any(Number),
      });
    });

    it("skips updates when no session matches", async () => {
      fs.getDocs.mockResolvedValueOnce(snap([]));
      await sessionService.updateCurrentSession(uid);
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("logs DB error on query failure", async () => {
      fs.getDocs.mockRejectedValueOnce(new Error("DB"));
      await sessionService.updateCurrentSession(uid);
      expect(console.error).toHaveBeenCalledWith(
        "Failed to update current session activity:",
        expect.any(Error),
      );
    });
  });

  it("removeSession: deletes target session document", async () => {
    await sessionService.removeSession({
      id: "sess-123",
      userId: uid,
      sessionId: "abc",
    } as any);
    expect(getUserCollection).toHaveBeenCalledWith("sessions");
    expect(fs.deleteDoc).toHaveBeenCalled();
  });

  describe("terminateSession", () => {
    it.each([
      ["deletes doc & clears storage for current session", undefined, 1],
      ["deletes doc without clearing storage for remote session", "diff-id", 0],
    ])("%s", async (_, targetId, clearCount) => {
      fs.getDocs.mockResolvedValueOnce(snap([doc("a")]));
      await sessionService.terminateSession(uid, targetId);
      expect(fs.deleteDoc).toHaveBeenCalled();
      expect(clearLocalSession).toHaveBeenCalledTimes(clearCount);
    });
  });
});
