# Portfolio site

A designer portfolio (product / UX / UI). Static site: plain HTML, CSS and JS, no build step, no dependencies.

- Repo: https://github.com/soyunoh/portfolio.git
- Deploys: GitHub Pages serves `main` from the repo root at the custom domain https://soyun.design/ (the root `CNAME` file holds the domain; the DNS is at Porkbun). Earlier homes: Netlify (auto-deploys stopped after `f28886c`) and `SairaYashika/Portfolio`. `.nojekyll` keeps GitHub from running Jekyll. Pages has a soft limit of about 10 builds per hour, so if many pushes are queued, batch them.
- The site's owner reads and writes Korean; write site copy in English, talk to the owner in Korean unless they write in English.

## Structure

```
index.html              Landing: hero + 2-column project grid (hover overlay)
about.html              About: intro, one "Soyuns" photo gallery (three staggered columns of 4 photos each plus one full-width wide photo; columns have equal height so the block is a clean rectangle), the shared footer
projects/*.html         One case study per project (medly-solar, pocket-saju, connai, qvest; each links to the next)
images/                 Real project images (compress before adding)
styles.css              All styles, shared by every page
script.js               Footer year, scroll reveal
```

The nav is `Work`, `About` and `Resume`. `Archive` and `Contact` were removed on purpose; don't add them back. The `Resume` link is `href="#"` until the owner shares what it should open. There is no contact button; visitors reach you through the footer icons (email, LinkedIn, ...) and the email icon in the About footer.

## Conventions

- **Paths are relative** (`../styles.css`, `projects/...`) so the site works both at a domain root and under `/Portfolio/` on GitHub Pages. Never use root-absolute paths like `/styles.css`.
- **Every page repeats the same header** (brand + Work / About / Resume) **and the same footer** (`© year Soyun` on the left, the four social icons on the right, hairline above). Change the footer on all pages together. When you add or rename a page, update the nav on all pages and set `aria-current="page"` on the active link.
- **Header logo:** `images/logo-4a.svg` (sun mark from the owner's design hand-off, provenance metadata stripped) sits in `.brand` before the wordmark, rotated -45deg at its upper left exactly as in the design reference; its left edge is the page's left edge and the wordmark is pushed right to make room. Don't move it without checking the reference.
- **Mouse pointer:** the owner's `logo-1b` sun exactly as designed (12 hand-drawn rays, hollow circle, ORIGINAL thin stroke widths 2.3-3.4 of 120; they said a thicker version looked too heavy), drawn at 12px (the owner keeps shrinking it: 36 -> 18 -> 9 -> 20 -> 15 -> 12) with a hairline white halo so it shows on dark photos. `images/cursor-sun.svg` + `cursor-sun{,@2x,@3x}.png` for normal areas; `cursor-sun-link.*` for `a[href]`/`button` (same sun with the circle filled in `#1C1A17`, no pointing hand). CSS gives the SVG first and `-webkit-image-set` PNGs after it, so retina screens get a sharp image and other browsers fall back to the SVG or the default cursor. Hotspot is the centre (6 6). Cursor images must stay <= 128px. To change size or design, regenerate all six PNGs from the SVGs (draw each SVG onto a canvas at 1x/2x/3x); keep comparison files OUTSIDE the project so nothing gets overwritten.
- **Design tokens** live in `:root` at the top of `styles.css` (colours, fonts, gutter, gap, radius). Change them there, not inline.
- **Fonts:** Newsreader (serif, headings) and Inter (UI/body), plus Comfortaa (500) only for the `Soyun` brand name, the `Work` / `About` nav and the landing headline and the About gallery title (`Soyuns`), loaded from Google Fonts in each page's `<head>`. Keep that `<link>` identical across pages.
- **Look:** white background, black text, muted grey secondary text, lots of whitespace, large image tiles with 8px radius. No dark mode. Keep it minimal and editorial; avoid adding decoration.
- **Tile size:** the tile height is fixed by `--tile-h` (the 7:5 height the tiles had with the old 5% margins) and the width follows the shared page width, so images are cropped left/right by `object-fit: cover`. Keep the mockup centred in every tile image.
- **Landing tiles:** each `.tile` has a `--tint` colour used by the hover overlay (company name + discipline). Touch devices (`hover: none`) show the name in a `.caption` under the tile instead. Keep both in sync when editing a project's name or tags.
- **Page width is shared:** every page (landing, About, case studies) uses the same `--gutter` (12vw on desktop >= 960px, max 260px; 10.5vw below that) and `--gap` (13px) from `:root`, so the header, content and footer line up across pages. Don't give a single page its own gutter. About-specific styles go in the "About page" section of `styles.css`.
- **Accessibility:** keep `alt`/`aria-label` on images and placeholder art, visible focus styles, and the `prefers-reduced-motion` handling for `.reveal`.
- Keep it dependency-free: no frameworks, bundlers or npm packages unless the owner asks.

## Placeholders

Most content is still placeholder. Placeholders are written in `[square brackets]` (e.g. `[Company A]`, `[X%]`) or as obvious generic text (`[Your role]`, `[Team]`). The artwork in tiles, galleries and case studies is inline SVG / CSS shapes standing in for real images.

- Case-study copy for Medly-SOLAR, QVest and CONNAÎ was adapted from the owner's old portfolio (https://soyunoh.webflow.io/). Pocket Saju has no source yet and is still placeholder. All four projects now use real app images. Keep the case-study layout as it is; only change the content.
- Replace placeholders only with content the owner provides. Don't invent real facts, names, metrics or company details.
- Don't use real companies' logos, names or imagery as placeholders.
- When real images arrive, put them in `images/`, compress them, and swap the placeholder element (`.art` SVG in tiles, `.cs-cover` / `.cs-figure` in case studies; About photos are already real `.card.photo` images) for an `<img>` with `alt` text, `width`/`height` and `loading="lazy"` (not on the first visible image).

Known values still to replace: the `Resume` link (`href="#"`), all case-study facts and copy. All four footer social links (LinkedIn, Instagram, X, email) are real.

## Working on it

- Preview locally with `python3 -m http.server 4173` from this folder, then open `http://localhost:4173`. Opening files with `file://` also works, but scroll-reveal and some checks behave more reliably over http.
- Check at phone width (about 375px) and desktop width (1440px). There should be no horizontal scroll.
- Check every link you touched, including the `Next project` chain in case studies.
- The owner has said: after every change, commit and push right away without asking. Pushing publishes the site (Netlify redeploys on push), so still keep changes small and check them locally first.
- Commit messages: short, imperative, describe the visible change (e.g. `About: add gallery photos`).
