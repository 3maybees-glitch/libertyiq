#!/usr/bin/env node
/**
 * Generate one-page debate talking-point PDFs for each LibertyIQ issue.
 * Design: vertical debate path with arrows + THEY SAY → YOU SAY counters.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'docs', 'debate-onepagers')
const PUBLIC_DIR = join(ROOT, 'public', 'debate-onepagers')
const HTML_DIR = join(OUT_DIR, 'html')

mkdirSync(HTML_DIR, { recursive: true })
mkdirSync(PUBLIC_DIR, { recursive: true })

/** @typedef {{ they: string, you: string }} Exchange */
/** @typedef {{
 *  id: string, title: string, frame: string, close: string,
 *  path: string[], exchanges: Exchange[], tip?: string
 * }} Sheet */

/** @type {Sheet[]} */
const sheets = [
  {
    id: 'pro-life',
    title: 'Pro-Life',
    frame: 'If the unborn is a human being, then abortion ends an innocent human life — and that life deserves protection.',
    path: [
      'Science: A unique human organism begins at fertilization (distinct DNA, continuous development).',
      'Personhood: Scripture and natural law treat the unborn as known, valued persons (Ps 139; Jer 1:5).',
      'Right to life: Life is the first unalienable right — without it, no other right matters.',
      'Duty to the vulnerable: Just societies protect those who cannot speak for themselves (Prov 31:8–9).',
      'Slippery slope: Once value depends on size, dependency, or “wantedness,” the elderly and disabled are next.',
    ],
    exchanges: [
      {
        they: 'My body, my choice',
        you: 'Two bodies. Pregnancy involves a distinct human with unique DNA. Bodily autonomy does not include a right to end another’s life.',
      },
      {
        they: 'It’s not a person yet',
        you: 'Personhood games have a bloody history. If it’s human and alive, the burden is on you to justify killing it.',
      },
      {
        they: 'What about rape / hard cases?',
        you: 'Acknowledge the trauma. The child is still innocent. Hard cases make bad general policy — and most abortions are not hard cases.',
      },
      {
        they: 'Women will die without access',
        you: 'Treat life-threatening conditions. Pro-life ethic protects mother and child; it rejects elective abortion as healthcare.',
      },
    ],
    tip: 'Lead with compassion, then science. Offer support — don’t only argue.',
  },
  {
    id: 'illegal-immigration',
    title: 'Illegal Immigration',
    frame: 'Compassion and the rule of law are not enemies. Ordered, legal immigration strengthens a nation; lawlessness harms citizens and migrants alike.',
    path: [
      'Rule of law: God-ordained government requires enforceable borders and laws (Rom 13; Acts 17:26).',
      'Stewardship: Nations must prioritize citizens’ welfare, capacity, and security.',
      'Justice: Skipping the line punishes those who wait and sacrifice to come legally.',
      'Security: Open borders empower cartels, trafficking, and unvetted threats.',
      'Assimilation: Manageable legal flows allow newcomers to join one people under shared laws.',
    ],
    exchanges: [
      {
        they: 'Jesus was a refugee',
        you: 'His family fled to Egypt under the laws of that time and returned when safe — not a case for ignoring immigration law.',
      },
      {
        they: 'We’re all immigrants',
        you: 'Most ancestors came under the laws then in force. Lawful heritage doesn’t erase today’s need for borders.',
      },
      {
        they: 'They do jobs Americans won’t',
        you: 'Use legal guest-worker paths. Labor needs don’t require nullifying sovereignty.',
      },
      {
        they: 'Enforcement is cruel',
        you: 'Cruelty is chaos: trafficking, wage suppression, and deaths at the border. Clear laws + dignity in enforcement.',
      },
    ],
    tip: 'Frame: generous legal immigration + real enforcement. Love and law together.',
  },
  {
    id: 'second-amendment',
    title: 'Second Amendment',
    frame: 'The right to keep and bear arms is the right to defend innocent life — against criminals today and tyranny tomorrow.',
    path: [
      'Self-defense: Scripture treats defending family and home as legitimate (Ex 22; Luke 22:36).',
      'Constitution: “The right of the people… shall not be infringed” — Heller affirms an individual right.',
      'Practical: Defensive gun uses vastly outnumber criminal uses; police can’t be everywhere.',
      'History: Major 20th-century democides followed citizen disarmament.',
      'Logic: Criminals ignore gun laws. Control disarms the law-abiding first.',
    ],
    exchanges: [
      {
        they: 'Turn the other cheek',
        you: 'Jesus addressed personal insult, not abandoning the innocent to violence.',
      },
      {
        they: 'Only the military needs guns',
        you: 'The Founders wrote the 2A to secure the people’s right — not a government monopoly on force.',
      },
      {
        they: 'Other countries have fewer shootings',
        you: 'Culture, family breakdown, and mental health drive violence. High-ownership Switzerland/Israel aren’t US-style chaos.',
      },
      {
        they: 'We just want common-sense laws',
        you: 'Define them. Many “common sense” proposals fail criminals while burdening the innocent. Target crime, not rights.',
      },
    ],
    tip: 'Reject the false choice: liberty or safety. Armed citizens are part of safety.',
  },
  {
    id: 'marriage',
    title: 'Marriage: One Man & One Woman',
    frame: 'Marriage is not a private lifestyle label — it is a pre-political institution oriented to man, woman, and children.',
    path: [
      'Creation: Male and female; “one flesh” — affirmed by Jesus (Gen 1–2; Matt 19).',
      'Natural law: Bodies are complementary; only male–female union is procreative by nature.',
      'Children: Kids do best with a mother and a father; fatherlessness is a social crisis.',
      'Liberty: Redefinition has coerced bakers, florists, and adoption agencies.',
      'Meaning: If marriage means anything, it cannot mean everything.',
    ],
    exchanges: [
      {
        they: 'Jesus never mentioned homosexuality',
        you: 'He reaffirmed Genesis male–female marriage (Matt 19 / Mark 10). That settles the design.',
      },
      {
        they: 'Love is love',
        you: 'Love is necessary, not sufficient. The institution exists for a purpose beyond adult feelings.',
      },
      {
        they: 'Same-sex couples can be good parents',
        you: 'Individual cases ≠ the normative ideal. Policy should favor what is best for children as a class.',
      },
      {
        they: 'This is just Old Testament law',
        you: 'Jesus and the New Testament reaffirm the creation pattern — not a temporary civil code.',
      },
    ],
    tip: 'Speak of design and children first; avoid contempt. Clarity ≠ cruelty.',
  },
  {
    id: 'two-sexes',
    title: 'Two Biological Sexes',
    frame: 'Sex is binary, binary is biological, and telling the truth is the only compassionate path — especially for children.',
    path: [
      'Creation: “Male and female He created them” — intentional, good, binary (Gen 1:27).',
      'Biology: XX/XY in every cell; hormones and surgery cannot change sex.',
      'Kids: Most dysphoric children desist if not socially transitioned; blockers are not “neutral.”',
      'Truth: Affirming a falsehood is not love (cf. anorexia). Reality is not hate.',
      'Conscience: Compelled pronouns and speech are forced falsehood — resist (Acts 5:29).',
    ],
    exchanges: [
      {
        they: 'Affirmation prevents suicide',
        you: 'Swedish long-term data: post-transition suicide risk remained extremely elevated. Transition ≠ cure.',
      },
      {
        they: 'Intersex proves a spectrum',
        you: 'DSDs are rare disorders of a binary system — they don’t erase male and female.',
      },
      {
        they: 'This is a civil-rights issue',
        you: 'Race is irrelevant to sexed spaces. Sex is real and often decisive (sports, prisons, shelters).',
      },
      {
        they: 'Gender is a social construct',
        you: 'Sex is binary and universal. “Gender identity” detached from sex is ideology, not discovery.',
      },
    ],
    tip: 'Separate adults’ distress from medicalizing kids. Protect women and girls’ spaces.',
  },
  {
    id: 'pro-israel',
    title: 'Pro-Israel',
    frame: 'Support for Israel rests on covenant, history, morality, and strategy — not sentimentality.',
    path: [
      'Covenant: God’s promises to Abraham and Israel are enduring (Gen 12; Rom 11:29).',
      'History/law: Continuous Jewish presence; modern Israel’s legal founding and defensive wars.',
      'Morality: Israel is a democracy amid authoritarian neighbors — imperfect, but exceptional.',
      'Alliance: Shared values, intel/military cooperation, common threats (Iran, terror networks).',
      'Prophecy/hope: Restoration themes in Scripture align with Israel’s improbable survival.',
    ],
    exchanges: [
      {
        they: 'Israel is a colonial project',
        you: 'Jews are indigenous to the land with continuous presence. Modern return followed legal mandates and defensive survival.',
      },
      {
        they: 'Occupation causes the conflict',
        you: 'Rejectionism predates 1967. Multiple land-for-peace offers were refused; terror remains the strategy.',
      },
      {
        they: 'Criticizing Israel isn’t antisemitism',
        you: 'Fair critique exists. Demonization, double standards, and denying Jewish self-determination often are.',
      },
      {
        they: 'Christians should be neutral',
        you: 'Blessing Israel (Gen 12:3) and defending a free ally against jihadist enemies is moral clarity, not neutrality.',
      },
    ],
    tip: 'Distinguish Palestinian civilians from Hamas. Condemn terror without apology.',
  },
  {
    id: 'national-security',
    title: 'Strong National Security',
    frame: 'Peace through strength: government’s first duty is to protect the innocent from real enemies.',
    path: [
      'Mandate: Romans 13 — the state bears the sword to restrain evil.',
      'Deterrence: Weakness invites aggression (China, Russia, Iran, NK, jihadist networks).',
      'Civilization: America uniquely underwrites liberty, trade, and religious freedom abroad.',
      'Preparedness: Superior military, intel, alliances, energy, and borders — not slogans.',
      'Ideology: Tyranny is a belief system. Soft power without hard power is begging.',
    ],
    exchanges: [
      {
        they: 'Military spending steals from the poor',
        you: 'Dead citizens can’t be helped. Security enables prosperity — and America’s aid. Both/and (Neh 4).',
      },
      {
        they: 'Focus only on domestic issues',
        you: 'False choice. 9/11 proved distant threats become local catastrophes. Prevention beats aftermath.',
      },
      {
        they: 'Diplomacy, not strength',
        you: 'Diplomacy without power is pleading. “Speak softly and carry a big stick.”',
      },
      {
        they: 'Christians should be pacifists',
        you: 'Personal forgiveness ≠ national abdication. Just war tradition: defending the innocent can be righteous.',
      },
    ],
    tip: 'Pray and prepare. Trust God — still ready the horse for battle (Prov 21:31).',
  },
  {
    id: 'anti-climate-alarmism',
    title: 'Anti-Climate Alarmism',
    frame: 'Steward creation wisely — reject apocalyptic politics that impoverish people in the name of “settled science.”',
    path: [
      'Stewardship: Dominion + care (Gen 1:28; 2:15) — develop resources; don’t bury talents.',
      'Skepticism: Decades of failed catastrophes; models overpredict; natural variability matters.',
      'Flourishing: Abundant energy lifted billions from poverty — that is love of neighbor.',
      'Solutions: Dense, reliable power (nuclear + hydrocarbons) beats intermittent virtue signaling.',
      'Narrative check: Apocalypse, guilt, indulgences, and elite hypocrisy look like a religion.',
    ],
    exchanges: [
      {
        they: '97% of scientists agree',
        you: 'The slogan overstates consensus on catastrophe. Debate magnitude, causes, and policies — not whether climate exists.',
      },
      {
        they: 'Extreme weather is worse',
        you: 'Normalized data often shows no clear upward trend in hurricanes/tornadoes/droughts. Media ≠ metrics.',
      },
      {
        they: 'Sea levels are rising dangerously',
        you: 'Long-term rise is slow (~mm/year). Adaptation has worked for a century; panic policies still fail the poor.',
      },
      {
        they: 'Leave fossil fuels in the ground',
        you: 'That consigns the developing world to poverty. No scalable replacement yet — harming the poor is not stewardship.',
      },
    ],
    tip: 'Grant modest warming; contest catastrophe + central-planning “solutions.”',
  },
  {
    id: 'limited-government',
    title: 'Limited Government',
    frame: 'Government is a necessary servant and a dangerous master. Liberty, property, and thrift beat bureaucratic control.',
    path: [
      'Warning: 1 Samuel 8 — centralized power taxes, conscripts, and takes.',
      'Economics: Property, work, and free exchange create wealth (Ex 20:15; Prov).',
      'Liberty: Free will implies government protects rights — it doesn’t micromanage souls.',
      'Incentives: Bureaucracy wastes; markets discover knowledge government can’t.',
      'Debt: Borrowing against children is generational theft (Prov 22:7; 13:22).',
    ],
    exchanges: [
      {
        they: 'Government provides necessary services',
        you: 'Yes — core ones: defense, courts, policing (Rom 13). Most else is better private or local.',
      },
      {
        they: 'Without regulation, exploitation',
        you: 'Fraud and force are already illegal. Competition and reputation discipline better than endless rules.',
      },
      {
        they: 'We need safety nets',
        you: 'Charity and family first. Government monopolies often trap poverty; civil society humanizes help.',
      },
      {
        they: 'The rich don’t pay their share',
        you: 'The top earners already fund most income taxes. “Fair share” often means “higher share.”',
      },
    ],
    tip: 'Argue competence + morality: limited government is how free people flourish.',
  },
  {
    id: 'anti-crt',
    title: 'Anti-Critical Race Theory',
    frame: 'Judge by character, not color. CRT re-racializes America and contradicts the Gospel and the Civil Rights ideal.',
    path: [
      'Imago Dei: One race — human. Equal dignity, equal fallenness, equal need of grace.',
      'Logic: CRT judges by ancestry, is unfalsifiable, and mirrors the racism it claims to fight.',
      'History: America’s sins are real — and so is massive moral progress. 1619 myth ≠ full story.',
      'Harm: Kids taught oppressor/oppressed scripts; division grows; merit dies.',
      'Gospel alternative: Reconciliation in Christ — repent real sin; reject racial essentialism.',
    ],
    exchanges: [
      {
        they: 'You just hate talking about race',
        you: 'Honest history ≠ CRT ideology. Oppose racism and racial Marxism.',
      },
      {
        they: 'You deny racism exists',
        you: 'Racism is sin. CRT’s cure (more race obsession) worsens the disease.',
      },
      {
        they: 'CRT is just accurate history',
        you: 'Teaching slavery and Jim Crow ≠ CRT. CRT is a worldview of systemic racial determinism.',
      },
      {
        they: 'Opposing CRT = supporting racism',
        you: 'False dichotomy. Sowell, McWhorter, Elder — and MLK’s dream — reject both.',
      },
    ],
    tip: 'Quote MLK. Demand color-blind equality under law — not equity of outcomes by race.',
  },
  {
    id: 'crime-and-justice',
    title: 'Crime & Justice',
    frame: 'Government’s job is to punish evil and protect the innocent. Soft-on-crime politics abandons victims.',
    path: [
      'Mandate: Romans 13 — bear the sword against wrongdoers.',
      'Safety: Catch-and-release and soft charging correlate with rising violence.',
      'Rule of law: Sanctuary nullification destroys equal justice and deterrence.',
      'Borders: Sovereignty includes keeping violent criminal aliens out — and removing them.',
      'Victims first: Speak for those who can’t (Prov 31). Name the forgotten dead.',
    ],
    exchanges: [
      {
        they: 'No human is illegal',
        you: 'People aren’t illegal; illegal entry and overstay are. Words describe actions.',
      },
      {
        they: 'Most aren’t violent',
        you: 'Then deport the violent subset without apology. Even small percentages are many victims.',
      },
      {
        they: 'Deportation is cruel',
        you: 'Cruelty is releasing predators onto Kate Steinle’s neighbors. Justice is not optional.',
      },
      {
        they: 'The system is broken',
        you: 'Reform laws — don’t ignore them. Chaos isn’t compassion.',
      },
    ],
    tip: 'Put victims’ names at the center. Deterrence is love for the next potential victim.',
  },
]

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderSheet(sheet, index, total) {
  const pathHtml = sheet.path
    .map((p, i) => {
      const arrow =
        i < sheet.path.length - 1
          ? `<div class="v-arrow" aria-hidden="true">↓</div>`
          : ''
      return `<div class="step"><span class="num">${i + 1}</span><p>${esc(p)}</p></div>${arrow}`
    })
    .join('\n')

  const exchangesHtml = sheet.exchanges
    .map(
      (e) => `
      <div class="exchange">
        <div class="they"><span class="label">They say</span><p>“${esc(e.they)}”</p></div>
        <div class="h-arrow" aria-hidden="true">→</div>
        <div class="you"><span class="label">You say</span><p>${esc(e.you)}</p></div>
      </div>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(sheet.title)} — Debate One-Pager | LibertyIQ</title>
<style>
  @page { size: letter portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 8.5in;
    height: 11in;
    font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
    color: #1a2332;
    background: #f7f3ea;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 8.5in;
    height: 11in;
    padding: 0.42in 0.48in 0.38in;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(120% 80% at 100% 0%, rgba(184, 138, 58, 0.14), transparent 55%),
      radial-gradient(90% 70% at 0% 100%, rgba(26, 58, 92, 0.10), transparent 50%),
      linear-gradient(180deg, #fbf8f1 0%, #f3eee3 100%);
  }
  .page::before {
    content: "";
    position: absolute;
    inset: 0.22in;
    border: 1.5px solid rgba(26, 58, 92, 0.22);
    pointer-events: none;
  }
  .page::after {
    content: "";
    position: absolute;
    inset: 0.28in;
    border: 0.5px solid rgba(184, 138, 58, 0.35);
    pointer-events: none;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 0.3in;
    margin-bottom: 0.16in;
    padding-bottom: 0.1in;
    border-bottom: 2px solid #1a3a5c;
    position: relative;
    z-index: 1;
  }
  .brand {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #b88a3a;
    font-weight: 700;
  }
  h1 {
    font-size: 26px;
    line-height: 1.05;
    color: #1a3a5c;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .meta {
    text-align: right;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 9px;
    color: #5a6570;
    line-height: 1.35;
  }
  .frame {
    margin: 0.12in 0 0.14in;
    padding: 0.1in 0.14in;
    background: #1a3a5c;
    color: #f7f3ea;
    position: relative;
    z-index: 1;
  }
  .frame .tag {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 8px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #e2c27a;
    display: block;
    margin-bottom: 0.04in;
  }
  .frame p {
    font-size: 12px;
    line-height: 1.35;
  }
  .grid {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 0.18in;
    position: relative;
    z-index: 1;
  }
  .col h2 {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b88a3a;
    margin-bottom: 0.08in;
    display: flex;
    align-items: center;
    gap: 0.08in;
  }
  .col h2 .bar {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #b88a3a, transparent);
  }
  .path {
    display: flex;
    flex-direction: column;
  }
  .step {
    display: flex;
    gap: 0.08in;
    align-items: flex-start;
    background: rgba(255,255,255,0.55);
    border-left: 3px solid #1a3a5c;
    padding: 0.07in 0.09in;
  }
  .num {
    flex: 0 0 0.22in;
    width: 0.22in;
    height: 0.22in;
    border-radius: 50%;
    background: #1a3a5c;
    color: #f7f3ea;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.01in;
  }
  .step p {
    font-size: 10.5px;
    line-height: 1.28;
  }
  .v-arrow {
    text-align: center;
    color: #b88a3a;
    font-size: 14px;
    line-height: 1;
    padding: 0.02in 0;
    font-weight: 700;
  }
  .exchanges {
    display: flex;
    flex-direction: column;
    gap: 0.08in;
  }
  .exchange {
    display: grid;
    grid-template-columns: 1fr 0.28in 1.15fr;
    align-items: stretch;
    gap: 0.04in;
  }
  .they, .you {
    padding: 0.07in 0.08in;
    min-height: 0.62in;
  }
  .they {
    background: rgba(140, 48, 48, 0.08);
    border: 1px solid rgba(140, 48, 48, 0.25);
  }
  .you {
    background: rgba(26, 90, 58, 0.08);
    border: 1px solid rgba(26, 90, 58, 0.28);
  }
  .label {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 7.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    display: block;
    margin-bottom: 0.03in;
  }
  .they .label { color: #8c3030; }
  .you .label { color: #1a5a3a; }
  .they p, .you p {
    font-size: 9.5px;
    line-height: 1.28;
  }
  .h-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b88a3a;
    font-size: 18px;
    font-weight: 700;
  }
  .close {
    margin-top: 0.14in;
    padding: 0.1in 0.12in;
    border: 1.5px solid #b88a3a;
    background: rgba(184, 138, 58, 0.10);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.12in;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .close .arrow-badge {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #1a3a5c;
    font-weight: 800;
    white-space: nowrap;
  }
  .close .arrow-badge span {
    display: inline-block;
    margin-left: 0.06in;
    color: #b88a3a;
  }
  .close p {
    font-size: 11px;
    line-height: 1.3;
    color: #1a3a5c;
  }
  footer {
    position: absolute;
    left: 0.48in;
    right: 0.48in;
    bottom: 0.32in;
    display: flex;
    justify-content: space-between;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 8px;
    color: #6a7380;
    z-index: 1;
    border-top: 1px solid rgba(26,58,92,0.18);
    padding-top: 0.06in;
  }
</style>
</head>
<body>
  <div class="page">
    <header>
      <div>
        <div class="brand">LibertyIQ · Debate Card</div>
        <h1>${esc(sheet.title)}</h1>
      </div>
      <div class="meta">
        One-page talking points<br />
        Issue ${index + 1} of ${total}<br />
        libertyiq.org
      </div>
    </header>

    <section class="frame">
      <span class="tag">Opening frame → start here</span>
      <p>${esc(sheet.frame)}</p>
    </section>

    <div class="grid">
      <section class="col">
        <h2>Debate path <span class="bar"></span></h2>
        <div class="path">
          ${pathHtml}
        </div>
      </section>
      <section class="col">
        <h2>Counters <span class="bar"></span></h2>
        <div class="exchanges">
          ${exchangesHtml}
        </div>
      </section>
    </div>

    <section class="close">
      <div class="arrow-badge">Close → <span>⟶</span></div>
      <p>${esc(sheet.close || sheet.tip || sheet.frame)}</p>
    </section>

    <footer>
      <span>Use the left column to lead; answer objections on the right.</span>
      <span>© LibertyIQ · For study &amp; debate practice</span>
    </footer>
  </div>
</body>
</html>`
}

function chromeBin() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return 'google-chrome'
}

