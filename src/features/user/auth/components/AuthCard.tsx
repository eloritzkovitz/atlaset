import { Card } from "@components";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="max-w-md w-full p-6 rounded-lg shadow-lg">
      {children}
    </Card>
  );
}
