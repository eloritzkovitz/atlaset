import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  hasGuestData,
  migrateGuestDataToFirestore,
} from "@services/migrationService";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  ready: boolean;
}>({
  user: null,
  loading: true,
  ready: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Track previous user to detect login
  const [prevUser, setPrevUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setPrevUser(user);
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Migrate guest data upon first login, then set ready
  useEffect(() => {
    let cancelled = false;
    async function handleMigration() {
      if (!prevUser && user) {
        const guestDataExists = await hasGuestData();
        if (guestDataExists) {
          await migrateGuestDataToFirestore();
        }
      }
      if (!cancelled) setReady(true);
    }
    handleMigration();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Custom hook to check if auth is ready and user is logged in
export function useAuthReady() {
  const { user, ready } = useAuth();
  return user && ready;
}
