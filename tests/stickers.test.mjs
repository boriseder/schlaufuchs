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
    Audio: { playBoosterOpen: () => {} },
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

test('Stickers: Päckchen-Mathematik (1 Starter + 1 je 5 Sterne)', () => {
  const { Stickers, setProfile } = createStickersSandbox();

  // 1. Neuer Nutzer mit 0 Sternen -> genau 1 Starter-Päckchen
  setProfile({
    id: 'p1',
    stars: {},
    openedPacks: 0,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1']
  });
  assert.equal(Stickers.getAvailablePacksCount(), 1, 'Start mit 1 Starter-Päckchen');

  // 2. 4 Sterne gesammelt -> noch immer 1 Päckchen
  setProfile({
    id: 'p1',
    stars: { 'math-addition': 4 },
    openedPacks: 0,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1']
  });
  assert.equal(Stickers.getAvailablePacksCount(), 1, 'Bei 4 Sternen bleibt es bei 1 Päckchen');

  // 3. 5 Sterne gesammelt -> 2 Päckchen
  setProfile({
    id: 'p1',
    stars: { 'math-addition': 5 },
    openedPacks: 0,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1']
  });
  assert.equal(Stickers.getAvailablePacksCount(), 2, 'Ab 5 Sternen schaltet 2. Päckchen frei');

  // 4. 1 Päckchen bereits geöffnet -> 1 übrig
  setProfile({
    id: 'p1',
    stars: { 'math-addition': 5 },
    openedPacks: 1,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1', 's2']
  });
  assert.equal(Stickers.getAvailablePacksCount(), 1);

  // 5. 14 Sterne gesammelt (Opened: 1) -> 1 + Math.floor(14/5) - 1 = 2 verfügbar
  setProfile({
    id: 'p1',
    stars: { 'math-addition': 8, 'math-subtraction': 6 },
    openedPacks: 1,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1', 's2']
  });
  assert.equal(Stickers.getAvailablePacksCount(), 2);

  // 6. Bonus-Päckchen aus Offline-Schatzkiste
  setProfile({
    id: 'p1',
    stars: { 'math-addition': 5 },
    openedPacks: 2,
    bonusTreasurePacks: 1, // Bonus aus Knick-Rätsel
    unlockedStickers: ['s1', 's2']
  });
  assert.equal(Stickers.getAvailablePacksCount(), 1, 'Bonus-Schatzkiste erhöht Päckchenanzahl');
});

test('Stickers: Faire Ziehung (openBoosterPack garantiert neue Sticker bis zum vollen Album)', () => {
  const { Stickers, getProfile } = createStickersSandbox({
    id: 'p1',
    stars: { 'all': 100 }, // viele Sterne für viele Päckchen
    openedPacks: 0,
    bonusTreasurePacks: 0,
    unlockedStickers: ['s1']
  });

  // Ziehen bis alle 16 Sticker freigeschaltet sind
  for (let i = 0; i < 15; i++) {
    const prevCount = getProfile().unlockedStickers.length;
    const sticker = Stickers.openBoosterPack();
    assert.ok(sticker, `Sticker muss gezogen werden (Durchlauf ${i + 1})`);
    assert.equal(
      getProfile().unlockedStickers.length,
      prevCount + 1,
      'Solange das Album nicht voll ist, muss jeder Zug einen NEUEN Sticker liefern (keine Nieten)'
    );
  }

  assert.equal(getProfile().unlockedStickers.length, 16, 'Alle 16 Sticker müssen freigeschaltet sein');
  assert.equal(new Set(getProfile().unlockedStickers).size, 16, 'Alle 16 Sticker müssen einzigartig sein');
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
