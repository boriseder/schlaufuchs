# Offene Lehrplan- und Fachfragen

Sammelort für alle `TODO-LEHRPLAN`-Kommentare. Jeder neue `TODO-LEHRPLAN` im Code wird hier eingetragen, jede geklärte Frage mit Datum, Antwort und Quelle abgehakt. Das ersetzt nicht den Abschlussbericht, sondern verhindert, dass Fragen danach untergehen.

## Offen

| Nr. | Frage | Betrifft | Vorläufiger Wert im Code | Wer klärt |
|---|---|---|---|---|
| 1 | Welches Rechenkästchen gilt in Schulstufe 2: 7 mm oder 5 mm? | `tokens-druck.css`, `arbeitsblatt-druck/lineatur.md` | 7 mm | Lehrperson der Zielschule |
| 2 | Welche Schreibzeile gilt in Schulstufe 4: 8/4 mm oder 4/4/4 mm? | wie oben | 8/4 mm | Lehrperson der Zielschule |
| 3 | Ist die Zuordnung „Heft 1 bis 3 der Verlagsreihe entspricht Schulstufe 1 bis 3“ zutreffend? | `lineatur.md` | angenommen | Lehrperson oder Verlag |
| 4 | Grundschrift oder Österreichische Schulschrift: Was wird an der Zielschule unterrichtet? | Schreibvorlagen, Hilfslinien | Schulschrift (Primae) | Lehrperson der Zielschule |
| 5 | Welche Unterstreichungsart und welche Symbole nutzt die Klasse für Wortarten im Schwarzweißdruck? | `arbeitsblatt-druck/SKILL.md` Abschnitt 5 | Linie plus Quadrat, Kreis, Dreieck | Lehrperson der Zielschule |
| 6 | Dürfen Aufgaben zum Ausschneiden (Schere) vorgesehen werden, oder nur zum Beschriften? | `reihenfolge` im Druck | nur Beschriften | Lehrperson |
| 7 | Schriftgröße im Druck: Sind 18/16/14 pt für Schulstufe 1/2/3–4 passend? | `tokens-druck.css` | 18/16/14 pt | Lehrperson |
| 8 | Ist die Lizenz von Primae und PrimaeText für Self-Hosting als Webfont und für Druck geklärt? | `fonts/`, Print | ungeklärt | Projektleitung |

## Offen (Technik und Produkt, keine Lehrplanfragen)

| Nr. | Frage | Betrifft | Vorläufiger Stand |
|---|---|---|---|
| T1 | Auslieferung: klassische `<script>`-Tags im Namespace (läuft auch über `file://`) oder ES-Module mit Build-Schritt? README und Skill `technik-offline-touch` waren widersprüchlich. | README, `technik-offline-touch`, Druck ohne Server | Ist-Zustand: Namespace und `<script>`-Tags, Build offen |
| T2 | Soll die Sterne-Regel „3 Sterne für sichere Wiederholung an einem anderen Tag“ bleiben? Sie liegt nahe an einem Rückkehranreiz (Regel 6). | `paedagogik-lernlogik` | bleibt, ohne Erinnerung und ohne Verlust |
| T4 | Gibt es `docs/UMBAU-NOTIZEN.md`? Der Skill `technik-offline-touch` verwies darauf, die Datei kommt in der Projektstruktur nicht vor. | `technik-offline-touch` | Verweis ersetzt durch diese Datei |

## Geklärt

| Nr. | Datum | Frage & Antwort | Quelle / Commit |
|---|---|---|---|
| T3 | 24.10.2026 | **Booster-Päckchen entfernt**: Das Belohnungssystem wurde strikt nach Regel 6 auf deterministische, vorher sichtbare Sammelbilder umgestellt (keine Booster, keine Zufallsziehung, keine Päckchen-Zähler). Gelöste Arbeitsblätter schalten über ihr Schatzkisten-Geheimwort gezielt Sammelbilder frei. | AGENTS.md Regel 6, `js/stickers.js`, `tests/stickers.test.mjs` |

## Quellenhinweis zur Recherche (Stand 24.10.2026)

Lineatur- und Kästchenmaße stammen aus Herstellerangaben und Verlagskatalogen, nicht aus dem Lehrplan. Es gibt keine amtliche Norm dafür. Gefundene Quellen: Katalog und Schulstartfolder des Bildungsverlags Lemberger (Lemi-Schreibhefte), Lineaturübersicht von kinderneinechance.at, Produktbeschreibungen von Herlitz, Oxford und Brunnen, Fachartikel des Friedrich Verlags zu Hilfslinien.
