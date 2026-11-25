# Podcast Editor

Ein schlanker Audio-Editor für Podcasts und Sprachaufnahmen, der komplett im Browser läuft – ohne Installation, ohne Konto, ohne Cloud. **Deine Aufnahmen verlassen nie deinen Rechner.**

## Was er kann

- Mehrere Spuren mit Stumm, Solo, Sperren, Lautstärke, Panorama und Lautheitsanzeige (LUFS)
- Schneiden, Passagen per Ziehen verschieben (auch zwischen Spuren), Sync über alle Spuren, Magnete an Schnitten
- Hüllkurve zum Lauter-/Leisermachen einzelner Stellen
- Effekte: **Sprache optimieren** (ein Klick), Rauschreduzierung, Übersteuerung reparieren, Brummen entfernen, Popp- & Schmatzgeräusche, Zischlaute dämpfen, Klang an eine andere Spur angleichen, Pausen absenken (Noise Gate), Atmer & Übersprechen entfernen, Ähms entfernen (am Klang erkannt, zurückholbar), Normalisieren (auch abschnittsweise), Kompressor, EQ, Stille kürzen, Blenden
- Kapitel, Kommentare (mit Emoji-Schnellmarken) und Untertitel (SRT/VTT)
- Aufnahme direkt im Editor, Wahl von Ein- und Ausgabegerät
- Export als MP3 oder WAV (mit Kapiteln), Projekte speichern (`.aeproj`), Audacity-Projekte (`.aup3`) öffnen
- Bearbeitungsprotokoll pro Spur und „Rezepte“, um dieselben Schritte auf andere Aufnahmen anzuwenden
- Automatisches Zwischenspeichern der letzten 10 Sitzungen, auf Wunsch Backups in einen Ordner

Alle Tastenkürzel zeigt die Taste **?** im Editor.

## Starten

**Am einfachsten:** **[lennartschneider.github.io/podcast-editor](https://lennartschneider.github.io/podcast-editor/)** im Browser öffnen – fertig.

**Lokal auf dem eigenen Rechner** (z. B. ohne Internet):

- **Windows:** `Start.bat` doppelklicken (braucht [Python](https://www.python.org/)).
- **Mac / Linux:** `start.command` doppelklicken (beim ersten Mal im Terminal einmal `chmod +x start.command` eingeben) oder im Terminal in diesem Ordner
  `python3 -m http.server 8766` eingeben und `http://localhost:8766` öffnen.

Ein kleiner lokaler Server ist nötig, weil Browser Mikrofon und Gerätewahl nur über `https://` oder `localhost` erlauben – ein Doppelklick auf `index.html` reicht dafür nicht.

## Browser

| | Chrome / Edge | Safari / Firefox |
|---|---|---|
| Bearbeiten, Effekte, Aufnahme, Export | ✓ | ✓ |
| Wahl des Ausgabegeräts | ✓ | – |
| Backups in einen Ordner, „Speichern unter“-Dialog | ✓ | – (Dateien landen im Download-Ordner) |

Empfohlen: **Chrome oder Edge**. Auf dem Mac werden Tastenkürzel automatisch als ⌘ / ⌥ angezeigt.

## Wo deine Daten liegen

- Automatisch gespeicherte Sitzungen liegen im Speicher deines Browsers (nur auf deinem Gerät). Wer die Browserdaten löscht, löscht auch sie – wichtige Projekte daher als `.aeproj` speichern oder die automatische Sicherung in einen Ordner einschalten.
- Es wird nichts hochgeladen und nichts getrackt.

## Verwendete Bibliotheken

Werden bei Bedarf von [cdnjs](https://cdnjs.com/) geladen (nur diese beiden Funktionen brauchen dafür Internet):

- [lamejs](https://github.com/zhuker/lamejs) – MP3-Export (LGPL-3.0)
- [sql.js](https://github.com/sql-js/sql.js) – Import von Audacity-Projekten (MIT)

## Lizenz

[MIT](LICENSE) – frei nutzbar, veränderbar und weitergebbar.
