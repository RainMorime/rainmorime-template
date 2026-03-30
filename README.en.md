[中文](./README.md) | **English**

# RAINMORIME Template

Your portfolio doesn't have to look like everyone else's.

A post-apocalyptic, sci-fi HUD portfolio and blog template. No card grids, no gradient heroes — open it and you'll see scanlines, ECG waveforms, radar sweeps, and an AI carefully choosing its words.

> **[Live Demo →](https://rainmorime.com)**

![Preview](./docs/preview.png)
<!-- 🖼️ Consider replacing with a GIF (15 sec, showing hover animations + page transitions) -->

## Getting Started

```bash
git clone https://github.com/RainMorime/rainmorime-template.git
cd rainmorime-template
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. You'll see the loading sequence, then the five-column navigation. Now replace the placeholder content with your own.

## Make It Yours

### Step 1: Basic Info

These are the things you **must** change — otherwise your site will say "YOUR_SITE" and "your-email@example.com":

| What to change | Where | What to put |
|----------------|-------|-------------|
| Site name | `components/layout/GlobalHud.tsx` | Search `YOUR_SITE`, replace with your name |
| Loading title | `components/shared/LoadingScreen/LogoTitle.tsx` | Same as above |
| Email | `components/sections/ContactSection.tsx` | Search `your-email@example.com` |
| Email (copy) | `pages/content.tsx` | Search `your-email@example.com` |
| Copyright | `components/sections/AboutSection.tsx` | Search `Your Name` |
| Avatar | `public/avatar.svg` | Replace with your own image |
| Typing tagline | `hooks/useTypingEffect.ts` | Edit `englishText` and `chineseText` |

### Step 2: Fill In Content

The `data/` directory holds all your content as plain TypeScript arrays — just follow the examples:

| File | Content |
|------|---------|
| `data/projects.ts` | Your projects and portfolio items |
| `data/experience.ts` | Education and work timeline |
| `data/life.ts` | Games, travel, hobbies |
| `data/skills.ts` | Skill tree |
| `data/friendLinks.ts` | Friend links |

### Step 3: Write Blog Posts

Create `.mdx` files in `content/blog/`:

```markdown
---
title: "My First Post"
date: "2025-01-01"
excerpt: "A short description."
tags: ["hello", "world"]
---

Write in Markdown. Supports syntax highlighting, images, and custom components.
```

### Step 4: Optional Configuration

<details>
<summary><b>Music Player</b></summary>

Edit the `playlist` array at the top of `components/interactive/MusicPlayer.tsx`. Place audio files in `public/music/`. Supports `.mp3` and external URLs.

</details>

<details>
<summary><b>Colors</b></summary>

The primary color is `--ark-highlight-green: #b2f2bb` in `styles/globals.scss`. Change this one variable to re-theme the entire site.

The inverted (power-off) palette uses `--ark-inverted-*` variables in the same file.

</details>

<details>
<summary><b>Environment Variables</b></summary>

```env
PORT=3000                                    # Server port, default 3000
NEXT_PUBLIC_SITE_URL=https://your-domain.com # For sitemap and RSS
```

</details>

<details>
<summary><b>Deployment</b></summary>

```bash
npm run build
npm start            # or with PM2:
pm2 start server.js --name my-site
```

Includes built-in SSE real-time stats (visitor count + online users + uptime) with no external database. Stats persist in `.stats.json` at the project root.

</details>

## Features

- 42 handcrafted CSS animations (scanlines / ECG / radar / focus frame / task list...)
- Power system: lever-toggle inverted color mode
- AI-style typing effect
- Five-column navigation with unique hover animations per column
- WebGL rain particle background (lazy-loaded, won't block first paint)
- MDX blog + RSS + auto reading time
- SSE real-time visitor stats
- Vinyl record music player
- Fully responsive on mobile

<!-- 🖼️ Feature screenshots (hover animation / inverted mode / mobile, one each) -->
<!-- | Hover animations | Inverted mode | Mobile |
|-----------------|--------------|--------|
| ![hover](./docs/hover.gif) | ![inverted](./docs/inverted.png) | ![mobile](./docs/mobile.png) | -->

## Tech Stack

Next.js 14 · TypeScript · SCSS Modules · CSS @keyframes · Framer Motion · GSAP · Three.js · MDX · Node.js SSE

## Project Structure

```
├── pages/              # Page routes
├── components/
│   ├── layout/         # Layout (nav, HUD, left panel)
│   ├── sections/       # Content (Works / Experience / Life / Contact / About)
│   ├── detail/         # Detail views
│   ├── effects/        # Visual effects (WebGL, noise, 3D)
│   ├── interactive/    # Interactive (music player, lightbox, lever)
│   └── shared/         # Reusable components
├── hooks/              # Custom hooks
├── contexts/           # Global state
├── data/               # ← Your content here
├── content/blog/       # ← Your blog posts here
├── styles/             # SCSS stylesheets
└── server.js           # Custom server (SSE stats)
```

## License

[MIT](./LICENSE) — Free to use, just keep the attribution.

---

Design & development by [RainMorime](https://github.com/RainMorime).
