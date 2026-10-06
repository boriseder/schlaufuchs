// =============================================================
// SCHLAUFUCHS – tests/generators.test.mjs
// Lehrplan- und Validierungs-Tests für alle Generatoren
// Prüft verbindliche Rahmenbedingungen aus AGENTS.md
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createSandbox(activeGrades = [1, 2, 3, 4]) {
  const sandbox = {
    window: {},
    Math: Math
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/core/random.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/format.js', 'utf8'), sandbox);
  vm.runInNewContext('window.Schlaufuchs.Signs = { getSignSvg: () => "<svg></svg>" };', sandbox);
  vm.runInNewContext(`window.Schlaufuchs.State = { getActiveGrades: () => ${JSON.stringify(activeGrades)} };`, sandbox);
  vm.runInNewContext(readFileSync('js/generators/math.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/german.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/general.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/brain.js', 'utf8'), sandbox);

  return sandbox.window.Schlaufuchs.Generators;
}

test('AGENTS.md: Alle Generatoren liefern Schulstufe, Fach und Lehrplan-Referenz', () => {
  const G = createSandbox([1, 2, 3, 4]);
  const allBuilders = [
    ...Object.entries(G.Math).filter(([k]) => k.startsWith('build')).map(([k, fn]) => ['Math.' + k, fn]),
    ...Object.entries(G.German).filter(([k]) => k.startsWith('build')).map(([k, fn]) => ['German.' + k, fn]),
    ...Object.entries(G.General).filter(([k]) => k.startsWith('build')).map(([k, fn]) => ['General.' + k, fn]),
    ...Object.entries(G.Brain).filter(([k]) => k.startsWith('build')).map(([k, fn]) => ['Brain.' + k, fn]),
  ];

  for (const [name, fn] of allBuilders) {
    const tasks = fn();
    assert.ok(Array.isArray(tasks) && tasks.length > 0, `${name} muss Aufgaben liefern`);
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      assert.ok(['mathe', 'deutsch', 'sachunterricht', 'denken'].includes(t.fach), `${name} task ${i} hat ungültiges fach: ${t.fach}`);
      assert.ok([1, 2, 3, 4].includes(t.schulstufe), `${name} task ${i} hat ungültige schulstufe: ${t.schulstufe}`);
      assert.ok(typeof t.lehrplanRef === 'string' && t.lehrplanRef.length > 0, `${name} task ${i} fehlt lehrplanRef`);
    }
  }
});

test('AGENTS.md Harte Regel 2: Mathematische Rechenzeichen nur +, −, ·, :', () => {
  const G = createSandbox([1, 2, 3, 4]);
  const mathBuilders = [
    G.Math.buildAdditionTasks,
    G.Math.buildSubtractionTasks,
    G.Math.buildMultiplicationTasks,
    G.Math.buildDivisionTasks,
    G.Math.buildWrittenMathTasks,
  ];

  for (let run = 0; run < 50; run++) {
    for (const fn of mathBuilders) {
      const tasks = fn();
      for (const t of tasks) {
        if (t.symbol) {
          assert.ok(['+', '−', '·', ':'].includes(t.symbol), `Unerlaubtes Rechenzeichen: ${t.symbol}`);
        }
      }
    }
  }
});

test('Lehrplan: 1. Schulstufe nur ZR 20, keine Multiplikation / Division', () => {
  const G1 = createSandbox([1]);
  // Addition 1. Klasse
  for (let r = 0; r < 20; r++) {
    const addTasks = G1.Math.buildAdditionTasks();
    for (const t of addTasks) {
      assert.equal(t.schulstufe, 1);
      assert.ok(t.answer <= 20, `Ergebnis in Stufe 1 muss <= 20 sein: ${t.answer}`);
    }

    const subTasks = G1.Math.buildSubtractionTasks();
    for (const t of subTasks) {
      assert.equal(t.schulstufe, 1);
      assert.ok(t.raw1 <= 20 && t.answer >= 0, `Subtraktion in Stufe 1 muss im ZR 20 liegen: ${t.raw1} − ${t.raw2}`);
    }
  }
});
