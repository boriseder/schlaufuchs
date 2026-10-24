# Schlaufuchs – Lernplattform Volksschule Österreich

Browserbasierte, vollständig offlinefähige Übungs- und Festigungsplattform für Schülerinnen und Schüler der 1. bis 4. Schulstufe (6–10 Jahre) an österreichischen Volksschulen.

Entwickelt auf Basis des **österreichischen Volksschul-Lehrplans 2023/2025** (*BGBl. II Nr. 178/2025*) zur Festigung von mathematischen, sprachlichen und sachunterrichtlichen Grundkompetenzen im Unterricht sowie zu Hause.

---

## Inhaltsverzeichnis

- [1. Pädagogisch-didaktische Konzeption](#1-pädagogisch-didaktische-konzeption)
- [2. Fachbereiche und Kompetenzbereiche](#2-fachbereiche-und-kompetenzbereiche)
- [3. Technische Architektur](#3-technische-architektur)
- [4. Datenschutz & Privatsphäre](#4-datenschutz--privatsphäre)
- [5. Projektstruktur](#5-projektstruktur)
- [6. Lokale Ausführung & Entwicklung](#6-lokale-ausführung--entwicklung)
- [7. Qualitätssicherung & automatisierte Tests](#7-qualitätssicherung--automatisierte-tests)
- [8. Lehrplanbezug & Normen](#8-lehrplanbezug--normen)

---

## 1. Pädagogisch-didaktische Konzeption

Schlaufuchs dient dem **selbstständigen Festigen und Wiederholen** von im Unterricht erarbeiteten Inhalten. Die Anwendung führt keinen neuen Stoff ein, sondern vertieft automatisierende Fertigkeiten und Verstehensstrukturen.

### Leitprinzipien

* **Kognitive Entlastung (Ein-Aufgaben-Fokus):** Im Übungsmodus steht genau eine Aufgabe im Blickfeld. Ablenkende Seitenelemente, Fortschrittsbalken oder Menüs werden ausgeblendet.
* **Keine Bestrafung oder Druckmechaniken:** Keine Zeitlimits, keine Fehlertöne, keine roten Fehlersignale, keine Streaks, keine Ranglisten und keine Zufallsbelohnungen. Ein falsches Ergebnis führt zu einer sachlichen Rückmeldung mit Lösungshilfe; Belohnungen (Sterne, Sticker) erfolgen gesammelt auf der Abschlusskarte.
* **Didaktisches 3-Stufen-Scaffolding:** Jede Aufgabe verfügt über ein gestuftes Hilfesystem:
  1. *Stufe 1 (Denkstrategie):* Verbaler didaktischer Impuls (z. B. Zerlegungsstrategie, grammatische Sprachprobe).
  2. *Stufe 2 (Anschauungsmittel / Merkregel):* Dynamischer SVG-Rechenstrich, Stellenwerttafel, Farbregeln oder Fachbegriffe.
  3. *Stufe 3 (Teilschritte):* Konkrete Zwischenrechnungen oder Eingabehinweise.
* **Schulbuch-Optik (Anti-SaaS / Anti-KI-Look):** Flächiges Design mit warmem Papierhintergrund, definierten 2px-Rahmen, lokaler österreichischer Schulschrift (*Primae*) und vollständigem Verzicht auf Farbverläufe, Weichzeichner, Schlagschatten oder Chatbot-Metaphern.

---

## 2. Fachbereiche und Kompetenzbereiche

Jede Aufgabe ist einer Schulstufe (1–4) und einer Lehrplan-Referenz (`lehrplanRef`) zugeordnet. Das Feld `lehrplanStatus` unterscheidet, ob der Inhalt im Lehrplan steht (`RIS`) oder schulüblich ist (`SCHULUEBLICH`, zum Beispiel Landeshauptstädte).

### Mathematik
* **Zahlenräume & Grundrechenarten:**
  * 1. Schulstufe: Zahlenraum bis 20, Mengenauffassung am 20er-Feld (Blaue/Rote Wendeplättchen), Addition und Subtraktion ohne/mit Zehnerüberschreitung.
  * 2. Schulstufe: Zahlenraum bis 100, Hunderterfeld, Multiplikation (Einmaleins als wiederholte Addition) und Division (Aufteilen/Verteilen).
  * 3. Schulstufe: Zahlenraum bis 1 000, Rechnen mit Hundertern/Zehnern/Einern, Halbschriftliches Rechnen.
  * 4. Schulstufe: Zahlenraum bis 1 000 000, Stellenwerttafel (M HT ZT T H Z E).
* **Schriftliche Rechenverfahren:** Schriftliche Addition und Subtraktion untereinander (H Z E) mit Übertragszeile (Ü) und Tastatursprung von rechts nach links.
* **Rechenstrukturen & Anschauung:** Rechentürme und Zahlenmauern (Zwei- und dreistöckig), offene Gleichungen.
* **Geometrie & Größen:** Umfang- und Flächenberechnung von Quadrat und Rechteck, Maße und Einheiten ($g$, $dag$, $kg$, $t$; $mm$, $cm$, $dm$, $m$, $km$; Cent, Euro; Minuten, Stunden).
* **Sachrechnen / Textaufgaben:** Dreischrittiger Aufbau (*Frage $\rightarrow$ Rechnung $\rightarrow$ Antwortsatz*).

### Deutsch
* **Phonologische Bewusstheit & Rechtschreibung:** Silbenschwingen, Silbenkönige (Selbstlaute), Groß- und Kleinschreibung von Namenwörtern/Satzanfängen.
* **Grammatik & Sprachbetrachtung:**
  * Wortarten nach österreichischem Farbsystem: Namenwörter/Nomen (Blau), Tunwörter/Verben (Rot), Wiewörter/Adjektive (Grün) mit den zugehörigen Sprachproben (Begleiterprobe, Wir-Probe, Wie-ist-etwas-Probe).
  * Schüttelsätze (syntaktische Segmentierung per Drag-and-Drop oder Klick).
  * Die 4 Fälle des Nomens (Wer-Fall, Wessen-Fall, Wem-Fall, Wen-Fall).
  * Zeitformen (Gegenwart, Mitvergangenheit, Vergangenheit).
* **Leseverständnis (PIRLS-Standard):** Sachtexte mit absatzbezogenen Multiple-Choice-Verständnisfragen.

### Sachunterricht
* **Zeit & Jahreskreis:** Kalendermonate, Wochentage, Jahreszeiten, Feiertage in Österreich.
* **Verkehrs- und Mobilitätsbildung:** Schulwegsicherheit, offizielle Vektor-Verkehrszeichen nach der österreichischen StVO, Vorbereitung auf die Freiwillige Radfahrprüfung.
* **Gemeinschaft & Raum:** Österreichische Bundesländer, Landeshauptstädte, Nachbarstaaten, Wappen und Geografie.
* **Natur:** Angepasste Verhaltensweisen heimischer Tiere im Winter (Winterschlaf, Winterruhe, Winterstarre).

### Arbeitsblätter (alle Fächer)
Für jedes Aufgabengebiet gibt es, wo sinnvoll, ein druckbares A4-Arbeitsblatt für den Ordner mit passendem Lösungsblatt. Aufgaben, die nur am Bildschirm sinnvoll sind (zum Beispiel Memory), sind als `nur-digital` mit Begründung markiert. Die Blätter sind in Schwarzweiß vollständig lösbar und enthalten weder Noten noch Punkte noch Prozente.

### Gehirntraining & Konzentration
* **Muster-Meister:** Logische Reihen und Fortsetzungen.
* **Zahlenfolgen:** Geordnete Zahlenreihen vorwärts und rückwärts.
* **Memory:** Tier- und Bildermemory ohne Zeitdruck.

---

## 3. Technische Architektur

Die Plattform ist als **Zero-Build Vanilla Progressive Web App (PWA)** realisiert. Es existiert keine Kompilierungs-, Transpilierungs- oder Bundling-Stufe (kein Webpack, Vite, Babel oder TypeScript erforderlich).

```
Browser
 ├── index.html                   (Single Page Shell, semantisches HTML5)
 ├── css/
 │    ├── tokens.css              (Design-Tokens: Farben, Typografie, Radien, Touch-Maße)
 │    ├── base.css                (Reset, Primae Typografie, Body-Defaults)
 │    ├── layout.css              (App-Shell, Header, Themenauswahl-Grid, Fokus-Modus)
 │    ├── components.css          (Standard-Aufgabenkarten, Numpad, Scaffolding, Buttons)
 │    ├── exercises.css           (Didaktische Module: Mathe, Deutsch, Sachunterricht, Uhren)
 │    ├── stickers.css            (Sammelalbum und Trophäen-Vitrine, Bilder werden nicht zufällig vergeben)
 │    ├── admin.css               (Eltern- & Lehrkraft-Bereich, PIN-Schutz, Diagnostik)
 │    └── print.css               (A4-Arbeitsblätter-Engine, Knickstreifen, Urkunden)
 │    ├── tokens-druck.css        (Druck-Tokens: Lochrand, Linien, Lineatur, Kästchen, Schriftgrößen in mm und pt)
 ├── js/
 │    ├── core/                   (Zentrale Dienste: format.js, storage.js, random.js, texte.js)
 │    ├── generators/             (Reine, zustandslose Generatoren nach Lehrplan)
 │    ├── validators/             (DOM-unabhängige mathematische & sprachliche Prüflogik)
 │    ├── renderers/              (Modularisierte 3-Zonen-Aufgabenrenderer)
 │    │    ├── scaffolding.js     (Fachdidaktisches Scaffolding & Rechenstrich)
 │    │    ├── shell.js           (3-Zonen-Bühne & Aktionsleiste)
 │    │    ├── math.js            (Gleichungen, Pyramiden, Schriftlich, 20er-Feld)
 │    │    ├── german.js          (Wortarten, Schüttelsätze, Leseverständnis)
 │    │    ├── clocks.js          (Analoge Uhr, Uhr stellen, 4-Uhren-Auswahl)
 │    │    └── general.js         (Multiple Choice, Memory, Muster, Reihenfolge)
 │    ├── renderers.js            (Aggregierte Fassade für Abwärtskompatibilität)
 │    ├── app.js                  (Controller: Routing, Numpad-Bridge, Focus-Mode)
 │    ├── state.js                (PubSub-Event-Bus & Profile)
 │    ├── audio.js                (Hybrid Web Audio Synthesizer + SpeechSynthesis de-AT)
 │    └── admin.js                (Lernstand-Diagnostik, Profilverwaltung, Backup-Engine)
 └── sw.js                        (Service Worker: Cache-First Offline-Strategie)
```

### Technische Eckdaten

* **Laufzeit-Stack:** Reines ECMAScript 2022+ im IIFE-Namensraum `window.Schlaufuchs`, Skripte als klassische `<script>`-Tags in fester Reihenfolge. Ob später ES-Module mit Build-Schritt eingeführt werden, ist offen (siehe Skill `technik-offline-touch`).
* **Offline-Engine:** Service Worker (`sw.js`) fängt alle internen Anfragen ab und bedient sie über die Cache Storage API (Cache-First). Nach einmaligem Aufruf ist die App 100 % autark offline nutzbar.
* **Touch-Optimierung:** 
  * Alle interaktiven Schaltflächen haben ein Mindest-Touch-Target von $56 \times 56\,\text{px}$ (`--ziel-min: 56px`) mit mindestens $12\,\text{px}$ Abstand.
  * Eingebautes Bildschirm-Ziffernpad verhindert das unerwünschte Aufpoppen der nativen Tablet-Tastatur auf iPads und Android-Geräten.
  * Jede Drag-and-Drop-Aufgabe (z. B. Schüttelsätze, Reihen) ist vollständig per Antippen/Klick bedienbar.
* **Audio-Architektur:** 
  * *Klangeffekte:* Synthetisiert über die native Web Audio API (Oszillatoren mit Sinus-/Dreieckswellen, harmonische Dur-Akkorde) – keine externen Audio-Dateien notwendig.
  * *Vorlesefunktion:* Web Speech API (`SpeechSynthesisUtterance`) mit Priorisierung österreichischer Sprachprofile (`de-AT`).
* **Druck-Zentrum:** Dedizierte `@media print`-Stylesheets zur Erzeugung sauberer, schwarz-weißer A4-Arbeitsblätter (zum Abheften im Ordner) samt Lösungsblatt und Urkunden direkt aus dem Browser. Der Druck ist ein weiterer Renderer **desselben** Aufgabenmodells: gleiche Generatoren, gleiche Seeds, keine getrennten Druck-Generatoren. Jede Aufgabe trägt eine Druckentscheidung (`druck: ja | angepasst | nur-digital`). Maße für Lineatur und Kästchen stehen in `css/tokens-druck.css` und sind Schulpraxis, keine amtliche Norm (siehe Skill `arbeitsblatt-druck`).

---

## 4. Datenschutz & Privatsphäre

Schlaufuchs folgt einem strikten **Privacy-by-Design**- und **Zero-Data-Exfiltration**-Ansatz:

* **Keine externen Netzwerk-Requests:** Keine Einbindung von CDNs, Google Fonts, Tracking-Pixeln, Analytics-Diensten oder Werbenetzwerken.
* **Keine Klartext-Identitäten:** Kinderprofile bestehen ausschließlich aus einem frei gewählten Spitznamen und einem Avatar. Das Eingabefeld weist darauf hin, keinen echten Namen zu verwenden. Auf Arbeitsblättern schreibt das Kind seinen Namen selbst auf eine Schreiblinie.
* **Lokale Datenspeicherung:** Sämtliche Lernstände, Sterne und Profile verbleiben im Browser-`localStorage` des Endgeräts.
* **Datensicherung:** Eltern und Lehrkräfte können den Lernstand über das Diagnose-Panel als lesbare (nicht verschlüsselte) JSON-Datei exportieren und auf andere Geräte übertragen. Es werden keine Server-Datenbanken betrieben.

---

## 5. Projektstruktur

```
Schlaufuchs/
├── assets/
│   ├── icons/                   # Monochrome 3px-Vektor-Icons (SVG)
│   └── verkehrszeichen/         # Vektorgrafiken offizieller StVO-Schilder
├── css/
│   ├── tokens.css               # Verbindliche Design-Tokens (Farben, Typo, Maße)
│   └── tokens-druck.css         # Druck-Tokens (Lochrand, Lineatur, Kästchen, Schriftgrößen)
├── docs/
│   ├── lehrplan/                # BMBWF-Lehrplandokumente
│   ├── offene-lehrplanfragen.md # Sammelort aller TODO-LEHRPLAN-Fragen
│   ├── technical.md             # Ausführliche technische Architekturdokumentation
│   └── server-architektur-plan.md # Strategische Analyse zu Server-/Sync-Erweiterungen
├── fonts/                       # Lokale Schulschriften (Primae, PrimaeText)
├── js/
│   ├── core/                    # Basisfunktionen (Formatierung, Zufall, Storage)
│   ├── generators/              # Aufgabengeneratoren (Math, German, General, Brain)
│   ├── validators/              # Antwortvalidatoren
│   ├── admin.js                 # Diagnose & Profilverwaltung
│   ├── app.js                   # App-Steuerung und Ansichten-Management
│   ├── audio.js                 # Audio-Engine (Web Audio + SpeechSynthesis)
│   ├── confetti.js              # Canvas-Konfetti für Auszeichnungs-Karten
│   ├── print.js                 # Druckausgabe für Arbeitsblätter und Urkunden
│   ├── renderers.js             # Einheitliche 3-Zonen-Aufgabenrenderer
│   ├── state.js                 # Statusverwaltung & Profil-Handling
│   └── stickers.js              # Sticker-Sammelalbum
├── scripts/
│   └── check-regeln.mjs         # Statischer Linter für AGENTS.md-Regeln
├── tests/                       # Unit-Tests für Generatoren, Validatoren, Storage
│   ├── format.test.mjs
│   ├── generators.test.mjs
│   ├── print.test.mjs           # Druck: Vollständigkeit, Lösungsblatt, Zahlenformat, Layout
│   ├── storage.test.mjs
│   └── validators.test.mjs
├── AGENTS.md                    # Verbindliche Coding- & Lehrplan-Vorgaben
├── index.html                   # Hauptseite (SPA)
├── manifest.webmanifest         # PWA Web App Manifest
├── style.css                    # Aggregiertes Manifest (@import) für Legacy-Kompatibilität
└── sw.js                        # Cache-First Service Worker
```

---

## 6. Lokale Ausführung & Entwicklung

Da das Projekt keinen Build-Schritt erfordert, genügt jeder lokale Webserver, der statische Dateien ausliefert.

### Schneller Start

**Option A: Python (Standard auf macOS / Linux)**
```bash
python3 -m http.server 8080
```
Öffne anschließend `http://localhost:8080` im Browser.

**Option B: Caddy**
```bash
caddy file-server --listen :8080
```

**Option C: Node.js (npx serve)**
```bash
npx serve -l 8080 .
```

*Hinweis:* Das direkte Öffnen von `index.html` über das `file://`-Protokoll wird nicht empfohlen: Der Service Worker funktioniert dort nicht und auf dem iPad ist es praktisch nicht nutzbar. Für Entwicklung genügt ein lokaler HTTP-Server. Wie Lehrkräfte Arbeitsblätter ohne Server erzeugen können, hängt von der offenen Auslieferungsentscheidung ab (siehe `docs/offene-lehrplanfragen.md`).

---

## 7. Qualitätssicherung & automatisierte Tests

Die Einhaltung fachlicher und didaktischer Regeln wird über automatisierte Tests und statische Linter gesichert.

### 1. Ausführung der Unit-Tests
Das Projekt nutzt den nativen Node.js-Testrunner (Node.js $\ge 18$):

```bash
node --test
```

Geprüft werden u. a.:
* Korrekte Zahlformatierung nach ÖNORM (Schmalspatium ab 4 Ziffern, keine Tausenderpunkte, Dezimalkomma).
* Fehlertolerantes Parsen von Kindereingaben.
* Lehrplankonformität der Generatoren (Zahlenraumbegrenzungen je Schulstufe).
* Mathematische Rechenzeichen ($+$, $-$, $\cdot$, $:$).
* Resilienz der Speicher-Engine (`storage.js`) bei vollem oder deaktiviertem LocalStorage.
* Rechen-, Wort- und Multiple-Choice-Validatoren.
* Druck: Antwortfeld und Lösungsblatt zu jeder druckbaren Aufgabe, gleicher Seed ergibt gleiches Blatt, Zahlenformat und Rechenzeichen im gerenderten HTML.

### 2. Prüfung der verbindlichen Coding-Regeln
Ein projekteigener AST/Regex-Linter prüft die Codebasis gegen die Vorgaben aus `AGENTS.md`:

```bash
node scripts/check-regeln.mjs
```

Der Linter erzwingt:
* Keine unzulässigen Rechenzeichen (`*`, `/`, `➗`) in sichtbaren Texten.
* Kein Tausenderpunkt bei Zahlen.
* Österreichische Rechtschreibung (z. B. Jänner statt Januar).
* Einhaltung der Design-Tokens aus `css/tokens.css` (Ausschluss von Tailwind-Standardfarben und Schatten).
* Vollständigkeit von `schulstufe`, `lehrplanRef`, `lehrplanStatus` und `druck` in Aufgabengeneratoren.
* Druck-Dateien (`js/print.js`, `css/print.css`) unterliegen denselben Regeln wie die App (Farben nur aus Tokens, keine Schatten, kein Tausenderpunkt).

---

## 8. Lehrplanbezug & Normen

* **Curriculum:** Lehrplan der Volksschule 2023, Bundesministerium für Bildung, Wissenschaft und Forschung (BMBWF), [BGBl. II Nr. 178/2025](https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_178/BGBLA_2025_II_178.html).
* **Zahlenschreibweise:** DIN 1333 / ÖNORM A 1083 (Gliederung von Zahlen durch Schmalspatium U+202F, niemals durch Punkte).
* **Sprachstandard:** Österreichisches Wörterbuch (ÖWB), Amtliches Regelwerk für die deutsche Rechtschreibung.
* **Verkehrserziehung:** Österreichische Straßenverkehrsordnung 1960 (StVO) in der geltenden Fassung.
* **Typografie:** Österreichische Schulschrift *Primae* (Genehmigung für Schulbuchverlage / BMBWF).

---

## Lizenz

Entwickelt für den Einsatz an österreichischen Primarstufen. Alle Rechte vorbehalten.
