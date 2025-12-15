import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
  useRef,
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
  const prevUserRef = useRef<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      prevUserRef.current = user;
      setUser(firebaseUser);
      setLoading(false);
      setReady(true);

      // Run migration in the background if needed
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

  return (
    <AuthContext.Provider value={{ user, loading, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
