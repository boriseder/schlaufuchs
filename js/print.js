// =============================================================
// SCHLAUFUCHS – js/print.js
// Vektoroptimierter A4-Arbeitsblatt- & Urkundendruck (Schulbuch-Look)
// Pädagogisch & ergonomisch fundiert: Montessori-Knick-Lösung,
// Geheimwort-Rätsel mit Buchstabenschlüssel, echte Lineaturen & StVO-SVGs
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Print = (function () {
  'use strict';

  // Liste kindgerechter österreichischer Geheimwörter für die Schatzkiste nach Wortlänge (SSOT)
  const FALLBACK_SECRET_WORDS_BY_LENGTH = {
    3: ['UHU', 'MUT', 'BÄR', 'ROT', 'AST', 'SEE', 'TAG'],
    4: ['WALD', 'IGEL', 'EULE', 'BERG', 'HERZ', 'WOLF', 'BAUM', 'LUFT', 'GOLD', 'BLAU', 'HAUS', 'MAUS'],
    5: ['FUCHS', 'STERN', 'WIESE', 'BLUME', 'SONNE', 'BIBER', 'TAFEL', 'VOGEL', 'KOBEL', 'ZEBRA', 'KÖNIG'],
    6: ['SCHLAU', 'WINTER', 'SOMMER', 'SCHNEE', 'HERBST', 'SCHULE', 'RAKETE', 'BÜCHER', 'FREUND', 'PAPIER', 'LEHRER', 'WISSEN', 'SCHATZ'],
    7: ['FREUNDE', 'ZEICHEN', 'MEISTER', 'STERNEN', 'DRACHEN', 'KOBOLDE', 'TAUSEND'],
    8: ['FUCHSBAU', 'SCHLAUER', 'WALDKAUZ', 'TAUSENDE', 'KÖNIGIN', 'LESEFEST', 'SCHULHOF'],
    10: ['WINTERZEIT', 'BERGBLUMEN', 'SCHULSTART', 'LESESCHATZ', 'ZAUBERWALD'],
    12: ['RECHENKÖNIGE', 'ZAHLENZAUBER', 'WINTERZAUBER', 'SCHATZSUCHER', 'MEISTERSTERN', 'BÜCHERSCHATZ']
  };

  function getSecretWordsMap() {
    if (window.Schlaufuchs && window.Schlaufuchs.SecretWords && window.Schlaufuchs.SecretWords.byLength) {
      return window.Schlaufuchs.SecretWords.byLength;
    }
    return FALLBACK_SECRET_WORDS_BY_LENGTH;
  }

  function pickSecretWord(count) {
    const map = getSecretWordsMap();
    const list = map[count] || (count >= 12 ? map[12] : (count >= 10 ? map[10] : (count > 8 ? map[8] : (count >= 7 ? map[7] : (count >= 6 ? map[6] : map[5])))));
    let word = list[Math.floor(Math.random() * list.length)] || 'FUCHS';
    if (count && word.length !== count && map[count]) {
      word = map[count][0];
    }
    try {
      const Storage = window.Schlaufuchs.Storage;
      if (Storage) {
        const existing = Storage.lesen('valid_secret_words') || [];
        if (!existing.includes(word)) {
          existing.push(word);
          Storage.schreiben('valid_secret_words', existing.slice(-30));
        }
      }
    } catch (e) {}
    return word;
  }

  function renderSecretWordBar(secretWord) {
    if (!secretWord || secretWord.length === 0) return '';
    const letters = secretWord.split('');
    let boxesHtml = '';
    letters.forEach((_, idx) => {
      boxesHtml += `
        <div class="print-secret-box">
          <span class="print-box-num">${idx + 1}</span>
          <span class="print-box-cell"></span>
        </div>
      `;
    });

    return `
      <div class="print-secret-word-bar">
        <div class="print-secret-prompt">
          <span class="print-secret-badge">LÖSUNGSWORT</span>
          <span class="print-secret-desc">Trage für jede gelöste Aufgabe den Lösungsbuchstaben ein:</span>
          <span class="print-secret-check">◯ Im Sticker-Album eingetragen</span>
        </div>
        <div class="print-secret-letter-boxes">
          ${boxesHtml}
        </div>
      </div>
    `;
  }

  function getEffectiveGradeLabel(tasks, fallbackGradeText) {
    if (!tasks || tasks.length === 0) return fallbackGradeText || 'Volksschule';
    const grades = tasks.map(t => t.schulstufe || t.grade).filter(Boolean);
    if (grades.length > 0) {
      const allSame = grades.every(g => g === grades[0]);
      if (allSame) return `${grades[0]}. Klasse`;
      const minG = Math.min(...grades);
      const maxG = Math.max(...grades);
      if (minG === maxG) return `${minG}. Klasse`;
      return `${minG}. – ${maxG}. Klasse`;
    }
    return fallbackGradeText || 'Volksschule';
  }

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

    const effectiveGradeText = getEffectiveGradeLabel(tasks, gradeText);

    // Spezialfall: Memory -> Ausschneidebogen zum Basteln & Spielen
    const isMemory = tasks.length === 1 && tasks[0].type === 'memory';
    if (isMemory) {
      renderMemoryCraftSheet(printContainer, topicTitle, effectiveGradeText, tasks[0]);
      setTimeout(() => window.print(), 250);
      return;
    }

    printContainer.innerHTML = chooseWorksheetHtml(topicTitle, effectiveGradeText, tasks);

    setTimeout(() => {
      window.print();
    }, 250);
  }

  // --- THEMENBASIERTE WORKSHEET-API (FÜR DEN ARBEITSBLÄTTER-HUB) ---

  function printTopicWorksheet(topicId, targetGrade) {
    const Topics = window.Schlaufuchs.Topics;
    const PrintEngine = window.Schlaufuchs.PrintEngine;
    const meta = Topics ? Topics.getTopicById(topicId) : null;
    const title = meta ? meta.title : 'Arbeitsblatt';
    const grade = targetGrade || (meta && meta.grades ? meta.grades[0] : 2);
    const gradeLabel = `${grade}. Klasse`;

    try {
      if (window.Schlaufuchs && window.Schlaufuchs.Storage) {
        window.Schlaufuchs.Storage.schreiben('last_printed_topic', topicId);
      }
    } catch (e) {}

    const tasks = PrintEngine ? PrintEngine.generateWorksheetTasks(topicId, grade) : [];
    if (!tasks || tasks.length === 0) return;

    let printContainer = document.getElementById('print-area');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-area';
      document.body.appendChild(printContainer);
    }

    const isMemory = tasks.length === 1 && tasks[0].type === 'memory';
    if (isMemory) {
      printContainer.innerHTML = buildMemoryCraftSheetHtml(title, gradeLabel, tasks[0]);
    } else {
      printContainer.innerHTML = chooseWorksheetHtml(title, gradeLabel, tasks);
    }

    setTimeout(() => window.print(), 250);
  }

  function printBatchWorksheets(topicList, targetGrade) {
    if (!topicList || topicList.length === 0) return;
    const PrintEngine = window.Schlaufuchs.PrintEngine;

    let allPagesHtml = '';
    topicList.forEach(topic => {
      const grade = targetGrade || (topic.grades ? topic.grades[0] : 2);
      const gradeLabel = `${grade}. Klasse`;
      const tasks = PrintEngine ? PrintEngine.generateWorksheetTasks(topic.id, grade) : [];
      if (tasks && tasks.length > 0) {
        if (tasks.length === 1 && tasks[0].type === 'memory') {
          allPagesHtml += buildMemoryCraftSheetHtml(topic.title, gradeLabel, tasks[0]);
        } else {
          allPagesHtml += chooseWorksheetHtml(topic.title, gradeLabel, tasks);
        }
      }
    });

    let printContainer = document.getElementById('print-area');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-area';
      document.body.appendChild(printContainer);
    }

    printContainer.innerHTML = allPagesHtml;
    setTimeout(() => window.print(), 250);
  }

  function previewTopicWorksheet(topicId, targetGrade) {
    const Topics = window.Schlaufuchs.Topics;
    const PrintEngine = window.Schlaufuchs.PrintEngine;
    const meta = Topics ? Topics.getTopicById(topicId) : null;
    const title = meta ? meta.title : 'Arbeitsblatt';
    const grade = targetGrade || (meta && meta.grades ? meta.grades[0] : 2);
    const gradeLabel = `${grade}. Klasse`;

    try {
      if (window.Schlaufuchs && window.Schlaufuchs.Storage) {
        window.Schlaufuchs.Storage.schreiben('last_printed_topic', topicId);
      }
    } catch (e) {}

    const tasks = PrintEngine ? PrintEngine.generateWorksheetTasks(topicId, grade) : [];
    if (!tasks || tasks.length === 0) return;

    let html = '';
    if (tasks.length === 1 && tasks[0].type === 'memory') {
      html = buildMemoryCraftSheetHtml(title, gradeLabel, tasks[0]);
    } else {
      html = chooseWorksheetHtml(title, gradeLabel, tasks);
    }

    const previewModal = document.getElementById('worksheet-preview-modal');
    const previewTitle = document.getElementById('preview-sheet-title');
    const previewContent = document.getElementById('preview-sheet-content');
    const btnPrintCurrent = document.getElementById('btn-preview-print');

    if (previewModal && previewContent) {
      if (previewTitle) previewTitle.textContent = `Vorschau: ${title} (${gradeLabel})`;
      previewContent.innerHTML = html;
      previewModal.style.display = 'flex';

      if (btnPrintCurrent) {
        btnPrintCurrent.onclick = () => {
          previewModal.style.display = 'none';
          let printContainer = document.getElementById('print-area');
          if (!printContainer) {
            printContainer = document.createElement('div');
            printContainer.id = 'print-area';
            document.body.appendChild(printContainer);
          }
          printContainer.innerHTML = html;
          setTimeout(() => window.print(), 250);
        };
      }
    }
  }

  function buildWorksheetPageHtml(topicTitle, gradeText, tasks) {
    return buildKnickHtml(topicTitle, gradeText, tasks);
  }

  // --- 1. KNICK-LÖSUNGS-ARBEITSBLATT (1 SEITE) ---

  function buildKnickHtml(topicTitle, gradeText, tasks) {
    const seed = tasks.seed || (tasks[0] && tasks[0].seed) || Math.floor(Math.random() * 900000) + 100000;
    const secretWord = tasks.secretWord || (tasks.map(t => t.secretLetter).filter(Boolean).join('')) || pickSecretWord(tasks.length);
    const tasksHtml = renderStructuredTasks(tasks);
    let solutionsHtml = '';

    if (tasks.length === 1 && tasks[0].type === 'reading' && tasks[0].questions) {
      tasks[0].questions.forEach((q, qIdx) => {
        const solText = q.options[q.correctIndex];
        const letter = secretWord[qIdx] || '';
        solutionsHtml += `
          <div class="print-knick-item">
            <span class="print-knick-num">${qIdx + 1}.</span>
            <span class="print-knick-val">${solText}</span>
            ${letter ? `<span class="print-knick-letter-badge">(${letter})</span>` : ''}
          </div>
        `;
      });
    } else {
      tasks.forEach((task, idx) => {
        if (!task.secretLetter && secretWord[idx]) {
          task.secretLetter = secretWord[idx];
        }
        solutionsHtml += renderKnickSolutionRow(task, idx);
      });
    }

    return `
      <div class="print-page print-knick-page">
        <div class="print-knick-wrapper">
          <!-- LINKER TEIL: AUFGABENBLATT FÜR DAS KIND -->
          <div class="print-student-col">
            <div class="print-sheet-header">
              <div class="print-header-left">
                <div class="print-brand-line">
                  <span class="print-brand-logo"><img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 20px; height: 20px;"></span>
                  <span class="print-brand-title">SCHLAUFUCHS ARBEITSBLATT</span>
                </div>
                <div class="print-brand-sub">${topicTitle} • ${gradeText}</div>
              </div>
              <div class="print-header-right">
                <div class="print-meta-row">
                  <span class="print-meta-label">Name:</span>
                  <span class="print-meta-line"></span>
                </div>
                <div class="print-meta-row">
                  <span class="print-meta-label">Datum:</span>
                  <span class="print-meta-line"></span>
                </div>
              </div>
            </div>

            <div class="print-tasks-container">
              ${tasksHtml}
            </div>

            <!-- LÖSUNGSWORT-LEISTE FÜR DAS SAMMELALBUM -->
            ${renderSecretWordBar(secretWord)}

            <!-- DEZENTE SELBSTEINSCHÄTZUNG AM FUSS -->
            <div class="print-sheet-footer">
              <div class="print-footer-left">
                <div class="print-self-eval-inline">
                  <span class="print-eval-prompt">Wie war das Blatt für dich?</span>
                  <span class="print-eval-check">◯ Leicht</span>
                  <span class="print-eval-check">◯ Ging so</span>
                  <span class="print-eval-check">◯ Knifflig</span>
                </div>
                <div class="print-footer-sub">
                  <span>Blatt-Nr. ${seed} · Seite 1 von 1 · Schlaufuchs</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RECHTER TEIL: KNICK-LÖSUNGSSTREIFEN (MONTESSORI-SELBSTKONTROLLE) -->
          <div class="print-knick-col">
            <div class="print-knick-top-banner">
              <span>-- - - - -</span> <span>HIER VOR DEM LÖSEN NACH HINTEN KNICKEN</span> <span>- - - - --</span>
            </div>

            <div class="print-knick-panel">
              <div class="print-knick-head">
                <div class="print-knick-badge">LÖSUNGEN</div>
                <div class="print-knick-sub">Selbstkontrolle</div>
              </div>

              <div class="print-knick-solutions-list">
                ${solutionsHtml}
              </div>

              <!-- SCHATZKISTEN-GEHEIMWORT FÜR DAS SAMMELALBUM -->
              <div class="print-knick-secret">
                <span class="print-knick-secret-title">SCHATZKISTE</span>
                <span class="print-knick-secret-word">${secretWord}</span>
                <span class="print-knick-secret-sub">Lösungswort im Sticker-Album eingeben für dein Sammelbild!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderKnickWorksheet(container, topicTitle, gradeText, tasks) {
    container.innerHTML = buildKnickHtml(topicTitle, gradeText, tasks);
  }

  function buildTwoPageHtml(topicTitle, gradeText, tasks) {
    const seed = tasks.seed || (tasks[0] && tasks[0].seed) || Math.floor(Math.random() * 900000) + 100000;
    const secretWord = tasks.secretWord || (tasks.map(t => t.secretLetter).filter(Boolean).join('')) || pickSecretWord(tasks.length);
    const tasksHtml = renderStructuredTasks(tasks);

    let solutionsHtml = '';
    if (tasks.length === 1 && tasks[0].type === 'reading' && tasks[0].questions) {
      tasks[0].questions.forEach((q, qIdx) => {
        const solText = q.options[q.correctIndex];
        const letter = secretWord[qIdx] || '';
        solutionsHtml += `
          <div class="print-knick-item">
            <span class="print-knick-num">${qIdx + 1}.</span>
            <span class="print-knick-val">${solText}</span>
            ${letter ? `<span class="print-knick-letter-badge">(${letter})</span>` : ''}
          </div>
        `;
      });
    } else {
      tasks.forEach((task, idx) => {
        if (!task.secretLetter && secretWord[idx]) {
          task.secretLetter = secretWord[idx];
        }
        solutionsHtml += renderKnickSolutionRow(task, idx);
      });
    }

    return `
      <div class="print-page print-twopage-sheet">
        <div class="print-sheet-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo"><img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 20px; height: 20px;"></span>
              <span class="print-brand-title">SCHLAUFUCHS ARBEITSBLATT</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • ${gradeText}</div>
          </div>
          <div class="print-header-right">
            <div class="print-meta-row">
              <span class="print-meta-label">Name:</span>
              <span class="print-meta-line"></span>
            </div>
            <div class="print-meta-row">
              <span class="print-meta-label">Datum:</span>
              <span class="print-meta-line"></span>
            </div>
          </div>
        </div>

        <div class="print-tasks-container print-tasks-fullwidth">
          ${tasksHtml}
        </div>

        <!-- LÖSUNGSWORT-LEISTE FÜR DAS SAMMELALBUM -->
        ${renderSecretWordBar(secretWord)}

        <div class="print-sheet-footer">
          <div class="print-footer-left">
            <div class="print-self-eval-inline">
              <span class="print-eval-prompt">Wie war das Blatt für dich?</span>
              <span class="print-eval-check">◯ Leicht</span>
              <span class="print-eval-check">◯ Ging so</span>
              <span class="print-eval-check">◯ Knifflig</span>
            </div>
            <div class="print-footer-sub">
              <span>Blatt-Nr. ${seed} · Seite 1 von 2 · Schlaufuchs</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SEITE 2: SEPARATES LÖSUNGSBLATT (REGEL 15) -->
      <div class="print-page print-twopage-solution print-page-break">
        <div class="print-sheet-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo"><img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 20px; height: 20px;"></span>
              <span class="print-brand-title">LÖSUNGEN (Selbstkontrolle)</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • ${gradeText}</div>
          </div>
        </div>

        <div class="print-solution-sheet-body">
          <div class="print-knick-solutions-list print-solutions-grid">
            ${solutionsHtml}
          </div>

          <div class="print-knick-secret" style="margin-top: 24px; max-width: 320px;">
            <span class="print-knick-secret-title">SCHATZKISTE</span>
            <span class="print-knick-secret-word">${secretWord}</span>
            <span class="print-knick-secret-sub">Lösungswort im Sticker-Album eingeben für dein Sammelbild!</span>
          </div>
        </div>

        <div class="print-sheet-footer">
          <div class="print-footer-sub">
            <span>Blatt-Nr. ${seed} · Seite 2 von 2 · Schlaufuchs</span>
          </div>
        </div>
      </div>
    `;
  }

  function chooseWorksheetHtml(topicTitle, gradeText, tasks) {
    const State = window.Schlaufuchs.State;
    const settings = (State && typeof State.getPrintSettings === 'function') ? State.getPrintSettings() : { solutionMode: 'knick' };
    if (settings && settings.solutionMode === 'two-page') {
      return buildTwoPageHtml(topicTitle, gradeText, tasks);
    }
    return buildKnickHtml(topicTitle, gradeText, tasks);
  }

  function renderTwoPageWorksheet(container, topicTitle, gradeText, tasks) {
    container.innerHTML = buildTwoPageHtml(topicTitle, gradeText, tasks);
  }

  function buildWorksheetOnlyHtml(topicTitle, gradeText, tasks) {
    return chooseWorksheetHtml(topicTitle, gradeText, tasks);
  }

  function renderWorksheetOnly(container, topicTitle, gradeText, tasks) {
    container.innerHTML = chooseWorksheetHtml(topicTitle, gradeText, tasks);
  }

  // --- 4. MEMORY-AUSSCHNEIDEBOGEN ---

  function buildMemoryCraftSheetHtml(topicTitle, gradeText, memTask) {
    const cards = memTask.cards || [];
    let cardsHtml = '';

    cards.forEach((card) => {
      const cardSvg = card.svg || card.content;
      cardsHtml += `
        <div class="print-memory-card">
          <div class="print-mem-corner"><img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 14px; height: 14px;"></div>
          ${cardSvg}
        </div>
      `;
    });

    return `
      <div class="print-page">
        <div class="print-sheet-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo"><img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 20px; height: 20px;"></span>
              <span class="print-brand-title">SCHLAUFUCHS MEMORY-AUSSCHNEIDEBOGEN</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • ${gradeText} • Ausschneiden & Spielen</div>
          </div>
          <div class="print-badge-bw">BASTELBOGEN</div>
        </div>

        <div class="print-craft-instructions">
          <strong>Bastel-Anleitung:</strong>
          Schneide die ${cards.length} Kärtchen an den gestrichelten Linien aus. Lege sie verdeckt auf den Tisch und finde die zusammengehörenden Bildpaare gemeinsam mit deinen Eltern oder Freunden!
        </div>

        <div class="print-memory-grid">
          ${cardsHtml}
        </div>

        <div class="print-sheet-footer">
          <span>Schlaufuchs – Ausschneidebogen für Partner- und Freiarbeit</span>
        </div>
      </div>
    `;
  }

  function renderMemoryCraftSheet(container, topicTitle, gradeText, memTask) {
    container.innerHTML = buildMemoryCraftSheetHtml(topicTitle, gradeText, memTask);
  }

  // --- AUFGABEN-STRUKTURIERUNG (ZWEISPALTIGKEIT & SCHULBUCH-AUFRÄUMUNG) ---

  function renderStructuredTasks(tasks) {
    if (!tasks || tasks.length === 0) return '';

    const allEquations = tasks.every(t => t.type === 'equation');
    const allPyramids = tasks.every(t => t.type === 'pyramid');

    // A. REINE RECHENAUFGABEN (ADDITION / SUBTRAKTION / MULTIPLIKATION / DIVISION)
    // Schulbuch-Layout: 2 Spalten nebeneinander statt vertikaler Schlauch!
    if (allEquations) {
      const half = Math.ceil(tasks.length / 2);
      const col1 = tasks.slice(0, half);
      const col2 = tasks.slice(half);

      const renderEqCol = (list, offset) => {
        let html = '';
        list.forEach((t, i) => {
          const idx = offset + i;
          html += `
            <div class="print-eq-grid-item">
              <span class="print-task-idx">${idx + 1}.</span>
              <span class="print-eq-formula">${t.num1} ${t.symbol} ${t.num2} =</span>
              <span class="print-answer-line"></span>
            </div>
          `;
        });
        return html;
      };

      return `
        <div class="print-section-prompt">1. Rechne die Aufgaben aus:</div>
        <div class="print-eq-columns-wrapper">
          <div class="print-eq-col">${renderEqCol(col1, 0)}</div>
          <div class="print-eq-col">${renderEqCol(col2, half)}</div>
        </div>
      `;
    }

    // B. RECHENTÜRME & ZAHLENMAUERN
    // Schulbuch-Layout: Überschrift EINMAL oben, Mauern 2-spaltig nebeneinander!
    if (allPyramids) {
      let pyrHtml = '';
      const lettersLabels = ['a', 'b', 'c', 'd', 'e', 'f'];

      tasks.forEach((t, idx) => {
        const v = t.values;
        const h = t.hidden || [];
        const getVal = (key) => h.includes(key) ? '<span class="empty-cell"></span>' : `<span>${v[key]}</span>`;
        const label = lettersLabels[idx] || (idx + 1);

        pyrHtml += `
          <div class="print-pyr-card">
            <div class="print-pyr-label">${label})</div>
            <div class="print-pyramid">
              <div class="print-pyr-row"><div class="print-brick">${getVal('peak')}</div></div>
              <div class="print-pyr-row"><div class="print-brick">${getVal('m1')}</div><div class="print-brick">${getVal('m2')}</div></div>
              <div class="print-pyr-row"><div class="print-brick">${getVal('b1')}</div><div class="print-brick">${getVal('b2')}</div><div class="print-brick">${getVal('b3')}</div></div>
            </div>
          </div>
        `;
      });

      return `
        <div class="print-section-prompt">1. Fülle die fehlenden Zahlen in den Zahlenmauern aus:</div>
        <div class="print-pyramids-grid">
          ${pyrHtml}
        </div>
      `;
    }

    // C. ANALOGE UHREN (UHRZEIT)
    // Schulbuch-Layout: 2 Spalten im A4-Raster mit Uhren & Schreiblinien
    const allClocks = tasks.every(t => t.type === 'clock' || t.type === 'clock-set');
    if (allClocks) {
      let clockGridHtml = '';
      const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;

      tasks.forEach((t, idx) => {
        let clockSvgHtml = '';
        const isClockSet = t.type === 'clock-set';

        if (isClockSet) {
          clockSvgHtml = Clock ? Clock.createClockSvg(0, 0, { size: 105, hands: false }) : '';
        } else if (t.isPair && t.clockStart && t.clockEnd) {
          const s1 = Clock ? Clock.createClockSvg(t.clockStart.hours, t.clockStart.minutes, { size: 90 }) : '';
          const s2 = Clock ? Clock.createClockSvg(t.clockEnd.hours, t.clockEnd.minutes, { size: 90 }) : '';
          clockSvgHtml = `
            <div class="print-clock-pair">
              <div><div class="print-clock-sublabel">Start</div>${s1}</div>
              <div class="print-clock-arrow">➔</div>
              <div><div class="print-clock-sublabel">Ziel</div>${s2}</div>
            </div>
          `;
        } else {
          const h = t.hours !== undefined ? t.hours : 12;
          const m = t.minutes !== undefined ? t.minutes : 0;
          clockSvgHtml = Clock ? Clock.createClockSvg(h, m, { size: 105 }) : '';
        }

        const qText = (isClockSet || t.promptType === 'draw-hands')
          ? `Zeichne die Zeiger ein: <strong>${t.targetText || t.prompt}</strong>`
          : (t.question || 'Wie viel Uhr ist es?');

        let lineRow = '';
        if (isClockSet || t.promptType === 'draw-hands') {
          lineRow = `<div class="print-clock-line-row print-clock-draw-cue"><span class="print-clock-draw-tip">Zeichne den kurzen (roten) und langen (blauen) Zeiger ein.</span></div>`;
        } else if (t.promptType === 'hour-only') {
          lineRow = `<div class="print-clock-line-row"><span class="print-clock-label">Es ist:</span><span class="print-clock-num-box"></span><span class="print-clock-unit">Uhr</span></div>`;
        } else if (t.promptType === 'digital') {
          lineRow = `<div class="print-clock-line-row"><span class="print-clock-label">Digital:</span><span class="print-clock-digit-box"></span><span class="print-clock-colon">:</span><span class="print-clock-digit-box"></span><span class="print-clock-unit">Uhr</span></div>`;
        } else if (t.promptType === 'interval') {
          lineRow = `<div class="print-clock-line-row"><span class="print-clock-label">Dauer:</span><span class="print-answer-line" style="min-width: 60px;"></span><span class="print-clock-unit">Minuten</span></div>`;
        } else {
          lineRow = `<div class="print-clock-line-row"><span class="print-clock-label">Uhrzeit:</span><span class="print-answer-line" style="min-width: 90px;"></span></div>`;
        }

        clockGridHtml += `
          <div class="print-clock-grid-item">
            <div class="print-clock-item-header">
              <span class="print-task-idx">${idx + 1}.</span>
              <span class="print-clock-q-text">${qText}</span>
            </div>
            <div class="print-clock-dial-box">
              ${clockSvgHtml}
            </div>
            ${lineRow}
          </div>
        `;
      });

      const hasDrawTasks = tasks.some(t => t.type === 'clock-set' || t.promptType === 'draw-hands');
      const hasInterval = tasks.some(t => t.promptType === 'interval');
      const sectionPrompt = hasInterval
        ? '1. Berechne die vergangene Zeit zwischen Start und Ziel:'
        : (hasDrawTasks 
            ? '1. Lies die Uhren ab (1–3) und zeichne die Zeiger passend ein (4–6):'
            : '1. Lies die Uhrzeiten auf den Zifferblättern ab und trage sie ein:');

      return `
        <div class="print-section-prompt">${sectionPrompt}</div>
        <div class="print-clock-columns-grid">
          ${clockGridHtml}
        </div>
      `;
    }

    // D. ALLGEMEINE AUFGABEN (STANDARDFALL)
    let generalHtml = '';
    tasks.forEach((task, idx) => {
      generalHtml += renderSingleTask(task, idx);
    });
    return generalHtml;
  }

  function renderSingleTask(task, idx) {
    let body = '';

    // Analoge Uhr (Uhrzeit)
    if (task.type === 'clock') {
      const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;
      let clockSvgHtml = '';
      if (task.isPair && task.clockStart && task.clockEnd) {
        const s1 = Clock ? Clock.createClockSvg(task.clockStart.hours, task.clockStart.minutes, { size: 85 }) : '';
        const s2 = Clock ? Clock.createClockSvg(task.clockEnd.hours, task.clockEnd.minutes, { size: 85 }) : '';
        clockSvgHtml = `
          <div class="print-clock-pair" style="display:flex; align-items:center; gap:8px;">
            <div><div style="font-size:8pt; text-align:center;">Start</div>${s1}</div>
            <div>➔</div>
            <div><div style="font-size:8pt; text-align:center;">Ziel</div>${s2}</div>
          </div>
        `;
      } else {
        const h = task.hours !== undefined ? task.hours : 12;
        const m = task.minutes !== undefined ? task.minutes : 0;
        clockSvgHtml = Clock ? Clock.createClockSvg(h, m, { size: 95 }) : '';
      }

      body = `
        <div class="print-clock-single-wrap" style="display:flex; align-items:center; gap:16px;">
          <div class="print-clock-dial-box">${clockSvgHtml}</div>
          <div style="flex:1;">
            <div class="print-task-prompt-inline">${task.question || 'Wie viel Uhr ist es?'}</div>
            <div style="margin-top:8px; display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; font-size:10pt;">Uhrzeit:</span>
              <span class="print-answer-line" style="min-width: 120px;"></span>
            </div>
          </div>
        </div>
      `;
    }
    // Silbenschwingen & Könige
    else if (task.question && (task.question.includes('Silben') || task.question.includes('Silbenbögen'))) {
      const match = task.question.match(/„([^“]+)“/);
      const targetWord = task.targetWord || (match ? match[1] : '');
      const spacedWord = targetWord.split('').join('  ');

      body = `
        <div class="print-syllable-wrapper">
          <div class="print-task-prompt-inline">
            Sprich das Wort, zeichne die <strong>Silbenbögen (◡ ◡)</strong> darunter und kröne die <strong>Silbenkönige</strong> (A, E, I, O, U):
          </div>
          <div class="print-syllable-word-box">
            <span class="print-syllable-word">${spacedWord}</span>
            <div class="print-syllable-bow-guide"></div>
          </div>
          <div class="print-syllable-count-row">
            <span>Wie viele Silben hat das Wort?</span>
            <span class="print-answer-line" style="min-width: 60px;"></span>
          </div>
        </div>
      `;
    }
    // Zeitformen (Gegenwart -> Mitvergangenheit)
    else if (task.type === 'tenses') {
      body = `
        <div>
          <div class="print-task-prompt-inline">${task.prompt || 'Setze den Satz aus der Gegenwart in die Mitvergangenheit:'}</div>
          <div class="print-prompt-quote">Gegenwart: <strong>${task.presentSentence}</strong></div>
          <div class="print-handwriting-lines"></div>
        </div>
      `;
    }
    // 4 Fälle des Nomens (Werfall, Wesfall, Wemfall, Wenfall)
    else if (task.type === 'cases') {
      const marked = task.sentence.replace(task.targetPhrase, `<u>${task.targetPhrase}</u>`);
      body = `
        <div>
          <div class="print-task-prompt-inline">${task.prompt || 'Bestimme den Fall des unterstrichenen Nomens:'}</div>
          <div class="print-sentence-flow">${marked}</div>
          <div style="margin-top: 4px; font-weight: 700; font-size: 9pt;">Fall: <span class="print-answer-line" style="min-width: 140px; display: inline-block;"></span></div>
        </div>
      `;
    }
    // Muster & Logik
    else if (task.type === 'pattern') {
      body = `
        <div>
          <div class="print-task-prompt-inline">${task.prompt || 'Setze das Muster logisch fort:'}</div>
          <div style="font-size: 13pt; letter-spacing: 6px; margin-top: 4px; display: flex; align-items: center; gap: 8px;">
            <span>${task.pattern.join(' ')}</span>
            <span class="print-answer-line" style="min-width: 45px; display: inline-block;"></span>
          </div>
        </div>
      `;
    }
    // Multiple-Choice & Verkehrszeichen
    else if (task.type === 'multiple-choice') {
      let visualHtml = '';
      if (task.customVisualHtml) {
        visualHtml = `<div class="print-visual-container">${task.customVisualHtml}</div>`;
      } else if (task.signId && window.Schlaufuchs.Signs && window.Schlaufuchs.Signs.getSignSvg) {
        visualHtml = `<div class="print-visual-container">${window.Schlaufuchs.Signs.getSignSvg(task.signId)}</div>`;
      }

      let optionsMarkup = '';
      task.options.forEach((opt) => {
        optionsMarkup += `<div class="print-mc-choice">☐ ${opt}</div>`;
      });

      const cleanQ = task.question.replace(/\(PIRLS\)/gi, '').replace(/\n/g, '<br>');

      body = `
        <div class="print-mc-wrapper">
          ${visualHtml}
          <div class="print-mc-q">${cleanQ}</div>
          <div class="print-mc-grid">${optionsMarkup}</div>
        </div>
      `;
    }
    // Wortarten
    else if (task.type === 'word-types') {
      let wordsMarkup = '';
      task.sentence.forEach(w => {
        if (w.ignore) {
          wordsMarkup += `<span class="print-word-skip">${w.word}</span> `;
        } else {
          wordsMarkup += `<span class="print-word-target"><u>${w.word}</u> <span class="print-word-box-ans">[ &nbsp; ]</span></span> `;
        }
      });

      body = `
        <div>
          <div class="print-task-prompt-inline">
            Bestimme die Wortarten der unterstrichenen Wörter (<strong>[N]</strong> = Namenwort, <strong>[T]</strong> = Tunwort, <strong>[W]</strong> = Wiewort):
          </div>
          <div class="print-sentence-flow">${wordsMarkup}</div>
        </div>
      `;
    }
    // Groß- & Kleinschreibung
    else if (task.type === 'capitalization') {
      body = `
        <div>
          <div class="print-task-prompt-inline">Schreibe den Satz mit allen Namenwörtern groß und richtig auf:</div>
          <div class="print-prompt-quote">Vorgabe: ${task.words.map(w => w.text).join(' ')}.</div>
          <div class="print-handwriting-lines"></div>
        </div>
      `;
    }
    // Schüttelsätze
    else if (task.type === 'scramble') {
      body = `
        <div>
          <div class="print-task-prompt-inline">Bilde aus den Wörtern einen vollständigen Satz:</div>
          <div class="print-word-pool-badges">Wörter: <em>${task.pool.join(' • ')}</em></div>
          <div class="print-handwriting-lines"></div>
        </div>
      `;
    }
    // Schriftliche Rechenverfahren
    else if (task.type === 'written-calc') {
      let headRow = '';
      task.headers.forEach(h => { headRow += `<span class="print-calc-col-head">${h}</span>`; });
      let n1Row = '';
      task.digits1.forEach(d => { n1Row += `<span class="print-calc-digit">${d === ' ' ? '&nbsp;' : d}</span>`; });
      let n2Row = '';
      task.digits2.forEach(d => { n2Row += `<span class="print-calc-digit">${d === ' ' ? '&nbsp;' : d}</span>`; });

      body = `
        <div class="print-written-wrap">
          <div class="print-task-prompt-inline">Rechne schriftlich untereinander:</div>
          <div class="print-written-box">
            <div class="print-written-head-row">&nbsp;&nbsp;${headRow}</div>
            <div>&nbsp;&nbsp;${n1Row}</div>
            <div>${task.operation}&nbsp;${n2Row}</div>
            <div class="print-written-res-line">=&nbsp;<span class="print-written-empty">_______</span></div>
          </div>
          <div class="print-calc-grid-mm" style="width: 130px; height: 60px; margin-left: 20px;"></div>
        </div>
      `;
    }
    // Lesegeschichten
    else if (task.type === 'reading') {
      let qMarkup = '';
      task.questions.forEach((qObj, qIdx) => {
        let optMarkup = '';
        qObj.options.forEach(opt => {
          optMarkup += `<div class="print-mc-choice">☐ ${opt}</div>`;
        });
        qMarkup += `
          <div class="print-reading-q-block">
            <div class="print-reading-q-title">Frage ${qIdx + 1}: ${qObj.question}</div>
            <div class="print-mc-grid">${optMarkup}</div>
          </div>
        `;
      });

      body = `
        <div class="print-reading-wrap">
          <div class="print-reading-title">${task.title}</div>
          <div class="print-reading-text-card">${task.text}</div>
          <div class="print-reading-active-prompt">Lies aufmerksam und beantworte die Fragen:</div>
          ${qMarkup}
        </div>
      `;
    }
    // Rechengeschichten
    else if (task.type === 'text-problem') {
      const hasQuestionInStory = Boolean(task.story && task.story.includes('?'));
      const questionHtml = (!hasQuestionInStory && task.question)
        ? `<div class="print-story-question"><strong>Frage:</strong> ${task.question}</div>`
        : (!hasQuestionInStory ? `<div class="print-story-row"><strong class="print-story-label">Frage:</strong> <span class="print-line print-story-line"></span></div>` : '');

      body = `
        <div>
          <div class="print-story-text">${task.story}</div>
          <div class="print-story-work-area">
            ${questionHtml}
            <div class="print-story-row">
              <strong class="print-story-label">Rechnung:</strong>
              <span class="print-calc-grid-mm print-story-grid"></span>
            </div>
            <div class="print-story-row">
              <strong class="print-story-label">Antwort:</strong>
              <span class="print-line print-story-line"></span>
            </div>
          </div>
        </div>
      `;
    }
    // Zahlenreihen & Ketten
    else if (task.type === 'sequence') {
      body = `
        <div class="print-task-flex">
          <div style="font-size: 10.5pt; font-weight: 800;">
            ${task.prompt || ('Setze fort: ' + task.sequence.join(', ') + ', ___ , ___')}
          </div>
          <div style="display: flex; gap: 8px;">
            <span class="print-answer-line" style="min-width: 50px;"></span>
            <span class="print-answer-line" style="min-width: 50px;"></span>
          </div>
        </div>
      `;
    }
    // Zwanzigerfeld
    else if (task.type === 'twenty-field') {
      let dots = '';
      for (let d = 0; d < 20; d++) {
        dots += '<span class="print-dot-cell"></span>';
      }
      body = `
        <div>
          <div class="print-task-prompt-inline">${task.prompt || 'Trage die Menge in das Zwanzigerfeld ein:'}</div>
          <div class="print-twenty-wrap" style="display: flex; align-items: center; gap: 16px; margin-top: 4px;">
            <div class="print-twenty-field-grid" style="display: grid; grid-template-columns: repeat(10, 16px); gap: 2px; border: 1.5pt solid #000; padding: 3px;">
              ${dots}
            </div>
            <div style="font-size: 9pt; font-weight: 700;">
              ${task.val} = <span class="print-answer-line" style="min-width: 35px; display: inline-block;"></span> Z + <span class="print-answer-line" style="min-width: 35px; display: inline-block;"></span> E
            </div>
          </div>
        </div>
      `;
    }
    // Fallback
    else {
      body = `
        <div class="print-task-flex">
          <div>${task.question || task.prompt || 'Löse die Aufgabe.'}</div>
          <span class="print-answer-line" style="min-width: 120px;"></span>
        </div>
      `;
    }

    return `
      <div class="print-task-item">
        <span class="print-task-num">${idx + 1}.</span>
        <div class="print-task-content">${body}</div>
      </div>
    `;
  }

  // --- LÖSUNGSZEILE FÜR DEN KNICK-STREIFEN (RECHTS) ---

  function renderKnickSolutionRow(task, idx) {
    const solText = getTaskSolutionText(task);
    const letter = task.secretLetter || '';
    const letterBadge = letter ? `<span class="print-knick-letter-badge">(${letter})</span>` : '';

    return `
      <div class="print-knick-item">
        <span class="print-knick-num">${idx + 1}.</span>
        <span class="print-knick-val">${solText}</span>
        ${letterBadge}
      </div>
    `;
  }

  // --- LÖSUNGSZEILE FÜR DAS VOLL-LÖSUNGSBLATT (SEITE 2) ---

  function renderFullSolutionRow(task, idx, letter) {
    const solText = getTaskSolutionText(task);
    const letterHint = letter ? `<span class="print-letter-tag">Buchstabe: <strong>${letter}</strong></span>` : '';

    return `
      <div class="print-solution-item">
        <span class="print-task-num">${idx + 1}.</span>
        <div style="flex: 1;">
          <div style="font-weight: 700; margin-bottom: 2px;">${task.question || task.title || ('Aufgabe ' + (idx + 1))} ${letterHint}</div>
          <div class="print-full-sol-val">Lösung: <strong>${solText}</strong></div>
        </div>
      </div>
    `;
  }

  // --- HILFSFUNKTION: KOMPAKTER LÖSUNGSTEXT JE AUFGABENTYP ---

  function getTaskSolutionText(task) {
    if (task.type === 'equation') {
      const v = task.answer;
      return window.Schlaufuchs && window.Schlaufuchs.formatZahl ? window.Schlaufuchs.formatZahl(v) : `${v}`;
    }
    if (task.type === 'pyramid') {
      const v = task.values;
      const h = task.hidden || [];
      return h.map(k => v[k]).join(', ');
    }
    if (task.type === 'tenses') {
      return task.targetSentence || task.answer;
    }
    if (task.type === 'cases') {
      return task.fullCase || task.answer;
    }
    if (task.type === 'pattern') {
      return task.answer;
    }
    if (task.question && (task.question.includes('Silben') || task.question.includes('Silbenbögen'))) {
      if (task.syllables) {
        return `${task.syllables} (${task.syllableCount || 2} Silben)${task.vowels ? ' • Könige: ' + task.vowels : ''}`;
      }
      if (task.correctText) return task.correctText;
      return `${task.correctIndex !== undefined ? (task.correctIndex + 1) + ' Silben' : (task.answer || 'gelöst')}`;
    }
    if (task.type === 'multiple-choice') {
      if (task.correctText) return task.correctText;
      if (task.options && task.correctIndex !== undefined) return task.options[task.correctIndex];
      return 'Richtige Antwort angekreuzt';
    }
    if (task.type === 'word-types') {
      const tokens = [];
      task.sentence.forEach(w => {
        if (!w.ignore && w.type) {
          const tName = w.type === 'nomen' ? 'Namenwort' : (w.type === 'verb' ? 'Tunwort' : 'Wiewort');
          tokens.push(`${w.word} (${tName})`);
        }
      });
      return tokens.join(' • ');
    }
    if (task.type === 'capitalization') {
      return task.targetNouns ? task.targetNouns.join(', ') : 'Großschreibung';
    }
    if (task.type === 'scramble') {
      return task.targetSentence ? `${task.targetSentence}.` : 'Satz geordnet';
    }
    if (task.type === 'written-calc') {
      return task.resultDigits ? task.resultDigits.join('') : (task.answer ? (window.Schlaufuchs && window.Schlaufuchs.formatZahl ? window.Schlaufuchs.formatZahl(task.answer) : `${task.answer}`) : 'Berechnet');
    }
    if (task.type === 'reading') {
      if (task.questions) {
        return task.questions.map((q, i) => `F${i + 1}: ${q.options[q.correctIndex]}`).join(' | ');
      }
      return 'Beantwortet';
    }
    if (task.type === 'text-problem') {
      return `R: ${task.calculation} = ${task.answer} ${task.unit || ''}`;
    }
    if (task.type === 'clock' || task.type === 'clock-set') {
      const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;
      if (task.type === 'clock-set') {
        const h = task.targetHours;
        const m = task.targetMinutes || 0;
        return task.solutionText || (Clock ? `${Clock.formatTime(h, m)} (${Clock.describeTimeText(h, m)})` : `${h}:${m} Uhr`);
      }
      return task.solutionText || task.answerText || String(task.answer || 'gelöst');
    }
    if (task.type === 'sequence') {
      return `${task.answer}`;
    }
    if (task.type === 'twenty-field') {
      return `${task.answer}`;
    }
    if (task.type === 'direct-input' || task.type === 'geometry') {
      return `${task.answer} ${task.unit || ''}`;
    }
    return String(task.answer || 'gelöst');
  }

  // --- OFFZIELLE SCHLAUFUCHS-URKUNDE DRUCKEN ---

  function printCertificate(profile, options = {}) {
    if (typeof profile === 'string') {
      profile = { name: profile };
    } else if (!profile) {
      profile = (window.Schlaufuchs.State && window.Schlaufuchs.State.getActiveProfile)
        ? window.Schlaufuchs.State.getActiveProfile()
        : { name: 'Schlaufuchs-Schüler' };
    }

    let printContainer = document.getElementById('print-area');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-area';
      document.body.appendChild(printContainer);
    }

    const isFull = Boolean(options.full || options.all);
    const childName = (options.name || profile.name || 'Schlaufuchs-Schüler').trim();
    const totalStars = isFull ? 84 : Object.values(profile.stars || {}).reduce((a, b) => a + b, 0);
    const unlockedStickersCount = isFull ? 16 : (profile.unlockedStickers || ['s1']).length;
    const now = new Date();
    const dateStr = `${now.getDate()}. ${['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][now.getMonth()]} ${now.getFullYear()}`;

    printContainer.innerHTML = `
      <div class="print-page">
        <div class="print-certificate">
          <div class="cert-header">
            <div class="cert-logo-wrap"><img src="assets/icons/fuchs.svg" alt="" style="width: 56px; height: 56px;"></div>
            <h1 class="cert-title">SCHLAUFUCHS-URKUNDE</h1>
            <div class="cert-sub">Offizielle Auszeichnung für herausragende Lernerfolge</div>
          </div>

          <div class="cert-body">
            <div class="cert-text">Diese Ehrenurkunde wird mit großem Stolz verliehen an</div>
            <div class="cert-name">${childName}</div>
            <div class="cert-text">
              für besonderen Fleiß, schlaues Köpfchen und große Begeisterung beim Rechnen, Lesen, Schreiben und Entdecken auf der Volksschul-Lernplattform Schlaufuchs.
            </div>

            <div class="cert-stats">
              <div class="cert-stat-box">
                <div class="cert-stat-val">${totalStars}</div>
                <div class="cert-stat-label">Gesammelte Sterne</div>
              </div>
              <div class="cert-stat-box">
                <div class="cert-stat-val">${unlockedStickersCount} / 16</div>
                <div class="cert-stat-label">Sammel-Sticker</div>
              </div>
              <div class="cert-stat-box">
                <div class="cert-stat-val">Champion</div>
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
            <div style="margin-top: 24px; font-size: 8pt; color: var(--linie);">
              Schlaufuchs Lernplattform • BMBWF Lehrplan Österreich • Entwickelt für die Volksschule
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
    printTopicWorksheet: printTopicWorksheet,
    printBatchWorksheets: printBatchWorksheets,
    previewTopicWorksheet: previewTopicWorksheet,
    printCertificate: printCertificate,
    pickSecretWord: pickSecretWord,
    buildKnickHtml: buildKnickHtml,
    buildTwoPageHtml: buildTwoPageHtml,
    chooseWorksheetHtml: chooseWorksheetHtml
  };
})();
