// =============================================================
// SCHLAUFUCHS – tests/signs.test.mjs
// Unit-Tests für österreichische StVO-Verkehrszeichen (SVG)
// Garantiert: Gültige Vektorgrafiken, Barrierefreiheit, 0 Emojis, Fail-Fast
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const signsCode = readFileSync('js/signs.js', 'utf8');
const sandbox = { window: {} };
sandbox.window = sandbox;
vm.runInNewContext(signsCode, sandbox);
const { Signs } = sandbox.window.Schlaufuchs;

test('Signs: Modul existiert und stellt mindestens 10 StVO-Zeichen bereit', () => {
  assert.ok(Signs, 'Signs-Modul muss vorhanden sein');
  assert.ok(Array.isArray(Signs.AVAILABLE_SIGNS), 'AVAILABLE_SIGNS muss ein Array sein');
  assert.ok(Signs.AVAILABLE_SIGNS.length >= 10, 'Mindestens 10 StVO-Zeichen müssen registriert sein');
});

test('Signs: Alle registrierten Zeichen liefern valides SVG ohne Emojis', () => {
  const EMOJI_REGEX = /(?![©®™])\p{Extended_Pictographic}/u;

  Signs.AVAILABLE_SIGNS.forEach(signId => {
    const svg = Signs.getSignSvg(signId);
    assert.ok(typeof svg === 'string', `getSignSvg(${signId}) muss String liefern`);
    assert.ok(svg.startsWith('<svg'), `Zeichen ${signId} muss mit <svg beginnen`);
    assert.ok(svg.endsWith('</svg>'), `Zeichen ${signId} muss mit </svg> enden`);
    assert.ok(svg.includes('viewBox='), `Zeichen ${signId} muss viewBox besitzen`);
    assert.ok(svg.includes('aria-label='), `Zeichen ${signId} muss aria-label besitzen`);
    assert.ok(!EMOJI_REGEX.test(svg), `Zeichen ${signId} darf keine Emojis enthalten`);
  });
});

test('Signs: Fail-Fast bei unbekannter ID (kein stilles Kaschieren mit Fallback-Emoji)', () => {
  assert.throws(() => {
    Signs.getSignSvg('ungueltige_id_xyz');
  }, /existiert nicht/, 'Unbekannte ID muss Exception werfen');
});
