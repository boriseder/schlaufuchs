// =============================================================
// SCHLAUFUCHS – tests/admin.test.mjs
// Unit-Tests für Admin-Bereich & Kindersicherung (js/admin.js)
// Prüft: Sicherheits-Gate (Mathe/PIN), Cooldown, Stufen-Konfiguration & Profile
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createAdminSandbox() {
  const store = new Map();
  const mockStorage = {
    schreiben: (k, v) => store.set(k, v),
    lesen: (k) => store.get(k),
    entfernen: (k) => store.delete(k)
  };

  const domElements = new Map();
  const eventListeners = new Map();

  const getOrCreate = (id) => {
    if (!domElements.has(id)) {
      const attrs = new Map();
      const elem = {
        id,
        style: {},
        innerHTML: '',
        textContent: '',
        value: '',
        checked: false,
        classList: {
          _c: new Set(),
          add(c) { this._c.add(c); },
          remove(c) { this._c.delete(c); },
          contains(c) { return this._c.has(c); }
        },
        getAttribute: (k) => attrs.get(k) || null,
        setAttribute: (k, v) => attrs.set(k, String(v)),
        removeAttribute: (k) => attrs.delete(k),
        appendChild: (child) => child,
        addEventListener: (evt, fn) => {
          if (!eventListeners.has(id)) eventListeners.set(id, new Map());
          const map = eventListeners.get(id);
          if (!map.has(evt)) map.set(evt, []);
          map.get(evt).push(fn);
        },
        dispatchEvent: (event) => {
          const map = eventListeners.get(id);
          if (map && map.has(event.type)) {
            map.get(event.type).forEach(fn => fn(event));
          }
        },
        click: () => {
          elem.dispatchEvent({ type: 'click', target: elem });
        },
        submit: () => {
          elem.dispatchEvent({ type: 'submit', preventDefault: () => {} });
        },
        cloneNode: () => elem,
        parentNode: {
          replaceChild: () => {}
        },
        querySelector: (sel) => null,
        querySelectorAll: (sel) => [],
        focus: () => {}
      };
      domElements.set(id, elem);
    }
    return domElements.get(id);
  };

  const sandbox = {
    window: {},
    document: {
      getElementById: (id) => getOrCreate(id),
      createElement: (tag) => getOrCreate(`elem-${Math.random()}`),
      querySelectorAll: () => [],
      querySelector: () => null,
      body: { classList: { add: () => {}, remove: () => {} } }
    },
    Math: Math,
    Date: Date,
    setTimeout: (fn) => fn()
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/core/storage.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/state.js', 'utf8'), sandbox);
  vm.runInNewContext(readFileSync('js/admin.js', 'utf8'), sandbox);

  return {
    Admin: sandbox.window.Schlaufuchs.Admin,
    State: sandbox.window.Schlaufuchs.State,
    getElem: (id) => getOrCreate(id)
  };
}

test('Admin: Sicherheits-Gate verwehrt unbefugten Zugriff und verarbeitet Mathe-Challenge', () => {
  const { Admin, getElem } = createAdminSandbox();

  Admin.init();
  assert.equal(Admin.isGatePassed(), false, 'Admin-Bereich muss standardmäßig gesperrt sein');

  const adminBtn = getElem('btn-admin-settings');
  const gateForm = getElem('admin-gate-form');
  const gateInput = getElem('admin-gate-input');
  const gateError = getElem('admin-gate-error');
  const gateQuestion = getElem('admin-gate-question');
  const settingsPanel = getElem('admin-settings-panel');

  // Modal öffnen
  adminBtn.click();
  assert.ok(
    gateQuestion.textContent.includes('Sicherheitsfrage für Erwachsene'),
    'Mathe-Aufgabe für Erwachsene muss gestellt werden'
  );

  // 1. Falsche Eingabe
  gateInput.value = '99999';
  gateForm.submit();
  assert.equal(Admin.isGatePassed(), false, 'Falsche Antwort darf keinen Zutritt gewähren');
  assert.equal(gateError.style.display, 'block');

  // 2. Richtige Lösung aus dem Fragentext berechnen
  let expected = 0;
  const m1 = gateQuestion.textContent.match(/Wie viel ist (\d+)\s*·\s*(\d+)/);
  const m2 = gateQuestion.textContent.match(/Berechne (\d+)\s*·\s*(\d+)\s*\+\s*(\d+)/);
  if (m1) {
    expected = parseInt(m1[1], 10) * parseInt(m1[2], 10);
  } else if (m2) {
    expected = parseInt(m2[1], 10) * parseInt(m2[2], 10) + parseInt(m2[3], 10);
  }

  gateInput.value = String(expected);
  gateForm.submit();

  assert.equal(Admin.isGatePassed(), true, 'Richtige Lösung muss Sicherheits-Gate öffnen');
  assert.equal(gateError.style.display, 'none');
  assert.equal(settingsPanel.style.display, 'block', 'Einstellungs-Panel muss sichtbar werden');
});

test('Admin: Kindersicherung mit Eltern-PIN schützt Einstellungen', () => {
  const { Admin, State, getElem } = createAdminSandbox();

  // Eltern-PIN setzen
  State.setParentPin('4829');
  assert.equal(State.getParentPin(), '4829');

  Admin.init();

  const toggleBtn = getElem('btn-gate-toggle-mode');
  const gateForm = getElem('admin-gate-form');
  const gateInput = getElem('admin-gate-input');

  // Auf PIN-Modus umschalten
  toggleBtn.click();

  // 1. Falscher PIN
  gateInput.value = '0000';
  gateForm.submit();
  assert.equal(Admin.isGatePassed(), false, 'Falscher PIN wird abgewiesen');

  // 2. Richtiger PIN
  gateInput.value = '4829';
  gateForm.submit();
  assert.equal(Admin.isGatePassed(), true, 'Korrekter PIN gewährt Zutritt');
});

test('Admin: Schulstufen-Konfiguration schränkt aktive Klassen im State ein', () => {
  const { State } = createAdminSandbox();

  // Initial: Schulstufen 1, 2, 3
  assert.deepEqual([...State.getActiveGrades()], [1, 2, 3]);

  // Änderung auf nur 1. Klasse für aktives Profil
  const active = State.getActiveProfile();
  State.setGradesForProfile(active.id, [1]);
  assert.deepEqual([...State.getActiveGrades()], [1]);

  // Änderung auf 3. und 4. Klasse
  State.setGradesForProfile(active.id, [3, 4]);
  assert.deepEqual([...State.getActiveGrades()], [3, 4]);
});

test('Admin: Profilverwaltung speichert kindgerechte Spitznamen (Datenschutz Regel 11)', () => {
  const { State } = createAdminSandbox();

  const initialProfiles = State.loadAllProfiles();
  assert.equal(initialProfiles[0].name, 'Nils');

  // Neues Profil anlegen
  const newProf = State.createProfile('Mia');
  assert.ok(newProf.id);
  assert.equal(newProf.name, 'Mia');

  const all = State.loadAllProfiles();
  assert.equal(all.length, 2);

  // Profil wechseln
  State.switchProfile(newProf.id);
  assert.equal(State.getActiveProfile().name, 'Mia');
});
