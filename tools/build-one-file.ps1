# PowerShell port of build-one-file.js, for this PC which has no Node.
# Squashes the app into PLANT-GUIDE-single-file.html. Mirrors the JS logic.
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\build-one-file.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function ReadRel($rel) { return [IO.File]::ReadAllText((Join-Path $root $rel)) }

$html = ReadRel 'index.html'

# 1. stylesheet link -> <style> block (plain splice, so CSS $ chars are safe)
$css = (ReadRel 'styles.css').Trim()
$needle = '<link rel="stylesheet" href="styles.css">'
$html = $html.Replace($needle, "<style>`n" + $css + "`n</style>")

# 2. every <script src="..."></script> -> inlined file
$pulled = @()
$html = [regex]::Replace($html, '[ \t]*<script src="([^"]+)"></script>\s*', {
  param($m)
  $src = $m.Groups[1].Value -replace '^\./',''
  $full = Join-Path $root $src
  if (-not (Test-Path -LiteralPath $full)) { return '' }
  $script:pulled += $src
  return "`n<script>`n/* ---- $src ---- */`n" + ([IO.File]::ReadAllText($full)).Trim() + "`n</script>`n"
})

# 3. drop manifest + apple-touch links
$html = [regex]::Replace($html, '[ \t]*<link rel="manifest"[^>]*>\s*', '', 1)
$html = [regex]::Replace($html, '[ \t]*<link rel="apple-touch-icon"[^>]*>\s*', '', 1)

# icon -> data url
$svgPath = Join-Path $root 'icons/icon.svg'
if (Test-Path -LiteralPath $svgPath) {
  $svg = [IO.File]::ReadAllText($svgPath)
  $dataUrl = 'data:image/svg+xml;base64,' + [Convert]::ToBase64String($utf8.GetBytes($svg))
  $html = [regex]::Replace($html, '<link rel="icon"[^>]*>', '<link rel="icon" href="' + $dataUrl + '" type="image/svg+xml">', 1)
}

# strip the service-worker registration block
$html = [regex]::Replace($html, '(?s)<script>\s*/\* Makes the app work with no internet.*?</script>\s*', "<!-- service worker left out of the single-file copy -->`n", 1)

# build note after the title
$today = (Get-Date).ToString('yyyy-MM-dd')
$html = [regex]::Replace($html, '<title>([^<]*)</title>', ('<title>$1</title>' + "`n<!-- Single-file copy. Built by build-one-file.ps1 on " + $today + ". Edit the folder, not this file. -->"), 1)

[IO.File]::WriteAllText((Join-Path $root 'PLANT-GUIDE-single-file.html'), $html, $utf8)

$kb = [math]::Round(($utf8.GetBytes($html)).Length / 1024)
"Built PLANT-GUIDE-single-file.html  ($kb KB)"
"Pulled in:"; $pulled | ForEach-Object { "  - $_" }

$problems = @()
if ($html -match '<script src=') { $problems += 'a <script src> was left behind' }
if ($html -match '<link rel="stylesheet"') { $problems += 'the stylesheet link was left behind' }
if ($html.IndexOf('window.PLANT_PROCEDURES') -lt 0) { $problems += 'the procedures did not go in' }
if ($html.IndexOf('window.PLANT_MAP') -lt 0) { $problems += 'the plant map did not go in' }
if ($html.IndexOf('var Plant =') -lt 0) { $problems += 'app.js did not go in' }
if ($html.IndexOf('Lamb Raw Material Start Up') -lt 0) { $problems += 'the new procedures did not go in' }
if ($problems.Count) { "PROBLEMS:"; $problems | ForEach-Object { "  ! $_" }; exit 1 }
"Checks passed."
