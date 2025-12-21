import { type ReactNode, useEffect, useRef, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { removeDevice } from "@features/user/auth/utils/device";
import {
  hasGuestData,
  migrateGuestDataToFirestore,
} from "@services/migrationService";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const prevUserRef = useRef<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      prevUserRef.current = user;
      setUser(firebaseUser);
      setLoading(false);
      setReady(true);
      if (!prevUserRef.current && firebaseUser) {
        const guestDataExists = await hasGuestData();
        if (guestDataExists) {
          await migrateGuestDataToFirestore();
        }
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up device info on logout
  useEffect(() => {
    if (user === null) {
      const sessionId = localStorage.getItem("sessionId");
      const userId = localStorage.getItem("userId");
      if (sessionId && userId) {
        removeDevice(userId, sessionId);
        localStorage.removeItem("sessionId");
        localStorage.removeItem("userId");
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, ready }}>
      {children}
    </AuthContext.Provider>
  );
};
