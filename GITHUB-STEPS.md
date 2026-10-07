# Putting it online and onto a phone

You only need to do this once. After that, updates are three commands.

## Why bother

Opening `index.html` from a folder works, but you have to carry the folder
around. Once it is on a web address you can:

- open it on any phone from a link
- install it so it sits on the home screen like a real app
- use it with the signal off, after the first open
- push updates to everyone at once

GitHub Pages does all of that for free.

---

## Part 1 — Put the folder on GitHub

1. Make a GitHub account if you do not have one: <https://github.com/signup>
2. Click **+** (top right) → **New repository**.
3. Name it `plant-guide`. Leave it **Public** — Pages needs that on a free
   account. Do not tick "Add a README".
4. Click **Create repository**.
5. On the next screen click **uploading an existing file**.
6. Drag in **everything** from the `plant-guide` folder, including the `data`,
   `icons` and `tools` folders. Wait for every file to finish.
7. Click **Commit changes**.

> If you would rather I did this part, say so. I can push it for you as long as
> GitHub is connected to our chat.

## Part 2 — Turn Pages on

1. In the repository, click **Settings**.
2. Left menu → **Pages**.
3. Under **Source** choose **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)**. Click **Save**.
5. Wait two or three minutes, then reload the page. It will show your link:

   ```
   https://YOUR-NAME.github.io/plant-guide/
   ```

That link is the app. Open it on a PC first to check it loads.

## Part 3 — Install it on a phone

**Android (Chrome)**

1. Open the link.
2. Menu (three dots) → **Install app** or **Add to Home screen**.
3. It now has its own icon and opens with no browser bars.

**iPhone (must be Safari, not Chrome)**

1. Open the link in Safari.
2. Share button (the square with the arrow) → **Add to Home Screen**.
3. Tap **Add**.

After the first open it works with no signal. Everything the operator types
stays on that phone.

---

## Releasing an update

Three commands, in the `plant-guide` folder:

```
node tools/bump-version.js "what changed"
node build-one-file.js
```

Then upload the changed files to GitHub the same way as before (or
`git add . && git commit -m "what changed" && git push` if you use git).

The version number has to go up, otherwise phones keep serving the copy they
already have. `bump-version.js` is there so you cannot forget one of the three
places it is written.

On the phone: **Settings → Get the latest version now** pulls it down
immediately. Otherwise it arrives on its own the next time the app is opened
with signal.

---

## If something goes wrong

| Problem | What to do |
|---|---|
| Link shows 404 | Pages takes a few minutes the first time. Check Settings → Pages says "Your site is live". |
| Page loads but is unstyled | `styles.css` did not upload. Check the file list in the repository. |
| Blank white page | A file in `data/` is missing. All four must be there. |
| Phone shows an old version | Settings → Get the latest version now. If that fails, uninstall and re-add to home screen. |
| No "Install app" option | You are not on `https`. The GitHub Pages link is https, so check you opened the right link. |

## Keeping it private

A free GitHub account can only use Pages on a public repository, so anyone with
the link could read it. For a draft full of example text that is usually fine.
If the real signed-off procedures should not be public, the options are:

- a paid GitHub plan, which allows Pages on a private repository
- hosting it on the company network instead
- skipping the web entirely and copying `PLANT-GUIDE-single-file.html` onto each
  tablet by hand

Ask me and I will set up whichever you want.
