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
  assert.ok(createdElement.innerHTML.includes('LÖSUNGEN'), 'Lösungs-Header muss vorhanden sein');
  assert.ok(createdElement.innerHTML.includes('Wie war das Blatt für dich?'), 'Selbsteinschätzung muss vorhanden sein');
  assert.ok(createdElement.innerHTML.includes('print-stamp-badge'), 'Sammel-Stempelfeld als Papiermotivator muss vorhanden sein');
  assert.ok(createdElement.innerHTML.includes('print-knick-secret'), 'Schatzkisten-Geheimwort muss auf dem Knickstreifen sein');
  assert.ok(!createdElement.innerHTML.includes('www.schlaufuchs.at'), 'Keine externe URL auf dem Arbeitsblatt (Regel 10)');
  assert.ok(createdElement.innerHTML.includes('Blatt-Nr.'), 'Blatt-Nr. (Seed) muss in der Fußzeile stehen (Regel 15)');
  assert.ok(!createdElement.innerHTML.includes('PIRLS'), 'Kein Prüfungsjargon (PIRLS)');
});

test('Print: Arbeitsblatt enthält niemals externe URLs, Tausenderpunkte oder unzulässige Rechenzeichen', () => {
  let createdElement = { id: 'print-area', innerHTML: '' };
  sandbox.document.getElementById = () => createdElement;
  sandbox.window.print = () => {};

  const mathTasks = [
    {
      type: 'equation',
      schulstufe: 4,
      symbol: '·',
      num1: '1 250',
      num2: '4',
      answer: 5000
    }
  ];

  Print.generateAndPrintWorksheet('Malrechnen bis 10 000', '4. Klasse', mathTasks);
  const html = createdElement.innerHTML;

  assert.ok(!/(https?:\/\/|www\.)/i.test(html), 'Keine externen Webadressen im Druck (Regel 10)');
  assert.ok(!/\d\.\d{3}/.test(html), 'Kein Tausenderpunkt im Druck (Regel 1)');
  assert.ok(!/\d\s*[\*\/]\s*\d/.test(html) && !html.includes('➗') && !html.includes(' * '), 'Keine verbotenen Rechenzeichen in Rechnungen (Regel 2)');
});

test('Print: buildTwoPageHtml erzeugt separates Lösungsblatt auf Seite 2 ohne Namensfeld (Regel 15)', () => {
  const tasks = [
    { type: 'equation', schulstufe: 2, symbol: '+', num1: '15', num2: '7', answer: 22 }
  ];
  const html = Print.buildTwoPageHtml('Plus bis 30', '2. Klasse', tasks);

  assert.ok(html.includes('print-twopage-sheet'), 'Muss Seite 1 enthalten');
  assert.ok(html.includes('print-twopage-solution'), 'Muss separates Lösungsblatt auf Seite 2 enthalten');
  assert.ok(html.includes('LÖSUNGEN (Selbstkontrolle)'), 'Muss Lösungs-Header auf Seite 2 tragen');
  assert.ok(html.includes('Seite 1 von 2'), 'Fußzeile Seite 1 muss Seitenzahl ausweisen');
  assert.ok(html.includes('Seite 2 von 2'), 'Fußzeile Seite 2 muss Seitenzahl ausweisen');
});

test('Print: printCertificate druckt Urkunde mit tatsächlichem Lernstand des Profils', () => {
  let createdElement = null;
  sandbox.document.getElementById = (id) => {
    if (id === 'print-area') {
      if (!createdElement) {
        createdElement = { id: 'print-area', innerHTML: '' };
      }
      return createdElement;
    }
    return null;
  };
  sandbox.window.print = () => {};

  const profile = {
    name: 'Felix',
    stars: { 'math-addition': 3, 'german-reading': 2 },
    unlockedStickers: ['s1', 's2', 's3']
  };

  Print.printCertificate(profile);

  assert.ok(createdElement.innerHTML.includes('SCHLAUFUCHS-URKUNDE'), 'Muss Urkunden-Header enthalten');
  assert.ok(createdElement.innerHTML.includes('Felix'), 'Name des Kindes muss enthalten sein');
  assert.ok(createdElement.innerHTML.includes('>5</div>'), '5 Sterne müssen ausgewiesen werden');
  assert.ok(createdElement.innerHTML.includes('3 / 16</div>'), '3 / 16 Sticker müssen ausgewiesen werden');
});

test('Print: printCertificate(options.full = true) druckt vollständige Urkunde mit allen 84 Sternen und 16/16 Stickern für Fremdgeräte', () => {
  let createdElement = null;
  sandbox.document.getElementById = (id) => {
    if (id === 'print-area') {
      if (!createdElement) {
        createdElement = { id: 'print-area', innerHTML: '' };
      }
      return createdElement;
    }
    return null;
  };
  sandbox.window.print = () => {};

  // Fremdgerät-Modus: Kein volles Profil lokal vorhanden, Name wird flexibel übergeben
  Print.printCertificate({ name: 'Maya' }, { full: true });

  assert.ok(createdElement.innerHTML.includes('SCHLAUFUCHS-URKUNDE'), 'Muss Urkunden-Header enthalten');
  assert.ok(createdElement.innerHTML.includes('Maya'), 'Wunschname muss auf der Urkunde stehen');
  assert.ok(createdElement.innerHTML.includes('>84</div>'), 'Muss alle 84 Sterne (28 Themen x 3) aufweisen');
  assert.ok(createdElement.innerHTML.includes('16 / 16</div>'), 'Muss alle 16/16 Sammel-Sticker aufweisen');
  assert.ok(createdElement.innerHTML.includes('Champion'), 'Muss Champion-Badge enthalten');
  assert.ok(createdElement.innerHTML.includes('Unterschrift (Lehrkraft / Eltern)'), 'Muss Unterschriftszeile enthalten');
});

