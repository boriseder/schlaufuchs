---
name: arbeitsblatt-druck
description: Verwende diesen Skill, wenn Arbeitsblätter, Lösungsblätter, Druckansicht, A4-Layout, Lineatur, Rechenkästchen, Schwarzweiß-Tauglichkeit oder die Druckdarstellung eines Aufgabentyps der Lernplattform erstellt oder geändert werden.
---

# Arbeitsblätter zum Ausdrucken (für den Ordner)

Ziel: Jedes Aufgabengebiet kann **ohne Tablet und ohne Display** geübt werden. Das Blatt wird ausgedruckt, vom Kind mit Bleistift bearbeitet und im **Ordner** abgeheftet. Es ergänzt die App, es ersetzt keine Unterrichtsmittel und ist **keine Leistungsbeurteilung**.

Maße für Lineatur und Kästchen: `lineatur.md`. Druck-Tokens: `tokens-druck.css` (nach `css/tokens-druck.css` kopieren, neben `css/tokens.css`).

## 1. Architektur: ein Generator, zwei Ausgaben

- Der Druck ist **ein weiterer Renderer** desselben Aufgabenmodells (`js/print.js`). Es gibt **keine eigenen Druck-Generatoren**. Sonst driften Inhalt, Zahlenraum und `lehrplanRef` auseinander.
- Ein Blatt entsteht aus **Thema, Schulstufe, Schwierigkeit, Seed und Anzahl**. Gleicher Seed ergibt gleiches Blatt.
- Zu **jedem** Übungsblatt gehört ein **Lösungsblatt**, erzeugt aus `loesung` desselben Seeds. Das Lösungsblatt ist eine eigene Seite, groß mit „Lösungen“ beschriftet, ohne Namensfeld.
- Der Seed steht klein in der Fußzeile (zum Beispiel `Blatt-Nr. 123456`), damit Lehrkraft und Eltern ein Blatt neu erzeugen können.
- Ein Blatt hat **ein Thema, eine Schulstufe, eine Schwierigkeit**. Keine gemischten Blätter ohne Überschrift je Abschnitt.
- Es wird nichts an einen Server gesendet. Drucken läuft über `window.print()` und `@media print` (Regel 10 und 11 in `AGENTS.md`).

## 2. Aufgabenmodell: neue Felder

Ergänzung zum Modell in `paedagogik-lernlogik`:

```js
{
  // ...bestehende Felder...
  druck: "ja",            // ja | angepasst | nur-digital
  druckHinweis: "",       // Pflicht, wenn druck != "ja": Begründung oder Anpassung
}
```

- `ja`: Die Aufgabe ist 1:1 druckbar.
- `angepasst`: Druckbar mit anderer Form (zum Beispiel Ziehen wird zu Verbinden oder Nummerieren). `druckHinweis` beschreibt die Anpassung.
- `nur-digital`: Nicht sinnvoll druckbar (zum Beispiel Memory, reine Audioaufgaben, Aufgaben, die Bewegung oder Zufall in der App brauchen). `druckHinweis` begründet das.
- **Kein stiller Fallback:** Ein Aufgabentyp ohne `druck` oder mit `druck != "ja"` ohne `druckHinweis` wirft im Test einen Fehler (Fail-Fast, siehe `AGENTS.md`).
- Ein Aufgabentyp, der **Farbe inhaltlich verlangt** (zum Beispiel „Welche Farbe hat das Verkehrszeichen?“, Farbwortart ohne zweites Merkmal), ist nicht `ja`, sondern `angepasst` oder `nur-digital`.

## 3. Antworttypen auf Papier

| `antwortTyp` | Darstellung im Druck |
|---|---|
| `zahl` | Antwortkästchen im Raster der Schulstufe. Anzahl der Kästchen = Stellen der Lösung, mindestens drei, damit die Länge nichts verrät. Bei Division mit Rest zwei Felder („Ergebnis“, „Rest“). |
| `auswahl` | Ankreuzkästchen (Quadrat, mindestens 8 mm) vor jeder Antwort, Buchstaben A B C statt Farbe. |
| `zuordnung` | Zwei Spalten mit Nummern und Buchstaben. Verbinden mit Linien nur, wenn sich die Linien nicht kreuzen müssen. Sonst Nummer in Kästchen schreiben. |
| `reihenfolge` | Nummernfelder neben den Karten. Wörter oder Zahlen stehen **gedruckt**, nicht zum Ausschneiden (Schere ist eine eigene Entscheidung der Lehrkraft). |
| `wort` | Schreibzeile in der Lineatur der Schulstufe (siehe `lineatur.md`). Für Sätze mindestens zwei Zeilen. |

Zusätzlich:

