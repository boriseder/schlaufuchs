// =============================================================
// SCHLAUFUCHS – js/renderers/math.js
// DOM-Renderer für mathematische Aufgaben (Gleichung, Pyramide,
// Zwanzigerfeld, Schriftliche Rechenverfahren, Geometrie, Textaufgaben)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  function attachBottomActions(...args) { return R.attachBottomActions(...args); }
  function renderBottomBarHtml(...args) { return R.renderBottomBarHtml(...args); }
  function resetFeedback(...args) { return R.resetFeedback(...args); }

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
                  placeholder="?" 
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
            Frage: ${task.question}
          </div>
        </div>
        <div class="task-stage">
          <div class="story-box text-problem-story">
            ${task.story}
          </div>
          <div class="text-problem-calc-row">
            <span class="text-problem-calc-label">Deine Rechnung (Ergebnis):</span>
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="task-input input-width-140" 
              id="input-${index}" 
              placeholder="?" 
              value="${task.userAnswer || ''}"
            />
            <span class="text-problem-unit">${task.unit || ''}</span>
          </div>
          <div id="calc-display-${index}" class="text-problem-calc-display${task.isCorrect ? ' is-visible' : ''}">
            Lösungsweg: ${task.calculation} = ${ansFormatted} ${task.unit || ''}
          </div>
          <div id="answer-text-${index}" class="text-problem-ans-text">
            Antwort: ${task.isCorrect ? `<strong class="text-problem-ans-highlight">${task.answerText}</strong>` : blankAnswer}
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
            Blaue Punkte: <strong>${task.a}</strong> &nbsp;|&nbsp; Rote Punkte: <strong>${task.b}</strong>
          </div>
          <div class="twenty-field-input-row">
            <input 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*" 
              class="task-input input-width-140" 
              id="input-${index}" 
              placeholder="?" 
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

  R.renderEquation = renderEquation;
  R.renderPyramid = renderPyramid;
  R.renderGeometry = renderGeometry;
  R.renderTextProblem = renderTextProblem;
  R.renderTwentyField = renderTwentyField;
  R.renderWrittenCalc = renderWrittenCalc;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
