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
          steps = [
            `1. Starte auf dem Rechenstrich bei der Zahl ${a}.`,
            `2. Zähle um ${b} weiter: ${a} + ${b} = ${ans}.`
          ];
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
          steps = [
            `1. Starte bei ${a}.`,
            `2. Zähle den Zehnerschritt (+${bTens}) dazu: ${a} + ${bTens} = ${ans}.`
          ];
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
          steps = [
            `1. Starte auf dem Rechenstrich bei der Zahl ${a}.`,
            `2. Zähle um ${b} zurück: ${a} − ${b} = ${ans}.`
          ];
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
          steps = [
            `1. Starte bei ${a}.`,
            `2. Zähle den Zehnerschritt zurück (−${bTens}): ${a} − ${bTens} = ${ans}.`
          ];
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
      steps = [
        `1. Rechne in ${b}er-Schritten von 0 aus vorwärts.`,
        `2. Nach ${a} Sprüngen erreichst du das Ergebnis: ${a} · ${b} = ${ans}.`
      ];
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

    // Falls die Aufgabe bereits ein vollständiges, eigenes didaktisches Scaffolding-Objekt mitbringt:
    if (task.scaffolding && task.scaffolding.impulse) {
      return task.scaffolding;
    }

    // 1. Mathe-Gleichungen (didaktischer Rechenstrich)
    if (task.type === 'equation' || (task.fach === 'mathe' && task.num1 !== undefined && task.num2 !== undefined)) {
      return getScaffoldingData(task);
    }

    // 2. Zahlenmauern / Rechentürme
    if (task.type === 'pyramid') {
      return {
        impulse: 'Zwei nebeneinanderliegende Steine ergeben zusammen genau den Stein darüber (+).',
        rule: 'Rechne von unten nach oben:\n• Fehlt der obere Stein: Plus rechnen (+)\n• Fehlt ein unterer Stein: Minus rechnen (−) vom oberen Stein!',
        substeps: [
          '1. Suche zwei bekannte Steine nebeneinander oder übereinander.',
          '2. Bei 2 Steinen nebeneinander: Rechne sie zusammen (+).',
          '3. Bei oberem und unterem Stein: Rechne oben minus unten (−).'
        ]
      };
    }

    // 3. Zwanzigerfeld
    if (task.type === 'twenty-field') {
      return {
        impulse: 'Fülle zuerst die obere Zeile (10 Punkte) voll, dann die untere Zeile.',
        rule: 'Das Zwanzigerfeld hat 2 Zeilen mit je 10 Punkten (strukturiert in 5er-Blöcke).',
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
        impulse: 'Rechne immer stellenwertgerecht von rechts nach links: Zuerst Einer, dann Zehner, dann Hunderter.',
        rule: 'Wenn das Teilergebnis 10 oder mehr ist, schreibe die Einerziffer unten hin und notiere die Zehnerziffer in die Übertragszeile (Ü).',
        substeps: [
          '1. Einer zusammenrechnen (oder abziehen)',
          '2. Übertrag (Ü) mitnehmen',
          '3. Zehner und Hunderter berechnen'
        ]
      };
    }

    // 5. Textaufgaben / Sachrechnen
    if (task.type === 'text-problem') {
      return {
        impulse: 'Lies die Sachaufgabe genau und kläre die Situation: Werden Mengen zusammengelegt, aufgeteilt oder weggenommen?',
        rule: 'Signalwörter für Plus (+): dazu, insgesamt, zusammen.\nSignalwörter für Minus (−): weg, weniger, verbraucht, Rest.\nSignalwörter für Mal (·): je, jedes Mal, vervielfachen.\nSignalwörter für Geteilt (:): gerecht aufteilen, verteilen, wie viele Teile.',
        substeps: [
          '1. Frage klären: Was ist gegeben und was wird gesucht?',
          task.hint ? `2. Sachhinweis: ${task.hint}` : '2. Rechenoperation bestimmen: Plus (+), Minus (−), Mal (·) oder Geteilt (:).',
          '3. Rechenausdruck aufstellen, ausrechnen und als Antwort überprüfen.'
        ]
      };
    }

    // 6. Wortarten (Deutsch)
    if (task.type === 'word-types') {
      return {
        impulse: 'Wende die 3 Sprachproben an: Namenwort (der/die/das?), Tunwort (was tut jemand?), Wiewort (wie ist etwas?).',
        rule: 'Namenwort (Nomen): Menschen, Tiere, Dinge. Haben Begleiter und werden GROSS geschrieben.\nTunwort (Verb): Was jemand tut (laufen, malen). Ändert seine Endung (ich lerne, wir lernen).\nWiewort (Adjektiv): Wie etwas ist (schnell, bunt). Lässt sich steigern (schnell, schneller).',
        substeps: [
          '1. Namenwort-Probe: Passt „der“, „die“ oder „das“ davor?',
          '2. Tunwort-Probe: Kannst du „wir ...“ davor setzen?',
          '3. Wiewort-Probe: Kannst du „sehr ...“ davor setzen?'
        ]
      };
    }

    // 7. Groß- und Kleinschreibung (Deutsch)
    if (task.type === 'capitalization') {
      return {
        impulse: 'Namenwörter und Satzanfänge werden großgeschrieben. Alle anderen Wörter klein.',
        rule: 'Namenwörter bezeichnen Menschen, Tiere, Pflanzen und Gegenstände. Sie haben oft Begleiter (der, die, ein) oder versteckte Begleiter (im = in dem, beim = bei dem).',
        substeps: [
          '1. Prüfe jedes Wort: Bezeichnet es etwas, das man sehen oder anfassen kann?',
          '2. Probe: Setze gedanklich „der“, „die“ oder „das“ davor.',
          '3. Bei Namenwörtern und am Satzanfang: Anfangsbuchstaben großschreiben.'
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
          '2. Finde das Tunwort: Was tut die Person oder Sache?',
          task.targetSentence ? `3. Lösungshilfe: Der Satz beginnt mit „${task.targetSentence.split(' ')[0]}...“` : '3. Schließe den Satz mit dem Satzschlusszeichen ab.'
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
          '2. Finde die passende Textstelle im Sachtext.',
          '3. Wähle die Antwort aus, die genau zum Textinhalt passt.'
        ]
      };
    }

    // 10. Uhrzeit & Zeitmaße
    if (task.type === 'clock' || task.type === 'clock-set' || task.type === 'clock-choice') {
      return {
        impulse: 'Schau zuerst auf den kurzen Stundenzeiger (rot) und dann auf den langen Minutenzeiger (blau).',
        rule: task.hint || 'Kurzer Zeiger = Stunde (braucht 12 Stunden für eine Runde).\nLanger Zeiger = Minute (12 = volle Stunde, 3 = viertel nach, 6 = halb, 9 = viertel vor).',
        substeps: [
          '1. Stunde ablesen: Welche Zahl hat der kurze Zeiger zuletzt erreicht?',
          '2. Minuten bestimmen: Zähle in 5er-Schritten von der 12 im Uhrzeigersinn.',
          '3. Beide Angaben zur genauen Uhrzeit zusammenfügen.'
        ]
      };
    }

    // 11. Fälle des Nomens (Deutsch)
    if (task.type === 'cases' || (task.lehrplanRef && task.lehrplanRef.includes('Faelle'))) {
      return {
        impulse: 'Wende die Frageprobe für das unterstrichene Satzglied an: Frage mit Wer (1.), Wessen (2.), Wem (3.) oder Wen (4.).',
        rule: task.hint || '1. Fall (Wer-Fall): Wer oder was?\n2. Fall (Wes-Fall): Wessen?\n3. Fall (Wem-Fall): Wem?\n4. Fall (Wen-Fall): Wen oder was?',
        substeps: [
          '1. Bilde den Fragesatz zum unterstrichenen Satzteil.',
          '2. Überprüfe, welches Fragewort (Wer, Wessen, Wem oder Wen) sinnvoll klingt.',
          '3. Ordne das passende Fragewort dem richtigen Fall zu.'
        ]
      };
    }

    // 12. Zeitformen des Verbs (Deutsch)
    if (task.type === 'tenses' || (task.lehrplanRef && task.lehrplanRef.includes('Zeitformen'))) {
      return {
        impulse: 'Finde das Tunwort (Verb) im Satz und bestimme die Zeitstufe: Passiert es jetzt, war es früher oder kommt es erst?',
        rule: task.hint || 'Gegenwart: passiert jetzt gerade.\nMitvergangenheit: Erzählform in Büchern und Geschichten (ohne Hilfswort).\nVergangenheit: gesprochene Form mit Hilfswort (hat ..., ist ...).\nZukunft: wird noch geschehen.',
        substeps: [
          '1. Suche das Tunwort und eventuelle Hilfswörter (hat, ist, wird) im Satz.',
          '2. Mache die Signalprobe mit „Jetzt“, „Damals/Gestern“ oder „Morgen“.',
          '3. Bestimme die dazu passende Zeitform.'
        ]
      };
    }

    // 13. Silbentrennung & Silbenkönige
    if (task.lehrplanRef && task.lehrplanRef.includes('Silben')) {
      return {
        impulse: 'Sprich das Wort langsam in Sprechsilben und klatsche oder schwinge mit den Armen bei jeder Silbe mit.',
        rule: task.hint || 'Jede Silbe hat genau einen Silbenkönig (Selbstlaut oder Zwielaut: A, E, I, O, U, Ä, Ö, Ü, Au, Ei, Eu).',
        substeps: [
          '1. Zähle die Vokale (Silbenkönige) in den einzelnen Sprechsilben.',
          '2. Sprich das Wort noch einmal gedehnt und klatsche den Rhythmus.',
          '3. Bestimme die genaue Anzahl der Silbenbögen.'
        ]
      };
    }

    // 14. Sachunterricht / Multiple Choice / Allgemein mit intelligenter Fachbereichs-Erkennung
    const ref = (task.lehrplanRef || '').toLowerCase();
    const qText = (task.question || task.prompt || '').toLowerCase();
    const rawHint = task.hint || '';

    // A. Geografie / Österreich
    if (ref.includes('oesterreich') || ref.includes('bundeslaender') || qText.includes('bundesland') || qText.includes('landeshauptstadt') || qText.includes('österreich') || qText.includes('fluss') || qText.includes('berg')) {
      return {
        impulse: 'Stelle dir die Landkarte von Österreich vor: In welcher Landschaft, Himmelsrichtung oder Region liegt dieses Bundesland?',
        rule: rawHint || 'Österreich besteht aus 9 Bundesländern mit jeweils eigener Landeshauptstadt, Gebirgen, Tälern und Flüssen.',
        substeps: [
          '1. Finde heraus, in welchem Teil Österreichs der gesuchte Ort liegt.',
          '2. Schließe Optionen aus, die eindeutig in anderen Bundesländern oder Nachbarländern liegen.',
          '3. Gleiche die verbliebenen Merkmale mit der Frage ab.'
        ]
      };
    }

    // B. Verkehrserziehung / Radfahrprüfung / Schulweg
    if (ref.includes('verkehr') || ref.includes('rad') || ref.includes('schulweg') || qText.includes('verkehr') || qText.includes('rad') || qText.includes('fahrrad') || qText.includes('vorrang') || qText.includes('schild') || qText.includes('gehsteig')) {
      return {
        impulse: 'Achte auf Form und Farbe des Verkehrszeichens: Dreiecke warnen vor Gefahren, runde Schilder mit rotem Rand verbieten, blaue Schilder gebieten oder informieren.',
        rule: rawHint || 'Verkehrszeichen und Verkehrsregeln schützen alle Fußgänger und Radfahrer im Straßenverkehr.',
        substeps: [
          '1. Bestimme die Bedeutung von Schildform und Symbolfarbe.',
          '2. Schließe Verhaltensweisen aus, die im Verkehr gefährlich oder verboten sind.',
          '3. Wähle die sicherste Verhaltensweise.'
        ]
      };
    }

    // C. Kalender / Jahreskreis / Zeiträume
    if (ref.includes('kalender') || ref.includes('zeit') || qText.includes('monat') || qText.includes('jahreszeit') || qText.includes('kalender') || qText.includes('tage hat')) {
      return {
        impulse: 'Nutze die Knöchelprobe deiner Fäuste oder denke an den Kreislauf der vier Jahreszeiten im Kalenderjahr.',
        rule: rawHint || 'Ein Kalenderjahr hat 12 Monate und 365 Tage (Schaltjahr 366 Tage). Frühling, Sommer, Herbst und Winter wechseln sich ab.',
        substeps: [
          '1. Bestimme die Jahreszeit oder Monatsreihenfolge.',
          '2. Nutze die Knöchelprobe (Knöchel = 31 Tage, Vertiefung = 30 Tage bzw. Februar 28/29).',
          '3. Schließe Monate oder Zahlen aus, die nicht dazu passen.'
        ]
      };
    }

    // D. Tiere im Winter / Natur
    if (ref.includes('winter') || ref.includes('tiere') || qText.includes('winter') || qText.includes('tier') || qText.includes('überwinter') || qText.includes('spuren')) {
      return {
        impulse: 'Unterscheide die Überwinterungsarten: Winterschlaf (tiefer Dauerschlaf), Winterruhe (Aufwachen zum Fressen) oder Winterstarre (Kältestarre bei Wechselwarmen)?',
        rule: rawHint || 'Tiere haben unterschiedliche Strategien, um die kalte und nahrungsarme Winterzeit zu überleben.',
        substeps: [
          '1. Überlege, zu welcher Tiergruppe das Tier gehört (Säugetier, Vogel, Amphibie oder Insekt).',
          '2. Schließe Überwinterungsarten aus, die biologisch nicht zu dieser Tiergruppe passen.',
          '3. Bestimme das typische Verhalten für die kalte Jahreszeit.'
        ]
      };
    }

    // E. Geometrie / Formen
    if (task.type === 'geometry' || ref.includes('geometrie') || qText.includes('form') || qText.includes('körper') || qText.includes('ecken') || qText.includes('kanten')) {
      return {
        impulse: 'Zähle die Ecken, Kanten und Begrenzungsflächen der geometrischen Figur genau ab.',
        rule: rawHint || 'Flächenformen (Quadrat, Rechteck, Dreieck, Kreis) sind eben. Körperformen (Würfel, Quader, Kugel, Zylinder) sind dreidimensional.',
        substeps: [
          '1. Untersuche die Merkmale: Ecken, Kanten, rechte Winkel, Symmetrie.',
          '2. Schließe Formen aus, die nicht alle genannten Eigenschaften besitzen.',
          '3. Ordne die Figur der passenden Form zu.'
        ]
      };
    }

    // F. Allgemeiner Standard für Multiple-Choice / Direkteingabe
    return {
      impulse: 'Lies die Fragestellung gründlich und hebe die wichtigsten Wörter und Bedingungen hervor.',
      rule: rawHint || 'Achte auf die genauen Merkmale, Größen oder Fachbegriffe in der Aufgabe.',
      substeps: [
        '1. Kläre die gesuchten Eigenschaften in der Frage.',
        '2. Schließe alle Möglichkeiten aus, die fachlich nicht zutreffen.',
        '3. Bestimme die treffende Lösung.'
      ]
    };
  }

  // --- EINHEITLICHE BODENLEISTE (ACTION-BAR) & WIDGET-LOGIK ---


  R.getScaffoldingData = getScaffoldingData;
  R.getUniversalScaffolding = getUniversalScaffolding;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
