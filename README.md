**English** | [中文](./README.zh-CN.md)

# RAINMORIME — HUD Portfolio Template

A post-apocalyptic, sci-fi HUD-themed portfolio and blog template built with **Next.js 14**, **TypeScript**, and **SCSS**. Featuring 42 handcrafted CSS animations, a narrative-driven design system, and a built-in MDX blog.

> **[Live Demo →](https://rainmorime.com)**

<!-- Replace with a screenshot or GIF of your deployed site -->
<!-- ![Screenshot](./screenshot.png) -->

## Features

- **Sci-Fi HUD Aesthetic** — Scanlines, ECG waveforms, radar sweeps, and focus-frame animations on every interaction
- **42 Custom CSS Animations** — All built with `@keyframes`, zero animation libraries for core effects
- **Power System** — Toggle an "inverted" mode that shifts the entire color palette
- **Typing Effect** — AI-style text output that simulates deliberate word selection
- **5-Column Navigation** — Each column has unique hover animations (task list, tower growth, ECG, radar, focus frame)
- **WebGL Background** — Dynamic rain particle effect (lazy-loaded after animations complete)
- **MDX Blog** — Write posts in Markdown, auto-generated reading time, tags, and RSS feed
- **SSE Real-Time Stats** — Live visitor count and uptime, zero external dependencies
- **Music Player** — Vinyl record UI with drag-to-switch interaction
- **Fully Responsive** — Works on mobile with adapted animations and touch interactions

## Tech Stack

| Category | Tools |
|----------|-------|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | SCSS Modules + CSS Custom Properties |
| Animations | CSS @keyframes, Framer Motion, GSAP |
| 3D | Three.js + React Three Fiber (lazy-loaded) |
| Blog | MDX via next-mdx-remote |
| Server | Custom Node.js server with SSE |
| Deployment | PM2 |

## Quick Start

```bash
git clone https://github.com/your-username/rainmorime-template.git
cd rainmorime-template
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Customization

### 1. Personal Data

All personal content is stored in the `data/` directory:

| File | What to Change |
|------|----------------|
| `data/projects.ts` | Your projects and portfolio items |
| `data/life.ts` | Games, travel, hobbies |
| `data/experience.ts` | Education and work timeline |
| `data/friendLinks.ts` | Blog friend links |
| `data/skills.ts` | Your skill tree |

### 2. Contact & About

- `components/sections/ContactSection.tsx` — Email, GitHub, social links
- `components/sections/AboutSection.tsx` — Footer info, license, avatar
- `public/avatar.svg` — Your avatar image (replace the default placeholder)

### 3. Blog Posts

Create `.mdx` files in `content/blog/`:

```markdown
---
title: "My First Post"
date: "2025-01-01"
excerpt: "A short description."
tags: ["hello", "world"]
---

Your content here in Markdown.
```

### 4. Music Player

Edit the `playlist` array in `components/interactive/MusicPlayer.tsx`. Place audio files in `public/music/`.

### 5. Images

The template uses placeholder images from [placehold.co](https://placehold.co). Replace image URLs in your data files with your own hosted images.

### 6. Colors

The primary color is controlled by `--ark-highlight-green` in `styles/globals.scss`. The inverted (power-off) palette uses pink tones — both can be customized via CSS variables.

## Project Structure

```
├── pages/              # Next.js file-based routing
├── components/
│   ├── layout/         # MainLayout, NavigationColumns, HUD, LeftPanel
│   ├── sections/       # Works, Experience, Life, Contact, About
│   ├── detail/         # Detail views for portfolio items
│   ├── effects/        # WebGL background, Noise, Tesseract
│   ├── interactive/    # Music player, cursor, lightbox, lever
│   └── shared/         # Reusable components (Timeline, LazyImage, etc.)
├── hooks/              # Custom React hooks
├── contexts/           # Global state (AppContext, TransitionContext)
├── data/               # All personal content (edit these!)
├── content/blog/       # MDX blog posts
├── styles/             # SCSS modules and partials
├── lib/                # Blog utilities
└── server.js           # Custom server (SSE stats)
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### PM2 (Recommended)

```bash
pm2 start server.js --name my-portfolio
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `NEXT_PUBLIC_SITE_URL` | No | Your site URL for sitemap/RSS |

## Design Philosophy

This template was born from a narrative concept: a post-apocalyptic world where an AI assistant (the website itself) serves as the interface through which visitors perceive the world. Every design decision — from the HUD overlay to the power system toggle — reflects this worldbuilding.

The green highlight color (`--ark-highlight-green`) serves double duty as both the interface accent and a narrative element. You are free to keep this narrative layer, adapt it to your own story, or strip it entirely and use the template as a pure visual framework.

## License

This project is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

- **Attribution** — Credit the original project
- **NonCommercial** — No commercial use
- **ShareAlike** — Derivatives must use the same license

## Acknowledgments

Built with inspiration from sci-fi interfaces in film and games. Original design by [RainMorime](https://github.com/RainMorime).
