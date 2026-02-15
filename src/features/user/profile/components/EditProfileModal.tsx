import { updateProfile, updatePassword, type User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState, type SubmitEvent } from "react";
import { FaEye, FaEyeSlash, FaUser, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  FormField,
  InputBox,
  Modal,
  PanelHeader,
  SectionHeader,
} from "@components";
import { isPasswordProvider } from "@features/user/auth/utils/auth";
import { getPlatformIcon, platformOrder } from "../config/socialLinks";
import { useFirestoreUsername } from "../hooks/useFirestoreUsername";
import { useUsernameValidation } from "../hooks/useUsernameValidation";
import { profileService } from "../services/profileService";
import { type UserProfile, type SocialPlatform } from "../../types";

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
  const [username, setUsername] = useState(profile?.username || "");
  const [initialUsername, setInitialUsername] = useState("");
  const { username: fetchedUsername } = useFirestoreUsername(user?.uid);
  const [isPasswordUser, setIsPasswordUser] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState<string>(
    profile?.birthday instanceof Timestamp
      ? profile.birthday.toDate().toISOString().slice(0, 10)
      : "",
  );
  const [socialLinks, setSocialLinks] = useState<
    Partial<Record<SocialPlatform, string>>
  >(profile?.socialLinks ?? {});
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

  // Check username availability
  const { status, label, color } = useUsernameValidation(
    username,
    profile?.username,
  );

  // Handle saving profile changes
  const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Block if username changed and not valid
    if (
      username !== initialUsername &&
      (status === "invalid" || status === "taken" || status === "checking")
    ) {
      setError("Please choose a valid, available username.");
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Handle username change if changed
      if (username && username !== initialUsername && user) {
        await profileService.changeUsername({
          uid: user.uid,
          oldUsername: initialUsername,
          newUsername: username,
        });
        setInitialUsername(username);
      }

      // Update profile fields in Firestore
      if (user) {
        let birthdayValue: Timestamp | undefined = undefined;
        if (birthday) {
          const dateObj = new Date(birthday);
          if (!isNaN(dateObj.getTime())) {
            birthdayValue = Timestamp.fromDate(dateObj);
          }
        }
        await profileService.editProfile(user.uid, {
          displayName,
          biography,
          birthday: birthdayValue,
          socialLinks,
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
      <div className="w-full min-w-2xl max-w-4xl mx-auto bg-surface rounded-full flex flex-col gap-2">
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
        <form onSubmit={handleSave} className="space-y-6 px-4">
          <SectionHeader title="Personal Information" />
          <FormField label="Username">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormField>
          {label && (
            <div
              data-testid="username-status"
              className={
                `mt-1 text-sm font-medium w-full block break-words whitespace-pre-line ` +
                (color === "green"
                  ? "text-success "
                  : color === "red"
                    ? "text-danger "
                    : color === "yellow"
                      ? "text-warning "
                      : "")
              }
            >
              {label}
            </div>
          )}
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </FormField>
            </>
          )}
          <FormField label="Birthday">
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </FormField>
          <FormField label="Biography">
            <textarea
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Write something about yourself..."
              rows={4}
              maxLength={500}
            />
          </FormField>
          <SectionHeader title="Contact Information" />
          <FormField label="Social Links">
            <div className="flex flex-col gap-2">
              {platformOrder.map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <span
                    className="w-8 flex justify-center items-center"
                    title={platform}
                    aria-label={platform}
                  >
                    {getPlatformIcon(platform) ??
                      platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                  <InputBox
                    id={`social-${platform}`}
                    type="url"
                    placeholder={`https://${platform}.com/yourprofile`}
                    value={socialLinks[platform as SocialPlatform] ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        [platform as SocialPlatform]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </FormField>
          {error && <div className="text-danger">{error}</div>}
          {success && <div className="text-success">{success}</div>}
          <div className="flex gap-4 justify-end mt-6">
            <ActionButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              disabled={
                username !== initialUsername &&
                (status === "invalid" ||
                  status === "taken" ||
                  status === "checking")
              }
            >
              Save Changes
            </ActionButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}
