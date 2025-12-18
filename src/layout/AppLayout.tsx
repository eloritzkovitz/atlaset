import React from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { ShortcutsModal } from "./Shortcuts/ShortcutsModal";
import { UserMenu } from "./UserMenu/UserMenu";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout relative h-screen w-screen bg-bg overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col h-full min-w-0">
        <UserMenu />
        <main className="flex-1 overflow-auto pb-16 sm:pb-0">{children}</main>
      </div>
      <ShortcutsModal />
    </div>
  );
}
