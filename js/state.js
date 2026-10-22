// =============================================================
// SCHLAUFUCHS – js/state.js
// Status- und Datenverwaltung: User-Profile, Sterne-Persistenz,
// Admin-Schulstufen-Einstellungen (localStorage)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.State = (function () {
  'use strict';

  const STORAGE_KEYS = {
    PROFILES: 'schlaufuchs_profiles_v2',
    ACTIVE_PROFILE: 'schlaufuchs_active_profile_id',
    SETTINGS: 'schlaufuchs_settings_v2'
  };

  const AVATARS = ['🦊', '🐰', '🐻', '🦔', '🦉', '🦁', '🐼', '🐨', '🦄', '🐯'];

  // Standard-Einstellungen
  const DEFAULT_SETTINGS = {
    activeGrades: [1, 2, 3], // standardmäßig 1., 2. und 3. Schulstufe aktiv
    soundEffects: true,
    parentPin: '', // leer = kein PIN gesetzt, stattdessen anspruchsvolle Rechenaufgabe
    printSolutionMode: 'knick', // 'knick' (1 Blatt mit Faltstreifen) | 'two-page' (2 Blätter) | 'none'
    printSecretWord: true // Schlaufuchs-Geheimwort & Rätselmechanik für Schatzkiste
  };

  // Standard-Profil
  const DEFAULT_PROFILE = {
    id: 'profile_default',
    name: 'Nils',
    avatar: '🦊',
    grades: [1, 2, 3], // Am Kind hängende freigeschaltete Schulstufen (1., 2., 3. Klasse)
    stars: {}, // topicId -> number (0..3)
    unlockedStickers: ['s1'], // Fuchs Felix als Starter-Sticker im Album
    openedPacks: 0,
    created: Date.now()
  };

  let listeners = [];

  function subscribe(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function notify(event, data) {
    listeners.forEach(fn => {
      try { fn(event, data); } catch (e) { console.error('Listener error:', e); }
    });
  }

  // --- EINSTELLUNGEN ---

  function loadSettings() {
    try {
      const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
      const parsed = Storage ? Storage.lesen('settings') : null;
      if (parsed) {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Fehler beim Laden der Einstellungen:', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  function saveSettings(newSettings) {
    try {
      const current = loadSettings();
      const updated = { ...current, ...newSettings };
      const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
      if (Storage) Storage.schreiben('settings', updated);
      notify('settings-changed', updated);
      return updated;
    } catch (e) {
      console.error('Fehler beim Speichern der Einstellungen:', e);
      return loadSettings();
    }
  }

  function isGradeActive(gradeNum) {
    return getActiveGrades().includes(Number(gradeNum));
  }

  function getParentPin() {
    return loadSettings().parentPin || '';
  }

  function setParentPin(pin) {
    const clean = (typeof pin === 'string' ? pin : String(pin || '')).trim();
    saveSettings({ parentPin: clean });
    return clean;
  }

  function getPrintSettings() {
    const s = loadSettings();
    return {
      solutionMode: s.printSolutionMode || 'knick',
      secretWord: s.printSecretWord !== false
    };
  }

  function savePrintSettings(printSettings) {
    const current = loadSettings();
    const updated = {
      ...current,
      printSolutionMode: printSettings.solutionMode || current.printSolutionMode || 'knick',
      printSecretWord: printSettings.secretWord !== false
    };
    return saveSettings(updated);
  }

  // --- USER-PROFILE & SCHULSTUFEN AM KIND ---

  function loadAllProfiles() {
    try {
      const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
      const list = Storage ? Storage.lesen('profiles') : null;
      if (Array.isArray(list) && list.length > 0) {
        // Sicherstellen, dass jedes Profil Schulstufen und Sticker-Felder besitzt
        let modified = false;
        list.forEach(p => {
          if (p.id === 'profile_default' && p.name === 'Schlaufuchs') {
            p.name = 'Nils';
            p.grades = [1, 2, 3];
            modified = true;
          }
          if (!p.grades || !Array.isArray(p.grades) || p.grades.length === 0) {
            p.grades = [1, 2, 3];
            modified = true;
          }
          if (!Array.isArray(p.unlockedStickers)) {
            p.unlockedStickers = ['s1'];
            modified = true;
          }
          if (typeof p.openedPacks !== 'number') {
            p.openedPacks = 0;
            modified = true;
          }
        });
        if (modified) saveAllProfiles(list);
        return list;
      }
    } catch (e) {
      console.warn('Fehler beim Laden der Profile:', e);
    }
    // Fallback: Default-Profil anlegen und speichern
    const initialList = [{ ...DEFAULT_PROFILE }];
    saveAllProfiles(initialList);
    return initialList;
  }

  function saveAllProfiles(profilesList) {
    try {
      const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
      if (Storage) Storage.schreiben('profiles', profilesList);
    } catch (e) {
      console.error('Fehler beim Speichern der Profile:', e);
    }
  }

  function getActiveProfileId() {
    const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
    return (Storage ? Storage.lesen('active_profile') : null) || DEFAULT_PROFILE.id;
  }

  function getActiveProfile() {
    const profiles = loadAllProfiles();
    const activeId = getActiveProfileId();
    const found = profiles.find(p => p.id === activeId);
    if (found) return found;
    // Wenn nicht gefunden, nimm das erste
    const fallback = profiles[0] || DEFAULT_PROFILE;
    const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
    if (Storage) Storage.schreiben('active_profile', fallback.id);
    return fallback;
  }

  function getActiveGrades() {
    const profile = getActiveProfile();
    if (profile && Array.isArray(profile.grades) && profile.grades.length > 0) {
      return profile.grades;
    }
    return [1, 2, 3];
  }

  function getGradesForProfile(profileId) {
    const profiles = loadAllProfiles();
    const p = profiles.find(item => item.id === profileId);
    return (p && Array.isArray(p.grades) && p.grades.length > 0) ? p.grades : [1, 2, 3];
  }

  function setGradesForProfile(profileId, grades) {
    if (!Array.isArray(grades) || grades.length === 0) return false;
    const profiles = loadAllProfiles();
    const target = profiles.find(p => p.id === profileId);
    if (target) {
      target.grades = grades.map(Number).sort((a, b) => a - b);
      saveAllProfiles(profiles);
      notify('grades-changed', { profileId, grades: target.grades });
      return true;
    }
    return false;
  }

  function switchProfile(profileId) {
    const profiles = loadAllProfiles();
    const target = profiles.find(p => p.id === profileId);
    if (target) {
      const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
      if (Storage) Storage.schreiben('active_profile', target.id);
      notify('profile-changed', target);
      return target;
    }
    return getActiveProfile();
  }

  function createProfile(name, avatar, grades) {
    const cleanName = (name || '').trim();
    if (!cleanName) return null;

    const profiles = loadAllProfiles();
    const cleanGrades = (Array.isArray(grades) && grades.length > 0)
      ? grades.map(Number).sort((a, b) => a - b)
      : [1, 2, 3, 4];

    const newProfile = {
      id: 'profile_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
      grades: cleanGrades,
      stars: {},
      unlockedStickers: ['s1'],
      openedPacks: 0,
      created: Date.now()
    };

    profiles.push(newProfile);
    saveAllProfiles(profiles);
    switchProfile(newProfile.id);
    notify('profiles-updated', profiles);
    return newProfile;
  }

  function deleteProfile(profileId) {
    let profiles = loadAllProfiles();
    if (profiles.length <= 1) {
      if (window.Schlaufuchs && window.Schlaufuchs.Dialog) {
        window.Schlaufuchs.Dialog.alert('Es muss mindestens ein Kind-Profil vorhanden sein.');
      } else {
        alert('Es muss mindestens ein Kind-Profil vorhanden sein.');
      }
      return false;
    }

    profiles = profiles.filter(p => p.id !== profileId);
    saveAllProfiles(profiles);

    if (getActiveProfileId() === profileId) {
      switchProfile(profiles[0].id);
    }
    notify('profiles-updated', profiles);
    return true;
  }

  // --- STERNE FÜR DAS AKTIVE PROFIL ---

  function getStarsForTopic(topicId) {
    const profile = getActiveProfile();
    return (profile.stars && profile.stars[topicId]) || 0;
  }

  function saveStarsForTopic(topicId, starCount) {
    const profiles = loadAllProfiles();
    const activeId = getActiveProfileId();
    const profile = profiles.find(p => p.id === activeId);

    if (!profile) return;
    if (!profile.stars) profile.stars = {};

    const currentStars = profile.stars[topicId] || 0;
    // Sterne werden nur erhöht, nie verringert
    if (starCount > currentStars) {
      profile.stars[topicId] = Math.min(3, starCount);
      saveAllProfiles(profiles);
      notify('stars-changed', {
        topicId: topicId,
        stars: profile.stars[topicId],
        total: getTotalStars()
      });
    }
  }

  function getTotalStars() {
    const profile = getActiveProfile();
    if (!profile.stars) return 0;
    return Object.values(profile.stars).reduce((acc, val) => acc + (val || 0), 0);
  }

  function resetAllStarsForActiveProfile() {
    const profiles = loadAllProfiles();
    const activeId = getActiveProfileId();
    const profile = profiles.find(p => p.id === activeId);
    if (profile) {
      profile.stars = {};
      saveAllProfiles(profiles);
      notify('stars-changed', { total: 0 });
    }
  }

  return {
    AVATARS: AVATARS,
    subscribe: subscribe,
    notify: notify,
    // Einstellungen
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    isGradeActive: isGradeActive,
    getParentPin: getParentPin,
    setParentPin: setParentPin,
    getPrintSettings: getPrintSettings,
    savePrintSettings: savePrintSettings,
    // Profile & Schulstufen am Kind
    loadAllProfiles: loadAllProfiles,
    saveAllProfiles: saveAllProfiles,
    getActiveProfile: getActiveProfile,
    getActiveGrades: getActiveGrades,
    getGradesForProfile: getGradesForProfile,
    setGradesForProfile: setGradesForProfile,
    switchProfile: switchProfile,
    createProfile: createProfile,
    deleteProfile: deleteProfile,
    // Sterne
    getStarsForTopic: getStarsForTopic,
    saveStarsForTopic: saveStarsForTopic,
    getTotalStars: getTotalStars,
    resetAllStarsForActiveProfile: resetAllStarsForActiveProfile
  };
})();
