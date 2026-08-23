import React, { Suspense } from "react";
import { useUI } from "@app/contexts/UIContext";
import { HelpPanel } from "@features/docs/components/HelpPanel";
import { SearchPanel } from "@features/search/components/SearchPanel";
import { ShortcutsModal } from "@features/settings/accessibility/components/ShortcutsModal";
import { FriendsPanel } from "@features/user/friends/components/FriendsPanel";
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
    showCalendar,
  } = useUI();

  return (
    <>
      {isAuthenticated() && (
        <FriendsPanel open={showFriends} onClose={toggleFriends} />
      )}
      <SearchPanel open={showSearch} onClose={toggleSearch} />
      <HelpPanel open={showHelp} onClose={toggleHelp} />
      <ShortcutsModal />
      {showCalendar && (
        <Suspense fallback={null}>
          <CalendarModal />
        </Suspense>
      )}
    </>
  );
}
