// =============================================================
// SCHLAUFUCHS – js/validators/index.js
// Reine Validierungsfunktionen (unabhängig vom DOM)
// Gemäß AGENTS.md: Tolerantes Lesen von Zahlen (1000, 1 000, 1.000)
// =============================================================

(function (S) {
  'use strict';

  /**
   * Prüft eine numerische Eingabe tolerant gegen die Soll-Lösung.
   * Akzeptiert: "1000", "1 000", "1\u202F000", oder Altsystem-Punkte (Tausenderpunkt)
   */
  function pruefeZahl(userAntwort, sollLoesung) {
    if (userAntwort === null || userAntwort === undefined || userAntwort === '') {
      return { gueltig: false, richtig: false, msg: 'Bitte gib eine Zahl ein.' };
    }

    const formatModul = (S && S.leseZahl) ? S : (typeof window !== 'undefined' && window.Schlaufuchs && window.Schlaufuchs.leseZahl ? window.Schlaufuchs : null);
    const parsedUser = formatModul ? formatModul.leseZahl(userAntwort) : Number(String(userAntwort).replace(/\s/g, '').replace(',', '.'));
    const parsedSoll = Number(sollLoesung);

    if (isNaN(parsedUser)) {
      return { gueltig: false, richtig: false, msg: 'Das ist keine gültige Zahl.' };
    }

    const richtig = Math.abs(parsedUser - parsedSoll) < 0.0001;
    return {
      gueltig: true,
      richtig: richtig,
      userWert: parsedUser,
      sollWert: parsedSoll
    };
  }

  /**
   * Prüft Text- oder Worteingaben (z.B. Rechtschreibung, Einheiten).
   */
  function pruefeWort(userAntwort, sollLoesung, options = {}) {
    if (!userAntwort) {
      return { gueltig: false, richtig: false, msg: 'Bitte gib ein Wort ein.' };
    }
    const caseSensitive = options.ignoreCase !== undefined ? !options.ignoreCase : (options.caseSensitive ?? true);
    const u = String(userAntwort).trim();
    const s = String(sollLoesung).trim();

    const richtig = caseSensitive ? (u === s) : (u.toLowerCase() === s.toLowerCase());
    return {
      gueltig: true,
      richtig: richtig,
      userWert: u,
      sollWert: s
    };
  }

  /**
   * Prüft Multiple-Choice-Auswahl.
   */
  function pruefeAuswahl(userAuswahl, sollLoesung) {
    if (userAuswahl === null || userAuswahl === undefined) {
      return { gueltig: false, richtig: false, msg: 'Bitte wähle eine Antwort aus.' };
    }
    const richtig = String(userAuswahl).trim() === String(sollLoesung).trim();
    return {
      gueltig: true,
      richtig: richtig
    };
  }

  /**
   * Prüft Zahlenmauer-Eingaben.
   */
  function pruefeZahlenmauer(userAnswers, values, hiddenKeys) {
    let alleAusgefuellt = true;
    let alleRichtig = true;

    for (const key of hiddenKeys) {
      const uVal = userAnswers[key];
      if (uVal === undefined || uVal === null || uVal === '') {
        alleAusgefuellt = false;
        alleRichtig = false;
        continue;
      }
      const res = pruefeZahl(uVal, values[key]);
      if (!res.richtig) {
        alleRichtig = false;
      }
    }

    return {
      gueltig: alleAusgefuellt,
      richtig: alleRichtig
    };
  }

  S.Validators = {
    pruefeZahl,
    pruefeWort,
    pruefeAuswahl,
    pruefeZahlenmauer
  };
})(typeof window !== 'undefined' ? (window.Schlaufuchs = window.Schlaufuchs || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}));
