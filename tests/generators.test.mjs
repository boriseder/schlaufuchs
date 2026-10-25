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
  vm.runInNewContext(readFileSync('js/clock.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/signs.js', 'utf8'), sandbox);
  vm.runInNewContext(`window.Schlaufuchs.State = { getActiveGrades: () => ${JSON.stringify(activeGrades)} };`, sandbox);
  vm.runInNewContext(readFileSync('js/generators/math.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/german.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/general.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/brain.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/index.js', 'utf8'), sandbox);

  return sandbox.window.Schlaufuchs.Generators;
}

test('Fail-Fast: Unbekanntes Thema wirft Fehler und hat keinen stillen Fallback', () => {
  const G = createSandbox([1, 2, 3, 4]);
  assert.throws(() => {
    G.getTasksForTopic('unbekanntes-phantasie-thema');
  }, /Unbekanntes Lehrplanthema/, 'Muss harten Fehler werfen statt still auf Addition zurückzufallen');
});

test('AGENTS.md: Alle Generatoren liefern Schulstufe, Fach, Lehrplan-Referenz, Lehrplan-Status und Druckentscheidung', () => {
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
      assert.ok(['RIS', 'SCHULUEBLICH'].includes(t.lehrplanStatus), `${name} task ${i} hat ungültigen lehrplanStatus: ${t.lehrplanStatus}`);
      assert.ok(['ja', 'angepasst', 'nur-digital'].includes(t.druck), `${name} task ${i} hat ungültige druck-Entscheidung: ${t.druck}`);
      if (t.druck !== 'ja') {
        assert.ok(typeof t.druckHinweis === 'string' && t.druckHinweis.trim().length > 0, `${name} task ${i} benötigt druckHinweis bei druck="${t.druck}"`);
      }
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

test('Sachunterricht: Multiple-Choice Optionen sind vollständig, korrekt gemappt und geshuffelt', () => {
  const G = createSandbox([1, 2, 3, 4]);
  const mcGenerators = [
    ['Calendar', G.General.buildCalendarTasks],
    ['Winter', G.General.buildWinterTasks],
    ['Traffic', G.General.buildTrafficTasks],
    ['SchoolWalk', G.General.buildSchoolWalkTasks],
    ['Austria', G.General.buildAustriaTasks]
  ];

  for (const [name, fn] of mcGenerators) {
    const indicesSeen = new Set();
    for (let r = 0; r < 30; r++) {
      const tasks = fn();
      for (const t of tasks) {
        assert.ok(Array.isArray(t.options), `${name}: options muss Array sein`);
        assert.ok(t.options.includes(t.correctText), `${name}: options muss correctText (${t.correctText}) enthalten`);
        assert.equal(t.options[t.correctIndex], t.correctText, `${name}: options[correctIndex] muss correctText entsprechen`);
        indicesSeen.add(t.correctIndex);
      }
    }
    // Optionen müssen durchmischt sein (nicht nur Index 0)
    assert.ok(indicesSeen.size > 1, `${name}: Optionen müssen variieren und dürfen nicht starr auf Index 0 stehen`);
  }
});

test('Sachunterricht: Sicherer Schulweg hat großen Fragenpool (>= 20 Fragen) und NIEMALS ein Emoji als Icon', () => {
  const G = createSandbox([1, 2, 3, 4]);
  const questionsSeen = new Set();
  const EMOJI_REGEX = /(?![©®™])\p{Extended_Pictographic}/u;

  for (let r = 0; r < 50; r++) {
    const tasks = G.General.buildSchoolWalkTasks();
    assert.equal(tasks.length, 5, 'Jeder Durchlauf muss genau 5 Aufgaben liefern');
    for (const t of tasks) {
      assert.equal(t.icon, null, 'Schulweg-Aufgaben dürfen kein Emoji-Icon besitzen (Regel 4 & 5)');
      assert.ok(!EMOJI_REGEX.test(t.question), 'Fragetext darf keine Emojis enthalten');
      questionsSeen.add(t.question);
      if (t.customVisualHtml) {
        assert.ok(t.customVisualHtml.includes('class="stvo-sign"'), 'Verkehrszeichen müssen stvo-sign Klasse haben');
        assert.ok(!EMOJI_REGEX.test(t.customVisualHtml), 'Verkehrszeichen-SVG darf keine Emojis enthalten');
      }
    }
  }

  // Bei 25 Pool-Fragen müssen in 50 Ziehungen à 5 Fragen mindestens 20 verschiedene Fragen vorkommen
  assert.ok(questionsSeen.size >= 20, `Schulweg-Pool muss mindestens 20 unterschiedliche Fragen liefern (gesehen: ${questionsSeen.size})`);
});

test('Sachunterricht: Heimische Tiere im Winter hat großen Fragenpool (100 Fragen) und valide Verhaltensweisen', () => {
  const G = createSandbox([1, 2, 3, 4]);
  const questionsSeen = new Set();

  for (let r = 0; r < 50; r++) {
    const tasks = G.General.buildWinterTasks();
    assert.equal(tasks.length, 5, 'Jeder Durchlauf muss genau 5 Aufgaben liefern');
    for (const t of tasks) {
      assert.ok(t.question.length > 10, 'Fragetext muss vorhanden sein');
      assert.ok(Array.isArray(t.options) && t.options.length >= 3, 'Multiple-Choice-Optionen erforderlich');
      assert.ok(t.options.includes(t.correctText), `correctText (${t.correctText}) nicht in options`);
      assert.equal(t.options[t.correctIndex], t.correctText, `correctIndex stimmt nicht`);
      questionsSeen.add(t.question);
    }
  }
  // Bei 100 Pool-Fragen müssen in 50 Ziehungen à 5 Fragen mindestens 30 unterschiedliche Fragen vorkommen
  assert.ok(questionsSeen.size >= 30, `Wintertiere-Pool muss viele unterschiedliche Fragen liefern (gesehen: ${questionsSeen.size})`);
});

test('Deutsch: Schüttelsätze verwenden ausschließlich österreichische Standardsprache', () => {
  const G = createSandbox([1, 2, 3, 4]);
  for (let r = 0; r < 20; r++) {
    const tasks = G.German.buildScrambleTasks();
    for (const t of tasks) {
      assert.ok(!t.targetSentence.toLowerCase().includes('lecker'), 'Schüttelsatz darf kein bundesdeutsches "lecker" enthalten');
      assert.ok(!t.targetSentence.toLowerCase().includes('schulhof'), 'Schüttelsatz muss "Pausenhof" statt "Schulhof" verwenden');
      assert.equal(
        t.pool.slice().sort().join(' '),
        t.targetSentence.split(' ').sort().join(' '),
        'Schüttel-Pool muss exakt den Wörtern des Zielsatzes entsprechen'
      );
    }
  }
});

test('Mathematik: Geometrie- und Maßeinheiten-Aufgaben sind mathematisch exakt', () => {
  const G = createSandbox([1, 2, 3, 4]);
  // Geometrie
  const geoTasks = G.Math.buildGeometryTasks();
  for (const t of geoTasks) {
    if (t.taskType === 'umfang') {
      if (t.shape === 'rect') assert.equal(t.answer, 2 * t.a + 2 * t.b);
      if (t.shape === 'square') assert.equal(t.answer, 4 * t.a);
    } else if (t.taskType === 'flaeche') {
      if (t.shape === 'rect') assert.equal(t.answer, t.a * t.b);
      if (t.shape === 'square') assert.equal(t.answer, t.a * t.a);
    }
  }

  // Maße
  for (let r = 0; r < 20; r++) {
    const units = G.Math.buildUnitsTasks();
    for (const t of units) {
      assert.ok(typeof t.answer === 'number' && !isNaN(t.answer), `Ungültige Antwort in Maßeinheit: ${t.question}`);
    }
  }
});

test('Gehirntraining: Tier-Memory erzeugt echte, vollflächige Tier- und Natur-SVGs', () => {
  const G = createSandbox([1, 2, 3, 4]);
  const tasks = G.Brain.buildMemoryTasks();
  assert.ok(tasks.length === 1, 'Liefert genau ein Memory-Task-Objekt');
  const task = tasks[0];
  assert.equal(task.type, 'memory');
  assert.ok(task.cards.length >= 8, 'Mindestens 8 Karten (4 Paare)');
  
  // Prüfe jede Karte auf SVG-Vollflächigkeit und Naturbezug
  for (const c of task.cards) {
    assert.ok(typeof c.pairId === 'number', 'Karte muss pairId besitzen');
    assert.ok(typeof c.content === 'string' && c.content.includes('<svg'), 'Karteninhalt muss ein valides SVG sein');
    assert.ok(c.content.includes('viewBox="0 0 100 100"'), 'SVG muss volles 100x100 viewBox nutzen');
    assert.ok(typeof c.subtitle === 'string' && c.subtitle.length > 0, 'Karte muss Tier-/Naturnamen tragen');
    assert.ok(!['★', '●', '▲', '■', '◆', '✦'].includes(c.content), 'Keine sterilen geometrischen Symbole mehr!');
  }

  // Prüfe Paarbildung (jede pairId kommt exakt 2x vor)
  const pairCounts = {};
  for (const c of task.cards) {
    pairCounts[c.pairId] = (pairCounts[c.pairId] || 0) + 1;
  }
  for (const [id, count] of Object.entries(pairCounts)) {
    assert.equal(count, 2, `Paar ${id} muss exakt 2 Karten haben`);
  }
});

test('Pool-basierte Generatoren: Alle 13 statischen Themen besitzen Pools mit mindestens 100 didaktischen Fragen', () => {
  const G = createSandbox([1, 2, 3, 4]);

  // Sachunterricht (5 Themen)
  const calendarTasks = G.General.buildCalendarTasks({ all: true });
  assert.equal(calendarTasks.length, 100, `Kalender-Pool muss exakt 100 Fragen haben (hat: ${calendarTasks.length})`);

  const winterTasks = G.General.buildWinterTasks({ all: true });
  assert.equal(winterTasks.length, 100, `Wintertiere-Pool muss exakt 100 Fragen haben (hat: ${winterTasks.length})`);

  const austriaTasks = G.General.buildAustriaTasks({ all: true });
  assert.equal(austriaTasks.length, 100, `Österreich-Pool muss exakt 100 Fragen haben (hat: ${austriaTasks.length})`);

  const bikeTasks = G.General.buildTrafficTasks({ all: true });
  assert.equal(bikeTasks.length, 100, `Radfahrprüfung-Pool muss exakt 100 Fragen haben (hat: ${bikeTasks.length})`);

  const schoolWalkTasks = G.General.buildSchoolWalkTasks({ all: true });
  assert.equal(schoolWalkTasks.length, 100, `Schulweg-Pool muss exakt 100 Fragen haben (hat: ${schoolWalkTasks.length})`);

  // Deutsch (7 Themen)
  const wordTypeTasks = G.German.buildWordTypesTasks({ all: true });
  assert.equal(wordTypeTasks.length, 100, `Wortarten-Pool muss exakt 100 Sätze haben (hat: ${wordTypeTasks.length})`);

  const capitalizationTasks = G.German.buildCapitalizationTasks({ all: true });
  assert.equal(capitalizationTasks.length, 100, `Groß-/Kleinschreibung-Pool muss exakt 100 Sätze haben (hat: ${capitalizationTasks.length})`);

  const scrambleTasks = G.German.buildScrambleTasks({ all: true });
  assert.equal(scrambleTasks.length, 100, `Schüttelsatz-Pool muss exakt 100 Sätze haben (hat: ${scrambleTasks.length})`);

  const casesTasks = G.German.buildCasesTasks({ all: true });
  assert.equal(casesTasks.length, 100, `4-Fälle-Pool muss exakt 100 Aufgaben haben (hat: ${casesTasks.length})`);

  const tensesTasks = G.German.buildTensesTasks({ all: true });
  assert.equal(tensesTasks.length, 100, `Zeitformen-Pool muss exakt 100 Aufgaben haben (hat: ${tensesTasks.length})`);

  const syllableTasks = G.German.buildSyllableTasks({ all: true });
  assert.equal(syllableTasks.length, 100, `Silben-Pool muss exakt 100 Wörter haben (hat: ${syllableTasks.length})`);

  const readingTasks = G.German.buildReadingTasks({ all: true });
  assert.equal(readingTasks.length, 25, `Lesetexte-Pool muss 25 Sachtexte haben (hat: ${readingTasks.length})`);
  let totalReadingQuestions = 0;
  for (const r of readingTasks) {
    assert.equal(r.questions.length, 4, `Lesetext "${r.title}" muss 4 Fragen haben`);
    totalReadingQuestions += r.questions.length;
  }
  assert.equal(totalReadingQuestions, 100, `Leseverständnis muss insgesamt 100 Fragen umfassen (hat: ${totalReadingQuestions})`);

  // Mathematik (1 Thema)
  const storyTasks = G.Math.buildStoryTasks({ all: true });
  assert.equal(storyTasks.length, 100, `Rechengeschichten-Pool muss exakt 100 Aufgaben haben (hat: ${storyTasks.length})`);
});
