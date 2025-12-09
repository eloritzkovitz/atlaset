import { Branding } from "@components";

interface AuthLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-700 flex flex-col justify-between">
      {/* Header with branding */}
      <header className="flex flex-start items-center mt-2 ml-8">
        <Branding size={56} />
        <h2 className="text-4xl font-bold text-blue-800 dark:text-gray-100 ml-1 mt-4">
          Atlaset
        </h2>
      </header>
      {/* Main content */}
      <main className="flex flex-col items-center flex-1 justify-center">
        {children}
      </main>
      {/* Footer */}
      <footer className="mt-8 py-4 text-center text-gray-400 text-sm">
        {footer}
        <div className="mt-2">© {new Date().getFullYear()} Atlaset</div>
      </footer>
    </div>
  );
}
