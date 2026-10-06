# Sachunterricht, Verkehr, Verkehrszeichen

Status-Legende siehe `SKILL.md`.

## Was der Lehrplan sagt

- Sachunterricht hat sechs Kompetenzbereiche: sozialwissenschaftlich, naturwissenschaftlich, geografisch, historisch, technisch, wirtschaftlich [RIS, S. 85].
- Die Kompetenzbeschreibungen zielen auf Arbeitsweisen (Forschen, Entdecken, Anwenden) und nicht auf Faktenlisten.
  Die Anwendungsbereiche sind bewusst offen. Klassische Themenvorgaben wie Heimatgemeinde oder Länderkunde gibt es im neuen Lehrplan nicht mehr als starre Pflichtthemen, sondern als beispielhafte Anwendungsbereiche [RIS, S. 84–87].
- **Folgerung für die Plattform:** Faktenwissen wie Landeshauptstädte ist ein **schulüblicher Anwendungsbereich** und keine Lehrplanpflicht [RIS, S. 85, 90 / schulüblich].
  Nenne diese Inhalte im Code und in der Oberfläche nicht „Lehrplan“. Biete zusätzlich Aufgaben an, die Verstehen verlangen (Karten lesen, Ursachen zuordnen, Vergleichen).
- Forschendes Lernen (Beobachten, Experimentieren) findet im Unterricht statt. Die App festigt, sie ersetzt es nicht.

## Verkehrs- und Mobilitätsbildung [RIS]

- Verbindliche Übung, integrativ, **10 Jahresstunden je Schulstufe** [RIS, S. 116].
- Kompetenzziele am Ende der Grundschule: als Fußgänger und Radfahrer Gefahren einschätzen und sich entsprechend verhalten, eigenes Verkehrsverhalten reflektieren, verkehrsüberwachende Personen erkennen, bei Unfällen und Notsituationen altersadäquat handeln [RIS, S. 116–118].
- Freiwillige Radfahrprüfung: Explizit in der 4. Schulstufe im Lehrplan verankert [RIS, S. 118] („kennen gesetzliche Vorschriften im Mobilitätsbereich Radfahren und wenden diese ua. in der Vorbereitung auf die freiwillige Radfahrprüfung an“; gesetzliche Prüfungsvoraussetzungen: StVO § 65 Abs. 1 [RIS]).

## Österreich-Wissen (Referenzdaten, schulüblich)

Landeshauptstädte: Burgenland: Eisenstadt. Kärnten: Klagenfurt. Niederösterreich: St. Pölten. Oberösterreich: Linz. Salzburg: Salzburg. Steiermark: Graz. Tirol: Innsbruck. Vorarlberg: Bregenz. Wien: Wien.

Acht Nachbarstaaten: Deutschland, Tschechien, Slowakei, Ungarn, Slowenien, Italien, Schweiz, Liechtenstein.

Flüsse: Donau, Inn, Drau, Enns, Traun, Salzach, Mur. Höchster Berg: Großglockner, 3 798 m.

Fahrrad (verkehrssicher): Gesetzliche Vorschriften nach Fahrradverordnung (BGBl. II Nr. 146/2001 idF BGBl. II Nr. 206/2023 [RIS], referenziert im Lehrplan [RIS, S. 118]):
- 2 voneinander unabhängige Bremsen
- Klingel oder Hupe
- Weißer Scheinwerfer (mind. 100 cd) und weißer Rückstrahler vorne (mind. 20 cm²)
- Rotes Rücklicht (mind. 1 cd) und roter Rückstrahler hinten (mind. 20 cm²)
- Gelbe Rückstrahler an den Pedalen nach vorne und hinten (4 Stück)
- Reflektoren an den Rädern: entweder gelbe Katzenaugen an den Speichen (mind. 2 je Rad, beidseitig wirkend = mind. 4 Katzenaugen) ODER weiße/gelbe reflektierende Reifenmäntel

Vor jeder Aufnahme in eine Aufgabe: Aktualität prüfen (Einwohnerzahlen, Höhen, Namen ändern sich).

## Verkehrszeichen als SVG (verbindlich)

- Nur eigene SVG-Dateien in `assets/verkehrszeichen/`. **Nie Emoji** (zum Beispiel kein `⚠️` für „Vorrang geben“).
- Maßstab: Form, Farbe und Piktogramm folgen der österreichischen StVO. Maßgeblich ist die geltende Fassung:
  https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10011336 (Paragraphen zu Gefahren-, Vorschrifts- und Hinweiszeichen).
- Jede Datei hat `<title>` mit der amtlichen Bezeichnung und im Kopf einen Kommentar mit Paragraph und Ziffer der StVO.
- Jedes Zeichen hat einen Alternativtext für Vorlesen und Screenreader.
- Zeichen gemäß StVO 1960 (im RIS bestätigt):

| Zeichen | Beschreibung | Status |
|---|---|---|
| Vorrang geben | Weißes gleichseitiges Dreieck mit rotem Rand, **Spitze unten** | [RIS: StVO § 52 Z 23 / Lehrplan S. 117–118] |
| Halt, Vorrang geben | Rotes Achteck, weißer Rand, weiße Aufschrift „STOP“ | [RIS: StVO § 52 Z 24 / Lehrplan S. 117–118] |
| Vorrangstraße | Gelbe Raute (auf der Spitze) mit weißem Rand | [RIS: StVO § 53 Z 25a / Lehrplan S. 117–118] |
| Ende der Vorrangstraße | Gelbe Raute mit weißem Rand und schwarzem Schrägbalken | [RIS: StVO § 53 Z 25b / Lehrplan S. 117–118] |
| Radweg | Runder blauer Grund, weißes Fahrrad | [RIS: StVO § 52 Z 16 / Lehrplan S. 117–118] |
| Geh- und Radweg | Runder blauer Grund mit Fußgänger- und Radsymbol: getrennt (Z 17a) oder gemeinsam (Z 17b) | [RIS: StVO § 52 Z 17a/b / Lehrplan S. 117–118] |
| Schutzweg | Blaues Quadrat, weiße Dreiecksfläche, Piktogramm eines Fußgängers auf Schutzweg | [RIS: StVO § 53 Z 2a / Lehrplan S. 117–118] |
| Fahrverbot für Fahrzeuge aller Art | Weißer Kreis, roter Rand | [RIS: StVO § 52 Z 1 / Lehrplan S. 117–118] |
| Einfahrt verboten | Rote Kreisscheibe, waagrechter weißer Balken | [RIS: StVO § 52 Z 2 / Lehrplan S. 117–118] |
| Gefahrenstelle | Dreieck, **Spitze oben**, roter Rand, weißer Grund, schwarzes Rufzeichen („Andere Gefahren“) | [RIS: StVO § 50 Z 11 / Lehrplan S. 117–118] |

Alle Zeichen wurden gegen die StVO 1960 im RIS geprüft und verifiziert.
Verwechsle „Vorrang geben“ (Spitze unten) nicht mit „Gefahrenstelle“ (Spitze oben).
