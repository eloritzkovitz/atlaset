import { describe, it, expect } from "vitest";
import { type User } from "firebase/auth";
import authReducer, {
  setUser,
  setLoading,
  setReady,
  toSerializableUser,
  type AuthState,
} from "./authSlice";
import type { SerializableUser } from "../types";

describe("authSlice utilities", () => {
  it("transforms a complex Firebase User into a clean serializable object", () => {
    const mockFirebaseUser = {
      uid: "user_123",
      email: "test@example.com",
      displayName: "Alex Developer",
      photoURL: "https://example.com/avatar.png",
      emailVerified: true,
      phoneNumber: null,
      providerId: "password",
      getIdToken: () => Promise.resolve("token_abc"),
    } as unknown as User;

    const result = toSerializableUser(mockFirebaseUser);

    expect(result).toEqual({
      uid: "user_123",
      email: "test@example.com",
      displayName: "Alex Developer",
      photoURL: "https://example.com/avatar.png",
      emailVerified: true,
      phoneNumber: null,
      providerId: "password",
    });
    expect(result).not.toHaveProperty("getIdToken");
  });

  it("returns null cleanly if toSerializableUser receives no user", () => {
    expect(toSerializableUser(null)).toBeNull();
  });
});

describe("authSlice reducers", () => {
  const baseState: AuthState = {
    user: null,
    loading: true,
    ready: false,
  };

  it("updates user state properties accurately via setUser", () => {
    const mockUser: SerializableUser = {
      uid: "user_123",
      email: "test@example.com",
      displayName: "Alex",
      photoURL: null,
      emailVerified: false,
      phoneNumber: null,
      providerId: "google.com",
    };

    const nextState = authReducer(baseState, setUser(mockUser));
    expect(nextState.user).toEqual(mockUser);
  });

  it("updates interface loading tracking properties accurately via setLoading", () => {
    const nextState = authReducer(baseState, setLoading(false));
    expect(nextState.loading).toBe(false);
  });

  it("updates subsystem initialization states accurately via setReady", () => {
    const nextState = authReducer(baseState, setReady(true));
    expect(nextState.ready).toBe(true);
  });
});
