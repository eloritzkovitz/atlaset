import { createContext, useContext } from "react";
import type { Achievement } from "../features/dashboard/achievements/types";

export interface AchievementsContextValue {
  achievements: Achievement[] | null;
  loading: boolean;
  error: string | null;
}

export const AchievementsContext = createContext<
  AchievementsContextValue | undefined
>(undefined);

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within an AchievementsProvider",
    );
  }
  return context;
}
