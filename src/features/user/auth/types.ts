/** Represents a user session. */
export type UserSession = {
  /** Document ID. */
  id: string;
  /** User ID. */
  userId: string;
  /** Session ID. */
  sessionId: string;
  /** User agent string. */
  userAgent: string;
  /** Browser language preference. */
  language: string;
  /** Display resolution dimensions. */
  screen: string;
  /** IP address. */
  ipAddress?: string;
  /** Location. */
  location?: string;
  /** Epoch timestamp tracking recent interactions. */
  lastActive: number;
  /** Optional user-assigned friendly name. */
  deviceName?: string;
};
