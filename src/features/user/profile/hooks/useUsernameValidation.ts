import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import type { UsernameValidationStatus } from "../types";
import { isUsernameFormatValid } from "../utils/username";

const STATUS_TRANSLATION_KEYS: Record<UsernameValidationStatus, string> = {
  idle: "",
  checking: "username.status.checking",
  available: "username.status.available",
  taken: "username.status.taken",
  invalid: "username.status.invalid",
};

/**
 * Validates a username's availability and format.
 * @param username - The username to validate.
 * @param currentUsername - The user's current username (optional).
 * @returns An object containing the validation status and a translation key.
 */
export function useUsernameValidation(
  username: string,
  currentUsername?: string,
) {
  const [status, setStatus] = useState<UsernameValidationStatus>("idle");

  // Effect to validate the username whenever it changes
  useEffect(() => {
    if (!username || username === currentUsername) {
      setStatus("idle");
      return;
    }

    // Check if the username format is valid
    if (!isUsernameFormatValid(username)) {
      setStatus("invalid");
      return;
    }

    let isCancelled = false;
    setStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        const exists = await profileService.checkUsernameExists(username);
        if (!isCancelled) {
          setStatus(exists ? "taken" : "available");
        }
      } catch {
        if (!isCancelled) {
          setStatus("idle");
        }
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [username, currentUsername]);

  return {
    status,
    translationKey: STATUS_TRANSLATION_KEYS[status],
  };
}
