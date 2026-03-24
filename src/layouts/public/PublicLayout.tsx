import React, { Suspense } from "react";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

interface PublicLayoutProps {
  children: React.ReactNode;
  showAuthButtons?: boolean;
  footer?: React.ReactNode;
}

export function PublicLayout({
  children,
  showAuthButtons = false,
  footer,
}: PublicLayoutProps) {
  return (
    <Suspense fallback={<div className="relative h-screen w-screen bg-bg" />}>
      <div className="public-layout flex flex-col min-h-screen h-screen w-screen bg-bg overflow-x-hidden">
        <PublicHeader showAuthButtons={showAuthButtons} />
        <main className="flex-1 flex flex-col items-center justify-center pb-16 sm:pb-0">
          {children}
        </main>
        <PublicFooter>{footer}</PublicFooter>
      </div>
    </Suspense>
  );
}
