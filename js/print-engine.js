// =============================================================
// SCHLAUFUCHS – js/print-engine.js
// Worksheet-Adapter & Decorator für A4-Druck (Schulbuch-Look)
// BMBWF Lehrplan Volksschule Österreich (BGBl. II Nr. 178/2025)
// Delegiert an SSOT Generatoren (js/generators/index.js),
// verwaltet Inter-Sheet Varianz-Tracking & Geheimwort-Bijektion
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.PrintEngine = (function () {
  'use strict';

  // --- 1. DEDUPLIZIERUNG & HOCHVARIANZ-TRACKER ---
  class TaskVarianceTracker {
    constructor() {
      this.recentSignatures = new Set();
      this.maxHistory = 200;
    }

    has(sig) {
      return this.recentSignatures.has(sig);
    }

    add(sig) {
      this.recentSignatures.add(sig);
      if (this.recentSignatures.size > this.maxHistory) {
        const first = this.recentSignatures.values().next().value;
        this.recentSignatures.delete(first);
      }
    }

    clear() {
      this.recentSignatures.clear();
    }
  }

  const tracker = new TaskVarianceTracker();

  // Zufallshelfer
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Liste kindgerechter österreichischer Geheimwörter für die Schatzkiste nach Wortlänge
  const SECRET_WORDS_BY_LENGTH = {
    3: ['UHU', 'MUT', 'BÄR', 'ROT', 'AST', 'SEE', 'TAG'],
    4: ['WALD', 'IGEL', 'EULE', 'BERG', 'HERZ', 'WOLF', 'BAUM', 'LUFT', 'GOLD', 'BLAU', 'HAUS', 'MAUS'],
    5: ['FUCHS', 'STERN', 'WIESE', 'BLUME', 'SONNE', 'BIBER', 'TAFEL', 'VOGEL', 'KOBEL'],
    6: ['SCHLAU', 'WINTER', 'SOMMER', 'SCHNEE', 'HERBST', 'SCHULE', 'RAKETE', 'BÜCHER', 'FREUND', 'PAPIER', 'LEHRER', 'WISSEN'],
    7: ['FREUNDE', 'ZEICHEN', 'MEISTER', 'STERNEN', 'DRACHEN', 'KOBOLDE'],
    8: ['FUCHSBAU', 'SCHLAUER', 'WALDKAUZ', 'TAUSENDE', 'KÖNIGIN', 'LESEFEST', 'SCHULHOF'],
    12: ['RECHENKÖNIGE', 'ZAHLENZAUBER', 'WINTERZAUBER', 'SCHATZSUCHER', 'MEISTERSTERN', 'BÜCHERSCHATZ']
  };

  function pickSecretWord(preferredLength) {
    const len = preferredLength || 5;
    const list = SECRET_WORDS_BY_LENGTH[len] || (len >= 12 ? SECRET_WORDS_BY_LENGTH[12] : (len > 8 ? SECRET_WORDS_BY_LENGTH[8] : SECRET_WORDS_BY_LENGTH[5]));
    let word = list[rand(0, list.length - 1)];
    if (!word || (preferredLength && word.length !== preferredLength && SECRET_WORDS_BY_LENGTH[preferredLength])) {
      word = SECRET_WORDS_BY_LENGTH[preferredLength][0];
    }
    // Im Storage für die Schatzkiste im Sticker-Album registrieren
    try {
      if (window.Schlaufuchs && window.Schlaufuchs.Storage) {
        const existing = window.Schlaufuchs.Storage.lesen('valid_secret_words') || [];
        if (!existing.includes(word)) {
          existing.push(word);
          window.Schlaufuchs.Storage.schreiben('valid_secret_words', existing.slice(-30));
        }
      }
    } catch (e) {}
    return word;
  }

  // =============================================================
  // 2. HAUPT-DISPATCHER FÜR DIE WORKSHEET-ENGINE (SSOT)
  // =============================================================

  function generateWorksheetTasks(topicId, targetGrade) {
    const Topics = window.Schlaufuchs.Topics;
    const meta = Topics ? Topics.getTopicById(topicId) : null;
    let grade = targetGrade || (meta && meta.grades ? meta.grades[0] : 2);
    if (meta && meta.grades && meta.grades.length > 0) {
      if (!meta.grades.includes(grade)) {
        if (grade < meta.grades[0]) grade = meta.grades[0];
        else if (grade > meta.grades[meta.grades.length - 1]) grade = meta.grades[meta.grades.length - 1];
        else grade = meta.grades[0];
      }
    }
    const archetype = meta ? meta.archetype : 'compact-calc';

    // Bestimme die didaktisch sinnvolle Aufgabenanzahl für die A4-Druckseite
    let targetCount = 12;
    if (topicId === 'math-written') {
      targetCount = 6;
    } else if (archetype === 'structure-calc') {
      targetCount = (topicId === 'brain-sequence') ? 6 : 4;
    } else if (archetype === 'clock') {
      targetCount = 6;
    } else if (archetype === 'story-problem') {
      targetCount = 3;
    } else if (archetype === 'language-writing') {
      targetCount = 4;
    } else if (archetype === 'reading-knowledge') {
      targetCount = (topicId === 'german-reading') ? 1 : 4;
    } else if (archetype === 'craft-sheet') {
      targetCount = 1;
    }

    // SSOT: Aufgaben zentral über window.Schlaufuchs.Generators generieren
    const Generators = window.Schlaufuchs.Generators;
    let tasks = [];
    const genOpts = {
      grade: grade,
      count: targetCount,
      injective: true,
      forPrint: true,
      tracker: tracker
    };

    if (Generators) {
      if (typeof Generators.getTasksForTopic === 'function') {
        tasks = Generators.getTasksForTopic(topicId, genOpts);
      } else if (Generators.Math && topicId.startsWith('math-')) {
        // Robuster Fallback, falls nur math.js im Kontext geladen ist
        if (topicId === 'math-clock') tasks = Generators.Math.buildClockTasks(genOpts);
        else if (topicId === 'math-addition') tasks = Generators.Math.buildAdditionTasks(genOpts);
        else if (topicId === 'math-subtraction') tasks = Generators.Math.buildSubtractionTasks(genOpts);
        else if (topicId === 'math-multiplication') tasks = Generators.Math.buildMultiplicationTasks(genOpts);
        else if (topicId === 'math-division') tasks = Generators.Math.buildDivisionTasks(genOpts);
        else if (topicId === 'math-pyramid') tasks = Generators.Math.buildPyramidTasks(genOpts);
        else if (topicId === 'math-written') tasks = Generators.Math.buildWrittenMathTasks(genOpts);
        else if (topicId === 'math-money') tasks = Generators.Math.buildMoneyTasks(genOpts);
        else if (topicId === 'math-million') tasks = Generators.Math.buildMillionTasks(genOpts);
        else if (topicId === 'math-units') tasks = Generators.Math.buildUnitsTasks(genOpts);
        else if (topicId === 'math-geometry') tasks = Generators.Math.buildGeometryTasks(genOpts);
        else if (topicId === 'math-stories') tasks = Generators.Math.buildStoryTasks(genOpts);
        else if (topicId === 'math-twenty') tasks = Generators.Math.buildTwentyFieldTasks(genOpts);
      }
    }

    if (!tasks || tasks.length === 0) return [];

    // Geheimwort-Bijektion für den Knick-Lösungsstreifen
    let effCount = tasks.length;
    if (tasks.length === 1 && tasks[0].type === 'reading' && tasks[0].questions) {
      effCount = tasks[0].questions.length;
    }
    const secretWord = pickSecretWord(effCount);

    // Aufgaben mit Schulstufen-Metadaten & Lösungsbuchstaben dekorieren
    tasks.forEach((t, i) => {
      if (!t.schulstufe) t.schulstufe = grade;
      if (!t.lehrplanRef && meta) t.lehrplanRef = meta.lehrplanRef;
      t.secretLetter = secretWord[i] || '';
    });

    return tasks;
  }

  return {
    generateWorksheetTasks: generateWorksheetTasks,
    pickSecretWord: pickSecretWord,
    tracker: tracker
  };
})();
