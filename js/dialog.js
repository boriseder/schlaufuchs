// =============================================================
// SCHLAUFUCHS – js/dialog.js
// Kindgerechtes In-App-Dialogsystem (Ersatz für native window.alert & window.confirm)
// Verhindert native Browser-Popups mit störenden "file://" oder Server-Headern!
// 100% konform mit AGENTS.md, Design-Tokens & SVG-Icons.
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
      <div class="schlaufuchs-dialog-card">
        <div id="schlaufuchs-dialog-icon" class="schlaufuchs-dialog-icon">
          <img src="assets/icons/fuchs.svg" class="icon-inline-svg" alt="" style="width: 48px; height: 48px;">
        </div>
        <h3 id="schlaufuchs-dialog-title" class="schlaufuchs-dialog-title">Schlaufuchs</h3>
        <div id="schlaufuchs-dialog-msg" class="schlaufuchs-dialog-msg"></div>
        <div id="schlaufuchs-dialog-actions" class="schlaufuchs-dialog-actions"></div>
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

    const iconSvg = options.iconSvg || (message.includes('Erfolg') || message.includes('Super')
      ? 'assets/icons/hakerl.svg'
      : 'assets/icons/fuchs.svg');
    const title = options.title || 'Hinweis für dich:';
    const btnText = options.confirmText || 'Weiter';

    if (iconEl) {
      iconEl.innerHTML = `<img src="${iconSvg}" class="icon-inline-svg" alt="" style="width: 48px; height: 48px;">`;
    }
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message.replace(/^[\u2705\u2B50\u{1F389}\u{1F4AA}\u26A0\u{1F4A1}]\s*/u, '');

    if (actionsEl) {
      actionsEl.innerHTML = '';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.textContent = btnText;
      btn.addEventListener('click', () => {
        close();
        if (typeof options.onOk === 'function') options.onOk();
      });

      actionsEl.appendChild(btn);
      btn.focus();
    }

    dialogOverlay.classList.add('active');
  }

  function confirm(message, onConfirm, onCancel, options = {}) {
    ensureDialogElements();

    const iconEl = document.getElementById('schlaufuchs-dialog-icon');
    const titleEl = document.getElementById('schlaufuchs-dialog-title');
    const msgEl = document.getElementById('schlaufuchs-dialog-msg');
    const actionsEl = document.getElementById('schlaufuchs-dialog-actions');

    const iconSvg = options.iconSvg || 'assets/icons/fuchs.svg';
    const title = options.title || 'Bist du sicher?';

    if (iconEl) {
      iconEl.innerHTML = `<img src="${iconSvg}" class="icon-inline-svg" alt="" style="width: 48px; height: 48px;">`;
    }
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (actionsEl) {
      actionsEl.innerHTML = '';

      // Abbrechen Button
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.textContent = options.cancelText || 'Abbrechen';
      cancelBtn.addEventListener('click', () => {
        close();
        if (typeof onCancel === 'function') onCancel();
      });

      // Bestätigen Button
      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.textContent = options.confirmText || 'Ja, weiter';
      confirmBtn.addEventListener('click', () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
      });

      actionsEl.appendChild(cancelBtn);
      actionsEl.appendChild(confirmBtn);
      confirmBtn.focus();
    }

    dialogOverlay.classList.add('active');
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
