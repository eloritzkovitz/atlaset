// AppLayout.tsx
import React, { useState } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { ShortcutsModal } from "./Shortcuts/ShortcutsModal";
import { UserMenu } from "./UserMenu/UserMenu";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="app-layout relative h-screen w-screen">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <div className="flex flex-col h-full min-w-0">
        <UserMenu />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <ShortcutsModal />
    </div>
  );
}
