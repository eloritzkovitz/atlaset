import {
  type QuerySnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { getDocsData, getPaths, getUserCollection } from "@lib/firebase";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { sessionService } from "./sessionService";
import { clearLocalSession } from "../utils/session";

vi.mock("../utils/session", () => ({
  getBrowserSessionInfo: vi.fn(() => ({
    userAgent: "mock-browser",
    language: "en-US",
    screen: "1920x1080",
  })),
  getOrCreateSessionId: vi.fn(() => "mock-sess-123"),
  clearLocalSession: vi.fn(),
}));

describe("sessionService", () => {
  const uid = "user-abc-456";
  const mockSnap = (docs: any[]) =>
    ({ empty: docs.length === 0, docs }) as unknown as QuerySnapshot<any>;
  const mockDoc = (id: string) =>
    ({
      ref: { id },
      id,
      data: () => ({}),
    }) as unknown as QueryDocumentSnapshot<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetchUserSessions: maps documents to clean lists", async () => {
    vi.mocked(getDocsData).mockResolvedValueOnce([
      { id: "d1", userId: uid, lastActive: 1 } as any,
    ]);
    const res = await sessionService.fetchUserSessions(uid);
    expect(getPaths.sub).toHaveBeenCalledWith(uid, "sessions");
    expect(res).toEqual([{ id: "d1", userId: uid, lastActive: 1 }]);
  });

  describe("logSession", () => {
    it.each([
      ["creates doc if empty", [], "addDoc", "new-d"],
      [
        "updates target row directly if session exists",
        [mockDoc("exist-d")],
        "updateDoc",
        "exist-d",
      ],
    ])("%s", async (_, docs, method, expectedId) => {
      fs.getDocs.mockResolvedValueOnce(mockSnap(docs));
      fs.addDoc.mockResolvedValueOnce({ id: "new-d" } as any);
      const spy = vi
        .spyOn(sessionService, "enrichSessionWithGeoData")
        .mockResolvedValueOnce();

      await sessionService.logSession(uid);
      expect((fs as any)[method]).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(uid, expectedId);
    });
  });

  describe("enrichSessionWithGeoData", () => {
    const runEnrich = async (ok: boolean, payload: any) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({ ok, json: async () => payload }),
      );
      await sessionService.enrichSessionWithGeoData(uid, "target-doc-id");
    };

    it.each([
      [
        "saves paired city and country formatting",
        { ip: "1.1", city: "TLV", country: "IL" },
        "1.1",
        "TLV, IL",
      ],
      [
        "gracefully falls back to country string if city is absent",
        { ip: "1.1", country: "IL" },
        "1.1",
        "IL",
      ],
      [
        "handles missing geo keys gracefully using fallback string values",
        {},
        "Unknown IP",
        "Unknown Location",
      ],
    ])("%s", async (_, payload, ip, loc) => {
      await runEnrich(true, payload);
      expect(getPaths.subDoc).toHaveBeenCalledWith(
        uid,
        "sessions",
        "target-doc-id",
      );
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        ipAddress: ip,
        location: loc,
      });
    });

    it("exits early without updates on network non-ok failures", async () => {
      await runEnrich(false, null);
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("swallows rejections and safely forwards to terminal console error logs", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Net")));
      await sessionService.enrichSessionWithGeoData(uid, "target-doc-id");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to quietly enrich session metadata:",
        expect.any(Error),
      );
    });
  });

  describe("updateCurrentSession", () => {
    it("patches lastActive stamp on matched sessions", async () => {
      fs.getDocs.mockResolvedValueOnce(mockSnap([mockDoc("a")]));
      await sessionService.updateCurrentSession(uid);
      expect(fs.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ lastActive: expect.any(Number) }),
      );
    });

    it("skips writing updates if the query collection returns an empty matching array", async () => {
      fs.getDocs.mockResolvedValueOnce(mockSnap([]));
      await sessionService.updateCurrentSession(uid);
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("catches internal query execution faults and bubbles error stack down", async () => {
      fs.getDocs.mockRejectedValueOnce(new Error("DB"));
      await sessionService.updateCurrentSession(uid);
      expect(console.error).toHaveBeenCalledWith(
        "Failed to update current session activity:",
        expect.any(Error),
      );
    });
  });

  it("removeSessionById: hits direct collection lookup reference path", async () => {
    await sessionService.removeSessionById("target");
    expect(getUserCollection).toHaveBeenCalledWith("sessions");
    expect(fs.deleteDoc).toHaveBeenCalled();
  });

  describe("terminateSession", () => {
    it.each([
      [
        "destroys matching row and clears storage on current active matches",
        undefined,
        true,
      ],
      [
        "removes database records but protects storage when killing remote layouts",
        "diff-id",
        false,
      ],
    ])("%s", async (_, inputId, shouldClear) => {
      fs.getDocs.mockResolvedValueOnce(mockSnap([mockDoc("a")]));
      await sessionService.terminateSession(uid, inputId);
      expect(fs.deleteDoc).toHaveBeenCalled();
      expect(clearLocalSession).toHaveBeenCalledTimes(shouldClear ? 1 : 0);
    });
  });
});
