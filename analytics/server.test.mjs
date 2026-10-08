import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createAnalyticsServer, openStore, validateEvent } from './server.mjs';
const settings = { paths: ['/'], forms: ['demo-contact'] };
const event = () => ({ version: 1, event_id: randomUUID(), event_type: 'page_view', path: '/', locale: 'es', session_id: randomUUID() });
test('strict payload excludes personal data, URLs and invalid form events', () => {
  const value = event();
  assert.ok(validateEvent(value, settings));
  for (const change of [{ email: 'test@example.com' }, { path: '/?email=x' }, { version: 2 }, { event_type: 'unknown' }, { locale: 'fr' }, { error_code: 'network' }, { event_id: 1 }, { event_id: [value.event_id] }, { session_id: [value.session_id] }, { session_id: null }]) assert.equal(validateEvent({ ...value, ...change }, settings), false);
  assert.ok(validateEvent({ ...value, event_type: 'form_submit_error', form_id: 'demo-contact', error_code: 'service' }, settings));
  assert.equal(validateEvent({ ...value, event_type: 'form_submit_error', form_id: 'demo-contact' }, settings), false);
});
test('deduplicates retries, sessions and first interactions; persists after reopening', () => {
  const dir = mkdtempSync(join(tmpdir(), 'analytics-'));
  const filename = join(dir, 'test.sqlite');
  let store = openStore(filename);
  const value = event();
  assert.equal(store.save(value), 1);
  assert.equal(store.save(value), 0);
  assert.equal(store.save({ ...value, event_id: randomUUID(), event_type: 'session_start' }), 1);
  assert.equal(store.save({ ...value, event_id: randomUUID(), event_type: 'session_start' }), 0);
  assert.equal(store.save({ ...value, event_id: randomUUID(), event_type: 'form_start', form_id: 'demo-contact' }), 1);
  assert.equal(store.save({ ...value, event_id: randomUUID(), event_type: 'form_start', form_id: 'demo-contact' }), 0);
  store.close();
  store = openStore(filename);
  assert.equal(store.db.prepare('SELECT COUNT(*) AS n FROM events').get().n, 3);
  store.db.prepare('UPDATE events SET received_at=?').run('2000-01-01T00:00:00.000Z');
  store.prune();
  assert.equal(store.stats().length, 0);
  store.close();
  rmSync(dir, { recursive: true });
});
test('HTTP origins, body limit, protected statistics and concurrent retries', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'analytics-http-'));
  const { server, store } = createAnalyticsServer({ filename: join(dir, 'test.sqlite'), origins: ['http://localhost:5173'], token: 'test-only', settings });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const value = event();
  const post = (body, origin = 'http://localhost:5173') => fetch(`${url}/events`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await post(value, 'https://evil.example')).status, 403);
    assert.equal((await post({ ...value, content: 'x' })).status, 400);
    assert.equal((await post({ content: 'x'.repeat(3000) })).status, 413);
    const responses = await Promise.all(Array.from({ length: 20 }, () => post(value)));
    assert.ok(responses.every(r => r.status === 202));
    assert.equal(store.stats()[0].events, 1);
    assert.equal((await fetch(`${url}/stats`)).status, 401);
    assert.equal((await fetch(`${url}/stats`, { headers: { Authorization: 'Bearer test-only' } })).status, 200);
  } finally {
    await new Promise(resolve => server.close(resolve));
    rmSync(dir, { recursive: true });
  }
});
