import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenForAuthChanges } from "../slices/authSlice";
import type { RootState, AppDispatch } from "../../../../store";

/**
 * Accesses authentication state from the Redux store and sets up
 * a listener for auth state changes on mount.
 * @returns User, loading, ready.
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const ready = useSelector((state: RootState) => state.auth.ready);

  // Listen for auth changes on mount
  useEffect(() => {
    dispatch(listenForAuthChanges());
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading, ready };
};
