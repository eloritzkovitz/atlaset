import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, ConfirmModal } from "@components";
import { ICONS } from "@constants/icons";
import { useAccountManagement } from "@features/user/account/hooks/useAccountManagement";
import { useAuth } from "@features/user/auth";
import { SettingsCard } from "../../core/components/SettingsCard";
import { SettingsRow } from "../../core/components/SettingsRow";

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
      submitIcon: <ICONS.poweroff />,
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
      <div className="flex flex-col gap-6">
        <SettingsRow
          label={t("account.management.hibernate")}
          description={t("account.management.hibernateWarning")}
          control={
            <ActionButton
              variant="primary"
              className="w-full sm:w-fit !rounded-full"
              disabled={hibernating || deleting}
              onClick={() => setModal("hibernate")}
              ariaLabel={t("account.management.hibernate")}
            >
              <ICONS.poweroff />
              {hibernating
                ? t("account.management.hibernating")
                : t("account.management.hibernate")}
            </ActionButton>
          }
        />

        <SettingsRow
          label={t("account.management.delete")}
          description={t("account.management.deleteWarning")}
          labelClassName="font-semibold text-danger"
          descriptionClassName="text-xs text-danger/80 font-medium"
          control={
            <ActionButton
              variant="primary"
              className="!bg-danger !hover:bg-danger-hover w-full sm:w-fit !rounded-full"
              disabled={hibernating || deleting}
              onClick={() => setModal("delete")}
              ariaLabel={t("account.management.delete")}
            >
              <ICONS.remove />
              {deleting
                ? t("account.management.deleting")
                : t("account.management.delete")}
            </ActionButton>
          }
        />

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
