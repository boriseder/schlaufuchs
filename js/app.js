// =============================================================
// SCHLAUFUCHS – js/app.js
// Hauptanwendungs-Controller: Routing, Aufgabengenerierung,
// Aufgabenprüfung, Stern-Belohnungen & iPad Touch-Optimierung
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

(function () {
  'use strict';

  // State & Services
  const State = window.Schlaufuchs.State;
  const Confetti = window.Schlaufuchs.Confetti;
  const Renderers = window.Schlaufuchs.Renderers;
  const MathGen = window.Schlaufuchs.Generators.Math;
  const GermanGen = window.Schlaufuchs.Generators.German;
  const GeneralGen = window.Schlaufuchs.Generators.General;
  const BrainGen = window.Schlaufuchs.Generators.Brain;

  // DOM-Elemente
  let viewMenu, viewExercise;
  let currentTopicId = null;
  let currentTasks = [];
  let currentTaskIndex = 0;
  let currentGradeFilter = 'all';

  function initApp() {
    viewMenu = document.getElementById('view-menu');
    viewExercise = document.getElementById('view-exercise');

    // Module initialisieren
    if (window.Schlaufuchs.Admin) window.Schlaufuchs.Admin.init();
    if (window.Schlaufuchs.Scratchpad) window.Schlaufuchs.Scratchpad.init();
    if (window.Schlaufuchs.Stickers) window.Schlaufuchs.Stickers.init();

    setupAudioControls();
    setupCertificatePrint();
    setupHeaderProfile();
    setupNavigation();
    setupFilterButtons();
    setupTopicCards();
    setupChildNumpad();
    updateMenuDisplay();

    // Bei Änderungen im State (Profile, Sterne, Schulstufen, Einstellungen) Anzeige aktualisieren
    State.subscribe((event, data) => {
      if (event === 'profile-changed' || event === 'profiles-updated' || event === 'stars-changed' || event === 'grades-changed') {
        updateProfileDisplay();
        updateTopicStarsDisplay();
        updateMenuDisplay();
      } else if (event === 'settings-changed') {
        updateMenuDisplay();
      }
    });

    updateProfileDisplay();
    updateTopicStarsDisplay();
  }

  // --- AUDIO-STEUERUNG (KLASSENZIMMER-MODUS) ---

  function setupAudioControls() {
    const soundBtn = document.getElementById('btn-toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    if (!soundBtn || !window.Schlaufuchs.Audio) return;

    function updateSoundUi() {
      const isMuted = window.Schlaufuchs.Audio.isMuted();
      if (soundIcon) {
        soundIcon.innerHTML = isMuted 
          ? '<img src="assets/icons/ton-aus.svg" class="header-icon-svg" alt="Ton aus">'
          : '<img src="assets/icons/ton-an.svg" class="header-icon-svg" alt="Ton an">';
      }
      if (isMuted) {
        soundBtn.classList.add('is-muted');
        soundBtn.title = 'Ton ist stummgeschaltet. Klicken zum Einschalten';
      } else {
        soundBtn.classList.remove('is-muted');
        soundBtn.title = 'Ton ausschalten (Klassenzimmer-Modus)';
      }
    }

    updateSoundUi();

    soundBtn.addEventListener('click', () => {
      window.Schlaufuchs.Audio.toggleMute();
      updateSoundUi();
    });
  }

  // --- SCHLAUFUCHS-URKUNDE DRUCKEN ---

  function setupCertificatePrint() {
    const certBtn = document.getElementById('btn-print-certificate');
    if (certBtn) {
      certBtn.addEventListener('click', () => {
        const profile = State.getActiveProfile();
        if (window.Schlaufuchs.Print) {
          window.Schlaufuchs.Print.printCertificate(profile);
        }
      });
    }
  }

  // --- HEADER & PROFIL-SWITCHER ---

  function setupHeaderProfile() {
    const profileBtn = document.getElementById('header-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeBtn = document.getElementById('btn-close-profile-modal');

    if (profileBtn && profileModal) {
      profileBtn.addEventListener('click', () => {
        openProfileModal();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          profileModal.classList.remove('active');
        });
      }

      profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.remove('active');
      });
    }
  }

  function openProfileModal() {
    const modal = document.getElementById('profile-modal');
    const list = document.getElementById('modal-profiles-grid');
    if (!modal || !list) return;

    const profiles = State.loadAllProfiles();
    const active = State.getActiveProfile();

    list.innerHTML = '';
    profiles.forEach(p => {
      const isActive = p.id === active.id;
      const totalStars = Object.values(p.stars || {}).reduce((a, b) => a + b, 0);

      const card = document.createElement('div');
      card.className = `profile-pick-card ${isActive ? 'active-profile' : ''}`;
      card.style.cssText = 'cursor: pointer; padding: 14px; border-radius: 14px; border: 2px solid ' + (isActive ? '#2563eb' : '#e2e8f0') + '; background: ' + (isActive ? '#eff6ff' : 'white') + '; text-align: center; transition: all 0.2s;';

      const gradesList = (p.grades && p.grades.length > 0) ? p.grades : [1, 2, 3, 4];
      const sortedGrades = [...gradesList].sort((a, b) => a - b);
      const gradesText = sortedGrades.length === 4
        ? '1. – 4. Klasse'
        : sortedGrades.map(g => `${g}. Klasse`).join(', ');
      const esc = (window.Schlaufuchs && window.Schlaufuchs.escapeHtml) || (s => s);
      const safeAvatar = esc(p.avatar);
      const safeName = esc(p.name);

      card.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 6px;">${safeAvatar}</div>
        <strong style="font-size: 1.1rem; color: #1e293b;">${safeName}</strong>
        <div style="font-size: 0.82rem; color: #2563eb; font-weight: 800; margin-top: 3px;">🏫 ${gradesText}</div>
        <div style="font-size: 0.9rem; color: #f59e0b; font-weight: 800; margin-top: 4px;">⭐ ${totalStars} Sterne</div>
      `;

      card.addEventListener('click', () => {
        State.switchProfile(p.id);
        modal.classList.remove('active');
      });

      list.appendChild(card);
    });

    modal.classList.add('active');
  }

  function updateProfileDisplay() {
    const active = State.getActiveProfile();
    const avatarEl = document.getElementById('header-user-avatar');
    const nameEl = document.getElementById('header-user-name');
    const starsEl = document.getElementById('global-stars-count');
    const starIcon = document.querySelector('.header-child-pill .star-icon');
    const divider = document.querySelector('.header-child-pill .pill-divider');

    if (avatarEl) avatarEl.textContent = active.avatar;
    if (nameEl) nameEl.textContent = active.name;
    if (starsEl) {
      starsEl.textContent = State.getTotalStars();
      starsEl.style.display = 'inline';
    }
    if (starIcon) starIcon.style.display = 'inline';
    if (divider) divider.style.display = 'inline';
  }

  function updateTopicStarsDisplay() {
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
      const topicId = card.getAttribute('data-topic-id');
      const starSpan = card.querySelector('.topic-stars');
      if (starSpan && topicId) {
        const starCount = State.getStarsForTopic(topicId);
        starSpan.textContent = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
        if (starCount > 0) {
          starSpan.classList.add('has-stars');
        } else {
          starSpan.classList.remove('has-stars');
        }
      }
    });
  }

  // --- NAVIGATION ---

  function setupNavigation() {
    const brandHome = document.getElementById('brand-home');
    const btnBackMenu = document.getElementById('btn-back-menu');
    const btnFooterBack = document.getElementById('btn-footer-back');
    const btnBack = document.getElementById('btn-back');
    const btnExerciseRegenerate = document.getElementById('btn-exercise-regenerate');
    const btnRegenerate = document.getElementById('btn-regenerate');
    const btnCheckAll = document.getElementById('btn-check-all');

    [brandHome, btnBackMenu, btnFooterBack, btnBack].forEach(btn => {
      if (btn) btn.addEventListener('click', () => showMenuView());
    });

    [btnExerciseRegenerate, btnRegenerate].forEach(btn => {
      if (btn) btn.addEventListener('click', () => {
        if (currentTopicId) loadTopic(currentTopicId);
      });
    });

    const btnFocusPrev = document.getElementById('btn-focus-prev');
    const btnFocusNext = document.getElementById('btn-focus-next');

    if (btnFocusPrev) {
      btnFocusPrev.addEventListener('click', () => {
        if (currentTaskIndex > 0) {
          currentTaskIndex--;
          renderFocusTask();
        }
      });
    }

    if (btnFocusNext) {
      btnFocusNext.addEventListener('click', () => {
        if (currentTaskIndex < currentTasks.length - 1) {
          currentTaskIndex++;
          renderFocusTask();
        }
      });
    }

    if (btnCheckAll) {
      btnCheckAll.addEventListener('click', () => {
        currentTasks.forEach((_, idx) => checkTask(idx));
      });
    }

    const btnPrint = document.getElementById('btn-print-worksheet');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        if (!currentTopicId || currentTasks.length === 0) {
          const Dialog = window.Schlaufuchs.Dialog;
          if (Dialog) Dialog.alert('Bitte wähle zuerst ein Thema aus, um ein Arbeitsblatt zu drucken.');
          else alert('Bitte wähle zuerst ein Thema aus, um ein Arbeitsblatt zu drucken.');
          return;
        }
        const titleEl = document.getElementById('exercise-topic-title') || document.getElementById('exercise-title');
        const badgeEl = document.getElementById('exercise-badge');
        const topicTitle = titleEl ? titleEl.textContent : 'Übungsblatt';
        const gradeText = badgeEl ? badgeEl.textContent : '1.–4. Klasse';
        if (window.Schlaufuchs.Print) {
          window.Schlaufuchs.Print.generateAndPrintWorksheet(topicTitle, gradeText, currentTasks);
        }
      });
    }

    const btnReadAloud = document.getElementById('btn-read-aloud');
    if (btnReadAloud) {
      btnReadAloud.addEventListener('click', speakCurrentTask);
    }

    const btnExerciseScratchpad = document.getElementById('btn-exercise-scratchpad');
    if (btnExerciseScratchpad && window.Schlaufuchs.Scratchpad) {
      btnExerciseScratchpad.addEventListener('click', () => {
        window.Schlaufuchs.Scratchpad.toggle();
      });
    }

    // Mehr-Optionen Dropdown für Lehrkräfte & Eltern
    const btnExerciseMore = document.getElementById('btn-exercise-more');
    const exerciseMoreDropdown = document.getElementById('exercise-more-dropdown');
    if (btnExerciseMore && exerciseMoreDropdown) {
      btnExerciseMore.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = exerciseMoreDropdown.style.display === 'flex';
        exerciseMoreDropdown.style.display = isOpen ? 'none' : 'flex';
        btnExerciseMore.setAttribute('aria-expanded', !isOpen);
      });

      document.addEventListener('click', (e) => {
        if (!btnExerciseMore.contains(e.target) && !exerciseMoreDropdown.contains(e.target)) {
          exerciseMoreDropdown.style.display = 'none';
          btnExerciseMore.setAttribute('aria-expanded', 'false');
        }
      });

      const dropdownBtns = exerciseMoreDropdown.querySelectorAll('button');
      dropdownBtns.forEach(b => {
        b.addEventListener('click', () => {
          exerciseMoreDropdown.style.display = 'none';
          btnExerciseMore.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  function speakCurrentTask() {
    if (!window.Schlaufuchs.Audio || !currentTasks || currentTasks.length === 0) return;
    const task = currentTasks[currentTaskIndex];
    if (!task) return;
    let textToSpeak = '';
    if (task.question) {
      textToSpeak = task.question;
    } else if (task.prompt) {
      textToSpeak = task.prompt;
    } else if (task.num1 !== undefined && task.num2 !== undefined && task.operator) {
      const opWord = task.operator === '+' ? 'plus' : (task.operator === '-' ? 'minus' : (task.operator === '·' || task.operator === '*' || task.operator === '×' ? 'mal' : 'geteilt durch'));
      textToSpeak = `${task.num1} ${opWord} ${task.num2} ist gleich wie viel?`;
    }
    if (textToSpeak) {
      window.Schlaufuchs.Audio.speak(textToSpeak);
    }
  }

  function showMenuView() {
    document.body.classList.remove('in-exercise');
    viewExercise.classList.remove('active');
    viewMenu.classList.add('active');
    currentTopicId = null;
    currentTasks = [];
    const numpad = document.getElementById('child-numpad');
    if (numpad) numpad.style.display = 'none';
    const moreDropdown = document.getElementById('exercise-more-dropdown');
    if (moreDropdown) moreDropdown.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateTopicStarsDisplay();
    updateProfileDisplay();
  }

  function showExerciseView() {
    document.body.classList.add('in-exercise');
    viewMenu.classList.remove('active');
    viewExercise.classList.add('active');
    const moreDropdown = document.getElementById('exercise-more-dropdown');
    if (moreDropdown) moreDropdown.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- FILTER & SCHULSTUFEN-ANZEIGE ---

  function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGradeFilter = btn.getAttribute('data-grade');
        if (window.Schlaufuchs.Storage) {
          window.Schlaufuchs.Storage.schreiben('last_grade_filter', currentGradeFilter);
        }
        applyGradeFilter();
      });
    });
  }

  function updateMenuDisplay() {
    const activeGrades = State.getActiveGrades();
    let savedFilter = null;
    if (window.Schlaufuchs.Storage) {
      savedFilter = window.Schlaufuchs.Storage.lesen('last_grade_filter');
    }

    // Standard-Filterung: Wenn Kind genau 1 Schulstufe hat, standardmäßig diese wählen!
    if (activeGrades.length === 1) {
      currentGradeFilter = String(activeGrades[0]);
    } else if (savedFilter && (savedFilter === 'all' || activeGrades.includes(parseInt(savedFilter, 10)))) {
      currentGradeFilter = savedFilter;
    } else if (currentGradeFilter !== 'all') {
      const selectedGradeNum = parseInt(currentGradeFilter, 10);
      if (!activeGrades.includes(selectedGradeNum)) {
        currentGradeFilter = String(activeGrades[0] || 'all');
      }
    }

    // Filter-Buttons in der Bar aktualisieren/deaktivieren
    const filterBtns = document.querySelectorAll('.filter-btn[data-grade]');
    filterBtns.forEach(btn => {
      const g = btn.getAttribute('data-grade');
      if (g !== 'all') {
        const num = parseInt(g, 10);
        if (!activeGrades.includes(num)) {
          btn.style.display = 'none';
        } else {
          btn.style.display = 'inline-flex';
        }
      }
      btn.classList.toggle('active', g === currentGradeFilter);
    });

    applyGradeFilter();
  }

  function applyGradeFilter() {
    const activeGrades = State.getActiveGrades();
    const cards = document.querySelectorAll('.topic-card');

    cards.forEach(card => {
      const gradesAttr = card.getAttribute('data-grade') || '';
      const cardGrades = gradesAttr.split(',').map(s => parseInt(s.trim(), 10));

      // 1. Prüfen, ob Thema mit den am aktiven Kind freigeschalteten Schulstufen harmoniert
      const hasActiveGrade = cardGrades.some(g => activeGrades.includes(g));

      // 2. Prüfen, ob Thema zum gewählten Menü-Filter passt
      let matchesFilter = false;
      if (currentGradeFilter === 'all') {
        matchesFilter = hasActiveGrade;
      } else {
        const selectedGradeNum = parseInt(currentGradeFilter, 10);
        matchesFilter = cardGrades.includes(selectedGradeNum) && activeGrades.includes(selectedGradeNum);
      }

      if (matchesFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Fachbereichs-Gruppen ausblenden, falls alle Themenkarten darin für das Kind unsichtbar sind
    const subjectGroups = document.querySelectorAll('.subject-group');
    subjectGroups.forEach(group => {
      const groupCards = group.querySelectorAll('.topic-card');
      const hasVisibleCard = Array.from(groupCards).some(c => c.style.display !== 'none');
      group.style.display = hasVisibleCard ? 'flex' : 'none';
    });
  }

  // --- TOPIC AUSWAHL & LADEN ---

  function setupTopicCards() {
    const cards = document.querySelectorAll('.topic-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const topicId = card.getAttribute('data-topic-id');
        if (topicId) loadTopic(topicId);
      });
    });
  }

  function loadTopic(topicId) {
    currentTopicId = topicId;
    currentTaskIndex = 0;
    const cardEl = document.querySelector(`.topic-card[data-topic-id="${topicId}"]`);

    const titleEl = document.getElementById('exercise-topic-title') || document.getElementById('exercise-title');
    const descEl = document.getElementById('exercise-topic-desc');
    const badgeEl = document.getElementById('exercise-badge');

    if (cardEl) {
      if (titleEl) {
        const h3 = cardEl.querySelector('h3');
        if (h3) titleEl.textContent = h3.textContent;
      }
      if (descEl) {
        const p = cardEl.querySelector('p');
        if (p) descEl.textContent = p.textContent;
      }
      if (badgeEl) {
        const pill = cardEl.querySelector('.grade-pill');
        if (pill) badgeEl.textContent = pill.textContent;
      }
    }

    // Fachbereichs-Theme zuweisen (Blau: Mathe, Rot: Deutsch, Grün: Sachunterricht, Lila: Hirn)
    let subject = 'math';
    if (topicId.startsWith('german-')) subject = 'german';
    else if (topicId.startsWith('general-')) subject = 'general';
    else if (topicId.startsWith('brain-')) subject = 'brain';

    if (viewExercise) {
      viewExercise.classList.remove('theme-math', 'theme-german', 'theme-general', 'theme-brain');
      viewExercise.classList.add(`theme-${subject}`);
    }

    // Aufgaben nach Fach und Thema generieren
    currentTasks = generateTasksForTopic(topicId);
    renderFocusTask();
    updateNumpadVisibility(topicId);
    showExerciseView();
  }

  function generateTasksForTopic(topicId) {
    switch (topicId) {
      // 1. MATHEMATIK – Getrennte Grundrechenarten
      case 'math-addition':
        return MathGen.buildAdditionTasks();
      case 'math-subtraction':
        return MathGen.buildSubtractionTasks();
      case 'math-multiplication':
        return MathGen.buildMultiplicationTasks();
      case 'math-division':
        return MathGen.buildDivisionTasks();

      // Weitere Mathe-Themen
      case 'math-pyramid':
        return MathGen.buildPyramidTasks();
      case 'math-time-money':
        return MathGen.buildTimeMoneyTasks();
      case 'math-million':
        return MathGen.buildMillionTasks();
      case 'math-units':
        return MathGen.buildUnitsTasks();
      case 'math-geometry':
        return MathGen.buildGeometryTasks();
      case 'math-stories':
      case 'math-story':
        return MathGen.buildStoryTasks();
      case 'math-twenty':
        return MathGen.buildTwentyFieldTasks();
      case 'math-written':
        return MathGen.buildWrittenMathTasks();

      // 2. DEUTSCH
      case 'german-word-types':
        return GermanGen.buildWordTypesTasks();
      case 'german-capitalization':
        return GermanGen.buildCapitalizationTasks();
      case 'german-scramble':
        return GermanGen.buildScrambleTasks();
      case 'german-cases':
        return GermanGen.buildCasesTasks();
      case 'german-tenses':
        return GermanGen.buildTensesTasks();
      case 'german-syllables':
        return GermanGen.buildSyllableTasks();
      case 'german-reading':
        return GermanGen.buildReadingTasks();

      // 3. SACHUNTERRICHT
      case 'general-calendar':
        return GeneralGen.buildCalendarTasks();
      case 'general-animals':
      case 'general-winter':
        return GeneralGen.buildWinterTasks();
      case 'general-traffic':
        return GeneralGen.buildSchoolWalkTasks();
      case 'general-austria':
        return GeneralGen.buildAustriaTasks();
      case 'general-bike-test':
        return GeneralGen.buildTrafficTasks();

      // 4. GEHIRNTRAINING
      case 'brain-memory':
        return BrainGen.buildMemoryTasks();
      case 'brain-pattern':
      case 'brain-patterns':
        return BrainGen.buildPatternsTasks();
      case 'brain-sequence':
        return BrainGen.buildSequenceTasks();

      default:
        console.warn(`Thema ${topicId} nicht erkannt, lade Addition.`);
        return MathGen.buildAdditionTasks();
    }
  }

  // --- SINGLE-TASK FOCUS RENDERING & NAVIGATION ---

  function renderFocusTask() {
    const container = document.getElementById('exercise-container');
    const stepsContainer = document.getElementById('exercise-steps-container');
    const focusNav = document.getElementById('exercise-focus-navigation');
    const btnPrev = document.getElementById('btn-focus-prev');
    const btnNext = document.getElementById('btn-focus-next');

    if (!container || !currentTasks || currentTasks.length === 0) return;

    const isMemory = currentTasks.length === 1 && currentTasks[0].type === 'memory';
    const allCompleted = isMemory 
      ? (currentTasks[0].matchedPairsCount === currentTasks[0].totalPairs)
      : currentTasks.every(t => t.isCorrect === true);

    // Wenn alle Aufgaben gelöst sind -> Ruhige Abschluss-Zusammenfassung zeigen!
    if (allCompleted && !isMemory) {
      renderSummaryScreen(container);
      if (stepsContainer) stepsContainer.style.display = 'none';
      if (focusNav) focusNav.style.display = 'none';
      return;
    }

    if (stepsContainer) stepsContainer.style.display = 'flex';
    if (focusNav) focusNav.style.display = isMemory ? 'none' : 'flex';

    // 1. Schrittpunkte (Dots) rendern
    renderStepDots(stepsContainer);

    // 2. Index absichern
    if (currentTaskIndex < 0) currentTaskIndex = 0;
    if (currentTaskIndex >= currentTasks.length) currentTaskIndex = currentTasks.length - 1;

    const task = currentTasks[currentTaskIndex];

    // 3. Container leeren und genau EINE Karte fokussiert rendern
    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'task-card';
    card.id = `task-card-${currentTaskIndex}`;

    if (task.isCorrect) {
      card.classList.add('correct');
    }

    renderSingleTask(card, task, currentTaskIndex);
    container.appendChild(card);

    // 4. Navigation aktualisieren
    if (btnPrev) {
      btnPrev.disabled = (currentTaskIndex === 0);
    }
    if (btnNext) {
      btnNext.disabled = (currentTaskIndex === currentTasks.length - 1);
    }

    // 5. Erstes Eingabefeld fokussieren
    const firstInput = card.querySelector('input:not([disabled])');
    if (firstInput) {
      setTimeout(() => {
        firstInput.focus();
        lastFocusedInput = firstInput;
      }, 150);
    }

    updateNumpadVisibility(currentTopicId);
  }

  function renderStepDots(container) {
    if (!container || !currentTasks) return;
    if (currentTasks.length <= 1) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = '';
    currentTasks.forEach((t, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'exercise-step-dot';
      dot.setAttribute('title', `Aufgabe ${i + 1}`);

      if (i === currentTaskIndex) {
        dot.classList.add('active');
      }
      if (t.isCorrect === true) {
        dot.classList.add('completed');
        dot.innerHTML = '<span>✓</span>';
      } else if (t.isCorrect === false) {
        dot.classList.add('incorrect');
        dot.textContent = String(i + 1);
      } else {
        dot.textContent = String(i + 1);
      }

      dot.addEventListener('click', () => {
        currentTaskIndex = i;
        renderFocusTask();
      });

      container.appendChild(dot);
    });
  }

  function renderSummaryScreen(container) {
    container.innerHTML = '';
    const total = currentTasks.length;
    const card = document.createElement('div');
    card.className = 'exercise-summary-card';

    // Sterne berechnen (3 Sterne für alle richtig)
    const starsEarned = 3;
    if (currentTopicId) {
      State.saveStarsForTopic(currentTopicId, starsEarned);
    }

    card.innerHTML = `
      <div class="summary-icon">🎉</div>
      <h3 class="summary-title">Hervorragend gelöst!</h3>
      <div class="summary-stars">⭐⭐⭐</div>
      <p class="summary-msg">Du hast alle ${total} Aufgaben richtig gelöst und 3 Sterne gesammelt!</p>
      <div class="summary-actions">
        <button type="button" class="btn btn-primary" id="btn-summary-retry">
          <span>🔄</span> <span>Neue Aufgaben üben</span>
        </button>
        <button type="button" class="btn btn-secondary" id="btn-summary-back">
          <span>🏠</span> <span>Zurück zur Übersicht</span>
        </button>
      </div>
    `;

    container.appendChild(card);

    // Audio & Konfetti
    Confetti.trigger();
    if (window.Schlaufuchs.Audio) {
      window.Schlaufuchs.Audio.playFanfare();
    }

    // Event-Listener
    const btnRetry = card.querySelector('#btn-summary-retry');
    const btnBack = card.querySelector('#btn-summary-back');

    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        if (currentTopicId) {
          currentTasks = generateTasksForTopic(currentTopicId);
          currentTaskIndex = 0;
          renderFocusTask();
        }
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => {
        showMenuView();
      });
    }
  }

  function renderSingleTask(card, task, index) {
    if (task.type === 'equation') {
      Renderers.renderEquation(card, task, index, checkTask);
    } else if (task.type === 'pyramid') {
      Renderers.renderPyramid(card, task, index, checkTask);
    } else if (task.type === 'word-types') {
      Renderers.renderWordTypes(card, task, index, checkTask);
    } else if (task.type === 'capitalization') {
      Renderers.renderCapitalization(card, task, index, checkTask);
    } else if (task.type === 'scramble') {
      Renderers.renderScramble(card, task, index, checkTask);
    } else if (task.type === 'multiple-choice') {
      Renderers.renderMultipleChoice(card, task, index, checkTask);
    } else if (task.type === 'memory') {
      Renderers.renderMemory(card, task, index, checkTask);
    } else if (task.type === 'direct-input') {
      Renderers.renderDirectInput(card, task, index, checkTask);
    } else if (task.type === 'geometry') {
      Renderers.renderGeometry(card, task, index, checkTask);
    } else if (task.type === 'pattern') {
      Renderers.renderPattern(card, task, index, checkTask);
    } else if (task.type === 'sequence') {
      Renderers.renderSequence(card, task, index, checkTask);
    } else if (task.type === 'text-problem') {
      Renderers.renderTextProblem(card, task, index, checkTask);
    } else if (task.type === 'twenty-field') {
      Renderers.renderTwentyField(card, task, index, checkTask);
    } else if (task.type === 'written-calc') {
      Renderers.renderWrittenCalc(card, task, index, checkTask);
    } else if (task.type === 'reading') {
      Renderers.renderReading(card, task, index, checkTask);
    }
  }

  // --- AUFGABEN-VALIDIERUNG & FEEDBACK ---

  function checkTask(index) {
    const task = currentTasks[index];
    const card = document.getElementById(`task-card-${index}`);
    if (!task || !card) return;

    const feedback = card.querySelector(`#feedback-${index}`);
    let isCorrect = false;
    const V = window.Schlaufuchs && window.Schlaufuchs.Validators;

    if (task.type === 'equation') {
      const input = card.querySelector(`#input-${index}`);
      if (!input || input.value.trim() === '') return;
      if (V && V.pruefeZahl) {
        const res = V.pruefeZahl(input.value.trim(), task.answer);
        if (!res.gueltig) return;
        isCorrect = res.richtig;
      } else {
        const parsed = parseInt(input.value.trim(), 10);
        isCorrect = parsed === task.answer;
      }
    } else if (task.type === 'pyramid') {
      const inputs = card.querySelectorAll('.pyramid-input');
      let allRight = true;
      let allFilled = true;
      let firstEmpty = null;

      inputs.forEach(inp => {
        const key = inp.getAttribute('data-key');
        const correctVal = task.values[key];
        const valStr = inp.value.trim();
        const brick = inp.closest('.pyramid-brick');

        let isValEmpty = false;
        let isValCorrect = false;

        if (V && V.pruefeZahl) {
          const res = V.pruefeZahl(valStr, correctVal);
          if (!res.gueltig) {
            isValEmpty = true;
          } else {
            isValCorrect = res.richtig;
          }
        } else {
          if (valStr === '' || isNaN(parseInt(valStr, 10))) {
            isValEmpty = true;
          } else {
            isValCorrect = parseInt(valStr, 10) === correctVal;
          }
        }

        if (isValEmpty) {
          allFilled = false;
          if (!firstEmpty) firstEmpty = inp;
          if (brick) {
            brick.classList.add('brick-empty-warning');
            setTimeout(() => brick.classList.remove('brick-empty-warning'), 1200);
          }
        } else {
          if (isValCorrect) {
            if (brick) {
              brick.classList.add('brick-correct');
              brick.classList.remove('brick-incorrect', 'brick-empty-warning');
            }
          } else {
            allRight = false;
            if (brick) {
              brick.classList.add('brick-incorrect');
              brick.classList.remove('brick-correct', 'brick-empty-warning');
            }
          }
        }
      });

      if (!allFilled) {
        if (feedback) {
          feedback.className = 'task-feedback incorrect';
          feedback.innerHTML = '<span>⚠️ Bitte trage in alle Steine mit „?“ eine Zahl ein! 🧱</span>';
        }
        if (firstEmpty) {
          firstEmpty.focus();
          lastFocusedInput = firstEmpty;
        }
        if (window.Schlaufuchs.Audio) window.Schlaufuchs.Audio.playPlop();
        return;
      }

      isCorrect = allRight;
    } else if (task.type === 'word-types') {
      let allRight = true;
      let answeredCount = 0;
      task.sentence.forEach(item => {
        if (!item.ignore) {
          if (item.userType) answeredCount++;
          if (item.userType !== item.type) allRight = false;
        }
      });
      if (answeredCount === 0) return;
      isCorrect = allRight;
    } else if (task.type === 'capitalization') {
      const anySelected = task.words.some(w => !w.isFixed && w.isCapital);
      if (!anySelected) return;
      isCorrect = task.words.every(w => w.isFixed || (Boolean(w.isCapital) === Boolean(w.isTarget)));
    } else if (task.type === 'scramble') {
      if (task.assembled.length === 0) return;
      if (V && V.pruefeWort) {
        const res = V.pruefeWort(task.assembled.join(' '), task.targetSentence);
        if (!res.gueltig) return;
        isCorrect = res.richtig;
      } else {
        isCorrect = task.assembled.join(' ') === task.targetSentence;
      }
    } else if (task.type === 'multiple-choice') {
      if (!task.selectedText) return;
      if (V && V.pruefeAuswahl) {
        const res = V.pruefeAuswahl(task.selectedText, task.correctText);
        if (!res.gueltig) return;
        isCorrect = res.richtig;
      } else {
        isCorrect = task.selectedText === task.correctText;
      }
    } else if (task.type === 'memory') {
      isCorrect = task.matchedPairsCount === task.totalPairs;
    } else if (task.type === 'direct-input' || task.type === 'geometry' || task.type === 'text-problem' || task.type === 'twenty-field') {
      const input = card.querySelector(`#input-${index}`);
      if (!input || input.value.trim() === '') return;
      if (V && V.pruefeZahl) {
        const res = V.pruefeZahl(input.value.trim(), task.answer);
        if (!res.gueltig) return;
        isCorrect = res.richtig;
      } else {
        const parsed = parseInt(input.value.trim(), 10);
        isCorrect = parsed === task.answer;
      }

      if (task.type === 'text-problem') {
        const ansEl = card.querySelector(`#answer-text-${index}`);
        const calcEl = card.querySelector(`#calc-display-${index}`);
        if (ansEl && isCorrect) {
          ansEl.innerHTML = `💬 Antwort: <strong style="color: #16a34a;">${task.answerText}</strong> ✅`;
        }
        if (calcEl && isCorrect) {
          calcEl.style.display = 'block';
        }
      }
    } else if (task.type === 'written-calc') {
      if (!task.userAnswer || task.userAnswer.trim() === '') return;
      if (V && V.pruefeZahl) {
        const res = V.pruefeZahl(task.userAnswer, task.answer);
        if (!res.gueltig) return;
        isCorrect = res.richtig;
      } else {
        const parsed = parseInt(task.userAnswer.trim(), 10);
        isCorrect = parsed === task.answer;
      }
    } else if (task.type === 'reading') {
      const allAnswered = task.questions.every(q => q.userAnswer !== null);
      if (!allAnswered) {
        const Dialog = window.Schlaufuchs.Dialog;
        if (Dialog) Dialog.alert('Bitte wähle für alle 3 Fragen eine Antwort aus!');
        else alert('Bitte wähle für alle 3 Fragen eine Antwort aus!');
        return;
      }
      isCorrect = task.questions.every(q => q.userAnswer === q.correctIndex);
      task.questions.forEach((q, qIdx) => {
        const qCard = card.querySelector(`#reading-q-card-${index}-${qIdx}`);
        const qHint = card.querySelector(`#reading-q-hint-${index}-${qIdx}`);
        if (qCard) {
          if (q.userAnswer === q.correctIndex) {
            qCard.style.borderColor = '#22c55e';
            qCard.style.backgroundColor = '#f0fdf4';
            if (qHint) qHint.style.display = 'none';
          } else {
            qCard.style.borderColor = '#ef4444';
            qCard.style.backgroundColor = '#fef2f2';
            if (qHint) {
              qHint.style.display = 'block';
              qHint.textContent = '💡 ' + q.hint;
            }
          }
        }
      });
    } else if (task.type === 'pattern') {
      if (!task.userAnswer) return;
      if (V && V.pruefeAuswahl) {
        const res = V.pruefeAuswahl(task.userAnswer, task.targetAnswer);
        if (!res.gueltig) return;
        isCorrect = res.richtig;
      } else {
        isCorrect = task.userAnswer === task.targetAnswer;
      }
    } else if (task.type === 'sequence') {
      if (task.slots.includes(null)) return;
      isCorrect = JSON.stringify(task.slots) === JSON.stringify(task.targetSequence);
    }

    task.isCorrect = isCorrect;
    card.classList.remove('correct', 'incorrect');

    if (feedback) {
      feedback.className = 'task-feedback';
      if (isCorrect) {
        card.classList.add('correct');
        feedback.classList.add('correct');
        const lobListe = (window.Schlaufuchs && window.Schlaufuchs.Texte && window.Schlaufuchs.Texte.lob) || ['Richtig!'];
        const lob = lobListe[Math.floor(Math.random() * lobListe.length)];
        feedback.innerHTML = `<span>✅ ${lob}</span>`;
        if (window.Schlaufuchs.Audio) window.Schlaufuchs.Audio.playSuccess();

        // 1. Auto-Advancement: nach ca. 450ms zur nächsten ungelösten Aufgabe scrollen & fokussieren
        setTimeout(() => {
          advanceToNextTask(index);
        }, 450);
      } else {
        card.classList.add('incorrect');
        feedback.classList.add('incorrect');
        const nochmalListe = (window.Schlaufuchs && window.Schlaufuchs.Texte && window.Schlaufuchs.Texte.nochmal) || ['Nochmal probieren! 💪'];
        const nochmal = nochmalListe[Math.floor(Math.random() * nochmalListe.length)];
        feedback.innerHTML = `<span>💪 ${nochmal}</span>`;
        if (window.Schlaufuchs.Audio) window.Schlaufuchs.Audio.playPlop();

        // 2. Auto-Select: Fehlerhafte Zahl markieren, sodass sofortiges Tippen den Fehler überschreibt
        highlightInputForCorrection(card);
      }
    }

    updateProgress();
  }

  function advanceToNextTask(currentIndex) {
    if (!currentTasks || currentTasks.length === 0) return;

    // Suche die nächste noch nicht gelöste Aufgabe ab currentIndex + 1
    let nextIdx = -1;
    for (let i = currentIndex + 1; i < currentTasks.length; i++) {
      if (!currentTasks[i].isCorrect) {
        nextIdx = i;
        break;
      }
    }
    // Falls hinten alle gelöst, vorne weitersuchen (falls zuvor übersprungen)
    if (nextIdx === -1) {
      for (let i = 0; i < currentIndex; i++) {
        if (!currentTasks[i].isCorrect) {
          nextIdx = i;
          break;
        }
      }
    }

    if (nextIdx !== -1) {
      currentTaskIndex = nextIdx;
      renderFocusTask();
    } else {
      // Alle Aufgaben gelöst -> Summary Screen!
      renderFocusTask();
    }
  }

  function highlightInputForCorrection(card) {
    const inp = card.querySelector('input:not([disabled])');
    if (inp) {
      inp.focus();
      if (typeof inp.select === 'function') {
        inp.select();
      }
      lastFocusedInput = inp;
    }
  }

  // --- GROSSTASTEN-ZAHLENFELD (CHILD NUMPAD) ---

  let lastFocusedInput = null;

  function setNumpadMode(isActive) {
    const numpad = document.getElementById('child-numpad');
    if (!numpad) return;
    numpad.style.display = isActive ? 'flex' : 'none';

    // Wenn das Ziffernfeld aktiv ist, verhindern wir auf iPad & Touch-Geräten, dass die iOS-Bildschirmtastatur hochspringt
    const container = document.getElementById('exercise-container');
    if (container) {
      const inputs = container.querySelectorAll('input');
      inputs.forEach(inp => {
        if (isActive) {
          if (!inp.hasAttribute('data-orig-inputmode')) {
            inp.setAttribute('data-orig-inputmode', inp.getAttribute('inputmode') || 'numeric');
          }
          inp.setAttribute('inputmode', 'none');
        } else {
          const orig = inp.getAttribute('data-orig-inputmode') || 'numeric';
          inp.setAttribute('inputmode', orig);
        }
      });
    }
  }

  function setupChildNumpad() {
    const numpad = document.getElementById('child-numpad');
    const toggleBtn = document.getElementById('btn-toggle-child-numpad');
    const closeBtn = document.getElementById('btn-close-numpad');
    if (!numpad) return;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isShown = numpad.style.display !== 'none';
        setNumpadMode(!isShown);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        setNumpadMode(false);
      });
    }

    // Input-Fokus verfolgen
    document.addEventListener('focusin', (e) => {
      const target = e.target;
      if (target && target.tagName === 'INPUT' && (target.type === 'number' || target.inputMode === 'numeric' || target.classList.contains('task-input') || target.classList.contains('written-result-input') || target.classList.contains('written-carry-input') || target.classList.contains('pyramid-input'))) {
        lastFocusedInput = target;
      }
    });

    // Klicks auf Numpad-Tasten
    const keys = numpad.querySelectorAll('.numpad-btn, .numpad-btn-check');
    keys.forEach(key => {
      key.addEventListener('click', (e) => {
        e.preventDefault();
        const action = key.getAttribute('data-key');
        handleNumpadAction(action);
      });
    });
  }

  function updateNumpadVisibility(topicId) {
    const toggleBtn = document.getElementById('btn-toggle-child-numpad');
    const numpad = document.getElementById('child-numpad');
    
    // Prüfen, ob Aufgaben Eingabefelder haben
    const container = document.getElementById('exercise-container');
    const hasNumericInputs = container && container.querySelector('input') !== null;

    if (toggleBtn) {
      if (hasNumericInputs) {
        toggleBtn.style.display = 'inline-flex';
        if (numpad && numpad.style.display !== 'none') {
          setNumpadMode(true);
        }
      } else {
        toggleBtn.style.display = 'none';
        if (numpad) setNumpadMode(false);
      }
    }
  }

  function handleNumpadAction(action) {
    // Wenn kein Input fokussiert ist, den ersten sichtbaren Input der aktuellen Ansicht wählen
    if (!lastFocusedInput || !document.body.contains(lastFocusedInput)) {
      const container = document.getElementById('exercise-container');
      lastFocusedInput = container ? container.querySelector('input:not([disabled])') : null;
    }
    if (!lastFocusedInput) return;

    if (action === 'check') {
      const card = lastFocusedInput.closest('.task-card');
      if (card && card.id) {
        const parts = card.id.split('-');
        const idx = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(idx)) checkTask(idx);
      }
      return;
    }

    if (action === 'C') {
      lastFocusedInput.value = '';
      lastFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
      lastFocusedInput.focus();
      return;
    }

    if (action === 'backspace') {
      const cur = lastFocusedInput.value || '';
      lastFocusedInput.value = cur.slice(0, -1);
      lastFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
      lastFocusedInput.focus();
      return;
    }

    // Ziffer 0 - 9
    if (/^[0-9]$/.test(action)) {
      const isSingleDigit = lastFocusedInput.getAttribute('maxlength') === '1' || lastFocusedInput.classList.contains('written-result-input') || lastFocusedInput.classList.contains('written-carry-input');
      
      const selStart = lastFocusedInput.selectionStart;
      const selEnd = lastFocusedInput.selectionEnd;
      const hasSelection = selStart !== null && selEnd !== null && selStart !== selEnd;

      if (isSingleDigit || hasSelection) {
        lastFocusedInput.value = action;
      } else {
        lastFocusedInput.value = (lastFocusedInput.value || '') + action;
      }

      lastFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
      lastFocusedInput.focus();
    }
  }

  // --- FORTSCHRITT & STERNE-BELOHNUNG ---

  function updateProgress() {
    const total = currentTasks.length;
    if (total === 0) return;

    // Schrittpunkte (Dots) aktualisieren
    const stepsContainer = document.getElementById('exercise-steps-container');
    if (stepsContainer) {
      renderStepDots(stepsContainer);
    }

    let correctCount = 0;
    let percent = 0;

    if (currentTasks.length === 1 && currentTasks[0].type === 'memory') {
      const memTask = currentTasks[0];
      correctCount = memTask.matchedPairsCount;
      const memTotal = memTask.totalPairs;
      percent = Math.round((correctCount / memTotal) * 100);
      if (percent === 100 && currentTopicId) {
        Confetti.trigger();
        if (window.Schlaufuchs.Audio) window.Schlaufuchs.Audio.playFanfare();
        State.saveStarsForTopic(currentTopicId, 3);
      }
      return;
    }

    correctCount = currentTasks.filter(t => t.isCorrect === true).length;
    percent = Math.round((correctCount / total) * 100);

    // Sterne berechnen (1 Stern ab 50%, 2 ab 75%, 3 bei 100%)
    let starsEarned = 0;
    if (percent === 100) starsEarned = 3;
    else if (percent >= 75) starsEarned = 2;
    else if (percent >= 50) starsEarned = 1;

    if (starsEarned > 0 && currentTopicId) {
      State.saveStarsForTopic(currentTopicId, starsEarned);
    }
  }

  // DOMContentLoaded Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
