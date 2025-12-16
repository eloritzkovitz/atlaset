import { BrandFooter, BrandHeader } from "@components";

interface AuthLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between">
      <BrandHeader />
      {/* Main content */}
      <main className="flex flex-col items-center flex-1 justify-center">
        {children}
      </main>
      <BrandFooter>{footer}</BrandFooter>
    </div>
  );
}
