import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { useMigration } from "../hooks/useMigration";

export function MigrationModal() {
  const { t } = useTranslation("auth");

  const {
    shouldPrompt,
    isMigrating,
    migrationError,
    handleConfirmMigration,
    handleDiscardMigration,
  } = useMigration();

  // Render nothing if the modal is not open
  if (!shouldPrompt) return null;

  return createPortal(
    <div className="fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 z-[11001] w-[calc(100%-2rem)] max-w-[600px] pointer-events-auto">
      <div className="flex flex-col p-5 md:p-6 bg-surface rounded-xl shadow-lg gap-8">
        <div className="flex flex-col gap-2 max-w-prose">
          <h2 className="text-xl md:text-2xl font-bold leading-snug text-start mb-2">
            {t("migration.title", "Guest Data Found")}
          </h2>

          <div className="space-y-4 text-start text-sm md:text-base text-muted leading-relaxed">
            <p>
              {t(
                "migration.paragraph1",
                "We found saved lists, maps, or markers created while using Atlaset as a guest.",
              )}
            </p>

            <p>
              {t(
                "migration.paragraph2",
                "Would you like to merge this data into your account or discard it and start fresh?",
              )}
            </p>
          </div>

          {migrationError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-start text-sm text-red-500">
              {migrationError}
            </div>
          )}
        </div>

        <div className="flex justify-start gap-2 flex-wrap">
          <ActionButton
            variant="primary"
            className="min-w-[120px] !rounded-full"
            disabled={isMigrating}
            onClick={handleConfirmMigration}
          >
            {isMigrating
              ? t("migration.mergingButton", "Merging...")
              : t("migration.mergeButton", "Merge to Account")}
          </ActionButton>

          <ActionButton
            variant="secondary"
            className="min-w-[120px] !rounded-full !bg-input hover:!bg-input-hover"
            disabled={isMigrating}
            onClick={handleDiscardMigration}
          >
            {t("migration.discardButton", "Discard Local Data")}
          </ActionButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
