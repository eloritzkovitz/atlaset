export interface ActivityDetails {
  itemName?: string;
  location?: string;
  date?: string;
  userName?: string;
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: number | string | Date;
  details?: ActivityDetails;
}

export type Device = {
  userAgent?: string;
  deviceName?: string;
  id: string;
  lastActive?: number;
};
