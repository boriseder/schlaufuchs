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

  // Zentrale Hilfsfunktionen aus Core (Zufall, Zahlenformatierung, Stufen-Filter)
  const rand = (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.rand) || ((min, max) => Math.floor(Math.random() * (max - min + 1)) + min);
  const formatAustrianNumber = (window.Schlaufuchs && window.Schlaufuchs.formatZahl) || (num => String(num));
  const getEffectiveGrades = (window.Schlaufuchs && window.Schlaufuchs.getEffectiveGrades) || (g => g);

  // 1. ADDITION (➕ 1. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  function buildAdditionTasks(seed) {
    const rng = (window.Schlaufuchs && window.Schlaufuchs.Random) ? window.Schlaufuchs.Random.erstelleZufall(seed) : { int: rand, next: Math.random };
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const targetGrade = grades[rand(0, grades.length - 1)] || 2;
    const tasks = [];

    for (let i = 0; i < 6; i++) {
      const g = targetGrade;
      let a, b;

      if (g === 1) {
        // 1. Klasse: ZR 20
        if (Math.random() > 0.4) {
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
        if (Math.random() > 0.5) {
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
          b = rand(1, 3) * 1000 + (Math.random() > 0.5 ? 0 : rand(1, 6) * 100);
        } else {
          // Zehnerergänzung im ZR 1000 (z.B. 470 + 380 = 850)
          a = rand(25, 58) * 10;
          b = rand(18, 38) * 10;
        }
      }

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen",
        type: "equation",
        op: "add",
        grade: g,
        symbol: '+',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: a + b,
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 2. SUBTRAKTION (➖ 1. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  function buildSubtractionTasks(seed) {
    const rng = (window.Schlaufuchs && window.Schlaufuchs.Random) ? window.Schlaufuchs.Random.erstelleZufall(seed) : { int: rand, next: Math.random };
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const targetGrade = grades[rand(0, grades.length - 1)] || 2;
    const tasks = [];

    for (let i = 0; i < 6; i++) {
      const g = targetGrade;
      let a, b;

      if (g === 1) {
        // 1. Klasse: ZR 20
        if (Math.random() > 0.5) {
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
          b = rand(1, Math.floor(a / 1000) - 1) * 1000 + (Math.random() > 0.5 ? 500 : 0);
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

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen",
        type: "equation",
        op: "sub",
        grade: g,
        symbol: '−',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: a - b,
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 3. MULTIPLIKATION (✖️ 2. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  // Kind mit 2. Schulstufe erhält ausschließlich Kernaufgaben und kleines 1×1 bis 100!
  function buildMultiplicationTasks() {
    const useGrades = getEffectiveGrades([2, 3, 4]);
    const targetGrade = useGrades[rand(0, useGrades.length - 1)] || 2;
    const tasks = [];

    for (let i = 0; i < 6; i++) {
      const g = targetGrade;
      let a, b;

      if (g === 2) {
        // 2. Klasse: Kleines 1×1 (Kernaufgaben 2, 5, 10 und Reihen bis 10)
        // Niemals Zehnerrechnen wie 6 · 40!
        if (Math.random() < 0.4) {
          const coreFactors = [2, 5, 10];
          a = coreFactors[rand(0, coreFactors.length - 1)];
          b = rand(2, 10);
        } else {
          a = rand(2, 9);
          b = rand(2, 9);
        }
      } else if (g === 3) {
        // 3. Klasse: Zehnereinmaleins (z.B. 6 · 40 oder 30 · 7)
        if (Math.random() > 0.5) {
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
          if (Math.random() > 0.5) {
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

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen",
        type: "equation",
        op: "mul",
        grade: g,
        symbol: '·',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: a * b,
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 4. DIVISION (: 2. bis 4. Klasse – stufenrein für eine Übungseinheit/Arbeitsblatt)
  // Kind mit 2. Schulstufe erhält nur 1×1-Umkehrung ohne Rest!
  // Kind mit 4. Schulstufe erhält altersgerechte halbschriftliche Divisionen!
  function buildDivisionTasks(seed) {
    const rng = (window.Schlaufuchs && window.Schlaufuchs.Random) ? window.Schlaufuchs.Random.erstelleZufall(seed) : { int: rand, next: Math.random };
    const useGrades = getEffectiveGrades([2, 3, 4]);
    const targetGrade = useGrades[rand(0, useGrades.length - 1)] || 2;
    const tasks = [];

    for (let i = 0; i < 6; i++) {
      const g = targetGrade;
      let a, b, answer;

      if (g === 2) {
        // 2. Klasse: Reine Umkehrung des 1×1 (ohne Rest, Dividenden bis 100)
        b = rand(2, 9);
        answer = rand(2, 9);
        a = b * answer;
      } else if (g === 3) {
        // 3. Klasse: Zehnerdivision (z.B. 420 : 6 oder 350 : 50)
        if (Math.random() > 0.5) {
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

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen",
        type: "equation",
        op: "div",
        grade: g,
        symbol: ':',
        num1: formatAustrianNumber(a),
        num2: formatAustrianNumber(b),
        raw1: a,
        raw2: b,
        answer: answer,
        userAnswer: '',
        isCorrect: null,
      });
    }

    return tasks;
  }

  // 5. RECHENTÜRME / ZAHLENMAUERN (🧱 Stufengerecht: 1. Kl <= 20, 2. Kl <= 100, 3. Kl <= 1 000)
  function buildPyramidTasks() {
    const grades = getEffectiveGrades([1, 2, 3]);
    const tasks = [];

    for (let i = 0; i < 5; i++) {
      const g = grades[rand(0, grades.length - 1)] || 2;
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

      tasks.push({
        fach: "mathe",
        schulstufe: g,
        lehrplanRef: "M-" + g + "-Operationen",
        type: "pyramid",
        grade: g,
        values: { b1, b2, b3, m1, m2, peak },
        hidden: hiddenKeys,
        userAnswers: {},
        isCorrect: null,
      });
    }
    return tasks;
  }

  // 6. UHRZEIT & GELD (💶 2. – 4. Klasse adaptiv)
  function buildTimeMoneyTasks() {
    const grades = getEffectiveGrades([2, 3, 4]);
    const tasks = [];

    const poolGrade2 = [
      () => {
        const euro1 = rand(2, 10);
        const euro2 = rand(3, 15);
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen',
          question: `Wie viel Euro sind ${euro1}\u00A0€ und ${euro2}\u00A0€ zusammen?`,
          unit: '€',
          answer: euro1 + euro2,
          hint: '💡 Überlege: Mit welcher Rechenart zählst du die beiden Euro-Beträge zusammen?'
        };
      },
      () => {
        const h = rand(1, 10);
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen',
          question: `Es ist ${h}:00 Uhr. Wie viel Uhr ist es in 2 Stunden?`,
          unit: 'Uhr',
          answer: h + 2,
          hint: '💡 Zähle auf dem Zifferblatt um 2 Stunden weiter.'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen',
          question: 'Eine Schulstunde dauert 50 Minuten. Wie viele Minuten fehlen noch auf eine volle Stunde (60 Min.)?',
          unit: 'Minuten',
          answer: 10,
          hint: '💡 Wie viele Minuten hat eine volle Stunde?'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 2,
          grade: 2,
          lehrplanRef: 'M-2-Groessen',
          question: 'Du kaufst einen Apfel um 50 Cent und eine Semmel um 50 Cent. Wie viel Euro (€) sind das zusammen?',
          unit: '€',
          answer: 1,
          hint: '💡 100 Cent = 1 Euro.'
        };
      }
    ];

    const poolGrade3 = [
      () => {
        const euro1 = rand(1, 4);
        const cent1 = rand(1, 4) * 20;
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viel Cent sind ${euro1}\u00A0€ und ${cent1}\u00A0c zusammen?`,
          unit: 'Cent',
          answer: euro1 * 100 + cent1,
          hint: '💡 Tipp: 1\u00A0Euro = 100\u00A0Cent.'
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
          lehrplanRef: 'M-3-Groessen',
          question: `Ein Heft kostet ${kostenCents}\u00A0Cent. Du zahlst mit einer 2-Euro-Münze. Wie viel Cent Rückgeld bekommst du?`,
          unit: 'Cent',
          answer: rueckgeld,
          hint: '💡 Wie viele Cent hat eine 2-Euro-Münze? Wie viel fehlt von den Kosten auf 2\u00A0Euro?'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: `Wie viele Minuten hat eine Dreiviertelstunde?`,
          unit: 'Minuten',
          answer: 45,
          hint: '💡 Tipp: Eine Dreiviertelstunde ist eine halbe Stunde (30 Min.) plus eine Viertelstunde (15 Min.).'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 3,
          grade: 3,
          lehrplanRef: 'M-3-Groessen',
          question: 'Wie viele Sekunden hat eine halbe Minute?',
          unit: 'Sekunden',
          answer: 30,
          hint: '💡 1 Minute = 60 Sekunden.'
        };
      }
    ];

    const poolGrade4 = [
      () => {
        const stunden = rand(2, 5);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viele Minuten haben ${stunden}\u00A0Stunden?`,
          unit: 'Minuten',
          answer: stunden * 60,
          hint: '💡 1\u00A0Stunde = 60\u00A0Minuten.'
        };
      },
      () => {
        const min = rand(2, 4);
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: `Wie viele Sekunden sind ${min}\u00A0Minuten?`,
          unit: 'Sekunden',
          answer: min * 60,
          hint: '💡 1\u00A0Minute = 60\u00A0Sekunden.'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: 'Ein Zug fährt um 08:15 Uhr ab und kommt um 09:45 Uhr an. Wie viele Minuten dauerte die Fahrt?',
          unit: 'Minuten',
          answer: 90,
          hint: '💡 Rechne: von 08:15 bis 09:15 ist 1 Stunde (60 Min.), plus 30 Minuten bis 09:45.'
        };
      },
      () => {
        return {
          fach: 'mathe',
          schulstufe: 4,
          grade: 4,
          lehrplanRef: 'M-4-Groessen',
          question: 'Wie viele Stunden hat ein ganzer Tag (24-Stunden-Tag)?',
          unit: 'Stunden',
          answer: 24,
          hint: '💡 Ein Kalendertag hat 24 Stunden.'
        };
      }
    ];

    let activePool = [];
    if (grades.includes(2)) activePool.push(...poolGrade2);
    if (grades.includes(3)) activePool.push(...poolGrade3);
    if (grades.includes(4)) activePool.push(...poolGrade4);
    if (activePool.length === 0) activePool = poolGrade3;

    const shuffled = activePool.sort(() => 0.5 - Math.random()).slice(0, 5);
    shuffled.forEach(fn => {
      const t = fn();
      tasks.push({
        fach: t.fach,
        schulstufe: t.schulstufe,
        grade: t.grade,
        lehrplanRef: t.lehrplanRef,
        type: 'direct-input',
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

  // 7. ZAHLENRAUM 1 000 000 & STELLENWERTTAFEL (💎 4. Klasse)
  function buildMillionTasks() {
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
          hint: '💡 Schreibe die Ziffern der Reihe nach von HT bis E auf.'
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
          hint: '💡 Die Tausender-Stelle steht an 4. Stelle von rechts.'
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
          hint: '💡 Achte auf die Tausender-Stelle und zähle in Tausenderschritten weiter.'
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
          hint: '💡 Der Nachfolger ist um genau 1 größer.'
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
          hint: '💡 Ergänze auf den nächsten vollen Zehntausender.'
        });
      }
    }

    return tasks.map(t => ({ ...t, userAnswer: '', isCorrect: null }));
  }

  // 8. MASSE & GEWICHTE (⚖️ 3. & 4. Klasse mit kg, g, dag, t, hl, km)
  function buildUnitsTasks() {
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
          hint: '💡 1\u00A0kg = 1\u00A0000\u00A0g.'
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
          hint: '💡 1\u00A0m = 100\u00A0cm.'
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
          hint: '💡 1\u00A0cm = 10\u00A0mm.'
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
          hint: '💡 1\u00A0dm = 10\u00A0cm.'
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
          hint: '💡 1\u00A0Liter = 1\u00A0000\u00A0Milliliter.'
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
          hint: '💡 In Österreich gilt: 1\u00A0kg = 100\u00A0dag.'
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
          hint: '💡 100\u00A0dag = 1\u00A0kg.'
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
          hint: '💡 1\u00A0dag = 10\u00A0g.'
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
          hint: '💡 1\u00A0Tonne = 1\u00A0000\u00A0kg.'
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
          hint: '💡 1\u00A0Hektoliter (hl) = 100\u00A0Liter (l).'
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
          hint: '💡 1\u00A0km = 1\u00A0000\u00A0m.'
        };
      }
    ];

    let activePool = [];
    if (grades.includes(3)) activePool.push(...poolGrade3);
    if (grades.includes(4)) activePool.push(...poolGrade4);
    if (activePool.length === 0) activePool = poolGrade4;

    const chosen = activePool.sort(() => 0.5 - Math.random()).slice(0, 5);
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

  // 9. GEOMETRIE: UMFANG & FLÄCHE (📐 4. Klasse, 5 Aufgaben)
  function buildGeometryTasks() {
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
  function buildStoryTasks() {
    const grades = getEffectiveGrades([2, 3, 4]);

    const storiesGrade2 = [
      {
        grade: 2,
        schulstufe: 2,
        lehrplanRef: 'M-2-Sachaufgaben',
        story: 'Felix hat 36 bunte Murmeln gesammelt. Zum Geburtstag bekommt er von seiner Oma noch 18 Murmeln geschenkt.',
        question: 'Wie viele Murmeln hat Felix jetzt zusammen?',
        calculation: '36 + 18',
        answer: 54,
        unit: 'Murmeln',
        answerText: 'Felix hat jetzt 54 Murmeln.',
        hint: '💡 Überlege: Werden es mehr oder weniger Murmeln? Welche Rechenart passt?'
      },
      {
        grade: 2,
        schulstufe: 2,
        lehrplanRef: 'M-2-Sachaufgaben',
        story: 'In der 2. Klasse sind 24 Kinder. Heute sind 7 Kinder wegen einer Erkältung krank zu Hause.',
        question: 'Wie viele Kinder sind heute in der Schule anwesend?',
        calculation: '24 − 7',
        answer: 17,
        unit: 'Kinder',
        answerText: 'Es sind heute 17 Kinder in der Schule.',
        hint: '💡 Lies genau: Die kranken Kinder sind heute nicht da. Welche Rechenart musst du anwenden?'
      },
      {
        grade: 2,
        schulstufe: 2,
        lehrplanRef: 'M-2-Sachaufgaben',
        story: 'Eine Eintrittskarte für den Tiergarten Schönbrunn kostet 8\u00A0Euro. Eine Familie kauft 4 Karten.',
        question: 'Wie viel Euro muss die Familie an der Kasse insgesamt bezahlen?',
        calculation: '4 · 8',
        answer: 32,
        unit: 'Euro',
        answerText: 'Die Familie bezahlt 32 Euro.',
        hint: '💡 Jede der 4 Karten kostet gleich viel. Mit welcher Rechenart berechnest du den Gesamtpreis?'
      },
      {
        grade: 2,
        schulstufe: 2,
        lehrplanRef: 'M-2-Sachaufgaben',
        story: 'Die Lehrerin hat 28 neue Buntstifte gekauft und verteilt sie gleichmäßig auf 4 Gruppentische.',
        question: 'Wie viele Buntstifte bekommt jeder Tisch?',
        calculation: '28 : 4',
        answer: 7,
        unit: 'Buntstifte',
        answerText: 'Jeder Tisch bekommt 7 Buntstifte.',
        hint: '💡 Verteilen bedeutet: Aufteilen in gleich große Mengen. Welche Rechenart hilft dir?'
      }
    ];

    const storiesGrade3 = [
      {
        grade: 3,
        schulstufe: 3,
        lehrplanRef: 'M-3-Sachaufgaben',
        story: 'Ein Bäcker in Wien backt frühmorgens 120 frische Semmeln. Am Vormittag verkauft er 85 Semmeln.',
        question: 'Wie viele Semmeln sind am Mittag noch übrig?',
        calculation: '120 − 85',
        answer: 35,
        unit: 'Semmeln',
        answerText: 'Es sind noch 35 Semmeln übrig.',
        hint: '💡 Überlege: Wie viele Semmeln bleiben nach dem Verkauf noch in der Bäckerei übrig?'
      },
      {
        grade: 3,
        schulstufe: 3,
        lehrplanRef: 'M-3-Sachaufgaben',
        story: 'Lukas spart für ein neues Fahrrad, das 180\u00A0Euro kostet. Er hat bereits 125\u00A0Euro in seiner Spardose.',
        question: 'Wie viel Euro fehlen Lukas noch zum Kauf des Fahrrads?',
        calculation: '180 − 125',
        answer: 55,
        unit: 'Euro',
        answerText: 'Lukas fehlen noch 55 Euro.',
        hint: '💡 Wie viel Geld fehlt Lukas noch auf den vollen Betrag des Fahrrads?'
      },
      {
        grade: 3,
        schulstufe: 3,
        lehrplanRef: 'M-3-Sachaufgaben',
        story: 'In der Schulbibliothek stehen 6 Regale mit jeweils 40 spannenden Büchern.',
        question: 'Wie viele Bücher stehen insgesamt in den Regalen?',
        calculation: '6 · 40',
        answer: 240,
        unit: 'Bücher',
        answerText: 'Es stehen insgesamt 240 Bücher in den Regalen.',
        hint: '💡 In jedem Regal stehen gleich viele Bücher. Welche Rechenart rechnet gleiche Mengen zusammen?'
      },
      {
        grade: 3,
        schulstufe: 3,
        lehrplanRef: 'M-3-Sachaufgaben',
        story: 'Anna hat 45\u00A0Euro gespart. Sie kauft ein spannendes Buch um 28\u00A0Euro.',
        question: 'Wie viel Euro hat Anna nach dem Kauf noch übrig?',
        calculation: '45 − 28',
        answer: 17,
        unit: 'Euro',
        answerText: 'Anna hat noch 17 Euro übrig.',
        hint: '💡 Wie viel Geld bleibt von 45 Euro nach Abzug von 28 Euro übrig?'
      }
    ];

    const storiesGrade4 = [
      {
        grade: 4,
        schulstufe: 4,
        lehrplanRef: 'M-4-Sachaufgaben',
        story: 'Für ein Schulfest kauft die 4. Klasse 5 Packungen Mehl zu je 100\u00A0dag und 2 Packungen Zucker zu je 50\u00A0dag.',
        question: 'Wie viel Dekagramm (dag) wiegen die Einkäufe insgesamt?',
        calculation: '500 + 100',
        answer: 600,
        unit: 'dag',
        answerText: 'Die Einkäufe wiegen 600 dag.',
        hint: '💡 Berechne zuerst das Gewicht vom Mehl, dann das vom Zucker, und zähle beides zusammen.'
      },
      {
        grade: 4,
        schulstufe: 4,
        lehrplanRef: 'M-4-Sachaufgaben',
        story: 'Ein Wanderer geht am Vormittag 12\u00A0km und am Nachmittag 9\u00A0km auf dem Weitwanderweg.',
        question: 'Wie viele Meter (m) ist der Wanderer an diesem Tag insgesamt gewandert?',
        calculation: '21 · 1000',
        answer: 21000,
        unit: 'm',
        answerText: 'Der Wanderer ist 21 000 m gewandert.',
        hint: '💡 Rechne zuerst die gesamten Kilometer aus und wandle sie anschließend in Meter um.'
      },
      {
        grade: 4,
        schulstufe: 4,
        lehrplanRef: 'M-4-Sachaufgaben',
        story: 'Ein Lastwagen transportiert 4\u00A0Tonnen Sand. Auf der ersten Baustelle werden 1\u00A0500\u00A0kg abgeladen.',
        question: 'Wie viel Kilogramm (kg) Sand verbleiben auf dem Lastwagen?',
        calculation: '4000 − 1500',
        answer: 2500,
        unit: 'kg',
        answerText: 'Es verbleiben 2 500 kg Sand auf dem Lastwagen.',
        hint: '💡 1 Tonne = 1 000 kg. Wandle zuerst 4 Tonnen in kg um (4 000 kg) und ziehe dann ab.'
      }
    ];

    let pool = [];
    if (grades.includes(2)) pool.push(...storiesGrade2);
    if (grades.includes(3)) pool.push(...storiesGrade3);
    if (grades.includes(4)) pool.push(...storiesGrade4);
    if (pool.length === 0) pool = storiesGrade2;

    const chosen = pool.sort(() => 0.5 - Math.random()).slice(0, 5);
    return chosen.map(s => ({
      fach: 'mathe',
      schulstufe: s.schulstufe || 3,
      grade: s.grade || 3,
      lehrplanRef: s.lehrplanRef || 'M-3-Sachaufgaben',
      type: 'text-problem',
      story: s.story,
      question: s.question,
      calculation: s.calculation,
      answer: s.answer,
      unit: s.unit,
      answerText: s.answerText,
      hint: s.hint,
      userAnswer: '',
      isCorrect: null,
    }));
  }

  // 11. MENGEN- & ZWANZIGERFELD (1. Klasse mit blauen & roten Wendeplättchen)
  function buildTwentyFieldTasks(seed) {
    const tasks = [];
    for (let i = 0; i < 5; i++) {
      const a = rand(6, 9);
      const toTen = 10 - a;
      const overTen = rand(2, 5);
      const b = toTen + overTen;
      const total = a + b;

      tasks.push({
        fach: "mathe",
        schulstufe: 1,
        grade: 1,
        lehrplanRef: "M-1-Zahlen",
        type: "twenty-field",
        a: a,
        b: b,
        total: total,
        question: `Wie viele Punkte siehst du insgesamt im Zwanzigerfeld? Rechne: ${a} + ${b} = ?`,
        hint: `💡 Tipp: Zähle zuerst die Lücken bis zum vollen Zehner 10 auf (Stopp bei 10!) und addiere dann die restlichen Punkte der zweiten Reihe.`,
        answer: total,
        userAnswer: '',
        isCorrect: null,
      });
    }
    return tasks;
  }

  // 12. SCHRIFTLICHE RECHENVERFAHREN (3. & 4. Klasse: Untereinander mit Übertrag)
  function buildWrittenMathTasks() {
    const grades = getEffectiveGrades([3, 4]);
    const isOnlyGrade3 = !grades.includes(4);
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

    return tasks;
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
      lehrplanRef: "M-" + ((num1 > 1000 || num2 > 1000) ? 4 : 3) + "-Schriftlich",
      type: "written-calc",
      operation: op,
      num1: num1,
      num2: num2,
      answer: answer,
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

  return {
    formatAustrianNumber: formatAustrianNumber,
    buildAdditionTasks: buildAdditionTasks,
    buildSubtractionTasks: buildSubtractionTasks,
    buildMultiplicationTasks: buildMultiplicationTasks,
    buildDivisionTasks: buildDivisionTasks,
    buildPyramidTasks: buildPyramidTasks,
    buildTimeMoneyTasks: buildTimeMoneyTasks,
    buildMillionTasks: buildMillionTasks,
    buildUnitsTasks: buildUnitsTasks,
    buildGeometryTasks: buildGeometryTasks,
    buildStoryTasks: buildStoryTasks,
    buildTwentyFieldTasks: buildTwentyFieldTasks,
    buildWrittenMathTasks: buildWrittenMathTasks,
  };
})();
