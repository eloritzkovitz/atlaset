import { useEffect, useState } from "react";
import { getUserCollection } from "@utils/firebase";
import { getDocs, query, orderBy } from "firebase/firestore";

/**
 * Fetches and returns the list of devices associated with a user.
 * @param userId The ID of the user whose devices to fetch.
 * @returns An array of user devices.
 */
export function useUserDevices(userId?: string) {
  const [devices, setDevices] = useState<any[]>([]);
  useEffect(() => {
    if (!userId) return;
    const fetchDevices = async () => {
      const devicesCol = getUserCollection("devices");
      const q = query(devicesCol, orderBy("lastActive", "desc"));
      const snapshot = await getDocs(q);
      setDevices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchDevices();
  }, [userId]);
  return devices;
}
