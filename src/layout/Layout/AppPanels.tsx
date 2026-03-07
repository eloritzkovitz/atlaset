import React, { Suspense } from "react";
import { LoadingSpinner } from "@components";
import { useUI } from "@contexts/UIContext";
import { HelpPanel } from "@features/docs";
import { FriendsPanel } from "@features/user";
import { isAuthenticated } from "@utils/firebase";
import { ShortcutsModal } from "../Shortcuts/ShortcutsModal";

const CalendarModal = React.lazy(
  () => import("@features/calendar/components/CalendarModal"),
);

/** Renders global app panels. */
export function AppPanels() {
  const { showFriends, toggleFriends, showHelp, toggleHelp } = useUI();

  return (
    <>
      {isAuthenticated() && (
        <FriendsPanel open={showFriends} onClose={toggleFriends} />
      )}
      <HelpPanel open={showHelp} onClose={toggleHelp} />
      <ShortcutsModal />
      <Suspense
        fallback={<LoadingSpinner fullScreen message="Loading calendar..." />}
      >
        <CalendarModal />
      </Suspense>
    </>
  );
}
