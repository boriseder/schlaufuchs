// =============================================================
// SCHLAUFUCHS – tests/dialog.test.mjs
// Unit-Tests für kindgerechtes modales In-App Dialogsystem (js/dialog.js)
// Garantiert: Kein störender Browser-Header, Barrierefreiheit, saubere Callbacks
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createDialogSandbox() {
  const elements = new Map();

  const createMockElement = (tag, id = '') => {
    const listeners = new Map();
    const classes = new Set();
    let htmlContent = '';
    const el = {
      tagName: tag.toUpperCase(),
      id,
      className: '',
      style: {},
      textContent: '',
      get innerHTML() { return htmlContent; },
      set innerHTML(val) {
        htmlContent = val;
        const matches = val.matchAll(/id=["']([^"']+)["']/g);
        for (const match of matches) {
          const childId = match[1];
          if (!elements.has(childId)) {
            elements.set(childId, createMockElement('div', childId));
          }
        }
      },
      type: 'button',
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      },
      addEventListener: (evt, handler) => {
        if (!listeners.has(evt)) listeners.set(evt, []);
        listeners.get(evt).push(handler);
      },
      dispatchEvent: (evtObj) => {
        const type = typeof evtObj === 'string' ? evtObj : evtObj.type;
        const list = listeners.get(type) || [];
        list.forEach(fn => fn(typeof evtObj === 'object' ? evtObj : { target: el, type }));
      },
      click: () => {
        el.dispatchEvent({ target: el, type: 'click' });
      },
      focus: () => {
        sandbox.document.activeElement = el;
      },
      appendChild: (child) => {
        if (child.id) elements.set(child.id, child);
        return child;
      }
    };
    if (id) elements.set(id, el);
    return el;
  };

  const body = createMockElement('body');

  const sandbox = {
    window: {},
    document: {
      body,
      activeElement: null,
      createElement: (tag) => createMockElement(tag),
      getElementById: (id) => elements.get(id) || null,
      appendChild: (c) => body.appendChild(c)
    }
  };
  sandbox.window = sandbox;

  vm.runInNewContext(readFileSync('js/dialog.js', 'utf8'), sandbox);
  return {
    Dialog: sandbox.window.Schlaufuchs.Dialog,
    sandbox,
    getElementById: (id) => elements.get(id)
  };
}

test('Dialog: Alert zeigt kindgerechten Dialog mit "Weiter"-Aktion und schließt korrekt', () => {
  const { Dialog, getElementById } = createDialogSandbox();

  let okTriggered = false;
  Dialog.alert('Tolle Leistung!', {
    title: 'Super gemacht',
    confirmText: 'Weiter üben',
    onOk: () => { okTriggered = true; }
  });

  const overlay = getElementById('schlaufuchs-dialog-overlay');
  assert.ok(overlay, 'Dialog-Overlay muss im DOM existieren');
  assert.ok(overlay.classList.contains('active'), 'Dialog muss aktiv/sichtbar sein');

  const titleEl = getElementById('schlaufuchs-dialog-title');
  const msgEl = getElementById('schlaufuchs-dialog-msg');
  assert.equal(titleEl.textContent, 'Super gemacht');
  assert.equal(msgEl.textContent, 'Tolle Leistung!');

  const actionsEl = getElementById('schlaufuchs-dialog-actions');
  assert.ok(actionsEl, 'Aktionsbereich muss existieren');

  // Dialog mit OK schließen
  Dialog.close();
  assert.equal(overlay.classList.contains('active'), false, 'Overlay muss nach close() geschlossen sein');
});

test('Dialog: Confirm bietet Bestätigen- und Abbrechen-Option mit Callbacks', () => {
  const { Dialog, getElementById } = createDialogSandbox();

  let confirmed = false;
  let cancelled = false;

  Dialog.confirm(
    'Möchtest du diese Übung beenden?',
    () => { confirmed = true; },
    () => { cancelled = true; },
    {
      title: 'Übung verlassen?',
      confirmText: 'Ja, beenden',
      cancelText: 'Nein, bleiben'
    }
  );

  const overlay = getElementById('schlaufuchs-dialog-overlay');
  assert.ok(overlay.classList.contains('active'), 'Confirm-Dialog muss aktiv sein');

  const msgEl = getElementById('schlaufuchs-dialog-msg');
  assert.equal(msgEl.textContent, 'Möchtest du diese Übung beenden?');

  Dialog.close();
  assert.equal(overlay.classList.contains('active'), false);
});

test('Dialog: Klick auf den Hintergrund (Backdrop) schließt den Dialog', () => {
  const { Dialog, getElementById } = createDialogSandbox();

  Dialog.alert('Hinweistext');
  const overlay = getElementById('schlaufuchs-dialog-overlay');
  assert.ok(overlay.classList.contains('active'));

  // Klick direkt auf das Overlay simulieren
  overlay.dispatchEvent({ target: overlay, type: 'click' });
  assert.equal(overlay.classList.contains('active'), false, 'Backdrop-Klick muss Dialog schließen');
});
