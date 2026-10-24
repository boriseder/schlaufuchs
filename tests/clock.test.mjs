// =============================================================
// SCHLAUFUCHS – tests/clock.test.mjs
// Unit- & Didaktik-Tests für das Uhrzeit-Themengebiet (Clock)
// Prüft: Zeigerdynamik, Winkel-Mathematik, österreichischen Lehrplan & A4-Druck
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createClockSandbox() {
  const sandbox = {
    window: {},
    Math: Math
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/core/random.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/format.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/core/topics.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/clock.js', 'utf8'), sandbox);
  vm.runInNewContext(`window.Schlaufuchs.State = { getActiveGrades: () => [1, 2, 3, 4] };`, sandbox);
  vm.runInNewContext(readFileSync('js/generators/math.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/generators/index.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/print-engine.js', 'utf8'), sandbox);

  return {
    Clock: sandbox.window.Schlaufuchs.Clock,
    MathGen: sandbox.window.Schlaufuchs.Generators.Math,
    PrintEngine: sandbox.window.Schlaufuchs.PrintEngine
  };
}

test('Clock: createClockSvg erzeugt valides, barrierefreies SVG ohne Verläufe', () => {
  const { Clock } = createClockSandbox();
  const svg = Clock.createClockSvg(8, 30, { size: 160 });

  assert.ok(svg.startsWith('<svg'), 'Muss ein SVG-Element beginnen');
  assert.ok(svg.includes('viewBox="0 0 200 200"'), 'Muss ein 200x200 viewBox besitzen');
  assert.ok(svg.includes('role="img"'), 'Muss barrierefreie Rolle role="img" haben');
  assert.ok(svg.includes('aria-label="Analoge Uhr: halb 9 (08:30 Uhr)"'), 'Aria-Label muss korrekte Uhrzeit enthalten');
  assert.ok(!svg.includes('linearGradient') && !svg.includes('radialGradient'), 'Keine Verläufe (Regel Anti-KI-Optik)');
  assert.ok(!svg.includes('infinite'), 'Keine Dauer-Animationen');

  // Prüfen, ob alle Stundenzahlen 1 bis 12 enthalten sind
  for (let num = 1; num <= 12; num++) {
    assert.ok(svg.includes(`>${num}</text>`), `Stundenzahl ${num} muss im Zifferblatt gerendert werden`);
  }
});

test('Clock: Didaktische Zeigerdynamik (Winkel & Positionen fachlich exakt)', () => {
  const { Clock } = createClockSandbox();

  // 1. Bei 12:00 stehen beide Zeiger senkrecht nach oben (x = 100, y < 100)
  const svg12 = Clock.createClockSvg(12, 0);
  assert.ok(svg12.includes('class="clock-hand-hour"'), 'Stundenzeiger vorhanden');
  assert.ok(svg12.includes('class="clock-hand-minute"'), 'Minutenzeiger vorhanden');
  assert.ok(svg12.includes('x2="100.0" y2="54.0"'), 'Stundenzeiger zeigt bei 12:00 gerade nach oben');
  assert.ok(svg12.includes('x2="100.0" y2="32.0"'), 'Minutenzeiger zeigt bei 12:00 gerade nach oben');

  // 2. Bei 3:00 zeigt der Stundenzeiger waagerecht nach rechts (y = 100, x > 100)
  const svg3 = Clock.createClockSvg(3, 0);
  assert.ok(svg3.includes('x2="146.0" y2="100.0"'), 'Stundenzeiger zeigt bei 3:00 waagerecht nach rechts');

  // 3. Bei 6:30 (halb 7) steht der Stundenzeiger genau zwischen 6 und 7 (195 Grad)
  // Bei 195 Grad: x = 100 + 46 * cos(105 Grad) = 100 - 11.9 = 88.1, y = 100 + 46 * sin(105 Grad) = 144.4
  const svgHalf = Clock.createClockSvg(6, 30);
  assert.ok(svgHalf.includes('x2="88.1" y2="144.4"'), 'Stundenzeiger muss bei halb 7 genau zwischen 6 und 7 stehen');
  assert.ok(svgHalf.includes('x2="100.0" y2="168.0"'), 'Minutenzeiger zeigt bei :30 genau senkrecht nach unten auf die 6');

  // 4. hands: false erzeugt ein leeres Zifferblatt für Einzeichen-Aufgaben
  const svgBlank = Clock.createClockSvg(0, 0, { hands: false });
  assert.ok(!svgBlank.includes('class="clock-hand-hour"'), 'Keine Zeiger bei hands: false');
  assert.ok(!svgBlank.includes('class="clock-hand-minute"'), 'Keine Zeiger bei hands: false');
});

test('Clock: describeTimeText verwendet österreichische Schulbuch-Sprechweisen', () => {
  const { Clock } = createClockSandbox();

  assert.equal(Clock.describeTimeText(8, 0), '8 Uhr');
  assert.equal(Clock.describeTimeText(8, 15), 'viertel nach 8');
  assert.equal(Clock.describeTimeText(8, 30), 'halb 9');
  assert.equal(Clock.describeTimeText(8, 45), 'viertel vor 9');
  assert.equal(Clock.describeTimeText(12, 30), 'halb 1');
  assert.equal(Clock.describeTimeText(11, 45), 'viertel vor 12');
});

test('Clock: parseTimeInput liest Kindereingaben tolerant', () => {
  const { Clock } = createClockSandbox();

  // Zahl allein
  const r1 = Clock.parseTimeInput('8');
  assert.equal(r1.hours, 8);
  assert.equal(r1.minutes, 0);

  const r2 = Clock.parseTimeInput(' 12 ');
  assert.equal(r2.hours, 12);
  assert.equal(r2.minutes, 0);

  // Mit Doppelpunkt oder Punkt
  const r3 = Clock.parseTimeInput('08:00');
  assert.equal(r3.hours, 8);
  assert.equal(r3.minutes, 0);

  const r4 = Clock.parseTimeInput('8:30');
  assert.equal(r4.hours, 8);
  assert.equal(r4.minutes, 30);

  const r5 = Clock.parseTimeInput('14.45');
  assert.equal(r5.hours, 14);
  assert.equal(r5.minutes, 45);

  const r6 = Clock.parseTimeInput('14:30 Uhr');
  assert.equal(r6.hours, 14);
  assert.equal(r6.minutes, 30);

  // Ungültig
  assert.equal(Clock.parseTimeInput('hallo'), null);
  assert.equal(Clock.parseTimeInput(''), null);
  assert.equal(Clock.parseTimeInput(null), null);
});

test('Generatoren: buildClockTasks deckt 1. bis 4. Schulstufe lehrplangerecht ab', () => {
  const { MathGen } = createClockSandbox();
  const tasks = MathGen.buildClockTasks();

  assert.ok(tasks && tasks.length === 5, 'Muss 5 Aufgaben für die Serie generieren');

  tasks.forEach(t => {
    assert.equal(t.fach, 'mathe');
    assert.ok([1, 2, 3, 4].includes(t.schulstufe));
    assert.ok(t.lehrplanRef.includes('Groessen-Uhrzeit'));
    assert.ok(t.question && t.question.length > 0);
    assert.ok(t.hint && t.hint.length > 0);
    assert.ok(t.type === 'clock' || t.type === 'clock-choice', `Online-Aufgabentyp muss 'clock' oder 'clock-choice' sein (kein Ziffernblock), war '${t.type}'`);

    // Didaktische Formulierung: Keine holprigen Klammer-Artefakte wie "(09:00 Uhr)" in der Frage
    assert.ok(!t.question.includes('(0') && !t.question.includes('(1') && !t.question.includes('(2'),
      'Fragen dürfen keine störenden Zeitklammern enthalten: ' + t.question);
  });
});

test('Clock: clock-choice Aufgaben bieten 4 Zifferblätter mit Zeiger-Distraktoren', () => {
  const { MathGen } = createClockSandbox();

  let foundClockChoice = false;
  for (let i = 0; i < 20; i++) {
    const tasks = MathGen.buildClockTasks();
    const choiceTask = tasks.find(t => t.type === 'clock-choice');
    if (choiceTask) {
      foundClockChoice = true;
      assert.ok(choiceTask.options && choiceTask.options.length === 4, 'Muss exakt 4 Zifferblatt-Optionen bieten');
      assert.ok(choiceTask.correctIndex >= 0 && choiceTask.correctIndex < 4, 'correctIndex muss zwischen 0 und 3 liegen');
      assert.ok(choiceTask.prompt && choiceTask.prompt.length > 0, 'Prompt muss vorhanden sein');
      assert.ok(choiceTask.targetText && choiceTask.targetText.length > 0, 'TargetText muss vorhanden sein');

      // Prüfen, ob die richtige Option wirklich als isCorrect markiert ist
      assert.equal(choiceTask.options[choiceTask.correctIndex].isCorrect, true);

      // Prüfen, ob mindestens ein Distraktor nicht korrekt ist
      const wrongOpts = choiceTask.options.filter(o => !o.isCorrect);
      assert.equal(wrongOpts.length, 3, 'Muss genau 3 falsche Distraktoren haben');
      break;
    }
  }
  assert.ok(foundClockChoice, 'Es muss mindestens eine clock-choice Aufgabe generiert werden');
});

test('Clock: Online-Aufgaben nutzen ausschließlich clock und clock-choice (kein Ziffernblock)', () => {
  const { MathGen } = createClockSandbox();

  for (let i = 0; i < 30; i++) {
    const tasks = MathGen.buildClockTasks();
    tasks.forEach(t => {
      assert.notEqual(t.type, 'clock-set', 'Online-Aufgaben dürfen keinen Ziffernblock (clock-set) mehr enthalten');
      assert.ok(t.type === 'clock' || t.type === 'clock-choice');
    });
  }
});

test('PrintEngine: A4-Arbeitsblatt Uhrzeit nutzt clock-set für hands: false Einzeichen-Aufgaben', () => {
  const { PrintEngine } = createClockSandbox();
  const tasksG1 = PrintEngine.generateWorksheetTasks('math-clock', 1);

  assert.equal(tasksG1.length, 6, 'Muss 6 Aufgaben generieren');
  // 1–3 Ablesen
  for (let i = 0; i < 3; i++) {
    assert.equal(tasksG1[i].type, 'clock');
    assert.equal(tasksG1[i].promptType, 'hour-only');
  }
  // 4–6 Einzeichnen
  for (let i = 3; i < 6; i++) {
    assert.equal(tasksG1[i].type, 'clock-set');
    assert.equal(tasksG1[i].promptType, 'draw-hands');
  }
});

test('Generatoren: buildMoneyTasks deckt 1. bis 4. Schulstufe mit Euro & Cent ab', () => {
  const { MathGen } = createClockSandbox();
  const tasks = MathGen.buildMoneyTasks();

  assert.ok(tasks && tasks.length === 5, 'Muss 5 Geld-Aufgaben generieren');

  tasks.forEach(t => {
    assert.equal(t.fach, 'mathe');
    assert.ok([1, 2, 3, 4].includes(t.schulstufe));
    assert.ok(t.lehrplanRef.includes('Groessen-Geld'));
    assert.ok(t.question && t.question.length > 0);
    assert.ok(t.hint && t.hint.length > 0);
    assert.ok(t.answer !== undefined);
  });
});
