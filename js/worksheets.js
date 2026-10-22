// =============================================================
// SCHLAUFUCHS – js/worksheets.js
// Arbeitsblätter-Zentrum für Lehrkräfte und Eltern
// Vollwertige Offline-A4-Druckvorbereitung nach österr. Lehrplan
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Worksheets = (function () {
  'use strict';

  let currentGrade = 'all';
  let currentSubject = 'all';

  function init() {
    setupFilters();
    setupHubSettings();
    setupBatchAndNavigation();
    setupPreviewModal();
    renderWorksheets();
  }

  function setupFilters() {
    // Schulstufen-Filter
    const gradeBtns = document.querySelectorAll('.filter-btn-ws');
    gradeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gradeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGrade = btn.getAttribute('data-grade');
        renderWorksheets();
      });
    });

    // Fächer-Filter
    const subjBtns = document.querySelectorAll('.filter-subj-ws');
    subjBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subjBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSubject = btn.getAttribute('data-subject');
        renderWorksheets();
      });
    });
  }

  function setupHubSettings() {
    const State = window.Schlaufuchs.State;
    const solutionSelect = document.getElementById('hub-solution-mode');
    const secretWordCheck = document.getElementById('hub-secret-word');

    if (State && State.getPrintSettings) {
      const current = State.getPrintSettings();
      if (solutionSelect && current.solutionMode) {
        solutionSelect.value = current.solutionMode;
      }
      if (secretWordCheck && current.secretWord !== undefined) {
        secretWordCheck.checked = current.secretWord;
      }
    }

    const saveSettings = () => {
      if (State && State.savePrintSettings) {
        State.savePrintSettings({
          solutionMode: solutionSelect ? solutionSelect.value : 'knick',
          secretWord: secretWordCheck ? secretWordCheck.checked : true
        });
      }
    };

    if (solutionSelect) solutionSelect.addEventListener('change', saveSettings);
    if (secretWordCheck) secretWordCheck.addEventListener('change', saveSettings);
  }

  function setupBatchAndNavigation() {
    const btnBatch = document.getElementById('btn-batch-print');
    if (btnBatch) {
      btnBatch.addEventListener('click', () => {
        const topics = getFilteredTopics();
        if (topics.length === 0) {
          if (window.Schlaufuchs.Dialog) {
            window.Schlaufuchs.Dialog.alert('Keine Arbeitsblätter für den aktuellen Filter vorhanden.');
          } else {
            alert('Keine Arbeitsblätter für den aktuellen Filter vorhanden.');
          }
          return;
        }

        const effGrade = currentGrade === 'all' ? 2 : parseInt(currentGrade, 10);
        if (window.Schlaufuchs.Print && window.Schlaufuchs.Print.printBatchWorksheets) {
          window.Schlaufuchs.Print.printBatchWorksheets(topics, effGrade);
        }
      });
    }

    const btnBack = document.getElementById('btn-back-from-worksheets');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (window.Schlaufuchs.App && window.Schlaufuchs.App.showMenuView) {
          window.Schlaufuchs.App.showMenuView();
        } else {
          showOnlineMenuView();
        }
      });
    }
  }

  function setupPreviewModal() {
    const modal = document.getElementById('worksheet-preview-modal');
    const btnClose = document.getElementById('btn-preview-close');
    const btnDismiss = document.getElementById('btn-preview-dismiss');

    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDismiss) btnDismiss.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  }

  function getFilteredTopics() {
    const Topics = window.Schlaufuchs.Topics;
    if (!Topics) return [];

    let list = Topics.getAllTopics();

    if (currentGrade !== 'all') {
      const g = parseInt(currentGrade, 10);
      list = list.filter(t => t.grades.includes(g));
    }

    if (currentSubject !== 'all') {
      list = list.filter(t => t.subject === currentSubject);
    }

    return list;
  }

  function renderWorksheets() {
    const container = document.getElementById('worksheets-cards-container');
    if (!container) return;

    const topics = getFilteredTopics();
    const Topics = window.Schlaufuchs.Topics;

    if (topics.length === 0) {
      container.innerHTML = `
        <div class="worksheets-empty-state">
          <div class="empty-icon">🦊</div>
          <h3>Keine Arbeitsblätter gefunden</h3>
          <p>Für diese Kombination aus Schulstufe und Fach liegen noch keine Blätter vor.</p>
        </div>
      `;
      return;
    }

    let html = '';
    topics.forEach(t => {
      const gradesLabel = t.grades.length === 1 ? `${t.grades[0]}. Klasse` : `${t.grades[0]}. – ${t.grades[t.grades.length - 1]}. Klasse`;
      const archLabel = Topics ? Topics.getArchetypeLabel(t.archetype) : 'Arbeitsblatt';
      const effGrade = currentGrade === 'all' ? t.grades[0] : parseInt(currentGrade, 10);

      html += `
        <div class="worksheet-card" data-topic-id="${t.id}">
          <div class="ws-card-header">
            <div class="ws-icon-wrap">
              <img src="${t.icon}" class="ws-icon-svg" alt="">
            </div>
            <div class="ws-badges">
              <span class="ws-grade-badge">${gradesLabel}</span>
              <span class="ws-arch-badge">${archLabel}</span>
            </div>
          </div>

          <div class="ws-card-body">
            <h3 class="ws-title">${t.title}</h3>
            <p class="ws-desc">${t.subtitle}</p>
            <div class="ws-lehrplan-tag">${t.lehrplanRef}</div>
          </div>

          <div class="ws-card-footer">
            <button type="button" class="btn-ws-preview" data-topic-id="${t.id}" data-grade="${effGrade}" title="Blatt am Bildschirm vorab ansehen">
              <span>Vorschau</span>
            </button>
            <button type="button" class="btn-ws-print" data-topic-id="${t.id}" data-grade="${effGrade}" title="Als A4-Blatt drucken">
              <img src="assets/icons/drucken.svg" class="btn-icon-svg" alt="">
              <span>Drucken</span>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Klick-Handler für Einzel-Druck & Vorschau
    container.querySelectorAll('.btn-ws-print').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-topic-id');
        const g = parseInt(btn.getAttribute('data-grade'), 10) || 2;
        if (window.Schlaufuchs.Print && window.Schlaufuchs.Print.printTopicWorksheet) {
          window.Schlaufuchs.Print.printTopicWorksheet(topicId, g);
        }
      });
    });

    container.querySelectorAll('.btn-ws-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-topic-id');
        const g = parseInt(btn.getAttribute('data-grade'), 10) || 2;
        if (window.Schlaufuchs.Print && window.Schlaufuchs.Print.previewTopicWorksheet) {
          window.Schlaufuchs.Print.previewTopicWorksheet(topicId, g);
        }
      });
    });
  }

  function showWorksheetsView() {
    document.body.classList.remove('in-exercise');
    const viewMenu = document.getElementById('view-menu');
    const viewExercise = document.getElementById('view-exercise');
    const viewWorksheets = document.getElementById('view-worksheets');

    if (viewMenu) viewMenu.classList.remove('active');
    if (viewExercise) viewExercise.classList.remove('active');
    if (viewWorksheets) viewWorksheets.classList.add('active');

    const tabOnline = document.getElementById('tab-btn-online');
    const tabWorksheets = document.getElementById('tab-btn-worksheets');
    if (tabOnline) tabOnline.classList.remove('active');
    if (tabWorksheets) tabWorksheets.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderWorksheets();
  }

  function showOnlineMenuView() {
    document.body.classList.remove('in-exercise');
    const viewMenu = document.getElementById('view-menu');
    const viewExercise = document.getElementById('view-exercise');
    const viewWorksheets = document.getElementById('view-worksheets');

    if (viewWorksheets) viewWorksheets.classList.remove('active');
    if (viewExercise) viewExercise.classList.remove('active');
    if (viewMenu) viewMenu.classList.add('active');

    const tabOnline = document.getElementById('tab-btn-online');
    const tabWorksheets = document.getElementById('tab-btn-worksheets');
    if (tabWorksheets) tabWorksheets.classList.remove('active');
    if (tabOnline) tabOnline.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return {
    init: init,
    renderWorksheets: renderWorksheets,
    showWorksheetsView: showWorksheetsView,
    showOnlineMenuView: showOnlineMenuView
  };
})();
