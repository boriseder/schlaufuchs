// =============================================================
// SCHLAUFUCHS – js/generators/math.js
// Mathematik-Generatoren für Grundstufe I & II (BMBWF Lehrplan)
// Strikte Einhaltung von DIN/ÖNORM 1083 (KEIN Tausenderpunkt!)
// Vollständige Trennung von +, -, ·, : und hohe Zufallsvarianz
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.Math = (function () {
  'use strict';

  // Zentrale Hilfsfunktionen aus Core (Zufall, deterministischer Seed, Zahlenformatierung, Stufen-Filter)
  function getRng(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const seed = (opts && opts.seed !== undefined) ? opts.seed : undefined;
    if (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.erstelleZufall) {
      return window.Schlaufuchs.Random.erstelleZufall(seed);
    }
    return {
      int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      mischen: (arr) => [...arr].sort(() => Math.random() - 0.5),
      wahl: (arr) => arr[Math.floor(Math.random() * arr.length)],
      next: () => Math.random()
    };
  }
  const defaultRand = (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.rand) || ((min, max) => Math.floor(Math.random() * (max - min + 1)) + min);
  const formatAustrianNumber = (window.Schlaufuchs && window.Schlaufuchs.formatZahl) || (num => String(num));
  const getEffectiveGrades = (window.Schlaufuchs && window.Schlaufuchs.getEffectiveGrades) || (g => g);

  // 1. ADDITION (1. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  function buildAdditionTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const targetGrade = opts.grade || (grades[rand(0, grades.length - 1)] || 2);
    const targetCount = opts.count || (opts.forPrint ? 12 : 6);
    const isInjective = opts.injective || opts.forPrint;
    const tracker = opts.tracker || null;
    const tasks = [];
    const usedAnswers = new Set();
    let attempts = 0;

    while (tasks.length < targetCount && attempts < 1000) {
      attempts++;
      const g = targetGrade;
      let a, b;

      if (g === 1) {
        // 1. Klasse: ZR 20
        if (rng.next() > 0.4) {
          a = rand(5, 9);
          b = rand(3, 10);
        } else {
          a = rand(2, 10);
          b = rand(1, 20 - a);
        }
      } else if (g === 2) {
        // 2. Klasse: ZR 100 mit Zehnerübergang
        a = rand(18, 65);
        const aUnits = a % 10;
        b = rand(10 - aUnits + 1, 35);
        if (a + b > 100) b = 100 - a;
      } else if (g === 3) {
        // 3. Klasse: ZR 1000
        if (rng.next() > 0.5) {
          // Rechnen mit Hundertern & Zehnern
          a = rand(12, 45) * 10;
          b = rand(15, 45) * 10;
        } else {
          a = rand(125, 480);
          b = rand(85, 450);
        }
      } else {
        // 4. Klasse: ZR bis 10 000 – Altersgerechtes Kopfrechnen (Hunderter-/Tausendersprünge & Ergänzen)
        const type = rand(1, 3);
        if (type === 1) {
          // Tausender ergänzen (z.B. 3400 + 600 = 4000 oder 4500 + 1500 = 6000)
          const baseThousand = rand(2, 6) * 1000;
          const split = rand(1, 9) * 100;
          a = baseThousand - split;
          b = rand(1, 3) * 1000 + split;
        } else if (type === 2) {
          // Tausendersprünge (z.B. 3200 + 2000 = 5200 oder 5400 + 800 = 6200)
          a = rand(20, 55) * 100;
          b = rand(1, 3) * 1000 + (rng.next() > 0.5 ? 0 : rand(1, 6) * 100);
        } else {
          // Zehnerergänzung im ZR 1000 (z.B. 470 + 380 = 850)
          a = rand(25, 58) * 10;
          b = rand(18, 38) * 10;
        }
      }

      const ans = a + b;
      const sig = `${a}+${b}`;
      if (isInjective && usedAnswers.has(ans)) continue;
      if (tracker && tracker.has(sig)) continue;

      usedAnswers.add(ans);
      if (tracker) tracker.add(sig);

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen-Addition",
        type: "equation",
        op: "add",
        grade: g,
        symbol: '+',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: ans,
        solutionText: formatAustrianNumber(ans),
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 2. SUBTRAKTION (1. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  function buildSubtractionTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const targetGrade = opts.grade || (grades[rand(0, grades.length - 1)] || 2);
    const targetCount = opts.count || (opts.forPrint ? 12 : 6);
    const isInjective = opts.injective || opts.forPrint;
    const tracker = opts.tracker || null;
    const tasks = [];
    const usedAnswers = new Set();
    let attempts = 0;

    while (tasks.length < targetCount && attempts < 1000) {
      attempts++;
      const g = targetGrade;
      let a, b;

      if (g === 1) {
        // 1. Klasse: ZR 20
        if (rng.next() > 0.5) {
          a = rand(11, 18);
          b = rand(a - 9, a - 2); // Zehnerunterschreitung
        } else {
          a = rand(6, 20);
          b = rand(1, a - 1);
        }
      } else if (g === 2) {
        // 2. Klasse: ZR 100 mit Zehnerüberschreitung
        a = rand(31, 95);
        const aUnits = a % 10;
        const bUnits = rand(aUnits + 1, 9);
        const bTens = rand(1, Math.floor(a / 10) - 1);
        b = bTens * 10 + bUnits;
        if (b >= a) b = a - rand(5, 15);
      } else if (g === 3) {
        // 3. Klasse: ZR 1000
        a = rand(350, 950);
        b = rand(120, a - 30);
      } else {
        // 4. Klasse: ZR bis 10 000 – Altersgerechte Kopfrechensubtraktionen (KEINE obskuren 6-stelligen Monster-Aufgaben!)
        const type = rand(1, 3);
        if (type === 1) {
          // Glatte Tausender vermindern (z.B. 5000 - 1500 = 3500 oder 10000 - 4000 = 6000)
          a = rand(4, 10) * 1000;
          b = rand(1, Math.floor(a / 1000) - 1) * 1000 + (rng.next() > 0.5 ? 500 : 0);
        } else if (type === 2) {
          // Hunderterabbau mit Tausenderüberschreitung (z.B. 4200 - 800 = 3400 oder 6300 - 1500 = 4800)
          const thousands = rand(3, 7) * 1000;
          const partA = rand(1, 4) * 100;
          a = thousands + partA;
          const subH = rand(Math.floor(partA / 100) + 1, 9) * 100;
          b = rand(0, 1) * 1000 + subH;
        } else {
          // Zehner subtrahieren im ZR 1000 (z.B. 820 - 370 = 450)
          a = rand(52, 95) * 10;
          const aTens = Math.floor((a / 10) % 10);
          const bTens = rand(aTens + 1, 9);
          const bHundreds = rand(1, Math.floor(a / 100) - 1);
          b = (bHundreds * 10 + bTens) * 10;
          if (b >= a) b = a - rand(15, 35) * 10;
        }
      }

      const ans = a - b;
      const sig = `${a}−${b}`;
      if (isInjective && usedAnswers.has(ans)) continue;
      if (tracker && tracker.has(sig)) continue;

      usedAnswers.add(ans);
      if (tracker) tracker.add(sig);

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen-Subtraktion",
        type: "equation",
        op: "sub",
        grade: g,
        symbol: '−',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: ans,
        solutionText: formatAustrianNumber(ans),
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 3. MULTIPLIKATION (2. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  // Kind mit 2. Schulstufe erhält ausschließlich Kernaufgaben und kleines 1×1 bis 100!
  function buildMultiplicationTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const useGrades = getEffectiveGrades([2, 3, 4]);
    const targetGrade = opts.grade || (useGrades[rand(0, useGrades.length - 1)] || 2);
    const targetCount = opts.count || (opts.forPrint ? 12 : 6);
    const isInjective = opts.injective || opts.forPrint;
    const tracker = opts.tracker || null;
    const tasks = [];
    const usedAnswers = new Set();
    let attempts = 0;

    while (tasks.length < targetCount && attempts < 1000) {
      attempts++;
      const g = targetGrade;
      let a, b;

      if (g === 2) {
        // 2. Klasse: Kleines 1×1 (Kernaufgaben 2, 5, 10 und Reihen bis 10)
        // Niemals Zehnerrechnen wie 6 · 40!
        if (rng.next() < 0.4) {
          const coreFactors = [2, 5, 10];
          a = coreFactors[rand(0, coreFactors.length - 1)];
          b = rand(2, 10);
        } else {
          a = rand(2, 9);
          b = rand(2, 9);
        }
      } else if (g === 3) {
        // 3. Klasse: Zehnereinmaleins (z.B. 6 · 40 oder 30 · 7)
        if (rng.next() > 0.5) {
          a = rand(2, 9);
          b = rand(2, 9) * 10;
        } else {
          a = rand(2, 9) * 10;
          b = rand(2, 9);
        }
      } else {
        // 4. Klasse: Kopfrechnen mit Zerlegung & Zehner/Hunderter-Multiplikation
        const type = rand(1, 3);
        if (type === 1) {
          // Zweistellig mal Einer (z.B. 14 · 6 = 84, 16 · 4 = 64, 25 · 3 = 75, 18 · 5 = 90)
          a = rand(12, 28);
          b = rand(3, 7);
        } else if (type === 2) {
          // Zehner/Hunderter-Vielfache (z.B. 7 · 60 = 420, 8 · 50 = 400, 4 · 300 = 1200)
          if (rng.next() > 0.5) {
            a = rand(3, 9);
            b = rand(3, 9) * 10;
          } else {
            a = rand(2, 8);
            b = rand(2, 6) * 100;
          }
        } else {
          // Runde Zehner mal Zehner (z.B. 20 · 40 = 800, 30 · 30 = 900, 25 · 40 = 1000)
          const tens = [20, 30, 40, 50];
          a = tens[rand(0, tens.length - 1)];
          b = rand(2, 5) * 10;
        }
      }

      const ans = a * b;
      const sig = `${a}·${b}`;
      if (isInjective && usedAnswers.has(ans)) continue;
      if (tracker && tracker.has(sig)) continue;

      usedAnswers.add(ans);
      if (tracker) tracker.add(sig);

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen-Mal",
        type: "equation",
        op: "mul",
        grade: g,
        symbol: '·',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: ans,
        solutionText: formatAustrianNumber(ans),
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 4. DIVISION (: 2. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  // Kind mit 2. Schulstufe erhält nur 1×1-Umkehrung ohne Rest!
  // Kind mit 4. Schulstufe erhält altersgerechte halbschriftliche Divisionen!
  function buildDivisionTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const useGrades = getEffectiveGrades([2, 3, 4]);
    const targetGrade = opts.grade || (useGrades[rand(0, useGrades.length - 1)] || 2);
    const targetCount = opts.count || (opts.forPrint ? 12 : 6);
    const isInjective = opts.injective || opts.forPrint;
    const tracker = opts.tracker || null;
    const tasks = [];
    const usedAnswers = new Set();
    let attempts = 0;

    while (tasks.length < targetCount && attempts < 1000) {
      attempts++;
      const g = targetGrade;
      let a, b, answer;

      if (g === 2) {
        // 2. Klasse: Reine Umkehrung des 1×1 (ohne Rest, Dividenden bis 100)
        b = rand(2, 9);
        answer = rand(2, 9);
        a = b * answer;
      } else if (g === 3) {
        // 3. Klasse: Zehnerdivision (z.B. 420 : 6 oder 350 : 50)
        if (rng.next() > 0.5) {
          b = rand(2, 9);
          answer = rand(2, 9) * 10;
          a = b * answer;
        } else {
          b = rand(2, 8) * 10;
          answer = rand(2, 9);
          a = b * answer;
        }
      } else {
        // 4. Klasse: Halbschriftliche Division & Zehner-/Hunderter-/Tausender-Teilen
        const type = rand(1, 3);
        if (type === 1) {
          // Zehnerdivision / Umkehrung des Einmaleins (z.B. 480 : 6 = 80, 720 : 8 = 90, 840 : 2 = 420)
          b = rand(2, 9);
          answer = (b === 2 ? rand(12, 45) : rand(4, 12)) * 10;
          a = b * answer;
        } else if (type === 2) {
          // Glattes Zerlegen zweistelliger/dreistelliger Zahlen (z.B. 96 : 3 = 32, 84 : 4 = 21, 125 : 5 = 25)
          const pairs = [
            { a: 96, b: 3, ans: 32 },
            { a: 84, b: 4, ans: 21 },
            { a: 68, b: 2, ans: 34 },
            { a: 125, b: 5, ans: 25 },
            { a: 144, b: 6, ans: 24 },
            { a: 108, b: 9, ans: 12 },
            { a: 132, b: 6, ans: 22 },
            { a: 156, b: 4, ans: 39 },
            { a: 175, b: 5, ans: 35 },
            { a: 225, b: 5, ans: 45 },
            { a: 360, b: 3, ans: 120 },
            { a: 450, b: 5, ans: 90 },
            { a: 240, b: 4, ans: 60 }
          ];
          const pick = pairs[rand(0, pairs.length - 1)];
          a = pick.a;
          b = pick.b;
          answer = pick.ans;
        } else {
          // Tausender-Teilen (z.B. 1000 : 2 = 500, 1000 : 4 = 250, 2000 : 5 = 400)
          const thousands = [
            { a: 1000, b: 2, ans: 500 },
            { a: 1000, b: 4, ans: 250 },
            { a: 1000, b: 5, ans: 200 },
            { a: 2000, b: 4, ans: 500 },
            { a: 2000, b: 5, ans: 400 },
            { a: 3000, b: 6, ans: 500 },
            { a: 4000, b: 8, ans: 500 },
            { a: 5000, b: 5, ans: 1000 }
          ];
          const pick = thousands[rand(0, thousands.length - 1)];
          a = pick.a;
          b = pick.b;
          answer = pick.ans;
        }
      }

      const sig = `${a}:${b}`;
      if (isInjective && usedAnswers.has(answer)) continue;
      if (tracker && tracker.has(sig)) continue;

      usedAnswers.add(answer);
      if (tracker) tracker.add(sig);

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen-Geteilt",
        type: "equation",
        op: "div",
        grade: g,
        symbol: ':',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: answer,
        solutionText: formatAustrianNumber(answer),
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 5. RECHENTÜRME / ZAHLENMAUERN (Stufengerecht: 1. Kl <= 20, 2. Kl <= 100, 3. Kl <= 1 000)
  function buildPyramidTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const grades = getEffectiveGrades([1, 2, 3]);
    const targetGrade = opts.grade || (grades[rand(0, grades.length - 1)] || 2);
    const targetCount = opts.count || (opts.forPrint ? 4 : 5);
    const tasks = [];

    for (let i = 0; i < targetCount; i++) {
      const g = targetGrade;
      let b1, b2, b3;

      if (g === 1) {
        // 1. Klasse: Basiszahlen 1 bis 4 (Spitzensumme <= 20)
        b1 = rand(1, 4);
        b2 = rand(1, 3);
        b3 = rand(1, 4);
      } else if (g === 2) {
        // 2. Klasse: Basiszahlen 4 bis 18 (Spitzensumme <= 100)
        b1 = rand(4, 16);
        b2 = rand(3, 14);
        b3 = rand(4, 16);
      } else {
        // 3. Klasse: Basiszahlen 15 bis 75 (Spitzensumme <= 1 000)
        b1 = rand(15, 75);
        b2 = rand(20, 80);
        b3 = rand(15, 75);
      }

      // Mittlere Ebene
      const m1 = b1 + b2;
      const m2 = b2 + b3;
      // Spitze
      const peak = m1 + m2;

      // Zufällig 2 bis 3 Werte ausblenden (didaktisch lösbar)
      let hiddenKeys;
      const variant = rand(1, 3);
      if (variant === 1) {
        hiddenKeys = ['m1', 'm2', 'peak']; // Vorwärtsrechnen von unten nach oben
      } else if (variant === 2) {
        hiddenKeys = ['b1', 'm2', 'peak']; // Umkehrung links: b1 = m1 - b2
      } else {
        hiddenKeys = ['b3', 'm1', 'peak']; // Umkehrung rechts: b3 = m2 - b2
      }

      const valuesObj = { b1, b2, b3, m1, m2, peak };
      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Strukturen-Zahlenmauern",
        type: "pyramid",
        grade: g,
        values: valuesObj,
        hidden: hiddenKeys,
        answer: hiddenKeys.map(k => valuesObj[k]).join(', '),
        solutionText: hiddenKeys.map(k => valuesObj[k]).join(', '),
        userAnswers: {},
        isCorrect: null,
      });
    }
    return tasks;
  }

  // 6. UHRZEIT (1. – 4. Klasse adaptiv nach BMBWF Lehrplan)
  function buildClockTasks(opts) {
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const shuffle = (arr) => rng.mischen(arr);
    if (opts && opts.forPrint) {
      const g = opts.grade || 2;
      const tasks = [];
      const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;
      const formatTime = Clock ? Clock.formatTime : (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} Uhr`;
      const describe = Clock ? Clock.describeTimeText : (h, m) => `${h}:${m}`;

      if (g === 1) {
        const hoursPool = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6);
        for (let i = 0; i < 3; i++) {
          const h = hoursPool[i];
          tasks.push({
            fach: 'mathe',
            type: 'clock',
            schulstufe: 1,
            grade: 1,
            lehrplanRef: 'M-1-Groessen-Uhrzeit',
            hours: h,
            minutes: 0,
            promptType: 'hour-only',
            question: 'Wie viel Uhr ist es?',
            answer: `${h} Uhr`,
            solutionText: `${h} Uhr`
          });
        }
        for (let i = 3; i < 6; i++) {
          const h = hoursPool[i];
          tasks.push({
            fach: 'mathe',
            type: 'clock-set',
            schulstufe: 1,
            grade: 1,
            lehrplanRef: 'M-1-Groessen-Uhrzeit',
            targetHours: h,
            targetMinutes: 0,
            promptType: 'draw-hands',
            prompt: `${h}:00 Uhr`,
            targetText: `${h} Uhr`,
            question: `Zeichne die Zeiger ein: <strong>${h} Uhr</strong>`,
            answer: `${h} Uhr`,
            solutionText: `${h}:00 Uhr (kurzer Zeiger auf ${h}, langer auf 12)`
          });
        }
      } else if (g === 2) {
        const timesRead = [
          { h: rand(1, 5), m: 30 },
          { h: rand(6, 11), m: 15 },
          { h: rand(1, 11), m: 45 }
        ];
        timesRead.forEach(t => {
          const textDesc = describe(t.h, t.m);
          tasks.push({
            fach: 'mathe',
            type: 'clock',
            schulstufe: 2,
            grade: 2,
            lehrplanRef: 'M-2-Groessen-Uhrzeit',
            hours: t.h,
            minutes: t.m,
            promptType: 'digital',
            question: 'Wie viel Uhr ist es?',
            answer: formatTime(t.h, t.m),
            solutionText: `${formatTime(t.h, t.m)} (${textDesc})`
          });
        });
        const timesDraw = [
          { h: rand(1, 5), m: 30 },
          { h: rand(6, 11), m: 15 },
          { h: rand(1, 11), m: 45 }
        ];
        timesDraw.forEach(t => {
          const textDesc = describe(t.h, t.m);
          tasks.push({
            fach: 'mathe',
            type: 'clock-set',
            schulstufe: 2,
            grade: 2,
            lehrplanRef: 'M-2-Groessen-Uhrzeit',
            targetHours: t.h,
            targetMinutes: t.m,
            promptType: 'draw-hands',
            prompt: textDesc,
            targetText: textDesc,
            question: `Zeichne die Zeiger ein: <strong>${textDesc}</strong>`,
            answer: textDesc,
            solutionText: `${formatTime(t.h, t.m)} (${textDesc})`
          });
        });
      } else if (g === 3) {
        const mPool = shuffle([5, 10, 20, 25, 35, 40, 50, 55]);
        for (let i = 0; i < 3; i++) {
          const h12 = rand(1, 11);
          const m = mPool[i];
          const isPm = i % 2 === 1;
          const actualH = isPm ? h12 + 12 : h12;
          tasks.push({
            fach: 'mathe',
            type: 'clock',
            schulstufe: 3,
            grade: 3,
            lehrplanRef: 'M-3-Groessen-Uhrzeit',
            hours: h12,
            minutes: m,
            promptType: 'digital',
            isAfternoon: isPm,
            question: isPm ? `Nachmittag (${actualH} Uhr):` : `Vormittag (${actualH} Uhr):`,
            answer: formatTime(actualH, m),
            solutionText: formatTime(actualH, m)
          });
        }
        for (let i = 3; i < 6; i++) {
          const h12 = rand(1, 11);
          const m = mPool[i];
          const isPm = i % 2 === 1;
          const actualH = isPm ? h12 + 12 : h12;
          tasks.push({
            fach: 'mathe',
            type: 'clock-set',
            schulstufe: 3,
            grade: 3,
            lehrplanRef: 'M-3-Groessen-Uhrzeit',
            targetHours: h12,
            targetMinutes: m,
            promptType: 'draw-hands',
            targetText: `${actualH}:${String(m).padStart(2, '0')} Uhr`,
            question: `Zeichne die Zeiger ein: <strong>${actualH}:${String(m).padStart(2, '0')} Uhr</strong>`,
            answer: `${actualH}:${String(m).padStart(2, '0')} Uhr`,
            solutionText: `${actualH}:${String(m).padStart(2, '0')} Uhr`
          });
        }
      } else {
        for (let i = 0; i < 6; i++) {
          const startH = rand(8, 13);
          const startM = rand(0, 3) * 15;
          const durMin = (i + 2) * 15;
          const totalStartMin = startH * 60 + startM;
          const totalEndMin = totalStartMin + durMin;
          const endH = Math.floor(totalEndMin / 60);
          const endM = totalEndMin % 60;
          tasks.push({
            fach: 'mathe',
            type: 'clock',
            schulstufe: 4,
            grade: 4,
            lehrplanRef: 'M-4-Groessen-Uhrzeit',
            hours: startH % 12 || 12,
            minutes: startM,
            clockStart: { hours: startH % 12 || 12, minutes: startM },
            clockEnd: { hours: endH % 12 || 12, minutes: endM },
            isPair: true,
            promptType: 'interval',
            question: `Von ${formatTime(startH, startM)} bis ${formatTime(endH, endM)}: Wie viele Minuten?`,
            answer: `${durMin} min`,
            solutionText: `${durMin} min`
          });
        }
      }
      return tasks;
    }
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const tasks = [];

    // --- 1. SCHULSTUFE: Volle Stunden (1:00 bis 12:00 Uhr) [RIS, S. 82] ---
    const poolGrade1 = [
      () => {
        const h = rand(1, 12);
        return {
          fach: 'mathe',
          schulstufe: 1,
          grade: 1,
          lehrplanRef: 'M-1-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 0,
          question: 'Wie viel Uhr zeigt die Uhr?',
          answer: h,
          answerText: `${h}:00 Uhr`,
          unit: 'Uhr',
          hint: 'Schau auf den kurzen roten Zeiger: Er zeigt genau auf die Stundenzahl!'
        };
      },
      () => {
        const h = rand(1, 11);
        const nextH = h + 1;
        const swappedMin = (h % 12) * 5;
        const rawOptions = [
          { hours: h, minutes: 0, isCorrect: true },
          { hours: 12, minutes: swappedMin, isCorrect: false },
          { hours: nextH, minutes: 0, isCorrect: false },
          { hours: h, minutes: 30, isCorrect: false }
        ];
        const shuffled = shuffle(rawOptions);
        const correctIndex = shuffled.findIndex(o => o.isCorrect);

        return {
          fach: 'mathe',
          schulstufe: 1,
          grade: 1,
          lehrplanRef: 'M-1-Groessen-Uhrzeit',
          type: 'clock-choice',
          targetHours: h,
          targetMinutes: 0,
          prompt: `${h}:00 Uhr`,
          targetText: `${h}:00 Uhr`,
          question: 'Welche Uhr zeigt diese Uhrzeit?',
          options: shuffled,
          correctIndex: correctIndex,
          hint: `Suche die Uhr, bei der der kurze rote Zeiger auf die ${h} und der lange blaue Zeiger auf die 12 zeigt.`
        };
      },
      () => {
        const h = rand(1, 12);
        return {
          fach: 'mathe',
          schulstufe: 1,
          grade: 1,
          lehrplanRef: 'M-1-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 0,
          question: 'Der lange blaue Zeiger steht auf der 12. Welche volle Stunde ist es?',
          answer: h,
          answerText: `${h}:00 Uhr`,
          unit: 'Uhr',
          hint: 'Wenn der lange blaue Zeiger auf der 12 steht, ist es eine volle Stunde.'
        };
      },
      () => {
        const h = rand(7, 10);
        const nextH = h + 1;
        const prevH = h - 1;
        const swappedMin = (h % 12) * 5;
        const rawOptions = [
          { hours: h, minutes: 0, isCorrect: true },
          { hours: 12, minutes: swappedMin, isCorrect: false },
          { hours: nextH, minutes: 0, isCorrect: false },
          { hours: prevH, minutes: 0, isCorrect: false }
        ];
        const shuffled = shuffle(rawOptions);
        const correctIndex = shuffled.findIndex(o => o.isCorrect);

        return {
          fach: 'mathe',
          schulstufe: 1,
          grade: 1,
          lehrplanRef: 'M-1-Groessen-Uhrzeit',
          type: 'clock-choice',
          targetHours: h,
          targetMinutes: 0,
          prompt: `${h}:00 Uhr`,
          targetText: `${h}:00 Uhr morgens`,
          question: 'Welche Uhr zeigt diese Uhrzeit?',
          options: shuffled,
          correctIndex: correctIndex,
          hint: `Der kurze rote Zeiger muss genau auf die ${h} zeigen und der lange blaue Zeiger auf die 12.`
        };
      }
    ];

    // --- 2. SCHULSTUFE: Halbe Stunden & Viertelstunden [RIS, S. 82] ---
    const poolGrade2 = [
      () => {
        const h = rand(1, 11);
        const nextH = h + 1;
        const options = [
          `halb ${nextH}`,
          `halb ${h}`,
          `viertel nach ${h}`,
          `viertel vor ${nextH}`
        ];
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 30,
          question: 'Wie spät ist es auf dieser Uhr?',
          options: options,
          correctText: `halb ${nextH}`,
          answer: `halb ${nextH}`,
          answerText: `${String(h).padStart(2, '0')}:30 Uhr (halb ${nextH})`,
          hint: `Der lange blaue Zeiger steht unten auf der 6 (30 Minuten = eine halbe Stunde). Der rote Zeiger ist auf dem Weg zur ${nextH}.`
        };
      },
      () => {
        const h = rand(1, 11);
        const nextH = h + 1;
        const rawOptions = [
          { hours: h, minutes: 30, isCorrect: true },
          { hours: 6, minutes: (h % 12) * 5, isCorrect: false },
          { hours: nextH, minutes: 0, isCorrect: false },
          { hours: h, minutes: 15, isCorrect: false }
        ];
        const shuffled = shuffle(rawOptions);
        const correctIndex = shuffled.findIndex(o => o.isCorrect);

        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Uhrzeit',
          type: 'clock-choice',
          targetHours: h,
          targetMinutes: 30,
          prompt: `halb ${nextH}`,
          targetText: `halb ${nextH} (${String(h).padStart(2, '0')}:30 Uhr)`,
          question: 'Welche Uhr zeigt diese Uhrzeit?',
          options: shuffled,
          correctIndex: correctIndex,
          hint: `Bei „halb ${nextH}“ muss der lange blaue Zeiger nach unten auf die 6 zeigen, der kurze rote Zeiger liegt zwischen ${h} und ${nextH}.`
        };
      },
      () => {
        const h = rand(1, 11);
        const options = [
          `viertel nach ${h}`,
          `viertel vor ${h + 1}`,
          `halb ${h + 1}`,
          `${h} Uhr`
        ];
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 15,
          question: 'Welche Uhrzeit zeigt das Zifferblatt?',
          options: options,
          correctText: `viertel nach ${h}`,
          answer: `viertel nach ${h}`,
          answerText: `${String(h).padStart(2, '0')}:15 Uhr (viertel nach ${h})`,
          hint: 'Der lange Minutenzeiger steht auf der 3: Es ist eine Viertelstunde (15 Minuten) nach der vollen Stunde.'
        };
      },
      () => {
        const h = rand(1, 11);
        const rawOptions = [
          { hours: h, minutes: 15, isCorrect: true },
          { hours: 3, minutes: (h % 12) * 5, isCorrect: false },
          { hours: h, minutes: 45, isCorrect: false },
          { hours: h, minutes: 30, isCorrect: false }
        ];
        const shuffled = shuffle(rawOptions);
        const correctIndex = shuffled.findIndex(o => o.isCorrect);

        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Uhrzeit',
          type: 'clock-choice',
          targetHours: h,
          targetMinutes: 15,
          prompt: `viertel nach ${h}`,
          targetText: `viertel nach ${h} (${String(h).padStart(2, '0')}:15 Uhr)`,
          question: 'Welche Uhr zeigt diese Uhrzeit?',
          options: shuffled,
          correctIndex: correctIndex,
          hint: `Bei „viertel nach ${h}“ steht der lange blaue Zeiger auf der 3 (15 Minuten vergangen).`
        };
      },
      () => {
        const h = rand(1, 11);
        const nextH = h + 1;
        const options = [
          `viertel vor ${nextH}`,
          `viertel nach ${h}`,
          `halb ${nextH}`,
          `${nextH} Uhr`
        ];
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 45,
          question: 'Welche Uhrzeit ist hier abgebildet?',
          options: options,
          correctText: `viertel vor ${nextH}`,
          answer: `viertel vor ${nextH}`,
          answerText: `${String(h).padStart(2, '0')}:45 Uhr (viertel vor ${nextH})`,
          hint: `Der Minutenzeiger steht auf der 9: Es fehlt noch eine Viertelstunde auf ${nextH} Uhr.`
        };
      },
      () => {
        const h = rand(7, 10);
        const nextH = h + 1;
        const minPast = [15, 30, 45, 20, 40][rand(0, 4)];
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: minPast,
          question: `Auf der Uhr ist es ${h}:${minPast} Uhr. Wie viele Minuten fehlen noch bis ${nextH}:00 Uhr?`,
          unit: 'Minuten',
          answer: 60 - minPast,
          hint: `Eine volle Stunde hat 60 Minuten. Der blaue Zeiger steht bei ${minPast} Minuten. Rechne: 60 − ${minPast}.`
        };
      }
    ];

    // --- 3. SCHULSTUFE: Minutengenau & 24h-Format (Vormittag / Nachmittag) [RIS, S. 83] ---
    const poolGrade3 = [
      () => {
        const h = rand(1, 11);
        const m = rand(1, 11) * 5;
        const mStr = String(m).padStart(2, '0');
        const hStr = String(h).padStart(2, '0');
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: m,
          question: `Lies die Uhrzeit ab (Vormittag): Wie viele Minuten nach ${h} Uhr ist es?`,
          answer: m,
          answerText: `${hStr}:${mStr} Uhr`,
          unit: 'Minuten',
          hint: 'Zähle die 5-Minuten-Schritte auf dem Zifferblatt: 5, 10, 15, 20...'
        };
      },
      () => {
        const h = rand(1, 11);
        const m = [10, 20, 25, 35, 40, 50][rand(0, 5)];
        const mStr = String(m).padStart(2, '0');
        const rawOptions = [
          { hours: h, minutes: m, isCorrect: true },
          { hours: Math.floor(m / 5) || 12, minutes: (h % 12) * 5, isCorrect: false },
          { hours: (h % 12) + 1, minutes: m, isCorrect: false },
          { hours: h, minutes: (m + 30) % 60, isCorrect: false }
        ];
        const shuffled = shuffle(rawOptions);
        const correctIndex = shuffled.findIndex(o => o.isCorrect);

        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Uhrzeit',
          type: 'clock-choice',
          targetHours: h,
          targetMinutes: m,
          prompt: `${h}:${mStr} Uhr`,
          targetText: `${h}:${mStr} Uhr`,
          question: 'Welche Uhr zeigt diese Uhrzeit?',
          options: shuffled,
          correctIndex: correctIndex,
          hint: `Schau zuerst auf den kurzen roten Zeiger (Stunde ${h}) und zähle dann die 5er-Schritte für den blauen Zeiger (${m} Minuten).`
        };
      },
      () => {
        const h12 = rand(1, 11);
        const h24 = h12 + 12;
        const m = rand(0, 3) * 15;
        const mStr = String(m).padStart(2, '0');
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Uhrzeit',
          type: 'clock',
          hours: h12,
          minutes: m,
          isAfternoon: true,
          question: `Es ist Nachmittag. Der Zeiger zeigt auf ${h12}. Welche Nachmittags-Stunde ist das?`,
          answer: h24,
          answerText: `${h24}:${mStr} Uhr`,
          unit: 'Uhr',
          hint: `Nach 12 Uhr mittags zählen wir weiter: Zähle 12 Stunden zur Uhrzeit am Nachmittag dazu.`
        };
      },
      () => {
        const h = rand(1, 11);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 45,
          question: `Die Uhr zeigt eine Dreiviertelstunde nach ${h} Uhr. Wie viele Minuten sind das?`,
          unit: 'Minuten',
          answer: 45,
          hint: 'Eine halbe Stunde (30 min) plus eine Viertelstunde (15 min) = 45 Minuten.'
        };
      },
      () => {
        const h = rand(1, 11);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Uhrzeit',
          type: 'clock',
          hours: h,
          minutes: 30,
          question: 'Der Zeiger ist eine halbe Minute gewandert. Wie viele Sekunden hat eine halbe Minute?',
          unit: 'Sekunden',
          answer: 30,
          hint: '1 Minute = 60 Sekunden. Die Hälfte davon sind 30 Sekunden.'
        };
      }
    ];

    // --- 4. SCHULSTUFE: Zeitspannen (Zwei Uhren: Start & Ende) [RIS, S. 83–84] ---
    const poolGrade4 = [
      () => {
        const startH = rand(7, 10);
        const startM = rand(0, 3) * 15;
        const durMin = rand(2, 6) * 15;
        const totalStartMin = startH * 60 + startM;
        const totalEndMin = totalStartMin + durMin;
        const endH = Math.floor(totalEndMin / 60);
        const endM = totalEndMin % 60;

        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen-Uhrzeit',
          type: 'clock',
          clockStart: { hours: startH, minutes: startM },
          clockEnd: { hours: endH, minutes: endM },
          isPair: true,
          question: `Eine Wanderung beginnt bei Uhr 1 und endet bei Uhr 2. Wie viele Minuten dauerte sie?`,
          answer: durMin,
          answerText: `${durMin} Minuten`,
          unit: 'Minuten',
          hint: `Zähle von ${startH}:${String(startM).padStart(2, '0')} bis zur nächsten vollen Stunde und dann weiter bis ${endH}:${String(endM).padStart(2, '0')}.`
        };
      },
      () => {
        const startH = rand(8, 11);
        const durMin = [15, 30, 45, 60][rand(0, 3)];
        const totalEndMin = startH * 60 + durMin;
        const endH = Math.floor(totalEndMin / 60);
        const endM = totalEndMin % 60;
        const mStr = String(endM).padStart(2, '0');

        const rawOptions = [
          { hours: endH, minutes: endM, isCorrect: true },
          { hours: startH, minutes: 0, isCorrect: false },
          { hours: (endH % 12) + 1, minutes: endM, isCorrect: false },
          { hours: endH, minutes: (endM + 30) % 60, isCorrect: false }
        ];
        const shuffled = shuffle(rawOptions);
        const correctIndex = shuffled.findIndex(o => o.isCorrect);

        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen-Uhrzeit',
          type: 'clock-choice',
          targetHours: endH,
          targetMinutes: endM,
          prompt: `Abfahrt: ${startH}:00 Uhr, Dauer: ${durMin} min`,
          targetText: `${startH}:00 Uhr + ${durMin} min`,
          question: 'Welche Uhr zeigt die richtige Ankunftszeit?',
          options: shuffled,
          correctIndex: correctIndex,
          hint: `Rechne zur Abfahrtszeit (${startH}:00 Uhr) die ${durMin} Minuten Fahrtzeit schrittweise hinzu.`
        };
      },
      () => {
        const stunden = rand(2, 5);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen-Uhrzeit',
          type: 'clock',
          hours: stunden,
          minutes: 0,
          question: `Wie viele Minuten haben ${stunden}\u00A0Stunden?`,
          unit: 'Minuten',
          answer: stunden * 60,
          hint: '1\u00A0Stunde = 60\u00A0Minuten. Multipliziere mit 60.'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen-Uhrzeit',
          type: 'clock',
          hours: 12,
          minutes: 0,
          question: 'Wie viele Stunden hat ein ganzer Tag?',
          unit: 'Stunden',
          answer: 24,
          hint: 'Ein Tag hat 24 Stunden (von 0:00 bis 24:00 Uhr).'
        };
      }
    ];

    let activePool = [];
    if (opts && opts.all) {
      activePool = [...poolGrade1, ...poolGrade2, ...poolGrade3, ...poolGrade4];
    } else {
      if (grades.includes(1)) activePool.push(...poolGrade1);
      if (grades.includes(2)) activePool.push(...poolGrade2);
      if (grades.includes(3)) activePool.push(...poolGrade3);
      if (grades.includes(4)) activePool.push(...poolGrade4);
      if (activePool.length === 0) activePool = poolGrade2;
    }

    const shuffled = (opts && opts.all) ? activePool : shuffle(activePool).slice(0, 5);
    shuffled.forEach(fn => {
      const t = fn();
      tasks.push({
        fach: t.fach,
        schulstufe: t.schulstufe,
        grade: t.grade,
        lehrplanRef: t.lehrplanRef,
        type: t.type,
        hours: t.hours,
        minutes: t.minutes,
        clockStart: t.clockStart,
        clockEnd: t.clockEnd,
        isPair: t.isPair,
        targetHours: t.targetHours,
        targetMinutes: t.targetMinutes,
        initialHours: t.initialHours,
        initialMinutes: t.initialMinutes,
        userHours: t.userHours !== undefined ? t.userHours : (t.initialHours || 12),
        userMinutes: t.userMinutes !== undefined ? t.userMinutes : (t.initialMinutes || 0),
        targetText: t.targetText,
        prompt: t.prompt,
        options: t.options,
        correctIndex: t.correctIndex,
        userSelected: null,
        correctText: t.correctText,
        question: t.question,
        unit: t.unit,
        answer: t.answer,
        answerText: t.answerText,
        hint: t.hint,
        userAnswer: '',
        isCorrect: null
      });
    });

    return tasks;
  }

  // 7. GELD & EURO (1. – 4. Klasse adaptiv nach BMBWF Lehrplan)
  function buildMoneyTasks(opts) {
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const shuffle = (arr) => rng.mischen(arr);
    if (opts && opts.forPrint) {
      const g = opts.grade || 2;
      return [
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-1/4-Groessen-Geld',
          story: 'Ein Kinoticket kostet 8 € und 50 Cent. Ein Popcorn kostet 4 € und 20 Cent. Wie viel bezahlt Maximilian an der Kassa?',
          question: 'Wie viel kosten Ticket und Popcorn zusammen?',
          calculation: '8,50 € + 4,20 €',
          answer: '12 € und 70 Cent',
          solutionText: 'R: 8,50 € + 4,20 € = 12 € und 70 Cent'
        },
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-1/4-Groessen-Geld',
          story: 'Sophie kauft am Naschmarkt Äpfel um 3 € und Trauben um 4 €. Sie bezahlt mit einem 20-€-Schein. Wie viel Retourgeld bekommt sie?',
          question: 'Wie viel Retourgeld bekommt Sophie?',
          calculation: '20 € − 7 €',
          answer: '13 €',
          solutionText: 'R: 20 € − 7 € = 13 €'
        },
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-1/4-Groessen-Geld',
          story: 'In der Spardose von Anna liegen 35 €. Zum Geburtstag schenkt ihr der Großvater 20 €. Wie viel Geld hat Anna nun insgesamt?',
          question: 'Wie viel Geld hat Anna insgesamt?',
          calculation: '35 € + 20 €',
          answer: '55 €',
          solutionText: 'R: 35 € + 20 € = 55 €'
        }
      ];
    }
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const tasks = [];

    // --- 1. SCHULSTUFE: Euro und Cent im ZR 20 [RIS, S. 81, 82] ---
    const poolGrade1 = [
      () => {
        const e1 = rand(1, 8);
        const e2 = rand(1, 10);
        return {
          fach: 'mathe',
          schulstufe: 1,
          grade: 1,
          lehrplanRef: 'M-1-Groessen-Geld',
          type: 'direct-input',
          question: `In deiner Spardose liegen ${e1}\u00A0€ und ${e2}\u00A0€. Wie viel Euro sind das zusammen?`,
          unit: '€',
          answer: e1 + e2,
          hint: 'Zähle die beiden Euro-Beträge mit einer Plusrechnung (+) zusammen.'
        };
      },
      () => {
        const kosten = rand(2, 8);
        const gegeben = 10;
        return {
          fach: 'mathe',
          schulstufe: 1,
          grade: 1,
          lehrplanRef: 'M-1-Groessen-Geld',
          type: 'direct-input',
          question: `Ein Buch kostet ${kosten}\u00A0€. Du zahlst mit einem 10-€-Schein. Wie viel Euro Rückgeld bekommst du?`,
          unit: '€',
          answer: gegeben - kosten,
          hint: 'Ziehe den Preis des Einkaufs mit Minus (−) vom 10-Euro-Schein ab.'
        };
      }
    ];

    // --- 2. SCHULSTUFE: Euro und Cent im ZR 100 [RIS, S. 82] ---
    const poolGrade2 = [
      () => {
        const euro1 = rand(12, 35);
        const euro2 = rand(10, 45);
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Geld',
          type: 'direct-input',
          question: `Wie viel Euro sind ${euro1}\u00A0€ und ${euro2}\u00A0€ zusammen?`,
          unit: '€',
          answer: euro1 + euro2,
          hint: 'Addiere die Werte der beiden Euro-Münzen.'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Geld',
          type: 'direct-input',
          question: 'Du kaufst einen Apfel um 50 Cent und eine Semmel um 50 Cent. Wie viel Euro (€) sind das zusammen?',
          unit: '€',
          answer: 1,
          hint: '50 Cent + 50 Cent = 100 Cent. 100 Cent entsprechen genau 1 Euro.'
        };
      },
      () => {
        const kosten = rand(3, 8) * 10;
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen-Geld',
          type: 'direct-input',
          question: `Ein Malblock kostet ${kosten}\u00A0Cent. Wie viele Cent fehlen noch auf 1\u00A0Euro (100 Cent)?`,
          unit: 'Cent',
          answer: 100 - kosten,
          hint: '1\u00A0Euro entspricht 100\u00A0Cent. Ziehe die Kosten in Cent davon ab.'
        };
      }
    ];

    // --- 3. SCHULSTUFE: Geldbeträge im ZR 1 000 & Kommaschreibweise [RIS, S. 81, 83] ---
    const poolGrade3 = [
      () => {
        const euro1 = rand(2, 8);
        const cent1 = rand(1, 4) * 20;
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Geld',
          type: 'direct-input',
          question: `Wie viel Cent sind ${euro1}\u00A0€ und ${cent1}\u00A0c zusammen?`,
          unit: 'Cent',
          answer: euro1 * 100 + cent1,
          hint: 'Wandle die Euro in Cent um (1\u00A0Euro = 100\u00A0Cent) und zähle die Cent dazu.'
        };
      },
      () => {
        const kostenCents = rand(11, 18) * 10;
        const gezahltEuro = 2;
        const rueckgeld = gezahltEuro * 100 - kostenCents;
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen-Geld',
          type: 'direct-input',
          question: `Ein Heft kostet ${kostenCents}\u00A0Cent. Du zahlst mit einer 2-Euro-Münze. Wie viel Cent Rückgeld bekommst du?`,
          unit: 'Cent',
          answer: rueckgeld,
          hint: 'Eine 2-Euro-Münze entspricht 200\u00A0Cent. Ziehe die Kosten in Cent davon ab.'
        };
      }
    ];

    // --- 4. SCHULSTUFE: Sachrechnen mit Geld & Kommazahlen [RIS, S. 83–84] ---
    const poolGrade4 = [
      () => {
        const e1 = rand(15, 45);
        const e2 = rand(20, 50);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen-Geld',
          type: 'direct-input',
          question: `Für die Schulbibliothek werden Bücher um ${e1}\u00A0€ und Spiele um ${e2}\u00A0€ gekauft. Wie viel Euro kostet das insgesamt?`,
          unit: '€',
          answer: e1 + e2,
          hint: 'Zähle die beiden Euro-Beträge zusammen.'
        };
      },
      () => {
        const preis1 = rand(12, 25);
        const menge = rand(3, 5);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen-Geld',
          type: 'direct-input',
          question: `Ein T-Shirt für den Schulsport kostet ${preis1}\u00A0€. Wie viel Euro kosten ${menge} solche T-Shirts?`,
          unit: '€',
          answer: preis1 * menge,
          hint: 'Multipliziere die Stückzahl mit dem Preis pro Stück (Malrechnung ·).'
        };
      }
    ];

    let activePool = [];
    if (opts && opts.all) {
      activePool = [...poolGrade1, ...poolGrade2, ...poolGrade3, ...poolGrade4];
    } else {
      if (grades.includes(1)) activePool.push(...poolGrade1);
      if (grades.includes(2)) activePool.push(...poolGrade2);
      if (grades.includes(3)) activePool.push(...poolGrade3);
      if (grades.includes(4)) activePool.push(...poolGrade4);
      if (activePool.length === 0) activePool = poolGrade3;
    }

    const shuffled = (opts && opts.all) ? activePool : shuffle(activePool).slice(0, 5);
    shuffled.forEach(fn => {
      const t = fn();
      tasks.push({
        fach: t.fach,
        schulstufe: t.schulstufe,
        grade: t.grade,
        lehrplanRef: t.lehrplanRef,
        type: t.type,
        question: t.question,
        unit: t.unit,
        answer: t.answer,
        hint: t.hint,
        userAnswer: '',
        isCorrect: null
      });
    });

    return tasks;
  }

  // Fallback-Funktion für Altsystem-Aufrufe
  function buildTimeMoneyTasks() {
    return buildClockTasks();
  }

  // 7. ZAHLENRAUM 1 000 000 & STELLENWERTTAFEL (4. Klasse)
  function buildMillionTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    if (opts && (opts.forPrint || opts.injective)) {
      const tasks = [];
      const usedAnswers = new Set();
      const tracker = opts.tracker || null;
      let attempts = 0;
      while (tasks.length < 12 && attempts < 500) {
        attempts++;
        const base = rand(10, 85) * 10000;
        const addPart = rand(1, 9) * 1000;
        const ans = base + addPart;
        const sig = `million:${base}+${addPart}`;
        if (usedAnswers.has(ans)) continue;
        if (tracker && tracker.has(sig)) continue;
        usedAnswers.add(ans);
        if (tracker) tracker.add(sig);

        tasks.push({
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Zahlenraum-Million',
          type: 'equation',
          op: 'add',
          symbol: '+',
          num1: formatAustrianNumber(base),
          num2: formatAustrianNumber(addPart),
          raw1: base,
          raw2: addPart,
          answer: ans,
          solutionText: formatAustrianNumber(ans),
          userAnswer: '',
          isCorrect: null
        });
      }
      return tasks;
    }
    const tasks = [];

    for (let i = 0; i < 5; i++) {
      const ht = rand(1, 9);
      const zt = rand(0, 9);
      const t = rand(0, 9);
      const h = rand(0, 9);
      const z = rand(0, 9);
      const e = rand(1, 9);

      const fullNum = ht * 100000 + zt * 10000 + t * 1000 + h * 100 + z * 10 + e;
      const formattedNum = formatAustrianNumber(fullNum);

      // Fragetypen abwechseln
      if (i === 0) {
        tasks.push({
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Zahlen',
          type: 'direct-input',
          question: `Welche Zahl ist: ${ht}\u00A0HT + ${zt}\u00A0ZT + ${t}\u00A0T + ${h}\u00A0H + ${z}\u00A0Z + ${e}\u00A0E?`,
          unit: '',
          answer: fullNum,
          hint: 'Schreibe die Ziffern der Reihe nach von HT bis E auf.'
        });
      } else if (i === 1) {
        tasks.push({
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Zahlen',
          type: 'direct-input',
          question: `Welchen Wert hat die Tausender-Ziffer (T) in der Zahl ${formattedNum}?`,
          unit: '',
          answer: t,
          hint: 'Die Tausender-Stelle steht an 4. Stelle von rechts.'
        });
      } else if (i === 2) {
        const step = rand(1, 4) * 1000;
        const cleanT = rand(1, 5);
        const cleanNum = ht * 100000 + zt * 10000 + cleanT * 1000;
        const answer = cleanNum + step;
        tasks.push({
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Zahlen',
          type: 'direct-input',
          question: `Zähle weiter: ${formatAustrianNumber(cleanNum)} + ${formatAustrianNumber(step)} = ?`,
          unit: '',
          answer: answer,
          hint: 'Achte auf die Tausender-Stelle und zähle in Tausenderschritten weiter.'
        });
      } else if (i === 3) {
        const nachfolger = fullNum + 1;
        tasks.push({
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Zahlen',
          type: 'direct-input',
          question: `Welche Zahl ist der unmittelbare Nachfolger von ${formattedNum}?`,
          unit: '',
          answer: nachfolger,
          hint: 'Der Nachfolger ist um genau 1 größer.'
        });
      } else {
        const baseZt = rand(2, 8) * 10000;
        const part = rand(1, 9) * 1000;
        const start = baseZt - part;
        tasks.push({
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Zahlen',
          type: 'direct-input',
          question: `Wie viel fehlt von ${formatAustrianNumber(start)} auf ${formatAustrianNumber(baseZt)}?`,
          unit: '',
          answer: part,
          hint: 'Ergänze auf den nächsten vollen Zehntausender.'
        });
      }
    }

    return tasks.map(t => ({ ...t, userAnswer: '', isCorrect: null }));
  }

  // 8. MASSE & GEWICHTE (3. & 4. Klasse mit kg, g, dag, t, hl, km)
  function buildUnitsTasks(opts) {
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const shuffle = (arr) => rng.mischen(arr);
    if (opts && opts.forPrint) {
      const g = opts.grade || 4;
      return [
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-4-Groessen-Masseinheiten',
          story: 'Ein Bäcker benötigt für 10 Brote genau 5 kg Mehl. Wie viel Gramm (g) Mehl sind das?',
          question: 'Rechne die Menge in Gramm um:',
          calculation: '5 · 1 000 g',
          answer: '5 000 g',
          solutionText: 'R: 5 · 1 000 g = 5 000 g'
        },
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-4-Groessen-Masseinheiten',
          story: 'Ein Wanderweg um den Wolfgangsee ist 12 km und 400 m lang. Eine Familie ist bereits 8 km gewandert.',
          question: 'Wie viele Kilometer und Meter fehlen noch bis zum Ziel?',
          calculation: '12 km 400 m − 8 km',
          answer: '4 km 400 m',
          solutionText: 'R: 12 km 400 m − 8 km = 4 km 400 m'
        },
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-4-Groessen-Masseinheiten',
          story: 'In ein großes Aquarium passen 150 Liter Wasser. Mit einem Eimer werden 6 Eimer zu je 12 Liter eingefüllt.',
          question: 'Wie viel Wasser ist bereits im Becken?',
          calculation: '6 · 12 l',
          answer: '72 l',
          solutionText: 'R: 6 · 12 l = 72 l'
        }
      ];
    }
    const grades = getEffectiveGrades([3, 4]);
    const tasks = [];
    const poolGrade3 = [
      () => {
        const kg = rand(2, 8);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viel Gramm (g) sind ${kg}\u00A0kg?`,
          unit: 'g',
          answer: kg * 1000,
          hint: '1\u00A0kg = 1\u00A0000\u00A0g.'
        };
      },
      () => {
        const m = rand(2, 9);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viel Zentimeter (cm) sind ${m}\u00A0m?`,
          unit: 'cm',
          answer: m * 100,
          hint: '1\u00A0m = 100\u00A0cm.'
        };
      },
      () => {
        const cm = rand(3, 9);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viel Millimeter (mm) sind ${cm}\u00A0cm?`,
          unit: 'mm',
          answer: cm * 10,
          hint: '1\u00A0cm = 10\u00A0mm.'
        };
      },
      () => {
        const dm = rand(2, 8);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viel Zentimeter (cm) sind ${dm}\u00A0Dezimeter (dm)?`,
          unit: 'cm',
          answer: dm * 10,
          hint: '1\u00A0dm = 10\u00A0cm.'
        };
      },
      () => {
        const l = rand(2, 5);
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viel Milliliter (ml) sind ${l}\u00A0Liter (l)?`,
          unit: 'ml',
          answer: l * 1000,
          hint: '1\u00A0Liter = 1\u00A0000\u00A0Milliliter.'
        };
      }
    ];

    const poolGrade4 = [
      () => {
        const kg = rand(2, 8);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viel Dekagramm (dag) sind ${kg}\u00A0kg?`,
          unit: 'dag',
          answer: kg * 100,
          hint: 'In Österreich gilt: 1\u00A0kg = 100\u00A0dag.'
        };
      },
      () => {
        const dag = rand(3, 9) * 100;
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viel Kilogramm (kg) sind ${dag}\u00A0dag?`,
          unit: 'kg',
          answer: dag / 100,
          hint: '100\u00A0dag = 1\u00A0kg.'
        };
      },
      () => {
        const dag = rand(4, 9);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viel Gramm (g) sind ${dag}\u00A0dag?`,
          unit: 'g',
          answer: dag * 10,
          hint: '1\u00A0dag = 10\u00A0g.'
        };
      },
      () => {
        const t = rand(2, 6);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viel Kilogramm (kg) sind ${t}\u00A0Tonnen (t)?`,
          unit: 'kg',
          answer: t * 1000,
          hint: '1\u00A0Tonne = 1\u00A0000\u00A0kg.'
        };
      },
      () => {
        const hl = rand(2, 5);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viel Liter (l) sind ${hl}\u00A0Hektoliter (hl)?`,
          unit: 'l',
          answer: hl * 100,
          hint: '1\u00A0Hektoliter (hl) = 100\u00A0Liter (l).'
        };
      },
      () => {
        const km = rand(2, 7);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viel Meter (m) sind ${km}\u00A0Kilometer (km)?`,
          unit: 'm',
          answer: km * 1000,
          hint: '1\u00A0km = 1\u00A0000\u00A0m.'
        };
      }
    ];

    let activePool = [];
    if (opts && opts.all) {
      activePool = [...poolGrade3, ...poolGrade4];
    } else {
      if (grades.includes(3)) activePool.push(...poolGrade3);
      if (grades.includes(4)) activePool.push(...poolGrade4);
      if (activePool.length === 0) activePool = poolGrade4;
    }

    const chosen = (opts && opts.all) ? activePool : shuffle(activePool).slice(0, 5);
    chosen.forEach(fn => {
      const item = fn();
      tasks.push({
        fach: item.fach,
        schulstufe: item.schulstufe,
        grade: item.grade,
        lehrplanRef: item.lehrplanRef,
        type: 'direct-input',
        question: item.question,
        unit: item.unit,
        answer: item.answer,
        hint: item.hint,
        userAnswer: '',
        isCorrect: null
      });
    });

    return tasks;
  }

  // 9. GEOMETRIE: UMFANG & FLÄCHE (4. Klasse, 5 Aufgaben)
  function buildGeometryTasks(opts) {
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    if (opts && opts.forPrint) {
      const g = opts.grade || 4;
      return [
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-4-Geometrie-Flaechen',
          story: 'Ein rechteckiges Klassenzimmer ist 8 m lang und 6 m breit. Wie groß ist die Fläche des Bodens?',
          question: 'Wie groß ist der Flächeninhalt (A)?',
          calculation: '8 · 6',
          answer: '48 m²',
          solutionText: 'R: 8 · 6 = 48 m²'
        },
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-4-Geometrie-Flaechen',
          story: 'Ein quadratischer Gemüsegarten hat eine Seitenlänge von 5 m. Um den Garten wird ein Holzzaun gebaut. Wie lange ist der Zaun insgesamt?',
          question: 'Wie groß ist der Umfang (u)?',
          calculation: '4 · 5',
          answer: '20 m',
          solutionText: 'R: 4 · 5 = 20 m'
        },
        {
          fach: 'mathe',
          type: 'text-problem',
          schulstufe: g,
          grade: g,
          lehrplanRef: 'M-4-Geometrie-Flaechen',
          story: 'Ein Spielplatz ist 12 m lang und 10 m breit. Wie groß ist der Umfang des gesamten Spielplatzes?',
          question: 'Wie groß ist der Umfang (u)?',
          calculation: '2 · 12 + 2 · 10',
          answer: '44 m',
          solutionText: 'R: 2 · 12 + 2 · 10 = 44 m'
        }
      ];
    }
    const tasks = [];

    // Aufgabe 1: Umfang Rechteck (u = 2·a + 2·b)
    const a1 = rand(4, 9);
    const b1 = rand(2, 6);
    tasks.push({
      fach: "mathe", schulstufe: 3, grade: 3, lehrplanRef: "M-3-Geometrie", type: "geometry", shape: "rect", taskType: "umfang",
      a: a1,
      b: b1,
      question: `Berechne den Umfang (u) des Rechtecks mit a\u00A0=\u00A0${a1}\u00A0cm und b\u00A0=\u00A0${b1}\u00A0cm:`,
      formula: 'u = 2 · a + 2 · b',
      unit: 'cm',
      answer: 2 * a1 + 2 * b1,
      userAnswer: '',
      isCorrect: null,
    });

    // Aufgabe 2: Flächeninhalt Rechteck (A = a · b)
    const a2 = rand(3, 8);
    const b2 = rand(2, 6);
    tasks.push({
      fach: "mathe", schulstufe: 4, grade: 4, lehrplanRef: "M-4-Geometrie", type: "geometry", shape: "rect", taskType: "flaeche",
      a: a2,
      b: b2,
      question: `Berechne den Flächeninhalt (A) des Rechtecks mit a\u00A0=\u00A0${a2}\u00A0cm und b\u00A0=\u00A0${b2}\u00A0cm:`,
      formula: 'A = a · b',
      unit: 'cm²',
      answer: a2 * b2,
      userAnswer: '',
      isCorrect: null,
    });

    // Aufgabe 3: Umfang Quadrat (u = 4·a)
    const a3 = rand(3, 7);
    tasks.push({
      fach: "mathe", schulstufe: 3, grade: 3, lehrplanRef: "M-3-Geometrie", type: "geometry", shape: "square", taskType: "umfang",
      a: a3,
      b: a3,
      question: `Berechne den Umfang (u) des Quadrats mit der Seitenlänge a\u00A0=\u00A0${a3}\u00A0cm:`,
      formula: 'u = 4 · a',
      unit: 'cm',
      answer: 4 * a3,
      userAnswer: '',
      isCorrect: null,
    });

    // Aufgabe 4: Flächeninhalt Quadrat (A = a · a)
    const a4 = rand(2, 6);
    tasks.push({
      fach: "mathe", schulstufe: 4, grade: 4, lehrplanRef: "M-4-Geometrie", type: "geometry", shape: "square", taskType: "flaeche",
      a: a4,
      b: a4,
      question: `Berechne den Flächeninhalt (A) des Quadrats mit der Seitenlänge a\u00A0=\u00A0${a4}\u00A0cm:`,
      formula: 'A = a · a',
      unit: 'cm²',
      answer: a4 * a4,
      userAnswer: '',
      isCorrect: null,
    });

    // Aufgabe 5: Weiteres Rechteck Umfang
    const a5 = rand(5, 12);
    const b5 = rand(3, 8);
    tasks.push({
      fach: "mathe", schulstufe: 3, grade: 3, lehrplanRef: "M-3-Geometrie", type: "geometry", shape: "rect", taskType: "umfang",
      a: a5,
      b: b5,
      question: `Berechne den Umfang (u) des Rechtecks mit a\u00A0=\u00A0${a5}\u00A0cm und b\u00A0=\u00A0${b5}\u00A0cm:`,
      formula: 'u = 2 · a + 2 · b',
      unit: 'cm',
      answer: 2 * a5 + 2 * b5,
      userAnswer: '',
      isCorrect: null,
    });

    return tasks;
  }

  // 10. RECHENGESCHICHTEN / TEXTAUFGABEN (2. – 4. Klasse mit F, R, A, 5 Aufgaben)
  function buildStoryTasks(opts) {
    const rng = getRng(opts);
    const shuffle = (arr) => rng.mischen(arr);
    const grades = getEffectiveGrades([2, 3, 4]);

    const STORIES_POOL = [
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Felix hat 36 bunte Murmeln gesammelt. Zum Geburtstag bekommt er von seiner Oma noch 18 Murmeln geschenkt.",
    "question": "Wie viele Murmeln hat Felix jetzt zusammen?",
    "calculation": "36 + 18",
    "answer": 54,
    "unit": "Murmeln",
    "answerText": "Felix hat jetzt 54 Murmeln.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "In der 2. Klasse sind 24 Kinder. Heute sind 7 Kinder wegen einer Erkältung krank zu Hause.",
    "question": "Wie viele Kinder sind heute in der Schule anwesend?",
    "calculation": "24 − 7",
    "answer": 17,
    "unit": "Kinder",
    "answerText": "Es sind heute 17 Kinder in der Schule.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Eine Eintrittskarte für den Tiergarten Schönbrunn kostet 8 Euro. Eine Familie kauft 4 Karten.",
    "question": "Wie viel Euro muss die Familie an der Kasse insgesamt bezahlen?",
    "calculation": "4 · 8",
    "answer": 32,
    "unit": "Euro",
    "answerText": "Die Familie bezahlt 32 Euro.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Die Lehrerin hat 28 neue Buntstifte gekauft und verteilt sie gleichmäßig auf 4 Gruppentische.",
    "question": "Wie viele Buntstifte bekommt jeder Tisch?",
    "calculation": "28 : 4",
    "answer": 7,
    "unit": "Buntstifte",
    "answerText": "Jeder Tisch bekommt 7 Buntstifte.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Im Schulgarten pflanzen die Kinder 45 rote Tulpen und 27 gelbe Narzissen.",
    "question": "Wie viele Blumen pflanzen die Kinder insgesamt?",
    "calculation": "45 + 27",
    "answer": 72,
    "unit": "Blumen",
    "answerText": "Die Kinder pflanzen 72 Blumen.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Am Obststand liegen 63 Äpfel. Eine Kundin kauft 15 Äpfel für ein Schulfest.",
    "question": "Wie viele Äpfel bleiben am Obststand noch übrig?",
    "calculation": "63 − 15",
    "answer": 48,
    "unit": "Äpfel",
    "answerText": "Es bleiben 48 Äpfel übrig.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Bäcker legt auf jedes Backblech 6 frische Semmeln. Er schiebt 5 Bleche in den Ofen.",
    "question": "Wie viele Semmeln backt der Bäcker auf den 5 Blechen zusammen?",
    "calculation": "5 · 6",
    "answer": 30,
    "unit": "Semmeln",
    "answerText": "Der Bäcker backt 30 Semmeln.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Opa verteilt 35 Euro Taschengeld gleichmäßig an seine 5 Enkelkinder.",
    "question": "Wie viel Euro bekommt jedes Enkelkind?",
    "calculation": "35 : 5",
    "answer": 7,
    "unit": "Euro",
    "answerText": "Jedes Enkelkind bekommt 7 Euro.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Auf dem Pausenhof hüpfen 19 Mädchen und 26 Buben mit dem Springseil.",
    "question": "Wie viele Kinder hüpfen dort insgesamt Seil?",
    "calculation": "19 + 26",
    "answer": 45,
    "unit": "Kinder",
    "answerText": "Es hüpfen insgesamt 45 Kinder.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Lukas hat 50 Euro in seiner Spardose. Er kauft ein tolles Buch um 18 Euro.",
    "question": "Wie viel Euro bleiben Lukas nach dem Kauf noch übrig?",
    "calculation": "50 − 18",
    "answer": 32,
    "unit": "Euro",
    "answerText": "Lukas bleiben noch 32 Euro übrig.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "In einer Schachtel Pralinen liegen 7 Reihen mit jeweils 4 Pralinen.",
    "question": "Wie viele Pralinen sind insgesamt in der Schachtel?",
    "calculation": "7 · 4",
    "answer": 28,
    "unit": "Pralinen",
    "answerText": "Es sind insgesamt 28 Pralinen in der Schachtel.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Sportlehrer hat 36 Tennisbälle. Er teilt sie gleichmäßig in 6 Dosen auf.",
    "question": "Wie viele Bälle kommen in jede Dose?",
    "calculation": "36 : 6",
    "answer": 6,
    "unit": "Tennisbälle",
    "answerText": "In jede Dose kommen 6 Tennisbälle.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Auf einer Blumenwiese flattern 28 Zitronenfalter und 34 Schwalbenschwänze.",
    "question": "Wie viele Schmetterlinge sind das insgesamt?",
    "calculation": "28 + 34",
    "answer": 62,
    "unit": "Schmetterlinge",
    "answerText": "Es sind insgesamt 62 Schmetterlinge.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Bauer hat 84 Eier gesammelt. Auf dem Markt verkauft er 49 Eier.",
    "question": "Wie viele Eier hat der Bauer noch übrig?",
    "calculation": "84 − 49",
    "answer": 35,
    "unit": "Eier",
    "answerText": "Der Bauer hat noch 35 Eier übrig.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Kaninchen frisst jeden Tag 3 Karotten. Wie viele Karotten frisst es in einer Woche (7 Tage)?",
    "question": "Wie viele Karotten frisst das Kaninchen in 7 Tagen?",
    "calculation": "7 · 3",
    "answer": 21,
    "unit": "Karotten",
    "answerText": "Das Kaninchen frisst 21 Karotten.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "4 Freunde teilen sich die Kosten für ein Spielzeug um 24 Euro zu gleichen Teilen.",
    "question": "Wie viel Euro muss jedes Kind bezahlen?",
    "calculation": "24 : 4",
    "answer": 6,
    "unit": "Euro",
    "answerText": "Jedes Kind muss 6 Euro bezahlen.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Im Bus sitzen 38 Fahrgäste. An der nächsten Haltestelle steigen noch 16 Fahrgäste ein.",
    "question": "Wie viele Fahrgäste fahren jetzt im Bus mit?",
    "calculation": "38 + 16",
    "answer": 54,
    "unit": "Fahrgäste",
    "answerText": "Jetzt fahren 54 Fahrgäste mit.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Buch hat 92 Seiten. Anna hat bereits 56 Seiten mit Begeisterung gelesen.",
    "question": "Wie viele Seiten muss Anna noch lesen, um das Buch zu beenden?",
    "calculation": "92 − 56",
    "answer": 36,
    "unit": "Seiten",
    "answerText": "Anna muss noch 36 Seiten lesen.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "In einem Klassenzimmer stehen 8 Gruppentische mit jeweils 3 Sesseln.",
    "question": "Wie viele Sessel stehen insgesamt an den Gruppentischen?",
    "calculation": "8 · 3",
    "answer": 24,
    "unit": "Sessel",
    "answerText": "Es stehen 24 Sessel an den Tischen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Eine Mutter verteilt 40 Weintrauben gleichmäßig an ihre 4 Kinder.",
    "question": "Wie viele Weintrauben bekommt jedes Kind?",
    "calculation": "40 : 4",
    "answer": 10,
    "unit": "Weintrauben",
    "answerText": "Jedes Kind bekommt 10 Weintrauben.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Im Turnsaal liegen 47 kleine Matten und 35 große Weichböden.",
    "question": "Wie viele Turnmatten liegen insgesamt im Turnsaal?",
    "calculation": "47 + 35",
    "answer": 82,
    "unit": "Matten",
    "answerText": "Es liegen 82 Matten im Turnsaal.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Vogelhäuschen enthielt 75 Sonnenblumenkerne. Die Meisen haben 38 Kerne weggepickt.",
    "question": "Wie viele Kerne sind jetzt noch im Futterhäuschen?",
    "calculation": "75 − 38",
    "answer": 37,
    "unit": "Kerne",
    "answerText": "Es sind noch 37 Kerne im Häuschen.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Blumenstrauß besteht aus 9 bunten Tulpen. Ein Florist bindet 4 gleiche Sträuße.",
    "question": "Wie viele Tulpen benötigt der Florist für alle 4 Sträuße?",
    "calculation": "4 · 9",
    "answer": 36,
    "unit": "Tulpen",
    "answerText": "Er benötigt 36 Tulpen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Förster pflanzt 30 kleine Tannenbäume in 5 gleich langen Reihen an.",
    "question": "Wie viele Tannenbäume stehen in jeder Reihe?",
    "calculation": "30 : 5",
    "answer": 6,
    "unit": "Bäume",
    "answerText": "In jeder Reihe stehen 6 Bäume.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Auf einem Parkplatz stehen am Morgen 58 Autos. Am Vormittag kommen 27 Autos dazu.",
    "question": "Wie viele Autos stehen jetzt auf dem Parkplatz?",
    "calculation": "58 + 27",
    "answer": 85,
    "unit": "Autos",
    "answerText": "Es stehen jetzt 85 Autos auf dem Parkplatz.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "In einer Kiste mit 100 Bausteinen fehlen 34 Bausteine.",
    "question": "Wie viele Bausteine sind noch in der Kiste?",
    "calculation": "100 − 34",
    "answer": 66,
    "unit": "Bausteine",
    "answerText": "Es sind noch 66 Bausteine in der Kiste.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Auf jedem Ast eines Apfelbaumes hängen 7 reife Äpfel. Es gibt 6 tragende Äste.",
    "question": "Wie viele Äpfel hängen an den 6 Ästen zusammen?",
    "calculation": "6 · 7",
    "answer": 42,
    "unit": "Äpfel",
    "answerText": "Es hängen 42 Äpfel an den Ästen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Schäfer verteilt 45 Schafe gleichmäßig auf 5 verschiedene Koppeln.",
    "question": "Wie viele Schafe grasen auf jeder Koppel?",
    "calculation": "45 : 5",
    "answer": 9,
    "unit": "Schafe",
    "answerText": "Auf jeder Koppel grasen 9 Schafe.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Lisa sammelt Sticker. Sie hat 64 Sticker im Album und klebt heute noch 29 neue Sticker ein.",
    "question": "Wie viele Sticker hat Lisa jetzt in ihrem Album?",
    "calculation": "64 + 29",
    "answer": 93,
    "unit": "Sticker",
    "answerText": "Lisa hat jetzt 93 Sticker im Album.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Imker hat 72 Gläser Honig abgefüllt. Er verschenkt 28 Gläser an Verwandte.",
    "question": "Wie viele Gläser Honig hat der Imker noch?",
    "calculation": "72 − 28",
    "answer": 44,
    "unit": "Gläser",
    "answerText": "Der Imker hat noch 44 Gläser Honig.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Eine Katze fängt in einer Woche jeden Tag 2 Mäuse. Wie viele Mäuse fängt sie in 7 Tagen?",
    "question": "Wie viele Mäuse fängt die Katze in einer Woche?",
    "calculation": "7 · 2",
    "answer": 14,
    "unit": "Mäuse",
    "answerText": "Die Katze fängt 14 Mäuse.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Lehrer teilt 27 Schulkinder in 3 gleich große Mannschaften für Völkerball auf.",
    "question": "Wie viele Kinder spielen in jeder Mannschaft?",
    "calculation": "27 : 3",
    "answer": 9,
    "unit": "Kinder",
    "answerText": "In jeder Mannschaft spielen 9 Kinder.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Im Hallenbad schwimmen 43 Kinder im großen Becken und 28 Kinder im Nichtschwimmerbecken.",
    "question": "Wie viele Kinder schwimmen insgesamt im Hallenbad?",
    "calculation": "43 + 28",
    "answer": 71,
    "unit": "Kinder",
    "answerText": "Es schwimmen 71 Kinder im Hallenbad.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Eine Packung Kreide enthält 50 Stück. Die Lehrerin hat 23 Stück verbraucht.",
    "question": "Wie viele Kreidestücke sind noch in der Schachtel?",
    "calculation": "50 − 23",
    "answer": 27,
    "unit": "Stück",
    "answerText": "Es sind noch 27 Kreidestücke in der Schachtel.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 2,
    "schulstufe": 2,
    "lehrplanRef": "M-2-Sachaufgaben",
    "story": "Ein Bäcker backt 8 Bleche mit jeweils 6 Semmeln. Wie viele Semmeln sind das?",
    "question": "Wie viele Semmeln backt der Bäcker insgesamt?",
    "calculation": "8 · 6",
    "answer": 48,
    "unit": "Semmeln",
    "answerText": "Der Bäcker backt 48 Semmeln.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Bäcker in Wien backt frühmorgens 320 frische Semmeln. Am Vormittag verkauft er 245 Semmeln.",
    "question": "Wie viele Semmeln sind am Mittag noch übrig?",
    "calculation": "320 − 245",
    "answer": 75,
    "unit": "Semmeln",
    "answerText": "Es sind noch 75 Semmeln übrig.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Lukas spart für ein neues Mountainbike, das 450 Euro kostet. Er hat bereits 315 Euro in seiner Spardose.",
    "question": "Wie viel Euro fehlen Lukas noch zum Kauf des Fahrrads?",
    "calculation": "450 − 315",
    "answer": 135,
    "unit": "Euro",
    "answerText": "Lukas fehlen noch 135 Euro.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "In der Schulbibliothek stehen 8 Regale mit jeweils 60 spannenden Büchern.",
    "question": "Wie viele Bücher stehen insgesamt in diesen Regalen?",
    "calculation": "8 · 60",
    "answer": 480,
    "unit": "Bücher",
    "answerText": "Es stehen insgesamt 480 Bücher in den Regalen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Bauer erntet 360 kg Äpfel. Er füllt sie gleichmäßig in 6 große Holzkisten.",
    "question": "Wie viel Kilogramm (kg) Äpfel sind in jeder Holzkiste?",
    "calculation": "360 : 6",
    "answer": 60,
    "unit": "kg",
    "answerText": "In jeder Holzkiste sind 60 kg Äpfel.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Eine Schule hat 248 Schulkinder. Für den Herbstausflug melden sich noch 37 neue Vorschulkinder an.",
    "question": "Wie viele Kinder nehmen insgesamt am Ausflug teil?",
    "calculation": "248 + 37",
    "answer": 285,
    "unit": "Kinder",
    "answerText": "Es nehmen 285 Kinder am Ausflug teil.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Wanderer geht einen 750 Meter langen Weg hinauf und hat bereits 420 Meter geschafft.",
    "question": "Wie viele Meter (m) muss der Wanderer noch gehen?",
    "calculation": "750 − 420",
    "answer": 330,
    "unit": "m",
    "answerText": "Der Wanderer muss noch 330 m gehen.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Kinosaal hat 9 Reihen mit jeweils 30 bequemen Sesseln.",
    "question": "Wie viele Sessel hat der Kinosaal insgesamt?",
    "calculation": "9 · 30",
    "answer": 270,
    "unit": "Sessel",
    "answerText": "Der Kinosaal hat 270 Sessel.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Saftladen presst 400 Liter frischen Apfelsaft und füllt ihn in 4 große Fässer gleichmäßig ab.",
    "question": "Wie viel Liter (l) Saft enthält jedes Fass?",
    "calculation": "400 : 4",
    "answer": 100,
    "unit": "l",
    "answerText": "Jedes Fass enthält 100 l Saft.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Zoo füttert den Elefanten am Vormittag mit 135 kg Heu und am Nachmittag mit 145 kg Heu.",
    "question": "Wie viel Kilogramm (kg) Heu frisst der Elefant an diesem Tag?",
    "calculation": "135 + 145",
    "answer": 280,
    "unit": "kg",
    "answerText": "Der Elefant frisst 280 kg Heu.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Zug fährt eine Strecke von 500 Kilometern. Nach 340 Kilometern legt er einen Zwischenstopp ein.",
    "question": "Wie viele Kilometer (km) verbleiben noch bis zum Zielbahnhof?",
    "calculation": "500 − 340",
    "answer": 160,
    "unit": "km",
    "answerText": "Es verbleiben noch 160 km.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "In einer Druckerei werden 7 Pakete mit Schulheften verpackt. Jedes Paket enthält 50 Hefte.",
    "question": "Wie viele Schulhefte sind insgesamt verpackt worden?",
    "calculation": "7 · 50",
    "answer": 350,
    "unit": "Hefte",
    "answerText": "Es sind insgesamt 350 Hefte verpackt.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Verein hat 540 Euro für Sportgeräte gesammelt und kauft 9 neue Fußbälle zum gleichen Preis.",
    "question": "Wie viel Euro kostet ein einzelner Fußball?",
    "calculation": "540 : 9",
    "answer": 60,
    "unit": "Euro",
    "answerText": "Ein Fußball kostet 60 Euro.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Auf einer Almhütte trinken Wanderer am Wochenende 265 Liter Milch und 380 Liter Wasser.",
    "question": "Wie viel Liter Getränke wurden an diesem Wochenende getrunken?",
    "calculation": "265 + 380",
    "answer": 645,
    "unit": "l",
    "answerText": "Es wurden 645 l Getränke getrunken.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Händler hat 800 Packungen Mehl im Lager. Er liefert 520 Packungen an Supermärkte aus.",
    "question": "Wie viele Packungen Mehl lagern noch im Lager?",
    "calculation": "800 − 520",
    "answer": 280,
    "unit": "Packungen",
    "answerText": "Es lagern noch 280 Packungen Mehl.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Waldarbeiter pflanzt an 4 Tagen jeweils 80 junge Lärchenbäume.",
    "question": "Wie viele Lärchenbäume pflanzt der Waldarbeiter in diesen 4 Tagen?",
    "calculation": "4 · 80",
    "answer": 320,
    "unit": "Bäume",
    "answerText": "Er pflanzt 320 Bäume.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Eine Bäckerei teilt 210 Kipferl gleichmäßig auf 3 Verkaufskörbe auf.",
    "question": "Wie viele Kipferl liegen in jedem Korb?",
    "calculation": "210 : 3",
    "answer": 70,
    "unit": "Kipferl",
    "answerText": "In jedem Korb liegen 70 Kipferl.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Auf einer Baustelle werden 350 kg Zement am Montag und 420 kg Zement am Dienstag verbraucht.",
    "question": "Wie viel Kilogramm Zement wurden an beiden Tagen zusammen verarbeitet?",
    "calculation": "350 + 420",
    "answer": 770,
    "unit": "kg",
    "answerText": "Es wurden 770 kg Zement verarbeitet.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein LKW hat 950 Flaschen Mineralwasser geladen. Bei der ersten Raststätte lädt er 380 Flaschen ab.",
    "question": "Wie viele Flaschen Mineralwasser bleiben auf der Ladefläche?",
    "calculation": "950 − 380",
    "answer": 570,
    "unit": "Flaschen",
    "answerText": "Es bleiben noch 570 Flaschen auf der Ladefläche.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Eine Schule kauft 6 neue Tablet-Schutzhüllen zu je 40 Euro.",
    "question": "Wie viel Euro kosten die 6 Schutzhüllen insgesamt?",
    "calculation": "6 · 40",
    "answer": 240,
    "unit": "Euro",
    "answerText": "Die Schutzhüllen kosten 240 Euro.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Imker gewinnt 320 kg Waldhonig und füllt ihn in Gläser zu je 1 kg ab. Er packt sie in 8 Kisten.",
    "question": "Wie viele Gläser Honig kommen in jede Kiste?",
    "calculation": "320 : 8",
    "answer": 40,
    "unit": "Gläser",
    "answerText": "In jede Kiste kommen 40 Gläser Honig.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Gärtner erntet 180 kg Erdbeeren im Juni und 240 kg Erdbeeren im Juli.",
    "question": "Wie viel Kilogramm Erdbeeren erntet der Gärtner in beiden Monaten?",
    "calculation": "180 + 240",
    "answer": 420,
    "unit": "kg",
    "answerText": "Der Gärtner erntet 420 kg Erdbeeren.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Von einer 600 Meter langen Stoffrolle schneidet die Schneiderin 270 Meter für Vorhänge ab.",
    "question": "Wie viele Meter Stoff bleiben auf der Rolle übrig?",
    "calculation": "600 − 270",
    "answer": 330,
    "unit": "m",
    "answerText": "Es bleiben 330 m Stoff übrig.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Fahrradgeschäft verkauft 5 Helme zu je 70 Euro.",
    "question": "Wie viel Euro nimmt das Geschäft mit diesen 5 Helmen ein?",
    "calculation": "5 · 70",
    "answer": 350,
    "unit": "Euro",
    "answerText": "Das Geschäft nimmt 350 Euro ein.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "480 Schüler einer Schule reisen mit 8 Reisebussen zum Wandertag.",
    "question": "Wie viele Schüler sitzen in jedem Reisebus, wenn alle gleich voll sind?",
    "calculation": "480 : 8",
    "answer": 60,
    "unit": "Schüler",
    "answerText": "In jedem Bus sitzen 60 Schüler.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "In einer Halle lagern 430 kg Äpfel und 390 kg Birnen.",
    "question": "Wie viel Kilogramm Obst lagern insgesamt in der Halle?",
    "calculation": "430 + 390",
    "answer": 820,
    "unit": "kg",
    "answerText": "Es lagern 820 kg Obst in der Halle.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Wasserbehälter fasst 1 000 Liter. Es werden 450 Liter zur Bewässerung entnommen.",
    "question": "Wie viel Liter Wasser verbleiben im Behälter?",
    "calculation": "1000 − 450",
    "answer": 550,
    "unit": "l",
    "answerText": "Es verbleiben 550 l Wasser im Behälter.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Holzhändler stapelt 8 Reihen mit jeweils 90 Holzscheiten.",
    "question": "Wie viele Holzscheite liegen in diesem Stapel?",
    "calculation": "8 · 90",
    "answer": 720,
    "unit": "Holzscheite",
    "answerText": "Es liegen 720 Holzscheite im Stapel.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Schulchor verteilt 350 Notenblätter gleichmäßig auf 5 Stimmgruppen.",
    "question": "Wie viele Notenblätter erhält jede Gruppe?",
    "calculation": "350 : 5",
    "answer": 70,
    "unit": "Notenblätter",
    "answerText": "Jede Gruppe erhält 70 Notenblätter.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Eine Bergsteigergruppe bewältigt vormittags 340 Höhenmeter und nachmittags 280 Höhenmeter.",
    "question": "Wie viele Höhenmeter ist die Gruppe insgesamt gewandert?",
    "calculation": "340 + 280",
    "answer": 620,
    "unit": "Höhenmeter",
    "answerText": "Die Gruppe ist 620 Höhenmeter gewandert.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "In einer Schafherde mit 520 Schafen werden 180 Schafe auf die Nachbarweide getrieben.",
    "question": "Wie viele Schafe verbleiben auf der ursprünglichen Weide?",
    "calculation": "520 − 180",
    "answer": 340,
    "unit": "Schafe",
    "answerText": "Es verbleiben 340 Schafe.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Sportgeschäft verkauft 7 Paar Skistöcke zu je 30 Euro.",
    "question": "Wie viel Euro kosten die 7 Paar Skistöcke zusammen?",
    "calculation": "7 · 30",
    "answer": 210,
    "unit": "Euro",
    "answerText": "Die Skistöcke kosten 210 Euro.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Bauer füllt 630 Liter Milch in 9 Milchkannen gleicher Größe.",
    "question": "Wie viel Liter Milch passen in eine Kanne?",
    "calculation": "630 : 9",
    "answer": 70,
    "unit": "l",
    "answerText": "In eine Kanne passen 70 l Milch.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "In einer Bibliothek wurden 560 Bücher im Frühjahr und 290 Bücher im Sommer ausgeliehen.",
    "question": "Wie viele Bücher wurden in beiden Jahreszeiten zusammen ausgeliehen?",
    "calculation": "560 + 290",
    "answer": 850,
    "unit": "Bücher",
    "answerText": "Es wurden 850 Bücher ausgeliehen.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Zirkus hat 700 Sitzplätze. 460 Plätze sind bereits von Zuschauern belegt.",
    "question": "Wie viele Sitzplätze sind im Zirkuszelt noch frei?",
    "calculation": "700 − 460",
    "answer": 240,
    "unit": "Plätze",
    "answerText": "Es sind noch 240 Plätze frei.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 3,
    "schulstufe": 3,
    "lehrplanRef": "M-3-Sachaufgaben",
    "story": "Ein Bäckermeister backt 9 Bleche mit je 40 Krapfen für den Faschingsdienstag.",
    "question": "Wie viele Krapfen backt der Bäcker auf allen 9 Blechen zusammen?",
    "calculation": "9 · 40",
    "answer": 360,
    "unit": "Krapfen",
    "answerText": "Der Bäcker backt 360 Krapfen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Für ein Schulfest kauft die 4. Klasse 5 Packungen Mehl zu je 100 dag und 2 Packungen Zucker zu je 50 dag.",
    "question": "Wie viel Dekagramm (dag) wiegen die Einkäufe insgesamt?",
    "calculation": "500 + 100",
    "answer": 600,
    "unit": "dag",
    "answerText": "Die Einkäufe wiegen 600 dag.",
    "hint": "Wandle zuerst beide Zutaten in dag um (5 · 100 dag und 2 · 50 dag) und zähle die beiden Mengen zusammen."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Wanderer geht am Vormittag 12 km und am Nachmittag 9 km auf dem Weitwanderweg.",
    "question": "Wie viele Meter (m) ist der Wanderer an diesem Tag insgesamt gewandert?",
    "calculation": "21 · 1000",
    "answer": 21000,
    "unit": "m",
    "answerText": "Der Wanderer ist 21 000 m gewandert.",
    "hint": "Zähle zuerst die Kilometer beider Etappen zusammen (12 km + 9 km) und wandle das Ergebnis in Meter um (1 km = 1 000 m)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Lastwagen transportiert 4 Tonnen Sand. Auf der ersten Baustelle werden 1 500 kg abgeladen.",
    "question": "Wie viel Kilogramm (kg) Sand verbleiben auf dem Lastwagen?",
    "calculation": "4000 − 1500",
    "answer": 2500,
    "unit": "kg",
    "answerText": "Es verbleiben 2 500 kg Sand auf dem Lastwagen.",
    "hint": "Wandle zuerst die Tonnen in Kilogramm um (1 Tonne = 1 000 kg) und ziehe die abgeladene Menge ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Wassertank fasst 6 Hektoliter (hl) Wasser. Es werden 250 Liter zur Gartenbewässerung entnommen.",
    "question": "Wie viel Liter (l) Wasser bleiben im Tank übrig?",
    "calculation": "600 − 250",
    "answer": 350,
    "unit": "l",
    "answerText": "Es bleiben 350 l Wasser übrig.",
    "hint": "Wandle zuerst die Hektoliter in Liter um (1 hl = 100 Liter) und ziehe das entnommene Wasser ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Flugzeug fliegt in der ersten Stunde 650 km und in der zweiten Stunde 720 km.",
    "question": "Wie viele Kilometer (km) hat das Flugzeug in beiden Stunden zurückgelegt?",
    "calculation": "650 + 720",
    "answer": 1370,
    "unit": "km",
    "answerText": "Das Flugzeug hat 1 370 km zurückgelegt.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Eine Stadt plant einen neuen Spielplatz für 45 000 Euro. Das Land fördert das Projekt mit 18 000 Euro.",
    "question": "Wie viel Euro muss die Stadtgemeinde selbst für den Spielplatz bezahlen?",
    "calculation": "45000 − 18000",
    "answer": 27000,
    "unit": "Euro",
    "answerText": "Die Stadtgemeinde muss 27 000 Euro bezahlen.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Frachtschiff auf der Donau transportiert 8 Container mit jeweils 25 Tonnen Getreide.",
    "question": "Wie viele Tonnen (t) Getreide transportiert das Schiff insgesamt?",
    "calculation": "8 · 25",
    "answer": 200,
    "unit": "t",
    "answerText": "Das Schiff transportiert 200 t Getreide.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Schotterwerk teilt 3 600 Tonnen Kies gleichmäßig auf 6 Güterzüge auf.",
    "question": "Wie viele Tonnen (t) Kies lädt jeder Güterzug?",
    "calculation": "3600 : 6",
    "answer": 600,
    "unit": "t",
    "answerText": "Jeder Güterzug lädt 600 t Kies.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "In einem Waldgebiet wurden im Frühjahr 12 500 Tannen und im Herbst 8 300 Fichten gepflanzt.",
    "question": "Wie viele Bäume wurden in diesem Jahr insgesamt gepflanzt?",
    "calculation": "12500 + 8300",
    "answer": 20800,
    "unit": "Bäume",
    "answerText": "Es wurden 20 800 Bäume gepflanzt.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Bauunternehmer hat ein Budget von 80 000 Euro. Er bezahlt Rechnungen in Höhe von 53 000 Euro.",
    "question": "Wie viel Euro verbleiben noch in seinem Budget?",
    "calculation": "80000 − 53000",
    "answer": 27000,
    "unit": "Euro",
    "answerText": "Es verbleiben noch 27 000 Euro.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Solarkraftwerk erzeugt an einem sonnigen Tag in jeder Stunde 150 Kilowattstunden Strom. Es scheint 8 Stunden lang die Sonne.",
    "question": "Wie viele Kilowattstunden (kWh) Strom erzeugt das Kraftwerk an diesem Tag?",
    "calculation": "8 · 150",
    "answer": 1200,
    "unit": "kWh",
    "answerText": "Das Kraftwerk erzeugt 1 200 kWh Strom.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Eine Molkerei füllt 15 000 Liter Milch in Großkanister zu je 50 Liter ab.",
    "question": "Wie viele Kanister werden vollständig gefüllt?",
    "calculation": "15000 : 50",
    "answer": 300,
    "unit": "Kanister",
    "answerText": "Es werden 300 Kanister gefüllt.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Museum verzeichnete am Samstag 1 450 Besucher und am Sonntag 1 850 Besucher.",
    "question": "Wie viele Besucher kamen an diesem Wochenende insgesamt ins Museum?",
    "calculation": "1450 + 1850",
    "answer": 3300,
    "unit": "Besucher",
    "answerText": "Es kamen 3 300 Besucher ins Museum.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Stausee fasst maximal 50 000 Hektoliter Wasser. Aktuell sind 32 000 Hektoliter enthalten.",
    "question": "Wie viele Hektoliter (hl) Wasser fehlen noch zur Vollfüllung?",
    "calculation": "50000 − 32000",
    "answer": 18000,
    "unit": "hl",
    "answerText": "Es fehlen noch 18 000 hl Wasser.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Großhändler liefert 25 Kisten Orangen zu je 40 kg.",
    "question": "Wie viel Kilogramm (kg) Orangen liefert der Händler insgesamt?",
    "calculation": "25 · 40",
    "answer": 1000,
    "unit": "kg",
    "answerText": "Der Händler liefert 1 000 kg Orangen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Eine Spende von 24 000 Euro wird zu gleichen Teilen an 4 Tierheime überwiesen.",
    "question": "Wie viel Euro erhält jedes einzelne Tierheim?",
    "calculation": "24000 : 4",
    "answer": 6000,
    "unit": "Euro",
    "answerText": "Jedes Tierheim erhält 6 000 Euro.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Auf einer Autobahnbrücke passieren vormittags 14 200 Fahrzeuge und nachmittags 18 700 Fahrzeuge die Zählstelle.",
    "question": "Wie viele Fahrzeuge wurden an diesem Tag insgesamt gezählt?",
    "calculation": "14200 + 18700",
    "answer": 32900,
    "unit": "Fahrzeuge",
    "answerText": "Es wurden 32 900 Fahrzeuge gezählt.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Öltank enthielt 25 000 Liter Heizöl. Im Winter wurden 16 500 Liter verbraucht.",
    "question": "Wie viel Liter Heizöl sind noch im Tank?",
    "calculation": "25000 − 16500",
    "answer": 8500,
    "unit": "l",
    "answerText": "Es sind noch 8 500 l Heizöl im Tank.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Bauer erntet auf 12 Feldern durchschnittlich jeweils 35 Tonnen Weizen.",
    "question": "Wie viele Tonnen (t) Weizen erntet der Bauer insgesamt?",
    "calculation": "12 · 35",
    "answer": 420,
    "unit": "t",
    "answerText": "Der Bauer erntet 420 t Weizen.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Papierwerk stellt 48 000 Hefte her und verpackt sie in Kartons zu je 80 Stück.",
    "question": "Wie viele Kartons werden benötigt?",
    "calculation": "48000 : 80",
    "answer": 600,
    "unit": "Kartons",
    "answerText": "Es werden 600 Kartons benötigt.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Schwimmbecken wird mit 250 000 Liter Wasser aus der Quelle und 180 000 Liter Leitungswasser gefüllt.",
    "question": "Wie viel Liter Wasser befinden sich danach im Becken?",
    "calculation": "250000 + 180000",
    "answer": 430000,
    "unit": "l",
    "answerText": "Es befinden sich 430 000 l Wasser im Becken.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Sportstadion bietet Platz für 30 000 Zuschauer. 21 500 Eintrittskarten sind verkauft.",
    "question": "Wie viele Plätze sind im Stadion noch frei?",
    "calculation": "30000 − 21500",
    "answer": 8500,
    "unit": "Plätze",
    "answerText": "Es sind noch 8 500 Plätze frei.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Transportzug besteht aus 15 Waggons. Jeder Waggon ist mit 40 Tonnen Eisenerz beladen.",
    "question": "Wie viele Tonnen (t) Eisenerz befördert der Güterzug insgesamt?",
    "calculation": "15 · 40",
    "answer": 600,
    "unit": "t",
    "answerText": "Der Güterzug befördert 600 t Eisenerz.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Eine Schulbehörde verteilt 72 000 Schulbücher gleichmäßig an 9 Schulbezirke.",
    "question": "Wie viele Schulbücher erhält jeder Bezirk?",
    "calculation": "72000 : 9",
    "answer": 8000,
    "unit": "Bücher",
    "answerText": "Jeder Bezirk erhält 8 000 Bücher.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Schiff fährt auf einer Flussreise 340 km stromaufwärts und 480 km stromabwärts.",
    "question": "Wie viele Kilometer (km) ist das Schiff insgesamt gefahren?",
    "calculation": "340 + 480",
    "answer": 820,
    "unit": "km",
    "answerText": "Das Schiff ist 820 km gefahren.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein neues Schulgebäude kostet 500 000 Euro. Es wurden bereits Rechnungen von 385 000 Euro bezahlt.",
    "question": "Wie viel Euro sind noch offen?",
    "calculation": "500000 − 385000",
    "answer": 115000,
    "unit": "Euro",
    "answerText": "Es sind noch 115 000 Euro offen.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Windrad erzeugt täglich 20 000 Kilowattstunden Strom. Ein Windpark hat 6 identische Windräder.",
    "question": "Wie viele Kilowattstunden (kWh) Strom erzeugt der Windpark an einem Tag?",
    "calculation": "6 · 20000",
    "answer": 120000,
    "unit": "kWh",
    "answerText": "Der Windpark erzeugt 120 000 kWh Strom.",
    "hint": "Überlege: Wenn mehrere gleiche Gruppen vorhanden sind, hilft die Malrechnung (·). Multipliziere die Gruppenanzahl mit der Menge je Gruppe."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Speicherbecken mit 64 000 Liter Wasser wird über 8 identische Rohre gleichmäßig entleert.",
    "question": "Wie viel Liter Wasser fließen durch jedes Rohr?",
    "calculation": "64000 : 8",
    "answer": 8000,
    "unit": "l",
    "answerText": "Durch jedes Rohr fließen 8 000 l Wasser.",
    "hint": "Überlege: Wenn eine Gesamtmenge gleichmäßig und gerecht aufgeteilt wird, hilft die Geteiltrechnung (:). Teile das Ganze durch die Anzahl der Teile."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "In einer großen Gärtnerei blühen 140 000 Stiefmütterchen und 160 000 Primeln.",
    "question": "Wie viele Frühlingsblumen blühen insgesamt in der Gärtnerei?",
    "calculation": "140000 + 160000",
    "answer": 300000,
    "unit": "Blumen",
    "answerText": "Es blühen 300 000 Blumen in der Gärtnerei.",
    "hint": "Überlege: Wenn Mengen zusammenkommen oder hinzukommen, wird das Gesamte mehr. Verbinde die Teilmengen mit Plus (+)."
  },
  {
    "grade": 4,
    "schulstufe": 4,
    "lehrplanRef": "M-4-Sachaufgaben",
    "story": "Ein Waldbrand zerstörte 45 000 Quadratmeter Wald. Durch Aufforstung wurden bereits 28 000 Quadratmeter neu bepflanzt.",
    "question": "Wie viele Quadratmeter (m²) Wald müssen noch bepflanzt werden?",
    "calculation": "45000 − 28000",
    "answer": 17000,
    "unit": "m²",
    "answerText": "Es müssen noch 17 000 m² bepflanzt werden.",
    "hint": "Überlege: Wenn etwas abgegeben, verbraucht oder weggenommen wird, bleibt ein Rest übrig. Ziehe die Menge mit Minus (−) ab."
  }
];

    let pool = [];
    if (opts && opts.grade) {
      pool = STORIES_POOL.filter(s => s.grade === opts.grade);
    } else if (opts && opts.all) {
      pool = STORIES_POOL;
    } else {
      if (grades.includes(2)) pool.push(...STORIES_POOL.filter(s => s.grade === 2));
      if (grades.includes(3)) pool.push(...STORIES_POOL.filter(s => s.grade === 3));
      if (grades.includes(4)) pool.push(...STORIES_POOL.filter(s => s.grade === 4));
      if (pool.length === 0) pool = STORIES_POOL.filter(s => s.grade === 2);
    }

    const targetCount = (opts && opts.forPrint) ? 3 : ((opts && opts.all) ? pool.length : 5);
    const chosen = (opts && opts.all) ? pool : shuffle(pool).slice(0, targetCount);
    return chosen.map(s => ({
      fach: 'mathe',
      schulstufe: s.schulstufe || (opts && opts.grade) || 3,
      grade: s.grade || (opts && opts.grade) || 3,
      lehrplanRef: s.lehrplanRef || 'M-2/4-Sachrechnen-Modellieren',
      type: 'text-problem',
      story: s.story,
      question: s.question,
      calculation: s.calculation,
      answer: s.answer,
      unit: s.unit,
      answerText: s.answerText,
      solutionText: `R: ${s.calculation} = ${s.answer} ${s.unit || ''}`.trim(),
      hint: s.hint,
      userAnswer: '',
      isCorrect: null,
    }));
  }

  // 11. MENGEN- & ZWANZIGERFELD (1. Klasse mit blauen & roten Wendeplättchen)
  function buildTwentyFieldTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const targetCount = (opts && opts.forPrint) ? 4 : 5;
    const tasks = [];
    for (let i = 0; i < targetCount; i++) {
      const a = rand(6, 9);
      const toTen = 10 - a;
      const overTen = rand(2, 5);
      const b = toTen + overTen;
      const total = a + b;

      tasks.push({
        fach: "mathe",
        schulstufe: 1,
        grade: 1,
        lehrplanRef: "M-1-Zahlenraum-20",
        type: "twenty-field",
        a: a,
        b: b,
        val: total,
        total: total,
        prompt: `Zeichne ${total} Punkte in das Zwanzigerfeld ein und zerlege in Zehner und Einer:`,
        question: `Wie viele Punkte siehst du insgesamt im Zwanzigerfeld? Rechne: ${a} + ${b} = ?`,
        hint: `Tipp: Zähle zuerst die Lücken bis zum vollen Zehner 10 auf (Stopp bei 10!) und addiere dann die restlichen Punkte der zweiten Reihe.`,
        answer: total,
        solutionText: String(total),
        userAnswer: '',
        isCorrect: null,
      });
    }
    return tasks;
  }

  // 12. SCHRIFTLICHE RECHENVERFAHREN (3. & 4. Klasse: Untereinander mit Übertrag)
  function buildWrittenMathTasks(options) {
    const opts = (typeof options === 'object' && options !== null) ? options : { seed: options };
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const grades = getEffectiveGrades([3, 4]);
    const targetGrade = opts.grade || (grades.includes(4) ? 4 : 3);
    const isOnlyGrade3 = targetGrade === 3;
    const targetCount = opts.count || (opts.forPrint ? 6 : 5);
    const tasks = [];

    // 1. Schriftliche Addition zweier 3-stelliger Zahlen (mit Zehnerübertrag)
    {
      const n1 = rand(165, 485);
      const n2 = rand(155, 475);
      const sum = n1 + n2;
      tasks.push(createWrittenTask('+', n1, n2, sum, 'Rechne stellenweise von rechts nach links (E, Z, H). Vergiss nicht auf den Übertrag!'));
    }

    // 2. Schriftliche Subtraktion zweier 3-stelliger Zahlen (mit Behalte-Ziffer)
    {
      const sum = rand(450, 890);
      const n2 = rand(140, sum - 120);
      const diff = sum - n2;
      tasks.push(createWrittenTask('−', sum, n2, diff, 'Rechne von rechts nach links. Denke an die Behalte-Ziffer beim Abziehen!'));
    }

    // 3. Schriftliche Addition: 3-stellig bei 3. Klasse, 4-stellig (T H Z E) bei 4. Klasse
    if (isOnlyGrade3) {
      const n1 = rand(210, 490);
      const n2 = rand(150, 480);
      const sum = n1 + n2;
      tasks.push(createWrittenTask('+', n1, n2, sum, 'Schriftliche Addition im Hunderterraum: Trage die Ziffern von rechts nach links ein.'));
    } else {
      const n1 = rand(1250, 4350);
      const n2 = rand(1250, 4350);
      const sum = n1 + n2;
      tasks.push(createWrittenTask('+', n1, n2, sum, 'Schriftliche Addition mit Tausendern: Trage die Ziffern von rechts nach links ein.'));
    }

    // 4. Schriftliche Subtraktion zweiter Durchlauf
    {
      const sum = rand(510, 920);
      const n2 = rand(180, sum - 150);
      const diff = sum - n2;
      tasks.push(createWrittenTask('−', sum, n2, diff, 'Subtrahiere stellenweise von rechts nach links mit dem Ergänzungsverfahren.'));
    }

    // 5. Schriftliche Addition zweiter Durchlauf
    {
      const n1 = rand(240, 520);
      const n2 = rand(180, 410);
      const sum = n1 + n2;
      tasks.push(createWrittenTask('+', n1, n2, sum, 'Addiere Einer, Zehner und Hunderter und notiere den Übertrag.'));
    }

    // 6. Zusatzaufgabe für A4-Druck (6 Aufgaben)
    if (tasks.length < targetCount) {
      const n1 = isOnlyGrade3 ? rand(210, 530) : rand(1400, 4800);
      const n2 = isOnlyGrade3 ? rand(120, 390) : rand(1100, 3500);
      tasks.push(createWrittenTask('+', n1, n2, n1 + n2, 'Schriftliche Addition mit Stellenwert-Übertrag.'));
    }

    return tasks.slice(0, targetCount);
  }

  function createWrittenTask(op, num1, num2, answer, hint) {
    const s1 = num1.toString();
    const s2 = num2.toString();
    const ansStr = answer.toString();
    const maxLen = Math.max(s1.length, s2.length, ansStr.length);

    const allHeaders = ['ZT', 'T', 'H', 'Z', 'E'];
    const headers = allHeaders.slice(allHeaders.length - maxLen);

    const pad1 = s1.padStart(maxLen, ' ').split('');
    const pad2 = s2.padStart(maxLen, ' ').split('');
    const padAns = ansStr.padStart(maxLen, ' ').split('');

    return {
      fach: "mathe",
      schulstufe: (num1 > 1000 || num2 > 1000) ? 4 : 3,
      grade: (num1 > 1000 || num2 > 1000) ? 4 : 3,
      lehrplanRef: "M-" + ((num1 > 1000 || num2 > 1000) ? 4 : 3) + "-Operationen-Schriftlich",
      lehrplanStatus: "RIS",
      druck: "ja",
      druckHinweis: "",
      type: "written-calc",
      operation: op,
      num1: num1,
      num2: num2,
      raw1: num1,
      raw2: num2,
      answer: answer,
      solutionText: padAns.join(''),
      maxLen: maxLen,
      headers: headers,
      digits1: pad1,
      digits2: pad2,
      resultDigits: padAns,
      hint: hint,
      userAnswer: '',
      isCorrect: null,
    };
  }

  function stampMathTasks(tasks) {
    if (!Array.isArray(tasks)) return tasks;
    return tasks.map(t => {
      if (!t || typeof t !== 'object') return t;
      if (!t.fach) t.fach = 'mathe';
      if (!t.lehrplanStatus) t.lehrplanStatus = 'RIS';
      if (!t.druck) {
        if (t.type === 'twenty-field') {
          t.druck = 'angepasst';
          t.druckHinweis = 'Punkte im Zwanzigerfeld werden auf Papier mit Bleistift ausgemalt.';
        } else if (t.type === 'clock-set') {
          t.druck = 'angepasst';
          t.druckHinweis = 'Zeiger werden auf dem Zifferblatt mit Bleistift eingezeichnet.';
        } else {
          t.druck = 'ja';
          t.druckHinweis = '';
        }
      } else if (t.druck !== 'ja' && !t.druckHinweis) {
        t.druckHinweis = 'Didaktisch angepasste Druckausgabe.';
      }
      return t;
    });
  }

  return {
    formatAustrianNumber: formatAustrianNumber,
    buildAdditionTasks: (opts) => stampMathTasks(buildAdditionTasks(opts)),
    buildSubtractionTasks: (opts) => stampMathTasks(buildSubtractionTasks(opts)),
    buildMultiplicationTasks: (opts) => stampMathTasks(buildMultiplicationTasks(opts)),
    buildDivisionTasks: (opts) => stampMathTasks(buildDivisionTasks(opts)),
    buildPyramidTasks: (opts) => stampMathTasks(buildPyramidTasks(opts)),
    buildClockTasks: (opts) => stampMathTasks(buildClockTasks(opts)),
    buildMoneyTasks: (opts) => stampMathTasks(buildMoneyTasks(opts)),
    buildTimeMoneyTasks: (opts) => stampMathTasks(buildTimeMoneyTasks(opts)),
    buildMillionTasks: (opts) => stampMathTasks(buildMillionTasks(opts)),
    buildUnitsTasks: (opts) => stampMathTasks(buildUnitsTasks(opts)),
    buildGeometryTasks: (opts) => stampMathTasks(buildGeometryTasks(opts)),
    buildStoryTasks: (opts) => stampMathTasks(buildStoryTasks(opts)),
    buildTwentyFieldTasks: (opts) => stampMathTasks(buildTwentyFieldTasks(opts)),
    buildWrittenMathTasks: (opts) => stampMathTasks(buildWrittenMathTasks(opts)),
  };
})();
