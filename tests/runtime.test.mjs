import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { randomUUID } from 'node:crypto';

const base = new URL('../src/site/', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('catalog.json', base)));
const config = JSON.parse(readFileSync(new URL('analytics-config.json', base)));
test('browser language fallback, remembered choice and unavailable storage', () => {
  const source = readFileSync(new URL('locale.js', base), 'utf8').replace(/^import .*;\r?\n/gm, '').replaceAll('export ', '') + '\nthis.api = { getLocale, setLocale, t, text };';
  const make = saved => {
    const context = { catalog, useSyncExternalStore: () => {}, navigator: { languages: ['fr-CA','en-GB'] }, localStorage: { getItem: () => saved, setItem: () => {} }, document: { documentElement: {} } };
    runInNewContext(source,context); return context;
  };
  const remembered = make('es');
  assert.equal(remembered.api.getLocale(), 'es');
  assert.equal(remembered.api.t('language.label'), 'Idioma');
  remembered.api.setLocale('en');
  assert.equal(remembered.document.documentElement.lang, 'en');
  assert.equal(remembered.api.t('language.label'), 'Language');
  assert.equal(make(null).api.getLocale(), 'en');
  const denied = {catalog,useSyncExternalStore:()=>{},navigator:{languages:['fr']},localStorage:{getItem(){throw new Error('denied');},setItem(){throw new Error('denied');}},document:{documentElement:{}}};
  runInNewContext(source,denied);
  assert.equal(denied.api.getLocale(),'es');
  assert.doesNotThrow(()=>denied.api.setLocale('en'));
});
test('route views ignore repeated effects and language changes; session and interaction counts are stable', async () => {
  const sent = [];
  const storage = new Map();
  let now = Date.now();
  const source = readFileSync(new URL('analytics.js',base),'utf8').replace(/^import .*;\r?\n/gm,'').replaceAll('import.meta.env.VITE_ANALYTICS_URL', "'https://analytics.example/events'").replaceAll('import.meta.env.DEV', 'false').replaceAll('import.meta.env.VITE_ANALYTICS_IN_DEV', "'false'").replaceAll('export ','')+'\nthis.track = track;';
  const context = {config,getLocale:()=> 'es', Date:{now:()=>now},window:{location:{pathname:config.paths[0]}},crypto:{randomUUID},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},fetch:async(_,options)=>{sent.push(JSON.parse(options.body));return {ok:true,status:202};},AbortSignal:{timeout:()=>undefined},setTimeout,Promise};
  runInNewContext(source,context);
  context.track('page_view');context.track('page_view');
  assert.equal(sent.filter(e=>e.event_type==='page_view').length,1);
  assert.equal(sent.filter(e=>e.event_type==='session_start').length,1);
  if(config.forms.length){context.track('form_start',config.forms[0]);context.track('form_start',config.forms[0]);assert.equal(sent.filter(e=>e.event_type==='form_start').length,1);}
  if(config.paths.length>1){context.window.location.pathname=config.paths[1];context.track('page_view');assert.equal(sent.filter(e=>e.event_type==='page_view').length,2);}
  context.window.location.pathname='/private/customer@example.com';context.track('page_view');
  assert.ok(sent.every(e=>config.paths.includes(e.path)));
  now+=31*60*1000;context.window.location.pathname=config.paths[0];context.track('page_view');
  assert.equal(sent.filter(e=>e.event_type==='session_start').length,2);
  assert.ok(sent.every(e=>!('email' in e)&&!('received_at' in e)));
});

test('network failures have bounded retries with the same IDs and never interrupt the caller', async () => {
  const sent=[];
  const source=readFileSync(new URL('analytics.js',base),'utf8').replace(/^import .*;\r?\n/gm,'').replaceAll('import.meta.env.VITE_ANALYTICS_URL', "'https://analytics.example/events'").replaceAll('import.meta.env.DEV','false').replaceAll('import.meta.env.VITE_ANALYTICS_IN_DEV',"'false'").replaceAll('export ','')+'\nthis.track=track;';
  const context={config,getLocale:()=> 'en',Date,window:{location:{pathname:config.paths[0]}},crypto:{randomUUID},sessionStorage:{getItem(){throw new Error('denied');},setItem(){throw new Error('denied');}},fetch:async(_,options)=>{sent.push(JSON.parse(options.body));throw new Error('offline');},AbortSignal:{timeout:()=>undefined},setTimeout:callback=>{callback();},Promise};
  runInNewContext(source,context);
  assert.doesNotThrow(()=>context.track('page_view'));
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(sent.length,4);
  const ids=new Set(sent.map(e=>e.event_id));assert.equal(ids.size,2);
  for(const id of ids)assert.equal(sent.filter(e=>e.event_id===id).length,2);
  context.crypto.randomUUID=()=>{throw new Error('unavailable');};
  assert.doesNotThrow(()=>context.track('form_submit_attempt',config.forms[0]));
});