- **Schriftliche Rechenverfahren:** Rechenkästchen, Stellenwertspalten mit Kopfzeile (E, Z, H, T, ZT, HT, M je nach Schulstufe), Übertragszeile. Subtraktion nach dem Ergänzungsverfahren, Multiplikation in der festgelegten Richtung (siehe `lehrplan-oesterreich/mathematik.md`).
- **Anschauungsmittel** (Zwanzigerfeld, Hunderterfeld, Zahlenstrahl, Rechenstrich, Uhr) sind statische SVG neben der Aufgabe. Uhren als leeres Zifferblatt zum Einzeichnen oder mit gezeichneten Zeigern zum Ablesen.
- **Verkehrszeichen** nur als eigene SVG nach StVO (Regel 5). Im Schwarzweißdruck bleiben Form und Piktogramm erkennbar, der amtliche Name steht daneben als Text.
- **Zahlen** über `formatZahl()` (Regel 1), **Rechenzeichen** `+ − · :` (Regel 2). Das gilt im Druck unverändert. Kein `toLocaleString`.
- **Deutsch:** Wortarten brauchen im Druck **Form statt Farbe** (siehe Abschnitt 5).

## 4. Hilfen auf Papier

Die Hilfestufen (siehe `paedagogik-lernlogik`) werden als **Hilfekasten am Blattende** gedruckt, nicht neben jeder Aufgabe:

- Stufe 1 (Hinweis in Worten) und Stufe 3 (Lösungsweg in Teilschritten) als nummerierte Hilfe am unteren Blattrand, **auf den Kopf gedruckt oder in einem Knickstreifen**, damit das Kind sie bewusst aufdeckt. Das Lösungsblatt ist davon getrennt.
- Stufe 2 (Anschauungsmittel) steht bei der Aufgabe, wenn die Aufgabe ohne das Material nicht verstehbar wäre. Sonst als Hilfe am Blattende.
- Eine Option der Lehrkraft „Hilfen ausblenden“ entfernt den Hilfekasten.
- Kein Wort „falsch“, keine Punkte, keine Note. Selbstkontrolle mit dem Lösungsblatt ist freundlich formuliert („Vergleiche mit dem Lösungsblatt.“).

## 5. Schwarzweiß-Tauglichkeit (verbindlich)

Das Blatt muss auf einem Schwarzweißdrucker **vollständig lösbar** sein (Regel 16 in `AGENTS.md`). Die Hintergrundfarbe wird von Browsern häufig nicht gedruckt. Darum tragen nur **Linien, Text und Form** Information.

- Keine Aufgabe hängt an Farbe allein. Fächerfarben sind im Druck Zusatz, das Fach steht als Wort und Symbol in der Kopfzeile.
- **Wortarten** (Projektvorschlag, mit der Lehrkraft abstimmen **[OFFEN]**): Nomen = einfache durchgezogene Linie und Quadrat-Symbol; Verb = Wellenlinie und Kreis-Symbol; Adjektiv = gestrichelte Linie und Dreieck-Symbol. Die Lehrmittelfarben (Blau, Rot, Grün) dürfen zusätzlich erscheinen, wenn Farbdruck verfügbar ist. Symbole sind eigene SVG, keine Emoji.
- Hinterlegte Flächen (Mittelband der Lineatur, Felder) nur als helles Grau und **immer zusätzlich als Linie** gezeichnet.
- Linienstärke mindestens `--druck-linie-fein` (0,35 mm), damit Kopien (Kopierer) lesbar bleiben.
- Schwarze Vollflächen und große Illustrationen vermeiden (Toner, Kopierer). Motive als Linienzeichnung.
- Prüfe jedes neue Blatt im **Schwarzweiß-Vorschaumodus** (Browser-Druckvorschau, Option „Schwarzweiß“ oder Graustufen).

## 6. Layout und Typografie

- Format **A4 hoch**, Lochrand links `--druck-rand-links` (20 mm), damit nichts beim Lochen verloren geht.
- Schriftgrößen für Aufgabentext (Projektvorgabe): Schulstufe 1 `18 pt`, Schulstufe 2 `16 pt`, Schulstufe 3 und 4 `14 pt`. **Nie kleiner als 14 pt** für Text, den das Kind lesen muss.
- `Primae` für Ziffern, Rechenterme und Überschriften, `PrimaeText` für Anweisungen (Fonts lokal, siehe `kinder-ui-design`). Prüfe vor dem Einbau, dass Primae die Zeichen `· − :` und U+202F darstellt (Fallback U+00A0).
- Pro Seite eine überschaubare Menge: Richtwert Schulstufe 1 bis zu 8 Aufgaben, Schulstufe 2 bis zu 10, Schulstufe 3 und 4 bis zu 12 kurze Rechenaufgaben, weniger bei Schreib- und Textaufgaben. **Höchstens 2 Seiten** je Blatt. Das ist **eine ausdrückliche Ausnahme** von der Regel „Serie mit 5 bis 8 Aufgaben“, die nur für die App gilt. Kein Zeitlimit, keine Zähler.
- `break-inside: avoid` für jede Aufgabe. Eine Aufgabe wird nie über zwei Seiten zerschnitten. Kopf- und Fußzeile stehen auf jeder Seite.
- Reihenfolge der Aufgaben: leicht nach schwerer innerhalb des Blatts, ohne sichtbare Etiketten wie „leicht“ oder „schwer“.
- Text für Schulstufe 1 und 2: kurze Hauptsätze, Bilder neben dem Text, Hinweis „Ein Erwachsener liest vor.“ als Symbol, weil auf Papier kein Vorlesen verfügbar ist (siehe `lehrplan-oesterreich/deutsch.md`, Sprache der Aufgaben).
- Nur Linien und Text aus den Tokens (`tokens-druck.css`). Keine Schatten, keine Verläufe, keine Karten in Karten (Anti-KI-Optik gilt auch hier).

