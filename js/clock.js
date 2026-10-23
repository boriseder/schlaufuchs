// =============================================================
// SCHLAUFUCHS – js/clock.js
// Vektorgrafik-Generator (SVG) & Didaktik-Helfer für die Uhrzeit
// Gemäß BMBWF Lehrplan Volksschule Österreich (BGBl. II Nr. 178/2025)
//
// Fachdidaktische Merkmale:
// • Stundenzeiger: kurz & kräftig (#B5502B Ziegel/Rot, Lehrmittelstandard)
// • Minutenzeiger: lang & schlank (#2D5E9E Blau)
// • Kontinuierliche Zeigerdynamik: Bei :30 steht der Stundenzeiger
//   exakt auf halbem Weg zwischen zwei Stundenziffern
// • 100% Offline-fähig, reine Vektoren (kein Verlauf, kein Schatten)
// • Skalierbar für Bildschirm und gestochen scharfen A4-Druck
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Clock = (function () {
  'use strict';

  /**
   * Erzeugt ein barrierefreies, skalierbares SVG-Zifferblatt.
   *
   * @param {number} hours - Stunde (0–23 oder 1–12)
   * @param {number} minutes - Minute (0–59)
   * @param {Object} [options] - Konfiguration
   * @param {number} [options.size=160] - SVG-Breite/Höhe in px
   * @param {boolean} [options.hands=true] - Zeiger einzeichnen (false für Zeichenübungen)
   * @param {boolean} [options.showMinuteTicks=true] - 60 Minutenteilstriche anzeigen
   * @param {boolean} [options.showHourNumbers=true] - Zahlen 1 bis 12 anzeigen
   * @param {string} [options.ariaLabel] - Barrierefreie Beschreibung
   * @param {string} [options.className=''] - Zusätzliche CSS-Klassen
   * @returns {string} SVG-Markup als String
   */
  function createClockSvg(hours, minutes, options = {}) {
    const size = options.size || 160;
    const hands = options.hands !== false;
    const showMinuteTicks = options.showMinuteTicks !== false;
    const showHourNumbers = options.showHourNumbers !== false;
    const className = options.className ? `analog-clock-svg ${options.className}` : 'analog-clock-svg';

    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;

    // Normalisierte Stundenzahl 0..11 mit kontinuierlichem Minutenfortschritt
    const hourFraction = (h % 12) + (m / 60);
    const hourAngleDeg = hourFraction * 30; // 360 / 12 = 30 Grad je Stunde
    const minuteAngleDeg = (m % 60) * 6;   // 360 / 60 = 6 Grad je Minute

    const cx = 100;
    const cy = 100;
    const rDial = 88;

    // 1. Zifferblatt-Hintergrund & Rahmen
    let svg = `<svg viewBox="0 0 200 200" width="${size}" height="${size}" class="${className}" role="img" aria-label="${options.ariaLabel || describeTimeAria(h, m)}">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${rDial}" fill="#FFFFFF" stroke="#3B4651" stroke-width="3"/>`;

    // 2. Teilstriche: 60 Minutenstriche & 12 hervorgehobene Stundenstriche
    if (showMinuteTicks) {
      for (let i = 0; i < 60; i++) {
        const isHour = (i % 5 === 0);
        const angleRad = (i * 6 - 90) * (Math.PI / 180);
        const rOuter = 85;
        const rInner = isHour ? 76 : 81;
        const strokeW = isHour ? 2.5 : 1;
        const strokeColor = isHour ? '#3B4651' : '#6B6558';

        const x1 = (cx + rInner * Math.cos(angleRad)).toFixed(1);
        const y1 = (cy + rInner * Math.sin(angleRad)).toFixed(1);
        const x2 = (cx + rOuter * Math.cos(angleRad)).toFixed(1);
        const y2 = (cy + rOuter * Math.sin(angleRad)).toFixed(1);

        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"/>`;
      }
    } else {
      // Nur 12 Stundenpunkte/Striche
      for (let i = 0; i < 12; i++) {
        const angleRad = (i * 30 - 90) * (Math.PI / 180);
        const x1 = (cx + 77 * Math.cos(angleRad)).toFixed(1);
        const y1 = (cy + 77 * Math.sin(angleRad)).toFixed(1);
        const x2 = (cx + 85 * Math.cos(angleRad)).toFixed(1);
        const y2 = (cy + 85 * Math.sin(angleRad)).toFixed(1);
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3B4651" stroke-width="2.5" stroke-linecap="round"/>`;
      }
    }

    // 3. Stundenzahlen 1 bis 12
    if (showHourNumbers) {
      const rNum = 64;
      for (let num = 1; num <= 12; num++) {
        const angleRad = (num * 30 - 90) * (Math.PI / 180);
        const nx = (cx + rNum * Math.cos(angleRad)).toFixed(1);
        const ny = (cy + rNum * Math.sin(angleRad) + 5.5).toFixed(1); // Vertikaler Ausgleich für Text-Baseline
        svg += `<text x="${nx}" y="${ny}" text-anchor="middle" font-family="'Primae', 'PrimaeText', -apple-system, sans-serif" font-weight="700" font-size="16" fill="#1E2A36">${num}</text>`;
      }
    }

    // 4. Zeiger
    if (hands) {
      // A. Stundenzeiger: kurz & breit (#B5502B)
      const hRad = (hourAngleDeg - 90) * (Math.PI / 180);
      const hLen = 46;
      const hTail = 10;
      const hx1 = (cx - hTail * Math.cos(hRad)).toFixed(1);
      const hy1 = (cy - hTail * Math.sin(hRad)).toFixed(1);
      const hx2 = (cx + hLen * Math.cos(hRad)).toFixed(1);
      const hy2 = (cy + hLen * Math.sin(hRad)).toFixed(1);

      svg += `<line x1="${hx1}" y1="${hy1}" x2="${hx2}" y2="${hy2}" stroke="#B5502B" stroke-width="5" stroke-linecap="round" class="clock-hand-hour"/>`;

      // B. Minutenzeiger: lang & schlank (#2D5E9E)
      const mRad = (minuteAngleDeg - 90) * (Math.PI / 180);
      const mLen = 68;
      const mTail = 12;
      const mx1 = (cx - mTail * Math.cos(mRad)).toFixed(1);
      const my1 = (cy - mTail * Math.sin(mRad)).toFixed(1);
      const mx2 = (cx + mLen * Math.cos(mRad)).toFixed(1);
      const my2 = (cy + mLen * Math.sin(mRad)).toFixed(1);

      svg += `<line x1="${mx1}" y1="${my1}" x2="${mx2}" y2="${my2}" stroke="#2D5E9E" stroke-width="3.2" stroke-linecap="round" class="clock-hand-minute"/>`;

      // C. Zeiger-Achskappe (Mittelpunkt)
      svg += `<circle cx="${cx}" cy="${cy}" r="4.5" fill="#3B4651"/>`;
      svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="#FFFFFF"/>`;
    } else {
      // Neutraler Mittelpunkt für Einzeichen-Übungen
      svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="#3B4651"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Formatiert Zeit digital nach Standard: z.B. 08:00 Uhr oder 14:30 Uhr.
   */
  function formatTime(hours, minutes) {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m} Uhr`;
  }

  /**
   * Österreichische Sprechweise für Volksschulen:
   * 8:00 -> "8 Uhr"
   * 8:15 -> "viertel nach 8"
   * 8:30 -> "halb 9"
   * 8:45 -> "viertel vor 9" (bzw. "dreiviertel 9")
   */
  function describeTimeText(hours, minutes) {
    const h = hours % 12 === 0 ? 12 : hours % 12;
    const nextH = (h % 12) + 1;
    const m = Number(minutes);

    if (m === 0) return `${h} Uhr`;
    if (m === 15) return `viertel nach ${h}`;
    if (m === 30) return `halb ${nextH}`;
    if (m === 45) return `viertel vor ${nextH}`;
    if (m === 5) return `5 nach ${h}`;
    if (m === 10) return `10 nach ${h}`;
    if (m === 20) return `20 nach ${h}`;
    if (m === 25) return `5 vor halb ${nextH}`;
    if (m === 35) return `5 nach halb ${nextH}`;
    if (m === 40) return `20 vor ${nextH}`;
    if (m === 50) return `10 vor ${nextH}`;
    if (m === 55) return `5 vor ${nextH}`;

    return `${formatTime(hours, minutes)}`;
  }

  /**
   * Barrierefreier Alternativtext für Screenreader.
   */
  function describeTimeAria(hours, minutes) {
    const text = describeTimeText(hours, minutes);
    const digital = formatTime(hours, minutes);
    return `Analoge Uhr: ${text} (${digital})`;
  }

  /**
   * Toleranter Parser für Kindereingaben:
   * Akzeptiert: "8", "8:00", "08:00", "8.00", "08.00", "8 Uhr", "14:30"
   */
  function parseTimeInput(inputStr) {
    if (inputStr === null || inputStr === undefined) return null;
    let s = String(inputStr).trim().toLowerCase();
    s = s.replace(/uhr/g, '').replace(/[\s\u00A0\u202F]/g, '');

    // 1. Format "HH:MM" oder "HH.MM"
    const matchFull = s.match(/^(\d{1,2})[:.](\d{1,2})$/);
    if (matchFull) {
      const h = parseInt(matchFull[1], 10);
      const m = parseInt(matchFull[2], 10);
      if (h >= 0 && h <= 24 && m >= 0 && m < 60) {
        return { hours: h, minutes: m };
      }
    }

    // 2. Nur Zahl eingegeben (z.B. "8" für 8 Uhr)
    const matchHourOnly = s.match(/^(\d{1,2})$/);
    if (matchHourOnly) {
      const h = parseInt(matchHourOnly[1], 10);
      if (h >= 0 && h <= 24) {
        return { hours: h, minutes: 0 };
      }
    }

    return null;
  }

  return {
    createClockSvg: createClockSvg,
    formatTime: formatTime,
    describeTimeText: describeTimeText,
    describeTimeAria: describeTimeAria,
    parseTimeInput: parseTimeInput
  };
})();
