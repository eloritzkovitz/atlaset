import i18n from "i18next";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ACTIONS, type Action } from "@constants/actions";
import { ICONS } from "@constants/icons";
import { authState, createMockUser } from "@test-utils/authMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import * as firebaseUtils from "@lib/firebase";
import * as activityUtils from "./activity";
import type { CollectionReference, DocumentData } from "firebase/firestore";

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

function getSegments(action: Action, details?: Record<string, unknown>) {
  return activityUtils.getActivityDescription(action, details as any);
}

function findSegmentsByType(
  segments: activityUtils.DescriptionSegment[],
  type: string,
) {
  return segments.filter((s) => s.type === type);
}

function hasSegmentText(
  segments: activityUtils.DescriptionSegment[],
  text: string,
) {
  return segments.some((s) => s.text.includes(text));
}

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
    await vi.importActual<typeof import("@lib/firebase")>("./firebase");
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

describe("getEventName", () => {
  it("returns default action name when no translation template is found", () => {
    mockI18nTemplate(999, "");
    const eventName = activityUtils.getEventName(999);
    expect(eventName).toBe("action_999");
  });

  it("sanitizes translation template and strips userName and date placeholders", () => {
    mockI18nTemplate(101, "{userName} updated settings on {date}!");
    const eventName = activityUtils.getEventName(101);
    expect(eventName).toBe("updated_settings_on");
  });

  it("strips raw curly braces and special characters", () => {
    mockI18nTemplate(202, "Created '{itemName}' @ location $100!");
    const eventName = activityUtils.getEventName(202);
    expect(eventName).toBe("created_itemname_location_100");
  });

  it("limits length to 40 characters and trims trailing underscores", () => {
    mockI18nTemplate(
      500,
      "This is an exceptionally long translation template that exceeds forty characters and needs truncation",
    );
    const eventName = activityUtils.getEventName(500);
    expect(eventName).toBe("this_is_an_exceptionally_long_translatio");
    expect(eventName.length).toBeLessThanOrEqual(40);
    expect(eventName.endsWith("_")).toBeFalsy();
  });

  it("falls back to action_ID if sanitization wipes out the entire string", () => {
    mockI18nTemplate(600, "{userName} {date} !!!");
    const eventName = activityUtils.getEventName(600);
    expect(eventName).toBe("action_600");
  });
});

describe("getActivityDescription", () => {
  it("renders a template with details and quoted formatting", () => {
    mockI18nTemplate(211, "{userName} added '{itemName}'.");
    const segments = getSegments(211, {
      userName: "Alice",
      itemName: "TestItem",
    });

    expect(hasSegmentText(segments, "Alice")).toBeTruthy();
    const itemSegments = findSegmentsByType(segments, "item");
    expect(itemSegments).toHaveLength(1);
    expect(itemSegments[0].text).toBe("TestItem");
  });

  it("renders quoted text with correct formatting", () => {
    mockI18nTemplate(212, "{userName} edited '{itemName}' at '{location}'.");
    const segments = getSegments(212, {
      userName: "Bob",
      itemName: "ItemX",
      location: "PlaceY",
    });

    const itemSegments = findSegmentsByType(segments, "item");
    expect(itemSegments).toHaveLength(2);
    expect(itemSegments[0].text).toBe("ItemX");
    expect(itemSegments[1].text).toBe("PlaceY");
  });

  it("renders friendName correctly as a username segment", () => {
    mockI18nTemplate(142, "{userName} is now friends with {friendName}.");
    const segments = getSegments(142, {
      userName: "Alice",
      friendName: "Bob",
    });

    const usernameSegments = findSegmentsByType(segments, "username");
    expect(usernameSegments).toHaveLength(2);
    expect(usernameSegments[0].text).toBe("Alice");
    expect(usernameSegments[1].text).toBe("Bob");
  });

  it("uses fallback 'a friend' for missing friendName", () => {
    mockI18nTemplate(142, "{userName} is now friends with {friendName}.");
    const segments = getSegments(142, {
      userName: "Alice",
    });

    const usernameSegments = findSegmentsByType(segments, "username");
    expect(usernameSegments).toHaveLength(2);
    expect(usernameSegments[1].text).toBe("a friend");
  });

  it("uses default for missing userName", () => {
    const segments = getSegments(101, {});
    const usernameSegments = findSegmentsByType(segments, "username");
    expect(usernameSegments).toHaveLength(1);
    expect(usernameSegments[0].text).toBe("You");
  });

  it("returns fallback for unknown event", () => {
    const unknownAction = 8888 as Action;
    const segments = getSegments(unknownAction, {
      userName: "Bob",
    });

    expect(hasSegmentText(segments, "Bob")).toBeTruthy();
    expect(hasSegmentText(segments, "did something.")).toBeTruthy();
  });

  it("returns empty string for unknown placeholder", () => {
    mockI18nTemplate(
      ACTIONS.FRIEND_REQUEST_SENT,
      "{userName} did {unknownKey}.",
    );

    const segments = getSegments(ACTIONS.FRIEND_REQUEST_SENT, {
      userName: "Eve",
    });

    expect(hasSegmentText(segments, "Eve")).toBeTruthy();
    expect(hasSegmentText(segments, "did ")).toBeTruthy();
  });

  it("renders correctly when there is no quoted text", () => {
    mockI18nTemplate(120, "{userName} updated their profile.");
    const segments = getSegments(120, { userName: "Sam" });

    expect(hasSegmentText(segments, "Sam")).toBeTruthy();
    expect(hasSegmentText(segments, "updated their profile.")).toBeTruthy();
  });

  it("formats numeric time using formatTimeSeconds", () => {
    mockI18nTemplate(301, "{userName} finished in {time}.");
    const segments = getSegments(301, { userName: "Alex", time: 75 });

    expect(hasSegmentText(segments, "1:15")).toBeTruthy();
  });

  it("keeps manual custom key-values intact", () => {
    mockI18nTemplate(
      ACTIONS.FRIEND_REQUEST_SENT,
      "{userName} triggered action on {customKey}.",
    );

    const segments = getSegments(ACTIONS.FRIEND_REQUEST_SENT, {
      userName: "Dave",
      customKey: "MySpecialValue",
    });

    expect(hasSegmentText(segments, "MySpecialValue")).toBeTruthy();
  });
});

describe("getActivityIcon", () => {
  const cases: Array<[number[], keyof typeof ICONS]> = [
    [[101, 102, 103, 110, 112], "account"],
    [[120], "profile"],
    [[130], "settings"],
    [[140], "friends"],
    [[200], "atlas"],
    [[210, 219], "layers"],
    [[220, 223], "markers"],
    [[230, 239], "savedMaps"],
    [[240, 249], "countryLists"],
    [[300, 309], "quizzes"],
    [[400, 415], "trips"],
    [[8888, 9999], "activity"],
  ];

  cases.forEach(([codes, iconKey]) => {
    it(`returns reference to ICONS.${iconKey} for codes ${codes.join(",")}`, () => {
      codes.forEach((code) => {
        const icon = activityUtils.getActivityIcon(code);
        expect(icon).toBe(ICONS[iconKey]);
      });
    });
  });
});
