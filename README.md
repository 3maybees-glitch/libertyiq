# LibertyIQ

A [Next.js](https://nextjs.org) conservative arguments library and quiz app. Browse debate topics, study evidence, test your knowledge, and practice public speaking.

**Live site:** [https://libertyiq.org](https://libertyiq.org)

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

This project deploys automatically to [Vercel](https://vercel.com) when changes are pushed to `main`. The production domain is **[LibertyIQ.org](https://libertyiq.org)** (registered via Namecheap, DNS pointed to Vercel). No environment variables or database setup is required.

**Local development** — clone the repo and run `pnpm install && pnpm dev`. Works fully in [Cursor](https://cursor.com) or any editor.

**CI** — GitHub Actions runs `pnpm lint` and `pnpm build` on every push and pull request to `main`.

## SEO & AEO

- Per-page metadata with Open Graph and Twitter cards
- Dynamic `sitemap.xml` and `robots.txt`
- JSON-LD structured data (Organization, WebSite, FAQ, Article, LearningResource)
- `public/llms.txt` for AI/answer-engine discoverability

## Project Structure

```
app/           # Next.js App Router pages
components/    # UI and feature components
lib/           # Topic data, quiz data, SEO helpers, site config
hooks/         # React hooks (quiz progress)
public/        # Static assets, llms.txt
```

## Built with

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui
- Hosted on Vercel at [LibertyIQ.org](https://libertyiq.org)
