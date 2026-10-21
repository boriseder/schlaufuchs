// =============================================================
// SCHLAUFUCHS – tests/validators.test.mjs
// Unit-Tests für reine Validierungslogik (unabhängig vom DOM)
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const formatCode = readFileSync('js/core/format.js', 'utf8');
const valCode = readFileSync('js/validators/index.js', 'utf8');

const sandbox = { window: {} };
sandbox.window = sandbox;
vm.runInNewContext(formatCode, sandbox);
vm.runInNewContext(valCode, sandbox);

const V = sandbox.window.Schlaufuchs.Validators;

test('pruefeZahl: Richtige und falsche numerische Eingaben', () => {
  // Exakter Treffer
  assert.equal(V.pruefeZahl('42', 42).richtig, true);
  // Mit Leerzeichen
  assert.equal(V.pruefeZahl(' 42 ', 42).richtig, true);
  // Mit Tausender-Spatium
  assert.equal(V.pruefeZahl('1\u202F000', 1000).richtig, true);
  assert.equal(V.pruefeZahl('1 000', 1000).richtig, true);
  // Mit Komma
  assert.equal(V.pruefeZahl('2,5', 2.5).richtig, true);
  // Falsche Eingabe
  assert.equal(V.pruefeZahl('41', 42).richtig, false);
  // Ungültige Eingabe
  assert.equal(V.pruefeZahl('', 42).gueltig, false);
  assert.equal(V.pruefeZahl('abc', 42).gueltig, false);
});

test('pruefeWort: Text- und Wortprüfung', () => {
  assert.equal(V.pruefeWort('Hund', 'Hund').richtig, true);
  // Groß-/Kleinschreibung tolerant wenn ignoreCase
  assert.equal(V.pruefeWort('hund', 'Hund', { ignoreCase: true }).richtig, true);
  // Leerzeichen-Trim
  assert.equal(V.pruefeWort('  Katze  ', 'Katze').richtig, true);
  // Falsches Wort
  assert.equal(V.pruefeWort('Maus', 'Hund').richtig, false);
  // Leere Eingabe
  assert.equal(V.pruefeWort('', 'Hund').gueltig, false);
});

test('pruefeAuswahl: Multiple-Choice Prüfung', () => {
  assert.equal(V.pruefeAuswahl(2, 2).richtig, true);
  assert.equal(V.pruefeAuswahl(1, 2).richtig, false);
  assert.equal(V.pruefeAuswahl(null, 2).gueltig, false);
});

test('pruefeZahlenmauer: Zahlenmauer Teil- und Gesamtlösung', () => {
  const values = { b1: 3, b2: 4, b3: 5, m1: 7, m2: 9, peak: 16 };
  const hidden = ['m1', 'm2', 'peak'];

  // Alle richtig
  const r1 = V.pruefeZahlenmauer({ m1: 7, m2: 9, peak: 16 }, values, hidden);
  assert.equal(r1.richtig, true);
  assert.equal(r1.gueltig, true);

  // Einer falsch
  const r2 = V.pruefeZahlenmauer({ m1: 7, m2: 8, peak: 16 }, values, hidden);
  assert.equal(r2.richtig, false);
  assert.equal(r2.gueltig, true);

  // Unvollständig
  const r3 = V.pruefeZahlenmauer({ m1: 7, m2: '' }, values, hidden);
  assert.equal(r3.gueltig, false);
});

test('pruefeZahl: Schriftliche Rechnungen (Ziffernketten)', () => {
  assert.equal(V.pruefeZahl(['5', '2', '5'].join(''), 525).richtig, true);
  assert.equal(V.pruefeZahl(['0', '9', '5'].join(''), 95).richtig, true);
  assert.equal(V.pruefeZahl('525', 525).richtig, true);
  assert.equal(V.pruefeZahl('524', 525).richtig, false);
});

test('pruefeZahl: Große Zahlen nach österr. Lehrplan (Spatium & Punkte-Fallback)', () => {
  // ZR 10 000
  assert.equal(V.pruefeZahl('5 400', 5400).richtig, true);
  assert.equal(V.pruefeZahl('5\u202F400', 5400).richtig, true);
  assert.equal(V.pruefeZahl('5.400', 5400).richtig, true);

  // ZR 100 000 & ZR 1 000 000
  assert.equal(V.pruefeZahl('125 000', 125000).richtig, true);
  assert.equal(V.pruefeZahl('125\u202F000', 125000).richtig, true);
  assert.equal(V.pruefeZahl('1 000 000', 1000000).richtig, true);
  assert.equal(V.pruefeZahl('1\u202F000\u202F000', 1000000).richtig, true);
  assert.equal(V.pruefeZahl('1.000.000', 1000000).richtig, true);

  // Typografisches Minus (U+2212)
  assert.equal(V.pruefeZahl('\u221215', -15).richtig, true);
  assert.equal(V.pruefeZahl('-15', -15).richtig, true);

  // Ungültige Zeichen
  assert.equal(V.pruefeZahl('12abc', 12).gueltig, false);
  assert.equal(V.pruefeZahl('??', 10).gueltig, false);
});

test('pruefeAuswahl: Text- und Zahlenauswahl', () => {
  assert.equal(V.pruefeAuswahl('Hund', 'Hund').richtig, true);
  assert.equal(V.pruefeAuswahl(' Hund ', 'Hund').richtig, true);
  assert.equal(V.pruefeAuswahl('Katze', 'Hund').richtig, false);
  assert.equal(V.pruefeAuswahl('', 'Hund').gueltig, true); // Leere Auswahl als String gültig geprüft
  assert.equal(V.pruefeAuswahl(null, 'Hund').gueltig, false);
  assert.equal(V.pruefeAuswahl(undefined, 'Hund').gueltig, false);
});
