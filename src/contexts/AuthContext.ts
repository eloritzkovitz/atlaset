import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  ready: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  ready: false,
});

export const useAuth = () => useContext(AuthContext);
