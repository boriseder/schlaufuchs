// =============================================================
// SCHLAUFUCHS – js/generators/general.js
// Sachunterricht-Generatoren (BMBWF Lehrplan, StVO Österreich)
// Echte StVO Vektor-SVGs für Verkehrszeichen, kein falsches Emoji!
// Große Pools mit je 100 Aufgaben pro Thema für garantierte Varianz
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.General = (function () {
  'use strict';

  // Zentrale Hilfsfunktionen aus Core (Zufall, deterministischer Seed)
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

  // 1. JAHRESKREIS & KALENDER (1. – 2. Klasse, inkl. Jänner! 100 Fragen Pool)
  const CALENDAR_POOL = [
  {
    "question": "Wie heißt der erste Monat des Kalenderjahres in Österreich?",
    "options": [
      "Jänner",
      "Februar",
      "März",
      "Dezember"
    ],
    "correct": 0,
    "hint": "Er beginnt direkt mit dem Neujahrstag nach der Silvesternacht."
  },
  {
    "question": "Welcher Monat folgt direkt auf den Jänner?",
    "options": [
      "Februar (Feber)",
      "März",
      "Dezember",
      "April"
    ],
    "correct": 0,
    "hint": "Der zweite Monat im Jahr ist der kürzeste Monat."
  },
  {
    "question": "Wie heißt der dritte Monat im Kalenderjahr?",
    "options": [
      "März",
      "April",
      "Mai",
      "Februar"
    ],
    "correct": 0,
    "hint": "In diesem Monat beginnt der kalendarische Frühling."
  },
  {
    "question": "Welcher Monat kommt direkt nach dem März?",
    "options": [
      "April",
      "Mai",
      "Juni",
      "März"
    ],
    "correct": 0,
    "hint": "Man sagt: Er macht, was er will!"
  },
  {
    "question": "Welcher Monat ist der 5. Monat im Jahr?",
    "options": [
      "Mai",
      "Juni",
      "April",
      "Juli"
    ],
    "correct": 0,
    "hint": "Am ersten Tag dieses Frühlingsmonats wird auf Dorfplätzen traditionell ein geschmückter Baum aufgestellt."
  },
  {
    "question": "Welcher Monat folgt auf den Mai?",
    "options": [
      "Juni",
      "Juli",
      "August",
      "April"
    ],
    "correct": 0,
    "hint": "In diesem Monat ist die Sommersonnenwende – der längste Tag und die kürzeste Nacht des ganzen Jahres."
  },
  {
    "question": "In welchen beiden Monaten haben die Schulkinder in Österreich Sommerferien?",
    "options": [
      "Juli und August",
      "Juni und Juli",
      "August und September",
      "Mai und Juni"
    ],
    "correct": 0,
    "hint": "Die großen Schulferien dauern neun Wochen im Hochsommer."
  },
  {
    "question": "Welcher Monat kommt direkt nach dem Juli?",
    "options": [
      "August",
      "September",
      "Juni",
      "Oktober"
    ],
    "correct": 0,
    "hint": "In diesem heißen Hochsommermonat haben alle Schülerinnen und Schüler in ganz Österreich Sommerferien."
  },
  {
    "question": "In welchem Monat beginnt in Österreich nach den Sommerferien die Schule?",
    "options": [
      "September",
      "Oktober",
      "August",
      "Juli"
    ],
    "correct": 0,
    "hint": "Wenn die langen Sommerferien zu Ende gehen, packen die Kinder ihre Schultaschen für das neue Schuljahr."
  },
  {
    "question": "Welcher Monat ist der 10. Monat im Jahr?",
    "options": [
      "Oktober",
      "November",
      "September",
      "Dezember"
    ],
    "correct": 0,
    "hint": "In diesem Herbstmonat feiern wir am 26. den Nationalfeiertag."
  },
  {
    "question": "Welcher Monat kommt direkt vor dem Dezember?",
    "options": [
      "November",
      "Oktober",
      "September",
      "Jänner"
    ],
    "correct": 0,
    "hint": "Der vorletzte Monat des Jahres ist oft nebelig und kühl."
  },
  {
    "question": "Wie heißt der zwölfte und letzte Monat des Kalenderjahres?",
    "options": [
      "Dezember",
      "November",
      "Jänner",
      "Oktober"
    ],
    "correct": 0,
    "hint": "In diesem Monat feiern wir Weihnachten und Silvester."
  },
  {
    "question": "Wie viele Monate hat ein ganzes Jahr?",
    "options": [
      "12 Monate",
      "10 Monate",
      "24 Monate",
      "7 Monate"
    ],
    "correct": 0,
    "hint": "Zähle von Jänner bis Dezember durch."
  },
  {
    "question": "Welcher Monat liegt genau zwischen Oktober und Dezember?",
    "options": [
      "November",
      "September",
      "Jänner",
      "August"
    ],
    "correct": 0,
    "hint": "Oktober, ..., Dezember."
  },
  {
    "question": "Welcher Monat liegt genau zwischen April und Juni?",
    "options": [
      "Mai",
      "März",
      "Juli",
      "August"
    ],
    "correct": 0,
    "hint": "April, ..., Juni."
  },
  {
    "question": "Welcher Monat liegt genau zwischen Jänner und März?",
    "options": [
      "Februar (Feber)",
      "April",
      "Dezember",
      "Mai"
    ],
    "correct": 0,
    "hint": "Der zweite Monat im Jahr."
  },
  {
    "question": "Welcher Monat liegt genau zwischen Juni und August?",
    "options": [
      "Juli",
      "Mai",
      "September",
      "Oktober"
    ],
    "correct": 0,
    "hint": "Der Ferienmonat zwischen Juni und August."
  },
  {
    "question": "Welcher Monat hat normalerweise nur 28 Tage (im Schaltjahr 29 Tage)?",
    "options": [
      "Februar (Feber)",
      "Jänner",
      "April",
      "November"
    ],
    "correct": 0,
    "hint": "Er ist der kürzeste Monat des gesamten Jahres."
  },
  {
    "question": "Wie viele Tage hat der Monat Jänner?",
    "options": [
      "31 Tage",
      "30 Tage",
      "28 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Knöchelprobe: Der erste Knöchel ganz links an deiner Faust steht weit oben (erhabene Stelle)."
  },
  {
    "question": "Wie viele Tage hat der Monat Dezember?",
    "options": [
      "31 Tage",
      "30 Tage",
      "28 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Der Silvestertag ist der 31. Dezember."
  },
  {
    "question": "Wie viele Tage hat der Monat April?",
    "options": [
      "30 Tage",
      "31 Tage",
      "28 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Knöchelprobe: Nach dem hohen März-Knöchel liegt dieser Monat in einer Vertiefung zwischen den Knöcheln."
  },
  {
    "question": "Wie viele Tage hat der Monat Juni?",
    "options": [
      "30 Tage",
      "31 Tage",
      "28 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Knöchelprobe: Nach dem hohen Mai-Knöchel liegt dieser Monat in einer Vertiefung deiner Hand."
  },
  {
    "question": "Wie viele Tage hat der Monat Juli?",
    "options": [
      "31 Tage",
      "30 Tage",
      "28 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Knöchelprobe: Er liegt am letzten hohen Knöchel der ersten Faust."
  },
  {
    "question": "Wie viele Tage hat der Monat August?",
    "options": [
      "31 Tage",
      "30 Tage",
      "28 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Knöchelprobe: Beim Wechsel auf die zweite Hand landen wir direkt wieder auf einem hohen Knöchel."
  },
  {
    "question": "Welcher Monat hat 30 Tage?",
    "options": [
      "September",
      "Jänner",
      "März",
      "Mai"
    ],
    "correct": 0,
    "hint": "Knöchelprobe: Suche den Monat, der in der Vertiefung zwischen den Knöcheln liegt."
  },
  {
    "question": "Wie viele Tage hat eine ganz normale Woche?",
    "options": [
      "7 Tage",
      "5 Tage",
      "6 Tage",
      "10 Tage"
    ],
    "correct": 0,
    "hint": "5 Wochentage und 2 Tage am Wochenende."
  },
  {
    "question": "Welcher Wochentag ist der erste Tag der Schulwoche?",
    "options": [
      "Montag",
      "Dienstag",
      "Sonntag",
      "Samstag"
    ],
    "correct": 0,
    "hint": "Nach dem Sonntag startet die Schulwoche mit dem ..."
  },
  {
    "question": "Welcher Wochentag kommt direkt nach dem Montag?",
    "options": [
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Sonntag"
    ],
    "correct": 0,
    "hint": "Montag, ..., Mittwoch."
  },
  {
    "question": "Welcher Wochentag liegt genau in der Mitte der Arbeitswoche?",
    "options": [
      "Mittwoch",
      "Dienstag",
      "Donnerstag",
      "Freitag"
    ],
    "correct": 0,
    "hint": "Sein Name verrät schon, dass er die Mitte der Woche ist."
  },
  {
    "question": "Welcher Tag kommt direkt vor dem Freitag?",
    "options": [
      "Donnerstag",
      "Mittwoch",
      "Samstag",
      "Dienstag"
    ],
    "correct": 0,
    "hint": "Montag, Dienstag, Mittwoch, ..., Freitag."
  },
  {
    "question": "Welcher Wochentag folgt direkt auf den Donnerstag?",
    "options": [
      "Freitag",
      "Samstag",
      "Mittwoch",
      "Dienstag"
    ],
    "correct": 0,
    "hint": "Der letzte Schultag vor dem Wochenende."
  },
  {
    "question": "Welche beiden Tage bilden zusammen das Wochenende?",
    "options": [
      "Samstag und Sonntag",
      "Freitag und Samstag",
      "Sonntag und Montag",
      "Donnerstag und Freitag"
    ],
    "correct": 0,
    "hint": "An diesen beiden Tagen haben die Kinder schulfrei."
  },
  {
    "question": "Welcher Tag kommt direkt nach dem Samstag?",
    "options": [
      "Sonntag",
      "Montag",
      "Freitag",
      "Dienstag"
    ],
    "correct": 0,
    "hint": "Der letzte Tag der Woche, an dem die Familie oft Ausflüge macht."
  },
  {
    "question": "Welcher Tag kommt direkt vor dem Montag?",
    "options": [
      "Sonntag",
      "Samstag",
      "Freitag",
      "Dienstag"
    ],
    "correct": 0,
    "hint": "Das Wochenende endet mit dem ..."
  },
  {
    "question": "Wie viele Schultage hat eine normale Schulwoche meistens?",
    "options": [
      "5 Tage",
      "6 Tage",
      "7 Tage",
      "4 Tage"
    ],
    "correct": 0,
    "hint": "Von Montag bis Freitag."
  },
  {
    "question": "Wie viele Tage hat das Wochenende?",
    "options": [
      "2 Tage",
      "3 Tage",
      "1 Tag",
      "4 Tage"
    ],
    "correct": 0,
    "hint": "Samstag und Sonntag."
  },
  {
    "question": "Wenn heute Dienstag ist: Welcher Tag war gestern?",
    "options": [
      "Montag",
      "Sonntag",
      "Mittwoch",
      "Donnerstag"
    ],
    "correct": 0,
    "hint": "Der Tag direkt vor dem Dienstag."
  },
  {
    "question": "Wenn heute Donnerstag ist: Welcher Tag ist morgen?",
    "options": [
      "Freitag",
      "Samstag",
      "Mittwoch",
      "Dienstag"
    ],
    "correct": 0,
    "hint": "Der Tag direkt nach dem Donnerstag."
  },
  {
    "question": "Wenn heute Freitag ist: Welcher Tag ist übermorgen?",
    "options": [
      "Sonntag",
      "Samstag",
      "Montag",
      "Dienstag"
    ],
    "correct": 0,
    "hint": "Morgen ist Samstag, und übermorgen ist ..."
  },
  {
    "question": "Wenn heute Mittwoch ist: Welcher Tag war vorgestern?",
    "options": [
      "Montag",
      "Dienstag",
      "Sonntag",
      "Samstag"
    ],
    "correct": 0,
    "hint": "Gestern war Dienstag, vorgestern war ..."
  },
  {
    "question": "Wie viele Stunden hat ein ganzer Tag (mit Tag und Nacht)?",
    "options": [
      "24 Stunden",
      "12 Stunden",
      "20 Stunden",
      "60 Stunden"
    ],
    "correct": 0,
    "hint": "So lange dauert eine vollständige Drehung der Erde um ihre eigene Achse – von Mitternacht bis Mitternacht."
  },
  {
    "question": "Was bedeutet das Wort 'vorgestern'?",
    "options": [
      "Der Tag vor dem gestrigen Tag",
      "Der Tag nach morgen",
      "Der heutige Tag",
      "Die nächste Woche"
    ],
    "correct": 0,
    "hint": "Zwei Tage in der Vergangenheit."
  },
  {
    "question": "Was bedeutet das Wort 'übermorgen'?",
    "options": [
      "Der Tag nach dem morgigen Tag",
      "Der gestrige Tag",
      "Der heutige Tag",
      "Vor zwei Tagen"
    ],
    "correct": 0,
    "hint": "In zwei Tagen."
  },
  {
    "question": "In welcher Reihenfolge vergeht ein Tag?",
    "options": [
      "Morgen, Vormittag, Mittag, Nachmittag, Abend, Nacht",
      "Mittag, Morgen, Abend, Nacht, Vormittag",
      "Abend, Mittag, Morgen, Nacht",
      "Nacht, Mittag, Abend, Vormittag"
    ],
    "correct": 0,
    "hint": "Wir wachen am Morgen auf und gehen am Abend schlafen."
  },
  {
    "question": "Zu welcher Tageszeit essen die meisten Familien zu Mittag?",
    "options": [
      "Am Mittag (ca. 12 bis 13 Uhr)",
      "Am frühen Morgen",
      "Mitten in der Nacht",
      "Am späten Abend"
    ],
    "correct": 0,
    "hint": "Zwischen Vormittag und Nachmittag."
  },
  {
    "question": "Wie viele Jahreszeiten hat ein ganzes Jahr?",
    "options": [
      "4 Jahreszeiten",
      "12 Jahreszeiten",
      "2 Jahreszeiten",
      "7 Jahreszeiten"
    ],
    "correct": 0,
    "hint": "Frühling, Sommer, Herbst und Winter."
  },
  {
    "question": "In welcher Reihenfolge folgen die 4 Jahreszeiten aufeinander?",
    "options": [
      "Frühling, Sommer, Herbst, Winter",
      "Sommer, Frühling, Winter, Herbst",
      "Winter, Sommer, Frühling, Herbst",
      "Herbst, Frühling, Sommer, Winter"
    ],
    "correct": 0,
    "hint": "Nach dem kalten Winter erwacht die Natur im Frühling."
  },
  {
    "question": "Welche Jahreszeit folgt direkt auf den Winter?",
    "options": [
      "Frühling",
      "Sommer",
      "Herbst",
      "Jänner"
    ],
    "correct": 0,
    "hint": "Der Schnee schmilzt und die ersten Blumen sprießen."
  },
  {
    "question": "Welche Jahreszeit folgt direkt auf den Frühling?",
    "options": [
      "Sommer",
      "Herbst",
      "Winter",
      "Mai"
    ],
    "correct": 0,
    "hint": "Es wird richtig heiß und die Badesaison beginnt."
  },
  {
    "question": "Welche Jahreszeit folgt direkt auf den Sommer?",
    "options": [
      "Herbst",
      "Winter",
      "Frühling",
      "August"
    ],
    "correct": 0,
    "hint": "Die Blätter an den Bäumen färben sich bunt und fallen ab."
  },
  {
    "question": "Welche Jahreszeit folgt direkt auf den Herbst?",
    "options": [
      "Winter",
      "Frühling",
      "Sommer",
      "Dezember"
    ],
    "correct": 0,
    "hint": "Es wird kalt, friert und schneit oft."
  },
  {
    "question": "Welche Monate gehören zu den drei Frühlingsmonaten?",
    "options": [
      "März, April, Mai",
      "Juni, Juli, August",
      "September, Oktober, November",
      "Dezember, Jänner, Februar"
    ],
    "correct": 0,
    "hint": "Im Frühling erwacht die Natur und Ostern wird gefeiert."
  },
  {
    "question": "Welche Monate gehören zu den drei Sommermonaten?",
    "options": [
      "Juni, Juli, August",
      "März, April, Mai",
      "September, Oktober, November",
      "Juli, August, September"
    ],
    "correct": 0,
    "hint": "Die wärmsten Monate des Jahres."
  },
  {
    "question": "Welche Monate gehören zu den drei Herbstmonaten?",
    "options": [
      "September, Oktober, November",
      "Juni, Juli, August",
      "März, April, Mai",
      "Oktober, November, Dezember"
    ],
    "correct": 0,
    "hint": "Die Erntezeit und Schulbeginn liegen im Herbst."
  },
  {
    "question": "Welche Monate gehören zu den drei Wintermonaten?",
    "options": [
      "Dezember, Jänner, Februar (Feber)",
      "Oktober, November, Dezember",
      "Jänner, Februar, März",
      "November, Dezember, Jänner"
    ],
    "correct": 0,
    "hint": "Die kältesten Monate rund um den Jahreswechsel."
  },
  {
    "question": "In welcher Jahreszeit blühen Schneeglöckchen und Krokusse zuerst?",
    "options": [
      "Im Vorfrühling / Frühling",
      "Im Hochsommer",
      "Im Spätherbst",
      "Mitten im Winter"
    ],
    "correct": 0,
    "hint": "Sie sind die ersten Frühlingsboten nach dem Winter."
  },
  {
    "question": "In welcher Jahreszeit ernten die Bauern in Österreich reife Äpfel und Weintrauben?",
    "options": [
      "Im Herbst",
      "Im Frühling",
      "Mitten im Winter",
      "Im Jänner"
    ],
    "correct": 0,
    "hint": "Der Herbst ist die große Erntezeit."
  },
  {
    "question": "In welcher Jahreszeit sind die Tage am längsten und die Nächte am kürzesten?",
    "options": [
      "Im Sommer",
      "Im Winter",
      "Im Herbst",
      "Im Frühling"
    ],
    "correct": 0,
    "hint": "Zur Sommersonnenwende im Juni ist es bis spät am Abend hell."
  },
  {
    "question": "In welcher Jahreszeit sind die Tage am kürzesten und die Nächte am längsten?",
    "options": [
      "Im Winter",
      "Im Sommer",
      "Im Frühling",
      "Im Herbst"
    ],
    "correct": 0,
    "hint": "Im Dezember wird es schon am Nachmittag um 16:30 Uhr dunkel."
  },
  {
    "question": "Was machen viele Laubbäume im Herbst?",
    "options": [
      "Sie verfärben ihre Blätter bunt und werfen sie ab",
      "Sie bekommen neue zarte Blüten",
      "Sie wachsen doppelt so schnell",
      "Sie tragen frische grüne Triebe"
    ],
    "correct": 0,
    "hint": "Buchen und Eichen werfen im Herbst ihr Laub ab, um Wasser zu sparen."
  },
  {
    "question": "Welcher Baum behält auch im tiefsten Winter seine grünen Nadeln?",
    "options": [
      "Die Tanne",
      "Die Eiche",
      "Die Buche",
      "Der Apfelbaum"
    ],
    "correct": 0,
    "hint": "Nadelbäume (außer der Lärche) bleiben im Winter grün."
  },
  {
    "question": "Was passiert mit Wasser im Winter, wenn das Thermometer unter 0 Grad Celsius sinkt?",
    "options": [
      "Es gefriert zu festem Eis",
      "Es beginnt zu kochen",
      "Es verdampft sofort",
      "Es wird rot"
    ],
    "correct": 0,
    "hint": "Unter 0 Grad gefriert flüssiges Wasser zu Eis."
  },
  {
    "question": "In welcher Jahreszeit kehren viele Zugvögel aus dem Süden zu uns zurück?",
    "options": [
      "Im Frühling",
      "Im Herbst",
      "Mitten im Winter",
      "Im November"
    ],
    "correct": 0,
    "hint": "Wenn es wärmer wird, bauen Schwalben und Störche wieder ihre Nester."
  },
  {
    "question": "In welcher Jahreszeit fliegen viele Zugvögel weg in den warmen Süden?",
    "options": [
      "Im Herbst",
      "Im Frühling",
      "Im Sommer",
      "Im Mai"
    ],
    "correct": 0,
    "hint": "Bevor es kalt wird und die Insekten verschwinden, fliegen sie los."
  },
  {
    "question": "An welchem Tag beginnt der kalendarische Frühlingsanfang meistens?",
    "options": [
      "Am 20. oder 21. März",
      "Am 1. Jänner",
      "Am 1. Mai",
      "Am 21. Juni"
    ],
    "correct": 0,
    "hint": "Tagundnachtgleiche im März."
  },
  {
    "question": "An welchem Tag ist der kalendarische Sommeranfang (Sommersonnenwende)?",
    "options": [
      "Am 21. Juni",
      "Am 1. Juli",
      "Am 1. August",
      "Am 1. Mai"
    ],
    "correct": 0,
    "hint": "Der längste Tag des Jahres liegt um den 21. Juni."
  },
  {
    "question": "An welchem Tag ist der kalendarische Herbstanfang?",
    "options": [
      "Am 22. oder 23. September",
      "Am 1. Oktober",
      "Am 1. November",
      "Am 15. August"
    ],
    "correct": 0,
    "hint": "Tagundnachtgleiche im September."
  },
  {
    "question": "An welchem Tag ist der kalendarische Winteranfang (Wintersonnenwende)?",
    "options": [
      "Am 21. oder 22. Dezember",
      "Am 1. Jänner",
      "Am 1. November",
      "Am 6. Jänner"
    ],
    "correct": 0,
    "hint": "Der kürzeste Tag des Jahres liegt kurz vor Weihnachten."
  },
  {
    "question": "Warum ist es im Sommer bei uns wärmer als im Winter?",
    "options": [
      "Weil die Sonnenstrahlen steiler auf die Erde treffen und die Tage länger sind",
      "Weil die Sonne im Sommer viel näher an der Erde ist",
      "Weil der Wind im Sommer immer von Süden weht",
      "Weil die Erde im Sommer langsamer dreht"
    ],
    "correct": 0,
    "hint": "Die Neigung der Erdachse sorgt für steilere Sonnenstrahlen."
  },
  {
    "question": "Was bedeutet das Wort 'Schaltjahr'?",
    "options": [
      "Ein Jahr mit 366 Tagen, in dem der Februar 29 Tage hat",
      "Ein Jahr ohne Winter",
      "Ein Jahr mit nur 10 Monaten",
      "Ein Jahr, in dem die Uhren nicht umgestellt werden"
    ],
    "correct": 0,
    "hint": "Alle 4 Jahre hat der Februar einen Zusatztag."
  },
  {
    "question": "An welchem Tag feiern wir in Österreich den Neujahrstag?",
    "options": [
      "Am 1. Jänner",
      "Am 31. Dezember",
      "Am 24. Dezember",
      "Am 6. Jänner"
    ],
    "correct": 0,
    "hint": "Der allererste Tag des neuen Jahres."
  },
  {
    "question": "Welches Fest feiern wir am letzten Tag des Jahres, dem 31. Dezember?",
    "options": [
      "Silvester",
      "Neujahr",
      "Heiliger Abend",
      "Nikolo"
    ],
    "correct": 0,
    "hint": "In der Nacht auf den 1. Jänner verabschieden wir das alte Jahr."
  },
  {
    "question": "Welcher Feiertag wird am 6. Jänner in ganz Österreich gefeiert?",
    "options": [
      "Heilige Drei Könige",
      "Nationalfeiertag",
      "Allerheiligen",
      "Ostermontag"
    ],
    "correct": 0,
    "hint": "Die Sternsinger ziehen von Haus zu Haus und schreiben Segenswünsche an die Türen."
  },
  {
    "question": "Wann feiert Österreich seinen Nationalfeiertag?",
    "options": [
      "Am 26. Oktober",
      "Am 1. Mai",
      "Am 15. August",
      "Am 1. Jänner"
    ],
    "correct": 0,
    "hint": "Ein wichtiger Feiertag mit vielen rot-weiß-roten Flaggen im Herbst."
  },
  {
    "question": "Welcher Feiertag wird am 1. Mai gefeiert?",
    "options": [
      "Staatsfeiertag (Tag der Arbeit)",
      "Nationalfeiertag",
      "Ostern",
      "Pfingsten"
    ],
    "correct": 0,
    "hint": "In vielen österreichischen Gemeinden wird dazu ein Maibaum aufgestellt."
  },
  {
    "question": "Welches Fest feiern wir im Frühling mit bunten Ostereiern und Nestern?",
    "options": [
      "Ostern",
      "Weihnachten",
      "Erntedank",
      "Nikolo"
    ],
    "correct": 0,
    "hint": "Der Osterhase versteckt bunte Eier im Garten."
  },
  {
    "question": "Wann feiern wir in Österreich den Heiligen Abend?",
    "options": [
      "Am 24. Dezember",
      "Am 25. Dezember",
      "Am 31. Dezember",
      "Am 6. Dezember"
    ],
    "correct": 0,
    "hint": "Am Vorabend des Weihnachtsfestes bringt das Christkind die Geschenke."
  },
  {
    "question": "An welchem Tag kommt der Nikolo (Heilige Nikolaus) zu den Kindern?",
    "options": [
      "Am 6. Dezember",
      "Am 24. Dezember",
      "Am 11. November",
      "Am 31. Oktober"
    ],
    "correct": 0,
    "hint": "Er bringt Nüsse, Mandarinen und kleine Geschenke im Sackerl."
  },
  {
    "question": "Welches Fest wird am 11. November mit Laternenumzügen gefeiert?",
    "options": [
      "Martini (Sankt Martin)",
      "Nikolo",
      "Allerheiligen",
      "Erntedank"
    ],
    "correct": 0,
    "hint": "Die Kinder basteln bunte Laternen und singen Laternenlieder."
  },
  {
    "question": "Welcher Feiertag wird am 1. November begangen?",
    "options": [
      "Allerheiligen",
      "Nationalfeiertag",
      "Neujahr",
      "Karfreitag"
    ],
    "correct": 0,
    "hint": "Man besucht die Gräber der Verwandten und zündet Lichter an."
  },
  {
    "question": "Wie viele Tage hat ein ganz normales Kalenderjahr (kein Schaltjahr)?",
    "options": [
      "365 Tage",
      "366 Tage",
      "300 Tage",
      "360 Tage"
    ],
    "correct": 0,
    "hint": "So lange braucht unsere Erde für eine vollständige Reise einmal um die Sonne."
  },
  {
    "question": "Wie viele Tage hat ein Schaltjahr?",
    "options": [
      "366 Tage",
      "365 Tage",
      "360 Tage",
      "370 Tage"
    ],
    "correct": 0,
    "hint": "Genau ein Tag mehr als ein normales Jahr."
  },
  {
    "question": "Wie oft gibt es normalerweise ein Schaltjahr mit dem 29. Februar?",
    "options": [
      "Alle 4 Jahre",
      "Alle 2 Jahre",
      "Jedes Jahr",
      "Alle 10 Jahre"
    ],
    "correct": 0,
    "hint": "Die Jahre 2020, 2024, 2028 sind Schaltjahre."
  },
  {
    "question": "Wie viele Wochen hat ein ganzes Jahr ungefähr?",
    "options": [
      "52 Wochen",
      "40 Wochen",
      "60 Wochen",
      "48 Wochen"
    ],
    "correct": 0,
    "hint": "Teile die 365 Tage eines gewöhnlichen Jahres durch die 7 Tage einer vollen Woche."
  },
  {
    "question": "Wie viele Tage hat ein Monat mindestens?",
    "options": [
      "28 Tage",
      "30 Tage",
      "31 Tage",
      "27 Tage"
    ],
    "correct": 0,
    "hint": "Denke an die Tagesanzahl des kürzesten Monats im Kalender in einem normalen Jahr."
  },
  {
    "question": "Wie viele Tage hat ein Monat höchstens?",
    "options": [
      "31 Tage",
      "30 Tage",
      "32 Tage",
      "29 Tage"
    ],
    "correct": 0,
    "hint": "Denke an die Monate, die auf den höchsten Knöcheln deiner beiden Fäuste liegen."
  },
  {
    "question": "Welche Merkhilfe nutzt man oft, um die 30- und 31-Tage-Monate abzuzählen?",
    "options": [
      "Die Knöchel der Faust",
      "Die Fußzehen",
      "Ein Lineal",
      "Eine Stoppuhr"
    ],
    "correct": 0,
    "hint": "Knöchel = 31 Tage, Vertiefung dazwischen = 30 Tage (bzw. Februar)."
  },
  {
    "question": "Wie nennt man die Zeit von vier Wochen vor Weihnachten?",
    "options": [
      "Adventzeit",
      "Fastenzeit",
      "Osterzeit",
      "Ferienzeit"
    ],
    "correct": 0,
    "hint": "Auf dem Adventkranz werden nacheinander vier Kerzen angezündet."
  },
  {
    "question": "Wie viele Kerzen hat ein traditioneller Adventkranz?",
    "options": [
      "4 Kerzen",
      "3 Kerzen",
      "5 Kerzen",
      "6 Kerzen"
    ],
    "correct": 0,
    "hint": "Für jeden Adventsonntag genau eine Kerze."
  },
  {
    "question": "Welches Fest markiert das Ende der Faschingszeit in Österreich?",
    "options": [
      "Faschingsdienstag",
      "Aschermittwoch",
      "Rosenmontag",
      "Karsamstag"
    ],
    "correct": 0,
    "hint": "Am Tag vor dem Aschermittwoch feiern und verkleiden sich die Kinder mit lustigen Kostümen."
  },
  {
    "question": "Welcher Tag folgt direkt auf den Faschingsdienstag und beginnt die Fastenzeit?",
    "options": [
      "Aschermittwoch",
      "Gründonnerstag",
      "Karfreitag",
      "Ostermontag"
    ],
    "correct": 0,
    "hint": "Mit diesem Mittwoch endet das bunte Faschingstreiben."
  },
  {
    "question": "In welcher Jahreszeit blühen die Sonnenblumen auf den Feldern?",
    "options": [
      "Im Hochsommer und Spätsommer",
      "Im Frühling",
      "Im tiefen Winter",
      "Im Jänner"
    ],
    "correct": 0,
    "hint": "Sonnenblumen lieben heiße Sonnentage im Juli und August."
  },
  {
    "question": "Was zeigt uns ein Thermometer draußen an der Hauswand?",
    "options": [
      "Die Temperatur der Luft (wie warm oder kalt es ist)",
      "Wie viel Uhr es ist",
      "Welcher Wochentag heute ist",
      "Wie stark der Wind weht"
    ],
    "correct": 0,
    "hint": "Es misst die Wärme oder Kälte in Grad Celsius."
  },
  {
    "question": "Welche Niederschlagsform fällt typischerweise nur im kalten Winter?",
    "options": [
      "Schnee",
      "Warmer Sommerregen",
      "Nebel",
      "Tau"
    ],
    "correct": 0,
    "hint": "Wasserdampf gefriert in den Wolken zu wunderschönen Eiskristallen."
  },
  {
    "question": "Was entsteht am frühen Frühlingsmorgen oft als glitzernde Tröpfchen auf den Grashalmen?",
    "options": [
      "Tautropfen (Tau)",
      "Hagel",
      "Schneeflocken",
      "Eiszapfen"
    ],
    "correct": 0,
    "hint": "Wenn die feuchte Luft an den kühlen Pflanzen abkühlt, schlägt sich Tau nieder."
  },
  {
    "question": "Welches bunte Naturwunder kann man am Himmel sehen, wenn es regnet und gleichzeitig die Sonne scheint?",
    "options": [
      "Einen Regenbogen",
      "Ein Polarlicht",
      "Eine Sternschnuppe",
      "Ein Gewitter"
    ],
    "correct": 0,
    "hint": "Die Wassertropfen brechen das weiße Sonnenlicht in alle Spektralfarben."
  },
  {
    "question": "Wie viele Monate im ganzen Kalenderjahr haben genau 31 Tage?",
    "options": [
      "7 Monate",
      "6 Monate",
      "5 Monate",
      "4 Monate"
    ],
    "correct": 0,
    "hint": "Jänner, März, Mai, Juli, August, Oktober und Dezember."
  },
  {
    "question": "Wie viele Monate im ganzen Kalenderjahr haben genau 30 Tage?",
    "options": [
      "4 Monate",
      "5 Monate",
      "6 Monate",
      "7 Monate"
    ],
    "correct": 0,
    "hint": "April, Juni, September und November."
  },
  {
    "question": "Welcher Monat im Kalenderjahr hat als einziger weniger als 30 Tage?",
    "options": [
      "Februar (Feber)",
      "Jänner",
      "April",
      "November"
    ],
    "correct": 0,
    "hint": "Er hat im Normaljahr 28 Tage, im Schaltjahr 29 Tage."
  },
  {
    "question": "In welcher Jahreszeit fahren die Kinder in den österreichischen Bergen gerne Schi oder rodeln?",
    "options": [
      "Im Winter",
      "Im Sommer",
      "Im Frühling",
      "Im September"
    ],
    "correct": 0,
    "hint": "Wenn draußen Schnee liegt und die Pisten weiß sind."
  }
];

  function buildCalendarTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? CALENDAR_POOL.length : 5);
    const chosen = (opts && opts.all) ? CALENDAR_POOL : shuffle(CALENDAR_POOL).slice(0, targetCount);
    return chosen.map(item => {
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);
      return {
        fach: 'sachunterricht',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'SU-1-2-Zeit-Jahreskreis',
        type: 'multiple-choice',
        icon: null,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        solutionText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 2. HEIMISCHE TIERE IM WINTER (3. Klasse – 100 Fragen Pool zu Winterschlaf, Winterruhe, Winterstarre, Vögel)
  const WINTER_POOL = [
  {
    "question": "Wie verbringt der Igel den kalten Winter?",
    "options": [
      "Winterschlaf (Körpertemperatur sinkt drastisch)",
      "Winterruhe (wacht oft auf zum Fressen)",
      "Winterstarre (erstarrt völlig bei Kälte)",
      "Er zieht als Zugvogel in den Süden"
    ],
    "correct": 0,
    "hint": "Der Igel rollt sich in einem Laubhaufen zusammen und schläft bis zum Frühling."
  },
  {
    "question": "Wie verbringt das Murmeltier in den Alpen den Winter?",
    "options": [
      "Winterschlaf (Körpertemperatur sinkt drastisch)",
      "Winterruhe (wacht oft auf zum Fressen)",
      "Standvogel (sucht Futter im Schnee)",
      "Winterstarre (erstarrt im Eis)"
    ],
    "correct": 0,
    "hint": "Murmeltiere schlafen bis zu sechs Monate eng gekuschelt in ihrem unterirdischen Bau."
  },
  {
    "question": "Wie verbringt der Siebenschläfer die kalte Jahreszeit?",
    "options": [
      "Winterschlaf (schläft rund 7 Monate lang)",
      "Winterruhe (frisst täglich Vorräte)",
      "Zugvogel (fliegt nach Afrika)",
      "Winterstarre (im Gewässergrund)"
    ],
    "correct": 0,
    "hint": "Sein Name verrät schon, dass er rund sieben Monate lang tief schläft."
  },
  {
    "question": "Wie überwintern Fledermäuse in Höhlen oder Dachböden?",
    "options": [
      "Winterschlaf (kopfüber hängend in Höhlen)",
      "Winterruhe (fliegen jede Nacht aus)",
      "Zugvogel (alle fliegen nach Süden)",
      "Winterstarre (im Schlamm)"
    ],
    "correct": 0,
    "hint": "Sie hängen kopfüber an der Decke und senken ihre Körpertemperatur stark ab."
  },
  {
    "question": "Wie verbringt die Haselmaus den Winter?",
    "options": [
      "Winterschlaf (eingerollt im kugeligem Nest)",
      "Winterruhe (sucht täglich Beeren)",
      "Winterstarre (erstarrt wie ein Frosch)",
      "Zugvogel (fliegt über die Alpen)"
    ],
    "correct": 0,
    "hint": "Sie schläft monatelang fest in einem kunstvoll geflochtenen Winternest."
  },
  {
    "question": "Was passiert mit der Körpertemperatur eines Igels im Winterschlaf?",
    "options": [
      "Sie sinkt von ca. 35 °C auf unter 5 °C ab",
      "Sie bleibt genau gleich warm wie im Sommer",
      "Sie steigt auf über 40 °C an",
      "Sie sinkt auf minus 20 °C ab"
    ],
    "correct": 0,
    "hint": "Das Tier spart enorm viel Energie, indem es seinen ganzen Körper abkühlt."
  },
  {
    "question": "Was passiert mit dem Herzschlag eines Tieres im tiefen Winterschlaf?",
    "options": [
      "Er verlangsamt sich von vielen Schlägen auf ganz wenige pro Minute",
      "Er schlägt doppelt so schnell wie im Sommer",
      "Das Herz hört für drei Monate komplett auf zu schlagen",
      "Der Herzschlag ändert sich überhaupt nicht"
    ],
    "correct": 0,
    "hint": "Der gesamte Stoffwechsel läuft im extremen Energiesparmodus."
  },
  {
    "question": "Wovon ernähren sich Winterschläfer während ihres monatelangen Schlafs?",
    "options": [
      "Von ihren im Herbst angefressenen Fettpolstern",
      "Sie wachen jede Nacht auf und jagen Mäuse",
      "Von Nüssen, die sie ins Schlafnest gelegt haben",
      "Sie brauchen überhaupt keine Energie"
    ],
    "correct": 0,
    "hint": "Im Spätsommer und Herbst fressen sie sich eine dicke Fettschicht an."
  },
  {
    "question": "Warum darf man einen Igel im Winterschlaf auf keinen Fall unnötig wecken?",
    "options": [
      "Weil das Aufwachen sehr viel lebenswichtige Energie verbraucht",
      "Weil der Igel sonst böse wird und beißt",
      "Weil er sofort im Schnee wegläuft",
      "Weil er dann keine Stacheln mehr hat"
    ],
    "correct": 0,
    "hint": "Das Hochfahren des Körpers kostet fast die gesamten Fettreserven."
  },
  {
    "question": "Wo baut der Igel am liebsten sein Winterquartier?",
    "options": [
      "In einem Haufen aus trockenem Laub, Reisig und Ästen",
      "Auf den Ästen einer hohen Fichte",
      "Im offenen Wasser eines Teiches",
      "Auf einer freien Wiese im Schnee"
    ],
    "correct": 0,
    "hint": "Ein dichter Laubhaufen schützt wunderbar vor Schnee und Frost."
  },
  {
    "question": "Wie verbringt das Eichhörnchen den Winter?",
    "options": [
      "Winterruhe (wacht regelmäßig auf, um Vorräte zu fressen)",
      "Winterschlaf (schläft 6 Monate durch)",
      "Winterstarre (erstarrt im Baumstamm)",
      "Zugvogel (fliegt in den Süden)"
    ],
    "correct": 0,
    "hint": "Es vergräbt im Herbst Nüsse und holt sie im Winter aus seinen Verstecken."
  },
  {
    "question": "Wie verbringt der Dachs den Winter in seinem Bau?",
    "options": [
      "Winterruhe (wacht gelegentlich auf und bleibt im Bau)",
      "Winterschlaf (Körpertemperatur sinkt drastisch)",
      "Winterstarre (ohne Atmung)",
      "Er zieht nach Italien"
    ],
    "correct": 0,
    "hint": "Der Dachs ruht viel, schläft aber nicht den ganzen Winter ununterbrochen durch."
  },
  {
    "question": "Wie verbringt der Braunbär den Winter in seiner Höhle?",
    "options": [
      "Winterruhe (döst in der Höhle und zehrt von Fett)",
      "Winterschlaf (senkt Körperwärme auf 2 Grad)",
      "Winterstarre (bewegungsunfähig wie Eis)",
      "Er wandert den ganzen Tag im Schnee"
    ],
    "correct": 0,
    "hint": "Große Tiere senken ihre Körpertemperatur nur leicht und zehren von einer dicken Fettschicht im Bau."
  },
  {
    "question": "Wie überwintert der Biber an Fluss und See?",
    "options": [
      "Winterruhe (bleibt in der Biberburg und frisst eingelagerte Äste)",
      "Winterschlaf (am Grund des Teiches)",
      "Zugvogel (schwimmt ins Meer)",
      "Winterstarre (im Uferschlamm)"
    ],
    "correct": 0,
    "hint": "Er legt vor seiner Biberburg einen Unterwasservorrat an Ästen an."
  },
  {
    "question": "Wie heißt das kugelige Nest des Eichhörnchens hoch oben im Baum?",
    "options": [
      "Kobel",
      "Horst",
      "Höhle",
      "Bau"
    ],
    "correct": 0,
    "hint": "Das Eichhörnchen baut eine wetterfeste Kugel aus Zweigen und Moos mit zwei Schlupflöchern zum Schutz vor Feinden."
  },
  {
    "question": "Was unterscheidet die Winterruhe vom echten Winterschlaf?",
    "options": [
      "Bei der Winterruhe sinkt die Körpertemperatur kaum und das Tier wacht öfter auf",
      "Winterruhe machen nur Vögel",
      "Bei der Winterruhe frisst das Tier überhaupt nichts",
      "Es gibt keinen Unterschied"
    ],
    "correct": 0,
    "hint": "Eichhörnchen und Bären bleiben fast normal warm."
  },
  {
    "question": "Was versteckt das Eichhörnchen im Herbst als Wintervorrat?",
    "options": [
      "Nüsse, Eicheln, Bucheckern und Tannenzapfen",
      "Frisches Gras und Wiesenblumen",
      "Kleine Fische und Krebse",
      "Schnee und Eisbrocken"
    ],
    "correct": 0,
    "hint": "Haltbare Waldfrüchte, die es im Waldboden vergräbt."
  },
  {
    "question": "Warum findet das Eichhörnchen im Winter nicht alle seine versteckten Nüsse wieder?",
    "options": [
      "Weil es so viele versteckt hat und manche vergisst – daraus wachsen neue Bäume!",
      "Weil andere Eichhörnchen alle Nüsse stehlen",
      "Weil die Nüsse im Schnee schmelzen",
      "Weil es im Winter blind ist"
    ],
    "correct": 0,
    "hint": "So hilft das Eichhörnchen unfreiwillig bei der Verjüngung des Waldes."
  },
  {
    "question": "Wie hält sich der Waschbär im Winter warm?",
    "options": [
      "Winterruhe in Baumhöhlen und Schutz vor eisigem Wind",
      "Winterschlaf im Schlamm",
      "Zug nach Afrika",
      "Er wechselt seine Pfoten"
    ],
    "correct": 0,
    "hint": "Er verschläft die kältesten Wochen in Baumhöhlen."
  },
  {
    "question": "Darf man Eichhörnchen im Winter mit ungesalzenen Nüssen füttern?",
    "options": [
      "Ja, Haselnüsse und Walnüsse helfen ihnen bei hohem Schnee",
      "Nein, Eichhörnchen vertragen überhaupt keine Nüsse",
      "Nein, sie dürfen nur Fleisch fressen",
      "Ja, aber nur mit Schokolade"
    ],
    "correct": 0,
    "hint": "Ein Futterkasten mit Nüssen im Garten hilft bei vereistem Boden."
  },
  {
    "question": "Wie überwintert der Grasfrosch?",
    "options": [
      "Winterstarre (erstarrt bei Kälte im Schlamm oder unter Steinen)",
      "Winterschlaf (kuschelt im Blätterhaufen)",
      "Winterruhe (schwimmt täglich im Eiswasser)",
      "Zugvogel (fliegt nach Spanien)"
    ],
    "correct": 0,
    "hint": "Als wechselwarmes Tier passt sich seine Körperwärme genau der Umgebung an."
  },
  {
    "question": "Wie überwintert die Erdkröte?",
    "options": [
      "Winterstarre (eingegraben in frostsicheren Erdhöhlen)",
      "Winterschlaf (im warmen Fell)",
      "Winterruhe (frisst täglich Würmer)",
      "Zugtier (wandert nach Süden)"
    ],
    "correct": 0,
    "hint": "Sie verkriecht sich tief im Waldboden in frostsichere Spalten."
  },
  {
    "question": "Wie verbringt die Zauneidechse den Winter?",
    "options": [
      "Winterstarre (bewegungsunfähig in Erdspalten)",
      "Winterruhe (sucht im Schnee nach Fliegen)",
      "Winterschlaf (mit dicker Fettschicht)",
      "Sie fliegt weg"
    ],
    "correct": 0,
    "hint": "Reptilien sind wechselwarm und können bei Kälte ihre Muskeln nicht bewegen."
  },
  {
    "question": "Wie überwintert die Ringelnatter in Österreich?",
    "options": [
      "Winterstarre (oft zu mehreren in tiefen Steinritzen)",
      "Winterschlaf (im Eichhörnchenkobel)",
      "Winterruhe (jagt unter dem Eis)",
      "Zugvogel"
    ],
    "correct": 0,
    "hint": "Schlangen suchen frostsichere Höhlen und Schächte auf."
  },
  {
    "question": "Wie überwintert die Blindschleiche?",
    "options": [
      "Winterstarre (in selbst gegrabenen Erdgängen)",
      "Winterschlaf (in Vogelnestern)",
      "Winterruhe (bleibt an der Oberfläche)",
      "Sie schwimmt ins Meer"
    ],
    "correct": 0,
    "hint": "Die beinlose Echse erstarrt tief in der Erde."
  },
  {
    "question": "Wie überwintern Fische im zugefrorenen Teich?",
    "options": [
      "Winterstarre / Kältestarre am Grund des Teiches bei ca. 4 °C",
      "Winterschlaf im Schilf",
      "Sie springen ans Land",
      "Sie schwimmen nach Süden"
    ],
    "correct": 0,
    "hint": "Am Grund des tiefen Teiches hat das Wasser immer konstant 4 °C."
  },
  {
    "question": "Wie überwintern Marienkäfer die kalte Jahreszeit?",
    "options": [
      "Kältestarre in großen Gruppen unter Rinde oder Mauerritzen",
      "Winterschlaf im Laubbett",
      "Sie fliegen nach Afrika",
      "Winterruhe auf Blumen"
    ],
    "correct": 0,
    "hint": "Oft findet man dichte Trauben von Marienkäfern an geschützten Fensterrahmen."
  },
  {
    "question": "Wie verbringt die Weinbergschnecke den Winter?",
    "options": [
      "Kältestarre in ihrem Gehäuse, verschlossen mit einem Kalkdeckel",
      "Sie verlässt ihr Haus und kriecht in Höhlen",
      "Sie fliegt als Zugtier weg",
      "Winterschlaf im Wasser"
    ],
    "correct": 0,
    "hint": "Sie verschließt ihr Schneckenhaus mit einem festen Kalkdeckel."
  },
  {
    "question": "Was bedeutet der Begriff 'wechselwarm' bei Fröschen und Reptilien?",
    "options": [
      "Ihre Körpertemperatur ist immer so warm oder kalt wie die Umgebung",
      "Sie wechseln jede Woche ihr Fell",
      "Sie können ihre Körperwärme selbst auf 37 °C heizen",
      "Sie vertragen nur warmes Wasser"
    ],
    "correct": 0,
    "hint": "Sie haben keine eigene konstante Körpertemperatur wie Säugetiere."
  },
  {
    "question": "Können Tiere in Winterstarre von selbst aufwachen, wenn es bitterkalt ist?",
    "options": [
      "Nein, sie erwachen erst wieder, wenn die Frühlingssonne die Umgebung erwärmt",
      "Ja, sie stehen jeden Nachmittag auf",
      "Ja, wenn sie Hunger haben",
      "Nur wenn Schnee fällt"
    ],
    "correct": 0,
    "hint": "Ihre Muskeln und Nerven funktionieren erst wieder bei steigenden Temperaturen."
  },
  {
    "question": "Welcher dieser Vögel ist ein bekannter Zugvogel in Österreich?",
    "options": [
      "Rauchschwalbe",
      "Kohlmeise",
      "Amsel",
      "Buntspecht"
    ],
    "correct": 0,
    "hint": "Sie baut Lehmnester im Stall und fliegt im Herbst bis nach Afrika."
  },
  {
    "question": "Wohin fliegen Weißstörche im Spätsommer?",
    "options": [
      "Nach Afrika in warme Gebiete (Zugvogel)",
      "Sie bleiben im Neusiedler See im Eis",
      "Sie schlafen in einer Höhle",
      "Sie fliegen zum Nordpol"
    ],
    "correct": 0,
    "hint": "Störche legen tausende Kilometer zurück, um im Süden Nahrung zu finden."
  },
  {
    "question": "Wie verbringt der Kuckuck den Winter?",
    "options": [
      "Zugvogel (fliegt über das Mittelmeer nach Afrika)",
      "Winterschlaf (im fremden Nest)",
      "Winterruhe (im Wald)",
      "Standvogel (bleibt in Tirol)"
    ],
    "correct": 0,
    "hint": "Er verlässt Österreich schon im August Richtung Afrika."
  },
  {
    "question": "Wie überwintert der Mauersegler?",
    "options": [
      "Zugvogel (verbringt den Winter fliegend im südlichen Afrika)",
      "Winterschlaf in Kirchtürmen",
      "Standvogel in Wien",
      "Winterstarre im Dachstuhl"
    ],
    "correct": 0,
    "hint": "Er jagt Fluginsekten und verbringt fast sein ganzes Leben in der Luft."
  },
  {
    "question": "Warum ziehen Zugvögel im Herbst eigentlich in den Süden?",
    "options": [
      "Weil sie bei uns im Winter keine Nahrung (Insekten, Würmer) mehr finden",
      "Weil ihnen das Gefieder zu kalt wird",
      "Weil sie die Sonne lieber mögen",
      "Weil sie im Winter nicht fliegen können"
    ],
    "correct": 0,
    "hint": "Gefieder schützt gut gegen Kälte, aber ohne Futter verhungern sie."
  },
  {
    "question": "Welcher Vogel fliegt als Zugvogel in den Süden?",
    "options": [
      "Die Nachtigall",
      "Der Haussperling (Spatz)",
      "Der Eichelhäher",
      "Die Elster"
    ],
    "correct": 0,
    "hint": "Der berühmte Singvogel überwintert in Afrika."
  },
  {
    "question": "In welcher Formation fliegen Wildgänse und Kraniche oft am Himmel?",
    "options": [
      "In einer V-förmigen Keilformation (V-Formation)",
      "In einer perfekten Kreisform",
      "Jeder Vogel fliegt für sich allein kreuz und quer",
      "In einer senkrechten Linie"
    ],
    "correct": 0,
    "hint": "Die Keilformation spart den nachfolgenden Vögeln viel Kraft durch den Windschatten."
  },
  {
    "question": "Wie finden Zugvögel ihren Weg über tausende Kilometer in den Süden?",
    "options": [
      "Mit Hilfe von Erdmagnetfeld, Sternen, Sonnenstand und Landmarken",
      "Sie fragen andere Tiere nach dem Weg",
      "Sie folgen den Autobahnen",
      "Sie fliegen rein zufällig drauflos"
    ],
    "correct": 0,
    "hint": "Sie besitzen einen erstaunlichen angeborenen Orientierungssinn."
  },
  {
    "question": "Ist die Feldlerche ein Zugvogel oder ein Standvogel?",
    "options": [
      "Zugvogel (zieht in den Mittelmeerraum)",
      "Standvogel (bleibt im Schnee)",
      "Winterschläfer",
      "Winterstarre"
    ],
    "correct": 0,
    "hint": "Sie verlässt die winterlichen Äcker und zieht nach Südeuropa."
  },
  {
    "question": "Welcher Vogel zieht im Herbst als Zugvogel nach Süden?",
    "options": [
      "Der Hausrotschwanz",
      "Die Kohlmeise",
      "Der Kleiber",
      "Der Gimpel"
    ],
    "correct": 0,
    "hint": "Er fängt im Sommer Insekten von Dächern und Zäunen."
  },
  {
    "question": "Welcher dieser Vögel ist ein typischer Standvogel und bleibt im Winter bei uns?",
    "options": [
      "Kohlmeise",
      "Rauchschwalbe",
      "Weißstorch",
      "Kuckuck"
    ],
    "correct": 0,
    "hint": "Sie hat einen gelben Bauch mit schwarzem Mittelstreifen und frisst am Futterhäuschen."
  },
  {
    "question": "Ist die Amsel bei uns im Winter anzutreffen?",
    "options": [
      "Ja, sie ist ein Standvogel und sucht Beeren und Äpfel im Schnee",
      "Nein, alle Amseln fliegen nach Afrika",
      "Nein, sie hält Winterschlaf",
      "Nein, sie fällt in Winterstarre"
    ],
    "correct": 0,
    "hint": "Das Männchen ist schwarz mit gelbem Schnabel und hüpft oft durch den Garten."
  },
  {
    "question": "Wie überwintert der Buntspecht im Wald?",
    "options": [
      "Standvogel (sucht Insektenlarven unter Baumrinden und frisst Samen)",
      "Zugvogel (fliegt ans Rote Meer)",
      "Winterschlaf in seiner Höhle",
      "Winterstarre im Moos"
    ],
    "correct": 0,
    "hint": "Mit seinem kräftigen Schnabel meißelt er Samen aus Tannenzapfen."
  },
  {
    "question": "Wie überwintert der Spatz (Haussperling)?",
    "options": [
      "Standvogel (bleibt in kleinen Schwärmen in der Nähe von Häusern)",
      "Zugvogel (zieht nach Südamerika)",
      "Winterschläfer im Laubhaufen",
      "Winterstarre"
    ],
    "correct": 0,
    "hint": "Spatzen sind gesellige Vögel und freuen sich über Körnerfutter."
  },
  {
    "question": "Welcher kleine Vogel mit orangeroter Brust besucht im Winter gerne Gärten?",
    "options": [
      "Rotkehlchen",
      "Rauchschwalbe",
      "Mauersegler",
      "Kranich"
    ],
    "correct": 0,
    "hint": "Es hüpft oft zutraulich am Boden herum und sucht Futter."
  },
  {
    "question": "Welcher Vogel klettert kopfunter an Baumstämmen hinab und bleibt im Winter bei uns?",
    "options": [
      "Der Kleiber",
      "Der Storch",
      "Die Schwalbe",
      "Die Lerche"
    ],
    "correct": 0,
    "hint": "Er ist der einzige heimische Vogel, der kopfüber abwärts klettern kann."
  },
  {
    "question": "Was versteckt der Eichelhäher im Herbst als Vorrat für den Winter?",
    "options": [
      "Eicheln und Nüsse im Waldboden",
      "Gefrorene Insekten",
      "Schneebälle",
      "Kleine Fische"
    ],
    "correct": 0,
    "hint": "Er vergräbt tausende Eicheln im Wald."
  },
  {
    "question": "Welches Futter eignet sich am besten für Körnerfresser am Futterhäuschen?",
    "options": [
      "Sonnenblumenkerne, Hanfsamen und gehackte Haselnüsse",
      "Salzige Chips und Pommes frites",
      "Gewürztes Brot und Essensreste",
      "Schokolade"
    ],
    "correct": 0,
    "hint": "Fettreiche Samen geben den Vögeln im Winter viel Energie."
  },
  {
    "question": "Warum darf man Vögeln im Winter niemals gesalzenes Brot verfüttern?",
    "options": [
      "Salz und quellendes Brot sind für Vögel giftig und schädlich",
      "Weil sie sonst zu viel trinken",
      "Weil das Brot im Magen gefriert",
      "Weil sie dann nicht mehr singen"
    ],
    "correct": 0,
    "hint": "Vogelmägen vertragen kein Salz und keine Gewürze."
  },
  {
    "question": "Wie schützen sich Standvögel in eisigen Winternächten gegen die Kälte?",
    "options": [
      "Sie plustern ihr Gefieder auf, um ein wärmendes Luftpolster zu bilden",
      "Sie ziehen kleine Strickjacken an",
      "Sie tauchen ins Wasser ein",
      "Sie werfen alle Federn ab"
    ],
    "correct": 0,
    "hint": "Die eingeschlossene Luft zwischen den aufgeplusterten Daunen hält wunderbar warm."
  },
  {
    "question": "Wie verbringt das Reh den Winter im Wald?",
    "options": [
      "Winteraktiv (bekommt ein dickes graubraunes Winterfell und sucht Knospen)",
      "Winterschlaf (im tiefen Erdbau)",
      "Winterstarre (im Fichtenwald)",
      "Zugtier (wandert nach Afrika)"
    ],
    "correct": 0,
    "hint": "Rehe schlafen nicht, sondern ziehen bei Kälte in Gruppen (Sprünge) zusammen."
  },
  {
    "question": "Was ändert sich beim Reh und beim Rothirsch im Winter am Fell?",
    "options": [
      "Sie bekommen ein dickeres, dichteres und graubraunes Winterfell",
      "Sie bekommen ein schneeweißes Fell",
      "Sie verlieren alle Haare",
      "Das Fell wird leuchtend rot"
    ],
    "correct": 0,
    "hint": "Die dichten Wollhaare halten die Körperwärme zurück."
  },
  {
    "question": "Was fressen Rehe und Hirsche im Winter, wenn eine dicke Schneedecke liegt?",
    "options": [
      "Baumknospen, Rinde, Brombeerblätter und Heu an der Fütterung",
      "Kleine Fische aus dem Bach",
      "Sie fressen den ganzen Winter überhaupt nichts",
      "Frische saftige Wiesenblumen"
    ],
    "correct": 0,
    "hint": "Sie scharren mit den Hufen den Schnee weg oder fressen Heu an Futterstellen."
  },
  {
    "question": "Wie verbringt der Rotfuchs den Winter?",
    "options": [
      "Winteraktiv (jagt Mäuse unter der Schneedecke)",
      "Winterschlaf (schläft im Fuchsbau)",
      "Winterruhe (frisst nur Vorräte)",
      "Winterstarre (erstarrt)"
    ],
    "correct": 0,
    "hint": "Der Fuchs ist auch im tiefsten Schnee auf Beutezug."
  },
  {
    "question": "Wie jagt der Fuchs Mäuse, die sich unter dem Schnee verstecken?",
    "options": [
      "Mit dem typischen 'Mäuselsprung' springt er mit allen vier Pfoten auf den Schnee",
      "Er schmilzt den Schnee mit warmem Atem",
      "Er bellt, bis die Maus herauskommt",
      "Er wartet, bis der Schnee taut"
    ],
    "correct": 0,
    "hint": "Er hört das Rascheln der Maus ganz genau und springt im hohen Bogen auf die Stelle."
  },
  {
    "question": "Welches Tier wechselt im Winter sein Fell zu einem schneeweißen Tarnkleid?",
    "options": [
      "Der Schneehase (und das Hermelin)",
      "Das Reh",
      "Das Wildschwein",
      "Der Braunbär"
    ],
    "correct": 0,
    "hint": "Auf weißem Schnee ist ein weißes Fell der perfekte Schutz vor Feinden."
  },
  {
    "question": "Welche Farbe hat das Hermelin (Großes Wiesel) im Winter?",
    "options": [
      "Reinweiß mit einer schwarzen Schwanzspitze",
      "Ganz schwarz",
      "Gestreift wie ein Tiger",
      "Rotbraun"
    ],
    "correct": 0,
    "hint": "Das weiße Winterfell tarnt es im Schnee perfekt."
  },
  {
    "question": "Wie schützt sich das Wildschwein im Winter vor der Kälte?",
    "options": [
      "Mit dicker Unterwolle, Borstenkleid und einer dicken Speckschicht",
      "Es hält tiefen Winterschlaf",
      "Es fliegt nach Süden",
      "Es zieht sich in Höhlen zurück"
    ],
    "correct": 0,
    "hint": "Wildschweine durchwühlen den Waldboden nach Eicheln und Wurzeln."
  },
  {
    "question": "Wie überwintern Gämsen und Steinböcke im Hochgebirge?",
    "options": [
      "Winteraktiv (steigen in sonnige, schneearme Steillagen ab)",
      "Winterschlaf in Höhlen",
      "Sie schwimmen über Gebirgsseen",
      "Sie vergraben sich im Schnee"
    ],
    "correct": 0,
    "hint": "An steilen Südhängen bläst der Wind oft den Schnee weg und legt Gräser frei."
  },
  {
    "question": "Was bedeutet das Wort 'Fährte' oder 'Spur' im frischen Schnee?",
    "options": [
      "Die Fuß- und Pfotenabdrücke, die ein Tier im Schnee hinterlassen hat",
      "Ein verlorener Ast im Wald",
      "Ein Vogelruf am Morgen",
      "Ein Schneemann"
    ],
    "correct": 0,
    "hint": "Im Schnee kann man Tierspuren von Reh, Hase oder Fuchs genau verfolgen."
  },
  {
    "question": "Welcher Vogel färbt sein Gefieder im Winter fast schneeweiß?",
    "options": [
      "Das Alpenschneehuhn",
      "Die Amsel",
      "Der Buntspecht",
      "Der Fasan"
    ],
    "correct": 0,
    "hint": "In den österreichischen Alpen ist es im Winter im Schnee kaum zu erkennen."
  },
  {
    "question": "Was machen Ameisen im Winter in ihrem großen Ameisenhaufen?",
    "options": [
      "Kältestarre tief unten im Erdboden des Ameisenhügels",
      "Sie fliegen als Schwarm in den Süden",
      "Sie laufen fröhlich im Schnee herum",
      "Sie schmelzen den Haufen mit Feuer"
    ],
    "correct": 0,
    "hint": "Im Erdreich unter dem Haufen friert es nicht."
  },
  {
    "question": "Wie überwintert die Honigbiene im Bienenstock?",
    "options": [
      "In einer dichten Wintertraube, in der die Bienen sich durch Muskelzittern gegenseitig wärmen",
      "Jede Biene schläft allein in einer Blume",
      "Sie fliegen nach Afrika",
      "Sie erstarren zu Eis"
    ],
    "correct": 0,
    "hint": "Die Bienen wärmen die Bienenkönigin in der Mitte der Traube auf über 25 °C."
  },
  {
    "question": "Wovon ernähren sich Honigbienen im Winterstock?",
    "options": [
      "Vom eingelagerten Honig und Futtervorrat",
      "Von frischem Blütenstaub im Schnee",
      "Sie fressen überhaupt nichts",
      "Von Tannennadeln"
    ],
    "correct": 0,
    "hint": "Der Imker lässt ihnen genug Honig oder füttert sie mit Zuckerwasser auf."
  },
  {
    "question": "Welches Tier rollt sich bei Gefahr und im Winterschlaf zu einer stacheligen Kugel zusammen?",
    "options": [
      "Der Igel",
      "Der Hase",
      "Das Murmeltier",
      "Der Dachs"
    ],
    "correct": 0,
    "hint": "Ein spezieller Ringmuskel zieht die Stacheln schützend um den ganzen Körper."
  },
  {
    "question": "Wo schlafen Fledermäuse im Winter?",
    "options": [
      "In feuchten, kühlen Höhlen, Stollen oder tiefen Kellern",
      "In offenen Nestern auf Bäumen",
      "Auf Wiesen im Schnee",
      "Im warmen Stall"
    ],
    "correct": 0,
    "hint": "Dort herrschen gleichmäßige Temperaturen ohne Frost."
  },
  {
    "question": "Was fressen Eulen (wie der Waldkauz) im Winter?",
    "options": [
      "Mäuse und kleine Nagetiere, die sie im Schnee jagen",
      "Beeren und Blätter",
      "Fichtennadeln",
      "Schneeflocken"
    ],
    "correct": 0,
    "hint": "Eulen haben ein hervorragendes Gehör und orten Mäuse unter dem Schnee."
  },
  {
    "question": "Warum soll man Wildtiere im Winterwald nicht aufschrecken oder abseits der Wege stören?",
    "options": [
      "Weil die Flucht im tiefen Schnee wertvolle Energie kostet, die sie zum Überleben brauchen",
      "Weil Wildtiere sonst den Förster rufen",
      "Weil sie die Wanderer fressen",
      "Weil sie den Schnee schmutzig machen"
    ],
    "correct": 0,
    "hint": "Jede Panikflucht verbrennt Fettreserven, die im Winter nicht ersetzt werden können."
  },
  {
    "question": "Welches Tier baut im Herbst unterirdische Vorratskammern voll mit Wurzeln und Getreide?",
    "options": [
      "Der Feldhamster",
      "Der Fischotter",
      "Der Schwan",
      "Der Frosch"
    ],
    "correct": 0,
    "hint": "Dieses kleine pannonische Nagetier mit Backentaschen sammelt kiloweise Körner in tiefen Gängen."
  },
  {
    "question": "Wie überstehen Schmetterlinge wie das Tagpfauenauge oder der Zitronenfalter den Winter?",
    "options": [
      "In Kältestarre als erwachsener Falter an geschützten Orten",
      "Sie fliegen alle nach Australien",
      "Sie bauen ein Schneenest",
      "Sie schwimmen im Wasser"
    ],
    "correct": 0,
    "hint": "Der Zitronenfalter hat sogar ein körpereigenes Frostschutzmittel im Blut."
  },
  {
    "question": "Welches Tier hinterlässt im Schnee typische Spuren mit zwei langen Abdrücken vorne und zwei kleinen hinten?",
    "options": [
      "Der Feldhase (die Hinterpfoten setzen beim Hoppeln vor den Vorderpfoten auf)",
      "Das Reh",
      "Die Ente",
      "Die Schlange"
    ],
    "correct": 0,
    "hint": "Beim Hoppeln greifen die langen Hinterläufe weit nach vorne aus."
  },
  {
    "question": "Wie nennt man die paarigen Hufe der Rehe und Hirsche in der Jägersprache?",
    "options": [
      "Schalen (Paarhufer)",
      "Tatzen",
      "Flossen",
      "Krallen"
    ],
    "correct": 0,
    "hint": "So bezeichnen Jäger und Förster die geteilten Hornhufe von Paarhufern im Neuschnee."
  },
  {
    "question": "Welches Tier hinterlässt Trittsiegel mit Ballen und Krallenabdrücken im Schnee ähnlich wie ein Hund?",
    "options": [
      "Der Fuchs",
      "Das Reh",
      "Der Hase",
      "Die Gans"
    ],
    "correct": 0,
    "hint": "Dieses rotbraune Raubtier mit buschiger Lunte hinterlässt Spuren, die fast wie auf einer Perlenschnur aufgereiht sind."
  },
  {
    "question": "Was machen Wasservögel wie die Stockente im Winter?",
    "options": [
      "Sie bleiben auf eisfreien Wasserflächen und suchen Wasserpflanzen",
      "Sie halten Winterschlaf im Wasser",
      "Sie graben sich im Sand ein",
      "Sie steigen auf Berggipfel"
    ],
    "correct": 0,
    "hint": "Durch ständiges Schwimmen halten sie oft ein Wasserloch eisfrei."
  },
  {
    "question": "Warum frieren Enten auf dem Eis nicht an den Füßen fest?",
    "options": [
      "Weil ihr 'Wärmetauscher'-Blutkreislauf die Füße kühl hält und Eis nicht schmilzt",
      "Weil sie dicke Wollsocken tragen",
      "Weil ihre Füße 50 Grad heiß sind",
      "Weil sie auf den Flügeln stehen"
    ],
    "correct": 0,
    "hint": "Das Wundernetz in den Beinen kühlt das Blut ab, bevor es in die Füße fließt."
  },
  {
    "question": "Welcher Vogel hämmert im Winter lautstark an Baumstämmen?",
    "options": [
      "Der Buntspecht",
      "Die Meise",
      "Die Schwalbe",
      "Der Spatz"
    ],
    "correct": 0,
    "hint": "Er sucht Insektenlarven im morschen Holz."
  },
  {
    "question": "Was ist ein Standvogel?",
    "options": [
      "Ein Vogel, der auch im Winter in seiner Heimatregion bleibt",
      "Ein Vogel, der nur auf einem Bein stehen kann",
      "Ein Vogel, der nicht fliegen kann",
      "Ein Vogel, der nach Süden fliegt"
    ],
    "correct": 0,
    "hint": "Er steht und bleibt das ganze Jahr am selben Standort."
  },
  {
    "question": "Was ist ein Zugvogel?",
    "options": [
      "Ein Vogel, der im Herbst in wärmere Regionen zieht",
      "Ein Vogel, der gerne mit der Eisenbahn fährt",
      "Ein Vogel, der schwere Lasten zieht",
      "Ein Vogel, der im Baum schläft"
    ],
    "correct": 0,
    "hint": "Er zieht jedes Jahr viele tausend Kilometer weit."
  },
  {
    "question": "Welches Tier hält Winterstarre?",
    "options": [
      "Die Erdkröte",
      "Das Eichhörnchen",
      "Der Feldhase",
      "Der Fuchs"
    ],
    "correct": 0,
    "hint": "Amphibien sind wechselwarm und fallen bei Kälte in Winterstarre."
  },
  {
    "question": "Welches Tier hält echten Winterschlaf?",
    "options": [
      "Die Haselmaus",
      "Das Reh",
      "Der Biber",
      "Die Meise"
    ],
    "correct": 0,
    "hint": "Sie schläft monatelang tief eingerollt in ihrem Nest."
  },
  {
    "question": "Welches Tier hält Winterruhe?",
    "options": [
      "Der Dachs",
      "Die Zauneidechse",
      "Die Rauchschwalbe",
      "Der Grasfrosch"
    ],
    "correct": 0,
    "hint": "Dieses schwarz-weiß gestreifte Tier schläft viel im tiefen Erdbau, wacht aber an milden Wintertagen auf."
  },
  {
    "question": "Welches Tier ist im Winter aktiv und jagt im Schnee?",
    "options": [
      "Das Wiesel (Hermelin)",
      "Die Ringelnatter",
      "Der Siebenschläfer",
      "Die Weinbergschnecke"
    ],
    "correct": 0,
    "hint": "Im weißen Pelz jagt es flink unter Schneedecken nach Mäusen."
  },
  {
    "question": "Welcher Vogel fliegt im Winter NICHT weg?",
    "options": [
      "Die Kohlmeise",
      "Der Storch",
      "Der Kuckuck",
      "Die Schwalbe"
    ],
    "correct": 0,
    "hint": "Sie bleibt den ganzen Winter bei uns und freut sich über Sonnenblumenkerne."
  },
  {
    "question": "Welcher Vogel fliegt im Herbst nach Afrika?",
    "options": [
      "Der Weißstorch",
      "Der Haussperling",
      "Die Amsel",
      "Der Buntspecht"
    ],
    "correct": 0,
    "hint": "Er baut große Nester auf Schornsteinen und zieht im August ab."
  },
  {
    "question": "Wozu dient das Aufstellen eines Futterhäuschens im Winter?",
    "options": [
      "Um Standvögeln bei geschlossener Schneedecke Nahrung anzubieten und sie zu beobachten",
      "Um Vögel zu fangen",
      "Um den Garten bunt anzumalen",
      "Um Katzen anzulocken"
    ],
    "correct": 0,
    "hint": "Es hilft den Vögeln und ermöglicht Kindern tolle Naturbeobachtungen."
  },
  {
    "question": "Wo sollte ein Futterhäuschen für Vögel am besten stehen?",
    "options": [
      "Übersichtlich und vor Katzen geschützt, mit Fluchtmöglichkeiten in Büsche",
      "Direkt auf dem feuchten Boden",
      "Mitten im tiefen Schnee im Schatten",
      "In einem dunklen Schuppen"
    ],
    "correct": 0,
    "hint": "Vögel müssen anpirschende Feinde rechtzeitig sehen können."
  },
  {
    "question": "Wie verbringt der Marienkäfer den Winter?",
    "options": [
      "In Kältestarre an geschützten Mauerritzen oder unter Rinde",
      "Er fliegt als Zugtier nach Italien",
      "Er hält Winterschlaf im Wasser",
      "Er frisst den ganzen Tag Schnee"
    ],
    "correct": 0,
    "hint": "Er erstarrt in großen Gruppen bis zum warmen Frühling."
  },
  {
    "question": "Wie übersteht der Igel die eisigen Nächte im Laubhaufen?",
    "options": [
      "Laub und Schnee darüber wirken wie eine wärmende Daunendecke",
      "Er macht sich eine Wärmflasche",
      "Er schaltet eine Heizung an",
      "Er schwitzt sehr viel"
    ],
    "correct": 0,
    "hint": "Trockenes Laub und Schnee enthalten viel isolierende Luft."
  },
  {
    "question": "Was bedeutet das Wort 'Überwinterung'?",
    "options": [
      "Die Art und Weise, wie ein Tier die kalte und nahrungsarme Winterzeit übersteht",
      "Ein Schirennen im Jänner",
      "Das Bauen eines Schneemanns",
      "Ein Urlaub am Meer"
    ],
    "correct": 0,
    "hint": "Jede Tierart hat ihre eigene faszinierende Strategie entwickelt."
  },
  {
    "question": "Welches heimische Nagetier schläft von Oktober bis Mai im Hochgebirge?",
    "options": [
      "Das Alpenmurmeltier",
      "Der Maulwurf",
      "Die Ratte",
      "Das Eichhörnchen"
    ],
    "correct": 0,
    "hint": "Ein berühmter Alpenbewohner, der laut pfeift bei Gefahr."
  },
  {
    "question": "Wie übersteht der Maulwurf den eisigen Winter?",
    "options": [
      "Er gräbt seine Gänge tiefer in den frostfreien Boden und jagt dort Regenwürmer",
      "Er hält Winterschlaf auf einem Baum",
      "Er wandert nach Italien",
      "Er erstarrt zu Eis"
    ],
    "correct": 0,
    "hint": "Tief unter der Frostgrenze im Erdreich bleibt es immer frostfrei."
  },
  {
    "question": "Was fressen Kohlmeisen und Blaumeisen im Winter am liebsten am Futterhaus?",
    "options": [
      "Sonnenblumenkerne und Meisenknödel aus Rindertalg und Samen",
      "Gekochte Nudeln und Reis",
      "Frisches Gras",
      "Zuckerwasser"
    ],
    "correct": 0,
    "hint": "Fettfutter gibt den kleinen Singvögeln die nötige Energie gegen die Nachtkälte."
  },
  {
    "question": "In welchem Entwicklungsstadium überwintern viele Schmetterlinge wie der Schwalbenschwanz?",
    "options": [
      "Als feste Puppe, gut getarnt an Stängeln oder Baumrinde",
      "Als Ei im Wasser",
      "Als bunter Falter im Schnee",
      "In Bienenwaben"
    ],
    "correct": 0,
    "hint": "Die Puppe trotzt Wind und Kälte bis zum warmen Frühling."
  },
  {
    "question": "Wie überwintert die Gelbbauchunke in Österreich?",
    "options": [
      "In Winterstarre tief vergraben in frostfreien Erd- und Steinspalten",
      "Im Winterschlaf auf dem Dachboden",
      "Sie fliegt über das Mittelmeer",
      "Sie schwimmt im Eis"
    ],
    "correct": 0,
    "hint": "Amphibien suchen an Land sichere Winterquartiere im Boden auf."
  },
  {
    "question": "Welcher Vogel hat einen gekreuzten Schnabel, um Samen aus Tannenzapfen zu holen?",
    "options": [
      "Der Fichtenkreuzschnabel",
      "Die Amsel",
      "Der Uhu",
      "Die Schwalbe"
    ],
    "correct": 0,
    "hint": "Sein spezialisierter Schnabel hebelt die Schuppen der Fichtenzapfen auf."
  },
  {
    "question": "Warum ist eine dicke Schneedecke für Mäuse am Waldboden oft ein Lebensretter?",
    "options": [
      "Weil der Schnee wie eine warme Isolierschicht wirkt und vor Feinden schützt",
      "Weil Mäuse Schnee fressen",
      "Weil sie im Schnee schneller laufen",
      "Weil sie den Schnee lieben"
    ],
    "correct": 0,
    "hint": "Unter dem Schnee herrschen oft milde Temperaturen um 0 °C, während es oben minus 15 °C hat."
  },
  {
    "question": "Welche Gefahr droht Igeln im Herbst vor dem Winterschlaf durch Menschen?",
    "options": [
      "Laubsauger und das plötzliche Verbrennen von Laubhaufen ohne Nachsehen",
      "Dass man ihnen zu viele Äpfel gibt",
      "Dass man sie fotografiert",
      "Dass sie zu laut schnarchen"
    ],
    "correct": 0,
    "hint": "Laubhaufen im Garten sollten immer vorsichtig kontrolliert werden."
  },
  {
    "question": "Welcher große Waldvogel balzt im Vorfrühling und bleibt im Winter bei uns?",
    "options": [
      "Das Auerhuhn",
      "Die Schwalbe",
      "Der Kuckuck",
      "Der Nachtreiher"
    ],
    "correct": 0,
    "hint": "Ein scheuer, großer Waldvogel der Bergwälder, der Nadeln frisst."
  },
  {
    "question": "Wie nennt man Vögel wie Rabenkrähen und Dohlen, die sich im Winter zu großen Schwärmen zusammentun?",
    "options": [
      "Schwarmvögel / Standvögel auf gemeinsamer Nahrungssuche",
      "Zugvögel",
      "Winterschläfer",
      "Nachtwanderer"
    ],
    "correct": 0,
    "hint": "Gemeinsam finden sie Nahrung auf Feldern und warnen sich vor Feinden."
  },
  {
    "question": "Wie schützt sich der Schneehase in den Alpen vor Fressfeinden wie Steinadler und Luchs?",
    "options": [
      "Sein Fell färbt sich im Winter schneeweiß als perfekte Tarnung",
      "Er gräbt sich zehn Meter tief in Felsen ein",
      "Er klettert geschickt auf Fichten",
      "Er schwimmt durch Gebirgsbäche"
    ],
    "correct": 0,
    "hint": "Im weißen Schnee ist der weiße Hase von oben kaum zu entdecken."
  }
];

  function buildWinterTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? WINTER_POOL.length : 5);
    const chosen = (opts && opts.all) ? WINTER_POOL : shuffle(WINTER_POOL).slice(0, targetCount);
    return chosen.map(item => {
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);
      return {
        fach: 'sachunterricht',
        schulstufe: 3,
        grade: 3,
        lehrplanRef: 'SU-3-Natur-Tiere-Winter',
        type: 'multiple-choice',
        icon: null,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        solutionText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 3. ÖSTERREICH & HAUPTSTÄDTE (4. Klasse – 100 Fragen Pool: 9 Bundesländer, Flüsse, Berge, Nachbarn, Kultur)
  const AUSTRIA_POOL = [
  {
    "question": "Wie heißt die Landeshauptstadt des Bundeslandes Wien?",
    "options": [
      "Wien (Bundes- und Landeshauptstadt zugleich)",
      "St. Pölten",
      "Eisenstadt",
      "Linz"
    ],
    "correct": 0,
    "hint": "Diese Stadt ist gleichzeitig die größte Stadt des Landes und Bundeshauptstadt."
  },
  {
    "question": "Wie heißt die Landeshauptstadt von Niederösterreich?",
    "options": [
      "St. Pölten",
      "Krems",
      "Wiener Neustadt",
      "Amstetten"
    ],
    "correct": 0,
    "hint": "Diese Stadt an der Traisen wurde 1986 zur Landeshauptstadt ernannt (zuvor war die Landesregierung in Wien)."
  },
  {
    "question": "Wie heißt die Landeshauptstadt von Oberösterreich?",
    "options": [
      "Linz",
      "Wels",
      "Steyr",
      "Salzburg"
    ],
    "correct": 0,
    "hint": "Die drittgrößte Stadt Österreichs liegt direkt an der Donau."
  },
  {
    "question": "Wie heißt die Landeshauptstadt des Burgenlandes?",
    "options": [
      "Eisenstadt",
      "Rust",
      "Oberwart",
      "Güssing"
    ],
    "correct": 0,
    "hint": "Die kleinste Landeshauptstadt Österreichs mit dem berühmten Schloss Esterházy."
  },
  {
    "question": "Wie heißt die Landeshauptstadt der Steiermark?",
    "options": [
      "Graz",
      "Leoben",
      "Kapfenberg",
      "Klagenfurt"
    ],
    "correct": 0,
    "hint": "Die zweitgrößte Stadt Österreichs mit dem Schlossberg und dem Uhrturm an der Mur."
  },
  {
    "question": "Wie heißt die Landeshauptstadt von Kärnten?",
    "options": [
      "Klagenfurt am Wörthersee",
      "Villach",
      "Wolfsberg",
      "Spittal an der Drau"
    ],
    "correct": 0,
    "hint": "Die Stadt am Ostufer des Wörthersees mit dem Lindwurm-Brunnen als Wahrzeichen."
  },
  {
    "question": "Wie heißt die Landeshauptstadt des Bundeslandes Salzburg?",
    "options": [
      "Salzburg (Stadt Salzburg)",
      "Hallein",
      "Zell am See",
      "Bischofshofen"
    ],
    "correct": 0,
    "hint": "Die weltberühmte Mozartstadt an der Salzach trägt denselben Namen wie das Bundesland selbst."
  },
  {
    "question": "Wie heißt die Landeshauptstadt von Tirol?",
    "options": [
      "Innsbruck",
      "Kufstein",
      "Lienz",
      "Schwaz"
    ],
    "correct": 0,
    "hint": "Die Olympiastadt am Inn mit dem berühmten Goldenen Dachl."
  },
  {
    "question": "Wie heißt die Landeshauptstadt von Vorarlberg?",
    "options": [
      "Bregenz",
      "Dornbirn",
      "Feldkirch",
      "Bludenz"
    ],
    "correct": 0,
    "hint": "Diese Stadt liegt direkt am Ufer des Bodensees und ist für ihre große Seebühne berühmt."
  },
  {
    "question": "In welchem Bundesland liegt die Stadt Graz?",
    "options": [
      "Steiermark",
      "Kärnten",
      "Burgenland",
      "Oberösterreich"
    ],
    "correct": 0,
    "hint": "Graz ist die Landeshauptstadt der 'Grünen Mark'."
  },
  {
    "question": "In welchem Bundesland liegt die Stadt Linz?",
    "options": [
      "Oberösterreich",
      "Niederösterreich",
      "Salzburg",
      "Tirol"
    ],
    "correct": 0,
    "hint": "Diese bedeutende Industriestadt liegt an der Donau im Land ob der Enns."
  },
  {
    "question": "In welchem Bundesland liegt die Stadt Innsbruck?",
    "options": [
      "Tirol",
      "Vorarlberg",
      "Salzburg",
      "Kärnten"
    ],
    "correct": 0,
    "hint": "Umgeben von den imposanten Bergen der Nordkette liegt sie im Inntal."
  },
  {
    "question": "In welchem Bundesland liegt die Stadt Bregenz?",
    "options": [
      "Vorarlberg",
      "Tirol",
      "Salzburg",
      "Kärnten"
    ],
    "correct": 0,
    "hint": "Sie liegt ganz im Westen Österreichs am Bodensee."
  },
  {
    "question": "In welchem Bundesland liegt die Stadt Klagenfurt?",
    "options": [
      "Kärnten",
      "Steiermark",
      "Burgenland",
      "Salzburg"
    ],
    "correct": 0,
    "hint": "Im sonnigen Süden Österreichs am Wörthersee."
  },
  {
    "question": "In welchem Bundesland liegt die Stadt Eisenstadt?",
    "options": [
      "Burgenland",
      "Niederösterreich",
      "Wien",
      "Steiermark"
    ],
    "correct": 0,
    "hint": "Am Fuße des Leithagebirges im östlichsten Bundesland."
  },
  {
    "question": "In welchem Bundesland liegt St. Pölten?",
    "options": [
      "Niederösterreich",
      "Oberösterreich",
      "Burgenland",
      "Wien"
    ],
    "correct": 0,
    "hint": "Im Mostviertel an der Traisen liegt diese Landeshauptstadt."
  },
  {
    "question": "Wie viele Bundesländer hat die Republik Österreich insgesamt?",
    "options": [
      "9 Bundesländer",
      "8 Bundesländer",
      "10 Bundesländer",
      "7 Bundesländer"
    ],
    "correct": 0,
    "hint": "Wien, NÖ, OÖ, Burgenland, Steiermark, Kärnten, Salzburg, Tirol und Vorarlberg."
  },
  {
    "question": "Welches ist das flächenmäßig größte Bundesland Österreichs?",
    "options": [
      "Niederösterreich (ca. 19 180 km²)",
      "Steiermark",
      "Tirol",
      "Oberösterreich"
    ],
    "correct": 0,
    "hint": "Es umschließt die Bundeshauptstadt Wien vollständig."
  },
  {
    "question": "Welches ist das flächenmäßig kleinste Bundesland Österreichs?",
    "options": [
      "Wien (ca. 415 km²)",
      "Vorarlberg",
      "Burgenland",
      "Salzburg"
    ],
    "correct": 0,
    "hint": "Es ist gleichzeitig die größte Stadt des Landes."
  },
  {
    "question": "In welchem Bundesland leben die meisten Einwohnerinnen und Einwohner?",
    "options": [
      "Wien (rund 2 Millionen Menschen)",
      "Niederösterreich",
      "Oberösterreich",
      "Steiermark"
    ],
    "correct": 0,
    "hint": "Fast ein Viertel der österreichischen Bevölkerung lebt in der Bundeshauptstadt."
  },
  {
    "question": "Welches Bundesland liegt ganz im Westen der Republik Österreich?",
    "options": [
      "Vorarlberg",
      "Tirol",
      "Salzburg",
      "Kärnten"
    ],
    "correct": 0,
    "hint": "Das Bundesland 'vor dem Arlberg'."
  },
  {
    "question": "Welches Bundesland liegt am weitesten im Osten Österreichs?",
    "options": [
      "Burgenland",
      "Niederösterreich",
      "Wien",
      "Steiermark"
    ],
    "correct": 0,
    "hint": "Es grenzt an Ungarn, die Slowakei und Slowenien."
  },
  {
    "question": "Welches Bundesland grenzt als einziges an KEINEN Nachbarstaat Österreichs?",
    "options": [
      "Wien (vollständig von Niederösterreich umschlossen)",
      "Kärnten",
      "Salzburg",
      "Vorarlberg"
    ],
    "correct": 0,
    "hint": "Ein Bundesland mitten im Herzen von Niederösterreich."
  },
  {
    "question": "Welches Bundesland wird durch einen Teil Salzburgs in zwei getrennte Teile (Nordtirol und Osttirol) geteilt?",
    "options": [
      "Tirol",
      "Kärnten",
      "Vorarlberg",
      "Steiermark"
    ],
    "correct": 0,
    "hint": "Sein Landeswappen zeigt den roten Adler und die Landeshauptstadt liegt am Fluss Inn."
  },
  {
    "question": "In wie viele 'Viertel' wird Niederösterreich traditionell eingeteilt?",
    "options": [
      "4 Viertel (Wald-, Wein-, Most- und Industrieviertel)",
      "2 Viertel",
      "3 Viertel",
      "5 Viertel"
    ],
    "correct": 0,
    "hint": "Waldviertel, Weinviertel, Mostviertel und Industrieviertel."
  },
  {
    "question": "Welches Bundesland trägt den liebevollen Beinamen 'Das grüne Herz Österreichs'?",
    "options": [
      "Die Steiermark (wegen ihrer vielen Wälder)",
      "Kärnten",
      "Tirol",
      "Oberösterreich"
    ],
    "correct": 0,
    "hint": "Über 60 % der Fläche dieses Bundeslandes sind von dichtem Wald bedeckt."
  },
  {
    "question": "Wie heißt der höchste Berg der Republik Österreich?",
    "options": [
      "Großglockner (3 798 m)",
      "Dachstein",
      "Wildspitze",
      "Schneeberg"
    ],
    "correct": 0,
    "hint": "Er liegt in den Hohen Tauern an der Grenze zwischen Kärnten und Tirol."
  },
  {
    "question": "Welcher zweithöchste Berg Österreichs liegt im Bundesland Tirol?",
    "options": [
      "Wildspitze (3 770 m)",
      "Großvenediger",
      "Piz Buin",
      "Dachstein"
    ],
    "correct": 0,
    "hint": "Der höchste Gipfel der Ötztaler Alpen."
  },
  {
    "question": "Wie heißt der höchste Berg der Bundesländer Oberösterreich und Steiermark?",
    "options": [
      "Dachstein (2 995 m)",
      "Traunstein",
      "Grimming",
      "Schafberg"
    ],
    "correct": 0,
    "hint": "Der vergletscherte König des Salzkammergutes."
  },
  {
    "question": "Welches ist der östlichste Zweitausender der Alpen (im Bundesland Niederösterreich)?",
    "options": [
      "Schneeberg (2 076 m)",
      "Rax",
      "Ötscher",
      "Hochkar"
    ],
    "correct": 0,
    "hint": "Aus seinen Quellen stammt das berühmte Wiener Hochquell-Trinkwasser."
  },
  {
    "question": "Wie heißt das mächtige Gebirge, das den Großglockner beherbergt?",
    "options": [
      "Hohe Tauern (Nationalpark Hohe Tauern)",
      "Kitzbüheler Alpen",
      "Wienerwald",
      "Karawanken"
    ],
    "correct": 0,
    "hint": "Der größte Nationalpark Österreichs und der Alpen."
  },
  {
    "question": "Wie heißt der höchste Berg des Bundeslandes Vorarlberg?",
    "options": [
      "Piz Buin (3 312 m)",
      "Diedamskopf",
      "Pfänder",
      "Arlberg"
    ],
    "correct": 0,
    "hint": "Er liegt im Silvretta-Gebirge an der Schweizer Grenze."
  },
  {
    "question": "Wie heißt der Hausberg von Bregenz mit herrlichem Blick auf den Bodensee?",
    "options": [
      "Pfänder",
      "Schöckl",
      "Gaisberg",
      "Kahlenberg"
    ],
    "correct": 0,
    "hint": "Eine Seilbahn führt von Bregenz hinauf auf 1 064 m Höhe."
  },
  {
    "question": "Wie heißt der markante Gebirgszug, der das Inntal nördlich von Innsbruck begrenzt?",
    "options": [
      "Die Nordkette (Karwendel)",
      "Die Zillertaler Alpen",
      "Die Hohen Tauern",
      "Die Karnischen Alpen"
    ],
    "correct": 0,
    "hint": "Steile Felswände direkt über den Dächern der Stadt Innsbruck."
  },
  {
    "question": "Welcher Bergzug bildet die natürliche Grenze zwischen Kärnten und Slowenien?",
    "options": [
      "Die Karawanken",
      "Die Hohen Tauern",
      "Der Böhmerwald",
      "Die Koralpe"
    ],
    "correct": 0,
    "hint": "Dieser südalpine Gebirgszug wird von einem bekannten Straßentunnel in unser Nachbarland Slowenien durchquert."
  },
  {
    "question": "Welcher waldreiche Gebirgszug liegt im Dreiländereck von Oberösterreich, Bayern und Tschechien?",
    "options": [
      "Der Böhmerwald",
      "Der Wienerwald",
      "Das Leithagebirge",
      "Die Gutensteiner Alpen"
    ],
    "correct": 0,
    "hint": "Ein waldreiches Mittelgebirge im Norden des Mühlviertels."
  },
  {
    "question": "Wie viel Prozent der Fläche Österreichs werden ungefähr von den Alpen eingenommen?",
    "options": [
      "Rund zwei Drittel (ca. 60–65 %)",
      "Nur 10 %",
      "Genau 100 %",
      "Ein Viertel (25 %)"
    ],
    "correct": 0,
    "hint": "Österreich ist ein klassisches Gebirgsland (Alpenrepublik)."
  },
  {
    "question": "Welcher ist der längste und wasserreichste Fluss, der durch Österreich fließt?",
    "options": [
      "Die Donau (fließt über 350 km durch Österreich)",
      "Der Rhein",
      "Der Inn",
      "Die Mur"
    ],
    "correct": 0,
    "hint": "Der zweitlängste Strom Europas fließt von Passau über Linz und Wien nach Osten."
  },
  {
    "question": "An welchem großen Fluss liegt die Bundeshauptstadt Wien?",
    "options": [
      "An der Donau",
      "Am Rhein",
      "An der Salzach",
      "An der Drau"
    ],
    "correct": 0,
    "hint": "Mit Donaukanal, Neuer Donau und Donauinsel."
  },
  {
    "question": "Durch welche Landeshauptstadt fließt der Fluss Inn?",
    "options": [
      "Innsbruck",
      "Salzburg",
      "Linz",
      "Graz"
    ],
    "correct": 0,
    "hint": "Die 'Brücke über den Inn' gab der Stadt ihren Namen."
  },
  {
    "question": "Durch welche Landeshauptstadt fließt der Fluss Salzach?",
    "options": [
      "Salzburg",
      "Innsbruck",
      "Klagenfurt",
      "Bregenz"
    ],
    "correct": 0,
    "hint": "Früher wurde auf diesem Fluss das 'Weiße Gold' (Salz) transportiert."
  },
  {
    "question": "Durch welche Landeshauptstadt fließt der Fluss Mur?",
    "options": [
      "Graz",
      "Klagenfurt",
      "Eisenstadt",
      "Linz"
    ],
    "correct": 0,
    "hint": "Die Murinsel und der Schlossberg sind Attraktionen am Fluss."
  },
  {
    "question": "Welcher Hauptfluss durchfließt das Bundesland Kärnten von West nach Ost?",
    "options": [
      "Die Drau",
      "Die Mur",
      "Die Enns",
      "Die Traun"
    ],
    "correct": 0,
    "hint": "Dieser Fluss entspringt in Südtirol, fließt durch die Städte Spittal und Villach und mündet später in die Donau."
  },
  {
    "question": "Welcher Fluss bildet die westliche Grenze von Vorarlberg zur Schweiz?",
    "options": [
      "Der Rhein (Alpenrhein)",
      "Die Donau",
      "Der Inn",
      "Die Iller"
    ],
    "correct": 0,
    "hint": "Er mündet bei Bregenz in den Bodensee."
  },
  {
    "question": "In welches Meer mündet die Donau schließlich nach fast 2 850 km?",
    "options": [
      "In das Schwarze Meer (Donaudelta)",
      "In die Nordsee",
      "In die Ostsee",
      "In das Mittelmeer"
    ],
    "correct": 0,
    "hint": "Das riesige Donaudelta liegt in Rumänien und der Ukraine am Schwarzen Meer."
  },
  {
    "question": "Welcher Fluss mündet bei Passau von Süden her in die Donau?",
    "options": [
      "Der Inn",
      "Die Mur",
      "Die Drau",
      "Die Salzach"
    ],
    "correct": 0,
    "hint": "Dieser mächtige Alpenfluss fließt durch das Engadin, Tirol und Bayern und mündet bei der Dreiflüssestadt Passau in die Donau."
  },
  {
    "question": "Welcher Fluss bildet über viele Kilometer die Staatsgrenze zwischen Niederösterreich und der Slowakei?",
    "options": [
      "Die March",
      "Die Donau",
      "Die Enns",
      "Die Thaya"
    ],
    "correct": 0,
    "hint": "Dieser Grenzfluss fließt durch weite, geschützte Auenlandschaften und mündet unterhalb der Thebener Burg in die Donau."
  },
  {
    "question": "Welcher große See liegt im Bundesland Burgenland und ist ein flacher Steppensee?",
    "options": [
      "Der Neusiedler See",
      "Der Wörthersee",
      "Der Bodensee",
      "Der Wolfgangsee"
    ],
    "correct": 0,
    "hint": "Er ist von einem breiten Schilfgürtel umgeben und im Schnitt nur ca. 1,5 Meter tief."
  },
  {
    "question": "Welcher große See liegt ganz im Westen in Vorarlberg und grenzt an drei Staaten?",
    "options": [
      "Der Bodensee (Dreiländereck Österreich, Deutschland, Schweiz)",
      "Der Neusiedler See",
      "Der Genfer See",
      "Der Chiemsee"
    ],
    "correct": 0,
    "hint": "Bregenz liegt am Ostufer dieses großen Sees."
  },
  {
    "question": "Welcher bekannte Badesee liegt im Bundesland Kärnten direkt bei Klagenfurt?",
    "options": [
      "Der Wörthersee",
      "Der Attersee",
      "Der Bodensee",
      "Der Traunsee"
    ],
    "correct": 0,
    "hint": "Ein sonniger, warmer Badesee im Klagenfurter Becken."
  },
  {
    "question": "Welcher ist der flächenmäßig größte See, der VOLLSTÄNDIG auf österreichischem Staatsgebiet liegt?",
    "options": [
      "Der Attersee (im oberösterreichischen Salzkammergut)",
      "Der Bodensee",
      "Der Neusiedler See",
      "Der Wörthersee"
    ],
    "correct": 0,
    "hint": "Er liegt im oberösterreichischen Salzkammergut; Gustav Klimt hat seine Ufer und Villen auf vielen Bildern gemalt."
  },
  {
    "question": "An welchem See liegt die Gemeinde Hallstatt mit dem berühmten UNESCO-Welterbe?",
    "options": [
      "Am Hallstätter See (im Salzkammergut)",
      "Am Achensee",
      "Am Wörthersee",
      "Am Zeller See"
    ],
    "correct": 0,
    "hint": "Das weltberühmte Fotomotiv mit den Holzhäusern am Steilufer."
  },
  {
    "question": "In welchem Bundesland liegt der tiefblaue Achensee, der größte See des Landes?",
    "options": [
      "In Tirol",
      "In Vorarlberg",
      "In Salzburg",
      "In Kärnten"
    ],
    "correct": 0,
    "hint": "Ein Fjord-artiger Gebirgssee zwischen Karwendel und Rofan."
  },
  {
    "question": "Welcher See liegt im Bundesland Salzburg bei Zell am See mit Blick auf die Gletscher?",
    "options": [
      "Der Zeller See",
      "Der Traunsee",
      "Der Fuschlsee",
      "Der Ossiacher See"
    ],
    "correct": 0,
    "hint": "Umgeben von Kitzsteinhorn und Schmittenhöhe."
  },
  {
    "question": "In welchem Bundesland liegen die warmen Badeseen Klopeiner See, Faaker See und Ossiacher See?",
    "options": [
      "In Kärnten",
      "In Tirol",
      "Im Burgenland",
      "In Vorarlberg"
    ],
    "correct": 0,
    "hint": "Das südlichste Bundesland ist berühmt für seine vielen warmen Seen."
  },
  {
    "question": "Wie viele Nachbarstaaten grenzen direkt an die Republik Österreich?",
    "options": [
      "8 Nachbarstaaten",
      "6 Nachbarstaaten",
      "9 Nachbarstaaten",
      "7 Nachbarstaaten"
    ],
    "correct": 0,
    "hint": "Deutschland, Tschechien, Slowakei, Ungarn, Slowenien, Italien, Schweiz, Liechtenstein."
  },
  {
    "question": "Welcher Nachbarstaat liegt nördlich von Österreich?",
    "options": [
      "Tschechien (und Deutschland)",
      "Italien",
      "Slowenien",
      "Ungarn"
    ],
    "correct": 0,
    "hint": "Die Hauptstadt dieses nördlichen Nachbarn ist Prag."
  },
  {
    "question": "Welcher Nachbarstaat liegt südlich von Österreich?",
    "options": [
      "Italien (und Slowenien)",
      "Deutschland",
      "Tschechien",
      "Polen"
    ],
    "correct": 0,
    "hint": "Über den Brennerpass fährt man direkt in dieses Land."
  },
  {
    "question": "Welcher Nachbarstaat grenzt im Osten an das Burgenland?",
    "options": [
      "Ungarn",
      "Frankreich",
      "Kroatien",
      "Deutschland"
    ],
    "correct": 0,
    "hint": "Die Hauptstadt ist Budapest."
  },
  {
    "question": "Welcher Nachbarstaat liegt direkt östlich von Wien und Niederösterreich?",
    "options": [
      "Die Slowakei",
      "Deutschland",
      "Italien",
      "Schweiz"
    ],
    "correct": 0,
    "hint": "Die Hauptstadt Bratislava liegt nur rund 60 km von Wien entfernt."
  },
  {
    "question": "Welches Nachbarland grenzt im Süden an Kärnten und die Steiermark?",
    "options": [
      "Slowenien",
      "Tschechien",
      "Deutschland",
      "Slowakei"
    ],
    "correct": 0,
    "hint": "Die Hauptstadt dieses südlichen Nachbarlandes heißt Ljubljana."
  },
  {
    "question": "Welche beiden Nachbarstaaten grenzen ganz im Westen an Vorarlberg?",
    "options": [
      "Die Schweiz und das Fürstentum Liechtenstein",
      "Italien und Frankreich",
      "Ungarn und Slowenien",
      "Deutschland und Polen"
    ],
    "correct": 0,
    "hint": "Zwei Länder westlich des Rheins."
  },
  {
    "question": "Mit welchem Nachbarstaat hat Österreich die längste gemeinsame Staatsgrenze?",
    "options": [
      "Mit Deutschland (über 800 km Grenzlänge)",
      "Mit Liechtenstein",
      "Mit der Slowakei",
      "Mit Slowenien"
    ],
    "correct": 0,
    "hint": "Die gemeinsame Grenze zieht sich vom Bodensee bis nach Oberösterreich."
  },
  {
    "question": "Welcher der 8 Nachbarstaaten Österreichs ist das kleinste Fürstentum?",
    "options": [
      "Liechtenstein",
      "Luxemburg",
      "Monaco",
      "San Marino"
    ],
    "correct": 0,
    "hint": "Eingebettet zwischen Vorarlberg und der Schweiz mit der Hauptstadt Vaduz."
  },
  {
    "question": "Hat Österreich einen direkten Zugang zum Meer (Küste)?",
    "options": [
      "Nein, Österreich ist ein reiner Binnenstaat ohne Meeresküste",
      "Ja, am Mittelmeer",
      "Ja, an der Nordsee",
      "Ja, am Atlantik"
    ],
    "correct": 0,
    "hint": "Österreich ist ringsum von anderen Ländern umgeben (Binnenstaat)."
  },
  {
    "question": "An welchem Tag feiert Österreich seinen offiziellen Nationalfeiertag?",
    "options": [
      "Am 26. Oktober",
      "Am 1. Mai",
      "Am 1. Jänner",
      "Am 15. August"
    ],
    "correct": 0,
    "hint": "Im Spätherbst, genau einen Tag nach dem Abzug der letzten alliierten Besatzungssoldaten im Jahr 1955."
  },
  {
    "question": "Welche Farben hat die offizielle Nationalflagge der Republik Österreich?",
    "options": [
      "Rot-Weiß-Rot in drei gleich breiten Querstreifen",
      "Schwarz-Rot-Gold",
      "Rot-Weiß mit blauem Dreieck",
      "Weiß-Blau"
    ],
    "correct": 0,
    "hint": "Die rot-weiß-rote Flagge gehört zu den ältesten Staatsflaggen der Welt."
  },
  {
    "question": "Welches Wappentier ziert das Bundeswappen der Republik Österreich?",
    "options": [
      "Ein schwarzer einköpfiger Adler mit Mauerkrone, Hammer und Sichel",
      "Ein goldener Löwe",
      "Ein brauner Bär",
      "Ein weißer Schwan"
    ],
    "correct": 0,
    "hint": "Der Bundesadler trägt den rot-weiß-roten Bindenschild auf der Brust."
  },
  {
    "question": "Was bedeuten die gesprengten Eisenketten an den Fängen des Bundesadlers?",
    "options": [
      "Die Wiedererlangung der Freiheit und Unabhängigkeit nach 1945",
      "Dass der Adler fliegen gelernt hat",
      "Dass Schmiede in Österreich arbeiten",
      "Dass Bergleute im Stollen arbeiten"
    ],
    "correct": 0,
    "hint": "Sie wurden nach dem Ende des Zweiten Weltkriegs 1945 zum Wappen hinzugefügt."
  },
  {
    "question": "Wie beginnt die österreichische Bundeshymne?",
    "options": [
      "'Land der Berge, Land am Strome ...'",
      "'Freude, schöner Götterfunken ...'",
      "'Einigkeit und Recht und Freiheit ...'",
      "'Über den Wolken ...'"
    ],
    "correct": 0,
    "hint": "Der Text stammt von der Dichterin Paula von Preradović."
  },
  {
    "question": "Welches berühmte gotische Wahrzeichen steht im Herzen von Wien am Stephansplatz?",
    "options": [
      "Der Stephansdom ('Steffl')",
      "Der Grazer Uhrturm",
      "Das Goldene Dachl",
      "Die Festung Hohensalzburg"
    ],
    "correct": 0,
    "hint": "Sein Südturm ragt 136 Meter in die Höhe mit dem bunt gedeckten Ziegeldach."
  },
  {
    "question": "Welches prächtige Barockschloss mit Schlosspark und Tiergarten war die Sommerresidenz der Habsburger?",
    "options": [
      "Schloss Schönbrunn in Wien",
      "Schloss Esterházy",
      "Schloss Ambras",
      "Schloss Mirabell"
    ],
    "correct": 0,
    "hint": "Kaiserin Maria Theresia und Kaiser Franz Joseph lebten in Schönbrunn."
  },
  {
    "question": "Welches bekannte Wahrzeichen mit 2 657 vergoldeten Kupferschindeln steht in Innsbruck?",
    "options": [
      "Das Goldene Dachl",
      "Der Uhrturm",
      "Der Stephansdom",
      "Das Riesenrad"
    ],
    "correct": 0,
    "hint": "Kaiser Maximilian I. ließ den Prunkerker um das Jahr 1500 errichten."
  },
  {
    "question": "Welches Wahrzeichen thront auf dem Grazer Schlossberg und hat verkehrte Uhrzeiger?",
    "options": [
      "Der Grazer Uhrturm (großer Zeiger zeigt Stunden, kleiner die Minuten)",
      "Das Riesenrad",
      "Die Festung",
      "Der Lindwurm"
    ],
    "correct": 0,
    "hint": "Aus der Ferne sollte man früher zuerst die wichtigen Stunden gut ablesen können."
  },
  {
    "question": "Welche mächtige Burg thront hoch über den Dächern der Stadt Salzburg?",
    "options": [
      "Die Festung Hohensalzburg",
      "Die Burg Forchtenstein",
      "Die Riegersburg",
      "Die Burg Hochosterwitz"
    ],
    "correct": 0,
    "hint": "Eine der größten mittelalterlichen Burganlagen ganz Europas."
  },
  {
    "question": "In welcher Stadt wurde der weltberühmte Komponist Wolfgang Amadeus Mozart geboren?",
    "options": [
      "In Salzburg (1756)",
      "In Wien",
      "In Linz",
      "In Innsbruck"
    ],
    "correct": 0,
    "hint": "Sein Geburtshaus steht in der Salzburger Getreidegasse."
  },
  {
    "question": "Welches berühmte Fabelwesen steht als steinerner Brunnen auf dem Neuen Platz in Klagenfurt?",
    "options": [
      "Der Lindwurm (ein Drache)",
      "Ein Einhorn",
      "Ein Pegasus",
      "Eine Sphinx"
    ],
    "correct": 0,
    "hint": "Der Sage nach wurde das Ungeheuer im Klagenfurter Moor besiegt."
  },
  {
    "question": "Welches prächtige Barockstift liegt am Donaudurchbruch der Wachau in Niederösterreich?",
    "options": [
      "Stift Melk",
      "Stift Admont",
      "Stift St. Florian",
      "Stift Klosterneuburg"
    ],
    "correct": 0,
    "hint": "Hoch auf einem Felsen am Eingang zur Wachau leuchtet dieses weltberühmte gelbe Benediktinerkloster."
  },
  {
    "question": "Welches Schloss in Eisenstadt war die Wirkungsstätte des Komponisten Joseph Haydn?",
    "options": [
      "Schloss Esterházy",
      "Schloss Schönbrunn",
      "Schloss Belvedere",
      "Schloss Hellbrunn"
    ],
    "correct": 0,
    "hint": "Haydn leitete dort viele Jahre das fürstliche Hoforchester."
  },
  {
    "question": "In welchem Wiener Vergnügungspark dreht sich das historische Riesenrad seit 1897?",
    "options": [
      "Im Wiener Prater",
      "Im Schlosspark Schönbrunn",
      "Im Stadtpark",
      "Auf der Donauinsel"
    ],
    "correct": 0,
    "hint": "Ein weltberühmtes Wahrzeichen im großen Wiener Volksprater."
  },
  {
    "question": "Welcher österreichische Flussabschnitt zwischen Melk und Krems ist berühmt für Weinbau und Marillen?",
    "options": [
      "Die Wachau (UNESCO-Weltkulturerbe)",
      "Das Gesäuse",
      "Das Zillertal",
      "Das Rheintal"
    ],
    "correct": 0,
    "hint": "Malerische Donauterrassen mit Marillengärten und Burgruinen."
  },
  {
    "question": "In welcher Währung wird in ganz Österreich bezahlt?",
    "options": [
      "In Euro und Cent (€)",
      "In Schilling",
      "In Schweizer Franken",
      "In Dollar"
    ],
    "correct": 0,
    "hint": "Seit 2002 ist der Euro das gemeinsame Bargeld in Österreich."
  },
  {
    "question": "Wie viele Bundesländer grenzen an das flächengrößte Bundesland Niederösterreich?",
    "options": [
      "4 Bundesländer (Wien, OÖ, Steiermark, Burgenland)",
      "2 Bundesländer",
      "6 Bundesländer",
      "Alle 9"
    ],
    "correct": 0,
    "hint": "Niederösterreich umschließt Wien und grenzt an drei weitere Länder."
  },
  {
    "question": "Welches Bundesland hat keinen einzigen Meter Grenze zur Steiermark?",
    "options": [
      "Vorarlberg (und Tirol)",
      "Kärnten",
      "Niederösterreich",
      "Burgenland"
    ],
    "correct": 0,
    "hint": "Dieses Bundesland liegt ganz im äußersten Westen Österreichs jenseits des Arlbergs."
  },
  {
    "question": "In welchem Bundesland liegt die berühmte Skisprung-Schanze am Bergisel?",
    "options": [
      "In Tirol (Innsbruck)",
      "In Vorarlberg",
      "In Kärnten",
      "In Wien"
    ],
    "correct": 0,
    "hint": "Hoch über der Stadt Innsbruck bei der Vierschanzentournee."
  },
  {
    "question": "Welches Gebirge bildet die Grenze zwischen Oberösterreich und Tschechien?",
    "options": [
      "Der Böhmerwald",
      "Die Karawanken",
      "Die Hohen Tauern",
      "Die Karnischen Alpen"
    ],
    "correct": 0,
    "hint": "Ein dichtes Waldgebirge im Norden des Mühlviertels."
  },
  {
    "question": "In welchem Bundesland liegt der Nationalpark Neusiedler See - Seewinkel?",
    "options": [
      "Im Burgenland",
      "In Kärnten",
      "In Niederösterreich",
      "In Tirol"
    ],
    "correct": 0,
    "hint": "Ein Vogelparadies an der Grenze zu Ungarn."
  },
  {
    "question": "Welches ist die wichtigste Hafenstadt Österreichs an der Donau mit moderner Industrie und Kultur?",
    "options": [
      "Linz",
      "Bregenz",
      "Klagenfurt",
      "Innsbruck"
    ],
    "correct": 0,
    "hint": "Die Landeshauptstadt Oberösterreichs mit dem Voestalpine-Werk und Brucknerhaus."
  },
  {
    "question": "Welche Staatsform hat Österreich laut Bundes-Verfassungsgesetz?",
    "options": [
      "Eine demokratische Republik (Bundesstaat aus 9 Ländern)",
      "Ein Königreich",
      "Ein Kaiserreich",
      "Ein Großherzogtum"
    ],
    "correct": 0,
    "hint": "Art. 1 B-VG besagt: Das Staatsvolk wählt seine Vertreter frei – das Recht geht vom Volk aus."
  },
  {
    "question": "Wer vertritt die Republik Österreich als Staatsoberhaupt nach außen?",
    "options": [
      "Der Bundespräsident",
      "Der Bürgermeister",
      "Der Landeshauptmann",
      "Der Bundeskanzler"
    ],
    "correct": 0,
    "hint": "Er wird direkt von allen wahlberechtigten Bürgerinnen und Bürgern gewählt."
  },
  {
    "question": "Wie heißt das historische Parlamentsgebäude an der Wiener Ringstraße mit dem Pallas-Athene-Brunnen?",
    "options": [
      "Das österreichische Parlament (Hohes Haus)",
      "Die Hofburg",
      "Das Rathaus",
      "Das Schloss Belvedere"
    ],
    "correct": 0,
    "hint": "Hier beschließen der Nationalrat und der Bundesrat die Gesetze."
  },
  {
    "question": "In welchem Bundesland liegt der Nationalpark Gesäuse mit seinen wilden Kalkfelsschluchten?",
    "options": [
      "In der Steiermark",
      "In Kärnten",
      "In Salzburg",
      "In Tirol"
    ],
    "correct": 0,
    "hint": "Das Gesäuse liegt im Ennstal in der Obersteiermark."
  },
  {
    "question": "Welches Bundesland grenzt im Norden an Deutschland und Tschechien zugleich?",
    "options": [
      "Oberösterreich",
      "Salzburg",
      "Tirol",
      "Vorarlberg"
    ],
    "correct": 0,
    "hint": "Das Mühlviertel reicht bis an die Grenzen Bayerns und Böhmens."
  },
  {
    "question": "In welchem Bundesland befindet sich der steirische Erzberg, an dem seit Jahrhunderten Eisenerz abgebaut wird?",
    "options": [
      "In der Steiermark (Eisenerz)",
      "In Kärnten",
      "In Niederösterreich",
      "Im Burgenland"
    ],
    "correct": 0,
    "hint": "Die pyramidenförmigen Stufen des Erzbergs sind weithin sichtbar."
  },
  {
    "question": "Welches Gewässer trennt die Stadt Linz in das Zentrum und den Stadtteil Urfahr?",
    "options": [
      "Die Donau",
      "Die Traun",
      "Die Enns",
      "Die Steyr"
    ],
    "correct": 0,
    "hint": "Es ist der zweitlängste Fluss Europas, der ganz Österreich von Passau über Wien bis Bratislava durchfließt."
  },
  {
    "question": "Welcher Fluss durchfließt den kleinsten Nationalpark Österreichs, das Thayatal im Norden Niederösterreichs?",
    "options": [
      "Die Thaya",
      "Die Kamp",
      "Die March",
      "Die Ybbs"
    ],
    "correct": 0,
    "hint": "Ein malerisches, tief eingeschnittenes Flusstal an der Grenze zu Tschechien."
  },
  {
    "question": "Wie viele anerkannte Nationalparks gibt es in Österreich zum Schutz der unberührten Natur?",
    "options": [
      "6 Nationalparks (Hohe Tauern, Gesäuse, Kalkalpen, Donau-Auen, Thayatal, Neusiedler See)",
      "2 Nationalparks",
      "12 Nationalparks",
      "50 Nationalparks"
    ],
    "correct": 0,
    "hint": "Vom Hochgebirge bis zum Steppensee und den Donau-Auen."
  },
  {
    "question": "Welche Festung thront stolz auf einem 150 Meter hohen Dolomitfelsen im Bundesland Kärnten?",
    "options": [
      "Die Burg Hochosterwitz (mit 14 Burgtoren)",
      "Die Riegersburg",
      "Die Festung Kufstein",
      "Die Burg Forchtenstein"
    ],
    "correct": 0,
    "hint": "Ein steiler Weg führt durch 14 wehrhafte Tore hinauf zur Burg."
  },
  {
    "question": "Welches Tal in Vorarlberg ist berühmt für traditionelle Holzhäuser und Baukultur?",
    "options": [
      "Der Bregenzerwald",
      "Das Montafon",
      "Das Klostertal",
      "Das Kleinwalsertal"
    ],
    "correct": 0,
    "hint": "Typisch sind die mit Holzschindeln verkleideten Wälderhäuser."
  },
  {
    "question": "Welcher Bergsee in Tirol gilt mit seinem smaragdgrünen Wasser als der größte See des Landes?",
    "options": [
      "Der Achensee",
      "Der Plansee",
      "Der Hechtsee",
      "Der Schwarzsee"
    ],
    "correct": 0,
    "hint": "Ein Fjord-artiger Gebirgssee zwischen Karwendel und Rofangebirge."
  }
];

  function buildAustriaTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? AUSTRIA_POOL.length : 5);
    const chosen = (opts && opts.all) ? AUSTRIA_POOL : shuffle(AUSTRIA_POOL).slice(0, targetCount);
    return chosen.map(item => {
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);
      return {
        fach: 'sachunterricht',
        schulstufe: 4,
        grade: 4,
        lehrplanRef: 'SU-4-Raum-Oesterreich',
        type: 'multiple-choice',
        icon: null,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        solutionText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 4. FREIWILLIGE RADFAHRPRÜFUNG (4. Klasse – 100 Fragen Pool mit echten StVO-SVGs & Praxisregeln)
  const BIKE_POOL = [
  {
    "question": "Wie viele voneinander unabhängig wirkende Bremsen muss ein verkehrssicheres Fahrrad laut Gesetz haben?",
    "options": [
      "Mindestens 2 Bremsen (Vorder- und Hinterradbremse)",
      "Nur 1 Bremse",
      "3 Bremsen",
      "Bremsen sind freiwillig"
    ],
    "correct": 0,
    "hint": "Fällt eine Bremse aus, muss das Rad mit der zweiten Bremse sicher gestoppt werden können."
  },
  {
    "question": "Welche Farbe muss der Scheinwerfer und der Rückstrahler vorne am Fahrrad haben?",
    "options": [
      "Weiß oder hellgelb",
      "Rot",
      "Grün",
      "Blau"
    ],
    "correct": 0,
    "hint": "Vorne weißes Licht zur Ausleuchtung des Weges und für den Gegenverkehr."
  },
  {
    "question": "Welche Farbe müssen das Rücklicht und der Rückstrahler hinten am Fahrrad haben?",
    "options": [
      "Rot",
      "Weiß",
      "Gelb",
      "Grün"
    ],
    "correct": 0,
    "hint": "Diese Signalfarbe warnt von hinten kommende Fahrzeuge rechtzeitig vor einer Bremsung oder einem Hindernis."
  },
  {
    "question": "Welche Farbe müssen die Rückstrahler an den Pedalen des Fahrrads haben?",
    "options": [
      "Gelb (nach vorne und nach hinten wirkend)",
      "Weiß",
      "Rot",
      "Blau"
    ],
    "correct": 0,
    "hint": "Diese warme Warnfarbe strahlt bei der Tretbewegung rhythmisch nach vorne und hinten."
  },
  {
    "question": "Welche Reflektoren müssen laut Gesetz an den Laufrädern (Speichen) angebracht sein?",
    "options": [
      "Gelbe Speichenrückstrahler oder reflektierende weiße Streifen rund um den Reifenmantel",
      "Gar keine",
      "Nur ein Wimpel",
      "Klingelreflektoren"
    ],
    "correct": 0,
    "hint": "Seitliche Sichtbarkeit schützt beim Queren von Kreuzungen."
  },
  {
    "question": "Welche akustische Warneinrichtung ist am Fahrrad gesetzlich vorgeschrieben?",
    "options": [
      "Eine helltönende Glocke (Klingel)",
      "Eine laute Hupe wie beim LKW",
      "Eine Sirene",
      "Ein Radio"
    ],
    "correct": 0,
    "hint": "Jedes Fahrrad muss eine Klingel haben, um andere Verkehrsteilnehmer warnen zu können."
  },
  {
    "question": "Darf das rote Rücklicht am Fahrrad während der Fahrt blinken?",
    "options": [
      "Ja, in Österreich darf das Rücklicht rot blinken oder durchgehend leuchten",
      "Nein, Blinken ist streng verboten",
      "Nur bei Nebel",
      "Nur am Gehsteig"
    ],
    "correct": 0,
    "hint": "Die Fahrradverordnung erlaubt rotes Blinklicht hinten."
  },
  {
    "question": "Darf das weiße Vorderlicht am Fahrrad blinken?",
    "options": [
      "Nein, das weiße Licht vorne muss stetig leuchten, um den Weg zu beleuchten und nicht zu blenden",
      "Ja, wildes Blinken ist erlaubt",
      "Nur am Tag",
      "Nur im Wald"
    ],
    "correct": 0,
    "hint": "Vorne ist ruhiges Dauerlicht vorgeschrieben."
  },
  {
    "question": "Ab wann muss die Beleuchtung am Fahrrad eingeschaltet sein?",
    "options": [
      "Bei Dämmerung, Dunkelheit oder schlechter Sicht (Nebel, starker Regen)",
      "Immer rund um die Uhr",
      "Nur zwischen 24 und 1 Uhr",
      "Nie"
    ],
    "correct": 0,
    "hint": "Sobald das Tageslicht nicht mehr ausreicht, um sicher gesehen zu werden."
  },
  {
    "question": "Wozu dient der Kettenschutz am Fahrrad?",
    "options": [
      "Er verhindert, dass sich weite Hosenbeine oder Schnürsenkel in der Kette verfangen",
      "Er macht das Fahrrad schneller",
      "Er speichert Energie",
      "Er ist nur Dekoration"
    ],
    "correct": 0,
    "hint": "Ein Verfangen in der Kette kann zu plötzlichen, schweren Stürzen führen."
  },
  {
    "question": "Bis zu welchem Alter gilt in Österreich die gesetzliche Radhelmpflicht für Kinder?",
    "options": [
      "Bis zum vollendeten 12. Lebensjahr",
      "Bis zum 8. Lebensjahr",
      "Bis zum 18. Lebensjahr",
      "Es gibt keine Helmpflicht"
    ],
    "correct": 0,
    "hint": "Kinder unter 12 Jahren müssen beim Radfahren, im Kindersitz oder im Anhänger einen Helm tragen."
  },
  {
    "question": "Wie muss ein Fahrradhelm auf dem Kopf sitzen, um optimalen Schutz zu bieten?",
    "options": [
      "Waagrecht auf der Stirn (zwei Fingerbreit über den Augenbrauen), Riemen fest verschlossen",
      "Ganz weit in den Nacken geschoben",
      "Schräg über einem Ohr",
      "Lose baumelnd am Hals"
    ],
    "correct": 0,
    "hint": "Nur wenn der Helm auch die Stirn bedeckt, schützt er bei einem Sturz nach vorne."
  },
  {
    "question": "Darf man einen Fahrradhelm nach einem schweren Sturz weiter verwenden?",
    "options": [
      "Nein, durch den Aufprall können unsichtbare Risse in der Dämpfungsschale entstanden sein",
      "Ja, solange der Lack noch schön ist",
      "Ja, Helme halten ewig",
      "Nur wenn man ihn wäscht"
    ],
    "correct": 0,
    "hint": "Ein gestürzter Helm verliert seine Schutzwirkung und muss ausgetauscht werden."
  },
  {
    "question": "Welchen Test machst du vor jeder Radfahrt zur Sicherheit (der 'Bike-Check')?",
    "options": [
      "Bremsen prüfen, Reifendruck fühlen, Kette und Licht kontrollieren",
      "Nur die Klingel läuten",
      "Nur den Rahmen putzen",
      "Schnell losfahren"
    ],
    "correct": 0,
    "hint": "Funktionieren beide Bremsen und haben die Reifen genug Luft?"
  },
  {
    "question": "Ab welchem Alter darf ein Kind nach bestandener Radfahrprüfung alleine auf der Straße radeln?",
    "options": [
      "Ab 10 Jahren (mit dem Fahrradausweis)",
      "Erst ab 14 Jahren",
      "Schon mit 6 Jahren",
      "Erst ab 18 Jahren"
    ],
    "correct": 0,
    "hint": "Die freiwillige Radfahrprüfung in der 4. Volksschulklasse ermöglicht Kindern mit dem Fahrradausweis das selbstständige Fahren."
  },
  {
    "signId": "vorrang-geben",
    "question": "Welche Vorrangregel gilt an einer Kreuzung mit dem Schild 'Vorrang geben'?",
    "options": [
      "Fahrzeuge auf der kreuzenden Straße dürfen zuerst fahren (Vorrang gewähren)",
      "Man hat selbst Vorrang",
      "Rechtsregel gilt trotzdem",
      "Man darf nie wieder weiterfahren"
    ],
    "correct": 0,
    "hint": "Das Schild nimmt einem den Vorrang gegenüber dem Querverkehr."
  },
  {
    "signId": "stop",
    "question": "Was musst du an einer Stopp-Tafel immer tun, selbst wenn die Straße völlig leer ist?",
    "options": [
      "An der Haltelinie (oder Sichtlinie) komplett anhalten und Vorrang gewähren",
      "Nur ein bisschen langsamer rollen",
      "Ein Handzeichen geben und weiterfahren",
      "Klingeln und beschleunigen"
    ],
    "correct": 0,
    "hint": "Die Räder müssen für mindestens einen Moment vollkommen stillstehen."
  },
  {
    "question": "Welche Vorrangregel gilt an einer Kreuzung OHNE Verkehrszeichen und OHNE Ampel?",
    "options": [
      "Die Rechtsregel: Wer von rechts kommt, hat Vorrang!",
      "Wer schneller fährt, hat Vorrang",
      "Größere Fahrzeuge fahren zuerst",
      "Wer lauter hupt"
    ],
    "correct": 0,
    "hint": "Rechts vor Links gilt immer, wenn keine Schilder oder Ampeln den Vorrang regeln."
  },
  {
    "question": "Du kommst an eine gleichrangige Kreuzung (Rechtsregel). Von links nähert sich ein Auto. Wer darf zuerst fahren?",
    "options": [
      "Du darfst zuerst fahren, weil du für das Auto von rechts kommst",
      "Das Auto, weil Autos immer stärker sind",
      "Niemand",
      "Beide gleichzeitig"
    ],
    "correct": 0,
    "hint": "Aus Sicht des Autos kommst du von seiner rechten Seite."
  },
  {
    "question": "Du kommst an eine gleichrangige Kreuzung (Rechtsregel). Von rechts nähert sich ein Radfahrer. Wer fährt zuerst?",
    "options": [
      "Der Radfahrer von rechts darf zuerst fahren",
      "Du fährst zuerst",
      "Wer zuerst klingelt",
      "Der Jüngere"
    ],
    "correct": 0,
    "hint": "Die Rechtsregel gilt für alle Fahrzeuge gleichermaßen."
  },
  {
    "question": "Du fährst auf einer Straße mit dem Schild 'Hauptstraße' (Vorrangstraße). Wer hat Vorrang?",
    "options": [
      "Du hast Vorrang vor Fahrzeugen, die aus Seitenstraßen einbiegen wollen",
      "Die Seitenstraße hat Vorrang",
      "Die Rechtsregel gilt",
      "Niemand"
    ],
    "correct": 0,
    "hint": "Das gelb-weiße Quadrat zeigt dir an, dass du auf einer Vorrangstraße fährst."
  },
  {
    "question": "Du fährst aus einer Hauseinfahrt oder Wohnstraße auf die Straße aus. Wer hat Vorrang?",
    "options": [
      "Der gesamte Verkehr auf der Straße hat Vorrang vor dir",
      "Du hast Vorrang",
      "Die Rechtsregel gilt",
      "Nur LKWs"
    ],
    "correct": 0,
    "hint": "Wer aus Einfahrten kommt, muss allen anderen Fahrzeugen und Fußgängern Vorrang gewähren."
  },
  {
    "question": "Wer hat Vorrang beim Verlassen eines Radweges auf die Fahrbahn?",
    "options": [
      "Fahrzeuge auf der Fahrbahn haben Vorrang (Radfahrer müssen Vorrang geben)",
      "Der Radfahrer hat automatisch Vorrang",
      "Niemand",
      "Wer schneller ist"
    ],
    "correct": 0,
    "hint": "Beim Einfädeln in den Fließverkehr muss man Vorrang gewähren."
  },
  {
    "question": "Wer hat an einer Radfahrerüberfahrt Vorrang, wenn ein Radler herannaht?",
    "options": [
      "Radfahrer auf der Überfahrt haben Vorrang vor herannahenden Autos",
      "Autos dürfen Radler wegdrängen",
      "Nur Fußgänger",
      "Die Polizei"
    ],
    "correct": 0,
    "hint": "Radfahrerüberfahrten sind für Radler wie Schutzwege für Fußgänger."
  },
  {
    "question": "Mit welcher Geschwindigkeit darf sich ein Radfahrer einer Radfahrerüberfahrt nähern?",
    "options": [
      "Mit maximal 10 km/h (angepasste Geschwindigkeit, um bremsbereit zu sein)",
      "Mit Höchstgeschwindigkeit (40 km/h)",
      "Nur im Rückwärtsgang",
      "Mit 30 km/h"
    ],
    "correct": 0,
    "hint": "Die StVO verlangt höchstens 10 km/h beim Annähern an Radüberfahrten ohne Ampel."
  },
  {
    "question": "Welche Schritte machst du in der richtigen Reihenfolge, wenn du nach links abbiegen willst?",
    "options": [
      "1. Umschauen (Schulterblick) – 2. Handzeichen links – 3. Einordnen zur Mitte – 4. Gegenverkehr beachten – 5. Bogen fahren",
      "Einfach links abbiegen ohne zu schauen",
      "Nur Handzeichen geben und sofort rüberziehen",
      "Erst nach dem Abbiegen schauen"
    ],
    "correct": 0,
    "hint": "Der Schulterblick nach hinten stellt sicher, dass dich kein Auto gerade überholt."
  },
  {
    "question": "Was musst du tun, BEVOR du die Hand zum Abbiegen heraustreckst?",
    "options": [
      "Einen Schulterblick nach hinten über die Schulter machen, um den nachfolgenden Verkehr zu prüfen",
      "Die Augen schließen",
      "Die Klingel läuten",
      "Auf die Pedale schauen"
    ],
    "correct": 0,
    "hint": "Erst nach hinten schauen, dann Handzeichen geben!"
  },
  {
    "question": "Auf welcher Straßenseite ordnest du dich in einer normalen Einbahnstraße zum Linksabbiegen ein?",
    "options": [
      "Ganz links am Fahrbahnrand der Einbahnstraße",
      "In der Mitte",
      "Ganz rechts",
      "Auf dem Gehsteig"
    ],
    "correct": 0,
    "hint": "Da es keinen Gegenverkehr gibt, ordnet man sich in der Einbahn ganz links ein."
  },
  {
    "question": "Auf welcher Straßenseite ordnest du dich auf einer normalen Straße mit Gegenverkehr zum Linksabbiegen ein?",
    "options": [
      "Zur Fahrbahnmitte (an die Leitlinie), ohne den Gegenverkehr zu behindern",
      "Ganz links im Gegenverkehr",
      "Auf dem rechten Gehsteig",
      "Ganz am rechten Rand"
    ],
    "correct": 0,
    "hint": "Zur Mitte hin einordnen, damit rechts nachfolgende Autos vorbeifahren können."
  },
  {
    "question": "Du biegst nach links ab und dir kommt auf der Straße ein Auto entgegen. Wer hat Vorrang?",
    "options": [
      "Der Gegenverkehr hat Vorrang (Gegenverkehrsregel beim Linksabbiegen)",
      "Du hast Vorrang, weil du links bist",
      "Wer zuerst hupt",
      "Niemand"
    ],
    "correct": 0,
    "hint": "Linksabbieger müssen dem Gegenverkehr immer Vorrang gewähren."
  },
  {
    "question": "Was ist das 'indirekte Abbiegen' für Radfahrer an großen Kreuzungen?",
    "options": [
      "Geradeaus über die Kreuzung fahren, am rechten Eck anhalten, Rad drehen und bei Grün die Straße queren",
      "Versteckt durch die Wiese fahren",
      "Rückwärts fahren",
      "Über die Motorhaube springen"
    ],
    "correct": 0,
    "hint": "Indirektes Abbiegen ist an vielspurigen Straßen die sicherste Methode für Radfahrer."
  },
  {
    "question": "Wie gibst du das Handzeichen beim Rechtsabbiegen?",
    "options": [
      "Rechten Arm deutlich und waagrecht nach rechts ausstrecken",
      "Linken Arm nach oben heben",
      "Mit dem Kopf nicken",
      "Mit den Füßen strampeln"
    ],
    "correct": 0,
    "hint": "Deutliches Handzeichen nach rechts zeigt allen Verkehrsteilnehmern deine Absicht."
  },
  {
    "question": "Wann nimmst du die Hand beim Abbiegen wieder an den Lenker zurück?",
    "options": [
      "Kurz vor dem Einlenken in die Kurve, um beide Hände sicher an Lenker und Bremsen zu haben",
      "Man biegt einhändig um die Kurve",
      "Gar nicht",
      "Erst nach 100 Metern"
    ],
    "correct": 0,
    "hint": "In der Kurve selbst brauchst du beide Hände fest am Lenker für Gleichgewicht und Bremsen!"
  },
  {
    "question": "Du biegst nach rechts ab. Neben dir will ein Fußgänger die Seitenstraße überqueren. Wer hat Vorrang?",
    "options": [
      "Der Fußgänger hat Vorrang vor dem abbiegenden Fahrzeug",
      "Der Radfahrer darf den Fußgänger weghupen",
      "Wer schneller ist",
      "Autos haben Vorrang"
    ],
    "correct": 0,
    "hint": "Abbiegende Fahrzeuge müssen Fußgängern, die die Querstraße queren, Vorrang gewähren."
  },
  {
    "question": "Darf man beim Radfahren nebeneinander fahren?",
    "options": [
      "Nur auf Radwegen, in Wohnstraßen, Begegnungszonen und bei Trainingsfahrten – sonst hintereinander!",
      "Ja, immer zu viert nebeneinander auf jeder Bundesstraße",
      "Nein, niemals",
      "Nur wenn man Musik hört"
    ],
    "correct": 0,
    "hint": "Auf normalen Straßen mit Autoverkehr muss hintereinander gefahren werden."
  },
  {
    "signId": "radweg",
    "question": "Muss ein Radfahrer einen vorhandenen, beschilderten Radweg benützen (Benützungspflicht)?",
    "options": [
      "Ja, wenn ein Radweg vorhanden ist, gilt die Radwegbenützungspflicht (außer mit Rennrädern)",
      "Nein, man darf immer auf der Autostraße fahren",
      "Nur im Sommer",
      "Nur wenn man Lust hat"
    ],
    "correct": 0,
    "hint": "Das runde blaue Schild gebietet die Benützung des Radweges."
  },
  {
    "signId": "gehweg",
    "question": "Darf man mit dem Fahrrad auf einem reinen Gehweg (Schild mit Fußgängern) fahren?",
    "options": [
      "Nein, Gehwege sind ausschließlich Fußgängern vorbehalten (Radfahren verboten)",
      "Ja, aber nur sehr schnell",
      "Ja, wenn man klingelt",
      "Immer"
    ],
    "correct": 0,
    "hint": "Auf dem Gehweg ist Radfahren verboten – außer man schiebt das Rad zu Fuß."
  },
  {
    "signId": "geh-radweg",
    "question": "Wie verhältst du dich als Radfahrer auf einem gemeinsamen Geh- und Radweg?",
    "options": [
      "Besonders rücksichtsvoll, langsam fahren, rechtzeitig warnen und Fußgängern immer Vortritt lassen",
      "Fußgänger mit der Klingel verscheuchen",
      "Mit Renntempo durchsausen",
      "Den Weg blockieren"
    ],
    "correct": 0,
    "hint": "Auf gemeinsamen Wegen sind Fußgänger die schwächeren Partner."
  },
  {
    "signId": "einfahrt-verboten",
    "question": "Darf ein Radfahrer in eine Einbahnstraße gegen die Fahrtrichtung einfahren?",
    "options": [
      "Nur wenn eine Zusatztafel 'Ausgenommen Radfahrer' angebracht ist",
      "Ja, Radfahrer dürfen immer überall durch",
      "Nein, niemals",
      "Nur bei Nacht"
    ],
    "correct": 0,
    "hint": "Ohne die offizielle Ausnahmetafel ist das Einfahren gegen die Einbahn verboten und gefährlich."
  },
  {
    "signId": "kreisverkehr",
    "question": "Wer hat im Kreisverkehr in Österreich normalerweise Vorrang?",
    "options": [
      "Die Fahrzeuge, die bereits im Kreisverkehr fahren (angezeigt durch Vorrang-geben vor der Einfahrt)",
      "Die einfahrenden Fahrzeuge von rechts",
      "Wer am lautesten klingelt",
      "Fußgänger"
    ],
    "correct": 0,
    "hint": "Vor der Einfahrt in den Kreisverkehr steht fast immer 'Vorrang geben'."
  },
  {
    "signId": "kreisverkehr",
    "question": "Wann muss man im Kreisverkehr blinken bzw. das Handzeichen geben?",
    "options": [
      "Rechtes Handzeichen beim Ausfahren aus dem Kreisverkehr (nicht bei der Einfahrt!)",
      "Schon vor der Einfahrt links blinken",
      "Die ganze Zeit im Kreis links winken",
      "Niemals"
    ],
    "correct": 0,
    "hint": "Nur das Verlassen des Kreisverkehrs wird mit Handzeichen nach rechts angezeigt."
  },
  {
    "signId": null,
    "question": "Dürfen Radfahrer eine Sackgasse passieren, wenn am Schild ein Durchgangssymbol für Fußgänger/Radler ist?",
    "options": [
      "Ja, wenn eine Durchfahrt für Fußgänger und Radfahrer frei ist (durchgängige Sackgasse)",
      "Nein, verboten",
      "Nur schiebend",
      "Nur rückwärts"
    ],
    "correct": 0,
    "hint": "Moderne Schilder zeigen oft an, ob Radler am Ende durchkommen."
  },
  {
    "signId": null,
    "question": "Wie verhältst du dich mit dem Fahrrad bei einer Baustelle auf der Straße?",
    "options": [
      "Geschwindigkeit verringern, aufmerksam auf Schmutz, Rillen und Baufahrzeuge achten und bremsbereit sein",
      "Augen zu und beschleunigen",
      "Über Schutthaufen springen",
      "Baustellenschilder umwerfen"
    ],
    "correct": 0,
    "hint": "Baustellen bergen Rutsch- und Sturzgefahren."
  },
  {
    "signId": null,
    "question": "Was machst du bei Bodenunebenheiten (Schlaglöcher, Wurzeln) mit dem Fahrrad?",
    "options": [
      "Lenker mit beiden Händen fest im Griff halten, vom Sattel aufstehen und Tempo drosseln",
      "Freihändig fahren",
      "Volle Kanne hineinbrettern",
      "Die Bremse loslassen"
    ],
    "correct": 0,
    "hint": "Im Stehen fangen Knie und Ellbogen die Stöße federnd ab."
  },
  {
    "signId": null,
    "question": "Wie verhältst du dich am Bahnübergang mit dem Fahrrad?",
    "options": [
      "Tempo drosseln, nach beiden Seiten schauen und hören, Schienen rechtwinklig überqueren",
      "Schienen ganz schräg überqueren (Räder können einfädeln)",
      "Mit geschlossenen Schranken Versteck spielen",
      "Auf Schienen radeln"
    ],
    "correct": 0,
    "hint": "Schienen immer möglichst im 90-Grad-Winkel queren, damit der Reifen nicht in die Rille rutscht!"
  },
  {
    "question": "Was versteht man unter dem 'Toten Winkel' bei Lastkraftwagen und Bussen?",
    "options": [
      "Den großen Bereich neben und hinter dem LKW, den der Fahrer trotz aller Spiegel nicht sehen kann",
      "Einen kaputten Reifen",
      "Einen dunklen Wald",
      "Einen Tunnel"
    ],
    "correct": 0,
    "hint": "Wenn du den Fahrer im Spiegel nicht siehst, sieht er dich auch nicht!"
  },
  {
    "question": "Du stehst an der roten Ampel neben einem großen LKW. Wohin stellst du dich am sichersten?",
    "options": [
      "Hinter den LKW mit deutlichem Abstand, niemals rechts direkt neben die Fahrerkabine",
      "Ganz nah an das vordere rechte Rad",
      "Unter den LKW",
      "Zwischen die Räder"
    ],
    "correct": 0,
    "hint": "Beim Rechtsabbiegen schert der LKW aus und kann Radfahrer rechts überrollen."
  },
  {
    "question": "Aus welchen zwei Teilen setzt sich der gesamte Anhalteweg eines Fahrzeugs zusammen?",
    "options": [
      "Reaktionsweg (Schrecksekunde) + Bremsweg = Anhalteweg",
      "Nur Bremsweg",
      "Rollweg und Schiebeweg",
      "Reifenlänge und Kette"
    ],
    "correct": 0,
    "hint": "In der Zeit, die man zum Reagieren braucht, rollt das Rad ungebremst weiter."
  },
  {
    "question": "Was passiert mit deinem Bremsweg auf nassem Kopfsteinpflaster oder nassem Herbstlaub?",
    "options": [
      "Der Bremsweg wird viel länger und die Reifen können wegrutschen",
      "Er wird kürzer",
      "Er bleibt genau gleich",
      "Das Rad bremst von alleine"
    ],
    "correct": 0,
    "hint": "Nasses Laub wirkt wie Schmierseife auf der Straße."
  },
  {
    "question": "Wie bremst du auf nassem oder schottrigem Untergrund am sichersten?",
    "options": [
      "Gefühlvoll mit beiden Bremsen gleichzeitig, ohne das Vorderrad blockieren zu lassen",
      "Nur voll in die Vorderbremse greifen (Sturzgefahr über den Lenker!)",
      "Mit den Füßen am Boden schleifen",
      "Gar nicht bremsen"
    ],
    "correct": 0,
    "hint": "Ein blockierendes Vorderrad führt sofort zum Sturz."
  },
  {
    "question": "Warum darf man beim Radfahren niemals freihändig fahren (ohne Hände am Lenker)?",
    "options": [
      "Weil man bei jedem kleinen Kieselstein die Kontrolle verliert und nicht bremsen kann",
      "Weil es der Polizei nicht gefällt",
      "Weil man kalte Finger bekommt",
      "Weil der Lenker wackelt"
    ],
    "correct": 0,
    "hint": "Mindestens eine Hand muss immer am Lenker sein – beim normalen Fahren beide Hände!"
  },
  {
    "question": "Darf man beim Radfahren mit dem Mobiltelefon ohne Freisprecheinrichtung telefonieren oder Nachrichten tippen?",
    "options": [
      "Nein, Telefonieren ohne Freisprechanlage ist beim Radfahren gesetzlich verboten",
      "Ja, Nachrichten schreiben ist erlaubt",
      "Ja, solange man nicht stürzt",
      "Nur bergauf"
    ],
    "correct": 0,
    "hint": "Handynutzung lenkt ab und führt zu schweren Unfällen."
  },
  {
    "question": "Darf man beim Radfahren laute Musik über Kopfhörer hören?",
    "options": [
      "Nein, das Gehör darf nicht beeinträchtigt werden, um Hupen und Motorengeräusche wahrzunehmen",
      "Ja, mit voller Lautstärke",
      "Ja, immer",
      "Nur im Stadtverkehr"
    ],
    "correct": 0,
    "hint": "Im Straßenverkehr musst du herannahende Fahrzeuge hören können."
  },
  {
    "question": "Wie viel Seitenabstand müssen Autos beim Überholen von Radfahrern im Ortsgebiet mindestens einhalten?",
    "options": [
      "Mindestens 1,5 Meter Sicherheitsabstand",
      "Nur 10 Zentimeter",
      "50 Zentimeter",
      "Überholen ist verboten"
    ],
    "correct": 0,
    "hint": "Seit der StVO-Novelle sind 1,5 Meter im Ortsgebiet gesetzlich vorgeschrieben."
  },
  {
    "question": "Was bedeutet die 'Dooring-Gefahr' bei geparkten Autos?",
    "options": [
      "Dass Insassen plötzlich unachtsam die Autotür öffnen und ein Radler hineinfährt",
      "Dass Autos im Kreis fahren",
      "Dass der Kofferraum aufgeht",
      "Dass Fenster geputzt werden"
    ],
    "correct": 0,
    "hint": "Halte immer mindestens 1 Meter Abstand zu geparkten Autos!"
  },
  {
    "question": "Auf welcher Straßenseite fährt man mit dem Fahrrad in Österreich?",
    "options": [
      "Auf der rechten Seite (Rechtsfahrgebot)",
      "Auf der linken Seite",
      "Genau in der Mitte",
      "Auf welcher man will"
    ],
    "correct": 0,
    "hint": "In Österreich gilt das Rechtsfahrgebot."
  },
  {
    "question": "Darf man mit dem Fahrrad auf dem Gehsteig fahren, wenn man älter als 10 Jahre ist?",
    "options": [
      "Nein, der Gehsteig ist ausschließlich für Fußgänger (Radfahren verboten)",
      "Ja, immer",
      "Ja, wenn die Straße voll ist",
      "Nur bergab"
    ],
    "correct": 0,
    "hint": "Radfahrer müssen die Fahrbahn oder Radverkehrsanlagen benützen."
  },
  {
    "question": "Wie überholst du ein anderes Fahrrad auf dem Radweg?",
    "options": [
      "Links überholen, vorher kurz klingeln und genügend Seitenabstand einhalten",
      "Rechts auf dem Gehsteig überholen",
      "Den Vordermann rammen",
      "Laut schreien"
    ],
    "correct": 0,
    "hint": "Überholt wird im Straßenverkehr grundsätzlich links."
  },
  {
    "question": "Was bedeutet das Verkehrszeichen 'Fahrradstraße'?",
    "options": [
      "Eine Straße vorrangig für Radfahrer, auf der max. 30 km/h gefahren werden darf und Radler nebeneinander fahren dürfen",
      "Eine Rennstrecke für Profis",
      "Eine Straße ohne Häuser",
      "Ein Gehweg"
    ],
    "correct": 0,
    "hint": "Hier haben Radfahrer besondere Rechte und Autos müssen sich anpassen."
  },
  {
    "question": "Was gilt in einer 'Begegnungszone'?",
    "options": [
      "Alle Verkehrsteilnehmer nutzen die Straße gemeinsam, Höchstgeschwindigkeit meist 20 km/h",
      "Autos dürfen 50 km/h fahren",
      "Radfahren verboten",
      "Fußgänger müssen rennen"
    ],
    "correct": 0,
    "hint": "Gegenseitige Rücksichtnahme bei Tempo 20 (oder 30)."
  },
  {
    "question": "Darf ein 10-jähriges Kind mit Fahrradausweis ein anderes Kind auf der Fahrradstange mitnehmen?",
    "options": [
      "Nein, Personentransport auf Stange oder Gepäckträger ist streng verboten",
      "Ja, bis zu drei Freunde",
      "Ja, wenn der andere sich festhält",
      "Nur bergab"
    ],
    "correct": 0,
    "hint": "Das Mitnehmen von Personen auf dem Rad ist gefährlich und verboten."
  },
  {
    "question": "Was musst du tun, wenn dir auf einer schmalen Straße ein Hindernis (z. B. eine Mülltonne) auf deiner Seite im Weg steht?",
    "options": [
      "Gegenverkehr vorlassen, Schulterblick, Handzeichen links, Hindernis umfahren",
      "Einfach ohne zu schauen in den Gegenverkehr lenken",
      "Die Mülltonne umfahren",
      "Stehen bleiben und weinen"
    ],
    "correct": 0,
    "hint": "Wer ein Hindernis auf seiner Seite hat, muss dem Gegenverkehr Vorrang gewähren."
  },
  {
    "question": "Was bedeutet ein rot-weißes Halteverbot-Schild mit der Zusatztafel 'Ausgenommen Fahrräder'?",
    "options": [
      "Autos dürfen hier nicht halten, aber Fahrräder dürfen abgestellt werden",
      "Fahrräder sind verboten",
      "Parkplatz für Lastwagen",
      "Schutzweg"
    ],
    "correct": 0,
    "hint": "Die Zusatztafel nimmt Radfahrer vom Verbot aus."
  },
  {
    "question": "Welche Kleidung ist beim Radfahren für deine Sicherheit am besten?",
    "options": [
      "Helle, gut sichtbare Kleidung mit Reflektoren und enge Hosenbeine",
      "Schwarzer weiter Mantel, der in die Speichen weht",
      "Badelatschen und Sonnenbrille",
      "Dunkle Tarnkleidung"
    ],
    "correct": 0,
    "hint": "Helle Kleidung wird von Autofahrern viel früher erkannt."
  },
  {
    "question": "Was machst du, wenn deine Kette während der Fahrt abspringt?",
    "options": [
      "Sofort ausrollen lassen, behutsam an den rechten Fahrbahnrand fahren und absteigen",
      "Wütend auf die Pedale eintreten",
      "Mitten auf der Kreuzung anhalten",
      "Die Kette wegwerfen"
    ],
    "correct": 0,
    "hint": "Rolle sicher an den Rand, ohne den nachfolgenden Verkehr zu blockieren."
  },
  {
    "question": "Darf man bei einer roten Ampel mit Grünpfeil für Radfahrer rechts abbiegen?",
    "options": [
      "Ja, nach vorherigem Anhalten und sicherem Vergewissern, dass keine Fußgänger oder Autos gefährdet werden",
      "Nein, niemals",
      "Ja, ohne anzuhalten im Renntempo",
      "Nur nachts"
    ],
    "correct": 0,
    "hint": "Das Grünpfeilschild für Radler erlaubt das vorsichtige Rechtsabbiegen nach einem kurzen Stopp."
  },
  {
    "question": "Darf man mit dem Fahrrad Schulkameraden an der Jacke festhalten und sich ziehen lassen?",
    "options": [
      "Niemals! Das führt sofort zum schweren Sturz beider Radfahrer",
      "Ja, das spart Kraft",
      "Ja, wenn die Kette gerissen ist",
      "Nur bergauf"
    ],
    "correct": 0,
    "hint": "Anhängen an andere Fahrzeuge ist lebensgefährlich und streng verboten."
  },
  {
    "question": "Was bedeutet das Schild 'Verbot für Fahrzeuge aller Art' für Radfahrer?",
    "options": [
      "Hier darf auch kein Fahrrad gefahren werden (das Rad darf nur geschoben werden)",
      "Gilt nur für Autos",
      "Gilt nur für Traktoren",
      "Freie Fahrt"
    ],
    "correct": 0,
    "hint": "Fahrräder sind Fahrzeuge und unterliegen allen Fahrzeugverboten."
  },
  {
    "question": "Welchen Sinn hat die Radfahrprüfung in der 4. Schulstufe?",
    "options": [
      "Verkehrsregeln gründlich zu lernen, um sicher und unfallfrei im Straßenverkehr unterwegs zu sein",
      "Nur um ein Kärtchen zu besitzen",
      "Um schneller als Autos zu sein",
      "Um Hausaufgaben zu vermeiden"
    ],
    "correct": 0,
    "hint": "Sicherheit, Wissen und praktisches Können schützen dein Leben."
  },
  {
    "question": "Was machst du, wenn du an eine Kreuzung kommst und dir unsicher bist, wer Vorrang hat?",
    "options": [
      "Geschwindigkeit verringern, bremsbereit sein, Blickkontakt suchen und im Zweifel auf den Vorrang verzichten",
      "Augen zu und Gas geben",
      "Laut schimpfen",
      "Einfach umdrehen"
    ],
    "correct": 0,
    "hint": "Sicherheit und defensive Fahrweise gehen immer vor Vorrang-Erzwingen!"
  },
  {
    "question": "Warum ist das Fahren neben parkenden Autos gefährlich (sogenannte Dooring-Gefahr)?",
    "options": [
      "Eine Autotür könnte plötzlich geöffnet werden, deshalb immer mindestens einen Meter Seitenabstand halten",
      "Autos könnten hupen",
      "Die Reifen könnten platt werden",
      "Es gibt keine Gefahr"
    ],
    "correct": 0,
    "hint": "Halte stets mindestens 1 Meter Sicherheitsabstand zu stehenden Autos."
  },
  {
    "question": "Darfst du deine schwere Schultasche an den Lenker deines Fahrrads hängen?",
    "options": [
      "Nein, das Rad wird dadurch instabil und das Lenken sehr gefährlich (besser auf dem Gepäckträger oder am Rücken)",
      "Ja, das ist sehr praktisch",
      "Nur an die linke Seite",
      "Nur bergab"
    ],
    "correct": 0,
    "hint": "Taschen am Lenker schwingen hin und her und können den Lenker blockieren."
  },
  {
    "question": "Was ist der 'Tote Winkel' bei einem LKW oder Bus?",
    "options": [
      "Der Bereich rund um das Fahrzeug, den der Fahrer trotz Spiegeln nicht einsehen kann",
      "Ein kaputtes Fenster",
      "Der Kofferraum",
      "Die Rückbank"
    ],
    "correct": 0,
    "hint": "Halte niemals direkt rechts neben einem LKW, wenn dieser an einer Kreuzung wartet!"
  },
  {
    "question": "Darfst du mit dem Fahrrad gegen die Fahrtrichtung in eine Einbahnstraße fahren?",
    "options": [
      "Nur dann, wenn das Verkehrszeichen durch eine Zusatztafel 'ausgenommen Radfahrer' ergänzt ist",
      "Ja, immer und überall",
      "Nein, niemals unter gar keinen Umständen",
      "Nur mit Helm"
    ],
    "correct": 0,
    "hint": "Ohne die offizielle Zusatztafel 'ausgenommen Radfahrer' ist das Befahren verboten."
  },
  {
    "question": "Wie verändert sich der Bremsweg des Fahrrads bei nassem Asphalt oder Schotter?",
    "options": [
      "Der Bremsweg wird deutlich länger und die Reifen können wegrutschen",
      "Er verkürzt sich um die Hälfte",
      "Er bleibt exakt gleich",
      "Nässe verbessert das Bremsen"
    ],
    "correct": 0,
    "hint": "Auf nasser Straße rechtzeitig und vorsichtig anbremsen!"
  },
  {
    "question": "Wann dürfen zwei Radfahrer nebeneinander auf der Fahrbahn fahren?",
    "options": [
      "Nur auf Radwegen, in Wohnstraßen, Begegnungszonen oder Fahrradstraßen (auf normaler Straße nur hintereinander)",
      "Immer zu zweit nebeneinander",
      "Nur wenn man sich unterhält",
      "Niemals"
    ],
    "correct": 0,
    "hint": "Auf normalen Straßen muss man immer hintereinander auf der rechten Fahrbahnseite fahren."
  },
  {
    "question": "Was musst du tun, wenn du auf einem Schutzweg (Zebrastreifen) die Straße wie ein Fußgänger überqueren willst?",
    "options": [
      "Vom Fahrrad absteigen und das Fahrrad über den Zebrastreifen schieben",
      "Mit Vollgas drüberfahren",
      "Laut klingelnd fahren",
      "Freihändig fahren"
    ],
    "correct": 0,
    "hint": "Radfahrer haben auf Zebrastreifen keinen Vorrang, außer sie steigen ab und schieben."
  },
  {
    "question": "Darfst du während des Radfahrens Musik über Kopfhörer hören?",
    "options": [
      "Besser nicht, da man wichtige Warngeräusche wie Autohupen oder Martinshörner überhören kann",
      "Ja, mit voller Lautstärke",
      "Nur Rockmusik",
      "Ja, das ist Pflicht"
    ],
    "correct": 0,
    "hint": "Alle Sinne müssen im Straßenverkehr wachsam auf die Umgebung achten."
  },
  {
    "question": "Ist das Tippen von Nachrichten auf dem Smartphone während der Fahrt erlaubt?",
    "options": [
      "Nein, die Benutzung des Mobiltelefons ohne Freisprecheinrichtung ist beim Radfahren verboten",
      "Ja, wenn man einhändig fährt",
      "Nur an roten Ampeln",
      "Ja, überall"
    ],
    "correct": 0,
    "hint": "Ablenkung durch Smartphones ist eine der häufigsten Unfallursachen."
  },
  {
    "question": "Wie verhältst du dich vor einem Eisenbahnkreuzung mit Andreaskreuz, wenn ein rotes Blinklicht leuchtet?",
    "options": [
      "Sofort anhalten und vor der Haltelinie warten, bis das Licht erlischt",
      "Schnell noch vor dem Zug drüberhuschen",
      "Langsam weiterrollen",
      "Klingeln und fahren"
    ],
    "correct": 0,
    "hint": "Rotes Blinklicht bedeutet: Ein Zug naht – sofort anhalten!"
  },
  {
    "question": "Was bedeutet das Verkehrszeichen 'Wohnstraße'?",
    "options": [
      "Fahrzeuge dürfen nur im Schritttempo fahren, Radfahren ist erlaubt und Kinder dürfen auf der Straße spielen",
      "Autos dürfen 50 km/h fahren",
      "Radfahren ist strengstens verboten",
      "Hier gibt es keine Häuser"
    ],
    "correct": 0,
    "hint": "In Wohnstraßen gilt Schrittgeschwindigkeit zum Schutz spielender Kinder."
  },
  {
    "question": "Welche Höchstgeschwindigkeit gilt in einer Begegnungszone in der Regel?",
    "options": [
      "20 km/h (selten 30 km/h)",
      "50 km/h",
      "100 km/h",
      "Schrittgeschwindigkeit von 4 km/h"
    ],
    "correct": 0,
    "hint": "Hier teilen sich Fußgänger, Radfahrer und Autos die Straße mit besonderer Rücksicht bei mäßigem Schritttempo."
  },
  {
    "question": "Was musst du beim Vorbeifahren an einem stehenden Linienbus an einer Haltestelle beachten?",
    "options": [
      "Besonders vorsichtig und bremsbereit fahren, da Fahrgäste plötzlich hinter dem Bus die Straße queren könnten",
      "Beschleunigen und hupen",
      "Den Bus links über die Gegenfahrbahn überholen",
      "Gar nichts"
    ],
    "correct": 0,
    "hint": "Verdeckte Fußgänger könnten unerwartet auf die Fahrbahn treten."
  },
  {
    "question": "Was machst du mit deinem Fahrrad, wenn du in der Dämmerung merkst, dass dein Vorderlicht kaputt ist?",
    "options": [
      "Vom Fahrrad absteigen und es auf dem Gehsteig nach Hause schieben",
      "Einfach schnell im Dunkeln weiterradeln",
      "Die Augen schließen",
      "Mitten auf der Straße fahren"
    ],
    "correct": 0,
    "hint": "Ohne Licht wirst du von Autofahrern übersehen – schiebe das Rad sicher nach Hause."
  },
  {
    "question": "Darfst du freihändig mit dem Fahrrad fahren?",
    "options": [
      "Nein, laut Gesetz muss mindestens eine Hand am Lenker sein (für sicheres Fahren beide Hände)",
      "Ja, wenn man es gut kann",
      "Nur bergauf",
      "Ja, um Beifall zu bekommen"
    ],
    "correct": 0,
    "hint": "Freihändiges Fahren ist verboten und führt bei der kleinsten Bodenunebenheit zum Sturz."
  },
  {
    "question": "Warum müssen die Reifen deines Fahrrads genügend Luftdruck und ein intaktes Profil haben?",
    "options": [
      "Für guten Halt auf der Straße und kürzere Bremswege",
      "Nur damit das Rad hübsch aussieht",
      "Damit es schneller rostet",
      "Weil weiche Reifen besser quietschen"
    ],
    "correct": 0,
    "hint": "Richtiger Reifendruck schützt vor Pannen und gibt sicheren Kurvenhalt."
  },
  {
    "question": "Wo musst du deinen Radfahrausweis aufbewahren, wenn du allein im Verkehr radelst?",
    "options": [
      "Man muss ihn beim Fahren mitführen, um ihn bei einer Polizeikontrolle vorzeigen zu können",
      "Im Tiefkühlfach",
      "Unter der Matratze",
      "An den Lenker geklebt"
    ],
    "correct": 0,
    "hint": "Der Radfahrausweis ist dein Beweis, dass du die Prüfung bestanden hast."
  },
  {
    "question": "Was tust du, wenn an einer Engstelle dir ein anderes Fahrzeug entgegenkommt und das Hindernis auf deiner Seite liegt?",
    "options": [
      "Anhalten und das entgegenkommende Fahrzeug vorbeilassen",
      "Einfach drauf losfahren und Vorrang erzwingen",
      "Auf den Gehsteig ausweichen",
      "Hupen"
    ],
    "correct": 0,
    "hint": "Wer das Hindernis auf seiner Seite hat, muss warten!"
  },
  {
    "question": "Wie sicherst du dein Fahrrad gegen Diebstahl an einem Abstellplatz am besten ab?",
    "options": [
      "Mit einem stabilen Schloss den Fahrradrahmen an einem festen Fahrradbügel anketten",
      "Nur das Vorderrad absperren",
      "Den Helm auf den Sattel legen",
      "Die Klingel läuten"
    ],
    "correct": 0,
    "hint": "Wird nur das Vorderrad abgesperrt, kann der Rest des Fahrrads leicht gestohlen werden."
  },
  {
    "question": "Was bedeutet das Verkehrszeichen 'Rad- und Gehweg mit getrennten Verkehrsflächen'?",
    "options": [
      "Radfahrer und Fußgänger haben jeweils eine eigene, durch eine Linie getrennte Spur",
      "Radfahrer müssen absteigen",
      "Autos dürfen hier parken",
      "Nur für Hunde erlaubt"
    ],
    "correct": 0,
    "hint": "Radler fahren auf der Fahrradspur, Fußgänger gehen auf dem Gehwegbereich."
  },
  {
    "question": "Was bedeutet das blaue runde Schild mit Fahrradsymbol (Reiner Radweg)?",
    "options": [
      "Radfahrer müssen diesen Weg benutzen (Benutzungspflicht), Fußgänger dürfen hier nicht gehen",
      "Hier dürfen nur Mopeds fahren",
      "Radfahren ist verboten",
      "Achtung Baustelle"
    ],
    "correct": 0,
    "hint": "Ein reiner Radweg ist für Radfahrer benutzungspflichtig."
  },
  {
    "question": "Wie führt man eine Vollbremsung sicher aus, ohne über den Lenker zu stürzen?",
    "options": [
      "Beide Bremsen kräftig, aber dosiert betätigen und das Körpergewicht nach hinten über den Sattel verlagern",
      "Nur die Vorderbremse voll anreißen",
      "Nur mit den Schuhen am Boden bremsen",
      "Die Augen schließen"
    ],
    "correct": 0,
    "hint": "Körper nach hinten und beide Bremsen dosiert nutzen sorgt für maximale Bremswirkung."
  },
  {
    "question": "Dürfen Kinder mit dem Radfahrausweis auf der Autobahn oder Schnellstraße fahren?",
    "options": [
      "Nein, Autobahnen und Schnellstraßen sind ausschließlich für Kraftfahrzeuge reserviert",
      "Ja, aber nur auf dem Pannenstreifen",
      "Nur sonntags",
      "Ja, mit Helm"
    ],
    "correct": 0,
    "hint": "Fahrräder sind auf Autobahnen und Schnellstraßen strengstens verboten."
  },
  {
    "question": "Was bedeutet das Verkehrszeichen 'Fahrradstraße'?",
    "options": [
      "Radfahrer dürfen nebeneinander fahren und die Straße gehört vorrangig dem Radverkehr (max. 30 km/h)",
      "Autos dürfen dort 100 km/h fahren",
      "Fußgänger sind verboten",
      "Fahrräder müssen geschoben werden"
    ],
    "correct": 0,
    "hint": "In einer Fahrradstraße dürfen Radfahrer nebeneinander fahren und andere Fahrzeuge dürfen sie nicht behindern."
  },
  {
    "question": "Was musst du tun, wenn die Fahrradkette während der Fahrt abspringt?",
    "options": [
      "Vorsichtig und ohne heftige Lenkbewegungen an den rechten Fahrbahnrand rollen und dort anhalten",
      "Sofort mitten auf der Straße abspringen",
      "Laut schreien und weiter treten",
      "In den Gegenverkehr steuern"
    ],
    "correct": 0,
    "hint": "Ruhig ausrollen lassen, sicher an den Rand lenken und dort die Kette wieder auflegen."
  },
  {
    "question": "Darfst du bei Schnee und Glatteis mit dem Fahrrad auf der Straße fahren?",
    "options": [
      "Besser nicht, denn die Sturz- und Rutschgefahr für Radfahrer ist bei Schnee und Eis extrem hoch",
      "Ja, am besten mit Höchstgeschwindigkeit",
      "Ja, freihändig",
      "Nur ohne Helm"
    ],
    "correct": 0,
    "hint": "Bei Eis und Schnee ist das Radfahren lebensgefährlich – lieber zu Fuß oder mit dem Bus fahren."
  },
  {
    "question": "Warum müssen die Bremsklötze (Bremsbeläge) regelmäßig überprüft werden?",
    "options": [
      "Abgenutzte Bremsbeläge bremsen kaum noch und können die Felge zerstören",
      "Damit das Fahrrad glänzt",
      "Nur für den Sommer",
      "Weil neue Beläge bunt sind"
    ],
    "correct": 0,
    "hint": "Sichere Bremsen sind die Lebensversicherung jedes Radfahrers!"
  },
  {
    "question": "Was bedeutet eine weiße Sperrlinie in der Mitte der Fahrbahn?",
    "options": [
      "Sie darf von keinem Fahrzeug überfahren oder überquert werden",
      "Hier darf man wenden",
      "Hier darf man parken",
      "Sie ist nur eine Zierlinie"
    ],
    "correct": 0,
    "hint": "Eine durchgezogene Sperrlinie darf niemals überfahren werden."
  },
  {
    "question": "Was tust du, wenn ein Rettungswagen oder Polizeiauto mit Blaulicht und Folgetonhorn (Sirene) herannaht?",
    "options": [
      "Sofort ganz an den rechten Fahrbahnrand fahren, anhalten und die Einsatzkräfte vorbeilassen",
      "Schnell vor dem Einsatzwagen herfahren",
      "Mitten auf der Kreuzung stehenbleiben",
      "Die Klingel läuten"
    ],
    "correct": 0,
    "hint": "Einsatzfahrzeuge mit Blaulicht und Folgetonhorn haben immer absoluten Vorrang!"
  },
  {
    "question": "Welche Kleidung empfiehlt sich beim Radfahren in der Dämmerung?",
    "options": [
      "Helle Kleidung mit reflektierenden Streifen oder eine Warnweste",
      "Ganz schwarze Kleidung",
      "Eine Sonnenbrille",
      "Eine Decke über dem Kopf"
    ],
    "correct": 0,
    "hint": "Helle und reflektierende Kleidung macht dich für Autofahrer viel früher sichtbar!"
  }
];

  function buildTrafficTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const withSigns = BIKE_POOL.filter(item => item.signId);
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? BIKE_POOL.length : 5);
    const chosen = (opts && opts.forPrint)
      ? shuffle(withSigns).slice(0, targetCount)
      : ((opts && opts.all) ? BIKE_POOL : shuffle(BIKE_POOL).slice(0, targetCount));

    return chosen.map(item => {
      let customHtml = '';
      if (item.signId && window.Schlaufuchs && window.Schlaufuchs.Signs) {
        customHtml = window.Schlaufuchs.Signs.getSignSvg(item.signId);
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
        signId: item.signId || null,
        customVisualHtml: customHtml,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        solutionText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  // 5. SICHERER SCHULWEG & VERKEHR (1. bis 3. Klasse – 100 Fragen Pool: Schutzweg, Gehsteig, Ampel, StVO)
  const SCHOOL_WALK_POOL = [
  {
    "signId": "schutzweg",
    "question": "Was zeigt dieses Verkehrszeichen an?",
    "options": [
      "Schutzweg (Zebrastreifen) zum sicheren Überqueren der Straße",
      "Achtung Baustelle",
      "Radweg",
      "Verbot für Fußgänger"
    ],
    "correct": 0,
    "hint": "Hier haben Fußgänger auf der Fahrbahn Vorrang vor herannahenden Autos."
  },
  {
    "signId": "stop",
    "question": "Was verlangt dieses rote achteckige Schild?",
    "options": [
      "Halt! Vorrang geben (man muss immer anhalten)",
      "Weiterfahren ohne anzuhalten",
      "Nur für Radfahrer verboten",
      "Achtung Kinder"
    ],
    "correct": 0,
    "hint": "Das weiße Wort STOP bedeutet: Reifen müssen stillstehen."
  },
  {
    "signId": "vorrang-geben",
    "question": "Was bedeutet dieses weiße Dreieck mit rotem Rand auf der Spitze?",
    "options": [
      "Vorrang geben (andere Fahrzeuge dürfen zuerst fahren)",
      "Vorfahrt auf der Hauptstraße",
      "Straße gesperrt",
      "Einbahnstraße"
    ],
    "correct": 0,
    "hint": "Man muss den Querverkehr zuerst vorbeilassen."
  },
  {
    "signId": "wohnstrasse",
    "question": "Was gilt in einer Wohnstraße nach der österreichischen StVO?",
    "options": [
      "Kinder dürfen auf der Fahrbahn spielen, Autos dürfen nur Schrittgeschwindigkeit fahren",
      "Autos dürfen 50 km/h schnell fahren",
      "Fußgänger dürfen die Straße nicht betreten",
      "Fahrräder sind verboten"
    ],
    "correct": 0,
    "hint": "Eine Spiel- und Wohnzone mit besonderem Schutz für Fußgänger und spielende Kinder."
  },
  {
    "signId": "achtung-kinder",
    "question": "Worauf weist dieses dreieckige Gefahrenzeichen mit den zwei laufenden Kindern hin?",
    "options": [
      "Achtung Kinder (in der Nähe von Schulen, Kindergärten oder Spielplätzen)",
      "Hier ist ein Spielplatz im Wald",
      "Hier dürfen nur Kinder gehen",
      "Überholverbot"
    ],
    "correct": 0,
    "hint": "Autolenker müssen hier besonders vorsichtig und bremsbereit fahren."
  },
  {
    "signId": "gehweg",
    "question": "Wer darf diesen runden blauen Weg mit den Fußgängern benützen?",
    "options": [
      "Nur Fußgänger (Gehweg)",
      "Autos und Lastkraftwagen",
      "Nur Mopeds und Motorräder",
      "Eisenbahnen"
    ],
    "correct": 0,
    "hint": "Ein reiner Weg für Fußgänger ohne Autoverkehr."
  },
  {
    "signId": "radweg",
    "question": "Welches Verkehrsmittel darf diesen blauen Weg mit dem Fahrrad benützen?",
    "options": [
      "Fahrräder und E-Bikes (Radweg)",
      "Nur Lastkraftwagen",
      "Fußgänger haben alleinigen Vorrang",
      "Reiter"
    ],
    "correct": 0,
    "hint": "Hier fahren Radfahrer getrennt vom Autoverkehr."
  },
  {
    "signId": "geh-radweg",
    "question": "Wer darf diesen gemeinsamen Weg (blau mit Fußgängern und Fahrrad) benützen?",
    "options": [
      "Fußgänger und Radfahrer gemeinsam mit gegenseitiger Rücksichtnahme",
      "Nur schnelle Autos",
      "Nur landwirtschaftliche Traktoren",
      "Niemand"
    ],
    "correct": 0,
    "hint": "Radfahrer müssen hier auf Fußgänger besonders Acht geben."
  },
  {
    "signId": "einfahrt-verboten",
    "question": "Was bedeutet das rote runde Schild mit dem waagrechten weißen Balken?",
    "options": [
      "Einfahrt verboten (von dieser Seite darf kein Fahrzeug einfahren)",
      "Hier beginnt die Autobahn",
      "Schutzweg voraus",
      "Parkplatz"
    ],
    "correct": 0,
    "hint": "Ein klares Verbotsschild, oft am Ausgang von Einbahnstraßen."
  },
  {
    "signId": "fahrverbot",
    "question": "Was bedeutet der weiße Kreis mit dem dicken roten Außenrand?",
    "options": [
      "Fahrverbot für Fahrzeuge aller Art in beiden Richtungen",
      "Freie Fahrt für alle",
      "Fußgänger verboten",
      "Achtung Tiere"
    ],
    "correct": 0,
    "hint": "Hier darf von beiden Seiten kein Fahrzeug einfahren."
  },
  {
    "signId": null,
    "question": "Was kündigt dieses dreieckige Schild mit dem schaufelnden Arbeiter an?",
    "options": [
      "Achtung Baustelle und Bauarbeiten auf der Fahrbahn",
      "Gartenarbeit im Park",
      "Sportplatz",
      "Parkverbot"
    ],
    "correct": 0,
    "hint": "Achtung: Auf der Straße können Schutt, Gruben und Baufahrzeuge sein."
  },
  {
    "signId": null,
    "question": "Worauf weist das dreieckige Schild mit den drei Ampelsymbolen hin?",
    "options": [
      "Achtung, eine Verkehrslichtsignalanlage (Ampel) folgt",
      "Hier ist ein Farbgeschäft",
      "Buntes Kunstwerk voraus",
      "Bahnübergang"
    ],
    "correct": 0,
    "hint": "Bald kommt eine Kreuzung mit einer Ampelregelung."
  },
  {
    "signId": null,
    "question": "Was bedeutet das blaue Schild mit dem weißen Balken und dem roten Dach?",
    "options": [
      "Sackgasse (Straße ohne Wendemöglichkeit am Ende nicht durchfahrbar)",
      "Autobahnbeginn",
      "Schutzweg",
      "Spital"
    ],
    "correct": 0,
    "hint": "Am Ende geht die Straße für Autos nicht weiter."
  },
  {
    "signId": "einbahnstrasse",
    "question": "Was zeigt das blaue rechteckige Schild mit dem geraden weißen Pfeil?",
    "options": [
      "Einbahnstraße (Fahrzeuge dürfen nur in Pfeilrichtung fahren)",
      "Sackgasse",
      "Gegenverkehr beachten",
      "Vorrang geben"
    ],
    "correct": 0,
    "hint": "Alle Autos fahren nur in eine gemeinsame Richtung."
  },
  {
    "signId": "kreisverkehr",
    "question": "Was zeigt das blaue runde Schild mit den drei weißen Kreispfeilen an?",
    "options": [
      "Kreisverkehr (Fahrtrichtung gegen den Uhrzeigersinn)",
      "Karussell im Vergnügungspark",
      "Sackgasse",
      "U-Turn verboten"
    ],
    "correct": 0,
    "hint": "Man fährt rechts in den Kreis hinein und folgt den Pfeilen."
  },
  {
    "signId": null,
    "question": "Worauf weist dieses Gefahrenzeichen mit dem Zaun oder der Lokomotive hin?",
    "options": [
      "Bahnübergang (Eisenbahn kreuzt die Straße)",
      "Schutzweg",
      "Busbahnhof",
      "Flughafen"
    ],
    "correct": 0,
    "hint": "Züge haben immer Vorrang und einen sehr langen Bremsweg."
  },
  {
    "signId": null,
    "question": "Was bedeutet das Gefahrenzeichen mit den zwei Bodenhügeln?",
    "options": [
      "Bodenunebenheit oder Querrillen auf der Fahrbahn",
      "Kamelgehege",
      "Zweiräder verboten",
      "Achtung Sand"
    ],
    "correct": 0,
    "hint": "Vorsichtig fahren, die Fahrbahn hat Wellen oder Schlaglöcher."
  },
  {
    "signId": null,
    "question": "Was bedeutet die rote Markierung auf der Fahrbahn mit Fahrradsymbolen?",
    "options": [
      "Radfahrerüberfahrt (Überquerungsstreifen für Radfahrer)",
      "Fußgängerzone",
      "Parkplatz für Autos",
      "Haltestelle"
    ],
    "correct": 0,
    "hint": "Hier queren Fahrräder sicher die Fahrbahn."
  },
  {
    "question": "Wie verhältst du dich richtig, wenn du an einen Zebrastreifen (Schutzweg) kommst?",
    "options": [
      "An der Bordsteinkante stehen bleiben, nach links-rechts-links schauen und Blickkontakt suchen",
      "Ohne zu schauen sofort im Vollsprint über die Straße rennen",
      "Mit dem Handy spielen und einfach losgehen",
      "Rückwärts über die Fahrbahn hüpfen"
    ],
    "correct": 0,
    "hint": "Erst wenn du sicher bist, dass herannahende Autos anhalten, gehst du zügig los."
  },
  {
    "question": "Warum ist der Blickkontakt mit dem Autofahrer am Zebrastreifen so wichtig?",
    "options": [
      "Weil du nur so sicher weißt, dass dich der Fahrer wirklich gesehen hat und anhält",
      "Weil man im Straßenverkehr immer lächeln muss",
      "Weil man sonst ein Bußgeld bekommt",
      "Weil der Fahrer nach dem Weg fragen möchte"
    ],
    "correct": 0,
    "hint": "Sieht dich der Lenker an, hat er dich wahrgenommen und bremst."
  },
  {
    "question": "Darf man über einen Schutzweg rennen?",
    "options": [
      "Nein, man soll zügig und aufmerksam gehen, um nicht zu stolpern",
      "Ja, je schneller man rennt, desto sicherer ist man",
      "Man muss auf allen Vieren krabbeln",
      "Nur mit geschlossenen Augen"
    ],
    "correct": 0,
    "hint": "Beim Rennen übersieht man leicht Gefahren und kann stürzen."
  },
  {
    "question": "Was bedeutet das blinkende grüne Licht der Fußgängerampel in Österreich?",
    "options": [
      "Achtung, die Grünphase endet gleich! Wer noch am Gehsteig steht, wartet; wer auf der Straße ist, geht zügig weiter",
      "Man soll sofort mitten auf der Fahrbahn stehen bleiben",
      "Man darf jetzt erst losgehen",
      "Es bedeutet, dass die Ampel kaputt ist"
    ],
    "correct": 0,
    "hint": "Blinkendes Grün warnt: Gleich schaltet die Ampel auf Rot um."
  },
  {
    "question": "Was bedeutet das rote Fußgängersymbol an der Ampel?",
    "options": [
      "Stehen bleiben und am Gehsteig warten!",
      "Schnell hinüberlaufen",
      "Schauen und trotzdem gehen",
      "Mit dem Roller über die Straße sausen"
    ],
    "correct": 0,
    "hint": "Bei Rot musst du immer am Gehsteigrand warten."
  },
  {
    "question": "Was bedeutet das grüne Fußgängersymbol an der Ampel?",
    "options": [
      "Gehen! Dennoch vor dem ersten Schritt kurz links und rechts schauen",
      "Die Augen schließen und loslaufen",
      "Auf die Straße setzen",
      "Rennen so schnell man kann"
    ],
    "correct": 0,
    "hint": "Grün gibt die Fahrbahn frei, aber abbiegende Autos muss man trotzdem im Auge behalten."
  },
  {
    "question": "Darf man bei Rot über die Straße gehen, wenn weit und breit kein Auto zu sehen ist?",
    "options": [
      "Nein, Rot bedeutet immer Stopp und man ist ein Vorbild für jüngere Kinder",
      "Ja, wenn niemand zuschaut",
      "Ja, wenn man es eilig hat",
      "Nur wenn die Sonne scheint"
    ],
    "correct": 0,
    "hint": "Verkehrsregeln gelten immer – Sicherheit geht vor Eile."
  },
  {
    "question": "In welche Richtung schaust du vor dem Überqueren einer Straße in Österreich zuerst?",
    "options": [
      "Zuerst nach links (von dort kommen die nächsten Fahrzeuge)",
      "Zuerst in den Himmel",
      "Zuerst auf die Schuhspitzen",
      "Zuerst nach hinten"
    ],
    "correct": 0,
    "hint": "Wegen des Rechtsverkehrs kommt der Verkehr auf der nahen Spur von links."
  },
  {
    "question": "Warum schaut man: LINKS – RECHTS – und noch einmal LINKS?",
    "options": [
      "Weil ein Auto von links in wenigen Sekunden sehr nah herangefahren sein kann",
      "Weil es so im Gedicht steht",
      "Weil man dreimal schauen muss für die Kamera",
      "Weil rechts keine Autos fahren"
    ],
    "correct": 0,
    "hint": "Der zweite Blick nach links prüft, ob die Fahrbahn immer noch frei ist."
  },
  {
    "question": "Ein Auto hält am Zebrastreifen für dich an. Auf der zweiten Fahrspur kommt von hinten ein zweites Auto. Was tust du?",
    "options": [
      "Vorsichtig bis zur Mitte gehen, anhalten und schauen, ob das zweite Auto auch wirklich anhält",
      "Einfach ungeschaut weiterlaufen",
      "Sofort umdrehen und weinen",
      "Über die Motorhaube des Autos klettern"
    ],
    "correct": 0,
    "hint": "Verdeckte Autos auf der zweiten Spur sind eine große Gefahr."
  },
  {
    "question": "Auf welcher Seite des Gehsteigs gehst du am sichersten?",
    "options": [
      "Auf der Innenseite (abgewandt von der Fahrbahn, nahe an Häusern oder Zäunen)",
      "Ganz nah an der Bordsteinkante direkt neben den vorbeirasenden Autos",
      "Auf der Bordsteinkante balancierend",
      "Mitten auf der Straße"
    ],
    "correct": 0,
    "hint": "Der Abstand zur Fahrbahn schützt dich vor LKWs, Außenspiegeln und Pfützen."
  },
  {
    "question": "Warum soll man auf der Bordsteinkante niemals balancieren?",
    "options": [
      "Man kann leicht abrutschen und direkt vor ein fahrendes Auto auf die Straße stürzen",
      "Weil man die Schuhe schmutzig macht",
      "Weil der Gehsteig sonst kaputt geht",
      "Weil es verboten ist zu gehen"
    ],
    "correct": 0,
    "hint": "Ein Ausrutschen an der Kante kann lebensgefährlich sein."
  },
  {
    "question": "Wie gehst du an einer Hauseinfahrt oder Garagenausfahrt vorbei?",
    "options": [
      "Aufmerksam schauen und auf Motorgeräusche oder ausfahrende Autos achten",
      "Ohne zu schauen mit gesenktem Kopf vorbeilaufen",
      "Mitten in die Einfahrt hineinsetzen",
      "Laut schreien"
    ],
    "correct": 0,
    "hint": "Autofahrer, die rückwärts aus Einfahrten fahren, sehen kleine Kinder oft sehr spät."
  },
  {
    "question": "Was tust du, wenn der Gehsteig durch eine Baustelle blockiert ist?",
    "options": [
      "Den ausgeschilderten Ersatzweg benützen oder an einer sicheren Stelle die Straße queren",
      "Einfach mitten auf die Autostraße springen",
      "Über die Absperrung klettern",
      "Umkehren und zu Hause bleiben"
    ],
    "correct": 0,
    "hint": "Baustellenabsperrungen leiten Fußgänger sicher um die Gefahrenstelle."
  },
  {
    "question": "Warum darf man niemals zwischen zwei eng geparkten Autos auf die Straße treten?",
    "options": [
      "Weil fahrende Autofahrer einen hinter den Autos erst viel zu spät sehen können",
      "Weil Autos kitzlig sind",
      "Weil die Autos laut hupen",
      "Weil man die Autos berührt"
    ],
    "correct": 0,
    "hint": "Geparkte Autos versperren dir und dem herannahenden Verkehr komplett die Sicht."
  },
  {
    "question": "Was tust du, wenn dein Ball vom Spielplatz auf die befahrene Straße rollt?",
    "options": [
      "Sofort stehen bleiben, niemals hinterherlaufen und einen Erwachsenen um Hilfe bitten",
      "Sofort blindlings hinterherrennen, bevor ein Auto kommt",
      "Auf die Straße springen und den Ball fangen",
      "Augen zuhalten"
    ],
    "correct": 0,
    "hint": "Kein Spielzeug ist so wertvoll wie dein Leben – niemals unüberlegt auf die Straße rennen!"
  },
  {
    "question": "Wie gehst du auf einer Straße, wenn es überhaupt keinen Gehsteig gibt (Freilandstraße)?",
    "options": [
      "Ganz links am Fahrbahnrand im Gänsemarsch hintereinander, dem Gegenverkehr entgegen",
      "Nebeneinander mitten auf der Straße",
      "Rechts mit dem Rücken zum Verkehr",
      "Im Zickzack"
    ],
    "correct": 0,
    "hint": "Gehst du links, siehst du herannahende Fahrzeuge von vorne und kannst rechtzeitig ausweichen."
  },
  {
    "question": "Warum geht man auf Straßen ohne Gehsteig hintereinander (im Gänsemarsch) und nicht nebeneinander?",
    "options": [
      "Damit man möglichst wenig Platz auf der Fahrbahn braucht und Autos sicher vorbeikommen",
      "Weil man sonst streitet",
      "Weil der Weg schmaler wird",
      "Damit man sich nicht unterhalten kann"
    ],
    "correct": 0,
    "hint": "Nebeneinandergehen drängt Kinder gefährlich weit in die Fahrbahnmitte."
  },
  {
    "question": "Was bedeutet das Prinzip 'Sicht vor Schritt' im Straßenverkehr?",
    "options": [
      "Erst genau schauen und sicher sein, bevor man den ersten Schritt auf die Fahrbahn setzt",
      "Schnell rennen ohne zu schauen",
      "Ein Foto machen",
      "Immer auf den Boden schauen"
    ],
    "correct": 0,
    "hint": "Sehen und gesehen werden ist die oberste Verkehrsregel."
  },
  {
    "question": "Darf man beim Gehen auf der Straße Kopfhörer mit lauter Musik tragen oder aufs Smartphone schauen?",
    "options": [
      "Nein, man muss herannahende Fahrzeuge, Hupen und Rufe mit allen Sinnen wahrnehmen",
      "Ja, Musik hilft beim Gehen",
      "Ja, Videos schauen ist erlaubt",
      "Nur am Zebrastreifen"
    ],
    "correct": 0,
    "hint": "Ablenkung durch Kopfhörer und Handys ist eine der häufigsten Unfallursachen."
  },
  {
    "question": "Aus welcher Entfernung sieht ein Autofahrer mit Abblendlicht ein dunkel gekleidetes Kind in der Nacht?",
    "options": [
      "Erst aus ca. 25 Metern (oft zu kurz für den Bremsweg!)",
      "Aus über 200 Metern",
      "Aus 1 Kilometer Entfernung",
      "Sofort am Horizont"
    ],
    "correct": 0,
    "hint": "Dunkle Kleidung schluckt fast das gesamte Scheinwerferlicht."
  },
  {
    "question": "Aus welcher Entfernung wird ein Kind mit reflektierender Kleidung und Warnweste vom Auto gesehen?",
    "options": [
      "Aus rund 140 bis 150 Metern Entfernung",
      "Aus 10 Metern",
      "Aus 5 Metern",
      "Überhaupt nicht"
    ],
    "correct": 0,
    "hint": "Reflektoren werfen das Scheinwerferlicht hell strahlend zum Autofahrer zurück."
  },
  {
    "question": "Welche Kleidung macht dich am Schulweg im nebeligen November am besten sichtbar?",
    "options": [
      "Helle Jacken mit leuchtenden Farben und reflektierenden Streifen (oder Sicherheitsweste)",
      "Ganz schwarze Jacke mit schwarzer Kapuze",
      "Dunkelbraune Kleidung",
      "Ein grauer Mantel"
    ],
    "correct": 0,
    "hint": "Helle und leuchtende Farben stechen aus dem grauen Nebel hervor."
  },
  {
    "question": "Warum müssen Schultaschen in Österreich reflektierende Streifen und Leuchtflächen haben?",
    "options": [
      "Damit Schulkinder bei Dämmerung und Regen von Autofahrern schon von weitem gesehen werden",
      "Damit die Tasche im Dunkeln leuchtet wie eine Taschenlampe",
      "Damit sie teurer aussieht",
      "Damit man sie im Schrank findet"
    ],
    "correct": 0,
    "hint": "Reflektoren an Front und Seiten der Schultasche schützen auf jedem Schulweg."
  },
  {
    "question": "Welche Farbe hat eine reflektierende Warnweste für Schulkinder meistens?",
    "options": [
      "Leuchtgelb oder Leuchtorange mit silbrigen Reflexstreifen",
      "Schwarz",
      "Dunkelblau",
      "Dunkelgrün"
    ],
    "correct": 0,
    "hint": "Neongelb und Signalorange reflektieren und leuchten am intensivsten."
  },
  {
    "question": "Warum schränkt eine tief ins Gesicht gezogene Kapuze die Sicherheit im Verkehr ein?",
    "options": [
      "Weil die Kapuze das seitliche Sehen und das Hören von herannahenden Autos behindert",
      "Weil die Kapuze die Haare verstrubbelt",
      "Weil die Kapuze zu warm ist",
      "Weil Kapuzen verboten sind"
    ],
    "correct": 0,
    "hint": "Vor dem Überqueren einer Straße die Kapuze kurz zurückstreifen, um frei nach links und rechts zu sehen!"
  },
  {
    "question": "Wie trägst du einen Regenschirm am Gehsteig sicher?",
    "options": [
      "So hoch halten, dass du die Straße und herannahende Autos immer frei im Blick hast",
      "Tief über die Augen ziehen, damit man gar nichts mehr sieht",
      "Aufgespannt waagrecht vor den Bauch halten",
      "Wie eine Lanze nach vorne strecken"
    ],
    "correct": 0,
    "hint": "Man darf sich mit dem Schirm niemals das eigene Sichtfeld versperren."
  },
  {
    "question": "Was bedeutet das Wort 'Reflektor'?",
    "options": [
      "Ein Material, das auftreffendes Licht direkt zur Lichtquelle zurückstrahlt",
      "Eine kleine Lampe mit Batterie",
      "Ein bunter Aufkleber aus Papier",
      "Eine Taschenuhr"
    ],
    "correct": 0,
    "hint": "Katzenaugen und Reflektorbänder werfen Autoscheinwerferlicht hell zurück."
  },
  {
    "question": "Wann ist das Tragen von reflektierenden Bändern am Schulweg besonders wichtig?",
    "options": [
      "Im Herbst und Winter am frühen Morgen und am späten Nachmittag (Dämmerung, Nebel)",
      "Nur im Hochsommer bei Sonnenschein",
      "Nur im Schlafzimmer",
      "Niemals"
    ],
    "correct": 0,
    "hint": "In den dunklen Wintermonaten beginnt der Schulweg oft noch vor Sonnenaufgang."
  },
  {
    "question": "Wo bringt man reflektierende Bänder am Körper am wirksamsten an?",
    "options": [
      "An Armen und Beinen (Knöcheln), weil bewegte Reflexpunkte besonders auffallen",
      "Unter der dicken Jacke im Pullover",
      "In der Hosentasche",
      "Unter der Schuhsohle"
    ],
    "correct": 0,
    "hint": "Die Bewegung der Beine beim Gehen signalisiert dem Autofahrer sofort: Da geht ein Mensch!"
  },
  {
    "question": "Wie verhältst du dich an der Haltestelle von Schulbus oder Straßenbahn?",
    "options": [
      "Einen großen Schritt Abstand zur Fahrbahnkante halten und nicht drängeln oder toben",
      "Direkt an der Bordsteinkante herumschubsen und Fangen spielen",
      "Auf die Straße springen, um zu sehen, ob der Bus kommt",
      "Sich auf die Schienen setzen"
    ],
    "correct": 0,
    "hint": "Einfahrende Busse und Straßenbahnen schwenken mit dem Spiegel über die Kante aus."
  },
  {
    "question": "Wann darfst du in den Schulbus oder die Straßenbahn einsteigen?",
    "options": [
      "Erst wenn das Fahrzeug völlig stillsteht und die Türen ganz geöffnet sind",
      "Schon während der Bus noch langsam heranrollt",
      "Wenn der Busfahrer noch hupt",
      "Sobald man die Türen berühren kann"
    ],
    "correct": 0,
    "hint": "Niemals an ein noch rollendes Fahrzeug herandrängen!"
  },
  {
    "question": "Du bist aus dem Schulbus ausgestiegen und musst auf die andere Straßenseite. Was tust du?",
    "options": [
      "Warten, bis der Bus abgefahren ist und die Straße in beide Richtungen völlig frei einsehbar ist",
      "Direkt vor der hohen Schnauze des Busses über die Straße rennen",
      "Hinter dem Bus blindlings über die Straße rennen",
      "Unter dem Bus durchkrabbeln"
    ],
    "correct": 0,
    "hint": "Ein stehender Bus verdeckt dir komplett die Sicht auf überholende Autos."
  },
  {
    "question": "Warum darf man NIEMALS direkt vor oder hinter einem stehenden Bus über die Straße laufen?",
    "options": [
      "Weil herannahende Autos dich hinter dem großen Bus nicht sehen können und du sie nicht siehst",
      "Weil der Busfahrer sonst schimpft",
      "Weil der Auspuff warm ist",
      "Weil der Bus breiter ist"
    ],
    "correct": 0,
    "hint": "Der Bus wirkt wie eine meterhohe Mauer, die jede Sicht versperrt."
  },
  {
    "question": "Wo verstaust du deine Schultasche während der Fahrt im Schulbus, wenn du keinen Sitzplatz hast?",
    "options": [
      "Zwischen die eigenen Füße auf den Boden stellen und dich mit beiden Händen gut festhalten",
      "Auf dem Rücken behalten und mitten im Gang herumstehen",
      "Auf den Schoß eines fremden Fahrgastes werfen",
      "Durch das Fenster hängen"
    ],
    "correct": 0,
    "hint": "Die Tasche am Rücken zieht dich bei einer plötzlichen Bremsung nach hinten um."
  },
  {
    "question": "Wie verhältst du dich, wenn du an der Haltestelle aus der Straßenbahn aussteigst und Autos neben den Schienen fahren?",
    "options": [
      "Kurz stehen bleiben, nach rechts schauen und vorsichtig auf den Gehsteig treten",
      "Sofort ohne zu schauen auf die Fahrbahn springen",
      "Rückwärts hinauspurzeln",
      "Mit geschlossenen Augen laufen"
    ],
    "correct": 0,
    "hint": "Autofahrer müssen zwar warten, aber man muss sich immer selbst vergewissern!"
  },
  {
    "question": "Darf man während der Fahrt im Bus herumlaufen oder Blödsinn machen?",
    "options": [
      "Nein, bei einer Vollbremsung wird man sonst mit voller Wucht durch den Bus geschleudert",
      "Ja, solange der Busfahrer nichts sagt",
      "Ja, Fangen spielen ist lustig",
      "Nur in der Kurve"
    ],
    "correct": 0,
    "hint": "Immer fest an den Haltestangen festhalten!"
  },
  {
    "question": "Was tust du, wenn an der Haltestelle viele Kinder drängeln?",
    "options": [
      "Einen Schritt zurücktreten, Abstand halten und ruhig einsteigen, wenn man an der Reihe ist",
      "Mit den Ellbogen vorboxen, um Erster zu sein",
      "Andere Kinder auf die Straße schubsen",
      "Ganz laut schreien"
    ],
    "correct": 0,
    "hint": "Drängeln führt an der Bordsteinkante zu gefährlichen Stürzen vor einfahrende Fahrzeuge."
  },
  {
    "question": "Welches Schild kennzeichnet eine offizielle Haltestelle für Linienbusse?",
    "options": [
      "Ein rundes oder eckiges Schild mit einem großen grünen oder blauen 'H' bzw. Bussymbol",
      "Ein Parkplatzschild",
      "Ein Stopschild",
      "Ein Baustellenschild"
    ],
    "correct": 0,
    "hint": "Das Haltestellenschild markiert den Wartebereich."
  },
  {
    "question": "Wie weit vor der Haltestelle müssen Autos bei einem Schulbus mit eingeschalteter Warnblinkanlage fahren?",
    "options": [
      "Nur mit besonderer Vorsicht und Schrittgeschwindigkeit, wenn Kinder ein- oder aussteigen",
      "Mit Höchstgeschwindigkeit vorbeirasen",
      "Laut hupend durchfahren",
      "Gar nicht bremsen"
    ],
    "correct": 0,
    "hint": "Kinder sind unberechenbar, deshalb gilt für Autolenker höchste Vorsicht."
  },
  {
    "question": "Dürfen Kinder mit einem Tretroller (Micro-Scooter) auf dem Gehsteig fahren?",
    "options": [
      "Ja, aber nur mit Schrittgeschwindigkeit und ohne Fußgänger zu gefährden oder zu behindern",
      "Ja, mit Höchstgeschwindigkeit zwischen den Leuten durchsausen",
      "Nein, Roller dürfen nur auf der Autobahn fahren",
      "Nein, Tretroller sind überall verboten"
    ],
    "correct": 0,
    "hint": "Der Gehsteig gehört den Fußgängern – Rollerfahrer müssen vorsichtig und rücksichtsvoll fahren."
  },
  {
    "question": "Was musst du tun, wenn du mit dem Tretroller oder Fahrrad einen Zebrastreifen überqueren willst?",
    "options": [
      "Absteigen und den Roller oder das Fahrrad zu Fuß über den Schutzweg schieben",
      "Mit vollem Schwung über die Fahrbahn rasen",
      "Einen Sprung machen",
      "Die Augen zumachen"
    ],
    "correct": 0,
    "hint": "Nur Fußgänger haben am Schutzweg gesetzlichen Vorrang – rollst du drüber, bist du ein Fahrzeug!"
  },
  {
    "question": "Welche Schutzausrüstung ist beim Fahren mit Scooter, Inlineskates oder Skateboard dringend ratsam?",
    "options": [
      "Helm, Handgelenkschützer, Ellbogen- und Knieschützer",
      "Eine warme Wollmütze",
      "Badeschlapfen",
      "Dunkle Sonnenbrille"
    ],
    "correct": 0,
    "hint": "Protektoren schützen Gelenke und Kopf vor schweren Verletzungen beim Sturz."
  },
  {
    "question": "Darf man mit dem Tretroller auf der stark befahrenen Autostraße fahren?",
    "options": [
      "Nein, Tretroller gehören auf den Gehsteig oder in verkehrsberuhigte Zonen (Wohnstraße)",
      "Ja, mitten auf der Hauptstraße",
      "Ja, zwischen LKWs",
      "Nur auf der Autobahn"
    ],
    "correct": 0,
    "hint": "Scooter gelten als fahrzeugähnliches Spielzeug und gehören nicht auf die Straße."
  },
  {
    "question": "Warum sollte man beim Rollerfahren feste geschlossene Schuhe tragen?",
    "options": [
      "Weil offene Badeschlapfen oder Sandalen beim Bremsen keinen Halt bieten und abrutschen",
      "Weil feste Schuhe schöner aussehen",
      "Weil es der Lehrerin gefällt",
      "Weil man barfuß schneller ist"
    ],
    "correct": 0,
    "hint": "Feste Schuhe ermöglichen ein sicheres Treten und sicheres Bremsen."
  },
  {
    "question": "Was bedeutet der Begriff 'Toter Winkel' bei LKWs und Bussen?",
    "options": [
      "Ein großer Bereich rund um das Fahrzeug, den der Fahrer trotz Spiegeln nicht einsehen kann",
      "Eine kaputte Scheibe",
      "Ein dunkler Tunnel",
      "Eine enge Kurve"
    ],
    "correct": 0,
    "hint": "Stehst du im toten Winkel, kann dich der LKW-Fahrer überhaupt nicht sehen!"
  },
  {
    "question": "Wie verhältst du dich an einer Kreuzung neben einem LKW, der nach rechts blinkt?",
    "options": [
      "Weit hinter dem LKW am Gehsteig warten und niemals rechts neben ihn fahren oder treten",
      "Ganz nah an das Vorderrad des LKWs stellen",
      "Schnell rechts am LKW vorbeilaufen",
      "Den LKW von der Seite berühren"
    ],
    "correct": 0,
    "hint": "Rechtsabbiegende LKWs schneiden die Kurve und übersehen Fußgänger im toten Winkel."
  },
  {
    "question": "Was ist ein 'Schulwegplan'?",
    "options": [
      "Ein Plan, der den sichersten Weg von zu Hause zur Schule mit den wenigsten Gefahren zeigt",
      "Ein Stundenplan für den Nachmittag",
      "Ein Plan für den Spielplatz",
      "Ein Verzeichnis aller Hausaufgaben"
    ],
    "correct": 0,
    "hint": "Der sicherste Weg ist oft nicht der kürzeste Weg, aber der mit den meisten Schutzwegen und Ampeln."
  },
  {
    "question": "Warum soll man morgens rechtzeitig und ohne Hektik von zu Hause losgehen?",
    "options": [
      "Weil man bei Zeitnot hastig wird, unaufmerksam rennt und Gefahren im Verkehr übersieht",
      "Weil die Schule sonst zusperrt",
      "Weil man morgens schneller geht",
      "Damit man im Dunkeln geht"
    ],
    "correct": 0,
    "hint": "Wer ohne Stress geht, kann an jeder Straße ruhig und aufmerksam stehen bleiben."
  },
  {
    "question": "Darf man während des Gehens auf dem Schulweg fangen spielen oder einander schubsen?",
    "options": [
      "Nein, durch Schubsen kann ein Kind stolpern und auf die Fahrbahn vor ein Auto fallen",
      "Ja, das macht wach",
      "Ja, wenn kein Polizist dasieht",
      "Nur bei Regen"
    ],
    "correct": 0,
    "hint": "Raufen und Schubsen in Fahrbahnnähe ist extrem gefährlich."
  },
  {
    "question": "Was tust du, wenn an einer Ampelkreuzung ein Polizeibeamter den Verkehr mit Handzeichen regelt?",
    "options": [
      "Die Handzeichen der Polizei beachten (Polizeizeichen gelten vor Ampeln und Schildern!)",
      "Nur auf die Ampel schauen und den Polizisten ignorieren",
      "Einfach weglaufen",
      "Die Polizei fotografieren"
    ],
    "correct": 0,
    "hint": "Handzeichen von Polizisten haben immer den allerhöchsten Vorrang."
  },
  {
    "question": "Ein Polizeibeamter steht quer zu dir und streckt beide Arme seitlich aus (du siehst seine Brust oder seinen Rücken). Was gilt?",
    "options": [
      "Halt! Rot! Man darf die Straße nicht überqueren",
      "Freie Fahrt für alle",
      "Man darf schnell durchlaufen",
      "Die Polizei bittet um Hilfe"
    ],
    "correct": 0,
    "hint": "Brust und Rücken der Polizei bedeuten wie eine Schranke: Stopp!"
  },
  {
    "question": "Ein Polizeibeamter steht mit dem Profil (von der Seite) zu dir. Was gilt?",
    "options": [
      "Die Straße ist für deine Richtung frei (wie Grün an der Ampel)",
      "Man muss stehen bleiben",
      "Man muss umdrehen",
      "Achtung Baustelle"
    ],
    "correct": 0,
    "hint": "Siehst du die Hosennaht des Polizisten von der Seite, ist der Weg frei."
  },
  {
    "question": "Was bedeutet das Blaulicht und das Folgetonhorn (Sirene) eines Rettungsautos oder der Feuerwehr?",
    "options": [
      "Einsatzfahrzeug im Notfall hat immer Vorrang – Straße sofort frei machen und warten!",
      "Das Auto macht Musik für Fußgänger",
      "Man darf vor dem Rettungswagen über die Straße laufen",
      "Es ist ein Festzug"
    ],
    "correct": 0,
    "hint": "Einsatzkräfte eilen zu Verletzten oder Bränden – alle anderen müssen anhalten."
  },
  {
    "question": "Wie verhältst du dich, wenn du auf dem Schutzweg gehst und hörst plötzlich eine Sirene mit Blaulicht nahen?",
    "options": [
      "Zügig den Gehsteig erreichen und nicht mitten auf der Fahrbahn stehen bleiben",
      "Sich mitten auf den Zebrastreifen setzen",
      "Dem Rettungswagen zuwinken und ihn anhalten",
      "Im Kreis laufen"
    ],
    "correct": 0,
    "hint": "Räume die Fahrbahn so rasch und besonnen wie möglich."
  },
  {
    "question": "Was bedeutet ein Andreaskreuz vor Bahngleisen?",
    "options": [
      "Achtung, Schienenfahrzeuge haben Vorrang – vor dem Gleis genau schauen und horchen!",
      "Hier darf man auf den Schienen spazieren",
      "Das ist ein Denkmal",
      "Schlittenfahren erlaubt"
    ],
    "correct": 0,
    "hint": "Ein Andreaskreuz steht an unbeschrankten und beschrankten Bahnübergängen."
  },
  {
    "question": "Darf man unter einer sich schließenden Bahnschranke noch schnell durchhuschen?",
    "options": [
      "Niemals! Das ist lebensgefährlich – Züge sind viel schneller da, als man denkt",
      "Ja, wenn man sehr schnell sprintet",
      "Ja, wenn der Zug noch weit weg ist",
      "Nur mit dem Fahrrad"
    ],
    "correct": 0,
    "hint": "Schranken schließen sich erst kurz vor der Durchfahrt des Zuges – absoluter Lebensgefahr!"
  },
  {
    "question": "Welche Gefahr droht im Winter auf Gehwegen und Straßen besonders?",
    "options": [
      "Glatteis und Schneematsch verlängern den Bremsweg von Autos um ein Vielfaches",
      "Es ist zu hell draußen",
      "Autos fahren im Winter geräuschlos",
      "Schuhe werden warm"
    ],
    "correct": 0,
    "hint": "Auf Eis kann ein Auto selbst bei einer Vollbremsung nicht rechtzeitig anhalten."
  },
  {
    "question": "Was passiert mit dem Bremsweg eines Autos bei nasser oder schneebedeckter Straße?",
    "options": [
      "Der Bremsweg wird viel länger als auf trockener Straße",
      "Der Bremsweg wird kürzer",
      "Der Bremsweg bleibt auf den Zentimeter gleich",
      "Autos können gar nicht mehr bremsen"
    ],
    "correct": 0,
    "hint": "Reifen haben auf Schnee und Nässe viel weniger Griff."
  },
  {
    "question": "Was bedeutet das Verkehrszeichen 'Fußgängerzone'?",
    "options": [
      "Ein Bereich nur für Fußgänger – Autos sind grundsätzlich verboten (außer Lieferverkehr zu bestimmten Zeiten)",
      "Eine Rennstrecke für Mopeds",
      "Ein Parkplatz für Wohnwägen",
      "Eine Autobahn für LKWs"
    ],
    "correct": 0,
    "hint": "Hier können Fußgänger die gesamte Straßenbreite gefahrlos nützen."
  },
  {
    "question": "Dürfen Erwachsene mit dem Auto auf dem Gehsteig fahren oder parken?",
    "options": [
      "Nein, der Gehsteig ist ausschließlich für Fußgänger reserviert",
      "Ja, wenn der Parkplatz voll ist",
      "Ja, um kurz einzukaufen",
      "Immer am Wochenende"
    ],
    "correct": 0,
    "hint": "Fahrzeuge dürfen auf dem Gehsteig weder fahren noch parken."
  },
  {
    "question": "Was machst du, wenn an einer Kreuzung parkende LKWs dir die Sicht nach links versperren?",
    "options": [
      "Ganz vorsichtig bis zur Sichtlinie vortasten, bis du links alles frei überblicken kannst",
      "Mit geschlossenen Augen loslaufen",
      "Einfach hoffen, dass nichts kommt",
      "Auf das LKW-Dach klettern"
    ],
    "correct": 0,
    "hint": "Erst wenn du freie Sicht hast, entscheidest du über das Queren."
  },
  {
    "question": "Welches Verkehrszeichen zeigt ein Fahrrad auf blauem runden Grund?",
    "options": [
      "Gebotsschild: Radweg (Radfahrer müssen diesen Weg benützen)",
      "Fahrradverbot",
      "Achtung Radfahrer",
      "Fahrradgeschäft"
    ],
    "correct": 0,
    "hint": "Runde blaue Schilder sind Gebotsschilder."
  },
  {
    "question": "Welches Verkehrszeichen zeigt ein durchgestrichenes rotes Fahrrad im Kreis?",
    "options": [
      "Verbot für Radfahrer",
      "Radweg",
      "Fahrradständer",
      "Schutzweg"
    ],
    "correct": 0,
    "hint": "Rote runde Schilder mit Schrägstrich oder rotem Rand bedeuten Verbot."
  },
  {
    "question": "Was tust du, wenn du an einer Fußgängerampel mit Drücker (Anforderungstaste) stehst?",
    "options": [
      "Einmal fest auf den Taster drücken und geduldig warten, bis das grüne Männchen aufleuchtet",
      "Hundertmal schnell hintereinander draufschlagen",
      "Mit den Füßen gegen die Ampel treten",
      "Trotz Rot losgehen"
    ],
    "correct": 0,
    "hint": "Einmal drücken reicht – die Steuerung schaltet die Fußgängerphase ein."
  },
  {
    "question": "Darf man bei einer roten Ampel losgehen, wenn ein Erwachsener vor dir einfach bei Rot geht?",
    "options": [
      "Nein, du bleibst bei Rot stehen und hältst dich an die Regeln!",
      "Ja, weil Erwachsene immer alles richtig machen",
      "Ja, man muss immer hinterherlaufen",
      "Nur wenn man rennt"
    ],
    "correct": 0,
    "hint": "Sei stolz darauf, dich an die Regeln zu halten, auch wenn andere unklug handeln."
  },
  {
    "question": "Was bedeutet das Wort 'Fahrbahn'?",
    "options": [
      "Der Teil der Straße, der für den Verkehr mit Fahrzeugen bestimmt ist",
      "Der Gehsteig für Kinder",
      "Die Schienen der U-Bahn",
      "Der Radweg im Wald"
    ],
    "correct": 0,
    "hint": "Auf der Fahrbahn rollen Autos, Busse und Lastwagen."
  },
  {
    "question": "Was bedeutet das Wort 'Gehsteig' (oder Trottoir)?",
    "options": [
      "Der erhöhte oder getrennte Weg neben der Fahrbahn, der für Fußgänger bestimmt ist",
      "Ein Wanderweg am Berg",
      "Eine Straße für LKWs",
      "Ein Parkplatz"
    ],
    "correct": 0,
    "hint": "Der Gehsteig ist der sichere Bereich für alle Menschen zu Fuß."
  },
  {
    "question": "Warum müssen kleine Kinder im Auto immer in einem passenden Kindersitz angeschnallt sein?",
    "options": [
      "Weil der Sicherheitsgurt allein für kleine Körper nicht passt und sie bei einem Unfall weggeschleudert würden",
      "Damit sie besser aus dem Fenster sehen",
      "Damit sie im Auto nicht herumzappeln",
      "Weil der Sitz bunt ist"
    ],
    "correct": 0,
    "hint": "In Österreich gilt die Kindersitzpflicht bis zu einer Körpergröße von 135 cm bzw. 150 cm."
  },
  {
    "question": "Auf welcher Seite eines parkenden Autos steigst du als Kind immer ein und aus?",
    "options": [
      "Immer auf der Gehsteigseite (abgewandt von der fließenden Fahrbahn)",
      "Immer zur Fahrbahnseite hin",
      "Durch den Kofferraum",
      "Über das Dach"
    ],
    "correct": 0,
    "hint": "Zur Fahrbahn hin droht Gefahr durch vorbeifahrende Autos und Radler."
  },
  {
    "question": "Was tust du, wenn an einer Ampel das gelbe Licht aufleuchtet?",
    "options": [
      "Warten – Gelb kündigt den Phasenwechsel an",
      "Vollgas geben",
      "Die Straße betreten",
      "Hupen"
    ],
    "correct": 0,
    "hint": "Gelb fordert die Lenker zum Anhalten auf und bereitet auf Rot vor."
  },
  {
    "question": "Darf ein Kind mit Rollschuhen oder Inlineskates auf dem Zebrastreifen fahren?",
    "options": [
      "Am besten abbremsen, vorsichtig rollen oder gehen und sich ganz sicher vergewissern",
      "Mit Rückwärtssalto drüberspringen",
      "Im Renntempo durchfahren",
      "Ohne zu schauen queren"
    ],
    "correct": 0,
    "hint": "Auf Rollen hat man einen viel längeren Bremsweg als zu Fuß."
  },
  {
    "question": "Was bedeutet eine weiße Bodenmarkierung mit einem Haifischzahn-Muster vor einer Kreuzung?",
    "options": [
      "Haltelinie / Vorrang geben an Radüberfahrten oder Kreuzungen",
      "Achtung Fische im Wasser",
      "Badestelle",
      "Parkverbot"
    ],
    "correct": 0,
    "hint": "Haifischzähne zeigen an, wo man anhalten und Vorrang gewähren muss."
  },
  {
    "question": "Wer hat auf dem Gehsteig Vorrang?",
    "options": [
      "Die Fußgänger",
      "Schnelle Radfahrer",
      "Mopeds",
      "Autos"
    ],
    "correct": 0,
    "hint": "Dieser erhöhte Straßenbereich ist der gesetzlich geschützte Aufenthaltsraum für gehende Personen."
  },
  {
    "question": "Was bedeutet das Wort 'Verkehrsteilnehmer'?",
    "options": [
      "Jeder Mensch, der zu Fuß, mit dem Rad, dem Bus oder dem Auto auf öffentlichen Straßen unterwegs ist",
      "Nur Autofahrer mit Führerschein",
      "Nur die Verkehrspolizei",
      "Nur Leute, die Tickets kaufen"
    ],
    "correct": 0,
    "hint": "Auch jedes Schulkind zu Fuß ist ein wichtiger Verkehrsteilnehmer!"
  },
  {
    "question": "Was ist die allerwichtigste Grundregel im österreichischen Straßenverkehr?",
    "options": [
      "Gegenseitige Rücksichtnahme und ständige Vorsicht (besonders gegenüber Kindern)",
      "Wer das größte Auto hat, darf zuerst fahren",
      "Wer am lautesten hupt, gewinnt",
      "Möglichst schnell ankommen"
    ],
    "correct": 0,
    "hint": "§ 3 der StVO verlangt Rücksicht auf alle schwächeren Verkehrsteilnehmer."
  },
  {
    "question": "Darf man bei einer grünen Fußgängerampel einfach blindlings losmarschieren?",
    "options": [
      "Nein, man blickt trotzdem kurz nach links und rechts auf eventuell abbiegende Autos",
      "Ja, bei Grün kann absolut nichts passieren",
      "Man muss rennen",
      "Augen zuhalten"
    ],
    "correct": 0,
    "hint": "Abbiegende Fahrzeuge kreuzen oft den Fußgängerüberweg bei Grün."
  },
  {
    "question": "Was ist eine Verkehrsinsel (Fahrbahnteiler) in der Straßenmitte?",
    "options": [
      "Ein geschützter Bereich in der Mitte, um die Straße in zwei Etappen sicher zu überqueren",
      "Ein kleiner Parkplatz für Fahrräder",
      "Ein Spielplatz",
      "Ein Kreisverkehr"
    ],
    "correct": 0,
    "hint": "Auf der Insel kann man sicher anhalten und die zweite Fahrspur beobachten."
  },
  {
    "question": "Warum darf man niemals Schnee oder Eisklumpen auf vorbeifahrende Fahrzeuge werfen?",
    "options": [
      "Weil der Fahrer erschrickt, die Scheibe beschädigt wird und lebensgefährliche Unfälle entstehen",
      "Weil Schnee kalt ist",
      "Weil der Schnee schmilzt",
      "Weil Autos keinen Schnee mögen"
    ],
    "correct": 0,
    "hint": "Gefährliche Eingriffe in den Straßenverkehr sind streng verboten und höchst gefährlich."
  },
  {
    "question": "Was trennt die Gehsteigkante (Randstein) voneinander ab?",
    "options": [
      "Den sicheren Fußgängerbereich vom fließenden Autoverkehr auf der Fahrbahn",
      "Zwei Autobahnen",
      "Zwei Wiesen",
      "Häuser und Gärten"
    ],
    "correct": 0,
    "hint": "Der Randstein ist die Grenze, an der man vor dem Überqueren immer stehen bleibt."
  },
  {
    "question": "Welchen europäischen Notruf kann man im Ernstfall von jedem Handy kostenlos und ohne Guthaben wählen?",
    "options": [
      "112 (Euro-Notruf)",
      "999",
      "000",
      "555"
    ],
    "correct": 0,
    "hint": "Diese europaweit einheitliche Notrufnummer funktioniert auf jedem Mobiltelefon auch ohne Guthaben."
  },
  {
    "question": "Welche Notrufnummer wählt man in ganz Österreich für die Polizei?",
    "options": [
      "133",
      "122",
      "144",
      "110"
    ],
    "correct": 0,
    "hint": "Merkregel für österreichische Notrufe: 122 hilft bei Brand, die nachfolgende Schnapszahl schützt vor Verbrechen, 144 rettet Leben."
  }
];

  function buildSchoolWalkTasks(opts) {
    const shuffle = (opts && opts.seed !== undefined) ? (arr => getRng(opts).mischen(arr)) : defaultShuffle;
    const withSigns = SCHOOL_WALK_POOL.filter(item => item.signId);
    const targetCount = (opts && opts.forPrint) ? 4 : ((opts && opts.all) ? SCHOOL_WALK_POOL.length : 5);
    const chosen = (opts && opts.forPrint)
      ? shuffle(withSigns).slice(0, targetCount)
      : ((opts && opts.all) ? SCHOOL_WALK_POOL : shuffle(SCHOOL_WALK_POOL).slice(0, targetCount));

    return chosen.map(item => {
      let customHtml = null;
      if (item.signId && window.Schlaufuchs && window.Schlaufuchs.Signs) {
        customHtml = window.Schlaufuchs.Signs.getSignSvg(item.signId);
      }
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffle([...item.options]);

      return {
        fach: 'sachunterricht',
        schulstufe: 1,
        grade: 1,
        lehrplanRef: 'SU-1/3-Verkehr-StVO',
        type: 'multiple-choice',
        icon: null,
        signId: item.signId || null,
        customVisualHtml: customHtml,
        question: item.question,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
        correctText: correctText,
        solutionText: correctText,
        hint: item.hint,
        selectedText: null,
        isCorrect: null,
      };
    });
  }

  function stampGeneralTasks(tasks, isAustria = false) {
    if (!Array.isArray(tasks)) return tasks;
    return tasks.map(t => {
      if (!t || typeof t !== 'object') return t;
      if (!t.fach) t.fach = 'sachunterricht';
      if (!t.lehrplanStatus) t.lehrplanStatus = isAustria ? 'SCHULUEBLICH' : 'RIS';
      if (!t.druck) {
        t.druck = 'ja';
        t.druckHinweis = '';
      } else if (t.druck !== 'ja' && !t.druckHinweis) {
        t.druckHinweis = 'Didaktisch angepasste Druckausgabe.';
      }
      return t;
    });
  }

  return {
    buildCalendarTasks: (opts) => stampGeneralTasks(buildCalendarTasks(opts), false),
    buildWinterTasks: (opts) => stampGeneralTasks(buildWinterTasks(opts), false),
    buildAustriaTasks: (opts) => stampGeneralTasks(buildAustriaTasks(opts), true),
    buildTrafficTasks: (opts) => stampGeneralTasks(buildTrafficTasks(opts), false),
    buildSchoolWalkTasks: (opts) => stampGeneralTasks(buildSchoolWalkTasks(opts), false),
  };
})();
