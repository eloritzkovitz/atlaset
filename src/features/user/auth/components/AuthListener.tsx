import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@lib/firebase";
import { setUser, setLoading, setReady } from "../slices/authSlice";
import { toSerializableUser } from "../utils/auth";

interface AuthListenerProps {
  children?: React.ReactNode;
}

/** Listens for authentication state changes. */
export const AuthListener: React.FC<AuthListenerProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let resolved = false;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setUser(toSerializableUser(firebaseUser)));

      if (!resolved) {
        dispatch(setLoading(false));
        dispatch(setReady(true));
        resolved = true;
      }
    });

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

  return children ? <>{children}</> : null;
};
