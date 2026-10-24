---
name: technik-offline-touch
description: Verwende diesen Skill bei Code-Änderungen an Architektur, Speicherung, Offline-Betrieb, Touch- und Zieh-Bedienung, Zahlenformatierung, Vorlesen, Tests oder Barrierefreiheit der Lernplattform.
---

# Technik: offline, touch, testbar

## 1. Grundsätze

- **Keine externen Laufzeit-Abhängigkeiten.** Keine CDNs, keine Webfonts von außen, keine Tracker, keine Cookies, keine Analytics.
- **Kein Backend.** Die App besteht aus statischen Dateien und läuft ohne Netz.
- **Keine großen Bibliotheken.** Schlankes CSS und JS. Animationen nur mit `transform` und `opacity`. Konfetti über Canvas.
- Alles, was Daten eines Kindes betrifft, bleibt auf dem Gerät.

## 2. Auslieferung

Die App muss offline laufen. Es gibt zwei Wege, und sie haben **unterschiedliche Grenzen**:

| Weg | Geeignet für | Grenzen |
|---|---|---|
| Statisch gehostet (HTTPS) mit **Service Worker** und „Zum Home-Bildschirm“ | **iPad und Tablets in der Schule** | braucht einmal Netz zur Installation |
| `file://index.html` | Entwicklung und Desktop | Service Worker funktioniert nicht, ES-Module laden nicht, auf dem iPad praktisch nicht nutzbar, Speicherverhalten je Browser verschieden |

Beachte:

- Module: Skripte werden als reguläre `<script>`-Tags geladen, im Namespace `window.Schlaufuchs`. Das erhält die Lauffähigkeit über `file://`.
  Lade in fester Reihenfolge: `core`, `validators`, `generators`, `renderers`, `print`, `app` (maßgeblich ist die Projektstruktur in `AGENTS.md`). Jede Datei hängt sich an den Namespace und liest nur, was oberhalb geladen ist.
- Empfehlung (Entscheidung offen, eingetragen in `docs/offene-lehrplanfragen.md` unter „Technik“; das README beschreibt derzeit den Ist-Zustand ohne Build): ES-Module und JSDoc-Typen im Quellcode, ein Build-Schritt (zum Beispiel esbuild) erzeugt ein einzelnes Skript, das auch über `file://` läuft. „Keine externen Abhängigkeiten“ gilt für die Laufzeit, nicht für das Werkzeug.
- Service Worker: Precache aller Dateien mit Versionsnummer, alte Caches beim Aktivieren löschen. Ohne Netz darf nie ein Fehlerbild erscheinen.
- **Update-Regel:** Jede Änderung an ausgelieferten Dateien erhöht die Cache-Version in `sw.js` (auch neue Dateien wie `js/print.js` oder `css/tokens-druck.css` kommen in den Precache). Sonst sehen Schulgeräte, die die App einmal installiert haben, veraltete Aufgaben und Arbeitsblätter. Ein ruhiger Hinweis „Neue Version verfügbar. Neu laden.“ gehört in den Eltern- und Lehrerbereich, nie in die Übungsansicht.

## 3. Speicherung (wichtig für den Lernstand)

`localStorage` ist auf dem iPad **nicht dauerhaft sicher**. Safari kann Website-Daten löschen, wenn die Seite längere Zeit nicht genutzt wird. Ferien sind so ein Fall. Geräte werden außerdem von mehreren Kindern genutzt, und Daten sind **pro Gerät und Browser**.

Regeln:

1. Alle Zugriffe laufen über ein Modul `Schlaufuchs.Storage` (`js/core/storage.js`). Kein direktes `localStorage` im Rest des Codes. Das Lint-Skript warnt dabei.
2. Schlüssel mit Präfix und Version: `schlaufuchs:v1:profil:<id>`. Beim Laden **Schema-Version prüfen** und migrieren.
3. Jeder Zugriff in `try/catch`. Ist der Speicher nicht verfügbar (privater Modus, voll), arbeitet die App im Speicher weiter und zeigt in den Eltern-Einstellungen einen ruhigen Hinweis.
4. Beim Start `navigator.storage.persist()` anfragen (wenn verfügbar).
5. **Backup:** Im Eltern- und Lehrerbereich „Lernstand sichern“ (JSON-Datei laden und speichern, Dateiname mit Datum) und „Lernstand einspielen“. Pflichtfunktion, weil es sonst keinen Weg gibt, Daten zu retten oder zu übertragen.
6. Profile ohne **Klarnamen**: Spitzname und Avatar. Keine Fotos, keine Geburtsdaten, keine freien Texte über das Kind.
7. Gespeichert wird nur, was die App braucht: Sterne je Thema, zuletzt geübte Themen, Einstellungen, Hilfenutzung (anonym, für die Anpassung der Schwierigkeit).
8. Lösche-Funktion je Profil, die wirklich alles entfernt.

