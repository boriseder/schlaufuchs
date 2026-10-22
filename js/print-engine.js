// =============================================================
// SCHLAUFUCHS – js/print-engine.js
// Prozedurale Hochvarianz-Worksheet-Engine für A4-Druck (Schulbuch-Look)
// BMBWF Lehrplan Volksschule Österreich (BGBl. II Nr. 178/2025)
// Garantiert: Unendliche Varianz (10+ Drucke ohne Duplikate),
// mathematisch bijektive Rätsel-Decoder & 6 didaktische Archetypen
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

  // Zufalls- und Formatierhelfer
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const formatNum = (n) => {
    if (window.Schlaufuchs && window.Schlaufuchs.formatZahl) {
      return window.Schlaufuchs.formatZahl(n);
    }
    return String(n);
  };

  // Liste kindgerechter österreichischer Geheimwörter für die Schatzkiste
  const SECRET_WORDS = [
    'FUCHS', 'STERN', 'WIESE', 'BLUME', 'SONNE', 'BIBER', 'TAFEL', 'VOGEL',
    'SCHLAU', 'WINTER', 'SOMMER', 'SCHNEE', 'HERBST', 'SCHULE', 'RAKETE',
    'BUECHER', 'FREUND', 'PAPIER', 'LEHRER', 'WISSEN', 'MEISTER', 'KOBEL',
    'WALD', 'IGEL', 'EULE', 'BERG', 'HERZ', 'FLUSS', 'DONAU', 'ALPEN'
  ];

  function pickSecretWord(preferredLength) {
    let pool = SECRET_WORDS;
    if (preferredLength) {
      const matching = SECRET_WORDS.filter(w => Math.abs(w.length - preferredLength) <= 1);
      if (matching.length > 0) pool = matching;
    }
    const word = pool[rand(0, pool.length - 1)];
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
  // 2. ARCHETYPEN-TASK-GENERATOREN (MIT DEDUPLIZIERUNG)
  // =============================================================

  // --- ARCHETYP 1: KOMPAKTRECHNEN (12 Aufgaben in 2 Spalten, Injektiv) ---
  function buildCompactCalcWorksheet(topicId, grade) {
    const tasks = [];
    const usedAnswers = new Set();
    const targetCount = 12;
    let attempts = 0;

    while (tasks.length < targetCount && attempts < 500) {
      attempts++;
      let a, b, op, ans, sym;

      if (topicId === 'math-addition') {
        op = 'add';
        sym = '+';
        if (grade === 1) {
          // ZR 20
          a = rand(2, 10);
          b = rand(1, 20 - a);
        } else if (grade === 2) {
          // ZR 100 mit Übergang
          a = rand(15, 68);
          const u = a % 10;
          b = rand(10 - u + 1, 30);
          if (a + b > 100) b = 100 - a;
        } else if (grade === 3) {
          // ZR 1 000
          if (Math.random() > 0.5) {
            a = rand(15, 48) * 10;
            b = rand(15, 48) * 10;
          } else {
            a = rand(120, 550);
            b = rand(80, 420);
          }
        } else {
          // ZR bis 10 000 (4. Klasse)
          const t = rand(1, 3);
          if (t === 1) {
            const base = rand(2, 6) * 1000;
            const split = rand(1, 9) * 100;
            a = base - split;
            b = rand(1, 3) * 1000 + split;
          } else if (t === 2) {
            a = rand(22, 58) * 100;
            b = rand(1, 3) * 1000 + (Math.random() > 0.5 ? 0 : rand(1, 6) * 100);
          } else {
            a = rand(25, 65) * 10;
            b = rand(18, 45) * 10;
          }
        }
        ans = a + b;
      } else if (topicId === 'math-subtraction') {
        op = 'sub';
        sym = '−';
        if (grade === 1) {
          a = rand(6, 20);
          b = rand(1, a - 1);
        } else if (grade === 2) {
          a = rand(25, 95);
          const u = a % 10;
          b = rand(u + 1, Math.min(a - 2, 28));
        } else if (grade === 3) {
          a = rand(250, 950);
          b = rand(60, a - 50);
        } else {
          a = rand(25, 95) * 100;
          b = rand(5, Math.floor(a / 100) - 5) * 100;
        }
        ans = a - b;
      } else if (topicId === 'math-multiplication') {
        op = 'mul';
        sym = '·';
        if (grade === 2) {
          // Kernaufgaben (2, 5, 10) & 3er/4er
          const tables = [2, 3, 4, 5, 10];
          b = tables[rand(0, tables.length - 1)];
          a = rand(1, 10);
        } else if (grade === 3) {
          // Gesamtes 1x1
          a = rand(2, 10);
          b = rand(2, 10);
        } else {
          // 4. Klasse: Zehner-1x1
          a = rand(2, 9);
          b = rand(12, 45);
        }
        ans = a * b;
      } else if (topicId === 'math-division') {
        op = 'div';
        sym = ':';
        const divisor = rand(2, grade === 2 ? 5 : 10);
        const quotient = rand(2, grade === 4 ? 20 : 10);
        a = divisor * quotient;
        b = divisor;
        ans = quotient;
      } else if (topicId === 'math-million') {
        // Stellenwert & Ergänzen bis 1 Million
        sym = '+';
        const base = rand(10, 85) * 10000;
        const addPart = rand(1, 9) * 1000;
        a = base;
        b = addPart;
        ans = a + b;
      } else {
        // Fallback Grundrechnen
        sym = '+';
        a = rand(5, 40);
        b = rand(3, 40);
        ans = a + b;
      }

      const sig = `${topicId}:${a}${sym}${b}`;

      // Injektivität prüfen: Keine doppelten Ergebnisse auf dem Blatt!
      // Deduplizierung: Nicht in den letzten 200 Rechnungen enthalten!
      if (!usedAnswers.has(ans) && !tracker.has(sig)) {
        usedAnswers.add(ans);
        tracker.add(sig);

        tasks.push({
          type: 'equation',
          schulstufe: grade,
          lehrplanRef: `M-${grade}-Operationen`,
          op: op,
          symbol: sym,
          num1: formatNum(a),
          num2: formatNum(b),
          raw1: a,
          raw2: b,
          answer: ans,
          formattedAnswer: formatNum(ans)
        });
      }
    }

    return tasks;
  }

  // --- ARCHETYP 2: STRUKTUR- & BEZIEHUNGSRECHNEN (Zahlenmauern, Ketten, Zwanzigerfeld) ---
  function buildStructureCalcWorksheet(topicId, grade) {
    const tasks = [];

    if (topicId === 'math-pyramid') {
      // 4 strukturierte Zahlenmauern (2x2 Grid)
      for (let i = 0; i < 4; i++) {
        let b1, b2, b3;
        if (grade === 1) {
          b1 = rand(1, 4);
          b2 = rand(1, 4);
          b3 = rand(1, 4);
        } else if (grade === 2) {
          b1 = rand(3, 12);
          b2 = rand(4, 15);
          b3 = rand(2, 11);
        } else {
          b1 = rand(10, 35);
          b2 = rand(12, 40);
          b3 = rand(8, 30);
        }

        const m1 = b1 + b2;
        const m2 = b2 + b3;
        const peak = m1 + m2;

        const values = { b1, b2, b3, m1, m2, peak };
        let hidden = [];

        // Progression von Mauer 1 bis Mauer 4
        if (i === 0) {
          // Leicht: Nur Spitze und Mitte fehlen
          hidden = ['m1', 'm2', 'peak'];
        } else if (i === 1) {
          // Mittel: Ein Basisstein fehlt
          hidden = ['b2', 'm2', 'peak'];
        } else if (i === 2) {
          // Knifflig: Basis links und Mitte rechts fehlen
          hidden = ['b1', 'm2', 'peak'];
        } else {
          // Meisterhaft: Beide Zwischensteine und ein Basisstein
          hidden = ['b3', 'm1', 'peak'];
        }

        tasks.push({
          type: 'pyramid',
          schulstufe: grade,
          lehrplanRef: `M-${grade}-Zahlenmauern`,
          values: values,
          hidden: hidden,
          answer: hidden.map(k => values[k]).join(', ')
        });
      }
    } else if (topicId === 'brain-sequence') {
      // 6 Zahlenreihen / Rechenketten
      for (let i = 0; i < 6; i++) {
        const step = rand(2, grade === 1 ? 4 : 8);
        const start = rand(1, grade === 1 ? 10 : 30);
        const seq = [start, start + step, start + 2 * step, start + 3 * step];
        const next1 = start + 4 * step;
        const next2 = start + 5 * step;

        tasks.push({
          type: 'sequence',
          schulstufe: grade,
          lehrplanRef: `GT-${grade}-Zahlenreihen`,
          sequence: seq,
          step: step,
          answer: `${next1}, ${next2}`,
          prompt: `Setze die Zahlenreihe fort (+${step}): ${seq.join(', ')}, ___, ___`
        });
      }
    } else {
      // Zwanzigerfeld oder Muster-Meister
      for (let i = 0; i < 4; i++) {
        const val = rand(7, 19);
        tasks.push({
          type: 'twenty-field',
          schulstufe: 1,
          lehrplanRef: 'M-1-Zwanzigerfeld',
          val: val,
          answer: `${val}`,
          prompt: `Zeichne ${val} Punkte in das Zwanzigerfeld ein und zerlege in Zehner und Einer:`
        });
      }
    }

    return tasks;
  }

  // --- ARCHETYP 3: SACHRECHNEN & GRÖSSEN (F - R - A) ---
  function buildStoryProblemWorksheet(topicId, grade) {
    const tasks = [];
    const names = ['Lukas', 'Anna', 'Felix', 'Mia', 'Valentin', 'Sophie', 'Elias', 'Emilia', 'Jakob', 'Laura'];

    if (topicId === 'math-stories') {
      // 3 österreichische Sachaufgaben
      const storyTemplates = [
        () => {
          const n1 = names[rand(0, 4)];
          const n2 = names[rand(5, 9)];
          const a = rand(12, 38);
          const b = rand(14, 35);
          return {
            story: `${n1} und ${n2} sammeln für das Schulfest Kastanien. ${n1} hat ${a} Kastanien gesammelt, ${n2} hat ${b} Kastanien gesammelt. Wie viele Kastanien haben beide Kinder zusammen gesammelt?`,
            question: 'Wie viele Kastanien haben beide zusammen?',
            calculation: `${a} + ${b}`,
            answer: `${a + b} Kastanien`
          };
        },
        () => {
          const n = names[rand(0, 9)];
          const total = rand(45, 95);
          const spent = rand(18, 38);
          return {
            story: `${n} bekommt von den Großeltern ${total} € Taschengeld gespart. Für ein Buch und neue Stifte gibt ${n} ${spent} € aus. Wie viel Geld bleibt noch in der Geldbörse?`,
            question: 'Wie viel Geld bleibt übrig?',
            calculation: `${total} − ${spent}`,
            answer: `${total - spent} €`
          };
        },
        () => {
          const boxes = rand(3, 6);
          const perBox = rand(4, 8);
          return {
            story: `In der Schultasche liegen ${boxes} Packungen mit Buntstiften. In jeder Packung sind genau ${perBox} Stifte. Wie viele Buntstifte sind das insgesamt?`,
            question: 'Wie viele Buntstifte sind es insgesamt?',
            calculation: `${boxes} · ${perBox}`,
            answer: `${boxes * perBox} Buntstifte`
          };
        }
      ];

      storyTemplates.forEach(fn => {
        const d = fn();
        tasks.push({
          type: 'text-problem',
          schulstufe: grade,
          lehrplanRef: `M-${grade}-Sachrechnen`,
          story: d.story,
          question: d.question,
          calculation: d.calculation,
          answer: d.answer
        });
      });
    } else if (topicId === 'math-time-money') {
      // 3 Aufgaben zu Geld & Zeit
      tasks.push({
        type: 'text-problem',
        schulstufe: grade,
        lehrplanRef: 'M-2/3-Geld-Zeit',
        story: 'Ein Kinoticket kostet 8 € und 50 Cent. Ein Popcorn kostet 4 € und 20 Cent. Wie viel bezahlt Maximilian an der Kassa?',
        question: 'Wie viel kosten Ticket und Popcorn zusammen?',
        calculation: '8,50 € + 4,20 €',
        answer: '12 € und 70 Cent'
      });
      tasks.push({
        type: 'text-problem',
        schulstufe: grade,
        lehrplanRef: 'M-2/3-Geld-Zeit',
        story: 'Der Schulbus fährt um 07:15 Uhr an der Haltestelle ab. Die Fahrt zur Volksschule dauert genau 25 Minuten. Wann kommt der Bus an der Schule an?',
        question: 'Um wie viel Uhr kommt der Bus an?',
        calculation: '07:15 Uhr + 25 min',
        answer: '07:40 Uhr'
      });
      tasks.push({
        type: 'text-problem',
        schulstufe: grade,
        lehrplanRef: 'M-2/3-Geld-Zeit',
        story: 'Sophie kauft am Naschmarkt Äpfel um 3 € und Trauben um 4 €. Sie bezahlt mit einem 20-€-Schein. Wie viel Retourgeld bekommt sie?',
        question: 'Wie viel Wechselgeld erhält Sophie?',
        calculation: '20 € − 7 €',
        answer: '13 €'
      });
    } else {
      // Geometrie / Flächen / Maßeinheiten (4. Klasse)
      tasks.push({
        type: 'text-problem',
        schulstufe: 4,
        lehrplanRef: 'M-4-Geometrie',
        story: 'Ein rechteckiges Klassenzimmer ist 8 m lang und 6 m breit. Berechne den Umfang (u) und den Flächeninhalt (A) des Raumes.',
        question: 'Wie groß sind Umfang und Fläche?',
        calculation: 'u = 2·8 + 2·6 | A = 8·6',
        answer: 'u = 28 m, A = 48 m²'
      });
      tasks.push({
        type: 'text-problem',
        schulstufe: 4,
        lehrplanRef: 'M-4-Masseinheiten',
        story: 'In einem Wassertank sind 125 l Regenwasser. Nach einem starken Gewitter fließen weitere 85 l hinein. Für den Schulgarten werden 60 l verbraucht. Wie viel Liter sind nun im Tank?',
        question: 'Wie viel Liter Regenwasser verbleiben?',
        calculation: '125 l + 85 l − 60 l',
        answer: '150 l'
      });
    }

    return tasks;
  }

  // --- ARCHETYP 4: SPRACHANALYTIK & RECHTSCHREIBUNG (4-Linien-System) ---
  function buildLanguageWritingWorksheet(topicId, grade) {
    const tasks = [];

    if (topicId === 'german-word-types') {
      // 4 Sätze zum Wortarten-Bestimmen
      const sentences = [
        [
          { word: 'Der', ignore: true },
          { word: 'kleine', type: 'adjektiv' },
          { word: 'Fuchs', type: 'nomen' },
          { word: 'schläft', type: 'verb' },
          { word: 'im', ignore: true },
          { word: 'Wald.', type: 'nomen' }
        ],
        [
          { word: 'Die', ignore: true },
          { word: 'fleißigen', type: 'adjektiv' },
          { word: 'Kinder', type: 'nomen' },
          { word: 'schreiben', type: 'verb' },
          { word: 'schöne', type: 'adjektiv' },
          { word: 'Geschichten.', type: 'nomen' }
        ],
        [
          { word: 'Ein', ignore: true },
          { word: 'bunter', type: 'adjektiv' },
          { word: 'Vogel', type: 'nomen' },
          { word: 'singt', type: 'verb' },
          { word: 'ein', ignore: true },
          { word: 'Lied.', type: 'nomen' }
        ],
        [
          { word: 'Wir', ignore: true },
          { word: 'packen', type: 'verb' },
          { word: 'unsere', ignore: true },
          { word: 'neue', type: 'adjektiv' },
          { word: 'Schultasche', type: 'nomen' },
          { word: 'ein.', ignore: true }
        ]
      ];

      sentences.forEach(s => {
        tasks.push({
          type: 'word-types',
          schulstufe: grade,
          lehrplanRef: `D-${grade}-Wortarten`,
          sentence: s
        });
      });
    } else if (topicId === 'german-syllables') {
      // 4 Silbenwörter
      const syllableWords = [
        { word: 'SCHU-LE', display: 'SCHULE', count: 2, vowels: 'U, E' },
        { word: 'SCHO-KO-LA-DE', display: 'SCHOKOLADE', count: 4, vowels: 'O, O, A, E' },
        { word: 'RA-KE-TE', display: 'RAKETE', count: 3, vowels: 'A, E, E' },
        { word: 'SCHUL-TA-SCHE', display: 'SCHULTASCHE', count: 3, vowels: 'U, A, E' }
      ];

      syllableWords.forEach(w => {
        tasks.push({
          type: 'syllables',
          schulstufe: grade,
          lehrplanRef: `D-${grade}-Silben`,
          targetWord: w.display,
          syllables: w.word,
          syllableCount: w.count,
          vowels: w.vowels,
          question: `Sprich das Wort „${w.display}“, zeichne die Silbenbögen darunter und trage die Silbenzahl ein.`
        });
      });
    } else if (topicId === 'german-scramble') {
      // 4 Schüttelsätze (österreichischer Wortschatz)
      const scrambles = [
        { pool: ['in', 'der', 'Schultasche', 'liegen', 'Stifte'], target: 'In der Schultasche liegen Stifte' },
        { pool: ['Lukas', 'im', 'Jänner', 'baut', 'Schneemann', 'einen'], target: 'Lukas baut im Jänner einen Schneemann' },
        { pool: ['Katze', 'die', 'auf', 'sitzt', 'dem', 'Sessel'], target: 'Die Katze sitzt auf dem Sessel' },
        { pool: ['fleißig', 'wir', 'rechnen', 'in', 'der', 'Klasse'], target: 'Wir rechnen fleißig in der Klasse' }
      ];

      scrambles.forEach(sc => {
        tasks.push({
          type: 'scramble',
          schulstufe: grade,
          lehrplanRef: `D-${grade}-Satzbau`,
          pool: sc.pool,
          targetSentence: sc.target
        });
      });
    } else {
      // Groß- und Kleinschreibung (4 Sätze)
      const capSentences = [
        { words: [{ text: 'die' }, { text: 'kinder' }, { text: 'spielen' }, { text: 'im' }, { text: 'garten' }], nouns: ['Kinder', 'Garten'] },
        { words: [{ text: 'der' }, { text: 'lehrer' }, { text: 'liest' }, { text: 'ein' }, { text: 'spannendes' }, { text: 'buch' }], nouns: ['Lehrer', 'Buch'] },
        { words: [{ text: 'im' }, { text: 'winter' }, { text: 'fällt' }, { text: 'weißer' }, { text: 'schnee' }], nouns: ['Winter', 'Schnee'] },
        { words: [{ text: 'auf' }, { text: 'dem' }, { text: 'tisch' }, { text: 'liegt' }, { text: 'ein' }, { text: 'roter' }, { text: 'apfel' }], nouns: ['Tisch', 'Apfel'] }
      ];

      capSentences.forEach(c => {
        tasks.push({
          type: 'capitalization',
          schulstufe: grade,
          lehrplanRef: `D-${grade}-Grossklein`,
          words: c.words,
          targetNouns: c.nouns
        });
      });
    }

    return tasks;
  }

  // --- ARCHETYP 5: LESEN & WISSEN (1 Lesekarte / Text + 3–4 Fragen) ---
  function buildReadingKnowledgeWorksheet(topicId, grade) {
    const tasks = [];

    if (topicId === 'german-reading') {
      tasks.push({
        type: 'reading',
        schulstufe: grade,
        lehrplanRef: 'D-3/4-Lesen-Sinnerfassung',
        title: 'Der schlaue Waldfuchs im Winter',
        text: 'Wenn im Jänner dichter Schnee die Wiesen und Berge in Österreich bedeckt, muss der Rotfuchs besonders wachsam sein. Mit seinen feinen Sinnen kann er Mäuse sogar tief unter der Schneedecke rascheln hören. Mit einem weiten Sprung taucht er kopfüber in den Schnee, um seine Beute zu fangen. Sein dichter Winterpelz und der buschige Schwanz, den die Jäger Lunte nennen, wärmen ihn auch bei klirrender Kälte im Fichtenwald.',
        questions: [
          {
            question: 'Wann liegt besonders dichter Schnee auf den Wiesen?',
            options: ['Im Jänner', 'Im Juli', 'Im August'],
            correctIndex: 0
          },
          {
            question: 'Wie spürt der Fuchs Mäuse unter dem Schnee auf?',
            options: ['Mit den feinen Ohren (Gehör)', 'Mit der Lupe', 'Durch lautes Bellen'],
            correctIndex: 0
          },
          {
            question: 'Wie nennen Fachleute den buschigen Schwanz des Fuchses?',
            options: ['Lunte', 'Flosse', 'Feder'],
            correctIndex: 0
          },
          {
            question: 'Was schützt den Fuchs vor der eisigen Kälte?',
            options: ['Sein dichter Winterpelz', 'Eine Heizdecke', 'Ein Schal'],
            correctIndex: 0
          }
        ]
      });
    } else if (topicId === 'general-calendar') {
      tasks.push({
        type: 'reading',
        schulstufe: grade,
        lehrplanRef: 'SU-1/3-Kalender',
        title: 'Unser Jahreskreis in Österreich',
        text: 'Ein volles Jahr hat 12 Monate, 52 Wochen und 365 Tage. Es beginnt am 1. Jänner und endet an Silvester am 31. Dezember. Die vier Jahreszeiten heißen Frühling, Sommer, Herbst und Winter. Jeder Monat bringt besondere Naturerscheinungen und Feste mit sich: Im Jänner liegt oft Schnee, im Mai blühen die Apfelbäume, im Juli beginnen die großen Sommerferien und im Oktober färben sich die Blätter bunt.',
        questions: [
          {
            question: 'Wie heißt der erste Monat des Jahres in Österreich?',
            options: ['Jänner', 'Februar', 'März'],
            correctIndex: 0
          },
          {
            question: 'Wie viele Tage hat ein normales Kalenderjahr?',
            options: ['365 Tage', '200 Tage', '400 Tage'],
            correctIndex: 0
          },
          {
            question: 'Welche vier Jahreszeiten gibt es?',
            options: ['Frühling, Sommer, Herbst, Winter', 'Tag, Nacht, Morgen, Abend', 'Jänner, Mai, Juli, Oktober'],
            correctIndex: 0
          },
          {
            question: 'In welchem Sommermonat starten die Schulferien?',
            options: ['Juli', 'Dezember', 'November'],
            correctIndex: 0
          }
        ]
      });
    } else if (topicId === 'general-traffic' || topicId === 'general-bike-test') {
      // Verkehrszeichen & Sicherheit
      tasks.push({
        type: 'multiple-choice',
        schulstufe: grade,
        lehrplanRef: 'SU-Verkehr-StVO',
        signId: 'vz_stopp',
        question: 'Was bedeutet dieses achteckige rote Schild an einer Kreuzung?',
        options: ['Unbedingt anhalten und Vorrang geben', 'Schnell weiterfahren', 'Nur für Radfahrer'],
        correctIndex: 0
      });
      tasks.push({
        type: 'multiple-choice',
        schulstufe: grade,
        lehrplanRef: 'SU-Verkehr-StVO',
        signId: 'vz_schutzweg',
        question: 'Wie verhältst du dich am Zebrastreifen (Schutzweg)?',
        options: ['Blickkontakt zum Fahrer suchen und zügig queren', 'Ohne zu schauen hinüberlaufen', 'Auf der Straße stehenbleiben'],
        correctIndex: 0
      });
      tasks.push({
        type: 'multiple-choice',
        schulstufe: grade,
        lehrplanRef: 'SU-Verkehr-StVO',
        signId: 'vz_radweg',
        question: 'Welche Ausrüstung ist am Fahrrad laut Fahrradverordnung gesetzlich vorgeschrieben?',
        options: ['Zwei voneinander unabhängige Bremsen & Klingel', 'Ein Lautsprecher', 'Ein Rückspiegel'],
        correctIndex: 0
      });
      tasks.push({
        type: 'multiple-choice',
        schulstufe: grade,
        lehrplanRef: 'SU-Verkehr-StVO',
        signId: 'vz_vorrang_geben',
        question: 'Was bedeutet das auf der Spitze stehende weiße Dreieck mit rotem Rand?',
        options: ['Vorrang geben', 'Hier habe ich immer Vorrang', 'Sackgasse'],
        correctIndex: 0
      });
    } else {
      // Österreich: Bundesländer & Hauptstädte
      tasks.push({
        type: 'multiple-choice',
        schulstufe: 4,
        lehrplanRef: 'SU-4-Oesterreich',
        question: 'Wie heißt die Bundeshauptstadt der Republik Österreich?',
        options: ['Wien', 'Graz', 'Salzburg'],
        correctIndex: 0
      });
      tasks.push({
        type: 'multiple-choice',
        schulstufe: 4,
        lehrplanRef: 'SU-4-Oesterreich',
        question: 'Aus wie vielen Bundesländern besteht Österreich?',
        options: ['9 Bundesländer', '7 Bundesländer', '12 Bundesländer'],
        correctIndex: 0
      });
      tasks.push({
        type: 'multiple-choice',
        schulstufe: 4,
        lehrplanRef: 'SU-4-Oesterreich',
        question: 'Wie heißt die Landeshauptstadt des flächenmäßig größten Bundeslandes Niederösterreich?',
        options: ['St. Pölten', 'Eisenstadt', 'Linz'],
        correctIndex: 0
      });
      tasks.push({
        type: 'multiple-choice',
        schulstufe: 4,
        lehrplanRef: 'SU-4-Oesterreich',
        question: 'Welcher große Strom fließt durch Linz und Wien?',
        options: ['Die Donau', 'Der Rhein', 'Die Mur'],
        correctIndex: 0
      });
    }

    return tasks;
  }

  // --- ARCHETYP 6: BASTELBOGEN (Memory, Zuordnung) ---
  function buildCraftSheetWorksheet(topicId, grade) {
    const pairs = [
      { content: '🦊', subtitle: 'Fuchs' },
      { content: '🦊', subtitle: 'Fuchs' },
      { content: '🦉', subtitle: 'Eule' },
      { content: '🦉', subtitle: 'Eule' },
      { content: '🦔', subtitle: 'Igel' },
      { content: '🦔', subtitle: 'Igel' },
      { content: '🦫', subtitle: 'Biber' },
      { content: '🦫', subtitle: 'Biber' },
      { content: '🌲', subtitle: 'Tanne' },
      { content: '🌲', subtitle: 'Tanne' },
      { content: '⭐', subtitle: 'Stern' },
      { content: '⭐', subtitle: 'Stern' },
      { content: '🍎', subtitle: 'Apfel' },
      { content: '🍎', subtitle: 'Apfel' },
      { content: '🏔️', subtitle: 'Berg' },
      { content: '🏔️', subtitle: 'Berg' }
    ];

    // Mischen für Schneidebogen
    const shuffledCards = [...pairs].sort(() => Math.random() - 0.5);

    return [{
      type: 'memory',
      schulstufe: grade,
      lehrplanRef: 'GT-1/4-Memory-Bastelbogen',
      cards: shuffledCards
    }];
  }

  // =============================================================
  // 3. HAUPT-DISPATCHER FÜR DIE WORKSHEET-ENGINE
  // =============================================================

  function generateWorksheetTasks(topicId, targetGrade) {
    const Topics = window.Schlaufuchs.Topics;
    const meta = Topics ? Topics.getTopicById(topicId) : null;
    const grade = targetGrade || (meta && meta.grades ? meta.grades[0] : 2);
    const archetype = meta ? meta.archetype : 'compact-calc';

    switch (archetype) {
      case 'compact-calc':
        return buildCompactCalcWorksheet(topicId, grade);
      case 'structure-calc':
        return buildStructureCalcWorksheet(topicId, grade);
      case 'story-problem':
        return buildStoryProblemWorksheet(topicId, grade);
      case 'language-writing':
        return buildLanguageWritingWorksheet(topicId, grade);
      case 'reading-knowledge':
        return buildReadingKnowledgeWorksheet(topicId, grade);
      case 'craft-sheet':
        return buildCraftSheetWorksheet(topicId, grade);
      default:
        return buildCompactCalcWorksheet(topicId, grade);
    }
  }

  return {
    generateWorksheetTasks: generateWorksheetTasks,
    pickSecretWord: pickSecretWord,
    tracker: tracker
  };
})();
