// =============================================================
// SCHLAUFUCHS – js/stickers.js
// Virtuelles Sticker-Album & Trophäen-Kabinett
// Pädagogisches Belohnungssystem nach AGENTS.md (Harte Regel 6):
// Jede beendete Serie oder gelöstes Arbeitsblatt schaltet ein sichtbares
// Sammelbild frei. Keine Zufallsverlosung, kein "Booster", kein Verlust.
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Stickers = (function () {
  'use strict';

  const ALL_STICKERS = [
    { id: 's1', name: 'Fuchs Felix', icon: '<img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width:36px;height:36px;">', desc: 'Der schlaue Waldfuchs', category: 'Tiere' },
    { id: 's2', name: 'Bär Balduin', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--deutsch-hell)" stroke="var(--linie)" stroke-width="2"/><text x="18" y="23" text-anchor="middle" font-size="13" font-family="var(--font-family)" font-weight="900" fill="var(--tinte)">BÄR</text></svg>', desc: 'Gemütlich und stark', category: 'Tiere' },
    { id: 's3', name: 'Eule Olivia', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--denken-hell)" stroke="var(--linie)" stroke-width="2"/><text x="18" y="23" text-anchor="middle" font-size="13" font-family="var(--font-family)" font-weight="900" fill="var(--tinte)">EULE</text></svg>', desc: 'Weise und aufmerksam', category: 'Tiere' },
    { id: 's4', name: 'Igel Ignaz', icon: '<img src="assets/icons/themen/general/igel.svg" class="icon-inline-svg" alt="" style="width:36px;height:36px;">', desc: 'Zusammenroll-König', category: 'Tiere' },
    { id: 's5', name: 'Hase Hopsi', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--papier)" stroke="var(--linie)" stroke-width="2"/><text x="18" y="23" text-anchor="middle" font-size="13" font-family="var(--font-family)" font-weight="900" fill="var(--tinte)">HASE</text></svg>', desc: 'Flink wie der Blitz', category: 'Tiere' },
    { id: 's6', name: 'Rakete Apollo', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--mathe-hell)" stroke="var(--linie)" stroke-width="2"/><polygon points="18,6 24,24 18,21 12,24" fill="var(--mathe)"/><circle cx="18" cy="14" r="2" fill="var(--flaeche)"/></svg>', desc: 'Auf zum Mond!', category: 'Weltall' },
    { id: 's7', name: 'Planet Saturn', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--mathe-hell)" stroke="var(--linie)" stroke-width="2"/><circle cx="18" cy="18" r="7" fill="var(--mathe)"/><ellipse cx="18" cy="18" rx="13" ry="3.5" fill="none" stroke="var(--linie)" stroke-width="1.5"/></svg>', desc: 'Mit goldenem Ring', category: 'Weltall' },
    { id: 's8', name: 'Sternschnuppe', icon: '<img src="assets/icons/stern.svg" class="icon-inline-svg" alt="" style="width:36px;height:36px;">', desc: 'Wünsch dir was!', category: 'Weltall' },
    { id: 's9', name: 'T-Rex Rexi', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--sach-hell)" stroke="var(--linie)" stroke-width="2"/><text x="18" y="23" text-anchor="middle" font-size="12" font-family="var(--font-family)" font-weight="900" fill="var(--sach)">DINO</text></svg>', desc: 'Der Urzeit-König', category: 'Dinos' },
    { id: 's10', name: 'Bronto Bruno', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--sach-hell)" stroke="var(--linie)" stroke-width="2"/><text x="18" y="23" text-anchor="middle" font-size="12" font-family="var(--font-family)" font-weight="900" fill="var(--sach)">BRUNO</text></svg>', desc: 'Sanfter Riese', category: 'Dinos' },
    { id: 's11', name: 'Feuervulkan', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--deutsch-hell)" stroke="var(--linie)" stroke-width="2"/><polygon points="18,10 27,27 9,27" fill="var(--deutsch)"/><circle cx="18" cy="10" r="3" fill="var(--richtig)"/></svg>', desc: 'Voller Energie', category: 'Dinos' },
    { id: 's12', name: 'Sonnenwiese', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--richtig-hell)" stroke="var(--linie)" stroke-width="2"/><circle cx="18" cy="18" r="6" fill="var(--richtig)"/></svg>', desc: 'Traumhafte Natur', category: 'Natur' },
    { id: 's13', name: 'Schultasche', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--papier)" stroke="var(--linie)" stroke-width="2"/><rect x="10" y="13" width="16" height="12" rx="2" fill="var(--mathe)"/><line x1="10" y1="17" x2="26" y2="17" stroke="var(--flaeche)" stroke-width="1.5"/></svg>', desc: 'Vollgepackt mit Wissen', category: 'Schule' },
    { id: 's14', name: 'Goldmedaille', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--richtig-hell)" stroke="var(--linie)" stroke-width="2"/><circle cx="18" cy="20" r="8" fill="var(--richtig)"/><text x="18" y="24" text-anchor="middle" font-size="10" font-weight="900" fill="var(--tinte)">1</text></svg>', desc: 'Beste Ausdauer', category: 'Schule' },
    { id: 's15', name: 'Schlaufuchs-Heft', icon: '<img src="assets/icons/buch.svg" class="icon-inline-svg" alt="" style="width:36px;height:36px;">', desc: 'Schlaue Ideen', category: 'Schule' },
    { id: 's16', name: 'Meister-Pokal', icon: '<svg viewBox="0 0 36 36" width="36" height="36" class="sticker-svg"><circle cx="18" cy="18" r="15" fill="var(--richtig-hell)" stroke="var(--linie)" stroke-width="2"/><path d="M12 11h12v6a6 6 0 0 1-12 0v-6z" fill="var(--richtig)" stroke="var(--linie)" stroke-width="1.5"/><line x1="18" y1="23" x2="18" y2="27" stroke="var(--linie)" stroke-width="2"/><line x1="13" y1="27" x2="23" y2="27" stroke="var(--linie)" stroke-width="2"/></svg>', desc: 'Volksschul-Champion', category: 'Schule' }
  ];

  const TROPHIES = [
    { id: 't_first', name: 'Erster Schritt', icon: '<img src="assets/icons/hakerl.svg" class="icon-inline-svg" alt="" style="width:28px;height:28px;">', desc: 'Die erste Aufgabe richtig gelöst', check: (p) => Object.values(p.stars || {}).some(s => s > 0) },
    { id: 't_math', name: 'Rechen-Profi', icon: '<img src="assets/icons/fach-mathe.svg" class="icon-inline-svg" alt="" style="width:28px;height:28px;">', desc: 'In 3 Mathe-Themen Sterne gesammelt', check: (p) => countTopicsWithPrefix(p, 'math') >= 3 },
    { id: 't_german', name: 'Wort-Detektiv', icon: '<img src="assets/icons/buch.svg" class="icon-inline-svg" alt="" style="width:28px;height:28px;">', desc: 'In 2 Deutsch-Themen geübt', check: (p) => countTopicsWithPrefix(p, 'german') >= 2 },
    { id: 't_traffic', name: 'Fahrrad-Meister', icon: '<img src="assets/icons/themen/general/fahrrad.svg" class="icon-inline-svg" alt="" style="width:28px;height:28px;">', desc: 'Radfahrprüfung gemeistert', check: (p) => Boolean(p.stars && ((p.stars['general-bike-test'] || 0) >= 2 || (p.stars['general-traffic'] || 0) >= 2)) },
    { id: 't_brain', name: 'Denk-Meister', icon: '<img src="assets/icons/themen/brain/muster.svg" class="icon-inline-svg" alt="" style="width:28px;height:28px;">', desc: 'Memory oder Musterreihe gemeistert', check: (p) => Boolean(p.stars && ((p.stars['brain-memory'] || 0) >= 2 || (p.stars['brain-pattern'] || 0) >= 2)) },
    { id: 't_star50', name: 'Sternen-Sammler', icon: '<img src="assets/icons/stern.svg" class="icon-inline-svg" alt="" style="width:28px;height:28px;">', desc: 'Mindestens 15 Sterne gesammelt', check: (p) => Object.values(p.stars || {}).reduce((a, b) => a + (b || 0), 0) >= 15 }
  ];

  function countTopicsWithPrefix(profile, prefix) {
    if (!profile || !profile.stars) return 0;
    return Object.keys(profile.stars).filter(k => k.startsWith(prefix) && profile.stars[k] > 0).length;
  }

  function getAvailablePacksCount() {
    const State = window.Schlaufuchs.State;
    if (!State) return 0;
    const profile = State.getActiveProfile();
    if (!profile) return 0;
    const unlocked = Array.isArray(profile.unlockedStickers) ? profile.unlockedStickers : ['s1'];
    return Math.max(0, ALL_STICKERS.length - unlocked.length);
  }

  function updateHeaderBadge() {
    const badge = document.getElementById('sticker-reward-badge') || document.getElementById('booster-count-badge');
    const btn = document.getElementById('btn-open-stickers');
    if (!badge) return;

    badge.style.display = 'none';
    if (btn) btn.classList.remove('has-packs');
  }

  function unlockNextSticker() {
    const State = window.Schlaufuchs.State;
    if (!State) return null;
    const profile = State.getActiveProfile();
    if (!profile) return null;

    if (!Array.isArray(profile.unlockedStickers)) {
      profile.unlockedStickers = ['s1'];
    }

    // Nächsten noch nicht freigeschalteten Sticker deterministisch in fester Reihenfolge freischalten (Regel 6)
    const nextSticker = ALL_STICKERS.find(s => !profile.unlockedStickers.includes(s.id));
    if (!nextSticker) {
      return { sticker: ALL_STICKERS[ALL_STICKERS.length - 1], isNew: false, allCompleted: true };
    }

    profile.unlockedStickers.push(nextSticker.id);

    // Profil im State sichern
    const all = State.loadAllProfiles();
    const idx = all.findIndex(p => p.id === profile.id);
    if (idx !== -1) {
      all[idx] = profile;
      State.saveAllProfiles(all);
      State.notify('stickers-changed', {
        profileId: profile.id,
        unlockedStickers: profile.unlockedStickers
      });
    }

    updateHeaderBadge();

    if (window.Schlaufuchs.Audio && typeof window.Schlaufuchs.Audio.playStickerReward === 'function') {
      window.Schlaufuchs.Audio.playStickerReward();
    }

    return { sticker: nextSticker, isNew: true };
  }

  function renderAlbumModal() {
    const modal = document.getElementById('stickers-modal');
    const grid = document.getElementById('stickers-album-grid');
    const trophiesGrid = document.getElementById('trophies-grid');

    if (!modal || !grid) return;

    const State = window.Schlaufuchs.State;
    const profile = State.getActiveProfile();
    const unlocked = Array.isArray(profile.unlockedStickers) ? profile.unlockedStickers : ['s1'];

    updateHeaderBadge();

    // Sticker-Gitter rendern (Ruhige Vitrine ohne Leistungsdruck und ohne Prozentangaben)
    const ownedCount = ALL_STICKERS.filter(s => unlocked.includes(s.id)).length;

    const statsEl = document.getElementById('stickers-collection-stats');
    if (statsEl) statsEl.textContent = `${ownedCount} von ${ALL_STICKERS.length} Sammelbildern im Album`;

    grid.innerHTML = '';
    ALL_STICKERS.forEach((s, idx) => {
      const isOwned = unlocked.includes(s.id);
      const card = document.createElement('div');
      card.className = `sticker-album-card ${isOwned ? 'owned' : 'locked'}`;
      const slotNum = String(idx + 1).padStart(2, '0');

      if (isOwned) {
        card.innerHTML = `
          <div class="sticker-card-inner">
            <div class="sticker-slot-badge owned">#${slotNum}</div>
            <div class="sticker-icon">${s.icon}</div>
            <div class="sticker-name">${s.name}</div>
            <div class="sticker-desc">„${s.desc}“</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="sticker-card-inner sticker-card-empty">
            <div class="sticker-slot-badge">#${slotNum}</div>
            <div class="sticker-silhouette-placeholder">
              <span class="sticker-silhouette-star">★</span>
            </div>
            <div class="sticker-category-tag">${s.category}</div>
          </div>
        `;
      }

      grid.appendChild(card);
    });

    // Trophäen-Gitter rendern (Vitrine)
    if (trophiesGrid) {
      trophiesGrid.innerHTML = '';
      TROPHIES.forEach(t => {
        const achieved = t.check(profile);
        const tCard = document.createElement('div');
        tCard.className = `trophy-badge ${achieved ? 'achieved' : 'locked'}`;
        tCard.innerHTML = `
          <div class="trophy-icon">${achieved ? t.icon : '-'}</div>
          <div class="trophy-details">
            <strong class="trophy-name">${t.name}</strong>
            <div class="trophy-desc">${t.desc}</div>
          </div>
          <div class="trophy-status-pill ${achieved ? 'achieved' : 'locked'}">
            ${achieved ? 'Erreicht ✓' : 'Offen'}
          </div>
        `;
        trophiesGrid.appendChild(tCard);
      });
    }

    modal.classList.add('active');
  }

  function showStickerCelebration(sticker, isNew) {
    const overlay = document.getElementById('booster-reveal-overlay') || document.getElementById('sticker-reveal-overlay');
    const Dialog = window.Schlaufuchs.Dialog;

    if (!overlay) {
      const msg = isNew
        ? `Juhuu! Du hast ein neues Sammelbild freigeschaltet:\n${sticker.name} (${sticker.desc})`
        : `Du hast betrachtet:\n${sticker.name} (${sticker.desc})`;
      if (Dialog) Dialog.alert(msg, { icon: 'stern', title: 'Sammelbild' });
      else alert(msg);
      return;
    }

    const titleText = isNew ? 'Neues Sammelbild freigeschaltet!' : 'Sammelbild aus deiner Sammlung:';
    const tagHtml = isNew
      ? '<span style="display:inline-block; background:var(--sach, #1B8A44); color:white; font-size:0.8rem; font-weight:800; padding:3px 10px; border-radius:var(--radius); margin-bottom:8px;">NEU IM ALBUM</span>'
      : '<span style="display:inline-block; background:var(--tinte-leise, #6f675e); color:white; font-size:0.8rem; font-weight:800; padding:3px 10px; border-radius:var(--radius); margin-bottom:8px;">Bereits in deiner Sammlung</span>';

    overlay.innerHTML = `
      <div class="booster-reveal-card sticker-reveal-card">
        <div style="font-size: 1.15rem; font-weight: 900; color: var(--mathe); margin-bottom: 8px;">${titleText}</div>
        ${tagHtml}
        <div class="booster-sticker-anim sticker-anim" style="font-size: 4.5rem; margin: 12px 0;">${sticker.icon}</div>
        <h3 style="font-size: 1.5rem; color: var(--tinte); margin-bottom: 4px;">${sticker.name}</h3>
        <p style="color: var(--tinte-leise); font-weight: 700; margin-bottom: 20px;">„${sticker.desc}“</p>
        <button id="btn-collect-sticker" class="btn btn-primary" style="padding: 12px 28px; font-size: 1.1rem; min-height: 48px;">
          In mein Album kleben ➔
        </button>
      </div>
    `;

    overlay.classList.add('active');

    if (window.Schlaufuchs.Confetti) {
      window.Schlaufuchs.Confetti.trigger();
    }

    const collectBtn = overlay.querySelector('#btn-collect-sticker');
    if (collectBtn) {
      collectBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
      });
    }
  }

  const VALID_SECRET_WORDS = [
    'FUCHS', 'SCHLAU', 'WALD', 'BIBER', 'IGEL', 'EULE', 'SONNE', 'BLUME',
    'WIESE', 'STERN', 'RAKETE', 'KOBEL', 'WINTER', 'SOMMER', 'HERBST',
    'SCHNEE', 'SCHULE', 'PAPIER', 'FREUNDE', 'SCHATZ', 'BÜCHER', 'WALDKAUZ',
    'FUCHSBAU', 'ZEBRA', 'TAUSEND', 'MEISTER', 'KÖNIG', 'HERZ'
  ];

  function redeemTreasureWord(inputWord) {
    if (!inputWord) return { success: false, msg: 'Bitte gib ein Geheimwort ein.' };
    const State = window.Schlaufuchs.State;
    if (!State) return { success: false, msg: 'System nicht bereit.' };
    const profile = State.getActiveProfile();
    if (!profile) return { success: false, msg: 'Kein Profil gefunden.' };

    const clean = inputWord.trim().toUpperCase().replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE');

    // Gültige Wörter prüfen
    const normalizedValid = VALID_SECRET_WORDS.map(w => w.replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE'));

    let dynamicWords = [];
    try {
      const Storage = window.Schlaufuchs.Storage;
      dynamicWords = (Storage ? Storage.lesen('valid_secret_words') : []) || [];
    } catch (e) {}
    const normalizedDynamic = dynamicWords.map(w => String(w).trim().toUpperCase().replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE'));

    const isValid = normalizedValid.includes(clean) || normalizedDynamic.includes(clean);
    if (!isValid) {
      return {
        success: false,
        msg: 'Dieses Geheimwort ist leider nicht bekannt. Prüfe die Buchstaben auf deinem Arbeitsblatt noch einmal!'
      };
    }

    profile.redeemedTreasureWords = profile.redeemedTreasureWords || [];
    if (profile.redeemedTreasureWords.includes(clean)) {
      return {
        success: false,
        msg: 'Du hast dieses Geheimwort bereits eingelöst! Löse ein neues Arbeitsblatt für den nächsten Schatz.'
      };
    }

    // Einlösen & Belohnen
    profile.redeemedTreasureWords.push(clean);
    const unlockRes = unlockNextSticker();

    // Profil sichern
    const allProfiles = State.loadAllProfiles();
    const idx = allProfiles.findIndex(p => p.id === profile.id);
    if (idx !== -1) {
      allProfiles[idx] = profile;
      State.saveAllProfiles(allProfiles);
    }

    // Audio & Konfetti
    if (window.Schlaufuchs.Confetti && typeof window.Schlaufuchs.Confetti.trigger === 'function') {
      window.Schlaufuchs.Confetti.trigger();
    }
    if (window.Schlaufuchs.Audio && typeof window.Schlaufuchs.Audio.playFanfare === 'function') {
      window.Schlaufuchs.Audio.playFanfare();
    }

    State.notify('stickers-changed');
    updateHeaderBadge();

    const stickerName = unlockRes && unlockRes.sticker ? unlockRes.sticker.name : 'Sammelbild';
    return {
      success: true,
      msg: `Fantastisch! Du hast das Geheimwort „${inputWord.trim().toUpperCase()}“ richtig gelöst und das Sammelbild „${stickerName}“ freigeschaltet!`
    };
  }

  function init() {
    const openBtn = document.getElementById('btn-open-stickers');
    const closeBtn = document.getElementById('btn-close-stickers-modal');
    const modal = document.getElementById('stickers-modal');
    const treasureForm = document.getElementById('treasure-code-form');
    const treasureInput = document.getElementById('input-treasure-code');
    const treasureFeedback = document.getElementById('treasure-feedback-msg');

    if (openBtn) {
      openBtn.addEventListener('click', renderAlbumModal);
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (treasureForm && treasureInput) {
      treasureForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = treasureInput.value.trim();
        const res = redeemTreasureWord(word);
        if (treasureFeedback) {
          treasureFeedback.style.display = 'block';
          treasureFeedback.className = res.success ? 'treasure-feedback-msg success' : 'treasure-feedback-msg error';
          treasureFeedback.textContent = res.msg;
        }
        if (res.success) {
          treasureInput.value = '';
          renderAlbumModal();
        }
      });
    }

    // Sofort Header-Badge initialisieren
    updateHeaderBadge();

    // Bei Stern- oder Profilwechsel Header-Badge und offenes Modal live synchronisieren
    if (window.Schlaufuchs.State) {
      window.Schlaufuchs.State.subscribe((event) => {
        if (event === 'stars-changed' || event === 'profile-changed' || event === 'profiles-updated' || event === 'stickers-changed') {
          updateHeaderBadge();
          if (modal && modal.classList.contains('active')) {
            renderAlbumModal();
          }
        }
      });
    }
  }

  return {
    init: init,
    updateHeaderBadge: updateHeaderBadge,
    renderAlbumModal: renderAlbumModal,
    unlockNextSticker: unlockNextSticker,
    openBoosterPack: unlockNextSticker, // Abwärtskompatibilität
    showBoosterCelebration: showStickerCelebration, // Abwärtskompatibilität
    showStickerCelebration: showStickerCelebration,
    getAvailablePacksCount: getAvailablePacksCount,
    redeemTreasureWord: redeemTreasureWord,
    ALL_STICKERS: ALL_STICKERS,
    TROPHIES: TROPHIES
  };
})();
