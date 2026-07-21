/** Represents a device. */
export type DeviceType = "desktop" | "laptop" | "tablet" | "mobile";

/** Represents the hardware specifications of a device. */
export type HardwareSpecs = {
  width: number;
  hasBattery: boolean;
  hasTouch: boolean;
};

/** Represents the battery status of a device. */
export type BatteryStatus = {
  charging: boolean;
  dischargingTime: number;
  level: number;
};
