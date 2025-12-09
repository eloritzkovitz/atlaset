import { addDoc } from "firebase/firestore";
import { getUserCollection } from "@utils/firebase";

/**
 * Gathers device information from the browser.
 * @returns An object containing device information.
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
  };
}

/**
 * Logs device information to Firestore.
 * @param userId The ID of the user.
 */
export async function logDevice(userId: string) {
  const deviceInfo = getDeviceInfo();
  const devicesCol = getUserCollection("devices");
  await addDoc(devicesCol, {
    ...deviceInfo,
    lastActive: Date.now(),
    userId,
  });
}
