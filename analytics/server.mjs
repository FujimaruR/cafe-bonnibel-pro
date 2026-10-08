import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import config from './config.json' with { type: 'json' };

export const eventTypes = ['page_view', 'session_start', 'form_start', 'form_submit_attempt', 'form_validation_error', 'form_submit_success', 'form_submit_error'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const codes = ['validation', 'network', 'service', 'configuration'];
export function validateEvent(value, settings = config) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = ['version', 'event_id', 'event_type', 'path', 'locale', 'session_id', 'form_id', 'error_code'];
  if (Object.keys(value).some(key => !keys.includes(key))) return false;
  if (value.version !== 1 || typeof value.event_id !== 'string' || typeof value.session_id !== 'string' || !uuid.test(value.event_id) || !uuid.test(value.session_id)) return false;
  if (!eventTypes.includes(value.event_type) || !['es', 'en'].includes(value.locale)) return false;
  if (!settings.paths.includes(value.path)) return false;
  const formEvent = value.event_type.startsWith('form_');
  if (formEvent ? !settings.forms.includes(value.form_id) : value.form_id !== undefined) return false;
  const errorEvent = ['form_validation_error', 'form_submit_error'].includes(value.event_type);
  return errorEvent ? codes.includes(value.error_code) : value.error_code === undefined;
}

export function openStore(filename, retentionDays = 90) {
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 3650) throw new Error('Invalid retention days');
  mkdirSync(dirname(resolve(filename)), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS events(
      event_id TEXT PRIMARY KEY, event_type TEXT NOT NULL, received_at TEXT NOT NULL,
      path TEXT NOT NULL, locale TEXT NOT NULL, session_id TEXT NOT NULL,
      form_id TEXT, error_code TEXT);
    CREATE INDEX IF NOT EXISTS events_received_type ON events(received_at,event_type);
    CREATE UNIQUE INDEX IF NOT EXISTS events_session_once ON events(session_id) WHERE event_type='session_start';
    CREATE UNIQUE INDEX IF NOT EXISTS events_form_once ON events(session_id,form_id) WHERE event_type='form_start';
    INSERT OR IGNORE INTO migrations VALUES(1);`);
  const insert = db.prepare('INSERT OR IGNORE INTO events VALUES(?,?,?,?,?,?,?,?)');
  const prune = () => db.prepare('DELETE FROM events WHERE received_at < ?').run(new Date(Date.now() - retentionDays * 86400000).toISOString());
  prune();
  return {
    db, prune,
    save(value) { return insert.run(value.event_id, value.event_type, new Date().toISOString(), value.path, value.locale, value.session_id, value.form_id ?? null, value.error_code ?? null).changes; },
    stats() { return db.prepare('SELECT event_type,form_id,COUNT(*) AS events FROM events GROUP BY event_type,form_id').all(); },
    close() { db.close(); },
  };
}

export function createAnalyticsServer({ filename, origins, token = '', settings = config, retentionDays = 90 }) {
  if (!origins?.length || origins.includes('*')) throw new Error('Configure exact allowed origins');
  const store = openStore(filename, retentionDays);
  const limits = new Map();
  let requests = 0;
  let windowStarted = Date.now();
  const server = createServer(async (req, res) => {
    const respond = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    try {
      const origin = req.headers.origin;
      if (origin && !origins.includes(origin)) return respond(403, { error: 'origin' });
      if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
      if (req.url === '/health' && req.method === 'GET') return respond(200, { ok: true });
      if (req.url === '/stats' && req.method === 'GET') {
        const expected = Buffer.from(`Bearer ${token}`);
        const actual = Buffer.from(req.headers.authorization || '');
        if (!token || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return respond(401, { error: 'unauthorized' });
        return respond(200, store.stats());
      }
      if (req.url !== '/events' || req.method !== 'POST') return respond(404, { error: 'not_found' });
      if (!origin || !origins.includes(origin)) return respond(403, { error: 'origin' });
      if (Date.now() - windowStarted > 60000) { limits.clear(); requests = 0; windowStarted = Date.now(); }
      if (++requests > 3000) return respond(429, { error: 'rate_limit' });
      if (req.headers['content-type']?.split(';')[0] !== 'application/json') return respond(415, { error: 'content_type' });
      if (Number(req.headers['content-length']) > 2048) return respond(413, { error: 'size' });
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 2048) return respond(413, { error: 'size' });
      }
      let value;
      try { value = JSON.parse(body); } catch { return respond(400, { error: 'json' }); }
      if (!validateEvent(value, settings)) return respond(400, { error: 'payload' });
      const count = (limits.get(value.session_id) || 0) + 1;
      limits.set(value.session_id, count);
      if (count > 120) return respond(429, { error: 'rate_limit' });
      store.save(value);
      return respond(202, { accepted: true });
    } catch { if (!res.headersSent) respond(503, { error: 'unavailable' }); else res.end(); }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  const cleanup = setInterval(() => store.prune(), 3600000);
  cleanup.unref();
  server.on('close', () => { clearInterval(cleanup); store.close(); });
  return { server, store };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { server } = createAnalyticsServer({
    filename: process.env.ANALYTICS_DB_PATH || resolve('data/analytics.sqlite'),
    origins: (process.env.ANALYTICS_ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()),
    token: process.env.ANALYTICS_ADMIN_TOKEN,
    retentionDays: Number(process.env.ANALYTICS_RETENTION_DAYS || 90),
  });
  server.listen(Number(process.env.ANALYTICS_PORT || 4100), process.env.ANALYTICS_HOST || '127.0.0.1', () => console.log('Analytics service listening'));
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close());
}
