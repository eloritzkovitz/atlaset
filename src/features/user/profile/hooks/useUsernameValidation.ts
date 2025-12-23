import { Filter } from "bad-words";
import { useEffect, useState } from "react";
import forbiddenUsernames from "../constants/forbiddenUsernames.json";
import { checkUsernameExists } from "../services/profileService";

// Regex pattern for valid usernames: alphanumeric and underscores, 3-20 characterss
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

// Helper for UI: label and color for each status
const statusLabel: Record<typeof status, { label: string; color: string }> = {
  idle: { label: "", color: "" },
  checking: { label: "Checking...", color: "gray" },
  available: { label: "Available", color: "green" },
  taken: {
    label: "Username already taken. Please choose a different name.",
    color: "red",
  },
  invalid: {
    label: "Username not allowed. Please choose a different name.",
    color: "red",
  },
};

/**
 * Validates a username's availability and format.
 * @param username - The username to validate.
 * @param currentUsername - The current username of the user (if any).
 * @returns Validation status: "idle", "checking", "available", "taken" or "invalid".
 */
export function useUsernameValidation(
  username: string,
  currentUsername?: string
) {
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  // Validate username on change
  useEffect(() => {
    if (!username || username === currentUsername) {
      setStatus("idle");
      return;
    }
    if (
      !usernamePattern.test(username) ||
      forbiddenUsernames.includes(username.toLowerCase())
    ) {
      setStatus("invalid");
      return;
    }
    const filter = new Filter();
    if (username && filter.isProfane(username)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    const timeout = setTimeout(async () => {
      const exists = await checkUsernameExists(username);
      setStatus(exists ? "taken" : "available");
    }, 500);
    return () => clearTimeout(timeout);
  }, [username, currentUsername]);

  return { status, ...statusLabel[status] };
}
