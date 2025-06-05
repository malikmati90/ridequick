/**
 * Redirects the user to the login page with a callback URL.
 * @param callbackUrl The URL to return to after login
 */
export function redirectToLogin(callbackUrl: string) {
    const encoded = encodeURIComponent(callbackUrl)
    window.location.href = `/login?callbackUrl=${encoded}`
  }
  