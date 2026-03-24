import type { RootState } from "@app/store";
import { selectAuthUser, selectAuthReady } from "@features/user";

// Returns true if settings are ready for the current user context
export const selectSettingsReady = (state: RootState) => {
  const authReady = selectAuthReady(state);
  const user = selectAuthUser(state);
  // If auth is not ready, settings cannot be ready
  if (!authReady) return false;
  // If user is not logged in, settings are always ready (use defaults)
  if (!user) return true;
  // If user is logged in, use the settings.ready flag
  return state.settings.ready;
};
