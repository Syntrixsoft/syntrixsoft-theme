# Syntrixsoft Theme 6 — Versions

Static HTML themes for Syntrixsoft. This repo contains five iterations (`theme-6-v1` through `theme-6-v5`). Each version is a self-contained site—no build step required.

## Repository layout

| Folder       | Site root (run server from here)     | Notes                          |
|-------------|--------------------------------------|--------------------------------|
| `theme-6-v1` | `theme-6-v1/`                        | Base theme                     |
| `theme-6-v2` | `theme-6-v2/`                        | Globe hero variant             |
| `theme-6-v3` | `theme-6-v3/`                        | Premium hero + `hero-premium/` |
| `theme-6-v4` | `theme-6-v4/theme-6/`                | Nested under `theme-6/`        |
| `theme-6-v5` | `theme-6-v5/theme-6/`                | Latest (clients section, favicons) |

> **v4 and v5:** HTML and assets live inside `theme-6/`, not the version folder root. Start the server from that inner folder.

## Run any theme locally

Use a local web server so assets, scripts, and relative links load correctly. Opening `index.html` directly in the browser (`file://`) often breaks paths and features.

### Option 1 — Python (recommended)

From the repo root:

```bash
# v1
cd theme-6-v1 && python3 -m http.server 8080

# v2
cd theme-6-v2 && python3 -m http.server 8080

# v3
cd theme-6-v3 && python3 -m http.server 8080

# v4
cd theme-6-v4/theme-6 && python3 -m http.server 8080

# v5
cd theme-6-v5/theme-6 && python3 -m http.server 8080
```

Then open:

- **Home:** [http://localhost:8080/](http://localhost:8080/) or [http://localhost:8080/index.html](http://localhost:8080/index.html)
- **v3 premium hero demo:** [http://localhost:8080/hero-premium/](http://localhost:8080/hero-premium/) (v3, v4, v5 where present)

Use another port if `8080` is busy, e.g. `python3 -m http.server 3000`.

### Option 2 — One command from repo root

Replace the folder path with the version you want:

```bash
python3 -m http.server 8080 --directory theme-6-v1
python3 -m http.server 8080 --directory theme-6-v4/theme-6
python3 -m http.server 8080 --directory theme-6-v5/theme-6
```

### Option 3 — VS Code / Cursor Live Server

1. Open the **site root** folder for that version (see table above).
2. Right-click `index.html` → **Open with Live Server**.

## Main pages

Each theme includes the same core pages (paths relative to that version’s site root):

- `index.html` — Home
- `about.html`, `services.html`, `portfolio.html`, `blog.html`, `blog-detail.html`
- `careers.html`, `contact.html`
- `service-*.html` — Individual service pages (AI, cloud, web, mobile, etc.)
- `privacy-policy.html`, `terms-conditions.html`, `404.html`

Assets are under `assets/` (CSS, JS, images, icons).

## Quick reference

```text
theme-6-versions/
├── theme-6-v1/          → serve here
├── theme-6-v2/          → serve here
├── theme-6-v3/          → serve here (+ hero-premium/)
├── theme-6-v4/theme-6/  → serve here
└── theme-6-v5/theme-6/  → serve here (recommended latest)
```

## Clone this repo

```bash
git clone git@github.com:Syntrixsoft/syntrixsoft-theme.git
cd syntrixsoft-theme
```

## Stop the server

In the terminal where the server is running, press `Ctrl+C`.
