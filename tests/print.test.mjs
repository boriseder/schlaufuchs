// =============================================================
// SCHLAUFUCHS – tests/print.test.mjs
// Unit-Tests für Druckgenerator, Knick-Lösung & Schatzkisten-Geheimwörter
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const storageCode = readFileSync('js/core/storage.js', 'utf8');
const stateCode = readFileSync('js/state.js', 'utf8');
const printCode = readFileSync('js/print.js', 'utf8');

const sandbox = {
  window: {},
  document: {
    createElement: () => ({ id: '', innerHTML: '', appendChild: () => {} }),
    body: { appendChild: () => {} }
  },
  setTimeout: (fn) => fn(),
  Math: Math
};
sandbox.window = sandbox;

vm.runInNewContext(storageCode, sandbox);
vm.runInNewContext(stateCode, sandbox);
vm.runInNewContext(printCode, sandbox);

const { Print, State } = sandbox.window.Schlaufuchs;

test('Print: pickSecretWord liefert exakt passende Wortlängen (Bijektion für Schatzkiste)', () => {
  const w4 = Print.pickSecretWord(4);
  assert.equal(w4.length, 4, '4 verlangt -> exakt 4 geliefert');
  assert.equal(w4, w4.toUpperCase());

  const w5 = Print.pickSecretWord(5);
  assert.equal(w5.length, 5, '5 verlangt -> exakt 5 geliefert');

  const w6 = Print.pickSecretWord(6);
  assert.equal(w6.length, 6, '6 verlangt -> exakt 6 geliefert');

  const w7 = Print.pickSecretWord(7);
  assert.equal(w7.length, 7, '7 verlangt -> exakt 7 geliefert');

  const w8 = Print.pickSecretWord(8);
  assert.equal(w8.length, 8, '8 verlangt -> exakt 8 geliefert');
});

test('State: getPrintSettings und savePrintSettings persistieren Knick- und Geheimwort-Optionen', () => {
  const defaultSettings = State.getPrintSettings();
  assert.equal(defaultSettings.solutionMode, 'knick');
  assert.equal(defaultSettings.secretWord, true);

  State.savePrintSettings({ solutionMode: 'two-page', secretWord: false });
  const updated = State.getPrintSettings();
  assert.equal(updated.solutionMode, 'two-page');
  assert.equal(updated.secretWord, false);

  // Zurücksetzen auf Standard
  State.savePrintSettings({ solutionMode: 'knick', secretWord: true });
});

test('Print: Arbeitsblatt-Druck erzeugt Knick-Lösungsstreifen standardmäßig', () => {
  let createdElement = null;
  sandbox.document.getElementById = (id) => {
    if (id === 'print-area') {
      if (!createdElement) {
        createdElement = {
          id: 'print-area',
          innerHTML: ''
        };
      }
      return createdElement;
    }
    return null;
  };
  sandbox.window.print = () => {};

  const mockTasks = [
    {
      type: 'equation',
      schulstufe: 2,
      grade: 2,
      symbol: '+',
      num1: '47',
      num2: '33',
      answer: 80
    },
    {
      type: 'equation',
      schulstufe: 2,
      grade: 2,
      symbol: '+',
      num1: '22',
      num2: '27',
      answer: 49
    }
  ];

  Print.generateAndPrintWorksheet('Addition bis 100', '2. Klasse', mockTasks);
  assert.ok(createdElement.innerHTML.includes('print-knick-wrapper'), 'Knick-Wrapper muss im DOM sein');
  assert.ok(createdElement.innerHTML.includes('HIER VOR DEM LÖSEN NACH HINTEN KNICKEN'), 'Falt-Indikator muss vorhanden sein');
  assert.ok(!createdElement.innerHTML.includes('Schlaufuchs-Geheimwort'), 'Kein unnötiger Geheimwort-Bereich auf dem Arbeitsblatt');
  assert.ok(createdElement.innerHTML.includes('LÖSUNGEN'), 'Lösungs-Header muss vorhanden sein');
  assert.ok(createdElement.innerHTML.includes('Wie war das Blatt für dich?'), 'Selbsteinschätzung muss vorhanden sein');
  assert.ok(!createdElement.innerHTML.includes('PIRLS'), 'Kein Prüfungsjargon (PIRLS)');
});
