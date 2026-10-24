// =============================================================
// SCHLAUFUCHS – js/renderers/scaffolding.js
// Fachdidaktisches Scaffolding & Rechenstrich-Logik (Lehrplan 2023)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  // --- FACHDIDAKTISCHES SCAFFOLDING & RECHENSTRICH (BMBWF Lehrplan 2023) ---

  function getScaffoldingData(task) {
    const parseNum = (v) => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      return parseInt(String(v).replace(/[^\d]/g, ''), 10) || 0;
    };

    const a = task.raw1 !== undefined ? task.raw1 : parseNum(task.num1);
    const b = task.raw2 !== undefined ? task.raw2 : parseNum(task.num2);
    const sym = task.symbol || '+';
    const ans = task.answer !== undefined ? task.answer : (sym === '−' || sym === '-' ? a - b : sym === '·' || sym === '*' ? a * b : sym === ':' ? Math.floor(a / b) : a + b);
    const isSub = sym === '−' || sym === '-' || task.op === 'sub';
    const isMul = sym === '·' || sym === '*' || task.op === 'mul';
    const isDiv = sym === ':' || sym === '/' || task.op === 'div';

    let impulse = '';
    let steps = [];
    let points = []; // [{ val, jump }]

    if (!isSub && !isMul && !isDiv) {
      // ADDITION (+)
      if (b <= 10) {
        const dist = 10 - (a % 10);
        if (a % 10 !== 0 && b > dist && dist > 0) {
          const z = a + dist;
          const rest = b - dist;
          impulse = `Rechne zuerst bis zum nächsten Zehner (${z}), dann den Rest (${rest}) dazu.`;
          steps = [`${a} + ${dist} = ${z}`, `${z} + ${rest} = ${ans}`];
          points = [
            { val: a },
            { val: z, jump: `+${dist}` },
            { val: ans, jump: `+${rest}` }
          ];
        } else {
          impulse = `Zähle von ${a} um ${b} weiter.`;
          steps = [`${a} + ${b} = ${ans}`];
          points = [
            { val: a },
            { val: ans, jump: `+${b}` }
          ];
        }
      } else {
        const bTens = Math.floor(b / 10) * 10;
        const bUnits = b % 10;
        const step1 = a + bTens;
        if (bUnits === 0) {
          impulse = `Rechne zuerst die Zehner (+${bTens}) dazu.`;
          steps = [`${a} + ${bTens} = ${ans}`];
          points = [
            { val: a },
            { val: ans, jump: `+${bTens}` }
          ];
        } else {
          const dist = 10 - (step1 % 10);
          if (step1 % 10 !== 0 && bUnits > dist && dist > 0) {
            const z2 = step1 + dist;
            const rest = bUnits - dist;
            impulse = `Rechne zuerst die Zehner (+${bTens}), dann zum nächsten Zehner (${z2}) und den Rest (${rest}) dazu.`;
            steps = [
              `${a} + ${bTens} = ${step1}`,
              `${step1} + ${dist} = ${z2}`,
              `${z2} + ${rest} = ${ans}`
            ];
            points = [
              { val: a },
              { val: step1, jump: `+${bTens}` },
              { val: z2, jump: `+${dist}` },
              { val: ans, jump: `+${rest}` }
            ];
          } else {
            impulse = `Rechne zuerst die Zehner (+${bTens}), danach die Einer (+${bUnits}) dazu.`;
            steps = [
              `${a} + ${bTens} = ${step1}`,
              `${step1} + ${bUnits} = ${ans}`
            ];
            points = [
              { val: a },
              { val: step1, jump: `+${bTens}` },
              { val: ans, jump: `+${bUnits}` }
            ];
          }
        }
      }
    } else if (isSub) {
      // SUBTRAKTION (−)
      if (b <= 10) {
        const units = a % 10;
        if (units !== 0 && b > units) {
          const z = a - units;
          const rest = b - units;
          impulse = `Rechne zuerst zurück zum Zehner (${z}), dann den Rest (${rest}) weg.`;
          steps = [`${a} − ${units} = ${z}`, `${z} − ${rest} = ${ans}`];
          points = [
            { val: ans },
            { val: z, jump: `−${rest}` },
            { val: a, jump: `−${units}` }
          ];
        } else {
          impulse = `Zähle von ${a} um ${b} zurück.`;
          steps = [`${a} − ${b} = ${ans}`];
          points = [
            { val: ans },
            { val: a, jump: `−${b}` }
          ];
        }
      } else {
        const bTens = Math.floor(b / 10) * 10;
        const bUnits = b % 10;
        const step1 = a - bTens;
        if (bUnits === 0) {
          impulse = `Rechne zuerst die Zehner (−${bTens}) weg.`;
          steps = [`${a} − ${bTens} = ${ans}`];
          points = [
            { val: ans },
            { val: a, jump: `−${bTens}` }
          ];
        } else {
          const units = step1 % 10;
          if (units !== 0 && bUnits > units) {
            const z2 = step1 - units;
            const rest = bUnits - units;
            impulse = `Rechne zuerst die Zehner (−${bTens}), dann zurück zum Zehner (${z2}) und den Rest (${rest}) weg.`;
            steps = [
              `${a} − ${bTens} = ${step1}`,
              `${step1} − ${units} = ${z2}`,
              `${z2} − ${rest} = ${ans}`
            ];
            points = [
              { val: ans },
              { val: z2, jump: `−${rest}` },
              { val: step1, jump: `−${units}` },
              { val: a, jump: `−${bTens}` }
            ];
          } else {
            impulse = `Rechne zuerst die Zehner (−${bTens}), danach die Einer (−${bUnits}) weg.`;
            steps = [
              `${a} − ${bTens} = ${step1}`,
              `${step1} − ${bUnits} = ${ans}`
            ];
            points = [
              { val: ans },
              { val: step1, jump: `−${bUnits}` },
              { val: a, jump: `−${bTens}` }
            ];
          }
        }
      }
    } else if (isMul) {
      // MULTIPLIKATION (·)
      impulse = `Multiplikation ist wiederholtes Plusrechnen: ${a} · ${b} bedeutet ${a}-mal die Zahl ${b}.`;
      steps = [`${a} · ${b} = ${ans}`];
      if (a <= 10) {
        points = [{ val: 0 }];
        for (let k = 1; k <= a; k++) {
          points.push({ val: k * b, jump: `+${b}` });
        }
      } else {
        points = [{ val: 0 }, { val: ans, jump: `${a} · ${b}` }];
      }
    } else {
      // DIVISION (:)
      impulse = `Wie oft passt ${b} in ${a}? Denke an die Umkehraufgabe: ? · ${b} = ${a}.`;
      steps = [`${ans} · ${b} = ${a}`, `${a} : ${b} = ${ans}`];
      points = [{ val: 0 }, { val: a, jump: `${ans} · ${b}` }];
    }

    return { impulse, steps, points, isSub, isMul, isDiv };
  }

  function createNumberLineSvg(scaffoldData) {
    const { points, isSub } = scaffoldData;
    if (!points || points.length < 2) return '';

    const w = 520;
    const h = 88;
    const yBase = 60;
    const n = points.length;

    const padLeft = 45;
    const padRight = 45;
    const span = w - padLeft - padRight;

    const coords = points.map((p, i) => {
      const formatted = (window.Schlaufuchs && window.Schlaufuchs.formatZahl)
        ? window.Schlaufuchs.formatZahl(p.val)
        : String(p.val);
      return {
        ...p,
        formatted,
        x: Math.round(padLeft + (i * span) / (n - 1))
      };
    });

    let arcsSvg = '';
    let ticksSvg = '';
    let labelsSvg = '';

    for (let i = 0; i < coords.length; i++) {
      const cur = coords[i];
      ticksSvg += `<line x1="${cur.x}" y1="${yBase - 6}" x2="${cur.x}" y2="${yBase + 6}" stroke="var(--tinte, #2a2521)" stroke-width="2.5" />`;
      labelsSvg += `<text x="${cur.x}" y="${yBase + 22}" text-anchor="middle" font-family="PrimaeText, var(--font-base), sans-serif" font-size="13" font-weight="700" fill="var(--tinte, #2a2521)">${cur.formatted}</text>`;

      if (i > 0) {
        const prev = coords[i - 1];
        const midX = (prev.x + cur.x) / 2;
        const arcH = Math.min(36, Math.max(20, Math.abs(cur.x - prev.x) * 0.42));
        const topY = yBase - arcH;

        arcsSvg += `<path d="M ${prev.x} ${yBase - 3} Q ${midX} ${topY} ${cur.x} ${yBase - 3}" fill="none" stroke="var(--mathe, #2563eb)" stroke-width="2.5" stroke-linecap="round" />`;

        const jumpText = isSub ? (prev.jump || cur.jump || '') : (cur.jump || '');
        if (jumpText) {
          arcsSvg += `<text x="${midX}" y="${topY - 4}" text-anchor="middle" font-family="PrimaeText, var(--font-base), sans-serif" font-size="12" font-weight="700" fill="var(--mathe, #2563eb)">${jumpText}</text>`;
        }
      }
    }

    return `
      <div class="scaffolding-numberline-box">
        <div class="scaffolding-numberline-title">Didaktischer Rechenstrich:</div>
        <svg viewBox="0 0 ${w} ${h}" class="numberline-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Rechenstrich">
          <line x1="${padLeft - 20}" y1="${yBase}" x2="${w - padRight + 20}" y2="${yBase}" stroke="var(--linie, #2a2521)" stroke-width="2" stroke-linecap="round" />
          <polygon points="${w - padRight + 25},${yBase} ${w - padRight + 15},${yBase - 5} ${w - padRight + 15},${yBase + 5}" fill="var(--linie, #2a2521)" />
          ${arcsSvg}
          ${ticksSvg}
          ${labelsSvg}
        </svg>
      </div>
    `;
  }

  // --- UNIVERSELLE FACHDIDAKTISCHE SCAFFOLDING-ENGINE (BMBWF LEHRPLAN 2023) ---

  function getUniversalScaffolding(task) {
    if (!task) return null;

    // 1. Mathe-Gleichungen (Rechenstrich)
    if (task.type === 'equation' || (task.fach === 'mathe' && task.num1 !== undefined && task.num2 !== undefined)) {
      return getScaffoldingData(task);
    }

    // 2. Zahlenmauern / Rechentürme
    if (task.type === 'pyramid') {
      return {
        impulse: 'Zwei nebeneinanderliegende Steine ergeben zusammen genau den Stein darüber (+).',
        rule: 'Rechne von unten nach oben:\n• Fehlt der obere Stein: Plus rechnen (+)\n• Fehlt ein unterer Stein: Minus rechnen (−) vom oberen Stein!',
        substeps: [
          'Schritt 1: Suche zwei bekannte Steine nebeneinander oder übereinander.',
          'Schritt 2: Bei 2 Steinen nebeneinander: Rechne sie zusammen (+).',
          'Schritt 3: Bei oberem und einem unteren Stein: Rechne oben minus unten (−).'
        ]
      };
    }

    // 3. Zwanzigerfeld
    if (task.type === 'twenty-field') {
      return {
        impulse: 'Fülle zuerst die obere Zeile (10 Punkte) voll, dann die untere Zeile.',
        rule: 'Das Zwanzigerfeld hat 2 Zeilen mit je 10 Punkten (getrennt in 5er-Blöcke).',
        substeps: [
          `Blaue Punkte: ${task.a || ''}`,
          `Rote Punkte: ${task.b || ''}`,
          `Zusammen: ${task.total || task.answer || ''}`
        ]
      };
    }

    // 4. Schriftliche Rechenverfahren
    if (task.type === 'written-calc') {
      return {
        impulse: 'Rechne immer von rechts nach links: Zuerst Einer, dann Zehner, dann Hunderter.',
        rule: 'Wenn das Teilergebnis 10 oder mehr ist, schreibe die Einerziffer unten hin und notiere die Zehnerziffer in die Übertragszeile (Ü).',
        substeps: [
          '1. Einer zusammenrechnen (oder abziehen)',
          '2. Übertrag (Ü) mitnehmen',
          '3. Zehner und Hunderter berechnen'
        ]
      };
    }

    // 5. Textaufgaben
    if (task.type === 'text-problem') {
      return {
        impulse: 'Lies die Geschichte genau durch und suche nach den Signalwörtern.',
        rule: 'Signalwörter für Plus (+): dazu, insgesamt, zusammen.\nSignalwörter für Minus (−): weg, weniger, verbraucht, übrig.',
        substeps: [
          task.hint ? `Tipp: ${task.hint}` : 'Überlege: Wird es mehr (+) oder weniger (−)?',
          'Stelle die Rechnung auf und trage das Ergebnis ein.'
        ]
      };
    }

    // 6. Wortarten (Deutsch)
    if (task.type === 'word-types') {
      return {
        impulse: 'Wende die 3 Sprachproben an: Namenwort (der/die/das?), Tunwort (was tut jemand?), Wiewort (wie ist etwas?).',
        rule: 'Namenwort (Nomen): Menschen, Tiere, Dinge. Haben Begleiter und werden GROSS geschrieben.\nTunwort (Verb): Was jemand tut (laufen, malen). Ändert seine Endung (ich lerne, wir lernen).\nWiewort (Adjektiv): Wie etwas ist (schnell, bunt). Lässt sich steigern (schnell, schneller).',
        substeps: [
          'Namenwort-Probe: Passt "der", "die" oder "das" davor?',
          'Tunwort-Probe: Kannst du "wir ..." davor setzen?',
          'Wiewort-Probe: Kannst du "sehr ..." davor setzen?'
        ]
      };
    }

    // 7. Groß- und Kleinschreibung (Deutsch)
    if (task.type === 'capitalization') {
      return {
        impulse: 'Namenwörter und Satzanfänge werden großgeschrieben. Alle anderen Wörter klein.',
        rule: 'Namenwörter bezeichnen Menschen, Tiere, Pflanzen und Gegenstände. Sie haben oft Begleiter (der, die, ein) oder versteckte Begleiter (im = in dem, beim = bei dem).',
        substeps: [
          'Prüfe jedes Wort: Bezeichnet es etwas, das man sehen oder anfassen kann?',
          'Probe: Setze gedanklich "der", "die" oder "das" davor.',
          'Tippe das Wort an, um den Anfangsbuchstaben großzuschreiben.'
        ]
      };
    }

    // 8. Schüttelsätze (Deutsch)
    if (task.type === 'scramble') {
      return {
        impulse: 'Suche zuerst den Satzanfang (Großbuchstabe) und das Satzende (Punkt oder Fragezeichen).',
        rule: 'Ein vollständiger deutscher Satz braucht ein Satzglied (Wer?) und ein Tunwort (Was geschieht?).',
        substeps: [
          '1. Setze das großgeschriebene Wort an den Anfang.',
          '2. Finde das Tunwort: Was tut jemand?',
          task.targetSentence ? `Lösungshilfe: Der Satz beginnt mit "${task.targetSentence.split(' ')[0]}..."` : '3. Schließe den Satz mit dem Punkt-Wort ab.'
        ]
      };
    }

    // 9. Leseverständnis (PIRLS / Deutsch)
    if (task.type === 'reading') {
      return {
        impulse: 'Lies den Sachtext aufmerksam durch. Die Antworten findest du direkt im Text!',
        rule: 'Suche nach Signalwörtern aus der Frage im Text. Lies den passenden Satz noch einmal ganz genau.',
        substeps: [
          '1. Lies die Frage und merke dir wichtige Signalwörter.',
          '2. Finde die passende Textstelle im Sachtext links.',
          '3. Wähle die Antwort aus, die genau zum Text passt.'
        ]
      };
    }

    // 10. Sachunterricht / Multiple Choice / Allgemein
    if (task.type === 'multiple-choice' || task.type === 'direct-input' || task.type === 'geometry') {
      const rawHint = task.hint || '';
      return {
        impulse: 'Lies die Frage aufmerksam durch und schließe Antworten aus, die sicher nicht stimmen können.',
        rule: rawHint || 'Achte auf die Merkmale: Formen, Farben, Kalenderreihenfolge oder Einheiten.',
        substeps: [
          rawHint ? `Tipp: ${rawHint}` : 'Prüfe jede der vorgegebenen Auswahlmöglichkeiten.',
          'Wähle die passendste Antwort aus und klicke auf Prüfen.'
        ]
      };
    }

    // 10. Fallback auf task.hint falls vorhanden
    if (task.hint) {
      return {
        impulse: 'Hier ist eine Denkhilfe für diese Aufgabe:',
        rule: task.hint,
        substeps: [task.hint]
      };
    }

    return null;
  }

  // --- EINHEITLICHE BODENLEISTE (ACTION-BAR) & WIDGET-LOGIK ---


  R.getScaffoldingData = getScaffoldingData;
  R.getUniversalScaffolding = getUniversalScaffolding;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
