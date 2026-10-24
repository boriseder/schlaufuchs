// =============================================================
// SCHLAUFUCHS – js/confetti.js
// Performante HTML5-Canvas Konfetti-Belohnung bei 100% Erfolg
// 100% Offline-fähig, 60 FPS CSS/Canvas Animation
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Confetti = (function () {
  'use strict';

  function triggerConfetti() {
    // Harte Regel 8: prefers-reduced-motion beachten (Konfetti dann ganz weglassen)
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    // Farben ausschließlich aus den Design-Tokens (Fuchs, Mathe, Sachunterricht, Denken, Richtig, Deutsch)
    const colors = ['#D4621A', '#2255A4', '#1B8A44', '#7E4E96', '#E5A800', '#C24C2C'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 3,
        angle: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrameId;
    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.y += p.speed;
        p.angle += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      });

      // Nach 1,5 Sekunden stoppen (< 2 Sekunden, Regel 8 / kinder-ui-design)
      if (Date.now() - startTime < 1500) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrameId);
      }
    }

    render();
  }

  return {
    trigger: triggerConfetti
  };
})();
