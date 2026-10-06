// =============================================================
// SCHLAUFUCHS – js/generators/brain.js
// Gehirntraining-Generatoren: Tier-Memory (ohne Rechnungen!),
// algorithmisch erzeugte Musterfolgen & Zahlenreihen
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.Brain = (function () {
  'use strict';

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getEffectiveGrades(allowedTopicGrades) {
    if (window.Schlaufuchs && window.Schlaufuchs.State && window.Schlaufuchs.State.getActiveGrades) {
      const active = window.Schlaufuchs.State.getActiveGrades();
      const filtered = allowedTopicGrades.filter(g => active.includes(g));
      if (filtered.length > 0) return filtered;
    }
    return allowedTopicGrades;
  }

  // 1. TIER- & NATUR-MEMORY (Garantiert KEINE Rechnungen, 4 wechselnde Themensets)
  // Adaptiv: 4 Paare (8 Karten) für 1.–2. Klasse, 6 Paare (12 Karten) für 3.–4. Klasse
  function buildMemoryTasks() {
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const maxGrade = Math.max(...grades);
    const numPairs = maxGrade <= 2 ? 4 : 6;

    const themeSets = [
      // Set 1: Heimische Waldtiere
      [
        { id: 1, label: '🦊', name: 'Fuchs' },
        { id: 2, label: '🐰', name: 'Hase' },
        { id: 3, label: '🐻', name: 'Bär' },
        { id: 4, label: '🦔', name: 'Igel' },
        { id: 5, label: '🦉', name: 'Eule' },
        { id: 6, label: '🐿️', name: 'Eichhörnchen' }
      ],
      // Set 2: Spannende Wildtiere
      [
        { id: 1, label: '🦁', name: 'Löwe' },
        { id: 2, label: '🐼', name: 'Panda' },
        { id: 3, label: '🐨', name: 'Koala' },
        { id: 4, label: '🐯', name: 'Tiger' },
        { id: 5, label: '🐘', name: 'Elefant' },
        { id: 6, label: '🦒', name: 'Giraffe' }
      ],
      // Set 3: Natur & Früchte
      [
        { id: 1, label: '🍎', name: 'Apfel' },
        { id: 2, label: '🍓', name: 'Erdbeere' },
        { id: 3, label: '🥕', name: 'Karotte' },
        { id: 4, label: '🌻', name: 'Sonnenblume' },
        { id: 5, label: '🌲', name: 'Tanne' },
        { id: 6, label: '🍄', name: 'Glückspilz' }
      ],
      // Set 4: Wiese & Wasser
      [
        { id: 1, label: '🐸', name: 'Frosch' },
        { id: 2, label: '🦋', name: 'Schmetterling' },
        { id: 3, label: '🐝', name: 'Biene' },
        { id: 4, label: '🐞', name: 'Marienkäfer' },
        { id: 5, label: '🦆', name: 'Ente' },
        { id: 6, label: '🐟', name: 'Fisch' }
      ]
    ];

    // Zufälliges Themenset auswählen und auf Paar-Anzahl beschränken
    const fullSet = themeSets[rand(0, themeSets.length - 1)];
    const chosenSet = fullSet.slice(0, numPairs);

    // Jedes Tier verdoppeln
    const cards = [];
    chosenSet.forEach(item => {
      cards.push({ pairId: item.id, content: item.label, subtitle: item.name, isFlipped: false, isMatched: false });
      cards.push({ pairId: item.id, content: item.label, subtitle: item.name, isFlipped: false, isMatched: false });
    });

    return [
      {
        fach: 'denken',
        schulstufe: maxGrade,
        grade: maxGrade,
        lehrplanRef: 'B-Wahrnehmung',
        type: 'memory',
        totalPairs: numPairs,
        matchedPairsCount: 0,
        cards: shuffle(cards),
        flippedIndices: [],
        isLocked: false,
        isCorrect: null,
      }
    ];
  }

  // 2. MUSTERFOLGEN & LOGIKREIHEN (Hohe mathematische & visuelle Varianz, 5 Aufgaben)
  function buildPatternsTasks() {
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const isGrade1Only = grades.length === 1 && grades[0] === 1;
    const effectiveGrade = isGrade1Only ? 1 : Math.max(...grades);
    const tasks = [];

    if (isGrade1Only) {
      // 1. Klasse: Einfache Zahlenreihen (+1 oder +2) bis 20 (Keine Multiplikation!)
      const step1 = rand(1, 2);
      const start1 = rand(1, 8);
      const seq1 = [start1, start1 + step1, start1 + 2 * step1, start1 + 3 * step1, start1 + 4 * step1];
      const targetVal1 = seq1[4];

      tasks.push({
        fach: 'denken',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zahlenfolge fortsetzen:',
        displaySequence: [seq1[0], seq1[1], seq1[2], seq1[3], '❓'],
        options: shuffle([targetVal1, targetVal1 + step1, targetVal1 - 1, targetVal1 + 2]),
        targetAnswer: targetVal1.toString(),
        hint: '💡 Vergleiche die ersten Zahlen: Um wie viel wird jede Zahl größer?',
        userAnswer: null,
        isCorrect: null,
      });

      // 1. Klasse Aufgabe 2: Zählen in 2er- oder 5er-Schritten
      const step2 = Math.random() > 0.5 ? 2 : 5;
      const start2 = step2;
      const seq2 = [start2, start2 + step2, start2 + 2 * step2, start2 + 3 * step2, start2 + 4 * step2];
      const targetVal2 = seq2[4];

      tasks.push({
        fach: 'denken',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zähle weiter:',
        displaySequence: [seq2[0], seq2[1], seq2[2], seq2[3], '❓'],
        options: shuffle([targetVal2, targetVal2 + step2, Math.max(1, targetVal2 - step2), targetVal2 + 1]),
        targetAnswer: targetVal2.toString(),
        hint: '💡 Achte auf den regelmäßigen Sprung von einer Zahl zur nächsten.',
        userAnswer: null,
        isCorrect: null,
      });

      // 1. Klasse Aufgabe 3: Rückwärts zählen (-1)
      const start3 = rand(6, 15);
      const seq3 = [start3, start3 - 1, start3 - 2, start3 - 3, start3 - 4];
      const targetVal3 = seq3[4];

      tasks.push({
        fach: 'denken',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Rückwärts zählen:',
        displaySequence: [seq3[0], seq3[1], seq3[2], seq3[3], '❓'],
        options: shuffle([targetVal3, targetVal3 + 1, Math.max(1, targetVal3 - 1), targetVal3 + 2]),
        targetAnswer: targetVal3.toString(),
        hint: '💡 Hier zählen die Zahlen rückwärts!',
        userAnswer: null,
        isCorrect: null,
      });
    } else {
      // 2.–4. Klasse: Arithmetische Zahlenfolge (+2, +3, +4, +5 oder -3, -4)
      const step1 = rand(2, 6);
      const start1 = rand(2, 15);
      const seq1 = [start1, start1 + step1, start1 + 2 * step1, start1 + 3 * step1, start1 + 4 * step1];
      const targetVal1 = seq1[4];

      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zahlenfolge fortsetzen:',
        displaySequence: [seq1[0], seq1[1], seq1[2], seq1[3], '❓'],
        options: shuffle([targetVal1, targetVal1 + step1, targetVal1 - 1, targetVal1 + 2]),
        targetAnswer: targetVal1.toString(),
        hint: '💡 Um wie viel wächst die Zahlenreihe von Schritt zu Schritt?',
        userAnswer: null,
        isCorrect: null,
      });

      // Aufgabe 2: Verdoppeln oder Mal-Reihe
      const base = rand(2, 4);
      const multSeq = [base, base * 2, base * 4, base * 8];
      const targetMult = base * 16;
      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Verdoppeln:',
        displaySequence: [multSeq[0], multSeq[1], multSeq[2], multSeq[3], '❓'],
        options: shuffle([targetMult, targetMult - base, targetMult + 4, Math.max(1, targetMult - 4)]),
        targetAnswer: targetMult.toString(),
        hint: '💡 Wie verändert sich jede Zahl? Vergleiche die Zahl mit ihrer Vorgängerin.',
        userAnswer: null,
        isCorrect: null,
      });

      // Aufgabe 3: Rückwärtsfolge (-2, -3, -5)
      const step3 = rand(2, 5);
      const start3 = rand(25, 60);
      const seq3 = [start3, start3 - step3, start3 - 2 * step3, start3 - 3 * step3, start3 - 4 * step3];
      const targetVal3 = seq3[4];
      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zahlenfolge rückwärts:',
        displaySequence: [seq3[0], seq3[1], seq3[2], seq3[3], '❓'],
        options: shuffle([targetVal3, targetVal3 + step3, targetVal3 - step3, targetVal3 + 1]),
        targetAnswer: targetVal3.toString(),
        hint: '💡 Die Zahlen werden immer um dieselbe Zahl kleiner.',
        userAnswer: null,
        isCorrect: null,
      });
    }

    // Aufgabe 4 & 5: Bunte Symbol-Musterfolgen
    const symbolSets = [
      ['⭐', '🌙', '⭐', '🌙', '⭐', '❓', '🌙', ['🌙', '⭐', '☀️', '☁️']],
      ['🔴', '🔵', '🟢', '🔴', '🔵', '❓', '🟢', ['🟢', '🔴', '🔵', '🟡']],
      ['🍎', '🍌', '🍎', '🍌', '🍎', '❓', '🍌', ['🍌', '🍎', '🍇', '🍓']],
      ['🔺', '🟦', '🔺', '🟦', '🔺', '❓', '🟦', ['🟦', '🔺', '🟡', '🟩']],
      ['🐱', '🐶', '🐭', '🐱', '🐶', '❓', '🐭', ['🐭', '🐱', '🐶', '🦊']],
      ['🌸', '🌻', '🌸', '🌻', '🌸', '❓', '🌻', ['🌻', '🌸', '🌷', '🌹']]
    ];

    const chosenSymbols = shuffle(symbolSets).slice(0, 2);
    chosenSymbols.forEach(chosenSymbol => {
      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Musterreihe ergänzen:',
        displaySequence: chosenSymbol.slice(0, 6),
        options: shuffle(chosenSymbol[7]),
        targetAnswer: chosenSymbol[6],
        hint: '💡 Schau dir an, welche Symbole sich regelmäßig wiederholen.',
        userAnswer: null,
        isCorrect: null,
      });
    });

    return tasks;
  }

  // 3. REIHENFOLGE SORTIEREN (Merkspiel: Zahlen von klein nach groß)
  // Stufengerecht: 1. Kl <= 20, 2. Kl <= 100, 3. Kl <= 1 000, 4. Kl <= 1 000 000
  function buildSequenceTasks() {
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const maxGrade = Math.max(...grades);
    const nums = [];

    let minVal = 1;
    let maxVal = 20;

    if (maxGrade === 1) {
      minVal = 1;
      maxVal = 20;
    } else if (maxGrade === 2) {
      minVal = 5;
      maxVal = 99;
    } else if (maxGrade === 3) {
      minVal = 50;
      maxVal = 999;
    } else {
      minVal = 1000;
      maxVal = 999999;
    }

    while (nums.length < 5) {
      let n;
      if (maxGrade === 4) {
        n = rand(10, 950) * 1000;
      } else {
        n = rand(minVal, maxVal);
      }
      if (!nums.includes(n)) nums.push(n);
    }

    const sorted = [...nums].sort((a, b) => a - b);
    const shuffled = shuffle(nums);

    return [
      {
        fach: 'denken',
        schulstufe: maxGrade,
        grade: maxGrade,
        lehrplanRef: 'B-Folgen',
        type: 'sequence',
        instruction: 'Ordne die Zahlen von der kleinsten zur größten (mit dem Finger ziehen oder antippen):',
        pool: shuffled,
        slots: [null, null, null, null, null],
        targetSequence: sorted,
        isCorrect: null,
      }
    ];
  }

  return {
    buildMemoryTasks: buildMemoryTasks,
    buildPatternsTasks: buildPatternsTasks,
    buildSequenceTasks: buildSequenceTasks,
  };
})();
