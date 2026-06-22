import { useTranslation } from "react-i18next";
import { UserActivitySection } from "@features/user";
import { usePageTitle } from "@hooks";

export default function ActivityPage() {
  const { t } = useTranslation("activity");
  
  usePageTitle(t("activityLog", "Activity Log"));

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-1 gap-6 items-center mt-12">
        <div className="w-full max-w-6xl">
          <UserActivitySection />
        </div>
      </div>
    </main>
  );
}
