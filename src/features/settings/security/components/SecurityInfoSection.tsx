import { useTranslation } from "react-i18next";
import { FaDesktop, FaMobile, FaPowerOff, FaTablet } from "react-icons/fa6";
import { deleteDoc, doc } from "firebase/firestore";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import {
  authService,
  isCurrentSession,
  useUserActivity,
  useUserDevices,
  type Device,
} from "@features/user";
import { getUserCollection } from "@utils/firebase";
import { getTimestamp } from "@utils/date";
import { capitalize } from "@utils/string";
import { SecurityInfoRow } from "./SecurityInfoRow";

export function SecurityInfoSection() {
  const { t } = useTranslation("settings");
  const { user } = useAuth();
  const { activity } = useUserActivity();
  const devices = useUserDevices(user?.uid);

  const lastLogin = activity
    .filter((a) => a.action === 102)
    .sort((a, b) => getTimestamp(b.timestamp) - getTimestamp(a.timestamp))[0];

  // Get device icon based on user agent
  function getDeviceIcon(device: Device) {
    const ua = device.userAgent || "";
    if (/mobile/i.test(ua)) return <FaMobile className="me-4" size={64} />;
    if (/tablet|ipad/i.test(ua)) return <FaTablet className="me-4" size={64} />;
    return <FaDesktop className="me-4" size={64} />;
  }

  // Handle device removal
  async function handleRemoveDevice(deviceId: string, sessionId?: string) {
    const devicesCol = getUserCollection("devices");
    await deleteDoc(doc(devicesCol, deviceId));
    if (isCurrentSession(sessionId)) {
      await authService.logout();
      localStorage.removeItem("sessionId");
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
              ? new Date(user.metadata.creationTime).toLocaleString()
              : t("security.unknown")
          }
        />
        <SecurityInfoRow
          label={t("security.lastLogin")}
          value={
            lastLogin
              ? new Date(lastLogin.timestamp).toLocaleString()
              : t("security.noLoginRecorded")
          }
        />
        <SecurityInfoRow
          label={t("security.lastLoginMethod")}
          value={
            lastLogin &&
            lastLogin.details &&
            typeof lastLogin.details === "object" &&
            "method" in lastLogin.details &&
            typeof lastLogin.details.method === "string"
              ? capitalize(lastLogin.details.method)
              : t("security.unknown")
          }
        />
      </ul>
      <h2 className="text-2xl font-bold mb-6 mt-8 self-start">
        {t("security.loggedInDevices")}
      </h2>
      <ul className="space-y-4">
        {devices.length === 0 ? (
          <SecurityInfoRow
            label={t("security.devicesLabel")}
            value={t("security.devicesNone")}
          />
        ) : (
          devices.map((device) => (
            <SecurityInfoRow
              key={device.id}
              label={
                <span className="flex items-center">
                  {getDeviceIcon(device)}
                  <span className="text">
                    {device.deviceName ||
                      device.userAgent ||
                      t("security.device")}
                  </span>
                </span>
              }
              value={
                <div className="flex items-center min-w-[20rem] mx-4">
                  {device.lastActive
                    ? t("security.lastActive", {
                        date: new Date(device.lastActive).toLocaleString(),
                      })
                    : t("security.unknown")}
                  <ActionButton
                    variant="primary"
                    className="text-white !rounded-xl"
                    icon={<FaPowerOff size={18} />}
                    title={t("security.actions.endSessionTitle")}
                    ariaLabel={t("security.actions.endSession")}
                    onClick={() => handleRemoveDevice(device.id)}
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