Starter:

```js
(function (S) {
  const PRAEFIX = "schlaufuchs:v1:";
  const speicher = {}; // Fallback im Arbeitsspeicher
  function lesen(key) {
    try { const v = window.localStorage.getItem(PRAEFIX + key); return v === null ? undefined : JSON.parse(v); }
    catch { return speicher[key]; }
  }
  function schreiben(key, wert) {
    speicher[key] = wert;
    try { window.localStorage.setItem(PRAEFIX + key, JSON.stringify(wert)); return true; }
    catch { return false; }
  }
  S.Storage = { lesen, schreiben };
})(window.Schlaufuchs = window.Schlaufuchs || {});
```

## 4. Zahlenformat

```js
// js/core/format.js
(function (S) {
  const SPATIUM = "\u202F"; // schmales geschütztes Leerzeichen. Fallback \u00A0, falls Glyph fehlt.
  function formatZahl(n) {
    const neg = n < 0 ? "\u2212" : "";
    const [ganz, dez] = String(Math.abs(n)).split(".");
    const gruppiert = ganz.length >= 4 ? ganz.replace(/\B(?=(\d{3})+(?!\d))/g, SPATIUM) : ganz;
    return neg + gruppiert + (dez ? "," + dez : "");
  }
  function leseZahl(text) { // tolerant: "1000", "1 000", "1\u202F000", auch "1.000" (Tausenderpunkt)
    let s = String(text).trim();
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ""); // Punkt = Tausender, Dezimal ist das Komma
    s = s.replace(/[\s\u00A0\u202F]/g, "").replace(",", ".");
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
  }
  S.formatZahl = formatZahl;
  S.leseZahl = leseZahl;
})(window.Schlaufuchs = window.Schlaufuchs || {});
```

Teste mindestens: `1000 → "1 000"`, `125000 → "125 000"`, `999 → "999"`, `2.5 → "2,5"`, `0 → "0"`, `leseZahl("1 000") → 1000`, `leseZahl("1.000") → 1000`, `leseZahl("2,5") → 2.5`, `leseZahl("abc") → NaN`.
Prüfe, dass `Primae` das Zeichen U+202F darstellt, sonst `U+00A0` verwenden.

## 5. Touch und Ziehen

- `touch-action: manipulation` global (in `tokens.css`), `touch-action: none` nur auf ziehbaren Karten.
- **Pointer Events** (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) mit `setPointerCapture`. Die **HTML5-Drag-and-Drop-API** (`dragstart` und Co.) ist auf Touch unzuverlässig und wird nicht verwendet.
- **Antippen immer als Alternative:** erst Karte antippen (hervorgehoben), dann Ziel antippen.
- Treffer-Flächen mindestens 56 px, Abstand 12 px (`--ziel-min`, `--ziel-abstand`).
- Seitenlayout für Hoch- und Querformat, `env(safe-area-inset-*)` beachten.
- Kein Zoomverbot: nie `user-scalable=no` oder `maximum-scale`.
- Teste auf: iPad Safari, Android Chrome, Desktop Chrome und Firefox. Mindestens iPad Safari manuell.

## 6. Vorlesen

```js
function sprich(text) {
  if (!("speechSynthesis" in window) || Schlaufuchs.stumm) return false;
  const stimmen = speechSynthesis.getVoices();
  const stimme = stimmen.find(v => v.lang === "de-AT") || stimmen.find(v => v.lang.startsWith("de"));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = stimme ? stimme.lang : "de-DE";
  if (stimme) u.voice = stimme;
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  return true;
}
```

Verfügbarkeit und Qualität der Stimmen unterscheiden sich je Gerät. Für feste Texte sind vorproduzierte Audios besser (siehe `paedagogik-lernlogik`). Die Stummschaltung (`Schlaufuchs.stumm`) betrifft **alle** Töne und Sprache.

