import { describe, it, expect, vi } from "vitest";
import { authState, mockUser } from "@test-utils/mockUser";
import { firestoreMocks } from "@test-utils/mockDbAndFirestore";
import * as firebaseUtils from "@utils/firebase";
import * as activityUtils from "./activity";
import type { CollectionReference, DocumentData } from "firebase/firestore";
import i18n from "i18next";

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
vi.mock("firebase/firestore", () => ({
  ...firestoreMocks,
  getFirestore: vi.fn(() => ({})),
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
    const mockAddDoc = firestoreMocks.addDoc as unknown as jest.Mock;
    if (mockAddDoc.mockClear) mockAddDoc.mockClear();
    const mockCollection = {} as unknown as CollectionReference<DocumentData>;
    const getUserCollection = vi.spyOn(firebaseUtils, "getUserCollection");
    getUserCollection.mockReturnValue(mockCollection);
    await activityUtils.logUserActivity(101, { foo: "bar" }, "uid123");
    expect(firestoreMocks.addDoc).toHaveBeenCalledWith(
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
    vi.spyOn(i18n, "t").mockImplementationOnce((...args: any[]) => {
      const k = args[0];
      const opts = args[1];
      const key = String(k).split(":").pop();
      if (key === "211") return "{userName} added '{itemName}'.";
      return opts?.defaultValue ?? "{userName} did something.";
    });
    const desc = activityUtils.getActivityDescription(211, {
      userName: "Alice",
      itemName: "TestItem",
    });
    const children = desc.props.children;
    expect(
      children.some((part: any) => part?.props?.children === "Alice"),
    ).toBeTruthy();
    expect(
      children.some((part: any) => part?.props?.children === "TestItem"),
    ).toBeTruthy();
  });

  it("renders quoted text with correct formatting", () => {
    vi.spyOn(i18n, "t").mockImplementationOnce((...args: any[]) => {
      const k = args[0];
      const opts = args[1];
      const key = String(k).split(":").pop();
      if (key === "212")
        return "{userName} edited '{itemName}' at '{location}'.";
      return opts?.defaultValue ?? "{userName} did something.";
    });
    const desc = activityUtils.getActivityDescription(212, {
      userName: "Bob",
      itemName: "ItemX",
      location: "PlaceY",
    });
    const children = desc.props.children;
    const coloredSpans = children.filter(
      (part: any) => part?.props?.className === "text-info font-bold",
    );
    expect(coloredSpans.length).toBe(2);
    expect(coloredSpans[0].props.children).toBe("ItemX");
    expect(coloredSpans[1].props.children).toBe("PlaceY");
  });

  it("uses default for missing userName", () => {
    const desc = activityUtils.getActivityDescription(101, {});
    expect(
      desc.props.children.some((part: any) => part?.props?.children === "You"),
    ).toBeTruthy();
  });

  it("returns fallback for unknown event", () => {
    const desc = activityUtils.getActivityDescription(8888, {
      userName: "Bob",
    });
    const children = desc.props.children;
    expect(
      children.some((part: any) => part?.props?.children === "Bob"),
    ).toBeTruthy();
    expect(
      children.some(
        (part: any) =>
          typeof part === "string" && part.includes("did something"),
      ),
    ).toBeTruthy();
  });

  it("returns empty string for unknown placeholder", () => {
    vi.spyOn(i18n, "t").mockImplementationOnce((...args: any[]) => {
      const k = args[0];
      const opts = args[1];
      const key = String(k).split(":").pop();
      if (key === "0") return "{userName} did {unknownKey}.";
      return opts?.defaultValue ?? "{userName} did something.";
    });
    const desc = activityUtils.getActivityDescription(0, { userName: "Eve" });
    const children = desc.props.children;
    expect(
      children.some((part: any) => part?.props?.children === "Eve"),
    ).toBeTruthy();
    expect(
      children.some(
        (part: any) => typeof part === "string" && part.includes("did "),
      ),
    ).toBeTruthy();
    // no cleanup needed; we mocked i18n.t for this test
  });

  it("renders correctly when there is no quoted text", () => {
    vi.spyOn(i18n, "t").mockImplementationOnce((...args: any[]) => {
      const k = args[0];
      const opts = args[1];
      const key = String(k).split(":").pop();
      if (key === "120") return "{userName} updated their profile.";
      return opts?.defaultValue ?? "{userName} did something.";
    });
    const desc = activityUtils.getActivityDescription(120, { userName: "Sam" });
    const children = desc.props.children;
    expect(
      children.some((part: any) => part?.props?.children === "Sam"),
    ).toBeTruthy();
    expect(
      children.some(
        (part: any) =>
          typeof part === "string" && part.includes("updated their profile"),
      ),
    ).toBeTruthy();
  });
});

describe("getActivityIcon", () => {
  it("returns FaCircleUser for user-related codes", () => {
    [101, 102, 103, 104, 110, 111].forEach((code) => {
      const icon = activityUtils.getActivityIcon(code);
      expect(icon.type.name).toBe("FaCircleUser");
    });
  });

  it("returns FaUser for code 120", () => {
    const icon = activityUtils.getActivityIcon(120);
    expect(icon.type.name).toBe("FaUser");
  });

  it("returns FaGear for code 130", () => {
    const icon = activityUtils.getActivityIcon(130);
    expect(icon.type.name).toBe("FaGear");
  });

  it("returns FaUserGroup for code 140", () => {
    const icon = activityUtils.getActivityIcon(140);
    expect(icon.type.name).toBe("FaUserGroup");
  });

  it("returns FaEarthAmericas for code 200", () => {
    const icon = activityUtils.getActivityIcon(200);
    expect(icon.type.name).toBe("FaEarthAmericas");
  });

  it("returns FaLayerGroup for layer codes", () => {
    [210, 219].forEach((code) => {
      const icon = activityUtils.getActivityIcon(code);
      expect(icon.type.name).toBe("FaLayerGroup");
    });
  });

  it("returns FaMapPin for marker codes", () => {
    [220, 223].forEach((code) => {
      const icon = activityUtils.getActivityIcon(code);
      expect(icon.type.name).toBe("FaMapPin");
    });
  });

  it("returns FaMap for map codes", () => {
    [230, 239].forEach((code) => {
      const icon = activityUtils.getActivityIcon(code);
      expect(icon.type.name).toBe("FaMap");
    });
  });

  it("returns FaQuestion for question codes", () => {
    [8888, 9999].forEach((code) => {
      const icon = activityUtils.getActivityIcon(code);
      expect(icon.type.name).toBe("FaRegClock");
    });
  });

  it("returns FaSuitcaseRolling for trip codes", () => {
    [400, 415].forEach((code) => {
      const icon = activityUtils.getActivityIcon(code);
      expect(icon.type.name).toBe("FaSuitcaseRolling");
    });
  });
});
