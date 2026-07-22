import { useTranslation } from "react-i18next";
import { UserActivitySection } from "@features/activity";
import { usePageTitle } from "@hooks";
import { Container } from "@layouts";

export default function ActivityPage() {
  const { t } = useTranslation("activity");

  usePageTitle(t("activityLog", "Activity Log"));

  return (
    <Container className="mt-12">
      <UserActivitySection />
    </Container>
  );
}
