// =============================================================
// SCHLAUFUCHS – tests/print-integration.test.mjs
// End-to-End Integrations-Tests für die A4-Arbeitsblatt-Pipeline
// Prüft: Bijektion, Schulstufen-Integrität, StVO-SVGs (0 Emojis), CSS-Präsenz
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const formatCode = readFileSync('js/core/format.js', 'utf8');
const randomCode = readFileSync('js/core/random.js', 'utf8');
const signsCode = readFileSync('js/signs.js', 'utf8');
const clockCode = readFileSync('js/clock.js', 'utf8');
const storageCode = readFileSync('js/core/storage.js', 'utf8');
const topicsCode = readFileSync('js/core/topics.js', 'utf8');
const mathGenCode = readFileSync('js/generators/math.js', 'utf8');
const germanGenCode = readFileSync('js/generators/german.js', 'utf8');
const generalGenCode = readFileSync('js/generators/general.js', 'utf8');
const brainGenCode = readFileSync('js/generators/brain.js', 'utf8');
const genIndexCode = readFileSync('js/generators/index.js', 'utf8');
const printEngineCode = readFileSync('js/print-engine.js', 'utf8');
const printCode = readFileSync('js/print.js', 'utf8');

const cssModules = [
  'style.css',
  'css/tokens.css',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/exercises.css',
  'css/stickers.css',
  'css/admin.css',
  'css/print.css'
];
const styleCss = cssModules
  .filter(f => existsSync(f))
  .map(f => readFileSync(f, 'utf8'))
  .join('\n');

function setupIntegrationSandbox() {
  const sandbox = {
    window: {},
    print: () => {},
    document: {
      createElement: () => ({ id: '', innerHTML: '', appendChild: () => {} }),
      body: { appendChild: () => {} },
      getElementById: () => null
    },
    setTimeout: (fn) => fn(),
    Math: Math
  };
  sandbox.window = sandbox;

  vm.runInNewContext(formatCode, sandbox);
  vm.runInNewContext(randomCode, sandbox);
  vm.runInNewContext(signsCode, sandbox);
  vm.runInNewContext(clockCode, sandbox);
  vm.runInNewContext(storageCode, sandbox);
  vm.runInNewContext(topicsCode, sandbox);
  vm.runInNewContext(mathGenCode, sandbox);
  vm.runInNewContext(germanGenCode, sandbox);
  vm.runInNewContext(generalGenCode, sandbox);
  vm.runInNewContext(brainGenCode, sandbox);
  vm.runInNewContext(genIndexCode, sandbox);
  vm.runInNewContext(printEngineCode, sandbox);
  vm.runInNewContext(printCode, sandbox);

  return {
    Schlaufuchs: sandbox.window.Schlaufuchs,
    sandbox
  };
}

const { Schlaufuchs: { Topics, PrintEngine, Print, Signs } } = setupIntegrationSandbox();

test('Integration: Alle 28 Themen erzeugen fehlerfreies A4-HTML ohne Exceptions', () => {
  const all = Topics.getAllTopics();
  assert.equal(all.length, 28, 'Genau 28 didaktische Themen');

  all.forEach(topic => {
    const grade = topic.grades[0];
    const tasks = PrintEngine.generateWorksheetTasks(topic.id, grade);
    assert.ok(tasks && tasks.length > 0, `Thema ${topic.id} muss Aufgaben liefern`);

    // Memory-Sonderfall
    if (tasks.length === 1 && tasks[0].type === 'memory') {
      assert.equal(topic.archetype, 'craft-sheet');
      return;
    }

    // Vollständige Generierung mit Geheimwort
    let effCount = tasks.length;
    if (tasks.length === 1 && tasks[0].type === 'reading' && tasks[0].questions) {
      effCount = tasks[0].questions.length;
    }

    const secretWord = PrintEngine.pickSecretWord(effCount);
    assert.equal(secretWord.length, effCount, `Thema ${topic.id}: Geheimwort muss exakt ${effCount} Buchstaben haben`);

    const letters = [];
    for (let i = 0; i < effCount; i++) {
      letters.push(secretWord[i]);
    }
    assert.equal(letters.length, effCount);
  });
});

