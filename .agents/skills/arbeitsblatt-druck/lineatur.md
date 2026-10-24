# Lineatur und Kästchen je Schulstufe (Papier)

Status-Legende siehe `lehrplan-oesterreich/SKILL.md`.

## Wichtig vorweg

Es gibt **keine amtliche Norm** für Lineatur und Kästchengröße in der österreichischen Volksschule. Der Lehrplan regelt sie nicht. Die Maße sind Verlags- und Schulpraxis. Die Nummerierung „Lineatur 1 bis 4“ (Herlitz, Oxford, Brunnen) ist eine **deutsche** Herstellerzählung und gilt in Österreich nicht überall. Österreichische Verlage zählen anders (zum Beispiel „Schreibheft 1 bis 6“ bei Lemberger/Lemi).

Darum gilt:

- Alle Maße stehen als Tokens in `tokens-druck.css` und lassen sich ohne Codeänderung anpassen.
- Alle Werte hier tragen Status `[VERLAG]` oder `[OFFEN]`. Ändere sie erst, wenn eine Lehrperson oder die Schule ein anderes Maß bestätigt, und trage den Status nach.
- Offene Fragen stehen in `docs/offene-lehrplanfragen.md`.
- Die Zuordnung „Heft Nr. X gehört zu Schulstufe X“ ist eine **Annahme** (Aufbau von grob nach fein). Die gefundenen Kataloge nennen sie nicht ausdrücklich.

## Rechenkästchen (Rechenfelder, schriftliche Verfahren)

Gefundene Praxis:

- Österreichischer Lernmittel-Anbieter (kinderneinechance.at): karierte Hefte mit 5×5, 6×6, 7×7 und 10×10 mm, dazu „Großkariert M 7×7“ und „Großkariert L 10×10“ [VERLAG].
- Hersteller (Herlitz, Oxford, Brunnen): Rechenheft „Lineatur R“ mit 10×10 mm für die 1. Klasse; Kästchen 7×7 mm für Klasse 1–2; 5×5 mm für Klasse 2–4 [VERLAG, Deutschland].

Festlegung für das Produkt:

| Schulstufe | Kästchen | Status |
|---|---|---|
| 1 | 10 × 10 mm | [VERLAG] |
| 2 | 7 × 7 mm (Alternative 5 × 5 mm) | [VERLAG], Wahl **[OFFEN]** |
| 3 | 5 × 5 mm | [VERLAG] |
| 4 | 5 × 5 mm | [VERLAG] |

Regeln dazu:

- Eine Ziffer je Kästchen. Ein Rechenzeichen belegt ein eigenes Kästchen.
- Stellenwertspalten (E, Z, H, T, ZT, HT, M) werden am Kopf beschriftet.
- Gruppierung ab vier Stellen: etwas stärkere Spaltenlinie nach jeder dritten Stelle von rechts. Nie ein Punkt (Regel 1 in `AGENTS.md`).
- Das Raster auf dem Blatt ist **nie kleiner** als das Heftraster der Schulstufe, sonst passt die Schrift des Kindes nicht.

## Schreibzeilen (Wörter, Sätze)

Gefundene Praxis (österreichischer Verlag Lemberger, „Lemi“-Schreibhefte):

- Schreibheft 1: dreigeteilte Zeile 8/8/8 mm, Zwischenraum farbig hinterlegt, Grundlinie gekennzeichnet [VERLAG].
- Schreibheft 2: dreigeteilt 6/6/6 mm [VERLAG].
- Schreibheft 3: erstmals zweigeteilt, 12/6 mm, Grundlinie mit Punkt gekennzeichnet [VERLAG].
- Schreibheft 4: wieder dreigeteilt, 4/4/4 mm. Schreibheft 5: 8/4 mm, Grundlinienkennzeichnung zum letzten Mal. Schreibheft 6: 10 mm ohne Zwischenraum (Sekundarstufe) [VERLAG].
- Der Verlag beschreibt die Abstufung als aufbauend: Die Zeilen werden kleiner, die Hilfen weniger.
- Deutscher Hersteller (nur Orientierung): Lineatur 2 mit vier Linien und 4 mm Abstand; Lineatur 3 mit zwei Linien und 3,5 mm Abstand [VERLAG, Deutschland].
- Fachdidaktik (Friedrich Verlag): Viele Hilfslinien schränken den Schreibfluss ein, viele Lehrpläne empfehlen individuell passende Hilfslinien oder nur farbige Mittelbänder [VERLAG].

Festlegung für das Produkt:

| Schulstufe | Schreibzeile | Status |
|---|---|---|
| 1 | 8/8/8 mm, Mittelband hinterlegt, Grundlinie betont | [VERLAG], Zuordnung Annahme |
| 2 | 6/6/6 mm, Mittelband hinterlegt, Grundlinie betont | [VERLAG], Zuordnung Annahme |
| 3 | 12/6 mm zweigeteilt, Grundlinie betont | [VERLAG], Zuordnung Annahme |
| 4 | 8/4 mm zweigeteilt (Alternative 4/4/4 mm) | **[OFFEN]** |

Regeln dazu:

- Im Druck darf die Hinterlegung des Mittelbands **nicht** die einzige Orientierung sein (Regel 16 in `AGENTS.md`). Grundlinie und Mittellinie sind immer als Linie gezeichnet, die Hinterlegung ist nur ein heller Grauton als Zusatz.
- Option der Lehrkraft: „Hilfslinien reduziert“ (nur Grundlinie und Mittelband). Das bildet die fachdidaktische Empfehlung ab.
- Schreibvorlagen und Musterwörter im Blatt stehen in `Primae`.

## Heft oder Ordnerblatt?

Das Arbeitsblatt kommt in den **Ordner** und ersetzt kein Heft. Es ist A4 hochformat mit Lochrand (siehe `SKILL.md`). Antwortfelder für Zahlen und Zeilen für Wörter folgen den Maßen oben, damit Kinder auf dem Blatt so schreiben wie im Heft.

## Offene Fragen (auch in `docs/offene-lehrplanfragen.md`)

1. Welches Kästchen verwendet die Zielschule in Schulstufe 2: 7 mm oder 5 mm?
2. Welche Lineatur gilt in Schulstufe 4: 8/4 mm oder 4/4/4 mm?
3. Wird Grundschrift oder Österreichische Schulschrift unterrichtet? Das beeinflusst Schreibvorlagen und Hilfslinien.
4. Welche Unterstreichungsart und welches Symbol verwendet die Klasse für Wortarten? Die Festlegung im Skill ist ein Projektvorschlag.
