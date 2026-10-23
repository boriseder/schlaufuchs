// =============================================================
// SCHLAUFUCHS – tests/audio.test.mjs
// Unit-Tests für Audio & Text-to-Speech (js/audio.js)
// Garantiert: Harte Regel 6 (KEINE FEHLERTÖNE), Mute-Logik, de-AT TTS
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createAudioSandbox() {
  const store = new Map();
  const mockStorage = {
    schreiben: (k, v) => store.set(k, v),
    lesen: (k) => store.get(k),
    entfernen: (k) => store.delete(k)
  };

  const spokenUtterances = [];
  const mockSpeechSynthesis = {
    spokenUtterances,
    cancel: () => {},
    speak: (utt) => spokenUtterances.push(utt),
    getVoices: () => [
      { lang: 'en-US', name: 'Samantha' },
      { lang: 'de-DE', name: 'Anna' },
      { lang: 'de-AT', name: 'Florian (Österreich)' }
    ]
  };

  const createdOscillators = [];
  class MockOscillator {
    constructor() {
      this.type = 'sine';
      this.frequency = {
        setValueAtTime: (freq, t) => { this.freq = freq; }
      };
      createdOscillators.push(this);
    }
    connect() {}
    start() {}
    stop() {}
  }

  class MockGain {
    constructor() {
      this.gain = {
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      };
    }
    connect() {}
  }

  class MockAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
      this.state = 'running';
    }
    createOscillator() { return new MockOscillator(); }
    createGain() { return new MockGain(); }
    resume() {}
  }

  const domElements = new Map();
  const getOrCreate = (id) => {
    if (!domElements.has(id)) {
      domElements.set(id, {
        id,
        className: '',
        innerHTML: '',
        title: '',
        classList: {
          _c: new Set(),
          add(c) { this._c.add(c); },
          remove(c) { this._c.delete(c); },
          contains(c) { return this._c.has(c); }
        },
        addEventListener: () => {}
      });
    }
    return domElements.get(id);
  };

  const sandbox = {
    window: {},
    document: {
      createElement: (tag) => {
        const el = getOrCreate(`elem-${Math.random()}`);
        el.tagName = tag.toUpperCase();
        return el;
      },
      getElementById: (id) => getOrCreate(id)
    },
    AudioContext: MockAudioContext,
    speechSynthesis: mockSpeechSynthesis,
    SpeechSynthesisUtterance: function(text) {
      this.text = text;
      this.lang = '';
      this.rate = 1;
      this.pitch = 1;
    },
    Math: Math
  };
  sandbox.window = sandbox;

  sandbox.window.Schlaufuchs = {
    Storage: mockStorage
  };

  vm.runInNewContext(readFileSync('js/audio.js', 'utf8'), sandbox);

  return {
    Audio: sandbox.window.Schlaufuchs.Audio,
    spokenUtterances,
    createdOscillators,
    mockStorage
  };
}

test('Audio Regel 6: Unter keinen Umständen existieren Fehlertöne oder negative Geräusche', () => {
  const { Audio } = createAudioSandbox();

  // Harte AGENTS.md Regel 6: "keine Fehlertöne"
  assert.equal(Audio.playError, undefined, 'playError darf nicht existieren');
  assert.equal(Audio.playBuzzer, undefined, 'playBuzzer darf nicht existieren');
  assert.equal(Audio.playWrong, undefined, 'playWrong darf nicht existieren');
  assert.equal(Audio.playFail, undefined, 'playFail darf nicht existieren');

  // Prüfen aller exportierten Methoden-Namen: Keine negativen Signalbegriffe
  const methodNames = Object.keys(Audio);
  const forbiddenTerms = ['error', 'wrong', 'fail', 'bad', 'loss', 'buzzer', 'falsch'];

  for (const name of methodNames) {
    for (const term of forbiddenTerms) {
      assert.ok(
        !name.toLowerCase().includes(term),
        `Audio-Methode "${name}" verstößt gegen Regel 6 (enthält negatives Signalwort "${term}")`
      );
    }
  }
});

test('Audio: Stummschaltung (Mute) und Synthesizer-Steuerung', () => {
  const { Audio, createdOscillators, mockStorage } = createAudioSandbox();

  // 1. Initialer Zustand
  assert.equal(Audio.isMuted(), false, 'Standardmäßig ist Ton aktiv');

  // 2. Positiver Erfolgston erzeugt harmonische Oszillatoren
  createdOscillators.length = 0;
  Audio.playSuccess();
  assert.ok(createdOscillators.length > 0, 'playSuccess muss Töne synthetisieren');

  // 3. Stummschalten
  Audio.setMuted(true);
  assert.equal(Audio.isMuted(), true);

  // 4. Im stummen Zustand dürfen keine Töne synthetisiert werden
  createdOscillators.length = 0;
  Audio.playSuccess();
  Audio.playPlop();
  Audio.playFanfare();
  Audio.playBoosterOpen();
  assert.equal(createdOscillators.length, 0, 'Im stummen Zustand dürfen keine Oszillatoren starten');

  // 5. Toggle persistiert im Storage
  Audio.toggleMute();
  assert.equal(Audio.isMuted(), false);
  assert.equal(mockStorage.lesen('muted'), false, 'Mute-Status muss im Storage gespeichert werden');
});

test('Audio: Text-to-Speech (TTS) bereinigt Symbole und nutzt de-AT Stimme', () => {
  const { Audio, spokenUtterances } = createAudioSandbox();

  Audio.speakText('Rechne: 15 + 7 = ?');
  assert.equal(spokenUtterances.length, 1);

  const utt = spokenUtterances[0];
  assert.equal(utt.lang, 'de-AT', 'TTS muss für Österreich de-AT nutzen');
  assert.equal(utt.voice.lang, 'de-AT', 'Muss verfügbare de-AT Stimme wählen');
  assert.ok(!utt.text.includes('='), 'Gleichheitszeichen muss für Sprachfluss bereinigt werden');
  assert.ok(!utt.text.includes('?'), 'Fragezeichen muss bereinigt werden');
  assert.ok(utt.rate <= 0.95, 'Sprechgeschwindigkeit muss für Erstleser verlangsamt sein (<= 0.95)');
});

test('Audio: Lautsprecher-Button ist barrierefrei und nutzt lokales ton-an.svg', () => {
  const { Audio } = createAudioSandbox();

  const btn = Audio.createSpeakerButton('Ein kleiner Fuchs im Wald.');
  assert.ok(btn, 'Button muss erzeugt werden');
  assert.equal(btn.type, 'button');
  assert.equal(btn.className, 'btn-speaker');
  assert.ok(btn.innerHTML.includes('assets/icons/ton-an.svg'), 'Muss lokales SVG ton-an.svg nutzen');
  assert.ok(btn.innerHTML.includes('alt="Vorlesen"'), 'Muss Barrierefreiheits-Alt-Text besitzen');
  assert.equal(btn.title, 'Aufgabe vorlesen lassen');
});
