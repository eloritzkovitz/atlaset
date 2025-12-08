import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useAuthHandlers } from "@features/user";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";

export function UserMenu() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { uiVisible } = useUI();
  const navigate = useNavigate();

  // Get the logout handler from useAuthHandlers
  const { handleLogout } = useAuthHandlers();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Don't render if UI is not visible
  if (!uiVisible) return null;

  if (!user) {
    // Show buttons outside the avatar/modal when not logged in
    return (
      <div className="fixed top-4 right-10 z-[10000] flex gap-2">
        <button
          className="py-2 px-4 bg-blue-800 text-white rounded-full hover:bg-blue-700"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
        <button
          className="py-2 px-4 bg-gray-200 text-blue-800 rounded-full hover:bg-gray-300"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    );
  }

  // Show avatar and modal for logged-in users
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
            onLogout={handleLogout}
          />
        </Modal>
      )}
    </div>
  );
}
