// =============================================================
// SCHLAUFUCHS – js/renderers.js
// DOM-Renderer für alle Aufgabentypen
// Touch-First (Mindestzielgröße 48px, inputmode="numeric")
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Renderers = (function () {
  'use strict';

  const setupPointerDrag = window.Schlaufuchs.DragDrop ? window.Schlaufuchs.DragDrop.setupPointerDrag : null;

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
      ticksSvg += `<line x1="${cur.x}" y1="${yBase - 6}" x2="${cur.x}" y2="${yBase + 6}" stroke="var(--tinte, #1e293b)" stroke-width="2.5" />`;
      labelsSvg += `<text x="${cur.x}" y="${yBase + 22}" text-anchor="middle" font-family="PrimaeText, var(--font-base), sans-serif" font-size="13" font-weight="700" fill="var(--tinte, #1e293b)">${cur.formatted}</text>`;

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
          <line x1="${padLeft - 20}" y1="${yBase}" x2="${w - padRight + 20}" y2="${yBase}" stroke="var(--linie, #94a3b8)" stroke-width="2" stroke-linecap="round" />
          <polygon points="${w - padRight + 25},${yBase} ${w - padRight + 15},${yBase - 5} ${w - padRight + 15},${yBase + 5}" fill="var(--linie, #94a3b8)" />
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
        rule: '🔵 Namenwort (Nomen): Menschen, Tiere, Dinge. Haben Begleiter und werden GROSS geschrieben.\n🔴 Tunwort (Verb): Was jemand tut (laufen, malen). Ändert seine Endung (ich lerne, wir lernen).\n🟢 Wiewort (Adjektiv): Wie etwas ist (schnell, bunt). Lässt sich steigern (schnell, schneller).',
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

  function renderBottomBarHtml(index, hintTitle = 'Tipp anzeigen', buttonText = 'Prüfen') {
    return `
      <div class="scaffolding-box" id="scaffolding-${index}"></div>
      <div class="task-bottom-bar">
        <div class="task-tools-group">
          <div id="spk-container-${index}"></div>
          <button type="button" class="btn btn-hint-scaffold" id="btn-scaffold-${index}" title="${hintTitle}">
            💡 Tipp
          </button>
        </div>
        <div class="task-feedback" id="feedback-${index}"></div>
        <div class="task-submit-group">
          <button class="btn btn-check" id="btn-check-${index}">
            <span>${buttonText}</span>
          </button>
        </div>
      </div>
    `;
  }

  function attachBottomActions(card, task, index, onCheck, textToSpeak) {
    const audio = window.Schlaufuchs.Audio;

    // 1. Audio-Vorlesebutton einhängen
    if (audio && textToSpeak) {
      const spk = audio.createSpeakerButton(textToSpeak);
      const spkBox = card.querySelector(`#spk-container-${index}`);
      if (spkBox) {
        spkBox.innerHTML = '';
        spkBox.appendChild(spk);
      }
    }

    // 2. Scaffolding-Widget einhängen
    const scaffoldBtn = card.querySelector(`#btn-scaffold-${index}`);
    const scaffoldBox = card.querySelector(`#scaffolding-${index}`);
    const scaffoldData = getUniversalScaffolding(task);

    if (!scaffoldData) {
      if (scaffoldBtn) scaffoldBtn.style.display = 'none';
    } else if (scaffoldBtn && scaffoldBox) {
      let scaffoldLevel = 0;

      function updateScaffoldingView() {
        if (scaffoldLevel === 0) {
          scaffoldBox.style.display = 'none';
          scaffoldBox.innerHTML = '';
          scaffoldBtn.innerHTML = '💡 Tipp';
          scaffoldBtn.classList.remove('active');
          return;
        }

        scaffoldBox.style.display = 'block';
        scaffoldBtn.innerHTML = `💡 Tipp (${scaffoldLevel}/3)`;
        scaffoldBtn.classList.add('active');

        let html = '<div class="scaffolding-inner">';

        // Stufe 1: Verbaler Denkimpuls
        if (scaffoldLevel >= 1 && scaffoldData.impulse) {
          html += `
            <div class="scaffolding-step scaffolding-step-1">
              <span class="scaffolding-step-badge">Schritt 1: Denkstrategie</span>
              <span class="scaffolding-impulse">${scaffoldData.impulse}</span>
            </div>
          `;
        }

        // Stufe 2: Anschauungsmittel (SVG-Rechenstrich oder Merkregel)
        if (scaffoldLevel >= 2) {
          if (scaffoldData.points && scaffoldData.points.length >= 2) {
            html += `
              <div class="scaffolding-step scaffolding-step-2">
                <span class="scaffolding-step-badge">Schritt 2: Anschauung</span>
                ${createNumberLineSvg(scaffoldData)}
              </div>
            `;
          } else if (scaffoldData.rule) {
            html += `
              <div class="scaffolding-step scaffolding-step-2">
                <span class="scaffolding-step-badge">Schritt 2: Merkregel</span>
                <div class="scaffolding-rule-text">${scaffoldData.rule.replace(/\n/g, '<br>')}</div>
              </div>
            `;
          }
        }

        // Stufe 3: Teilschritte / Konkrete Lösungshilfe
        if (scaffoldLevel >= 3) {
          const stepsList = scaffoldData.steps || scaffoldData.substeps || [];
          if (stepsList.length > 0) {
            html += `
              <div class="scaffolding-step scaffolding-step-3">
                <span class="scaffolding-step-badge">Schritt 3: Teilschritte & Hilfe</span>
                <div class="scaffolding-substeps">
                  ${stepsList.map(s => `<div class="substep-line">${s}</div>`).join('')}
                </div>
              </div>
            `;
          }
        }

        html += `
          <div class="scaffolding-footer">
            <button type="button" class="btn-scaffolding-close" id="btn-close-scaffold-${index}">Schließen ✕</button>
          </div>
        `;
        html += '</div>';

        scaffoldBox.innerHTML = html;

        const closeBtn = scaffoldBox.querySelector(`#btn-close-scaffold-${index}`);
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            scaffoldLevel = 0;
            updateScaffoldingView();
          });
        }
      }

      scaffoldBtn.addEventListener('click', () => {
        scaffoldLevel = (scaffoldLevel + 1) % 4;
        updateScaffoldingView();
      });
    }

    // 3. Prüfen-Button
    const btnCheck = card.querySelector(`#btn-check-${index}`);
    if (btnCheck) {
      btnCheck.addEventListener('click', () => onCheck(index));
    }
  }

  // 1. EQUATION (Addition, Subtraktion, Multiplikation, Division)
  function renderEquation(card, task, index, onCheck) {
    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">Berechne das Ergebnis:</div>
        </div>
        <div class="task-stage">
          <div class="task-equation">
            <span>${task.num1}</span>
            <span class="task-op">${task.symbol}</span>
            <span>${task.num2}</span>
            <span class="task-equals">=</span>
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="task-input" 
              id="input-${index}" 
              placeholder="?" 
              value="${task.userAnswer || ''}"
              autocomplete="off"
            />
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Rechen-Tipp anzeigen')}
      </div>
    `;

    const opWord = (task.symbol === '−' || task.symbol === '-') ? 'minus' :
                   (task.symbol === '·' || task.symbol === '*') ? 'mal' :
                   (task.symbol === ':') ? 'geteilt durch' : 'plus';
    attachBottomActions(card, task, index, onCheck, `${task.num1} ${opWord} ${task.num2}`);

    const input = card.querySelector(`#input-${index}`);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') onCheck(index);
      });
      input.addEventListener('input', (e) => {
        task.userAnswer = e.target.value;
        resetFeedback(card, index);
      });
    }
  }

  // 2. RECHENTÜRME / ZAHLENMAUERN
  function renderPyramid(card, task, index, onCheck) {
    function renderBrick(key) {
      const isHidden = task.hidden.includes(key);
      const val = task.values[key];
      const userVal = task.userAnswers[key] !== undefined ? task.userAnswers[key] : '';

      if (isHidden) {
        return `
          <div class="pyramid-brick pyramid-brick-input" data-brick-key="${key}">
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="pyramid-input" 
              data-key="${key}" 
              placeholder="?" 
              value="${userVal}"
              autocomplete="off"
            />
          </div>
        `;
      }
      const formatted = (window.Schlaufuchs.Generators.Math && window.Schlaufuchs.Generators.Math.formatAustrianNumber)
        ? window.Schlaufuchs.Generators.Math.formatAustrianNumber(val)
        : val;
      return `<div class="pyramid-brick given" data-brick-key="${key}">${formatted}</div>`;
    }

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            <div>Zahlenmauer / Rechenturm</div>
            <div class="pyramid-subtext">Zwei nebeneinanderliegende Steine ergeben zusammen den Stein darüber.</div>
          </div>
        </div>
        <div class="task-stage">
          <div class="pyramid-container">
            <div class="pyramid-row">
              ${renderBrick('peak')}
            </div>
            <div class="pyramid-row">
              ${renderBrick('m1')}
              ${renderBrick('m2')}
            </div>
            <div class="pyramid-row">
              ${renderBrick('b1')}
              ${renderBrick('b2')}
              ${renderBrick('b3')}
            </div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Mauer-Tipp anzeigen')}
      </div>
    `;

    const inputs = card.querySelectorAll('.pyramid-input');
    const inputBricks = card.querySelectorAll('.pyramid-brick-input');

    // Klick auf den ganzen Mauerstein fokussiert das Eingabefeld (iPad & Touch-Friendly)
    inputBricks.forEach(brick => {
      brick.addEventListener('click', () => {
        const inp = brick.querySelector('.pyramid-input');
        if (inp) inp.focus();
      });
    });

    inputs.forEach((inp) => {
      inp.addEventListener('input', (e) => {
        const key = inp.getAttribute('data-key');
        task.userAnswers[key] = e.target.value;
        const brick = inp.closest('.pyramid-brick');
        if (brick) {
          brick.classList.remove('brick-incorrect', 'brick-correct', 'brick-empty-warning');
        }
        resetFeedback(card, index);
      });

      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const emptyNext = Array.from(inputs).find(other => other !== inp && other.value.trim() === '');
          if (emptyNext) {
            emptyNext.focus();
          } else {
            onCheck(index);
          }
        }
      });
    });

    attachBottomActions(card, task, index, onCheck, 'Zahlenmauer. Berechne die fehlenden Steine.');
  }

  // 3. WORTARTEN
  function renderWordTypes(card, task, index, onCheck) {
    const hasAdjektiv = task.sentence.some(w => w.type === 'adjektiv');

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            Bestimme für jedes hervorgehobene Wort die richtige Wortart (blau = Namenwort, rot = Tunwort${hasAdjektiv ? ', grün = Wiewort' : ''}):
          </div>
        </div>
        <div class="task-stage task-stage-stretch">
          <div class="story-box sentence-preview" id="sentence-preview-${index}"></div>
          <div class="word-cards-grid" id="word-cards-${index}"></div>
        </div>
        ${renderBottomBarHtml(index, 'Grammatik-Tipp anzeigen')}
      </div>
    `;

    const sentencePreview = card.querySelector(`#sentence-preview-${index}`);
    const wordCardsGrid = card.querySelector(`#word-cards-${index}`);

    function renderUI() {
      // 1. Satz-Vorschau mit dynamischer Hervorhebung
      sentencePreview.innerHTML = '';
      task.sentence.forEach(w => {
        if (w.ignore) {
          const span = document.createElement('span');
          span.textContent = w.word + ' ';
          sentencePreview.appendChild(span);
        } else {
          const token = document.createElement('span');
          token.className = 'word-token' + (w.userType ? ` selected-${w.userType}` : '');
          token.textContent = w.word;
          sentencePreview.appendChild(token);
          sentencePreview.appendChild(document.createTextNode(' '));
        }
      });

      // 2. Kärtchen für die Zielwörter
      wordCardsGrid.innerHTML = '';
      task.sentence.forEach((w, wIdx) => {
        if (w.ignore) return;

        const cardItem = document.createElement('div');
        cardItem.className = 'word-card-item' + (w.userType ? ` type-${w.userType}` : '');

        const wordTitle = document.createElement('div');
        wordTitle.className = 'word-text';
        wordTitle.textContent = w.word;
        cardItem.appendChild(wordTitle);

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'word-type-tags';

        // Nomen Button
        const btnNomen = document.createElement('button');
        btnNomen.className = 'word-tag-btn' + (w.userType === 'nomen' ? ' selected' : '');
        btnNomen.setAttribute('data-type', 'nomen');
        btnNomen.innerHTML = '🔵 Nomen';
        btnNomen.title = 'Namenwort (z. B. der Fuchs, das Kind)';
        btnNomen.addEventListener('click', () => {
          w.userType = w.userType === 'nomen' ? null : 'nomen';
          renderUI();
          resetFeedback(card, index);
        });
        tagsContainer.appendChild(btnNomen);

        // Verb Button
        const btnVerb = document.createElement('button');
        btnVerb.className = 'word-tag-btn' + (w.userType === 'verb' ? ' selected' : '');
        btnVerb.setAttribute('data-type', 'verb');
        btnVerb.innerHTML = '🔴 Verb';
        btnVerb.title = 'Tunwort (z. B. laufen, singen, schlafen)';
        btnVerb.addEventListener('click', () => {
          w.userType = w.userType === 'verb' ? null : 'verb';
          renderUI();
          resetFeedback(card, index);
        });
        tagsContainer.appendChild(btnVerb);

        // Adjektiv Button (nur falls im Aufgabenset aktiv / 3. & 4. Klasse)
        if (hasAdjektiv) {
          const btnAdj = document.createElement('button');
          btnAdj.className = 'word-tag-btn' + (w.userType === 'adjektiv' ? ' selected' : '');
          btnAdj.setAttribute('data-type', 'adjektiv');
          btnAdj.innerHTML = '🟢 Adjektiv';
          btnAdj.title = 'Wiewort (z. B. schlau, fröhlich, bunt)';
          btnAdj.addEventListener('click', () => {
            w.userType = w.userType === 'adjektiv' ? null : 'adjektiv';
            renderUI();
            resetFeedback(card, index);
          });
          tagsContainer.appendChild(btnAdj);
        }

        cardItem.appendChild(tagsContainer);
        wordCardsGrid.appendChild(cardItem);
      });
    }

    renderUI();
    const sentenceText = task.sentence.map(w => w.word).join(' ');
    attachBottomActions(card, task, index, onCheck, sentenceText);
  }

  // 4. GROSS & KLEIN
  function renderCapitalization(card, task, index, onCheck) {
    let tokensHtml = '';
    task.words.forEach((w, wIdx) => {
      if (w.isFixed) {
        tokensHtml += `
          <span class="scramble-token cap-token-fixed">
            ${w.text}
          </span>
        `;
      } else {
        const displayWord = w.isCapital ? w.text.charAt(0).toUpperCase() + w.text.slice(1) : w.text;
        const activeClass = w.isCapital ? 'cap-active' : 'cap-inactive';

        tokensHtml += `
          <button class="scramble-token cap-token-btn ${activeClass}" id="cap-btn-${index}-${wIdx}" data-widx="${wIdx}">
            ${displayWord}
          </button>
        `;
      }
    });

    tokensHtml += `<span class="cap-dot">.</span>`;

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            Finde alle <strong>${task.targetNouns.length} Namenwörter (Nomen)</strong> im Satz und tippe sie an, um sie großzuschreiben:
          </div>
        </div>
        <div class="task-stage">
          <div class="scramble-pool cap-pool">
            ${tokensHtml}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Rechtschreib-Tipp anzeigen')}
      </div>
    `;

    task.words.forEach((w, wIdx) => {
      if (w.isFixed) return;
      const btn = card.querySelector(`#cap-btn-${index}-${wIdx}`);
      if (!btn) return;

      btn.addEventListener('click', () => {
        w.isCapital = !w.isCapital;
        const text = w.isCapital ? w.text.charAt(0).toUpperCase() + w.text.slice(1) : w.text;
        btn.textContent = text;
        if (w.isCapital) {
          btn.classList.add('cap-active');
          btn.classList.remove('cap-inactive');
        } else {
          btn.classList.remove('cap-active');
          btn.classList.add('cap-inactive');
        }
        resetFeedback(card, index);
      });
    });

    const fullSentence = task.words.map(w => w.text).join(' ');
    attachBottomActions(card, task, index, onCheck, fullSentence);
  }

  // 5. SCHÜTTELSÄTZE (Reihenfolge per Drag & Drop sortierbar!)
  function renderScramble(card, task, index, onCheck) {
    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            Baue den Satz zusammen (Wörter antippen oder mit dem Finger hineinziehen):
          </div>
        </div>
        <div class="task-stage task-stage-stretch">
          <div class="scramble-box">
            <div class="scramble-target drop-zone" id="scramble-target-${index}" title="Dein Satz">
              <span class="hint-text">Wörter hier ablegen oder antippen...</span>
            </div>
            <div class="scramble-pool drop-zone" id="scramble-pool-${index}"></div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Satz-Tipp anzeigen')}
      </div>
    `;

    const poolEl = card.querySelector(`#scramble-pool-${index}`);
    const targetEl = card.querySelector(`#scramble-target-${index}`);

    function renderScrambleTokens() {
      poolEl.innerHTML = '';
      targetEl.innerHTML = '';

      if (task.assembled.length === 0) {
        targetEl.innerHTML = '<span class="hint-text">Wörter hier ablegen oder antippen (Reihenfolge verschiebbar)...</span>';
      } else {
        task.assembled.forEach((word, aIdx) => {
          const btn = document.createElement('button');
          btn.className = 'scramble-token draggable-token drop-zone target-token';
          btn.setAttribute('data-target-idx', aIdx);
          btn.textContent = word;
          btn.title = 'Antippen zum Entfernen oder an neue Stelle ziehen';

          // Klick: zurück in Pool
          btn.addEventListener('click', () => {
            task.assembled.splice(aIdx, 1);
            task.pool.push(word);
            renderScrambleTokens();
            resetFeedback(card, index);
          });

          // Drag: zurück in Pool ODER auf anderes Wort im Satz ziehen (Reihenfolge ändern)
          if (setupPointerDrag) {
            setupPointerDrag(btn, (draggedEl, dropZone) => {
              if (dropZone === poolEl || (poolEl && poolEl.contains(dropZone))) {
                task.assembled.splice(aIdx, 1);
                task.pool.push(word);
                renderScrambleTokens();
                resetFeedback(card, index);
                return;
              }

              const targetToken = dropZone.closest('.target-token');
              if (targetToken && targetToken !== draggedEl) {
                const toIdx = parseInt(targetToken.getAttribute('data-target-idx'), 10);
                if (!isNaN(toIdx)) {
                  const [movedWord] = task.assembled.splice(aIdx, 1);
                  task.assembled.splice(toIdx, 0, movedWord);
                  renderScrambleTokens();
                  resetFeedback(card, index);
                }
              }
            });
          }

          targetEl.appendChild(btn);
        });
      }

      task.pool.forEach((word, pIdx) => {
        const btn = document.createElement('button');
        btn.className = 'scramble-token draggable-token';
        btn.textContent = word;

        btn.addEventListener('click', () => {
          task.pool.splice(pIdx, 1);
          task.assembled.push(word);
          renderScrambleTokens();
          resetFeedback(card, index);
        });

        if (setupPointerDrag) {
          setupPointerDrag(btn, (draggedEl, dropZone) => {
            const targetToken = dropZone.closest('.target-token');
            if (targetToken) {
              const toIdx = parseInt(targetToken.getAttribute('data-target-idx'), 10);
              if (!isNaN(toIdx)) {
                task.pool.splice(pIdx, 1);
                task.assembled.splice(toIdx, 0, word);
                renderScrambleTokens();
                resetFeedback(card, index);
                return;
              }
            }

            if (dropZone === targetEl || (targetEl && targetEl.contains(dropZone))) {
              task.pool.splice(pIdx, 1);
              task.assembled.push(word);
              renderScrambleTokens();
              resetFeedback(card, index);
            }
          });
        }

        poolEl.appendChild(btn);
      });
    }

    renderScrambleTokens();
    attachBottomActions(card, task, index, onCheck, task.targetSentence);
  }

  // 6. MULTIPLE-CHOICE (inkl. SVGs für Verkehrszeichen)
  function renderMultipleChoice(card, task, index, onCheck) {
    let visualHtml = '';
    if (task.customVisualHtml) {
      visualHtml = `<div class="task-sign-display">${task.customVisualHtml}</div>`;
    } else if (task.icon) {
      visualHtml = `<div class="task-visual-icon">${task.icon}</div>`;
    }

    let optionsHtml = '';
    task.options.forEach((optText, optIdx) => {
      const isSelected = task.selectedText === optText;
      const selClass = isSelected ? 'selected-option' : '';
      optionsHtml += `
        <button class="choice-btn choice-btn-lg ${selClass}" data-opt-idx="${optIdx}">
          ${optText}
        </button>
      `;
    });

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            ${visualHtml}
            <div>${task.question}</div>
          </div>
        </div>
        <div class="task-stage task-stage-stretch">
          <div class="choice-options-grid">
            ${optionsHtml}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Tipp anzeigen')}
      </div>
    `;

    const choiceBtns = card.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        choiceBtns.forEach(b => b.classList.remove('selected-option'));
        btn.classList.add('selected-option');
        const optIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
        task.selectedText = task.options[optIdx];
        resetFeedback(card, index);
      });
    });

    attachBottomActions(card, task, index, onCheck, task.question);
  }

  // 7. MEMORY
  function renderMemory(card, task, index, onCheck) {
    let gridHtml = '';
    task.cards.forEach((c, cIdx) => {
      const isFlipped = c.isFlipped || c.isMatched;
      const flippedClass = isFlipped ? 'flipped' : '';
      const matchedClass = c.isMatched ? 'matched' : '';
      gridHtml += `
        <div class="memory-card ${flippedClass} ${matchedClass}" data-card-idx="${cIdx}">
          <div class="memory-card-inner">
            <div class="memory-card-back">
              <span class="memory-brand">🦊</span>
            </div>
            <div class="memory-card-front">
              <span class="memory-symbol">${c.content}</span>
              ${c.subtitle ? `<span class="memory-subtitle">${c.subtitle}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="memory-container">
        <div class="memory-status-bar">
          <div class="memory-status-text">
            <span>Gefundene Paare: </span>
            <strong id="mem-pairs-count" class="memory-status-count">${task.matchedPairsCount} von ${task.totalPairs}</strong>
          </div>
          <div class="memory-hint-text">
            🃏 Finde immer 2 gleiche Tier- oder Naturkärtchen!
          </div>
        </div>
        <div class="memory-grid">
          ${gridHtml}
        </div>
        <div class="task-actions memory-actions">
          <div class="task-feedback" id="feedback-${index}"></div>
        </div>
      </div>
    `;

    const cardElements = card.querySelectorAll('.memory-card');
    cardElements.forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        if (task.isLocked) return;
        const cIdx = parseInt(cardEl.getAttribute('data-card-idx'), 10);
        const clickedCard = task.cards[cIdx];

        if (clickedCard.isFlipped || clickedCard.isMatched) return;

        clickedCard.isFlipped = true;
        task.flippedIndices.push(cIdx);
        cardEl.classList.add('flipped');

        if (task.flippedIndices.length === 2) {
          const idx1 = task.flippedIndices[0];
          const idx2 = task.flippedIndices[1];
          const card1 = task.cards[idx1];
          const card2 = task.cards[idx2];

          const el1 = card.querySelector(`[data-card-idx="${idx1}"]`);
          const el2 = card.querySelector(`[data-card-idx="${idx2}"]`);

          if (card1.pairId === card2.pairId) {
            // Treffer!
            card1.isMatched = true;
            card2.isMatched = true;
            task.matchedPairsCount++;

            if (el1) el1.classList.add('matched');
            if (el2) el2.classList.add('matched');

            card.querySelector('#mem-pairs-count').textContent = `${task.matchedPairsCount} von ${task.totalPairs}`;
            task.flippedIndices = [];

            if (task.matchedPairsCount === task.totalPairs) {
              onCheck(index);
            }
          } else {
            // Kein Treffer: nach 850ms umdrehen
            task.isLocked = true;
            setTimeout(() => {
              card1.isFlipped = false;
              card2.isFlipped = false;
              if (el1) el1.classList.remove('flipped');
              if (el2) el2.classList.remove('flipped');
              task.flippedIndices = [];
              task.isLocked = false;
            }, 850);
          }
        }
      });
    });
  }

  // 8. DIRECT-INPUT (Zahlenraum 1 000 000, Maßeinheiten, Uhrzeit)
  function renderDirectInput(card, task, index, onCheck) {
    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">${task.question}</div>
        </div>
        <div class="task-stage">
          <div class="input-row-center">
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="task-input input-width-180" 
              id="input-${index}" 
              placeholder="Antwort" 
              value="${task.userAnswer || ''}"
              autocomplete="off"
            />
            ${task.unit ? `<span class="input-unit-text">${task.unit}</span>` : ''}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Tipp anzeigen')}
      </div>
    `;

    const input = card.querySelector(`#input-${index}`);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') onCheck(index);
      });
      input.addEventListener('input', (e) => {
        task.userAnswer = e.target.value;
        resetFeedback(card, index);
      });
    }

    attachBottomActions(card, task, index, onCheck, task.question);
  }

  // 9. GEOMETRIE (Umfang & Fläche mit SVG-Rechteck)
  function renderGeometry(card, task, index, onCheck) {
    const isSquare = task.shape === 'square';
    const rectWidth = isSquare ? 80 : 120;
    const rectHeight = isSquare ? 80 : 60;

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">${task.question}</div>
        </div>
        <div class="task-stage">
          <div class="geometry-stage-wrap">
            <svg width="${rectWidth + 40}" height="${rectHeight + 40}" viewBox="0 0 ${rectWidth + 40} ${rectHeight + 40}">
              <rect x="20" y="20" width="${rectWidth}" height="${rectHeight}" fill="var(--mathe-hell, #EFF6FF)" stroke="var(--mathe, #2255A4)" stroke-width="3" rx="4"/>
              <text x="${20 + rectWidth / 2}" y="15" text-anchor="middle" font-weight="800" font-size="12" fill="var(--mathe, #2255A4)">a = ${task.a} cm</text>
              <text x="${rectWidth + 25}" y="${20 + rectHeight / 2}" dominant-baseline="middle" font-weight="800" font-size="12" fill="var(--mathe, #2255A4)">${task.b} cm</text>
            </svg>
            <div>
              <div class="geometry-formula-badge">Formel: ${task.formula}</div>
              <div class="geometry-input-row">
                <input 
                  type="text" 
                  inputmode="numeric" 
                  pattern="[0-9]*" 
                  class="task-input input-width-140" 
                  id="input-${index}" 
                  placeholder="Ergebnis" 
                  value="${task.userAnswer || ''}"
                />
                <span class="geometry-unit-text">${task.unit}</span>
              </div>
            </div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Geometrie-Tipp anzeigen')}
      </div>
    `;

    const input = card.querySelector(`#input-${index}`);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') onCheck(index);
      });
      input.addEventListener('input', (e) => {
        task.userAnswer = e.target.value;
        resetFeedback(card, index);
      });
    }

    attachBottomActions(card, task, index, onCheck, task.question);
  }

  // 10. MUSTERFOLGEN (Logikreihen)
  function renderPattern(card, task, index, onCheck) {
    let seqHtml = '';
    task.displaySequence.forEach(item => {
      seqHtml += `
        <div class="scramble-token pattern-token-fixed">
          ${item}
        </div>
      `;
    });

    let optionsHtml = '';
    task.options.forEach(opt => {
      const isSelected = task.userAnswer === opt.toString();
      const selClass = isSelected ? ' selected' : '';
      optionsHtml += `
        <button class="scramble-token pattern-choice-btn${selClass}" data-val="${opt}">
          ${opt}
        </button>
      `;
    });

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">${task.title}</div>
        </div>
        <div class="task-stage">
          <div class="pattern-seq-row">
            ${seqHtml}
          </div>
          <div class="pattern-prompt">Welches Element gehört an die Stelle des Fragezeichens?</div>
          <div class="pattern-options-row">
            ${optionsHtml}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Muster-Tipp anzeigen')}
      </div>
    `;

    const btns = card.querySelectorAll('.pattern-choice-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        task.userAnswer = btn.getAttribute('data-val');
        btns.forEach(b => {
          b.style.background = 'var(--papier, #FBF7EE)';
          b.style.borderColor = 'var(--linie-leise, #C8C2B4)';
          b.style.color = 'var(--tinte, #1E252B)';
        });
        btn.style.background = 'var(--mathe-hell, #EFF6FF)';
        btn.style.borderColor = 'var(--mathe, #2255A4)';
        btn.style.color = 'var(--mathe, #2255A4)';
        btn.style.fontWeight = '900';
        resetFeedback(card, index);
      });
    });

    attachBottomActions(card, task, index, onCheck, `${task.title}. Welches Element gehört an die Stelle des Fragezeichens?`);
  }

  // 11. SEQUENCE (Zahlen sortieren)
  function renderSequence(card, task, index, onCheck) {
    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">${task.instruction}</div>
        </div>
        <div class="task-stage task-stage-stretch">
          <div class="scramble-box">
            <div class="scramble-target drop-zone" id="sequence-target-${index}"></div>
            <div class="scramble-pool drop-zone" id="sequence-pool-${index}"></div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Reihen-Tipp anzeigen')}
      </div>
    `;

    const poolEl = card.querySelector(`#sequence-pool-${index}`);
    const targetEl = card.querySelector(`#sequence-target-${index}`);

    function formatToken(val) {
      if (window.Schlaufuchs && window.Schlaufuchs.formatZahl) {
        return window.Schlaufuchs.formatZahl(val);
      }
      return String(val);
    }

    function renderTokens() {
      poolEl.innerHTML = '';
      targetEl.innerHTML = '';

      task.slots.forEach((val, sIdx) => {
        if (val !== null) {
          const btn = document.createElement('button');
          btn.className = 'scramble-token draggable-token';
          btn.textContent = formatToken(val);
          btn.title = 'Antippen zum Entfernen';
          btn.addEventListener('click', () => {
            task.slots[sIdx] = null;
            task.pool.push(val);
            renderTokens();
            resetFeedback(card, index);
          });
          targetEl.appendChild(btn);
        } else {
          const slotPlaceholder = document.createElement('div');
          slotPlaceholder.className = 'sequence-slot-placeholder';
          slotPlaceholder.style.cssText = 'display: inline-block; min-width: 56px; height: 50px; border: 2px dashed var(--linie-leise, #C8C2B4); border-radius: 8px; margin: 4px; vertical-align: middle;';
          targetEl.appendChild(slotPlaceholder);
        }
      });

      task.pool.forEach((val, pIdx) => {
        const btn = document.createElement('button');
        btn.className = 'scramble-token draggable-token';
        btn.textContent = formatToken(val);

        btn.addEventListener('click', () => {
          const firstEmpty = task.slots.indexOf(null);
          if (firstEmpty !== -1) {
            task.slots[firstEmpty] = val;
            task.pool.splice(pIdx, 1);
            renderTokens();
            resetFeedback(card, index);
          }
        });

        if (setupPointerDrag) {
          setupPointerDrag(btn, (draggedEl, dropZone) => {
            if (dropZone === targetEl || (targetEl && targetEl.contains(dropZone))) {
              const firstEmpty = task.slots.indexOf(null);
              if (firstEmpty !== -1) {
                task.slots[firstEmpty] = val;
                task.pool.splice(pIdx, 1);
                renderTokens();
                resetFeedback(card, index);
              }
            }
          });
        }

        poolEl.appendChild(btn);
      });
    }

    renderTokens();
    attachBottomActions(card, task, index, onCheck, task.instruction);
  }

  // 12. RECHENGESCHICHTEN / TEXTAUFGABEN (Frage - Rechnung - Antwort)
  function renderTextProblem(card, task, index, onCheck) {
    const ansFormatted = (window.Schlaufuchs.Generators.Math && window.Schlaufuchs.Generators.Math.formatAustrianNumber)
      ? window.Schlaufuchs.Generators.Math.formatAustrianNumber(task.answer)
      : task.answer;
    const blankAnswer = task.answerText.replace(new RegExp(`\\b${task.answer}\\b|${ansFormatted}|${task.answer}`, 'g'), '______');

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            ❓ Frage: ${task.question}
          </div>
        </div>
        <div class="task-stage">
          <div class="story-box text-problem-story">
            ${task.story}
          </div>
          <div class="text-problem-calc-row">
            <span class="text-problem-calc-label">🧮 Deine Rechnung (Ergebnis):</span>
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="task-input input-width-140" 
              id="input-${index}" 
              placeholder="Ergebnis" 
              value="${task.userAnswer || ''}"
            />
            <span class="text-problem-unit">${task.unit || ''}</span>
          </div>
          <div id="calc-display-${index}" class="text-problem-calc-display${task.isCorrect ? ' is-visible' : ''}">
            Lösungsweg: ${task.calculation} = ${ansFormatted} ${task.unit || ''}
          </div>
          <div id="answer-text-${index}" class="text-problem-ans-text">
            💬 Antwort: ${task.isCorrect ? `<strong class="text-problem-ans-highlight">${task.answerText}</strong>` : blankAnswer}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Rechen-Tipp anzeigen')}
      </div>
    `;

    const input = card.querySelector(`#input-${index}`);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onCheck(index);
    });
    input.addEventListener('input', (e) => {
      task.userAnswer = e.target.value;
      resetFeedback(card, index);
    });

    attachBottomActions(card, task, index, onCheck, `${task.story} ${task.question}`);
  }

  // 13. ZWANZIGERFELD (1. Klasse Mengenverständnis)
  function renderTwentyField(card, task, index, onCheck) {
    function buildDotsRow(startIdx, endIdx) {
      let row = '';
      for (let i = startIdx; i <= endIdx; i++) {
        let dotClass = 'empty-dot';
        if (i <= task.a) {
          dotClass = 'blue-dot'; // Erste Zahl: Blaue Plättchen
        } else if (i <= task.total) {
          dotClass = 'red-dot'; // Zweite Zahl: Rote Plättchen
        }
        row += `<div class="twenty-dot-cell ${i === 5 || i === 15 ? 'five-divider' : ''}"><div class="twenty-dot ${dotClass}"></div></div>`;
      }
      return row;
    }

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            ${task.question}
          </div>
        </div>
        <div class="task-stage">
          <!-- Zwanzigerfeld Visualisierung -->
          <div class="twenty-field-box">
            <div class="twenty-field-row">${buildDotsRow(1, 10)}</div>
            <div class="twenty-field-row">${buildDotsRow(11, 20)}</div>
          </div>
          <div class="twenty-field-instruction">
            🔵 Blaue Punkte: <strong>${task.a}</strong> &nbsp;|&nbsp; 🔴 Rote Punkte: <strong>${task.b}</strong>
          </div>
          <div class="twenty-field-input-row">
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="task-input input-width-140" 
              id="input-${index}" 
              placeholder="Summe" 
              value="${task.userAnswer || ''}"
            />
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Zwanzigerfeld-Tipp anzeigen')}
      </div>
    `;

    const input = card.querySelector(`#input-${index}`);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onCheck(index);
    });
    input.addEventListener('input', (e) => {
      task.userAnswer = e.target.value;
      resetFeedback(card, index);
    });

    attachBottomActions(card, task, index, onCheck, task.question);
  }

  // 14. SCHRIFTLICHE RECHENVERFAHREN (3. & 4. Klasse)
  function renderWrittenCalc(card, task, index, onCheck) {
    if (!task.userDigits) {
      task.userDigits = new Array(task.maxLen).fill('');
    }

    let headerThs = `<th class="written-col-op" scope="col"><span class="sr-only">Rechenart</span></th>`;
    task.headers.forEach(h => {
      headerThs += `<th class="written-col-digit" scope="col">${h}</th>`;
    });

    let row1Tds = `<td class="written-col-op" aria-hidden="true"></td>`;
    task.digits1.forEach(d => {
      row1Tds += `<td class="written-col-digit">${d === ' ' ? '&nbsp;' : d}</td>`;
    });

    let row2Tds = `<td class="written-col-op" aria-label="${task.operation === '+' ? 'Plus' : 'Minus'}">${task.operation}</td>`;
    task.digits2.forEach(d => {
      row2Tds += `<td class="written-col-digit">${d === ' ' ? '&nbsp;' : d}</td>`;
    });

    let carryTds = `<td class="written-col-op written-carry-label" title="Übertrag / Merkziffer">Ü</td>`;
    for (let c = 0; c < task.maxLen; c++) {
      carryTds += `
        <td class="written-col-digit written-cell-carry">
          <input 
            type="text" 
            inputmode="numeric" 
            pattern="[0-9]*" 
            class="written-carry-input" 
            data-col="${c}" 
            placeholder="" 
            maxlength="1" 
            aria-label="Übertrag ${task.headers[c] || ''}"
          />
        </td>
      `;
    }

    let resultTds = `<td class="written-col-op written-result-label">=</td>`;
    for (let c = 0; c < task.maxLen; c++) {
      const userColVal = (task.userDigits && task.userDigits[c]) || '';
      resultTds += `
        <td class="written-col-digit written-cell-result">
          <input 
            type="text" 
            inputmode="numeric" 
            pattern="[0-9]*" 
            class="written-result-input" 
            data-col="${c}" 
            placeholder="" 
            maxlength="1" 
            value="${userColVal}"
            aria-label="Ergebnis Stelle ${task.headers[c] || ''}"
          />
        </td>
      `;
    }

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            Schriftliche ${task.operation === '+' ? 'Addition' : 'Subtraktion'}: Rechne untereinander
          </div>
        </div>
        <div class="task-stage">
          <div class="written-calc-card">
            <div class="written-calc-box">
              <table class="written-calc-table" aria-label="Schriftliche Rechnung untereinander">
                <thead>
                  <tr class="written-header-row">${headerThs}</tr>
                </thead>
                <tbody>
                  <tr class="written-row-num">${row1Tds}</tr>
                  <tr class="written-row-num written-row-op">${row2Tds}</tr>
                  <tr class="written-row-carry">${carryTds}</tr>
                  <tr class="written-row-result">${resultTds}</tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Rechen-Tipp anzeigen')}
      </div>
    `;

    const resultInputs = card.querySelectorAll('.written-result-input');
    resultInputs.forEach(inp => {
      inp.addEventListener('input', (e) => {
        const col = parseInt(inp.getAttribute('data-col'), 10);
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 1) {
          val = val.slice(-1);
          inp.value = val;
        }
        task.userDigits[col] = val;
        task.userAnswer = task.userDigits.join('');
        resetFeedback(card, index);

        // Beim Rechnen von rechts nach links zur vorherigen (höheren) Stelle springen
        if (val && col > 0) {
          const prevInp = card.querySelector(`.written-result-input[data-col="${col - 1}"]`);
          if (prevInp && !prevInp.value) prevInp.focus();
        }
      });

      inp.addEventListener('keydown', (e) => {
        const col = parseInt(inp.getAttribute('data-col'), 10);
        if (e.key === 'Enter') {
          onCheck(index);
        } else if (e.key === 'Backspace' && !inp.value && col < task.maxLen - 1) {
          const nextInp = card.querySelector(`.written-result-input[data-col="${col + 1}"]`);
          if (nextInp) nextInp.focus();
        } else if (e.key === 'ArrowLeft' && col > 0) {
          const prevInp = card.querySelector(`.written-result-input[data-col="${col - 1}"]`);
          if (prevInp) prevInp.focus();
        } else if (e.key === 'ArrowRight' && col < task.maxLen - 1) {
          const nextInp = card.querySelector(`.written-result-input[data-col="${col + 1}"]`);
          if (nextInp) nextInp.focus();
        }
      });
    });

    const carryInputs = card.querySelectorAll('.written-carry-input');
    carryInputs.forEach(inp => {
      inp.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 1) val = val.slice(-1);
        inp.value = val;
      });
      inp.addEventListener('keydown', (e) => {
        const col = parseInt(inp.getAttribute('data-col'), 10);
        if (e.key === 'ArrowLeft' && col > 0) {
          const prevInp = card.querySelector(`.written-carry-input[data-col="${col - 1}"]`);
          if (prevInp) prevInp.focus();
        } else if (e.key === 'ArrowRight' && col < task.maxLen - 1) {
          const nextInp = card.querySelector(`.written-carry-input[data-col="${col + 1}"]`);
          if (nextInp) nextInp.focus();
        }
      });
    });

    attachBottomActions(card, task, index, onCheck, `Schriftliche ${task.operation === '+' ? 'Addition' : 'Subtraktion'}: ${task.num1} ${task.operation === '+' ? 'plus' : 'minus'} ${task.num2}`);
  }

  // 15. LESEVERSTÄNDNIS (PIRLS-Sachtexte)
  function renderReading(card, task, index, onCheck) {
    let questionsHtml = '';
    task.questions.forEach((qObj, qIdx) => {
      let optionsHtml = '';
      qObj.options.forEach((opt, oIdx) => {
        const isSelected = qObj.userAnswer === oIdx;
        const selClass = isSelected ? 'reading-opt-selected' : '';
        optionsHtml += `
          <button type="button" class="reading-option-btn ${selClass}" data-q="${qIdx}" data-opt="${oIdx}">
            <span class="reading-opt-indicator">${isSelected ? '🔘' : '⚪'}</span>
            <span class="reading-opt-text">${opt}</span>
          </button>
        `;
      });

      questionsHtml += `
        <div class="reading-question-card" id="reading-q-card-${index}-${qIdx}">
          <div class="reading-question-title">
            <span class="reading-question-num">Frage ${qIdx + 1}:</span>
            <span>${qObj.question}</span>
          </div>
          <div class="reading-options-list">
            ${optionsHtml}
          </div>
          <div class="reading-question-hint" id="reading-q-hint-${index}-${qIdx}"></div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            <span>${task.icon}</span> ${task.title} (Leseverständnis)
          </div>
        </div>
        <div class="task-stage">
          <div class="reading-layout">
            <!-- Linke Spalte: Sachtext -->
            <div class="reading-left-pane">
              <div class="reading-text-box">
                <p>${task.text}</p>
              </div>
            </div>

            <!-- Rechte Spalte: Fragen -->
            <div class="reading-right-pane">
              <div class="reading-questions-heading">
                <span>❓</span> <span>Fragen zum Text:</span>
              </div>
              <div class="reading-questions-container">
                ${questionsHtml}
              </div>
            </div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Lese-Tipp anzeigen', 'Antworten prüfen')}
      </div>
    `;

    // Option Buttons Click Listener
    const optButtons = card.querySelectorAll('.reading-option-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.getAttribute('data-q'), 10);
        const oIdx = parseInt(btn.getAttribute('data-opt'), 10);
        task.questions[qIdx].userAnswer = oIdx;

        const parentCard = card.querySelector(`#reading-q-card-${index}-${qIdx}`);
        if (parentCard) {
          parentCard.querySelectorAll('.reading-option-btn').forEach(b => {
            b.classList.remove('reading-opt-selected');
            const ind = b.querySelector('.reading-opt-indicator');
            if (ind) ind.textContent = '⚪';
          });
        }
        btn.classList.add('reading-opt-selected');
        const ind = btn.querySelector('.reading-opt-indicator');
        if (ind) ind.textContent = '🔘';

        resetFeedback(card, index);
      });
    });

    attachBottomActions(card, task, index, onCheck, `${task.title}. ${task.text}`);
  }

  function resetFeedback(card, index) {
    card.classList.remove('correct', 'incorrect');
    const fb = card.querySelector(`#feedback-${index}`);
    if (fb) {
      fb.className = 'task-feedback';
      fb.innerHTML = '';
    }
  }

  return {
    getScaffoldingData: getScaffoldingData,
    renderEquation: renderEquation,
    renderPyramid: renderPyramid,
    renderWordTypes: renderWordTypes,
    renderCapitalization: renderCapitalization,
    renderScramble: renderScramble,
    renderMultipleChoice: renderMultipleChoice,
    renderMemory: renderMemory,
    renderDirectInput: renderDirectInput,
    renderGeometry: renderGeometry,
    renderPattern: renderPattern,
    renderSequence: renderSequence,
    renderTextProblem: renderTextProblem,
    renderTwentyField: renderTwentyField,
    renderWrittenCalc: renderWrittenCalc,
    renderReading: renderReading,
    getScaffoldingData: getScaffoldingData,
    getUniversalScaffolding: getUniversalScaffolding
  };
})();
