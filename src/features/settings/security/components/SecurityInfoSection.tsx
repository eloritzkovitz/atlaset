import { useTranslation } from "react-i18next";
import { useAuth } from "@contexts/AuthContext";
import { useLastLogin } from "@features/activity";
import { useUserSessions } from "@features/user/auth";
import { formatDate } from "@utils/date";
import { capitalize } from "@utils/string";
import { SecurityInfoRow } from "./SecurityInfoRow";
import { SessionRow } from "./SessionRow";

/** Renders a section with user security information. */
export function SecurityInfoSection() {
  const { user } = useAuth();
  const { timestamp: lastLoginTimestamp, method: lastLoginMethod } =
    useLastLogin();
  const { t } = useTranslation("settings");
  const { sessions, terminateSession } = useUserSessions(user?.uid);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("security.title")}
      </h2>
      <ul className="space-y-4">
        <SecurityInfoRow
          label={t("security.email")}
          value={user?.email || t("security.noEmail")}
        />
        <SecurityInfoRow
          label={t("security.accountCreated")}
          value={
            user?.metadata?.creationTime
              ? formatDate(user.metadata.creationTime, "long")
              : t("security.unknown")
          }
        />
        <SecurityInfoRow
          label={t("security.lastLogin")}
          value={
            lastLoginTimestamp
              ? formatDate(lastLoginTimestamp, "long")
              : t("security.noLoginRecorded")
          }
        />
        <SecurityInfoRow
          label={t("security.lastLoginMethod")}
          value={
            lastLoginMethod
              ? capitalize(String(lastLoginMethod))
              : t("security.unknown")
          }
        />
      </ul>

      <h2 className="text-2xl font-bold mb-6 mt-8 self-start">
        {t("security.loggedInDevices")}
      </h2>
      <ul className="space-y-4">
        {sessions.length === 0 ? (
          <SecurityInfoRow
            label={t("security.devicesLabel")}
            value={t("security.devicesNone")}
          />
        ) : (
          sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              onTerminate={terminateSession}
            />
          ))
        )}
      </ul>
    </section>
  );
}
