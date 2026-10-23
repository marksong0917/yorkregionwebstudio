# York Region Web Studio — Official Website

Official source code repository for the **York Region Web Studio** website ([yorkregionwebstudio.com](https://yorkregionwebstudio.com/)). York Region Web Studio builds custom websites for small businesses in York Region and the GTA — design, hosting setup, security, and ongoing care in one package.

---

## Tech Stack & Infrastructure

- **Front-End:** HTML5, CSS3, vanilla JavaScript — no framework, no CMS
- **Hosting:** GitHub Pages (custom domain via `CNAME`)
- **Contact form:** Posts to [Web3Forms](https://web3forms.com) (`api.web3forms.com/submit`), delivered to marksong0000@gmail.com — no server of our own required. `mailto:` and `tel:+12895005666` links are also shown.

## Project Structure

```text
├── index.html          # Home page (the service, portfolio, pricing, contact)
├── crm-bot.html        # CRM + built-in assistant feature page
├── trade-estimator.html # Online estimator feature page
├── terms.html          # Website Terms of Use
├── privacy.html        # Privacy policy
├── 404.html            # Custom not-found page
├── css/
│   ├── styles.css      # Stylesheet source — edit this one
│   └── styles.min.css  # Minified production build — the pages load this
├── js/
│   ├── main.js         # JavaScript source — edit this one
│   └── main.min.js     # Minified production build — the pages load this
├── images/             # Portfolio preview (jpg + webp) and touch icon
├── logo.svg            # Studio logo
├── sitemap.xml         # XML sitemap
├── robots.txt          # Crawler rules
├── CNAME               # Custom domain configuration (yorkregionwebstudio.com)
├── LICENSE             # License & copyright notice
└── README.md           # This file
```

## Making Changes

Edit `css/styles.css`, then regenerate the minified build before pushing — the pages load `css/styles.min.css`, so source edits alone won't show up live:

```bash
npx clean-css-cli -o css/styles.min.css css/styles.css
```

Same for JavaScript: edit `js/main.js`, then regenerate the minified build — the pages load `js/main.min.js`:

```bash
npx terser js/main.js -o js/main.min.js
```

Pushing to `main` deploys automatically via GitHub Pages (live within a minute or two).

## Portfolio Note

The studio's flagship build is the [Newood Millwork Inc.](https://newoodmillwork.com) corporate site (repo: `marksong0917/newoodmillwork`), whose preview image lives in `images/`.
