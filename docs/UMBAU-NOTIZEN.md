# Umbau-Notizen (für Menschen, nicht für den Agenten)

Diese Datei wird vom Agenten nicht gelesen. Sie erklärt, was sich gegenüber der alten AGENTS.md geändert hat und was du noch entscheiden oder prüfen musst.

## 1. Installation

Kopiere in das Repository:

```
AGENTS.md
.agents/skills/            (4 Skill-Ordner)
scripts/check-regeln.mjs
docs/UMBAU-NOTIZEN.md      (optional)
```

- Kopiere `.agents/skills/kinder-ui-design/tokens.css` nach `css/tokens.css` und binde sie als erste Stylesheet-Datei ein.
- Antigravity liest `AGENTS.md` im Projekt-Root. Skills liegen unter `.agents/skills/<name>/SKILL.md` und werden bei passender Aufgabe geladen.
- Die neue AGENTS.md hat rund 4,8 KB statt 19 KB. Antigravity begrenzt Rules laut einer Quelle auf etwa 12 000 Zeichen. Die alte Datei lag darüber, das Ende (Checkliste) wurde möglicherweise abgeschnitten.
- Prüfen: `node scripts/check-regeln.mjs` (mit `--strict` auch Warnungen als Fehler, zum Beispiel in CI).
  Der erste Lauf auf dem bestehenden Code wird viele Emoji-Warnungen und einige Fehler liefern. Das ist die Migrationsliste.
- Optional in `package.json`: `"scripts": { "check": "node scripts/check-regeln.mjs", "test": "node --test" }`.

## 2. Wo ist was gelandet

| Alte AGENTS.md | Neu |
|---|---|
| 1.1 Zahlen, Rechenzeichen | AGENTS.md (Regeln 1 und 2), `lehrplan-oesterreich/SKILL.md`, `formatZahl()` in `technik-offline-touch` |
| 1.1 Mathematik je Klasse | `lehrplan-oesterreich/mathematik.md` (mit Prüfstatus) |
| 1.1 Deutsch | `lehrplan-oesterreich/deutsch.md` |
| 1.1 Sachunterricht, Verkehrszeichen | `lehrplan-oesterreich/sachunterricht-verkehr.md` |
| 1.2 Didaktik, Gamification | `paedagogik-lernlogik/SKILL.md` |
| 1.3 Typografie, Symbole | `kinder-ui-design/SKILL.md` (Schrift, Icons), `lehrplan-oesterreich/mathematik.md` (schriftliche Verfahren) |
| 2.1 Touch | AGENTS.md (Regel 12, 13), `technik-offline-touch` |
| 2.2 Offline, Datenschutz | AGENTS.md (Regeln 10, 11), `technik-offline-touch` |
| 2.3 Architektur | `technik-offline-touch` |
| 2.4 Audio | `paedagogik-lernlogik` (Abschnitt 6), `technik-offline-touch` |
| 2.5 und 2.6 Design | `kinder-ui-design/SKILL.md`, `tokens.css` |
| 3 Checkliste | AGENTS.md (Definition of Done) und `check-regeln.mjs`, je Skill eine Kurz-Checkliste |

## 3. Wichtigste Änderungen in der Sache

**Lehrplan.** Das aktuelle RIS-Dokument (Anl. 1, gültig ab 1.9.2025) wurde geprüft. Der Abschnitt zu den Fachlehrplänen war bei meinem Abruf zu lang. Die Klassenzuordnung stützt sich daher teils auf die Zusammenfassung des Veritas-Verlags und trägt den Status `[VERLAG]` oder `[OFFEN]`. Folgendes wich von der alten Datei ab:

- Uhrzeit: **volle Stunden schon in der 1. Schulstufe**, Stunden und Minuten in der 3. Schulstufe (alt: 3. Klasse insgesamt).
- Maßeinheit **dag** und Sekunde, halbe und Viertelstunde: **2. Schulstufe** (alt: dag in der 4. Klasse).
- **Umfang** von Quadrat und Rechteck: **3. Schulstufe** (alt: 4. Klasse).
- 1. Schulstufe: Zahlen **bis 100** darstellen, lesen, schreiben (alt: Zahlenraum 20).
- Zahlenraum 1 000 wird in der 2. Schulstufe mit Material **kennengelernt**.
- **Schriftliche Division** (einstelliger Divisor) im Zahlenraum 1 000 in der 3. Schulstufe.
- Neu im Lehrplan: **Daten** (Strichlisten, Diagramme), Kombinatorik, qualitative Wahrscheinlichkeit, rechter Winkel.
- Bestätigt: Keine Multiplikation und Division in der 1. Schulstufe (Anbahnung erst in der 2. Schulstufe). Meine frühere Kritik, das Verbot sei zu hart, war nach dem neuen Lehrplan nicht berechtigt.
- Sachunterricht: Der Lehrplan gibt **kaum feste Themen** vor. Bundesländer, Hauptstädte und Radfahrprüfung sind schulüblich und keine Lehrplanpflicht. Sie sind in der Datei entsprechend gekennzeichnet.
- Die Zusammenfassung zu Grundstufe I und II entfällt laut Empfehlung der Beratungsgruppe (2021) im neuen Lehrplan. Im Code gilt `schulstufe: 1–4`.
- Das Ministerium heißt inzwischen offenbar **BMB** (Domain bmb.gv.at). Die Bezeichnung BMBWF wurde entfernt.

**Widersprüche aufgelöst.**

