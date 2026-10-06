// =============================================================
// SCHLAUFUCHS – js/core/random.js
// Deterministischer Seed-fähiger Pseudo-Zufallsgenerator (mulberry32)
// Für reproduzierbare Aufgabenfolgen, Varianz und Unit-Tests
// =============================================================

(function (S) {
  'use strict';

  function mulberry32(a) {
    let s = (a >>> 0) || 123456789;
    return function () {
      let t = (s += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function erstelleZufall(seed) {
    const s = typeof seed === 'number' ? (seed >>> 0) : Math.floor(Math.random() * 1000000000);
    const rng = mulberry32(s);

    function next() {
      return rng();
    }

    function int(min, max) {
      return Math.floor(rng() * (max - min + 1)) + min;
    }

    function wahl(array) {
      if (!array || !array.length) return undefined;
      return array[int(0, array.length - 1)];
    }

    function mischen(array) {
      const kopie = array.slice();
      for (let i = kopie.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const temp = kopie[i];
        kopie[i] = kopie[j];
        kopie[j] = temp;
      }
      return kopie;
    }

    return {
      seed: s,
      next,
      int,
      wahl,
      mischen
    };
  }

  S.Random = {
    mulberry32,
    erstelleZufall
  };
})(typeof window !== 'undefined' ? (window.Schlaufuchs = window.Schlaufuchs || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}));
