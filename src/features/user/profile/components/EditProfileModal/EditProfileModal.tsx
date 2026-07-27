import { updateProfile, updatePassword } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState, type SubmitEvent } from "react";
import { auth } from "@lib/firebase";
import {
  ActionButton,
  FormField,
  Modal,
  ModalHeader,
  PasswordField,
  SectionHeader,
} from "@components";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { SocialLinksField } from "./SocialLinksField";
import { useFirestoreUsername } from "../../hooks/useFirestoreUsername";
import { useUsernameValidation } from "../../hooks/useUsernameValidation";
import { profileService } from "../../services/profileService";
import { type UserProfile, type SocialPlatform } from "../../types";
import type { SerializableUser } from "../../../auth/types";

interface EditProfileModalProps {
  user: SerializableUser | null;
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
  const { t } = useTranslation("user");
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

  // Populate initial form values when modal opens
  useEffect(() => {
    if (fetchedUsername) {
      setUsername(fetchedUsername);
      setInitialUsername(fetchedUsername);
    }
    setIsPasswordUser(user?.providerId === "password");
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
      setError(t("profile.editModal.usernameInvalid"));
      return;
    }
    if (password && password !== confirmPassword) {
      setError(t("profile.editModal.passwordMismatch"));
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

      const firebaseCurrentUser = auth.currentUser;

      // Update displayName in Firebase Auth if changed
      if (firebaseCurrentUser) {
        if (displayName !== user?.displayName) {
          await updateProfile(firebaseCurrentUser, { displayName });
        }

        if (password) {
          await updatePassword(firebaseCurrentUser, password);
        }
      }

      setSuccess(t("profile.editModal.success"));
      setTimeout(() => {
        onClose();
        if (onSave) onSave();
      }, 500);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || t("profile.editModal.failed"));
    }
  };

  // Don't render modal if not open
  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="w-full min-w-2xl max-w-4xl mx-auto bg-surface rounded-full flex flex-col gap-2">
        <ModalHeader
          title={
            <>
              <ICONS.profile />
              {t("profile.editModal.title")}
            </>
          }
        />

        <form onSubmit={handleSave} className="space-y-6 px-4">
          <SectionHeader title={t("profile.editModal.personalInfo")} />
          <FormField label={t("profile.editModal.username")}>
            <input
              id="username"
              name="username"
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
          <FormField label={t("profile.editModal.name")}>
            <input
              id="display-name"
              name="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!isPasswordUser}
            />
          </FormField>
          {isPasswordUser && (
            <>
              <PasswordField
                label={t("profile.editModal.newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("profile.editModal.passwordPlaceholder")}
                autoComplete="new-password"
              />
              <PasswordField
                label={t("profile.editModal.confirmNewPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </>
          )}
          <FormField label={t("profile.editModal.birthday")}>
            <input
              id="birthday"
              name="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required={false}
            />
          </FormField>
          <FormField label={t("profile.editModal.biography")}>
            <textarea
              id="biography"
              name="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder={t("profile.editModal.bioPlaceholder")}
              rows={4}
              maxLength={500}
            />
          </FormField>
          <SectionHeader title={t("profile.editModal.contactInfo")} />
          <SocialLinksField
            socialLinks={socialLinks}
            onChange={(platform, value) =>
              setSocialLinks((prev) => ({ ...prev, [platform]: value }))
            }
          />
          {error && <div className="text-danger">{error}</div>}
          {success && <div className="text-success">{success}</div>}
          <div className="flex gap-4 justify-end mt-6">
            <ActionButton type="button" variant="secondary" onClick={onClose}>
              {t("common:actions.cancel")}
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
              {t("common:actions.save")}
            </ActionButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}
