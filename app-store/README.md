# Skelly — App Store screenshots

The screenshots are HTML: `screens.html` lays out each one at 440 × 956 CSS
px, and `npm run export` renders them with Chrome at 3×, which is
1320 × 2868: the 6.9" iPhone size. App Store Connect scales that down for
every smaller iPhone.

## Files

```text
screens.html       the screens: layout, phone frames, callouts
copy.js            the words on each screen, by language
captures/<lang>/   simulator screenshots shown inside the phones
export/<lang>/     the finished PNGs to upload
sim.mjs            readies the screenshots simulator for a region
capture.mjs        saves a simulator screenshot into captures/
export.mjs         renders export/ from screens.html
simulator.mjs      what sim.mjs and capture.mjs share
```

The hero art and the winking skelly come straight from `web/src/assets/`, so
they stay in step with the landing page.

## Setup

Run from `app-store/`, once:

```sh
npm install
```

The export uses the installed Google Chrome. Set `CHROME_PATH` to use another.
`npm run sim` builds Skelly from `~/Workspace/Skelly`. Set `SKELLY_REPO` to
use another checkout.

## Workflow

1. **Simulator.** Pick the region whose preloaded sites the home screen
   should show:

   ```sh
   npm run sim -- US        # United States, in English
   npm run sim -- FR fr     # France, in French
   ```

   This builds Skelly and gets a simulator called "Skelly Screenshots" (an
   iPhone 17 Pro, created the first time) ready. It sets that region and
   language, and installs the app fresh so it opens as on first launch. Your
   own simulators are left alone.

2. **Capture.** Bring up each screen in the simulator and save it:

   ```sh
   npm run capture -- home
   ```

   That writes `captures/en/home.png` with a clean status bar (9:41, full
   signal and battery). Add a language to save into its folder:
   `npm run capture -- home fr`.

   The screens use:

   - `page.png`: a site with Bare Bones on
   - `home.png`: the home screen, fresh from `npm run sim`
   - `reader.png`: an article in Reader, scrolled to the top
   - `listen.png`: the same article being read aloud, with the player showing

   Wait for each screen to settle before capturing it.

3. **Preview.** Open `screens.html` in Chrome, or start the `app-store`
   preview server in `.claude/launch.json` and go to
   `http://localhost:4455/app-store/screens.html`. Add `?lang=fr` to see
   another language.

4. **Export.**

   ```sh
   npm run export          # every language in copy.js
   npm run export -- en    # just English
   ```

   Each PNG is checked to be exactly 1320 × 2868. The export also lists any
   lines or captures a language borrows from English.

## Adding a language

Add it to `copy.js` (the keys are the screens' `data-screen` names), then
capture its screens into `captures/<lang>/`. Until it has its own, a language
shows the English captures. A line too long for the screen shrinks until it
fits. `<br>` sets where lines break, and `<strong>` sets words in bold.

## Changing a screen

Each screen is a `<section class="screen">` in `screens.html`. Its
`data-name` is the file name it exports to, and `data-screen` picks its
copy from `copy.js`.

- `.phone` holds a whole phone; `.phone.bleed` is a bigger one that runs
  off the bottom edge, for captures whose top half matters most. Set
  `--phone-w` on one to resize it.
- `.callout` magnifies part of the capture over the phone. `--x`, `--y`,
  `--w` and `--h` are that region as fractions of the capture's width and
  height, `--zoom` how much bigger it gets, and `--round` its corner radius
  as a fraction of its height. A new capture with the button in another
  place needs new numbers.
