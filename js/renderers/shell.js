// =============================================================
// SCHLAUFUCHS – js/renderers/shell.js
// Standardisierte 3-Zonen-Bühne & Aktionsleiste
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  function getUniversalScaffolding(...args) {
    return R.getUniversalScaffolding ? R.getUniversalScaffolding(...args) : null;
  }

  function renderBottomBarHtml(index, hintTitle = 'Tipp anzeigen', buttonText = 'Prüfen') {
    return `
      <div class="scaffolding-box" id="scaffolding-${index}"></div>
      <div class="task-bottom-bar">
        <div class="task-tools-group">
          <div id="spk-container-${index}"></div>
          <button type="button" class="btn btn-hint-scaffold" id="btn-scaffold-${index}" title="${hintTitle}">
            <img src="assets/icons/buch.svg" class="icon-inline-svg" alt="" style="width: 16px; height: 16px;">
            <span>Tipp</span>
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
          scaffoldBtn.innerHTML = 'Hilfe';
          scaffoldBtn.classList.remove('active');
          return;
        }

        scaffoldBox.style.display = 'block';
        scaffoldBtn.innerHTML = `Hilfe (${scaffoldLevel}/3)`;
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

  function resetFeedback(card, index) {
    card.classList.remove('correct', 'incorrect');
    const fb = card.querySelector(`#feedback-${index}`);
    if (fb) {
      fb.className = 'task-feedback';
      fb.innerHTML = '';
    }
  }

  R.renderBottomBarHtml = renderBottomBarHtml;
  R.attachBottomActions = attachBottomActions;
  R.resetFeedback = resetFeedback;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
