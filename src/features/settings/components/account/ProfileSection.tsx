import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { updatePassword } from "firebase/auth";
import { FormField, ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { updateUserProfile } from "@features/user/auth/services/authService";
import { isPasswordProvider } from "@features/user/auth/utils/provider";
import { SettingsCard } from "../SettingsCard";

export function ProfileSection() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Detect if user is password-based
  const isPasswordUser = isPasswordProvider(user);

  // State for form fields
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle saving profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user) {
      setError("No user is logged in.");
      return;
    }

    // Validate passwords match
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Update profile and password
    try {
      if (displayName !== user.displayName) {
        await updateUserProfile(user, { displayName });
      }
      if (password) {
        await updatePassword(user, password);
      }
      setSuccess("Profile updated successfully.");
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
        setPassword("");
        setConfirmPassword("");
      }, 1000);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to update profile. Please re-authenticate and try again."
      );
    }
  };

  return (
    <SettingsCard title="Profile" icon={<FaUser />}>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="btn btn-xs ml-auto"
          onClick={() => setOpen((v) => !v)}
          disabled={!isPasswordUser}
          title={
            !isPasswordUser
              ? "Profile changes are managed through your Google account."
              : undefined
          }
        >
          Edit
        </button>
      </div>
      {!isPasswordUser && (
        <div className="mt-2 text-xs text-muted italic">
          Profile changes are managed through your Google account.
        </div>
      )}
      {open && isPasswordUser && (
        <form className="mt-2 flex flex-col gap-2" onSubmit={handleSave}>
          <FormField label="Name">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input input-sm"
              autoFocus
            />
          </FormField>
          <FormField label="New Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
              className="input input-sm"
            />
          </FormField>
          <FormField label="Confirm New Password">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="input input-sm"
            />
          </FormField>
          {error && <div className="text-danger text-xs">{error}</div>}
          {success && <div className="text-success text-xs">{success}</div>}
          <div className="flex gap-2 mt-2 justify-end">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setDisplayName(user?.displayName || "");
                setPassword("");
                setConfirmPassword("");
                setError("");
              }}
            >
              Cancel
            </ActionButton>
            <ActionButton type="submit" variant="primary">
              Save Changes
            </ActionButton>
          </div>
        </form>
      )}
    </SettingsCard>
  );
}
