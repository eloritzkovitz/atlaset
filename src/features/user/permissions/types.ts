/** Represents the permission levels for a user in a shared context. */
export type Permission = "viewer" | "editor";

/** Represents the access level for a user to a shared resource. */
export type ResourceAccess = "owner" | Permission;
