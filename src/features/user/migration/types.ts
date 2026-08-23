/** Represents the status of the migration process. */
export type MigrationStatus =
  | "idle"
  | "checking"
  | "prompt"
  | "migrating"
  | "completed"
  | "skipped"
  | "error";
