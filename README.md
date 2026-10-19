# York Region Web Studio — Official Website

Official source code repository for the **York Region Web Studio** website ([yorkregionwebstudio.com](https://yorkregionwebstudio.com/)). York Region Web Studio builds custom websites for small businesses in York Region and the GTA — design, hosting setup, security, and ongoing care in one package.

---

## Tech Stack & Infrastructure

- **Front-End:** HTML5, CSS3, vanilla JavaScript — no framework, no CMS
- **Hosting:** GitHub Pages (custom domain via `CNAME`)
- **Contact form:** Posts to [Web3Forms](https://web3forms.com) (`api.web3forms.com/submit`), delivered to marksong0000@gmail.com — no server of our own required. `mailto:` and `tel:+12895005666` links are also shown.

## Project Structure

```text
├── index.html          # Single-page site (services, portfolio, pricing, contact)
├── terms.html          # Website Terms of Use
├── privacy.html        # Privacy policy
├── css/
│   ├── styles.css      # Stylesheet source — edit this one
│   └── styles.min.css  # Minified production build — the page loads this
├── js/
│   └── main.js         # Site JavaScript (loaded directly, not minified)
├── images/
│   └── newood-preview.jpg  # Portfolio preview of the Newood Millwork site
├── logo.svg            # Studio logo
├── sitemap.xml         # XML sitemap
├── robots.txt          # Crawler rules
├── CNAME               # Custom domain configuration (yorkregionwebstudio.com)
├── LICENSE             # License & copyright notice
└── README.md           # This file
```

## Making Changes

Edit `css/styles.css`, then regenerate the minified build before pushing — the page loads `css/styles.min.css`, so source edits alone won't show up live:

```bash
npx clean-css-cli -o css/styles.min.css css/styles.css
```

`js/main.js` is loaded as-is; no build step needed for JavaScript.

Pushing to `main` deploys automatically via GitHub Pages (live within a minute or two).

## Portfolio Note

The studio's flagship build is the [Newood Millwork Inc.](https://newoodmillwork.com) corporate site (repo: `marksong0917/newoodmillwork`), whose preview image lives in `images/`.
