/**
 * Shared verification utility for Zaren Veto.
 *
 * The blue verification badge (Facebook/Instagram/Meta style - spiked 12-ray circle)
 * is owner-only by default. Only the backend can set isVerified=true on other accounts.
 * The owner account "Princess Narzine Bani Hashem" is always verified,
 * regardless of backend flag.
 */

/** The canonical owner/admin username */
export const ADMIN_USERNAME = "Princess Narzine Bani Hashem";

/** The two blue profile lines shown exclusively on the owner's profile — no duplicates, no extra words */
export const OWNER_PROFILE_LINE1 = "Personnalité Publique";
export const OWNER_PROFILE_LINE2 =
  "Page officielle de la Fondatrice de l'application Zaren Veto";

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
 */
export function isVerifiedUser(
  username: string,
  isVerifiedFromBackend?: boolean,
): boolean {
  if (isVerifiedFromBackend === true) return true;
  if (!username) return false;
  const normalized = normalizeUsername(username);
  return (
    normalized === "princessnarzinebanihashem" ||
    normalized === "princessnarzine" ||
    normalized === "narzinebanihashem"
  );
}

/**
 * Returns true if this is the app owner's profile
 * (same logic as isVerifiedUser but exposed separately for clarity).
 */
export function isOwnerProfile(
  username: string,
  isVerifiedFromBackend?: boolean,
): boolean {
  return isVerifiedUser(username, isVerifiedFromBackend);
}