test('Integration: Lösungsstreifen-Vollständigkeit für alle 28 Themen (Aufgaben = Lösungen im Knickstreifen)', () => {
  const all = Topics.getAllTopics();

  all.forEach(topic => {
    const grade = topic.grades[0];
    const tasks = PrintEngine.generateWorksheetTasks(topic.id, grade);

    // Memory-Sonderfall überspringen
    if (tasks.length === 1 && tasks[0].type === 'memory') return;

    let effCount = tasks.length;
    if (tasks.length === 1 && tasks[0].type === 'reading' && tasks[0].questions) {
      effCount = tasks[0].questions.length;
    }

    // Knick-HTML erzeugen
    let renderedHtml = '';
    const { Schlaufuchs: sf, sandbox } = setupIntegrationSandbox();
    sandbox.document.getElementById = (id) => {
      if (id === 'print-area') {
        return {
          set innerHTML(val) { renderedHtml = val; }
        };
      }
      return null;
    };

    sf.Print.printTopicWorksheet(topic.id, grade);

    // Zählen der gerenderten Lösungen im Knickstreifen
    const solMatches = (renderedHtml.match(/class="print-knick-item"/g) || []).length;
    assert.equal(
      solMatches,
      effCount,
      `Thema ${topic.id} (Stufe ${grade}): Erwartet ${effCount} Lösungen im Knickstreifen, aber ${solMatches} gefunden!`
    );

    // Keine überflüssigen Geheimwort-Kästchen auf dem Blatt
    assert.ok(
      !renderedHtml.includes('print-secret-box'),
      `Thema ${topic.id}: Arbeitsblatt darf keine Geheimwort-Kästchen enthalten`
    );

    // Prüfen, dass der Header die korrekte Schulstufe trägt
    assert.ok(
      renderedHtml.includes(`${grade}. Klasse`),
      `Thema ${topic.id}: Arbeitsblatt-Kopf muss "${grade}. Klasse" enthalten`
    );
  });
});

test('Integration: Schulstufen-Kontrakt verweigert Falschaufrufe (Zahlenraum 1 Million bleibt 4. Klasse)', () => {
  // Wenn jemand math-million mit grade=2 aufruft:
  const tasks = PrintEngine.generateWorksheetTasks('math-million', 2);
  assert.equal(tasks[0].schulstufe, 4, 'math-million muss zwingend Stufe 4 bleiben, auch wenn Stufe 2 angefragt wird');

  const geoTasks = PrintEngine.generateWorksheetTasks('math-geometry', 2);
  assert.equal(geoTasks[0].schulstufe, 4, 'math-geometry muss zwingend Stufe 4 bleiben (oder 3)');

  const caseTasks = PrintEngine.generateWorksheetTasks('german-cases', 2);
  assert.equal(caseTasks[0].schulstufe, 4, 'german-cases (4 Fälle) muss zwingend Stufe 4 bleiben');

  const bikeTasks = PrintEngine.generateWorksheetTasks('general-bike-test', 2);
  assert.equal(bikeTasks[0].schulstufe, 4, 'Radfahrprüfung muss zwingend Stufe 4 bleiben');
});

test('Integration: Verkehrszeichen rendern echte StVO-SVGs und NIEMALS ein Emoji', () => {
  const { Schlaufuchs: sf, sandbox } = setupIntegrationSandbox();
  let trafficHtml = '';
  sandbox.document.getElementById = (id) => ({
    set innerHTML(val) { trafficHtml = val; }
  });

  // 1. Schulweg
  sf.Print.printTopicWorksheet('general-traffic', 1);
  assert.ok(trafficHtml.includes('class="stvo-sign"'), 'Schulweg-Verkehrszeichen müssen stvo-sign Klasse haben');
  assert.ok(!trafficHtml.includes('🚸'), 'Schulweg darf unter keinen Umständen das Emoji 🚸 enthalten');

  // 2. Radfahrprüfung
  let bikeHtml = '';
  sandbox.document.getElementById = (id) => ({
    set innerHTML(val) { bikeHtml = val; }
  });
  sf.Print.printTopicWorksheet('general-bike-test', 4);
  assert.ok(bikeHtml.includes('class="stvo-sign"'), 'Radfahrprüfung muss stvo-sign Klasse haben');
  assert.ok(!bikeHtml.includes('🚸'), 'Radfahrprüfung darf unter keinen Umständen das Emoji 🚸 enthalten');
});

test('Integration: CSS-Klassen-Integrität (Alle im Generator erzeugten Klassen existieren in style.css)', () => {
  const requiredClasses = [
    'print-twenty-wrap',
    'print-twenty-field-grid',
    'print-dot-cell',
    'print-calc-grid-mm',
    'worksheet-preview-dialog',
    'preview-header',
    'preview-body',
    'modal-icon-svg'
  ];

  requiredClasses.forEach(cls => {
    const rx = new RegExp(`\\.${cls}\\b`);
    assert.ok(rx.test(styleCss), `CSS-Klasse .${cls} fehlt in style.css!`);
  });
});
