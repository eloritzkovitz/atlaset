import i18n from "i18next";
import { describe, it, expect, vi } from "vitest";
import { authState, createMockUser } from "@test-utils/authMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import * as firebaseUtils from "@utils/firebase";
import * as activityUtils from "./activity";

const mockUser = createMockUser();

function mockI18nTemplate(key: number | string, template: string) {
  vi.spyOn(i18n, "t").mockImplementationOnce((...args: any[]) => {
    const k = args[0];
    const opts = args[1];
    const kk = String(k).split(":").pop();
    if (kk === String(key)) return template;
    return opts?.defaultValue ?? "{userName} did something.";
  });
}

function getChildren(action: number, details: Record<string, unknown>) {
  const desc = activityUtils.getActivityDescription(action, details as any);
  return desc.props.children as any[];
}

function findQuotedSpans(children: any[]) {
  return children.filter(
    (part: any) => part?.props?.className === "text-info font-bold",
  );
}

function hasText(children: any[], text: string) {
  return (
    children.some(
      (part: any) => typeof part === "string" && part.includes(text),
    ) || children.some((part: any) => part?.props?.children === text)
  );
}

import type { CollectionReference, DocumentData } from "firebase/firestore";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(i18n, "t").mockImplementation((...args: any[]) => {
    const opts = args[1];
    return opts?.defaultValue ?? "{userName} did something.";
  });
});
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: authState.currentUser,
    app: {} as any,
    name: "",
    config: {},
    setPersistence: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  })),
  onAuthStateChanged: vi.fn(),
}));
vi.mock("./firebase", async () => {
  const actual =
    await vi.importActual<typeof import("@app/firebase")>("./firebase");
  return {
    ...actual,
    getCurrentUser: vi.fn(() => mockUser),
  };
});

describe("logUserActivity", () => {
  it("calls addDoc with correct params", async () => {
    const mockAddDoc = fs.addDoc as unknown as jest.Mock;
    if (mockAddDoc.mockClear) mockAddDoc.mockClear();
    const mockCollection = {} as unknown as CollectionReference<DocumentData>;
    const getUserCollection = vi.spyOn(firebaseUtils, "getUserCollection");
    getUserCollection.mockReturnValue(mockCollection);
    await activityUtils.logUserActivity(101, { foo: "bar" }, "uid123");
    expect(fs.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: 101,
        details: { foo: "bar" },
        uid: "uid123",
        timestamp: expect.any(Number),
      }),
    );
    getUserCollection.mockRestore();
  });
});

describe("getActivityDescription", () => {
  it("renders a template with details and quoted formatting", () => {
    mockI18nTemplate(211, "{userName} added '{itemName}'.");
    const children = getChildren(211, {
      userName: "Alice",
      itemName: "TestItem",
    });
    expect(hasText(children, "Alice")).toBeTruthy();
    expect(findQuotedSpans(children)[0].props.children).toBe("TestItem");
  });

  it("renders quoted text with correct formatting", () => {
    mockI18nTemplate(212, "{userName} edited '{itemName}' at '{location}'.");
    const children = getChildren(212, {
      userName: "Bob",
      itemName: "ItemX",
      location: "PlaceY",
    });
    const coloredSpans = findQuotedSpans(children);
    expect(coloredSpans.length).toBe(2);
    expect(coloredSpans[0].props.children).toBe("ItemX");
    expect(coloredSpans[1].props.children).toBe("PlaceY");
  });

  it("uses default for missing userName", () => {
    const children = getChildren(101, {});
    expect(hasText(children, "You")).toBeTruthy();
  });

  it("returns fallback for unknown event", () => {
    const children = getChildren(8888, { userName: "Bob" });
    expect(hasText(children, "Bob")).toBeTruthy();
    expect(hasText(children, "did something")).toBeTruthy();
  });

  it("returns empty string for unknown placeholder", () => {
    mockI18nTemplate(0, "{userName} did {unknownKey}.");
    const children = getChildren(0, { userName: "Eve" });
    expect(hasText(children, "Eve")).toBeTruthy();
    expect(hasText(children, "did ")).toBeTruthy();
  });

  it("renders correctly when there is no quoted text", () => {
    mockI18nTemplate(120, "{userName} updated their profile.");
    const children = getChildren(120, { userName: "Sam" });
    expect(hasText(children, "Sam")).toBeTruthy();
    expect(hasText(children, "updated their profile")).toBeTruthy();
  });

  it("formats numeric time using formatTimeSeconds", () => {
    mockI18nTemplate(301, "{userName} finished in {time}.");
    const children = getChildren(301, { userName: "Alex", time: 75 });
    expect(hasText(children, "1:15")).toBeTruthy();
  });
});

describe("getActivityIcon", () => {
  const cases: Array<[number[], string]> = [
    [[101, 102, 103, 104, 110, 111], "FaCircleUser"],
    [[120], "FaUser"],
    [[130], "FaGear"],
    [[140], "FaUserGroup"],
    [[200], "FaEarthAmericas"],
    [[210, 219], "FaLayerGroup"],
    [[220, 223], "FaMapPin"],
    [[230, 239], "FaMap"],
    [[300, 309], "FaQuestion"],
    [[400, 415], "FaSuitcaseRolling"],
    [[8888, 9999], "FaRegClock"],
  ];

  cases.forEach(([codes, expected]) => {
    it(`returns ${expected} for codes ${codes.join(",")}`, () => {
      codes.forEach((code) => {
        const icon = activityUtils.getActivityIcon(code);
        expect(icon.type.name).toBe(expected);
      });
    });
  });
});
