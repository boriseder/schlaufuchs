---
name: lehrplan-oesterreich
description: Verwende diesen Skill, wenn Aufgaben, Lerninhalte, Klassenstufen, Fachbegriffe, Zahlenschreibweise, Verkehrszeichen oder Österreich-Wissen für die Volksschule erstellt oder geprüft werden. Enthält die Zuordnung zur Schulstufe 1–4 mit Prüfstatus.
---

# Lehrplan Volksschule Österreich

## Quelle und Stand

- Lehrplan der Volksschule, **Anl. 1**, gültig ab **1.9.2025** (BGBl. II Nr. 178/2025).
  RIS: https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10009275&Artikel=&Paragraf=&Anlage=1&Uebergangsrecht=
- Der neue Lehrplan gilt seit 2023/24 aufsteigend. Im Schuljahr 2026/27 arbeiten alle vier Schulstufen danach.
- Er ist kompetenzorientiert: Kompetenzbereiche, Kompetenzbeschreibungen, Anwendungsbereiche.
  Die Anwendungsbereiche sind Anregungen und keine Pflichtfakten.
- Bezugsgröße im Code ist die **Schulstufe 1–4**. Die Zusammenfassung zu Grundstufe I und II entfällt laut Empfehlung der Beratungsgruppe Mathematik (2021) im neuen Lehrplan. Verlage verwenden die Begriffe teils weiter. Im Code zählt nur die Schulstufe.
- Liegt eine Kopie unter `docs/lehrplan/`, lies dort nach (`pdftotext`). Sie hat Vorrang vor diesem Skill.

## Prüfstatus

Jede Zuordnung in den Referenzdateien trägt einen Status:

- **[RIS]**: im Lehrplantext bestätigt.
- **[VERLAG]**: aus der Zusammenfassung eines Schulbuchverlags (Veritas, „Der neue Lehrplan konkret“). Plausibel, aber nicht gegen RIS geprüft.
- **[SCHULÜBLICH]**: übliche Praxis, steht nicht im Lehrplan.
- **[OFFEN]**: nicht geklärt. Setze `TODO-LEHRPLAN` und frage nach.

Ändere eine Zuordnung erst, wenn du sie gegen RIS geprüft hast. Trage dann den Status nach.

## Referenzdateien

- `mathematik.md`: Zahlenräume, Operationen, Größen, Geometrie, Daten je Schulstufe
- `deutsch.md`: Kompetenzbereiche, Fachbegriffe, österreichisches Deutsch
- `sachunterricht-verkehr.md`: Sachunterricht, Österreich-Wissen, Radfahren, Verkehrszeichen-SVG
- Für Maße auf Papier (Lineatur, Kästchen) siehe `../arbeitsblatt-druck/lineatur.md`. Diese Maße stehen **nicht** im Lehrplan.

## Zahlenschreibweise (verbindlich)

- **Kein Tausenderpunkt.** Ab vier Stellen ein schmales geschütztes Leerzeichen: `1 000`, `10 000`, `1 000 000`.
  Der Lehrplantext schreibt ebenfalls „1 000“.
- Zeichen: U+202F (schmales geschütztes Leerzeichen). Fehlt es in `Primae`, ist U+00A0 der Fallback.
  Prüfe die Glyphen vor dem Einbau (siehe `technik-offline-touch`).
- Dezimalzahlen mit **Komma**: `2,50 €`. Geld immer mit zwei Nachkommastellen, wenn Cent vorkommen.
- Die Schreibweise gilt auch auf Arbeitsblättern (Druck).
- Eine zentrale Funktion `formatZahl(n)` erledigt das. Direkte `toLocaleString`-Aufrufe sind verboten, weil das Ergebnis je Browser abweicht.
- Eingaben der Kinder werden **tolerant** gelesen: `1000`, `1 000` und `1\u202F000` sind gleich richtig. Ein eingetippter Tausenderpunkt (`1.000`) wird als `1000` gelesen und nicht als Fehler gewertet. Angezeigt wird danach immer die richtige Schreibweise.
- Rechenzeichen: `+`, `−` (Minuszeichen U+2212), `·` (Malpunkt), `:` (Doppelpunkt). Nur in der Bezeichnung „kleines 1×1“ ist `×` erlaubt.
- Die Zahlenschreibweise (schmales Leerzeichen ab vier Stellen, Dezimalkomma) ist direkt im Lehrplantext vorgegeben [RIS, S. 81, 83]. Eine ÖNORM wird im Lehrplan nicht zitiert (schulüblich ÖNORM A 1080).

## Hinweise des Lehrplans, die für das Produkt gelten [RIS]

- Digitale Medien sind eine **Ergänzung** und ersetzen bisherige Unterrichtsmittel nicht vollständig (Grundsatz 2).
- Fehler werden zugelassen und als Lernmoment genutzt (Grundsatz 4). Das Feedback erklärt, es bestraft nicht.
- Lernzeiten dienen der Festigung. Neuer Lernstoff wird dort nicht erarbeitet.
- Die Dauer einer Einheit richtet sich nach der Konzentrationsfähigkeit der Kinder. Tägliche Bewegungszeit ist vorgesehen. Daraus folgt: kurze Serien, Pausenhinweis (siehe `paedagogik-lernlogik`).
- Sprachsensibler Unterricht in allen Fächern: Fachwortschatz wird bewusst aufgebaut.
- Die Rückmeldung zur Lernentwicklung läuft über Kompetenzraster und iKM-PLUS. Die Plattform ist **keine Leistungsbeurteilung**.

## Checkliste für Inhalte

- [ ] `schulstufe`, `lehrplanRef` und `lehrplanStatus` (`RIS` oder `SCHULUEBLICH`) gesetzt, Status in der Referenzdatei geprüft
- [ ] Offene Fragen als `TODO-LEHRPLAN` im Code und in `docs/offene-lehrplanfragen.md`
- [ ] Zahlen über `formatZahl()`, Rechenzeichen korrekt
- [ ] Fachbegriffe wie im Unterricht (Doppelbezeichnungen siehe `deutsch.md`)
- [ ] Österreichisches Deutsch (Jänner, Sessel, Klasse, Schultasche)
- [ ] Keine Zahlenräume oder Operationen aus der nächsten Schulstufe
- [ ] Sachaufgaben aus der Lebenswelt der Kinder, ohne Stereotype (z. B. Rollenbilder bei Berufen)
