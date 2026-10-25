// =============================================================
// SCHLAUFUCHS – js/core/texte.js
// Zentrale Textbausteine & Lektorat für kindgerechte Rückmeldungen
// Grundsatz: Keine Bestrafung, kein "falsch", Lob für Ausdauer & Weg
// =============================================================

(function (S) {
  'use strict';

  const Texte = {
    allgemein: {
      weiter: 'Weiter',
      nochmal: 'Nochmal',
      fertig: 'Fertig',
      pruefen: 'Überprüfen',
      vorlesen: 'Vorlesen',
      zurueck: 'Zurück',
      hilfe: 'Tipp',
      abbrechenTitel: 'Übung beenden?',
      abbrechenFrage: 'Möchtest du später hier weitermachen?',
      abbrechenJa: 'Ja, Pause machen',
      abbrechenNein: 'Weiter üben'
    },
    lob: [
      'Toll mitgedacht!',
      'Schritt für Schritt ans Ziel!',
      'Großartige Ausdauer!',
      'Du hast den Rechenweg super angewendet.',
      'Ganz genau hingeschaut!',
      'Klasse gelöst!'
    ],
    nochmal: [
      'Gleich noch einmal probieren.',
      'Fast geschafft! Schau noch einmal genau hin.',
      'Überlege in Ruhe und versuche es noch einmal.',
      'Ein kleiner Schritt fehlt noch.',
      'Nimm dir Zeit für den zweiten Versuch.'
    ],
    pause: {
      titel: 'Zeit für eine kleine Bewegungspause!',
      text: 'Du hast fleißig geübt. Steh kurz auf, strecke deine Arme nach oben und trinke einen Schluck Wasser.'
    },
    abschluss: {
      titel: 'Serie geschafft!',
      untertitel: 'Du hast alle Aufgaben dieser Serie abgeschlossen.',
      knopf: 'Zurück zur Übersicht'
    }
  };

  // Liste kindgerechter österreichischer Geheimwörter für Druck-Arbeitsblätter & Sammelalbum (SSOT)
  const SECRET_WORDS_BY_LENGTH = {
    3: ['UHU', 'MUT', 'BÄR', 'ROT', 'AST', 'SEE', 'TAG'],
    4: ['WALD', 'IGEL', 'EULE', 'BERG', 'HERZ', 'WOLF', 'BAUM', 'LUFT', 'GOLD', 'BLAU', 'HAUS', 'MAUS'],
    5: ['FUCHS', 'STERN', 'WIESE', 'BLUME', 'SONNE', 'BIBER', 'TAFEL', 'VOGEL', 'KOBEL', 'ZEBRA', 'KÖNIG'],
    6: ['SCHLAU', 'WINTER', 'SOMMER', 'SCHNEE', 'HERBST', 'SCHULE', 'RAKETE', 'BÜCHER', 'FREUND', 'PAPIER', 'LEHRER', 'WISSEN', 'SCHATZ'],
    7: ['FREUNDE', 'ZEICHEN', 'MEISTER', 'STERNEN', 'DRACHEN', 'KOBOLDE', 'TAUSEND'],
    8: ['FUCHSBAU', 'SCHLAUER', 'WALDKAUZ', 'TAUSENDE', 'KÖNIGIN', 'LESEFEST', 'SCHULHOF'],
    10: ['WINTERZEIT', 'BERGBLUMEN', 'SCHULSTART', 'LESESCHATZ', 'ZAUBERWALD'],
    12: ['RECHENKÖNIGE', 'ZAHLENZAUBER', 'WINTERZAUBER', 'SCHATZSUCHER', 'MEISTERSTERN', 'BÜCHERSCHATZ']
  };

  const VALID_SECRET_WORDS = Array.from(new Set([
    ...Object.values(SECRET_WORDS_BY_LENGTH).flat(),
    'FUCHS', 'SCHLAU', 'WALD', 'BIBER', 'IGEL', 'EULE', 'SONNE', 'BLUME',
    'WIESE', 'STERN', 'RAKETE', 'KOBEL', 'WINTER', 'SOMMER', 'HERBST',
    'SCHNEE', 'SCHULE', 'PAPIER', 'FREUNDE', 'SCHATZ', 'BÜCHER', 'WALDKAUZ',
    'FUCHSBAU', 'ZEBRA', 'TAUSEND', 'MEISTER', 'KÖNIG', 'HERZ'
  ]));

  Texte.geheimwoerter = SECRET_WORDS_BY_LENGTH;
  Texte.gueltigeGeheimwoerter = VALID_SECRET_WORDS;

  S.SecretWords = {
    byLength: SECRET_WORDS_BY_LENGTH,
    all: VALID_SECRET_WORDS
  };

  S.Texte = Texte;
})(typeof window !== 'undefined' ? (window.Schlaufuchs = window.Schlaufuchs || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}));
