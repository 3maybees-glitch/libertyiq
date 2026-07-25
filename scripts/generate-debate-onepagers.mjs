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
/** @typedef {{ letter: string, label: string, text: string }} PathPoint */
/** @typedef {{
 *  id: string, title: string, frame: string, close: string,
 *  acronym: string, acronymHint: string,
 *  path: PathPoint[], exchanges: Exchange[], tip?: string
 * }} Sheet */

/** @type {Sheet[]} */
const sheets = [
  {
    id: 'pro-life',
    title: 'Pro-Life',
    acronym: 'ALIVE',
    acronymHint: 'At fertilization · Life = person · Inalienable right · Vulnerable · Expansion risk',
    frame: 'If the unborn is a human being, then abortion ends an innocent human life — and that life deserves protection.',
    path: [
      { letter: 'A', label: 'At fertilization', text: 'Science: a unique human organism begins at fertilization (distinct DNA, continuous development).' },
      { letter: 'L', label: 'Life = person', text: 'Personhood: Scripture and natural law treat the unborn as known, valued persons (Ps 139; Jer 1:5).' },
      { letter: 'I', label: 'Inalienable right', text: 'Right to life is first — without it, no other right matters.' },
      { letter: 'V', label: 'Vulnerable', text: 'Just societies protect those who cannot speak for themselves (Prov 31:8–9).' },
      { letter: 'E', label: 'Expansion risk', text: 'Once value depends on size, dependency, or “wantedness,” the elderly and disabled are next.' },
    ],
    exchanges: [
      { they: 'My body, my choice', you: 'Two bodies. Pregnancy involves a distinct human with unique DNA. Bodily autonomy does not include a right to end another’s life.' },
      { they: 'It’s not a person yet', you: 'Personhood games have a bloody history. If it’s human and alive, the burden is on you to justify killing it.' },
      { they: 'What about rape / hard cases?', you: 'Acknowledge the trauma. The child is still innocent. Hard cases make bad general policy — and most abortions are not hard cases.' },
      { they: 'Women will die without access', you: 'Treat life-threatening conditions. Pro-life ethic protects mother and child; it rejects elective abortion as healthcare.' },
    ],
    tip: 'Lead with compassion, then science. Offer support — don’t only argue. Memory hook: ALIVE.',
  },
  {
    id: 'illegal-immigration',
    title: 'Illegal Immigration',
    acronym: 'BOLTS',
    acronymHint: 'Borders & law · Obligation to citizens · Legal immigrants first · Threats stopped · Shared culture',
    frame: 'Compassion and the rule of law are not enemies. Ordered, legal immigration strengthens a nation; lawlessness harms citizens and migrants alike.',
    path: [
      { letter: 'B', label: 'Borders & law', text: 'God-ordained government requires enforceable borders and laws (Rom 13; Acts 17:26).' },
      { letter: 'O', label: 'Obligation to citizens', text: 'Stewardship: nations must prioritize citizens’ welfare, capacity, and security.' },
      { letter: 'L', label: 'Legal immigrants first', text: 'Justice: skipping the line punishes those who wait and sacrifice to come legally.' },
      { letter: 'T', label: 'Threats stopped', text: 'Security: open borders empower cartels, trafficking, and unvetted threats.' },
      { letter: 'S', label: 'Shared culture', text: 'Assimilation: manageable legal flows let newcomers join one people under shared laws.' },
    ],
    exchanges: [
      { they: 'Jesus was a refugee', you: 'His family fled to Egypt under the laws of that time and returned when safe — not a case for ignoring immigration law.' },
      { they: 'We’re all immigrants', you: 'Most ancestors came under the laws then in force. Lawful heritage doesn’t erase today’s need for borders.' },
      { they: 'They do jobs Americans won’t', you: 'Use legal guest-worker paths. Labor needs don’t require nullifying sovereignty.' },
      { they: 'Enforcement is cruel', you: 'Cruelty is chaos: trafficking, wage suppression, and deaths at the border. Clear laws + dignity in enforcement.' },
    ],
    tip: 'Frame: generous legal immigration + real enforcement. Memory hook: BOLTS.',
  },
  {
    id: 'second-amendment',
    title: 'Second Amendment',
    acronym: 'ARMED',
    acronymHint: 'Authority to defend · Right in Constitution · Millions of defensive uses · Evil of disarmament · Disarmament fails',
    frame: 'The right to keep and bear arms is the right to defend innocent life — against criminals today and tyranny tomorrow.',
    path: [
      { letter: 'A', label: 'Authority to defend', text: 'Scripture treats defending family and home as legitimate (Ex 22; Luke 22:36).' },
      { letter: 'R', label: 'Right in Constitution', text: '“The right of the people… shall not be infringed” — Heller affirms an individual right.' },
      { letter: 'M', label: 'Millions of DGU', text: 'Practical: defensive gun uses vastly outnumber criminal uses; police can’t be everywhere.' },
      { letter: 'E', label: 'Evil of disarmament', text: 'History: major 20th-century democides followed citizen disarmament.' },
      { letter: 'D', label: 'Disarmament fails', text: 'Logic: criminals ignore gun laws. Control disarms the law-abiding first.' },
    ],
    exchanges: [
      { they: 'Turn the other cheek', you: 'Jesus addressed personal insult, not abandoning the innocent to violence.' },
      { they: 'Only the military needs guns', you: 'The Founders wrote the 2A to secure the people’s right — not a government monopoly on force.' },
      { they: 'Other countries have fewer shootings', you: 'Culture, family breakdown, and mental health drive violence. High-ownership Switzerland/Israel aren’t US-style chaos.' },
      { they: 'We just want common-sense laws', you: 'Define them. Many “common sense” proposals fail criminals while burdening the innocent. Target crime, not rights.' },
    ],
    tip: 'Reject liberty vs. safety. Armed citizens are part of safety. Memory hook: ARMED.',
  },
  {
    id: 'marriage',
    title: 'Marriage: One Man & One Woman',
    acronym: 'CREED',
    acronymHint: 'Creation design · Reason / natural law · Elevate children · Expression liberty · Definition matters',
    frame: 'Marriage is not a private lifestyle label — it is a pre-political institution oriented to man, woman, and children.',
    path: [
      { letter: 'C', label: 'Creation design', text: 'Male and female; “one flesh” — affirmed by Jesus (Gen 1–2; Matt 19).' },
      { letter: 'R', label: 'Reason / natural law', text: 'Bodies are complementary; only male–female union is procreative by nature.' },
      { letter: 'E', label: 'Elevate children', text: 'Kids do best with a mother and a father; fatherlessness is a social crisis.' },
      { letter: 'E', label: 'Expression liberty', text: 'Redefinition has coerced bakers, florists, and adoption agencies.' },
      { letter: 'D', label: 'Definition matters', text: 'If marriage means anything, it cannot mean everything.' },
    ],
    exchanges: [
      { they: 'Jesus never mentioned homosexuality', you: 'He reaffirmed Genesis male–female marriage (Matt 19 / Mark 10). That settles the design.' },
      { they: 'Love is love', you: 'Love is necessary, not sufficient. The institution exists for a purpose beyond adult feelings.' },
      { they: 'Same-sex couples can be good parents', you: 'Individual cases ≠ the normative ideal. Policy should favor what is best for children as a class.' },
      { they: 'This is just Old Testament law', you: 'Jesus and the New Testament reaffirm the creation pattern — not a temporary civil code.' },
    ],
    tip: 'Speak of design and children first. Clarity ≠ cruelty. Memory hook: CREED.',
  },
  {
    id: 'two-sexes',
    title: 'Two Biological Sexes',
    acronym: 'FACTS',
    acronymHint: 'Formed male/female · Anatomy immutable · Children protected · Truth is love · Speech/conscience free',
    frame: 'Sex is binary, binary is biological, and telling the truth is the only compassionate path — especially for children.',
    path: [
      { letter: 'F', label: 'Formed male/female', text: '“Male and female He created them” — intentional, good, binary (Gen 1:27).' },
      { letter: 'A', label: 'Anatomy immutable', text: 'XX/XY in every cell; hormones and surgery cannot change sex.' },
      { letter: 'C', label: 'Children protected', text: 'Most dysphoric children desist if not socially transitioned; blockers are not “neutral.”' },
      { letter: 'T', label: 'Truth is love', text: 'Affirming a falsehood is not love (cf. anorexia). Reality is not hate.' },
      { letter: 'S', label: 'Speech/conscience', text: 'Compelled pronouns are forced falsehood — resist (Acts 5:29).' },
    ],
    exchanges: [
      { they: 'Affirmation prevents suicide', you: 'Swedish long-term data: post-transition suicide risk remained extremely elevated. Transition ≠ cure.' },
      { they: 'Intersex proves a spectrum', you: 'DSDs are rare disorders of a binary system — they don’t erase male and female.' },
      { they: 'This is a civil-rights issue', you: 'Race is irrelevant to sexed spaces. Sex is real and often decisive (sports, prisons, shelters).' },
      { they: 'Gender is a social construct', you: 'Sex is binary and universal. “Gender identity” detached from sex is ideology, not discovery.' },
    ],
    tip: 'Separate adult distress from medicalizing kids. Memory hook: FACTS.',
  },
  {
    id: 'pro-israel',
    title: 'Pro-Israel',
    acronym: 'CLAIM',
    acronymHint: 'Covenant · Legal/historical claim · Alliance · Integrity (moral democracy) · Mapped in prophecy',
    frame: 'Support for Israel rests on covenant, history, morality, and strategy — not sentimentality.',
    path: [
      { letter: 'C', label: 'Covenant', text: 'God’s promises to Abraham and Israel are enduring (Gen 12; Rom 11:29).' },
      { letter: 'L', label: 'Legal/historical claim', text: 'Continuous Jewish presence; modern Israel’s legal founding and defensive wars.' },
      { letter: 'A', label: 'Alliance', text: 'Shared values, intel/military cooperation, common threats (Iran, terror networks).' },
      { letter: 'I', label: 'Integrity / democracy', text: 'Israel is a democracy amid authoritarian neighbors — imperfect, but exceptional.' },
      { letter: 'M', label: 'Mapped in prophecy', text: 'Restoration themes in Scripture align with Israel’s improbable survival.' },
    ],
    exchanges: [
      { they: 'Israel is a colonial project', you: 'Jews are indigenous to the land with continuous presence. Modern return followed legal mandates and defensive survival.' },
      { they: 'Occupation causes the conflict', you: 'Rejectionism predates 1967. Multiple land-for-peace offers were refused; terror remains the strategy.' },
      { they: 'Criticizing Israel isn’t antisemitism', you: 'Fair critique exists. Demonization, double standards, and denying Jewish self-determination often are.' },
      { they: 'Christians should be neutral', you: 'Blessing Israel (Gen 12:3) and defending a free ally against jihadist enemies is moral clarity, not neutrality.' },
    ],
    tip: 'Distinguish civilians from Hamas. Memory hook: CLAIM.',
  },
  {
    id: 'national-security',
    title: 'Strong National Security',
    acronym: 'GUARD',
    acronymHint: 'God-ordained mandate · Undermine aggression · Advance civilization · Ready forces · Doctrine war',
    frame: 'Peace through strength: government’s first duty is to protect the innocent from real enemies.',
    path: [
      { letter: 'G', label: 'God-ordained mandate', text: 'Romans 13 — the state bears the sword to restrain evil.' },
      { letter: 'U', label: 'Undermine aggression', text: 'Deterrence: weakness invites China, Russia, Iran, NK, and jihadist networks.' },
      { letter: 'A', label: 'Advance civilization', text: 'America uniquely underwrites liberty, trade, and religious freedom abroad.' },
      { letter: 'R', label: 'Ready forces', text: 'Preparedness: superior military, intel, alliances, energy, and borders.' },
      { letter: 'D', label: 'Doctrine war', text: 'Tyranny is a belief system. Soft power without hard power is begging.' },
    ],
    exchanges: [
      { they: 'Military spending steals from the poor', you: 'Dead citizens can’t be helped. Security enables prosperity — and America’s aid. Both/and (Neh 4).' },
      { they: 'Focus only on domestic issues', you: 'False choice. 9/11 proved distant threats become local catastrophes. Prevention beats aftermath.' },
      { they: 'Diplomacy, not strength', you: 'Diplomacy without power is pleading. “Speak softly and carry a big stick.”' },
      { they: 'Christians should be pacifists', you: 'Personal forgiveness ≠ national abdication. Just war tradition: defending the innocent can be righteous.' },
    ],
    tip: 'Pray and prepare (Prov 21:31). Memory hook: GUARD.',
  },
  {
    id: 'anti-climate-alarmism',
    title: 'Anti-Climate Alarmism',
    acronym: 'SENSE',
    acronymHint: 'Stewardship · Examine claims · Neighbor flourishing · Solid energy · Expose narrative',
    frame: 'Steward creation wisely — reject apocalyptic politics that impoverish people in the name of “settled science.”',
    path: [
      { letter: 'S', label: 'Stewardship', text: 'Dominion + care (Gen 1:28; 2:15) — develop resources; don’t bury talents.' },
      { letter: 'E', label: 'Examine claims', text: 'Skepticism: decades of failed catastrophes; models overpredict; natural variability matters.' },
      { letter: 'N', label: 'Neighbor flourishing', text: 'Abundant energy lifted billions from poverty — that is love of neighbor.' },
      { letter: 'S', label: 'Solid energy', text: 'Dense, reliable power (nuclear + hydrocarbons) beats intermittent virtue signaling.' },
      { letter: 'E', label: 'Expose narrative', text: 'Apocalypse, guilt, indulgences, and elite hypocrisy look like a religion.' },
    ],
    exchanges: [
      { they: '97% of scientists agree', you: 'The slogan overstates consensus on catastrophe. Debate magnitude, causes, and policies — not whether climate exists.' },
      { they: 'Extreme weather is worse', you: 'Normalized data often shows no clear upward trend in hurricanes/tornadoes/droughts. Media ≠ metrics.' },
      { they: 'Sea levels are rising dangerously', you: 'Long-term rise is slow (~mm/year). Adaptation has worked for a century; panic policies still fail the poor.' },
      { they: 'Leave fossil fuels in the ground', you: 'That consigns the developing world to poverty. No scalable replacement yet — harming the poor is not stewardship.' },
    ],
    tip: 'Grant modest warming; contest catastrophe + central planning. Memory hook: SENSE.',
  },
  {
    id: 'limited-government',
    title: 'Limited Government',
    acronym: 'LIMIT',
    acronymHint: 'Lesson of kings · Industry & property · Maximize liberty · Incentives win · Thrift over debt',
    frame: 'Government is a necessary servant and a dangerous master. Liberty, property, and thrift beat bureaucratic control.',
    path: [
      { letter: 'L', label: 'Lesson of kings', text: '1 Samuel 8 — centralized power taxes, conscripts, and takes.' },
      { letter: 'I', label: 'Industry & property', text: 'Property, work, and free exchange create wealth (Ex 20:15; Prov).' },
      { letter: 'M', label: 'Maximize liberty', text: 'Free will implies government protects rights — it doesn’t micromanage souls.' },
      { letter: 'I', label: 'Incentives win', text: 'Bureaucracy wastes; markets discover knowledge government can’t.' },
      { letter: 'T', label: 'Thrift over debt', text: 'Borrowing against children is generational theft (Prov 22:7; 13:22).' },
    ],
    exchanges: [
      { they: 'Government provides necessary services', you: 'Yes — core ones: defense, courts, policing (Rom 13). Most else is better private or local.' },
      { they: 'Without regulation, exploitation', you: 'Fraud and force are already illegal. Competition and reputation discipline better than endless rules.' },
      { they: 'We need safety nets', you: 'Charity and family first. Government monopolies often trap poverty; civil society humanizes help.' },
      { they: 'The rich don’t pay their share', you: 'The top earners already fund most income taxes. “Fair share” often means “higher share.”' },
    ],
    tip: 'Argue competence + morality. Memory hook: LIMIT.',
  },
  {
    id: 'anti-crt',
    title: 'Anti-Critical Race Theory',
    acronym: 'LIGHT',
    acronymHint: 'Likeness of God · Illogic of CRT · Genuine progress · Harm to kids · True Gospel unity',
    frame: 'Judge by character, not color. CRT re-racializes America and contradicts the Gospel and the Civil Rights ideal.',
    path: [
      { letter: 'L', label: 'Likeness of God', text: 'One race — human. Equal dignity, equal fallenness, equal need of grace.' },
      { letter: 'I', label: 'Illogic of CRT', text: 'CRT judges by ancestry, is unfalsifiable, and mirrors the racism it claims to fight.' },
      { letter: 'G', label: 'Genuine progress', text: 'America’s sins are real — and so is massive moral progress. 1619 myth ≠ full story.' },
      { letter: 'H', label: 'Harm to kids', text: 'Kids taught oppressor/oppressed scripts; division grows; merit dies.' },
      { letter: 'T', label: 'True Gospel unity', text: 'Reconciliation in Christ — repent real sin; reject racial essentialism.' },
    ],
    exchanges: [
      { they: 'You just hate talking about race', you: 'Honest history ≠ CRT ideology. Oppose racism and racial Marxism.' },
      { they: 'You deny racism exists', you: 'Racism is sin. CRT’s cure (more race obsession) worsens the disease.' },
      { they: 'CRT is just accurate history', you: 'Teaching slavery and Jim Crow ≠ CRT. CRT is a worldview of systemic racial determinism.' },
      { they: 'Opposing CRT = supporting racism', you: 'False dichotomy. Sowell, McWhorter, Elder — and MLK’s dream — reject both.' },
    ],
    tip: 'Quote MLK. Demand color-blind equality. Memory hook: LIGHT.',
  },
  {
    id: 'crime-and-justice',
    title: 'Crime & Justice',
    acronym: 'SERVE',
    acronymHint: 'Sword mandate · Enforce safety · Rule of law · Vet threats · Elevate victims',
    frame: 'Government’s job is to punish evil and protect the innocent. Soft-on-crime politics abandons victims.',
    path: [
      { letter: 'S', label: 'Sword mandate', text: 'Romans 13 — bear the sword against wrongdoers.' },
      { letter: 'E', label: 'Enforce safety', text: 'Catch-and-release and soft charging correlate with rising violence.' },
      { letter: 'R', label: 'Rule of law', text: 'Sanctuary nullification destroys equal justice and deterrence.' },
      { letter: 'V', label: 'Vet threats', text: 'Sovereignty includes keeping violent criminal aliens out — and removing them.' },
      { letter: 'E', label: 'Elevate victims', text: 'Speak for those who can’t (Prov 31). Name the forgotten dead.' },
    ],
    exchanges: [
      { they: 'No human is illegal', you: 'People aren’t illegal; illegal entry and overstay are. Words describe actions.' },
      { they: 'Most aren’t violent', you: 'Then deport the violent subset without apology. Even small percentages are many victims.' },
      { they: 'Deportation is cruel', you: 'Cruelty is releasing predators onto Kate Steinle’s neighbors. Justice is not optional.' },
      { they: 'The system is broken', you: 'Reform laws — don’t ignore them. Chaos isn’t compassion.' },
    ],
    tip: 'Put victims’ names at the center. Memory hook: SERVE.',
  },
  {
    id: 'role-of-the-military',
    title: 'Role of the Military',
    acronym: 'FORCE',
    acronymHint: 'Fight/defend mandate · Ordered civilian control · Readiness/lethality · Character/ethos · Ends limited (just war)',
    frame: 'The military exists to fight and win wars — not to remake society. Peace through strength needs a lethal, focused, apolitical force.',
    path: [
      { letter: 'F', label: 'Fight/defend mandate', text: 'Romans 13: the sword restrains evil. A force that cannot fight abandons the innocent.' },
      { letter: 'O', label: 'Ordered civilian control', text: 'Common defense is constitutional. Keep the ranks the nation’s shield — not a faction’s tool.' },
      { letter: 'R', label: 'Readiness/lethality', text: 'Standards, munitions, maintenance, and recruiting beat messaging. Enemies don’t grade DEI.' },
      { letter: 'C', label: 'Character/ethos', text: 'Courage, cohesion, and sacrifice win wars. Social experimentation treats soldiers as props.' },
      { letter: 'E', label: 'Ends limited', text: 'Just war needs clear aims and exits. Strength without prudence becomes forever war.' },
    ],
    exchanges: [
      { they: 'A strong military causes wars', you: 'Weakness invites aggression. Deterrence raises the cost of attack — Reagan’s buildup helped end the Cold War without WWIII.' },
      { they: 'The military should mirror every social trend', you: 'It is not a campus. Lethality and cohesion under fire come first. Standards serve survival.' },
      { they: 'We spend too much on defense', you: 'Security is government’s first duty (Rom 13). Cut waste; don’t cut capability. Dead citizens enjoy no other programs.' },
      { they: 'Christians should be pacifists', you: 'Personal forgiveness ≠ national abdication. Just war: defending the innocent can be righteous.' },
    ],
    tip: 'Separate mission (FORCE) from threat lists. Memory hook: FORCE.',
  },
  {
    id: 'universal-healthcare',
    title: 'Against Universal Government Healthcare',
    acronym: 'CURES',
    acronymHint: 'Choice · Unleash markets · Rationing honesty · Expand innovation · Steward the vulnerable',
    frame: 'Healthcare is a moral good — monopoly government medicine rations by queue, blunts innovation, and puts politics between patient and doctor.',
    path: [
      { letter: 'C', label: 'Choice', text: 'Patients and doctors need exit options. One payer means one political customer.' },
      { letter: 'U', label: 'Unleash markets', text: 'Transparent prices and competition lower costs where patients can actually choose (e.g. LASIK).' },
      { letter: 'R', label: 'Rationing honesty', text: 'Waiting lists are denial of care with better PR. Ask who dies on the list.' },
      { letter: 'E', label: 'Expand innovation', text: 'America’s biomedical engine serves the world. Price-control monopsony starves tomorrow’s cures.' },
      { letter: 'S', label: 'Steward the vulnerable', text: 'Help the poor with targeted aid and charity — not by nationalizing everyone’s body.' },
    ],
    exchanges: [
      { they: 'Healthcare is a human right', you: 'A duty to help ≠ a right to a government monopoly. Positive entitlements conscript others’ labor and money.' },
      { they: 'Other countries cover everyone', you: 'They ration by waiting and limit new therapies. Coverage on paper ≠ timely care.' },
      { they: 'Medicare for All is simpler', you: 'Centralizing complexity relocates it into politics, queues, and influence — it doesn’t erase scarcity.' },
      { they: 'Markets leave people behind', you: 'Markets + targeted aid + charity beat monopoly. The uninsured need help, not destroyed choice.' },
    ],
    tip: 'Lead with compassion for the sick, then CURES. Memory hook: CURES.',
  },
  {
    id: 'ai-governance',
    title: 'AI Governance',
    acronym: 'HUMAN',
    acronymHint: 'Human dignity · Unlock innovation · Moderate speech risks · Accountable narrow rules · Nation leads vs rivals',
    frame: 'AI is a powerful tool — not a person and not a god. Govern it for human dignity, free speech, and American leadership under law.',
    path: [
      { letter: 'H', label: 'Human dignity', text: 'Imago Dei: people bear moral agency; models do not. “The AI decided” is evasion.' },
      { letter: 'U', label: 'Unlock innovation', text: 'Lead in compute and talent or be ruled by those who do — especially the CCP.' },
      { letter: 'M', label: 'Moderate speech risks', text: 'AI intermediaries can become censorship machines. Demand pluralism and contestability.' },
      { letter: 'A', label: 'Accountable rules', text: 'Regulate concrete harms and uses — not a vague super-regulator for all cognition.' },
      { letter: 'N', label: 'Nation of formed minds', text: 'Train humans to verify and judge. Don’t outsource wisdom to autocomplete.' },
    ],
    exchanges: [
      { they: 'Pause AI or we all die', you: 'Speculative doom ≠ blank check for a regulator class while adversaries sprint. Focus on concrete misuse.' },
      { they: 'We need one global AI authority', you: 'Global bodies often launder unfree values. Prefer democratic law and alliances of free nations.' },
      { they: 'Bias means tight control', you: 'All systems have bias. Competition and transparency beat one sanctioned orthodoxy.' },
      { they: 'AI should have rights', you: 'Rights attach to persons. Tools get rules for use — not citizenship.' },
    ],
    tip: 'Hold both: AI is powerful AND humans stay central. Memory hook: HUMAN.',
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
  const acronymLetters = sheet.acronym.split('')
  const acronymTiles = acronymLetters
    .map((ch) => `<span class="acro-tile">${esc(ch)}</span>`)
    .join('<span class="acro-join">→</span>')

  const pathHtml = sheet.path
    .map((p, i) => {
      const arrow =
        i < sheet.path.length - 1
          ? `<div class="v-arrow" aria-hidden="true">↓</div>`
          : ''
      return `<div class="step"><span class="num">${esc(p.letter)}</span><div class="step-body"><strong>${esc(p.label)}</strong><p>${esc(p.text)}</p></div></div>${arrow}`
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
<title>${esc(sheet.title)} — ${esc(sheet.acronym)} Debate One-Pager | LibertyIQ</title>
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
    padding: 0.38in 0.46in 0.34in;
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
    inset: 0.2in;
    border: 1.5px solid rgba(26, 58, 92, 0.22);
    pointer-events: none;
  }
  .page::after {
    content: "";
    position: absolute;
    inset: 0.26in;
    border: 0.5px solid rgba(184, 138, 58, 0.35);
    pointer-events: none;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 0.24in;
    margin-bottom: 0.1in;
    padding-bottom: 0.08in;
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
    font-size: 24px;
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
  .acronym-banner {
    margin: 0.1in 0 0.1in;
    padding: 0.08in 0.12in;
    background: linear-gradient(90deg, #b88a3a 0%, #c9a24d 55%, #b88a3a 100%);
    color: #1a2332;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.14in;
    align-items: center;
  }
  .acronym-banner .hook {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 8px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 800;
    white-space: nowrap;
  }
  .acronym-banner .word {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.12em;
    line-height: 1;
    color: #1a3a5c;
  }
  .acro-row {
    display: flex;
    align-items: center;
    gap: 0.04in;
    flex-wrap: wrap;
  }
  .acro-tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 0.28in;
    height: 0.28in;
    padding: 0 0.04in;
    background: #1a3a5c;
    color: #f7f3ea;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 800;
  }
  .acro-join {
    color: #1a3a5c;
    font-weight: 800;
    font-size: 12px;
    padding: 0 0.02in;
  }
  .acronym-banner .hint {
    font-size: 9.5px;
    line-height: 1.3;
    margin-top: 0.04in;
    color: #2a3340;
  }
  .frame {
    margin: 0 0 0.1in;
    padding: 0.08in 0.12in;
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
    margin-bottom: 0.03in;
  }
  .frame p {
    font-size: 11.5px;
    line-height: 1.32;
  }
  .grid {
    display: grid;
    grid-template-columns: 1.08fr 1fr;
    gap: 0.16in;
    position: relative;
    z-index: 1;
  }
  .col h2 {
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b88a3a;
    margin-bottom: 0.07in;
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
    padding: 0.06in 0.08in;
  }
  .num {
    flex: 0 0 0.24in;
    width: 0.24in;
    height: 0.24in;
    border-radius: 50%;
    background: #1a3a5c;
    color: #f7f3ea;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.01in;
  }
  .step-body strong {
    display: block;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 9px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #b88a3a;
    margin-bottom: 0.015in;
  }
  .step-body p {
    font-size: 10px;
    line-height: 1.26;
  }
  .v-arrow {
    text-align: center;
    color: #b88a3a;
    font-size: 13px;
    line-height: 1;
    padding: 0.015in 0;
    font-weight: 700;
  }
  .exchanges {
    display: flex;
    flex-direction: column;
    gap: 0.07in;
  }
  .exchange {
    display: grid;
    grid-template-columns: 1fr 0.26in 1.15fr;
    align-items: stretch;
    gap: 0.04in;
  }
  .they, .you {
    padding: 0.06in 0.07in;
    min-height: 0.58in;
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
    margin-bottom: 0.025in;
  }
  .they .label { color: #8c3030; }
  .you .label { color: #1a5a3a; }
  .they p, .you p {
    font-size: 9px;
    line-height: 1.26;
  }
  .h-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b88a3a;
    font-size: 17px;
    font-weight: 700;
  }
  .close {
    margin-top: 0.1in;
    padding: 0.08in 0.1in;
    border: 1.5px solid #b88a3a;
    background: rgba(184, 138, 58, 0.10);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.1in;
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
    font-size: 10.5px;
    line-height: 1.28;
    color: #1a3a5c;
  }
  footer {
    position: absolute;
    left: 0.46in;
    right: 0.46in;
    bottom: 0.28in;
    display: flex;
    justify-content: space-between;
    font-family: "Avenir Next", "Segoe UI", Helvetica, sans-serif;
    font-size: 8px;
    color: #6a7380;
    z-index: 1;
    border-top: 1px solid rgba(26,58,92,0.18);
    padding-top: 0.05in;
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

    <section class="acronym-banner">
      <div>
        <div class="hook">Memory hook →</div>
        <div class="word">${esc(sheet.acronym)}</div>
      </div>
      <div>
        <div class="acro-row">${acronymTiles}</div>
        <p class="hint">${esc(sheet.acronymHint)}</p>
      </div>
    </section>

    <section class="frame">
      <span class="tag">Opening frame → start here</span>
      <p>${esc(sheet.frame)}</p>
    </section>

    <div class="grid">
      <section class="col">
        <h2>${esc(sheet.acronym)} path <span class="bar"></span></h2>
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
      <span>Walk ${esc(sheet.acronym)} ↓ on the left; answer objections → on the right.</span>
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

const indexLines = [
  '# LibertyIQ Debate One-Pagers',
  '',
  'One printable page per issue: memory-hook acronym, debate path (↓), plus THEY SAY → YOU SAY counters.',
  '',
  '| Issue | Acronym | PDF |',
  '| --- | --- | --- |',
  ...sheets.map((s, i) => {
    const pdfName = `${String(i + 1).padStart(2, '0')}-${s.id}.pdf`
    return `| ${s.title} | **${s.acronym}** | [${pdfName}](./${pdfName}) |`
  }),
  '',
  '## How to use',
  '',
  '1. Memorize the **acronym** (gold banner).',
  '2. Open with the **Opening frame**.',
  '3. Walk the lettered **path** top → bottom (follow the ↓ arrows).',
  '4. When interrupted, jump to the matching **They say → You say** counter.',
  '5. Finish on the **Close →** line.',
  '',
  '## Acronym cheatsheet',
  '',
  ...sheets.map((s) => `- **${s.acronym}** (${s.title}): ${s.acronymHint}`),
  '',
  'HTML sources (for redesign) live in `html/`.',
  '',
]

writeFileSync(join(OUT_DIR, 'README.md'), indexLines.join('\n'))
console.log('\nDone →', OUT_DIR)
