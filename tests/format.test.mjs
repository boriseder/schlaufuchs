// =============================================================
// SCHLAUFUCHS – tests/format.test.mjs
// Unit-Tests für Österreichische Zahlenformatierung & Toleranz
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code = readFileSync('js/core/format.js', 'utf8');
const sandbox = { window: {} };
sandbox.window = sandbox;
vm.runInNewContext(code, sandbox);
const { formatZahl, leseZahl } = sandbox.window.Schlaufuchs;

test('formatZahl: Zahlen unter 1 000 bleiben ohne Spatium', () => {
  assert.equal(formatZahl(0), '0');
  assert.equal(formatZahl(9), '9');
  assert.equal(formatZahl(99), '99');
  assert.equal(formatZahl(999), '999');
  assert.equal(formatZahl(-42), '−42'); // Typografisches Minuszeichen
});

test('formatZahl: Ab 4 Stellen Schmalspatium (\\u202F)', () => {
  assert.equal(formatZahl(1000), '1\u202F000');
  assert.equal(formatZahl(2500), '2\u202F500');
  assert.equal(formatZahl(10000), '10\u202F000');
  assert.equal(formatZahl(125000), '125\u202F000');
  assert.equal(formatZahl(1000000), '1\u202F000\u202F000');
});

test('formatZahl: Dezimaltrennzeichen ist Komma', () => {
  assert.equal(formatZahl(2.5), '2,5');
  assert.equal(formatZahl(0.75), '0,75');
  assert.equal(formatZahl(1250.5), '1\u202F250,5');
});

test('leseZahl: Tolerantes Parsen von Kindereingaben', () => {
  assert.equal(leseZahl('1000'), 1000);
  assert.equal(leseZahl('1 000'), 1000);
  assert.equal(leseZahl('1\u202F000'), 1000);
  assert.equal(leseZahl('1\u00A0000'), 1000);
  assert.equal(leseZahl('2,5'), 2.5);
  assert.equal(leseZahl('2.5'), 2.5);
  assert.equal(leseZahl('  42  '), 42);
  assert.ok(Number.isNaN(leseZahl('')));
});

test('escapeHtml: Maskiert HTML-Sonderzeichen zur Vermeidung von XSS', () => {
  const { escapeHtml } = sandbox.window.Schlaufuchs;
  assert.equal(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  assert.equal(escapeHtml("Mia & Ben's Profil"), 'Mia &amp; Ben&#39;s Profil');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});

