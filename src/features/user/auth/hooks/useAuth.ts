import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";

/**
 * Accesses authentication state from the Redux store and sets up
 * a listener for auth state changes on mount.
 * @returns User, loading, ready.
 */
export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const ready = useSelector((state: RootState) => state.auth.ready);  

  return { user, loading, ready };
};
