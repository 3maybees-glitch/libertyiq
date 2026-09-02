# Congressional committee roster

Living reference inside LibertyIQ — not a third public site. CCCP should consume this data, not host the directory.

## URLs

| View | Path |
|------|------|
| Directory (search + three views) | `/committees` |
| By committee | `/committees/c/{thomasId}` — e.g. `/committees/c/HSJU` |
| By member | `/committees/m/{bioguide}` — e.g. `/committees/m/C001098` |
| By LibertyIQ issue | `/committees?view=issue&issue=pro-life` |

Thomas IDs and bioguide IDs match [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators).

## CCCP

Reuse the same member IDs. On a race or member card, show a one-line field and link back:

`Committees: Judiciary; Armed Services` → `https://libertyiq.org/committees/m/{bioguide}`

Machine-readable feed (no scrape on page view):

`https://libertyiq.org/data/committees.json`

Each member includes `bioguide`, `committees[]` (`id`, `name`, `title`, `href`), and `href` back to LibertyIQ.

Do not put the full directory on CCCP. That is electoral terrain; this is institutional power.

## Refresh

```bash
pnpm committees:refresh
pnpm committees:validate
```

Pulls current `committees-current`, `committee-membership-current`, and `legislators-current` from the congress-legislators GitHub Pages JSON. Writes:

- `data/congress-119.json` — compact roster used by the app
- `data/gavel.json` — LibertyIQ topic → chairs
- `lib/committees/drills.json` — speaking-trainer prompts
- `public/data/committees.json` — CCCP feed

Refresh weekly during session; daily in January of a new Congress and after a vacancy. v1 is the 119th Congress only.

Issue-to-committee mapping lives in `lib/committees/issue-map.json`. Nicknames (`HELP`, `HPSCI`, `Ways and Means`) live in `lib/committees/nicknames.json`.

## Scope

Roster + jurisdiction + LibertyIQ topic map. Not hearings, C-SPAN video, or vote scores.
