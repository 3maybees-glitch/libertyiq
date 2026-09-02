# Quick Start Guide

## Installation

```bash
cd libertyiq
pnpm install
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## First Time Use

1. **Browse Topics** — The home page lets you select from 11 conservative debate topics
2. **Explore Arguments** — Expand any argument to see evidence, outline points, and counterarguments
3. **Test Your Knowledge** — Click "Test Your LibertyIQ" to access quizzes for every topic
4. **Practice Speaking** — Use the Speaking Trainer for filler-word analysis and coaching tips
5. **Track Progress** — Quiz ranks persist in your browser across sessions

## Topics

- Pro-Life Position
- Illegal Immigration
- Second Amendment and Gun Rights
- Marriage: One Man & One Woman
- Two Sexes / Gender Reality
- Pro-Israel
- National Security
- Anti-Climate Alarmism
- Limited Government
- Anti-CRT
- Crime and Justice

## Navigation

| Route | Purpose |
|-------|---------|
| `/` | Argument library with topic selector |
| `/topic/[slug]` | Full topic detail page |
| `/libertyiq` | Quiz dashboard with rank tracking |
| `/quiz/[topicId]` | Take a quiz (easy free; medium/hard need Core) |
| `/speaking-trainer` | Public speaking practice (**Core**) |
| `/committees` | 119th Congress committee roster + issue map |
| `/pricing` | Free / Core / Lifetime checkout |

## Data Storage

All quiz progress is stored locally in `localStorage`. No data is sent to any server. Clearing browser data resets progress.

## Troubleshooting

**Quiz progress not saving?** — Check that you're not in private/incognito mode.

**Speech recognition not working?** — Use Chrome or Edge. You can always paste a transcript manually.

**Page looks different after update?** — Hard refresh (Ctrl+Shift+R) or clear browser cache.
