// =============================================================
// SCHLAUFUCHS – js/audio.js
// 1. Text-to-Speech (Vorlesefunktion für Erstleser via Web Speech API)
// 2. Generativer Web Audio API Synthesizer (100% Offline, keine MP3s)
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Audio = (function () {
  'use strict';

  let audioCtx = null;
  let isMuted = false;
  try {
    const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
    if (Storage) isMuted = Boolean(Storage.lesen('muted'));
  } catch (e) {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // --- 1. TEXT-TO-SPEECH (VORLESEFUNKTION) ---

  function speakText(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Vorherige Wiedergabe abbrechen

    const cleanText = (text || '')
      .replace(/[+\u2212\u2795\u2796\u2716\u00B7:=?_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-AT';
    utterance.rate = 0.92; // Etwas langsamer für Erstleser
    utterance.pitch = 1.05; // Freundliche, kindgerechte Tonhöhe

    // Verfügbare Stimmen prüfen: de-AT bevorzugen, sonst de-DE
    const voices = window.speechSynthesis.getVoices();
    const austrianVoice = voices.find(v => v.lang === 'de-AT' || v.lang.startsWith('de_AT'));
    const germanVoice = voices.find(v => v.lang.startsWith('de'));

    if (austrianVoice) {
      utterance.voice = austrianVoice;
    } else if (germanVoice) {
      utterance.voice = germanVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  function createSpeakerButton(textToSpeak) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-speaker';
    btn.title = 'Aufgabe vorlesen lassen';
    btn.innerHTML = '<img src="assets/icons/ton-an.svg" class="speaker-icon-svg" alt="Vorlesen">';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      speakText(textToSpeak);
      btn.classList.add('is-speaking');
      setTimeout(() => btn.classList.remove('is-speaking'), 1200);
    });
    return btn;
  }

  // --- 2. GENERATIVE SOUNDEFFEKTE (WEB AUDIO API SYNTHESIZER) ---

  function playSuccess() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonischer Dreiklang: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }

  function playPlop() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Weicher Frequenzabfall (180Hz -> 80Hz)
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  function playFanfare() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Jubel-Akkordfolge: G4, C5, E5, G5, hohes C6
    const chord = [
      { f: 392.00, t: 0.0,  d: 0.15 },
      { f: 523.25, t: 0.12, d: 0.15 },
      { f: 659.25, t: 0.24, d: 0.18 },
      { f: 783.99, t: 0.36, d: 0.25 },
      { f: 1046.50, t: 0.55, d: 0.80 }
    ];

    chord.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0, now + note.t);
      gain.gain.linearRampToValueAtTime(0.2, now + note.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.01);
    });
  }

  function playStickerReward() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Ruhiger, freundlicher Glitzer-Klang für Sammelbilder
    for (let i = 0; i < 7; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = 600 + i * 150 + Math.random() * 80;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.21);
    }
  }

  function setMuted(muted) {
    isMuted = Boolean(muted);
  }

  function toggleMute() {
    isMuted = !isMuted;
    try {
      const Storage = window.Schlaufuchs && window.Schlaufuchs.Storage;
      if (Storage) Storage.schreiben('muted', isMuted);
    } catch (e) {}
    return isMuted;
  }

  return {
    speakText: speakText,
    createSpeakerButton: createSpeakerButton,
    playSuccess: playSuccess,
    playPlop: playPlop,
    playFanfare: playFanfare,
    playStickerReward: playStickerReward,
    playBoosterOpen: playStickerReward,
    setMuted: setMuted,
    toggleMute: toggleMute,
    isMuted: () => isMuted
  };
})();
