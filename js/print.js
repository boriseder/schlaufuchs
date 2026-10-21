// =============================================================
// SCHLAUFUCHS – js/print.js
// A4-Arbeitsblatt-Druckgenerator für Volksschule & Hausübung
// Inklusive Schul-Kopfzeile, Lineaturen für Bleistift & Lösungsblatt
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Print = (function () {
  'use strict';

  function generateAndPrintWorksheet(topicTitle, gradeText, tasks) {
    if (!tasks || tasks.length === 0) {
      const Dialog = window.Schlaufuchs.Dialog;
      if (Dialog) Dialog.alert('Bitte wähle zuerst ein Thema aus, um ein Arbeitsblatt zu drucken.');
      else alert('Bitte wähle zuerst ein Thema aus, um ein Arbeitsblatt zu drucken.');
      return;
    }

    let printContainer = document.getElementById('print-area');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-area';
      document.body.appendChild(printContainer);
    }

    // 1. SEITE 1: AUFGABENBLATT FÜR SCHÜLER
    let tasksHtml = '';
    tasks.forEach((task, idx) => {
      tasksHtml += renderTaskForPrint(task, idx, false);
    });

    // 2. SEITE 2: LÖSUNGSBLATT FÜR ELTERN & LEHRKRÄFTE
    let solutionsHtml = '';
    tasks.forEach((task, idx) => {
      solutionsHtml += renderTaskForPrint(task, idx, true);
    });

    printContainer.innerHTML = `
      <!-- SEITE 1: AUFGABENBLATT -->
      <div class="print-page">
        <div class="print-header">
          <div class="print-header-brand">
            <span style="font-size: 1.8rem;">🦊</span>
            <div>
              <div class="print-brand-title">Schlaufuchs Volksschul-Übungsblatt</div>
              <div class="print-brand-sub">${topicTitle} (${gradeText || '1.–4. Klasse'})</div>
            </div>
          </div>
          <div class="print-header-fields">
            <div class="print-field"><span>Name:</span> <span class="print-line" style="min-width: 170px;"></span></div>
            <div class="print-field"><span>Datum:</span> <span class="print-line" style="min-width: 90px;"></span></div>
            <div class="print-field"><span>Punkte:</span> <span class="print-score-box">___ / ${tasks.length}</span></div>
          </div>
        </div>

        <div class="print-tasks-list">
          ${tasksHtml}
        </div>

        <div class="print-footer">
          <span>Schlaufuchs – Kostenlose Lernplattform für die Volksschule</span>
          <span>Seite 1 / 2</span>
        </div>
      </div>

      <!-- SEITE 2: LÖSUNGSBLATT -->
      <div class="print-page print-page-break">
        <div class="print-header print-solution-header">
          <div class="print-header-brand">
            <span style="font-size: 1.8rem;">🦊</span>
            <div>
              <div class="print-brand-title">Lösungsblatt (Für Lehrkräfte & Eltern)</div>
              <div class="print-brand-sub">${topicTitle} – Lösungen zur Selbstkontrolle</div>
            </div>
          </div>
          <div class="print-badge-solution">LÖSUNGEN</div>
        </div>

        <div class="print-tasks-list">
          ${solutionsHtml}
        </div>

        <div class="print-footer">
          <span>Schlaufuchs – Lösungsblatt</span>
          <span>Seite 2 / 2</span>
        </div>
      </div>
    `;

    // Druckdialog auslösen
    setTimeout(() => {
      window.print();
    }, 250);
  }

  function renderTaskForPrint(task, idx, isSolution) {
    let content = '';

    if (task.type === 'equation') {
      const sol = isSolution ? `<strong>${task.answer}</strong>` : '_______';
      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div class="print-equation">
            <span>${task.num1}</span>
            <span class="print-op">${task.symbol}</span>
            <span>${task.num2}</span>
            <span>=</span>
            <span class="print-answer-field ${isSolution ? 'has-solution' : ''}">${sol}</span>
          </div>
          ${!isSolution ? '<div class="print-calc-grid" title="Rechenkästchen für Nebenrechnung"></div>' : ''}
        </div>
      `;
    } else if (task.type === 'pyramid') {
      const v = task.values;
      const h = task.hidden;

      function getVal(key) {
        if (!h.includes(key)) return `<span>${v[key]}</span>`;
        if (isSolution) return `<strong class="sol-val">${v[key]}</strong>`;
        return '<span class="empty-brick"></span>';
      }

      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 6px;">Fülle die fehlenden Zahlen in der Zahlenmauer aus:</div>
            <div class="print-pyramid">
              <div class="print-pyr-row"><div class="print-brick">${getVal('peak')}</div></div>
              <div class="print-pyr-row"><div class="print-brick">${getVal('m1')}</div><div class="print-brick">${getVal('m2')}</div></div>
              <div class="print-pyr-row"><div class="print-brick">${getVal('b1')}</div><div class="print-brick">${getVal('b2')}</div><div class="print-brick">${getVal('b3')}</div></div>
            </div>
          </div>
        </div>
      `;
    } else if (task.type === 'word-types') {
      let wordsMarkup = '';
      task.sentence.forEach(w => {
        if (w.ignore) {
          wordsMarkup += `<span style="margin: 0 4px; color: var(--tinte-leise);">${w.word}</span> `;
        } else {
          const typeName = w.type === 'nomen' ? 'Namenwort' : (w.type === 'verb' ? 'Tunwort' : 'Wiewort');
          if (isSolution) {
            wordsMarkup += `<span class="print-word-sol"><u>${w.word}</u> (<strong>${typeName}</strong>)</span> `;
          } else {
            wordsMarkup += `<span class="print-word-blank"><u>${w.word}</u> [ &nbsp; ]</span> `;
          }
        }
      });

      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 4px;">Bestimme die unterstrichenen Wortarten (${isSolution ? 'Lösung' : '[N] = Namenwort, [T] = Tunwort, [W] = Wiewort'}):</div>
            <div class="print-sentence">${wordsMarkup}</div>
          </div>
        </div>
      `;
    } else if (task.type === 'capitalization') {
      const nounsList = task.targetNouns.join(', ');
      let fullSentence = '';
      task.words.forEach(w => {
        if (isSolution) {
          const display = w.isTarget ? w.text.charAt(0).toUpperCase() + w.text.slice(1) : w.text;
          fullSentence += (w.isTarget ? `<strong>${display}</strong>` : display) + ' ';
        } else {
          fullSentence += w.text + ' ';
        }
      });
      fullSentence = fullSentence.trim() + '.';

      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 4px;">Schreibe den Satz mit allen Namenwörtern groß und richtig auf:</div>
            <div style="font-style: italic; color: var(--tinte-leise); margin-bottom: 6px;">Vorgabe: ${task.words.map(w => w.text).join(' ')}.</div>
            ${isSolution ? `<div class="print-solution-text">Lösung: ${fullSentence} (Namenwörter: <strong>${nounsList}</strong>)</div>` : '<div class="print-handwriting-lines"></div>'}
          </div>
        </div>
      `;
    } else if (task.type === 'scramble') {
      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 4px;">Bilde aus den Wörtern einen vollständigen Satz:</div>
            <div class="print-word-pool">Wörter: <em>${task.pool.join(' • ')}</em></div>
            ${isSolution ? `<div class="print-solution-text">Lösung: <strong>${task.targetSentence}.</strong></div>` : '<div class="print-handwriting-lines"></div>'}
          </div>
        </div>
      `;
    } else if (task.type === 'multiple-choice') {
      let optionsMarkup = '';
      task.options.forEach((opt, oIdx) => {
        const isRight = oIdx === task.correctIndex;
        const check = isSolution && isRight ? '☒' : '☐';
        const optClass = isSolution && isRight ? 'print-opt-correct' : '';
        optionsMarkup += `<div class="print-mc-opt ${optClass}">${check} ${opt}</div>`;
      });

      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 800; margin-bottom: 6px;">${task.question.replace(/\n/g, '<br>')}</div>
            <div class="print-mc-grid">${optionsMarkup}</div>
          </div>
        </div>
      `;
    } else if (task.type === 'direct-input') {
      const sol = isSolution ? `<strong>${task.answer} ${task.unit || ''}</strong>` : `_________________ ${task.unit || ''}`;
      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 4px;">${task.question}</div>
            <div style="margin-top: 6px;">Antwort: ${sol}</div>
          </div>
        </div>
      `;
    } else if (task.type === 'geometry') {
      const sol = isSolution ? `<strong>${task.answer} ${task.unit}</strong>` : `_________ ${task.unit}`;
      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 4px;">${task.question}</div>
            <div style="font-size: 0.9rem; color: var(--tinte-leise); margin-bottom: 4px;">Formel: ${task.formula}</div>
            <div style="margin-top: 6px;">Ergebnis: ${sol}</div>
            ${!isSolution ? '<div class="print-calc-grid" style="height: 60px; margin-top: 8px;"></div>' : ''}
          </div>
        </div>
      `;
    } else if (task.type === 'text-problem') {
      // Rechengeschichte mit F, R, A
      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 800; margin-bottom: 6px; line-height: 1.4;">${task.story}</div>
            ${isSolution ? `
              <div class="print-solution-text">
                <div><strong>Frage (F):</strong> ${task.question}</div>
                <div><strong>Rechnung (R):</strong> ${task.calculation} = <strong>${task.answer} ${task.unit || ''}</strong></div>
                <div><strong>Antwort (A):</strong> ${task.answerText}</div>
              </div>
            ` : `
              <div class="print-fra-lines">
                <div><strong>F:</strong> ___________________________________________________________</div>
                <div style="display: flex; gap: 20px; align-items: center; margin: 8px 0;">
                  <span><strong>R:</strong> _________________________</span>
                  <span class="print-calc-grid" style="width: 140px; height: 50px;"></span>
                </div>
                <div><strong>A:</strong> ___________________________________________________________</div>
              </div>
            `}
          </div>
        </div>
      `;
    } else if (task.type === 'written-calc') {
      let headRow = '';
      task.headers.forEach(h => { headRow += `<span style="display:inline-block; width:26px; text-align:center; font-weight:800; color:#2563eb;">${h}</span>`; });
      let n1Row = '';
      task.digits1.forEach(d => { n1Row += `<span style="display:inline-block; width:26px; text-align:center;">${d === ' ' ? '&nbsp;' : d}</span>`; });
      let n2Row = '';
      task.digits2.forEach(d => { n2Row += `<span style="display:inline-block; width:26px; text-align:center;">${d === ' ' ? '&nbsp;' : d}</span>`; });
      let ansRow = '';
      task.resultDigits.forEach(d => {
        ansRow += `<span style="display:inline-block; width:26px; text-align:center; font-weight:900; ${isSolution ? 'color:#16a34a;' : ''}">${isSolution ? d : '___'}</span>`;
      });

      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>
            <div style="font-weight: 700; margin-bottom: 6px;">Schriftliche ${task.operation === '+' ? 'Addition' : 'Subtraktion'} untereinander:</div>
            <div style="display: inline-block; font-family: monospace; border: 1.5pt solid var(--tinte); padding: 6px 12px; border-radius: 6px; background: white;">
              <div style="border-bottom: 1pt solid var(--linie-leise); padding-bottom: 2px;">&nbsp;&nbsp;${headRow}</div>
              <div style="margin: 2px 0;">&nbsp;&nbsp;${n1Row}</div>
              <div style="margin: 2px 0;">${task.operation}&nbsp;${n2Row}</div>
              <div style="border-top: 1.5pt solid var(--tinte); border-bottom: 2pt double var(--tinte); padding: 3px 0; margin-top: 3px;">=&nbsp;${ansRow}</div>
            </div>
            ${!isSolution ? '<div class="print-calc-grid" style="display:inline-block; vertical-align:top; width: 140px; height: 75px; margin-left: 20px;"></div>' : ''}
          </div>
        </div>
      `;
    } else if (task.type === 'reading') {
      let qMarkup = '';
      task.questions.forEach((qObj, qIdx) => {
        let optMarkup = '';
        qObj.options.forEach((opt, oIdx) => {
          const isRight = oIdx === qObj.correctIndex;
          const check = isSolution && isRight ? '☒' : '☐';
          const optClass = isSolution && isRight ? 'print-opt-correct' : '';
          optMarkup += `<div class="print-mc-opt ${optClass}">${check} ${opt}</div>`;
        });

        qMarkup += `
          <div style="margin-top: 8px;">
            <div style="font-weight: 800; font-size: 10.5pt; margin-bottom: 4px;">Frage ${qIdx + 1}: ${qObj.question}</div>
            <div class="print-mc-grid">${optMarkup}</div>
          </div>
        `;
      });

      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div style="flex: 1;">
            <div style="font-weight: 900; font-size: 12pt; color: #1e3a8a; margin-bottom: 4px;">${task.title}</div>
            <div style="background: var(--flaeche); border: 1pt solid var(--linie-leise); border-radius: 6px; padding: 8px 12px; font-size: 10pt; line-height: 1.5; margin-bottom: 8px;">
              ${task.text}
            </div>
            <div style="font-weight: 800; font-size: 10.5pt; margin-bottom: 2px;">Fragen zum Leseverständnis (PIRLS):</div>
            ${qMarkup}
          </div>
        </div>
      `;
    } else {
      // Fallback
      content = `
        <div class="print-task-row">
          <span class="print-num">${idx + 1}.</span>
          <div>${isSolution ? 'Aufgabe gelöst.' : 'Löse diese Aufgabe.'}</div>
        </div>
      `;
    }

    return content;
  }

  function printCertificate(profile) {
    if (!profile) {
      profile = window.Schlaufuchs.State.getActiveProfile();
    }

    let printContainer = document.getElementById('print-area');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-area';
      document.body.appendChild(printContainer);
    }

    const totalStars = Object.values(profile.stars || {}).reduce((a, b) => a + b, 0);
    const unlockedStickersCount = (profile.unlockedStickers || ['s1']).length;
    const now = new Date();
    const dateStr = `${now.getDate()}. ${['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][now.getMonth()]} ${now.getFullYear()}`;

    printContainer.innerHTML = `
      <div class="print-page">
        <div class="print-certificate">
          <div class="cert-header">
            <div style="font-size: 3.5rem;">🦊</div>
            <h1 class="cert-title">SCHLAUFUCHS-URKUNDE</h1>
            <div class="cert-sub">Offizielle Auszeichnung für herausragende Lernerfolge</div>
          </div>

          <div class="cert-body">
            <div class="cert-text">Diese Ehrenurkunde wird mit großem Stolz verliehen an</div>
            <div class="cert-name">${profile.avatar} ${profile.name}</div>
            <div class="cert-text">
              für besonderen Fleiß, schlaues Köpfchen und große Begeisterung beim Rechnen, Lesen, Schreiben und Entdecken auf der Volksschul-Lernplattform Schlaufuchs.
            </div>

            <div class="cert-stats">
              <div class="cert-stat-box">
                <div class="cert-stat-val">⭐ ${totalStars}</div>
                <div class="cert-stat-label">Gesammelte Sterne</div>
              </div>
              <div class="cert-stat-box">
                <div class="cert-stat-val">📖 ${unlockedStickersCount} / 16</div>
                <div class="cert-stat-label">Sammel-Sticker</div>
              </div>
              <div class="cert-stat-box">
                <div class="cert-stat-val">🏆 Champion</div>
                <div class="cert-stat-label">Volksschule Österreich</div>
              </div>
            </div>
          </div>

          <div>
            <div class="cert-footer">
              <div>
                <div class="cert-sig-line">${dateStr}</div>
                <div style="font-size: 9pt; color: var(--tinte-leise); margin-top: 4px;">Datum</div>
              </div>
              <div>
                <div class="cert-sig-line" style="min-width: 200px;"></div>
                <div style="font-size: 9pt; color: var(--tinte-leise); margin-top: 4px;">Unterschrift (Lehrkraft / Eltern)</div>
              </div>
            </div>
            <div style="margin-top: 24px; font-size: 8pt; color: var(--linie-leise);">
              Schlaufuchs Lernplattform • BMBWF Lehrplan Österreich • DIN/ÖNORM 1083
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.print();
    }, 250);
  }

  return {
    generateAndPrintWorksheet: generateAndPrintWorksheet,
    printCertificate: printCertificate,
  };
})();