function htmlToPdf(htmlPath, pdfPath) {
  const chrome = chromeBin()
  const userDataDir = `/tmp/chrome-pdf-${process.pid}-${Date.now()}`
  mkdirSync(userDataDir, { recursive: true })
  const result = spawnSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--allow-file-access-from-files',
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      `--print-to-pdf=${pdfPath}`,
      '--no-pdf-header-footer',
      `file://${htmlPath}`,
    ],
    { encoding: 'utf8', timeout: 90000 }
  )
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout)
    throw new Error(`Chrome failed for ${pdfPath} (status ${result.status})`)
  }
  if (!existsSync(pdfPath)) {
    throw new Error(`PDF not written: ${pdfPath}`)
  }
}

// Fill close lines
for (const s of sheets) {
  if (!s.close) s.close = s.tip || 'Return to the opening frame and force the moral choice.'
}

const indexLines = [
  '# LibertyIQ Debate One-Pagers',
  '',
  'One printable page per issue: debate path (↓) plus THEY SAY → YOU SAY counters.',
  '',
  '| Issue | PDF |',
  '| --- | --- |',
]

const only = process.env.ONLY ? new Set(process.env.ONLY.split(',').map((s) => s.trim())) : null
const skipExisting = process.env.SKIP_EXISTING === '1'

