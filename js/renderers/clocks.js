// =============================================================
// SCHLAUFUCHS – js/renderers/clocks.js
// DOM-Renderer für Uhrzeit-Aufgaben (Analoge Uhr, Uhr stellen, 4-Uhren-Auswahl)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  function attachBottomActions(...args) { return R.attachBottomActions(...args); }
  function renderBottomBarHtml(...args) { return R.renderBottomBarHtml(...args); }
  function resetFeedback(...args) { return R.resetFeedback(...args); }

  function renderClock(card, task, index, onCheck) {
    const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;
    let visualHtml = '';

    if (task.isPair && task.clockStart && task.clockEnd) {
      const svg1 = Clock ? Clock.createClockSvg(task.clockStart.hours, task.clockStart.minutes, { size: 130 }) : '';
      const svg2 = Clock ? Clock.createClockSvg(task.clockEnd.hours, task.clockEnd.minutes, { size: 130 }) : '';
      visualHtml = `
        <div class="clock-pair-container">
          <div class="clock-card-single">
            <span class="clock-badge">Uhr 1 (Start)</span>
            ${svg1}
          </div>
          <div class="clock-arrow-separator">➔</div>
          <div class="clock-card-single">
            <span class="clock-badge">Uhr 2 (Ziel)</span>
            ${svg2}
          </div>
        </div>
      `;
    } else {
      const h = task.hours !== undefined ? task.hours : 12;
      const m = task.minutes !== undefined ? task.minutes : 0;
      const clockSvg = Clock ? Clock.createClockSvg(h, m, { size: 180 }) : '';
      visualHtml = `
        <div class="clock-svg-box">
          ${clockSvg}
        </div>
      `;
    }

    let inputAreaHtml = '';
    if (task.options && task.options.length > 0) {
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
      inputAreaHtml = `
        <div class="choice-options-grid">
          ${optionsHtml}
        </div>
      `;
    } else {
      inputAreaHtml = `
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
      `;
    }

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">${task.question}</div>
        </div>
        <div class="task-stage">
          <div class="clock-stage-wrap">
            ${visualHtml}
            ${inputAreaHtml}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Uhrzeit-Tipp anzeigen')}
      </div>
    `;

    // Event-Handling
    if (task.options && task.options.length > 0) {
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
    } else {
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

    attachBottomActions(card, task, index, onCheck, task.question);
  }

  // 8c. UHR STELLEN (Interaktives Einstellen der Zeiger)
  function renderClockSet(card, task, index, onCheck) {
    const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;
    task.userHours = task.userHours !== undefined ? task.userHours : (task.initialHours !== undefined ? task.initialHours : 12);
    task.userMinutes = task.userMinutes !== undefined ? task.userMinutes : (task.initialMinutes !== undefined ? task.initialMinutes : 0);

    const isGrade1 = task.schulstufe === 1;
    const hasFiveMinStep = task.schulstufe >= 3;

    function renderClockSvgHtml() {
      if (!Clock) return '';
      return Clock.createClockSvg(task.userHours, task.userMinutes, { size: 180 });
    }

    function renderHourButtonsHtml() {
      let html = '';
      for (let h = 1; h <= 12; h++) {
        const isSel = (task.userHours % 12 === 0 ? 12 : task.userHours % 12) === h;
        const selClass = isSel ? ' selected' : '';
        html += `<button type="button" class="clock-set-btn-hour${selClass}" data-hour="${h}">${h}</button>`;
      }
      return html;
    }

    function renderMinuteButtonsHtml() {
      if (isGrade1) return '';
      const quarters = [
        { label: ':00 (voll)', m: 0 },
        { label: ':15 (viertel nach)', m: 15 },
        { label: ':30 (halb)', m: 30 },
        { label: ':45 (viertel vor)', m: 45 }
      ];

      let html = '<div class="clock-set-quarter-row">';
      quarters.forEach(q => {
        const isSel = task.userMinutes === q.m;
        const selClass = isSel ? ' selected' : '';
        html += `<button type="button" class="clock-set-btn-min${selClass}" data-min="${q.m}">${q.label}</button>`;
      });
      html += '</div>';

      if (hasFiveMinStep) {
        html += `
          <div class="clock-set-step-row">
            <button type="button" class="clock-set-step-btn" data-step="-5">− 5 min</button>
            <button type="button" class="clock-set-step-btn" data-step="+5">+ 5 min</button>
          </div>
        `;
      }
      return html;
    }

    function getFormattedCurrentTime() {
      if (!Clock) return `${task.userHours}:${task.userMinutes}`;
      return `${Clock.formatTime(task.userHours, task.userMinutes)} (${Clock.describeTimeText(task.userHours, task.userMinutes)})`;
    }

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            <span>${task.question || 'Stelle die Zeiger der Uhr:'}</span>
            <span class="clock-target-time-badge">${task.targetText || task.prompt}</span>
          </div>
        </div>
        <div class="task-stage">
          <div class="clock-stage-wrap">
            <div class="clock-svg-box" id="clock-svg-box-${index}">
              ${renderClockSvgHtml()}
            </div>
            <div class="clock-current-time-readout">
              Eingestellte Zeit: <strong id="clock-readout-${index}">${getFormattedCurrentTime()}</strong>
            </div>
            <div class="clock-set-controls">
              <div class="clock-control-group">
                <span class="clock-control-title">Stundenzeiger (rot, kurz):</span>
                <div class="clock-set-hours-grid">
                  ${renderHourButtonsHtml()}
                </div>
              </div>
              ${!isGrade1 ? `
                <div class="clock-control-group">
                  <span class="clock-control-title">Minutenzeiger (blau, lang):</span>
                  ${renderMinuteButtonsHtml()}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Uhrzeit-Tipp anzeigen')}
      </div>
    `;

    function updateView() {
      const svgBox = card.querySelector(`#clock-svg-box-${index}`);
      if (svgBox) svgBox.innerHTML = renderClockSvgHtml();
      const readout = card.querySelector(`#clock-readout-${index}`);
      if (readout) readout.textContent = getFormattedCurrentTime();

      const hourBtns = card.querySelectorAll('.clock-set-btn-hour');
      hourBtns.forEach(btn => {
        const h = parseInt(btn.getAttribute('data-hour'), 10);
        const currH = task.userHours % 12 === 0 ? 12 : task.userHours % 12;
        btn.classList.toggle('selected', h === currH);
      });

      const minBtns = card.querySelectorAll('.clock-set-btn-min');
      minBtns.forEach(btn => {
        const m = parseInt(btn.getAttribute('data-min'), 10);
        btn.classList.toggle('selected', m === task.userMinutes);
      });

      resetFeedback(card, index);
    }

    card.querySelectorAll('.clock-set-btn-hour').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const h = parseInt(btn.getAttribute('data-hour'), 10);
        task.userHours = h;
        updateView();
      });
    });

    card.querySelectorAll('.clock-set-btn-min').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const m = parseInt(btn.getAttribute('data-min'), 10);
        task.userMinutes = m;
        updateView();
      });
    });

    card.querySelectorAll('.clock-set-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = parseInt(btn.getAttribute('data-step'), 10);
        let newMin = task.userMinutes + step;
        if (newMin >= 60) {
          newMin = 0;
          task.userHours = (task.userHours % 12) + 1;
        } else if (newMin < 0) {
          newMin = 55;
          task.userHours = (task.userHours % 12 === 1) ? 12 : task.userHours - 1;
        }
        task.userMinutes = newMin;
        updateView();
      });
    });

    attachBottomActions(card, task, index, onCheck, `${task.question} ${task.targetText || task.prompt}`);
  }

  // 8d. UHR AUSWÄHLEN (4 Zifferblätter Multiple-Choice mit didaktischen Distraktoren)
  function renderClockChoice(card, task, index, onCheck) {
    const Clock = window.Schlaufuchs && window.Schlaufuchs.Clock;
    if (task.userSelected === undefined) task.userSelected = null;

    card.innerHTML = `
      <div class="task-card-content">
        <div class="task-top-row">
          <span class="task-index">${index + 1}.</span>
          <div class="task-question-title">
            <span>${task.question || 'Welche Uhr zeigt diese Uhrzeit?'}</span>
            <span class="clock-target-time-badge">${task.targetText || task.prompt}</span>
          </div>
        </div>
        <div class="task-stage">
          <div class="clock-choice-grid" role="radiogroup" aria-label="Wähle die passende Uhr">
            ${task.options.map((opt, optIdx) => {
              const isSel = task.userSelected === optIdx;
              const clockSvg = Clock ? Clock.createClockSvg(opt.hours, opt.minutes, { size: 110 }) : '';
              return `
                <button type="button" 
                  class="clock-choice-card${isSel ? ' selected' : ''}" 
                  data-choice-idx="${optIdx}"
                  role="radio"
                  aria-checked="${isSel ? 'true' : 'false'}"
                  aria-label="Uhr Option ${optIdx + 1}: ${opt.hours} Uhr ${opt.minutes} Minuten">
                  <div class="clock-choice-dial">
                    ${clockSvg}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
        ${renderBottomBarHtml(index, 'Uhrzeit-Tipp anzeigen')}
      </div>
    `;

    const cards = card.querySelectorAll('.clock-choice-card');
    cards.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chosenIdx = parseInt(btn.getAttribute('data-choice-idx'), 10);
        task.userSelected = chosenIdx;
        task.userAnswer = String(chosenIdx);

        cards.forEach(c => {
          const isThis = parseInt(c.getAttribute('data-choice-idx'), 10) === chosenIdx;
          c.classList.toggle('selected', isThis);
          c.setAttribute('aria-checked', isThis ? 'true' : 'false');
        });

        resetFeedback(card, index);
      });
    });

    attachBottomActions(card, task, index, onCheck, `${task.question || 'Welche Uhr zeigt diese Uhrzeit?'} ${task.targetText || task.prompt}`);
  }

  // 9. GEOMETRIE (Umfang & Fläche mit SVG-Rechteck)

  R.renderClock = renderClock;
  R.renderClockSet = renderClockSet;
  R.renderClockChoice = renderClockChoice;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
