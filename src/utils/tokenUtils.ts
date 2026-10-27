// src/utils/tokenUtils.ts

export interface DecodedJwtPayload {
  exp?: number; // Expiration time in seconds since epoch
  iat?: number;
  sub?: string;
  userId?: number;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Decodes a JWT token payload safely in browser or SSR environments without external dependencies.
 */
export function decodeJwt(token: string): DecodedJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Determines whether a JWT token is expired or will expire within the buffer window.
 * @param token The JWT string to evaluate
 * @param bufferSeconds Buffer in seconds before actual expiration (default: 10s)
 */
export function isTokenExpired(token: string | null | undefined, bufferSeconds = 10): boolean {
  if (!token) return true;
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentEpochSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp <= currentEpochSeconds + bufferSeconds;
}

/**
 * Returns remaining milliseconds until token expiration. Returns 0 if already expired or invalid.
 */
export function getTokenRemainingTimeMs(token: string | null | undefined): number {
  if (!token) return 0;
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return 0;

  const msRemaining = decoded.exp * 1000 - Date.now();
  return Math.max(0, msRemaining);
}
