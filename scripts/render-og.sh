#!/usr/bin/env bash
# Renders scripts/og-card.html to app/opengraph-image.png and app/twitter-image.png
# using a local Chromium browser (Chrome, Edge, Brave or Chromium).
set -euo pipefail
cd "$(dirname "$0")/.."

BROWSER="${CHROME:-}"
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "$(command -v google-chrome || true)" "$(command -v chromium || true)"; do
  if [ -z "$BROWSER" ] && [ -n "$c" ] && [ -x "$c" ]; then BROWSER="$c"; fi
done
[ -n "$BROWSER" ] || { echo "No Chromium browser found. Set CHROME=/path/to/browser" >&2; exit 1; }

TMP="$(mktemp -d)"
"$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --user-data-dir="$TMP" --virtual-time-budget=8000 \
  --window-size=1200,630 --screenshot="$PWD/app/opengraph-image.png" \
  "file://$PWD/scripts/og-card.html" >/dev/null 2>&1
rm -rf "$TMP"
cp app/opengraph-image.png app/twitter-image.png
echo "Wrote app/opengraph-image.png and app/twitter-image.png"