- Prozentbalken: gestrichen (Prozent ist kein Volksschulstoff, und der Fokusmodus verbietet Fortschrittsbalken). Sterne und gefüllte Symbole stattdessen.
- Farbcode: Blau war doppelt belegt (Mathematik und Nomen). Fächer haben jetzt eigene Farben, Wortart-Farben gelten nur in Wortart-Aufgaben und mit Form-Symbol.
- Rückmeldefarben: weder Rot noch Grün (Farbsehschwäche), stattdessen Gelb und Grau-Blau mit Symbol.
- „2px-Rahmen“ gegen „keine Karten in Karten“: Es gilt **eine** Rahmenebene.
- „Keine Texteingabe“ gegen Rechtschreibung: Chat-Eingaben sind verboten, Wort-Eingabe für Rechtschreibaufgaben ist erlaubt.
- `#f8fafc` (kaltes Tailwind-Weiß) ersetzt durch `#FBF7EE` (warmes Papier).
- Touch-Ziele: 56 px und 12 px Abstand (vorher 48 bis 52 und 8).
- Zahleneingabe: Ziffernfeld in der App statt `type="number"` mit Systemtastatur.

**Neu aufgenommen.** Hilfestufen und erklärendes Feedback, Anschauungsmittel (Zwanzigerfeld, Hunderterfeld, Stellenwert-Material), Belohnung ohne Perfektionsdruck, keine Ranglisten und Streaks, Pausenhinweis, Vorlesen als Standard in Schulstufe 1 und 2, Deutsch als Zweitsprache, Backup des Lernstands, Pointer Events statt HTML5-Drag-and-Drop, Tests mit Seed, Lint-Skript.

## 4. Entscheidungen, die bei dir liegen

1. **Auslieferung auf dem iPad.** Eine lokale `index.html` über `file://` ist dort praktisch nicht nutzbar, und Service Worker brauchen HTTPS. Empfehlung: statisch hosten und als Home-Bildschirm-App installieren. Die App läuft danach offline. `file://` bleibt für Entwicklung und Desktop. Die alte Regel „muss über `file://` voll funktionieren“ ist deshalb abgeschwächt.
2. **Speicher.** `localStorage` kann auf dem iPad gelöscht werden. Deshalb ist ein Backup (Datei) vorgesehen. Soll später eine Synchronisierung folgen, brauchst du Einwilligung der Erziehungsberechtigten und eine Datenschutz-Folgenabschätzung.
3. **Build-Schritt.** Der Namespace `window.Schlaufuchs` mit Script-Tags bleibt vorgeschrieben. Mit esbuild wären ES-Module und Typen möglich, ohne `file://` zu verlieren.
4. **Zifferngruppierung ab vier Stellen.** Die alte Datei erlaubte `1000` und `1 000`. Jetzt gilt einheitlich `1 000`, damit der Agent nicht mischt. Ändere die Regel, wenn deine Schulbücher anders schreiben.
5. **Primae.** Lizenz für Self-Hosting als Webfont klären und die Glyphen prüfen (`· × : − ² ß €` und U+202F).
6. **Sammelalbum.** Es ist nur als Lohn für beendete Serien vorgesehen. Entscheide, ob du es überhaupt behältst.

## 5. Zu prüfen (Lehrplan und Fachwissen)

Alle `[OFFEN]`-Einträge in `.agents/skills/lehrplan-oesterreich/`. Am wichtigsten:

- Schulstufe der schriftlichen Addition und Subtraktion (vorläufig 3), der schriftlichen Multiplikation (Rechenrichtung festlegen) und der vier Fälle.
- Gesamte 4. Schulstufe Mathematik (Zahlenraum 1 000 000, Flächeninhalt).
- Geld (Euro, Cent) und Division mit Rest.
- Verkehrszeichen: Randfarbe der Vorrangstraße, Schutzweg-Piktogramm, Hintergrund des Gefahrenzeichens, Geh- und Radweg gegen die StVO.
- Reflektoren am Fahrrad.
- ÖNORM für die Zahlenschreibweise (die frühere Angabe „DIN/ÖNORM 1083“ konnte ich nicht bestätigen).

**Vorschlag für den Abgleich mit Antigravity.** Lege das Lehrplan-PDF nach `docs/lehrplan/Lehrplan-VS-2025.pdf` (RIS: https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40271469/NOR40271469.pdf) und gib dem Agenten diesen Auftrag:

> Lies `docs/lehrplan/Lehrplan-VS-2025.pdf` (Fachlehrpläne Mathematik, Deutsch, Sachunterricht, Verkehrs- und Mobilitätsbildung). Gleiche jede Zeile mit Status `[OFFEN]`, `[VERLAG]` oder `[SCHULÜBLICH]` in `.agents/skills/lehrplan-oesterreich/*.md` mit dem Lehrplantext ab. Ersetze den Status durch `[RIS]` und nenne die Seite, oder korrigiere die Zeile. Ändere sonst nichts. Liste am Ende alle Abweichungen auf.

Prüfe die Ergebnisse stichprobenartig selbst, bevor du sie übernimmst.

## 6. Grenzen dieser Überarbeitung

- Ich kenne dein Repository nicht. Die Projektstruktur in AGENTS.md ist ein Soll und muss an den Ist-Zustand angepasst werden.
- Das Lint-Skript wurde an Testdateien geprüft, nicht an deinem Code. Es arbeitet zeilenweise und erkennt nicht alles (zum Beispiel Tausenderpunkte, die per Code zusammengesetzt werden). Es ersetzt keine Durchsicht.
- Die Farbpalette wurde auf Kontrast geprüft (Text auf Papier und Fächerfarben mit weißer Schrift mindestens 4,7 : 1). Teste sie trotzdem mit Kindern, vor allem mit Farbsehschwäche.
- Pädagogische Vorgaben wie 5 bis 8 Aufgaben je Serie oder der Pausenhinweis nach 15 bis 20 Minuten sind begründete Richtwerte und keine Lehrplanvorgaben. Stimme sie mit Lehrkräften ab.
