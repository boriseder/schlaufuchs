// =============================================================
// SCHLAUFUCHS – js/generators/german.js
// Deutsch-Generatoren (ÖWB Standardvarietät, Lehrplan BMBWF)
// Große Fragenpools (100 Aufgaben bzw. 25 Sachtexte à 4 Fragen) für maximale Varianz
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.German = (function () {
  'use strict';

  // Zentrale Hilfsfunktionen aus Core (Zufall, Stufen-Filter, deterministischer Seed)
  function getRng(opts) {
    const seed = (opts && opts.seed !== undefined) ? opts.seed : undefined;
    if (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.erstelleZufall) {
      return window.Schlaufuchs.Random.erstelleZufall(seed);
    }
    return {
      int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      mischen: (arr) => [...arr].sort(() => Math.random() - 0.5),
      wahl: (arr) => arr[Math.floor(Math.random() * arr.length)]
    };
  }
  const defaultShuffle = (window.Schlaufuchs && window.Schlaufuchs.Random && window.Schlaufuchs.Random.mischen) || (arr => [...arr].sort(() => Math.random() - 0.5));
  const getEffectiveGrades = (window.Schlaufuchs && window.Schlaufuchs.getEffectiveGrades) || (g => g);

  // 1. WORTARTEN (Namenwort, Tunwort, Wiewort – 100 Sätze Pool)
  const WORD_TYPES_POOL = [
  {
    "text": "Der schlaue Fuchs schleicht leise durch den Wald.",
    "types": {
      "Fuchs": "nomen",
      "schleicht": "verb",
      "leise": "adjektiv",
      "Wald": "nomen",
      "schlaue": "adjektiv"
    }
  },
  {
    "text": "Kleine Kinder singen fröhliche Lieder in der Klasse.",
    "types": {
      "Kleine": "adjektiv",
      "Kinder": "nomen",
      "singen": "verb",
      "fröhliche": "adjektiv",
      "Lieder": "nomen",
      "Klasse": "nomen"
    }
  },
  {
    "text": "Ein bunter Schmetterling fliegt über die grüne Wiese.",
    "types": {
      "bunter": "adjektiv",
      "Schmetterling": "nomen",
      "fliegt": "verb",
      "grüne": "adjektiv",
      "Wiese": "nomen"
    }
  },
  {
    "text": "Der alte Baum verliert im Herbst gelbe Blätter.",
    "types": {
      "alte": "adjektiv",
      "Baum": "nomen",
      "verliert": "verb",
      "Herbst": "nomen",
      "gelbe": "adjektiv",
      "Blätter": "nomen"
    }
  },
  {
    "text": "Schnelle Hunde rennen begeistert über das weite Feld.",
    "types": {
      "Schnelle": "adjektiv",
      "Hunde": "nomen",
      "rennen": "verb",
      "begeistert": "adjektiv",
      "Feld": "nomen",
      "weite": "adjektiv"
    }
  },
  {
    "text": "Im kalten Jänner bauen fröhliche Kinder einen großen Schneemann.",
    "types": {
      "kalten": "adjektiv",
      "Jänner": "nomen",
      "bauen": "verb",
      "fröhliche": "adjektiv",
      "Kinder": "nomen",
      "großen": "adjektiv",
      "Schneemann": "nomen"
    }
  },
  {
    "text": "Die fleißige Biene sammelt süßen Honig aus der Blüte.",
    "types": {
      "fleißige": "adjektiv",
      "Biene": "nomen",
      "sammelt": "verb",
      "süßen": "adjektiv",
      "Honig": "nomen",
      "Blüte": "nomen"
    }
  },
  {
    "text": "Ein winziges Kätzchen schläft friedlich auf dem weichen Sessel.",
    "types": {
      "winziges": "adjektiv",
      "Kätzchen": "nomen",
      "schläft": "verb",
      "friedlich": "adjektiv",
      "weichen": "adjektiv",
      "Sessel": "nomen"
    }
  },
  {
    "text": "Mutige Bergsteiger klettern auf den steilen Berg.",
    "types": {
      "Mutige": "adjektiv",
      "Bergsteiger": "nomen",
      "klettern": "verb",
      "steilen": "adjektiv",
      "Berg": "nomen"
    }
  },
  {
    "text": "Der junge Bäcker backt heute frisches Brot.",
    "types": {
      "junge": "adjektiv",
      "Bäcker": "nomen",
      "backt": "verb",
      "frisches": "adjektiv",
      "Brot": "nomen"
    }
  },
  {
    "text": "Dunkle Wolken bringen am Nachmittag starken Regen.",
    "types": {
      "Dunkle": "adjektiv",
      "Wolken": "nomen",
      "bringen": "verb",
      "Nachmittag": "nomen",
      "starken": "adjektiv",
      "Regen": "nomen"
    }
  },
  {
    "text": "Die kluge Eule beobachtet nachts den stillen Wald.",
    "types": {
      "kluge": "adjektiv",
      "Eule": "nomen",
      "beobachtet": "verb",
      "stillen": "adjektiv",
      "Wald": "nomen"
    }
  },
  {
    "text": "Ein roter Apfel fällt vom hohen Ast.",
    "types": {
      "roter": "adjektiv",
      "Apfel": "nomen",
      "fällt": "verb",
      "hohen": "adjektiv",
      "Ast": "nomen"
    }
  },
  {
    "text": "Geschickte Schwalben bauen im Frühling ein sicheres Nest.",
    "types": {
      "Geschickte": "adjektiv",
      "Schwalben": "nomen",
      "bauen": "verb",
      "Frühling": "nomen",
      "sicheres": "adjektiv",
      "Nest": "nomen"
    }
  },
  {
    "text": "Auf dem belebten Pausenhof spielen glückliche Schüler.",
    "types": {
      "belebten": "adjektiv",
      "Pausenhof": "nomen",
      "spielen": "verb",
      "glückliche": "adjektiv",
      "Schüler": "nomen"
    }
  },
  {
    "text": "Der gemütliche Bär frisst im Sommer reife Beeren.",
    "types": {
      "gemütliche": "adjektiv",
      "Bär": "nomen",
      "frisst": "verb",
      "Sommer": "nomen",
      "reife": "adjektiv",
      "Beeren": "nomen"
    }
  },
  {
    "text": "Ein scheues Reh trinkt klares Wasser am Bach.",
    "types": {
      "scheues": "adjektiv",
      "Reh": "nomen",
      "trinkt": "verb",
      "klares": "adjektiv",
      "Wasser": "nomen",
      "Bach": "nomen"
    }
  },
  {
    "text": "Im Turnen laufen sportliche Kinder durch den großen Saal.",
    "types": {
      "Turnen": "nomen",
      "laufen": "verb",
      "sportliche": "adjektiv",
      "Kinder": "nomen",
      "großen": "adjektiv",
      "Saal": "nomen"
    }
  },
  {
    "text": "Der helle Mond leuchtet in der dunklen Nacht.",
    "types": {
      "helle": "adjektiv",
      "Mond": "nomen",
      "leuchtet": "verb",
      "dunklen": "adjektiv",
      "Nacht": "nomen"
    }
  },
  {
    "text": "Fleißige Ameisen tragen schwere Tannennadeln zum Hügel.",
    "types": {
      "Fleißige": "adjektiv",
      "Ameisen": "nomen",
      "tragen": "verb",
      "schwere": "adjektiv",
      "Tannennadeln": "nomen",
      "Hügel": "nomen"
    }
  },
  {
    "text": "Das kleine Eichhörnchen versteckt braune Nüsse in der Erde.",
    "types": {
      "kleine": "adjektiv",
      "Eichhörnchen": "nomen",
      "versteckt": "verb",
      "braune": "adjektiv",
      "Nüsse": "nomen",
      "Erde": "nomen"
    }
  },
  {
    "text": "Ein lauter Donner erschreckt die scheuen Pferde.",
    "types": {
      "lauter": "adjektiv",
      "Donner": "nomen",
      "erschreckt": "verb",
      "scheuen": "adjektiv",
      "Pferde": "nomen"
    }
  },
  {
    "text": "In der Schultasche liegen saubere Hefte und spitze Bleistifte.",
    "types": {
      "Schultasche": "nomen",
      "liegen": "verb",
      "saubere": "adjektiv",
      "Hefte": "nomen",
      "spitze": "adjektiv",
      "Bleistifte": "nomen"
    }
  },
  {
    "text": "Freundliche Nachbarn helfen beim schweren Umzug.",
    "types": {
      "Freundliche": "adjektiv",
      "Nachbarn": "nomen",
      "helfen": "verb",
      "schweren": "adjektiv",
      "Umzug": "nomen"
    }
  },
  {
    "text": "Der bunte Regenbogen überspannt das ganze Tal.",
    "types": {
      "bunte": "adjektiv",
      "Regenbogen": "nomen",
      "überspannt": "verb",
      "ganze": "adjektiv",
      "Tal": "nomen"
    }
  },
  {
    "text": "Auf dem hölzernen Tisch dampft eine heiße Suppe.",
    "types": {
      "hölzernen": "adjektiv",
      "Tisch": "nomen",
      "dampft": "verb",
      "heiße": "adjektiv",
      "Suppe": "nomen"
    }
  },
  {
    "text": "Die nette Lehrerin erklärt die schwere Rechenaufgabe.",
    "types": {
      "nette": "adjektiv",
      "Lehrerin": "nomen",
      "erklärt": "verb",
      "schwere": "adjektiv",
      "Rechenaufgabe": "nomen"
    }
  },
  {
    "text": "Ein dicker Schneemann steht im kalten Garten.",
    "types": {
      "dicker": "adjektiv",
      "Schneemann": "nomen",
      "steht": "verb",
      "kalten": "adjektiv",
      "Garten": "nomen"
    }
  },
  {
    "text": "Der freche Spatz pickt hungrig kleine Krümel.",
    "types": {
      "freche": "adjektiv",
      "Spatz": "nomen",
      "pickt": "verb",
      "hungrig": "adjektiv",
      "kleine": "adjektiv",
      "Krümel": "nomen"
    }
  },
  {
    "text": "Im warmen Stall fressen friedliche Kühe trockenes Heu.",
    "types": {
      "warmen": "adjektiv",
      "Stall": "nomen",
      "fressen": "verb",
      "friedliche": "adjektiv",
      "Kühe": "nomen",
      "trockenes": "adjektiv",
      "Heu": "nomen"
    }
  },
  {
    "text": "Lustige Clowns zeigen bunte Kunststücke im Zirkus.",
    "types": {
      "Lustige": "adjektiv",
      "Clowns": "nomen",
      "zeigen": "verb",
      "bunte": "adjektiv",
      "Kunststücke": "nomen",
      "Zirkus": "nomen"
    }
  },
  {
    "text": "Der geschickte Maler streicht die weiße Wand.",
    "types": {
      "geschickte": "adjektiv",
      "Maler": "nomen",
      "streicht": "verb",
      "weiße": "adjektiv",
      "Wand": "nomen"
    }
  },
  {
    "text": "Das liebe Fohlen springt über die saftige Weide.",
    "types": {
      "liebe": "adjektiv",
      "Fohlen": "nomen",
      "springt": "verb",
      "saftige": "adjektiv",
      "Weide": "nomen"
    }
  },
  {
    "text": "Am Fluss schwimmen weiße Schwäne und graue Enten.",
    "types": {
      "Fluss": "nomen",
      "schwimmen": "verb",
      "weiße": "adjektiv",
      "Schwäne": "nomen",
      "graue": "adjektiv",
      "Enten": "nomen"
    }
  },
  {
    "text": "Der tapfere Ritter trägt ein glänzendes Schwert.",
    "types": {
      "tapfere": "adjektiv",
      "Ritter": "nomen",
      "trägt": "verb",
      "glänzendes": "adjektiv",
      "Schwert": "nomen"
    }
  },
  {
    "text": "Im dichten Nebel leuchten gelbe Scheinwerfer.",
    "types": {
      "dichten": "adjektiv",
      "Nebel": "nomen",
      "leuchten": "verb",
      "gelbe": "adjektiv",
      "Scheinwerfer": "nomen"
    }
  },
  {
    "text": "Die alte Mühle klappert am rauschenden Bach.",
    "types": {
      "alte": "adjektiv",
      "Mühle": "nomen",
      "klappert": "verb",
      "rauschenden": "adjektiv",
      "Bach": "nomen"
    }
  },
  {
    "text": "Flinke Kinder rodeln den verschneiten Hügel hinab.",
    "types": {
      "Flinke": "adjektiv",
      "Kinder": "nomen",
      "rodeln": "verb",
      "verschneiten": "adjektiv",
      "Hügel": "nomen"
    }
  },
  {
    "text": "Auf der bunten Blumenwiese summen viele Insekten.",
    "types": {
      "bunten": "adjektiv",
      "Blumenwiese": "nomen",
      "summen": "verb",
      "Insekten": "nomen"
    }
  },
  {
    "text": "Der stolze Hirsch trägt ein mächtiges Geweih.",
    "types": {
      "stolze": "adjektiv",
      "Hirsch": "nomen",
      "trägt": "verb",
      "mächtiges": "adjektiv",
      "Geweih": "nomen"
    }
  },
  {
    "text": "In der Küche kocht die Großmutter süße Marillenmarmelade.",
    "types": {
      "Küche": "nomen",
      "kocht": "verb",
      "Großmutter": "nomen",
      "süße": "adjektiv",
      "Marillenmarmelade": "nomen"
    }
  },
  {
    "text": "Der kleine Igel sucht ein warmes Winterquartier.",
    "types": {
      "kleine": "adjektiv",
      "Igel": "nomen",
      "sucht": "verb",
      "warmes": "adjektiv",
      "Winterquartier": "nomen"
    }
  },
  {
    "text": "Im sonnigen Feber schmilzt der letzte Schnee.",
    "types": {
      "sonnigen": "adjektiv",
      "Feber": "nomen",
      "schmilzt": "verb",
      "letzte": "adjektiv",
      "Schnee": "nomen"
    }
  },
  {
    "text": "Das rote Feuer knistert im offenen Kamin.",
    "types": {
      "rote": "adjektiv",
      "Feuer": "nomen",
      "knistert": "verb",
      "offenen": "adjektiv",
      "Kamin": "nomen"
    }
  },
  {
    "text": "Ein grüner Frosch hüpft in den kühlen Teich.",
    "types": {
      "grüner": "adjektiv",
      "Frosch": "nomen",
      "hüpft": "verb",
      "kühlen": "adjektiv",
      "Teich": "nomen"
    }
  },
  {
    "text": "Die fleißigen Bauern ernten reifes Getreide auf dem Acker.",
    "types": {
      "fleißigen": "adjektiv",
      "Bauern": "nomen",
      "ernten": "verb",
      "reifes": "adjektiv",
      "Getreide": "nomen",
      "Acker": "nomen"
    }
  },
  {
    "text": "Im dunklen Zimmer brennt eine helle Kerze.",
    "types": {
      "dunklen": "adjektiv",
      "Zimmer": "nomen",
      "brennt": "verb",
      "helle": "adjektiv",
      "Kerze": "nomen"
    }
  },
  {
    "text": "Der starke Wind biegt die biegsamen Zweige.",
    "types": {
      "starke": "adjektiv",
      "Wind": "nomen",
      "biegt": "verb",
      "biegsamen": "adjektiv",
      "Zweige": "nomen"
    }
  },
  {
    "text": "Ein lustiger Affe klettert geschickt auf die hohe Palme.",
    "types": {
      "lustiger": "adjektiv",
      "Affe": "nomen",
      "klettert": "verb",
      "geschickt": "adjektiv",
      "hohe": "adjektiv",
      "Palme": "nomen"
    }
  },
  {
    "text": "Auf der großen Baustelle baggert ein gelber Bagger.",
    "types": {
      "großen": "adjektiv",
      "Baustelle": "nomen",
      "baggert": "verb",
      "gelber": "adjektiv",
      "Bagger": "nomen"
    }
  },
  {
    "text": "Das kranke Kind trinkt warmen Tee im Bett.",
    "types": {
      "kranke": "adjektiv",
      "Kind": "nomen",
      "trinkt": "verb",
      "warmen": "adjektiv",
      "Tee": "nomen",
      "Bett": "nomen"
    }
  },
  {
    "text": "Der rote Traktor zieht den schweren Pflug über das Feld.",
    "types": {
      "rote": "adjektiv",
      "Traktor": "nomen",
      "zieht": "verb",
      "schweren": "adjektiv",
      "Pflug": "nomen",
      "Feld": "nomen"
    }
  },
  {
    "text": "Kleine Vögel zwitschern laute Melodien im Garten.",
    "types": {
      "Kleine": "adjektiv",
      "Vögel": "nomen",
      "zwitschern": "verb",
      "laute": "adjektiv",
      "Melodien": "nomen",
      "Garten": "nomen"
    }
  },
  {
    "text": "Die junge Gärtnerin gießt durstige Blumen im Glashaus.",
    "types": {
      "junge": "adjektiv",
      "Gärtnerin": "nomen",
      "gießt": "verb",
      "durstige": "adjektiv",
      "Blumen": "nomen",
      "Glashaus": "nomen"
    }
  },
  {
    "text": "Ein treuer Hund bewacht das verlassene Gehöft.",
    "types": {
      "treuer": "adjektiv",
      "Hund": "nomen",
      "bewacht": "verb",
      "verlassene": "adjektiv",
      "Gehöft": "nomen"
    }
  },
  {
    "text": "Im gemütlichen Nest schlafen vier winzige Küken.",
    "types": {
      "gemütlichen": "adjektiv",
      "Nest": "nomen",
      "schlafen": "verb",
      "winzige": "adjektiv",
      "Küken": "nomen"
    }
  },
  {
    "text": "Die geschickte Schneiderin näht ein schönes Kleid.",
    "types": {
      "geschickte": "adjektiv",
      "Schneiderin": "nomen",
      "näht": "verb",
      "schönes": "adjektiv",
      "Kleid": "nomen"
    }
  },
  {
    "text": "Ein kalter Bach fließt durch die tiefe Schlucht.",
    "types": {
      "kalter": "adjektiv",
      "Bach": "nomen",
      "fließt": "verb",
      "tiefe": "adjektiv",
      "Schlucht": "nomen"
    }
  },
  {
    "text": "Der erfahrene Kapitän steuert das große Schiff sicher in den Hafen.",
    "types": {
      "erfahrene": "adjektiv",
      "Kapitän": "nomen",
      "steuert": "verb",
      "große": "adjektiv",
      "Schiff": "nomen",
      "sicher": "adjektiv",
      "Hafen": "nomen"
    }
  },
  {
    "text": "Unter dem schattigen Baum rasten müde Wanderer.",
    "types": {
      "schattigen": "adjektiv",
      "Baum": "nomen",
      "rasten": "verb",
      "müde": "adjektiv",
      "Wanderer": "nomen"
    }
  },
  {
    "text": "Das kleine Murmeltier pfeift schrill bei nahender Gefahr.",
    "types": {
      "kleine": "adjektiv",
      "Murmeltier": "nomen",
      "pfeift": "verb",
      "schrill": "adjektiv",
      "nahender": "adjektiv",
      "Gefahr": "nomen"
    }
  },
  {
    "text": "Im weiten Wald wachsen seltene Pilze.",
    "types": {
      "weiten": "adjektiv",
      "Wald": "nomen",
      "wachsen": "verb",
      "seltene": "adjektiv",
      "Pilze": "nomen"
    }
  },
  {
    "text": "Der goldene Apfel glänzt in der warmen Herbstsonne.",
    "types": {
      "goldene": "adjektiv",
      "Apfel": "nomen",
      "glänzt": "verb",
      "warmen": "adjektiv",
      "Herbstsonne": "nomen"
    }
  },
  {
    "text": "Glückliche Kinder hüpfen durch riesige Pfützen.",
    "types": {
      "Glückliche": "adjektiv",
      "Kinder": "nomen",
      "hüpfen": "verb",
      "riesige": "adjektiv",
      "Pfützen": "nomen"
    }
  },
  {
    "text": "Ein schneller Blitz zuckt über den nächtlichen Himmel.",
    "types": {
      "schneller": "adjektiv",
      "Blitz": "nomen",
      "zuckt": "verb",
      "nächtlichen": "adjektiv",
      "Himmel": "nomen"
    }
  },
  {
    "text": "Die tüchtige Ärztin untersucht das verletzte Knie.",
    "types": {
      "tüchtige": "adjektiv",
      "Ärztin": "nomen",
      "untersucht": "verb",
      "verletzte": "adjektiv",
      "Knie": "nomen"
    }
  },
  {
    "text": "Auf der schneebedeckten Piste kurven geübte Schifahrer.",
    "types": {
      "schneebedeckten": "adjektiv",
      "Piste": "nomen",
      "kurven": "verb",
      "geübte": "adjektiv",
      "Schifahrer": "nomen"
    }
  },
  {
    "text": "Der hungrige Wolf streift einsam durch das verschneite Gebirge.",
    "types": {
      "hungrige": "adjektiv",
      "Wolf": "nomen",
      "streift": "verb",
      "einsam": "adjektiv",
      "verschneite": "adjektiv",
      "Gebirge": "nomen"
    }
  },
  {
    "text": "In der Pause essen die Schüler saftige Äpfel.",
    "types": {
      "Pause": "nomen",
      "essen": "verb",
      "Schüler": "nomen",
      "saftige": "adjektiv",
      "Äpfel": "nomen"
    }
  },
  {
    "text": "Die sanfte Musik beruhigt das weinende Baby.",
    "types": {
      "sanfte": "adjektiv",
      "Musik": "nomen",
      "beruhigt": "verb",
      "weinende": "adjektiv",
      "Baby": "nomen"
    }
  },
  {
    "text": "Der alte Förster füttert das hungrige Wild im Winterwald.",
    "types": {
      "alte": "adjektiv",
      "Förster": "nomen",
      "füttert": "verb",
      "hungrige": "adjektiv",
      "Wild": "nomen",
      "Winterwald": "nomen"
    }
  },
  {
    "text": "Ein frecher Rabe stiehlt glitzernden Schmuck vom Balkon.",
    "types": {
      "frecher": "adjektiv",
      "Rabe": "nomen",
      "stiehlt": "verb",
      "glitzernden": "adjektiv",
      "Schmuck": "nomen",
      "Balkon": "nomen"
    }
  },
  {
    "text": "Die neue Schultasche steht ordentlich neben dem Schreibtisch.",
    "types": {
      "neue": "adjektiv",
      "Schultasche": "nomen",
      "steht": "verb",
      "ordentlich": "adjektiv",
      "Schreibtisch": "nomen"
    }
  },
  {
    "text": "Über den hohen Bergen kreist ein mächtiger Steinadler.",
    "types": {
      "hohen": "adjektiv",
      "Bergen": "nomen",
      "kreist": "verb",
      "mächtiger": "adjektiv",
      "Steinadler": "nomen"
    }
  },
  {
    "text": "Das fleißige Lieschen blüht den ganzen Sommer im Blumentopf.",
    "types": {
      "fleißige": "adjektiv",
      "Lieschen": "nomen",
      "blüht": "verb",
      "ganzen": "adjektiv",
      "Sommer": "nomen",
      "Blumentopf": "nomen"
    }
  },
  {
    "text": "Ein kleiner Maulwurf gräbt tiefe Gänge im Garten.",
    "types": {
      "kleiner": "adjektiv",
      "Maulwurf": "nomen",
      "gräbt": "verb",
      "tiefe": "adjektiv",
      "Gänge": "nomen",
      "Garten": "nomen"
    }
  },
  {
    "text": "Der junge Musiker spielt ein trauriges Lied auf der Geige.",
    "types": {
      "junge": "adjektiv",
      "Musiker": "nomen",
      "spielt": "verb",
      "trauriges": "adjektiv",
      "Lied": "nomen",
      "Geige": "nomen"
    }
  },
  {
    "text": "Im Frühling erwachen bunte Krokusse aus dem Winterschlaf.",
    "types": {
      "Frühling": "nomen",
      "erwachen": "verb",
      "bunte": "adjektiv",
      "Krokusse": "nomen",
      "Winterschlaf": "nomen"
    }
  },
  {
    "text": "Der braune Hirsch springt gewandt über den morschen Baumstamm.",
    "types": {
      "braune": "adjektiv",
      "Hirsch": "nomen",
      "springt": "verb",
      "gewandt": "adjektiv",
      "morschen": "adjektiv",
      "Baumstamm": "nomen"
    }
  },
  {
    "text": "Die fröhliche Familie wandert auf die sonnige Alm.",
    "types": {
      "fröhliche": "adjektiv",
      "Familie": "nomen",
      "wandert": "verb",
      "sonnige": "adjektiv",
      "Alm": "nomen"
    }
  },
  {
    "text": "Auf dem Dach sitzt eine weiße Taube und gurrt leise.",
    "types": {
      "Dach": "nomen",
      "sitzt": "verb",
      "weiße": "adjektiv",
      "Taube": "nomen",
      "gurrt": "verb",
      "leise": "adjektiv"
    }
  },
  {
    "text": "Der kluge Polizist regelt den dichten Verkehr an der Kreuzung.",
    "types": {
      "kluge": "adjektiv",
      "Polizist": "nomen",
      "regelt": "verb",
      "dichten": "adjektiv",
      "Verkehr": "nomen",
      "Kreuzung": "nomen"
    }
  },
  {
    "text": "Ein alter Fischer wirft das lange Netz in den See.",
    "types": {
      "alter": "adjektiv",
      "Fischer": "nomen",
      "wirft": "verb",
      "lange": "adjektiv",
      "Netz": "nomen",
      "See": "nomen"
    }
  },
  {
    "text": "Die liebe Oma schenkt dem Enkelkind ein spannendes Buch.",
    "types": {
      "liebe": "adjektiv",
      "Oma": "nomen",
      "schenkt": "verb",
      "Enkelkind": "nomen",
      "spannendes": "adjektiv",
      "Buch": "nomen"
    }
  },
  {
    "text": "Im tiefen Schnee hinterlässt der Hase deutliche Spuren.",
    "types": {
      "tiefen": "adjektiv",
      "Schnee": "nomen",
      "hinterlässt": "verb",
      "Hase": "nomen",
      "deutliche": "adjektiv",
      "Spuren": "nomen"
    }
  },
  {
    "text": "Das stolze Segelschiff gleitet ruhig über die blauen Wellen.",
    "types": {
      "stolze": "adjektiv",
      "Segelschiff": "nomen",
      "gleitet": "verb",
      "ruhig": "adjektiv",
      "blauen": "adjektiv",
      "Wellen": "nomen"
    }
  },
  {
    "text": "Der fleißige Schreiner hobelt das raue Brett.",
    "types": {
      "fleißige": "adjektiv",
      "Schreiner": "nomen",
      "hobelt": "verb",
      "raue": "adjektiv",
      "Brett": "nomen"
    }
  },
  {
    "text": "Unter dem Stein versteckt sich ein kleiner Salamander.",
    "types": {
      "Stein": "nomen",
      "versteckt": "verb",
      "kleiner": "adjektiv",
      "Salamander": "nomen"
    }
  },
  {
    "text": "Die hungrigen Küken sperren den gelben Schnabel weit auf.",
    "types": {
      "hungrigen": "adjektiv",
      "Küken": "nomen",
      "sperren": "verb",
      "gelben": "adjektiv",
      "Schnabel": "nomen",
      "weit": "adjektiv"
    }
  },
  {
    "text": "Im gläsernen Kasten stehen wertvolle Pokale.",
    "types": {
      "gläsernen": "adjektiv",
      "Kasten": "nomen",
      "stehen": "verb",
      "wertvolle": "adjektiv",
      "Pokale": "nomen"
    }
  },
  {
    "text": "Der kleine Junge zeichnet einen grünen Drachen.",
    "types": {
      "kleine": "adjektiv",
      "Junge": "nomen",
      "zeichnet": "verb",
      "grünen": "adjektiv",
      "Drachen": "nomen"
    }
  },
  {
    "text": "Auf der bunten Decke liegt eine schnurrende Katze.",
    "types": {
      "bunten": "adjektiv",
      "Decke": "nomen",
      "liegt": "verb",
      "schnurrende": "adjektiv",
      "Katze": "nomen"
    }
  },
  {
    "text": "Die mutige Feuerwehr löscht das gefährliche Feuer schnell.",
    "types": {
      "mutige": "adjektiv",
      "Feuerwehr": "nomen",
      "löscht": "verb",
      "gefährliche": "adjektiv",
      "Feuer": "nomen",
      "schnell": "adjektiv"
    }
  },
  {
    "text": "Im Frühling bauen die fleißigen Schwalben ihr kunstvolles Nest.",
    "types": {
      "Frühling": "nomen",
      "bauen": "verb",
      "fleißigen": "adjektiv",
      "Schwalben": "nomen",
      "kunstvolles": "adjektiv",
      "Nest": "nomen"
    }
  },
  {
    "text": "Ein starker Elefant trägt schwere Baumstämme durch den Urwald.",
    "types": {
      "starker": "adjektiv",
      "Elefant": "nomen",
      "trägt": "verb",
      "schwere": "adjektiv",
      "Baumstämme": "nomen",
      "Urwald": "nomen"
    }
  },
  {
    "text": "Der goldene Herbst bringt süße Trauben und reife Birnen.",
    "types": {
      "goldene": "adjektiv",
      "Herbst": "nomen",
      "bringt": "verb",
      "süße": "adjektiv",
      "Trauben": "nomen",
      "reife": "adjektiv",
      "Birnen": "nomen"
    }
  },
  {
    "text": "Die geduldige Töpferin formt eine runde Schale aus rotem Ton.",
    "types": {
      "geduldige": "adjektiv",
      "Töpferin": "nomen",
      "formt": "verb",
      "runde": "adjektiv",
      "Schale": "nomen",
      "rotem": "adjektiv",
      "Ton": "nomen"
    }
  },
  {
    "text": "Auf dem schneebedeckten Dach schmilzt das kalte Eis.",
    "types": {
      "schneebedeckten": "adjektiv",
      "Dach": "nomen",
      "schmilzt": "verb",
      "kalte": "adjektiv",
      "Eis": "nomen"
    }
  },
  {
    "text": "Ein kleiner Marienkäfer krabbelt langsam über das grüne Blatt.",
    "types": {
      "kleiner": "adjektiv",
      "Marienkäfer": "nomen",
      "krabbelt": "verb",
      "langsam": "adjektiv",
      "grüne": "adjektiv",
      "Blatt": "nomen"
    }
  },
  {
    "text": "In der warmen Stube brennt das helle Licht.",
    "types": {
      "warmen": "adjektiv",
      "Stube": "nomen",
      "brennt": "verb",
      "helle": "adjektiv",
      "Licht": "nomen"
    }
  }
];

  function buildWordTypesTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const grades = getEffectiveGrades([2, 3]);
    const isOnlyGrade2 = !grades.includes(3) && !grades.includes(4);

    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? WORD_TYPES_POOL.length : 5);
    const selectedSentences = (opts && opts.all) ? WORD_TYPES_POOL : shuffle(WORD_TYPES_POOL).slice(0, targetCount);
    return selectedSentences.map(item => {
      const cleanWords = item.text.replace(/[.,]/g, '').split(' ');
      const sentenceTokens = cleanWords.map(word => {
        let type = item.types[word];
        // In der 2. Klasse nur Namenwörter und Tunwörter (keine Wiewörter)
        if (isOnlyGrade2 && type === 'adjektiv') {
          type = null;
        }
        return {
          word: word,
          type: type || null,
          ignore: !type,
          userType: null,
        };
      });

      return {
        fach: "deutsch",
        schulstufe: isOnlyGrade2 ? 2 : 3,
        grade: isOnlyGrade2 ? 2 : 3,
        lehrplanRef: isOnlyGrade2 ? "D-2-Sprachbetrachtung" : "D-3-Wortarten",
        type: "word-types",
        originalText: item.text,
        sentence: sentenceTokens,
        isCorrect: null,
      };
    });
  }

  // 2. GROSS & KLEIN (Namenwörter großschreiben – 100 Sätze Pool)
  const CAPITALIZATION_POOL = [
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "fuchs",
        "isTarget": true
      },
      {
        "text": "sucht",
        "isTarget": false
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "wald",
        "isTarget": true
      },
      {
        "text": "nach",
        "isTarget": false
      },
      {
        "text": "futter",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Fuchs",
      "Wald",
      "Futter"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "kinder",
        "isTarget": true
      },
      {
        "text": "pflücken",
        "isTarget": false
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "garten",
        "isTarget": true
      },
      {
        "text": "süße",
        "isTarget": false
      },
      {
        "text": "erdbeeren",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Kinder",
      "Garten",
      "Erdbeeren"
    ]
  },
  {
    "words": [
      {
        "text": "Meine",
        "isFixed": true
      },
      {
        "text": "schwester",
        "isTarget": true
      },
      {
        "text": "packt",
        "isTarget": false
      },
      {
        "text": "ihre",
        "isTarget": false
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "schultasche",
        "isTarget": true
      },
      {
        "text": "für",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "schule",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schwester",
      "Schultasche",
      "Schule"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "sommer",
        "isTarget": true
      },
      {
        "text": "scheint",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "heiße",
        "isTarget": false
      },
      {
        "text": "sonne",
        "isTarget": true
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "blumen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Sommer",
      "Sonne",
      "Blumen"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "hund",
        "isTarget": true
      },
      {
        "text": "spielt",
        "isTarget": false
      },
      {
        "text": "mit",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "ball",
        "isTarget": true
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "wiese",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Hund",
      "Ball",
      "Wiese"
    ]
  },
  {
    "words": [
      {
        "text": "Am",
        "isFixed": true
      },
      {
        "text": "nachmittag",
        "isTarget": true
      },
      {
        "text": "backt",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "vater",
        "isTarget": true
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "süße",
        "isTarget": false
      },
      {
        "text": "torte",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Nachmittag",
      "Vater",
      "Torte"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "jänner",
        "isTarget": true
      },
      {
        "text": "fällt",
        "isTarget": false
      },
      {
        "text": "oft",
        "isTarget": false
      },
      {
        "text": "weißer",
        "isTarget": false
      },
      {
        "text": "schnee",
        "isTarget": true
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "dach",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Jänner",
      "Schnee",
      "Dach"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "grauer",
        "isTarget": false
      },
      {
        "text": "hase",
        "isTarget": true
      },
      {
        "text": "knabbert",
        "isTarget": false
      },
      {
        "text": "an",
        "isTarget": false
      },
      {
        "text": "einer",
        "isTarget": false
      },
      {
        "text": "knackigen",
        "isTarget": false
      },
      {
        "text": "karotte",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Hase",
      "Karotte"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "braune",
        "isTarget": false
      },
      {
        "text": "eule",
        "isTarget": true
      },
      {
        "text": "sitzt",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "einem",
        "isTarget": false
      },
      {
        "text": "dicken",
        "isTarget": false
      },
      {
        "text": "ast",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Eule",
      "Ast"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "herbst",
        "isTarget": true
      },
      {
        "text": "sammeln",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "schüler",
        "isTarget": true
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "blätter",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Herbst",
      "Schüler",
      "Blätter"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "fleißige",
        "isTarget": false
      },
      {
        "text": "bäcker",
        "isTarget": true
      },
      {
        "text": "verkauft",
        "isTarget": false
      },
      {
        "text": "frische",
        "isTarget": false
      },
      {
        "text": "semmeln",
        "isTarget": true
      },
      {
        "text": "und",
        "isTarget": false
      },
      {
        "text": "brot",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Bäcker",
      "Semmeln",
      "Brot"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "katze",
        "isTarget": true
      },
      {
        "text": "schläft",
        "isTarget": false
      },
      {
        "text": "gemütlich",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "roten",
        "isTarget": false
      },
      {
        "text": "sessel",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Katze",
      "Sessel"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "see",
        "isTarget": true
      },
      {
        "text": "schwimmt",
        "isTarget": false
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "weiße",
        "isTarget": false
      },
      {
        "text": "ente",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "See",
      "Ente"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "alte",
        "isTarget": false
      },
      {
        "text": "fischer",
        "isTarget": true
      },
      {
        "text": "zieht",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "schwere",
        "isTarget": false
      },
      {
        "text": "netz",
        "isTarget": true
      },
      {
        "text": "ins",
        "isTarget": false
      },
      {
        "text": "boot",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Fischer",
      "Netz",
      "Boot"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "pause",
        "isTarget": true
      },
      {
        "text": "essen",
        "isTarget": false
      },
      {
        "text": "alle",
        "isTarget": false
      },
      {
        "text": "kinder",
        "isTarget": true
      },
      {
        "text": "einen",
        "isTarget": false
      },
      {
        "text": "roten",
        "isTarget": false
      },
      {
        "text": "apfel",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Pause",
      "Kinder",
      "Apfel"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "kleines",
        "isTarget": false
      },
      {
        "text": "reh",
        "isTarget": true
      },
      {
        "text": "steht",
        "isTarget": false
      },
      {
        "text": "am",
        "isTarget": false
      },
      {
        "text": "rand",
        "isTarget": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "wiese",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Reh",
      "Rand",
      "Wiese"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "fleißige",
        "isTarget": false
      },
      {
        "text": "biene",
        "isTarget": true
      },
      {
        "text": "fliegt",
        "isTarget": false
      },
      {
        "text": "von",
        "isTarget": false
      },
      {
        "text": "blüte",
        "isTarget": true
      },
      {
        "text": "zu",
        "isTarget": false
      },
      {
        "text": "blüte",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Biene",
      "Blüte",
      "Blüte"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "pausenhof",
        "isTarget": true
      },
      {
        "text": "lachen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "glücklichen",
        "isTarget": false
      },
      {
        "text": "schüler",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Pausenhof",
      "Schüler"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "starke",
        "isTarget": false
      },
      {
        "text": "wind",
        "isTarget": true
      },
      {
        "text": "bläst",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "hüte",
        "isTarget": true
      },
      {
        "text": "von",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "köpfen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wind",
      "Hüte",
      "Köpfen"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "rote",
        "isTarget": false
      },
      {
        "text": "auto",
        "isTarget": true
      },
      {
        "text": "fährt",
        "isTarget": false
      },
      {
        "text": "schnell",
        "isTarget": false
      },
      {
        "text": "über",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "brücke",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Auto",
      "Brücke"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "frühling",
        "isTarget": true
      },
      {
        "text": "bauen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "vögel",
        "isTarget": true
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "warmes",
        "isTarget": false
      },
      {
        "text": "nest",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Frühling",
      "Vögel",
      "Nest"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "tapfere",
        "isTarget": false
      },
      {
        "text": "feuerwehrmann",
        "isTarget": true
      },
      {
        "text": "löscht",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "große",
        "isTarget": false
      },
      {
        "text": "feuer",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Feuerwehrmann",
      "Feuer"
    ]
  },
  {
    "words": [
      {
        "text": "Meine",
        "isFixed": true
      },
      {
        "text": "oma",
        "isTarget": true
      },
      {
        "text": "liest",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "spannendes",
        "isTarget": false
      },
      {
        "text": "märchen",
        "isTarget": true
      },
      {
        "text": "aus",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "buch",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Oma",
      "Märchen",
      "Buch"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "bauernhof",
        "isTarget": true
      },
      {
        "text": "muhen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "kühe",
        "isTarget": true
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "stall",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Bauernhof",
      "Kühe",
      "Stall"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "schmetterling",
        "isTarget": true
      },
      {
        "text": "sitzt",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "einer",
        "isTarget": false
      },
      {
        "text": "gelben",
        "isTarget": false
      },
      {
        "text": "sonnenblume",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schmetterling",
      "Sonnenblume"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "winter",
        "isTarget": true
      },
      {
        "text": "tragen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "kinder",
        "isTarget": true
      },
      {
        "text": "warme",
        "isTarget": false
      },
      {
        "text": "handschuhe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Winter",
      "Kinder",
      "Handschuhe"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "flinkes",
        "isTarget": false
      },
      {
        "text": "eichhörnchen",
        "isTarget": true
      },
      {
        "text": "klettert",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "hohe",
        "isTarget": false
      },
      {
        "text": "tanne",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Eichhörnchen",
      "Tanne"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "junge",
        "isTarget": false
      },
      {
        "text": "maler",
        "isTarget": true
      },
      {
        "text": "zeichnet",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "schönes",
        "isTarget": false
      },
      {
        "text": "bild",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Maler",
      "Bild"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "nacht",
        "isTarget": true
      },
      {
        "text": "leuchtet",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "helle",
        "isTarget": false
      },
      {
        "text": "mond",
        "isTarget": true
      },
      {
        "text": "am",
        "isTarget": false
      },
      {
        "text": "himmel",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Nacht",
      "Mond",
      "Himmel"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "freundliche",
        "isTarget": false
      },
      {
        "text": "lehrerin",
        "isTarget": true
      },
      {
        "text": "lobt",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "fleißige",
        "isTarget": false
      },
      {
        "text": "klasse",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Lehrerin",
      "Klasse"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "baum",
        "isTarget": true
      },
      {
        "text": "singt",
        "isTarget": false
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "schwarze",
        "isTarget": false
      },
      {
        "text": "amsel",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Baum",
      "Amsel"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "große",
        "isTarget": false
      },
      {
        "text": "bär",
        "isTarget": true
      },
      {
        "text": "fängt",
        "isTarget": false
      },
      {
        "text": "einen",
        "isTarget": false
      },
      {
        "text": "frischen",
        "isTarget": false
      },
      {
        "text": "fisch",
        "isTarget": true
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "fluss",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Bär",
      "Fisch",
      "Fluss"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "herbst",
        "isTarget": true
      },
      {
        "text": "fliegen",
        "isTarget": false
      },
      {
        "text": "viele",
        "isTarget": false
      },
      {
        "text": "schwalben",
        "isTarget": true
      },
      {
        "text": "in",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "süden",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Herbst",
      "Schwalben",
      "Süden"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "blaue",
        "isTarget": false
      },
      {
        "text": "fahrrad",
        "isTarget": true
      },
      {
        "text": "steht",
        "isTarget": false
      },
      {
        "text": "vor",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "hohen",
        "isTarget": false
      },
      {
        "text": "haus",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Fahrrad",
      "Haus"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "lauter",
        "isTarget": false
      },
      {
        "text": "donner",
        "isTarget": true
      },
      {
        "text": "weckt",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "schlafenden",
        "isTarget": false
      },
      {
        "text": "hund",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Donner",
      "Hund"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "kluge",
        "isTarget": false
      },
      {
        "text": "schülerin",
        "isTarget": true
      },
      {
        "text": "rechnet",
        "isTarget": false
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "schwere",
        "isTarget": false
      },
      {
        "text": "aufgabe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schülerin",
      "Aufgabe"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "küche",
        "isTarget": true
      },
      {
        "text": "kocht",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "mutter",
        "isTarget": true
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "warme",
        "isTarget": false
      },
      {
        "text": "suppe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Küche",
      "Mutter",
      "Suppe"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "lustige",
        "isTarget": false
      },
      {
        "text": "clown",
        "isTarget": true
      },
      {
        "text": "trägt",
        "isTarget": false
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "große",
        "isTarget": false
      },
      {
        "text": "rote",
        "isTarget": false
      },
      {
        "text": "nase",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Clown",
      "Nase"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "straße",
        "isTarget": true
      },
      {
        "text": "fährt",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "gelber",
        "isTarget": false
      },
      {
        "text": "bus",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Straße",
      "Bus"
    ]
  },
  {
    "words": [
      {
        "text": "Am",
        "isFixed": true
      },
      {
        "text": "wochenende",
        "isTarget": true
      },
      {
        "text": "wandert",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "familie",
        "isTarget": true
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "hohen",
        "isTarget": false
      },
      {
        "text": "berg",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wochenende",
      "Familie",
      "Berg"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "braune",
        "isTarget": false
      },
      {
        "text": "pferd",
        "isTarget": true
      },
      {
        "text": "frisst",
        "isTarget": false
      },
      {
        "text": "frisches",
        "isTarget": false
      },
      {
        "text": "gras",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Pferd",
      "Gras"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "goldene",
        "isTarget": false
      },
      {
        "text": "schlüssel",
        "isTarget": true
      },
      {
        "text": "öffnet",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "alte",
        "isTarget": false
      },
      {
        "text": "tür",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schlüssel",
      "Tür"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "wald",
        "isTarget": true
      },
      {
        "text": "sammelt",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "bub",
        "isTarget": true
      },
      {
        "text": "braune",
        "isTarget": false
      },
      {
        "text": "zapfen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wald",
      "Bub",
      "Zapfen"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "weißen",
        "isTarget": false
      },
      {
        "text": "gänse",
        "isTarget": true
      },
      {
        "text": "schnattern",
        "isTarget": false
      },
      {
        "text": "laut",
        "isTarget": false
      },
      {
        "text": "am",
        "isTarget": false
      },
      {
        "text": "teich",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Gänse",
      "Teich"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "grüner",
        "isTarget": false
      },
      {
        "text": "frosch",
        "isTarget": true
      },
      {
        "text": "quakt",
        "isTarget": false
      },
      {
        "text": "fröhlich",
        "isTarget": false
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "schilf",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Frosch",
      "Schilf"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "alte",
        "isTarget": false
      },
      {
        "text": "förster",
        "isTarget": true
      },
      {
        "text": "füttert",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "hungrigen",
        "isTarget": false
      },
      {
        "text": "rehe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Förster",
      "Rehe"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "teller",
        "isTarget": true
      },
      {
        "text": "liegt",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "knuspriges",
        "isTarget": false
      },
      {
        "text": "kipferl",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Teller",
      "Kipferl"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "schöne",
        "isTarget": false
      },
      {
        "text": "schloss",
        "isTarget": true
      },
      {
        "text": "steht",
        "isTarget": false
      },
      {
        "text": "mitten",
        "isTarget": false
      },
      {
        "text": "in",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "großen",
        "isTarget": false
      },
      {
        "text": "stadt",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schloss",
      "Stadt"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "schulhof",
        "isTarget": false
      },
      {
        "text": "spielen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "kinder",
        "isTarget": true
      },
      {
        "text": "mit",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "kreide",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Kinder",
      "Kreide"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "vogel",
        "isTarget": true
      },
      {
        "text": "pickt",
        "isTarget": false
      },
      {
        "text": "nach",
        "isTarget": false
      },
      {
        "text": "einem",
        "isTarget": false
      },
      {
        "text": "dicken",
        "isTarget": false
      },
      {
        "text": "wurm",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Vogel",
      "Wurm"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "kiste",
        "isTarget": true
      },
      {
        "text": "liegen",
        "isTarget": false
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "steine",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Kiste",
      "Steine"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "fleißigen",
        "isTarget": false
      },
      {
        "text": "ameisen",
        "isTarget": true
      },
      {
        "text": "bauen",
        "isTarget": false
      },
      {
        "text": "einen",
        "isTarget": false
      },
      {
        "text": "riesigen",
        "isTarget": false
      },
      {
        "text": "haufen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Ameisen",
      "Haufen"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "feld",
        "isTarget": true
      },
      {
        "text": "wächst",
        "isTarget": false
      },
      {
        "text": "gelbes",
        "isTarget": false
      },
      {
        "text": "getreide",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Feld",
      "Getreide"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "graue",
        "isTarget": false
      },
      {
        "text": "esel",
        "isTarget": true
      },
      {
        "text": "trägt",
        "isTarget": false
      },
      {
        "text": "zwei",
        "isTarget": false
      },
      {
        "text": "schwere",
        "isTarget": false
      },
      {
        "text": "körbe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Esel",
      "Körbe"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "feine",
        "isTarget": false
      },
      {
        "text": "spinnennetz",
        "isTarget": true
      },
      {
        "text": "glitzert",
        "isTarget": false
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "morgentau",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Spinnennetz",
      "Morgentau"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "zoo",
        "isTarget": true
      },
      {
        "text": "brüllt",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "mächtige",
        "isTarget": false
      },
      {
        "text": "löwe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Zoo",
      "Löwe"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "süßen",
        "isTarget": false
      },
      {
        "text": "kirschen",
        "isTarget": true
      },
      {
        "text": "hängen",
        "isTarget": false
      },
      {
        "text": "an",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "zweigen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Kirschen",
      "Zweigen"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "starker",
        "isTarget": false
      },
      {
        "text": "regen",
        "isTarget": true
      },
      {
        "text": "prasselt",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "fensterscheibe",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Regen",
      "Fensterscheibe"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "geschickte",
        "isTarget": false
      },
      {
        "text": "turner",
        "isTarget": true
      },
      {
        "text": "schwingt",
        "isTarget": false
      },
      {
        "text": "am",
        "isTarget": false
      },
      {
        "text": "hohen",
        "isTarget": false
      },
      {
        "text": "reck",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Turner",
      "Reck"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "balkon",
        "isTarget": true
      },
      {
        "text": "blühen",
        "isTarget": false
      },
      {
        "text": "rote",
        "isTarget": false
      },
      {
        "text": "pelargonien",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Balkon",
      "Pelargonien"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "flinke",
        "isTarget": false
      },
      {
        "text": "wiesel",
        "isTarget": true
      },
      {
        "text": "schlüpft",
        "isTarget": false
      },
      {
        "text": "unter",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "wurzel",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wiesel",
      "Wurzel"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "werkstatt",
        "isTarget": true
      },
      {
        "text": "sägt",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "tischler",
        "isTarget": true
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "dickes",
        "isTarget": false
      },
      {
        "text": "brett",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Werkstatt",
      "Tischler",
      "Brett"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "schöne",
        "isTarget": false
      },
      {
        "text": "schwan",
        "isTarget": true
      },
      {
        "text": "gleitet",
        "isTarget": false
      },
      {
        "text": "über",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "stille",
        "isTarget": false
      },
      {
        "text": "wasser",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schwan",
      "Wasser"
    ]
  },
  {
    "words": [
      {
        "text": "Am",
        "isFixed": true
      },
      {
        "text": "himmel",
        "isTarget": true
      },
      {
        "text": "fliegt",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "silbernes",
        "isTarget": false
      },
      {
        "text": "flugzeug",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Himmel",
      "Flugzeug"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "maus",
        "isTarget": true
      },
      {
        "text": "knabbert",
        "isTarget": false
      },
      {
        "text": "am",
        "isTarget": false
      },
      {
        "text": "gelben",
        "isTarget": false
      },
      {
        "text": "käse",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Maus",
      "Käse"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "müde",
        "isTarget": false
      },
      {
        "text": "wanderer",
        "isTarget": true
      },
      {
        "text": "trinkt",
        "isTarget": false
      },
      {
        "text": "kühles",
        "isTarget": false
      },
      {
        "text": "wasser",
        "isTarget": true
      },
      {
        "text": "aus",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "quelle",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wanderer",
      "Wasser",
      "Quelle"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "museum",
        "isTarget": true
      },
      {
        "text": "bewundern",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "gäste",
        "isTarget": true
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "altes",
        "isTarget": false
      },
      {
        "text": "bild",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Museum",
      "Gäste",
      "Bild"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "große",
        "isTarget": false
      },
      {
        "text": "kamel",
        "isTarget": true
      },
      {
        "text": "wandert",
        "isTarget": false
      },
      {
        "text": "durch",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "trockene",
        "isTarget": false
      },
      {
        "text": "wüste",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Kamel",
      "Wüste"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "markt",
        "isTarget": true
      },
      {
        "text": "kauft",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "koch",
        "isTarget": true
      },
      {
        "text": "frisches",
        "isTarget": false
      },
      {
        "text": "gemüse",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Markt",
      "Koch",
      "Gemüse"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "igel",
        "isTarget": true
      },
      {
        "text": "versteckt",
        "isTarget": false
      },
      {
        "text": "sich",
        "isTarget": false
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "dichten",
        "isTarget": false
      },
      {
        "text": "laubhaufen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Igel",
      "Laubhaufen"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "schule",
        "isTarget": true
      },
      {
        "text": "lernen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "schüler",
        "isTarget": true
      },
      {
        "text": "neue",
        "isTarget": false
      },
      {
        "text": "wörter",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schule",
      "Schüler",
      "Wörter"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "helle",
        "isTarget": false
      },
      {
        "text": "sonne",
        "isTarget": true
      },
      {
        "text": "wärmt",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "kalten",
        "isTarget": false
      },
      {
        "text": "boden",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Sonne",
      "Boden"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "schneller",
        "isTarget": false
      },
      {
        "text": "zug",
        "isTarget": true
      },
      {
        "text": "fährt",
        "isTarget": false
      },
      {
        "text": "über",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "schienen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Zug",
      "Schienen"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "papagei",
        "isTarget": true
      },
      {
        "text": "spricht",
        "isTarget": false
      },
      {
        "text": "lustige",
        "isTarget": false
      },
      {
        "text": "sätze",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Papagei",
      "Sätze"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "wiese",
        "isTarget": true
      },
      {
        "text": "blüht",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "gelbe",
        "isTarget": false
      },
      {
        "text": "löwenzahn",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wiese",
      "Löwenzahn"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "neue",
        "isTarget": false
      },
      {
        "text": "heft",
        "isTarget": true
      },
      {
        "text": "liegt",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "hölzernen",
        "isTarget": false
      },
      {
        "text": "tisch",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Heft",
      "Tisch"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "aquarium",
        "isTarget": true
      },
      {
        "text": "schwimmen",
        "isTarget": false
      },
      {
        "text": "drei",
        "isTarget": false
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "goldfische",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Aquarium",
      "Goldfische"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "nette",
        "isTarget": false
      },
      {
        "text": "nachbarin",
        "isTarget": true
      },
      {
        "text": "gießt",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "durstigen",
        "isTarget": false
      },
      {
        "text": "blumen",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Nachbarin",
      "Blumen"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "tapfere",
        "isTarget": false
      },
      {
        "text": "polizist",
        "isTarget": true
      },
      {
        "text": "hilft",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "kindern",
        "isTarget": true
      },
      {
        "text": "an",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "kreuzung",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Polizist",
      "Kindern",
      "Kreuzung"
    ]
  },
  {
    "words": [
      {
        "text": "Am",
        "isFixed": true
      },
      {
        "text": "strand",
        "isTarget": true
      },
      {
        "text": "bauen",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "buben",
        "isTarget": true
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "hohe",
        "isTarget": false
      },
      {
        "text": "sandburg",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Strand",
      "Buben",
      "Sandburg"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "weiße",
        "isTarget": false
      },
      {
        "text": "schaf",
        "isTarget": true
      },
      {
        "text": "steht",
        "isTarget": false
      },
      {
        "text": "mit",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "kleinen",
        "isTarget": false
      },
      {
        "text": "lamm",
        "isTarget": true
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "weide",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Schaf",
      "Lamm",
      "Weide"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "früh",
        "isTarget": true
      },
      {
        "text": "kräht",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "hahn",
        "isTarget": true
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "mist",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Früh",
      "Hahn",
      "Mist"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "dunkle",
        "isTarget": false
      },
      {
        "text": "tunnel",
        "isTarget": true
      },
      {
        "text": "führt",
        "isTarget": false
      },
      {
        "text": "durch",
        "isTarget": false
      },
      {
        "text": "den",
        "isTarget": false
      },
      {
        "text": "hohen",
        "isTarget": false
      },
      {
        "text": "berg",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Tunnel",
      "Berg"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "eis",
        "isTarget": true
      },
      {
        "text": "gleiten",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "geschickten",
        "isTarget": false
      },
      {
        "text": "eisläufer",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Eis",
      "Eisläufer"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "rote",
        "isTarget": false
      },
      {
        "text": "rose",
        "isTarget": true
      },
      {
        "text": "duftet",
        "isTarget": false
      },
      {
        "text": "herrlich",
        "isTarget": false
      },
      {
        "text": "im",
        "isTarget": false
      },
      {
        "text": "sommergarten",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Rose",
      "Sommergarten"
    ]
  },
  {
    "words": [
      {
        "text": "Ein",
        "isFixed": true
      },
      {
        "text": "kleiner",
        "isTarget": false
      },
      {
        "text": "spatz",
        "isTarget": true
      },
      {
        "text": "badet",
        "isTarget": false
      },
      {
        "text": "in",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "frischen",
        "isTarget": false
      },
      {
        "text": "pfütze",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Spatz",
      "Pfütze"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "geduldige",
        "isTarget": false
      },
      {
        "text": "arzt",
        "isTarget": true
      },
      {
        "text": "hört",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "herz",
        "isTarget": true
      },
      {
        "text": "mit",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "stethoskop",
        "isTarget": true
      },
      {
        "text": "ab",
        "isTarget": false
      }
    ],
    "targetNouns": [
      "Arzt",
      "Herz",
      "Stethoskop"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "warme",
        "isTarget": false
      },
      {
        "text": "feuer",
        "isTarget": true
      },
      {
        "text": "wärmt",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "kalten",
        "isTarget": false
      },
      {
        "text": "hände",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Feuer",
      "Hände"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "wald",
        "isTarget": true
      },
      {
        "text": "baut",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "biber",
        "isTarget": true
      },
      {
        "text": "eine",
        "isTarget": false
      },
      {
        "text": "feste",
        "isTarget": false
      },
      {
        "text": "burg",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Wald",
      "Biber",
      "Burg"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "süßen",
        "isTarget": false
      },
      {
        "text": "weintrauben",
        "isTarget": true
      },
      {
        "text": "reifen",
        "isTarget": false
      },
      {
        "text": "am",
        "isTarget": false
      },
      {
        "text": "sonnigen",
        "isTarget": false
      },
      {
        "text": "hang",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Weintrauben",
      "Hang"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "fleißige",
        "isTarget": false
      },
      {
        "text": "gärtner",
        "isTarget": true
      },
      {
        "text": "jätet",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "lästige",
        "isTarget": false
      },
      {
        "text": "unkraut",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Gärtner",
      "Unkraut"
    ]
  },
  {
    "words": [
      {
        "text": "Auf",
        "isFixed": true
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "berg",
        "isTarget": true
      },
      {
        "text": "steht",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "großes",
        "isTarget": false
      },
      {
        "text": "kreuz",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Berg",
      "Kreuz"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "raupe",
        "isTarget": true
      },
      {
        "text": "frisst",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "grünes",
        "isTarget": false
      },
      {
        "text": "blatt",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Raupe",
      "Blatt"
    ]
  },
  {
    "words": [
      {
        "text": "Im",
        "isFixed": true
      },
      {
        "text": "stall",
        "isTarget": true
      },
      {
        "text": "schlafen",
        "isTarget": false
      },
      {
        "text": "drei",
        "isTarget": false
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "ferkel",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Stall",
      "Ferkel"
    ]
  },
  {
    "words": [
      {
        "text": "Das",
        "isFixed": true
      },
      {
        "text": "dicke",
        "isTarget": false
      },
      {
        "text": "kissen",
        "isTarget": true
      },
      {
        "text": "liegt",
        "isTarget": false
      },
      {
        "text": "auf",
        "isTarget": false
      },
      {
        "text": "dem",
        "isTarget": false
      },
      {
        "text": "bequemen",
        "isTarget": false
      },
      {
        "text": "sofa",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Kissen",
      "Sofa"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "neue",
        "isTarget": false
      },
      {
        "text": "ballon",
        "isTarget": true
      },
      {
        "text": "steigt",
        "isTarget": false
      },
      {
        "text": "hoch",
        "isTarget": false
      },
      {
        "text": "in",
        "isTarget": false
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "luft",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Ballon",
      "Luft"
    ]
  },
  {
    "words": [
      {
        "text": "In",
        "isFixed": true
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "burg",
        "isTarget": true
      },
      {
        "text": "wohnt",
        "isTarget": false
      },
      {
        "text": "ein",
        "isTarget": false
      },
      {
        "text": "stolzer",
        "isTarget": false
      },
      {
        "text": "könig",
        "isTarget": true
      },
      {
        "text": "mit",
        "isTarget": false
      },
      {
        "text": "seiner",
        "isTarget": false
      },
      {
        "text": "tochter",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Burg",
      "König",
      "Tochter"
    ]
  },
  {
    "words": [
      {
        "text": "Die",
        "isFixed": true
      },
      {
        "text": "schnelle",
        "isTarget": false
      },
      {
        "text": "libelle",
        "isTarget": true
      },
      {
        "text": "schwirrt",
        "isTarget": false
      },
      {
        "text": "über",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "klare",
        "isTarget": false
      },
      {
        "text": "wasser",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Libelle",
      "Wasser"
    ]
  },
  {
    "words": [
      {
        "text": "Am",
        "isFixed": true
      },
      {
        "text": "abend",
        "isTarget": true
      },
      {
        "text": "zündet",
        "isTarget": false
      },
      {
        "text": "der",
        "isTarget": false
      },
      {
        "text": "vater",
        "isTarget": true
      },
      {
        "text": "die",
        "isTarget": false
      },
      {
        "text": "bunte",
        "isTarget": false
      },
      {
        "text": "laterne",
        "isTarget": true
      },
      {
        "text": "an",
        "isTarget": false
      }
    ],
    "targetNouns": [
      "Abend",
      "Vater",
      "Laterne"
    ]
  },
  {
    "words": [
      {
        "text": "Der",
        "isFixed": true
      },
      {
        "text": "kleine",
        "isTarget": false
      },
      {
        "text": "frosch",
        "isTarget": true
      },
      {
        "text": "hüpft",
        "isTarget": false
      },
      {
        "text": "schnell",
        "isTarget": false
      },
      {
        "text": "in",
        "isTarget": false
      },
      {
        "text": "das",
        "isTarget": false
      },
      {
        "text": "feuchte",
        "isTarget": false
      },
      {
        "text": "gras",
        "isTarget": true
      }
    ],
    "targetNouns": [
      "Frosch",
      "Gras"
    ]
  }
];

  function buildCapitalizationTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? CAPITALIZATION_POOL.length : 5);
    const chosen = (opts && opts.all) ? CAPITALIZATION_POOL : shuffle(CAPITALIZATION_POOL).slice(0, targetCount);
    return chosen.map(item => ({
      fach: 'deutsch',
      schulstufe: 2,
      grade: 2,
      lehrplanRef: 'D-2-Rechtschreiben-Grossklein',
      type: 'capitalization',
      words: item.words.map(w => ({ ...w, isCapital: false })),
      targetNouns: item.targetNouns,
      isCorrect: null,
    }));
  }

  // 3. SCHÜTTELSÄTZE (Reihenfolge ordnen – 100 Sätze Pool)
  const SCRAMBLE_POOL = [
  "Der fleißige Biber fällt einen Baum",
  "Die kluge Eule fliegt durch die Nacht",
  "Im Sommer baden die fröhlichen Kinder im See",
  "Der schnelle Hase hoppelt über die grüne Wiese",
  "Das kleine Eichhörnchen versteckt fleißig braune Nüsse",
  "Im Jänner bauen die Kinder einen lustigen Schneemann",
  "Auf dem Pausenhof spielen alle Kinder gemeinsam",
  "Der bunte Schmetterling nascht süßen Nektar",
  "Meine Oma backt am Sonntag einen feinen Kuchen",
  "Der schlaue Fuchs schleicht leise durch das Moos",
  "Im Herbst färben sich die Blätter der Bäume bunt",
  "Die fleißige Biene summt von Blüte zu Blüte",
  "Ein freundlicher Hund bewacht das große Haus",
  "Die mutigen Bergsteiger erreichen das goldene Gipfelkreuz",
  "Im Turnunterricht laufen die Schüler schnelle Runden",
  "Die stolze Schwalbe baut ein warmes Nest unter dem Dach",
  "Der kleine Igel rollt sich bei Gefahr blitzschnell ein",
  "Am Himmel leuchten in der Nacht viele helle Sterne",
  "Die alte Lokomotive schnauft dampfend über die Schienen",
  "In der Pause jausnen die Schüler einen knackigen Apfel",
  "Der junge Bäcker holt frische Semmeln aus dem Ofen",
  "Im tiefen Schnee hinterlässt das scheue Reh klare Spuren",
  "Auf der sonnigen Alm grasen friedliche Kühe",
  "Der grüne Frosch hüpft mit einem weiten Satz in den Teich",
  "Ein bunter Regenbogen leuchtet nach dem warmen Regen",
  "Die geschickte Katze schleicht leise auf den Dachboden",
  "Im Feber rodeln die fröhlichen Kinder den Hügel hinab",
  "Der große Traktor pflügt das weite Feld am Waldrand",
  "In der Klasse spitzen die Kinder ihre bunten Holzstifte",
  "Auf dem hölzernen Tisch dampft ein heißer Kakao",
  "Der geschickte Tischler hobelt ein langes Brett aus Fichtenholz",
  "Im Frühling erwachen die ersten Blumen aus der Erde",
  "Die liebe Mutter liest am Abend eine spannende Geschichte vor",
  "Der lustige Clown stolpert über seine eigenen Riesenschuhe",
  "Ein winziger Marienkäfer krabbelt über das grüne Kleeblatt",
  "Auf dem stillen See gleitet ein stolzer Schwan",
  "Die fleißigen Ameisen tragen schwere Tannennadeln zum Bau",
  "Im Turnsaal klettern die Kinder mutig an den Stangen",
  "Der erfahrene Fischer wirft sein langes Netz ins Wasser",
  "In der neuen Schultasche liegen saubere Hefte und Bücher",
  "Der schwere Lastwagen bringt frischen Schotter auf die Baustelle",
  "Im warmen Stall kuscheln sich die kleinen Ferkel zusammen",
  "Die tüchtige Feuerwehr löscht den Brand mit viel Wasser",
  "Auf der blühenden Wiese pflückt Lisa einen bunten Blumenstrauß",
  "Der goldene Herbst bringt süße Trauben und reife Äpfel",
  "Ein starker Wind rüttelt an den Zweigen der alten Weide",
  "Im Werkunterricht sägen die Schüler kleine Häuser aus Holz",
  "Die sanfte Musik klingt leise durch das ganze Haus",
  "Der bunte Drache tanzt hoch oben im blauen Herbstwind",
  "Am Waldrand entdeckt der Förster einen prächtigen Hirsch",
  "In der Bäckerei duftet es herrlich nach frischem Brot",
  "Die kleine Schnecke kriecht langsam über den nassen Stein",
  "Auf dem Pausenhof hüpfen die Mädchen über das lange Seil",
  "Der schnelle Schifahrer saust über die frisch verschneite Piste",
  "Im Zoo füttert der Pfleger die hungrigen Pinguine mit Fisch",
  "Ein kleiner Spatz pickt eifrig nach den Brotkrümeln am Boden",
  "Die fleißige Schülerin liest jeden Tag ein ganzes Kapitel",
  "Im stillen Garten reifen rote Paradeiser an den Stauden",
  "Der alte Uhrmacher repariert die wertvolle Standuhr mit der Lupe",
  "Auf dem Bauernhof springt das junge Kälbchen über die Wiese",
  "Die mutige Polizistin sichert den Schulweg an der Kreuzung",
  "Im Frühling zwitschern viele kleine Vögel im dichten Busch",
  "Der kalte Winterwind weht weiße Schneeflocken durch die Luft",
  "Auf dem hohen Kirchturm schlägt die Glocke zur Mittagszeit",
  "Ein braunes Murmeltier sonnt sich auf dem warmen Felsblock",
  "Die hungrigen Enten schnattern aufgeregt am Ufer des Weihers",
  "In der warmen Stube brennt das helle Holzfeuer im Ofen",
  "Der fleißige Gärtner schneidet die Hecke mit einer großen Schere",
  "Am klaren Nachthimmel zieht eine helle Sternschnuppe vorbei",
  "Die kleine Katze rollt den bunten Wollknäuel über den Teppich",
  "Im Turnen üben die Kinder eine schwierige Rolle vorwärts",
  "Der freundliche Postbote bringt ein großes Paket zur Haustür",
  "Auf dem Spielplatz rutschen die Buben die lange Rutsche hinunter",
  "Ein dichter Nebel liegt am frühen Morgen über dem Fluss",
  "Die geschickte Töpferin formt einen runden Krug aus Lehm",
  "Im dichten Schilf brütet die wilde Ente ihre Eier aus",
  "Der junge Reiter springt mit dem Pferd über das Hindernis",
  "In der gemütlichen Küche schneidet der Koch frisches Wurzelgemüse",
  "Die kleinen Bienen fliegen unermüdlich in ihren Bienenstock zurück",
  "Auf dem glatten Eis drehen die Eisläufer elegante Runden",
  "Der Wanderer rastet auf einer gemütlichen Holzbank am Weg",
  "Im Schlossgarten plätschert das klare Wasser in der Schale",
  "Die kluge Krähe knackt die harte Nuss mit dem Schnabel",
  "Am Sonntag macht die ganze Familie einen schönen Spaziergang",
  "Ein alter Eichenbaum spendet an heißen Tagen kühlen Schatten",
  "Die fleißigen Schüler schreiben eine spannende Geschichte ins Heft",
  "Im tiefen Brunnen spiegelt sich das Licht der Sonne",
  "Der schnelle Gepard jagt durch die weite afrikanische Steppe",
  "Auf dem Gemüsemarkt kaufen viele Leute frische Marillen",
  "Die kleine Maus huscht blitzschnell unter den hölzernen Kasten",
  "Im Garten graben die Kinder eine tiefe Grube für den Baum",
  "Der stolze Hahn kräht frühmorgens auf dem Zaun",
  "Ein feiner Nieselregen befeuchtet die durstigen Pflanzen im Beet",
  "Die liebe Großmutter strickt warme Socken aus weicher Schafwolle",
  "Auf dem Sportplatz trainieren die jungen Fußballer für das Turnier",
  "Der scheue Dachs verlässt seine Höhle erst bei Einbruch der Nacht",
  "Im Musikzimmer singt der Schulchor ein fröhliches Frühlingslied",
  "Ein herrlicher Duft nach Bratäpfeln zieht durch die ganze Stube",
  "Die geschickten Kletterer sichern das Seil an der steilen Felswand",
  "Am Ende des Schultages packen alle Kinder ihre Schultaschen ein"
];

  function buildScrambleTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? SCRAMBLE_POOL.length : 5);
    const chosen = (opts && opts.all) ? SCRAMBLE_POOL : shuffle(SCRAMBLE_POOL).slice(0, targetCount);
    return chosen.map(sentence => {
      const tokens = sentence.split(' ');
      const shuffledTokens = shuffle(tokens);
      return {
        fach: "deutsch",
        schulstufe: 2,
        grade: 2,
        lehrplanRef: "D-2-Sprachbetrachtung",
        type: "scramble",
        targetSentence: sentence,
        pool: shuffledTokens,
        assembled: [],
        isCorrect: null,
      };
    });
  }

  // 4. DIE 4 FÄLLE DES NOMENS (4. Klasse – 100 Aufgaben Pool, 25 je Fall)
  const CASES_POOL = [
  {
    "sentence": "Der schlaue Fuchs schleicht leise durch das Unterholz.",
    "target": "Der schlaue Fuchs",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was schleicht leise durch das Unterholz?"
  },
  {
    "sentence": "Die fleißigen Bienen sammeln süßen Nektar.",
    "target": "Die fleißigen Bienen",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was sammelt süßen Nektar?"
  },
  {
    "sentence": "Das dicke Buch liegt auf dem Schreibtisch.",
    "target": "Das dicke Buch",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was liegt auf dem Schreibtisch?"
  },
  {
    "sentence": "Die fröhlichen Schulkinder singen ein Lied.",
    "target": "Die fröhlichen Schulkinder",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was singt ein Lied?"
  },
  {
    "sentence": "Ein lauter Donner erschreckt die Tiere im Wald.",
    "target": "Ein lauter Donner",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was erschreckt die Tiere?"
  },
  {
    "sentence": "Der alte Förster füttert die Rehe im Winter.",
    "target": "Der alte Förster",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was füttert die Rehe?"
  },
  {
    "sentence": "Meine kleine Schwester zeichnet ein Haus.",
    "target": "Meine kleine Schwester",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was zeichnet ein Haus?"
  },
  {
    "sentence": "Der steile Berg ragt weit in die Wolken.",
    "target": "Der steile Berg",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was ragt in die Wolken?"
  },
  {
    "sentence": "Ein bunter Schmetterling tanzt im Sommerwind.",
    "target": "Ein bunter Schmetterling",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was tanzt im Sommerwind?"
  },
  {
    "sentence": "Die mutigen Feuerwehrleute löschen das Feuer.",
    "target": "Die mutigen Feuerwehrleute",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was löscht das Feuer?"
  },
  {
    "sentence": "Der gelbe Schulbus hält vor der Volksschule.",
    "target": "Der gelbe Schulbus",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was hält vor der Schule?"
  },
  {
    "sentence": "Das treue Pferd galoppiert über die Koppel.",
    "target": "Das treue Pferd",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was galoppiert über die Koppel?"
  },
  {
    "sentence": "Ein kleiner Igel raschelt im Laubhaufen.",
    "target": "Ein kleiner Igel",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was raschelt im Laubhaufen?"
  },
  {
    "sentence": "Die helle Sonne wärmt das grüne Tal.",
    "target": "Die helle Sonne",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was wärmt das grüne Tal?"
  },
  {
    "sentence": "Der freundliche Nachbar grüßt vom Balkon.",
    "target": "Der freundliche Nachbar",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was grüßt vom Balkon?"
  },
  {
    "sentence": "Ein riesiger Felsbrocken blockiert die Straße.",
    "target": "Ein riesiger Felsbrocken",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was blockiert die Straße?"
  },
  {
    "sentence": "Die geschickte Turnerin gewinnt die Goldmedaille.",
    "target": "Die geschickte Turnerin",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was gewinnt die Goldmedaille?"
  },
  {
    "sentence": "Das kalte Wasser sprudelt aus der Quelle.",
    "target": "Das kalte Wasser",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was sprudelt aus der Quelle?"
  },
  {
    "sentence": "Der neue Spielplatz gefällt allen Schülern.",
    "target": "Der neue Spielplatz",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was gefällt allen Schülern?"
  },
  {
    "sentence": "Die alte Eiche spendet kühlen Schatten.",
    "target": "Die alte Eiche",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was spendet kühlen Schatten?"
  },
  {
    "sentence": "Ein schneller Zug saust über die Brücke.",
    "target": "Ein schneller Zug",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was saust über die Brücke?"
  },
  {
    "sentence": "Die kluge Eule jagt in der finsteren Nacht.",
    "target": "Die kluge Eule",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was jagt in der Nacht?"
  },
  {
    "sentence": "Der braune Bär erwacht aus dem Winterschlaf.",
    "target": "Der braune Bär",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was erwacht aus dem Winterschlaf?"
  },
  {
    "sentence": "Das moderne Flugzeug landet sicher in Wien.",
    "target": "Das moderne Flugzeug",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was landet sicher?"
  },
  {
    "sentence": "Die fleißige Köchin bereitet ein Festessen vor.",
    "target": "Die fleißige Köchin",
    "caseIndex": 0,
    "hint": "Frageprobe: Wer oder was bereitet ein Festessen vor?"
  },
  {
    "sentence": "Das ist die Schultasche des Schülers.",
    "target": "des Schülers",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Schultasche ist das?"
  },
  {
    "sentence": "Die Blätter des Baumes werden im Herbst bunt.",
    "target": "des Baumes",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Blätter werden im Herbst bunt?"
  },
  {
    "sentence": "Die Pfoten des Hundes sind schmutzig vom Regen.",
    "target": "des Hundes",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Pfoten sind schmutzig?"
  },
  {
    "sentence": "Wegen des dichten Nebels fahren die Autos langsam.",
    "target": "des dichten Nebels",
    "caseIndex": 1,
    "hint": "Frageprobe: Wegen wessen fahren die Autos langsam? Achte auf das Signalwort 'wegen'."
  },
  {
    "sentence": "Das Bellen des Nachbarhundes weckte die Schläfer.",
    "target": "des Nachbarhundes",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Bellen weckte die Schläfer?"
  },
  {
    "sentence": "Die Freude des kleinen Buben war riesengroß.",
    "target": "des kleinen Buben",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Freude war riesengroß?"
  },
  {
    "sentence": "Das Dach des alten Schuppens ist undicht geworden.",
    "target": "des alten Schuppens",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Dach ist undicht geworden?"
  },
  {
    "sentence": "Trotz des starken Regens wanderten wir weiter.",
    "target": "des starken Regens",
    "caseIndex": 1,
    "hint": "Frageprobe: Trotz wessen? Achte auf das Signalwort 'trotz'."
  },
  {
    "sentence": "Die Spitze des Berges war weiß verschneit.",
    "target": "des Berges",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Spitze war weiß verschneit?"
  },
  {
    "sentence": "Wir bewundern die Farben des Regenbogens am Himmel.",
    "target": "des Regenbogens",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Farben bewundern wir?"
  },
  {
    "sentence": "Die Reifen des Fahrrades hatten zu wenig Luft.",
    "target": "des Fahrrades",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Reifen hatten zu wenig Luft?"
  },
  {
    "sentence": "Der Duft der frischen Semmeln lockte alle Kunden an.",
    "target": "der frischen Semmeln",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Duft lockte alle Kunden an?"
  },
  {
    "sentence": "Das Nest der kleinen Schwalbe klebt unter dem Dach.",
    "target": "der kleinen Schwalbe",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Nest klebt unter dem Dach?"
  },
  {
    "sentence": "Der Klang der Geige verzauberte das Publikum.",
    "target": "der Geige",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Klang verzauberte das Publikum?"
  },
  {
    "sentence": "Die Spuren der Rehe waren im Schnee sichtbar.",
    "target": "der Rehe",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Spuren waren im Schnee sichtbar?"
  },
  {
    "sentence": "Das Heulen des starken Windes klang unheimlich.",
    "target": "des starken Windes",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Heulen klang unheimlich?"
  },
  {
    "sentence": "Während der Schulferien verreiste die Familie nach Kärnten.",
    "target": "der Schulferien",
    "caseIndex": 1,
    "hint": "Frageprobe: Während wessen? Achte auf das Signalwort 'während'."
  },
  {
    "sentence": "Das Licht der Laterne erhellte den dunklen Gehsteig.",
    "target": "der Laterne",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Licht erhellte den Gehsteig?"
  },
  {
    "sentence": "Die Fenster des Klassenzimmers wurden geöffnet.",
    "target": "des Klassenzimmers",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Fenster wurden geöffnet?"
  },
  {
    "sentence": "Der Rüssel des Elefanten ist sehr beweglich.",
    "target": "des Elefanten",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Rüssel ist sehr beweglich?"
  },
  {
    "sentence": "Die Schale der reifen Banane war gelb gepunktet.",
    "target": "der reifen Banane",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Schale war gelb gepunktet?"
  },
  {
    "sentence": "Wegen des glatten Eises streute der Hausmeister Salz.",
    "target": "des glatten Eises",
    "caseIndex": 1,
    "hint": "Frageprobe: Wegen wessen streute er Salz?"
  },
  {
    "sentence": "Die Flügel des Flugzeugs glänzten im Sonnenlicht.",
    "target": "des Flugzeugs",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Flügel glänzten?"
  },
  {
    "sentence": "Das Lachen der glücklichen Kinder erfüllte den Park.",
    "target": "der glücklichen Kinder",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Lachen erfüllte den Park?"
  },
  {
    "sentence": "Die Jacke meines Bruders hängt an der Garderobe.",
    "target": "meines Bruders",
    "caseIndex": 1,
    "hint": "Frageprobe: Wessen Jacke hängt dort?"
  },
  {
    "sentence": "Felix hilft der alten Großmutter beim Einkaufen.",
    "target": "der alten Großmutter",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem hilft Felix beim Einkaufen?"
  },
  {
    "sentence": "Wir schenken dem Geburtstagskind ein tolles Spiel.",
    "target": "dem Geburtstagskind",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem schenken wir ein tolles Spiel?"
  },
  {
    "sentence": "Die Lehrerin antwortet dem neugierigen Schüler.",
    "target": "dem neugierigen Schüler",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem antwortet die Lehrerin?"
  },
  {
    "sentence": "Das kleine Kätzchen schnurrt auf dem weichen Sessel.",
    "target": "dem weichen Sessel",
    "caseIndex": 2,
    "hint": "Frageprobe: Wo (auf wem) schnurrt das Kätzchen?"
  },
  {
    "sentence": "Er vertraut seinem besten Freund vollkommen.",
    "target": "seinem besten Freund",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem vertraut er vollkommen?"
  },
  {
    "sentence": "Die Suppe schmeckt den hungrigen Wanderern vorzüglich.",
    "target": "den hungrigen Wanderern",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem schmeckt die Suppe?"
  },
  {
    "sentence": "Ich gebe dem kleinen Hund ein Stück Wurst.",
    "target": "dem kleinen Hund",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem gebe ich ein Stück Wurst?"
  },
  {
    "sentence": "Sie begegnen dem netten Polizisten am Zebrastreifen.",
    "target": "dem netten Polizisten",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem begegnen sie?"
  },
  {
    "sentence": "Das Gemälde gefällt dem kunstsinnigen Besucher.",
    "target": "dem kunstsinnigen Besucher",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem gefällt das Gemälde?"
  },
  {
    "sentence": "Die Ärztin hört dem besorgten Patienten aufmerksam zu.",
    "target": "dem besorgten Patienten",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem hört die Ärztin zu?"
  },
  {
    "sentence": "Wir gratulieren der siegreichen Mannschaft herzlich.",
    "target": "der siegreichen Mannschaft",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem gratulieren wir herzlich?"
  },
  {
    "sentence": "Das Buch gehört meiner fleißigen Mitschülerin.",
    "target": "meiner fleißigen Mitschülerin",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem gehört das Buch?"
  },
  {
    "sentence": "Die Schwalben füttern den hungrigen Jungvögeln Insekten.",
    "target": "den hungrigen Jungvögeln",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem füttern die Schwalben Insekten?"
  },
  {
    "sentence": "Er leiht seinem Bruder das neue Mountainbike.",
    "target": "seinem Bruder",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem leiht er das Mountainbike?"
  },
  {
    "sentence": "Die Sonne schadet den empfindlichen Augen.",
    "target": "den empfindlichen Augen",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem schadet die Sonne?"
  },
  {
    "sentence": "Anna dankt der freundlichen Nachbarin für die Blumen.",
    "target": "der freundlichen Nachbarin",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem dankt Anna?"
  },
  {
    "sentence": "Der Brief wurde dem Postempfänger übergeben.",
    "target": "dem Postempfänger",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem wurde der Brief übergeben?"
  },
  {
    "sentence": "Das Fell nützt dem Bären als Schutz gegen die Kälte.",
    "target": "dem Bären",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem nützt das dicke Fell?"
  },
  {
    "sentence": "Wir winken dem abfahrenden Zug mit beiden Händen.",
    "target": "dem abfahrenden Zug",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem winken wir nach?"
  },
  {
    "sentence": "Der Zaun bietet den grasenden Kühen Schutz.",
    "target": "den grasenden Kühen",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem bietet der Zaun Schutz?"
  },
  {
    "sentence": "Ich zeige der Klasse meine gesammelten Mineralien.",
    "target": "der Klasse",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem zeige ich meine Mineralien?"
  },
  {
    "sentence": "Der Koch serviert den Gästen die heiße Suppe.",
    "target": "den Gästen",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem serviert der Koch die Suppe?"
  },
  {
    "sentence": "Das neue Kleid passt der eleganten Dame ausgezeichnet.",
    "target": "der eleganten Dame",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem passt das Kleid?"
  },
  {
    "sentence": "Der Schüler widerspricht dem strengen Schiedsrichter nicht.",
    "target": "dem strengen Schiedsrichter",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem widerspricht der Schüler nicht?"
  },
  {
    "sentence": "Sie reichen dem geschwächten Tier frisches Wasser.",
    "target": "dem geschwächten Tier",
    "caseIndex": 2,
    "hint": "Frageprobe: Wem reichen sie frisches Wasser?"
  },
  {
    "sentence": "Lukas zeichnet einen bunten Vogel auf das Papier.",
    "target": "einen bunten Vogel",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was zeichnet Lukas?"
  },
  {
    "sentence": "Die Kinder pflücken reife Erdbeeren im Garten.",
    "target": "reife Erdbeeren",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was pflücken die Kinder?"
  },
  {
    "sentence": "Der Förster beobachtet einen scheuen Hirsch am Waldrand.",
    "target": "einen scheuen Hirsch",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was beobachtet der Förster?"
  },
  {
    "sentence": "Wir bauen heute einen lustigen Schneemann im Garten.",
    "target": "einen lustigen Schneemann",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was bauen wir im Garten?"
  },
  {
    "sentence": "Die Katze fängt eine kleine Maus im Speicher.",
    "target": "eine kleine Maus",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was fängt die Katze?"
  },
  {
    "sentence": "Der Schüler schreibt einen spannenden Aufsatz ins Heft.",
    "target": "einen spannenden Aufsatz",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was schreibt der Schüler?"
  },
  {
    "sentence": "Ich suche meinen verlorenen Hausschlüssel überall.",
    "target": "meinen verlorenen Hausschlüssel",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was suche ich überall?"
  },
  {
    "sentence": "Die Mutter schält die knackigen Karotten für den Salat.",
    "target": "die knackigen Karotten",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was schält die Mutter?"
  },
  {
    "sentence": "Der Bäcker backt knuspriges Brot im Steinofen.",
    "target": "knuspriges Brot",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was backt der Bäcker?"
  },
  {
    "sentence": "Er repariert das kaputte Fahrrad mit neuem Werkzeug.",
    "target": "das kaputte Fahrrad",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was repariert er?"
  },
  {
    "sentence": "Die Polizei sucht den flüchtigen Fahrraddieb.",
    "target": "den flüchtigen Fahrraddieb",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was sucht die Polizei?"
  },
  {
    "sentence": "Wir hören ein leises Rascheln im Gebüsch.",
    "target": "ein leises Rascheln",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was hören wir?"
  },
  {
    "sentence": "Der Wind biegt die dünnen Zweige der Weide.",
    "target": "die dünnen Zweige",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was biegt der Wind?"
  },
  {
    "sentence": "Sie liest ein langes Kapitel vor dem Einschlafen.",
    "target": "ein langes Kapitel",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was liest sie vor dem Einschlafen?"
  },
  {
    "sentence": "Die Schülerin löst die schwierige Matheaufgabe ohne Hilfe.",
    "target": "die schwierige Matheaufgabe",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was löst die Schülerin?"
  },
  {
    "sentence": "Der Fotograf knipst ein wunderschönes Foto vom Schloss.",
    "target": "ein wunderschönes Foto",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was knipst der Fotograf?"
  },
  {
    "sentence": "Wir überqueren die breite Straße am Zebrastreifen.",
    "target": "die breite Straße",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was überqueren wir?"
  },
  {
    "sentence": "Der Hund vergräbt einen großen Knochen im Blumenbeet.",
    "target": "einen großen Knochen",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was vergräbt der Hund?"
  },
  {
    "sentence": "Lisa bindet ein rotes Haarband um ihren Zopf.",
    "target": "ein rotes Haarband",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was bindet Lisa um ihren Zopf?"
  },
  {
    "sentence": "Der Gärtner gießt die durstigen Rosen mit der Kanne.",
    "target": "die durstigen Rosen",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was gießt der Gärtner?"
  },
  {
    "sentence": "Ich packe meine neue Schultasche für morgen.",
    "target": "meine neue Schultasche",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was packe ich?"
  },
  {
    "sentence": "Der Bub schießt den ledernen Ball direkt ins Tor.",
    "target": "den ledernen Ball",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was schießt der Bub?"
  },
  {
    "sentence": "Sie kauft eine warme Winterjacke für die Skitage.",
    "target": "eine warme Winterjacke",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was kauft sie?"
  },
  {
    "sentence": "Die Feuerwehr rettet ein verängstigtes Kätzchen vom Baum.",
    "target": "ein verängstigtes Kätzchen",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was rettet die Feuerwehr?"
  },
  {
    "sentence": "Wir singen ein lustiges Wanderlied beim Gehen.",
    "target": "ein lustiges Wanderlied",
    "caseIndex": 3,
    "hint": "Frageprobe: Wen oder was singen wir?"
  }
];

  function buildCasesTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? CASES_POOL.length : 5);
    const chosen = (opts && opts.all) ? CASES_POOL : shuffle(CASES_POOL).slice(0, targetCount);

    if (opts && opts.forPrint) {
      const caseNames = [
        'Werfall (1. Fall: Wer oder was?)',
        'Wesfall (2. Fall: Wessen?)',
        'Wemfall (3. Fall: Wem?)',
        'Wenfall (4. Fall: Wen oder was?)'
      ];
      const shortNames = ['Werfall', 'Wesfall', 'Wemfall', 'Wenfall'];
      return chosen.map(c => ({
        fach: 'deutsch',
        type: 'cases',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'D-4-Sprachbetrachtung-Faelle',
        sentence: c.sentence,
        targetPhrase: c.target,
        answer: shortNames[c.caseIndex],
        fullCase: caseNames[c.caseIndex],
        solutionText: shortNames[c.caseIndex],
        prompt: 'Bestimme den Fall des unterstrichenen Nomens (Werfall, Wesfall, Wemfall, Wenfall):'
      }));
    }

    const caseOptions = [
      '1. Fall (Wer-Fall / Nominativ)',
      '2. Fall (Wessen-Fall / Genitiv)',
      '3. Fall (Wem-Fall / Dativ)',
      '4. Fall (Wen-Fall / Akkusativ)'
    ];

    return chosen.map(item => {
      const sentenceWithUnderscore = item.sentence.replace(item.target, '_' + item.target + '_');
      return {
        fach: 'deutsch',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'D-4-Sprachbetrachtung-Faelle',
        type: 'multiple-choice',
        icon: null,
        question: 'In welchem Fall steht das unterstrichene Namenwort?\n„' + sentenceWithUnderscore + '“',
        options: caseOptions,
        correctIndex: item.caseIndex,
        correctText: caseOptions[item.caseIndex],
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 5. ZEITFORMEN (Gegenwart / Mitvergangenheit / Vergangenheit / Zukunft – 100 Sätze Pool)
  const TENSES_POOL = [
  {
    "sentence": "Die fröhlichen Kinder singen ein schönes Lied in der Klasse.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Die fröhlichen Kinder singen ein schönes Lied in der Klasse.",
    "pastSentence": "Die fröhlichen Kinder sangen ein schönes Lied in der Klasse.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Der geschickte Bäcker backt heute frisches Brot im Steinofen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Bäcker backt frisches Brot im Steinofen.",
    "pastSentence": "Der Bäcker backte frisches Brot im Steinofen.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Ein kleiner Igel raschelt im trockenen Laubhaufen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Ein kleiner Igel raschelt im trockenen Laubhaufen.",
    "pastSentence": "Ein kleiner Igel raschelte im trockenen Laubhaufen.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Wir lernen fleißig für die nächste Schularbeit.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Wir lernen fleißig für die nächste Schularbeit.",
    "pastSentence": "Wir lernten fleißig für die nächste Schularbeit.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Der schnelle Schifahrer kurvt geschickt über die Piste.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Schifahrer kurvt über die Piste.",
    "pastSentence": "Der Schifahrer kurvte über die Piste.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Die Katze schläft friedlich auf dem weichen Sessel.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Die Katze schläft friedlich auf dem weichen Sessel.",
    "pastSentence": "Die Katze schlief friedlich auf dem weichen Sessel.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Auf dem Pausenhof spielen die Kinder Fangen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Auf dem Pausenhof spielen die Kinder Fangen.",
    "pastSentence": "Auf dem Pausenhof spielten die Kinder Fangen.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Der alte Förster füttert die Rehe am Waldrand.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Förster füttert die Rehe am Waldrand.",
    "pastSentence": "Der Förster fütterte die Rehe am Waldrand.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Ich lese ein spannendes Buch über Tiere der Alpen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Ich lese ein spannendes Buch über Tiere der Alpen.",
    "pastSentence": "Ich las ein spannendes Buch über Tiere der Alpen.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Der Fluss fließt ruhig durch das weite Tal.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Fluss fließt ruhig durch das weite Tal.",
    "pastSentence": "Der Fluss floss ruhig durch das weite Tal.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Die mutigen Bergsteiger klettern auf den steilen Gipfel.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Die Bergsteiger klettern auf den steilen Gipfel.",
    "pastSentence": "Die Bergsteiger kletterten auf den steilen Gipfel.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Ein kalter Wind weht durch die engen Gassen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Ein kalter Wind weht durch die engen Gassen.",
    "pastSentence": "Ein kalter Wind wehte durch die engen Gassen.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Lisa schreibt eine Postkarte an ihre Großeltern.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Lisa schreibt eine Postkarte an ihre Großeltern.",
    "pastSentence": "Lisa schrieb eine Postkarte an ihre Großeltern.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Die fleißigen Bienen summen um die blühenden Bäume.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Die Bienen summen um die blühenden Bäume.",
    "pastSentence": "Die Bienen summten um die blühenden Bäume.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Der Maler streicht die Zimmerdecke mit weißer Farbe.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Maler streicht die Zimmerdecke mit weißer Farbe.",
    "pastSentence": "Der Maler strich die Zimmerdecke mit weißer Farbe.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Wir jausnen heute im Schatten der großen Linde.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Wir jausnen im Schatten der großen Linde.",
    "pastSentence": "Wir jausneten im Schatten der großen Linde.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Der treue Hund bewacht das Hoftor des Bauern.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Hund bewacht das Hoftor des Bauern.",
    "pastSentence": "Der Hund bewachte das Hoftor des Bauern.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Im Turnsaal turnen die Schüler an den Ringen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Im Turnsaal turnen die Schüler an den Ringen.",
    "pastSentence": "Im Turnsaal turnten die Schüler an den Ringen.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Die Mutter kocht eine köstliche Gemüsesuppe.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Die Mutter kocht eine köstliche Gemüsesuppe.",
    "pastSentence": "Die Mutter kochte eine köstliche Gemüsesuppe.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Ein bunter Schmetterling flattert von Blume zu Blume.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Ein Schmetterling flattert von Blume zu Blume.",
    "pastSentence": "Ein Schmetterling flatterte von Blume zu Blume.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Der Schüler spitzt seinen Bleistift vor dem Schreiben.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Schüler spitzt seinen Bleistift.",
    "pastSentence": "Der Schüler spitzte seinen Bleistift.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Auf dem Teich schwimmt eine Entenfamilie.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Auf dem Teich schwimmt eine Entenfamilie.",
    "pastSentence": "Auf dem Teich schwamm eine Entenfamilie.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Die Glocken der Pfarrkirche läuten den Feierabend ein.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Die Glocken der Pfarrkirche läuten den Feierabend ein.",
    "pastSentence": "Die Glocken der Pfarrkirche läuteten den Feierabend ein.",
    "hint": "Probe: Setze gedanklich 'Jetzt' an den Satzanfang – die Verbform bleibt dabei unverändert."
  },
  {
    "sentence": "Wir trinken frische Milch direkt vom Bauernhof.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Wir trinken frische Milch vom Bauernhof.",
    "pastSentence": "Wir tranken frische Milch vom Bauernhof.",
    "hint": "Achte auf das Tunwort: Das Ereignis findet in diesem Moment vor unseren Augen statt."
  },
  {
    "sentence": "Der Mond leuchtet hell über den Bergen.",
    "tense": "Gegenwart (Präsens)",
    "presentSentence": "Der Mond leuchtet hell über den Bergen.",
    "pastSentence": "Der Mond leuchtete hell über den Bergen.",
    "hint": "Signalprobe: Passt das Signalwort 'Jetzt gerade' zum Tunwort im Satz? Das Geschehen passiert im aktuellen Augenblick."
  },
  {
    "sentence": "Gestern liefen die Kinder schnell nach Hause.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Die Kinder laufen schnell nach Hause.",
    "pastSentence": "Die Kinder liefen schnell nach Hause.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Der schlaue Fuchs schlich leise durch den Wald.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der schlaue Fuchs schleicht leise durch den Wald.",
    "pastSentence": "Der schlaue Fuchs schlich leise durch den Wald.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Der Vogel flog hoch in den blauen Himmel.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Vogel fliegt hoch in den blauen Himmel.",
    "pastSentence": "Der Vogel flog hoch in den blauen Himmel.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Er sang ein fröhliches Lied beim Wandern.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Er singt ein fröhliches Lied beim Wandern.",
    "pastSentence": "Er sang ein fröhliches Lied beim Wandern.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Das tapfere Mädchen half der alten Nachbarin.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Das Mädchen hilft der alten Nachbarin.",
    "pastSentence": "Das Mädchen half der alten Nachbarin.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Der alte Baum verlor im Spätherbst alle Blätter.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Baum verliert im Spätherbst alle Blätter.",
    "pastSentence": "Der Baum verlor im Spätherbst alle Blätter.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Wir lasen gemeinsam eine spannende Sage über Wien.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Wir lesen gemeinsam eine spannende Sage über Wien.",
    "pastSentence": "Wir lasen gemeinsam eine spannende Sage über Wien.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Der Reiter ritt im Galopp über die weite Wiese.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Reiter reitet über die weite Wiese.",
    "pastSentence": "Der Reiter ritt über die weite Wiese.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Die Schüler schrieben einen fehlerfreien Text ins Heft.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Die Schüler schreiben einen Text ins Heft.",
    "pastSentence": "Die Schüler schrieben einen Text ins Heft.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Ein heftiger Blitz zuckte über das finstere Tal.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Ein Blitz zuckt über das finstere Tal.",
    "pastSentence": "Ein Blitz zuckte über das finstere Tal.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Der Hase sprang erschrocken in das dichte Gebüsch.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Hase springt erschrocken in das dichte Gebüsch.",
    "pastSentence": "Der Hase sprang erschrocken in das dichte Gebüsch.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Die Kinder bauten eine prächtige Sandburg am See.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Die Kinder bauen eine Sandburg am See.",
    "pastSentence": "Die Kinder bauten eine Sandburg am See.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Das Eichhörnchen fand seine vergrabenen Nüsse wieder.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Das Eichhörnchen findet seine Nüsse wieder.",
    "pastSentence": "Das Eichhörnchen fand seine Nüsse wieder.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Der Koch briet das Fleisch in der großen Pfanne.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Koch brät das Fleisch in der großen Pfanne.",
    "pastSentence": "Der Koch briet das Fleisch in der großen Pfanne.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Wir schwammen im kühlen Bergsee bis zur Insel.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Wir schwimmen im kühlen Bergsee bis zur Insel.",
    "pastSentence": "Wir schwammen im kühlen Bergsee bis zur Insel.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Der Zug hielt pünktlich am Salzburger Hauptbahnhof.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Zug hält pünktlich am Salzburger Hauptbahnhof.",
    "pastSentence": "Der Zug hielt pünktlich am Salzburger Hauptbahnhof.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Die Lehrerin lobte die fleißige Klasse für ihre Arbeit.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Die Lehrerin lobt die fleißige Klasse.",
    "pastSentence": "Die Lehrerin lobte die fleißige Klasse.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Ein schwerer Stein fiel polternd den Hang hinab.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Ein schwerer Stein fällt den Hang hinab.",
    "pastSentence": "Ein schwerer Stein fiel den Hang hinab.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Sie trugen die schweren Einkäufe die Treppe hinauf.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Sie tragen die schweren Einkäufe die Treppe hinauf.",
    "pastSentence": "Sie trugen die schweren Einkäufe die Treppe hinauf.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Das Murmeltier pfiff warnend vor dem Steinadler.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Das Murmeltier pfeift warnend vor dem Steinadler.",
    "pastSentence": "Das Murmeltier pfiff warnend vor dem Steinadler.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Der Schüler dachte lange über die schwierige Frage nach.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Schüler denkt lange über die Frage nach.",
    "pastSentence": "Der Schüler dachte lange über die Frage nach.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Die alte Glocke schlug zwölfmal um Mitternacht.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Die Glocke schlägt zwölfmal um Mitternacht.",
    "pastSentence": "Die Glocke schlug zwölfmal um Mitternacht.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Wir sahen viele Rehe am Waldrand grasen.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Wir sehen viele Rehe am Waldrand grasen.",
    "pastSentence": "Wir sahen viele Rehe am Waldrand grasen.",
    "hint": "Erzählprobe: So wird ein vergangenes Geschehen in Geschichten erzählt (ein einziges Zeitwort in der Vergangenheitsform)."
  },
  {
    "sentence": "Der Gärtner goss die durstigen Pflanzen im Beet.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Der Gärtner gießt die durstigen Pflanzen.",
    "pastSentence": "Der Gärtner goss die durstigen Pflanzen.",
    "hint": "Signalprobe: Passt das Signalwort 'Gestern' oder 'Damals' ohne Hilfsverb zum Tunwort? Es ist die einteilige Erzählform in Büchern."
  },
  {
    "sentence": "Das Kätzchen trank die frische Milch aus der Schale.",
    "tense": "Mitvergangenheit (Präteritum)",
    "presentSentence": "Das Kätzchen trinkt die frische Milch.",
    "pastSentence": "Das Kätzchen trank die frische Milch.",
    "hint": "Achte auf die einfache Vergangenheitsform des Tunworts: Es steht ganz alleine ohne Hilfswort wie 'hat' oder 'ist'."
  },
  {
    "sentence": "Wir haben gestern gemeinsam einen Film geschaut.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Wir schauen einen Film.",
    "pastSentence": "Wir schauten einen Film.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Anna hat gestern ihre Hausübung sorgfältig gemacht.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Anna macht ihre Hausübung.",
    "pastSentence": "Anna machte ihre Hausübung.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Die Schüler sind schnell über den Sportplatz gelaufen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Die Schüler laufen über den Sportplatz.",
    "pastSentence": "Die Schüler liefen über den Sportplatz.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Der Bäcker hat frühmorgens frische Semmeln gebacken.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Der Bäcker backt frische Semmeln.",
    "pastSentence": "Der Bäcker backte frische Semmeln.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Ich habe meiner Mutter beim Aufräumen geholfen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Ich helfe meiner Mutter beim Aufräumen.",
    "pastSentence": "Ich half meiner Mutter beim Aufräumen.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Die Schwalben sind im Herbst nach Süden gezogen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Die Schwalben ziehen nach Süden.",
    "pastSentence": "Die Schwalben zogen nach Süden.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Felix hat ein wunderschönes Bild mit Wasserfarben gemalt.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Felix malt ein Bild mit Wasserfarben.",
    "pastSentence": "Felix malte ein Bild mit Wasserfarben.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Wir sind gestern auf den hohen Aussichtsturm gestiegen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Wir steigen auf den Aussichtsturm.",
    "pastSentence": "Wir stiegen auf den Aussichtsturm.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Der Hund hat laut an der Haustür gebellt.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Der Hund bellt an der Haustür.",
    "pastSentence": "Der Hund bellte an der Haustür.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Meine Oma hat einen feinen Apfelstrudel zubereitet.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Meine Oma bereitet einen Apfelstrudel zu.",
    "pastSentence": "Meine Oma bereitete einen Apfelstrudel zu.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Die Kinder haben im Garten viele bunte Blätter gesammelt.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Die Kinder sammeln viele bunte Blätter.",
    "pastSentence": "Die Kinder sammelten viele bunte Blätter.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Ein starker Regen hat die Straße überflutet.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Ein starker Regen überflutet die Straße.",
    "pastSentence": "Ein starker Regen überflutete die Straße.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Ich bin heute sehr früh aufgewacht.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Ich wache sehr früh auf.",
    "pastSentence": "Ich wachte sehr früh auf.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Der Polizist hat den Verkehr an der Kreuzung geregelt.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Der Polizist regelt den Verkehr.",
    "pastSentence": "Der Polizist regelte den Verkehr.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Wir haben das spannende Spiel knapp gewonnen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Wir gewinnen das spannende Spiel.",
    "pastSentence": "Wir gewannen das spannende Spiel.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Die Katze ist blitzschnell auf den Baum geklettert.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Die Katze klettert auf den Baum.",
    "pastSentence": "Die Katze kletterte auf den Baum.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Der Lehrer hat den Schülern eine neue Rechenart erklärt.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Der Lehrer erklärt eine Rechenart.",
    "pastSentence": "Der Lehrer erklärte eine Rechenart.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Das Eichhörnchen ist von Ast zu Ast gesprungen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Das Eichhörnchen springt von Ast zu Ast.",
    "pastSentence": "Das Eichhörnchen sprang von Ast zu Ast.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Sie haben gemeinsam ein lustiges Lied gesungen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Sie singen gemeinsam ein Lied.",
    "pastSentence": "Sie sangen gemeinsam ein Lied.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Der Gärtner hat viele neue Tulpenzwiebeln gepflanzt.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Der Gärtner pflanzt neue Tulpenzwiebeln.",
    "pastSentence": "Der Gärtner pflanzte neue Tulpenzwiebeln.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Wir sind am Wochenende mit der Zahnradbahn gefahren.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Wir fahren mit der Zahnradbahn.",
    "pastSentence": "Wir fuhren mit der Zahnradbahn.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Lisa hat alle Aufgaben richtig gelöst.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Lisa löst alle Aufgaben richtig.",
    "pastSentence": "Lisa löste alle Aufgaben richtig.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Der Vogel hat ein schönes Nest gebaut.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Der Vogel baut ein Nest.",
    "pastSentence": "Der Vogel baute ein Nest.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit Hilfswort ('hat' oder 'ist') und der Ge-Form am Satzende."
  },
  {
    "sentence": "Ich habe den Brief in den gelben Postkasten geworfen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Ich werfe den Brief in den Postkasten.",
    "pastSentence": "Ich warf den Brief in den Postkasten.",
    "hint": "Gesprochene Zeitform: Vorne steht das gebeugte Hilfsverb, ganz hinten die Partizipform (Satzklammer)."
  },
  {
    "sentence": "Die Schüler sind pünktlich in der Klasse angekommen.",
    "tense": "Vergangenheit (Perfekt)",
    "presentSentence": "Die Schüler kommen pünktlich an.",
    "pastSentence": "Die Schüler kamen pünktlich an.",
    "hint": "Zweiteilige Form: Suche die beiden Teile des Prädikats – das Hilfsverb in der Mitte und das Tunwort am Satzende."
  },
  {
    "sentence": "Morgen werden wir mit dem Bus in den Tierpark fahren.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Wir fahren in den Tierpark.",
    "pastSentence": "Wir fuhren in den Tierpark.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Nächste Woche wird es im Gebirge viel schneien.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Es schneit im Gebirge.",
    "pastSentence": "Es schneite im Gebirge.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Die Kinder werden am Nachmittag im Hallenbad schwimmen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Kinder schwimmen im Hallenbad.",
    "pastSentence": "Die Kinder schwammen im Hallenbad.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Im Sommer werde ich meine Verwandten in Graz besuchen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Ich besuche meine Verwandten in Graz.",
    "pastSentence": "Ich besuchte meine Verwandten in Graz.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Der geschickte Tischler wird den neuen Schreibtisch bauen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Tischler baut den Schreibtisch.",
    "pastSentence": "Der Tischler baute den Schreibtisch.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Wir werden am Wochenende eine weite Radtour machen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Wir machen eine weite Radtour.",
    "pastSentence": "Wir machten eine weite Radtour.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Die Lehrerin wird morgen die Hefte austeilen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Lehrerin teilt die Hefte aus.",
    "pastSentence": "Die Lehrerin teilte die Hefte aus.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Im Frühling werden die bunten Tulpen wieder blühen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die bunten Tulpen blühen wieder.",
    "pastSentence": "Die bunten Tulpen blühten wieder.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Der Schüler wird fleißig für das Diktat üben.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Schüler übt fleißig für das Diktat.",
    "pastSentence": "Der Schüler übte fleißig für das Diktat.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Bald wird der warme Sommerwind über die Felder wehen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Sommerwind weht über die Felder.",
    "pastSentence": "Der Sommerwind wehte über die Felder.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Die Bergsteiger werden das Gipfelkreuz vor Mittag erreichen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Bergsteiger erreichen das Gipfelkreuz.",
    "pastSentence": "Die Bergsteiger erreichten das Gipfelkreuz.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Meine Eltern werden ein neues Auto kaufen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Meine Eltern kaufen ein neues Auto.",
    "pastSentence": "Meine Eltern kauften ein neues Auto.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Der Arzt wird das verletzte Knie gründlich untersuchen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Arzt untersucht das verletzte Knie.",
    "pastSentence": "Der Arzt untersuchte das verletzte Knie.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Wir werden im Musikunterricht neue Lieder singen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Wir singen neue Lieder.",
    "pastSentence": "Wir sangen neue Lieder.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Die kleine Raupe wird sich bald in eine Puppe verwandeln.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Raupe verwandelt sich in eine Puppe.",
    "pastSentence": "Die Raupe verwandelte sich in eine Puppe.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Übermorgen werden die großen Ferien beginnen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die großen Ferien beginnen.",
    "pastSentence": "Die großen Ferien begannen.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Der Bäcker wird morgen früh frische Kipferl backen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Bäcker backt frische Kipferl.",
    "pastSentence": "Der Bäcker backte frische Kipferl.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Ich werde meiner Freundin einen Brief schreiben.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Ich schreibe meiner Freundin einen Brief.",
    "pastSentence": "Ich schrieb meiner Freundin einen Brief.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Die Feuerwehrleute werden die Schläuche sorgfältig prüfen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Feuerwehrleute prüfen die Schläuche.",
    "pastSentence": "Die Feuerwehrleute prüften die Schläuche.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Im nächsten Jahr werden die Schüler in die vierte Klasse gehen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Schüler gehen in die vierte Klasse.",
    "pastSentence": "Die Schüler gingen in die vierte Klasse.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Der Maler wird die Hauswand gelb anstreichen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Maler streicht die Hauswand gelb an.",
    "pastSentence": "Der Maler strich die Hauswand gelb an.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Wir werden am Abend gemeinsam am Lagerfeuer sitzen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Wir sitzen am Lagerfeuer.",
    "pastSentence": "Wir saßen am Lagerfeuer.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  },
  {
    "sentence": "Die kleinen Vögel werden bald aus dem Nest fliegen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Die Vögel fliegen aus dem Nest.",
    "pastSentence": "Die Vögel flogen aus dem Nest.",
    "hint": "Vorausschau: Das Hilfsverb 'werden' kündigt an, was erst später in der Zukunft geschehen soll."
  },
  {
    "sentence": "Der Zauberer wird ein verblüffendes Kunststück vorführen.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Der Zauberer führt ein Kunststück vor.",
    "pastSentence": "Der Zauberer führte ein Kunststück vor.",
    "hint": "Zweiteilige Zukunftsform: Vorne steht die gebeugte Form von 'werden', ganz hinten die unveränderte Nennform."
  },
  {
    "sentence": "Sie werden das alte Schloss mit der Taschenlampe erkunden.",
    "tense": "Zukunft (Futur)",
    "presentSentence": "Sie erkunden das Schloss.",
    "pastSentence": "Sie erkundeten das Schloss.",
    "hint": "Signalprobe: Achte auf die zweiteilige Verbform mit einer Form von 'werden' und der Grundform am Satzende."
  }
];

  function buildTensesTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const grades = getEffectiveGrades([3, 4]);
    const isOnlyGrade3 = !grades.includes(4);

    let pool = TENSES_POOL;
    if (isOnlyGrade3) {
      pool = TENSES_POOL.filter(p => p.tense.startsWith('Gegenwart') || p.tense.startsWith('Vergangenheit'));
    }

    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? pool.length : 5);
    const chosen = (opts && opts.all) ? pool : shuffle(pool).slice(0, targetCount);

    if (opts && opts.forPrint) {
      return chosen.map(t => ({
        fach: 'deutsch',
        type: 'tenses',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'D-4-Sprachbetrachtung-Zeitformen',
        presentSentence: t.presentSentence,
        targetSentence: t.pastSentence,
        answer: t.pastSentence,
        solutionText: t.pastSentence,
        prompt: 'Setze den Satz aus der Gegenwart in die Mitvergangenheit:'
      }));
    }

    let allTenses = [
      'Gegenwart (Präsens)',
      'Mitvergangenheit (Präteritum)',
      'Vergangenheit (Perfekt)',
      'Zukunft (Futur)'
    ];

    if (isOnlyGrade3) {
      allTenses = [
        'Gegenwart (Präsens)',
        'Vergangenheit (Perfekt)'
      ];
    }

    const effectiveGrade = isOnlyGrade3 ? 3 : 4;
    return chosen.map(item => ({
      fach: 'deutsch',
      schulstufe: effectiveGrade,
      grade: effectiveGrade,
      lehrplanRef: 'D-' + effectiveGrade + '-Sprachbetrachtung-Zeitformen',
      type: 'multiple-choice',
      icon: null,
      question: 'In welcher Zeitform steht der Satz:\n„' + item.sentence + '“?',
      options: allTenses,
      correctIndex: allTenses.indexOf(item.tense),
      correctText: item.tense,
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 6. SILBENSCHWINGEN & SILBENKÖNIGE (1. & 2. Klasse – 100 Wörter Pool)
  const SYLLABLES_POOL = [
  {
    "word": "Frosch",
    "syllables": "Frosch",
    "count": 1,
    "vowels": "o",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Hund",
    "syllables": "Hund",
    "count": 1,
    "vowels": "u",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Baum",
    "syllables": "Baum",
    "count": 1,
    "vowels": "au",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Haus",
    "syllables": "Haus",
    "count": 1,
    "vowels": "au",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Buch",
    "syllables": "Buch",
    "count": 1,
    "vowels": "u",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Fisch",
    "syllables": "Fisch",
    "count": 1,
    "vowels": "i",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Berg",
    "syllables": "Berg",
    "count": 1,
    "vowels": "e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Wald",
    "syllables": "Wald",
    "count": 1,
    "vowels": "a",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Mond",
    "syllables": "Mond",
    "count": 1,
    "vowels": "o",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Stern",
    "syllables": "Stern",
    "count": 1,
    "vowels": "e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Brot",
    "syllables": "Brot",
    "count": 1,
    "vowels": "o",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Zug",
    "syllables": "Zug",
    "count": 1,
    "vowels": "u",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Schuh",
    "syllables": "Schuh",
    "count": 1,
    "vowels": "u",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Reh",
    "syllables": "Reh",
    "count": 1,
    "vowels": "e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Ball",
    "syllables": "Ball",
    "count": 1,
    "vowels": "a",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Bär",
    "syllables": "Bär",
    "count": 1,
    "vowels": "ä",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Zaun",
    "syllables": "Zaun",
    "count": 1,
    "vowels": "au",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Dach",
    "syllables": "Dach",
    "count": 1,
    "vowels": "a",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Nest",
    "syllables": "Nest",
    "count": 1,
    "vowels": "e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Tisch",
    "syllables": "Tisch",
    "count": 1,
    "vowels": "i",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Schaf",
    "syllables": "Schaf",
    "count": 1,
    "vowels": "a",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Wurm",
    "syllables": "Wurm",
    "count": 1,
    "vowels": "u",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Zahn",
    "syllables": "Zahn",
    "count": 1,
    "vowels": "a",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Wolf",
    "syllables": "Wolf",
    "count": 1,
    "vowels": "o",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Gras",
    "syllables": "Gras",
    "count": 1,
    "vowels": "a",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Schule",
    "syllables": "Schu - le",
    "count": 2,
    "vowels": "u, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Kinder",
    "syllables": "Kin - der",
    "count": 2,
    "vowels": "i, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Igel",
    "syllables": "I - gel",
    "count": 2,
    "vowels": "I, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Sessel",
    "syllables": "Ses - sel",
    "count": 2,
    "vowels": "e, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Jacke",
    "syllables": "Ja - cke",
    "count": 2,
    "vowels": "a, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Blume",
    "syllables": "Blu - me",
    "count": 2,
    "vowels": "u, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Fenster",
    "syllables": "Fens - ter",
    "count": 2,
    "vowels": "e, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Sonne",
    "syllables": "Son - ne",
    "count": 2,
    "vowels": "o, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Sommer",
    "syllables": "Som - mer",
    "count": 2,
    "vowels": "o, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Winter",
    "syllables": "Win - ter",
    "count": 2,
    "vowels": "i, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Garten",
    "syllables": "Gar - ten",
    "count": 2,
    "vowels": "a, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Katze",
    "syllables": "Kat - ze",
    "count": 2,
    "vowels": "a, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Tasche",
    "syllables": "Ta - sche",
    "count": 2,
    "vowels": "a, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Rose",
    "syllables": "Ro - se",
    "count": 2,
    "vowels": "o, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Wasser",
    "syllables": "Was - ser",
    "count": 2,
    "vowels": "a, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Apfel",
    "syllables": "Ap - fel",
    "count": 2,
    "vowels": "A, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Vögel",
    "syllables": "Vö - gel",
    "count": 2,
    "vowels": "ö, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Karte",
    "syllables": "Kar - te",
    "count": 2,
    "vowels": "a, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Wolke",
    "syllables": "Wol - ke",
    "count": 2,
    "vowels": "o, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Regen",
    "syllables": "Re - gen",
    "count": 2,
    "vowels": "e, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Schneemann",
    "syllables": "Schnee - mann",
    "count": 2,
    "vowels": "ee, a",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Kipferl",
    "syllables": "Kipf - erl",
    "count": 2,
    "vowels": "i, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Tafel",
    "syllables": "Ta - fel",
    "count": 2,
    "vowels": "a, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Schüler",
    "syllables": "Schü - ler",
    "count": 2,
    "vowels": "ü, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Kasten",
    "syllables": "Kas - ten",
    "count": 2,
    "vowels": "a, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Schmetterling",
    "syllables": "Schmet - ter - ling",
    "count": 3,
    "vowels": "e, e, i",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Eichhörnchen",
    "syllables": "Eich - hörn - chen",
    "count": 3,
    "vowels": "Ei, ö, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Schultasche",
    "syllables": "Schul - ta - sche",
    "count": 3,
    "vowels": "u, a, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Pausenhof",
    "syllables": "Pau - sen - hof",
    "count": 3,
    "vowels": "au, e, o",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Marille",
    "syllables": "Ma - ril - le",
    "count": 3,
    "vowels": "a, i, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Radierer",
    "syllables": "Ra - die - rer",
    "count": 3,
    "vowels": "a, ie, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Rechenheft",
    "syllables": "Re - chen - heft",
    "count": 3,
    "vowels": "e, e, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Bleistifte",
    "syllables": "Blei - stif - te",
    "count": 3,
    "vowels": "ei, i, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Karotte",
    "syllables": "Ka - rot - te",
    "count": 3,
    "vowels": "a, o, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Familie",
    "syllables": "Fa - mi - lie",
    "count": 3,
    "vowels": "a, i, ie",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Enkelkind",
    "syllables": "En - kel - kind",
    "count": 3,
    "vowels": "E, e, i",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Schipiste",
    "syllables": "Schi - pis - te",
    "count": 3,
    "vowels": "i, i, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Musiker",
    "syllables": "Mu - si - ker",
    "count": 3,
    "vowels": "u, i, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Bäckerei",
    "syllables": "Bä - cke - rei",
    "count": 3,
    "vowels": "ä, e, ei",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Bauernhof",
    "syllables": "Bau - ern - hof",
    "count": 3,
    "vowels": "au, e, o",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Wasserfall",
    "syllables": "Was - ser - fall",
    "count": 3,
    "vowels": "a, e, a",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Regenschirm",
    "syllables": "Re - gen - schirm",
    "count": 3,
    "vowels": "e, e, i",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Winterzeit",
    "syllables": "Win - ter - zeit",
    "count": 3,
    "vowels": "i, e, ei",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Großmutter",
    "syllables": "Groß - mut - ter",
    "count": 3,
    "vowels": "o, u, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Handschuhe",
    "syllables": "Hand - schu - he",
    "count": 3,
    "vowels": "a, u, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Wanderweg",
    "syllables": "Wan - der - weg",
    "count": 3,
    "vowels": "a, e, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Turnstunde",
    "syllables": "Turn - stun - de",
    "count": 3,
    "vowels": "u, u, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Feuerwehr",
    "syllables": "Feu - er - wehr",
    "count": 3,
    "vowels": "eu, e, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Rodelbahn",
    "syllables": "Ro - del - bahn",
    "count": 3,
    "vowels": "o, e, a",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Zirkuszelt",
    "syllables": "Zir - kus - zelt",
    "count": 3,
    "vowels": "i, u, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Sonnenblume",
    "syllables": "Son - nen - blu - me",
    "count": 4,
    "vowels": "o, e, u, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Regenbogen",
    "syllables": "Re - gen - bo - gen",
    "count": 4,
    "vowels": "e, e, o, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Taschenrechner",
    "syllables": "Ta - schen - rech - ner",
    "count": 4,
    "vowels": "a, e, e, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Feuerwehrmann",
    "syllables": "Feu - er - wehr - mann",
    "count": 4,
    "vowels": "eu, e, e, a",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Klettergerüst",
    "syllables": "Klet - ter - ge - rüst",
    "count": 4,
    "vowels": "e, e, e, ü",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Kinderzimmer",
    "syllables": "Kin - der - zim - mer",
    "count": 4,
    "vowels": "i, e, i, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Winterstiefel",
    "syllables": "Win - ter - stie - fel",
    "count": 4,
    "vowels": "i, e, ie, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Nationalpark",
    "syllables": "Na - tio - nal - park",
    "count": 4,
    "vowels": "a, io, a, a",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Donauwelle",
    "syllables": "Do - nau - wel - le",
    "count": 4,
    "vowels": "o, au, e, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Wanderwege",
    "syllables": "Wan - der - we - ge",
    "count": 4,
    "vowels": "a, e, e, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Frühlingsblumen",
    "syllables": "Früh - lings - blu - men",
    "count": 4,
    "vowels": "ü, i, u, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Geburtstagsfest",
    "syllables": "Ge - burts - tags - fest",
    "count": 4,
    "vowels": "e, u, a, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Schokolade",
    "syllables": "Scho - ko - la - de",
    "count": 4,
    "vowels": "o, o, a, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Kalendertag",
    "syllables": "Ka - len - der - tag",
    "count": 4,
    "vowels": "a, e, e, a",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Papierschiffchen",
    "syllables": "Pa - pier - schiff - chen",
    "count": 4,
    "vowels": "a, ie, i, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Taschenmesser",
    "syllables": "Ta - schen - mes - ser",
    "count": 4,
    "vowels": "a, e, e, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Zebrastreifen",
    "syllables": "Ze - bra - strei - fen",
    "count": 4,
    "vowels": "e, a, ei, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Klassensprecher",
    "syllables": "Klas - sen - spre - cher",
    "count": 4,
    "vowels": "a, e, e, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Blumenwiese",
    "syllables": "Blu - men - wie - se",
    "count": 4,
    "vowels": "u, e, ie, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Schmetterlinge",
    "syllables": "Schmet - ter - lin - ge",
    "count": 4,
    "vowels": "e, e, i, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Hasenohren",
    "syllables": "Ha - sen - oh - ren",
    "count": 4,
    "vowels": "a, e, o, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  },
  {
    "word": "Wasserrutsche",
    "syllables": "Was - ser - rut - sche",
    "count": 4,
    "vowels": "a, e, u, e",
    "hint": "Kinntest: Lege deine flache Hand unter das Kinn und sprich das Wort langsam – wie oft senkt sich dein Kinn?"
  },
  {
    "word": "Schlittenfahrten",
    "syllables": "Schlit - ten - fahr - ten",
    "count": 4,
    "vowels": "i, e, a, e",
    "hint": "Silbenkönige: Zähle die Selbstlaute (A, E, I, O, U) oder Zwielaute im Wort – jede Silbe hat genau einen König."
  },
  {
    "word": "Bauerngarten",
    "syllables": "Bau - ern - gar - ten",
    "count": 4,
    "vowels": "au, e, a, e",
    "hint": "Silbenschwingen: Sprich das Wort wie ein Roboter gedehnt in Silbenbögen und schwinge mit den Armen."
  },
  {
    "word": "Schwanenteiche",
    "syllables": "Schwa - nen - tei - che",
    "count": 4,
    "vowels": "a, e, ei, e",
    "hint": "Klatschprobe: Sprich das Wort laut und deutlich und klatsche rhythmisch bei jedem Sprechabschnitt."
  }
];

  function buildSyllableTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? SYLLABLES_POOL.length : 5);
    const chosen = (opts && opts.all) ? SYLLABLES_POOL : shuffle(SYLLABLES_POOL).slice(0, targetCount);
    const options = ['1 Silbe', '2 Silben', '3 Silben', '4 Silben'];

    return chosen.map(item => ({
      fach: 'deutsch',
      schulstufe: 1,
      grade: 1,
      lehrplanRef: 'D-1-Rechtschreiben-Silben',
      type: 'multiple-choice',
      icon: null,
      targetWord: item.word,
      syllables: item.syllables,
      syllableCount: item.count,
      vowels: item.vowels,
      question: 'Wie viele Silben (Silbenbögen) hat das Wort:\n„' + item.word + '“?',
      options: options,
      correctIndex: item.count - 1,
      correctText: item.count + ' ' + (item.count === 1 ? 'Silbe' : 'Silben'),
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 7. LESEVERSTÄNDNIS (Sachtexte für 3. & 4. Klasse – 25 Sachtexte mit je 4 Fragen = 100 Fragen)
  const READING_POOL = [
  {
    "id": "eichhoernchen",
    "title": "Das Eichhörnchen – Der schlaue Waldgärtner",
    "icon": null,
    "text": "Das Eichhörnchen ist ein flinkes Nagetier, das in unseren heimischen Wäldern und Parks lebt. Mit seinen scharfen Krallen kann es sogar kopfüber an Baumstämmen hinablaufen. Sein buschiger Schwanz dient beim Weitspringen von Ast zu Ast als wichtiges Steuer und im Winter als wärmende Decke. Im Herbst sammelt das Eichhörnchen fleißig Eicheln, Bucheckern, Zapfen und Haselnüsse. Es vergräbt diese Vorräte im Waldboden oder versteckt sie in Baumhöhlen für die kalte Jahreszeit. Weil das Eichhörnchen im Winter keinen echten Winterschlaf, sondern nur eine Winterruhe hält, wacht es an milden Tagen auf, um nach seinen Vorräten zu graben. Da es viele seiner Verstecke vergisst, keimen die vergrabenen Samen im Frühling. So hilft das Eichhörnchen ganz unbemerkt dabei, dass neue Bäume im Wald wachsen.",
    "questions": [
      {
        "q": "Wofür nützt dem Eichhörnchen sein buschiger Schwanz?",
        "options": [
          "Als Steuerruder beim Weitspringen und als wärmende Decke",
          "Ausschließlich zum schnellen Schwimmen im See",
          "Um Feinde damit in die Flucht zu schlagen",
          "Um Nüsse darin fest einzuwickeln"
        ],
        "correct": 0,
        "hint": "Lies im 1. Abschnitt nach: Dort wird die Funktion des Schwanzes genau erklärt."
      },
      {
        "q": "Wie verbringt das Eichhörnchen die kalte Winterzeit?",
        "options": [
          "Es hält eine Winterruhe und wacht an milden Tagen zum Fressen auf",
          "Es schläft 7 Monate ununterbrochen durch (tiefer Winterschlaf)",
          "Es zieht wie die Zugvögel über das Meer in den Süden",
          "Es frisst im Winter ausschließlich Eis und Baumrinde"
        ],
        "correct": 0,
        "hint": "Achte auf den Unterschied zwischen Winterschlaf und Winterruhe im Text."
      },
      {
        "q": "Warum wird das Eichhörnchen als „Gärtner des Waldes“ bezeichnet?",
        "options": [
          "Weil aus seinen vergessenen Vorräten im Frühling neue Bäume wachsen",
          "Weil es mit den Vorderpfoten Blumenbeete im Park anlegt",
          "Weil es den Waldboden mit dem Schwanz zusammenkehrt",
          "Weil es kranke Bäume mit den scharfen Zähnen fällt"
        ],
        "correct": 0,
        "hint": "Was passiert mit den Samen, die das Eichhörnchen im Boden vergräbt und vergisst?"
      },
      {
        "q": "Wie klettert das Eichhörnchen an Baumstämmen hinab?",
        "options": [
          "Dank scharfer Krallen sogar mit dem Kopf nach unten",
          "Es springt immer aus jeder Höhe auf den Boden",
          "Es kann nur nach oben klettern, nicht nach unten",
          "Es rutscht am Bauch hinunter"
        ],
        "correct": 0,
        "hint": "Schau ganz an den Anfang des Textes: Dort werden die scharfen Krallen erwähnt."
      }
    ]
  },
  {
    "id": "donau",
    "title": "Die Donau – Österreichs mächtiger Strom",
    "icon": null,
    "text": "Die Donau ist nach der Wolga der zweitlängste Fluss unseres Kontinents Europa. Sie entspringt im deutschen Schwarzwald und fließt fast 2 850 Kilometer weit nach Osten, bis sie schließlich in das Schwarze Meer mündet. In Österreich durchfließt die Donau die drei Bundesländer Oberösterreich, Niederösterreich und Wien. Entlang des Flusses gibt es berühmte Landschaften wie die Wachau und den Nationalpark Donau-Auen. Dieser Nationalpark östlich von Wien schützt eine der letzten großen, unberührten Auenlandschaften Mitteleuropas. Hier finden bedrohte Tierarten wie der schillernde Eisvogel, der mächtige Seeadler und der fleißige Biber einen sicheren Lebensraum. Die Donau ist außerdem eine wichtige Schifffahrtsstraße und liefert mit ihren Wasserkraftwerken sauberen Ökostrom.",
    "questions": [
      {
        "q": "In welches Meer mündet die Donau am Ende ihrer langen Reise?",
        "options": [
          "In das Schwarze Meer",
          "In die Nordsee",
          "In das Mittelmeer",
          "In die Ostsee"
        ],
        "correct": 0,
        "hint": "Lies im ersten Satz nach: Wohin fließt die Donau nach Osten?"
      },
      {
        "q": "Welche drei österreichischen Bundesländer durchquert die Donau?",
        "options": [
          "Oberösterreich, Niederösterreich und Wien",
          "Tirol, Salzburg und Vorarlberg",
          "Kärnten, Steiermark und Burgenland",
          "Wien, Burgenland und Kärnten"
        ],
        "correct": 0,
        "hint": "Schau genau auf die Bundesländer im 2. Abschnitt des Textes."
      },
      {
        "q": "Welche seltenen Tiere finden im Nationalpark Donau-Auen Schutz?",
        "options": [
          "Eisvogel, Seeadler und Biber",
          "Löwen, Giraffen und Zebras",
          "Steinböcke, Murmeltiere und Gämsen",
          "Pinguine, Robben und Eisbären"
        ],
        "correct": 0,
        "hint": "Im 3. Abschnitt werden drei typische Auwaldtiere genannt."
      },
      {
        "q": "Wie lang ist die Donau insgesamt ungefähr?",
        "options": [
          "Fast 2 850 Kilometer",
          "Genau 500 Kilometer",
          "Über 10 000 Kilometer",
          "Nur 100 Kilometer"
        ],
        "correct": 0,
        "hint": "Suche die Längenangabe im ersten Absatz."
      }
    ]
  },
  {
    "id": "bienen",
    "title": "Das fleißige Bienenvolk",
    "icon": null,
    "text": "In einem Bienenstock herrscht vom Frühling bis zum Spätsommer emsiges Treiben. Ein einziges Bienenvolk kann aus bis zu 60 000 Bienen bestehen. An der Spitze steht die Bienenkönigin, deren wichtigste Aufgabe darin besteht, täglich bis zu 2 000 Eier zu legen. Die allermeisten Bewohnerinnen sind weibliche Arbeiterinnen. Sie haben im Laufe ihres Lebens viele verschiedene Berufe: Zuerst putzen sie die Waben, dann füttern sie die Larven, bewachen das Flugloch und fliegen schließlich als Sammelbienen aus, um Nektar und Pollen von Blüten zu holen. Wenn eine Sammelbiene eine ergiebige Blumenwiese entdeckt hat, zeigt sie ihren Schwestern im Stock mit einem kunstvollen Schwänzeltanz die Richtung und Entfernung der Nahrung an. Durch die Bestäubung sichern Bienen unsere Obst- und Gemüseernte.",
    "questions": [
      {
        "q": "Welche Hauptaufgabe hat die Bienenkönigin im Bienenstock?",
        "options": [
          "Sie legt täglich viele Eier für den Bienennachwuchs",
          "Sie fliegt den ganzen Tag aus und sammelt Nektar",
          "Sie bewacht allein den Eingang zum Bienenstock",
          "Sie baut die Waben aus Wachs"
        ],
        "correct": 0,
        "hint": "Lies nach, wer im Bienenstock für die Eier zuständig ist."
      },
      {
        "q": "Was teilt eine Biene ihren Artgenossinnen mit dem „Schwänzeltanz“ mit?",
        "options": [
          "Die Richtung und Entfernung einer reichen Futterquelle",
          "Dass ein Gewitter aufzieht",
          "Dass der Honig fertig zum Naschen ist",
          "Sie tanzt nur zum Vergnügen mit den Jungbienen"
        ],
        "correct": 0,
        "hint": "Welche Information steckt in den Tanzbewegungen der Sammelbiene?"
      },
      {
        "q": "Warum sind Bienen für uns Menschen und die Umwelt so nützlich?",
        "options": [
          "Weil sie Blüten bestäuben und so für reiche Obst- und Gemüseernten sorgen",
          "Weil sie Unkraut auf den Feldern fressen",
          "Weil sie im Garten schädliche Blattläuse fangen",
          "Weil sie im Winter den Boden auflockern"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz des Textes aufmerksam durch."
      },
      {
        "q": "Aus wie vielen Bienen kann ein einziges Bienenvolk im Sommer bestehen?",
        "options": [
          "Aus bis zu 60 000 Bienen",
          "Aus genau 12 Bienen",
          "Aus höchstens 100 Bienen",
          "Aus über einer Million Bienen"
        ],
        "correct": 0,
        "hint": "Finde die Zahl der Bienen im ersten Absatz."
      }
    ]
  },
  {
    "id": "murmeltiere",
    "title": "Die Murmeltiere in den Hohen Tauern",
    "icon": null,
    "text": "Hoch oben auf den steinigen Almwiesen der österreichischen Alpen, besonders rund um den Großglockner, fühlt sich das Alpenmurmeltier wohl. Murmeltiere sind gesellige Tiere, die in großen Familienverbänden in tiefen Erdbauten leben. Droht Gefahr durch einen Steinadler aus der Luft oder einen Fuchs vom Boden, stößt das aufmerksame Wächter-Murmeltier einen lauten, schrillen Warnpfiff aus. Blitzschnell verschwinden dann alle Familienmitglieder in ihren sicheren Höhlen. Im Spätherbst fressen sich die Tiere eine dicke Fettschicht an, polstern ihre Schlafhöhle mit trockenem Heu aus und halten einen echten Winterschlaf, der bis zu sieben Monate dauern kann. Dabei sinkt die Körpertemperatur auf wenige Grad ab und das Herz schlägt nur noch ganz langsam, um die eisige Kälte zu überstehen.",
    "questions": [
      {
        "q": "Wie warnen Murmeltiere ihre Familie vor herannahenden Feinden wie dem Adler?",
        "options": [
          "Mit einem lauten, schrillen Warnpfiff",
          "Indem sie mit den Vorderpfoten trommeln",
          "Sie verfärben ihr Fell weiß wie der Schnee",
          "Sie werfen mit kleinen Kieselsteinen"
        ],
        "correct": 0,
        "hint": "Welches Geräusch stößt das Wächter-Murmeltier bei Gefahr aus?"
      },
      {
        "q": "Wie lange kann der tiefe Winterschlaf der Alpenmurmeltiere dauern?",
        "options": [
          "Bis zu sieben Monate",
          "Genau zwei Wochen",
          "Nur während der Weihnachtsferien",
          "Ein ganzes Jahr lang ohne Pause"
        ],
        "correct": 0,
        "hint": "Im 4. Satz wird die Dauer des Winterschlafs genannt."
      },
      {
        "q": "Was geschieht im Körper des Murmeltiers während des Winterschlafs?",
        "options": [
          "Körpertemperatur und Herzschlag sinken stark ab, um Energie zu sparen",
          "Das Herz schlägt dreimal so schnell wie im Sommer",
          "Die Körpertemperatur steigt auf über 40 Grad Celsius",
          "Das Murmeltier wächst im Schlaf auf die doppelte Größe"
        ],
        "correct": 0,
        "hint": "Wie spart das Murmeltier in der kalten Schlafhöhle lebenswichtige Energie?"
      },
      {
        "q": "Wo leben Murmeltiere bevorzugt in Österreich?",
        "options": [
          "Auf alpinen Almwiesen im Hochgebirge wie den Hohen Tauern",
          "Mitten im tiefen Schilf des Neusiedler Sees",
          "In dichten Fichtenwäldern im Flachland",
          "Auf den Dächern von Großstädten"
        ],
        "correct": 0,
        "hint": "Lies den ersten Satz: Wo fühlt sich das Tier besonders wohl?"
      }
    ]
  },
  {
    "id": "igel",
    "title": "Der Igel – Der stachelige Nachtwanderer",
    "icon": null,
    "text": "Der Braunbrustigel ist ein willkommener Gast in heimischen Gärten. Sein Körper ist von rund 6 000 bis 8 000 spitzen Stacheln bedeckt. Droht Gefahr, rollt sich der Igel mithilfe eines kräftigen Ringmuskels zu einer undurchdringlichen Stachelkugel zusammen. Igel sind nachtaktive Einzelgänger. Wenn es dunkel wird, ziehen sie los und suchen mit ihrem feinen Geruchssinn nach Nahrung. Auf ihrem Speiseplan stehen Schnecken, Regenwürmer, Käfer, Engerlinge und Spinnen. Im Spätherbst baut sich der Igel ein warmes Nest aus trockenem Laub und Moos unter einer Hecke oder einem Holzhaufen. Dort verbringt er den Winter im tiefen Winterschlaf. Niemals sollte man Igeln Kuhmilch füttern, da sie davon schwere Bauchschmerzen bekommen; eine Schale frisches Wasser ist die beste Hilfe.",
    "questions": [
      {
        "q": "Wie viele Stacheln schützen den Igel ungefähr vor Feinden?",
        "options": [
          "Rund 6 000 bis 8 000 Stacheln",
          "Genau 100 Stacheln",
          "Über eine Million Stacheln",
          "Igel haben überhaupt keine Stacheln"
        ],
        "correct": 0,
        "hint": "Schau im 2. Satz nach der genauen Anzahl der Stacheln."
      },
      {
        "q": "Was frisst der Igel bei seinen nächtlichen Streifzügen hauptsächlich?",
        "options": [
          "Schnecken, Regenwürmer, Käfer und Spinnen",
          "Ausschließlich frisches Gras und Blattsalat",
          "Nüsse und Äpfel vom Baum",
          "Fische aus dem Gartenteich"
        ],
        "correct": 0,
        "hint": "Igel sind Fleisch- und Insektenfresser, keine reinen Vegetarier."
      },
      {
        "q": "Warum darf man einem Igel im Garten niemals Kuhmilch anbieten?",
        "options": [
          "Weil Igel von Kuhmilch schwere Magen-Darm-Probleme bekommen",
          "Weil Igel nur warmen Tee trinken dürfen",
          "Weil Milch die Stacheln weich macht",
          "Weil Igel keine weiße Farbe mögen"
        ],
        "correct": 0,
        "hint": "Der letzte Satz erklärt, warum Kuhmilch für Igel schädlich ist."
      },
      {
        "q": "Woraus baut der Igel sein gemütliches Winternest?",
        "options": [
          "Aus trockenem Laub, Moos und Reisighaufen",
          "Aus nassem Schlamm am Teichgrund",
          "Aus Zeitungen und Plastiksäcken",
          "Er schläft in hohen Astgabeln"
        ],
        "correct": 0,
        "hint": "Lies nach, wo sich der Igel im Spätherbst verkriecht."
      }
    ]
  },
  {
    "id": "neusiedlersee",
    "title": "Der Neusiedler See – Ein einzigartiger Steppensee",
    "icon": null,
    "text": "Der Neusiedler See liegt im östlichsten Bundesland Österreichs, dem Burgenland, und reicht im Süden bis nach Ungarn. Er ist der größte See Österreichs und eine echte Besonderheit: Als Steppensee ist er extrem flach. An den tiefsten Stellen ist er selten tiefer als 1,8 Meter. Umgeben ist das Wasser von einem riesigen Schilfgürtel, der nach dem Donaudelta der zweitgrößte zusammenhängende Schilfbestand Europas ist. Dieses Schilfmeer bietet Hunderten seltenen Vogelarten wie dem Purpurreiher, dem Löffler und der Rohrdommel ideale Nistplätze. Da der See keinen natürlichen Abfluss besitzt, schwankt sein Wasserstand mit Wind und Wetter sehr stark. Im Sommer ist der See ein beliebtes Paradies für Segler, Surfer und Badefreunde.",
    "questions": [
      {
        "q": "In welchem Bundesland liegt der österreichische Teil des Neusiedler Sees?",
        "options": [
          "Im Burgenland",
          "In Tirol",
          "In Salzburg",
          "In Vorarlberg"
        ],
        "correct": 0,
        "hint": "Lies im ersten Satz nach, in welchem Bundesland sich der See befindet."
      },
      {
        "q": "Wie tief ist der Neusiedler See an den tiefsten Stellen durchschnittlich?",
        "options": [
          "Selten tiefer als 1,8 Meter (sehr flach)",
          "Über 100 Meter tief wie ein Bergsee",
          "Genau 50 Meter tief",
          "Er hat überhaupt kein Wasser"
        ],
        "correct": 0,
        "hint": "Steppenseen sind für ihre geringe Wassertiefe bekannt."
      },
      {
        "q": "Welche Landschaft umgibt das offene Wasser des Neusiedler Sees?",
        "options": [
          "Ein riesiger Schilfgürtel mit vielen seltenen Vogelarten",
          "Ein dichter Tannenwald mit steilen Felswänden",
          "Hohe schneebedeckte Gletscher",
          "Ein Wüstensandstrand ohne Pflanzen"
        ],
        "correct": 0,
        "hint": "Schau im 3. Satz nach dem riesigen Grüngürtel rund um den See."
      },
      {
        "q": "Welche seltenen Vögel nisten im dichten Schilf des Sees?",
        "options": [
          "Purpurreiher, Löffler und Rohrdommel",
          "Pinguine und Papageien",
          "Kolibris und Strauße",
          "Nur Haushühner"
        ],
        "correct": 0,
        "hint": "Finde die Vogelarten im Textabschnitt über das Schilfmeer."
      }
    ]
  },
  {
    "id": "biber",
    "title": "Der Biber – Der Baumeister am Fluss",
    "icon": null,
    "text": "Der Biber ist das größte Nagetier Europas und ein wahrer Meister im Wasserbau. Mit seinen kräftigen, orangefarbenen Nagezähnen kann er in einer einzigen Nacht sogar dicke Bäume fällen. Biber sind reine Pflanzenfresser und ernähren sich von Baumrinde, Zweigen, Blättern und Wasserpflanzen. Um ihren Wohnkessel vor Feinden und Kälte zu schützen, errichten sie kunstvolle Biberburgen aus Ästen, Schlamm und Steinen. Der Eingang zur Burg liegt immer sicher unter Wasser, während die Wohnkammer trocken über dem Wasserspiegel liegt. Ist der Wasserstand eines Baches zu niedrig, bauen die geschickten Biber feste Dämme, um das Wasser zu einem tiefen Teich aufzustauen. Damit schaffen sie neue Feuchtgebiete, in denen viele Amphibien, Fische und Insekten leben.",
    "questions": [
      {
        "q": "Wo liegt der Eingang zu einer Biberburg immer verborgen?",
        "options": [
          "Sicher unter der Wasseroberfläche",
          "Oben auf dem Dach im Freien",
          "Im hohlen Stamm eines Baumes",
          "Mitten auf der Wiese"
        ],
        "correct": 0,
        "hint": "Lies nach, wie der Biber seine Burg vor Räubern wie dem Fuchs schützt."
      },
      {
        "q": "Wovon ernähren sich Biber ausschließlich?",
        "options": [
          "Von Pflanzen wie Baumrinde, Zweigen und Kräutern",
          "Von kleinen Fischen und Krebsen",
          "Von Mäusen und Fröschen",
          "Von Vogel-Eiern"
        ],
        "correct": 0,
        "hint": "Biber sind reine Pflanzenfresser (Vegetarier)."
      },
      {
        "q": "Warum errichten Biber feste Dämme an Flüssen und Bächen?",
        "options": [
          "Um das Wasser aufzustauen, damit der Burg-Eingang unter Wasser bleibt",
          "Um Schiffe am Vorbeifahren zu hindern",
          "Damit die Fische nicht wegschwimmen",
          "Nur zum Zeitvertreib"
        ],
        "correct": 0,
        "hint": "Warum staut der Biber das Wasser zu einem tiefen Teich auf?"
      },
      {
        "q": "Welche Farbe haben die scharfen Nagezähne des Bibers?",
        "options": [
          "Auffallend orange durch eingelagertes Eisen",
          "Pechschwarz",
          "Blau wie das Wasser",
          "Grün wie Moos"
        ],
        "correct": 0,
        "hint": "Schau im 2. Satz nach der besonderen Zahnfarbe."
      }
    ]
  },
  {
    "id": "grossglockner",
    "title": "Der Großglockner – Das Dach Österreichs",
    "icon": null,
    "text": "Mit stolzen 3 798 Metern Höhe ist der Großglockner der höchste Berg der Republik Österreich. Er liegt im Gebirgszug der Hohen Tauern genau auf der Grenze zwischen den Bundesländern Kärnten und Tirol. Die markante pyramidenförmige Spitze aus hartem Fels fasziniert seit Jahrhunderten Bergsteiger aus der ganzen Welt. Am Fuße des Großglockners erstreckt sich die Pasterze, der größte Gletscher der Ostalpen. Berühmt ist auch die Großglockner-Hochalpenstraße: Diese beeindruckende Panoramastraße wurde in den 1930er-Jahren erbaut und führt bis auf über 2 500 Meter Seehöhe hinauf. Von der Kaiser-Franz-Josefs-Höhe aus kann man den Gipfel, den Gletscher und oft sogar neugierige Alpenmurmeltiere und Steinböcke aus nächster Nähe beobachten.",
    "questions": [
      {
        "q": "Wie hoch ist der Großglockner genau?",
        "options": [
          "3 798 Meter",
          "1 500 Meter",
          "8 848 Meter",
          "500 Meter"
        ],
        "correct": 0,
        "hint": "Suche die Meterangabe gleich im ersten Satz."
      },
      {
        "q": "Zwischen welchen zwei Bundesländern liegt der Großglockner?",
        "options": [
          "Kärnten und Tirol",
          "Wien und Niederösterreich",
          "Salzburg und Burgenland",
          "Vorarlberg und Steiermark"
        ],
        "correct": 0,
        "hint": "Lies im 2. Satz, welche zwei Bundesländer aneinandergrenzen."
      },
      {
        "q": "Wie heißt der größte Gletscher Österreichs am Fuße des Großglockners?",
        "options": [
          "Die Pasterze",
          "Der Aletschgletscher",
          "Der Hallstätter Gletscher",
          "Das Steinerne Meer"
        ],
        "correct": 0,
        "hint": "Finde den Namen des großen Eisfeldes im Text."
      },
      {
        "q": "Welche Tiere kann man an der Großglockner-Hochalpenstraße oft beobachten?",
        "options": [
          "Murmeltiere und Steinböcke",
          "Delfine und Robben",
          "Kamele und Elefanten",
          "Löwen und Pinguine"
        ],
        "correct": 0,
        "hint": "Welche Alpentiere werden ganz am Ende des Textes genannt?"
      }
    ]
  },
  {
    "id": "fledermaus",
    "title": "Die Fledermaus – Die lautlose Jägerin",
    "icon": null,
    "text": "Fledermäuse sind die einzigen Säugetiere der Erde, die aktiv fliegen können. Ihre Flügel bestehen aus einer hauchdünnen Flughaut, die zwischen ihren langen Fingerknochen und dem Körper aufgespannt ist. Da Fledermäuse fast ausschließlich nachts auf die Jagd nach Insekten gehen, nützt ihnen das Augenlicht in der Dunkelheit wenig. Stattdessen orientieren sie sich mit der Echoortung: Sie stoßen für Menschen unhörbare Ultraschalllaute aus. Treffen diese Schallwellen auf ein Beutetier oder ein Hindernis, wird der Schall wie ein Echo zurückgeworfen. Aus diesem Echo berechnet das feine Gehör der Fledermaus blitzschnell ein genaues Bild ihrer Umgebung. Den kalten Winter verbringen alle heimischen Fledermausarten kopfüber hängend im Winterschlaf in Höhlen oder alten Stollen.",
    "questions": [
      {
        "q": "Was macht die Fledermaus unter allen Säugetieren der Welt so einzigartig?",
        "options": [
          "Sie ist das einzige Säugetier, das aktiv fliegen kann",
          "Sie hat als einziges Säugetier Federn",
          "Sie kann unter Wasser atmen",
          "Sie legt wie ein Vogel Eier"
        ],
        "correct": 0,
        "hint": "Lies den ersten Satz aufmerksam durch."
      },
      {
        "q": "Wie findet die Fledermaus ihre Beute in der stockdunklen Nacht?",
        "options": [
          "Mit Ultraschall-Rufen und der Echoortung",
          "Mit einer eingebauten Taschenlampe",
          "Sie riecht Mücken über viele Kilometer",
          "Sie tastet mit den Flügeln am Boden entlang"
        ],
        "correct": 0,
        "hint": "Schau nach dem Begriff „Echoortung“ im 2. Abschnitt."
      },
      {
        "q": "Wie verbringen heimische Fledermäuse die kalte Jahreszeit?",
        "options": [
          "Sie halten kopfüber hängend einen Winterschlaf in Höhlen",
          "Sie fliegen jedes Jahr im Herbst nach Afrika",
          "Sie jagen nachts im tiefen Schnee",
          "Sie graben sich tief in die Gartenerde ein"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz: Wo und wie schläft das Tier im Winter?"
      },
      {
        "q": "Wovon ernähren sich alle in Österreich lebenden Fledermäuse?",
        "options": [
          "Von Insekten wie Nachtfaltern, Mücken und Käfern",
          "Von Tierblut wie in Gruselgeschichten",
          "Von Waldbeeren und reifen Äpfeln",
          "Von Fischen aus Flüssen"
        ],
        "correct": 0,
        "hint": "Welche Beutetiere fängt die Fledermaus im Nachtflug?"
      }
    ]
  },
  {
    "id": "luchs",
    "title": "Der Luchs – Das Pinselohr im Bergwald",
    "icon": null,
    "text": "Der Eurasische Luchs ist die größte Raubkatze unserer Heimat. Man erkennt ihn sofort an seinen auffälligen schwarzen Haarpinseln an den Ohrenspitzen, seinem getupften Fell und dem stummelförmigen Schwanz mit schwarzer Spitze. Luchse sind extrem scheue Einzelgänger, die dichte, ruhige Bergwälder bewohnen. Sie sind hervorragende Schleichjäger: Mit ihren weichen Pfoten pirschen sie sich lautlos an Rehe oder Gämsen heran und überwältigen ihre Beute mit einem überraschenden Sprung. Ihre Seh- und Hörkraft ist phänomenal: Einen vorbeihuschenden Hasen kann ein Luchs schon auf mehrere hundert Meter Entfernung wahrnehmen. Nachdem der Luchs in Österreich lange Zeit ausgerottet war, kehrt er heute durch strenge Schutzprojekte langsam wieder in unsere Nationalparks zurück.",
    "questions": [
      {
        "q": "An welchen Merkmalen erkennt man den Luchs auf einen Blick?",
        "options": [
          "An den Haarpinseln an den Ohren und dem kurzen Stummelschwanz",
          "An einer langen Mähne wie beim Löwen",
          "An gestreifter Haut ohne Fell",
          "An riesigen Stoßzähnen"
        ],
        "correct": 0,
        "hint": "Schau im 2. Satz nach dem Aussehen der Ohren und des Schwanzes."
      },
      {
        "q": "Wie jagt der Luchs seine Beute im Bergwald?",
        "options": [
          "Als lautloser Schleichjäger mit einem überraschenden Spurt",
          "Er hetzt Tiere stundenlang über offene Wiesen",
          "Er gräbt tiefe Fallgruben im Waldboden",
          "Er wartet am Fluss auf Fische"
        ],
        "correct": 0,
        "hint": "Lies im 3. Abschnitt über die Jagdmethode des Luchses."
      },
      {
        "q": "Warum gibt es heute wieder Luchse in Österreich?",
        "options": [
          "Weil sie durch strenge Schutzprojekte in Nationalparks zurückkehren",
          "Weil sie im Winter aus Zoos entlaufen sind",
          "Weil jeder Bürger sich einen Luchs kaufen darf",
          "Sie waren in Österreich nie verschwunden"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz über die Wiederansiedlung."
      },
      {
        "q": "Was fressen erwachsene Luchse am liebsten?",
        "options": [
          "Rehe, Gämsen und Hasen",
          "Gras, Moos und Baumrinde",
          "Nur Nüsse und Tannenzapfen",
          "Brot und Semmeln"
        ],
        "correct": 0,
        "hint": "Der Luchs ist eine Raubkatze – welches Wild jagt er?"
      }
    ]
  },
  {
    "id": "schoenbrunn",
    "title": "Schloss Schönbrunn – Kaiserliche Pracht in Wien",
    "icon": null,
    "text": "Schloss Schönbrunn im Westen von Wien war die glanzvolle Sommerresidenz der österreichischen Kaiserfamilie der Habsburger. Berühmte Herrscher wie Kaiserin Maria Theresia und Kaiser Franz Joseph mit seiner Gemahlin Sisi verbrachten hier viele Monate des Jahres. Das riesige Schloss besitzt genau 1 441 prunkvoll ausgestattete Zimmer, von denen heute rund 45 Räume von Besuchern besichtigt werden können. Direkt an das Schloss schließt der weitläufige Schlosspark an. Dort stehen die berühmte Gloriette auf dem Hügel, ein Irrgarten aus dichten Hecken und das Palmenhaus mit exotischen Pflanzen. Mitten im Park liegt auch der Tiergarten Schönbrunn: Er wurde 1752 gegründet und ist der älteste noch bestehende Zoo der ganzen Welt.",
    "questions": [
      {
        "q": "Wofür nützte die Kaiserfamilie das Schloss Schönbrunn hauptsächlich?",
        "options": [
          "Als prachtvolle Sommerresidenz in Wien",
          "Als Bahnhof für kaiserliche Dampfzüge",
          "Als Kaserne für Soldaten",
          "Als Fabrik für kaiserliches Porzellan"
        ],
        "correct": 0,
        "hint": "Lies gleich im ersten Satz, zu welcher Jahreszeit das Schloss bewohnt wurde."
      },
      {
        "q": "Wie viele Zimmer hat das Schloss Schönbrunn insgesamt?",
        "options": [
          "Genau 1 441 Zimmer",
          "Nur 10 Zimmer",
          "Über 50 000 Zimmer",
          "Genau 100 Zimmer"
        ],
        "correct": 0,
        "hint": "Finde die Zahl der Räume im 2. Abschnitt des Textes."
      },
      {
        "q": "Was macht den Tiergarten Schönbrunn im Schlosspark weltberühmt?",
        "options": [
          "Er ist der älteste noch bestehende Zoo der ganzen Welt",
          "Dort leben nur Haustiere wie Kühe und Schweine",
          "Er wurde erst im Jahr 2020 gebaut",
          "Er hat überhaupt keine Tiere"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz über das Gründungsjahr 1752."
      },
      {
        "q": "Welches berühmte Bauwerk steht auf dem Schlosshügel im Park?",
        "options": [
          "Die Gloriette",
          "Der Wiener Stephansdom",
          "Der Grazer Uhrturm",
          "Die Festung Hohensalzburg"
        ],
        "correct": 0,
        "hint": "Suche den Namen des Bauwerks auf dem Hügel im Schlosspark."
      }
    ]
  },
  {
    "id": "steinadler",
    "title": "Der Steinadler – Der König der Lüfte",
    "icon": null,
    "text": "Mit einer imposanten Flügelspannweite von über zwei Metern ist der Steinadler der mächtigste Greifvogel des Alpenraums. Dank seiner breiten Schwingen kann er die aufsteigende warme Luft, die sogenannte Thermik, nutzen und stundenlang ohne einen einzigen Flügelschlag am Himmel kreisen. Steinadler haben extrem scharfe Augen, die etwa sechsmal besser sehen als das menschliche Auge. So erkennen sie ein Murmeltier oder einen Schneehasen noch aus mehreren Kilometern Entfernung. Haben sie ihre Beute erspäht, sausen sie im atemberaubenden Sturzflug mit bis zu 150 km/h herab und packen das Tier mit ihren dolchartigen Fängen. Steinadler leben in festen Revieren und nutzen oft jahrzehntelang denselben Horst, den sie auf unzugänglichen Felsvorsprüngen errichten.",
    "questions": [
      {
        "q": "Wie groß ist die Flügelspannweite eines ausgewachsenen Steinadlers?",
        "options": [
          "Über zwei Meter",
          "Nur 30 Zentimeter",
          "Genau zehn Meter",
          "Fünfzig Zentimeter"
        ],
        "correct": 0,
        "hint": "Schau im 1. Satz nach der imposanten Flügelbreite."
      },
      {
        "q": "Wie nutzt der Adler die warme Luft am Berghang?",
        "options": [
          "Er segelt mit der Thermik stundenlang ohne Flügelschlag",
          "Er wärmt sich damit die kalten Füße",
          "Er pustet damit die Wolken weg",
          "Er trocknet damit seine Beute"
        ],
        "correct": 0,
        "hint": "Lies nach, wie der Adler dank der Schwingen Energie beim Fliegen spart."
      },
      {
        "q": "Wie gut sieht das Auge des Steinadlers im Vergleich zum Menschen?",
        "options": [
          "Etwa sechsmal schärfer als das menschliche Auge",
          "Er ist fast blind und hört nur",
          "Genau gleich gut wie ein Kind",
          "Er sieht nur schwarz-weiß"
        ],
        "correct": 0,
        "hint": "Finde den Vergleich im 2. Abschnitt des Textes."
      },
      {
        "q": "Wie nennt man das große Nest des Steinadlers auf Felsvorsprüngen?",
        "options": [
          "Horst",
          "Höhle",
          "Kobel",
          "Bau"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz: Wie heißt das Adlernest im Gebirge?"
      }
    ]
  },
  {
    "id": "ameisen",
    "title": "Die Waldameisen – Die fleißigen Waldschützer",
    "icon": null,
    "text": "Die Rote Waldameise ist ein unverzichtbarer Helfer für das Gleichgewicht im Wald. Ein einzelner Ameisenhaufen kann aus mehr als einer Million Ameisen bestehen. Er ist wie eine kleine Stadt aufgebaut: Unter der sichtbaren Kuppel aus Tannennadeln, Reisig und Harz liegt ein verzweigtes System aus Gängen und Kammern, das tief in die Erde reicht. Jede Ameise erfüllt eine bestimmte Aufgabe: Es gibt Arbeiterinnen, Nestbauerinnen, Jägerinnen und die Königin, die für Nachwuchs sorgt. Ameisen sind bärenstark: Sie können das Vielfache ihres eigenen Körpergewichts tragen. Täglich vertilgen die Ameisen eines einzigen Volkes tausende schädliche Forstinsekten wie Borkenkäfer und Raupen. Deshalb stehen Waldameisen und ihre Bauten in Österreich unter strengem Naturschutz.",
    "questions": [
      {
        "q": "Woraus bauen Waldameisen ihren sichtbaren Haufen im Wald?",
        "options": [
          "Aus Tannennadeln, kleinen Zweigen und Baumharz",
          "Aus nassem Sand am Flussufer",
          "Aus Glasscherben und Metall",
          "Ausschließlich aus alten Schneckenhäusern"
        ],
        "correct": 0,
        "hint": "Lies im 2. Abschnitt nach, welches Baumaterial die Ameisen sammeln."
      },
      {
        "q": "Warum sind Waldameisen so wichtig für die Gesundheit unserer Wälder?",
        "options": [
          "Sie fressen täglich tausende Forstschädlinge wie Borkenkäfer",
          "Sie pflanzen mit ihren Füßen Bäume an",
          "Sie fällen morsche Bäume",
          "Sie wärmen den Waldboden im Winter mit Feuer"
        ],
        "correct": 0,
        "hint": "Welche nützliche Aufgabe erfüllen die Arbeiterinnen bei der Jagd?"
      },
      {
        "q": "Wie viele Tiere können in einem großen Ameisenhaufen zusammenleben?",
        "options": [
          "Mehr als eine Million Ameisen",
          "Höchstens fünfzig Ameisen",
          "Genau zehn Ameisen",
          "Immer genau 200 Ameisen"
        ],
        "correct": 0,
        "hint": "Finde die Zahl der Tiere im ersten Abschnitt."
      },
      {
        "q": "Welcher gesetzliche Schutz gilt für Waldameisenhaufen in Österreich?",
        "options": [
          "Sie stehen unter strengem Naturschutz und dürfen nicht beschädigt werden",
          "Man darf sie als Spielzeug mit nach Hause nehmen",
          "Sie müssen im Herbst abgerissen werden",
          "Es gibt keine Gesetze für Ameisen"
        ],
        "correct": 0,
        "hint": "Lies den allerletzten Satz über den Schutzstatus."
      }
    ]
  },
  {
    "id": "pasterze",
    "title": "Die Pasterze – Das schmelzende Eis der Alpen",
    "icon": null,
    "text": "Die Pasterze ist mit rund acht Kilometern Länge der größte Gletscher in ganz Österreich und den gesamten Ostalpen. Sie liegt am Fuße des Großglockners im Bundesland Kärnten. Ein Gletscher entsteht, wenn im Hochgebirge über viele Jahrzehnte hinweg mehr Schnee fällt, als im kurzen Sommer abschmelzen kann. Durch das enorme Gewicht der Schneemassen wird der Altschnee zu ewigem Eis zusammengepresst. Wie ein gigantischer, zähflüssiger Eisstrom kriecht der Gletscher langsam talwärts. Leider schmilzt die Pasterze durch die weltweite Klimaerwärmung seit vielen Jahren rasant ab. Jedes Jahr verliert sie viele Meter an Dicke und Länge. Am Ende des Gletschers schmilzt das Eis zum Gletscherbach Möll, der schließlich sauberstes Trinkwasser ins Tal leitet.",
    "questions": [
      {
        "q": "Wie entsteht ein Gletscher im Hochgebirge?",
        "options": [
          "Schneemassen werden über viele Jahre durch ihr eigenes Gewicht zu Eis gepresst",
          "Menschen frieren Wasser mit Maschinen ein",
          "Durch riesige Hagelstürme im Hochsommer",
          "Aus gefrorenem Grundwasser"
        ],
        "correct": 0,
        "hint": "Lies im 2. Abschnitt nach, wie aus Neuschnee schließlich Gletschereis wird."
      },
      {
        "q": "Wie lang ist die Pasterze als größter Gletscher Österreichs ungefähr?",
        "options": [
          "Rund acht Kilometer",
          "Nur fünfzig Meter",
          "Über 500 Kilometer",
          "Genau 100 Meter"
        ],
        "correct": 0,
        "hint": "Schau im 1. Satz nach der Längenangabe."
      },
      {
        "q": "Warum wird die Pasterze von Jahr zu Jahr deutlich kleiner?",
        "options": [
          "Durch die Klimaerwärmung schmilzt das Eis schneller ab, als neues entsteht",
          "Weil Touristen das Eis mit Schaufeln abtragen",
          "Weil Bergsteiger zu viele Fotos machen",
          "Das Eis schmilzt überhaupt nicht"
        ],
        "correct": 0,
        "hint": "Finde die Erklärung im 4. Satz des Textes."
      },
      {
        "q": "An welchem berühmten Berg liegt die Pasterze?",
        "options": [
          "Am Fuße des Großglockners",
          "Am Kahlenberg in Wien",
          "Am Schafberg am Wolfgangsee",
          "Am Arlberg"
        ],
        "correct": 0,
        "hint": "Lies im ersten Abschnitt nach dem Namen des höchsten Berges."
      }
    ]
  },
  {
    "id": "feuersalamander",
    "title": "Der Feuersalamander – Der geheimnisvolle Waldgeist",
    "icon": null,
    "text": "Mit seiner glänzend schwarzen Haut und den leuchtend gelben oder orangen Flecken ist der Feuersalamander unverwechselbar. Diese auffällige Färbung nennt man Warnfärbung: Sie signalisiert Feinden wie Vögeln oder Mardern, dass der Salamander giftig ist. Bei Gefahr sondert er über spezielle Hautdrüsen eine weiße, bitter schmeckende Flüssigkeit ab, die Feinde abschreckt. Feuersalamander gehören zu den Amphibien (Lurchen) und lieben kühle, feuchte Laubmischwälder im Gebirge. Tagsüber verstecken sie sich unter totem Holz, Steinen oder Moos. Erst bei Dämmerung oder nach warmem Regen kommen sie hervor, um langsam nach Nacktschnecken, Würmern und Spinnen zu suchen. Anders als Frösche legen Feuersalamanderweibchen keine Eier ins Wasser, sondern bringen fertig entwickelte Larven mit Kiemen in sauberen Waldbächen zur Welt.",
    "questions": [
      {
        "q": "Wozu dient dem Feuersalamander seine auffällige gelb-schwarze Hautfarbe?",
        "options": [
          "Als Warnfärbung, um Feinden zu zeigen, dass er ungenießbar und giftig ist",
          "Damit er im Schnee nicht friert",
          "Um im Dunkeln wie eine Laterne zu leuchten",
          "Damit er besser schwimmen kann"
        ],
        "correct": 0,
        "hint": "Lies den 2. Satz über die Bedeutung der Warnfärbung."
      },
      {
        "q": "Wann verlässt der Feuersalamander tagsüber seine Verstecke?",
        "options": [
          "Erst in der Dämmerung oder bei feuchtem Regenwetter",
          "Nur zur heißesten Mittagszeit in der prallen Sonne",
          "Im tiefsten Winter bei Schnee und Eis",
          "Niemals"
        ],
        "correct": 0,
        "hint": "Amphibien brauchen Feuchtigkeit – wann geht er auf Nahrungssuche?"
      },
      {
        "q": "Was ist das Besondere an der Fortpflanzung des Feuersalamanders?",
        "options": [
          "Er bringt lebende Larven mit Kiemen direkt in Bäche zur Welt (keine Eier)",
          "Er baut feste Nester in hohen Baumkronen",
          "Er vergräbt Eier im Wüstensand",
          "Er vermehrt sich wie Säugetiere an Land"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz über Larven und Waldbäche."
      },
      {
        "q": "Zu welcher Tierklasse gehört der Feuersalamander?",
        "options": [
          "Zu den Amphibien (Lurchen)",
          "Zu den Reptilien wie Eidechsen",
          "Zu den Insekten",
          "Zu den Säugetieren"
        ],
        "correct": 0,
        "hint": "Finde die Tiergruppe im 3. Abschnitt."
      }
    ]
  },
  {
    "id": "stephansdom",
    "title": "Der Wiener Stephansdom – Das Wahrzeichen Österreichs",
    "icon": null,
    "text": "Der Stephansdom im Herzen der Bundeshauptstadt Wien, von den Einheimischen liebevoll „Steffl“ genannt, ist das berühmteste Bauwerk Österreichs. Er wurde im gotischen Baustil aus hellem Sandstein errichtet. Sein Südturm ragt beeindruckende 136 Meter hoch in den Himmel und ist von vielen Punkten der Stadt aus zu sehen. Ein besonderer Blickfang ist das riesige, bunte Dach: Über 230 000 glasierte Ziegel bilden das Wappen der Stadt Wien und den kaiserlichen Doppeladler der Republik. Im Nordturm hängt die berühmte „Pummerin“: Sie ist eine der größten freischwingenden Kirchenglocken ganz Europas. Gegossen wurde sie ursprünglich aus erbeuteten Kanonenrohren. Jedes Jahr läutet die Pummerin feierlich das neue Jahr zu Silvester ein.",
    "questions": [
      {
        "q": "Wie hoch ragt der Südturm des Wiener Stephansdoms in die Höhe?",
        "options": [
          "136 Meter",
          "500 Meter",
          "Nur 20 Meter",
          "Genau 1 000 Meter"
        ],
        "correct": 0,
        "hint": "Suche die Meterangabe des Südturms im 2. Abschnitt."
      },
      {
        "q": "Was ist auf dem riesigen Ziegeldach des Stephansdoms zu sehen?",
        "options": [
          "Das Wappen der Stadt Wien und der kaiserliche Doppeladler",
          "Ein riesiges Porträt von Mozart",
          "Eine bunte Weltkarte",
          "Nur rote und weiße Punkte"
        ],
        "correct": 0,
        "hint": "Lies nach, welche Wappen aus über 230 000 Ziegeln gelegt wurden."
      },
      {
        "q": "Wie heißt die berühmte, riesige Glocke im Nordturm des Doms?",
        "options": [
          "Die Pummerin",
          "Die Kaiserin",
          "Die Glocke von Salzburg",
          "Die Rolandglocke"
        ],
        "correct": 0,
        "hint": "Finde den Kosenamen der gewaltigen Glocke im letzten Absatz."
      },
      {
        "q": "In welchem Baustil wurde der Dom hauptsächlich vollendet?",
        "options": [
          "Im gotischen Baustil",
          "Als moderner Wolkenkratzer aus Glas",
          "Im ägyptischen Pyramidenstil",
          "Im Blockhausstil"
        ],
        "correct": 0,
        "hint": "Lies im 1. Abschnitt nach dem Baustil."
      }
    ]
  },
  {
    "id": "schwalbe",
    "title": "Die Rauchschwalbe – Der Bote des Sommers",
    "icon": null,
    "text": "Wenn im April die Rauchschwalben zu uns zurückkehren, weiß jeder: Der Frühling ist da! Rauchschwalben sind pfeilschnelle Flugkünstler mit glänzend blauschwarzem Rücken, einer rotbraunen Kehle und einem tief gegabelten Schwanz. Sie verbringen fast den ganzen Tag im Flug, um fliegende Mücken, Fliegen und Blattläuse aus der Luft zu fangen. Ihre kunstvollen Nester bauen sie aus feuchten Lehmkügelchen, Stroh und Speichel bevorzugt in geschützten Scheunen, Viehställen oder unter Dachvorsprüngen. Im Spätsommer sammeln sich tausende Schwalben auf Stromleitungen. Im September treten sie dann die abenteuerliche, zehntausend Kilometer lange Reise über das Mittelmeer und die Sahara-Wüste an, um den Winter im warmen Süden Afrikas zu verbringen.",
    "questions": [
      {
        "q": "Woraus baut die Rauchschwalbe ihr stabiles Napfnest?",
        "options": [
          "Aus kleinen Lehmkügelchen, Strohhalmen und Speichel",
          "Aus dicken Steinen und Mörtel",
          "Aus zusammengerollten Eichenblättern",
          "Sie gräbt ein Loch in die Erde"
        ],
        "correct": 0,
        "hint": "Lies im 3. Abschnitt über das Baumaterial des Schwalbennestes."
      },
      {
        "q": "Wohin fliegen unsere Schwalben im Herbst zur Überwinterung?",
        "options": [
          "In das warme Afrika südlich der Sahara",
          "Auf den schneebedeckten Großglockner",
          "Sie bleiben den ganzen Winter im Stall",
          "Zum Nordpol zu den Eisbären"
        ],
        "correct": 0,
        "hint": "Schwalben sind Zugvögel – wohin führt ihre weite Reise?"
      },
      {
        "q": "Wie fangen Schwalben ihre tägliche Nahrung?",
        "options": [
          "Im pfeilschnellen Flug mit weit geöffnetem Schnabel",
          "Sie picken Würmer am Meeresgrund auf",
          "Sie klopfen wie Spechte an Baumstämme",
          "Sie fressen Körner am Futterhäuschen"
        ],
        "correct": 0,
        "hint": "Lies nach, wo und wie Schwalben fliegende Mücken jagen."
      },
      {
        "q": "An welchem auffälligen Merkmal erkennt man die Rauchschwalbe im Flug?",
        "options": [
          "Am tief gegabelten Schwanz und der rostbraunen Kehle",
          "An riesigen gelben Schwimmhäuten",
          "An einem breiten Entenschnabel",
          "An einem schneeweißen Gefieder"
        ],
        "correct": 0,
        "hint": "Schau im 2. Satz nach den besonderen Merkmalen."
      }
    ]
  },
  {
    "id": "dachs",
    "title": "Der Dachs – Der fleißige Höhlenbaumeister",
    "icon": null,
    "text": "Der Europäische Dachs ist der größte Marder unserer Heimat. Man erkennt ihn sofort an seinem markanten Kopf mit den zwei schwarzen Längsstreifen auf weißem Grund. Dachse sind scheue Tiere, die den Tag verschlafen und erst bei Einbruch der Dunkelheit aktiv werden. Unter der Erde graben sie mit ihren kräftigen Schaufelpfoten riesige, weit verzweigte Baue. Ein solcher Dachsbau kann über mehrere Etagen reichen, dutzende Röhren besitzen und von Generationen über Jahrzehnte hinweg ausgebaut werden. Dachse sind sehr reinlich: Ihre Schlafkammern polstern sie regelmäßig mit frischem Moos und Laub aus und für ihr Geschäft graben sie kleine Gruben außerhalb des Baus. Sie sind Allesfresser: Von Regenwürmern und Käfern über Beeren und Wurzeln bis zu Mäusen schmeckt ihnen fast alles.",
    "questions": [
      {
        "q": "Wie sieht die typische Zeichnung am Kopf des Dachses aus?",
        "options": [
          "Zwei markante schwarze Streifen auf weißem Grund",
          "Ein völlig pechschwarzer Kopf ohne Muster",
          "Bunte Punkte wie bei einer Forelle",
          "Ein goldgelber Fleck auf der Stirn"
        ],
        "correct": 0,
        "hint": "Lies die Beschreibung im 2. Satz aufmerksam durch."
      },
      {
        "q": "Wie wohnen Dachse im Wald?",
        "options": [
          "In riesigen, verzweigten unterirdischen Höhlensystemen (Dachsbau)",
          "In offenen Nestern auf hohen Buchen",
          "Sie schlafen schwimmend im See",
          "Sie haben kein festes Zuhause"
        ],
        "correct": 0,
        "hint": "Finde die Erklärung im 3. Abschnitt über den Bau."
      },
      {
        "q": "Was beweist, dass der Dachs ein ausgesprochen reinliches Tier ist?",
        "options": [
          "Er polstert Schlafkammern mit frischem Laub und gräbt Gruben fürs Geschäft",
          "Er putzt sich stundenlang mit Seife",
          "Er wäscht jedes Beutetier im Fluss ab",
          "Er lässt den Kot in den Schlafräumen liegen"
        ],
        "correct": 0,
        "hint": "Lies im vorletzten Satz nach der Sauberkeit im Dachsbau."
      },
      {
        "q": "Wovon ernährt sich der Dachs als echter Allesfresser?",
        "options": [
          "Von Regenwürmern, Käfern, Mäusen, Beeren und Wurzeln",
          "Ausschließlich von frischem Gras",
          "Nur von reinem Holz und Baumrinde",
          "Nur von Fischen"
        ],
        "correct": 0,
        "hint": "Finde den Speiseplan des Dachses am Ende des Textes."
      }
    ]
  },
  {
    "id": "hallstatt",
    "title": "Hallstatt – Das Tal des weißen Goldes",
    "icon": null,
    "text": "Eingebettet zwischen dem dunklen Hallstätter See und den steilen Felswänden des Dachsteins liegt der malerische Ort Hallstatt im oberösterreichischen Salzkammergut. Hallstatt ist weltberühmt: Hier befindet sich das älteste Salzbergwerk der Welt, in dem die Menschen schon vor über 7 000 Jahren Salz abbauten. Salz war in der Antike und im Mittelalter unglaublich wertvoll, weil man damit Fleisch und Fisch haltbar machen konnte. Man nannte es deshalb ehrfurchtsvoll das „weiße Gold“. Tief im Berginneren bauten die Bergleute das Salzgestein ab. Bei Ausgrabungen fand man sogar die älteste Holzstiege Europas und jahrtausendealte Werkzeuge aus Bronze. Heute fahren Touristen mit einer Bergbahn hinauf, um die geheimnisvollen Stollen und die spektakuläre Aussichtsplattform zu erleben.",
    "questions": [
      {
        "q": "Was bauten die Menschen in Hallstatt schon vor über 7 000 Jahren ab?",
        "options": [
          "Salz (das sogenannte „weiße Gold“)",
          "Goldmünzen und Diamanten",
          "Kohle für Dampfloks",
          "Eisen für Autos"
        ],
        "correct": 0,
        "hint": "Lies im 2. Satz nach dem ältesten Bergwerk der Welt."
      },
      {
        "q": "Warum war Salz früher so unermesslich wertvoll für die Menschen?",
        "options": [
          "Weil man damit Lebensmittel wie Fleisch und Fisch haltbar machen konnte",
          "Weil man daraus Häuser bauen konnte",
          "Weil es wie Gold im Dunkeln glänzte",
          "Weil man es als Kleidung trug"
        ],
        "correct": 0,
        "hint": "Welchen Zweck erfüllte Salz vor der Erfindung von Kühlschränken?"
      },
      {
        "q": "Welche spektakuläre Entdeckung machten Forscher tief im Bergwerk?",
        "options": [
          "Die älteste Holzstiege Europas und alte Bronzewerkzeuge",
          "Ein riesiges Skelett eines Dinosauriers",
          "Eine vergrabene Piratenschatztruhe",
          "Ein römisches Segelschiff"
        ],
        "correct": 0,
        "hint": "Schau im 4. Satz nach dem archäologischen Fund im Berg."
      },
      {
        "q": "An welchem See liegt der weltberühmte Ort Hallstatt?",
        "options": [
          "Am Hallstätter See",
          "Am Bodensee",
          "Am Wörthersee",
          "Am Neusiedler See"
        ],
        "correct": 0,
        "hint": "Lies den ersten Satz über die Lage des Ortes."
      }
    ]
  },
  {
    "id": "schnecke",
    "title": "Die Weinbergschnecke – Das Haus auf dem Rücken",
    "icon": null,
    "text": "Die Weinbergschnecke ist die größte Gehäuseschnecke Mitteleuropas. Ihr auffälligstes Merkmal ist das dicke, spiralig gewundene Kalkgehäuse, das sie zeitlebens auf dem Rücken trägt. Droht Gefahr durch Vögel oder Igel oder wird es im Hochsommer zu trocken, zieht sich die Schnecke komplett in ihr Haus zurück. Sie kriecht auf einer breiten Kriechsohle vorwärts und sondert dabei eine Schleimspur ab. Dieser Schleim verringert die Reibung und schützt die empfindliche Sohle so gut, dass eine Schnecke sogar schadlos über die scharfe Klinge eines Messers kriechen kann. Am Kopf sitzen vier Fühler: Die beiden langen oberen Fühler tragen kleine Punktaugen, die beiden kürzeren unteren Fühler dienen zum Tasten und Riechen. Den Winter verschläft die Schnecke eingekapselt mit einem festen Kalkdeckel.",
    "questions": [
      {
        "q": "Woraus besteht das schützende Gehäuse der Weinbergschnecke?",
        "options": [
          "Aus festem Kalk",
          "Aus weichem Holz",
          "Aus buntem Plastik",
          "Aus getrocknetem Schlamm"
        ],
        "correct": 0,
        "hint": "Finde das Material des Schneckenhauses im 2. Satz."
      },
      {
        "q": "Welche wichtige Funktion erfüllt die Schleimspur beim Kriechen?",
        "options": [
          "Sie schützt die weiche Sohle vor Verletzungen und verringert Reibung",
          "Sie dient nur als Schmuck",
          "Damit die Schnecke im Dunkeln den Weg nach Hause findet",
          "Um Futter daran festzukleben"
        ],
        "correct": 0,
        "hint": "Lies nach, warum die Schnecke sogar über scharfe Kanten kriechen kann."
      },
      {
        "q": "Welche Sinnesorgane sitzen an den vier Fühlern der Schnecke?",
        "options": [
          "Augen an den langen Fühlern, Tast- und Riechorgane an den kurzen",
          "Ohren zum Hören von Musik",
          "Zähne zum Kauen von Gras",
          "Nur zwei kleine Nasen"
        ],
        "correct": 0,
        "hint": "Schau im 4. Abschnitt nach den Funktionen der Fühler."
      },
      {
        "q": "Wie schützt sich die Weinbergschnecke im Winter vor dem Erfrieren?",
        "options": [
          "Sie verschließt ihr Haus mit einem festen Kalkdeckel",
          "Sie zieht in beheizte Häuser ein",
          "Sie vergräbt sich im warmen Fluss",
          "Sie fliegt nach Afrika"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz über den Winterdeckel."
      }
    ]
  },
  {
    "id": "waldkauz",
    "title": "Der Waldkauz – Der lautlose Jäger der Nacht",
    "icon": null,
    "text": "Der Waldkauz ist die häufigste Eule in den Wäldern und Parks Österreichs. Er hat einen runden Kopf mit großen, dunklen Knopfaugen und einem weichen, rindenfarbenen Gefieder, das ihn am Tag perfekt an Baumstämmen tarnt. Sein bekanntester Ruf ist das schaurig-schöne „Huu-hu-hu-huu“, das man oft an milden Frühlingsabenden im Wald hört. Waldkäuze sind nachtaktiv und besitzen ein außergewöhnliches Gehör: Die Ohröffnungen sitzen leicht versetzt am Kopf, sodass die Eule das Rascheln einer Maus unter einer dicken Laubschicht auf den Zentimeter genau orten kann. Die Ränder ihrer Flügelfedern sind samtig weich gezahnt. Deshalb gleitet der Waldkauz völlig lautlos durch die Nacht, ohne dass seine Beute das leiseste Fluggeräusch wahrnehmen kann.",
    "questions": [
      {
        "q": "Warum kann der Waldkauz im Flug absolut keine Geräusche machen?",
        "options": [
          "Wegen samtig weicher Fransen an den Kanten seiner Flügelfedern",
          "Weil er den Atem anhält",
          "Weil er nur fliegt, wenn es stürmt",
          "Weil er keine echten Federn hat"
        ],
        "correct": 0,
        "hint": "Lies im letzten Satz nach, wie die Federn den Flug lautlos machen."
      },
      {
        "q": "Wie hilft das versetzte Gehör dem Waldkauz bei der Jagd?",
        "options": [
          "Er kann das leiseste Rascheln von Mäusen im Dunkeln exakt orten",
          "Er kann damit andere Vögel singen hören",
          "Er hört damit das Gras wachsen",
          "Es hilft ihm beim Schwimmen"
        ],
        "correct": 0,
        "hint": "Schau im 3. Abschnitt nach den besonderen Ohröffnungen."
      },
      {
        "q": "Wie tarnt sich der Waldkauz tagsüber vor Feinden?",
        "options": [
          "Sein rindenfarbiges Gefieder lässt ihn wie einen Ast aussehen",
          "Er gräbt sich im Boden ein",
          "Er rollt sich wie ein Igel zusammen",
          "Er taucht unter Wasser"
        ],
        "correct": 0,
        "hint": "Finde die Erklärung der Tarnung im 2. Satz."
      },
      {
        "q": "Welche Beutetiere jagt der Waldkauz nachts hauptsächlich?",
        "options": [
          "Kleine Nagetiere wie Mäuse und Ratten",
          "Rehe und Wildschweine",
          "Große Fische aus dem Meer",
          "Nur Gras und Wurzeln"
        ],
        "correct": 0,
        "hint": "Welche kleinen Beutetiere werden im Text genannt?"
      }
    ]
  },
  {
    "id": "wachau",
    "title": "Die Wachau – Weltkulturerbe an der Donau",
    "icon": null,
    "text": "Die Wachau ist der malerische Talabschnitt der Donau zwischen den Städten Melk und Krems in Niederösterreich. Wegen ihrer jahrtausendealten Kulturlandschaft mit steilen Weinterrassen, historischen Dörfern und mittelalterlichen Burgen wurde die Wachau zum UNESCO-Weltkulturerbe erklärt. Das milde Klima im Donautal ist ideal für den Anbau von saftigen Weintrauben und den berühmten Wachauer Marillen. Auf einem Felsen hoch über der Donau thront das prächtige barocke Stift Melk mit seiner goldenen Stiftskirche und der riesigen Bibliothek. Viele Besucher erkunden die Wachau mit Ausflugsschiffen auf der Donau oder radeln auf dem Donauradweg gemütlich am Flussufer entlang.",
    "questions": [
      {
        "q": "Zwischen welchen zwei niederösterreichischen Städten liegt die Wachau?",
        "options": [
          "Zwischen Melk und Krems",
          "Zwischen Graz und Klagenfurt",
          "Zwischen Innsbruck und Bregenz",
          "Zwischen Wien und Eisenstadt"
        ],
        "correct": 0,
        "hint": "Lies gleich im ersten Satz nach den beiden Grenzstädten."
      },
      {
        "q": "Welche Frucht ist neben Weintrauben die berühmteste Spezialität der Wachau?",
        "options": [
          "Die Wachauer Marille",
          "Die Wachauer Ananas",
          "Die Wachauer Banane",
          "Die Wachauer Kokosnuss"
        ],
        "correct": 0,
        "hint": "Finde den typisch österreichischen Fruchtnamen im Text."
      },
      {
        "q": "Welches berühmte barocke Kloster thront am Eingang zur Wachau auf einem Felsen?",
        "options": [
          "Das Stift Melk",
          "Das Schloss Schönbrunn",
          "Der Stephansdom",
          "Die Festung Kufstein"
        ],
        "correct": 0,
        "hint": "Lies im 3. Abschnitt über das prächtige Barockstift."
      },
      {
        "q": "Warum gehört die Wachau zum UNESCO-Weltkulturerbe?",
        "options": [
          "Wegen ihrer einzigartigen Kulturlandschaft mit Terrassen und Burgen",
          "Weil dort der größte Flughafen gebaut wurde",
          "Weil dort das meiste Gold gefunden wurde",
          "Weil dort keine Menschen wohnen dürfen"
        ],
        "correct": 0,
        "hint": "Lies im 2. Satz, warum die Wachau weltweit geschützt ist."
      }
    ]
  },
  {
    "id": "maulwurf",
    "title": "Der Maulwurf – Der Schaufelmeister unter der Wiese",
    "icon": null,
    "text": "Wer auf einer Wiese frische Erdhaufen entdeckt, weiß: Hier war der Europäische Maulwurf am Werk! Der Maulwurf verbringt fast sein ganzes Leben unter der Erde in völliger Dunkelheit. Sein Körper ist perfekt an das Graben angepasst: Seine vorderen Gliedmaßen sind zu breiten, kräftigen Grabschaufeln mit hornigen Krallen umgeformt. Sein samtiges, schwarzes Fell hat keinen Strich, sodass der Maulwurf in seinen engen Tunneln mühelos vorwärts und rückwärts schlüpfen kann. Seine winzigen Augen können nur hell und dunkel unterscheiden, doch sein Tast- und Geruchssinn an der Schnauze ist hochentwickelt. Der Maulwurf ist ein reiner Fleischfresser: Auf seinen Kontrollgängen durch das Tunnelsystem fängt er Regenwürmer, Engerlinge und Tausendfüßler. Pflanzenwurzeln frisst er niemals!",
    "questions": [
      {
        "q": "Wozu dienen dem Maulwurf seine vorderen Gliedmaßen?",
        "options": [
          "Als kräftige Grabschaufeln zum Durchgraben der Erde",
          "Zum schnellen Klettern auf Bäume",
          "Als Flügel zum Weitspringen",
          "Als Flossen zum Tauchen"
        ],
        "correct": 0,
        "hint": "Lies im 2. Abschnitt über die Form seiner Vorderpfoten."
      },
      {
        "q": "Warum kann der Maulwurf in seinen Tunneln gleich gut vorwärts und rückwärts kriechen?",
        "options": [
          "Weil sein samtiges Fell keinen Strich hat und in alle Richtungen nachgibt",
          "Weil er Räder unter dem Bauch hat",
          "Weil er keine Knochen besitzt",
          "Weil seine Tunnel riesig wie Autotunnel sind"
        ],
        "correct": 0,
        "hint": "Schau nach der Besonderheit seines Fells im 3. Satz."
      },
      {
        "q": "Was frisst der Maulwurf in seinen unterirdischen Gängen?",
        "options": [
          "Regenwürmer, Engerlinge und Insektenlarven",
          "Karotten und Salatwurzeln aus dem Beet",
          "Trockenes Gras und Blumenblüten",
          "Brot und Semmeln"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz: Ist der Maulwurf Vegetarier oder Fleischfresser?"
      },
      {
        "q": "Wie orientiert sich der Maulwurf in der stockdunklen Erde?",
        "options": [
          "Mit seinem feinen Geruchs- und Tastsinn an der Schnauze",
          "Mit riesigen Adleraugen",
          "Mit einer Lampe am Kopf",
          "Er sieht im Dunkeln perfekt farbig"
        ],
        "correct": 0,
        "hint": "Finde die Sinnesorgane an der Schnauze im Text."
      }
    ]
  },
  {
    "id": "gesaeuse",
    "title": "Nationalpark Gesäuse – Wasser und wilder Fels",
    "icon": null,
    "text": "Der Nationalpark Gesäuse liegt im Bundesland Steiermark und ist der drittgrößte Nationalpark Österreichs. Seinen Namen verdankt das Gesäuse dem Tosen und Rauschen des wilden Gebirgsflusses Enns, der sich hier tief in das massive Kalkgebirge gegraben hat. Neben den tosenden Wasserschluchten ragen senkrechte, bis zu tausend Meter hohe Felswände empor. Diese extremen Höhenunterschiede schaffen unterschiedlichste Lebensräume: Von feuchten Auwäldern an der Enns bis zu kargen alpinen Schutthalden ganz oben. Hier blüht die zarte Gesäuse-Zierliche-Glockenblume, die es auf der ganzen Welt nur in diesem Tal gibt. In den unberührten Wäldern finden seltene Tiere wie der Eurasische Fischotter, der Uhu und die Alpendohle eine geschützte Heimat.",
    "questions": [
      {
        "q": "In welchem Bundesland befindet sich der Nationalpark Gesäuse?",
        "options": [
          "In der Steiermark",
          "Im Burgenland",
          "In Wien",
          "In Vorarlberg"
        ],
        "correct": 0,
        "hint": "Lies gleich im ersten Satz, in welchem Bundesland das Gesäuse liegt."
      },
      {
        "q": "Woher hat das Gesäuse seinen besonderen Namen?",
        "options": [
          "Vom Tosen und Rauschen des wilden Flusses Enns durch die Felsen",
          "Von einem historischen Schloss",
          "Weil dort immer saurer Apfelsaft getrunken wurde",
          "Von einem alten König namens Gesäus"
        ],
        "correct": 0,
        "hint": "Finde die Erklärung für den Namen im 2. Satz."
      },
      {
        "q": "Welche seltene Blume wächst weltweit ausschließlich im Gesäuse?",
        "options": [
          "Die zarte Gesäuse-Glockenblume",
          "Die gelbe Sonnenblume",
          "Die Rote Rose",
          "Das weiße Schneeglöckchen"
        ],
        "correct": 0,
        "hint": "Lies im 4. Satz nach der einzigartigen Pflanze."
      },
      {
        "q": "Welcher wilde Gebirgsfluss durchströmt den Nationalpark?",
        "options": [
          "Die Enns",
          "Die Donau",
          "Der Rhein",
          "Der Nil"
        ],
        "correct": 0,
        "hint": "Suche den Namen des Flusses im 2. Satz."
      }
    ]
  },
  {
    "id": "apfelbaum",
    "title": "Der Apfelbaum im Wandel der Jahreszeiten",
    "icon": null,
    "text": "Der Apfelbaum ist der beliebteste Obstbaum in unseren Gärten. Im Laufe eines Jahres verändert er sich ständig. Im Frühling erwacht der Baum aus der Winterruhe: Aus den Knospen sprießen zarte grüne Blätter und tausende weiß-rosa Blüten. Fleißige Bienen und Hummeln besuchen die Blüten und bestäuben sie. Nach der Bestäubung welken die Blütenblätter ab und am Fruchtknoten wachsen kleine grüne Äpfel heran. Im sonnigen Sommer spendet das dichte Blätterdach kühlenden Schatten, während die Früchte durch Sonnenlicht heranreifen und süßen Fruchtzucker bilden. Im Herbst ist Erntezeit: Die Äpfel leuchten rot oder gelb an den Zweigen und werden vorsichtig gepflückt. Vor dem kalten Winter verfärben sich die Blätter bunt und fallen ab, damit der Baum im Winter nicht vertrocknet.",
    "questions": [
      {
        "q": "Was passiert mit dem Apfelbaum im Frühling?",
        "options": [
          "Er treibt grüne Blätter aus und öffnet duftende weiß-rosa Blüten",
          "Er verliert alle Blätter auf einmal",
          "Er friert komplett ein",
          "Er trägt sofort dicke reife Äpfel"
        ],
        "correct": 0,
        "hint": "Lies im 2. Abschnitt, wie der Baum im Frühling erwacht."
      },
      {
        "q": "Warum sind Bienen und Hummeln für den Apfelbaum so unverzichtbar?",
        "options": [
          "Weil sie die Blüten bestäuben, damit überhaupt Äpfel wachsen können",
          "Weil sie die Baumrinde mit Honig bemalen",
          "Weil sie Schädlinge mit Nadeln verjagen",
          "Sie nützen dem Baum gar nicht"
        ],
        "correct": 0,
        "hint": "Was passiert nach dem Besuch der Insekten an den Blüten?"
      },
      {
        "q": "Warum wirft der Apfelbaum im Spätherbst alle seine Blätter ab?",
        "options": [
          "Um im Winter bei gefrorenem Boden kein Wasser über die Blätter zu verdunsten",
          "Weil die Blätter zu schwer für die Äste werden",
          "Weil die Vögel die Blätter fressen",
          "Weil er keine Farbe mehr hat"
        ],
        "correct": 0,
        "hint": "Lies den letzten Satz: Wovor schützt sich der Baum im Winter?"
      },
      {
        "q": "In welcher Jahreszeit werden die reifen Äpfel geerntet?",
        "options": [
          "Im Herbst",
          "Mitten im tiefen Winter",
          "Im frühen Frühling",
          "Nur zu Silvester"
        ],
        "correct": 0,
        "hint": "Wann leuchten die reifen Früchte rot und gelb an den Zweigen?"
      }
    ]
  }
];

  function buildReadingTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const chosen = (opts && opts.all) ? READING_POOL : shuffle(READING_POOL).slice(0, 1);
    return chosen.map(item => {
      // Fragen durchmischen und Optionen durchmischen
      const questionsData = item.questions.map(qObj => {
        const correctText = qObj.options[qObj.correct];
        const shuffledOpts = shuffle([...qObj.options]);
        return {
          question: qObj.q,
          options: shuffledOpts,
          correctIndex: shuffledOpts.indexOf(correctText),
          correctText: correctText,
          hint: qObj.hint,
          userAnswer: null
        };
      });

      return {
        fach: 'deutsch',
        schulstufe: 3,
        grade: 3,
        lehrplanRef: 'D-3-4-Lesen-Sachtexte',
        lehrplanStatus: 'RIS',
        druck: 'ja',
        druckHinweis: '',
        type: 'reading',
        title: item.title,
        icon: item.icon,
        text: item.text,
        questions: questionsData,
        userAnswer: null,
        isCorrect: null
      };
    });
  }

  function stampGermanTasks(tasks) {
    if (!Array.isArray(tasks)) return tasks;
    return tasks.map(t => {
      if (!t || typeof t !== 'object') return t;
      if (!t.fach) t.fach = 'deutsch';
      if (!t.lehrplanStatus) t.lehrplanStatus = 'RIS';
      if (!t.druck) {
        if (t.type === 'word-types') {
          t.druck = 'angepasst';
          t.druckHinweis = 'Im Schwarzweißdruck mit Linienarten und Form-Symbolen (Quadrat, Kreis, Dreieck) statt reiner Farbe.';
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
    buildWordTypesTasks: (opts) => stampGermanTasks(buildWordTypesTasks(opts)),
    buildCapitalizationTasks: (opts) => stampGermanTasks(buildCapitalizationTasks(opts)),
    buildScrambleTasks: (opts) => stampGermanTasks(buildScrambleTasks(opts)),
    buildCasesTasks: (opts) => stampGermanTasks(buildCasesTasks(opts)),
    buildTensesTasks: (opts) => stampGermanTasks(buildTensesTasks(opts)),
    buildSyllableTasks: (opts) => stampGermanTasks(buildSyllableTasks(opts)),
    buildReadingTasks: (opts) => stampGermanTasks(buildReadingTasks(opts)),
  };
})();
