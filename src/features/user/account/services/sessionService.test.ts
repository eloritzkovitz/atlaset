import { vi, describe, it, expect, beforeEach } from "vitest";
import { getDocsData, getPaths } from "@lib/firebase";
import { geoService } from "@lib/geo";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { sessionService } from "./sessionService";
import { getOrCreateSessionId } from "../utils/session";

vi.mock("../utils/session", () => ({
  getBrowserSessionInfo: () => ({
    userAgent: "mock",
    language: "en",
    screen: "1x1",
  }),
  getOrCreateSessionId: vi.fn(() => "mock-sess-123"),
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

  describe("terminateSession", () => {
    it("deletes a session document directly by docId", async () => {
      const mockDocId = "doc-789";

      await sessionService.terminateSession(uid, mockDocId);

      expect(getPaths.subDoc).toHaveBeenCalledWith(uid, "sessions", mockDocId);
      expect(fs.deleteDoc).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe("terminateCurrentSession", () => {
    it("queries matching session by current sessionId and deletes all matching docs", async () => {
      const mockDoc1 = doc("doc-1");
      const mockDoc2 = doc("doc-2");

      fs.getDocs.mockResolvedValueOnce(snap([mockDoc1, mockDoc2]));

      await sessionService.terminateCurrentSession(uid);

      expect(getOrCreateSessionId).toHaveBeenCalled();
      expect(getPaths.sub).toHaveBeenCalledWith(uid, "sessions");
      expect(fs.getDocs).toHaveBeenCalled();
      expect(fs.deleteDoc).toHaveBeenCalledTimes(2);
      expect(fs.deleteDoc).toHaveBeenNthCalledWith(1, mockDoc1.ref);
      expect(fs.deleteDoc).toHaveBeenNthCalledWith(2, mockDoc2.ref);
    });

    it("handles cases gracefully when no matching session document exists", async () => {
      fs.getDocs.mockResolvedValueOnce(snap([]));

      await sessionService.terminateCurrentSession(uid);

      expect(fs.getDocs).toHaveBeenCalled();
      expect(fs.deleteDoc).not.toHaveBeenCalled();
    });
  });
});
