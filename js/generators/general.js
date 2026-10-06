// =============================================================
// SCHLAUFUCHS – js/generators/general.js
// Sachunterricht-Generatoren (BMBWF Lehrplan, StVO Österreich)
// Echte StVO Vektor-SVGs für Verkehrszeichen, kein falsches Emoji!
// Große Pools für Jahreskreis, Tiere im Winter, Österreich & Rad
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.General = (function () {
  'use strict';

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 1. JAHRESKREIS & KALENDER (1. – 2. Klasse, inkl. Jänner!)
  function buildCalendarTasks() {
    const pool = [
      {
        question: 'Wie heißt der erste Monat des Kalenderjahres in Österreich?',
        options: ['Jänner', 'Februar', 'März', 'Dezember'],
        correct: 0,
        hint: 'In Österreich sagt man traditionell Jänner.'
      },
      {
        question: 'Welcher Wochentag kommt direkt nach dem Donnerstag?',
        options: ['Freitag', 'Samstag', 'Mittwoch', 'Dienstag'],
        correct: 0,
        hint: 'Montag, Dienstag, Mittwoch, Donnerstag, ...'
      },
      {
        question: 'Welche Monate gehören zu den Frühlingsmonaten?',
        options: ['März, April, Mai', 'Juni, Juli, August', 'September, Oktober, November', 'Dezember, Jänner, Feber'],
        correct: 0,
        hint: 'Im Frühling erwacht die Natur, Ostern wird gefeiert.'
      },
      {
        question: 'Wie viele Tage hat eine ganz normale Woche?',
        options: ['7 Tage', '5 Tage', '6 Tage', '10 Tage'],
        correct: 0,
        hint: '5 Schultage plus 2 Tage Wochenende.'
      },
      {
        question: 'Wie viele Monate hat ein ganzes Jahr?',
        options: ['12 Monate', '10 Monate', '24 Monate', '7 Monate'],
        correct: 0,
        hint: 'Von Jänner bis Dezember.'
      },
      {
        question: 'Welche Jahreszeit folgt direkt auf den Herbst?',
        options: ['Winter', 'Frühling', 'Sommer', 'Jänner'],
        correct: 0,
        hint: 'Frühling, Sommer, Herbst, ...'
      },
      {
        question: 'Welcher Monat folgt direkt auf den Juli?',
        options: ['August', 'September', 'Juni', 'Mai'],
        correct: 0,
        hint: 'Die beiden großen Sommerferienmonate sind Juli und ...'
      },
      {
        question: 'Welcher Tag ist der letzte Tag der Arbeitswoche vor dem Wochenende?',
        options: ['Freitag', 'Sonntag', 'Mittwoch', 'Montag'],
        correct: 0,
        hint: 'Am Freitagmittag beginnt das Wochenende!'
      }
    ];

    const chosen = shuffle(pool).slice(0, 5);
    return chosen.map(item => ({
      fach: 'sachunterricht',
      schulstufe: 1,
      grade: 1,
      lehrplanRef: 'SU-1-2-Zeit-Jahreskreis',
      type: 'multiple-choice',
      icon: '📅',
      question: item.question,
      options: item.options,
      correctIndex: item.correct,
      correctText: item.options[item.correct],
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 2. HEIMISCHE TIERE IM WINTER (3. Klasse – Winterschlaf, Winterruhe, Winterstarre, Zugvögel)
  function buildWinterTasks() {
    const pool = [
      {
        animal: 'Igel',
        behavior: 'Winterschlaf (Körpertemperatur sinkt drastisch)',
        hint: 'Igel schlafen monatelang zusammengerollt in einem Laubhaufen.'
      },
      {
        animal: 'Eichhörnchen',
        behavior: 'Winterruhe (wacht regelmäßig auf, um Vorräte zu fressen)',
        hint: 'Eichhörnchen fressen Nüsse aus ihren versteckten Kobeln.'
      },
      {
        animal: 'Grasfrosch',
        behavior: 'Winterstarre (passt sich der Kälte an, bewegt sich nicht)',
        hint: 'Wechselwarme Amphibien verharren im Schlamm in Winterstarre.'
      },
      {
        animal: 'Rauchschwalbe',
        behavior: 'Zugvogel (fliegt im Herbst ins warme Afrika)',
        hint: 'Schwalben finden im Winter bei uns keine fliegenden Insekten.'
      },
      {
        animal: 'Kohlmeise',
        behavior: 'Standvogel (bleibt den ganzen Winter bei uns)',
        hint: 'Meisen besuchen im Winter gerne das Futterhäuschen.'
      },
      {
        animal: 'Murmeltier',
        behavior: 'Winterschlaf (schläft bis zu 6 Monate im Erdbau)',
        hint: 'Murmeltiere kuscheln sich im alpinen Bau zusammen.'
      },
      {
        animal: 'Dachs',
        behavior: 'Winterruhe (senkt Aktivität, schläft aber nicht durchgehend)',
        hint: 'Der Dachs hält im gemütlichen Dachsbau Winterruhe.'
      },
      {
        animal: 'Zauneidechse',
        behavior: 'Winterstarre (erstarrt bei Minusgraden)',
        hint: 'Eidechsen sind wechselwarm und können ihre Wärme nicht selbst regeln.'
      },
      {
        animal: 'Weißstorch',
        behavior: 'Zugvogel (zieht über tausende Kilometer nach Süden)',
        hint: 'Störche fliegen im Spätsommer nach Süden.'
      },
      {
        animal: 'Amsel',
        behavior: 'Standvogel (bleibt den Winter über im heimischen Garten)',
        hint: 'Amseln suchen Beeren und Futter im Schnee.'
      }
    ];

    const allBehaviors = [
      'Winterschlaf (Körpertemperatur sinkt drastisch)',
      'Winterruhe (wacht regelmäßig auf, um Vorräte zu fressen)',
      'Winterstarre (passt sich der Kälte an, bewegt sich nicht)',
      'Zugvogel (fliegt im Herbst ins warme Afrika)'
    ];

    const chosen = shuffle(pool).slice(0, 5);
    return chosen.map(item => ({
      fach: 'sachunterricht',
      schulstufe: 3,
      grade: 3,
      lehrplanRef: 'SU-3-Natur-Tiere-Winter',
      type: 'multiple-choice',
      icon: '❄️',
      question: `Wie verbringt das Tier den Winter?\nTier: ${item.animal}`,
      options: allBehaviors,
      correctIndex: allBehaviors.indexOf(item.behavior) !== -1 ? allBehaviors.indexOf(item.behavior) : 0,
      correctText: item.behavior,
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 3. ÖSTERREICH & HAUPTSTÄDTE (4. Klasse – 9 Bundesländer, Flüsse, Berge, Nachbarn)
  function buildAustriaTasks() {
    const states = [
      { state: 'Wien', capital: 'Wien' },
      { state: 'Niederösterreich', capital: 'St. Pölten' },
      { state: 'Oberösterreich', capital: 'Linz' },
      { state: 'Burgenland', capital: 'Eisenstadt' },
      { state: 'Steiermark', capital: 'Graz' },
      { state: 'Kärnten', capital: 'Klagenfurt' },
      { state: 'Salzburg', capital: 'Salzburg' },
      { state: 'Tirol', capital: 'Innsbruck' },
      { state: 'Vorarlberg', capital: 'Bregenz' }
    ];

    const geographyPool = [
      {
        question: 'Wie heißt der höchste Berg Österreichs?',
        options: ['Großglockner (3\u00A0798\u00A0m)', 'Zugspitze', 'Mont Blanc', 'Dachstein'],
        correct: 0,
        hint: 'Der Großglockner liegt zwischen Kärnten und Tirol.'
      },
      {
        question: 'Welcher ist der längste Fluss, der durch Österreich fließt?',
        options: ['Donau', 'Rhein', 'Inn', 'Salzach'],
        correct: 0,
        hint: 'Die Donau fließt durch Wien, Linz und viele andere Städte.'
      },
      {
        question: 'Wie viele Nachbarstaaten grenzen an Österreich?',
        options: ['8 Nachbarstaaten', '6 Nachbarstaaten', '9 Nachbarstaaten', '4 Nachbarstaaten'],
        correct: 0,
        hint: 'Deutschland, Tschechien, Slowakei, Ungarn, Slowenien, Italien, Schweiz, Liechtenstein.'
      },
      {
        question: 'Wie viele Bundesländer hat die Republik Österreich?',
        options: ['9 Bundesländer', '8 Bundesländer', '10 Bundesländer', '7 Bundesländer'],
        correct: 0,
        hint: 'Österreich besteht aus 9 Bundesländern.'
      },
      {
        question: 'Welcher große See liegt im Bundesland Burgenland?',
        options: ['Neusiedler See', 'Wörthersee', 'Bodensee', 'Attersee'],
        correct: 0,
        hint: 'Der flache Steppensee im Burgenland heißt Neusiedler See.'
      }
    ];

    const tasks = [];

    // 3 Fragen zu Bundesländern
    const chosenStates = shuffle(states).slice(0, 3);
    chosenStates.forEach(item => {
      const wrongCapitals = states.filter(s => s.capital !== item.capital).map(s => s.capital);
      const options = shuffle([item.capital, ...shuffle(wrongCapitals).slice(0, 3)]);
      tasks.push({
        fach: 'sachunterricht',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'SU-4-Raum-Oesterreich',
        type: 'multiple-choice',
        icon: '🇦🇹',
        question: `Wie heißt die Landeshauptstadt des Bundeslandes ${item.state}?`,
        options: options,
        correctIndex: options.indexOf(item.capital),
        correctText: item.capital,
        hint: `Tipp: Liegt im Bundesland ${item.state}.`,
        selectedText: null,
        isCorrect: null,
      });
    });

    // 2 geografische Fragen
    const chosenGeo = shuffle(geographyPool).slice(0, 2);
    chosenGeo.forEach(geoItem => {
      tasks.push({
        fach: 'sachunterricht',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'SU-4-Raum-Oesterreich',
        type: 'multiple-choice',
        icon: '⛰️',
        question: geoItem.question,
        options: geoItem.options,
        correctIndex: geoItem.correct,
        correctText: geoItem.options[geoItem.correct],
        hint: geoItem.hint,
        selectedText: null,
        isCorrect: null,
      });
    });

    return tasks;
  }

  // 4. FREIWILLIGE RADFAHRPRÜFUNG (4. Klasse – STRENG MIT ECHTEN STVO-SVGs!)
  function buildTrafficTasks() {
    const signs = window.Schlaufuchs.Signs;

    const pool = [
      {
        signId: 'vorrang-geben',
        question: 'Was bedeutet dieses Verkehrszeichen nach der österreichischen StVO?',
        options: [
          'Vorrang geben (dem Querverkehr Vorrang gewähren)',
          'Du hast selbst immer Vorrang',
          'Hier dürfen keine Fahrräder fahren',
          'Achtung Gefahrenstelle'
        ],
        correct: 0,
        hint: 'Weißes Dreieck auf der Spitze mit rotem Rand: Querverkehr hat Vorrang!'
      },
      {
        signId: 'stop',
        question: 'Was musst du bei dieser Stopp-Tafel (Halt! Vorrang geben) IMMER tun?',
        options: [
          'Vor der Haltelinie komplett anhalten (Stillstand!) und Vorrang geben',
          'Langsam ohne Anhalten weiterrollen, wenn frei ist',
          'Nur anhalten, wenn ein Auto kommt',
          'Schnell über die Kreuzung huschen'
        ],
        correct: 0,
        hint: 'Rotes Stoppschild bedeutet zwingenden Stillstand der Räder!'
      },
      {
        signId: 'vorrangstrasse',
        question: 'Was zeigt dieses gelbe Schild mit weißem Rand (Raute) an?',
        options: [
          'Vorrangstraße (Fahrzeuge auf dieser Straße haben Vorrang)',
          'Vorsicht Baustelle',
          'Ende des Gehwegs',
          'Hier gilt Rechtsvorrang'
        ],
        correct: 0,
        hint: 'Auf der Vorrangstraße hast du Vorrang gegenüber einmündenden Straßen.'
      },
      {
        signId: 'radweg',
        question: 'Welches Verkehrszeichen siehst du hier?',
        options: [
          'Radweg (nur für Radfahrende vorgeschrieben)',
          'Fahrverbot für Fahrräder',
          'Hier dürfen Autos fahren',
          'Achtung Radfahrer auf der Fahrbahn'
        ],
        correct: 0,
        hint: 'Blauer Kreis mit weißem Fahrrad: Ein Radweg mit Benützungspflicht.'
      },
      {
        signId: 'schutzweg',
        question: 'Was bedeutet dieses blaue Quadrat mit Fußgänger?',
        options: [
          'Schutzweg (Zebrastreifen) – Fußgängern sicheres Überqueren ermöglichen',
          'Fußgängerzone – Radfahren verboten',
          'Start einer Laufstrecke',
          'Sackgasse'
        ],
        correct: 0,
        hint: 'Am Zebrastreifen haben Fußgänger Vorrang!'
      },
      {
        signId: 'fahrverbot',
        question: 'Was bestimmt dieser weiße Kreis mit rotem Rand?',
        options: [
          'Fahrverbot für alle Fahrzeuge in beiden Richtungen',
          'Vorrangstraße beginnt',
          'Kreisverkehr voraus',
          'Parken erlaubt'
        ],
        correct: 0,
        hint: 'Weiß mit rotem Ring verbietet jede Fahrt in beide Richtungen.'
      },
      {
        signId: 'einfahrt-verboten',
        question: 'Was bedeutet diese rote Scheibe mit dem weißen Querbalken?',
        options: [
          'Einfahrt verboten (Einbahnstraße von der falschen Seite)',
          'Hier ist Halten verboten',
          'Vorrang geben an der Kreuzung',
          'Sackgasse'
        ],
        correct: 0,
        hint: 'In diese Straße darfst du aus dieser Richtung auf keinen Fall einfahren!'
      },
      {
        signId: 'gefahrenstelle',
        question: 'Was signalisiert das weiße Dreieck mit der Spitze nach oben und dem Rufzeichen?',
        options: [
          'Gefahrenstelle (erhöhte Aufmerksamkeit geboten)',
          'Vorrang geben',
          'Stopp-Tafel',
          'Radweg beginnt'
        ],
        correct: 0,
        hint: 'Dreieck mit Spitze oben und Ausrufezeichen warnt vor Gefahrenstellen.'
      },
      {
        signId: 'kreisverkehr',
        question: 'Was bedeutet der blaue Kreis mit den kreisförmigen weißen Pfeilen?',
        options: [
          'Kreisverkehr (Fahrtrichtung gegen den Uhrzeigersinn)',
          'Wendemöglichkeit für LKW',
          'Geschlossene Spielstraße',
          'Fahrverbot'
        ],
        correct: 0,
        hint: 'Pfeile im Kreis zeigen die vorgeschriebene Fahrtrichtung im Kreisverkehr.'
      },
      {
        signId: null, // Reine Regelfrage zur Vorrangregel
        question: 'Welche Grundregel gilt an einer Kreuzung OHNE Verkehrszeichen und ohne Ampel?',
        options: [
          'Rechtsvorrang (der von rechts Kommende hat Vorrang)',
          'Der Schnellere darf zuerst fahren',
          'Autos haben immer Vorrang vor Fahrrädern',
          'Wer geradeaus fährt, hat immer Vorrang'
        ],
        correct: 0,
        hint: 'In Österreich gilt immer Rechtsvorrang, wenn keine Schilder da sind!'
      },
      {
        signId: null, // Ausrüstungsfrage
        question: 'Was gehört zwingend zu einem verkehrssicheren Fahrrad in Österreich?',
        options: [
          'Weißer Scheinwerfer vorne, rotes Rücklicht, Reflektoren, 2 Bremsen, Klingel',
          'Nur ein Helm und ein Fahrradkorb',
          'Ein Tacho und bunte Reifen',
          'Mindestens 21 Gänge'
        ],
        correct: 0,
        hint: 'Licht, zwei voneinander unabhängige Bremsen, Klingel und Rückstrahler sind gesetzlich vorgeschrieben.'
      }
    ];

    const chosen = shuffle(pool).slice(0, 5);
    return chosen.map(item => {
      let customHtml = '';
      if (item.signId && signs) {
        customHtml = signs.getSignSvg(item.signId);
      }

      return {
        fach: 'sachunterricht',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'SU-4-Verkehr-Radfahrpruefung',
        type: 'multiple-choice',
        icon: item.signId ? null : '🚲',
        customVisualHtml: customHtml,
        question: item.question,
        options: item.options,
        correctIndex: item.correct,
        correctText: item.options[item.correct],
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 5. SICHERER SCHULWEG & VERKEHR (1. bis 3. Klasse)
  function buildSchoolWalkTasks() {
    const signs = window.Schlaufuchs.Signs;

    const pool = [
      {
        signId: 'schutzweg',
        question: 'Was zeigt dieses blaue Verkehrszeichen an?',
        options: [
          'Schutzweg (Zebrastreifen für sicheres Queren)',
          'Hier dürfen Autos schnell fahren',
          'Spielplatz',
          'Radrennbahn'
        ],
        correct: 0,
        hint: 'Blaues Quadrat mit weißem Überweg: Hier ist ein Schutzweg.'
      },
      {
        question: 'Wie überquerst du die Fahrbahn an einem Schutzweg (Zebrastreifen) richtig?',
        options: [
          'Am Randstein stehen bleiben, links-rechts-links schauen, Blickkontakt und erst gehen wenn Räder stehen',
          'Sofort und ohne Schauen mit vollem Tempo hinüberrennen',
          'Rückwärts über die Straße gehen',
          'Auf die Straße springen, damit Autos bremsen müssen'
        ],
        correct: 0,
        hint: 'Halt an der Kante, schau nach links, rechts und wieder links!'
      },
      {
        question: 'Was musst du bei einer Fußgängerampel beachten, wenn das rote Männchen leuchtet?',
        options: [
          'Stehen bleiben und warten, bis die Ampel auf Grün schaltet',
          'Schnell noch hinüberhuschen',
          'Den Autofahrern die Zunge herausstrecken',
          'Im Kreis hüpfen'
        ],
        correct: 0,
        hint: 'Rot heißt Stopp! Bei Rot darfst du niemals die Straße betreten.'
      },
      {
        question: 'Auf welcher Seite des Gehsteigs gehst du am sichersten zur Schule?',
        options: [
          'Auf der Hausseite (innen, möglichst weit weg vom fließenden Verkehr)',
          'Ganz nah am Randstein, direkt neben den vorbeifahrenden Autos',
          'Direkt auf der Fahrbahn',
          'Auf dem Zaun balancieren'
        ],
        correct: 0,
        hint: 'Gehe immer auf der Hausseite, um vor Autos geschützt zu sein.'
      },
      {
        question: 'Warum sind im Herbst und Winter Reflektoren an der Schultasche und helle Kleidung so wichtig?',
        options: [
          'Weil dich Autofahrer in der Dämmerung und bei Nebel viel früher erkennen',
          'Weil dunkle Farben an der Schule verboten sind',
          'Damit man schneller laufen kann',
          'Weil die Schultasche sonst zu schwer wird'
        ],
        correct: 0,
        hint: 'Reflektoren leuchten das Scheinwerferlicht zurück und schützen dich!'
      },
      {
        signId: 'geh-radweg',
        question: 'Was bedeutet dieses blaue Verkehrszeichen?',
        options: [
          'Gemeinsamer Geh- und Radweg (Rücksichtnahme aufeinander!)',
          'Autobahn',
          'Reine Fußgängerzone ohne Fahrräder',
          'Fahrverbot für alle'
        ],
        correct: 0,
        hint: 'Fußgänger und Radfahrer teilen sich hier gemeinsam den Weg.'
      }
    ];

    const chosen = shuffle(pool).slice(0, 5);
    return chosen.map(item => {
      let customHtml = null;
      if (item.signId && signs) {
        customHtml = signs.getSignSvg(item.signId);
      }

      return {
        fach: 'sachunterricht',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'SU-1-Verkehr-Schulweg',
        type: 'multiple-choice',
        icon: item.signId ? null : '🚶',
        customVisualHtml: customHtml,
        question: item.question,
        options: item.options,
        correctIndex: item.correct,
        correctText: item.options[item.correct],
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  return {
    buildCalendarTasks: buildCalendarTasks,
    buildWinterTasks: buildWinterTasks,
    buildAustriaTasks: buildAustriaTasks,
    buildTrafficTasks: buildTrafficTasks,
    buildSchoolWalkTasks: buildSchoolWalkTasks,
  };
})();
