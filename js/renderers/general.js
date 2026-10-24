// =============================================================
// SCHLAUFUCHS – js/renderers/general.js
// DOM-Renderer für Sachunterricht & Gehirntraining
// (Multiple-Choice, Direkteingabe, Memory, Muster, Reihenfolgen)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  const setupPointerDrag = S.DragDrop ? S.DragDrop.setupPointerDrag : null;
  function attachBottomActions(...args) { return R.attachBottomActions(...args); }
  function renderBottomBarHtml(...args) { return R.renderBottomBarHtml(...args); }
  function resetFeedback(...args) { return R.resetFeedback(...args); }

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
              <span class="memory-brand"><img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 32px; height: 32px;"></span>
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
            Finde immer 2 gleiche Tier- oder Naturkärtchen!
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
              placeholder="?" 
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

  // 8b. UHRZEIT (Analoge & digitale Uhren mit SVG)
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

  R.renderMultipleChoice = renderMultipleChoice;
  R.renderMemory = renderMemory;
  R.renderDirectInput = renderDirectInput;
  R.renderPattern = renderPattern;
  R.renderSequence = renderSequence;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
