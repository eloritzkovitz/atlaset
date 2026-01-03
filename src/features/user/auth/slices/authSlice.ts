import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { onAuthStateChanged, type User } from "firebase/auth";
import { removeDevice } from "@features/user/auth/utils/device";
import { migrationService } from "@services/migrationService";
import { auth } from "../../../../firebase";

export interface AuthState {
  user: User | null;
  loading: boolean;
  ready: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  ready: false,
};

export const listenForAuthChanges = createAsyncThunk<User | null, void>(
  "auth/listenForAuthChanges",
  async (_, { dispatch }) => {
    return new Promise<User | null>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        resolve(firebaseUser);
        dispatch(setUser(firebaseUser));
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
    setUser(state, action: PayloadAction<User | null>) {
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
export default authSlice.reducer;
