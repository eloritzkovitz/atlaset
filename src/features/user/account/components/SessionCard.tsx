import { useTranslation } from "react-i18next";
import { Card } from "@components";
import { ICONS } from "@constants/icons";
import { formatDate, getDeviceType, parseUserAgent } from "@utils";
import type { UserSession } from "../types";
import { isDevSession } from "../utils/session";

interface SessionCardProps {
  session: UserSession;
  isCurrent: boolean;
  onClick: (session: UserSession) => void;
}

/** Renders a compact session card in the security settings. */
export function SessionCard({ session, isCurrent, onClick }: SessionCardProps) {
  const { t } = useTranslation("settings");

  const readableDevice = parseUserAgent(session.userAgent || "");

  const isOnline = session.lastActive
    ? Date.now() - new Date(session.lastActive).getTime() < 5 * 60 * 1000
    : false;

  const deviceType = getDeviceType(session.userAgent);
  const DeviceIcon = ICONS.device[deviceType];

  return (
    <Card hoverEffect="scale" className="p-4">
      <button
        type="button"
        className="w-full text-start"
        onClick={() => onClick(session)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center py-1 min-w-0 flex-1">
            <div className="flex h-14 w-14 bg-surface rounded-full items-center justify-center shrink-0 me-2">
              <DeviceIcon className="text-3xl text-muted" />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold break-words">
                  {session.deviceName || readableDevice}
                </span>

                {isCurrent && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted shrink-0" />
                    <span className="text-muted text-sm font-medium">
                      {t("security.currentSession")}
                    </span>
                  </>
                )}

                {isDevSession(session) && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                    DEV
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isOnline ? "bg-success animate-pulse" : "bg-muted"
                  }`}
                />

                <span
                  className={
                    isOnline ? "text-success font-medium" : "text-muted"
                  }
                >
                  {isOnline
                    ? t("security.activeNow")
                    : session.lastActive
                      ? t("security.lastActive", {
                          date: formatDate(session.lastActive, "long"),
                        })
                      : t("security.unknown")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </Card>
  );
}
