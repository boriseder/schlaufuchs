// =============================================================
// SCHLAUFUCHS – tests/stickers.test.mjs
// Unit-Tests für Sticker-Album & Trophäen-Kabinett (js/stickers.js)
// Garantiert: Päckchen-Mathematik, faire Belohnung (Regel 6) & Trophäen
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createStickersSandbox(customProfile = null) {
  let profile = customProfile || {
    id: 'p1',
    name: 'Nils',
    grades: [1, 2, 3],
    stars: {},
    openedPacks: 0,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1']
  };

  const store = new Map();
  const mockStorage = {
    schreiben: (k, v) => store.set(k, v),
    lesen: (k) => store.get(k),
    entfernen: (k) => store.delete(k)
  };

  const mockState = {
    getActiveProfile: () => profile,
    loadAllProfiles: () => [profile],
    saveAllProfiles: (all) => { profile = all[0]; },
    notify: () => {},
    subscribe: () => () => {}
  };

  const sandbox = {
    window: {},
    document: {
      getElementById: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, textContent: '' })
    },
    Math: Math
  };
  sandbox.window = sandbox;
  sandbox.window.Schlaufuchs = {
    Storage: mockStorage,
    State: mockState,
    Audio: { playBoosterOpen: () => {}, playFanfare: () => {}, playStickerReward: () => {} },
    Dialog: { alert: () => {} }
  };

  vm.runInNewContext(readFileSync('js/stickers.js', 'utf8'), sandbox);

  return {
    Stickers: sandbox.window.Schlaufuchs.Stickers,
    getProfile: () => profile,
    setProfile: (p) => { profile = p; }
  };
}

test('Stickers: Registrierte Sticker & Trophäen sind vollständig und wohlgeformt', () => {
  const { Stickers } = createStickersSandbox();

  assert.ok(Array.isArray(Stickers.ALL_STICKERS), 'ALL_STICKERS muss Array sein');
  assert.equal(Stickers.ALL_STICKERS.length, 16, 'Genau 16 Sammelsticker im Album');

  const stickerIds = new Set();
  Stickers.ALL_STICKERS.forEach(s => {
    assert.ok(s.id, 'Sticker muss ID haben');
    assert.ok(s.name, 'Sticker muss Namen haben');
    assert.ok(s.icon, 'Sticker muss Icon haben');
    assert.ok(s.desc, 'Sticker muss Beschreibung haben');
    assert.ok(!stickerIds.has(s.id), `Doppelte Sticker-ID: ${s.id}`);
    stickerIds.add(s.id);
  });

  assert.ok(Array.isArray(Stickers.TROPHIES), 'TROPHIES muss Array sein');
  assert.equal(Stickers.TROPHIES.length, 6, 'Genau 6 didaktische Trophäen');

  Stickers.TROPHIES.forEach(t => {
    assert.ok(t.id, 'Trophäe muss ID haben');
    assert.ok(t.name, 'Trophäe muss Namen haben');
    assert.equal(typeof t.check, 'function', 'Trophäe muss check-Funktion haben');
  });
});

test('Stickers: Deterministische Freischaltung (unlockNextSticker garantiert neue Sticker bis zum vollen Album, Regel 6)', () => {
  const { Stickers, getProfile } = createStickersSandbox({
    id: 'p1',
    stars: {},
    openedPacks: 0,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1']
  });

  // Deterministisches Freischalten bis alle 16 Sticker im Album sind
  for (let i = 0; i < 15; i++) {
    const prevCount = getProfile().unlockedStickers.length;
    const res = Stickers.unlockNextSticker();
    assert.ok(res && res.sticker, `Sticker muss freigeschaltet werden (Schritt ${i + 1})`);
    assert.equal(res.isNew, true, 'Neuer Sticker muss als neu markiert sein');
    assert.equal(
      getProfile().unlockedStickers.length,
      prevCount + 1,
      'Solange das Album nicht voll ist, muss jede Freischaltung genau einen neuen Sticker hinzufügen'
    );
  }

  assert.equal(getProfile().unlockedStickers.length, 16, 'Alle 16 Sticker müssen freigeschaltet sein');
  assert.equal(new Set(getProfile().unlockedStickers).size, 16, 'Alle 16 Sticker müssen einzigartig sein');

  // Nach 16 Stickern
  const finalRes = Stickers.unlockNextSticker();
  assert.equal(finalRes.isNew, false, 'Nach vollem Album keine Neu-Markierung');
  assert.equal(finalRes.allCompleted, true, 'Sollte allCompleted signalisieren');
});

test('Stickers: Schatzkisten-Geheimwort schaltet deterministisch nächstes Sammelbild frei', () => {
  const { Stickers, getProfile } = createStickersSandbox({
    id: 'p1',
    stars: {},
    unlockedStickers: ['s1']
  });

  const res = Stickers.redeemTreasureWord('FUCHS');
  assert.equal(res.success, true);
  assert.equal(getProfile().unlockedStickers.length, 2, 'Geheimwort muss nächsten Sticker freischalten');
  assert.equal(getProfile().redeemedTreasureWords.includes('FUCHS'), true);

  // Doppelte Eingabe wird freundlich abgefangen
  const resDup = Stickers.redeemTreasureWord('FUCHS');
  assert.equal(resDup.success, false);
});

test('Stickers: Trophäen-Bedingungen schalten nach didaktischem Fortschritt frei', () => {
  const { Stickers } = createStickersSandbox();
  const getTrophy = (id) => Stickers.TROPHIES.find(t => t.id === id);

  // 1. t_first (Erster Schritt)
  assert.equal(getTrophy('t_first').check({ stars: {} }), false);
  assert.equal(getTrophy('t_first').check({ stars: { 'math-addition': 1 } }), true);

  // 2. t_math (In 3 Mathe-Themen geübt)
  assert.equal(getTrophy('t_math').check({ stars: { 'math-addition': 2, 'math-subtraction': 1 } }), false);
  assert.equal(getTrophy('t_math').check({ stars: { 'math-addition': 1, 'math-subtraction': 1, 'math-pyramid': 1 } }), true);

  // 3. t_german (In 2 Deutsch-Themen geübt)
  assert.equal(getTrophy('t_german').check({ stars: { 'german-nouns': 1 } }), false);
  assert.equal(getTrophy('t_german').check({ stars: { 'german-nouns': 1, 'german-verbs': 1 } }), true);

  // 4. t_traffic (Radfahrprüfung gemeistert)
  assert.equal(getTrophy('t_traffic').check({ stars: { 'general-bike-test': 1 } }), false);
  assert.equal(getTrophy('t_traffic').check({ stars: { 'general-bike-test': 2 } }), true);

  // 5. t_star50 (Mindestens 15 Sterne)
  assert.equal(getTrophy('t_star50').check({ stars: { 'm1': 5, 'm2': 5, 'm3': 4 } }), false); // 14 Sterne
  assert.equal(getTrophy('t_star50').check({ stars: { 'm1': 5, 'm2': 5, 'm3': 5 } }), true);  // 15 Sterne
});
