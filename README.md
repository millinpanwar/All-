
# CSV Toolkit (Open-Source)

A privacy-friendly, static-site toolkit of CSV utilities inspired by popular CSV tool sites—implemented from scratch with original UI and copy. Self-host anywhere (no server needed).

## Highlights
- 100% client-side — files never leave the browser.
- SEO-ready static pages — unique `<title>` + `<meta description>` per tool.
- Easily theme via `assets/css/style.css` (CSS variables).
- Add/rename categories & tools via `tools.json` and by copying a page in `/tools`.
- AdSense-ready — drop your snippet in `includes/adsense.html` to show ads on all pages.
- Libraries from CDNs: Papa Parse (CSV), SheetJS (XLSX).

## Add a New Tool
1. Copy any HTML from `/tools`, e.g. `tools/csv-to-json.html`.
2. Change `<title>` and meta description; build your tool UI & JS inline (or add JS in `assets/js/`).
3. Add an entry in `tools.json` with `name`, `slug/page`, `category`, and `desc`.
4. Link it anywhere (Home auto-reads `tools.json`).

## AdSense
Paste your AdSense code into `includes/adsense.html`. Every page loads it into the top and bottom ad panels.

## Legal Note
This project is an **original** implementation. Do **not** copy another site's proprietary code, text, branding, or trade dress.
