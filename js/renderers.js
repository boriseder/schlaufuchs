// =============================================================
// SCHLAUFUCHS – js/renderers.js
// Aggregierte Fassade für alle Aufgaben-Renderer
// Die Implementierungen liegen modularisiert unter js/renderers/
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {};

(function (S, R) {
  'use strict';

  // Exportiert die aggregierte API für Abwärtskompatibilität
  S.Renderers = R;
})(typeof window !== 'undefined' ? window.Schlaufuchs : globalThis.Schlaufuchs, typeof window !== 'undefined' ? (window.Schlaufuchs.Renderers = window.Schlaufuchs.Renderers || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}).Renderers = globalThis.Schlaufuchs.Renderers || {});
