import { FaDesktop, FaMobile, FaPowerOff, FaTablet } from "react-icons/fa6";
import { deleteDoc, doc } from "firebase/firestore";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { authService } from "@features/user";
import { useUserDevices } from "@features/user/auth/hooks/useUserDevices";
import { isCurrentSession } from "@features/user/auth/utils/device";
import { useUserActivity } from "@features/user/activity/hooks/useUserActivity";
import type { Device } from "@features/user/types";
import { getUserCollection } from "@utils/firebase";
import { getTimestamp } from "@utils/date";
import { capitalize } from "@utils/string";
import { SecurityInfoRow } from "./SecurityInfoRow";

export function SecurityInfoSection() {
  const { user } = useAuth();
  const { activity } = useUserActivity(user?.uid);
  const devices = useUserDevices(user?.uid);

  const lastLogin = activity
    .filter((a) => a.action === 102)
    .sort((a, b) => getTimestamp(b.timestamp) - getTimestamp(a.timestamp))[0];

  // Get device icon based on user agent
  function getDeviceIcon(device: Device) {
    const ua = device.userAgent || "";
    if (/mobile/i.test(ua)) return <FaMobile className="mr-4" size={64} />;
    if (/tablet|ipad/i.test(ua)) return <FaTablet className="mr-4" size={64} />;
    return <FaDesktop className="mr-4" size={64} />;
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
      <h3 className="text-lg font-semibold mb-4">Security</h3>
      <ul className="space-y-4">
        <SecurityInfoRow label="Email" value={user?.email || "No email"} />
        <SecurityInfoRow
          label="Account Created"
          value={
            user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleString()
              : "Unknown"
          }
        />
        <SecurityInfoRow
          label="Last Login"
          value={
            lastLogin
              ? new Date(lastLogin.timestamp).toLocaleString()
              : "No login recorded"
          }
        />
        <SecurityInfoRow
          label="Last Login Method"
          value={
            lastLogin &&
            lastLogin.details &&
            typeof lastLogin.details === "object" &&
            "method" in lastLogin.details &&
            typeof lastLogin.details.method === "string"
              ? capitalize(lastLogin.details.method)
              : "Unknown"
          }
        />
      </ul>
      <h4 className="font-semibold mb-2 mt-8">Logged-in Devices</h4>
      <ul className="space-y-4">
        {devices.length === 0 ? (
          <SecurityInfoRow label="Devices" value="No active devices" />
        ) : (
          devices.map((device) => (
            <SecurityInfoRow
              key={device.id}
              label={
                <span className="flex items-center">
                  {getDeviceIcon(device)}
                  <span className="text-lg">
                    {device.deviceName || device.userAgent || "Device"}
                  </span>
                </span>
              }
              value={
                <div className="flex items-center">
                  {device.lastActive
                    ? `Last active: ${new Date(
                        device.lastActive
                      ).toLocaleString()}`
                    : "Unknown"}
                  <ActionButton
                    className="py-2 px-4 bg-blue-800 text-white rounded-full hover:bg-blue-700"
                    icon={<FaPowerOff size={18} />}
                    title="End this session"
                    ariaLabel="End session"
                    onClick={() => handleRemoveDevice(device.id)}
                  >
                    End Session
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