## 7. Kopfzeile und Fußzeile

Kopfzeile jeder Seite:

- Fach (Wort und Symbol), Thema, Schulstufe
- **Schreiblinie „Name:“ und „Datum:“**, vom Kind selbst ausgefüllt. Die App füllt **keinen Namen** ein (Regel 11, kein Klarname gespeichert oder gedruckt).
- Kein Notenfeld, keine Punkte, kein „von … Punkten“, keine Prozente, kein Vergleich.

Fußzeile:

- Blatt-Nr. (Seed), Seite x von y, „Schlaufuchs“. Keine URL, kein Tracking, kein QR-Code zu externen Seiten.

## 8. Weitere Druckausgaben

- **Urkunden** (Print-CSS): ohne Prozente, ohne Rang, ohne Vergleich. `PrimaeText-Cursive` darf hier verwendet werden. Der Name wird **handschriftlich** eingetragen oder ist ein freies Feld.
- **Eltern- und Lehrerbereich:** Auswahl nach Fach, Schulstufe, Thema, Schwierigkeit, Anzahl der Aufgaben, Optionen „Hilfen ausblenden“, „Hilfslinien reduziert“, Schwarzweiß-Vorschau.
- Eine Datei „Lösungen“ für die Lehrkraft kann mehrere Blätter zusammenfassen.

## 9. Tests (zusätzlich zu `technik-offline-touch`)

Neue Datei `tests/print.test.mjs`, Pflichtprüfungen über viele Seeds (zum Beispiel 200):

- Jeder Aufgabentyp hat `druck`; bei `angepasst` oder `nur-digital` gibt es einen `druckHinweis`. Unbekannter Typ wirft einen Fehler.
- **Vollständigkeit:** Jede druckbare Aufgabe hat ein Antwortfeld und einen Eintrag im Lösungsblatt, gleiche Reihenfolge, gleiche Anzahl.
- **Zahlenformat:** Im gerenderten HTML kommt kein Tausenderpunkt vor (`\d\.\d{3}`), Zahlen ab vier Stellen mit U+202F.
- **Rechenzeichen:** Kein `*`, `/` oder `➗` in sichtbaren Texten, `−` mit U+2212.
- **Schulstufe:** Blatt der Schulstufe 1 enthält nie `·` oder `:` als Rechenzeichen, Zahlenraum passt zur Schulstufe.
- **Antwortfeld:** Anzahl der Kästchen mindestens drei und mindestens so groß wie die Lösung.
- **Layout-Integrität:** Jede Aufgabe trägt `break-inside: avoid`, Seitenzahl höchstens 2, Lochrand gesetzt.
- **Reproduzierbarkeit:** Gleicher Seed erzeugt gleiches HTML.
- **Schwarzweiß:** Im Druck-CSS gibt es keine Information, die nur über `color` oder `background-color` getragen wird (Prüfung per Skript oder Checkliste).
- `scripts/check-regeln.mjs` prüft zusätzlich `js/print.js` und `css/print.css` auf Farbwerte außerhalb der Tokens, Schatten und Verläufe.

**Was nicht automatisch prüfbar ist:** das tatsächliche Druckbild auf Papier (Kästchen- und Linienmaß in Millimetern, Lesbarkeit der Kopie). Mindestens einmal je Schulstufe ausdrucken, mit dem Lineal nachmessen und im Abschlussbericht vermerken.

## Checkliste

- [ ] Druck nutzt dieselben Generatoren und Seeds, kein eigener Druck-Generator
- [ ] `druck` und `druckHinweis` je Aufgabentyp gesetzt
- [ ] Lösungsblatt erzeugbar, Seed in der Fußzeile
- [ ] Schwarzweiß vollständig lösbar, keine Information nur über Farbe
- [ ] Lineatur und Kästchen laut `lineatur.md`, offene Maße als `TODO-LEHRPLAN`
- [ ] A4 hoch, Lochrand, Schrift mindestens 14 pt, keine zerschnittene Aufgabe
- [ ] Kopfzeile mit Schreiblinien für Name und Datum, ohne Note, Punkte und Prozente
- [ ] `formatZahl()`, Rechenzeichen, Schulstufe im Druck getestet
- [ ] Ausdruck auf Papier geprüft oder als „nicht geprüft“ im Bericht genannt
