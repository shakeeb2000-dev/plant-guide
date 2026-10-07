# Plant Guide

An offline, button-driven manual for the rendering plant at Australian Tallow
Producers: startup, shutdown, each line, the plant map, and step-by-step
troubleshooting.

> **Everything in here is example text right now.** It shows the shape of the
> book, not your real plant. Nothing should be followed on site until your
> supervisor has checked and signed off each page.

## How to open it

Open `index.html` in any browser — Chrome, Edge, Safari, on a PC, phone or
tablet. No internet, no install, no login. Copy the whole folder onto a tablet
and it works in the control room with the wifi off.

## The two looks

There is a button in the top bar that switches between them, and the choice is
remembered on that device.

| Look | What it is for |
|---|---|
| **Control Room** | Dark, glowing, quiet. Suits the control room and night shift. |
| **Bold Industrial** | High contrast, heavy type, hard edges. Suits bright daylight, gloves and reading across a noisy room. |

Both print the same: clean black on white.

## The plant map

The map works itself out from the arrows in `data/plant-map.js` — nothing is
placed by hand. Long chains of conveyors are folded into bands that snake down
the page, and the whole drawing is then scaled to fill the screen, so you should
never have to zoom to read it. There is still a zoom and a full-screen button if
you want them.

To change the drawing you change which machine feeds which. That is all.

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | Open this one |
| `app.js` | The buttons, the map engine, ticking and search. You don't need to touch this. |
| `styles.css` | Both looks live here |
| `data/procedures.js` | **The content.** Startup, shutdown, every line. |
| `data/troubleshooting.js` | **The content.** Every fault and its questions. |
| `data/plant-map.js` | **The content.** The areas, the machines and what flows where. |
| `data/interviews.js` | **The content.** The question sheets you type answers into. |
| `machine-icons.js` | The hand-drawn icon for each type of machine. |
| `QUESTION-SHEET.md` | What to ask your boss |
| `PLANT-EQUIPMENT.md` | The equipment list and every guess I made on the map |
| `INTERVIEW-1-startup.md` | Printable paper copy of the startup sheet |
| `INTERVIEW-2-shutdown.md` | Printable paper copy of the shutdown sheet |
| `version.js` / `version.json` | The version number. Both must say the same thing. |
| `GITHUB-STEPS.md` | How to put it online and install it on a phone |
| `PLANT-GUIDE-single-file.html` | The whole app squashed into one file, for emailing around |
| `manifest.json`, `sw.js`, `icons/` | What makes it installable and work with no signal |
| `build-one-file.js` | Rebuilds the single file: `node build-one-file.js` |
| `tools/bump-version.js` | Bumps the version in all three places at once |
| `tools/make-icons.py` | Redraws the app icons. Only needed if the logo changes. |
| `tools/serve.js` | A local test server, for checking the offline bits |

## Installing it on a phone

Follow `GITHUB-STEPS.md`. Short version: upload the folder to a GitHub
repository, turn on GitHub Pages, open the link on the phone, then "Install app"
(Android) or "Add to Home Screen" (iPhone). After the first open it works with
no signal.

## Releasing a new version

```
node tools/bump-version.js "what changed"   # bumps version.js, version.json and sw.js together
node build-one-file.js                      # rebuilds the single-file copy
```

Then upload to GitHub. On the phone, Settings → **Get the latest version now**
pulls it down immediately; otherwise it arrives on its own next time the app is
opened with signal.

## Answers, backup and restore

Everything typed into the question sheets, plus every tick and sign-off, is
stored on that one device. Settings → **Save a backup file** writes it all to a
JSON file; **Load a backup** reads it back. Updating the app never touches those
answers.

The two `INTERVIEW-*.md` files are just printable paper copies. The sheets inside
the app are the live ones — type answers there.

## What it does

- **Big buttons** for Plant Startup, Plant Shutdown, each line, and fault finding.
- **The plant map**, 17 areas and 136 machines, every one with its own page
  showing what it is joined to and what normal looks like.
- **Tick-off checklists.** Ticks are remembered on that device, so you can walk
  away and come back without losing your place. Name and date box at the top.
- **Guided fault finding.** Pick the problem, answer a few yes/no questions, get
  the fix and a clear "stop and call someone" line.
- **Search.** Type `steam`, `smell` or a motor number like `M141` and it finds
  every page that mentions it.
- **Print.** Any page prints as a clean paper checklist or saves as a PDF.

## Changing the content

All the words live in the four files in `data/`. Open one in Notepad, change the
text between the quote marks, save, refresh the browser. Keep the commas and
brackets where they are.

Set `status: "approved"` on a procedure once your boss has signed it off — the
orange "needs sign-off" badge turns green.

## What we can add later

- Photos and short videos on each step.
- A second language next to the English.
- Saving the tick-offs to a shared record instead of just the one device.
- A quick link to the right fault page from a QR code stuck on the machine.
- Live readings from the control system, instead of the typed-in "what normal
  looks like" numbers.
