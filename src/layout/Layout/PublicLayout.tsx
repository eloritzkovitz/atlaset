import { Footer, PublicHeader } from "@layout";

interface PublicLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function PublicLayout({ children, footer }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between">
      <PublicHeader />
      {/* Main content */}
      <main className="flex flex-col items-center flex-1 justify-center">
        {children}
      </main>
      <Footer>{footer}</Footer>
    </div>
  );
}
