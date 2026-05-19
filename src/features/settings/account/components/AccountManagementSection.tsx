import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, ConfirmModal } from "@components";
import { ICONS } from "@constants/icons";
import { useAuth } from "@contexts/AuthContext";
import { useAccountManagement } from "../hooks/useAccountManagement";
import { SettingsCard } from "../../common/components/SettingsCard";

export function AccountManagementSection() {
  const { user } = useAuth();
  const [modal, setModal] = useState<"hibernate" | "delete" | null>(null);
  const { t } = useTranslation("settings");

  const {
    hibernating,
    deleting,
    error,
    success,
    handleHibernate,
    handleDelete,
  } = useAccountManagement(user);

  return (
    <SettingsCard title={t("account.management.title")} icon={<ICONS.accountManagement />}>
      <div className="flex flex-col gap-2">        
        <ActionButton
          variant="secondary"
          className="!bg-warning !hover:bg-warning-hover text-white w-fit"
          disabled={hibernating || deleting}
          onClick={() => setModal("hibernate")}
          ariaLabel={t("account.management.hibernateAria")}
          title={t("account.management.hibernate")}
        >
          {<ICONS.hibernate />}
          {hibernating
            ? t("account.management.hibernating")
            : t("account.management.hibernate")}
        </ActionButton>        
        <ActionButton
          variant="primary"
          className="!bg-danger !hover:bg-danger-hover text-white w-fit"
          disabled={deleting}
          onClick={() => setModal("delete")}
          ariaLabel={t("account.management.deleteAria")}
          title={t("account.management.delete")}
        >
          {<ICONS.remove />}
          {deleting
            ? t("account.management.deleting")
            : t("account.management.delete")}
        </ActionButton>
        {error && <span className="text-danger text-sm">{error}</span>}
        {success && <span className="text-success text-sm">{success}</span>}
        <span className="text-danger">
          {t("account.management.deleteWarning")}
        </span>
      </div>

      {/* Hibernate Modal */}
      <ConfirmModal
        isOpen={modal === "hibernate"}
        title={t("account.management.hibernateConfirm.title")}
        message={t("account.management.hibernateConfirm.message")}
        onConfirm={handleHibernate}
        onCancel={() => setModal(null)}
        submitLabel={t("account.management.hibernate")}
        cancelLabel={t("actions.cancel")}
        submitIcon={<ICONS.hibernate />}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={modal === "delete"}
        title={t("account.management.deleteConfirm.title")}
        message={t("account.management.deleteConfirm.message")}
        onConfirm={handleDelete}
        onCancel={() => setModal(null)}
        submitLabel={t("account.management.delete")}
        cancelLabel={t("actions.cancel")}
        submitIcon={<ICONS.remove />}
      />
    </SettingsCard>
  );
}
