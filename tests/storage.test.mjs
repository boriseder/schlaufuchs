// =============================================================
// SCHLAUFUCHS – tests/storage.test.mjs
// Unit-Tests für zentrale Storage-Verwaltung & Prefixing
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createMockStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i] || null,
    _raw: store,
  };
}

test('Storage: Speichern, Laden und Prefixing', () => {
  const mock = createMockStorage();
  const sandbox = {
    window: {},
    localStorage: mock,
    navigator: {}
  };
  sandbox.window = sandbox;
  const code = readFileSync('js/core/storage.js', 'utf8');
  vm.runInNewContext(code, sandbox);

  const Storage = sandbox.window.Schlaufuchs.Storage;
  assert.ok(Storage, 'Storage-Modul vorhanden');

  // Speichern & Laden
  Storage.schreiben('sterne', 42);
  assert.equal(Storage.lesen('sterne'), 42);

  // Überprüfen des Prefixes in mock
  assert.ok(mock._raw.has('schlaufuchs:v1:sterne'));
  assert.equal(mock._raw.get('schlaufuchs:v1:sterne'), '42');

  // Entfernen
  Storage.entfernen('sterne');
  assert.equal(Storage.lesen('sterne'), undefined);
  assert.equal(mock._raw.has('schlaufuchs:v1:sterne'), false);
});

test('Storage: Fallback bei defektem oder fehlendem LocalStorage', () => {
  const sandbox = {
    window: {},
    navigator: {}
  };
  sandbox.window = sandbox;
  const code = readFileSync('js/core/storage.js', 'utf8');
  vm.runInNewContext(code, sandbox);

  const Storage = sandbox.window.Schlaufuchs.Storage;
  // In-Memory Fallback funktioniert ohne Exception
  Storage.schreiben('kind', { id: 1, name: 'Fuchs' });
  const val = Storage.lesen('kind');
  assert.deepEqual(val, { id: 1, name: 'Fuchs' });
});
