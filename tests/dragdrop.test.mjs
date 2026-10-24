// =============================================================
// SCHLAUFUCHS – tests/dragdrop.test.mjs
// Unit-Tests für Drag & Drop Engine (js/dragdrop.js)
// Garantiert: Touch-Gesten, Schwellenwert-Logik, 0 Box-Shadows (Anti-KI-Optik)
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createDragDropSandbox() {
  const windowListeners = new Map();

  const createMockNode = (className = '') => {
    const classes = new Set(className ? className.split(' ') : []);
    const node = {
      className,
      style: {},
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      },
      getBoundingClientRect: () => ({ width: 80, height: 40 }),
      closest: (sel) => {
        if (sel === '.drop-zone' && classes.has('drop-zone')) return node;
        return null;
      },
      cloneNode: () => {
        return createMockNode(node.className);
      },
      addEventListener: (evt, fn) => {
        node._listeners = node._listeners || {};
        node._listeners[evt] = fn;
      },
      parentNode: null
    };
    return node;
  };

  const bodyChildren = [];
  const body = {
    appendChild: (child) => {
      child.parentNode = body;
      bodyChildren.push(child);
      return child;
    },
    removeChild: (child) => {
      const idx = bodyChildren.indexOf(child);
      if (idx !== -1) bodyChildren.splice(idx, 1);
      child.parentNode = null;
      return child;
    }
  };

  const sandbox = {
    window: {
      addEventListener: (evt, fn) => {
        if (!windowListeners.has(evt)) windowListeners.set(evt, []);
        windowListeners.get(evt).push(fn);
      },
      removeEventListener: (evt, fn) => {
        if (!windowListeners.has(evt)) return;
        const list = windowListeners.get(evt);
        const idx = list.indexOf(fn);
        if (idx !== -1) list.splice(idx, 1);
      }
    },
    document: {
      body,
      elementFromPoint: () => null
    },
    Math: Math
  };
  sandbox.window.window = sandbox.window;

  vm.runInNewContext(readFileSync('js/dragdrop.js', 'utf8'), sandbox);

  return {
    DragDrop: sandbox.window.Schlaufuchs.DragDrop,
    windowListeners,
    bodyChildren,
    createMockNode,
    sandbox
  };
}

test('DragDrop: Schwellenwert-Logik verhindert versehentliches Ziehen bei kurzem Antippen (< 6px)', () => {
  const { DragDrop, windowListeners, createMockNode } = createDragDropSandbox();
  const draggable = createMockNode('drag-item');

  DragDrop.setupPointerDrag(draggable, () => {});

  // 1. Pointer Down
  assert.ok(draggable._listeners && draggable._listeners['pointerdown'], 'pointerdown Listener muss registriert sein');
  draggable._listeners['pointerdown']({ clientX: 100, startY: 100, button: 0 });

  // 2. Kleiner Pointer Move (nur 3px Versatz)
  const moveListeners = windowListeners.get('pointermove') || [];
  assert.ok(moveListeners.length > 0, 'pointermove muss an window gebunden sein');
  moveListeners[0]({ clientX: 103, clientY: 102, preventDefault: () => {} });

  assert.equal(
    draggable.classList.contains('is-dragging'),
    false,
    'Item darf bei Bewegung < 6px (Tap-Toleranz) noch nicht als is-dragging markiert sein'
  );
});

test('DragDrop: Floating-Ghost nutzt 2px-Rahmen und KEINEN Box-Shadow (Anti-KI-Optik)', () => {
  const { DragDrop, windowListeners, bodyChildren, createMockNode } = createDragDropSandbox();
  const draggable = createMockNode('drag-item');

  DragDrop.setupPointerDrag(draggable, () => {});

  // 1. Pointer Down
  draggable._listeners['pointerdown']({ clientX: 100, startY: 100, button: 0 });

  // 2. Großer Pointer Move (15px Versatz)
  const moveListeners = windowListeners.get('pointermove') || [];
  moveListeners[0]({ clientX: 115, clientY: 120, preventDefault: () => {} });

  assert.equal(draggable.classList.contains('is-dragging'), true, 'Item muss bei > 6px aktiviert werden');
  assert.equal(bodyChildren.length, 1, 'Floating Ghost muss an document.body angehängt werden');

  const ghost = bodyChildren[0];
  // Anti-KI-Optik Prüfungen
  assert.ok(!ghost.style.boxShadow, 'Ghost darf unter keinen Umständen einen inline box-shadow haben');
  assert.ok(ghost.style.border.includes('2px solid'), 'Ghost muss den didaktischen 2px-Rahmen verwenden');
  assert.equal(ghost.style.position, 'fixed');
  assert.equal(ghost.style.pointerEvents, 'none');
});

test('DragDrop: Drop auf Zielzone ruft Callback auf und entfernt Ghost restlos', () => {
  const { DragDrop, windowListeners, bodyChildren, createMockNode, sandbox } = createDragDropSandbox();
  const draggable = createMockNode('drag-item');
  const dropZone = createMockNode('drop-zone');

  let droppedTarget = null;
  DragDrop.setupPointerDrag(draggable, (elem, target) => {
    droppedTarget = target;
  });

  draggable._listeners['pointerdown']({ clientX: 100, startY: 100, button: 0 });
  const moveListeners = windowListeners.get('pointermove') || [];

  sandbox.document.elementFromPoint = () => dropZone;
  moveListeners[0]({ clientX: 150, clientY: 150, preventDefault: () => {} });

  // Pointer Up
  const upListeners = windowListeners.get('pointerup') || [];
  upListeners[0]({ clientX: 150, clientY: 150 });

  assert.equal(bodyChildren.length, 0, 'Ghost muss beim Loslassen aus dem DOM entfernt werden');
  assert.equal(droppedTarget, dropZone, 'Callback muss mit getroffener dropZone aufgerufen werden');
  assert.equal(draggable.classList.contains('is-dragging'), false);
});
