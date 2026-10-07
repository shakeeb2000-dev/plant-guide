#!/bin/sh
# Builds the one zip file you upload to GitHub.
#
#     sh tools/make-zip.sh
#
# Run it from the plant-guide folder. It rebuilds the single-file copy
# first, then zips everything except the git folder and the zip itself.
# The files sit at the top of the zip (no wrapper folder), so whatever
# you extract is ready to drag straight into GitHub.

set -e

cd "$(dirname "$0")/.."

OUT="plant-guide-for-github.zip"

echo "Rebuilding the single-file copy..."
node build-one-file.js >/dev/null

echo "Zipping..."
rm -f "$OUT"
zip -r -q "$OUT" . \
  -x ".git/*" \
  -x ".gitignore" \
  -x "$OUT" \
  -x "*.DS_Store" \
  -x "__MACOSX/*"

echo ""
echo "Built $OUT"
unzip -l "$OUT" | tail -3
