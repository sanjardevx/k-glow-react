/**
 * Where the signed-in visitor's JWT lives on the client.
 *
 * It used to live in a cookie the API set, but the SPA (Vercel) and the API
 * (AWS) are on different domains, so that cookie was a third-party one —
 * Safari, every iOS browser and Chrome's incognito window drop it outright,
 * and the visitor was signed out seconds after signing in. Kept here instead
 * and sent as an Authorization header (see the interceptor in main.tsx),
 * which no browser filters.
 *
 * This is not a step down in security: the cookie was already set with
 * `httpOnly: false`, so page scripts could read it just as freely.
 *
 * Stored alongside `memberData` and cleared with it — the two describe the
 * same session and must never outlive one another.
 */
const TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
