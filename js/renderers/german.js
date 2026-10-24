// =============================================================
// SCHLAUFUCHS – js/renderers/german.js
// DOM-Renderer für Deutsch-Aufgaben (Wortarten, Groß/Klein,
// Schüttelsätze, PIRLS-Leseverständnis)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  const setupPointerDrag = S.DragDrop ? S.DragDrop.setupPointerDrag : null;
  function attachBottomActions(...args) { return R.attachBottomActions(...args); }
  function renderBottomBarHtml(...args) { return R.renderBottomBarHtml(...args); }
  function resetFeedback(...args) { return R.resetFeedback(...args); }

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
        btnNomen.innerHTML = 'Nomen';
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
        btnVerb.innerHTML = 'Verb';
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
          btnAdj.innerHTML = 'Adjektiv';
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
  function renderReading(card, task, index, onCheck) {
    let questionsHtml = '';
    task.questions.forEach((qObj, qIdx) => {
      let optionsHtml = '';
      qObj.options.forEach((opt, oIdx) => {
        const isSelected = qObj.userAnswer === oIdx;
        const selClass = isSelected ? 'reading-opt-selected' : '';
        optionsHtml += `
          <button type="button" class="reading-option-btn ${selClass}" data-q="${qIdx}" data-opt="${oIdx}">
            <span class="reading-opt-indicator">${isSelected ? '◉' : '◯'}</span>
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
                <span>Fragen zum Text:</span>
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
            if (ind) ind.textContent = '◯';
          });
        }
        btn.classList.add('reading-opt-selected');
        const ind = btn.querySelector('.reading-opt-indicator');
        if (ind) ind.textContent = '◉';

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


  R.renderWordTypes = renderWordTypes;
  R.renderCapitalization = renderCapitalization;
  R.renderScramble = renderScramble;
  R.renderReading = renderReading;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
