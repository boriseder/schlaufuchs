// =============================================================
// SCHLAUFUCHS – js/signs.js
// Originalgetreue Vektorgrafiken (SVG) für Verkehrszeichen nach
// der österreichischen Straßenverkehrsordnung (StVO)
// 100% Offline-fähig, skalierbar und retinascharf
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Signs = (function () {
  'use strict';

  const SVG_DEFS = {
    // 1. Vorrang geben (StVO § 52 Z 23): Weißes Dreieck auf der Spitze, breiter roter Rand
    'vorrang-geben': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Vorrang geben">
        <polygon points="50,90 8,14 92,14" fill="#dc2626" stroke="#b91c1c" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="50,74 20,20 80,20" fill="#ffffff" stroke-linejoin="round"/>
      </svg>
    `,

    // 2. Halt! Vorrang geben / Stopp-Tafel (StVO § 52 Z 24): Rotes Achteck, weißer Rand, Schrift "STOP"
    'stop': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Halt! Vorrang geben">
        <polygon points="29.3,6 70.7,6 94,29.3 94,70.7 70.7,94 29.3,94 6,70.7 6,29.3" fill="#dc2626" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="30.5,10 69.5,10 90,30.5 90,69.5 69.5,90 30.5,90 10,69.5 10,30.5" fill="#dc2626"/>
        <text x="50" y="58" font-family="system-ui, -apple-system, sans-serif, 'Arial Black'" font-weight="900" font-size="25" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">STOP</text>
      </svg>
    `,

    // 3. Vorrangstraße (StVO § 53 Z 25a): Gelbe Raute mit weißem Außenrand
    'vorrangstrasse': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Vorrangstraße">
        <polygon points="50,8 92,50 50,92 8,50" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="50,18 82,50 50,82 18,50" fill="#eab308" stroke="#ca8a04" stroke-width="1" stroke-linejoin="round"/>
      </svg>
    `,

    // 4. Ende der Vorrangstraße (StVO § 53 Z 25b): Gelbe Raute mit schwarzem Schrägbalken
    'ende-vorrangstrasse': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Ende der Vorrangstraße">
        <polygon points="50,8 92,50 50,92 8,50" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="50,18 82,50 50,82 18,50" fill="#eab308" stroke="#ca8a04" stroke-width="1" stroke-linejoin="round"/>
        <line x1="72" y1="28" x2="28" y2="72" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `,

    // 5. Radweg (StVO § 52 Z 16): Runder blauer Grund, weißes Fahrrad
    'radweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Radweg">
        <circle cx="50" cy="50" r="45" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
        <!-- Fahrrad -->
        <g stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="30" cy="58" r="12"/>
          <circle cx="70" cy="58" r="12"/>
          <polyline points="30,58 45,58 55,42 70,58"/>
          <polyline points="45,58 40,42 34,42"/>
          <line x1="55" y1="42" x2="63" y2="42"/>
          <polyline points="63,38 67,42 63,42"/>
        </g>
      </svg>
    `,

    // 6. Geh- und Radweg (getrennt): Blauer Kreis mit Fußgängern links und Fahrrad rechts
    'geh-radweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Getrennter Geh- und Radweg">
        <circle cx="50" cy="50" r="45" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
        <line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" stroke-width="3"/>
        <!-- Fußgänger links -->
        <circle cx="30" cy="30" r="4" fill="#ffffff"/>
        <path d="M 28 35 L 32 35 L 34 50 L 30 50 L 29 65 L 26 65 L 28 47 L 24 47 Z" fill="#ffffff"/>
        <!-- Fahrrad rechts -->
        <g stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="62" cy="58" r="7"/>
          <circle cx="82" cy="58" r="7"/>
          <polyline points="62,58 70,58 75,47 82,58"/>
          <polyline points="70,58 68,47 64,47"/>
          <polyline points="77,44 79,47 75,47"/>
        </g>
      </svg>
    `,

    // 7. Schutzweg (Zebrastreifen, StVO § 53 Z 2a): Blaues Quadrat, weißes Dreieck, Fußgänger auf Streifen
    'schutzweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Schutzweg">
        <rect x="6" y="6" width="88" height="88" rx="8" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
        <polygon points="50,14 14,84 86,84" fill="#ffffff"/>
        <!-- Zebrastreifen -->
        <line x1="28" y1="78" x2="72" y2="78" stroke="#0284c7" stroke-width="4"/>
        <line x1="32" y1="72" x2="68" y2="72" stroke="#0284c7" stroke-width="4"/>
        <!-- Fußgänger -->
        <circle cx="50" cy="36" r="4" fill="#0284c7"/>
        <path d="M 47 42 L 53 42 L 56 55 L 52 56 L 50 67 L 46 67 L 48 55 L 44 55 Z" fill="#0284c7"/>
      </svg>
    `,

    // 8. Fahrverbot für alle Fahrzeuge (StVO § 52 Z 1): Weißer Kreis mit rotem Rand
    'fahrverbot': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Fahrverbot für alle Fahrzeuge">
        <circle cx="50" cy="50" r="45" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
        <circle cx="50" cy="50" r="33" fill="#ffffff"/>
      </svg>
    `,

    // 9. Einfahrt verboten (StVO § 52 Z 2): Roter Kreis mit waagrechtem weißem Balken
    'einfahrt-verboten': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Einfahrt verboten">
        <circle cx="50" cy="50" r="45" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
        <rect x="18" y="42" width="64" height="16" fill="#ffffff" rx="2"/>
      </svg>
    `,

    // 10. Gefahrenstelle / Achtung (StVO § 50 Z 16): Weißes Dreieck (Spitze oben!), roter Rand, schwarzes Rufzeichen
    'gefahrenstelle': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Gefahrenstelle">
        <polygon points="50,10 92,86 8,86" fill="#dc2626" stroke="#b91c1c" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="50,26 80,80 20,80" fill="#ffffff" stroke-linejoin="round"/>
        <!-- Ausrufezeichen -->
        <rect x="47.5" y="38" width="5" height="24" rx="2.5" fill="#0f172a"/>
        <circle cx="50" cy="70" r="3.5" fill="#0f172a"/>
      </svg>
    `,

    // 11. Einbahnstraße (StVO § 53 Z 10): Blaues Rechteck mit weißem Pfeil nach links oder rechts
    'einbahnstrasse': `
      <svg viewBox="0 0 100 70" width="100" height="70" class="stvo-sign" aria-label="Einbahnstraße">
        <rect x="4" y="6" width="92" height="58" rx="6" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
        <!-- Weißer Pfeil nach rechts -->
        <path d="M 18 35 L 62 35 L 62 25 L 82 35 L 62 45 L 62 35 Z" fill="#ffffff"/>
      </svg>
    `,

    // 12. Kreisverkehr (StVO § 52 Z 15): Blauer Kreis mit drei kreisförmigen weißen Pfeilen
    'kreisverkehr': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Kreisverkehr">
        <circle cx="50" cy="50" r="45" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
        <g stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M 50 25 A 25 25 0 0 1 74 54"/>
          <path d="M 68 65 A 25 25 0 0 1 33 69"/>
          <path d="M 27 50 A 25 25 0 0 1 45 25"/>
        </g>
        <polygon points="74,54 79,44 69,47" fill="#ffffff"/>
        <polygon points="33,69 42,73 40,63" fill="#ffffff"/>
        <polygon points="45,25 43,15 37,23" fill="#ffffff"/>
      </svg>
    `
  };

  function getSignSvg(signId) {
    if (!SVG_DEFS[signId]) {
      console.warn(`Verkehrszeichen ${signId} nicht gefunden.`);
      return `<span style="font-size: 2rem;">🚸</span>`;
    }
    return SVG_DEFS[signId].trim();
  }

  return {
    getSignSvg: getSignSvg,
    AVAILABLE_SIGNS: Object.keys(SVG_DEFS)
  };
})();
