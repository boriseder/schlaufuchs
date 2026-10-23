// =============================================================
// SCHLAUFUCHS – tests/worksheets.test.mjs
// Unit- & Integrations-Tests für das Arbeitsblätter-Zentrum (js/worksheets.js)
// Prüft echtes Laufzeitverhalten: Filter-Klicks, Zähler, Sammeldruck-Grade-Integrität
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createWorksheetsSandbox() {
  const domElements = new Map();
  const listenersMap = new Map();

  const getOrCreate = (id) => {
    if (!domElements.has(id)) {
      const attrs = new Map();
      const elem = {
        id,
        classList: {
          _classes: new Set(),
          add(c) { this._classes.add(c); },
          remove(c) { this._classes.delete(c); },
          contains(c) { return this._classes.has(c); }
        },
        style: {},
        innerHTML: '',
        textContent: '',
        value: '',
        checked: false,
        getAttribute: (k) => attrs.get(k) || null,
        setAttribute: (k, v) => attrs.set(k, String(v)),
        querySelectorAll: () => [],
        querySelector: (sel) => {
          if (sel === 'span') return getOrCreate(`${id}-span`);
          return null;
        },
        addEventListener: (event, fn) => {
          if (!listenersMap.has(id)) listenersMap.set(id, new Map());
          const events = listenersMap.get(id);
          if (!events.has(event)) events.set(event, []);
          events.get(event).push(fn);
        },
        click: () => {
          const events = listenersMap.get(id);
          if (events && events.has('click')) {
            events.get('click').forEach(fn => fn({ target: elem }));
          }
        }
      };
      domElements.set(id, elem);
    }
    return domElements.get(id);
  };

  // Vorbereiten der Filter-Buttons
  const gradeAllBtn = getOrCreate('btn-grade-all');
  gradeAllBtn.setAttribute('data-grade', 'all');

  const gradeBtns = [1, 2, 3, 4].map(g => {
    const btn = getOrCreate(`btn-grade-${g}`);
    btn.setAttribute('data-grade', String(g));
    return btn;
  });

  const subjAllBtn = getOrCreate('btn-subj-all');
  subjAllBtn.setAttribute('data-subject', 'all');

  const subjBtns = ['mathe', 'deutsch', 'sachunterricht'].map(s => {
    const btn = getOrCreate(`btn-subj-${s}`);
    btn.setAttribute('data-subject', s);
    return btn;
  });

  const sandbox = {
    window: {},
    document: {
      getElementById: (id) => getOrCreate(id),
      querySelectorAll: (sel) => {
        if (sel === '.filter-btn-ws') return [gradeAllBtn, ...gradeBtns];
        if (sel === '.filter-subj-ws') return [subjAllBtn, ...subjBtns];
        return [];
      },
      querySelector: () => null,
      createElement: () => ({ classList: { add: () => {}, remove: () => {} }, style: {}, appendChild: () => {} }),
      body: { classList: { add: () => {}, remove: () => {} } }
    },
    Math: Math
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/core/storage.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/topics.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/state.js', 'utf8'), sandbox);

  // Mock Print-Modul mit Aufrufbeobachtung
  let lastBatchCall = null;
  let lastPreviewCall = null;
  sandbox.window.Schlaufuchs.Print = {
    printBatchWorksheets: (topics, grade) => {
      lastBatchCall = { topics, grade };
    },
    previewTopicWorksheet: (topicId, grade) => {
      lastPreviewCall = { topicId, grade };
    }
  };

  vm.runInNewContext(readFileSync('js/worksheets.js', 'utf8'), sandbox);

  return {
    Worksheets: sandbox.window.Schlaufuchs.Worksheets,
    Topics: sandbox.window.Schlaufuchs.Topics,
    getLastBatchCall: () => lastBatchCall,
    getLastPreviewCall: () => lastPreviewCall,
    getElem: (id) => getOrCreate(id),
    gradeAllBtn,
    gradeBtns,
    subjBtns
  };
}

test('Worksheets: Modul existiert und initialisiert Event-Handling fehlerfrei', () => {
  const { Worksheets, getElem } = createWorksheetsSandbox();
  assert.ok(Worksheets, 'Worksheets-Modul muss vorhanden sein');
  assert.equal(typeof Worksheets.renderWorksheets, 'function');
  assert.equal(typeof Worksheets.showWorksheetsView, 'function');

  // init ausführen
  Worksheets.init();

  const countEl = getElem('worksheets-count');
  assert.ok(countEl.textContent.includes('Arbeitsblätter'), 'Zähler muss initialisiert werden');
  assert.equal(countEl.textContent, '27 Arbeitsblätter', 'Standardmäßig alle 27 Blätter angezeigt');

  const container = getElem('worksheets-cards-container');
  assert.ok(container.innerHTML.includes('worksheet-card'), 'Karten müssen gerendert sein');
});

test('Worksheets: Schulstufen-Filter selektiert stufenrein und aktualisiert Zähler', () => {
  const { Worksheets, gradeBtns, getElem } = createWorksheetsSandbox();
  Worksheets.init();

  // Klick auf Stufe 1 Filter-Button
  gradeBtns[0].click(); // index 0 ist data-grade="1"

  const countEl = getElem('worksheets-count');
  assert.ok(countEl.textContent.includes('Arbeitsblätter'));
  const container = getElem('worksheets-cards-container');
  assert.ok(container.innerHTML.includes('data-grade="1"'));
  assert.ok(!container.innerHTML.includes('data-topic-id="math-million"'), 'Zahlenraum Million darf in Stufe 1 nicht vorkommen');

  // Klick auf Stufe 4 Filter-Button
  gradeBtns[3].click(); // index 3 ist data-grade="4"
  assert.ok(container.innerHTML.includes('data-topic-id="math-million"'), 'Zahlenraum Million muss in Stufe 4 vorhanden sein');
  assert.ok(container.innerHTML.includes('data-grade="4"'));
});

test('Worksheets: Verhaltensprüfung beim Sammeldruck (echter Klick-Flow)', () => {
  const { Worksheets, gradeAllBtn, gradeBtns, getElem, getLastBatchCall } = createWorksheetsSandbox();
  Worksheets.init();

  const batchBtn = getElem('btn-batch-print');

  // 1. Klick bei "Alle Schulstufen" -> targetGrade muss zwingend null sein!
  gradeAllBtn.click();
  batchBtn.click();
  const callAll = getLastBatchCall();
  assert.ok(callAll, 'Sammeldruck-Methode muss aufgerufen worden sein');
  assert.equal(callAll.grade, null, 'Bei "all" darf kein festes Grade übergeben werden (muss null sein)');
  assert.equal(callAll.topics.length, 27, 'Alle 27 Themen müssen übergeben werden');

  // 2. Klick bei "2. Klasse" -> targetGrade muss 2 sein und nur Stufe-2-kompatible Themen enthalten
  gradeBtns[1].click(); // Stufe 2
  batchBtn.click();
  const callGrade2 = getLastBatchCall();
  assert.ok(callGrade2);
  assert.equal(callGrade2.grade, 2, 'Bei Stufe 2 muss grade 2 übergeben werden');
  assert.ok(callGrade2.topics.every(t => t.grades.includes(2)), 'Alle gedruckten Blätter müssen für Stufe 2 zugelassen sein');
  assert.ok(!callGrade2.topics.some(t => t.id === 'math-million'), 'math-million darf im Stufe-2-Sammeldruck nicht existieren');
});
