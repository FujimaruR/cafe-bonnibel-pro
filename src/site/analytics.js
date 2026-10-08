import { getLocale } from './locale';
import config from './analytics-config.json';

const endpoint = import.meta.env.VITE_ANALYTICS_URL;
const enabled = Boolean(endpoint) && (!import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_IN_DEV === 'true');
const expiration = 30 * 60 * 1000;
let memory;
let lastPath;
function session() {
  let value = memory;
  try { value = JSON.parse(sessionStorage.getItem('site.analytics') || 'null') || value; } catch { /* Optional storage. */ }
  if (!value || Date.now() - value.updated > expiration || !Array.isArray(value.forms)) {
    value = { id: crypto.randomUUID(), updated: Date.now(), started: false, forms: [] };
    lastPath = undefined;
  }
  value.updated = Date.now();
  memory = value;
  return value;
}
function persist(value) { try { sessionStorage.setItem('site.analytics', JSON.stringify(value)); } catch { /* Optional storage. */ } }
async function send(payload) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(3000), keepalive: true, credentials: 'omit' });
      if (response.ok || response.status < 500) return;
    } catch { /* Never blocks navigation or submission. */ }
    if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 500));
  }
}
export function track(type, formId, code) {
  try { trackEvent(type, formId, code); } catch { /* Optional analytics never interrupts the page or form. */ }
}
function trackEvent(type, formId, code) {
  if (!enabled) return;
  const path = window.location.pathname;
  // Only known public routes. No query/hash, dynamic personal URLs or admin pages.
  if (!config.paths.includes(path)) return;
  const value = session();
  if (!value.started) {
    value.started = true;
    void send({ version: 1, event_id: crypto.randomUUID(), event_type: 'session_start', path, locale: getLocale(), session_id: value.id });
  }
  if (type === 'page_view') {
    if (lastPath === path) { persist(value); return; }
    lastPath = path;
  }
  if (type === 'form_start') {
    if (value.forms.includes(formId)) { persist(value); return; }
    value.forms.push(formId);
  }
  persist(value);
  const payload = { version: 1, event_id: crypto.randomUUID(), event_type: type, path, locale: getLocale(), session_id: value.id };
  if (formId) payload.form_id = formId;
  if (code) payload.error_code = code;
  void send(payload);
}
