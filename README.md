# LibertyIQ

A [Next.js](https://nextjs.org) conservative arguments library and quiz app. Browse debate topics, study evidence, test your knowledge, and practice public speaking.

## Features

- **Argument library** (`/`) — 11 topics with expandable arguments, evidence, and defense tips
- **Topic pages** (`/topic/[slug]`) — deep dives on each issue
- **Quiz dashboard** (`/libertyiq`) — rank up through Intern Analyst → Senior Fellow → Chief Strategist
- **Quizzes** (`/quiz/[topicId]`) — easy, medium, and hard levels per topic
- **Speaking trainer** (`/speaking-trainer`) — browser-based speech practice with filler-word analysis

Progress is stored locally in your browser (`localStorage`). No backend required.

## Topics

Pro-Life, Illegal Immigration, Second Amendment, Marriage, Two Sexes, Pro-Israel, National Security, Anti-Climate Alarmism, Limited Government, Anti-CRT, and Crime & Justice.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |

## Deployment

Push to `main` on GitHub to trigger automatic deployment via Vercel (connected through v0).

You can also develop entirely in Cursor — no v0 subscription required.

## Project Structure

```
app/           # Next.js App Router pages
components/    # UI and feature components
lib/           # Topic data, quiz data, utilities
hooks/         # React hooks (quiz progress)
public/        # Static assets
```

## Built with

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui
- Originally scaffolded with [v0](https://v0.app)
