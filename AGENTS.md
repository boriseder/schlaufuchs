# AGENTS.md – Schlaufuchs (Lernplattform Volksschule Österreich)

Übungs- und Festigungsplattform für Kinder der 1. bis 4. Schulstufe (6–10 Jahre), am Bildschirm **und auf Papier** (Arbeitsblätter für den Ordner).
Sie ergänzt den Unterricht und ersetzt ihn nicht. Sie führt keinen neuen Stoff ein, sondern festigt und übt.

Diese Datei enthält nur die verbindlichen Regeln. Details stehen in den Skills unter `.agents/skills/`.
Lies den passenden Skill, **bevor** du Code schreibst.

## 1. Skills (vor der Arbeit lesen)

| Aufgabe | Skill |
|---|---|
| Inhalt, Aufgaben, Klassenstufen, Fachbegriffe, Zahlenschreibweise | `lehrplan-oesterreich` |
| Aufgabenlogik, Feedback, Hilfen, Belohnung, Anschauungsmittel | `paedagogik-lernlogik` |
| Aussehen, Layout, Farben, Schrift, Icons, Eingabeelemente (App) | `kinder-ui-design` |
| Code, Touch, Speicherung, Offline, Tests, Barrierefreiheit | `technik-offline-touch` |
| Arbeitsblätter, Druck, Lösungsblatt, A4, Lineatur, Schwarzweiß | `arbeitsblatt-druck` |

Berührt eine Änderung Aufgaben, lies **immer** auch `arbeitsblatt-druck`: Jede Aufgabe muss eine Druckentscheidung haben (Regel 14).

## 2. Vorrang bei Konflikten

1. Datenschutz und Sicherheit des Kindes
2. Fachliche Richtigkeit nach österreichischem Lehrplan
3. Kindgerechte Bedienung und Ruhe
4. Technische Eleganz

Bei Unsicherheit zum Lehrplan **nicht raten**: Schreibe den Kommentar `TODO-LEHRPLAN: <Frage>`, trage die Frage in `docs/offene-lehrplanfragen.md` ein und nenne die Stelle im Abschlussbericht.
Das gilt auch für Maße auf Papier (Lineatur, Kästchen, Schriftgrößen): Sie sind Schulpraxis und nicht amtlich genormt.
Der Lehrplan steht unter https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10009275&Artikel=&Paragraf=&Anlage=1&Uebergangsrecht= (Anl. 1, gültig ab 1.9.2025, BGBl. II Nr. 178/2025).
Liegt eine Kopie unter `docs/lehrplan/`, prüfe zuerst dort.

## 3. Harte Regeln

Diese Regeln gelten immer, **auf dem Bildschirm und im Druck**, sofern nicht ausdrücklich „nur App“ oder „nur Druck“ dasteht.
`node scripts/check-regeln.mjs` prüft die meisten automatisch.

**Inhalt**
1. **Zahlen** niemals mit Tausenderpunkt. Ab vier Stellen Spatium `1 000`, `125 000`. Immer über `formatZahl()`, nie `toLocaleString`. Gilt auch im Druck.
2. **Rechenzeichen** `+`, `−`, `·` (mal), `:` (geteilt). Niemals `*`, `/`, `➗` in sichtbaren Texten. Gilt auch im Druck.
3. **Schulstufe** (`schulstufe: 1–4`), `lehrplanRef` und `lehrplanStatus` (`RIS` oder `SCHULUEBLICH`) stehen an jeder Aufgabe. Kein Inhalt außerhalb seiner Schulstufe, Zuordnung laut Skill `lehrplan-oesterreich`. Schulübliche Inhalte (zum Beispiel Landeshauptstädte) werden nie als „Lehrplan“ bezeichnet.
4. **Österreichisches Deutsch**: Jänner, Sessel, Klasse, Schultasche, Mitvergangenheit.
5. **Verkehrszeichen** nur als eigene SVG nach StVO, nie als Emoji.

**Kind und Pädagogik**

