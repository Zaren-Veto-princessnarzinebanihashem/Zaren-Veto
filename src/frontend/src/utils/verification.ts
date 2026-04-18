/**
 * Shared verification utility for Zaren Veto.
 *
 * The blue verification badge (Facebook/Instagram style) is owner-only by default.
 * Only the backend can set isVerified=true on other accounts.
 * The owner account "Princess Narzine Bani Hashem" is always verified,
 * regardless of backend flag.
 */

/** The canonical owner/admin username */
export const ADMIN_USERNAME = "Princess Narzine Bani Hashem";

/**
 * Normalize a username for loose matching:
 * strips spaces, underscores, hyphens, then lowercases.
 */
function normalizeUsername(name: string): string {
  return name.toLowerCase().replace(/[\s_\-]/g, "");
}

/**
 * Returns true if the user should display a verification badge.
 *
 * Priority:
 * 1. `isVerifiedFromBackend === true`  (backend explicitly granted verification)
 * 2. Username matches the owner "Princess Narzine Bani Hashem"
 *    (case-insensitive, ignoring spaces/underscores/hyphens)
 *
 * This dual check ensures the owner always has the badge even if the backend
 * isVerified field hasn't been set yet, and other users can get it once the
 * owner grants it via the backend.
 */
export function isVerifiedUser(
  username: string,
  isVerifiedFromBackend?: boolean,
): boolean {
  if (isVerifiedFromBackend === true) return true;
  if (!username) return false;
  const normalized = normalizeUsername(username);
  // Match owner: "Princess Narzine Bani Hashem" in any casing/spacing form
  return (
    normalized === "princessnarzinebanihashem" ||
    normalized === "princessnarzine" ||
    normalized === "narzinebanihashem"
  );
}
