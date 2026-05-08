import React, { Suspense } from "react";
import { useUI } from "@contexts/UIContext";
import { HelpPanel } from "@features/docs";
import { FriendsPanel } from "@features/user";
import { isAuthenticated } from "@utils/firebase";
import { SearchPanel } from "@features/search/components/SearchPanel";
import { LanguagePicker } from "../language/LanguagePicker";
import { ShortcutsModal } from "../shortcuts/ShortcutsModal";

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
    showLanguagePicker,
    closeLanguagePicker,
  } = useUI();

  return (
    <>
      {isAuthenticated() && (
        <FriendsPanel open={showFriends} onClose={toggleFriends} />
      )}
      <SearchPanel open={showSearch} onClose={toggleSearch} />
      <HelpPanel open={showHelp} onClose={toggleHelp} />
      <ShortcutsModal />
      <LanguagePicker
        isOpen={showLanguagePicker}
        onClose={closeLanguagePicker}
      />
      <Suspense>
        <CalendarModal />
      </Suspense>
    </>
  );
}
