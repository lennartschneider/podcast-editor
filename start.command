#!/bin/bash
# Startet den Podcast Editor auf Mac/Linux: kleiner lokaler Server + Browser.
# Fenster offen lassen, solange du arbeitest. Beenden mit Strg+C (Mac: Control+C).
cd "$(dirname "$0")"
URL="http://localhost:8766/index.html"
# Browser erst öffnen, wenn der Server antwortet
( for i in $(seq 1 50); do
    if python3 -c "import socket;socket.create_connection(('127.0.0.1',8766),0.3)" 2>/dev/null; then break; fi
    sleep 0.1
  done
  if command -v open >/dev/null; then open "$URL"; else xdg-open "$URL" >/dev/null 2>&1; fi ) &
python3 -m http.server 8766 --bind 127.0.0.1
