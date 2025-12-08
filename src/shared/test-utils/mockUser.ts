import type { User } from "firebase/auth";

export const authState: { currentUser: User | null } = {
  currentUser: null,
};

export const mockUser = {
  uid: "abc",
  emailVerified: false,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  displayName: "",
  email: "",
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
};
