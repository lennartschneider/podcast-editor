@echo off
rem Startet den Podcast Editor: kleiner lokaler Server + Browser. Fenster offen lassen, solange du arbeitest.
rem (Lokaler Server ist noetig, damit Mikrofon-Aufnahme und Ausgabegeraete-Wahl funktionieren.)
cd /d "%~dp0"
rem Gemeinsames Design-System aktualisieren (holt die aktuelle design-system.css aus ..\Design System)
if exist "..\Design System\build.py" python "..\Design System\build.py" >nul 2>&1
rem Browser erst oeffnen, wenn der Server bereit ist (sonst kurz eine Fehlerseite)
if exist "..\Design System\open_when_ready.py" (start "" /b pythonw "..\Design System\open_when_ready.py" 8766 http://localhost:8766/index.html) else (start "" http://localhost:8766/index.html)
python -m http.server 8766 --bind 127.0.0.1
pause
