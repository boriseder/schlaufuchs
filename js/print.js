// =============================================================
// SCHLAUFUCHS – js/print.js
// Vektoroptimierter A4-Arbeitsblatt- & Urkundendruck (Schulbuch-Look)
// Pädagogisch & ergonomisch fundiert: Montessori-Knick-Lösung,
// Geheimwort-Rätsel mit Buchstabenschlüssel, echte Lineaturen & StVO-SVGs
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Print = (function () {
  'use strict';

  // Liste kindgerechter österreichischer Geheimwörter für die Schatzkiste
  const SECRET_WORDS_BY_LENGTH = {
    4: ['WALD', 'IGEL', 'EULE', 'BERG', 'HERZ', 'FLUS', 'HAHN', 'SONN'],
    5: ['FUCHS', 'STERN', 'WIESE', 'KOBEL', 'BLUME', 'SONNE', 'BIBER', 'TAFEL', 'VOGEL', 'PUPPE'],
    6: ['SCHLAU', 'WINTER', 'SOMMER', 'SCHNEE', 'HERBST', 'SCHULE', 'RAKETE', 'BÜCHER', 'FREUND'],
    7: ['FREUNDE', 'PAPIER', 'LEHRER', 'WISSEN', 'ZEICHEN', 'MEISTER'],
    8: ['FUCHSBAU', 'SCHLAUER', 'WALDKAUZ', 'TAUSENDE', 'KÖNIGIN']
  };

  const FALLBACK_WORDS = ['FUCHS', 'SCHLAU', 'BIBER', 'STERN', 'WALD', 'SONNE'];

  function pickSecretWord(count) {
    const list = SECRET_WORDS_BY_LENGTH[count] || (count > 8 ? SECRET_WORDS_BY_LENGTH[8] : FALLBACK_WORDS);
    const word = list[Math.floor(Math.random() * list.length)] || 'FUCHS';
    try {
      const Storage = window.Schlaufuchs.Storage;
      if (Storage) {
        const existing = Storage.lesen('valid_secret_words') || [];
        if (!existing.includes(word)) {
          existing.push(word);
          Storage.schreiben('valid_secret_words', existing.slice(-20));
        }
      }
    } catch (e) {}
    return word;
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

    const State = window.Schlaufuchs.State;
    const printSettings = (State && State.getPrintSettings) ? State.getPrintSettings() : { solutionMode: 'knick', secretWord: true };
    const solutionMode = printSettings.solutionMode || 'knick';
    const useSecretWord = printSettings.secretWord !== false;

    const effectiveGradeText = getEffectiveGradeLabel(tasks, gradeText);

    // Spezialfall: Memory -> Ausschneidebogen zum Basteln & Spielen
    const isMemory = tasks.length === 1 && tasks[0].type === 'memory';
    if (isMemory) {
      renderMemoryCraftSheet(printContainer, topicTitle, effectiveGradeText, tasks[0]);
      setTimeout(() => window.print(), 250);
      return;
    }

    // Geheimwort ermitteln & Buchstaben den Aufgaben zuordnen
    const secretWord = useSecretWord ? pickSecretWord(tasks.length) : '';
    const letters = [];
    for (let i = 0; i < tasks.length; i++) {
      letters.push(secretWord[i] || (secretWord[i % secretWord.length] || ''));
    }

    if (solutionMode === 'knick') {
      renderKnickWorksheet(printContainer, topicTitle, effectiveGradeText, tasks, secretWord, letters);
    } else if (solutionMode === 'two-page') {
      renderTwoPageWorksheet(printContainer, topicTitle, effectiveGradeText, tasks, secretWord, letters);
    } else {
      renderWorksheetOnly(printContainer, topicTitle, effectiveGradeText, tasks, secretWord, letters);
    }

    setTimeout(() => {
      window.print();
    }, 250);
  }

  // --- NEUE THEMENBASIERTE WORKSHEET-API (FÜR DEN ARBEITSBLÄTTER-HUB) ---

  function printTopicWorksheet(topicId, targetGrade) {
    const Topics = window.Schlaufuchs.Topics;
    const PrintEngine = window.Schlaufuchs.PrintEngine;
    const meta = Topics ? Topics.getTopicById(topicId) : null;
    const title = meta ? meta.title : 'Arbeitsblatt';
    const grade = targetGrade || (meta && meta.grades ? meta.grades[0] : 2);
    const gradeLabel = `${grade}. Klasse`;

    const tasks = PrintEngine ? PrintEngine.generateWorksheetTasks(topicId, grade) : [];
    if (!tasks || tasks.length === 0) return;

    const State = window.Schlaufuchs.State;
    const printSettings = (State && State.getPrintSettings) ? State.getPrintSettings() : { solutionMode: 'knick', secretWord: true };
    const solutionMode = printSettings.solutionMode || 'knick';
    const useSecretWord = printSettings.secretWord !== false;

    let printContainer = document.getElementById('print-area');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-area';
      document.body.appendChild(printContainer);
    }

    const isMemory = tasks.length === 1 && tasks[0].type === 'memory';
    if (isMemory) {
      printContainer.innerHTML = buildMemoryCraftSheetHtml(title, gradeLabel, tasks[0]);
      setTimeout(() => window.print(), 250);
      return;
    }

    const secretWord = useSecretWord ? (PrintEngine ? PrintEngine.pickSecretWord(tasks.length) : pickSecretWord(tasks.length)) : '';
    const letters = [];
    for (let i = 0; i < tasks.length; i++) {
      letters.push(secretWord[i] || (secretWord[i % secretWord.length] || ''));
    }

    printContainer.innerHTML = buildWorksheetPageHtml(title, gradeLabel, tasks, secretWord, letters, solutionMode);
    setTimeout(() => window.print(), 250);
  }

  function printBatchWorksheets(topicList, targetGrade) {
    if (!topicList || topicList.length === 0) return;
    const PrintEngine = window.Schlaufuchs.PrintEngine;
    const State = window.Schlaufuchs.State;
    const printSettings = (State && State.getPrintSettings) ? State.getPrintSettings() : { solutionMode: 'knick', secretWord: true };
    const solutionMode = printSettings.solutionMode || 'knick';
    const useSecretWord = printSettings.secretWord !== false;

    let allPagesHtml = '';
    topicList.forEach(topic => {
      const grade = targetGrade || (topic.grades ? topic.grades[0] : 2);
      const gradeLabel = `${grade}. Klasse`;
      const tasks = PrintEngine ? PrintEngine.generateWorksheetTasks(topic.id, grade) : [];
      if (tasks && tasks.length > 0) {
        if (tasks.length === 1 && tasks[0].type === 'memory') {
          allPagesHtml += buildMemoryCraftSheetHtml(topic.title, gradeLabel, tasks[0]);
        } else {
          const secretWord = useSecretWord ? (PrintEngine ? PrintEngine.pickSecretWord(tasks.length) : pickSecretWord(tasks.length)) : '';
          const letters = [];
          for (let i = 0; i < tasks.length; i++) {
            letters.push(secretWord[i] || (secretWord[i % secretWord.length] || ''));
          }
          allPagesHtml += buildWorksheetPageHtml(topic.title, gradeLabel, tasks, secretWord, letters, solutionMode);
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

    const tasks = PrintEngine ? PrintEngine.generateWorksheetTasks(topicId, grade) : [];
    if (!tasks || tasks.length === 0) return;

    const State = window.Schlaufuchs.State;
    const printSettings = (State && State.getPrintSettings) ? State.getPrintSettings() : { solutionMode: 'knick', secretWord: true };
    const solutionMode = printSettings.solutionMode || 'knick';
    const useSecretWord = printSettings.secretWord !== false;

    let html = '';
    if (tasks.length === 1 && tasks[0].type === 'memory') {
      html = buildMemoryCraftSheetHtml(title, gradeLabel, tasks[0]);
    } else {
      const secretWord = useSecretWord ? (PrintEngine ? PrintEngine.pickSecretWord(tasks.length) : pickSecretWord(tasks.length)) : '';
      const letters = [];
      for (let i = 0; i < tasks.length; i++) {
        letters.push(secretWord[i] || (secretWord[i % secretWord.length] || ''));
      }
      html = buildWorksheetPageHtml(title, gradeLabel, tasks, secretWord, letters, solutionMode);
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

  function buildWorksheetPageHtml(topicTitle, gradeText, tasks, secretWord, letters, solutionMode) {
    if (solutionMode === 'two-page') {
      return buildTwoPageHtml(topicTitle, gradeText, tasks, secretWord, letters);
    } else if (solutionMode === 'none') {
      return buildWorksheetOnlyHtml(topicTitle, gradeText, tasks, secretWord, letters);
    } else {
      return buildKnickHtml(topicTitle, gradeText, tasks, secretWord, letters);
    }
  }

  // --- 1. KNICK-LÖSUNGS-ARBEITSBLATT (1 SEITE) ---

  function buildKnickHtml(topicTitle, gradeText, tasks, secretWord, letters) {
    const tasksHtml = renderStructuredTasks(tasks);
    let solutionsHtml = '';

    tasks.forEach((task, idx) => {
      const letter = letters[idx] || '';
      solutionsHtml += renderKnickSolutionRow(task, idx, letter);
    });

    const secretRiddleHtml = secretWord ? renderSecretRiddleSection(tasks, secretWord, letters) : '';

    return `
      <div class="print-page print-knick-page">
        <div class="print-knick-wrapper">
          <!-- LINKER TEIL: AUFGABENBLATT FÜR DAS KIND -->
          <div class="print-student-col">
            <div class="print-sheet-header">
              <div class="print-header-left">
                <div class="print-brand-line">
                  <span class="print-brand-logo">🦊</span>
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

            ${secretRiddleHtml}

            <!-- DEZENTE SELBSTEINSCHÄTZUNG AM FUSS -->
            <div class="print-sheet-footer">
              <div class="print-self-eval-inline">
                <span class="print-eval-prompt">Wie war das Blatt für dich?</span>
                <span class="print-eval-check">◯ 🦊 Leicht</span>
                <span class="print-eval-check">◯ 🦊 Ging so</span>
                <span class="print-eval-check">◯ 🦊 Knifflig</span>
              </div>
              <div class="print-footer-sub">
                <span>Schlaufuchs – Kostenlose Lernplattform für die Volksschule</span>
                <span>www.schlaufuchs.at</span>
              </div>
            </div>
          </div>

          <!-- RECHTER TEIL: KNICK-LÖSUNGSSTREIFEN -->
          <div class="print-knick-col">
            <div class="print-knick-top-banner">
              <span>✂️</span> <span>HIER VOR DEM LÖSEN NACH HINTEN KNICKEN</span> <span>✂️</span>
            </div>

            <div class="print-knick-panel">
              <div class="print-knick-head">
                <div class="print-knick-badge">LÖSUNGEN</div>
                <div class="print-knick-sub">Selbstkontrolle</div>
              </div>

              <div class="print-knick-solutions-list">
                ${solutionsHtml}
              </div>

              ${secretWord ? `
                <div class="print-knick-word-box">
                  <div class="print-knick-word-label">Lösungswort:</div>
                  <div class="print-knick-word-val">${secretWord}</div>
                  <div class="print-knick-note">
                    Tippe das Geheimwort in der <strong>Schatzkiste</strong> im Album ein!
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderKnickWorksheet(container, topicTitle, gradeText, tasks, secretWord, letters) {
    container.innerHTML = buildKnickHtml(topicTitle, gradeText, tasks, secretWord, letters);
  }

  // --- 2. ZWEI-SEITEN-MODELL ---

  function buildTwoPageHtml(topicTitle, gradeText, tasks, secretWord, letters) {
    const tasksHtml = renderStructuredTasks(tasks);
    let solutionsHtml = '';

    tasks.forEach((task, idx) => {
      const letter = letters[idx] || '';
      solutionsHtml += renderFullSolutionRow(task, idx, letter);
    });

    const secretRiddleHtml = secretWord ? renderSecretRiddleSection(tasks, secretWord, letters) : '';

    return `
      <!-- SEITE 1: AUFGABENBLATT -->
      <div class="print-page">
        <div class="print-sheet-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo">🦊</span>
              <span class="print-brand-title">SCHLAUFUCHS ARBEITSBLATT</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • ${gradeText}</div>
          </div>
          <div class="print-header-right">
            <div class="print-meta-row"><span class="print-meta-label">Name:</span> <span class="print-meta-line"></span></div>
            <div class="print-meta-row"><span class="print-meta-label">Datum:</span> <span class="print-meta-line"></span></div>
          </div>
        </div>

        <div class="print-tasks-container">
          ${tasksHtml}
        </div>

        ${secretRiddleHtml}

        <div class="print-sheet-footer">
          <div class="print-self-eval-inline">
            <span class="print-eval-prompt">Wie war das Blatt für dich?</span>
            <span class="print-eval-check">◯ 🦊 Leicht</span>
            <span class="print-eval-check">◯ 🦊 Ging so</span>
            <span class="print-eval-check">◯ 🦊 Knifflig</span>
          </div>
          <div class="print-footer-sub">
            <span>Schlaufuchs – Kostenlose Lernplattform für die Volksschule</span>
            <span>Seite 1 / 2</span>
          </div>
        </div>
      </div>

      <!-- SEITE 2: SEPARATES LÖSUNGSBLATT -->
      <div class="print-page print-page-break">
        <div class="print-sheet-header print-solution-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo">🦊</span>
              <span class="print-brand-title">LÖSUNGSBLATT (SELBSTKONTROLLE)</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • Lösungen für Lehrkräfte & Eltern</div>
          </div>
          <div class="print-badge-bw">LÖSUNGEN</div>
        </div>

        <div class="print-tasks-container">
          ${solutionsHtml}
        </div>

        ${secretWord ? `
          <div class="print-secret-section" style="border-top: 1.5pt solid #000; padding-top: 10px; margin-top: 14px;">
            <strong>Lösungswort für die Schlaufuchs-Schatzkiste:</strong> <span style="font-size: 1.2rem; font-weight: 900; letter-spacing: 3px;">${secretWord}</span>
          </div>
        ` : ''}

        <div class="print-sheet-footer">
          <span>Schlaufuchs – Lösungsblatt</span>
          <span>Seite 2 / 2</span>
        </div>
      </div>
    `;
  }

  function renderTwoPageWorksheet(container, topicTitle, gradeText, tasks, secretWord, letters) {
    container.innerHTML = buildTwoPageHtml(topicTitle, gradeText, tasks, secretWord, letters);
  }

  // --- 3. NUR AUFGABENBLATT ---

  function buildWorksheetOnlyHtml(topicTitle, gradeText, tasks, secretWord, letters) {
    const tasksHtml = renderStructuredTasks(tasks);
    const secretRiddleHtml = secretWord ? renderSecretRiddleSection(tasks, secretWord, letters) : '';

    return `
      <div class="print-page">
        <div class="print-sheet-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo">🦊</span>
              <span class="print-brand-title">SCHLAUFUCHS ARBEITSBLATT</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • ${gradeText}</div>
          </div>
          <div class="print-header-right">
            <div class="print-meta-row"><span class="print-meta-label">Name:</span> <span class="print-meta-line"></span></div>
            <div class="print-meta-row"><span class="print-meta-label">Datum:</span> <span class="print-meta-line"></span></div>
          </div>
        </div>

        <div class="print-tasks-container">
          ${tasksHtml}
        </div>

        ${secretRiddleHtml}

        <div class="print-sheet-footer">
          <div class="print-self-eval-inline">
            <span class="print-eval-prompt">Wie war das Blatt für dich?</span>
            <span class="print-eval-check">◯ 🦊 Leicht</span>
            <span class="print-eval-check">◯ 🦊 Ging so</span>
            <span class="print-eval-check">◯ 🦊 Knifflig</span>
          </div>
          <div class="print-footer-sub">
            <span>Schlaufuchs – Kostenlose Lernplattform für die Volksschule</span>
            <span>www.schlaufuchs.at</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderWorksheetOnly(container, topicTitle, gradeText, tasks, secretWord, letters) {
    container.innerHTML = buildWorksheetOnlyHtml(topicTitle, gradeText, tasks, secretWord, letters);
  }

  // --- 4. MEMORY-AUSSCHNEIDEBOGEN ---

  function buildMemoryCraftSheetHtml(topicTitle, gradeText, memTask) {
    const cards = memTask.cards || [];
    let cardsHtml = '';

    cards.forEach((card) => {
      cardsHtml += `
        <div class="print-memory-card">
          <div class="print-mem-corner">🦊</div>
          <div class="print-mem-icon">${card.content}</div>
          <div class="print-mem-label">${card.subtitle || ''}</div>
        </div>
      `;
    });

    return `
      <div class="print-page">
        <div class="print-sheet-header">
          <div class="print-header-left">
            <div class="print-brand-line">
              <span class="print-brand-logo">🦊</span>
              <span class="print-brand-title">SCHLAUFUCHS MEMORY-AUSSCHNEIDEBOGEN</span>
            </div>
            <div class="print-brand-sub">${topicTitle} • ${gradeText} • Ausschneiden & Spielen</div>
          </div>
          <div class="print-badge-bw">BASTELBOGEN</div>
        </div>

        <div class="print-craft-instructions">
          <strong>✂️ Bastel-Anleitung:</strong>
          Schneide die ${cards.length} Kärtchen an den gestrichelten Linien aus. Lege sie verdeckt auf den Tisch und finde die zusammengehörenden Bildpaare gemeinsam mit deinen Eltern oder Freunden!
        </div>

        <div class="print-memory-grid">
          ${cardsHtml}
        </div>

        <div class="print-sheet-footer">
          <span>Schlaufuchs – Ausschneidebogen für Partner- und Freiarbeit</span>
          <span>www.schlaufuchs.at</span>
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

    // C. ALLGEMEINE AUFGABEN (STANDARDFALL)
    let generalHtml = '';
    tasks.forEach((task, idx) => {
      generalHtml += renderSingleTask(task, idx);
    });
    return generalHtml;
  }

  function renderSingleTask(task, idx) {
    let body = '';

    // Silbenschwingen & Könige
    if (task.question && (task.question.includes('Silben') || task.question.includes('Silbenbögen'))) {
      const match = task.question.match(/„([^“]+)“/);
      const targetWord = task.targetWord || (match ? match[1] : '');
      const spacedWord = targetWord.split('').join('  ');

      body = `
        <div class="print-syllable-wrapper">
          <div class="print-task-prompt-inline">
            1. Sprich das Wort, zeichne die <strong>Silbenbögen (◡ ◡)</strong> darunter und kröne die <strong>Silbenkönige</strong> (A, E, I, O, U) mit einer Krone 👑:
          </div>
          <div class="print-syllable-word-box">
            <span class="print-syllable-word">${spacedWord}</span>
            <div class="print-syllable-bow-guide"></div>
          </div>
          <div class="print-syllable-count-row">
            <span>2. Wie viele Silben hat das Wort?</span>
            <span class="print-answer-line" style="min-width: 60px;"></span>
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
          <div class="print-reading-active-prompt">💡 Lies aufmerksam und beantworte die Fragen:</div>
          ${qMarkup}
        </div>
      `;
    }
    // Rechengeschichten
    else if (task.type === 'text-problem') {
      body = `
        <div>
          <div class="print-story-text">${task.story}</div>
          <div class="print-fra-container">
            <div class="print-fra-row"><strong>F:</strong> <span class="print-line" style="flex:1;"></span></div>
            <div class="print-fra-row" style="margin: 6px 0;">
              <strong>R:</strong> <span class="print-line" style="width: 170px;"></span>
              <span class="print-calc-grid-mm" style="width: 110px; height: 36px; margin-left: 15px;"></span>
            </div>
            <div class="print-fra-row"><strong>A:</strong> <span class="print-line" style="flex:1;"></span></div>
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

  // --- DAS ECHTE RÄTSEL-LAYOUT (BUCHSTABEN-SCHLÜSSEL & GEHEIMWORT) ---

  function renderSecretRiddleSection(tasks, secretWord, letters) {
    const isAllNumeric = tasks.every(t => t.type === 'equation' || t.answer !== undefined);

    let boxesHtml = '';
    for (let i = 0; i < secretWord.length; i++) {
      boxesHtml += `<span class="print-secret-box"><span class="print-secret-num">${i + 1}</span></span>`;
    }

    // Wenn alle Aufgaben Zahlenrechnungen sind:
    // ECHTE BUCHSTABEN-TABELLE mit durchmischten Ergebnissen!
    if (isAllNumeric) {
      const codePairs = [];
      tasks.forEach((t, i) => {
        const sol = String(t.answer !== undefined ? t.answer : (t.type === 'equation' ? t.answer : (i + 1)));
        const letChar = letters[i] || '';
        codePairs.push({ sol: sol, letter: letChar });
      });

      // Shuffeln für echten Rätselcharakter (keine vorgefertigte Reihenfolge!)
      const shuffledPairs = [...codePairs].sort(() => Math.random() - 0.5);

      let headerCols = '';
      let letterCols = '';
      shuffledPairs.forEach(pair => {
        headerCols += `<td class="print-code-ans-cell">${pair.sol}</td>`;
        letterCols += `<td class="print-code-letter-cell">${pair.letter}</td>`;
      });

      return `
        <div class="print-secret-section">
          <div class="print-decoder-wrap">
            <span class="print-decoder-prompt">2. Finde die Lösungsbuchstaben in der Geheimwort-Tabelle:</span>
            <table class="print-decoder-table">
              <tr>${headerCols}</tr>
              <tr>${letterCols}</tr>
            </table>
          </div>

          <div class="print-secret-header">
            <span class="print-secret-title">🦊 Schlaufuchs-Geheimwort:</span>
            <div class="print-secret-boxes">${boxesHtml}</div>
            <span class="print-secret-chest-badge">🗝️ Schatzkiste im Sticker-Album!</span>
          </div>
        </div>
      `;
    }

    // Für Text-, Silben- und Multiple-Choice-Aufgaben:
    // Aufdecken im Knick-Lösungsstreifen zur Selbstkontrolle
    return `
      <div class="print-secret-section">
        <div class="print-secret-header">
          <span class="print-secret-title">🦊 Schlaufuchs-Geheimwort:</span>
          <div class="print-secret-boxes">${boxesHtml}</div>
        </div>
        <div class="print-secret-sub">
          Kontrolliere deine Antworten im Knick-Streifen und trage dein Lösungswort hier ein! 🗝️ Schatzkiste im Album!
        </div>
      </div>
    `;
  }

  // --- LÖSUNGSZEILE FÜR DEN KNICK-STREIFEN (RECHTS) ---

  function renderKnickSolutionRow(task, idx, letter) {
    const solText = getTaskSolutionText(task);
    const letterHint = letter ? `<span class="print-knick-letter">➔ <strong>${letter}</strong></span>` : '';

    return `
      <div class="print-knick-item">
        <span class="print-knick-num">${idx + 1}.</span>
        <span class="print-knick-val">${solText}</span>
        ${letterHint}
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
      return `${task.answer}`;
    }
    if (task.type === 'pyramid') {
      const v = task.values;
      const h = task.hidden || [];
      return h.map(k => v[k]).join(', ');
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
      return task.resultDigits ? task.resultDigits.join('') : 'Berechnet';
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
                <div style="font-size: 9pt; color: #475569; margin-top: 4px;">Datum</div>
              </div>
              <div>
                <div class="cert-sig-line" style="min-width: 200px;"></div>
                <div style="font-size: 9pt; color: #475569; margin-top: 4px;">Unterschrift (Lehrkraft / Eltern)</div>
              </div>
            </div>
            <div style="margin-top: 24px; font-size: 8pt; color: #94a3b8;">
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
    pickSecretWord: pickSecretWord
  };
})();
