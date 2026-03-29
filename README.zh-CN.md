[English](./README.md) | **中文**

# RAINMORIME — HUD 个人作品集模板

一款后末日科幻 HUD 风格的个人作品集 + 博客模板，基于 **Next.js 14**、**TypeScript** 和 **SCSS** 构建。包含 42 个手工 CSS 动画、叙事驱动的设计系统和内置 MDX 博客。

> **[在线演示 →](https://rainmorime.com)**

<!-- 替换为你部署后的截图或 GIF -->
<!-- ![截图](./screenshot.png) -->

## 功能特性

- **科幻 HUD 美学** — 扫描线、心电图波形、雷达扫描、聚焦框，每一个交互都有独特的动画反馈
- **42 个自定义 CSS 动画** — 全部使用 `@keyframes` 手写，核心动效零外部依赖
- **电源系统** — 切换"负色"模式，改变全站配色方案
- **打字机效果** — 模拟 AI 逐字斟酌的文字输出节奏
- **五列导航** — 每列拥有独特的悬停动画（任务列表、塔状生长、心电图、雷达、聚焦框）
- **WebGL 背景** — 动态雨粒子特效（延迟加载）
- **MDX 博客** — Markdown 写作，自动生成阅读时长、标签和 RSS 订阅
- **SSE 实时统计** — 实时访客数和运行时间，零外部依赖（无 Socket.IO）
- **音乐播放器** — 黑胶唱片 UI，拖拽切歌交互
- **自动部署** — GitHub Webhook 集成，零停机构建切换
- **完全响应式** — 移动端适配动画与触摸交互

## 技术栈

| 类别 | 工具 |
|------|------|
| 框架 | Next.js 14 (Pages Router) |
| 语言 | TypeScript |
| 样式 | SCSS Modules + CSS 自定义属性 |
| 动画 | CSS @keyframes、Framer Motion、GSAP |
| 3D | Three.js + React Three Fiber（延迟加载）|
| 博客 | MDX via next-mdx-remote |
| 服务器 | 自定义 Node.js 服务器 + SSE |
| 部署 | PM2 + GitHub Webhooks |

## 快速开始

```bash
git clone https://github.com/your-username/rainmorime-template.git
cd rainmorime-template
npm install
cp .env.example .env.local
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看你的网站。

## 自定义

### 1. 个人数据

所有个人内容都在 `data/` 目录中：

| 文件 | 修改内容 |
|------|---------|
| `data/projects.ts` | 你的项目和作品 |
| `data/life.ts` | 游戏、旅行、爱好 |
| `data/experience.ts` | 教育与工作经历 |
| `data/friendLinks.ts` | 友情链接 |
| `data/skills.ts` | 技能树 |

### 2. 联系方式与关于

- `components/sections/ContactSection.tsx` — 邮箱、GitHub、社交链接
- `components/sections/AboutSection.tsx` — 页脚信息、许可证
- `public/avatar.svg` — 你的头像图片（替换默认占位图）

### 3. 博客文章

在 `content/blog/` 中创建 `.mdx` 文件：

```markdown
---
title: "我的第一篇文章"
date: "2025-01-01"
excerpt: "一段简短的描述。"
tags: ["hello", "world"]
---

在这里用 Markdown 写你的内容。
```

### 4. 音乐播放器

编辑 `components/interactive/MusicPlayer.tsx` 中的 `playlist` 数组。将音频文件放在 `public/music/` 目录中。

### 5. 图片

模板使用 [placehold.co](https://placehold.co) 的占位图片。将数据文件中的图片 URL 替换为你自己托管的图片。如果使用带图片处理的 CDN（如 Cloudinary 或腾讯云 COS），可以自定义 `components/shared/LazyImage.tsx` 中的 `getProcessedImageUrl` 函数。

### 6. 配色

主色调由 `styles/globals.scss` 中的 `--ark-highlight-green` 控制。负色（关电源）模式使用粉色调——均可通过 CSS 变量自定义。

## 项目结构

```
├── pages/              # Next.js 文件路由
├── components/
│   ├── layout/         # 主布局、导航列、HUD、左面板
│   ├── sections/       # Works、Experience、Life、Contact、About
│   ├── detail/         # 作品详情视图
│   ├── effects/        # WebGL 背景、噪点、超正方体
│   ├── interactive/    # 音乐播放器、光标、灯箱、拉杆
│   └── shared/         # 通用组件（时间线、懒加载图片等）
├── hooks/              # 自定义 React Hooks
├── contexts/           # 全局状态
├── data/               # 所有个人内容（修改这里！）
├── content/blog/       # MDX 博客文章
├── styles/             # SCSS 模块和分片
├── lib/                # 博客工具函数
├── server.js           # 自定义服务器（SSE 统计 + 部署 Webhook）
└── deploy.sh           # 自动部署脚本
```

## 部署

### 生产构建

```bash
npm run build
npm start
```

### PM2（推荐）

```bash
pm2 start server.js --name my-portfolio
```

### 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `PORT` | 否 | 服务端口（默认 3000）|
| `WEBHOOK_SECRET` | 否 | GitHub Webhook 密钥（用于自动部署）|
| `NEXT_PUBLIC_SITE_URL` | 否 | 你的站点 URL（用于 sitemap/RSS）|

## 设计理念

这个模板源于一个叙事概念：在一个后末日世界中，AI 助手（即网站本身）作为访客感知世界的界面。从 HUD 覆盖层到电源系统切换，每一个设计决策都映射着这个世界观。

绿色高亮色（`--ark-highlight-green`）既是界面强调色，也是叙事元素。你可以保留这层叙事、将它改编为你自己的故事，或完全移除，只使用纯视觉框架。

## 许可证

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证。

- **署名** — 请注明原始项目
- **非商业** — 禁止商业用途
- **相同方式共享** — 衍生作品须使用相同许可证

## 致谢

灵感来自影视和游戏中的科幻界面。原始设计：[RainMorime](https://github.com/RainMorime)。
