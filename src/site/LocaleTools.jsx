import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setLocale, t, useLocale } from './locale';
import { track } from './analytics';
import './locale.css';
export default function LocaleTools() {
  const locale = useLocale();
  const { pathname } = useLocation();
  useEffect(() => { track('page_view'); }, [pathname]);
  useEffect(() => {
    document.title = t('site.title');
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.append(meta); }
    meta.setAttribute('content', t('site.description'));
  }, [locale]);
  return <div className="locale-tools"><label htmlFor="site-locale">{t('language.label')}</label><select id="site-locale" value={locale} onChange={e => setLocale(e.target.value)}><option value="es">Español</option><option value="en">English</option></select></div>;
}
