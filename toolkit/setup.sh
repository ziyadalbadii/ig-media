#!/usr/bin/env bash
# One-time setup for a fresh workspace: fonts (Tajawal, Space Grotesk), puppeteer-core, ffmpeg check.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
fontdir="$HOME/.local/share/fonts"; mkdir -p "$fontdir"
if ! fc-list | grep -qi "Tajawal" || ! fc-list | grep -qi "Space Grotesk"; then
  tmp=$(mktemp -d); (cd "$tmp" && npm init -y >/dev/null && npm i --silent @expo-google-fonts/tajawal @expo-google-fonts/space-grotesk >/dev/null)
  find "$tmp/node_modules/@expo-google-fonts" -name "*.ttf" -exec cp {} "$fontdir/" \;
  fc-cache -f >/dev/null 2>&1 || true
  rm -rf "$tmp"
fi
fc-list | grep -qi "Tajawal" && echo "fonts ok" || echo "WARNING: fonts missing"
if ! node -e "require('puppeteer-core')" 2>/dev/null && ! node -e "require('/opt/npm-tools/node_modules/puppeteer-core')" 2>/dev/null; then
  (cd "$here/render" && npm init -y >/dev/null 2>&1 || true; npm i --silent puppeteer-core)
fi
echo "puppeteer-core ok"
command -v ffmpeg >/dev/null && echo "ffmpeg ok" || echo "WARNING: install ffmpeg"
chmod +x "$here/render/"*.sh
