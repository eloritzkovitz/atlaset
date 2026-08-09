import { useEffect, useState } from "react";
import { useAuth } from "@features/user/auth";
import { migrationService } from "../services/migrationService";
import type { MigrationStatus } from "../types";

/**
 * Manages the local-data migration workflow.
 */
export function useMigration() {
  const { user } = useAuth();

  const [status, setStatus] = useState<MigrationStatus>("idle");
  const [migrationError, setMigrationError] = useState<string | null>(null);

  // Check for local data when the authenticated user changes.
  useEffect(() => {
    if (!user) {
      setStatus("idle");
      setMigrationError(null);
      return;
    }

    let cancelled = false;

    const checkLocalData = async () => {
      setStatus("checking");
      setMigrationError(null);

      try {
        const hasData = await migrationService.hasLocalData();

        if (!cancelled) {
          setStatus(hasData ? "prompt" : "idle");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setMigrationError(
            err instanceof Error
              ? err.message
              : "An error occurred while checking local data.",
          );
          setStatus("error");
        }
      }
    };

    checkLocalData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Handles the migration process when the user confirms.
  const handleConfirmMigration = async () => {
    if (!user) return;

    setMigrationError(null);
    setStatus("migrating");

    try {
      await migrationService.migrate(user.uid);
      setStatus("completed");
    } catch (err: unknown) {
      setMigrationError(
        err instanceof Error
          ? err.message
          : "An error occurred while migrating your local data.",
      );
      setStatus("error");
    }
  };

  // Handles discarding local data when the user chooses to discard.
  const handleDiscardMigration = async () => {
    setMigrationError(null);
    setStatus("migrating");

    try {
      await migrationService.clearLocalData();
      setStatus("completed");
    } catch (err: unknown) {
      setMigrationError(
        err instanceof Error
          ? err.message
          : "An error occurred while clearing your local data.",
      );
      setStatus("error");
    }
  };

  return {
    shouldPrompt: status === "prompt",
    isChecking: status === "checking",
    isMigrating: status === "migrating",
    migrationError,
    handleConfirmMigration,
    handleDiscardMigration,
  };
}
