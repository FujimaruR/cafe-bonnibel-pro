export function getLocale(): 'es' | 'en';
export function setLocale(value: string): void;
export function useLocale(): 'es' | 'en';
export function t(key: string, values?: Record<string, string | number>): string;
export function text<T>(value: T): T;
export function money(value: number): string;
export function number(value: number): string;
