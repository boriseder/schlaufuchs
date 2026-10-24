// =============================================================
// SCHLAUFUCHS – tests/print-engine.test.mjs
// Unit-Tests für die entkoppelte Worksheet-Engine & Varianz-Garantie
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

const sandbox = {
  window: {},
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

const { Topics, PrintEngine, Print } = sandbox.window.Schlaufuchs;

test('Topics: Alle 28 Lehrplan-Themen sind vollständig mit Metadaten hinterlegt', () => {
  const all = Topics.getAllTopics();
  assert.equal(all.length, 28, 'Es müssen genau 28 didaktische Themen registriert sein');

  all.forEach(t => {
    assert.ok(t.id, 'Jedes Thema muss eine ID haben');
    assert.ok(t.title, 'Jedes Thema muss einen Titel haben');
    assert.ok(t.subject, 'Jedes Thema muss einem Fach zugeordnet sein');
    assert.ok(Array.isArray(t.grades) && t.grades.length > 0, 'Jedes Thema muss Schulstufen haben');
    assert.ok(t.lehrplanRef, 'Jedes Thema muss eine lehrplanRef besitzen');
    assert.ok(t.archetype, 'Jedes Thema muss einem der 6 Archetypen zugeordnet sein');
  });
});

test('PrintEngine: Archetyp 1 (Kompaktrechnen) garantiert strikte Injektivität (12 eindeutige Antworten)', () => {
  const tasks = PrintEngine.generateWorksheetTasks('math-addition', 2);
  assert.equal(tasks.length, 12, 'Kompaktrechnen muss genau 12 Aufgaben liefern');

  const answers = tasks.map(t => t.answer);
  const uniqueAnswers = new Set(answers);
  assert.equal(uniqueAnswers.size, 12, 'Alle 12 Rechenergebnisse auf dem Blatt müssen mathematisch eindeutig sein (Injektivität)');

  // Keine Tausenderpunkte
  tasks.forEach(t => {
    assert.ok(!String(t.num1).includes('.'), 'Kein Tausenderpunkt in num1');
    assert.ok(!String(t.num2).includes('.'), 'Kein Tausenderpunkt in num2');
  });
});

test('PrintEngine: Hohe Entropie & 10 aufeinanderfolgende Drucke ohne Duplikate (Inter-Sheet Varianz)', () => {
  PrintEngine.tracker.clear();
  const seenSignatures = new Set();
  let totalTasksGenerated = 0;

  for (let printRun = 0; printRun < 10; printRun++) {
    const tasks = PrintEngine.generateWorksheetTasks('math-addition', 2);
    assert.equal(tasks.length, 12);
    tasks.forEach(t => {
      totalTasksGenerated++;
      const sig = `${t.raw1}+${t.raw2}`;
      // Injektivität innerhalb des Blattes und über 10 Drucke
      assert.ok(!seenSignatures.has(sig), `Aufgabe ${sig} darf über 10 Drucke hinweg nicht wiederholt werden (Drucklauf ${printRun + 1})`);
      seenSignatures.add(sig);
    });
  }

  assert.equal(totalTasksGenerated, 120, '10 Druckläufe müssen 120 distinkte Rechnungen liefern');
  assert.equal(seenSignatures.size, 120, 'Alle 120 Rechnungen müssen einzigartig sein');
});

test('PrintEngine: Deckt alle 28 Themen fehlerfrei ab', () => {
  const all = Topics.getAllTopics();
  all.forEach(topic => {
    const grade = topic.grades[0];
    const tasks = PrintEngine.generateWorksheetTasks(topic.id, grade);
    assert.ok(tasks && tasks.length > 0, `Thema ${topic.id} muss valide Aufgaben erzeugen`);
    assert.ok(tasks[0].schulstufe, `Thema ${topic.id} muss Schulstufe an Aufgabe haben`);
    assert.ok(tasks[0].lehrplanRef, `Thema ${topic.id} muss lehrplanRef an Aufgabe haben`);
  });
});

test('PrintEngine: Geheimwörter für die Schatzkiste sind kindgerecht und registriert', () => {
  const word = PrintEngine.pickSecretWord(5);
  assert.ok(word.length >= 4 && word.length <= 8);
  assert.equal(word, word.toUpperCase());
});

test('Print: printTopicWorksheet und printBatchWorksheets existieren und sind aufrufbar', () => {
  assert.equal(typeof Print.printTopicWorksheet, 'function');
  assert.equal(typeof Print.printBatchWorksheets, 'function');
  assert.equal(typeof Print.previewTopicWorksheet, 'function');
});
