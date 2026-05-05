import type { SovereigntyStatus } from "../types";

// Localization keys for sovereignty statuses
export const SOVEREIGNTY_KEYS: Record<SovereigntyStatus, string> = {
  Sovereign: "sovereign",
  Dependency: "dependency",
  "Overseas Region": "overseas_region",
  Unrecognized: "unrecognized",
  Disputed: "disputed",
  Unknown: "unknown",
};
