export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface max-w-md w-full p-6 rounded-lg shadow-lg">
      {children}
    </div>
  );
}
