import { updateProfile, updatePassword, type User } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaUser, FaXmark } from "react-icons/fa6";
import { ActionButton, FormField, Modal, PanelHeader } from "@components";
import { useFirestoreUsername } from "../hooks/useFirestoreUsername";
import { changeUsername, editProfile } from "../services/profileService";
import { isPasswordProvider } from "@features/user/auth/utils/auth";
import { type UserProfile } from "../../types";

interface EditProfileModalProps {
  user: User | null;
  profile: UserProfile | null;
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function EditProfileModal({
  user,
  profile,
  open,
  onClose,
  onSave,
}: EditProfileModalProps) {
    const [biography, setBiography] = useState(profile?.biography ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const { username: fetchedUsername } = useFirestoreUsername(user?.uid);
  const [isPasswordUser, setIsPasswordUser] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Populate initial form values when modal opens
  useEffect(() => {
    if (fetchedUsername) {
      setUsername(fetchedUsername);
      setInitialUsername(fetchedUsername);
    }
    setIsPasswordUser(!!isPasswordProvider(user));
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

      // Update other profile fields in Firestore
      if (user) {
        await editProfile(user.uid, {
          displayName,
          biography,
        });
      }

      // Update displayName in Firebase Auth if changed
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
            <>
              <FaUser />
              {"Edit Profile"}
            </>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close Edit Profile Modal"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </PanelHeader>
        <form onSubmit={handleSave} className="space-y-6 p-4">
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
              disabled={!isPasswordUser}
            />
          </FormField>
          {isPasswordUser && (
            <>
              <FormField label="New Password">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    autoComplete="new-password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted-hover"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </FormField>
              <FormField label="Confirm New Password">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted-hover"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </FormField>
            </>
          )}
          <FormField label="Biography">
            <textarea
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Write something about yourself..."
              rows={4}
              maxLength={500}
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
