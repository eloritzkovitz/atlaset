import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { deleteAppAccount } from "@features/user/auth/services/authService";
import { SettingsCard } from "../SettingsCard";

export function AccountManagementSection() {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle account deletion
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      if (!user) throw new Error("No authenticated user found.");
      await deleteAppAccount(user);
      setSuccess("Account deleted. Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Wait 1.5s before redirecting for user feedback
    } catch (e: any) {
      setError(e.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SettingsCard title="Account Management" icon={<FaTrash />}>
      <div className="flex flex-col gap-2">
        <span className="text-danger font-medium">Danger Zone</span>
        <ActionButton
          variant="primary"
          className="!bg-danger !hover:bg-danger-hover text-white w-fit"
          icon={<FaTrash />}
          disabled={deleting}
          onClick={handleDelete}
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
    </SettingsCard>
  );
}
