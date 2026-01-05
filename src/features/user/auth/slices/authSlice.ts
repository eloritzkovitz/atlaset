import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type User } from "firebase/auth";
import type { RootState } from "../../../../store";

// Only store serializable user fields in Redux
export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  providerId: string;
}

export interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  ready: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  ready: false,
};

// Helper to extract only serializable fields from Firebase User
export function toSerializableUser(user: User | null): SerializableUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    providerId: user.providerId,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SerializableUser | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setReady(state, action: PayloadAction<boolean>) {
      state.ready = action.payload;
    },
  },
});

export const { setUser, setLoading, setReady } = authSlice.actions;
export const selectAuthReady = (state: RootState) => state.auth.ready;
export const selectAuthUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
