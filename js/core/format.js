// =============================================================
// SCHLAUFUCHS – js/core/format.js
// Verbindliche Zahlenformatierung gemäß AGENTS.md und Lehrplan
// Schmales geschütztes Leerzeichen (U+202F) ab 4 Stellen (1 000)
// Tolerantes Lesen von Zahlen (1000, 1 000, 1.000 -> 1000)
// =============================================================

(function (S) {
  'use strict';

  const SPATIUM = '\u202F'; // schmales geschütztes Leerzeichen (U+202F)

  function formatZahl(n) {
    if (n === null || n === undefined || n === '') return '';
    const num = Number(n);
    if (isNaN(num)) return String(n);
    const neg = num < 0 ? '\u2212' : ''; // Minuszeichen U+2212
    const parts = String(Math.abs(num)).split('.');
    const ganz = parts[0];
    const dez = parts[1];
    const gruppiert = ganz.length >= 4 ? ganz.replace(/\B(?=(\d{3})+(?!\d))/g, SPATIUM) : ganz;
    return neg + gruppiert + (dez !== undefined ? ',' + dez : '');
  }

  function leseZahl(text) {
    if (text === null || text === undefined) return NaN;
    let s = String(text).trim();
    if (!s) return NaN;
    // Ersetze typografisches Minus durch Standard-Minus für Parsing
    if (s.startsWith('\u2212')) s = '-' + s.slice(1);
    // Wenn Tausenderpunkte verwendet wurden (z.B. 1.000 oder 125.000)
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) {
      s = s.replace(/\./g, '');
    }
    // Entferne Leerzeichen (Standard, geschützt, schmal) und ersetze Komma durch Punkt
    s = s.replace(/[\s\u00A0\u202F]/g, '').replace(',', '.');
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  S.formatZahl = formatZahl;
  S.leseZahl = leseZahl;
  S.escapeHtml = escapeHtml;
})(window.Schlaufuchs = window.Schlaufuchs || {});
