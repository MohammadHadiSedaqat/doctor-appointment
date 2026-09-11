/** @param {Window | null} browser */
export function getStoredSessionToken(browser) {
  if (!browser) return null;
  try {
    return browser.localStorage.getItem('base44_access_token') || browser.localStorage.getItem('token');
  } catch {
    return null;
  }
}

/**
 * @param {{VITE_BASE44_APP_ID?: string, VITE_BASE44_FUNCTIONS_VERSION?: string, VITE_BASE44_APP_BASE_URL?: string}} env
 * @param {Window | null} browser
 */
export function resolveAppParams(env = {}, browser = null) {
  const identity = {
    appId: env.VITE_BASE44_APP_ID,
    functionsVersion: env.VITE_BASE44_FUNCTIONS_VERSION,
    appBaseUrl: env.VITE_BASE44_APP_BASE_URL,
  };
  if (!browser) return { ...identity, token: null, fromUrl: '' };
  const url = new URL(browser.location.href);
  const clearToken = url.searchParams.get('clear_access_token') === 'true';
  const callbackToken = url.searchParams.get('access_token');
  try {
    // Migrate the old flag: logout is a one-time URL action, not a preference.
    browser.localStorage.removeItem('base44_clear_access_token');
    for (const key of ['base44_app_id', 'base44_app_base_url', 'base44_functions_version', 'base44_from_url']) browser.localStorage.removeItem(key);
    if (clearToken) {
      browser.localStorage.removeItem('base44_access_token');
      browser.localStorage.removeItem('token');
    }
  } catch { /* Storage can be disabled; keep the current session in memory. */ }
  for (const key of ['access_token', 'clear_access_token', 'app_id', 'app_base_url', 'functions_version', 'from_url']) url.searchParams.delete(key);
  if (url.href !== browser.location.href) browser.history.replaceState(browser.history.state, '', url.pathname + url.search + url.hash);
  // Let the SDK own session persistence, never save callback URLs or trust a
  // URL/localStorage value to replace the backend identity from build config.
  return { ...identity, token: clearToken ? null : callbackToken || getStoredSessionToken(browser), fromUrl: url.href };
}
