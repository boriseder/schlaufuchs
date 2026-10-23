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

  S.Texte = Texte;
})(typeof window !== 'undefined' ? (window.Schlaufuchs = window.Schlaufuchs || {}) : (globalThis.Schlaufuchs = globalThis.Schlaufuchs || {}));