console.log(`Generating ${sheets.length} debate one-pagers…`)

for (let i = 0; i < sheets.length; i++) {
  const sheet = sheets[i]
  if (only && !only.has(sheet.id) && !only.has(String(i + 1))) continue

  const html = renderSheet(sheet, i, sheets.length)
  const base = `${String(i + 1).padStart(2, '0')}-${sheet.id}`
  const htmlPath = join(HTML_DIR, `${base}.html`)
  const pdfName = `${base}.pdf`
  const pdfPath = join(OUT_DIR, pdfName)
  const publicPdf = join(PUBLIC_DIR, pdfName)

  writeFileSync(htmlPath, html)
  indexLines.push(`| ${sheet.title} | [${pdfName}](./${pdfName}) |`)

  if (process.env.HTML_ONLY === '1') {
    console.log('html', pdfName)
    continue
  }
  if (skipExisting && existsSync(pdfPath)) {
    writeFileSync(publicPdf, readFileSync(pdfPath))
    console.log('skip', pdfName)
    continue
  }
  htmlToPdf(htmlPath, pdfPath)
  writeFileSync(publicPdf, readFileSync(pdfPath))
  console.log('✓', pdfName)
}

indexLines.push(
  '',
  '## How to use',
  '',
  '1. Open with the **Opening frame**.',
  '2. Walk the numbered **Debate path** top → bottom (follow the ↓ arrows).',
  '3. When interrupted, jump to the matching **They say → You say** counter.',
  '4. Finish on the **Close →** line.',
  '',
  'HTML sources (for redesign) live in `html/`.',
  ''
)

writeFileSync(join(OUT_DIR, 'README.md'), indexLines.join('\n'))
console.log('\nDone →', OUT_DIR)
