// =============================================================
// SCHLAUFUCHS – js/signs.js
// Originalgetreue Vektorgrafiken (SVG) für Verkehrszeichen nach
// der österreichischen Straßenverkehrsordnung (StVO 1960 idgF / StVZVO)
// 100% Offline-fähig, skalierbar und retinascharf
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Signs = (function () {
  'use strict';

  const SVG_DEFS = {
    // 1. Vorrang geben (StVO § 52 Z 23): Weißes Dreieck auf der Spitze, breiter roter Rand
    'vorrang-geben': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Vorrang geben">
        <polygon points="50,92 6,12 94,12" fill="#C82828" stroke="#A31F1F" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="50,70 18,18 82,18" fill="#ffffff" stroke-linejoin="round"/>
      </svg>
    `,

    // 2. Halt! Vorrang geben / Stopp-Tafel (StVO § 52 Z 24): Rotes Achteck, weißer Innenrand, zentrierte Schrift "STOP"
    'stop': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Halt! Vorrang geben">
        <polygon points="29.3,5 70.7,5 95,29.3 95,70.7 70.7,95 29.3,95 5,70.7 5,29.3" fill="#C82828"/>
        <polygon points="30.5,8.5 69.5,8.5 91.5,30.5 91.5,69.5 69.5,91.5 30.5,91.5 8.5,69.5 8.5,30.5" fill="none" stroke="#ffffff" stroke-width="3"/>
        <text x="50" y="52" font-family="system-ui, -apple-system, sans-serif, 'Arial Black'" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle" dominant-baseline="central" letter-spacing="1.5">STOP</text>
      </svg>
    `,

    // 3. Vorrangstraße (StVO § 53 Z 25a): Gelbe Raute mit weißem Außenrand
    'vorrangstrasse': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Vorrangstraße">
        <polygon points="50,6 94,50 50,94 6,50" fill="#ffffff" stroke="#cccccc" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="50,18 82,50 50,82 18,50" fill="#E5A800" stroke="#C68A00" stroke-width="1" stroke-linejoin="round"/>
      </svg>
    `,

    // 4. Ende der Vorrangstraße (StVO § 53 Z 25b): Gelbe Raute mit schwarzem Schrägbalken
    'ende-vorrangstrasse': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Ende der Vorrangstraße">
        <polygon points="50,6 94,50 50,94 6,50" fill="#ffffff" stroke="#cccccc" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="50,18 82,50 50,82 18,50" fill="#E5A800" stroke="#C68A00" stroke-width="1" stroke-linejoin="round"/>
        <line x1="74" y1="26" x2="26" y2="74" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `,

    // 5. Radweg (StVO § 52 Z 16): Runder blauer Grund, weißes Fahrrad
    'radweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Radweg">
        <circle cx="50" cy="50" r="45" fill="#0066B3" stroke="#ffffff" stroke-width="3"/>
        <g stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="30" cy="58" r="13"/>
          <circle cx="70" cy="58" r="13"/>
          <polyline points="30,58 46,58 58,40 70,58"/>
          <polyline points="46,58 40,38 33,38"/>
          <line x1="58" y1="40" x2="67" y2="40"/>
          <polyline points="65,35 70,40 65,40"/>
        </g>
      </svg>
    `,

    // 6. Gehweg / Fußweg (StVO § 52 Z 17): Blauer Kreis mit Fußgängern (Erwachsener & Kind Hand in Hand)
    'gehweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Gehweg (Reiner Fußweg)">
        <circle cx="50" cy="50" r="45" fill="#0066B3" stroke="#ffffff" stroke-width="3"/>
        <!-- Erwachsener links -->
        <circle cx="39" cy="27" r="4.5" fill="#ffffff"/>
        <path d="M 36 34 L 42 34 L 45 48 L 41 49 L 41 68 L 37 68 L 37 53 L 34 53 L 32 68 L 28 68 L 31 46 L 27 43 L 29 39 L 36 34 Z" fill="#ffffff"/>
        <!-- Kind rechts -->
        <circle cx="59" cy="41" r="3.5" fill="#ffffff"/>
        <path d="M 56 47 L 62 47 L 64 57 L 61 58 L 61 71 L 58 71 L 58 60 L 56 60 L 54 71 L 51 71 L 53 56 L 47 50 L 49 47 L 56 47 Z" fill="#ffffff"/>
      </svg>
    `,

    // 7. Geh- und Radweg getrennt (StVO § 52 Z 17b): Blauer Kreis mit Fußgänger links, Fahrrad rechts, weiße Trennlinie
    'geh-radweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Getrennter Geh- und Radweg">
        <circle cx="50" cy="50" r="45" fill="#0066B3" stroke="#ffffff" stroke-width="3"/>
        <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" stroke-width="3"/>
        <!-- Fußgänger links -->
        <circle cx="28" cy="28" r="4" fill="#ffffff"/>
        <path d="M 25 34 L 31 34 L 33 46 L 31 47 L 31 66 L 27 66 L 28 52 L 25 52 L 23 66 L 19 66 L 22 46 L 19 44 L 21 40 L 25 34 Z" fill="#ffffff"/>
        <!-- Fahrrad rechts -->
        <g stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="62" cy="58" r="8"/>
          <circle cx="84" cy="58" r="8"/>
          <polyline points="62,58 71,58 78,46 84,58"/>
          <polyline points="71,58 67,46 63,46"/>
          <polyline points="78,46 81,46 83,43"/>
        </g>
      </svg>
    `,

    // 8. Schutzweg / Zebrastreifen (StVO § 53 Z 2a): Blaues Quadrat, weißes Dreieck, Längsstreifen und dynamisch schreitende Person
    'schutzweg': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Schutzweg (Zebrastreifen)">
        <rect x="5" y="5" width="90" height="90" rx="8" fill="#0066B3" stroke="#ffffff" stroke-width="2"/>
        <polygon points="50,12 12,86 88,86" fill="#ffffff"/>
        <!-- Zebrastreifen Längsbalken auf der Straße -->
        <g fill="#0066B3">
          <polygon points="26,84 31,84 33,70 29,70"/>
          <polygon points="36,84 41,84 42,70 38,70"/>
          <polygon points="47,84 52,84 52,70 48,70"/>
          <polygon points="58,84 63,84 62,70 58,70"/>
          <polygon points="69,84 74,84 71,70 67,70"/>
        </g>
        <!-- Schreitender Fußgänger nach links (dynamische Schrittstellung & Arme) -->
        <circle cx="49" cy="30" r="4.5" fill="#0066B3"/>
        <path d="M 46 37 L 53 36 L 56 46 L 52 48 L 52 55 L 61 70 L 56 71 L 49 58 L 47 58 L 41 71 L 36 69 L 44 51 L 41 50 L 37 56 L 33 54 L 38 43 L 46 37 Z" fill="#0066B3"/>
        <path d="M 48 39 L 55 45 L 58 43 L 51 38 Z" fill="#0066B3"/>
      </svg>
    `,

    // 9. Achtung Kinder (StVO § 50 Z 10): Weißes Dreieck, roter Rand, zwei laufende Kinder
    'achtung-kinder': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Achtung Kinder">
        <polygon points="50,8 95,88 5,88" fill="#C82828" stroke="#A31F1F" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="50,26 82,82 18,82" fill="#ffffff" stroke-linejoin="round"/>
        <!-- Großes Kind links -->
        <circle cx="41" cy="46" r="4" fill="#1a1a1a"/>
        <path d="M 38 52 L 44 52 L 46 62 L 44 63 L 43 76 L 39 76 L 40 66 L 37 66 L 34 76 L 30 76 L 33 60 L 30 58 L 32 55 L 38 52 Z" fill="#1a1a1a"/>
        <!-- Kleines Kind mit Schultasche rechts -->
        <circle cx="58" cy="53" r="3.5" fill="#1a1a1a"/>
        <path d="M 55 58 L 61 58 L 62 66 L 60 67 L 59 76 L 56 76 L 57 68 L 54 68 L 52 76 L 49 76 L 51 64 L 46 60 L 48 57 L 55 58 Z" fill="#1a1a1a"/>
        <rect x="61" y="60" width="4.5" height="6" rx="1" fill="#1a1a1a"/>
      </svg>
    `,

    // 10. Wohnstraße (StVO § 53 Z 9b): Blaues Rechteck mit Haus, Auto, Erwachsenem und spielendem Kind
    'wohnstrasse': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Wohnstraße">
        <rect x="5" y="5" width="90" height="90" rx="8" fill="#0066B3" stroke="#ffffff" stroke-width="2"/>
        <!-- Haus links oben -->
        <polygon points="18,36 30,22 42,36" fill="#ffffff"/>
        <rect x="22" y="36" width="16" height="14" fill="#ffffff"/>
        <!-- Auto rechts oben -->
        <path d="M 58 42 L 64 33 L 78 33 L 84 42 L 87 43 L 87 47 L 55 47 L 55 43 Z" fill="#ffffff"/>
        <circle cx="62" cy="47" r="3.5" fill="#0066B3"/>
        <circle cx="80" cy="47" r="3.5" fill="#0066B3"/>
        <!-- Gehender Erwachsener -->
        <circle cx="30" cy="55" r="4" fill="#ffffff"/>
        <path d="M 27 61 L 33 61 L 35 72 L 32 73 L 31 84 L 27 84 L 28 75 L 26 75 L 24 84 L 20 84 L 23 68 L 27 61 Z" fill="#ffffff"/>
        <!-- Kind spielt mit Ball -->
        <circle cx="56" cy="62" r="3.5" fill="#ffffff"/>
        <path d="M 53 67 L 59 67 L 60 75 L 57 76 L 58 84 L 54 84 L 53 77 L 50 84 L 46 84 L 49 74 L 53 67 Z" fill="#ffffff"/>
        <circle cx="68" cy="80" r="4" fill="#ffffff"/>
      </svg>
    `,

    // 11. Begegnungszone (StVO § 53 Z 9e): Blaues Rechteck, Personen, Fahrrad, Auto und Tempo 20
    'begegnungszone': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Begegnungszone">
        <rect x="5" y="5" width="90" height="90" rx="8" fill="#0066B3" stroke="#ffffff" stroke-width="2"/>
        <!-- Fußgänger links -->
        <circle cx="25" cy="26" r="3.5" fill="#ffffff"/>
        <path d="M 22 31 L 28 31 L 30 42 L 27 43 L 26 53 L 23 53 L 24 45 L 21 53 L 18 53 L 20 40 L 22 31 Z" fill="#ffffff"/>
        <!-- Fahrrad in der Mitte -->
        <g stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round">
          <circle cx="44" cy="45" r="6"/>
          <circle cx="60" cy="45" r="6"/>
          <polyline points="44,45 50,45 55,36 60,45"/>
          <polyline points="50,45 48,36 45,36"/>
        </g>
        <!-- Auto rechts -->
        <path d="M 72 38 L 76 31 L 86 31 L 90 38 L 92 39 L 92 43 L 70 43 Z" fill="#ffffff"/>
        <circle cx="75" cy="43" r="2.5" fill="#0066B3"/>
        <circle cx="87" cy="43" r="2.5" fill="#0066B3"/>
        <!-- Tempo 20 Kreis -->
        <circle cx="50" cy="74" r="18" fill="#ffffff" stroke="#C82828" stroke-width="3.5"/>
        <text x="50" y="75" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#1a1a1a" text-anchor="middle" dominant-baseline="central">20</text>
      </svg>
    `,

    // 12. Fußgängerzone (StVO § 53 Z 9a): Blaues Rechteck mit weißem Kreis und Fußgängern
    'fussgaengerzone': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Fußgängerzone">
        <rect x="5" y="5" width="90" height="90" rx="8" fill="#0066B3" stroke="#ffffff" stroke-width="2"/>
        <circle cx="50" cy="50" r="34" fill="#ffffff"/>
        <circle cx="43" cy="33" r="3.5" fill="#0066B3"/>
        <path d="M 40 38 L 46 38 L 48 49 L 45 50 L 45 65 L 41 65 L 42 54 L 38 65 L 34 65 L 37 47 L 40 38 Z" fill="#0066B3"/>
        <circle cx="58" cy="42" r="3" fill="#0066B3"/>
        <path d="M 55 47 L 60 47 L 61 56 L 58 57 L 58 66 L 55 66 L 55 58 L 52 66 L 49 66 L 51 54 L 55 47 Z" fill="#0066B3"/>
      </svg>
    `,

    // 13. Haltestelle (StVO § 53 Z 3a): Blaues Schild mit H-Symbol im grünen Kreis
    'haltestelle': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Haltestelle">
        <rect x="5" y="5" width="90" height="90" rx="8" fill="#0066B3" stroke="#ffffff" stroke-width="2"/>
        <circle cx="50" cy="50" r="34" fill="#ffffff"/>
        <circle cx="50" cy="50" r="30" fill="#ffffff" stroke="#1B8A44" stroke-width="4"/>
        <text x="50" y="52" font-family="system-ui, -apple-system, sans-serif, 'Arial Black'" font-weight="900" font-size="34" fill="#1B8A44" text-anchor="middle" dominant-baseline="central">H</text>
      </svg>
    `,

    // 14. Fahrverbot für alle Fahrzeuge (StVO § 52 Z 1): Weißer Kreis mit rotem Rand
    'fahrverbot': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Fahrverbot für alle Fahrzeuge">
        <circle cx="50" cy="50" r="45" fill="#C82828" stroke="#A31F1F" stroke-width="2"/>
        <circle cx="50" cy="50" r="33" fill="#ffffff"/>
      </svg>
    `,

    // 15. Einfahrt verboten (StVO § 52 Z 2): Roter Kreis mit waagrechtem weißem Balken
    'einfahrt-verboten': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Einfahrt verboten">
        <circle cx="50" cy="50" r="45" fill="#C82828" stroke="#A31F1F" stroke-width="2"/>
        <rect x="18" y="42" width="64" height="16" fill="#ffffff" rx="2"/>
      </svg>
    `,

    // 16. Gefahrenstelle / Achtung (StVO § 50 Z 11): Weißes Dreieck (Spitze oben!), roter Rand, schwarzes Rufzeichen
    'gefahrenstelle': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Gefahrenstelle">
        <polygon points="50,8 95,88 5,88" fill="#C82828" stroke="#A31F1F" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="50,26 82,82 18,82" fill="#ffffff" stroke-linejoin="round"/>
        <rect x="47.5" y="38" width="5" height="24" rx="2.5" fill="#1a1a1a"/>
        <circle cx="50" cy="70" r="3.5" fill="#1a1a1a"/>
      </svg>
    `,

    // 17. Einbahnstraße (StVO § 53 Z 10): Blaues Rechteck mit weißem Pfeil nach rechts
    'einbahnstrasse': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Einbahnstraße">
        <rect x="5" y="20" width="90" height="60" rx="6" fill="#0066B3" stroke="#ffffff" stroke-width="2"/>
        <path d="M 18 50 L 58 50 L 58 38 L 82 50 L 58 62 L 58 50 Z" fill="#ffffff"/>
      </svg>
    `,

    // 18. Kreisverkehr (StVO § 52 Z 15): Blauer Kreis mit drei kreisförmigen weißen Pfeilen
    'kreisverkehr': `
      <svg viewBox="0 0 100 100" width="90" height="90" class="stvo-sign" aria-label="Kreisverkehr">
        <circle cx="50" cy="50" r="45" fill="#0066B3" stroke="#ffffff" stroke-width="3"/>
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
      throw new Error(`Verkehrszeichen mit ID "${signId}" existiert nicht.`);
    }
    return SVG_DEFS[signId].trim();
  }

  return {
    getSignSvg: getSignSvg,
    AVAILABLE_SIGNS: Object.keys(SVG_DEFS)
  };
})();
