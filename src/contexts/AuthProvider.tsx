import React, { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";
import {
  setUser,
  setLoading,
  setReady,
} from "../features/user/auth/slices/authSlice";
import { toSerializableUser } from "../features/user/auth/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let resolved = false;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUserState(firebaseUser);
      if (!resolved) {
        dispatch(setLoading(false));
        dispatch(setReady(true));
        resolved = true;
      }
      dispatch(setUser(toSerializableUser(firebaseUser)));
    });
    // Fallback: ensure loading is set to false after a timeout in case onAuthStateChanged never fires
    const timeout = setTimeout(() => {
      if (!resolved) {
        dispatch(setLoading(false));
        dispatch(setReady(true));
      }
    }, 5000);
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
