/** Activity details associated with a user activity. */
export interface ActivityDetails extends Record<string, unknown> {
  itemName?: string;
  location?: string;
  date?: string;
  userName?: string;
  friendName?: string;
}

/** User activity log entry. */
export interface UserActivity {
  id: string;
  action: number;
  timestamp: number | string | Date;
  details?: ActivityDetails;
}