6. Keine Bestrafung, keine roten Fehlersignale, keine Fehlertöne, keine Zeitlimits, keine Ranglisten, keine Streaks, keine Zufallsbelohnungen. Sammelbilder sind erlaubt, wenn sie **nicht zufällig** vergeben werden: Jede beendete Serie schaltet ein vorher sichtbares Bild frei (kein „Booster“, keine Verlosung, kein Verlust, siehe `paedagogik-lernlogik`). Im Druck gibt es keine Punkte, Noten, Prozente oder Rangfolgen.
7. **Nur App:** Beim Üben steht genau **eine** Aufgabe im Fokus. Konfetti, Sterne und Ergebnis erst auf der Abschlusskarte.
8. **Nur App:** Keine Dauer-Animationen (`infinite`). Bewegung nur als kurze Reaktion auf eine Berührung. `prefers-reduced-motion` wird beachtet, auch für Canvas-Konfetti (Konfetti dann ganz weglassen).
9. Farbe trägt nie allein eine Bedeutung. Immer zusätzlich Symbol, Form oder Text. Textkontrast mindestens 4,5 : 1.

**Technik**

10. **Keine externen Requests**: keine CDNs, keine Google Fonts, keine Tracker, keine Cookies, keine Analytics. Auch Druckseiten enthalten keine externen Links oder QR-Codes.
11. **Kein Klarname** eines Kindes wird gespeichert oder gedruckt. Profile bestehen aus frei gewähltem Spitznamen und Avatar, das Eingabefeld weist darauf hin, keinen echten Namen zu verwenden. Auf Arbeitsblättern schreibt das Kind seinen Namen selbst auf eine Schreiblinie. Nichts verlässt das Gerät.
12. **Nur App:** Touch zuerst. Ziele mindestens 56 px, Abstand mindestens 12 px. Jede Ziehen-Aufgabe ist auch per Antippen lösbar.
13. Kein `user-scalable=no`, kein `maximum-scale`.

**Druck (Arbeitsblätter)**

14. Jeder Aufgabentyp hat eine Druckentscheidung im Aufgabenmodell: `druck: "ja" | "angepasst" | "nur-digital"`. Bei `angepasst` und `nur-digital` ist `druckHinweis` Pflicht (Begründung oder Anpassung). Fehlt die Entscheidung, wirft der Test einen Fehler.
15. Druck nutzt **dieselben Generatoren und Seeds** wie die App. Es gibt keine getrennten Druck-Generatoren. Zu jedem Übungsblatt gehört ein Lösungsblatt, der Seed steht in der Fußzeile.
16. Im Druck trägt Farbe nie allein eine Bedeutung. Jedes Blatt ist in **Schwarzweiß vollständig lösbar** (Linien, Text und Form tragen die Information, Flächenfarben sind nur Zusatz).
17. Maße für Lineatur, Kästchen und Schrift kommen ausschließlich aus `css/tokens-druck.css`. Aufgabentext im Druck nie kleiner als 14 pt, Format A4 hoch mit Lochrand, keine Aufgabe über zwei Seiten zerschnitten.

## 4. Anti-KI-Optik (Kurzfassung)

Das Ziel ist ein Schulbuch- und Arbeitsblatt-Look, kein SaaS-Look. Farben, Abstände und Rahmen kommen ausschließlich aus den Design-Tokens (`css/tokens.css`, im Druck `css/tokens-druck.css`).
Positiv gesagt: Papierton und `2px`-Rahmen in den Tokens, Linienzeichnungen mit 3 px, `Primae` und `PrimaeText`, ein Radius für alles.

- Keine Verläufe, kein Glassmorphism, keine Schatten als Gestaltungsmittel.
- Keine Emoji als Bedienelemente. Icons sind eigene SVG.
- Keine Chat-Oberfläche und keine KI-Symbole (Funken, Zauberstab, Roboter).
- Keine Karten in Karten. Maximal eine Rahmen-Ebene.

