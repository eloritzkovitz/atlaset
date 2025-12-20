import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deactivateAccount,
  deleteAppAccount,
} from "@features/user/auth/services/authService";
import type { User } from "firebase/auth";

/**
 * Manages account management actions such as hibernation and deletion.
 * @param user - The currently authenticated user.
 * @returns State and handlers for account management actions.
 */
export function useAccountManagement(user: User | null) {
  const [hibernating, setHibernating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle account deactivation (hibernate)
  const handleHibernate = async () => {
    setHibernating(true);
    setError(null);
    setSuccess(null);
    try {
      if (!user) throw new Error("No authenticated user found.");
      await deactivateAccount(user);
      setSuccess("Account hibernated. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to hibernate account.");
    } finally {
      setHibernating(false);
    }
  };

  // Handle account deletion
  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      if (!user) throw new Error("No authenticated user found.");
      await deleteAppAccount(user);
      setSuccess("Account deleted. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    hibernating,
    deleting,
    error,
    success,
    setError,
    setSuccess,
    handleHibernate,
    handleDelete,
  };
}
