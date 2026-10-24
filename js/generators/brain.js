// =============================================================
// SCHLAUFUCHS – js/generators/brain.js
// Gehirntraining-Generatoren: Tier-Memory (ohne Rechnungen!),
// algorithmisch erzeugte Musterfolgen & Zahlenreihen
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.Brain = (function () {
  'use strict';

  // Zentrale Hilfsfunktionen aus Core (Zufall, deterministischer Seed, Stufen-Filter)
  function getRng(opts) {
    const seed = (opts && opts.seed !== undefined) ? opts.seed : undefined;
    if (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.erstelleZufall) {
      return window.Schlaufuchs.Random.erstelleZufall(seed);
    }
    return {
      int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      mischen: (arr) => [...arr].sort(() => Math.random() - 0.5),
      wahl: (arr) => arr[Math.floor(Math.random() * arr.length)],
      wahr: (wahrscheinlichkeit = 0.5) => Math.random() < wahrscheinlichkeit
    };
  }
  const defaultShuffle = (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.mischen) || (arr => [...arr].sort(() => Math.random() - 0.5));
  const defaultRand = (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.rand) || ((min, max) => Math.floor(Math.random() * (max - min + 1)) + min);
  const getEffectiveGrades = (window.Schlaufuchs && window.Schlaufuchs.getEffectiveGrades) || (g => g);

  // 1. TIER- & NATUR-MEMORY (12 vollflächige heimische Tier- & Naturkarten, kein steriler Formenersatz)
  // Adaptiv: 4 Paare (8 Karten) für 1.–2. Klasse, 6 Paare (12 Karten) für 3.–4. Klasse, 8 Paare für Druck
  const NATURE_CARD_DECK = [
    {
      id: 1,
      name: 'Schlaufuchs',
      label: 'Fuchs',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#FFF3E8" stroke="#3B4651" stroke-width="2.2"/>' +
        '<polygon points="26,44 18,14 42,28" fill="#D4621A" stroke="#3B4651" stroke-width="2" stroke-linejoin="round"/>' +
        '<polygon points="26,38 21,19 36,29" fill="#FFFFFF"/>' +
        '<polygon points="21,19 18,14 26,18" fill="#3B4651"/>' +
        '<polygon points="74,44 82,14 58,28" fill="#D4621A" stroke="#3B4651" stroke-width="2" stroke-linejoin="round"/>' +
        '<polygon points="74,38 79,19 64,29" fill="#FFFFFF"/>' +
        '<polygon points="79,19 82,14 74,18" fill="#3B4651"/>' +
        '<path d="M22 46 C22 30 78 30 78 46 C78 62 58 72 50 75 C42 72 22 62 22 46 Z" fill="#D4621A" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M23 48 C28 58 38 68 50 74 C62 68 72 58 77 48 C72 44 64 48 50 56 C36 48 28 44 23 48 Z" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<ellipse cx="36" cy="46" rx="3.5" ry="4" fill="#3B4651"/>' +
        '<circle cx="35" cy="44.5" r="1.2" fill="#FFFFFF"/>' +
        '<ellipse cx="64" cy="46" rx="3.5" ry="4" fill="#3B4651"/>' +
        '<circle cx="63" cy="44.5" r="1.2" fill="#FFFFFF"/>' +
        '<path d="M46 68 L54 68 L50 73 Z" fill="#3B4651" stroke="#3B4651" stroke-width="1" stroke-linejoin="round"/>' +
        '<rect x="10" y="79" width="80" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Schlaufuchs</text>' +
      '</svg>'
    },
    {
      id: 2,
      name: 'Igel',
      label: 'Igel',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#F8F3EA" stroke="#3B4651" stroke-width="2.2"/>' +
        '<path d="M22 68 C16 48 26 28 52 28 C74 28 84 46 84 68 Z" fill="#8C5934" stroke="#3B4651" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M26 56 L18 46 L28 46 L24 36 L36 38 L34 28 L46 32 L50 24 L60 30 L68 24 L70 34 L80 34 L76 46 L82 50 L76 60" stroke="#3B4651" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M25 68 C23 62 21 58 15 56 C9 54 5 55 3 58 C6 62 11 66 25 68 Z" fill="#FFF6E5" stroke="#3B4651" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="21" cy="56" r="3.5" fill="#3B4651"/>' +
        '<circle cx="20" cy="55" r="1.1" fill="#FFFFFF"/>' +
        '<circle cx="3.5" cy="56.5" r="2.5" fill="#3B4651"/>' +
        '<circle cx="56" cy="34" r="8.5" fill="#B5502B" stroke="#3B4651" stroke-width="1.8"/>' +
        '<path d="M56 26 C58 22 62 22 62 22" stroke="#2F7A4F" stroke-width="2" stroke-linecap="round"/>' +
        '<ellipse cx="34" cy="69" rx="4.5" ry="2.5" fill="#FFF6E5" stroke="#3B4651" stroke-width="1.6"/>' +
        '<ellipse cx="66" cy="69" rx="4.5" ry="2.5" fill="#FFF6E5" stroke="#3B4651" stroke-width="1.6"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Igel</text>' +
      '</svg>'
    },
    {
      id: 3,
      name: 'Waldkauz',
      label: 'Eule',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#F0F4F8" stroke="#3B4651" stroke-width="2.2"/>' +
        '<line x1="12" y1="72" x2="88" y2="72" stroke="#7A5230" stroke-width="4.5" stroke-linecap="round"/>' +
        '<path d="M72 70 C76 66 84 66 84 66" stroke="#2F7A4F" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M26 24 L36 32 C44 28 56 28 64 32 L74 24 C72 38 76 62 68 70 C58 74 42 74 32 70 C24 62 28 38 26 24 Z" fill="#C49A45" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<ellipse cx="50" cy="54" rx="16" ry="14" fill="#FBF3E4" stroke="#3B4651" stroke-width="1.6"/>' +
        '<path d="M44 48 L47 51 M53 48 L56 51 M42 56 L45 59 M51 56 L54 59 M47 62 L50 65" stroke="#7A5230" stroke-width="1.5" stroke-linecap="round"/>' +
        '<circle cx="38" cy="40" r="9" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.8"/>' +
        '<circle cx="38" cy="40" r="5" fill="#F2C14E"/>' +
        '<circle cx="38" cy="40" r="3" fill="#1E2A36"/>' +
        '<circle cx="37" cy="39" r="1" fill="#FFFFFF"/>' +
        '<circle cx="62" cy="40" r="9" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.8"/>' +
        '<circle cx="62" cy="40" r="5" fill="#F2C14E"/>' +
        '<circle cx="62" cy="40" r="3" fill="#1E2A36"/>' +
        '<circle cx="61" cy="39" r="1" fill="#FFFFFF"/>' +
        '<polygon points="47,44 53,44 50,51" fill="#D4621A" stroke="#3B4651" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<rect x="16" y="79" width="68" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Waldkauz</text>' +
      '</svg>'
    },
    {
      id: 4,
      name: 'Eichhörnchen',
      label: 'Eichhörnchen',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#FBF3EC" stroke="#3B4651" stroke-width="2.2"/>' +
        '<path d="M28 72 C14 66 12 42 22 28 C30 16 46 16 44 30 C42 42 32 46 34 60 C36 68 40 72 44 74" fill="#D4621A" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<ellipse cx="54" cy="54" rx="14" ry="18" fill="#D4621A" stroke="#3B4651" stroke-width="2.2"/>' +
        '<ellipse cx="50" cy="54" rx="7" ry="12" fill="#FFFFFF"/>' +
        '<circle cx="62" cy="36" r="11" fill="#D4621A" stroke="#3B4651" stroke-width="2.2"/>' +
        '<polygon points="65,26 69,16 73,26" fill="#D4621A" stroke="#3B4651" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<circle cx="67" cy="35" r="2.8" fill="#3B4651"/>' +
        '<circle cx="66.2" cy="34.2" r="0.9" fill="#FFFFFF"/>' +
        '<circle cx="73" cy="37" r="1.8" fill="#3B4651"/>' +
        '<ellipse cx="66" cy="56" rx="4.5" ry="6" fill="#8C5934" stroke="#3B4651" stroke-width="1.6"/>' +
        '<path d="M62 52 Q66 49 70 52" fill="#6E4324" stroke="#3B4651" stroke-width="1.4"/>' +
        '<ellipse cx="58" cy="54" rx="3" ry="2" fill="#D4621A" stroke="#3B4651" stroke-width="1.2"/>' +
        '<rect x="10" y="79" width="80" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="8.2" font-weight="900" fill="#3B4651" text-anchor="middle">Eichhörnchen</text>' +
      '</svg>'
    },
    {
      id: 5,
      name: 'Braunbär',
      label: 'Bär',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#F5EFE8" stroke="#3B4651" stroke-width="2.2"/>' +
        '<circle cx="28" cy="28" r="9" fill="#7A5230" stroke="#3B4651" stroke-width="2"/>' +
        '<circle cx="28" cy="28" r="4.5" fill="#C49A45"/>' +
        '<circle cx="72" cy="28" r="9" fill="#7A5230" stroke="#3B4651" stroke-width="2"/>' +
        '<circle cx="72" cy="28" r="4.5" fill="#C49A45"/>' +
        '<ellipse cx="50" cy="48" rx="28" ry="24" fill="#7A5230" stroke="#3B4651" stroke-width="2.2"/>' +
        '<ellipse cx="50" cy="56" rx="14" ry="11" fill="#D9B48F" stroke="#3B4651" stroke-width="1.8"/>' +
        '<ellipse cx="50" cy="52" rx="5.5" ry="3.5" fill="#1E2A36"/>' +
        '<path d="M50 56 L50 61 M46 61 C48 63 52 63 54 61" stroke="#3B4651" stroke-width="1.8" stroke-linecap="round"/>' +
        '<circle cx="39" cy="44" r="3.2" fill="#1E2A36"/>' +
        '<circle cx="38" cy="43" r="1" fill="#FFFFFF"/>' +
        '<circle cx="61" cy="44" r="3.2" fill="#1E2A36"/>' +
        '<circle cx="60" cy="43" r="1" fill="#FFFFFF"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Braunbär</text>' +
      '</svg>'
    },
    {
      id: 6,
      name: 'Rehkitz',
      label: 'Reh',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#F8F3EC" stroke="#3B4651" stroke-width="2.2"/>' +
        '<path d="M26 36 C20 22 26 12 36 20 L40 32 Z" fill="#B5784C" stroke="#3B4651" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M28 32 C25 24 28 17 33 22 Z" fill="#FFF6E5"/>' +
        '<path d="M74 36 C80 22 74 12 64 20 L60 32 Z" fill="#B5784C" stroke="#3B4651" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M72 32 C75 24 72 17 67 22 Z" fill="#FFF6E5"/>' +
        '<ellipse cx="50" cy="46" rx="20" ry="22" fill="#B5784C" stroke="#3B4651" stroke-width="2.2"/>' +
        '<ellipse cx="50" cy="58" rx="11" ry="8" fill="#FFF6E5" stroke="#3B4651" stroke-width="1.6"/>' +
        '<ellipse cx="50" cy="55" rx="3.5" ry="2.2" fill="#3B4651"/>' +
        '<circle cx="39" cy="43" r="3.6" fill="#1E2A36"/>' +
        '<circle cx="38" cy="42" r="1.2" fill="#FFFFFF"/>' +
        '<circle cx="61" cy="43" r="3.6" fill="#1E2A36"/>' +
        '<circle cx="60" cy="42" r="1.2" fill="#FFFFFF"/>' +
        '<circle cx="44" cy="32" r="1.5" fill="#FFFFFF"/>' +
        '<circle cx="56" cy="32" r="1.5" fill="#FFFFFF"/>' +
        '<circle cx="50" cy="28" r="1.5" fill="#FFFFFF"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Rehkitz</text>' +
      '</svg>'
    },
    {
      id: 7,
      name: 'Feldhase',
      label: 'Hase',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#F5F3ED" stroke="#3B4651" stroke-width="2.2"/>' +
        '<ellipse cx="36" cy="26" rx="6.5" ry="18" fill="#A88B74" stroke="#3B4651" stroke-width="2"/>' +
        '<ellipse cx="36" cy="26" rx="3" ry="12" fill="#F5EBE1"/>' +
        '<ellipse cx="64" cy="26" rx="6.5" ry="18" fill="#A88B74" stroke="#3B4651" stroke-width="2"/>' +
        '<ellipse cx="64" cy="26" rx="3" ry="12" fill="#F5EBE1"/>' +
        '<ellipse cx="50" cy="54" rx="20" ry="18" fill="#A88B74" stroke="#3B4651" stroke-width="2.2"/>' +
        '<ellipse cx="50" cy="61" rx="9" ry="7" fill="#FFF6E5" stroke="#3B4651" stroke-width="1.5"/>' +
        '<polygon points="48,58 52,58 50,60" fill="#B5502B"/>' +
        '<line x1="28" y1="58" x2="42" y2="59" stroke="#3B4651" stroke-width="1.4"/>' +
        '<line x1="28" y1="62" x2="42" y2="61" stroke="#3B4651" stroke-width="1.4"/>' +
        '<line x1="72" y1="58" x2="58" y2="59" stroke="#3B4651" stroke-width="1.4"/>' +
        '<line x1="72" y1="62" x2="58" y2="61" stroke="#3B4651" stroke-width="1.4"/>' +
        '<circle cx="41" cy="50" r="3" fill="#1E2A36"/>' +
        '<circle cx="40" cy="49" r="1" fill="#FFFFFF"/>' +
        '<circle cx="59" cy="50" r="3" fill="#1E2A36"/>' +
        '<circle cx="58" cy="49" r="1" fill="#FFFFFF"/>' +
        '<polygon points="64,74 72,56 75,58 68,75" fill="#D4621A" stroke="#3B4651" stroke-width="1.4"/>' +
        '<path d="M74 56 L78 52 M73 57 L77 58" stroke="#2F7A4F" stroke-width="1.5" stroke-linecap="round"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Feldhase</text>' +
      '</svg>'
    },
    {
      id: 8,
      name: 'Dachs',
      label: 'Dachs',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#ECEFEF" stroke="#3B4651" stroke-width="2.2"/>' +
        '<circle cx="24" cy="34" r="6" fill="#3B4651" stroke="#3B4651" stroke-width="1.8"/>' +
        '<circle cx="24" cy="34" r="2.5" fill="#FFFFFF"/>' +
        '<circle cx="76" cy="34" r="6" fill="#3B4651" stroke="#3B4651" stroke-width="1.8"/>' +
        '<circle cx="76" cy="34" r="2.5" fill="#FFFFFF"/>' +
        '<path d="M22 68 C18 46 32 30 50 28 C68 30 82 46 78 68 Z" fill="#5A6570" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M30 68 C28 50 36 34 50 32 C64 34 72 50 70 68 Z" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.8"/>' +
        '<path d="M36 34 L43 35 L40 64 L33 62 Z" fill="#3B4651"/>' +
        '<path d="M64 34 L57 35 L60 64 L67 62 Z" fill="#3B4651"/>' +
        '<circle cx="38" cy="46" r="2.8" fill="#FFFFFF"/>' +
        '<circle cx="38" cy="46" r="1.6" fill="#1E2A36"/>' +
        '<circle cx="62" cy="46" r="2.8" fill="#FFFFFF"/>' +
        '<circle cx="62" cy="46" r="1.6" fill="#1E2A36"/>' +
        '<ellipse cx="50" cy="65" rx="5" ry="3.5" fill="#3B4651"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Dachs</text>' +
      '</svg>'
    },
    {
      id: 9,
      name: 'Tanne',
      label: 'Tanne',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#EDF5ED" stroke="#3B4651" stroke-width="2.2"/>' +
        '<rect x="44" y="62" width="12" height="14" rx="2" fill="#7A5230" stroke="#3B4651" stroke-width="2"/>' +
        '<polygon points="50,14 66,32 58,32 72,48 62,48 78,64 22,64 38,48 28,48 42,32 34,32" fill="#2F7A4F" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M16 75 C28 72 72 72 84 75" stroke="#4A8505" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="50" cy="14" r="3" fill="#F2C14E" stroke="#3B4651" stroke-width="1.2"/>' +
        '<circle cx="36" cy="56" r="2.2" fill="#B5502B"/>' +
        '<circle cx="64" cy="56" r="2.2" fill="#B5502B"/>' +
        '<circle cx="44" cy="42" r="2" fill="#F2C14E"/>' +
        '<circle cx="56" cy="42" r="2" fill="#F2C14E"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Tanne</text>' +
      '</svg>'
    },
    {
      id: 10,
      name: 'Fliegenpilz',
      label: 'Pilz',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#FBF4EA" stroke="#3B4651" stroke-width="2.2"/>' +
        '<path d="M20 74 C36 71 64 71 80 74" stroke="#2F7A4F" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M42 46 C42 58 40 70 38 74 L62 74 C60 70 58 58 58 46 Z" fill="#FFFFFF" stroke="#3B4651" stroke-width="2" stroke-linejoin="round"/>' +
        '<ellipse cx="50" cy="56" rx="12" ry="3" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<path d="M18 48 C18 26 82 26 82 48 C82 50 18 50 18 48 Z" fill="#B5502B" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<circle cx="34" cy="38" r="4" fill="#FFFFFF"/>' +
        '<circle cx="50" cy="32" r="4.5" fill="#FFFFFF"/>' +
        '<circle cx="66" cy="38" r="4" fill="#FFFFFF"/>' +
        '<circle cx="28" cy="46" r="2.8" fill="#FFFFFF"/>' +
        '<circle cx="72" cy="46" r="2.8" fill="#FFFFFF"/>' +
        '<circle cx="50" cy="44" r="3.2" fill="#FFFFFF"/>' +
        '<rect x="14" y="79" width="72" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="8.5" font-weight="900" fill="#3B4651" text-anchor="middle">Fliegenpilz</text>' +
      '</svg>'
    },
    {
      id: 11,
      name: 'Alpen-Enzian',
      label: 'Enzian',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#EAF0F8" stroke="#3B4651" stroke-width="2.2"/>' +
        '<path d="M50 72 L50 48" stroke="#2F7A4F" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M50 64 C40 60 36 50 36 44 C42 44 48 54 50 64 Z" fill="#2F7A4F" stroke="#3B4651" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M50 64 C60 60 64 50 64 44 C58 44 52 54 50 64 Z" fill="#2F7A4F" stroke="#3B4651" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M50 18 L64 34 L58 48 L42 48 L36 34 Z" fill="#2D5E9E" stroke="#3B4651" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<polygon points="50,18 56,32 50,44 44,32" fill="#4A7EC0"/>' +
        '<circle cx="50" cy="34" r="3" fill="#F2C14E" stroke="#3B4651" stroke-width="1.2"/>' +
        '<polygon points="50,48 45,54 55,54" fill="#2F7A4F" stroke="#3B4651" stroke-width="1.5"/>' +
        '<rect x="12" y="79" width="76" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="8.2" font-weight="900" fill="#3B4651" text-anchor="middle">Alpen-Enzian</text>' +
      '</svg>'
    },
    {
      id: 12,
      name: 'Eichel',
      label: 'Eichel',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">' +
        '<rect width="100" height="100" rx="10" fill="#F7F3EA" stroke="#3B4651" stroke-width="2.2"/>' +
        '<path d="M28 66 C22 56 26 44 32 38 C30 32 36 24 44 26 C48 20 58 20 62 26 C68 28 72 38 68 46 C74 52 70 62 62 66 Z" fill="#2F7A4F" stroke="#3B4651" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M48 24 L48 66" stroke="#25603E" stroke-width="1.8" stroke-linecap="round"/>' +
        '<ellipse cx="58" cy="54" rx="14" ry="16" fill="#9C6B46" stroke="#3B4651" stroke-width="2"/>' +
        '<path d="M44 44 C44 36 72 36 72 44 Z" fill="#6E4324" stroke="#3B4651" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<line x1="58" y1="36" x2="62" y2="28" stroke="#3B4651" stroke-width="2.2" stroke-linecap="round"/>' +
        '<circle cx="58" cy="69" r="1.5" fill="#3B4651"/>' +
        '<rect x="18" y="79" width="64" height="15" rx="5" fill="#FFFFFF" stroke="#3B4651" stroke-width="1.6"/>' +
        '<text x="50" y="90" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#3B4651" text-anchor="middle">Eichel</text>' +
      '</svg>'
    }
  ];

  function buildMemoryTasks(opts) {
    const rng = getRng(opts);
    const shuffle = (arr) => rng.mischen(arr);
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const maxGrade = (opts && opts.grade) || Math.max(...grades);
    const numPairs = (opts && opts.forPrint) ? 8 : (maxGrade <= 2 ? 4 : 6);

    // Deterministisch gemischter Pool heimischer Wald- & Alpentierkarten
    const pool = shuffle([...NATURE_CARD_DECK]);
    const chosenSet = pool.slice(0, numPairs);

    // Jedes Tier- / Naturkärtchen verdoppeln
    const cards = [];
    chosenSet.forEach(item => {
      cards.push({ pairId: item.id, content: item.svg, svg: item.svg, subtitle: item.name, isFlipped: false, isMatched: false });
      cards.push({ pairId: item.id, content: item.svg, svg: item.svg, subtitle: item.name, isFlipped: false, isMatched: false });
    });

    return [
      {
        fach: 'denken',
        schulstufe: maxGrade,
        grade: maxGrade,
        lehrplanRef: 'B-Wahrnehmung',
        type: 'memory',
        totalPairs: numPairs,
        matchedPairsCount: 0,
        cards: shuffle(cards),
        flippedIndices: [],
        isLocked: false,
        isCorrect: null,
      }
    ];
  }

  // 2. MUSTERFOLGEN & LOGIKREIHEN (Hohe mathematische & visuelle Varianz, 5 Aufgaben)
  function buildPatternsTasks(opts) {
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const shuffle = (arr) => rng.mischen(arr);
    if (opts && opts.forPrint) {
      const g = (opts && opts.grade) || 2;
      const patterns = [
        { seq: ['▲', '■', '●', '▲', '■'], next: '●', prompt: 'Welche Form kommt als Nächstes in der Reihe?' },
        { seq: ['★', '★', '●', '★', '★'], next: '●', prompt: 'Erkenne die logische Regel und setze das Symbol fort:' },
        { seq: ['◆', '▲', '◆', '▲', '◆'], next: '▲', prompt: 'Welches geometrische Zeichen folgt logisch?' },
        { seq: ['■', '■', '▲', '▲', '■'], next: '■', prompt: 'Führe das Muster folgerichtig weiter:' }
      ];
      return patterns.map(p => ({
        fach: 'denken',
        schulstufe: g,
        grade: g,
        lehrplanRef: `GT-${g}-Muster`,
        type: 'pattern',
        pattern: p.seq,
        answer: p.next,
        solutionText: p.next,
        prompt: `${p.prompt} ${p.seq.join(' ')} ___`
      }));
    }
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const isGrade1Only = grades.length === 1 && grades[0] === 1;
    const effectiveGrade = isGrade1Only ? 1 : Math.max(...grades);
    const tasks = [];

    if (isGrade1Only) {
      // 1. Klasse: Einfache Zahlenreihen (+1 oder +2) bis 20 (Keine Multiplikation!)
      const step1 = rand(1, 2);
      const start1 = rand(1, 8);
      const seq1 = [start1, start1 + step1, start1 + 2 * step1, start1 + 3 * step1, start1 + 4 * step1];
      const targetVal1 = seq1[4];

      tasks.push({
        fach: 'denken',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zahlenfolge fortsetzen:',
        displaySequence: [seq1[0], seq1[1], seq1[2], seq1[3], '?'],
        options: shuffle([targetVal1, targetVal1 + step1, targetVal1 - 1, targetVal1 + 2]),
        targetAnswer: targetVal1.toString(),
        hint: 'Vergleiche die ersten Zahlen: Um wie viel wird jede Zahl größer?',
        userAnswer: null,
        isCorrect: null,
      });

      // 1. Klasse Aufgabe 2: Zählen in 2er- oder 5er-Schritten
      const step2 = rng.int(0, 1) === 0 ? 2 : 5;
      const start2 = step2;
      const seq2 = [start2, start2 + step2, start2 + 2 * step2, start2 + 3 * step2, start2 + 4 * step2];
      const targetVal2 = seq2[4];

      tasks.push({
        fach: 'denken',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zähle weiter:',
        displaySequence: [seq2[0], seq2[1], seq2[2], seq2[3], '?'],
        options: shuffle([targetVal2, targetVal2 + step2, Math.max(1, targetVal2 - step2), targetVal2 + 1]),
        targetAnswer: targetVal2.toString(),
        hint: 'Achte auf den regelmäßigen Sprung von einer Zahl zur nächsten.',
        userAnswer: null,
        isCorrect: null,
      });

      // 1. Klasse Aufgabe 3: Rückwärts zählen (-1)
      const start3 = rand(6, 15);
      const seq3 = [start3, start3 - 1, start3 - 2, start3 - 3, start3 - 4];
      const targetVal3 = seq3[4];

      tasks.push({
        fach: 'denken',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Rückwärts zählen:',
        displaySequence: [seq3[0], seq3[1], seq3[2], seq3[3], '?'],
        options: shuffle([targetVal3, targetVal3 + 1, Math.max(1, targetVal3 - 1), targetVal3 + 2]),
        targetAnswer: targetVal3.toString(),
        hint: 'Hier zählen die Zahlen rückwärts!',
        userAnswer: null,
        isCorrect: null,
      });
    } else {
      // 2.–4. Klasse: Arithmetische Zahlenfolge (+2, +3, +4, +5 oder -3, -4)
      const step1 = rand(2, 6);
      const start1 = rand(2, 15);
      const seq1 = [start1, start1 + step1, start1 + 2 * step1, start1 + 3 * step1, start1 + 4 * step1];
      const targetVal1 = seq1[4];

      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zahlenfolge fortsetzen:',
        displaySequence: [seq1[0], seq1[1], seq1[2], seq1[3], '?'],
        options: shuffle([targetVal1, targetVal1 + step1, targetVal1 - 1, targetVal1 + 2]),
        targetAnswer: targetVal1.toString(),
        hint: 'Um wie viel wächst die Zahlenreihe von Schritt zu Schritt?',
        userAnswer: null,
        isCorrect: null,
      });

      // Aufgabe 2: Verdoppeln oder Mal-Reihe
      const base = rand(2, 4);
      const multSeq = [base, base * 2, base * 4, base * 8];
      const targetMult = base * 16;
      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Verdoppeln:',
        displaySequence: [multSeq[0], multSeq[1], multSeq[2], multSeq[3], '?'],
        options: shuffle([targetMult, targetMult - base, targetMult + 4, Math.max(1, targetMult - 4)]),
        targetAnswer: targetMult.toString(),
        hint: 'Wie verändert sich jede Zahl? Vergleiche die Zahl mit ihrer Vorgängerin.',
        userAnswer: null,
        isCorrect: null,
      });

      // Aufgabe 3: Rückwärtsfolge (-2, -3, -5)
      const step3 = rand(2, 5);
      const start3 = rand(25, 60);
      const seq3 = [start3, start3 - step3, start3 - 2 * step3, start3 - 3 * step3, start3 - 4 * step3];
      const targetVal3 = seq3[4];
      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Zahlenfolge rückwärts:',
        displaySequence: [seq3[0], seq3[1], seq3[2], seq3[3], '?'],
        options: shuffle([targetVal3, targetVal3 + step3, targetVal3 - step3, targetVal3 + 1]),
        targetAnswer: targetVal3.toString(),
        hint: 'Die Zahlen werden immer um dieselbe Zahl kleiner.',
        userAnswer: null,
        isCorrect: null,
      });
    }

    // Aufgabe 4 & 5: Bunte Symbol-Musterfolgen
    const symbolSets = [
      ['▲', '■', '▲', '■', '▲', '?', '■', ['■', '▲', '●', '◆']],
      ['●', '▲', '◆', '●', '▲', '?', '◆', ['◆', '●', '▲', '■']],
      ['★', '★', '●', '★', '★', '?', '●', ['●', '★', '▲', '◆']],
      ['◆', '▲', '◆', '▲', '◆', '?', '▲', ['▲', '◆', '●', '■']],
      ['■', '■', '▲', '▲', '■', '?', '■', ['■', '▲', '●', '◆']],
      ['▲', '●', '▲', '●', '▲', '?', '●', ['●', '▲', '■', '★']]
    ];

    const chosenSymbols = shuffle(symbolSets).slice(0, 2);
    chosenSymbols.forEach(chosenSymbol => {
      tasks.push({
        fach: 'denken',
        schulstufe: effectiveGrade,
        grade: effectiveGrade,
        lehrplanRef: 'B-Muster',
        type: 'pattern',
        title: 'Musterreihe ergänzen:',
        displaySequence: chosenSymbol.slice(0, 6),
        options: shuffle(chosenSymbol[7]),
        targetAnswer: chosenSymbol[6],
        hint: 'Schau dir an, welche Symbole sich regelmäßig wiederholen.',
        userAnswer: null,
        isCorrect: null,
      });
    });

    return tasks;
  }

  // 3. REIHENFOLGE SORTIEREN (Merkspiel: Zahlen von klein nach groß)
  // Stufengerecht: 1. Kl <= 20, 2. Kl <= 100, 3. Kl <= 1 000, 4. Kl <= 1 000 000
  function buildSequenceTasks(opts) {
    const rng = getRng(opts);
    const rand = (min, max) => rng.int(min, max);
    const shuffle = (arr) => rng.mischen(arr);
    if (opts && opts.forPrint) {
      const g = (opts && opts.grade) || 2;
      const tasks = [];
      for (let i = 0; i < 6; i++) {
        const step = rand(2, g === 1 ? 4 : 8);
        const start = rand(1, g === 1 ? 10 : 30);
        const seq = [start, start + step, start + 2 * step, start + 3 * step];
        const next1 = start + 4 * step;
        const next2 = start + 5 * step;
        tasks.push({
          fach: 'denken',
          type: 'sequence',
          schulstufe: g,
          grade: g,
          lehrplanRef: `GT-${g}-Zahlenreihen`,
          sequence: seq,
          step: step,
          answer: `${next1}, ${next2}`,
          solutionText: `${next1}, ${next2}`,
          prompt: `Setze die Zahlenreihe fort (+${step}): ${seq.join(', ')}, ___, ___`
        });
      }
      return tasks;
    }
    const grades = getEffectiveGrades([1, 2, 3, 4]);
    const maxGrade = Math.max(...grades);
    const nums = [];

    let minVal = 1;
    let maxVal = 20;

    if (maxGrade === 1) {
      minVal = 1;
      maxVal = 20;
    } else if (maxGrade === 2) {
      minVal = 5;
      maxVal = 99;
    } else if (maxGrade === 3) {
      minVal = 50;
      maxVal = 999;
    } else {
      minVal = 1000;
      maxVal = 999999;
    }

    while (nums.length < 5) {
      let n;
      if (maxGrade === 4) {
        n = rand(10, 950) * 1000;
      } else {
        n = rand(minVal, maxVal);
      }
      if (!nums.includes(n)) nums.push(n);
    }

    const sorted = [...nums].sort((a, b) => a - b);
    const shuffled = shuffle(nums);

    return [
      {
        fach: 'denken',
        schulstufe: maxGrade,
        grade: maxGrade,
        lehrplanRef: 'B-Folgen',
        type: 'sequence',
        instruction: 'Ordne die Zahlen von der kleinsten zur größten (mit dem Finger ziehen oder antippen):',
        pool: shuffled,
        slots: [null, null, null, null, null],
        targetSequence: sorted,
        isCorrect: null,
      }
    ];
  }

  function stampBrainTasks(tasks, isMemory = false) {
    if (!Array.isArray(tasks)) return tasks;
    return tasks.map(t => {
      if (!t || typeof t !== 'object') return t;
      if (!t.fach) t.fach = 'denken';
      if (!t.lehrplanStatus) t.lehrplanStatus = 'RIS';
      if (!t.druck) {
        if (isMemory || t.type === 'memory') {
          t.druck = 'nur-digital';
          t.druckHinweis = 'Memory erfordert das interaktive Aufdecken verdeckter Kartenpaare am Bildschirm und ist als Arbeitsblatt nicht sinnvoll.';
        } else {
          t.druck = 'ja';
          t.druckHinweis = '';
        }
      } else if (t.druck !== 'ja' && !t.druckHinweis) {
        t.druckHinweis = 'Didaktisch angepasste Druckausgabe.';
      }
      return t;
    });
  }

  return {
    buildMemoryTasks: (opts) => stampBrainTasks(buildMemoryTasks(opts), true),
    buildPatternsTasks: (opts) => stampBrainTasks(buildPatternsTasks(opts), false),
    buildSequenceTasks: (opts) => stampBrainTasks(buildSequenceTasks(opts), false),
  };
})();
