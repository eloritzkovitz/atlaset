import { useAuth } from "@contexts/AuthContext";
import { UserActivitySection } from "@features/user";
import { usePageTitle } from "@hooks";
import { Header } from "@layout";

export default function ActivityPage() {
  const { user } = useAuth();

  // Set page title
  usePageTitle("Activity Log");

  // If user is not authenticated, return null
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen h-screen w-screen bg-bg overflow-x-hidden">
      <Header />
      <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0">
        <div className="flex flex-col gap-6 items-center">
          <div className="w-full max-w-2xl">
            <UserActivitySection />
          </div>
        </div>
      </main>
    </div>
  );
}
