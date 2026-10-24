// =============================================================
// SCHLAUFUCHS – js/generators/index.js
// Single Source of Truth (SSOT) Dispatcher für Aufgaben-Generierung
// BMBWF Lehrplan Volksschule Österreich (BGBl. II Nr. 178/2025)
// Zentrale Schnittstelle für Online-Fokusmodus & A4-Arbeitsblatt-Druck
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

(function (S) {
  'use strict';

  function getTasksForTopic(topicId, options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { grade: options };
    const MathGen = S.Generators.Math;
    const GermanGen = S.Generators.German;
    const GeneralGen = S.Generators.General;
    const BrainGen = S.Generators.Brain;

    switch (topicId) {
      // 1. MATHEMATIK
      case 'math-addition':
        return MathGen ? MathGen.buildAdditionTasks(opts) : [];
      case 'math-subtraction':
        return MathGen ? MathGen.buildSubtractionTasks(opts) : [];
      case 'math-multiplication':
        return MathGen ? MathGen.buildMultiplicationTasks(opts) : [];
      case 'math-division':
        return MathGen ? MathGen.buildDivisionTasks(opts) : [];
      case 'math-pyramid':
        return MathGen ? MathGen.buildPyramidTasks(opts) : [];
      case 'math-clock':
      case 'math-time-money':
        return MathGen ? MathGen.buildClockTasks(opts) : [];
      case 'math-money':
        return MathGen ? MathGen.buildMoneyTasks(opts) : [];
      case 'math-million':
        return MathGen ? MathGen.buildMillionTasks(opts) : [];
      case 'math-units':
        return MathGen ? MathGen.buildUnitsTasks(opts) : [];
      case 'math-geometry':
        return MathGen ? MathGen.buildGeometryTasks(opts) : [];
      case 'math-stories':
      case 'math-story':
        return MathGen ? MathGen.buildStoryTasks(opts) : [];
      case 'math-twenty':
        return MathGen ? MathGen.buildTwentyFieldTasks(opts) : [];
      case 'math-written':
        return MathGen ? MathGen.buildWrittenMathTasks(opts) : [];

      // 2. DEUTSCH
      case 'german-word-types':
        return GermanGen ? GermanGen.buildWordTypesTasks(opts) : [];
      case 'german-capitalization':
        return GermanGen ? GermanGen.buildCapitalizationTasks(opts) : [];
      case 'german-scramble':
        return GermanGen ? GermanGen.buildScrambleTasks(opts) : [];
      case 'german-cases':
        return GermanGen ? GermanGen.buildCasesTasks(opts) : [];
      case 'german-tenses':
        return GermanGen ? GermanGen.buildTensesTasks(opts) : [];
      case 'german-syllables':
        return GermanGen ? GermanGen.buildSyllableTasks(opts) : [];
      case 'german-reading':
        return GermanGen ? GermanGen.buildReadingTasks(opts) : [];

      // 3. SACHUNTERRICHT
      case 'general-calendar':
        return GeneralGen ? GeneralGen.buildCalendarTasks(opts) : [];
      case 'general-animals':
      case 'general-winter':
        return GeneralGen ? GeneralGen.buildWinterTasks(opts) : [];
      case 'general-traffic':
        return GeneralGen ? GeneralGen.buildSchoolWalkTasks(opts) : [];
      case 'general-austria':
        return GeneralGen ? GeneralGen.buildAustriaTasks(opts) : [];
      case 'general-bike-test':
        return GeneralGen ? GeneralGen.buildTrafficTasks(opts) : [];

      // 4. GEHIRNTRAINING
      case 'brain-memory':
        return BrainGen ? BrainGen.buildMemoryTasks(opts) : [];
      case 'brain-pattern':
      case 'brain-patterns':
        return BrainGen ? BrainGen.buildPatternsTasks(opts) : [];
      case 'brain-sequence':
        return BrainGen ? BrainGen.buildSequenceTasks(opts) : [];

      default:
        throw new Error(`Unbekanntes Lehrplanthema: ${topicId}`);
    }
  }

  S.Generators.getTasksForTopic = getTasksForTopic;
})(window.Schlaufuchs);
