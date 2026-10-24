---
name: kinder-ui-design
description: Verwende diesen Skill bei jeder Änderung an Oberfläche, Layout, Farben, Schrift, Icons, Menü, Übungsansicht, Eingabefeldern oder Animationen für Kinder von 6 bis 10 Jahren. Enthält Design-Tokens und die Anti-KI-Optik-Regeln.
---

# Kinder-UI-Design (Schulbuch-Look statt SaaS-Look)

Dieser Skill gilt für die **App am Bildschirm**. Für gedruckte Arbeitsblätter gilt `arbeitsblatt-druck` (eigene Tokens in `tokens-druck.css`, Maße in mm und pt, Schwarzweiß-Tauglichkeit). Der Look (Linien statt Schatten, keine Verläufe, Primae) bleibt gleich.

Vorlage für die Tokens: `tokens.css` in diesem Ordner. Sie wird nach `css/tokens.css` kopiert und ist die **einzige Quelle** für Farben, Abstände und Rahmen.
Schreibe keine Farbwerte, Radien oder Schatten direkt in Komponenten-CSS.

## 1. Bildsprache: was wir wollen

Ein Arbeitsblatt oder Schulbuch: ruhiges Papier, klare Tinte, deutliche Linien.

- Hintergrund warmes Papier (`--papier`), Aufgabenblatt weiß (`--flaeche`) mit `2px`-Rahmen in `--linie`.
- Flächige Farben, keine Verläufe, keine Schatten, kein Blur.
- Ein Radius für alles (`--radius`, 8 px). **Keine Pillen-Buttons**, keine großen runden Karten.
- Illustrationen und Icons: einheitlich als SVG, Linienstärke 3 px, flache Farbe, einfache Formen, ohne Perspektive und Verlauf.
- Orientierung: Seite aus einem Arbeitsheft, nicht Dashboard aus einer Web-App.

## 2. Was wir nicht wollen (Anti-KI-Optik)

| Vermeiden | Stattdessen |
|---|---|
| Funken, Zauberstab, Roboter, Gehirn-Clipart als Symbol | Gegenständliche Symbole: Stift, Lupe, Lautsprecher, Haken, Buch |
| Verläufe (Lila-Cyan), Mesh, Glassmorphism, Glow | Flächige Farbe aus den Tokens |
| Schatten und schwebende Karten | `2px`-Rahmen |
| Karten in Karten, Karten für alles | Maximal **eine** Rahmenebene. Gruppen mit Abstand und Linie |
| Emoji als Bedienelemente | Eigene SVG-Icons (`assets/icons/`) |
| Chat-Blasen, „Frag Schlaufuchs …“ | Kacheln, Zahlenfelder, Auswahlkarten |
| Pillen, Badges, Chips überall | Rechteck mit `--radius` |
| Modische Tech-Schriften, dünne Schnitte | Primae und PrimaeText (siehe 4) |
| Tailwind-Standardfarben (zum Beispiel `#f8fafc`) | Tokens |
| Zufällige Illustrationen im „Startup-Stil“ | Ruhige, einheitlich gezeichnete Schulbuchmotive |

Der Maskottchen-Fuchs (falls verwendet) ist ein **statisches** SVG. Er bewegt sich nur auf eine Berührung hin, kurz.

## 3. Farbe

- **Fächerfarben:** Mathematik `--mathe` (Blau), Deutsch `--deutsch` (Ziegel), Sachunterricht `--sach` (Grün), Denken `--denken` (Violett).
  Jedes Fach hat zusätzlich ein **Symbol** und den **Namen**. Farbe allein genügt nie (Farbsehschwäche betrifft etwa jeden zwölften Buben).
- **Rückmeldung:** richtig = `--richtig` (Gelb) mit Haken-Symbol. Noch nicht = `--nochmal` (Grau-Blau) mit Symbol „Nochmal“. **Kein Rot, kein Grün** als Rückmeldung.
- **Wortart-Farben** (Nomen blau, Verb rot, Adjektiv grün) sind Lehrmittelkonvention und nur in Wortart-Aufgaben erlaubt, immer mit Form-Symbol (siehe `lehrplan-oesterreich/deutsch.md`). Weil Mathematik ebenfalls blau, Sachunterricht grün und Deutsch ziegelrot ist, legt `tokens.css` die Wortart-Farben als eigene Gruppe `--wortart-*` an und nutzt sie nicht für Fächerflächen. Im Druck trägt Linienart plus Symbol die Bedeutung (siehe `arbeitsblatt-druck`).
- Text auf Papier mindestens 4,5 : 1. Prüfe neue Farben, bevor sie ins Token-File kommen.
- Dunkelmodus ist nicht vorgesehen.

## 4. Schrift

- **Primae** (Rechenterme, Ziffern, Überschriften) und **PrimaeText** (Fließtext, Anweisungen) liegen lokal in `fonts/` als WOFF2.
- Vor dem Einbau: **Lizenz** für Self-Hosting als Webfont klären und die Glyphen prüfen: `· × : − ² ß ä ö ü Ä Ö Ü €` und U+202F (Zifferngruppierung). Fehlt ein Zeichen, definiere einen Fallback im `font-family`, nicht im Text.
- Grundgröße 20 px, Aufgabe im Fokus `2,4 rem`, Zeilenhöhe 1,5. Nie kleiner als 16 px.
- Rechenterme linksbündig oder im Rechenstrich-Raster, Ziffern gleich breit (`font-variant-numeric: tabular-nums`), damit Stellenwerte untereinander stehen.
- Keine Kursivschrift für Fließtext, kein reines Versalien-Setzen. `PrimaeText-Cursive` nur auf Urkunden.