## 7. Barrierefreiheit (technisch)

- Echte Elemente: `<button>`, `<label>`, `<fieldset>`. Keine Klick-`<div>`.
- Rückmeldungen in `aria-live="polite"`. Fokus nach dem Wechsel der Aufgabe auf die neue Frage setzen.
- Sichtbarer Fokus (in `tokens.css`). Bedienung mit Tastatur möglich (für Hilfsmittel und Entwicklung).
- Sprache setzen: `<html lang="de-AT">`.
- Bilder und SVG mit Alternativtext. Dekoratives mit `aria-hidden="true"`.
- Farbe nie allein (siehe `kinder-ui-design`).

## 8. Tests

- Generatoren und Validatoren sind reine Funktionen und werden mit dem **eingebauten Node-Testrunner** getestet (`node --test`). Kein Framework nötig.
- Zufall über einen **Seed-fähigen Generator** (zum Beispiel mulberry32). Das macht Varianz-Tests reproduzierbar.
- Pflichttests je Generator:
  - Eigenschaften über viele Seeds (zum Beispiel 500): Ergebnis liegt im Zahlenraum der Schulstufe, 1. Schulstufe enthält nie `·` oder `:`, Ergebnis ist ganzzahlig, wenn verlangt.
  - Varianz: In einer Serie keine zwei gleichen Aufgaben.
  - Validator akzeptiert `1000`, `1 000` und lehnt `abc` freundlich ab.
  - Distraktoren sind verschieden und enthalten nicht die Lösung doppelt.
- Druck-Tests (`tests/print.test.mjs`): Vollständigkeit von Antwortfeld und Lösungsblatt, Zahlenformat und Rechenzeichen im gerenderten HTML, Reproduzierbarkeit mit Seed, Layout-Regeln (siehe `arbeitsblatt-druck`, Abschnitt 9).
- Vor Abschluss: `node scripts/check-regeln.mjs` und `node --test`.

## 9. Druck (Technik)

- Druck läuft über `window.print()` und `@media print`. Keine Bibliothek, kein Server, keine externe Schrift (Regel 10 in `AGENTS.md`).
- `@page { size: A4 portrait; }` und Maße aus `css/tokens-druck.css` (Einheiten mm und pt).
- Browser drucken Hintergrundfarben oft nicht. Verlasse dich nie auf `background-color`, wenn es Information trägt. Setze `print-color-adjust: exact` nur für reine Zusatzflächen wie das graue Mittelband.
- Der Druck-Renderer liegt in `js/print.js`, nutzt `formatZahl()` und liest nur Datenobjekte aus den Generatoren (keine eigene Aufgabenlogik).
- Prüfe vor dem Abschluss: Druckvorschau in Chrome und Safari, Schwarzweiß-Vorschau, Seitenumbrüche. Das tatsächliche Papier lässt sich nicht automatisch prüfen und wird im Bericht als geprüft oder nicht geprüft genannt.

## 10. Datenschutz (DSGVO)

- Solange nichts das Gerät verlässt, ist die Datenlage einfach. Das gilt nur, wenn die Regeln in Abschnitt 1 und 3 eingehalten werden.
- Kommt später ein Konto, eine Cloud-Synchronisierung oder eine Auswertung, gelten Einwilligung der Erziehungsberechtigten, Datenminimierung, Auftragsverarbeitung und eine Datenschutz-Folgenabschätzung. Führe so etwas nicht ohne ausdrücklichen Auftrag ein.

## Checkliste

- [ ] Keine externen Requests (`node scripts/check-regeln.mjs`)
- [ ] Speicher nur über `Schlaufuchs.Storage`, Backup vorhanden
- [ ] `formatZahl()` und `leseZahl()` verwendet und getestet
- [ ] Ziehen mit Pointer Events plus Antippen
- [ ] Vorlesen mit Fallback, Stummschalter wirkt überall
- [ ] Tests mit Seed, Eigenschaften und Varianz
- [ ] Auf iPad Safari geprüft
- [ ] Cache-Version in `sw.js` erhöht, neue Dateien im Precache
- [ ] Druck: A4, Schwarzweiß-Vorschau, `print.test.mjs` grün
