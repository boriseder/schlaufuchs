// =============================================================
// SCHLAUFUCHS – js/admin-qa.js
// Qualitätssicherungs- und Prüf-Engine für alle 28 Lehrplan-Themen
// Bietet vollständigen Zugriff auf alle kuratierten Fragenpools
// und systematische Prüfmatrizen für prozedurale Generatoren.
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.AdminQA = (function () {
  'use strict';

  const Topics = window.Schlaufuchs.Topics;
  const MathGen = window.Schlaufuchs.Generators && window.Schlaufuchs.Generators.Math;
  const GermanGen = window.Schlaufuchs.Generators && window.Schlaufuchs.Generators.German;
  const GeneralGen = window.Schlaufuchs.Generators && window.Schlaufuchs.Generators.General;
  const BrainGen = window.Schlaufuchs.Generators && window.Schlaufuchs.Generators.Brain;
  const formatZahl = (window.Schlaufuchs && window.Schlaufuchs.formatZahl) || (n => String(n));
  const Clock = window.Schlaufuchs.Clock;
  const Signs = window.Schlaufuchs.Signs;

  function getAllTopics() {
    if (Topics && typeof Topics.getAllTopics === 'function') {
      return Topics.getAllTopics();
    }
    return [];
  }

  function getTopic(topicId) {
    if (Topics && typeof Topics.getTopicById === 'function') {
      return Topics.getTopicById(topicId);
    }
    return null;
  }

  // Erzeugt für prozedurale Rechenthemen eine systematische Prüfmatrix über alle Klassen
  function buildProceduralMathMatrix(topicId, seed) {
    const questions = [];
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (topicId === 'math-addition') {
      // 1. Klasse: ZR 20
      const pairsG1 = [[5, 3], [7, 4], [8, 5], [9, 7], [6, 8]];
      pairsG1.forEach(([a, b]) => {
        const sum = a + b;
        const overTen = a < 10 && sum > 10;
        const hint = overTen 
          ? `Zehnerübergang: Zuerst ${a} + ${10 - a} = 10, dann 10 + ${b - (10 - a)} = ${sum}.`
          : `Grundaufgabe im Zahlenraum 20: ${a} + ${b} = ${sum}.`;
        questions.push({
          fach: 'mathe',
          schulstufe: 1,
          lehrplanRef: 'M-1-Operationen-Addition',
          type: 'equation',
          questionText: `${formatZahl(a)} + ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(sum),
          options: null,
          hint: hint,
          visualHtml: null
        });
      });

      // 2. Klasse: ZR 100 mit Zehnerübergang
      const pairsG2 = [[28, 15], [37, 26], [45, 38], [54, 29], [66, 17]];
      pairsG2.forEach(([a, b]) => {
        const sum = a + b;
        questions.push({
          fach: 'mathe',
          schulstufe: 2,
          lehrplanRef: 'M-2-Operationen-Addition',
          type: 'equation',
          questionText: `${formatZahl(a)} + ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(sum),
          options: null,
          hint: `Schrittweise addieren: ${a} + ${Math.floor(b / 10) * 10} = ${a + Math.floor(b / 10) * 10}, dann + ${b % 10} = ${sum}.`,
          visualHtml: null
        });
      });

      // 3. Klasse: ZR 1 000
      const pairsG3 = [[240, 380], [350, 470], [425, 238], [512, 389], [670, 250]];
      pairsG3.forEach(([a, b]) => {
        const sum = a + b;
        questions.push({
          fach: 'mathe',
          schulstufe: 3,
          lehrplanRef: 'M-3-Operationen-Addition',
          type: 'equation',
          questionText: `${formatZahl(a)} + ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(sum),
          options: null,
          hint: `Stellenwerte beachten: Hunderter, Zehner und Einer schrittweise addieren (${sum}).`,
          visualHtml: null
        });
      });

      // 4. Klasse: ZR bis 10 000
      const pairsG4 = [[3400, 1600], [4500, 2800], [5200, 3900], [6750, 2250], [7100, 1900]];
      pairsG4.forEach(([a, b]) => {
        const sum = a + b;
        questions.push({
          fach: 'mathe',
          schulstufe: 4,
          lehrplanRef: 'M-4-Operationen-Addition',
          type: 'equation',
          questionText: `${formatZahl(a)} + ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(sum),
          options: null,
          hint: `Tausendersprung und Hunderterergänzung im Zahlenraum bis 10 000 (${sum}).`,
          visualHtml: null
        });
      });
      return questions;
    }

    if (topicId === 'math-subtraction') {
      // 1. Klasse: ZR 20
      const pairsG1 = [[12, 5], [14, 8], [15, 7], [18, 9], [11, 4]];
      pairsG1.forEach(([a, b]) => {
        const diff = a - b;
        questions.push({
          fach: 'mathe',
          schulstufe: 1,
          lehrplanRef: 'M-1-Operationen-Subtraktion',
          type: 'equation',
          questionText: `${formatZahl(a)} − ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(diff),
          options: null,
          hint: `Zehnerrücksprung: Zuerst ${a} − ${a - 10} = 10, dann 10 − ${b - (a - 10)} = ${diff}.`,
          visualHtml: null
        });
      });

      // 2. Klasse: ZR 100 mit Zehnerunterschreitung
      const pairsG2 = [[52, 17], [63, 28], [75, 39], [84, 46], [91, 54]];
      pairsG2.forEach(([a, b]) => {
        const diff = a - b;
        questions.push({
          fach: 'mathe',
          schulstufe: 2,
          lehrplanRef: 'M-2-Operationen-Subtraktion',
          type: 'equation',
          questionText: `${formatZahl(a)} − ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(diff),
          options: null,
          hint: `Schrittweise subtrahieren: ${a} − ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}, dann − ${b % 10} = ${diff}.`,
          visualHtml: null
        });
      });

      // 3. Klasse: ZR 1 000
      const pairsG3 = [[650, 280], [720, 350], [845, 368], [910, 430], [534, 276]];
      pairsG3.forEach(([a, b]) => {
        const diff = a - b;
        questions.push({
          fach: 'mathe',
          schulstufe: 3,
          lehrplanRef: 'M-3-Operationen-Subtraktion',
          type: 'equation',
          questionText: `${formatZahl(a)} − ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(diff),
          options: null,
          hint: `Hunderter- und Zehnerzerlegung im Zahlenraum 1 000 (${diff}).`,
          visualHtml: null
        });
      });

      // 4. Klasse: ZR bis 10 000
      const pairsG4 = [[5000, 1600], [6400, 2800], [7500, 3900], [8200, 4500], [9000, 3250]];
      pairsG4.forEach(([a, b]) => {
        const diff = a - b;
        questions.push({
          fach: 'mathe',
          schulstufe: 4,
          lehrplanRef: 'M-4-Operationen-Subtraktion',
          type: 'equation',
          questionText: `${formatZahl(a)} − ${formatZahl(b)} = ?`,
          correctAnswer: formatZahl(diff),
          options: null,
          hint: `Tausendersprung und Hunderterunterschreitung (${diff}).`,
          visualHtml: null
        });
      });
      return questions;
    }

    if (topicId === 'math-multiplication') {
      // Kernaufgaben (2, 5, 10) & schwere Reihen (3, 4, 6, 7, 8, 9)
      const tasksG2 = [[2, 4], [3, 5], [4, 2], [5, 6], [10, 4]];
      tasksG2.forEach(([a, b]) => {
        const prod = a * b;
        questions.push({
          fach: 'mathe',
          schulstufe: 2,
          lehrplanRef: 'M-2-Operationen-Mal',
          type: 'equation',
          questionText: `${a} · ${b} = ?`,
          correctAnswer: formatZahl(prod),
          options: null,
          hint: `Kernaufgabe: ${a} mal ${b} ist ${prod}. Tauschaufgabe: ${b} · ${a} = ${prod}.`,
          visualHtml: null
        });
      });

      const tasksG3 = [[6, 7], [7, 8], [8, 9], [6, 8], [7, 7], [9, 6]];
      tasksG3.forEach(([a, b]) => {
        const prod = a * b;
        questions.push({
          fach: 'mathe',
          schulstufe: 3,
          lehrplanRef: 'M-3-Operationen-Mal',
          type: 'equation',
          questionText: `${a} · ${b} = ?`,
          correctAnswer: formatZahl(prod),
          options: null,
          hint: `Schwierige Einmaleins-Reihe: ${a} · ${b} = ${prod}.`,
          visualHtml: null
        });
      });

      const tasksG4 = [[12, 4], [15, 3], [25, 4], [30, 6], [50, 8]];
      tasksG4.forEach(([a, b]) => {
        const prod = a * b;
        questions.push({
          fach: 'mathe',
          schulstufe: 4,
          lehrplanRef: 'M-4-Operationen-Mal',
          type: 'equation',
          questionText: `${formatZahl(a)} · ${b} = ?`,
          correctAnswer: formatZahl(prod),
          options: null,
          hint: `Halbschriftliches Rechnen mit Zehnern: ${a} · ${b} = ${formatZahl(prod)}.`,
          visualHtml: null
        });
      });
      return questions;
    }

    if (topicId === 'math-division') {
      const tasksG2 = [[12, 2], [15, 3], [20, 5], [24, 4], [30, 10]];
      tasksG2.forEach(([a, b]) => {
        const res = a / b;
        questions.push({
          fach: 'mathe',
          schulstufe: 2,
          lehrplanRef: 'M-2-Operationen-Geteilt',
          type: 'equation',
          questionText: `${a} : ${b} = ?`,
          correctAnswer: formatZahl(res),
          options: null,
          hint: `Umkehraufgabe denken: Wie oft passt die ${b} in die ${a}? Weil ${res} · ${b} = ${a}.`,
          visualHtml: null
        });
      });

      const tasksG3 = [[42, 6], [56, 7], [63, 9], [48, 8], [72, 8]];
      tasksG3.forEach(([a, b]) => {
        const res = a / b;
        questions.push({
          fach: 'mathe',
          schulstufe: 3,
          lehrplanRef: 'M-3-Operationen-Geteilt',
          type: 'equation',
          questionText: `${a} : ${b} = ?`,
          correctAnswer: formatZahl(res),
          options: null,
          hint: `Großes Einmaleins: ${a} : ${b} = ${res}, denn ${res} · ${b} = ${a}.`,
          visualHtml: null
        });
      });

      // Division mit Rest für 4. Klasse
      const tasksG4 = [
        { a: 38, b: 5, q: 7, r: 3 },
        { a: 52, b: 6, q: 8, r: 4 },
        { a: 65, b: 8, q: 8, r: 1 },
        { a: 75, b: 9, q: 8, r: 3 }
      ];
      tasksG4.forEach(item => {
        questions.push({
          fach: 'mathe',
          schulstufe: 4,
          lehrplanRef: 'M-4-Operationen-Division-Rest',
          type: 'division-rest',
          questionText: `${item.a} : ${item.b} = ? (mit Rest)`,
          correctAnswer: `${item.q} R ${item.r}`,
          options: null,
          hint: `${item.q} · ${item.b} = ${item.q * item.b}, Rest bis ${item.a} ist ${item.r}.`,
          visualHtml: null
        });
      });
      return questions;
    }

    if (topicId === 'math-pyramid') {
      if (MathGen && typeof MathGen.buildPyramidTasks === 'function') {
        const raw = MathGen.buildPyramidTasks();
        return raw.map((t, idx) => ({
          fach: 'mathe',
          schulstufe: t.schulstufe || 2,
          lehrplanRef: t.lehrplanRef || 'M-2-Strukturen-Zahlenmauern',
          type: 'pyramid',
          questionText: `Zahlenmauer lösen (Basis: ${t.a || 3} + ${t.b || 4} + ${t.c || 2})`,
          correctAnswer: `Deckstein: ${formatZahl(t.answer || (t.solution && t.solution.d) || 13)}`,
          options: null,
          hint: 'Zwei nebeneinanderliegende Steine ergeben addiert den darüberliegenden Stein.',
          visualHtml: null
        }));
      }
    }

    if (topicId === 'math-million') {
      if (MathGen && typeof MathGen.buildMillionTasks === 'function') {
        const raw = MathGen.buildMillionTasks();
        return raw.map((t, idx) => ({
          fach: 'mathe',
          schulstufe: 4,
          lehrplanRef: t.lehrplanRef || 'M-4-Zahlenraum-Million',
          type: 'direct-input',
          questionText: t.question || 'Zahlenraum bis 1 Million untersuchen',
          correctAnswer: formatZahl(t.answer),
          options: null,
          hint: t.hint || 'Beachte die Stellenwerte: HT (Hunderttausend), ZT (Zehntausend), T (Tausend).',
          visualHtml: null
        }));
      }
    }

    if (topicId === 'math-written') {
      if (MathGen && typeof MathGen.buildWrittenMathTasks === 'function') {
        const raw = MathGen.buildWrittenMathTasks();
        return raw.map((t, idx) => {
          const opSymbol = t.op === 'sub' ? '−' : '+';
          return {
            fach: 'mathe',
            schulstufe: t.schulstufe || 3,
            lehrplanRef: t.lehrplanRef || 'M-3-Operationen-Schriftlich',
            type: 'written',
            questionText: `Schriftliche Rechnung: ${formatZahl(t.a)} ${opSymbol} ${formatZahl(t.b)}`,
            correctAnswer: formatZahl(t.answer),
            options: null,
            hint: 'Einer unter Einer, Zehner unter Zehner, Hunderter unter Hunderter. Übertrag beachten!',
            visualHtml: null
          };
        });
      }
    }

    if (topicId === 'math-twenty') {
      if (MathGen && typeof MathGen.buildTwentyFieldTasks === 'function') {
        const raw = MathGen.buildTwentyFieldTasks();
        return raw.map(t => ({
          fach: 'mathe',
          schulstufe: 1,
          lehrplanRef: t.lehrplanRef || 'M-1-Zahlenraum-20',
          type: 'twentyfield',
          questionText: t.question || `Wie viele Punkte siehst du im Zwanzigerfeld?`,
          correctAnswer: formatZahl(t.answer),
          options: null,
          hint: t.hint || 'Nutze die Kraft der Fünf: Eine volle Reihe hat 10 Punkte, eine halbe Reihe 5 Punkte.',
          visualHtml: null
        }));
      }
    }

    if (topicId === 'brain-sequence') {
      const grades = [1, 2, 3, 4];
      grades.forEach(g => {
        let samplePool, sampleTarget;
        if (g === 1) {
          sampleTarget = [2, 5, 9, 14, 18];
          samplePool = [9, 2, 18, 5, 14];
        } else if (g === 2) {
          sampleTarget = [12, 28, 45, 67, 89];
          samplePool = [45, 12, 89, 28, 67];
        } else if (g === 3) {
          sampleTarget = [120, 245, 410, 680, 890];
          samplePool = [410, 120, 890, 245, 680];
        } else {
          sampleTarget = [15000, 42000, 120000, 450000, 800000];
          samplePool = [120000, 15000, 800000, 42000, 450000];
        }
        questions.push({
          fach: 'denken',
          schulstufe: g,
          lehrplanRef: `GT-${g}-Logik-Zahlenreihen`,
          type: 'sequence',
          questionText: `Zahlen der Größe nach ordnen: ${samplePool.map(formatZahl).join(', ')}`,
          correctAnswer: sampleTarget.map(formatZahl).join(' < '),
          options: null,
          hint: 'Vergleiche Stellenwerte: Zuerst Einer und Zehner, dann Hunderter und Tausender.',
          visualHtml: null
        });
      });
      return questions;
    }

    if (topicId === 'brain-pattern') {
      if (BrainGen && typeof BrainGen.buildPatternsTasks === 'function') {
        const raw = BrainGen.buildPatternsTasks();
        return raw.map(t => {
          const qText = t.question || (t.displaySequence ? `${t.title || 'Muster fortsetzen:'} ${t.displaySequence.join('  ')}` : 'Muster fortsetzen');
          const ans = t.targetAnswer || t.answer || t.correctText || '';
          return {
            fach: 'denken',
            schulstufe: t.schulstufe || 2,
            lehrplanRef: t.lehrplanRef || 'GT-2-Logik-Muster',
            type: 'pattern',
            questionText: qText,
            correctAnswer: String(ans),
            options: t.options ? t.options.map(opt => ({ text: String(opt), isCorrect: String(opt) === String(ans) })) : null,
            hint: t.hint || 'Untersuche die Gesetzmäßigkeit der Reihe.',
            visualHtml: null
          };
        });
      }
    }

    if (topicId === 'brain-memory') {
      return [
        {
          fach: 'denken',
          schulstufe: 1,
          lehrplanRef: 'GT-1-Gedaechtnis-Memory',
          type: 'memory',
          questionText: 'Themenset 1: Heimische Waldtiere (6 Paare)',
          correctAnswer: 'Fuchs, Hase, Bär, Igel, Eule, Eichhörnchen',
          options: null,
          hint: 'Gedächtnistraining ohne Rechenstress: Finde die passenden Tierpaare.',
          visualHtml: null
        },
        {
          fach: 'denken',
          schulstufe: 2,
          lehrplanRef: 'GT-2-Gedaechtnis-Memory',
          type: 'memory',
          questionText: 'Themenset 2: Spannende Wildtiere (6 Paare)',
          correctAnswer: 'Löwe, Panda, Koala, Tiger, Elefant, Giraffe',
          options: null,
          hint: 'Konzentration und visuelle Merkfähigkeit trainieren.',
          visualHtml: null
        },
        {
          fach: 'denken',
          schulstufe: 3,
          lehrplanRef: 'GT-3-Gedaechtnis-Memory',
          type: 'memory',
          questionText: 'Themenset 3: Natur & Pflanzen (6 Paare)',
          correctAnswer: 'Apfel, Erdbeere, Karotte, Sonnenblume, Tanne, Glückspilz',
          options: null,
          hint: 'Merke dir die Positionen der Naturkarten.',
          visualHtml: null
        },
        {
          fach: 'denken',
          schulstufe: 4,
          lehrplanRef: 'GT-4-Gedaechtnis-Memory',
          type: 'memory',
          questionText: 'Themenset 4: Wiese & Gewässer (6 Paare)',
          correctAnswer: 'Frosch, Schmetterling, Biene, Marienkäfer, Ente, Fisch',
          options: null,
          hint: 'Visuelle Orientierung im 12er-Raster.',
          visualHtml: null
        }
      ];
    }

    return questions;
  }

  // Ruft alle Fragen für ein beliebiges Thema ab und normalisiert sie einheitlich
  function getAllQuestionsForTopic(topicId, options = {}) {
    const topic = getTopic(topicId);
    if (!topic) return [];

    let rawTasks = [];

    // 1. SACHUNTERRICHT
    if (topicId === 'general-calendar') {
      rawTasks = GeneralGen.buildCalendarTasks({ all: true });
    } else if (topicId === 'general-animals' || topicId === 'general-winter') {
      rawTasks = GeneralGen.buildWinterTasks({ all: true });
    } else if (topicId === 'general-austria') {
      rawTasks = GeneralGen.buildAustriaTasks({ all: true });
    } else if (topicId === 'general-traffic') {
      rawTasks = GeneralGen.buildSchoolWalkTasks({ all: true });
    } else if (topicId === 'general-bike-test') {
      rawTasks = GeneralGen.buildTrafficTasks({ all: true });
    }

    // 2. DEUTSCH
    else if (topicId === 'german-word-types') {
      rawTasks = GermanGen.buildWordTypesTasks({ all: true });
    } else if (topicId === 'german-capitalization') {
      rawTasks = GermanGen.buildCapitalizationTasks({ all: true });
    } else if (topicId === 'german-scramble') {
      rawTasks = GermanGen.buildScrambleTasks({ all: true });
    } else if (topicId === 'german-cases') {
      rawTasks = GermanGen.buildCasesTasks({ all: true });
    } else if (topicId === 'german-tenses') {
      rawTasks = GermanGen.buildTensesTasks({ all: true });
    } else if (topicId === 'german-syllables') {
      rawTasks = GermanGen.buildSyllableTasks({ all: true });
    } else if (topicId === 'german-reading') {
      rawTasks = GermanGen.buildReadingTasks({ all: true });
    }

    // 3. MATHEMATIK (Kuratierte Pools)
    else if (topicId === 'math-stories' || topicId === 'math-story') {
      rawTasks = MathGen.buildStoryTasks({ all: true });
    } else if (topicId === 'math-units') {
      rawTasks = MathGen.buildUnitsTasks({ all: true });
    } else if (topicId === 'math-geometry') {
      rawTasks = MathGen.buildGeometryTasks({ all: true });
    } else if (topicId === 'math-money') {
      rawTasks = MathGen.buildMoneyTasks({ all: true });
    } else if (topicId === 'math-clock' || topicId === 'math-time-money') {
      rawTasks = MathGen.buildClockTasks({ all: true });
    }

    // 4. MATHEMATIK (Prozedural) & GEHIRNTRAINING
    else {
      rawTasks = buildProceduralMathMatrix(topicId, options.seed);
    }

    // Normalisierung in einheitliches QA-Modell
    const normalized = [];
    rawTasks.forEach((t, i) => {
      let qText = t.question || t.questionText || '';
      let cAnswer = '';
      let optionsList = null;
      let hintText = t.hint || '';
      let visual = t.customVisualHtml || t.visualHtml || null;

      // Type-spezifische Normalisierung
      if (t.type === 'word-types') {
        qText = `Wortarten bestimmen im Satz: „${t.originalText}“`;
        const wordsSummary = (t.sentence || [])
          .filter(token => token.type)
          .map(token => `${token.word} (${token.type})`)
          .join(', ');
        cAnswer = wordsSummary || 'Alle Wortarten korrekt zugeordnet';
        hintText = 'Namenwörter (blau), Tunwörter (rot), Wiewörter (grün).';
      } else if (t.type === 'reading') {
        (t.questions || []).forEach((subQ, subIdx) => {
          normalized.push({
            index: normalized.length + 1,
            id: `${topicId}-${i + 1}-${subIdx + 1}`,
            topicId: topicId,
            fach: t.fach || topic.subject,
            schulstufe: t.schulstufe || t.grade || 3,
            lehrplanRef: t.lehrplanRef || topic.lehrplanRef,
            archetype: topic.archetype,
            type: 'reading-subquestion',
            questionText: `Lesetext: „${t.title}“ – Frage: ${subQ.question}`,
            correctAnswer: subQ.correctText || (subQ.options && subQ.options[subQ.correctIndex]) || '',
            options: (subQ.options || []).map(opt => ({
              text: opt,
              isCorrect: opt === subQ.correctText
            })),
            hint: subQ.hint || 'Lies die entsprechende Stelle im Lesetext aufmerksam nach.',
            visualHtml: null,
            details: { readingText: t.text }
          });
        });
        return;
      } else if (t.type === 'multiple-choice') {
        cAnswer = t.correctText || (t.options && t.options[t.correctIndex]) || '';
        if (Array.isArray(t.options)) {
          optionsList = t.options.map(opt => ({
            text: opt,
            isCorrect: opt === cAnswer
          }));
        }
      } else if (t.type === 'clock') {
        cAnswer = t.answerText || (t.hours !== undefined ? `${t.hours}:${String(t.minutes || 0).padStart(2, '0')} Uhr` : String(t.answer));
        if (Clock && typeof Clock.createClockSvg === 'function' && t.hours !== undefined) {
          visual = Clock.createClockSvg(t.hours, t.minutes || 0, 160);
        }
      } else if (t.type === 'clock-choice') {
        cAnswer = t.targetText || t.correctText || 'Passendes Zifferblatt';
        optionsList = (t.options || []).map(opt => ({
          text: opt.timeText || opt.text || `${opt.hours}:${String(opt.minutes || 0).padStart(2, '0')} Uhr`,
          isCorrect: opt.isCorrect === true
        }));
      } else if (t.type === 'clock-set') {
        cAnswer = t.targetText || `${t.targetHours}:${String(t.targetMinutes || 0).padStart(2, '0')} Uhr`;
      } else if (t.type === 'geometry') {
        cAnswer = `${formatZahl(t.answer)} ${t.unit || ''}`.trim();
        hintText = `Formel: ${t.formula}. ${hintText}`.trim();
      } else if (t.type === 'text-problem') {
        qText = `Sachaufgabe: ${t.story} Fragestellung: ${t.question}`;
        cAnswer = `Rechnung: ${t.calculation} | Antwort: ${t.answerText || formatZahl(t.answer)}`;
      } else if (t.type === 'scramble') {
        const wordsList = t.pool || t.words || [];
        qText = `Schüttelsatz ordnen: „${wordsList.join(' / ')}“`;
        cAnswer = t.targetSentence || t.solution || t.correctAnswer || '';
      } else if (t.type === 'capitalization') {
        const sentenceWords = t.words ? t.words.map(w => w.text).join(' ') : (t.sentence || '');
        qText = `Groß- und Kleinschreibung: „${sentenceWords}“`;
        cAnswer = t.targetNouns ? `Namenwörter groß: ${t.targetNouns.join(', ')}` : (t.solution || t.correctAnswer || '');
      } else {
        cAnswer = String(t.correctAnswer !== undefined ? t.correctAnswer : (t.answer !== undefined ? formatZahl(t.answer) : ''));
        if (Array.isArray(t.options)) {
          optionsList = t.options.map(opt => {
            const optText = typeof opt === 'object' ? opt.text : String(opt);
            return {
              text: optText,
              isCorrect: typeof opt === 'object' ? opt.isCorrect : optText === cAnswer
            };
          });
        }
      }

      normalized.push({
        index: normalized.length + 1,
        id: `${topicId}-${i + 1}`,
        topicId: topicId,
        fach: t.fach || topic.subject,
        schulstufe: t.schulstufe || t.grade || 1,
        lehrplanRef: t.lehrplanRef || topic.lehrplanRef,
        archetype: topic.archetype,
        type: t.type || 'standard',
        questionText: qText,
        correctAnswer: cAnswer,
        options: optionsList,
        hint: hintText,
        visualHtml: visual,
        details: t
      });
    });

    return normalized;
  }

  // Filterung nach Schulstufe und Textsuche
  function filterQuestions(questions, filter = {}) {
    if (!Array.isArray(questions)) return [];

    return questions.filter(q => {
      if (filter.grade && filter.grade !== 'all') {
        const targetG = parseInt(filter.grade, 10);
        if (q.schulstufe !== targetG) return false;
      }

      if (filter.query && filter.query.trim().length > 0) {
        const term = filter.query.trim().toLowerCase();
        const textMatch = (q.questionText || '').toLowerCase().includes(term);
        const answerMatch = (q.correctAnswer || '').toLowerCase().includes(term);
        const hintMatch = (q.hint || '').toLowerCase().includes(term);
        const lehrplanMatch = (q.lehrplanRef || '').toLowerCase().includes(term);
        if (!textMatch && !answerMatch && !hintMatch && !lehrplanMatch) {
          return false;
        }
      }

      return true;
    });
  }

  return {
    getAllTopics: getAllTopics,
    getTopic: getTopic,
    getAllQuestionsForTopic: getAllQuestionsForTopic,
    filterQuestions: filterQuestions
  };
})();
