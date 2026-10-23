// =============================================================
// SCHLAUFUCHS – js/stickers.js
// Virtuelles Sticker-Album & Trophäen-Kabinett
// Belohnungssystem: 1 Starter-Päckchen + je 5 gesammelte Sterne 1 weiteres Päckchen
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Stickers = (function () {
  'use strict';

  const STARS_PER_PACK = 5;

  const ALL_STICKERS = [
    { id: 's1', name: 'Fuchs Felix', icon: '🦊', desc: 'Der schlaue Waldfuchs', category: 'Tiere' },
    { id: 's2', name: 'Bär Balduin', icon: '🐻', desc: 'Gemütlich und stark', category: 'Tiere' },
    { id: 's3', name: 'Eule Olivia', icon: '🦉', desc: 'Weise und aufmerksam', category: 'Tiere' },
    { id: 's4', name: 'Igel Ignaz', icon: '🦔', desc: 'Zusammenroll-König', category: 'Tiere' },
    { id: 's5', name: 'Hase Hopsi', icon: '🐰', desc: 'Flink wie der Blitz', category: 'Tiere' },
    { id: 's6', name: 'Rakete Apollo', icon: '🚀', desc: 'Auf zum Mond!', category: 'Weltall' },
    { id: 's7', name: 'Planet Saturn', icon: '🪐', desc: 'Mit goldenem Ring', category: 'Weltall' },
    { id: 's8', name: 'Sternschnuppe', icon: '⭐', desc: 'Wünsch dir was!', category: 'Weltall' },
    { id: 's9', name: 'T-Rex Rexi', icon: '🦖', desc: 'Der Urzeit-König', category: 'Dinos' },
    { id: 's10', name: 'Bronto Bruno', icon: '🦕', desc: 'Sanfter Riese', category: 'Dinos' },
    { id: 's11', name: 'Feuervulkan', icon: '🌋', desc: 'Voller Energie', category: 'Dinos' },
    { id: 's12', name: 'Sonnenpalme', icon: '🌴', desc: 'Traumhafte Ferien', category: 'Natur' },
    { id: 's13', name: 'Schultasche', icon: '🎒', desc: 'Vollgepackt mit Wissen', category: 'Schule' },
    { id: 's14', name: 'Goldmedaille', icon: '🥇', desc: 'Beste Leistung', category: 'Schule' },
    { id: 's15', name: 'Zauberhut', icon: '🎩', desc: 'Magische Ideen', category: 'Magie' },
    { id: 's16', name: 'Meister-Pokal', icon: '🏆', desc: 'Volksschul-Champion', category: 'Schule' }
  ];

  const TROPHIES = [
    { id: 't_first', name: 'Erster Schritt', icon: '🌟', desc: 'Die erste Aufgabe richtig gelöst', check: (p) => Object.values(p.stars || {}).some(s => s > 0) },
    { id: 't_math', name: 'Rechen-Profi', icon: '🧮', desc: 'In 3 Mathe-Themen Sterne gesammelt', check: (p) => countTopicsWithPrefix(p, 'math') >= 3 },
    { id: 't_german', name: 'Wort-Detektiv', icon: '📖', desc: 'In 2 Deutsch-Themen geübt', check: (p) => countTopicsWithPrefix(p, 'german') >= 2 },
    { id: 't_traffic', name: 'Fahrrad-Meister', icon: '🚲', desc: 'Radfahrprüfung gemeistert', check: (p) => Boolean(p.stars && ((p.stars['general-bike-test'] || 0) >= 2 || (p.stars['general-traffic'] || 0) >= 2)) },
    { id: 't_brain', name: 'Superhirn', icon: '🧠', desc: 'Memory oder Musterreihe gemeistert', check: (p) => Boolean(p.stars && ((p.stars['brain-memory'] || 0) >= 2 || (p.stars['brain-pattern'] || 0) >= 2)) },
    { id: 't_star50', name: 'Sterne-König', icon: '👑', desc: 'Mindestens 15 Sterne gesammelt', check: (p) => Object.values(p.stars || {}).reduce((a, b) => a + (b || 0), 0) >= 15 }
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
    const totalStars = Object.values(profile.stars || {}).reduce((a, b) => a + (b || 0), 0);
    const opened = profile.openedPacks || 0;
    const bonus = profile.bonusTreasurePacks || 0;
    // 1 Starter-Päckchen zum Start + je 5 gesammelte Sterne ein weiteres Päckchen + Bonus aus Offline-Schatzkiste
    const earnedPacks = 1 + Math.floor(totalStars / STARS_PER_PACK) + bonus;
    return Math.max(0, earnedPacks - opened);
  }

  function updateHeaderBadge() {
    const badge = document.getElementById('booster-count-badge');
    const btn = document.getElementById('btn-open-stickers');
    if (!badge) return;

    const available = getAvailablePacksCount();
    badge.textContent = available;

    if (available > 0) {
      badge.style.display = 'inline-block';
      if (btn) btn.classList.add('has-packs');
    } else {
      badge.style.display = 'none';
      if (btn) btn.classList.remove('has-packs');
    }
  }

  function openBoosterPack() {
    const State = window.Schlaufuchs.State;
    const profile = State.getActiveProfile();
    const available = getAvailablePacksCount();

    if (available <= 0) {
      const Dialog = window.Schlaufuchs.Dialog;
      const totalStars = Object.values(profile.stars || {}).reduce((a, b) => a + (b || 0), 0);
      const nextThreshold = (profile.openedPacks || 0) * STARS_PER_PACK;
      const needed = Math.max(1, nextThreshold - totalStars);
      const msg = `Sammle noch ${needed} weitere(n) Stern(e) ⭐, um dein nächstes Sticker-Päckchen freizuschalten! (Aktuell: ${totalStars} ⭐)`;
      if (Dialog) Dialog.alert(msg, { icon: '⭐', title: 'Sticker-Päckchen' });
      else alert(msg);
      return null;
    }

    if (!Array.isArray(profile.unlockedStickers)) {
      profile.unlockedStickers = ['s1'];
    }
    profile.openedPacks = (profile.openedPacks || 0) + 1;

    // Noch nicht freigeschaltete Sticker ermitteln
    const remaining = ALL_STICKERS.filter(s => !profile.unlockedStickers.includes(s.id));
    let chosenSticker = null;
    let isNew = false;

    if (remaining.length > 0) {
      chosenSticker = remaining[Math.floor(Math.random() * remaining.length)];
      profile.unlockedStickers.push(chosenSticker.id);
      isNew = true;
    } else {
      // Alle 16 bereits freigeschaltet -> zufälligen Sticker ziehen
      chosenSticker = ALL_STICKERS[Math.floor(Math.random() * ALL_STICKERS.length)];
      isNew = false;
    }

    // Profil im State sichern
    const all = State.loadAllProfiles();
    const idx = all.findIndex(p => p.id === profile.id);
    if (idx !== -1) {
      all[idx] = profile;
      State.saveAllProfiles(all);
      State.notify('stickers-changed', {
        profileId: profile.id,
        unlockedStickers: profile.unlockedStickers,
        openedPacks: profile.openedPacks
      });
    }

    updateHeaderBadge();

    // Audio abspielen
    if (window.Schlaufuchs.Audio) {
      window.Schlaufuchs.Audio.playBoosterOpen();
    }

    return { sticker: chosenSticker, isNew: isNew };
  }

  function renderAlbumModal() {
    const modal = document.getElementById('stickers-modal');
    const grid = document.getElementById('stickers-album-grid');
    const trophiesGrid = document.getElementById('trophies-grid');
    const boosterBtn = document.getElementById('btn-open-booster');
    const boosterInfoP = document.querySelector('.stickers-booster-banner .booster-info p');
    const boosterInfoH4 = document.querySelector('.stickers-booster-banner .booster-info h4');

    if (!modal || !grid) return;

    const State = window.Schlaufuchs.State;
    const profile = State.getActiveProfile();
    const unlocked = Array.isArray(profile.unlockedStickers) ? profile.unlockedStickers : ['s1'];
    const availablePacks = getAvailablePacksCount();
    const totalStars = Object.values(profile.stars || {}).reduce((a, b) => a + (b || 0), 0);

    // Booster-Banner & Button aktualisieren
    if (boosterBtn) {
      if (availablePacks > 0) {
        boosterBtn.classList.add('has-packs');
        boosterBtn.disabled = false;
        boosterBtn.innerHTML = `<span>🎁</span> <span>Päckchen öffnen (${availablePacks} bereit)</span>`;
        if (boosterInfoH4) boosterInfoH4.textContent = '🎁 Sammelpäckchen bereit!';
        if (boosterInfoP) {
          boosterInfoP.innerHTML = `Du hast <strong>${availablePacks}</strong> ungeöffnete(s) Päckchen! Tippe auf den Knopf, um Sticker zu sammeln.`;
        }
      } else {
        boosterBtn.classList.remove('has-packs');
        boosterBtn.disabled = false;
        const nextThreshold = (profile.openedPacks || 0) * STARS_PER_PACK;
        const needed = Math.max(1, nextThreshold - totalStars);
        boosterBtn.innerHTML = `<span>🎁</span> <span>Noch ${needed} ⭐ nötig</span>`;
        if (boosterInfoH4) boosterInfoH4.textContent = '🎁 Sammelpäckchen';
        if (boosterInfoP) {
          boosterInfoP.innerHTML = `Noch <strong>${needed} ⭐</strong> bis zu deinem nächsten Sticker-Päckchen! (Aktuell: <strong>${totalStars} ⭐</strong>)`;
        }
      }
    }

    updateHeaderBadge();

    // Sticker-Gitter rendern (Panini-Sammelalbum-Prinzip)
    const ownedCount = ALL_STICKERS.filter(s => unlocked.includes(s.id)).length;
    const percent = Math.round((ownedCount / ALL_STICKERS.length) * 100);

    const statsEl = document.getElementById('stickers-collection-stats');
    const fillEl = document.getElementById('stickers-progress-bar-fill');
    if (statsEl) statsEl.textContent = `${ownedCount} von ${ALL_STICKERS.length} eingeklebt (${percent}%)`;
    if (fillEl) fillEl.style.width = `${percent}%`;

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
          <div class="trophy-icon">${achieved ? t.icon : '🔒'}</div>
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

  function showBoosterCelebration(sticker, isNew) {
    const overlay = document.getElementById('booster-reveal-overlay');
    const Dialog = window.Schlaufuchs.Dialog;

    if (!overlay) {
      const msg = isNew
        ? `🎉 Juhuu! Du hast einen neuen Sticker gezogen:\n${sticker.icon} ${sticker.name} (${sticker.desc})`
        : `⭐ Du hast gezogen:\n${sticker.icon} ${sticker.name} (${sticker.desc}) – Diesen Sticker hast du schon im Album!`;
      if (Dialog) Dialog.alert(msg, { icon: '🎉', title: 'Sticker-Päckchen' });
      else alert(msg);
      return;
    }

    const titleText = isNew ? '🎁 Neues Sammelbild freigeschaltet!' : '⭐ Sticker-Päckchen geöffnet!';
    const tagHtml = isNew
      ? '<span style="display:inline-block; background:#22c55e; color:white; font-size:0.8rem; font-weight:800; padding:3px 10px; border-radius:999px; margin-bottom:8px;">🌟 NEU IM ALBUM 🌟</span>'
      : '<span style="display:inline-block; background:#64748b; color:white; font-size:0.8rem; font-weight:800; padding:3px 10px; border-radius:999px; margin-bottom:8px;">Bereits in deiner Sammlung</span>';

    overlay.innerHTML = `
      <div class="booster-reveal-card">
        <div style="font-size: 1.15rem; font-weight: 900; color: #1e3a8a; margin-bottom: 8px;">${titleText}</div>
        ${tagHtml}
        <div class="booster-sticker-anim" style="font-size: 4.5rem; margin: 12px 0;">${sticker.icon}</div>
        <h3 style="font-size: 1.5rem; color: #1e293b; margin-bottom: 4px;">${sticker.name}</h3>
        <p style="color: #64748b; font-weight: 700; margin-bottom: 20px;">„${sticker.desc}“</p>
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
    profile.bonusTreasurePacks = (profile.bonusTreasurePacks || 0) + 1;

    // Profil sichern
    const allProfiles = State.loadAllProfiles();
    const idx = allProfiles.findIndex(p => p.id === profile.id);
    if (idx !== -1) {
      allProfiles[idx] = profile;
      State.saveAllProfiles(allProfiles);
    }

    // Audio & Konfetti
    if (window.Schlaufuchs.Confetti) window.Schlaufuchs.Confetti.trigger();
    if (window.Schlaufuchs.Audio) window.Schlaufuchs.Audio.playFanfare();

    State.notify('stickers-changed');
    updateHeaderBadge();

    return {
      success: true,
      msg: `🎉 Fantastisch! Du hast das Geheimwort „${inputWord.trim().toUpperCase()}“ richtig gelöst! Als Belohnung für deinen Fleiß hast du 1 neues Sammelpäckchen erhalten!`
    };
  }

  function init() {
    const openBtn = document.getElementById('btn-open-stickers');
    const closeBtn = document.getElementById('btn-close-stickers-modal');
    const boosterBtn = document.getElementById('btn-open-booster');
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

    if (boosterBtn) {
      boosterBtn.addEventListener('click', () => {
        const result = openBoosterPack();
        if (result && result.sticker) {
          showBoosterCelebration(result.sticker, result.isNew);
          renderAlbumModal();
        }
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
    openBoosterPack: openBoosterPack,
    getAvailablePacksCount: getAvailablePacksCount,
    ALL_STICKERS: ALL_STICKERS,
    TROPHIES: TROPHIES
  };
})();
