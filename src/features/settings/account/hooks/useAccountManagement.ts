import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@app/firebase";
import { authService } from "@features/user/auth/services/authService";
import type { SerializableUser } from "@features/user/auth/types";

/**
 * Manages account management actions such as hibernation and deletion.
 * @param user - The currently authenticated serializable user.
 * @returns State and handlers for account management actions.
 */
export function useAccountManagement(user: SerializableUser | null) {
  const [hibernating, setHibernating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper to safely get the current SDK user instance
  const getFirebaseUser = () => {
    const firebaseUser = auth.currentUser;
    if (!user || !firebaseUser) {
      throw new Error("No authenticated user found.");
    }
    return firebaseUser;
  };

  // Handle account deactivation (hibernate)
  const handleHibernate = async () => {
    setHibernating(true);
    setError(null);
    setSuccess(null);
    try {
      const firebaseUser = getFirebaseUser();
      await authService.deactivateAccount(firebaseUser);
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
      const firebaseUser = getFirebaseUser();
      await authService.deleteAppAccount(firebaseUser);
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
