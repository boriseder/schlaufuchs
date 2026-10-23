// =============================================================
// SCHLAUFUCHS – js/core/topics.js
// Zentrale Themen-Registry für Online-Übungen & Arbeitsblätter
// Verbindliche Zuordnung nach österreichischem Lehrplan (BMBWF 2025)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Topics = (function () {
  'use strict';

  const TOPIC_CATALOG = [
    // --- 1. MATHEMATIK ---
    {
      id: 'math-addition',
      subject: 'math',
      title: 'Addition',
      subtitle: 'Plusrechnen im Zahlenraum 20 bis 10 000',
      grades: [1, 2, 3, 4],
      lehrplanRef: 'M-1/4-Operationen-Addition',
      archetype: 'compact-calc',
      icon: 'assets/icons/themen/math/addition.svg'
    },
    {
      id: 'math-subtraction',
      subject: 'math',
      title: 'Subtraktion',
      subtitle: 'Minusrechnen und Zehnerunterschreitung',
      grades: [1, 2, 3, 4],
      lehrplanRef: 'M-1/4-Operationen-Subtraktion',
      archetype: 'compact-calc',
      icon: 'assets/icons/themen/math/subtraktion.svg'
    },
    {
      id: 'math-multiplication',
      subject: 'math',
      title: 'Multiplikation',
      subtitle: 'Einmaleins und Kernaufgaben',
      grades: [2, 3, 4],
      lehrplanRef: 'M-2/4-Operationen-Mal',
      archetype: 'compact-calc',
      icon: 'assets/icons/themen/math/multiplikation.svg'
    },
    {
      id: 'math-division',
      subject: 'math',
      title: 'Division',
      subtitle: 'Teilen, Aufteilen und Umkehraufgaben',
      grades: [2, 3, 4],
      lehrplanRef: 'M-2/4-Operationen-Geteilt',
      archetype: 'compact-calc',
      icon: 'assets/icons/themen/math/division.svg'
    },
    {
      id: 'math-pyramid',
      subject: 'math',
      title: 'Rechentürme & Zahlenmauern',
      subtitle: 'Operative Zusammenhänge und Bausteine',
      grades: [1, 2, 3],
      lehrplanRef: 'M-1/3-Strukturen-Zahlenmauern',
      archetype: 'structure-calc',
      icon: 'assets/icons/themen/math/zahlenmauer.svg'
    },
    {
      id: 'math-time-money',
      subject: 'math',
      title: 'Uhrzeit & Geld',
      subtitle: 'Stunden, Minuten, Euro und Cent',
      grades: [2, 3],
      lehrplanRef: 'M-2/3-Groessen-Geld-Zeit',
      archetype: 'story-problem',
      icon: 'assets/icons/themen/math/uhr-geld.svg'
    },
    {
      id: 'math-million',
      subject: 'math',
      title: 'Zahlenraum bis 1 Million',
      subtitle: 'Stellenwerttafel, Runden und Vergleichen',
      grades: [4],
      lehrplanRef: 'M-4-Zahlenraum-Million',
      archetype: 'compact-calc',
      icon: 'assets/icons/themen/math/million.svg'
    },
    {
      id: 'math-units',
      subject: 'math',
      title: 'Maßeinheiten & Gewichte',
      subtitle: 'Kilogramm, Gramm, Liter, Meter und Zentimeter',
      grades: [4],
      lehrplanRef: 'M-4-Groessen-Masseinheiten',
      archetype: 'story-problem',
      icon: 'assets/icons/themen/math/einheiten.svg'
    },
    {
      id: 'math-geometry',
      subject: 'math',
      title: 'Geometrie & Flächen',
      subtitle: 'Umfang, Flächeninhalt, Rechteck und Quadrat',
      grades: [4],
      lehrplanRef: 'M-4-Geometrie-Flaechen',
      archetype: 'story-problem',
      icon: 'assets/icons/themen/math/geometrie.svg'
    },
    {
      id: 'math-written',
      subject: 'math',
      title: 'Schriftliche Rechenverfahren',
      subtitle: 'Schriftliche Addition und Subtraktion',
      grades: [3, 4],
      lehrplanRef: 'M-3/4-Operationen-Schriftlich',
      archetype: 'compact-calc',
      icon: 'assets/icons/themen/math/schriftlich.svg'
    },
    {
      id: 'math-twenty',
      subject: 'math',
      title: 'Zwanzigerfeld & Zehnerfeld',
      subtitle: 'Mengen erfassen, Kraft der Fünf und Zehner',
      grades: [1],
      lehrplanRef: 'M-1-Zahlenraum-20',
      archetype: 'structure-calc',
      icon: 'assets/icons/themen/math/zwanzigerfeld.svg'
    },
    {
      id: 'math-stories',
      subject: 'math',
      title: 'Rechengeschichten',
      subtitle: 'Sachaufgaben mit Frage, Rechnung und Antwort',
      grades: [2, 3, 4],
      lehrplanRef: 'M-2/4-Sachrechnen-Modellieren',
      archetype: 'story-problem',
      icon: 'assets/icons/themen/math/sachrechnen.svg'
    },

    // --- 2. DEUTSCH ---
    {
      id: 'german-word-types',
      subject: 'german',
      title: 'Wortarten erkennen',
      subtitle: 'Namenwörter, Tunwörter und Wiewörter',
      grades: [2, 3],
      lehrplanRef: 'D-2/3-Sprachbetrachtung-Wortarten',
      archetype: 'language-writing',
      icon: 'assets/icons/themen/german/wortarten.svg'
    },
    {
      id: 'german-capitalization',
      subject: 'german',
      title: 'Groß- und Kleinschreibung',
      subtitle: 'Satzanfänge und Namenwörter großschreiben',
      grades: [1, 2, 3],
      lehrplanRef: 'D-1/3-Rechtschreiben-Grossklein',
      archetype: 'language-writing',
      icon: 'assets/icons/themen/german/gross-klein.svg'
    },
    {
      id: 'german-scramble',
      subject: 'german',
      title: 'Schüttelsätze ordnen',
      subtitle: 'Satzglieder richtig anordnen und schreiben',
      grades: [1, 2, 3],
      lehrplanRef: 'D-1/3-Verfassen-Satzbau',
      archetype: 'language-writing',
      icon: 'assets/icons/themen/german/schuettelsatz.svg'
    },
    {
      id: 'german-tenses',
      subject: 'german',
      title: 'Zeitformen: Gegenwart & Mitvergangenheit',
      subtitle: 'Verben in die Vergangenheit setzen',
      grades: [4],
      lehrplanRef: 'D-4-Sprachbetrachtung-Zeitformen',
      archetype: 'language-writing',
      icon: 'assets/icons/themen/german/zeiten.svg'
    },
    {
      id: 'german-cases',
      subject: 'german',
      title: 'Die 4 Fälle (Kasus)',
      subtitle: 'Wer, Wessen, Wem und Wen erforschen',
      grades: [4],
      lehrplanRef: 'D-4-Sprachbetrachtung-Faelle',
      archetype: 'language-writing',
      icon: 'assets/icons/themen/german/faelle.svg'
    },
    {
      id: 'german-syllables',
      subject: 'german',
      title: 'Silben schwingen & Silbenkönige',
      subtitle: 'Silbenbögen zeichnen und Vokale krönen',
      grades: [1, 2],
      lehrplanRef: 'D-1/2-Rechtschreiben-Silben',
      archetype: 'language-writing',
      icon: 'assets/icons/themen/german/silben.svg'
    },
    {
      id: 'german-reading',
      subject: 'german',
      title: 'Lesegeschichten & Textverständnis',
      subtitle: 'Sinnerfassendes Lesen und Fragen beantworten',
      grades: [3, 4],
      lehrplanRef: 'D-3/4-Lesen-Sinnerfassung',
      archetype: 'reading-knowledge',
      icon: 'assets/icons/themen/german/lesen.svg'
    },

    // --- 3. SACHUNTERRICHT ---
    {
      id: 'general-calendar',
      subject: 'general',
      title: 'Kalender, Monate & Jahreszeiten',
      subtitle: 'Jänner bis Dezember, Tage und Zeitkreise',
      grades: [1, 2, 3],
      lehrplanRef: 'SU-1/3-Zeit-Kalender',
      archetype: 'reading-knowledge',
      icon: 'assets/icons/themen/general/kalender.svg'
    },
    {
      id: 'general-animals',
      subject: 'general',
      title: 'Tiere im Winter',
      subtitle: 'Winterschlaf, Winterruhe und Winterstarre',
      grades: [2, 3],
      lehrplanRef: 'SU-2/3-Natur-Tiere-Winter',
      archetype: 'reading-knowledge',
      icon: 'assets/icons/themen/general/igel.svg'
    },
    {
      id: 'general-traffic',
      subject: 'general',
      title: 'Sicherer Schulweg & Verkehrszeichen',
      subtitle: 'Verkehrserziehung nach österreichischer StVO',
      grades: [1, 2, 3],
      lehrplanRef: 'SU-1/3-Gemeinschaft-Verkehr',
      archetype: 'reading-knowledge',
      icon: 'assets/icons/themen/general/verkehr.svg'
    },
    {
      id: 'general-austria',
      subject: 'general',
      title: 'Österreich: Bundesländer & Hauptstädte',
      subtitle: 'Geografie, 9 Bundesländer und Landeshauptstädte',
      grades: [4],
      lehrplanRef: 'SU-4-Raum-Oesterreich',
      archetype: 'reading-knowledge',
      icon: 'assets/icons/themen/general/oesterreich.svg'
    },
    {
      id: 'general-bike-test',
      subject: 'general',
      title: 'Freiwillige Radfahrprüfung',
      subtitle: 'Vorrangregeln, Ausrüstung und StVO-Wissen',
      grades: [4],
      lehrplanRef: 'SU-4-Gemeinschaft-Radfahrpruefung',
      archetype: 'reading-knowledge',
      icon: 'assets/icons/themen/general/fahrrad.svg'
    },

    // --- 4. GEHIRNTRAINING ---
    {
      id: 'brain-memory',
      subject: 'brain',
      title: 'Tier- & Bilder-Memory (Ausschneidebogen)',
      subtitle: 'Gedächtnis, Konzentration und Partnerarbeit',
      grades: [1, 2, 3, 4],
      lehrplanRef: 'GT-1/4-Gedaechtnis-Memory',
      archetype: 'craft-sheet',
      icon: 'assets/icons/themen/brain/memory.svg'
    },
    {
      id: 'brain-sequence',
      subject: 'brain',
      title: 'Zahlenreihen & Rechenketten',
      subtitle: 'Logische Muster und Gesetzmäßigkeiten',
      grades: [1, 2, 3, 4],
      lehrplanRef: 'GT-1/4-Logik-Zahlenreihen',
      archetype: 'structure-calc',
      icon: 'assets/icons/themen/brain/folge.svg'
    },
    {
      id: 'brain-pattern',
      subject: 'brain',
      title: 'Muster-Meister & Matrizen',
      subtitle: 'Formen kombinieren und Reihen fortsetzen',
      grades: [1, 2, 3, 4],
      lehrplanRef: 'GT-1/4-Logik-Muster',
      archetype: 'structure-calc',
      icon: 'assets/icons/themen/brain/muster.svg'
    }
  ];

  function getAllTopics() {
    return [...TOPIC_CATALOG];
  }

  function getTopicById(id) {
    return TOPIC_CATALOG.find(t => t.id === id) || null;
  }

  function getTopicsBySubject(subject) {
    if (!subject || subject === 'all') return getAllTopics();
    return TOPIC_CATALOG.filter(t => t.subject === subject);
  }

  function getTopicsByGrade(grade) {
    if (!grade || grade === 'all') return getAllTopics();
    const g = parseInt(grade, 10);
    return TOPIC_CATALOG.filter(t => t.grades.includes(g));
  }

  function getSubjectLabel(subject) {
    switch (subject) {
      case 'math': return 'Mathematik';
      case 'german': return 'Deutsch';
      case 'general': return 'Sachunterricht';
      case 'brain': return 'Gehirntraining';
      default: return 'Allgemein';
    }
  }

  function getArchetypeLabel(archetype) {
    switch (archetype) {
      case 'compact-calc': return '12 Aufgaben (2 Spalten)';
      case 'structure-calc': return 'Struktur- & Rechentürme';
      case 'story-problem': return 'Sachaufgaben (F-R-A)';
      case 'language-writing': return 'Sprache (4-Linien-System)';
      case 'reading-knowledge': return 'Lesetext & Fragen';
      case 'craft-sheet': return 'Ausschneide-Bastelbogen';
      default: return 'Standard';
    }
  }

  return {
    getAllTopics: getAllTopics,
    getTopicById: getTopicById,
    getTopicsBySubject: getTopicsBySubject,
    getTopicsByGrade: getTopicsByGrade,
    getSubjectLabel: getSubjectLabel,
    getArchetypeLabel: getArchetypeLabel
  };
})();
