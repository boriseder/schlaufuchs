// =============================================================
// SCHLAUFUCHS – js/dragdrop.js
// Universelle Touch- & Pointer-Drag-&-Drop Engine für iPad & Desktop
// Garantiert unterbrechungsfreies Verschieben & Gesten-Prävention
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.DragDrop = (function () {
  'use strict';

  function setupPointerDrag(element, onDropCallback) {
    if (!element) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let dragGhost = null;
    let activeDropZone = null;
    const DRAG_THRESHOLD = 6; // Mindestabstand in px vor Aktivierung

    function onPointerDown(e) {
      // Nur primäre Maustaste oder Touch
      if (e.button !== undefined && e.button !== 0) return;

      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        isDragging = true;
        element.classList.add('is-dragging');

        // Floating Ghost erstellen
        dragGhost = element.cloneNode(true);
        dragGhost.classList.add('drag-ghost');
        dragGhost.style.position = 'fixed';
        dragGhost.style.pointerEvents = 'none';
        dragGhost.style.zIndex = '99999';
        dragGhost.style.opacity = '0.9';
        dragGhost.style.transform = 'scale(1.05)';
        dragGhost.style.border = '2px solid var(--linie, #3B4651)';
        dragGhost.style.margin = '0';
        dragGhost.style.transition = 'none';

        const rect = element.getBoundingClientRect();
        dragGhost.style.width = `${rect.width}px`;
        dragGhost.style.height = `${rect.height}px`;

        document.body.appendChild(dragGhost);
      }

      if (isDragging && dragGhost) {
        e.preventDefault(); // Zoom/Scroll auf iPads verhindern
        dragGhost.style.left = `${e.clientX - 25}px`;
        dragGhost.style.top = `${e.clientY - 25}px`;

        // Unterliegende Drop-Zone ermitteln
        const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
        const dropZone = elemUnder ? elemUnder.closest('.drop-zone') : null;

        if (dropZone !== activeDropZone) {
          if (activeDropZone) activeDropZone.classList.remove('drag-hover');
          activeDropZone = dropZone;
          if (activeDropZone && activeDropZone !== element) {
            activeDropZone.classList.add('drag-hover');
          }
        }
      }
    }

    function onPointerUp(e) {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (isDragging) {
        element.classList.remove('is-dragging');

        if (dragGhost && dragGhost.parentNode) {
          dragGhost.parentNode.removeChild(dragGhost);
        }
        dragGhost = null;

        if (activeDropZone) {
          activeDropZone.classList.remove('drag-hover');
          const targetZone = activeDropZone;
          activeDropZone = null;
          if (typeof onDropCallback === 'function') {
            onDropCallback(element, targetZone, e);
          }
        }
        isDragging = false;
      }
    }

    element.addEventListener('pointerdown', onPointerDown);
    // Verhindert ungewolltes iOS Callout-Menü
    element.style.touchAction = 'none';
  }

  return {
    setupPointerDrag: setupPointerDrag
  };
})();
