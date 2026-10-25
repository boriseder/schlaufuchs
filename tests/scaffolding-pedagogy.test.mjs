// =============================================================
// SCHLAUFUCHS – tests/scaffolding-pedagogy.test.mjs
// Testet die fachdidaktische Qualität des 3-Stufen-Scaffoldings,
// strikte Redundanzfreiheit (Schritt 2 !== Schritt 3) und Spoilerfreiheit
// laut österreichischem Lehrplan und Pädagogik-Regeln (AGENTS.md).
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function createScaffoldingSandbox() {
  const sandbox = {
    window: {},
    globalThis: {},
    console: console,
    Math: Math
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  // 1. Core Format
  const formatCode = fs.readFileSync('js/core/format.js', 'utf8');
  vm.runInNewContext(formatCode, sandbox);

  // 2. Core Random
  const randomCode = fs.readFileSync('js/core/random.js', 'utf8');
  vm.runInNewContext(randomCode, sandbox);

  // 3. Clock & Signs & State
  vm.runInNewContext(fs.readFileSync('js/clock.js', 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync('js/signs.js', 'utf8'), sandbox);
  vm.runInNewContext('window.Schlaufuchs.State = { getActiveGrades: () => [1, 2, 3, 4] };', sandbox);

  // 4. Topics
  const topicsCode = fs.readFileSync('js/core/topics.js', 'utf8');
  vm.runInNewContext(topicsCode, sandbox);

  // 5. Generators
  const mathCode = fs.readFileSync('js/generators/math.js', 'utf8');
  vm.runInNewContext(mathCode, sandbox);

  const germanCode = fs.readFileSync('js/generators/german.js', 'utf8');
  vm.runInNewContext(germanCode, sandbox);

  const generalCode = fs.readFileSync('js/generators/general.js', 'utf8');
  vm.runInNewContext(generalCode, sandbox);

  const brainCode = fs.readFileSync('js/generators/brain.js', 'utf8');
  vm.runInNewContext(brainCode, sandbox);

  const indexCode = fs.readFileSync('js/generators/index.js', 'utf8');
  vm.runInNewContext(indexCode, sandbox);

  // 6. Scaffolding Renderer
  const scaffoldCode = fs.readFileSync('js/renderers/scaffolding.js', 'utf8');
  vm.runInNewContext(scaffoldCode, sandbox);

  return sandbox;
}

test('Scaffolding-Architektur: Schritt 2 (Merkregel) und Schritt 3 (Teilschritte) sind NIEMALS identisch', () => {
  const { Schlaufuchs } = createScaffoldingSandbox();
  const getScaffold = Schlaufuchs.Renderers.getUniversalScaffolding;
  assert.equal(typeof getScaffold, 'function', 'getUniversalScaffolding muss existieren');

  // Prüfe Aufgaben aus allen 28 Themen
  const topics = Schlaufuchs.Topics.getAllTopics();
  assert(topics && topics.length === 28, 'Es müssen genau 28 Lehrplan-Themen registriert sein');

  let testedTasksCount = 0;

  for (const topic of topics) {
    const tasks = Schlaufuchs.Generators.getTasksForTopic(topic.id, { all: true, count: 10, seed: 42 });
    assert(Array.isArray(tasks) && tasks.length > 0, `Thema ${topic.id} muss Aufgaben liefern`);

    for (const task of tasks) {
      testedTasksCount++;
      const scaffold = getScaffold(task);

      assert(scaffold, `Aufgabe vom Typ ${task.type} (${topic.id}) muss didaktisches Scaffolding liefern`);
      assert(scaffold.impulse, `Stufe 1 (impulse / Denkstrategie) darf nicht leer sein bei ${topic.id}`);

      // Wenn kein SVG-Rechenstrich vorhanden ist, muss eine Merkregel da sein:
      if (!scaffold.points) {
        assert(scaffold.rule, `Stufe 2 (rule / Merkregel) darf nicht leer sein bei ${topic.id}`);
      }

      const substeps = scaffold.substeps || scaffold.steps;
      assert(Array.isArray(substeps) && substeps.length >= 2, `Stufe 3 (substeps) muss mindestens 2 strukturierte Schritte haben bei ${topic.id}`);

      // STRIKTE REDUNDANZPRÜFUNG:
      if (scaffold.rule) {
        const cleanRule = scaffold.rule.trim();
        for (let i = 0; i < substeps.length; i++) {
          const stepText = substeps[i].trim();
          assert.notEqual(
            stepText,
            cleanRule,
            `Redundanzfehler in ${topic.id}: Substep [${i}] ist exakt identisch mit Schritt 2 (Merkregel): "${stepText}"`
          );
          assert(
            !stepText.startsWith(`Tipp: ${cleanRule}`),
            `Redundanzfehler in ${topic.id}: Substep [${i}] beginnt mit 'Tipp: ' gefolgt von der Merkregel`
          );
        }
      }

      // KEINE BELEHRENDEN UI-ANWEISUNGEN:
      for (const step of substeps) {
        assert(
          !step.toLowerCase().includes('klicke auf prüfen'),
          `Didaktikfehler in ${topic.id}: Substep enthält triviale UI-Anweisung 'klicke auf Prüfen': "${step}"`
        );
        assert(
          !step.toLowerCase().includes('klicke'),
          `Didaktikfehler in ${topic.id}: Substep darf keine Klick-Aufforderungen enthalten: "${step}"`
        );
      }
    }
  }

  assert(testedTasksCount >= 100, `Es müssen mindestens 100 Aufgaben getestet worden sein (getestet: ${testedTasksCount})`);
});

test('Didaktische Güte: Kärnten / Drau-Aufgabe liefert wertvolles Scaffolding ohne Spoiler', () => {
  const { Schlaufuchs } = createScaffoldingSandbox();
  const getScaffold = Schlaufuchs.Renderers.getUniversalScaffolding;

  const drauTask = {
    fach: 'sachunterricht',
    type: 'multiple-choice',
    schulstufe: 4,
    grade: 4,
    lehrplanRef: 'SU-4-Raum-Bundeslaender',
    question: 'Welcher Hauptfluss durchfließt das Bundesland Kärnten von West nach Ost?',
    options: ['Die Drau', 'Die Mur', 'Die Enns', 'Die Traun'],
    correctIndex: 0,
    hint: 'Dieser Fluss entspringt in Südtirol, fließt durch die Städte Spittal und Villach und mündet später in die Donau.'
  };

  const scaffold = getScaffold(drauTask);

  // Stufe 1: Denkstrategie (Geografie / Landkarte)
  assert(scaffold.impulse.includes('Landkarte von Österreich'), 'Stufe 1 muss kognitive Landkarten-Orientierung anregen');

  // Stufe 2: Merkregel / Sachbezug
  assert(!scaffold.rule.includes('Drau'), 'Stufe 2 darf den Flussnamen "Drau" NICHT verraten');
  assert(scaffold.rule.includes('Spittal und Villach'), 'Stufe 2 muss geographische Orientierungspunkte nennen');

  // Stufe 3: Deduktion & Ausschluss
  assert(Array.isArray(scaffold.substeps), 'Stufe 3 muss ein Array sein');
  assert.notEqual(scaffold.substeps[0], scaffold.rule, 'Stufe 3 darf Stufe 2 nicht wiederholen');
  assert(scaffold.substeps[1].includes('Schließe Optionen aus'), 'Stufe 3 muss den Ausschluss von Distraktoren anleiten');
});

test('Fragenpools: AUSTRIA_POOL enthält keine direkten Antwortspoiler in Hinweisen', () => {
  const code = fs.readFileSync('js/generators/general.js', 'utf8');
  const idx = code.indexOf('AUSTRIA_POOL = [');
  const end = code.indexOf('];', idx);
  const items = JSON.parse(code.slice(idx + 'AUSTRIA_POOL = '.length, end + 1));

  assert.equal(items.length, 100, 'AUSTRIA_POOL muss 100 Fragen umfassen');

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const correct = it.options[it.correct];
    const core = correct.replace(/^(Die|Der|Das|Ein|Eine)\s+/, '').replace(/\s*\([^)]*\)/, '').trim();

    if (core.length > 2) {
      assert(
        !it.hint.toLowerCase().includes(core.toLowerCase()),
        `Spoiler in AUSTRIA_POOL [${i}]: Antwort "${correct}" (Kern: "${core}") steht im Hinweis: "${it.hint}"`
      );
    }
  }
});

