// =============================================================
// SCHLAUFUCHS – js/scratchpad.js
// Digitales Schmierblatt (Notiz-Canvas) für Fingerrechnungen auf iPads
// 100% Offline-fähig, flüssiges Zeichnen mit Touch & Stylus
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Scratchpad = (function () {
  'use strict';

  let canvas = null;
  let ctx = null;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let color = '#2563eb'; // Schlaufuchs Blau
  let lineWidth = 3.5;

  function init() {
    canvas = document.getElementById('scratchpad-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    // Pointer Events für Finger & Apple Pencil
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointercancel', stopDraw);

    // Buttons
    const clearBtn = document.getElementById('btn-scratchpad-clear');
    const closeBtn = document.getElementById('btn-scratchpad-close');
    const toggleBtn = document.getElementById('btn-toggle-scratchpad');

    if (clearBtn) clearBtn.addEventListener('click', clear);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  }

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }

  function startDraw(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing || !ctx) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
  }

  function stopDraw() {
    isDrawing = false;
  }

  function clear() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function open() {
    const wrap = document.getElementById('scratchpad-panel');
    if (wrap) {
      wrap.classList.add('active');
      setTimeout(resizeCanvas, 50);
    }
  }

  function close() {
    const wrap = document.getElementById('scratchpad-panel');
    if (wrap) wrap.classList.remove('active');
  }

  function toggle() {
    const wrap = document.getElementById('scratchpad-panel');
    if (wrap && wrap.classList.contains('active')) {
      close();
    } else {
      open();
    }
  }

  return {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
    clear: clear
  };
})();
