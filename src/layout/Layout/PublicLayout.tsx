import { Footer } from "../Footer/Footer";
import { PublicHeader } from "../Header/PublicHeader";

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
    <div className="min-h-screen bg-bg flex flex-col justify-between">
      <PublicHeader showAuthButtons={showAuthButtons} />
      {/* Main content */}
      <main className="flex flex-col items-center flex-1 justify-center">
        {children}
      </main>
      <Footer>{footer}</Footer>
    </div>
  );
}
