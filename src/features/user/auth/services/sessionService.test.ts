import {
  type QuerySnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { getUserCollection } from "@lib/firebase";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
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
    fs.doc.mockImplementation((_col: any, id: string) => ({ id }));
  });

  it("fetchUserSessions: maps documents to clean lists", async () => {
    fs.getDocs.mockResolvedValueOnce(
      createMockSnapshot([{ id: "d1", data: { userId: uid, lastActive: 1 } }]),
    );
    const res = await sessionService.fetchUserSessions(uid);
    expect(getUserCollection).toHaveBeenCalledWith("sessions");
    expect(res).toEqual([{ id: "d1", userId: uid, lastActive: 1 }]);
  });

  describe("logSession", () => {
    it("creates doc if empty and initializes background enrichment loop", async () => {
      fs.getDocs.mockResolvedValueOnce(mockSnap([]));
      fs.addDoc.mockResolvedValueOnce({ id: "new-d" } as any);
      const spy = vi
        .spyOn(sessionService, "enrichSessionWithGeoData")
        .mockResolvedValueOnce();

      await sessionService.logSession(uid);
      expect(fs.addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ userId: uid, ipAddress: "Loading..." }),
      );
      expect(spy).toHaveBeenCalledWith("new-d");
    });

    it("updates target row directly if session exists", async () => {
      const docInstance = mockDoc("exist-d");
      fs.getDocs.mockResolvedValueOnce(mockSnap([docInstance]));
      const spy = vi
        .spyOn(sessionService, "enrichSessionWithGeoData")
        .mockResolvedValueOnce();

      await sessionService.logSession(uid);
      expect(fs.updateDoc).toHaveBeenCalledWith(
        docInstance.ref,
        expect.objectContaining({ userId: uid }),
      );
      expect(spy).toHaveBeenCalledWith("exist-d");
    });
  });

  describe("enrichSessionWithGeoData", () => {
    const runEnrich = async (ok: boolean, payload: any) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({ ok, json: async () => payload }),
      );
      await sessionService.enrichSessionWithGeoData("target-doc-id");
    };

    it("saves paired city and country formatting", async () => {
      await runEnrich(true, { ip: "1.1", city: "TLV", country: "IL" });
      expect(fs.doc).toHaveBeenCalledWith(undefined, "target-doc-id");
      expect(fs.updateDoc).toHaveBeenCalledWith(
        { id: "target-doc-id" },
        { ipAddress: "1.1", location: "TLV, IL" },
      );
    });

    it("gracefully falls back to country string if city is absent", async () => {
      await runEnrich(true, { ip: "1.1", country: "IL" });
      expect(fs.updateDoc).toHaveBeenCalledWith(
        { id: "target-doc-id" },
        { ipAddress: "1.1", location: "IL" },
      );
    });

    it("handles missing geo keys gracefully using fallback string values", async () => {
      await runEnrich(true, {});
      expect(fs.updateDoc).toHaveBeenCalledWith(
        { id: "target-doc-id" },
        { ipAddress: "Unknown IP", location: "Unknown Location" },
      );
    });

    it("exits early without updates on network non-ok failures", async () => {
      await runEnrich(false, null);
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("swallows rejections and safely forwards to terminal console error logs", async () => {
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Net")));
      await sessionService.enrichSessionWithGeoData("target-doc-id");
      expect(errSpy).toHaveBeenCalledWith(
        "Failed to quietly enrich session metadata:",
        expect.any(Error),
      );
    });
  });

  describe("updateCurrentSession", () => {
    it("patches lastActive stamp on matched sessions", async () => {
      const docInstance = mockDoc("a");
      fs.getDocs.mockResolvedValueOnce(mockSnap([docInstance]));
      await sessionService.updateCurrentSession(uid);
      expect(fs.updateDoc).toHaveBeenCalledWith(
        docInstance.ref,
        expect.objectContaining({ lastActive: expect.any(Number) }),
      );
    });

    it("skips writing updates if the query collection returns an empty matching array", async () => {
      fs.getDocs.mockResolvedValueOnce(mockSnap([]));
      await sessionService.updateCurrentSession(uid);
      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("catches internal query execution faults and bubbles error stack down", async () => {
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      fs.getDocs.mockRejectedValueOnce(new Error("DB"));
      await sessionService.updateCurrentSession(uid);
      expect(errSpy).toHaveBeenCalledWith(
        "Failed to update current session activity:",
        expect.any(Error),
      );
    });
  });

  it("removeSessionById: hits direct collection lookup reference path", async () => {
    await sessionService.removeSessionById("target");
    expect(fs.doc).toHaveBeenCalledWith(undefined, "target");
    expect(fs.deleteDoc).toHaveBeenCalled();
  });

  describe("terminateSession", () => {
    it("destroys matching row and clears storage on current active matches", async () => {
      const docInstance = mockDoc("a");
      fs.getDocs.mockResolvedValueOnce(mockSnap([docInstance]));
      await sessionService.terminateSession(uid);
      expect(fs.deleteDoc).toHaveBeenCalledWith(docInstance.ref);
      expect(clearLocalSession).toHaveBeenCalled();
    });

    it("removes database records but protects storage when killing remote layouts", async () => {
      const docInstance = mockDoc("r");
      fs.getDocs.mockResolvedValueOnce(mockSnap([docInstance]));
      await sessionService.terminateSession(uid, "diff-id");
      expect(fs.deleteDoc).toHaveBeenCalledWith(docInstance.ref);
      expect(clearLocalSession).not.toHaveBeenCalled();
    });
  });
});
