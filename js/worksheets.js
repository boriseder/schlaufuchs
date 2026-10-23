// =============================================================
// SCHLAUFUCHS – js/worksheets.js
// Arbeitsblätter-Zentrum für Lehrkräfte und Eltern
// Vollwertige Offline-A4-Druckvorbereitung nach österr. Lehrplan
// Harmonisiert: 1:1 Designsprache & Fächergliederung wie im Hauptmenü
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Worksheets = (function () {
  'use strict';

  let currentGrade = 'all';

  const SUBJECTS_CONFIG = [
    {
      key: 'math',
      title: 'Mathematik',
      icon: 'assets/icons/fach-mathe.svg',
      badgeClass: 'badge-math',
      badgeText: 'Zahlen & Logik'
    },
    {
      key: 'german',
      title: 'Deutsch',
      icon: 'assets/icons/fach-deutsch.svg',
      badgeClass: 'badge-german',
      badgeText: 'Lesen & Schreiben'
    },
    {
      key: 'general',
      title: 'Sachunterricht',
      icon: 'assets/icons/fach-sach.svg',
      badgeClass: 'badge-general',
      badgeText: 'Natur & Umwelt'
    },
    {
      key: 'brain',
      title: 'Gehirntraining',
      icon: 'assets/icons/fach-denken.svg',
      badgeClass: 'badge-brain',
      badgeText: 'Denken & Gedächtnis'
    }
  ];

  function init() {
    setupFilters();
    setupBatchAndNavigation();
    setupPreviewModal();
    renderWorksheets();
  }

  function setupFilters() {
    // Schulstufen-Filter (Klassenfilter)
    const gradeBtns = document.querySelectorAll('.filter-btn-ws');
    gradeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gradeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGrade = btn.getAttribute('data-grade');
        renderWorksheets();
      });
    });
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

        const effGrade = currentGrade === 'all' ? null : parseInt(currentGrade, 10);
        if (window.Schlaufuchs.Print && window.Schlaufuchs.Print.printBatchWorksheets) {
          window.Schlaufuchs.Print.printBatchWorksheets(topics, effGrade);
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

    return list;
  }

  function renderWorksheets() {
    const container = document.getElementById('worksheets-cards-container');
    if (!container) return;

    const topics = getFilteredTopics();
    const countEl = document.getElementById('worksheets-count');
    const batchBtn = document.getElementById('btn-batch-print');
    const batchSpan = batchBtn ? (batchBtn.querySelector('#batch-print-text') || batchBtn.querySelector('span')) : null;

    if (countEl) {
      if (topics.length === 0) {
        countEl.textContent = 'Keine Arbeitsblätter';
      } else if (topics.length === 1) {
        countEl.textContent = '1 Arbeitsblatt';
      } else {
        countEl.textContent = `${topics.length} Arbeitsblätter`;
      }
    }

    if (batchBtn) {
      if (topics.length === 0) {
        batchBtn.style.display = 'none';
      } else {
        batchBtn.style.display = 'inline-flex';
        if (batchSpan) {
          batchSpan.textContent = topics.length === 1 ? 'Dieses Blatt drucken' : `Alle ${topics.length} Blätter drucken`;
        }
      }
    }

    if (topics.length === 0) {
      container.innerHTML = `
        <div class="worksheets-empty-state">
          <div class="empty-icon">🦊</div>
          <h3>Keine Arbeitsblätter gefunden</h3>
          <p>Für diese Schulstufe liegen keine Blätter vor.</p>
        </div>
      `;
      return;
    }

    let html = '';
    SUBJECTS_CONFIG.forEach(subj => {
      const subjTopics = topics.filter(t => t.subject === subj.key);
      if (subjTopics.length === 0) return;

      let cardsHtml = '';
      subjTopics.forEach(t => {
        const gradesLabel = t.grades.length === 1 ? `${t.grades[0]}. Klasse` : `${t.grades[0]}. – ${t.grades[t.grades.length - 1]}. Klasse`;
        const effGrade = currentGrade === 'all' ? t.grades[0] : parseInt(currentGrade, 10);

        cardsHtml += `
          <div class="topic-card worksheet-card" data-topic-id="${t.id}" data-grade="${effGrade}" tabindex="0" role="button" aria-label="Arbeitsblatt ${t.title} ansehen und drucken">
            <div class="topic-header">
              <div class="topic-icon-badge">
                <img src="${t.icon}" class="topic-icon-svg" alt="${t.title}">
              </div>
              <span class="grade-pill">${gradesLabel}</span>
            </div>
            <div class="topic-body">
              <h3>${t.title}</h3>
            </div>
            <div class="topic-footer ws-card-footer-pill">
              <span class="ws-print-link">
                <img src="assets/icons/drucken.svg" class="icon-inline-svg" alt="">
                A4 drucken
              </span>
            </div>
          </div>
        `;
      });

      html += `
        <div class="subject-group" data-subject="${subj.key}">
          <div class="subject-title">
            <img src="${subj.icon}" class="subject-icon-svg" alt="">
            <span>${subj.title}</span>
            <span class="subject-badge ${subj.badgeClass}">${subj.badgeText}</span>
          </div>
          <div class="topics-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Klick auf die gesamte Karte öffnet die Vorschau
    container.querySelectorAll('.worksheet-card').forEach(card => {
      const openSheet = () => {
        const topicId = card.getAttribute('data-topic-id');
        const g = parseInt(card.getAttribute('data-grade'), 10) || 2;
        if (window.Schlaufuchs.Print && window.Schlaufuchs.Print.previewTopicWorksheet) {
          window.Schlaufuchs.Print.previewTopicWorksheet(topicId, g);
        }
      };

      card.addEventListener('click', openSheet);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSheet();
        }
      });
    });
  }

  function showWorksheetsView() {
    document.body.classList.remove('in-exercise');
    const viewMenu = document.getElementById('view-menu');
    const viewExercise = document.getElementById('view-exercise');
    const viewWorksheets = document.getElementById('view-worksheets');
    const btnHeaderWorksheets = document.getElementById('btn-header-worksheets');

    if (viewMenu) viewMenu.classList.remove('active');
    if (viewExercise) viewExercise.classList.remove('active');
    if (viewWorksheets) viewWorksheets.classList.add('active');
    if (btnHeaderWorksheets) btnHeaderWorksheets.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderWorksheets();
  }

  function showOnlineMenuView() {
    document.body.classList.remove('in-exercise');
    const viewMenu = document.getElementById('view-menu');
    const viewExercise = document.getElementById('view-exercise');
    const viewWorksheets = document.getElementById('view-worksheets');
    const btnHeaderWorksheets = document.getElementById('btn-header-worksheets');

    if (viewWorksheets) viewWorksheets.classList.remove('active');
    if (viewExercise) viewExercise.classList.remove('active');
    if (viewMenu) viewMenu.classList.add('active');
    if (btnHeaderWorksheets) btnHeaderWorksheets.classList.remove('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return {
    init: init,
    renderWorksheets: renderWorksheets,
    showWorksheetsView: showWorksheetsView,
    showOnlineMenuView: showOnlineMenuView
  };
})();
