// =============================================================
// SCHLAUFUCHS – tests/seed-determinism.test.mjs
// Unit-Tests für deterministische Zufallsgenerierung (PRNG mit Seed)
// Garantiert: Für jeden Seed identische Aufgabenlisten über alle 28 Themen
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createDeterministicSandbox() {
  const sandbox = {
    window: {},
    document: {
      createElement: () => ({ id: '', innerHTML: '', appendChild: () => {} }),
      body: { appendChild: () => {} },
      getElementById: () => null
    },
    Math: Math
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/core/format.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/random.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/signs.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/clock.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/topics.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/math.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/german.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/general.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/brain.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/index.js', 'utf8'), sandbox);

  return sandbox.window.Schlaufuchs;
}

test('Seed-Determinismus: Alle 28 Lehrplan-Themen liefern mit demselben Seed identische Aufgaben', () => {
  const S = createDeterministicSandbox();
  const allTopics = S.Topics.getAllTopics();
  assert.equal(allTopics.length, 28, 'Alle 28 Themen müssen registriert sein');

  const TEST_SEED = 424242;

  allTopics.forEach(topic => {
    const run1 = S.Generators.getTasksForTopic(topic.id, { seed: TEST_SEED });
    const run2 = S.Generators.getTasksForTopic(topic.id, { seed: TEST_SEED });

    assert.ok(Array.isArray(run1) && run1.length > 0, `Thema ${topic.id} muss Aufgaben liefern`);
    assert.equal(run1.length, run2.length, `Thema ${topic.id}: Aufgabenanzahl muss bei identischem Seed gleich sein`);

    // Tiefe Gleichheit prüfen (Aufgabeninhalt, Optionen, Lösungen)
    assert.deepEqual(
      run1,
      run2,
      `Thema ${topic.id}: Mit Seed ${TEST_SEED} müssen beide Generator-Läufe exakt dieselben Aufgaben liefern`
    );
  });
});

test('Seed-Determinismus: Unterschiedliche Seeds erzeugen unterschiedliche Aufgabenmuster', () => {
  const S = createDeterministicSandbox();
  const mathTopic = 'math-addition';

  const runA = S.Generators.getTasksForTopic(mathTopic, { seed: 10001 });
  const runB = S.Generators.getTasksForTopic(mathTopic, { seed: 99999 });

  assert.notDeepEqual(
    runA,
    runB,
    'Unterschiedliche Seeds müssen für hohe Varianz unterschiedliche Aufgaben erzeugen'
  );
});
