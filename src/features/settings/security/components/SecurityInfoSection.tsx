import { useTranslation } from "react-i18next";
import { FaDesktop, FaMobile, FaPowerOff, FaTablet } from "react-icons/fa6";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useLastLogin } from "@features/activity";
import {
  authService,
  isCurrentSession,
  useUserSessions,
  type UserSession,
} from "@features/user";
import { formatDate } from "@utils/date";
import { SecurityInfoRow } from "./SecurityInfoRow";

export function SecurityInfoSection() {
  const { user } = useAuth();
  const { timestamp: lastLoginTimestamp, method: lastLoginMethod } =
    useLastLogin();
  const { t } = useTranslation("settings");
  const { sessions, terminateSession } = useUserSessions(user?.uid);

  // Get device icon based on user agent
  function getDeviceIcon(session: UserSession) {
    const ua = session.userAgent || "";
    if (/mobile/i.test(ua)) return <FaMobile className="me-4" size={64} />;
    if (/tablet|ipad/i.test(ua)) return <FaTablet className="me-4" size={64} />;
    return <FaDesktop className="me-4" size={64} />;
  }

  // Handle device removal
  async function handleEndSession(session: UserSession) {
    try {
      const current = isCurrentSession(session.sessionId);

      // If the session being terminated is the current one, clear local session data
      await terminateSession(session.id, session.sessionId);

      // If the terminated session was the current one, log out the user
      if (current) {
        await authService.logout();
      }
    } catch (error) {
      console.error("Failed to safely terminate session:", error);
    }
  }

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
            lastLoginMethod ? String(lastLoginMethod) : t("security.unknown")
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
            <SecurityInfoRow
              key={session.id}
              label={
                <span className="flex items-center">
                  {getDeviceIcon(session)}
                  <span className="text">
                    {session.deviceName ||
                      session.userAgent ||
                      t("security.device")}
                  </span>
                </span>
              }
              value={
                <div className="flex items-center min-w-[20rem] mx-4">
                  {session.lastActive
                    ? t("security.lastActive", {
                        date: formatDate(session.lastActive, "long"),
                      })
                    : t("security.unknown")}
                  <ActionButton
                    variant="primary"
                    className="text-white !rounded-xl"
                    icon={<FaPowerOff size={18} />}
                    title={t("security.actions.endSessionTitle")}
                    ariaLabel={t("security.actions.endSession")}
                    onClick={() => handleEndSession(session)}
                  >
                    {t("security.actions.endSession")}
                  </ActionButton>
                </div>
              }
            />
          ))
        )}
      </ul>
    </section>
  );
}
