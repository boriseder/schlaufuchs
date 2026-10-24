---
name: paedagogik-lernlogik
description: Verwende diesen Skill, wenn Aufgabenablauf, Feedback, Hilfen, Schwierigkeitsanpassung, Sterne, Sammelalbum, Pausen, Anschauungsmittel, Audio oder Inklusion für die Schüler gestaltet werden.
---

# Pädagogik und Lernlogik

Grundhaltung: Fehler sind Lernmomente. Das Kind soll sich kompetent fühlen und etwas **verstehen**, nicht nur Punkte sammeln.
Dazu passt der Lehrplan: Fehler zulassen, individuelle Rückmeldung, Lerntempo des Kindes.

## 1. Aufgabenablauf

- Eine Serie hat **5 bis 8 Aufgaben**, nicht mehr. Die Kinder wählen die Serie selbst. Es gibt keine automatische Endlosserie.
- Pro Aufgabe **eine** Frage und eine Kernbotschaft.
- Beim Üben: kein Zeitlimit, kein Zähler, kein Countdown, keine Prozentanzeige. Dezente Schrittpunkte (`● ● ○ ○ ○`) zeigen die Position.
- Nach der Serie erscheint eine ruhige Abschlusskarte (siehe Belohnung).
- Nach etwa 15 bis 20 Minuten Nutzung am Stück: freundlicher Pausenhinweis mit Bewegungsidee (Strecken, Wasser trinken, ans Fenster gehen). Kein Sperren.

## 2. Aufgabenmodell (Daten)

Generatoren erzeugen reine Datenobjekte. Keine DOM-Logik im Generator.

```js
{
  id: "mathe-2-add-100-0042",
  fach: "mathe",              // mathe | deutsch | sachunterricht | denken
  schulstufe: 2,              // 1–4
  lehrplanRef: "M-2-Operationen",
  lehrplanStatus: "RIS",      // RIS | SCHULUEBLICH (zum Beispiel Landeshauptstädte)
  thema: "add-zr100-zehnerueberschreitung",
  frage: { text: "37 + 8", vorlesen: "Sieben und dreißig plus acht" },
  antwortTyp: "zahl",          // zahl | auswahl | zuordnung | wort | reihenfolge
  loesung: 45,
  hilfen: [ /* siehe 3 */ ],
  anschauung: "hunderterfeld", // optional
  schwierigkeit: 2,            // 1 leicht – 3 schwer, innerhalb der Schulstufe
  seed: 123456,
  druck: "ja",                // ja | angepasst | nur-digital (siehe arbeitsblatt-druck)
  druckHinweis: ""            // Pflicht, wenn druck != "ja"
}
```

- Jeder Generator nimmt einen **Seed** (reproduzierbare Tests) und garantiert Varianz: keine zwei gleiche Aufgaben in einer Serie.
- Validatoren sind getrennt von der Darstellung und liegen unter `js/validators/`.
- Jeder Aufgabentyp hat eine Druckentscheidung (`druck`). Der Druck nutzt dieselben Generatoren und Seeds, siehe `arbeitsblatt-druck`. Fehlt die Entscheidung, schlägt der Test fehl.
- Antwortformate: `Auswahl` hat 3 bis 4 sinnvolle Distraktoren, die **typische Denkfehler** abbilden (zum Beispiel Zehnerfehler), nicht Zufallszahlen.

## 3. Feedback und Hilfen

**Stufen der Hilfe** (vom Kind selbst ausgelöst, jeweils eine Stufe):

1. Hinweis in Worten („Rechne zuerst bis zum nächsten Zehner.“)
2. Anschauungsmittel einblenden (Zwanzigerfeld, Hunderterfeld, Zahlenstrahl, Rechenstrich)
3. Lösungsweg Schritt für Schritt, die Aufgabe bleibt dem Kind

**Nach einer falschen Antwort:**

- Keine rote Farbe, kein Ton, kein Wort wie „falsch“ oder „Fehler“.
- Ein erklärender, kurzer Satz, der zum Weitermachen einlädt: „Fast. Du hast 7 + 8 gerechnet. Rechne 37 + 8 noch einmal.“
- Das Kind darf **erneut versuchen**. Erst nach zwei Versuchen wird der Lösungsweg gezeigt. Die Aufgabe kommt später in der Serie wieder.
- Nicht jede Antwort bekommt Lob. Lobe **Vorgehen und Ausdauer** („Du hast den Zehner geschickt genutzt.“), nicht Begabung („Du bist klug.“).

**Textbausteine** liegen zentral in `js/core/texte.js`, damit sie lektoriert werden können. Tonfall: freundlich, kurz, Du-Form, ohne Ausrufezeichen-Flut.

## 4. Belohnung

Ziel: Freude an der Arbeit, kein Sammelzwang.

