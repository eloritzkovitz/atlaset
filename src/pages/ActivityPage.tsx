import { UserActivitySection } from "@features/user";
import { usePageTitle } from "@hooks";

export default function ActivityPage() {
  usePageTitle("Activity Log | Atlaset");

  return (
    <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0 mt-12">
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full max-w-4xl">
          <UserActivitySection />
        </div>
      </div>
    </main>
  );
}
