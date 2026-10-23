// =============================================================
// SCHLAUFUCHS – tests/admin-qa.test.mjs
// Test für die Admin-Qualitätssicherungs-Engine (admin-qa.js)
// Stellt sicher, dass für ausnahmslos ALLE 28 Themengebiete
// vollständige Fragen und Antworten abrufbar sind.
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createAdminQASandbox() {
  const sandbox = {
    window: {},
    Math: Math,
    console: console
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/core/random.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/format.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/topics.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/clock.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/signs.js', 'utf8'), sandbox);
  vm.runInNewContext(`window.Schlaufuchs.State = { getActiveGrades: () => [1, 2, 3, 4] };`, sandbox);
  vm.runInNewContext(readFileSync('js/generators/math.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/german.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/general.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/brain.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/admin-qa.js', 'utf8'), sandbox);

  return sandbox.window.Schlaufuchs.AdminQA;
}

test('AdminQA: Deckt alle 28 Lehrplan-Themen lückenlos ab', () => {
  const QA = createAdminQASandbox();
  const topics = QA.getAllTopics();

  assert.equal(topics.length, 28, 'Es müssen genau 28 Themen im Katalog registriert sein');

  for (const topic of topics) {
    const questions = QA.getAllQuestionsForTopic(topic.id);
    assert.ok(Array.isArray(questions), `Thema ${topic.id} muss ein Array liefern`);
    assert.ok(questions.length > 0, `Thema ${topic.id} muss mindestens eine Frage liefern (hat: ${questions.length})`);

    questions.forEach((q, idx) => {
      assert.ok(q.questionText && q.questionText.length > 0, `${topic.id} #${idx} Frage fehlt`);
      assert.ok(q.correctAnswer && q.correctAnswer.length > 0, `${topic.id} #${idx} Antwort fehlt`);
      assert.ok([1, 2, 3, 4].includes(q.schulstufe), `${topic.id} #${idx} Ungültige Schulstufe: ${q.schulstufe}`);
      assert.ok(q.lehrplanRef && q.lehrplanRef.length > 0, `${topic.id} #${idx} Lehrplan-Ref fehlt`);

      if (q.options && Array.isArray(q.options)) {
        const hasCorrect = q.options.some(opt => opt.isCorrect === true);
        assert.ok(hasCorrect, `${topic.id} #${idx} Multiple Choice muss mindestens 1 korrekte Option haben`);
      }
    });
  }
});

test('AdminQA: Filterung nach Schulstufe und Textsuche funktioniert exakt', () => {
  const QA = createAdminQASandbox();
  const allTraffic = QA.getAllQuestionsForTopic('general-traffic');
  assert.ok(allTraffic.length >= 10, 'Sicherer Schulweg muss großen Fragenpool liefern');

  // Filterung nach Schulstufe 1
  const grade1Traffic = QA.filterQuestions(allTraffic, { grade: '1' });
  grade1Traffic.forEach(q => assert.equal(q.schulstufe, 1));

  // Suche nach Begriff
  const searchResults = QA.filterQuestions(allTraffic, { query: 'Schutzweg' });
  assert.ok(searchResults.length > 0, 'Suche nach Schutzweg muss Treffer liefern');
  searchResults.forEach(q => {
    const textMatch = q.questionText.toLowerCase().includes('schutzweg') ||
                      q.correctAnswer.toLowerCase().includes('schutzweg') ||
                      q.hint.toLowerCase().includes('schutzweg');
    assert.ok(textMatch, 'Suchbegriff muss in Frage, Antwort oder Tipp vorkommen');
  });
});
