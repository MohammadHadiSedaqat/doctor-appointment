import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAppParams } from '../src/lib/bootstrap.js';

function makeBrowser(href, stored = {}) {
  const values = new Map(Object.entries(stored));
  const browser = {
    location: { href },
    localStorage: { getItem: (key) => values.get(key) || null, removeItem: (key) => values.delete(key) },
    history: { state: { preserved: true }, replaceState: (state, title, path) => { browser.location.href = new URL(path, href).href; } },
  };
  return { browser, values };
}
const config = { VITE_BASE44_APP_ID: 'trusted-app', VITE_BASE44_APP_BASE_URL: 'https://trusted.example' };

test('URL and stale storage cannot replace the backend identity or persist credential URLs', () => {
  const { browser, values } = makeBrowser('https://clinic.example/appointment?app_id=other&app_base_url=https://other.example&access_token=callback&service=cast#info', { base44_app_id: 'old-app', base44_from_url: '?access_token=old' });
  const result = resolveAppParams(config, browser);
  assert.equal(result.appId, 'trusted-app');
  assert.equal(result.appBaseUrl, 'https://trusted.example');
  assert.equal(result.token, 'callback');
  assert.equal(browser.location.href, 'https://clinic.example/appointment?service=cast#info');
  assert.equal(result.fromUrl, browser.location.href);
  assert.equal(values.has('base44_from_url'), false);
});

test('logout clear flag is one-shot, so the next successful session survives', () => {
  const { browser, values } = makeBrowser('https://clinic.example/?clear_access_token=true', { base44_access_token: 'old', token: 'old', base44_clear_access_token: 'true' });
  assert.equal(resolveAppParams(config, browser).token, null);
  values.set('base44_access_token', 'new-session');
  assert.equal(resolveAppParams(config, browser).token, 'new-session');
  assert.equal(values.has('base44_clear_access_token'), false);
});

test('server and browsers without storage remain usable', () => {
  assert.equal(resolveAppParams(config, null).appId, 'trusted-app');
  const { browser } = makeBrowser('https://clinic.example/?access_token=callback');
  Object.defineProperty(browser, 'localStorage', { get() { throw new Error('disabled'); } });
  assert.equal(resolveAppParams(config, browser).token, 'callback');
});
