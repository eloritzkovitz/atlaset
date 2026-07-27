import { useSelector } from "react-redux";
import type { RootState } from "@app/store";

/**
 * Accesses authentication state from the Redux store.
 */
export const useAuth = () => {
  const { user, loading, ready } = useSelector(
    (state: RootState) => state.auth,
  );
  return { user, loading, ready };
};
