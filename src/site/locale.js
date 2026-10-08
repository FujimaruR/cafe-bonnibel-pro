import { useSyncExternalStore } from 'react';
import catalog from './catalog.json';

const listeners = new Set();
const supported = value => value === 'en' || value === 'es';
let locale = (navigator.languages || [navigator.language]).map(v => v.split('-')[0]).find(supported) || 'es';
try {
  const saved = localStorage.getItem('site.locale');
  if (supported(saved)) locale = saved;
} catch { /* Storage is optional. */ }
const subscribe = callback => { listeners.add(callback); return () => listeners.delete(callback); };
export const getLocale = () => locale;
export function setLocale(value) {
  if (!supported(value)) return;
  locale = value;
  try { localStorage.setItem('site.locale', value); } catch { /* Storage is optional. */ }
  document.documentElement.lang = value;
  for (const listener of listeners) listener();
}
export function useLocale() { return useSyncExternalStore(subscribe, getLocale, () => 'es'); }
export function t(key, values = {}) {
  const entry = catalog[key];
  if (!entry) throw new Error(`Missing translation: ${key}`);
  return entry[locale].replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}
const textKeys = new Map(Object.entries(catalog).flatMap(([key, entry]) => [[entry.es, key], [entry.en, key]]));
export function text(value) { return typeof value === 'string' && textKeys.has(value.replace(/\s+/g, ' ').trim()) ? t(textKeys.get(value.replace(/\s+/g, ' ').trim())) : value; }
export function money(value) { return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-MX', { style: 'currency', currency: 'MXN' }).format(value); }
export function number(value) { return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-MX').format(value); }
if (typeof document !== 'undefined') document.documentElement.lang = locale;
