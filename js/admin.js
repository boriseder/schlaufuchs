// =============================================================
// SCHLAUFUCHS – js/admin.js
// Admin-Bereich mit Kindersicherung / Sicherheitsabfrage
// Konfiguration aktiver Schulstufen und Profilverwaltung
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Admin = (function () {
  'use strict';

  let gatePassed = false;
  let gateMode = 'math'; // 'pin' oder 'math'
  let gateAnswer = 0;
  let gateAttempts = 0;
  let cooldownUntil = 0;

  function init() {
    const adminBtn = document.getElementById('btn-admin-settings');
    const adminModal = document.getElementById('admin-modal');
    const closeBtn = document.getElementById('btn-close-admin');
    const closePanelBtn = document.getElementById('btn-close-admin-panel');
    const gateForm = document.getElementById('admin-gate-form');
    const gateInput = document.getElementById('admin-gate-input');
    const gateError = document.getElementById('admin-gate-error');
    const settingsPanel = document.getElementById('admin-settings-panel');
    const resetStarsBtn = document.getElementById('btn-reset-stars');
    const toggleModeBtn = document.getElementById('btn-gate-toggle-mode');

    if (!adminBtn || !adminModal) return;

    // Admin-Button Klick
    adminBtn.addEventListener('click', () => {
      openAdminModal();
    });

    // Schließen-Buttons Klick
    [closeBtn, closePanelBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          closeAdminModal();
        });
      }
    });

    // Modal-Hintergrund Klick
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });

    // Toggle-Modus Button (PIN <-> Rechenaufgabe)
    if (toggleModeBtn) {
      toggleModeBtn.addEventListener('click', () => {
        setGateMode(gateMode === 'pin' ? 'math' : 'pin');
      });
    }

    // Sicherheitsabfrage absenden
    if (gateForm) {
      gateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (cooldownUntil && now < cooldownUntil) {
          const waitSec = Math.ceil((cooldownUntil - now) / 1000);
          gateError.style.display = 'block';
          gateError.textContent = `Zu viele Fehlversuche. Bitte warte noch ${waitSec} Sekunden.`;
          return;
        }

        const entered = gateInput.value.trim();
        let isCorrect = false;

        if (gateMode === 'pin') {
          const State = window.Schlaufuchs.State;
          const storedPin = State && State.getParentPin ? State.getParentPin() : '';
          isCorrect = Boolean(storedPin) && entered === storedPin;
        } else {
          const parsed = parseInt(entered, 10);
          isCorrect = !isNaN(parsed) && parsed === gateAnswer;
        }

        if (isCorrect) {
          gatePassed = true;
          gateAttempts = 0;
          cooldownUntil = 0;
          gateError.style.display = 'none';
          gateForm.style.display = 'none';
          settingsPanel.style.display = 'block';
          populateSettings();
        } else {
          gateAttempts++;
          gateError.style.display = 'block';
          if (gateAttempts >= 3) {
            cooldownUntil = Date.now() + 5000;
            gateError.textContent = 'Falsche Eingabe. Bitte warte 5 Sekunden und versuche es erneut.';
          } else {
            gateError.textContent = 'Falsche Eingabe. Bitte versuche es erneut.';
          }
          if (gateMode === 'math') {
            generateGateMath();
          }
          gateInput.value = '';
          gateInput.focus();
        }
      });
    }

    // Sterne des aktiven Profils zurücksetzen
    if (resetStarsBtn) {
      resetStarsBtn.addEventListener('click', () => {
        const active = window.Schlaufuchs.State.getActiveProfile();
        const Dialog = window.Schlaufuchs.Dialog;
        const doReset = () => {
          window.Schlaufuchs.State.resetAllStarsForActiveProfile();
          if (Dialog) Dialog.alert('⭐ Sterne wurden zurückgesetzt.');
          else alert('⭐ Sterne wurden zurückgesetzt.');
        };

        if (Dialog) {
          Dialog.confirm(`Möchtest du wirklich alle gesammelten Sterne für "${active.name}" zurücksetzen?`, doReset);
        } else if (confirm(`Möchtest du wirklich alle gesammelten Sterne für "${active.name}" zurücksetzen?`)) {
          doReset();
        }
      });
    }

    setupBackupControls();
    setupPinControls();
    setupAdminTabs();
  }

  function setupBackupControls() {
    const exportBtn = document.getElementById('btn-export-backup');
    const importInput = document.getElementById('input-import-backup');

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const backupData = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          profiles: window.Schlaufuchs.State.loadAllProfiles(),
          settings: window.Schlaufuchs.State.loadSettings()
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schlaufuchs_lernstand_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          const Dialog = window.Schlaufuchs.Dialog;
          try {
            const data = JSON.parse(ev.target.result);
            if (data && data.profiles && Array.isArray(data.profiles)) {
              // Validierung und Sanitizing der importierten Profile
              const cleanProfiles = data.profiles
                .filter(p => p && typeof p === 'object' && !Array.isArray(p))
                .map(p => ({
                  id: String(p.id || ('profile_' + Date.now())),
                  name: String(p.name || 'Nils').trim().slice(0, 50),
                  avatar: String(p.avatar || '🦊').slice(0, 8),
                  grades: Array.isArray(p.grades) ? p.grades.map(Number).filter(g => g >= 1 && g <= 4) : [1, 2, 3],
                  stars: (p.stars && typeof p.stars === 'object') ? Object.fromEntries(
                    Object.entries(p.stars).map(([k, v]) => [String(k), Math.max(0, Math.min(3, Number(v) || 0))])
                  ) : {},
                  unlockedStickers: Array.isArray(p.unlockedStickers) ? p.unlockedStickers.map(String) : ['s1'],
                  openedPacks: Number(p.openedPacks) || 0,
                  created: Number(p.created) || Date.now()
                }));

              if (cleanProfiles.length === 0) {
                if (Dialog) Dialog.alert('Die Sicherungsdatei enthält keine gültigen Profile.');
                else alert('Die Sicherungsdatei enthält keine gültigen Profile.');
                return;
              }

              const doImport = () => {
                window.Schlaufuchs.State.saveAllProfiles(cleanProfiles);
                if (data.settings && typeof data.settings === 'object') {
                  window.Schlaufuchs.State.saveSettings(data.settings);
                }
                if (Dialog) {
                  Dialog.alert('✅ Sicherung erfolgreich wiederhergestellt!', {
                    onOk: () => location.reload()
                  });
                } else {
                  alert('✅ Sicherung erfolgreich wiederhergestellt!');
                  location.reload();
                }
              };

              const msg = `Möchtest du die Sicherung mit ${cleanProfiles.length} Kinder-Profilen wirklich einspielen? Bestehende Daten werden aktualisiert.`;
              if (Dialog) {
                Dialog.confirm(msg, doImport);
              } else if (confirm(msg)) {
                doImport();
              }
            } else {
              if (Dialog) Dialog.alert('Ungültiges Sicherungsformat.');
              else alert('Ungültiges Sicherungsformat.');
            }
          } catch (err) {
            if (Dialog) Dialog.alert('Fehler beim Lesen der Datei: ' + err.message);
            else alert('Fehler beim Lesen der Datei: ' + err.message);
          }
          importInput.value = '';
        };
        reader.readAsText(file);
      });
    }
  }

  function setupPinControls() {
    const pinInput = document.getElementById('input-parent-pin');
    const savePinBtn = document.getElementById('btn-save-parent-pin');
    const removePinBtn = document.getElementById('btn-remove-parent-pin');
    const pinStatus = document.getElementById('parent-pin-status');

    if (!pinInput || !savePinBtn) return;

    function updatePinUI() {
      const State = window.Schlaufuchs.State;
      const currentPin = State && State.getParentPin ? State.getParentPin() : '';
      if (currentPin) {
        pinInput.value = '';
        pinInput.placeholder = '••••';
        if (removePinBtn) removePinBtn.style.display = 'inline-block';
        if (pinStatus) {
          pinStatus.style.color = '#16a34a';
          pinStatus.textContent = 'Eltern-PIN ist aktiv. Der Zugang zu den Einstellungen ist mit deinem PIN geschützt.';
        }
      } else {
        pinInput.value = '';
        pinInput.placeholder = '4-stelliger PIN';
        if (removePinBtn) removePinBtn.style.display = 'none';
        if (pinStatus) {
          pinStatus.style.color = '#64748b';
          pinStatus.textContent = 'Kein PIN gesetzt (Absicherung erfolgt über eine Rechenaufgabe für Erwachsene).';
        }
      }
    }

    const cloneSave = savePinBtn.cloneNode(true);
    savePinBtn.parentNode.replaceChild(cloneSave, savePinBtn);

    cloneSave.addEventListener('click', () => {
      const Dialog = window.Schlaufuchs.Dialog;
      const val = pinInput.value.trim();
      if (!/^\d{4}$/.test(val)) {
        const msg = 'Bitte gib genau 4 Ziffern für den Eltern-PIN ein (z. B. 4829).';
        if (Dialog) Dialog.alert(msg);
        else alert(msg);
        return;
      }
      if (window.Schlaufuchs.State && window.Schlaufuchs.State.setParentPin) {
        window.Schlaufuchs.State.setParentPin(val);
      }
      const successMsg = 'Eltern-PIN wurde erfolgreich gespeichert!';
      if (Dialog) Dialog.alert(successMsg);
      else alert(successMsg);
      updatePinUI();
    });

    if (removePinBtn) {
      const cloneRemove = removePinBtn.cloneNode(true);
      removePinBtn.parentNode.replaceChild(cloneRemove, removePinBtn);

      cloneRemove.addEventListener('click', () => {
        const Dialog = window.Schlaufuchs.Dialog;
        const doRemove = () => {
          if (window.Schlaufuchs.State && window.Schlaufuchs.State.setParentPin) {
            window.Schlaufuchs.State.setParentPin('');
          }
          if (Dialog) Dialog.alert('Eltern-PIN wurde entfernt. Einstellungen sind über die Rechenaufgabe geschützt.');
          else alert('Eltern-PIN wurde entfernt.');
          updatePinUI();
        };

        if (Dialog) {
          Dialog.confirm('Möchtest du den Eltern-PIN wirklich entfernen? Der Zugang ist danach durch eine Rechenaufgabe geschützt.', doRemove);
        } else if (confirm('Möchtest du den Eltern-PIN wirklich entfernen?')) {
          doRemove();
        }
      });
    }

    updatePinUI();
  }

  function generateGateMath() {
    // Anspruchsvolle Kopfrechenaufgabe für Erwachsene (deutlich außerhalb des Volksschul-Kopfrechnens)
    // Variante 1: Zweistellige Zahl mal einstellig (24..49 · 6..9)
    // Variante 2: Punkt-vor-Strich mit Zehneraddition (16..29 · 6..8 + 35..75)
    const variant = Math.floor(Math.random() * 2) + 1;
    let questionText = '';

    if (variant === 1) {
      const a = Math.floor(Math.random() * 26) + 24; // 24..49
      const b = Math.floor(Math.random() * 4) + 6;   // 6..9
      gateAnswer = a * b;
      questionText = `Sicherheitsfrage für Erwachsene: Wie viel ist ${a} · ${b}?`;
    } else {
      const a = Math.floor(Math.random() * 14) + 16; // 16..29
      const b = Math.floor(Math.random() * 3) + 6;   // 6..8
      const c = Math.floor(Math.random() * 41) + 35; // 35..75
      gateAnswer = a * b + c;
      questionText = `Sicherheitsfrage für Erwachsene: Berechne ${a} · ${b} + ${c}`;
    }

    const questionEl = document.getElementById('admin-gate-question');
    if (questionEl) {
      questionEl.textContent = questionText;
    }
  }

  function setGateMode(mode) {
    gateMode = mode;
    const questionEl = document.getElementById('admin-gate-question');
    const gateInput = document.getElementById('admin-gate-input');
    const fallbackBox = document.getElementById('admin-gate-fallback');
    const toggleBtn = document.getElementById('btn-gate-toggle-mode');
    const hintEl = document.getElementById('admin-gate-hint');
    const gateError = document.getElementById('admin-gate-error');

    if (gateError) gateError.style.display = 'none';
    if (gateInput) gateInput.value = '';

    const State = window.Schlaufuchs.State;
    const hasPin = Boolean(State && State.getParentPin && State.getParentPin());

    if (mode === 'pin') {
      if (questionEl) {
        questionEl.textContent = 'Sicherheitsabfrage für Erwachsene: Bitte gib deinen 4-stelligen Eltern-PIN ein.';
      }
      if (gateInput) {
        gateInput.placeholder = '4-stelliger PIN';
        gateInput.type = 'password';
        gateInput.maxLength = 4;
      }
      if (fallbackBox) fallbackBox.style.display = 'block';
      if (toggleBtn) toggleBtn.textContent = 'PIN vergessen? Rechenaufgabe lösen';
      if (hintEl) hintEl.style.display = 'none';
    } else {
      generateGateMath();
      if (gateInput) {
        gateInput.placeholder = 'Ergebnis';
        gateInput.type = 'text';
        gateInput.removeAttribute('maxlength');
      }
      if (fallbackBox) {
        fallbackBox.style.display = hasPin ? 'block' : 'none';
      }
      if (toggleBtn) toggleBtn.textContent = 'Zurück zur PIN-Eingabe';
      if (hintEl) {
        hintEl.style.display = hasPin ? 'none' : 'block';
      }
    }
    setTimeout(() => { if (gateInput) gateInput.focus(); }, 50);
  }

  function openAdminModal() {
    const adminModal = document.getElementById('admin-modal');
    const gateForm = document.getElementById('admin-gate-form');
    const settingsPanel = document.getElementById('admin-settings-panel');
    const gateInput = document.getElementById('admin-gate-input');
    const gateError = document.getElementById('admin-gate-error');

    if (!adminModal) return;

    gatePassed = false;
    gateAttempts = 0;
    cooldownUntil = 0;
    if (gateError) gateError.style.display = 'none';
    if (gateInput) gateInput.value = '';
    if (gateForm) gateForm.style.display = 'block';
    if (settingsPanel) settingsPanel.style.display = 'none';

    const State = window.Schlaufuchs.State;
    const currentPin = State && State.getParentPin ? State.getParentPin() : '';
    if (currentPin && currentPin.length === 4) {
      setGateMode('pin');
    } else {
      setGateMode('math');
    }

    adminModal.classList.add('active');
    setTimeout(() => { if (gateInput) gateInput.focus(); }, 150);
  }

  function closeAdminModal() {
    const adminModal = document.getElementById('admin-modal');
    if (adminModal) adminModal.classList.remove('active');
  }

  function populateSettings() {
    // Profile, Diagnose, PIN & Druckeinstellungen anzeigen
    renderProfileManagement();
    renderDiagnosisDashboard();
    setupPinControls();
    setupPrintSettings();
  }

  function setupPrintSettings() {
    const solutionModeSelect = document.getElementById('admin-print-solution-mode');
    const secretWordCheck = document.getElementById('admin-print-secret-word');
    const State = window.Schlaufuchs.State;
    if (!solutionModeSelect || !secretWordCheck || !State) return;

    const printSettings = State.getPrintSettings ? State.getPrintSettings() : { solutionMode: 'knick', secretWord: true };
    solutionModeSelect.value = printSettings.solutionMode;
    secretWordCheck.checked = printSettings.secretWord;

    solutionModeSelect.addEventListener('change', () => {
      State.savePrintSettings({
        solutionMode: solutionModeSelect.value,
        secretWord: secretWordCheck.checked
      });
    });

    secretWordCheck.addEventListener('change', () => {
      State.savePrintSettings({
        solutionMode: solutionModeSelect.value,
        secretWord: secretWordCheck.checked
      });
    });
  }

  function setupAdminTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetTab);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    const adminCertBtn = document.getElementById('btn-admin-print-cert');
    if (adminCertBtn) {
      adminCertBtn.addEventListener('click', () => {
        const profile = window.Schlaufuchs.State.getActiveProfile();
        if (window.Schlaufuchs.Print && window.Schlaufuchs.Print.printCertificate) {
          window.Schlaufuchs.Print.printCertificate(profile);
        }
      });
    }
  }

  function renderDiagnosisDashboard() {
    const container = document.getElementById('admin-diagnosis-container');
    if (!container) return;

    const profile = window.Schlaufuchs.State.getActiveProfile();
    const stars = profile.stars || {};

    const SUBJECTS = [
      {
        title: '🔵 Mathematik',
        color: 'var(--mathe, #2563eb)',
        topics: [
          { id: 'math-twenty', name: 'Zwanzigerfeld (1. Klasse)' },
          { id: 'math-addition', name: 'Addition (+)' },
          { id: 'math-subtraction', name: 'Subtraktion (−)' },
          { id: 'math-multiplication', name: 'Multiplikation (·)' },
          { id: 'math-division', name: 'Division (:)' },
          { id: 'math-pyramid', name: 'Rechentürme & Zahlenmauern' },
          { id: 'math-clock', name: 'Uhrzeit & Zeiger (analog & digital)' },
          { id: 'math-money', name: 'Geld & Euro (Münzen & Scheine)' },
          { id: 'math-written', name: 'Schriftliche Rechenverfahren (H Z E)' },
          { id: 'math-million', name: 'Zahlenraum 1 000 000' },
          { id: 'math-units', name: 'Maße & Gewichte (dag, kg)' },
          { id: 'math-geometry', name: 'Geometrie (Umfang & Fläche)' },
          { id: 'math-stories', name: 'Rechengeschichten (Textaufgaben)' }
        ]
      },
      {
        title: '🔴 Deutsch',
        color: 'var(--deutsch, #e11d48)',
        topics: [
          { id: 'german-syllables', name: 'Silbenschwingen & Silbenkönige' },
          { id: 'german-word-types', name: 'Wortarten (Nomen, Verben, Adjektive)' },
          { id: 'german-capitalization', name: 'Groß & Klein (Namenwörter)' },
          { id: 'german-scramble', name: 'Schüttelsätze' },
          { id: 'german-cases', name: 'Die 4 Fälle des Nomens' },
          { id: 'german-tenses', name: 'Zeitformen (Mitvergangenheit...)' },
          { id: 'german-reading', name: 'Leseverständnis (PIRLS-Sachtexte)' }
        ]
      },
      {
        title: '🟢 Sachunterricht',
        color: 'var(--sachunterricht, #16a34a)',
        topics: [
          { id: 'general-calendar', name: 'Jahreskreis & Kalender' },
          { id: 'general-traffic', name: 'Sicherer Schulweg & Verkehr' },
          { id: 'general-animals', name: 'Tiere im Winter' },
          { id: 'general-austria', name: 'Österreich: Bundesländer & Hauptstädte' },
          { id: 'general-bike-test', name: 'Freiwillige Radfahrprüfung (StVO)' }
        ]
      },
      {
        title: '🟣 Gehirntraining',
        color: 'var(--denken, #6B4C9A)',
        topics: [
          { id: 'brain-memory', name: 'Tier- & Bilder-Memory' },
          { id: 'brain-pattern', name: 'Muster-Meister (Logik-Reihen)' },
          { id: 'brain-sequence', name: 'Zahlen-Reihenfolge' }
        ]
      }
    ];

    let secureCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;

    let subjectsHtml = '';
    SUBJECTS.forEach(subj => {
      let topicRows = '';
      subj.topics.forEach(t => {
        const s = stars[t.id] || 0;
        let badge = '';
        if (s === 3) {
          badge = '<span class="admin-diag-pill secure">🟢 Sicher (3★)</span>';
          secureCount++;
        } else if (s > 0) {
          badge = `<span class="admin-diag-pill progress">🟡 Im Aufbau (${s}★)</span>`;
          inProgressCount++;
        } else {
          badge = '<span class="admin-diag-pill open">⚪ Offen</span>';
          notStartedCount++;
        }

        topicRows += `
          <div class="admin-diag-row">
            <span class="admin-diag-topic-name">${t.name}</span>
            <div>${badge}</div>
          </div>
        `;
      });

      subjectsHtml += `
        <details class="admin-diag-subject-group" open>
          <summary class="admin-diag-subject-title" style="color: ${subj.color};">
            <span>${subj.title}</span>
          </summary>
          <div class="admin-diag-subject-rows">${topicRows}</div>
        </details>
      `;
    });

    container.innerHTML = `
      <div class="admin-diag-kpi-bar">
        <div class="admin-diag-kpi secure">
          <div class="admin-diag-kpi-val">${secureCount}</div>
          <div class="admin-diag-kpi-lbl">Sicher beherrscht (3★)</div>
        </div>
        <div class="admin-diag-kpi progress">
          <div class="admin-diag-kpi-val">${inProgressCount}</div>
          <div class="admin-diag-kpi-lbl">Im Aufbau (1–2★)</div>
        </div>
        <div class="admin-diag-kpi open">
          <div class="admin-diag-kpi-val">${notStartedCount}</div>
          <div class="admin-diag-kpi-lbl">Noch offen</div>
        </div>
      </div>
      <div class="admin-diag-subjects-container">
        ${subjectsHtml}
      </div>
    `;
  }

  function renderProfileManagement() {
    const container = document.getElementById('admin-profiles-list');
    if (!container) return;

    const profiles = window.Schlaufuchs.State.loadAllProfiles();
    const activeId = window.Schlaufuchs.State.getActiveProfile().id;

    container.innerHTML = '';
    profiles.forEach(p => {
      const card = document.createElement('div');
      const isActive = p.id === activeId;
      card.className = `admin-profile-card ${isActive ? 'is-active' : ''}`;

      const totalStars = Object.values(p.stars || {}).reduce((a, b) => a + b, 0);
      const gradesList = (p.grades && p.grades.length > 0) ? p.grades : [1, 2, 3, 4];

      const esc = (window.Schlaufuchs && window.Schlaufuchs.escapeHtml) || (s => s);
      const safeName = esc(p.name);
      const safeAvatar = esc(p.avatar);

      card.innerHTML = `
        <div class="admin-profile-header-row">
          <div class="admin-profile-identity">
            <span class="admin-profile-avatar">${safeAvatar}</span>
            <div>
              <div class="admin-profile-title-wrap">
                <strong class="admin-profile-name">${safeName}</strong>
                ${isActive ? '<span class="admin-badge-active">Aktiv</span>' : ''}
              </div>
              <div class="admin-profile-stars">⭐ ${totalStars} Sterne gesammelt</div>
            </div>
          </div>
          <div class="admin-profile-actions">
            ${!isActive ? `<button class="btn btn-secondary btn-sm select-prof-btn" data-pid="${p.id}">Als aktives Kind wählen</button>` : ''}
            ${profiles.length > 1 ? `<button class="btn btn-danger btn-sm del-prof-btn" data-pid="${p.id}">Löschen</button>` : ''}
          </div>
        </div>

        <div class="admin-profile-grades-row">
          <span class="admin-profile-grades-label">Schulstufen für ${safeName}:</span>
          <div class="admin-profile-grades-chips">
            ${[1, 2, 3, 4].map(g => {
              const isChecked = gradesList.includes(g);
              return `
                <button type="button" class="admin-grade-chip ${isChecked ? 'active' : ''}" data-pid="${p.id}" data-grade="${g}">
                  <span>${isChecked ? '✓' : '+'}</span>
                  <span>${g}. Klasse</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // Profile umschalten
      const selBtn = card.querySelector('.select-prof-btn');
      if (selBtn) {
        selBtn.addEventListener('click', () => {
          window.Schlaufuchs.State.switchProfile(p.id);
          populateSettings();
        });
      }

      // Profile löschen
      const delBtn = card.querySelector('.del-prof-btn');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          const Dialog = window.Schlaufuchs.Dialog;
          const doDelete = () => {
            window.Schlaufuchs.State.deleteProfile(p.id);
            populateSettings();
          };

          if (Dialog) {
            Dialog.confirm(`Kind-Profil "${p.name}" wirklich löschen?`, doDelete);
          } else if (confirm(`Kind-Profil "${p.name}" wirklich löschen?`)) {
            doDelete();
          }
        });
      }

      // Grade Toggle Buttons
      const gradeBtns = card.querySelectorAll('.admin-grade-chip');
      gradeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetG = parseInt(btn.getAttribute('data-grade'), 10);
          let currentGrades = (p.grades && p.grades.length > 0) ? [...p.grades] : [1, 2, 3, 4];
          if (currentGrades.includes(targetG)) {
            if (currentGrades.length === 1) {
              const Dialog = window.Schlaufuchs.Dialog;
              const msg = `Mindestens eine Schulstufe muss für ${p.name} freigeschaltet bleiben!`;
              if (Dialog) Dialog.alert(msg);
              else alert(msg);
              return;
            }
            currentGrades = currentGrades.filter(x => x !== targetG);
          } else {
            currentGrades.push(targetG);
            currentGrades.sort((a, b) => a - b);
          }
          window.Schlaufuchs.State.setGradesForProfile(p.id, currentGrades);
          populateSettings();
        });
      });

      container.appendChild(card);
    });

    // Neues Profil anlegen
    const newNameInput = document.getElementById('new-profile-name');
    const addProfBtn = document.getElementById('btn-add-profile');
    if (addProfBtn && newNameInput) {
      const cloneBtn = addProfBtn.cloneNode(true);
      addProfBtn.parentNode.replaceChild(cloneBtn, addProfBtn);

      cloneBtn.addEventListener('click', () => {
        const name = newNameInput.value.trim();
        if (!name) {
          const Dialog = window.Schlaufuchs.Dialog;
          if (Dialog) Dialog.alert('Bitte gib einen Namen für das Kind ein.');
          else alert('Bitte gib einen Namen für das Kind ein.');
          return;
        }
        window.Schlaufuchs.State.createProfile(name);
        newNameInput.value = '';
        populateSettings();
      });
    }
  }

  return {
    init: init,
    openAdminModal: openAdminModal,
    isGatePassed: function () {
      return gatePassed;
    }
  };
})();
