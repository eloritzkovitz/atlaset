export interface SubregionStat {
  name: string;
  visited: number;
  total: number;
}

/** Represents an achievement. */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  criteria: any;
  icon: string;
  requires?: string[];
}

/** Represents the status of an achievement */
export type AchievementStatus = "locked" | "progress" | "completed";
