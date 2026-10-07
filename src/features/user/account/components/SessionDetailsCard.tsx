import { useTranslation } from "react-i18next";
import { ActionButton, Card, PageHeader } from "@components";
import { ICONS } from "@constants/icons";
import { formatDate, parseUserAgent } from "@utils";
import type { UserSession } from "../types";

interface SessionDetailsCardProps {
  session: UserSession;
  onBack: () => void;
  onTerminate: (session: UserSession) => void;
}

/** Renders detailed information for a selected user session. */
export function SessionDetailsCard({
  session,
  onBack,
  onTerminate,
}: SessionDetailsCardProps) {
  const { t } = useTranslation("settings");

  const readableDevice = parseUserAgent(session.userAgent || "");

  const isOnline = session.lastActive
    ? Date.now() - new Date(session.lastActive).getTime() < 5 * 60 * 1000
    : false;

  const hasDistinctLocation =
    session.location && session.location !== session.ipAddress;

  return (
    <Card className="p-5">
      <PageHeader
        title={session.deviceName || readableDevice}
        onBack={onBack}
        className="!mb-1"
      />

      <div className="flex items-center mb-6">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm ps-6">
            <span
              className={isOnline ? "text-success font-medium" : "text-muted"}
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

      <div className="space-y-4">
        {session.ipAddress && (
          <div>
            <div className="text-xs text-muted mb-1">
              {t("security.ipAddress")}
            </div>
            <div className="break-all">{session.ipAddress}</div>
          </div>
        )}

        {hasDistinctLocation && (
          <div>
            <div className="text-xs text-muted mb-1">
              {t("security.location")}
            </div>
            <div className="break-words">{session.location}</div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6 pt-4">
        <ActionButton
          variant="secondary"
          icon={<ICONS.poweroff className="text-lg" />}
          ariaLabel={t("security.actions.endSession")}
          onClick={() => onTerminate(session)}
          className="!bg-danger/70 !rounded-full hover:!bg-danger-hover/70"
        >
          {t("security.actions.endSessionTitle")}
        </ActionButton>
      </div>
    </Card>
  );
}
