// =============================================================
// SCHLAUFUCHS – sw.js (Service Worker für 100% Offline-Betrieb)
// =============================================================

const CACHE_NAME = 'schlaufuchs-v3.16';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'admin.html',
  'dokumentation.html',
  'manifest.webmanifest',
  'css/tokens.css',
  'css/tokens-druck.css',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/exercises.css',
  'css/stickers.css',
  'css/admin.css',
  'css/print.css',
  'style.css',
  'js/core/format.js',
  'js/core/storage.js',
  'js/core/random.js',
  'js/core/texte.js',
  'js/core/topics.js',
  'js/dialog.js',
  'js/signs.js',
  'js/clock.js',
  'js/state.js',
  'js/audio.js',
  'js/dragdrop.js',
  'js/confetti.js',
  'js/print-engine.js',
  'js/print.js',
  'js/worksheets.js',
  'js/stickers.js',
  'js/validators/index.js',
  'js/generators/math.js',
  'js/generators/german.js',
  'js/generators/general.js',
  'js/generators/brain.js',
  'js/generators/index.js',
  'js/renderers/scaffolding.js',
  'js/renderers/shell.js',
  'js/renderers/math.js',
  'js/renderers/german.js',
  'js/renderers/clocks.js',
  'js/renderers/general.js',
  'js/renderers.js',
  'js/admin.js',
  'js/admin-qa.js',
  'js/app.js',
  'assets/icons/fuchs.svg',
  'assets/icons/stern.svg',
  'assets/icons/ton-an.svg',
  'assets/icons/ton-aus.svg',
  'assets/icons/einstellungen.svg',
  'assets/icons/zurueck.svg',
  'assets/icons/hakerl.svg',
  'assets/icons/buch.svg',
  'assets/icons/drucken.svg',
  'assets/icons/neuladen.svg',
  'assets/icons/numpad.svg',
  'assets/icons/schliessen.svg',
  'assets/icons/fach-mathe.svg',
  'assets/icons/fach-deutsch.svg',
  'assets/icons/fach-sach.svg',
  'assets/icons/fach-denken.svg',
  'assets/icons/themen/math/addition.svg',
  'assets/icons/themen/math/subtraktion.svg',
  'assets/icons/themen/math/multiplikation.svg',
  'assets/icons/themen/math/division.svg',
  'assets/icons/themen/math/zahlenmauer.svg',
  'assets/icons/themen/math/zwanzigerfeld.svg',
  'assets/icons/themen/math/uhr.svg',
  'assets/icons/themen/math/geld.svg',
  'assets/icons/themen/math/uhr-geld.svg',
  'assets/icons/themen/math/tausender.svg',
  'assets/icons/themen/math/schriftlich.svg',
  'assets/icons/themen/math/geometrie.svg',
  'assets/icons/themen/math/masse-gewichte.svg',
  'assets/icons/themen/math/rechengeschichten.svg',
  'assets/icons/themen/german/wortarten.svg',
  'assets/icons/themen/german/gross-klein.svg',
  'assets/icons/themen/german/silben.svg',
  'assets/icons/themen/german/zeitformen.svg',
  'assets/icons/themen/german/faelle.svg',
  'assets/icons/themen/german/schuettelsatz.svg',
  'assets/icons/themen/german/lesen.svg',
  'assets/icons/themen/general/kalender.svg',
  'assets/icons/themen/general/igel.svg',
  'assets/icons/themen/general/verkehr.svg',
  'assets/icons/themen/general/fahrrad.svg',
  'assets/icons/themen/general/oesterreich.svg',
  'assets/icons/themen/brain/memory.svg',
  'assets/icons/themen/brain/muster.svg',
  'assets/icons/themen/brain/reihenfolge.svg',
  'assets/verkehrszeichen/achtung-kinder.svg',
  'assets/verkehrszeichen/begegnungszone.svg',
  'assets/verkehrszeichen/einbahnstrasse.svg',
  'assets/verkehrszeichen/einfahrt-verboten.svg',
  'assets/verkehrszeichen/ende-vorrangstrasse.svg',
  'assets/verkehrszeichen/fahrverbot.svg',
  'assets/verkehrszeichen/fussgaengerzone.svg',
  'assets/verkehrszeichen/gefahrenstelle.svg',
  'assets/verkehrszeichen/geh-radweg.svg',
  'assets/verkehrszeichen/gehweg.svg',
  'assets/verkehrszeichen/haltestelle.svg',
  'assets/verkehrszeichen/kreisverkehr.svg',
  'assets/verkehrszeichen/radweg.svg',
  'assets/verkehrszeichen/schutzweg.svg',
  'assets/verkehrszeichen/stop.svg',
  'assets/verkehrszeichen/vorrang-geben.svg',
  'assets/verkehrszeichen/vorrangstrasse.svg',
  'assets/verkehrszeichen/wohnstrasse.svg',
  'fonts/PrimaeText-Regular.otf',
  'fonts/PrimaeText-Bold.otf',
  'fonts/PrimaeText-Semibold.otf',
  'fonts/PrimaeText-Cursive.otf',
  'fonts/Primae-Regular.otf',
  'fonts/Primae-Bold.otf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback auf gecachte Startseite
        return caches.match('index.html');
      });
    })
  );
});
