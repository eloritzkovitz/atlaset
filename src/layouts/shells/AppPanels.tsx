import React, { Suspense } from "react";
import { useUI } from "@contexts/UIContext";
import { HelpPanel } from "@features/docs";
import { SearchPanel } from "@features/search";
import { ShortcutsModal } from "@features/settings";
import { FriendsPanel } from "@features/user";
import { isAuthenticated } from "@lib/firebase";

const CalendarModal = React.lazy(
  () => import("@features/calendar/components/CalendarModal"),
);

/** Renders global app panels. */
export function AppPanels() {
  const {
    showFriends,
    toggleFriends,
    showSearch,
    toggleSearch,
    showHelp,
    toggleHelp,
  } = useUI();

  return (
    <>
      {isAuthenticated() && (
        <FriendsPanel open={showFriends} onClose={toggleFriends} />
      )}
      <SearchPanel open={showSearch} onClose={toggleSearch} />
      <HelpPanel open={showHelp} onClose={toggleHelp} />
      <ShortcutsModal />
      <Suspense>
        <CalendarModal />
      </Suspense>
    </>
  );
}
