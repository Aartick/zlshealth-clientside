// Array containing navigation paths where top bar needs to be hidden
export const topBarHiddenPaths = ["/products", "/productDescription", "/science"];

/**
 * Checks if a given pathname should be hidden.
 * Matches both exact path and dynamic paths (like /productDescription/:id).
 */
export function isHiddenPath(pathname: string): boolean {
  return topBarHiddenPaths.some((p) => pathname.startsWith(p));
}
