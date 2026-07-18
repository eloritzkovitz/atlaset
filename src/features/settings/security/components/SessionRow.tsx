import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { formatDate } from "@utils/date";
import { getDeviceType, parseUserAgent } from "@utils/device";
import { isCurrentSession, type UserSession } from "@features/user";
import { SecurityInfoRow } from "./SecurityInfoRow";

interface SessionRowProps {
  session: UserSession;
  onTerminate: (session: UserSession) => void;
}

/** Renders a row for a user session in the security settings. */
export function SessionRow({ session, onTerminate }: SessionRowProps) {
  const { t } = useTranslation("settings");

  const isCurrent = isCurrentSession(session.sessionId);
  const readableDevice = parseUserAgent(session.userAgent || "");

  const isOnline = session.lastActive
    ? Date.now() - new Date(session.lastActive).getTime() < 5 * 60 * 1000
    : false;

  const deviceType = getDeviceType(session.userAgent);
  const DeviceIcon = ICONS.device[deviceType];

  const hasDistinctLocation =
    session.location && session.location !== session.ipAddress;

  return (
    <SecurityInfoRow
      label={
        <div className="flex items-center py-1">
          <DeviceIcon className="text-3xl text-muted me-4" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              {session.deviceName || readableDevice}
            </span>

            <div className="flex items-center gap-2 text-xs">
              {isCurrent && (
                <span className="text-success font-medium">This device</span>
              )}
              {isCurrent && isOnline && <span className="text-muted">•</span>}
              {isOnline && (
                <span className="text-success font-medium">Active now</span>
              )}
            </div>

            {session.ipAddress && (
              <span className="text-xs text-muted">{session.ipAddress}</span>
            )}
            {hasDistinctLocation && (
              <span className="text-xs text-muted font-medium">
                {session.location}
              </span>
            )}
          </div>
        </div>
      }
      value={
        <div className="flex items-center justify-between gap-6 min-w-[22rem] mx-4">
          <div className="flex items-center gap-2">
            {!isCurrent && isOnline && (
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            )}

            {!isCurrent && (
              <span className="text-sm text-muted">
                {session.lastActive
                  ? t("security.lastActive", {
                      date: formatDate(session.lastActive, "long"),
                    })
                  : t("security.unknown")}
              </span>
            )}
          </div>

          <div className="flex pe-2">
            <ActionButton
              className="rounded-full text-danger hover:text-danger-hover"
              icon={<ICONS.poweroff className="text-lg" />}
              title={t("security.actions.endSessionTitle")}
              ariaLabel={t("security.actions.endSession")}
              onClick={() => onTerminate(session)}
            />
          </div>
        </div>
      }
    />
  );
}
