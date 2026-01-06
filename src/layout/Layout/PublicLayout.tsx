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
    <div className="h-screen w-full bg-bg overflow-y-auto py-0">
      <PublicHeader showAuthButtons={showAuthButtons} />
      {/* Main content */}
      <main className="flex flex-col items-center flex-1 justify-center">
        {children}
      </main>
      <Footer>{footer}</Footer>
    </div>
  );
}
