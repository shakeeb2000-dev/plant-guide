# Putting the app online and installing it on a phone

Free, no server to look after. GitHub holds the files and serves them as a website.
Do this bit on a computer — dragging folders around on a phone is painful.

> ## Read this first
> Free GitHub website hosting only works on a **public** repository. Public means
> **anyone on the internet can read it.** Right now that's fine, because everything in
> the app is my made-up example text.
>
> **Before you put your real plant procedures in it**, decide what you want:
> - Public is fine if you don't mind the world seeing your procedures.
> - If you don't, you need private hosting instead. Tell me and I'll set that up — it
>   can still be free, and you can lock it to your team's email addresses.

---

## Part 1 — Get the files onto GitHub

1. Go to **github.com** and make a free account if you don't have one.
2. Click the **+** at the top right → **New repository**.
3. Name it `plant-guide`. Leave it as **Public**. Click **Create repository**.
4. Download the files from this session. Easiest is the single zip:
   `plant-guide-for-github.zip` — download it and unzip it on your computer.
5. On the new repository page, click **Add file** → **Upload files**.
6. Drag in **everything** from inside the unzipped folder — all the files *and* the
   `data`, `icons` and `tools` folders. Don't drag the outer folder itself, drag what's
   inside it.
7. Scroll down and click **Commit changes**.

## Part 2 — Turn on the website

8. Click **Settings** (top of the repository page).
9. In the left menu, click **Pages**.
10. Under *Build and deployment* → *Source*, choose **Deploy from a branch**.
11. Branch: **main**, folder: **/ (root)**. Click **Save**.
12. Wait a minute or two, then refresh the page. It will show your link, something like:

    `https://YOUR-USERNAME.github.io/plant-guide/`

That link is your app. Share it with anyone who needs it.

## Part 3 — Install it on the phone

**Android (Chrome)**
13. Open the link in Chrome.
14. Tap the **three dots** menu.
15. Tap **Install app** (or **Add to Home screen**).
16. Tap **Install**.

**iPhone (must be Safari, not Chrome)**
13. Open the link in Safari.
14. Tap the **Share** button (square with an arrow going up).
15. Scroll down, tap **Add to Home Screen**.
16. Tap **Add**.

Now there's a green clipboard icon on the home screen. It opens full screen with no
browser bar, and it works with **no signal** once it has been opened a first time.

---

## Updating it later

When we change the steps:

1. I'll update the files and bump the version number in `sw.js`. That number is what
   tells the phones "there's a new copy, throw the old one away".
2. You upload the changed files to GitHub the same way (**Add file → Upload files**;
   same filename replaces the old one).
3. Everyone's phone picks up the new version the next time they open it with signal.

If someone's phone seems stuck on an old version: open it with signal, close it
completely, open it again.
