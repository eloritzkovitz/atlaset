import { useAuth } from "@contexts/AuthContext";
import { useUserDevices } from "@features/user/auth/hooks/useUserDevices";
import { capitalize } from "@utils/string";
import { SecurityInfoRow } from "./SecurityInfoRow";
import { useUserActivity } from "../../hooks/useUserActivity";

export function SecurityInfoSection() {
  const { user } = useAuth();
  const { activity } = useUserActivity(user?.uid);
  const devices = useUserDevices(user?.uid);

  // Get last login event
  const lastLogin = activity
    .filter((a) => a.action === "login")
    .sort((a, b) => b.timestamp - a.timestamp)[0];

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
        <ul className="space-y-4 mt-8">
          <h4 className="font-semibold mb-2">Logged-in Devices</h4>
          {devices.length === 0 ? (
            <SecurityInfoRow label="Devices" value="No active devices" />
          ) : (
            devices.map((device) => (
              <SecurityInfoRow
                key={device.id}
                label={device.deviceName || device.userAgent || "Device"}
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
      </ul>
    </section>
  );
}
