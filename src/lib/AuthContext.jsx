import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams, getSessionToken } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

/** @typedef {{type: string, message: string}} AuthError */
/** @typedef {{user: any, isAuthenticated: boolean, isLoadingAuth: boolean, isLoadingPublicSettings: boolean, authError: AuthError | null, authChecked: boolean, appPublicSettings: any, checkUserAuth: () => Promise<void>, checkAppState: () => Promise<void>, logout: (redirect?: boolean) => void, navigateToLogin: () => void}} AuthState */
const AuthContext = createContext(/** @type {AuthState | null} */ (null));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(/** @type {AuthError | null} */ (null));
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);
  const mounted = useRef(true);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await base44.auth.me();
      if (!mounted.current) return;
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError((previous) => previous?.type === 'session_expired' || previous?.type === 'session_unavailable' ? null : previous);
    } catch (error) {
      if (!mounted.current) return;
      setUser(null);
      setIsAuthenticated(false);
      const status = error.status || error.response?.status;
      setAuthError({
        type: status === 401 || status === 403 ? 'session_expired' : 'session_unavailable',
        message: status === 401 || status === 403 ? 'Please sign in again.' : 'Unable to verify the session.',
      });
    } finally {
      if (mounted.current) {
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    }
  }, []);

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(true);
    setIsLoadingAuth(true);
    setAuthChecked(false);
    setAuthError(null);
    setAppPublicSettings(null);
    try {
      const appClient = createAxiosClient({
        baseURL: '/api/apps/public',
        headers: { 'X-App-Id': appParams.appId },
        token: getSessionToken() || appParams.token,
        interceptResponses: true,
      });
      const settings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`, { timeout: 15000 });
      if (!mounted.current) return;
      setAppPublicSettings(settings);
      if (getSessionToken() || appParams.token) await checkUserAuth();
      else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (!mounted.current) return;
      const status = error.status || error.response?.status;
      const reason = error.data?.extra_data?.reason || error.response?.data?.extra_data?.reason;
      setAuthError({ type: status === 403 && reason ? reason : 'unknown', message: 'Unable to load application settings.' });
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      if (mounted.current) {
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    }
  }, [checkUserAuth]);

  useEffect(() => {
    mounted.current = true;
    checkAppState();
    return () => { mounted.current = false; };
  }, [checkAppState]);

  const logout = useCallback((shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
    setAuthError(null);
    base44.auth.logout(shouldRedirect ? window.location.origin : undefined);
  }, []);

  const navigateToLogin = useCallback(() => {
    base44.auth.redirectToLogin(window.location.href);
  }, []);

  return <AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings, authChecked, logout, navigateToLogin, checkUserAuth, checkAppState }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
