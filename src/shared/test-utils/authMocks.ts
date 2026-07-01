import type { User } from "firebase/auth";

/**
 * Creates a mock Firebase User object for testing purposes.
 * @param overrides - Optional properties to override in the mock user.
 * @returns A mock Firebase User object.
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  uid: "test-user",
  emailVerified: false,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  displayName: "Test User",
  email: "test@example.com",
  phoneNumber: "",
  photoURL: "",
  refreshToken: "",
  tenantId: "",
  delete: vi.fn(),
  getIdToken: vi.fn(),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
  providerId: "",
  ...overrides,
});

/** Mock authentication state for testing purposes. */
export const authState: { currentUser: User | null } = {
  currentUser: createMockUser(),
};
