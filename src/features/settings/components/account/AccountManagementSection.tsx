import { useState } from "react";
import { FaPowerOff, FaTrash, FaUserGear } from "react-icons/fa6";
import { ActionButton, ConfirmModal } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useAccountManagement } from "@features/settings/hooks/useAccountManagement";
import { SettingsCard } from "../SettingsCard";

export function AccountManagementSection() {
  const { user } = useAuth();
  const [modal, setModal] = useState<"hibernate" | "delete" | null>(null);

  const {
    hibernating,
    deleting,
    error,
    success,
    handleHibernate,
    handleDelete,
  } = useAccountManagement(user);

  return (
    <SettingsCard title="Account Management" icon={<FaUserGear />}>
      <div className="flex flex-col gap-2">
        <span className="text-danger font-medium">Danger Zone</span>
        <ActionButton
          variant="secondary"
          className="!bg-warning !hover:bg-warning-hover text-white w-fit"
          icon={<FaPowerOff />}
          disabled={hibernating || deleting}
          onClick={() => setModal("hibernate")}
          ariaLabel="Hibernate Account"
          title="Hibernate Account"
        >
          {hibernating ? "Hibernating..." : "Hibernate Account"}
        </ActionButton>
        <ActionButton
          variant="primary"
          className="!bg-danger !hover:bg-danger-hover text-white w-fit"
          icon={<FaTrash />}
          disabled={deleting}
          onClick={() => setModal("delete")}
          ariaLabel="Delete Account"
          title="Delete Account"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </ActionButton>
        {error && <span className="text-danger text-sm">{error}</span>}
        {success && <span className="text-success text-sm">{success}</span>}
        <span className="text-xs text-danger">
          This will permanently delete your account and all associated data.
        </span>
      </div>

      {/* Hibernate Modal */}
      <ConfirmModal
        isOpen={modal === "hibernate"}
        title="Hibernate Account"
        message="Are you sure you want to deactivate your account? You can reactivate by logging in again."
        onConfirm={handleHibernate}
        onCancel={() => setModal(null)}
        submitLabel="Hibernate"
        cancelLabel="Cancel"
        submitIcon={<FaPowerOff />}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={modal === "delete"}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setModal(null)}
        submitLabel="Delete"
        cancelLabel="Cancel"
        submitIcon={<FaTrash />}
      />
    </SettingsCard>
  );
}
