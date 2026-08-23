import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { useMigration } from "../hooks/useMigration";

export function MigrationModal() {
  const { t } = useTranslation("common");

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
            {t("migration.title")}
          </h2>

          <div className="space-y-4 text-start text-sm md:text-base text-muted leading-relaxed">
            <p>{t("migration.paragraph1")}</p>
            <p>{t("migration.paragraph2")}</p>
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
              ? t("migration.mergingButton")
              : t("migration.mergeButton")}
          </ActionButton>
          <ActionButton
            variant="secondary"
            className="min-w-[120px] !rounded-full !bg-input hover:!bg-input-hover"
            disabled={isMigrating}
            onClick={handleDiscardMigration}
          >
            {t("migration.discardButton")}
          </ActionButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
