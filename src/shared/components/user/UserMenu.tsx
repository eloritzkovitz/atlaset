import { useState, useRef, type RefObject } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useClickOutside } from "@hooks/useClickOutside";
import { signInWithGoogle, logout } from "@services/authService";

export function UserMenu() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { uiVisible } = useUI();

  // Close menu when clicking outside
  useClickOutside([menuRef as RefObject<HTMLElement>], () => setOpen(false));

  // Handle sign in
  const handleSignIn = async () => {
    await signInWithGoogle();
    setOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  // Don't render if UI is not visible
  if (!uiVisible) return null;  

  return (
    <div className="fixed top-4 right-10 z-[10000]" ref={menuRef}>
      <button
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        {user && user.photoURL ? (
          <img
            src={user.photoURL}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover outline-none"
          />
        ) : (
          <span className="text-xl text-gray-500">👤</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 p-2">
          {loading ? (
            <div className="p-2 text-center">Loading...</div>
          ) : user ? (
            <>
              <div className="p-2 border-b">
                <div className="font-medium">
                  {user.displayName || user.email}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleSignIn}
            >
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </div>
  );
}
