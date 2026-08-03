import { useTranslation } from "react-i18next";
import { Container } from "@components";
import { UserActivitySection } from "@features/activity";
import { usePageTitle } from "@hooks";

export default function ActivityPage() {
  const { t } = useTranslation("activity");

  usePageTitle(t("activityLog", "Activity Log"));

  return (
    <Container className="mt-12">
      <UserActivitySection />
    </Container>
  );
}
