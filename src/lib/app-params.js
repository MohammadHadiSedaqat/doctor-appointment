import { getStoredSessionToken, resolveAppParams } from './bootstrap';

const browser = typeof window !== 'undefined' ? window : null;
export const getSessionToken = () => getStoredSessionToken(browser);
export const appParams = resolveAppParams(import.meta.env || {}, browser);
