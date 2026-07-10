import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, ConfirmModal } from "@components";
import { ICONS } from "@constants/icons";
import { useAuth } from "@contexts/AuthContext";
import { useAccountManagement } from "../hooks/useAccountManagement";
import { SettingsCard } from "../../common/components/SettingsCard";

export function AccountManagementSection() {
  const { user } = useAuth();
  const {
    hibernating,
    deleting,
    error,
    success,
    handleHibernate,
    handleDelete,
  } = useAccountManagement(user);
  const { t } = useTranslation("settings");

  const [modal, setModal] = useState<"hibernate" | "delete" | null>(null);

  const modalConfig = {
    hibernate: {
      title: t("account.management.hibernateConfirm.title"),
      message: t("account.management.hibernateConfirm.message"),
      submitLabel: t("account.management.hibernate"),
      submitIcon: <ICONS.hibernate />,
      onConfirm: () => {
        setModal(null);
        handleHibernate();
      },
    },
    delete: {
      title: t("account.management.deleteConfirm.title"),
      message: t("account.management.deleteConfirm.message"),
      submitLabel: t("account.management.delete"),
      submitIcon: <ICONS.remove />,
      onConfirm: () => {
        setModal(null);
        handleDelete();
      },
    },
  }[modal ?? "hibernate"];

  return (
    <SettingsCard
      title={t("account.management.title")}
      icon={<ICONS.accountManagement />}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex flex-col gap-1 max-w-xl">
            <p className="font-semibold">{t("account.management.hibernate")}</p>
            <p className="text-xs text-neutral-muted">
              {t("account.management.hibernateWarning")}
            </p>
          </div>
          <ActionButton
            variant="primary"
            className="w-full sm:w-fit shrink-0 !rounded-full"
            disabled={hibernating || deleting}
            onClick={() => setModal("hibernate")}
            ariaLabel={t("account.management.hibernate")}
          >
            <ICONS.hibernate />
            {hibernating
              ? t("account.management.hibernating")
              : t("account.management.hibernate")}
          </ActionButton>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-xl">
            <p className="font-semibold text-danger">
              {t("account.management.delete")}
            </p>
            <p className="text-xs text-danger/80 font-medium">
              {t("account.management.deleteWarning")}
            </p>
          </div>
          <ActionButton
            variant="primary"
            className="!bg-danger !hover:bg-danger-hover w-full sm:w-fit shrink-0 !rounded-full"
            disabled={hibernating || deleting}
            onClick={() => setModal("delete")}
            ariaLabel={t("account.management.delete")}
          >
            <ICONS.remove />
            {deleting
              ? t("account.management.deleting")
              : t("account.management.delete")}
          </ActionButton>
        </div>

        {(error || success) && (
          <div className="text-sm font-medium pt-2">
            {error && <span className="text-danger">{error}</span>}
            {success && <span className="text-success">{success}</span>}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modal !== null}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModal(null)}
        submitLabel={modalConfig.submitLabel}
        cancelLabel={t("actions.cancel")}
        submitIcon={modalConfig.submitIcon}
      />
    </SettingsCard>
  );
}
