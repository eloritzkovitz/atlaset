import { useState, useRef } from "react";
import { Modal } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { signInWithGoogle, logout } from "@services/authService";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";

export function UserMenu() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { uiVisible } = useUI();  

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
      <UserAvatarButton user={user} onClick={() => setOpen((v) => !v)} />
      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          position="custom"
          className="absolute right-4 mt-3 w-60 bg-white rounded shadow-lg z-50 p-2"
          style={{ top: "48px", right: 16 }}
          disableClose={false}
        >
          <UserMenuContent
            user={user}
            loading={loading}
            onSignIn={handleSignIn}
            onLogout={handleLogout}
          />
        </Modal>
      )}
    </div>
  );
}
