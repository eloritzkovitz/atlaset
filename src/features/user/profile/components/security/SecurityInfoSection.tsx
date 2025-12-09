import { useAuth } from "@contexts/AuthContext";
import { useUserDevices } from "@features/user/auth/hooks/useUserDevices";
import { capitalize } from "@utils/string";
import { SecurityInfoRow } from "./SecurityInfoRow";
import { useUserActivity } from "../../hooks/useUserActivity";
import { FaDesktop, FaMobile, FaTablet } from "react-icons/fa6";

export function SecurityInfoSection() {
  const { user } = useAuth();
  const { activity } = useUserActivity(user?.uid);
  const devices = useUserDevices(user?.uid);

  // Get last login event
  const lastLogin = activity
    .filter((a) => a.action === "login")
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  // Get device icon based on user agent
  function getDeviceIcon(device: any) {
    const ua = device.userAgent || "";
    if (/mobile/i.test(ua)) return <FaMobile className="mr-2" size={28} />;
    if (/tablet|ipad/i.test(ua)) return <FaTablet className="mr-2" size={28} />;
    return <FaDesktop className="mr-2 mb-4" size={64} />;
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
            lastLogin?.details?.method
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
                <>
                  {getDeviceIcon(device)}
                  {device.deviceName || device.userAgent || "Device"}
                </>
              }
              value={
                device.lastActive
                  ? `Last active: ${new Date(
                      device.lastActive
                    ).toLocaleString()}`
                  : "Unknown"
              }
            />
          ))
        )}
      </ul>
    </section>
  );
}
