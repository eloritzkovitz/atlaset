import React, { useRef, useState, useEffect } from "react";
import { useUI } from "@contexts/UIContext";
import { HelpPanel } from "@features/documentation";
import { FriendsPanel } from "@features/user";
import { Sidebar } from "../Sidebar/Sidebar";
import { ShortcutsModal } from "../Shortcuts/ShortcutsModal";
import { UserMenu } from "../UserMenu/UserMenu";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { showFriends, toggleFriends, showHelp, toggleHelp } = useUI();
  const mainRef = useRef<HTMLMapElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  // Handle scroll to show/hide user menu
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    // Check if main is scrollable
    const checkScrollable = () => {
      setIsScrollable(main.scrollHeight > main.clientHeight);
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    // Observe mutations to re-check scrollability
    const observer = new MutationObserver(checkScrollable);
    observer.observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // Scroll event listener
    const handleScroll = () => {
      const scrollTop = main.scrollTop;
      setShowUserMenu(scrollTop === 0);
    };
    main.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", checkScrollable);
      main.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [children]);

  return (
    <div className="app-layout relative h-screen w-screen bg-bg overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col h-full min-w-0">
        <div
          className={`absolute transition-transform duration-300 z-30 w-auto
            ${isScrollable ? "right-6" : "right-4"}
            ${
              showUserMenu
                ? "top-4 translate-y-0"
                : "top-0 -translate-y-[calc(100%+1rem)]"
            }
          `}
        >
          <UserMenu fixed={false} />
        </div>
        <FriendsPanel open={showFriends} onClose={toggleFriends} />
        <HelpPanel open={showHelp} onClose={toggleHelp} />
        <main
          ref={mainRef}
          className="flex-1 h-0 min-h-0 overflow-auto pb-16 sm:pb-0"
        >
          {children}
        </main>
      </div>
      <ShortcutsModal />
    </div>
  );
}
