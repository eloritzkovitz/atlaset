import { useState, useEffect } from "react";
import type { BatteryStatus, DeviceType } from "@types";
import { useEventListener } from "../dom/useEventListener";
import { determineDeviceFromHardware, isWindowDefined } from "@utils";

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryStatus>;
  }
}

/**
 * Determines the current screen size and device type based on window dimensions and hardware features.
 * @returns An object with boolean flags for isMobile, isLaptop, and isDesktop.
 */
export function useScreenSize() {
  const [dimensions, setDimensions] = useState(() => ({
    width: isWindowDefined() ? window.innerWidth : 0,
    height: isWindowDefined() ? window.innerHeight : 0,
  }));

  const [hasBattery, setHasBattery] = useState(false);

  // Update dimensions on window resize
  useEventListener(
    "resize",
    () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight }),
    isWindowDefined() ? window : undefined,
  );

  // Check for battery support and determine if the device is likely a laptop
  useEffect(() => {
    if (isWindowDefined() && navigator.getBattery) {
      navigator
        .getBattery()
        .then((battery: BatteryStatus) => {
          const isLikelyLaptop =
            !battery.charging ||
            battery.dischargingTime !== Infinity ||
            battery.level < 1;
          setHasBattery(isLikelyLaptop);
        })
        .catch(() => {});
    }
  }, []);

  const hasTouch = isWindowDefined() ? navigator.maxTouchPoints > 0 : false;

  const deviceType: DeviceType = determineDeviceFromHardware({
    width: dimensions.width,
    hasBattery,
    hasTouch,
  });

  return {
    width: dimensions.width,
    isPortrait: dimensions.height > dimensions.width,
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isLaptop: deviceType === "laptop",
    isDesktop: deviceType === "desktop",
  };
}
