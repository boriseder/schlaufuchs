// =============================================================
// SCHLAUFUCHS – js/core/storage.js
// Zentrales Speichermodul mit Schema-Versionierung & Fallback
// Kein direkter Zugriff auf localStorage im Rest des Codes
// =============================================================

(function (S) {
  'use strict';

  const PRAEFIX = 'schlaufuchs:v1:';
  const speicher = {}; // Fallback im Arbeitsspeicher bei privatem Modus oder vollem Speicher

  function lesen(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem(PRAEFIX + key);
        return v === null ? undefined : JSON.parse(v);
      }
      return speicher[key];
    } catch (e) {
      return speicher[key];
    }
  }

  function schreiben(key, wert) {
    speicher[key] = wert;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PRAEFIX + key, JSON.stringify(wert));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function entfernen(key) {
    delete speicher[key];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(PRAEFIX + key);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function alleSchluessel() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(PRAEFIX)) {
            keys.push(k.slice(PRAEFIX.length));
          }
        }
        return keys;
      }
    } catch (e) {
      // ignore
    }
    return Object.keys(speicher);
  }

  // Persistente Speicherung anfordern (Schutz gegen automatisches Löschen in iOS Safari)
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }

  S.Storage = {
    lesen,
    schreiben,
    entfernen,
    alleSchluessel,
    PRAEFIX
  };
})(typeof window !== 'undefined' ? (window.Schlaufuchs = window.Schlaufuchs || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}));
