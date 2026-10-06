// =============================================================
// SCHLAUFUCHS – js/generators/german.js
// Deutsch-Generatoren (ÖWB Standardvarietät, Lehrplan BMBWF)
// Große Fragenpools (25+ Aufgaben pro Thema) für garantierte Varianz
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};
window.Schlaufuchs.Generators = window.Schlaufuchs.Generators || {};

window.Schlaufuchs.Generators.German = (function () {
  'use strict';

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getEffectiveGrades(allowedTopicGrades) {
    if (window.Schlaufuchs && window.Schlaufuchs.State && window.Schlaufuchs.State.getActiveGrades) {
      const active = window.Schlaufuchs.State.getActiveGrades();
      const filtered = allowedTopicGrades.filter(g => active.includes(g));
      if (filtered.length > 0) return filtered;
    }
    return allowedTopicGrades;
  }

  // 1. WORTARTEN (Namenwort 🔵, Tunwort 🔴, Wiewort 🟢 – 25+ Sätze Pool)
  function buildWordTypesTasks() {
    const grades = getEffectiveGrades([2, 3]);
    const isOnlyGrade2 = !grades.includes(3) && !grades.includes(4);

    const pool = [
      { text: 'Der schlaue Fuchs schleicht leise durch den Wald.', types: { Fuchs: 'nomen', schleicht: 'verb', leise: 'adjektiv', Wald: 'nomen', schlaue: 'adjektiv' } },
      { text: 'Kleine Kinder singen fröhliche Lieder in der Klasse.', types: { Kinder: 'nomen', singen: 'verb', fröhliche: 'adjektiv', Lieder: 'nomen', Klasse: 'nomen', Kleine: 'adjektiv' } },
      { text: 'Ein bunter Schmetterling fliegt über die grüne Wiese.', types: { Schmetterling: 'nomen', fliegt: 'verb', grüne: 'adjektiv', Wiese: 'nomen', bunter: 'adjektiv' } },
      { text: 'Der alte Baum verliert im Herbst gelbe Blätter.', types: { Baum: 'nomen', verliert: 'verb', Herbst: 'nomen', gelbe: 'adjektiv', Blätter: 'nomen', alte: 'adjektiv' } },
      { text: 'Schnelle Hunde rennen begeistert über das weite Feld.', types: { Hunde: 'nomen', rennen: 'verb', Feld: 'nomen', Schnelle: 'adjektiv', weite: 'adjektiv' } },
      { text: 'Im kalten Jänner bauen fröhliche Kinder einen großen Schneemann.', types: { Jänner: 'nomen', bauen: 'verb', fröhliche: 'adjektiv', Kinder: 'nomen', großen: 'adjektiv', Schneemann: 'nomen', kalten: 'adjektiv' } },
      { text: 'Die fleißige Biene sammelt süßen Honig aus der Blüte.', types: { Biene: 'nomen', sammelt: 'verb', süßen: 'adjektiv', Honig: 'nomen', Blüte: 'nomen', fleißige: 'adjektiv' } },
      { text: 'Ein winziges Kätzchen schläft friedlich auf dem weichen Sessel.', types: { Kätzchen: 'nomen', schläft: 'verb', Sessel: 'nomen', winziges: 'adjektiv', weichen: 'adjektiv' } },
      { text: 'Mutige Bergsteiger klettern auf den steilen Berg.', types: { Bergsteiger: 'nomen', klettern: 'verb', steilen: 'adjektiv', Berg: 'nomen', Mutige: 'adjektiv' } },
      { text: 'Der junge Bäcker backt heute frisches Brot.', types: { Bäcker: 'nomen', backt: 'verb', frisches: 'adjektiv', Brot: 'nomen', junge: 'adjektiv' } },
      { text: 'Dunkle Wolken bringen am Nachmittag starken Regen.', types: { Wolken: 'nomen', bringen: 'verb', Nachmittag: 'nomen', starken: 'adjektiv', Regen: 'nomen', Dunkle: 'adjektiv' } },
      { text: 'Die kluge Eule beobachtet nachts den stillen Wald.', types: { Eule: 'nomen', beobachtet: 'verb', stillen: 'adjektiv', Wald: 'nomen', kluge: 'adjektiv' } },
      { text: 'Ein roter Apfel fällt vom hohen Ast.', types: { Apfel: 'nomen', fällt: 'verb', hohen: 'adjektiv', Ast: 'nomen', roter: 'adjektiv' } },
      { text: 'Geschickte Schwalben bauen im Frühling ein sicheres Nest.', types: { Schwalben: 'nomen', bauen: 'verb', Frühling: 'nomen', sicheres: 'adjektiv', Nest: 'nomen', Geschickte: 'adjektiv' } },
      { text: 'Auf dem belebten Pausenhof spielen glückliche Schüler.', types: { Pausenhof: 'nomen', spielen: 'verb', glückliche: 'adjektiv', Schüler: 'nomen' } },
      { text: 'Der gemütliche Bär frisst im Sommer reife Beeren.', types: { Bär: 'nomen', frisst: 'verb', Sommer: 'nomen', reife: 'adjektiv', Beeren: 'nomen', gemütliche: 'adjektiv' } },
      { text: 'Ein scheues Reh trinkt klares Wasser am Bach.', types: { Reh: 'nomen', trinkt: 'verb', klares: 'adjektiv', Wasser: 'nomen', Bach: 'nomen', scheues: 'adjektiv' } },
      { text: 'Im Turnen laufen sportliche Kinder durch den großen Saal.', types: { Turnen: 'nomen', laufen: 'verb', sportliche: 'adjektiv', Kinder: 'nomen', großen: 'adjektiv', Saal: 'nomen' } },
      { text: 'Der helle Mond leuchtet in der dunklen Nacht.', types: { Mond: 'nomen', leuchtet: 'verb', dunklen: 'adjektiv', Nacht: 'nomen', helle: 'adjektiv' } },
      { text: 'Fleißige Ameisen tragen schwere Tannennadeln zum Hügel.', types: { Ameisen: 'nomen', tragen: 'verb', schwere: 'adjektiv', Tannennadeln: 'nomen', Hügel: 'nomen', Fleißige: 'adjektiv' } },
      { text: 'Das kleine Eichhörnchen versteckt braune Nüsse in der Erde.', types: { Eichhörnchen: 'nomen', versteckt: 'verb', braune: 'adjektiv', Nüsse: 'nomen', Erde: 'nomen', kleine: 'adjektiv' } },
      { text: 'Ein lauter Donner erschreckt die scheuen Pferde.', types: { Donner: 'nomen', erschreckt: 'verb', scheuen: 'adjektiv', Pferde: 'nomen', lauter: 'adjektiv' } },
      { text: 'In der Schultasche liegen saubere Hefte und spitze Bleistifte.', types: { Schultasche: 'nomen', liegen: 'verb', saubere: 'adjektiv', Hefte: 'nomen', spitze: 'adjektiv', Bleistifte: 'nomen' } },
      { text: 'Freundliche Nachbarn helfen beim schweren Umzug.', types: { Nachbarn: 'nomen', helfen: 'verb', schweren: 'adjektiv', Umzug: 'nomen', Freundliche: 'adjektiv' } },
      { text: 'Der bunte Regenbogen überspannt das ganze Tal.', types: { Regenbogen: 'nomen', überspannt: 'verb', ganze: 'adjektiv', Tal: 'nomen', bunte: 'adjektiv' } }
    ];

    const selectedSentences = shuffle(pool).slice(0, 5);
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

  // 2. GROSS & KLEIN (Namenwörter großschreiben – 25+ Sätze Pool)
  function buildCapitalizationTasks() {
    const pool = [
      {
        words: [
          { text: 'Der', isFixed: true },
          { text: 'fuchs', isTarget: true },
          { text: 'sucht', isTarget: false },
          { text: 'im', isTarget: false },
          { text: 'wald', isTarget: true },
          { text: 'nach', isTarget: false },
          { text: 'futter', isTarget: true }
        ],
        targetNouns: ['Fuchs', 'Wald', 'Futter']
      },
      {
        words: [
          { text: 'Die', isFixed: true },
          { text: 'kinder', isTarget: true },
          { text: 'pflücken', isTarget: false },
          { text: 'im', isTarget: false },
          { text: 'garten', isTarget: true },
          { text: 'süße', isTarget: false },
          { text: 'erdbeeren', isTarget: true }
        ],
        targetNouns: ['Kinder', 'Garten', 'Erdbeeren']
      },
      {
        words: [
          { text: 'Meine', isFixed: true },
          { text: 'schwester', isTarget: true },
          { text: 'packt', isTarget: false },
          { text: 'ihre', isTarget: false },
          { text: 'bunte', isTarget: false },
          { text: 'schultasche', isTarget: true },
          { text: 'für', isTarget: false },
          { text: 'die', isTarget: false },
          { text: 'schule', isTarget: true }
        ],
        targetNouns: ['Schwester', 'Schultasche', 'Schule']
      },
      {
        words: [
          { text: 'Im', isFixed: true },
          { text: 'sommer', isTarget: true },
          { text: 'scheint', isTarget: false },
          { text: 'die', isTarget: false },
          { text: 'heiße', isTarget: false },
          { text: 'sonne', isTarget: true },
          { text: 'auf', isTarget: false },
          { text: 'die', isTarget: false },
          { text: 'blumen', isTarget: true }
        ],
        targetNouns: ['Sommer', 'Sonne', 'Blumen']
      },
      {
        words: [
          { text: 'Der', isFixed: true },
          { text: 'kleine', isTarget: false },
          { text: 'hund', isTarget: true },
          { text: 'spielt', isTarget: false },
          { text: 'mit', isTarget: false },
          { text: 'dem', isTarget: false },
          { text: 'ball', isTarget: true },
          { text: 'auf', isTarget: false },
          { text: 'der', isTarget: false },
          { text: 'wiese', isTarget: true }
        ],
        targetNouns: ['Hund', 'Ball', 'Wiese']
      },
      {
        words: [
          { text: 'Am', isFixed: true },
          { text: 'nachmittag', isTarget: true },
          { text: 'backt', isTarget: false },
          { text: 'der', isTarget: false },
          { text: 'vater', isTarget: true },
          { text: 'eine', isTarget: false },
          { text: 'süße', isTarget: false },
          { text: 'torte', isTarget: true }
        ],
        targetNouns: ['Nachmittag', 'Vater', 'Torte']
      },
      {
        words: [
          { text: 'Im', isFixed: true },
          { text: 'jänner', isTarget: true },
          { text: 'fällt', isTarget: false },
          { text: 'oft', isTarget: false },
          { text: 'weißer', isTarget: false },
          { text: 'schnee', isTarget: true },
          { text: 'auf', isTarget: false },
          { text: 'das', isTarget: false },
          { text: 'dach', isTarget: true }
        ],
        targetNouns: ['Jänner', 'Schnee', 'Dach']
      },
      {
        words: [
          { text: 'Ein', isFixed: true },
          { text: 'grauer', isTarget: false },
          { text: 'hase', isTarget: true },
          { text: 'knabbert', isTarget: false },
          { text: 'an', isTarget: false },
          { text: 'einer', isTarget: false },
          { text: 'knackigen', isTarget: false },
          { text: 'karotte', isTarget: true }
        ],
        targetNouns: ['Hase', 'Karotte']
      },
      {
        words: [
          { text: 'Die', isFixed: true },
          { text: 'braune', isTarget: false },
          { text: 'eule', isTarget: true },
          { text: 'sitzt', isTarget: false },
          { text: 'auf', isTarget: false },
          { text: 'einem', isTarget: false },
          { text: 'dicken', isTarget: false },
          { text: 'ast', isTarget: true }
        ],
        targetNouns: ['Eule', 'Ast']
      },
      {
        words: [
          { text: 'Im', isFixed: true },
          { text: 'herbst', isTarget: true },
          { text: 'sammeln', isTarget: false },
          { text: 'die', isTarget: false },
          { text: 'schüler', isTarget: true },
          { text: 'bunte', isTarget: false },
          { text: 'blätter', isTarget: true }
        ],
        targetNouns: ['Herbst', 'Schüler', 'Blätter']
      },
      {
        words: [
          { text: 'Der', isFixed: true },
          { text: 'fleißige', isTarget: false },
          { text: 'bäcker', isTarget: true },
          { text: 'verkauft', isTarget: false },
          { text: 'frische', isTarget: false },
          { text: 'semmeln', isTarget: true },
          { text: 'und', isTarget: false },
          { text: 'brot', isTarget: true }
        ],
        targetNouns: ['Bäcker', 'Semmeln', 'Brot']
      },
      {
        words: [
          { text: 'Die', isFixed: true },
          { text: 'katze', isTarget: true },
          { text: 'schläft', isTarget: false },
          { text: 'gemütlich', isTarget: false },
          { text: 'auf', isTarget: false },
          { text: 'dem', isTarget: false },
          { text: 'roten', isTarget: false },
          { text: 'sessel', isTarget: true }
        ],
        targetNouns: ['Katze', 'Sessel']
      }
    ];

    const chosen = shuffle(pool).slice(0, 5);
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

  // 3. SCHÜTTELSÄTZE (Reihenfolge ordnen – 25+ Sätze Pool)
  function buildScrambleTasks() {
    const pool = [
      'Der fleißige Biber fällt einen Baum',
      'Die kluge Eule fliegt durch die Nacht',
      'Im Sommer baden die fröhlichen Kinder im See',
      'Der schnelle Hase hoppelt über die grüne Wiese',
      'Das kleine Eichhörnchen versteckt fleißig braune Nüsse',
      'Im Jänner bauen die Kinder einen lustigen Schneemann',
      'Auf dem Schulhof spielen alle Kinder gemeinsam',
      'Der bunte Schmetterling nascht süßen Nektar',
      'Meine Oma backt am Sonntag einen leckeren Kuchen',
      'Der schlaue Fuchs schleicht leise durch das Unterholz',
      'Im Herbst färben sich die Blätter der Bäume bunt',
      'Die fleißige Biene summt von Blüte zu Blüte',
      'Ein freundlicher Hund bewacht das große Haus',
      'Die mutigen Bergsteiger erreichen das goldene Gipfelkreuz',
      'Im Turnunterricht laufen die Schüler schnelle Runden',
      'Die stolze Schwalbe baut ein warmes Nest unter dem Dach',
      'Der kleine Igel rollt sich bei Gefahr blitzschnell ein',
      'Am Himmel leuchten in der Nacht viele helle Sterne',
      'Die alte Lokomotive schnauft dampfend über die Schienen',
      'In der Pause jausnen die Schüler einen knackigen Apfel'
    ];

    const chosen = shuffle(pool).slice(0, 5);
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

  // 4. DIE 4 FÄLLE DES NOMENS (4. Klasse – Wer-Fall, Wessen-Fall, Wem-Fall, Wen-Fall – 25+ Pool)
  function buildCasesTasks() {
    const pool = [
      {
        question: 'In welchem Fall steht das unterstrichene Namenwort?\n„_Der Hund_ bellt den Postboten an.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 0,
        hint: '💡 Überlege, mit welcher Frageprobe du nach dem unterstrichenen Teil fragst: Wer? Wessen? Wem? oder Wen?'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Namenwort?\n„Das ist das Fahrrad _meines Bruders_.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 1,
        hint: '💡 Frageprobe: Welches Fragewort passt hier am besten zum Fahrrad: Wer? Wessen? Wem? oder Wen?'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Namenwort?\n„Lisa hilft _der Großmutter_ beim Tragen.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 2,
        hint: '💡 Frageprobe: Welches Fragewort passt zum Helfen: Wer? Wessen? Wem? oder Wen?'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Namenwort?\n„Paul malt _einen bunten Drachen_.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 3,
        hint: '💡 Frageprobe: Was malt Paul? Probiere die 4 Fragewörter aus!'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Wort?\n„_Das Buch_ liegt auf dem Tisch.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 0,
        hint: '💡 Frageprobe: Wer oder was liegt auf dem Tisch? Überlege, welcher Fall das ist.'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Wort?\n„Wegen _des Regens_ bleiben wir drinnen.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 1,
        hint: '💡 Achte auf die Endung „-es“ und das Signalwort „Wegen ...“.'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Wort?\n„Ich gebe _dem Lehrer_ mein Heft.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 2,
        hint: '💡 Frageprobe: Wem gebe ich mein Heft? Überlege, welcher Fall das ist.'
      },
      {
        question: 'In welchem Fall steht das unterstrichene Wort?\n„Wir sehen _einen scheuen Fuchs_ im Wald.“',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 3,
        hint: '💡 Frageprobe: Wen oder was sehen wir? Ordne dem passenden Fall zu.'
      },
      {
        question: 'In welchem Fall steht: „_Die Kinder_ lachen herzlich.“?',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 0,
        hint: '💡 Wer lacht hier herzlich? Überlege, zu welchem Fall dieses Fragewort gehört.'
      },
      {
        question: 'In welchem Fall steht: „Die Mütze _des Kindes_ ist warm.“?',
        options: ['1. Fall (Wer-Fall / Nominativ)', '2. Fall (Wessen-Fall / Genitiv)', '3. Fall (Wem-Fall / Dativ)', '4. Fall (Wen-Fall / Akkusativ)'],
        correct: 1,
        hint: '💡 Frage: Wessen Mütze ist warm? Achte auf das Fragewort!'
      }
    ];

    const chosen = shuffle(pool).slice(0, 5);
    return chosen.map(item => ({
      fach: 'deutsch',
      schulstufe: 4,
      grade: 4,
      lehrplanRef: 'D-4-Sprachbetrachtung-Faelle',
      type: 'multiple-choice',
      icon: '📖',
      question: item.question,
      options: item.options,
      correctIndex: item.correct,
      correctText: item.options[item.correct],
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 5. ZEITFORMEN (Gegenwart / Mitvergangenheit / Vergangenheit / Zukunft – 25+ Pool)
  function buildTensesTasks() {
    const grades = getEffectiveGrades([3, 4]);
    const isOnlyGrade3 = !grades.includes(4);

    let pool = [
      {
        sentence: '„Gestern liefen die Kinder schnell nach Hause.“',
        tense: 'Mitvergangenheit (Präteritum)',
        hint: '💡 Überlege: Findet das Geschehen im Moment statt oder wird von Vergangenem berichtet?'
      },
      {
        sentence: '„Ich schreibe heute eine schöne Geschichte.“',
        tense: 'Gegenwart (Präsens)',
        hint: '💡 Passiert das Geschehen genau jetzt in diesem Augenblick?'
      },
      {
        sentence: '„Wir haben gestern gemeinsam einen Film geschaut.“',
        tense: 'Vergangenheit (Perfekt)',
        hint: '💡 Achte auf das zweiteilige Verb mit Hilfsverb (haben/sein).'
      },
      {
        sentence: '„Morgen werden wir in den Zoo fahren.“',
        tense: 'Zukunft (Futur)',
        hint: '💡 Bezieht sich dieser Satz auf ein Ereignis, das erst noch kommen wird?'
      },
      {
        sentence: '„Der Vogel flog hoch in den blauen Himmel.“',
        tense: 'Mitvergangenheit (Präteritum)',
        hint: '💡 Überlege, ob das Geschehen jetzt stattfindet oder in der Vergangenheit liegt.'
      },
      {
        sentence: '„Die Katze schläft friedlich auf dem Sessel.“',
        tense: 'Gegenwart (Präsens)',
        hint: '💡 Achte auf das Zeitwort: Passiert das Geschehen gerade jetzt?'
      },
      {
        sentence: '„Anna hat gestern ihre Hausübung gemacht.“',
        tense: 'Vergangenheit (Perfekt)',
        hint: '💡 Überlege, ob die Handlung bereits abgeschlossen in der Vergangenheit liegt.'
      },
      {
        sentence: '„Nächste Woche wird es viel schneien.“',
        tense: 'Zukunft (Futur)',
        hint: '💡 Findet das Geschehen schon statt oder liegt es noch vor uns?'
      },
      {
        sentence: '„Er sang ein fröhliches Lied beim Wandern.“',
        tense: 'Mitvergangenheit (Präteritum)',
        hint: '💡 Achte auf das Zeitwort: Erzählt es von einem vergangenen Geschehen?'
      },
      {
        sentence: '„Wir spielen jetzt auf dem Pausenhof.“',
        tense: 'Gegenwart (Präsens)',
        hint: '💡 Überlege: Zu welcher Zeitstufe gehört das Signalwort „jetzt“?'
      }
    ];

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
      pool = pool.filter(p => allTenses.includes(p.tense));
    }

    const chosen = shuffle(pool).slice(0, 5);
    const effectiveGrade = isOnlyGrade3 ? 3 : 4;
    return chosen.map(item => ({
      fach: 'deutsch',
      schulstufe: effectiveGrade,
      grade: effectiveGrade,
      lehrplanRef: 'D-' + effectiveGrade + '-Sprachbetrachtung-Zeitformen',
      type: 'multiple-choice',
      icon: '⏳',
      question: `In welcher Zeitform steht der Satz:\n${item.sentence}?`,
      options: allTenses,
      correctIndex: allTenses.indexOf(item.tense),
      correctText: item.tense,
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 6. SILBENSCHWINGEN & SILBENKÖNIGE (1. & 2. Klasse)
  function buildSyllableTasks() {
    const pool = [
      { word: 'Schule', syllables: 'Schu - le', count: 2, vowels: 'u, e', hint: '💡 Sprich das Wort langsam und klatsche bei jedem Silbenbogen in die Hände!' },
      { word: 'Schmetterling', syllables: 'Schmet - ter - ling', count: 3, vowels: 'e, e, i', hint: '💡 Lege deine Hand unters Kinn: Wie oft geht dein Kinn beim Sprechen nach unten?' },
      { word: 'Igel', syllables: 'I - gel', count: 2, vowels: 'I, e', hint: '💡 Klatsche beim langsamen Sprechen mit: I - ...' },
      { word: 'Kinder', syllables: 'Kin - der', count: 2, vowels: 'i, e', hint: '💡 Sprich das Wort in Schritten und zähle deine Klatscher.' },
      { word: 'Sonnenblume', syllables: 'Son - nen - blu - me', count: 4, vowels: 'o, e, u, e', hint: '💡 Ein langes zusammengesetztes Wort: Klatsche jeden Teil sorgfältig ab.' },
      { word: 'Regenbogen', syllables: 'Re - gen - bo - gen', count: 4, vowels: 'e, e, o, e', hint: '💡 Zähle die Silbenbögen, während du das Wort langsam aussprichst.' },
      { word: 'Schneemann', syllables: 'Schnee - mann', count: 2, vowels: 'ee, a', hint: '💡 Sprich die zwei Wortteile langsam aus und achte auf die Selbstlaute (Silbenkönige).' },
      { word: 'Eichhörnchen', syllables: 'Eich - hörn - chen', count: 3, vowels: 'Ei, ö, e', hint: '💡 Achte auf die Laute: Jede Silbe hat genau einen Silbenkönig!' },
      { word: 'Schultasche', syllables: 'Schul - ta - sche', count: 3, vowels: 'u, a, e', hint: '💡 Sprich wie ein Roboter in Silben und klatsche im Takt mit.' },
      { word: 'Frosch', syllables: 'Frosch', count: 1, vowels: 'o', hint: '💡 Kannst du dieses kurze Wort zerlegen oder sprichst du es mit einem einzigen Atemzug?' }
    ];

    const chosen = shuffle(pool).slice(0, 5);
    const options = ['1 Silbe', '2 Silben', '3 Silben', '4 Silben'];

    return chosen.map(item => ({
      fach: 'deutsch',
      schulstufe: 1,
      grade: 1,
      lehrplanRef: 'D-1-Rechtschreiben-Silben',
      type: 'multiple-choice',
      icon: '👏',
      question: `Wie viele Silben (Silbenbögen) hat das Wort:\n„${item.word}“?`,
      options: options,
      correctIndex: item.count - 1,
      correctText: `${item.count} ${item.count === 1 ? 'Silbe' : 'Silben'}`,
      hint: item.hint,
      selectedText: null,
      isCorrect: null,
    }));
  }

  // 7. LESEVERSTÄNDNIS (PIRLS-Sachtexte für 3. & 4. Klasse)
  function buildReadingTasks() {
    const textsPool = [
      {
        id: 'eichhoernchen',
        title: 'Das Eichhörnchen – Der schlaue Waldgärtner',
        icon: '🐿️',
        text: 'Das Eichhörnchen ist ein flinkes Nagetier, das in unseren heimischen Wäldern und Parks lebt. Mit seinen scharfen Krallen kann es sogar kopfüber an Baumstämmen hinablaufen. Sein buschiger Schwanz dient beim Weitspringen von Ast zu Ast als wichtiges Steuer und im Winter als wärmende Decke. Im Herbst sammelt das Eichhörnchen fleißig Eicheln, Bucheckern, Zapfen und Haselnüsse. Es vergräbt diese Vorräte im Waldboden oder versteckt sie in Baumhöhlen für die kalte Jahreszeit. Weil das Eichhörnchen im Winter keinen echten Winterschlaf, sondern nur eine Winterruhe hält, wacht es an milden Tagen auf, um nach seinen Vorräten zu graben. Da es viele seiner Verstecke vergisst, keimen die vergrabenen Samen im Frühling. So hilft das Eichhörnchen ganz unbemerkt dabei, dass neue Bäume im Wald wachsen.',
        questions: [
          {
            q: 'Wofür nützt dem Eichhörnchen sein buschiger Schwanz?',
            options: [
              'Als Steuerruder beim Weitspringen und als wärmende Decke',
              'Ausschließlich zum schnellen Schwimmen im See',
              'Um Feinde damit in die Flucht zu schlagen',
              'Um Nüsse darin fest einzuwickeln'
            ],
            correct: 0,
            hint: 'Lies im 1. Abschnitt nach: Dort wird die Funktion des Schwanzes genau erklärt.'
          },
          {
            q: 'Wie verbringt das Eichhörnchen die kalte Winterzeit?',
            options: [
              'Es hält eine Winterruhe und wacht an milden Tagen zum Fressen auf',
              'Es schläft 7 Monate ununterbrochen durch (tiefer Winterschlaf)',
              'Es zieht wie die Zugvögel über das Meer in den Süden',
              'Es frisst im Winter ausschließlich Eis und Baumrinde'
            ],
            correct: 0,
            hint: 'Achte auf den Unterschied zwischen Winterschlaf und Winterruhe im Text.'
          },
          {
            q: 'Warum wird das Eichhörnchen als „Gärtner des Waldes“ bezeichnet?',
            options: [
              'Weil aus seinen vergessenen Vorräten im Frühling neue Bäume wachsen',
              'Weil es mit den Vorderpfoten Blumenbeete im Park anlegt',
              'Weil es den Waldboden mit dem Schwanz zusammenkehrt',
              'Weil es kranke Bäume mit den scharfen Zähnen fällt'
            ],
            correct: 0,
            hint: 'Was passiert mit den Samen, die das Eichhörnchen im Boden vergräbt und vergisst?'
          }
        ]
      },
      {
        id: 'donau',
        title: 'Die Donau – Österreichs mächtiger Strom',
        icon: '🌊',
        text: 'Die Donau ist nach der Wolga der zweitlängste Fluss unseres Kontinents Europa. Sie entspringt im deutschen Schwarzwald und fließt fast 2 850 Kilometer weit nach Osten, bis sie schließlich in das Schwarze Meer mündet. In Österreich durchfließt die Donau die drei Bundesländer Oberösterreich, Niederösterreich und Wien. Entlang des Flusses gibt es berühmte Landschaften wie die Wachau und den Nationalpark Donau-Auen. Dieser Nationalpark östlich von Wien schützt eine der letzten großen, unberührten Auenlandschaften Mitteleuropas. Hier finden bedrohte Tierarten wie der schillernde Eisvogel, der mächtige Seeadler und der fleißige Biber einen sicheren Lebensraum. Die Donau ist außerdem eine wichtige Schifffahrtsstraße und liefert mit ihren Wasserkraftwerken sauberen Ökostrom.',
        questions: [
          {
            q: 'In welches Meer mündet die Donau am Ende ihrer langen Reise?',
            options: [
              'In das Schwarze Meer',
              'In die Nordsee',
              'In das Mittelmeer',
              'In die Ostsee'
            ],
            correct: 0,
            hint: 'Lies im ersten Satz nach: Wohin fließt die Donau nach Osten?'
          },
          {
            q: 'Welche drei österreichischen Bundesländer durchquert die Donau?',
            options: [
              'Oberösterreich, Niederösterreich und Wien',
              'Tirol, Salzburg und Vorarlberg',
              'Kärnten, Steiermark und Burgenland',
              'Wien, Burgenland und Kärnten'
            ],
            correct: 0,
            hint: 'Schau genau auf die Bundesländer im 2. Abschnitt des Textes.'
          },
          {
            q: 'Welche seltenen Tiere finden im Nationalpark Donau-Auen Schutz?',
            options: [
              'Eisvogel, Seeadler und Biber',
              'Löwen, Giraffen und Zebras',
              'Steinböcke, Murmeltiere und Gämsen',
              'Pinguine, Robben und Eisbären'
            ],
            correct: 0,
            hint: 'Im 3. Abschnitt werden drei typische Auwaldtiere genannt.'
          }
        ]
      },
      {
        id: 'bienen',
        title: 'Das fleißige Bienenvolk',
        icon: '🐝',
        text: 'In einem Bienenstock herrscht vom Frühling bis zum Spätsommer emsiges Treiben. Ein einziges Bienenvolk kann aus bis zu 60 000 Bienen bestehen. An der Spitze steht die Bienenkönigin, deren wichtigste Aufgabe darin besteht, täglich bis zu 2 000 Eier zu legen. Die allermeisten Bewohnerinnen sind weibliche Arbeiterinnen. Sie haben im Laufe ihres Lebens viele verschiedene Berufe: Zuerst putzen sie die Waben, dann füttern sie die Larven, bewachen das Flugloch und fliegen schließlich als Sammelbienen aus, um Nektar und Pollen von Blüten zu holen. Wenn eine Sammelbiene eine ergiebige Blumenwiese entdeckt hat, zeigt sie ihren Schwestern im Stock mit einem kunstvollen Schwänzeltanz die Richtung und Entfernung der Nahrung an. Durch die Bestäubung sichern Bienen unsere Obst- und Gemüseernte.',
        questions: [
          {
            q: 'Welche Hauptaufgabe hat die Bienenkönigin im Bienenstock?',
            options: [
              'Sie legt täglich viele Eier für den Bienennachwuchs',
              'Sie fliegt den ganzen Tag aus und sammelt Nektar',
              'Sie bewacht allein den Eingang zum Bienenstock',
              'Sie baut die Waben aus Wachs'
            ],
            correct: 0,
            hint: 'Lies nach, wer im Bienenstock für die Eier zuständig ist.'
          },
          {
            q: 'Was teilt eine Biene ihren Artgenossinnen mit dem „Schwänzeltanz“ mit?',
            options: [
              'Die Richtung und Entfernung einer reichen Futterquelle',
              'Dass ein Gewitter aufzieht',
              'Dass der Honig fertig zum Naschen ist',
              'Sie tanzt nur zum Vergnügen mit den Jungbienen'
            ],
            correct: 0,
            hint: 'Welche Information steckt in den Tanzbewegungen der Sammelbiene?'
          },
          {
            q: 'Warum sind Bienen für uns Menschen und die Umwelt so nützlich?',
            options: [
              'Weil sie Blüten bestäuben und so für reiche Obst- und Gemüseernten sorgen',
              'Weil sie Unkraut auf den Feldern fressen',
              'Weil sie im Garten schädliche Blattläuse fangen',
              'Weil sie im Winter den Boden auflockern'
            ],
            correct: 0,
            hint: 'Lies den letzten Satz des Textes aufmerksam durch.'
          }
        ]
      },
      {
        id: 'murmeltiere',
        title: 'Die Murmeltiere in den Hohen Tauern',
        icon: '🏔️',
        text: 'Hoch oben auf den steinigen Almwiesen der österreichischen Alpen, besonders rund um den Großglockner, fühlt sich das Alpenmurmeltier wohl. Murmeltiere sind gesellige Tiere, die in großen Familienverbänden in tiefen Erdbauten leben. Droht Gefahr durch einen Steinadler aus der Luft oder einen Fuchs vom Boden, stößt das aufmerksame Wächter-Murmeltier einen lauten, schrillen Warnpfiff aus. Blitzschnell verschwinden dann alle Familienmitglieder in ihren sicheren Höhlen. Im Spätherbst fressen sich die Tiere eine dicke Fettschicht an, polstern ihre Schlafhöhle mit trockenem Heu aus und halten einen echten Winterschlaf, der bis zu sieben Monate dauern kann. Dabei sinkt die Körpertemperatur auf wenige Grad ab und das Herz schlägt nur noch ganz langsam, um die eisige Kälte zu überstehen.',
        questions: [
          {
            q: 'Wie warnen Murmeltiere ihre Familie vor herannahenden Feinden wie dem Adler?',
            options: [
              'Mit einem lauten, schrillen Warnpfiff',
              'Indem sie mit den Vorderpfoten trommeln',
              'Sie verfärben ihr Fell weiß wie der Schnee',
              'Sie werfen mit kleinen Kieselsteinen'
            ],
            correct: 0,
            hint: 'Welches Geräusch stößt das Wächter-Murmeltier bei Gefahr aus?'
          },
          {
            q: 'Wie lange kann der tiefe Winterschlaf der Alpenmurmeltiere dauern?',
            options: [
              'Bis zu sieben Monate',
              'Genau zwei Wochen',
              'Nur während der Weihnachtsferien',
              'Ein ganzes Jahr lang ohne Pause'
            ],
            correct: 0,
            hint: 'Im 4. Satz wird die Dauer des Winterschlafs genannt.'
          },
          {
            q: 'Was geschieht im Körper des Murmeltiers während des Winterschlafs?',
            options: [
              'Körpertemperatur und Herzschlag sinken stark ab, um Energie zu sparen',
              'Das Herz schlägt dreimal so schnell wie im Sommer',
              'Die Körpertemperatur steigt auf über 40 Grad Celsius',
              'Das Murmeltier wächst im Schlaf auf die doppelte Größe'
            ],
            correct: 0,
            hint: 'Wie spart das Murmeltier in der kalten Schlafhöhle lebenswichtige Energie?'
          }
        ]
      }
    ];

    const chosen = shuffle(textsPool).slice(0, 1); // 1 vollständiger Sachtext mit 3 gezielten Verständnisfragen
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

  return {
    buildWordTypesTasks: buildWordTypesTasks,
    buildCapitalizationTasks: buildCapitalizationTasks,
    buildScrambleTasks: buildScrambleTasks,
    buildCasesTasks: buildCasesTasks,
    buildTensesTasks: buildTensesTasks,
    buildSyllableTasks: buildSyllableTasks,
    buildReadingTasks: buildReadingTasks,
  };
})();
