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

test('Print: pickSecretWord liefert kindgerechte Wörter für die Schatzkiste', () => {
  const w5 = Print.pickSecretWord(5);
  assert.ok(w5.length >= 4 && w5.length <= 6);
  assert.equal(w5, w5.toUpperCase());

  const w6 = Print.pickSecretWord(6);
  assert.ok(w6.length >= 5 && w6.length <= 7);

  const w8 = Print.pickSecretWord(8);
  assert.ok(w8.length >= 6);
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
  assert.ok(createdElement.innerHTML.includes('Schlaufuchs-Geheimwort'), 'Geheimwort-Bereich muss vorhanden sein');
  assert.ok(createdElement.innerHTML.includes('Wie war das Blatt für dich?'), 'Selbsteinschätzung muss vorhanden sein');
  assert.ok(!createdElement.innerHTML.includes('PIRLS'), 'Kein Prüfungsjargon (PIRLS)');
});
