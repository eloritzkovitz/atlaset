import { useState } from "react";
import {
  ActionButton,
  FormButton,
  FormField,
  Modal,
  PanelHeader,
} from "@components";
import { FaUser, FaXmark } from "react-icons/fa6";

interface EditProfileModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function EditProfileModal({
  user,
  open,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // await updateProfile({ displayName });
      // if (password) await updatePassword(password);
      setSuccess("Profile updated successfully.");
      if (onSave) onSave();
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setError("Failed to update profile.");
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="w-full max-w-2xl mx-auto bg-surface rounded-full flex flex-col gap-6">
        <PanelHeader
          title={
            <span className="flex items-center gap-2 text-2xl font-semibold">
              <FaUser />
              Edit Profile
            </span>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close Edit Profile Modal"
            title="Close"
            icon={<FaXmark />}
          />
        </PanelHeader>
        <form onSubmit={handleSave} className="space-y-6">
          <FormField label="Name">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-gray-100"
            />
          </FormField>
          <FormField label="New Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-gray-100"
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </FormField>
          <FormField label="Confirm New Password">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-gray-100"
              autoComplete="new-password"
            />
          </FormField>
          {error && <div className="text-danger">{error}</div>}
          {success && <div className="text-success">{success}</div>}
          <div className="flex gap-4 justify-end mt-6">
            <FormButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </FormButton>
            <FormButton type="submit" variant="primary">
              Save Changes
            </FormButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}
