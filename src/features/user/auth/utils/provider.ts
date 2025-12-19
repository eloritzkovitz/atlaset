/**
 * @file Contains utility functions for user authentication providers
 */

/**
 * Checks if the user signed up using email/password provider
 * @param user - The user object
 * @returns True if the user is a password provider, false otherwise
 */
export function isPasswordProvider(user: any) {
  return user?.providerData?.some((p: any) => p.providerId === "password");
}