- Sterne zeigen **Fortschritt im Üben**, nicht Perfektion. Beispiel: 1 Stern für das Beenden einer Serie, 2 Sterne für eine Serie mit wenigen Hilfen, 3 Sterne für eine sichere Wiederholung an einem anderen Tag. Der Erfolg ist **nicht** an 100 % gebunden. Das ist bewusst **kein** Streak: Es gibt keine Erinnerung, keine Serie von Tagen und keinen Verlust, wenn ein Tag ausfällt. Diese Regel ist eine fachliche Entscheidung und wird bei Änderungen mit der Lehrkraft abgestimmt.
- Konfetti (Canvas, kürzer als 2 Sekunden, ohne Blitzen, abschaltbar) und Lob erscheinen auf der Abschlusskarte für **jede** beendete Serie.
- Sammelbilder (Album): Werden sie verwendet, dann nur als **sichtbarer Lohn für abgeschlossene Serien**, nie zufällig verlost und nie mit Verlust. Das Wort „Booster“ und Päckchen, die ein zufälliges Bild enthalten, sind nicht erlaubt. Das Bild, das eine Serie freischaltet, steht vorher fest. Leere Plätze zeigen eine neutrale Umrisszeichnung ohne Text wie „gesperrt“.
  Das Album darf keinen Druck erzeugen. Keine Zähler wie „3 von 16 fehlen noch“ als Hauptanzeige.
- **Verboten:** Ranglisten, Streaks, tägliche Erinnerungen, Verlustangst („Dein Fortschritt verfällt“), Vergleich zwischen Kindern, zufällige Belohnungen.
- Die Anzeige in der Übersicht nutzt Sterne und gefüllte Symbole. **Keine Prozentangaben**: Prozent ist kein Stoff der Volksschule.

## 5. Anschauungsmittel (Mathematik)

Eigene SVG-Komponenten, kein Emoji. Sie bilden das Material ab, das im Unterricht verwendet wird:

- Zwanzigerfeld, Hunderterfeld, Zehnerstreifen, Zahlenstrahl, Rechenstrich
- Stellenwert-Material: Einerwürfel, Zehnerstange, Hunderterplatte, Tausenderwürfel (ab Zahlenraum 1 000)
- Uhr (analog mit klaren Zeigern, digital daneben)
- Euro-Münzen und -Scheine als vereinfachte Zeichnungen (Wertzahl gut lesbar)

Regel: Das Material **erklärt** die Operation. Es darf nicht zum Weiterzählen in Einerschritten einladen (siehe `lehrplan-oesterreich/mathematik.md`).

## 6. Audio und Sprache

- In **Schulstufe 1 und 2** kann ein Teil der Kinder die Aufgaben noch nicht selbst lesen. Vorlesen ist dort **sichtbar und ein Tipp entfernt** (Lautsprecher-Symbol bei jeder Frage).
- Vorlesetext (`frage.vorlesen`) ist getrennt vom Anzeigetext, weil Rechenzeichen und Zahlen gesprochen anders lauten.
- Bevorzugt: **vorproduzierte Audiodateien** für feste Texte (Menü, Anleitungen), weil sie offline und auf jedem Gerät gleich klingen.
  Für generierte Aufgaben: `speechSynthesis` mit `de-AT`, Fallback `de-DE`, danach Hinweis „Vorlesen auf diesem Gerät nicht verfügbar“.
- Ton-Effekte sind kurz, leise und nur eine Reaktion auf eine Handlung. Der **Klassenzimmer-Stummschalter** ist in jeder Ansicht erreichbar und schaltet Effekte und Sprache aus.

## 7. Inklusion

- Keine Zeitlimits. Hilfestufen sind immer verfügbar. Das hilft Kindern mit Rechenschwäche, Lese- und Rechtschreibschwäche und Deutsch als Zweitsprache.
- Texte kurz, Bilder neben dem Text, klare Schrift (siehe `kinder-ui-design`).
- Ruhe: keine blinkenden oder wandernden Elemente, auch nicht im Leerlauf.
- Eine Einstellung der Lehrkraft oder Eltern: größere Schrift, Vorlesen automatisch, weniger Ton.

## 8. Eltern- und Lehrerbereich

- Zeigt **Lernverlauf je Thema**, nicht Rankings. Deutlich als Übungsstand bezeichnet, nicht als Note.
- Funktionen: Schulstufen freischalten, Profile verwalten, Backup erzeugen und einspielen (siehe `technik-offline-touch`), Einstellungen.
- Drei flache Registerkarten genügen: Kinder, Inhalte, Einstellungen.
- Hinweis an die Lehrkraft: Die Plattform ersetzt weder Kompetenzraster noch iKM-PLUS noch Leistungsbeurteilung.

## 9. Arbeitsblätter (Papier)

- Ein Arbeitsblatt ist keine Serie. Die Regel „5 bis 8 Aufgaben“ gilt nur für die App. Mengen, Lösungsblatt, Hilfen auf Papier und Schwarzweiß-Tauglichkeit regelt `arbeitsblatt-druck`.
- Auf Papier gibt es keine Sterne, Punkte, Prozente oder Noten. Selbstkontrolle über das Lösungsblatt, freundlich formuliert.
- Die Hilfestufen werden als Hilfekasten am Blattende gedruckt, nicht sofort sichtbar neben der Aufgabe.

## Checkliste

- [ ] Serie hat 5 bis 8 Aufgaben, genau eine Aufgabe im Fokus
- [ ] Kein Zeitdruck, keine Prozentanzeige, kein Wort „falsch“
- [ ] Hilfestufen vorhanden, Feedback erklärt und lädt zum Weitermachen ein
- [ ] Belohnung für beendete Serie, nicht nur für 100 %
- [ ] Anschauungsmittel als SVG und passend zur Schulstufe
- [ ] Vorlesen in Schulstufe 1 und 2 sichtbar, Stummschalter wirkt überall
- [ ] Seed und Varianz getestet
- [ ] `druck` und `lehrplanStatus` am Aufgabenmodell gesetzt
