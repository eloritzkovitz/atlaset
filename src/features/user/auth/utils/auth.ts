/**
 * Utility functions for user authentication providers.
 */

export interface MinimalProviderData {
  providerId: string;
}

/**
 * Checks if the user signed up using email/password provider.
 * @param providerData - The provider data array.
 * @returns True if the user is a password provider, false otherwise.
 */
export function isPasswordProvider(
  providerData: MinimalProviderData[] | undefined | null,
): boolean {
  return !!providerData?.some((p) => p.providerId === "password");
}

/**
 * Validates if a given user is deactivated.
 */
export function isUserDeactivated(status: string | undefined | null): boolean {
  return status === "deactivated";
}
