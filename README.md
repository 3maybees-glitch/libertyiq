# LibertyIQ

A [Next.js](https://nextjs.org) conservative worldviews library and quiz app. Browse debate topics, study evidence, test your knowledge, and practice public speaking.

**Live site:** [https://libertyiq.org](https://libertyiq.org)

## Features

- **Argument library** (`/`) — 14 topics with expandable arguments, evidence, and defense tips
- **Topic pages** (`/topic/[slug]`) — deep dives on each issue
- **Quiz dashboard** (`/libertyiq`) — rank up through Intern Analyst → Senior Fellow → Chief Strategist
- **Quizzes** (`/quiz/[topicId]`) — easy, medium, and hard levels per topic
- **Speaking trainer** (`/speaking-trainer`) — browser-based speech practice with filler-word analysis
- **Installable PWA** — Add to Home Screen; library and quizzes cache for offline use after first visit

Progress is stored locally in your browser (`localStorage`). LibertyIQ Pro (quizzes + speaking trainer) uses Stripe Checkout.

## Paid features (LibertyIQ Core)

| Free | Core ($5.99/mo or $59/yr) | Lifetime ($129 early-bird) |
|------|---------------------------|----------------------------|
| Library + easy quizzes | Medium/hard, ranks, speaking trainer | Everything in Core, pay once |

See [docs/GO_LIVE.md](docs/GO_LIVE.md) for the production checklist and [docs/STRIPE.md](docs/STRIPE.md) for Stripe setup.

## Topics

Pro-Life, Illegal Immigration, Second Amendment, Marriage, Two Sexes, Pro-Israel, National Security, Anti-Climate Alarmism, Limited Government, Anti-CRT, Crime & Justice, Role of the Military, Against Universal Government Healthcare, and AI Governance.

## Debate one-pagers

Printable one-page talking-point PDFs for each issue (debate path ↓ plus They say → You say counters) live in [`docs/debate-onepagers/`](docs/debate-onepagers/). Regenerate with `pnpm debate-onepagers`.

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
| `pnpm build` | Production build (webpack + Serwist service worker) |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |

## Deployment

This project deploys automatically to [Vercel](https://vercel.com) when changes are pushed to `main`.

For the free library only, no environment variables are required. For LibertyIQ Pro checkout, configure the Stripe variables listed in `.env.example` and [docs/STRIPE.md](docs/STRIPE.md).

**Local development** — clone the repo and run `pnpm install && pnpm dev`. Works fully in [Cursor](https://cursor.com) or any editor.

**CI** — GitHub Actions runs `pnpm lint` and `pnpm build` on every push and pull request to `main`.

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
