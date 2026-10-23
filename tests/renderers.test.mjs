// =============================================================
// SCHLAUFUCHS – tests/renderers.test.mjs
// Unit- & DOM-Tests für js/renderers.js
// Prüft: Didaktisches Rechenstrich-Scaffolding, Aufgabentypen-DOM & Barrierefreiheit
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createRenderersSandbox() {
  const createMockNode = (id = 'mock-node') => {
    const attrs = new Map();
    const node = {
      id,
      innerHTML: '',
      textContent: '',
      style: {},
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      },
      getAttribute: (k) => attrs.get(k) || null,
      setAttribute: (k, v) => attrs.set(k, String(v)),
      addEventListener: () => {},
      appendChild: (c) => c,
      querySelector: (sel) => createMockNode(`sel-${sel}`),
      querySelectorAll: (sel) => [createMockNode(`sel-${sel}-0`), createMockNode(`sel-${sel}-1`)]
    };
    return node;
  };

  const sandbox = {
    window: {},
    document: {
      getElementById: (id) => createMockNode(id),
      createElement: (tag) => createMockNode(`elem-${tag}`),
      querySelectorAll: () => [],
      querySelector: () => createMockNode('root'),
      body: { appendChild: () => {} }
    },
    Math: Math
  };
  sandbox.window = sandbox;

  // Dependencies laden
  vm.runInNewContext(readFileSync('js/core/random.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/format.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/signs.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/audio.js', 'utf8'), sandbox);
  sandbox.window.Schlaufuchs.Generators = { Math: { formatAustrianNumber: (n) => String(n) } };
  vm.runInNewContext(readFileSync('js/renderers.js', 'utf8'), sandbox);

  return {
    Renderers: sandbox.window.Schlaufuchs.Renderers,
    createMockNode,
    sandbox
  };
}

test('Scaffolding: Rechenstrich-Logik zerlegt Additionen fachdidaktisch exakt (Zehnersprung)', () => {
  const { Renderers } = createRenderersSandbox();

  // Beispiel: 47 + 35 = 82
  // Didaktischer Ablauf:
  // 1. Zehner dazu: 47 + 30 = 77
  // 2. Bis zum nächsten Zehner: 77 + 3 = 80
  // 3. Rest dazu: 80 + 2 = 82
  const task = {
    type: 'equation',
    num1: '47',
    num2: '35',
    raw1: 47,
    raw2: 35,
    symbol: '+',
    answer: 82
  };

  const scaffold = Renderers.getScaffoldingData(task);
  assert.ok(scaffold, 'Scaffolding-Daten müssen erzeugt werden');
  assert.ok(scaffold.steps.length >= 2, 'Mindestens 2 didaktische Teilschritte');

  // Prüfen der Rechenschritte
  assert.equal(scaffold.steps[0], '47 + 30 = 77', 'Schritt 1: Zehner addieren (+30)');
  assert.equal(scaffold.steps[1], '77 + 3 = 80', 'Schritt 2: Zum nächsten Zehner auffüllen (+3)');
  assert.equal(scaffold.steps[2], '80 + 2 = 82', 'Schritt 3: Den Einer-Rest addieren (+2)');

  // Prüfen der visuellen Sprungpunkte auf dem Zahlenstrahl
  assert.equal(scaffold.points[0].val, 47, 'Startpunkt');
  assert.equal(scaffold.points[1].val, 77, 'Zehnersprung-Ziel');
  assert.equal(scaffold.points[1].jump, '+30');
  assert.equal(scaffold.points[2].val, 80, 'Voller Zehner');
  assert.equal(scaffold.points[2].jump, '+3');
  assert.equal(scaffold.points[3].val, 82, 'Endergebnis');
  assert.equal(scaffold.points[3].jump, '+2');
});

test('Scaffolding: Rechenstrich-Logik zerlegt Subtraktionen fachdidaktisch exakt (Zehnerrücksprung)', () => {
  const { Renderers } = createRenderersSandbox();

  // Beispiel: 82 − 35 = 47
  // 1. Zehner abziehen: 82 − 30 = 52
  // 2. Bis zum Zehner: 52 − 2 = 50
  // 3. Rest abziehen: 50 − 3 = 47
  // Auf dem Zahlenstrahl (von links nach rechts: 47, 50, 52, 82)
  const task = {
    type: 'equation',
    num1: '82',
    num2: '35',
    raw1: 82,
    raw2: 35,
    symbol: '−',
    answer: 47
  };

  const scaffold = Renderers.getScaffoldingData(task);
  assert.ok(scaffold);
  assert.equal(scaffold.steps[0], '82 − 30 = 52');
  assert.equal(scaffold.steps[1], '52 − 2 = 50');
  assert.equal(scaffold.steps[2], '50 − 3 = 47');

  // Visuelle Punkte auf dem Zahlenstrahl sind sortiert von links (klein) nach rechts (groß)
  assert.equal(scaffold.points[0].val, 47, 'Ergebnis ganz links auf dem Zahlenstrahl');
  assert.equal(scaffold.points[1].val, 50, 'Zehnergrenze');
  assert.equal(scaffold.points[1].jump, '−3');
  assert.equal(scaffold.points[2].val, 52, 'Zwischenergebnis');
  assert.equal(scaffold.points[2].jump, '−2');
  assert.equal(scaffold.points[3].val, 82, 'Startzahl ganz rechts');
  assert.equal(scaffold.points[3].jump, '−30');
});