## 5. Arbeitsweise und Definition of Done

Eine Änderung ist fertig, wenn:

- [ ] die passenden Skills gelesen und angewendet sind,
- [ ] `node scripts/check-regeln.mjs` ohne Fehler läuft (umfasst `js/print.js` und `css/print.css`),
- [ ] alle Tests laufen (`node --test tests/*.test.mjs` ohne Fehler),
- [ ] die gesamte Pipeline (Thema → Generator → gerendertes HTML, App **und** Druck) durch Integrationstests auf Vollständigkeit, didaktische Lösbarkeit und Layout-Integrität geprüft ist (Beispiel: Generator erzeugt nur Aufgaben mit genau einer Lösung im Zahlenraum der Schulstufe),
- [ ] keine stillen Fallbacks existieren (Fehlende Ressourcen oder unbekannte IDs werfen sofort Fehler statt stiller Fallback-Emojis – Fail-Fast-Prinzip),
- [ ] die Aufgabe ohne Netz funktioniert,
- [ ] sie auf Touch ohne Tastatur lösbar ist (Ziffernfeld in der App),
- [ ] die Druckentscheidung (`druck`) gesetzt ist, bei `ja` und `angepasst` ein A4-Blatt samt Lösungsblatt erzeugt wird, keine Aufgabe über eine Seitengrenze geteilt ist und der Schwarzweiß-Vorschau-Test bestanden ist,
- [ ] Änderungen an Dateien, die der Service Worker ausliefert, die Cache-Version in `sw.js` erhöhen (sonst sehen installierte Geräte alte Inhalte),
- [ ] offene Lehrplanfragen als `TODO-LEHRPLAN` markiert, in `docs/offene-lehrplanfragen.md` eingetragen und im Bericht genannt sind.

Im Abschlussbericht nennst du: was geändert wurde, welche Regeln betroffen waren, was du nicht prüfen konntest (insbesondere: Ausdruck auf Papier, iPad Safari).

## 6. Projektstruktur (Ist-Zustand laut README, Abweichungen sind markiert)

```
index.html
manifest.webmanifest
sw.js                    Service Worker (Precache mit Versionsnummer)
style.css                Sammeldatei (@import), nur Legacy
css/tokens.css           Design-Tokens (einzige Quelle für Farben, Abstände, Rahmen)
css/tokens-druck.css     Druck-Tokens (Maße in mm und pt)               [NEU]
css/base.css  layout.css  components.css  exercises.css
css/stickers.css  admin.css  print.css
js/core/                 format.js, storage.js, random.js (Seed), texte.js
js/generators/           reine Datenobjekte (task-Modell), je Fach und Schulstufe
js/validators/           Prüfung der Eingabe, unabhängig von der Darstellung
js/renderers/            DOM-Renderer (shell, scaffolding, math, german, clocks, general)
js/renderers.js          Fassade (Abwärtskompatibilität)
js/print.js              Druck-Renderer (Arbeitsblatt, Lösungsblatt, Urkunde)
js/app.js  state.js  audio.js  admin.js  confetti.js  stickers.js
assets/icons/            eigene SVG-Icons
assets/verkehrszeichen/  SVG nach StVO
fonts/                   Primae, PrimaeText (lokal)
tests/                   format, generators, storage, validators, print    [print.test.mjs NEU]
scripts/check-regeln.mjs
docs/lehrplan/           Lehrplan-PDF (optional)
docs/offene-lehrplanfragen.md                                           [NEU]
.agents/skills/          lehrplan-oesterreich, paedagogik-lernlogik,
                         kinder-ui-design, technik-offline-touch,
                         arbeitsblatt-druck                              [NEU]
```

Hinweis: Ältere Skill-Texte nennen `js/render/` und die Ladereihenfolge `core, validators, generators, render, main`. Maßgeblich ist die Struktur oben (`js/renderers/`). Wird die Struktur geändert, ändere README, diese Datei und `technik-offline-touch` gemeinsam.
