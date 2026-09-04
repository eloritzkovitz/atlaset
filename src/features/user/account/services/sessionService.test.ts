import { vi, describe, it, expect, beforeEach } from "vitest";
import { getDocsData, getPaths } from "@lib/firebase";
import { geoService } from "@lib/geo";
import { isLocalhost } from "@utils";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { sessionService } from "./sessionService";
import { getOrCreateSessionId } from "../utils/session";

vi.mock("@utils", () => ({
  isLocalhost: vi.fn(),
}));

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
  const snap = (docs: unknown[]) => ({ empty: !docs.length, docs }) as any;
  const doc = (id: string) => ({ ref: { id }, id, data: () => ({}) }) as any;

  beforeEach(() => {
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

  describe("getCurrentIpAddress", () => {
    it("returns localhost IP when running on localhost", async () => {
      vi.mocked(isLocalhost).mockReturnValue(true);
      expect(await sessionService.getCurrentIpAddress()).toBe("127.0.0.1");
    });

    it("returns IP address from geoService when not on localhost", async () => {
      vi.mocked(isLocalhost).mockReturnValue(false);
      vi.spyOn(geoService, "getGeoData").mockResolvedValueOnce({
        ipAddress: "1.1.1.1",
        location: "TLV, IL",
        countryCode: "IL",
      });

      expect(await sessionService.getCurrentIpAddress()).toBe("1.1.1.1");
    });

    it("returns undefined if geoService fails", async () => {
      vi.mocked(isLocalhost).mockReturnValue(false);
      vi.spyOn(geoService, "getGeoData").mockRejectedValueOnce(
        new Error("Network error"),
      );
      expect(await sessionService.getCurrentIpAddress()).toBeUndefined();
    });
  });

  describe("logSession", () => {
    it.each([
      [
        "creates doc if session missing (localhost)",
        [],
        "addDoc",
        "new-d",
        true,
        "localhost",
        "127.0.0.1",
      ],
      [
        "creates doc if session missing (remote)",
        [],
        "addDoc",
        "new-d",
        false,
        "Loading...",
        "Loading...",
      ],
      [
        "updates doc if session exists",
        [doc("exist-d")],
        "updateDoc",
        "exist-d",
        false,
        undefined,
        undefined,
      ],
    ])(
      "%s",
      async (_, docs, method, expectedId, isLocal, expectedLoc, expectedIp) => {
        vi.mocked(isLocalhost).mockReturnValue(isLocal);
        vi.mocked(getPaths.sub).mockReturnValue("mocked-sessions-col" as any);
        fs.getDocs.mockResolvedValueOnce(snap(docs));
        fs.addDoc.mockResolvedValueOnce({ id: "new-d" } as any);

        const spy = vi
          .spyOn(sessionService, "enrichSessionMetadata")
          .mockResolvedValueOnce();

        await sessionService.logSession(uid);

        if (method === "addDoc") {
          expect(fs.addDoc).toHaveBeenCalledWith(
            "mocked-sessions-col",
            expect.objectContaining({
              location: expectedLoc,
              ipAddress: expectedIp,
            }),
          );
        } else {
          expect(fs.updateDoc).toHaveBeenCalled();
        }

        expect(spy).toHaveBeenCalledWith(uid, expectedId);
      },
    );
  });

  describe("enrichSessionMetadata", () => {
    it("sets localhost metadata directly when running on localhost", async () => {
      vi.mocked(isLocalhost).mockReturnValue(true);
      const getGeoSpy = vi.spyOn(geoService, "getGeoData");

      await sessionService.enrichSessionMetadata(uid, "target-doc-id");

      expect(getPaths.subDoc).toHaveBeenCalledWith(
        uid,
        "sessions",
        "target-doc-id",
      );
      expect(fs.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        ipAddress: "127.0.0.1",
        location: "localhost",
      });
      expect(getGeoSpy).not.toHaveBeenCalled();
    });

    it("fetches and updates metadata from geoService when not on localhost", async () => {
      vi.mocked(isLocalhost).mockReturnValue(false);
      vi.spyOn(geoService, "getGeoData").mockResolvedValueOnce({
        ipAddress: "1.1.1.1",
        location: "TLV, IL",
        countryCode: "IL",
      });

      await sessionService.enrichSessionMetadata(uid, "target-doc-id");

      expect(fs.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        ipAddress: "1.1.1.1",
        location: "TLV, IL",
      });
    });

    it("exits early if geoData returns null", async () => {
      vi.mocked(isLocalhost).mockReturnValue(false);
      vi.spyOn(geoService, "getGeoData").mockResolvedValueOnce(null);

      await sessionService.enrichSessionMetadata(uid, "target-doc-id");

      expect(fs.updateDoc).not.toHaveBeenCalled();
    });

    it("handles rejections quietly", async () => {
      vi.mocked(isLocalhost).mockReturnValue(false);
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
