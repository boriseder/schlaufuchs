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

  // Zentrale Hilfsfunktion aus Core (Zufallsmischen)
  const shuffle = (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.mischen) || (arr => [...arr].sort(() => Math.random() - 0.5));

  // 1. JAHRESKREIS & KALENDER (1. – 2. Klasse, inkl. Jänner!)
  function buildCalendarTasks(opts) {
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

    const chosen = (opts && opts.all) ? pool : shuffle(pool).slice(0, 5);
    return chosen.map(item => {
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);
      return {
        fach: 'sachunterricht',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'SU-1-2-Zeit-Jahreskreis',
        type: 'multiple-choice',
        icon: '📅',
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 2. HEIMISCHE TIERE IM WINTER (3. Klasse – Winterschlaf, Winterruhe, Winterstarre, Zugvögel)
  function buildWinterTasks(opts) {
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
        behavior: 'Zugvogel (fliegt im Herbst in den warmen Süden)',
        hint: 'Schwalben finden im Winter bei uns keine fliegenden Insekten.'
      },
      {
        animal: 'Kohlmeise',
        behavior: 'Standvogel (bleibt den ganzen Winter bei uns)',
        hint: 'Meisen besuchen im Winter gerne das Futterhäuschen.'
      },
      {
        animal: 'Murmeltier',
        behavior: 'Winterschlaf (Körpertemperatur sinkt drastisch)',
        hint: 'Murmeltiere kuscheln sich im alpinen Bau zusammen und schlafen bis zu 6 Monate.'
      },
      {
        animal: 'Dachs',
        behavior: 'Winterruhe (wacht regelmäßig auf, um Vorräte zu fressen)',
        hint: 'Der Dachs hält im gemütlichen Dachsbau Winterruhe und schläft nicht durchgehend.'
      },
      {
        animal: 'Zauneidechse',
        behavior: 'Winterstarre (passt sich der Kälte an, bewegt sich nicht)',
        hint: 'Eidechsen sind wechselwarm und erstarren bei Minusgraden.'
      },
      {
        animal: 'Weißstorch',
        behavior: 'Zugvogel (fliegt im Herbst in den warmen Süden)',
        hint: 'Störche fliegen im Spätsommer tausende Kilometer nach Süden.'
      },
      {
        animal: 'Amsel',
        behavior: 'Standvogel (bleibt den ganzen Winter bei uns)',
        hint: 'Amseln suchen Beeren und Futter im Schnee und bleiben den Winter über im Garten.'
      }
    ];

    const allBehaviors = [
      'Winterschlaf (Körpertemperatur sinkt drastisch)',
      'Winterruhe (wacht regelmäßig auf, um Vorräte zu fressen)',
      'Winterstarre (passt sich der Kälte an, bewegt sich nicht)',
      'Zugvogel (fliegt im Herbst in den warmen Süden)',
      'Standvogel (bleibt den ganzen Winter bei uns)'
    ];

    const chosen = (opts && opts.all) ? pool : shuffle(pool).slice(0, 5);
    return chosen.map(item => {
      const wrongBehaviors = allBehaviors.filter(b => b !== item.behavior);
      const options = shuffle([item.behavior, ...shuffle(wrongBehaviors).slice(0, 3)]);

      return {
        fach: 'sachunterricht',
        schulstufe: 3,
        grade: 3,
        lehrplanRef: 'SU-3-Natur-Tiere-Winter',
        type: 'multiple-choice',
        icon: '❄️',
        question: `Wie verbringt das Tier den Winter?\nTier: ${item.animal}`,
        options: options,
        correctIndex: options.indexOf(item.behavior),
        correctText: item.behavior,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 3. ÖSTERREICH & HAUPTSTÄDTE (4. Klasse – 9 Bundesländer, Flüsse, Berge, Nachbarn)
  function buildAustriaTasks(opts) {
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

    // 3 Fragen zu Bundesländern (oder alle 9 für QS)
    const chosenStates = (opts && opts.all) ? states : shuffle(states).slice(0, 3);
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

    // 2 geografische Fragen (oder alle für QS)
    const chosenGeo = (opts && opts.all) ? geographyPool : shuffle(geographyPool).slice(0, 2);
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
  function buildTrafficTasks(opts) {
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

    const chosen = (opts && opts.all) ? pool : shuffle(pool).slice(0, 5);
    return chosen.map(item => {
      let customHtml = '';
      if (item.signId && signs) {
        customHtml = signs.getSignSvg(item.signId);
      }
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);

      return {
        fach: 'sachunterricht',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'SU-4-Verkehr-Radfahrpruefung',
        type: 'multiple-choice',
        icon: null,
        customVisualHtml: customHtml,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 5. SICHERER SCHULWEG & VERKEHR (1. bis 3. Klasse – BMBWF Lehrplan, StVO Österreich)
  function buildSchoolWalkTasks(opts) {
    const signs = window.Schlaufuchs.Signs;

    const pool = [
      // SÄULE 1: SCHUTZWEG & STRASSE QUEREN
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
        question: 'Was bedeutet die Stopp-Formel beim Queren einer Straße vor dem Betreten der Fahrbahn?',
        options: [
          'Stehen bleiben, links schauen, rechts schauen, nochmals links schauen',
          'Augen schließen und schnell loslaufen',
          'Nur nach rechts schauen',
          'Sofort losgehen, wenn kein lautes Geräusch zu hören ist'
        ],
        correct: 0,
        hint: 'Bleib am Randstein stehen und schau immer links, rechts und nochmals links.'
      },
      {
        question: 'Ein Auto nähert sich dem Zebrastreifen und bremst ab. Wann darfst du losgehen?',
        options: [
          'Erst wenn das Auto wirklich ganz stillsteht und du Blickkontakt mit dem Lenker hast',
          'Sobald das Auto langsamer wird, auch wenn es noch rollt',
          'Sofort loslaufen, ohne auf den Fahrer zu achten',
          'Wenn das Auto hupt'
        ],
        correct: 0,
        hint: 'Warte immer, bis die Räder des Autos komplett stillstehen!'
      },
      {
        question: 'Warum darfst du niemals zwischen zwei parkenden Autos auf die Fahrbahn treten?',
        options: [
          'Weil dich herannahende Autofahrer hinter den Autos erst viel zu spät sehen können',
          'Weil die parkenden Autos schmutzig sind',
          'Weil man dort nicht schnell rennen kann',
          'Weil die Schultasche hängen bleiben könnte'
        ],
        correct: 0,
        hint: 'Parkende Fahrzeuge verdecken die Sicht. Suche immer eine freie Stelle mit gutem Überblick!'
      },

      // SÄULE 2: GEHSTEIG & STRASSEN OHNE GEHSTEIG
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
        question: 'Du gehst auf einer Straße im Ortsgebiet oder am Land, die KEINEN Gehsteig hat. Auf welcher Seite musst du gehen?',
        options: [
          'Auf der linken Straßenseite, damit du den entgegenkommenden Autos ins Gesicht schaust',
          'Auf der rechten Straßenseite mit dem Rücken zum Verkehr',
          'Mitten auf der Fahrbahn',
          'Es ist völlig egal, auf welcher Seite man geht'
        ],
        correct: 0,
        hint: 'Ohne Gehsteig immer links gehen! So siehst du herannahende Autos rechtzeitig.'
      },
      {
        question: 'Darfst du auf dem Randstein direkt an der Straßenkante balancieren?',
        options: [
          'Nein, das ist gefährlich, weil man leicht vor ein vorbeifahrendes Auto stolpern kann',
          'Ja, das schult das Gleichgewicht auf dem Schulweg',
          'Ja, aber nur wenn man schnell rennt',
          'Ja, wenn man die Arme ausbreitet'
        ],
        correct: 0,
        hint: 'Der Randstein ist die Grenze zur Fahrbahn. Halte immer Abstand!'
      },
      {
        question: 'Ein Ball rollt beim Spielen plötzlich auf die Fahrbahn. Wie verhältst du dich richtig?',
        options: [
          'Sofort am Randstein anhalten, erst die Straße prüfen und Erwachsene um Hilfe bitten',
          'Sofort hinterherrennen, bevor ein Auto drüberfährt',
          'Blind auf die Straße springen',
          'Dem Ball nachschreien und weinen'
        ],
        correct: 0,
        hint: 'Ein Ball kann ersetzt werden – dein Leben nicht! Bleib immer sofort stehen.'
      },

      // SÄULE 3: AMPEL, SCHÜLERLOTSEN & EXEKUTIVE
      {
        question: 'Was musst du bei einer Fußgängerampel beachten, wenn das rote Männchen leuchtet?',
        options: [
          'Stehen bleiben und warten, bis das grüne Männchen aufleuchtet',
          'Schnell noch hinüberhuschen',
          'Den Autofahrern die Zunge herausstrecken',
          'Im Kreis hüpfen'
        ],
        correct: 0,
        hint: 'Rot heißt Stopp! Bei Rot darfst du niemals die Straße betreten.'
      },
      {
        question: 'Du bist mitten auf der Straße und die Fußgängerampel schaltet auf Rot. Was tust du?',
        options: [
          'Ruhig und zügig weitergehen bis zum anderen Gehsteig (nicht umdrehen)',
          'Sofort erschrocken umdrehen und zurückrennen',
          'Mitten auf der Straße stehen bleiben',
          'Dich auf den Boden setzen'
        ],
        correct: 0,
        hint: 'Keine Panik: Die Räumphase reicht aus. Gehe zügig und sicher weiter zur anderen Straßenseite.'
      },
      {
        question: 'Was bedeutet es, wenn ein Schülerlotse mit einer Kelle an der Straße steht?',
        options: [
          'Er sichert den Schulweg – alle Kinder und Autos müssen seine Anweisungen beachten',
          'Er macht Straßenmusik',
          'Er verkauft Eis an Schulkinder',
          'Er möchte mit den Kindern Fangen spielen'
        ],
        correct: 0,
        hint: 'Schülerlotsen helfen Schülern beim sicheren Überqueren der Straße.'
      },
      {
        question: 'Wie verhältst du dich, wenn ein Polizist an der Kreuzung den Verkehr mit Handzeichen regelt?',
        options: [
          'Die Handzeichen der Polizei gelten vor allen Ampeln und Schildern – ich folge den Zeichen des Polizisten',
          'Ich achte nur auf die Ampel, egal was der Polizist anzeigt',
          'Ich laufe einfach quer über die Kreuzung',
          'Ich warte, bis der Polizist weggeht'
        ],
        correct: 0,
        hint: 'Polizeizeichen stehen an erster Stelle und haben Vorrang vor Ampeln und Schildern!'
      },

      // SÄULE 4: SICHTBARKEIT & VERHALTEN ALS MITFAHRER
      {
        question: 'Warum sind im Herbst und Winter Reflektoren an der Schultasche und helle Kleidung so wichtig?',
        options: [
          'Weil dich Autofahrer im Scheinwerferlicht schon aus über 140 Metern Entfernung erkennen',
          'Weil dunkle Farben an der Schule verboten sind',
          'Damit man schneller laufen kann',
          'Weil die Schultasche sonst zu schwer wird'
        ],
        correct: 0,
        hint: 'Reflektoren leuchten das Scheinwerferlicht zurück und schützen dich in der Dunkelheit!'
      },
      {
        question: 'Aus welcher Autotür solltest du vor der Schule immer aussteigen?',
        options: [
          'Immer zur Gehsteigseite (rechts), geschützt vor dem fließenden Verkehr',
          'Immer zur Straßenseite (links), damit man direkt auf die Fahrbahn kommt',
          'Aus dem Kofferraum',
          'Aus dem Schiebedach'
        ],
        correct: 0,
        hint: 'Steige immer zur sicheren Gehsteigseite aus, niemals zur Fahrbahn!'
      },
      {
        question: 'Bis zu welchem Alter oder welcher Körpergröße müssen Kinder im Auto einen Kindersitz verwenden?',
        options: [
          'Bis 14 Jahre oder bis sie mindestens 135 cm groß sind',
          'Nur bis zum 3. Geburtstag',
          'Nur wenn die Polizei zuschaut',
          'Kinder brauchen ab der 1. Klasse nie wieder einen Kindersitz'
        ],
        correct: 0,
        hint: 'In Österreich gilt die Kindersitzpflicht bis 14 Jahre bzw. 135 cm Körpergröße.'
      },
      {
        question: 'Was versteht man unter dem „toten Winkel“ bei einem großen LKW oder Bus?',
        options: [
          'Einen Bereich rund um das Fahrzeug, den der Fahrer trotz Spiegeln nicht einsehen kann',
          'Einen kaputten Blinker am LKW',
          'Eine Ecke im Schulhof',
          'Einen besonders spitzen Straßenrand'
        ],
        correct: 0,
        hint: 'Halte großen Abstand zu LKW und Bussen – der Fahrer kann dich im toten Winkel nicht sehen!'
      },
      {
        question: 'Warum ist es gefährlich, auf dem Schulweg Kopfhörer mit lauter Musik zu tragen oder aufs Handy zu schauen?',
        options: [
          'Weil man herannahende Fahrzeuge, Klingeln und Warnsignale nicht rechtzeitig wahrnimmt',
          'Weil Kopfhörer am Gehsteig verboten sind',
          'Weil der Akku vom Smartphone leer wird',
          'Weil die Kopfhörer nass werden könnten'
        ],
        correct: 0,
        hint: 'Sehen und Hören sind überlebenswichtig im Straßenverkehr. Sei immer aufmerksam!'
      },

      // SÄULE 5: VERKEHRSZEICHEN NACH STVO
      {
        signId: 'achtung-kinder',
        question: 'Was signalisiert dieses dreieckige Verkehrszeichen mit dem roten Rand und den beiden Kindern?',
        options: [
          'Achtung Kinder! Autofahrer müssen besonders aufmerksam und bremsbereit fahren',
          'Hier dürfen Kinder mit dem Moped fahren',
          'Hier ist Rennen auf der Fahrbahn Pflicht',
          'Ende der Schule'
        ],
        correct: 0,
        hint: 'Dreieck mit Spitze oben und rotem Rand: Achtung Kinder kreuzen oder sind in der Nähe!'
      },
      {
        signId: 'wohnstrasse',
        question: 'Was gilt in einer mit diesem blauen Verkehrszeichen gekennzeichneten Wohnstraße?',
        options: [
          'Kinder dürfen auf der Straße spielen und Autos dürfen nur im Schritttempo fahren',
          'Hier dürfen Autos mit 50 km/h durchfahren',
          'Radfahren ist streng verboten',
          'Fußgänger müssen Autos immer sofort Platz machen'
        ],
        correct: 0,
        hint: 'In der Wohnstraße dürfen Kinder spielen, Lenker müssen im Schritttempo fahren!'
      },
      {
        signId: 'begegnungszone',
        question: 'Was bedeutet dieses blaue Verkehrszeichen mit der Zahl 20 (Begegnungszone)?',
        options: [
          'Fußgänger dürfen die gesamte Fahrbahn nützen, Höchstgeschwindigkeit beträgt 20 km/h',
          'Hier dürfen nur 20 Autos am Tag fahren',
          'Nur für Kinder ab 20 Jahren erlaubt',
          'Hier darf man 100 km/h schnell fahren'
        ],
        correct: 0,
        hint: 'In der Begegnungszone teilen sich alle Verkehrsteilnehmer die Straße bei maximal 20 km/h.'
      },
      {
        signId: 'gehweg',
        question: 'Was bedeutet dieses runde blaue Verkehrszeichen mit den weißen Fußgängern?',
        options: [
          'Reiner Gehweg (dieser Weg ist ausschließlich für Fußgänger reserviert)',
          'Autobahnauffahrt',
          'Parkplatz für LKWs',
          'Hier dürfen alle Fahrzeuge schnell fahren'
        ],
        correct: 0,
        hint: 'Rundes blaues Schild: Gebot! Dieser Weg ist allein für Fußgänger bestimmt.'
      },
      {
        signId: 'geh-radweg',
        question: 'Was bedeutet dieses blaue Verkehrszeichen mit der weißen Trennlinie?',
        options: [
          'Getrennter Geh- und Radweg (Fußgänger und Radfahrer haben getrennte Bahnen)',
          'Autobahn',
          'Reine Fußgängerzone ohne Fahrräder',
          'Fahrverbot für alle'
        ],
        correct: 0,
        hint: 'Die weiße Trennlinie trennt die Bahn für Fußgänger von der für Radfahrer.'
      },
      {
        signId: 'fussgaengerzone',
        question: 'Was gilt in einer Fußgängerzone mit diesem blauen Schild?',
        options: [
          'Die Straße gehört den Fußgängern, normaler Autoverkehr ist nicht erlaubt',
          'Autos haben hier immer Vorfahrt',
          'Fußgänger dürfen den Gehsteig nicht verlassen',
          'Hier ist das Gehen verboten'
        ],
        correct: 0,
        hint: 'In der Fußgängerzone können sich Fußgänger frei und sicher über die ganze Straße bewegen.'
      },
      {
        signId: 'haltestelle',
        question: 'Du steigst an einer Bushaltestelle aus dem Schulbus aus. Wie überquerst du die Straße?',
        options: [
          'Ich warte, bis der Bus abgefahren ist und die Straße in beide Richtungen frei einsehbar ist',
          'Ich renne sofort direkt vor dem stehenden Bus über die Straße',
          'Ich krieche unter dem Bus durch',
          'Ich laufe knapp hinter dem Bus über die Fahrbahn'
        ],
        correct: 0,
        hint: 'Der stehende Bus verdeckt die Sicht! Warte immer, bis der Bus wegfährt, bevor du querst.'
      }
    ];

    const chosen = (opts && opts.all) ? pool : shuffle(pool).slice(0, 5);
    return chosen.map(item => {
      let customHtml = null;
      if (item.signId && signs) {
        customHtml = signs.getSignSvg(item.signId);
      }
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);

      return {
        fach: 'sachunterricht',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'SU-1-Verkehr-Schulweg',
        type: 'multiple-choice',
        icon: null,
        customVisualHtml: customHtml,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
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
