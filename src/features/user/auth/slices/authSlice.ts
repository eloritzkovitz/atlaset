import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { RootState } from "../../../../store";
import { removeDevice } from "@features/user/auth/utils/device";
import { migrationService } from "@services/migrationService";
import { auth } from "../../../../firebase";

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
function toSerializableUser(user: User | null): SerializableUser | null {
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

export const listenForAuthChanges = createAsyncThunk<SerializableUser | null, void>(
  "auth/listenForAuthChanges",
  async (_, { dispatch }) => {
    return new Promise<SerializableUser | null>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        const serializableUser = toSerializableUser(firebaseUser);
        resolve(serializableUser);
        dispatch(setUser(serializableUser));
        dispatch(setLoading(false));
        dispatch(setReady(true));
        if (!firebaseUser) {
          const sessionId = localStorage.getItem("sessionId");
          const userId = localStorage.getItem("userId");
          if (sessionId && userId) {
            removeDevice(userId, sessionId);
            localStorage.removeItem("sessionId");
            localStorage.removeItem("userId");
          }
        } else {
          const guestDataExists = await migrationService.hasGuestData();
          if (guestDataExists) {
            await migrationService.migrateGuestDataToFirestore();
          }
        }
      });
    });
  }
);


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
  extraReducers: (builder) => {
    builder.addCase(listenForAuthChanges.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.ready = true;
    });
  },
});

export const { setUser, setLoading, setReady } = authSlice.actions;
export const selectAuthReady = (state: RootState) => state.auth.ready;
export const selectAuthUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