test('Renderer: Equation-Card rendert Eingabefeld, kein type="number" und barrierefreie Attribute', () => {
  const { Renderers, createMockNode } = createRenderersSandbox();
  const card = createMockNode('card-0');

  const task = {
    type: 'equation',
    fach: 'mathe',
    schulstufe: 2,
    num1: '47',
    num2: '35',
    symbol: '+',
    answer: 82
  };

  Renderers.renderEquation(card, task, 0, () => {});

  // Barrierefreiheit & AGENTS.md Regeln
  assert.ok(card.innerHTML.includes('inputmode="numeric"'), 'Zahleneingaben müssen inputmode="numeric" tragen');
  assert.ok(!card.innerHTML.includes('type="number"'), 'AGENTS.md verbietet type="number" zugunsten von text/numeric');
  assert.ok(card.innerHTML.includes('task-equation'), 'Gleichungs-Layout muss gerendert sein');
  assert.ok(card.innerHTML.includes('class="task-op"'), 'Rechenzeichen-Span muss vorhanden sein');
  assert.ok(card.innerHTML.includes('+'), 'Plus-Zeichen muss gerendert sein');
});

test('Renderer: Montessori 20er-Feld (TwentyField) rendert Punktefeld mit Steuerung', () => {
  const { Renderers, createMockNode } = createRenderersSandbox();
  const card = createMockNode('card-twenty');

  const task = {
    type: 'twenty-field',
    fach: 'mathe',
    schulstufe: 1,
    a: 8,
    b: 4,
    placedRedCount: 0,
    answer: 12,
    question: 'Lege 4 rote Plättchen dazu. Wie viele sind es zusammen?'
  };

  Renderers.renderTwentyField(card, task, 0, () => {});
  assert.ok(card.innerHTML.includes('twenty-field-box'), '20er-Feld-Box muss im DOM sein');
  assert.ok(card.innerHTML.includes('twenty-field-row'), 'Zeilen-Container müssen gerendert werden');
  assert.ok(card.innerHTML.includes('twenty-dot-cell'), 'Punkte-Zellen müssen gerendert werden');
});

test('Renderer: Zahlenmauer (Pyramid) rendert Ziegelsteine mit data-brick-key Attributen', () => {
  const { Renderers, createMockNode } = createRenderersSandbox();
  const card = createMockNode('card-pyramid');

  const task = {
    type: 'pyramid',
    fach: 'mathe',
    schulstufe: 2,
    values: { b1: 3, b2: 4, b3: 5, m1: 7, m2: 9, peak: 16 },
    hidden: ['m1', 'm2', 'peak'],
    userAnswers: {}
  };

  Renderers.renderPyramid(card, task, 0, () => {});
  assert.ok(card.innerHTML.includes('pyramid-brick'), 'Ziegelsteine müssen gerendert werden');
  assert.ok(card.innerHTML.includes('data-brick-key="peak"'), 'Spitzenstein mit data-brick-key muss vorhanden sein');
  assert.ok(card.innerHTML.includes('pyramid-input'), 'Eingabefelder für verdeckte Steine müssen gerendert werden');
});

test('Renderer: Lesetext-Aufgabe (Reading) rendert Textabschnitt und getrennte Fragenkarten', () => {
  const { Renderers, createMockNode } = createRenderersSandbox();
  const card = createMockNode('card-reading');

  const task = {
    type: 'reading',
    fach: 'deutsch',
    schulstufe: 2,
    icon: '📖',
    title: 'Der kleine Igel im Garten',
    text: 'Im Herbst sucht der kleine Igel nach bunten Blättern.',
    questions: [
      {
        question: 'Was sucht der Igel?',
        options: ['Bunte Blätter', 'Käse', 'Ein Fahrrad'],
        correctIndex: 0,
        hint: 'Lies den ersten Satz noch einmal genau.',
        userAnswer: null
      }
    ]
  };

  Renderers.renderReading(card, task, 0, () => {});
  assert.ok(card.innerHTML.includes('reading-text-box'), 'Lesetext-Box muss gerendert werden');
  assert.ok(card.innerHTML.includes('Der kleine Igel im Garten'), 'Titel muss enthalten sein');
  assert.ok(card.innerHTML.includes('reading-question-card'), 'Fragenkarte muss gerendert werden');
});
