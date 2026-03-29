# RAINMORIME — HUD Portfolio Template

A post-apocalyptic, sci-fi HUD-themed portfolio and blog template built with **Next.js 14**, **TypeScript**, and **SCSS**. Featuring 42 handcrafted CSS animations, a narrative-driven design system, and a built-in MDX blog.

一款后末日科幻 HUD 风格的个人作品集 + 博客模板，基于 **Next.js 14**、**TypeScript** 和 **SCSS** 构建。包含 42 个手工 CSS 动画、叙事驱动的设计系统和内置 MDX 博客。

> **[Live Demo / 在线演示 →](https://rainmorime.com)**

<!-- Replace with a screenshot or GIF of your deployed site / 替换为你部署后的截图或 GIF -->
<!-- ![Screenshot](./screenshot.png) -->

---

## Features / 功能特性

- **Sci-Fi HUD Aesthetic / 科幻 HUD 美学** — Scanlines, ECG waveforms, radar sweeps, focus-frame animations / 扫描线、心电图波形、雷达扫描、聚焦框动画
- **42 Custom CSS Animations / 42 个自定义 CSS 动画** — All `@keyframes`, zero animation libraries for core effects / 全部手写关键帧，核心动效零依赖
- **Power System / 电源系统** — Toggle "inverted" mode to shift the color palette / 切换"负色"模式，改变全站配色
- **Typing Effect / 打字机效果** — AI-style text output simulating deliberate word selection / 模拟 AI 逐字斟酌的文字输出
- **5-Column Navigation / 五列导航** — Each column has unique hover animations / 每列拥有独特的悬停动画效果
- **WebGL Background / WebGL 背景** — Dynamic particle effect, lazy-loaded / 动态粒子效果，延迟加载
- **MDX Blog / MDX 博客** — Markdown posts with auto reading time, tags, RSS / Markdown 写作，自动阅读时长、标签、RSS
- **SSE Real-Time Stats / SSE 实时统计** — Live visitor count and uptime, zero external dependencies / 实时访客数和运行时间，零外部依赖
- **Music Player / 音乐播放器** — Vinyl record UI with drag-to-switch / 黑胶唱片 UI，拖拽切歌
- **Auto-Deploy / 自动部署** — GitHub webhook with zero-downtime build / GitHub Webhook 零停机构建
- **Fully Responsive / 完全响应式** — Mobile-adapted animations and touch interactions / 移动端适配动画与触摸交互

## Tech Stack / 技术栈

| Category / 类别 | Tools / 工具 |
|----------|-------|
| Framework / 框架 | Next.js 14 (Pages Router) |
| Language / 语言 | TypeScript |
| Styling / 样式 | SCSS Modules + CSS Custom Properties |
| Animations / 动画 | CSS @keyframes, Framer Motion, GSAP |
| 3D | Three.js + React Three Fiber (lazy-loaded) |
| Blog / 博客 | MDX via next-mdx-remote |
| Server / 服务器 | Custom Node.js server with SSE |
| Deployment / 部署 | PM2 + GitHub Webhooks |

## Quick Start / 快速开始

```bash
# Clone the repository / 克隆仓库
git clone https://github.com/your-username/rainmorime-template.git
cd rainmorime-template

# Install dependencies / 安装依赖
npm install

# Copy environment variables / 复制环境变量
cp .env.example .env.local

# Start development server / 启动开发服务器
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

打开 [http://localhost:3000](http://localhost:3000) 查看你的网站。

## Customization / 自定义

### 1. Personal Data / 个人数据

All personal content is in the `data/` directory:

所有个人内容都在 `data/` 目录中：

| File / 文件 | What to Change / 修改内容 |
|------|----------------|
| `data/projects.ts` | Your projects / 你的项目 |
| `data/life.ts` | Games, travel, hobbies / 游戏、旅行、爱好 |
| `data/experience.ts` | Education & work timeline / 教育与工作经历 |
| `data/friendLinks.ts` | Blog friend links / 友链 |
| `data/skills.ts` | Your skill tree / 技能树 |

### 2. Contact & About / 联系方式与关于

- `components/sections/ContactSection.tsx` — Email, GitHub, social links / 邮箱、GitHub、社交链接
- `components/sections/AboutSection.tsx` — Footer info, license / 页脚信息、许可证
- `public/avatar.svg` — Your avatar image / 你的头像图片

### 3. Blog Posts / 博客文章

Create `.mdx` files in `content/blog/`:

在 `content/blog/` 中创建 `.mdx` 文件：

```markdown
---
title: "My First Post"
date: "2025-01-01"
excerpt: "A short description."
tags: ["hello", "world"]
---

Your content here in Markdown.
```

### 4. Music Player / 音乐播放器

Edit the `playlist` array in `components/interactive/MusicPlayer.tsx`. Place audio files in `public/music/`.

编辑 `components/interactive/MusicPlayer.tsx` 中的 `playlist` 数组，音频文件放在 `public/music/` 中。

### 5. Images / 图片

The template uses placeholder images from [placehold.co](https://placehold.co). Replace image URLs in your data files with your own hosted images.

模板使用 [placehold.co](https://placehold.co) 的占位图片。将数据文件中的图片 URL 替换为你自己托管的图片。

### 6. Colors / 配色

The primary color is `--ark-highlight-green` in `styles/globals.scss`. The inverted palette uses pink tones — both customizable via CSS variables.

主色调是 `styles/globals.scss` 中的 `--ark-highlight-green`。负色模式使用粉色调——均可通过 CSS 变量自定义。

## Project Structure / 项目结构

```
├── pages/              # Next.js routing / 路由
├── components/
│   ├── layout/         # MainLayout, NavigationColumns, HUD, LeftPanel
│   ├── sections/       # Works, Experience, Life, Contact, About
│   ├── detail/         # Detail views / 详情视图
│   ├── effects/        # WebGL, Noise, Tesseract
│   ├── interactive/    # Music player, cursor, lightbox, lever
│   └── shared/         # Reusable components / 通用组件
├── hooks/              # Custom React hooks
├── contexts/           # Global state / 全局状态
├── data/               # All personal content / 所有个人内容
├── content/blog/       # MDX blog posts / MDX 博客文章
├── styles/             # SCSS modules and partials
├── lib/                # Blog utilities / 博客工具
├── server.js           # Custom server (SSE + webhook)
└── deploy.sh           # Auto-deploy script / 自动部署脚本
```

## Deployment / 部署

### Build for Production / 生产构建

```bash
npm run build
npm start
```

### PM2 (Recommended / 推荐)

```bash
pm2 start server.js --name my-portfolio
```

### Environment Variables / 环境变量

| Variable / 变量 | Required / 必需 | Description / 说明 |
|----------|----------|-------------|
| `PORT` | No / 否 | Server port, default 3000 / 服务端口，默认 3000 |
| `WEBHOOK_SECRET` | No / 否 | GitHub webhook secret / GitHub Webhook 密钥 |
| `NEXT_PUBLIC_SITE_URL` | No / 否 | Your site URL for sitemap/RSS / 站点 URL（用于 sitemap/RSS） |

## Design Philosophy / 设计理念

This template was born from a narrative concept: a post-apocalyptic world where an AI assistant (the website itself) serves as the interface through which visitors perceive the world. Every design decision — from the HUD overlay to the power system toggle — reflects this worldbuilding.

这个模板源于一个叙事概念：在一个后末日世界中，AI 助手（即网站本身）作为访客感知世界的界面。从 HUD 覆盖层到电源系统切换，每一个设计决策都映射着这个世界观。

The green highlight color (`--ark-highlight-green`) serves as both the interface accent and a narrative element. You are free to keep this narrative layer, adapt it to your own story, or strip it entirely.

绿色高亮色（`--ark-highlight-green`）既是界面强调色，也是叙事元素。你可以保留这层叙事、改编为你自己的故事，或完全移除只使用视觉框架。

## License / 许可证

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

- **Attribution / 署名** — Credit the original project / 注明原始项目
- **NonCommercial / 非商业** — No commercial use / 禁止商业用途
- **ShareAlike / 相同方式共享** — Derivatives must use the same license / 衍生作品须使用相同许可证

## Acknowledgments / 致谢

Built with inspiration from sci-fi interfaces in film and games. Original design by [RainMorime](https://github.com/RainMorime).

灵感来自影视和游戏中的科幻界面。原始设计：[RainMorime](https://github.com/RainMorime)。
