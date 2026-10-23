# AGENTS.md – Schlaufuchs (Lernplattform Volksschule Österreich)

Übungs- und Festigungsplattform für Kinder der 1. bis 4. Schulstufe (6–10 Jahre).
Sie ergänzt den Unterricht und ersetzt ihn nicht. Sie führt keinen neuen Stoff ein, sondern festigt und übt.

Diese Datei enthält nur die verbindlichen Regeln. Details stehen in den Skills unter `.agents/skills/`.
Lies den passenden Skill, **bevor** du Code schreibst.

## 1. Skills (vor der Arbeit lesen)

| Aufgabe | Skill |
|---|---|
| Inhalt, Aufgaben, Klassenstufen, Fachbegriffe, Zahlenschreibweise | `lehrplan-oesterreich` |
| Aufgabenlogik, Feedback, Hilfen, Belohnung, Anschauungsmittel | `paedagogik-lernlogik` |
| Aussehen, Layout, Farben, Schrift, Icons, Eingabeelemente | `kinder-ui-design` |
| Code, Touch, Speicherung, Offline, Tests, Barrierefreiheit | `technik-offline-touch` |

## 2. Vorrang bei Konflikten

1. Datenschutz und Sicherheit des Kindes
2. Fachliche Richtigkeit nach österreichischem Lehrplan
3. Kindgerechte Bedienung und Ruhe
4. Technische Eleganz

Bei Unsicherheit zum Lehrplan **nicht raten**: Schreibe den Kommentar `TODO-LEHRPLAN: <Frage>` und nenne die Stelle im Abschlussbericht.
Der Lehrplan steht unter https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10009275&Artikel=&Paragraf=&Anlage=1&Uebergangsrecht= (Anl. 1, gültig ab 1.9.2025, BGBl. II Nr. 178/2025).
Liegt eine Kopie unter `docs/lehrplan/`, prüfe zuerst dort.

## 3. Harte Regeln

Diese Regeln gelten immer. `node scripts/check-regeln.mjs` prüft die meisten automatisch.

**Inhalt**
1. **Zahlen** niemals mit Tausenderpunkt. Ab vier Stellen Spatium `1 000`, `125 000`. Immer über `formatZahl()`, nie `toLocaleString`.
2. **Rechenzeichen** `+`, `−`, `·` (mal), `:` (geteilt). Niemals `*`, `/`, `➗` in sichtbaren Texten.
3. **Schulstufe** (`schulstufe: 1–4`) und `lehrplanRef` stehen an jeder Aufgabe. Kein Inhalt außerhalb seiner Schulstufe, Zuordnung laut Skill `lehrplan-oesterreich`.
4. **Österreichisches Deutsch**: Jänner, Sessel, Klasse, Schultasche, Mitvergangenheit.
5. **Verkehrszeichen** nur als eigene SVG nach StVO, nie als Emoji.

**Kind und Pädagogik**

6. Keine Bestrafung, keine roten Fehlersignale, keine Fehlertöne, keine Zeitlimits, keine Ranglisten, keine Streaks, keine Zufallsbelohnungen.
7. Beim Üben steht genau **eine** Aufgabe im Fokus. Konfetti, Sterne und Ergebnis erst auf der Abschlusskarte.
8. Keine Dauer-Animationen (`infinite`). Bewegung nur als kurze Reaktion auf eine Berührung. `prefers-reduced-motion` wird beachtet.
9. Farbe trägt nie allein eine Bedeutung. Immer zusätzlich Symbol oder Text. Textkontrast mindestens 4,5 : 1.

**Technik**

10. **Keine externen Requests**: keine CDNs, keine Google Fonts, keine Tracker, keine Cookies, keine Analytics.
11. **Kein Klarname** eines Kindes wird gespeichert (Spitzname und Avatar). Nichts verlässt das Gerät.
12. **Touch zuerst**: Ziele mindestens 56 px, Abstand mindestens 12 px. Jede Ziehen-Aufgabe ist auch per Antippen lösbar.
13. Kein `user-scalable=no`, kein `maximum-scale`.

## 4. Anti-KI-Optik (Kurzfassung)

Das Ziel ist ein Schulbuch- und Arbeitsblatt-Look, kein SaaS-Look. Farben, Abstände und Rahmen kommen ausschließlich aus den Design-Tokens im Skill `kinder-ui-design`.

- Keine Verläufe, kein Glassmorphism, keine Schatten als Gestaltungsmittel.
- Keine Emoji als Bedienelemente. Icons sind eigene SVG.
- Keine Chat-Oberfläche und keine KI-Symbole (Funken, Zauberstab, Roboter).
- Keine Karten in Karten. Maximal eine Rahmen-Ebene.

## 5. Arbeitsweise und Definition of Done

Eine Änderung ist fertig, wenn:

- [ ] die passenden Skills gelesen und angewendet sind,
- [ ] `node scripts/check-regeln.mjs` ohne Fehler läuft,
- [ ] alle Tests laufen (`node --test tests/*.test.mjs` ohne Fehler),
- [ ] die gesamte Pipeline (Thema → Generator → gerendertes HTML) durch Integrationstests auf Vollständigkeit, didaktische Lösbarkeit und Layout-Integrität geprüft ist,
- [ ] keine stillen Fallbacks existieren (Fehlende Ressourcen oder unbekannte IDs werfen sofort Fehler statt stiller Fallback-Emojis – Fail-Fast-Prinzip),
- [ ] die Aufgabe ohne Netz funktioniert,
- [ ] sie auf Touch ohne Tastatur lösbar ist (Ziffernfeld in der App),
- [ ] offene Lehrplanfragen als `TODO-LEHRPLAN` markiert und im Bericht genannt sind.

Im Abschlussbericht nennst du: was geändert wurde, welche Regeln betroffen waren, was du nicht prüfen konntest.

## 6. Projektstruktur (Soll, an den Ist-Zustand anpassen)

```
index.html
css/tokens.css          Design-Tokens (einzige Quelle für Farben, Abstände, Rahmen)
css/app.css
js/core/                Namespace window.Schlaufuchs, Storage, Format, Zufall (mit Seed)
js/generators/          reine Datenobjekte (task-Modell), je Fach und Schulstufe
js/validators/          Prüfung der Eingabe, unabhängig von der Darstellung
js/render/              DOM-Renderer
assets/icons/           eigene SVG-Icons
assets/verkehrszeichen/ SVG nach StVO
fonts/                  Primae, PrimaeText (lokal)
tests/
scripts/check-regeln.mjs
docs/lehrplan/          Lehrplan-PDF (optional)
```