test('Fragenpools: CASES_POOL enthält reine Frageproben ohne Vorwegnahme des Falls', () => {
  const code = fs.readFileSync('js/generators/german.js', 'utf8');
  const idx = code.indexOf('CASES_POOL = [');
  const end = code.indexOf('];', idx);
  const items = JSON.parse(code.slice(idx + 'CASES_POOL = '.length, end + 1));

  assert.equal(items.length, 100, 'CASES_POOL muss 100 Fragen umfassen');

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    // Darf niemals das Ergebnis verraten:
    assert(
      !it.hint.includes('Fall'),
      `Spoiler in CASES_POOL [${i}]: Hinweis nennt das Wort "Fall": "${it.hint}"`
    );
    assert(
      !it.hint.includes('->'),
      `Spoiler in CASES_POOL [${i}]: Hinweis enthält Pfeil "->": "${it.hint}"`
    );
    // Muss pädagogische Frageprobe enthalten:
    assert(
      it.hint.includes('Frageprobe:') || it.hint.includes('?'),
      `Didaktikmangel in CASES_POOL [${i}]: Hinweis muss eine Frageprobe enthalten: "${it.hint}"`
    );
  }
});

test('Fragenpools: TENSES_POOL enthält linguistische Signalproben ohne Verrat der Zielkategorie', () => {
  const code = fs.readFileSync('js/generators/german.js', 'utf8');
  const idx = code.indexOf('TENSES_POOL = [');
  const end = code.indexOf('];', idx);
  const items = JSON.parse(code.slice(idx + 'TENSES_POOL = '.length, end + 1));

  assert.equal(items.length, 100, 'TENSES_POOL muss 100 Fragen umfassen');

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    // Darf nicht die Zielkategorie verraten:
    assert(
      !it.hint.includes('(Präsens)') && !it.hint.includes('(Präteritum)') && !it.hint.includes('(Perfekt)') && !it.hint.includes('(Futur)'),
      `Spoiler in TENSES_POOL [${i}]: Hinweis enthält Fachbegriff in Klammern: "${it.hint}"`
    );
    assert(
      it.hint.includes('Signalprobe') || it.hint.includes('Probe:') || it.hint.includes('Erzählprobe') || it.hint.includes('Tunwort') || it.hint.includes('Zeitwort') || it.hint.includes('Zeitform') || it.hint.includes('Verbform') || it.hint.includes('Hilfsverb') || it.hint.includes('Hilfswort') || it.hint.includes('Vorausschau') || it.hint.includes('Zukunftsform') || it.hint.includes('Nennform'),
      `Didaktikmangel in TENSES_POOL [${i}]: Hinweis muss eine linguistische Probe oder morphologische Orientierung bieten: "${it.hint}"`
    );
  }
});

test('Fragenpools: STORIES_POOL enthält didaktische Modellierungshilfen statt Vorrechnung', () => {
  const code = fs.readFileSync('js/generators/math.js', 'utf8');
  const idx = code.indexOf('STORIES_POOL = [');
  const end = code.indexOf('];', idx);
  const items = JSON.parse(code.slice(idx + 'STORIES_POOL = '.length, end + 1));

  assert.equal(items.length, 100, 'STORIES_POOL muss 100 Fragen umfassen');

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    assert(
      !it.hint.match(/\bRechne\s+\d+/i),
      `Spoiler in STORIES_POOL [${i}]: Hinweis rechnet die Zahlen vor: "${it.hint}"`
    );
    assert(
      !it.hint.match(/\bTeile\s+\d+/i),
      `Spoiler in STORIES_POOL [${i}]: Hinweis gibt Division mit Zahlen vor: "${it.hint}"`
    );
  }
});
