// =============================================================
// SCHLAUFUCHS – js/dialog.js
// Kindgerechtes In-App-Dialogsystem (Ersatz für native window.alert & window.confirm)
// Verhindert native Browser-Popups mit störenden "file://" oder Server-Headern!
// =============================================================

window.Schlaufuchs = window.Schlaufuchs || {};

window.Schlaufuchs.Dialog = (function () {
  'use strict';

  let dialogOverlay = null;

  function ensureDialogElements() {
    if (dialogOverlay) return;

    dialogOverlay = document.createElement('div');
    dialogOverlay.id = 'schlaufuchs-dialog-overlay';
    dialogOverlay.className = 'modal-overlay';
    dialogOverlay.style.zIndex = '100000';

    dialogOverlay.innerHTML = `
      <div class="modal-card" style="max-width: 440px; padding: 26px 24px; text-align: center; border-radius: 20px; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);">
        <div id="schlaufuchs-dialog-icon" style="font-size: 3.2rem; margin-bottom: 8px;">🦊</div>
        <h3 id="schlaufuchs-dialog-title" style="font-size: 1.3rem; font-weight: 900; color: #1e293b; margin: 0 0 10px 0;">Schlaufuchs meint</h3>
        <div id="schlaufuchs-dialog-msg" style="font-size: 1.05rem; font-weight: 700; color: #475569; line-height: 1.5; margin-bottom: 22px; white-space: pre-line;"></div>
        <div id="schlaufuchs-dialog-actions" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;"></div>
      </div>
    `;

    document.body.appendChild(dialogOverlay);

    dialogOverlay.addEventListener('click', (e) => {
      if (e.target === dialogOverlay) {
        close();
      }
    });
  }

  function close() {
    if (dialogOverlay) {
      dialogOverlay.classList.remove('active');
    }
  }

  function alert(message, options = {}) {
    ensureDialogElements();

    const iconEl = document.getElementById('schlaufuchs-dialog-icon');
    const titleEl = document.getElementById('schlaufuchs-dialog-title');
    const msgEl = document.getElementById('schlaufuchs-dialog-msg');
    const actionsEl = document.getElementById('schlaufuchs-dialog-actions');

    const icon = options.icon || (message.includes('✅') ? '🎉' : (message.includes('⭐') ? '⭐' : '🦊'));
    const title = options.title || (message.includes('✅') ? 'Erfolg!' : 'Hinweis für dich:');
    const btnText = options.confirmText || 'Alles klar! 👍';

    iconEl.textContent = icon;
    titleEl.textContent = title;
    msgEl.textContent = message.replace(/^[✅⭐🎉]\s*/, '');

    actionsEl.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.cssText = 'min-width: 140px; min-height: 48px; font-size: 1.05rem; padding: 10px 22px;';
    btn.textContent = btnText;
    btn.addEventListener('click', () => {
      close();
      if (typeof options.onOk === 'function') options.onOk();
    });

    actionsEl.appendChild(btn);
    dialogOverlay.classList.add('active');
    btn.focus();
  }

  function confirm(message, onConfirm, onCancel, options = {}) {
    ensureDialogElements();

    const iconEl = document.getElementById('schlaufuchs-dialog-icon');
    const titleEl = document.getElementById('schlaufuchs-dialog-title');
    const msgEl = document.getElementById('schlaufuchs-dialog-msg');
    const actionsEl = document.getElementById('schlaufuchs-dialog-actions');

    iconEl.textContent = options.icon || '🤔';
    titleEl.textContent = options.title || 'Bist du sicher?';
    msgEl.textContent = message;

    actionsEl.innerHTML = '';

    // Abbrechen Button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.style.cssText = 'min-width: 120px; min-height: 48px; font-size: 1.05rem; padding: 10px 18px;';
    cancelBtn.textContent = options.cancelText || 'Abbrechen';
    cancelBtn.addEventListener('click', () => {
      close();
      if (typeof onCancel === 'function') onCancel();
    });

    // Bestätigen Button
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.style.cssText = 'min-width: 120px; min-height: 48px; font-size: 1.05rem; padding: 10px 18px;';
    confirmBtn.textContent = options.confirmText || 'Ja, weiter! 👍';
    confirmBtn.addEventListener('click', () => {
      close();
      if (typeof onConfirm === 'function') onConfirm();
    });

    actionsEl.appendChild(cancelBtn);
    actionsEl.appendChild(confirmBtn);

    dialogOverlay.classList.add('active');
    confirmBtn.focus();
  }

  // Native window.alert global abfangen, damit kein Browser "file://" Header erscheint
  if (typeof window !== 'undefined') {
    window.alert = function (msg) {
      alert(String(msg));
    };
  }

  return {
    alert: alert,
    confirm: confirm,
    close: close
  };
})();
