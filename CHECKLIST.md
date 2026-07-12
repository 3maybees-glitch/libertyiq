# LibertyIQ — Feature Checklist

Last updated: July 2026

## Core Features

### Content & Data
- [x] TypeScript interfaces for topics, arguments, evidence, and quizzes
- [x] 11 debate topics in `lib/types.ts`
- [x] 11 topic quizzes (easy / medium / hard) in `lib/quiz-data.ts`
- [x] Bibliography references dialog (`components/references-button.tsx`)

### Pages & Routes
- [x] Home page (`/`) — topic selector with argument accordion and defense tips
- [x] Topic detail pages (`/topic/[slug]`) — full topic view with illustrations
- [x] Quiz dashboard (`/libertyiq`) — rank tracking across all topics
- [x] Quiz flow (`/quiz/[topicId]`) — multi-level quizzes with explanations
- [x] Speaking trainer (`/speaking-trainer`) — speech recognition and filler-word analysis

### Progress & Storage
- [x] Quiz progress persisted in `localStorage` via `hooks/use-quiz-progress.ts`
- [x] Rank system: Intern Analyst → Senior Fellow → Chief Strategist
- [x] Hydration-safe client rendering for progress-dependent UI

### Payments (LibertyIQ Core)
- [x] Stripe Checkout for Core monthly ($5.99), yearly ($59), and Lifetime ($129)
- [x] Pricing page (`/pricing`) with Free / Core / Lifetime
- [x] Generous free teaser: library + easy quizzes
- [x] Core gating for medium/hard quizzes and speaking trainer
- [x] Customer Portal for manage/cancel
- [x] Signed entitlement cookie after successful checkout
- [ ] Full user accounts / cross-device sync (future)

### Design & UX
- [x] Patriotic branding with LibertyIQ logo
- [x] Topic illustration banners
- [x] Responsive mobile-first layouts
- [x] Expandable argument cards with typed evidence sections

### Accessibility
- [x] Semantic HTML and ARIA on interactive components
- [x] Keyboard-navigable accordions and quiz options
- [x] No `maximumScale` viewport restriction

### Documentation
- [x] README.md
- [x] QUICKSTART.md
- [x] IMPLEMENTATION.md

## Technical Stack

- [x] Next.js 16 (App Router)
- [x] React 19, TypeScript (strict)
- [x] Tailwind CSS 4, shadcn/ui
- [x] ESLint with `eslint-config-next`
- [x] Vercel Analytics
- [x] GitHub Actions CI (lint + build)

## Deployment

- [ ] Stripe env vars on Vercel for hard unlock + portal (see `docs/GO_LIVE.md`)
- [x] Test-mode Payment Links live on libertyiq.org
- [x] Vercel auto-deploy on push to `main`
- [x] Production build verified

## Known Gaps (not blocking)

- [ ] `/topic/[slug]` pages exist but are not linked from the home UI
- [ ] Quiz level gating (`isLevelUnlocked`) is implemented in the hook but not enforced in the quiz UI
- [ ] Dark mode CSS variables exist; no theme toggle wired up
- [ ] Many unused shadcn/ui components from initial scaffold remain in `components/ui/`
- [ ] `images.unoptimized: true` in `next.config.mjs` — image optimization disabled
- [ ] Pro entitlement is cookie/device–scoped until accounts are added

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Cloud sync for quiz progress
- [ ] Enforce sequential quiz difficulty
- [ ] Link topic detail pages from home
- [ ] Prune unused UI components and dependencies
- [ ] Split monolithic `lib/types.ts` into per-topic modules
- [ ] Auth + cross-device Pro entitlements
- [ ] Live Stripe webhook wiring in production
