# Plant Guide

An offline, button-driven manual for the rendering plant: startup, shutdown, each
line, and step-by-step troubleshooting.

> **Everything in here is example text right now.** It shows the shape of the book,
> not your real plant. Nothing should be followed on site until your supervisor has
> checked and signed off each page.

## How to open it

Open `index.html` in any browser — Chrome, Edge, Safari, on a PC, phone or tablet.
No internet, no install, no login. Copy the whole folder onto a tablet and it works
in the control room with the wifi off.

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | Open this one |
| `app.js` | The buttons, ticking and search. You don't need to touch this. |
| `styles.css` | How it looks |
| `data/procedures.js` | **The content.** Startup, shutdown, every line. |
| `data/troubleshooting.js` | **The content.** Every fault and its questions. |
| `QUESTION-SHEET.md` | What to ask your boss |
| `GITHUB-STEPS.md` | How to put it online and install it on a phone |
| `PLANT-GUIDE-single-file.html` | The whole app squashed into one file, for emailing around |
| `manifest.json`, `sw.js`, `icons/` | What makes it installable and work with no signal |
| `build-one-file.js` | Rebuilds the single file: `node build-one-file.js` |
| `tools/` | Icon maker and a local test server. Not needed day to day. |

## Installing it on a phone

Follow `GITHUB-STEPS.md`. Short version: upload the folder to a GitHub repository, turn
on GitHub Pages, open the link on the phone, then "Install app" (Android) or
"Add to Home Screen" (iPhone). After the first open it works with no signal.

**If you change the content, bump `CACHE_VERSION` in `sw.js`** so phones drop the old
copy and pick up the new one.

## What it does

- **Big buttons** for Plant Startup, Plant Shutdown, each line, and troubleshooting.
- **Tick-off checklists.** Ticks are remembered on that device, so you can walk away
  and come back without losing your place. Name and date box at the top.
- **Guided fault finding.** Pick the problem, answer a few yes/no questions, get the fix
  and a clear "stop and call someone" line.
- **Search.** Type `steam` or `smell` and it finds every page that mentions it.
- **Print.** Any page prints as a clean paper checklist or saves as a PDF.

## Changing the content

All the words live in the two files in `data/`. Open one in Notepad, change the text
between the quote marks, save, refresh the browser. Keep the commas and brackets where
they are.

Set `status: "approved"` on a procedure once your boss has signed it off — the orange
"needs sign-off" badge turns green.

## What we can add later

- Photos and short videos on each step.
- A second language next to the English.
- Saving the tick-offs to a shared record instead of just the one device.
- A quick link to the right fault page from a QR code stuck on the machine.
