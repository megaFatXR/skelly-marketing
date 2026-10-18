# Skelly — landing page

Astro site for Skelly, deployed to GitHub Pages.

## Commands

Run from `web/`:

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Dev server at `localhost:4321`          |
| `npm run build`   | Build the static site to `./dist/`      |
| `npm run preview` | Serve the build locally                 |
| `npm run favicons` | Rebuild favicons from `src/assets/icon.png` |

## Structure

```text
src/
├── components/   Hero, Features, Footer
├── layouts/      Base.astro (head, meta, global styles)
├── lib/url.ts    withBase() for links under the Pages base path
├── pages/        index.astro
├── styles/       global.css (color tokens, light/dark)
└── consts.ts     site title, description, App Store URL
```

## Deploying

`.github/workflows/deploy-web.yml` (at the repo root) builds and deploys on
every push to `main` that touches `web/`. In the GitHub repo, set
**Settings → Pages → Source** to **GitHub Actions**.

The workflow passes the Pages origin and base path to the build as
`SITE_URL` and `BASE_PATH`, so a project page (`<user>.github.io/<repo>`)
and a custom domain both work. Link to internal pages and `public/` files with
`withBase('path')` rather than a bare `/path` so they keep working under a
sub-path.

To check a sub-path build locally:

```sh
BASE_PATH=/skelly-marketing npm run build && npm run preview
```