## 5. Ansichten

### Übersicht (Menü)

- Öffnet gefiltert auf die **freigeschalteten Schulstufen** des aktiven Kindes. Ein flaches Segmented Control wechselt die Schulstufe.
- Kacheln **ohne Fließtext**: Symbol, Titel, kleine Schulstufenangabe, Sterne (0 bis 3). Keine Prozentangabe.
- Beim Tippen auf den Titel liest eine Lautsprecher-Funktion den Namen vor (Schulstufe 1 und 2).
- Kopfzeile aufgeräumt: links Kind (Avatar und Sterne), rechts die Werkzeuge (Ton, Album, Arbeitsblätter, Einstellungen). „Arbeitsblätter“ öffnet die Druckauswahl (Fach, Schulstufe, Thema, Anzahl, Hilfen, Lösungsblatt) im Eltern- und Lehrerbereich-Stil, ohne Sterne und ohne Fortschrittsanzeige.
- Maximal ca. 8 Kacheln sichtbar, der Rest per Fach-Auswahl. Keine Wand aus 27 Kacheln.

### Übungsansicht (Fokusmodus)

- **Kein globaler Header.** Eine einzige Leiste (56 px): links `Zurück` (Pfeil-Symbol und Wort), Mitte Schrittpunkte, rechts Vorlesen und Aufgaben-Regeneration.
- Die Aufgabe steht groß und zentriert. Sie ist **nicht** eine kleine Box im leeren Raum, sondern der Arbeitsplatz.
- Drei Bereiche übereinander, durch `2px`-Linien getrennt: **Aufgabe**, **Eingabe**, **Rückmeldung**. Das ist eine Ebene, keine Schachtelung.
- Abbrechen sichert den Zwischenstand. Der Dialog ist freundlich: „Hier weitermachen?“ mit zwei klaren Schaltflächen.
- Keine Dauer-Animationen. Siehe 7.

### Abschlusskarte

- Sterne, Lob, Konfetti (kurz) und ein großer Knopf „Weiter“. Keine Tabelle, kein Prozentwert.

## 6. Eingabe

- **Zahlen:** eigenes **Ziffernfeld in der App** (0 bis 9, Löschen, Fertig), große Tasten (mindestens 64 px). Es verdeckt nicht die Aufgabe und funktioniert ohne Systemtastatur.
  Das Eingabefeld ist `readonly` mit `inputmode="none"` oder wird als Anzeige ohne Eingabefeld umgesetzt. Barrierefreiheit: Tasten sind echte `<button>`.
- Division mit Rest hat zwei getrennte Felder (Ergebnis und Rest).
- **Wörter:** normales Eingabefeld mit Bildschirmtastatur ist erlaubt (Rechtschreibung verlangt Schreiben). Kein Autokorrektur-Eingriff: `autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"`.
- **Auswahl:** Karten mit mindestens `--ziel-min` Höhe, Abstand `--ziel-abstand`.
- **Ziehen und Ablegen:** immer auch Antippen (erst Karte, dann Ziel). Umsetzung mit Pointer Events (siehe `technik-offline-touch`).

## 7. Bewegung

- Erlaubt: kurze Reaktion (unter 300 ms) auf eine Berührung, Karte umdrehen, Konfetti am Ende. Bei `prefers-reduced-motion` entfällt das Canvas-Konfetti ganz (CSS allein erfasst Canvas nicht).
- Verboten: `animation-iteration-count: infinite`, Pulsieren, Wippen, Leuchten, Parallax, automatisch laufende Karussells, wandernde Hintergründe.
- Nutze nur `transform` und `opacity`. Beachte `prefers-reduced-motion` (ist in `tokens.css` enthalten).
- Kein Blinken, nichts, das mehr als dreimal pro Sekunde wechselt.

## 8. Sprache in der Oberfläche

- Du-Form, kurze Hauptsätze, aktiv. Schaltflächen sind Verben: „Weiter“, „Nochmal“, „Fertig“, „Vorlesen“.
- Keine Fachbegriffe der Informatik („Profil“, „Einstellungen“ nur im Eltern- und Lehrerbereich).
- Texte stehen zentral in `js/core/texte.js`.

## 9. Druck

- Nicht hier regeln, sondern in `arbeitsblatt-druck`: Blattaufbau, Lineatur, Kästchen, Schriftgröße in pt, Lochrand, Lösungsblatt.
- Jede neue Eingabeform braucht eine Druckentscheidung (`druck` am Aufgabenmodell), bevor sie als fertig gilt.

## Checkliste

- [ ] Alle Farben, Abstände, Rahmen aus `tokens.css`
- [ ] Keine Verläufe, Schatten, Blur, Emoji-Bedienelemente, Chat-Elemente
- [ ] Höchstens eine Rahmenebene
- [ ] Fokusmodus: genau eine Leiste, genau eine Aufgabe, Dreiteilung Aufgabe, Eingabe, Rückmeldung
- [ ] Farbe immer mit Symbol oder Text, Kontrast mindestens 4,5 : 1
- [ ] Ziele mindestens 56 px, Abstand mindestens 12 px
- [ ] Keine Dauer-Animation, Reduced Motion beachtet
- [ ] Ziffernfeld in der App, Wort-Eingabe ohne Autokorrektur
- [ ] Druckentscheidung für neue Aufgabentypen gesetzt (siehe `arbeitsblatt-druck`)
