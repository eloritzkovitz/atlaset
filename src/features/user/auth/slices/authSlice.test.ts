import { describe, it, expect } from "vitest";
import type { RootState } from "@app/store";
import authReducer, {
  setUser,
  setLoading,
  setReady,
  selectAuthReady,
  selectAuthUser,
  type AuthState,
} from "./authSlice";
import type { SerializableUser } from "../types";

describe("authSlice reducers & selectors", () => {
  const baseState: AuthState = {
    user: null,
    loading: true,
    ready: false,
  };

  it("updates state via reducers and resolves selectors accurately", () => {
    const mockUser: SerializableUser = {
      uid: "user_123",
      email: "test@example.com",
      displayName: "Alex",
      photoURL: null,
      emailVerified: false,
      phoneNumber: null,
      providerId: "google.com",
      createdAt: "2024-01-01T00:00:00Z",
      lastSignInTime: "2024-01-02T00:00:00Z",
    };

    let state = authReducer(baseState, setUser(mockUser));
    state = authReducer(state, setLoading(false));
    state = authReducer(state, setReady(true));

    expect(state).toEqual({ user: mockUser, loading: false, ready: true });

    const rootState = { auth: state } as RootState;
    expect(selectAuthUser(rootState)).toEqual(mockUser);
    expect(selectAuthReady(rootState)).toBe(true);
  });
});
