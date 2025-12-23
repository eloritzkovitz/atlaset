import { updateProfile, updatePassword, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaUser, FaXmark } from "react-icons/fa6";
import { ActionButton, FormField, Modal, PanelHeader } from "@components";
import { useFirestoreUsername } from "../hooks/useFirestoreUsername";
import { changeUsername } from "../services/profileService";

interface EditProfileModalProps {
  user: User | null;
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
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const { username: fetchedUsername } = useFirestoreUsername(user?.uid);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Populate initial form values when modal opens
  useEffect(() => {
    if (fetchedUsername) {
      setUsername(fetchedUsername);
      setInitialUsername(fetchedUsername);
    }
    if (user && user.uid) {
      setIsGoogleUser(
        Array.isArray(user.providerData) &&
        user.providerData.some((p) => p && p.providerId === "google.com")
      );
    }
  }, [fetchedUsername, user, open]);  

  // Handle saving profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Handle username change if changed
      if (username && username !== initialUsername && user) {
        await changeUsername({
          uid: user.uid,
          oldUsername: initialUsername,
          newUsername: username,
        });
        setInitialUsername(username);
      }
      // Update displayName and photoURL in Firebase Auth
      if (user && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      // Update password if provided
      if (user && password) {
        await updatePassword(user, password);
      }
      setSuccess("Profile updated successfully.");
      if (onSave) onSave();
      setTimeout(onClose, 1000);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Failed to update profile.");
    }
  };

  // Don't render modal if not open
  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="w-full min-w-2xl max-w-4xl mx-auto bg-surface rounded-full flex flex-col gap-6">
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
          <FormField label="Username">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Name">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isGoogleUser}
            />
          </FormField>
          <FormField label="New Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
              disabled={isGoogleUser}
            />
          </FormField>
          <FormField label="Confirm New Password">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isGoogleUser}
            />
          </FormField>
          {error && <div className="text-danger">{error}</div>}
          {success && <div className="text-success">{success}</div>}
          <div className="flex gap-4 justify-end mt-6">
            <ActionButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" variant="primary">
              Save Changes
            </ActionButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}
