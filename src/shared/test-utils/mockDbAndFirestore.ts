export const commonDbMethods = [
  "toArray",
  "clear",
  "bulkAdd",
  "bulkPut",
  "add",
  "put",
  "delete",
];

// Create a mock database object with specified methods
export function createDbMock(methods: string[]) {
  const mock: Record<string, any> = {};
  methods.forEach((m) => (mock[m] = vi.fn()));
  return mock;
}

// Mock Firestore and authentication utilities
export const firestoreMocks = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  writeBatch: vi.fn(() => ({
    delete: vi.fn(),
    set: vi.fn(),
    commit: vi.fn(),
  })),
};

export const authMocks = {
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
  getUserCollection: vi.fn(),
};

// Reset all mocks in the provided mock objects
export function resetAllMocks(...mocks: any[]) {
  mocks.forEach((mockObj) => {
    Object.values(mockObj).forEach((fn) => {
      if (
        typeof fn === "function" &&
        "mockReset" in fn &&
        typeof (fn as any).mockReset === "function"
      ) {
        (fn as { mockReset: () => void }).mockReset();
      }
    });
  });
}
