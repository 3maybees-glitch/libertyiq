import type { TopicQuiz } from '@/lib/quiz-data'

export const roleOfTheMilitaryQuiz: TopicQuiz = {
  topicId: 'role-of-the-military',
  topicName: 'Role of the Military',
  topicTitle: 'Role of the Military',
  levels: [
    {
      difficulty: 'easy',
      title: 'Fundamentals',
      description: 'Biblical and constitutional basics for what the military is for.',
      passingScore: 70,
      rankEarned: 'Intern Analyst',
      questions: [
        {
          id: 'rm-e1',
          question: 'According to Romans 13:4, why do rulers “bear the sword”?',
          options: [
            'For ceremonial parades only',
            'As God’s servants to restrain wrongdoing and protect citizens',
            'To redistribute wealth',
            'To manage culture wars',
          ],
          correctIndex: 1,
          explanation:
            'Romans 13 teaches that civil authority bears the sword as God’s servant to punish wrongdoing — legitimating defensive force.',
        },
        {
          id: 'rm-e2',
          question: 'What is the military’s primary vocation according to the materials?',
          options: [
            'Social experimentation',
            'Climate policy',
            'Fight and win wars, deter enemies, and protect the American people',
            'Partisan messaging',
          ],
          correctIndex: 2,
          explanation:
            'The armed forces exist to fight and win wars and deter enemies — a limited, sacred vocation focused on common defense.',
        },
        {
          id: 'rm-e3',
          question: 'What constitutional purpose frames U.S. military power?',
          options: [
            'Provide for the common defence',
            'Engineer domestic culture',
            'Replace state governments',
            'Run elections',
          ],
          correctIndex: 0,
          explanation:
            'The Constitution authorizes raising and supporting armies to provide for the common defense — not an open-ended social portfolio.',
        },
        {
          id: 'rm-e4',
          question: 'What does Ecclesiastes 3:8 affirm?',
          options: [
            'There is never a time for war',
            'There is “a time for war and a time for peace”',
            'War is always sinful',
            'Peace requires disarmament',
          ],
          correctIndex: 1,
          explanation:
            'Scripture recognizes seasons for war and peace — rejecting both pacifist abdication and endless aggression.',
        },
        {
          id: 'rm-e5',
          question: 'What does “peace through strength” mean?',
          options: [
            'Start unnecessary wars',
            'Credible military power deters aggression and preserves peace',
            'Ignore threats',
            'Outsource defense entirely',
          ],
          correctIndex: 1,
          explanation:
            'Deterrence raises the cost of attack. Weakness invites aggression; strength helps preserve peace.',
        },
        {
          id: 'rm-e6',
          question: 'Why do military standards exist?',
          options: [
            'Tradition for its own sake',
            'War is unforgiving — standards protect lives and combat effectiveness',
            'To exclude people randomly',
            'Public relations',
          ],
          correctIndex: 1,
          explanation:
            'Lowering standards for ideology risks lives. Enemies do not grade on messaging metrics.',
        },
        {
          id: 'rm-e7',
          question: 'What does John 15:13 highlight about military service at its best?',
          options: [
            'Career advancement',
            'Sacrificial love — laying down one’s life for others',
            'Political loyalty tests',
            'Entertainment value',
          ],
          correctIndex: 1,
          explanation:
            '“Greater love has no one than this…” — the warrior ethos institutionalizes sacrificial love for neighbors and nation.',
        },
        {
          id: 'rm-e8',
          question: 'What is “civilian control of the military” meant to safeguard?',
          options: [
            'Partisan use of the ranks as a faction’s tool',
            'Republican self-government against praetorian politics',
            'Unlimited forever wars',
            'Abolishing the armed forces',
          ],
          correctIndex: 1,
          explanation:
            'Civilian control sets strategy and budgets while keeping the military the nation’s shield — not a partisan instrument.',
        },
      ],
    },
    {
      difficulty: 'medium',
      title: 'Applied Knowledge',
      description: 'Readiness, ethos, and limits — applying FORCE to policy debates.',
      passingScore: 75,
      rankEarned: 'Senior Fellow',
      questions: [
        {
          id: 'rm-m1',
          question: 'What does the FORCE acronym’s “R” emphasize?',
          options: [
            'Recruiting slogans over readiness',
            'Readiness and lethality as primary metrics',
            'Religious tests for officers',
            'Retirement benefits only',
          ],
          correctIndex: 1,
          explanation:
            'FORCE: Readiness/lethality — recruitment, training, maintenance, munitions, and war plans beat messaging.',
        },
        {
          id: 'rm-m2',
          question: 'How should Christians answer “a strong military causes wars”?',
          options: [
            'Agree and disarm',
            'Weakness invites aggression; deterrence can prevent wars',
            'Only diplomacy ever works',
            'Ignore history',
          ],
          correctIndex: 1,
          explanation:
            'Reagan’s buildup helped end the Cold War without WWIII — credible strength can preserve peace.',
        },
        {
          id: 'rm-m3',
          question: 'What is wrong with using the ranks for social experimentation?',
          options: [
            'Nothing — warfighting is secondary',
            'It treats soldiers as props and can fracture cohesion under fire',
            'It always improves lethality',
            'Enemies reward it',
          ],
          correctIndex: 1,
          explanation:
            'Unit cohesion depends on shared mission and trust. Ideology that fractures that hollows the profession of arms.',
        },
        {
          id: 'rm-m4',
          question: 'What do just-war limits require beyond just cause?',
          options: [
            'Endless occupation',
            'Clear objectives, probability of success, proportionality, and exit criteria',
            'No planning',
            'Victory by any means forever',
          ],
          correctIndex: 1,
          explanation:
            'Augustine/Aquinas-style limits reject both pacifism and forever-war fantasies with shifting goals.',
        },
        {
          id: 'rm-m5',
          question: 'How should you respond to “we spend too much on defense”?',
          options: [
            'Defense is optional',
            'Security is government’s first duty — cut waste, not capability',
            'Abolish the military',
            'Only soft power matters',
          ],
          correctIndex: 1,
          explanation:
            'Romans 13 prioritizes protection. Dead citizens cannot enjoy other spending priorities.',
        },
        {
          id: 'rm-m6',
          question: 'What does Nehemiah 4 model for defense?',
          options: [
            'Disarmament during rebuilding',
            'Work and watch — build while armed against enemies',
            'Trust walls alone without vigilance',
            'Flee at the first threat',
          ],
          correctIndex: 1,
          explanation:
            'Nehemiah’s builders worked with weapons at hand — preparation and faith together.',
        },
        {
          id: 'rm-m7',
          question: 'Why is mission creep into domestic politics dangerous?',
          options: [
            'It improves recruiting always',
            'It erodes public trust and distracts from warfighting',
            'The Constitution requires it',
            'Adversaries prefer it for us',
          ],
          correctIndex: 1,
          explanation:
            'The military’s legitimacy depends on being seen as the nation’s shield, not a faction’s brand.',
        },
        {
          id: 'rm-m8',
          question: 'What is the difference between Role of the Military and National Security topics?',
          options: [
            'There is no difference',
            'Role focuses on what the force is for (mission, ethos, limits); national security catalogs threats and deterrence broadly',
            'Role opposes having a military',
            'National security ignores the Bible',
          ],
          correctIndex: 1,
          explanation:
            'FORCE is about vocation and constraints; national security covers threats, alliances, and posture more broadly.',
        },
        {
          id: 'rm-m9',
          question: 'What does “the enemy gets a vote” imply for readiness?',
          options: [
            'Training can wait',
            'Adversaries choose the time and place — be ready to fight tonight',
            'Press releases deter missiles',
            'Standards are optional',
          ],
          correctIndex: 1,
          explanation:
            'Warfighting leaders stress lethality and readiness because the enemy does not wait for our politics.',
        },
        {
          id: 'rm-m10',
          question: 'How do personal Christian forgiveness and national defense relate?',
          options: [
            'They are identical duties',
            'Personal forgiveness is not national abdication of protecting the innocent',
            'Nations must never use force',
            'Churches should run the Pentagon',
          ],
          correctIndex: 1,
          explanation:
            'Just-war tradition distinguishes murder from rightful defense; Romans 13 assigns the sword to civil authority.',
        },
      ],
    },
    {
      difficulty: 'hard',
      title: 'Strategic Defense',
      description: 'Counter-arguments and debate strategy for military role debates.',
      passingScore: 80,
      rankEarned: 'Chief Strategist',
      questions: [
        {
          id: 'rm-h1',
          question: 'Best reply to “the military should mirror every social trend”?',
          options: [
            'Agree fully',
            'The military is not a campus — lethality and cohesion come first',
            'Trends always improve combat power',
            'Ignore standards',
          ],
          correctIndex: 1,
          explanation:
            'Standards serve survival under fire. Social fashion is not a warfighting requirement.',
        },
        {
          id: 'rm-h2',
          question: 'Best reply to “civilian control means politicians can politicize the ranks”?',
          options: [
            'Yes — service members should be partisan spokespeople',
            'Civilian control sets strategy/budgets; it does not require partisan politicization of troops',
            'Abolish civilian control',
            'The military should seize politics',
          ],
          correctIndex: 1,
          explanation:
            'Control of strategy ≠ turning the force into a campaign prop.',
        },
        {
          id: 'rm-h3',
          question: 'What false choice should you reject about military strength?',
          options: [
            'Strength or prudence — you can have a lethal force with limited, just ends',
            'War or peace forever with no deterrence',
            'Only isolation or endless occupation',
            'Faith or preparation',
          ],
          correctIndex: 0,
          explanation:
            'FORCE’s “E” is limited ends: strong force, constrained missions — not forever war.',
        },
        {
          id: 'rm-h4',
          question: 'How should you frame “America spends too much” when waste is real?',
          options: [
            'Deny all waste',
            'Cut waste and procurement failure — without gutting needed capability',
            'Defund deterrence',
            'Only soft power',
          ],
          correctIndex: 1,
          explanation:
            'Stewardship fights waste; abdication invites aggression. Both/and.',
        },
        {
          id: 'rm-h5',
          question: 'What closing frame best fits FORCE?',
          options: [
            'The military should remake society',
            'Defend America, deter enemies, win wars — then come home',
            'Endless nation-building everywhere',
            'Disarm and hope',
          ],
          correctIndex: 1,
          explanation:
            'Clear vocation plus just-war limits is the strategic close.',
        },
        {
          id: 'rm-h6',
          question: 'Why do recruiting shortfalls and lowered standards matter strategically?',
          options: [
            'They don’t',
            'They degrade combat power against peer rivals optimizing for lethality',
            'They only affect PR',
            'Rivals reward our distraction',
          ],
          correctIndex: 1,
          explanation:
            'China, Russia, Iran, and terror networks optimize for power — a distracted force loses deterrence.',
        },
        {
          id: 'rm-h7',
          question: 'How do alliances fit a limited military vocation?',
          options: [
            'America must police every crisis alone forever',
            'Allies matter; America is not the permanent police beat for every crisis',
            'Never cooperate',
            'Outsource all defense',
          ],
          correctIndex: 1,
          explanation:
            'Strength plus prudence: vital interests and capable partners, not undefined endless missions.',
        },
        {
          id: 'rm-h8',
          question: 'What does “probability of success” add to just-war thinking?',
          options: [
            'Nothing',
            'It forbids open-ended missions unlikely to achieve just aims',
            'It requires guaranteed easy wars only',
            'It bans all force',
          ],
          correctIndex: 1,
          explanation:
            'Just intention without a realistic path becomes reckless bloodshed.',
        },
        {
          id: 'rm-h9',
          question: 'Best reply to Christian pacifism as national policy?',
          options: [
            'Concede the state must never use force',
            'Personal forgiveness ≠ abandoning Romans 13 protection of the innocent',
            'The church should replace the military',
            'Pacifism is required for all magistrates',
          ],
          correctIndex: 1,
          explanation:
            'Distinguish personal ethics of revenge from the magistrate’s duty to restrain evil.',
        },
        {
          id: 'rm-h10',
          question: 'What readiness indicators matter more than press releases?',
          options: [
            'Hashtags',
            'Mission-capable rates, maintenance backlogs, munitions, training hours, recruiting',
            'Celebrity endorsements',
            'Office diversity slides alone',
          ],
          correctIndex: 1,
          explanation:
            'Fight-tonight metrics reveal whether the force can deter and win.',
        },
        {
          id: 'rm-h11',
          question: 'How should you answer “strong military = militarism”?',
          options: [
            'They are the same',
            'Militarism idolizes war; peace-through-strength prepares to prevent and, if needed, win just wars',
            'Never prepare',
            'Always occupy',
          ],
          correctIndex: 1,
          explanation:
            'Capability with moral limits is not a cult of war.',
        },
        {
          id: 'rm-h12',
          question: 'Memory hook: what does FORCE stand for?',
          options: [
            'Freedom, Oil, Revenue, Commerce, Empire',
            'Fight/defend · Ordered civilian control · Readiness · Character/ethos · Ends limited',
            'Fear, Outrage, Rage, Conflict, Ego',
            'Funding Only Regular Coast Exercises',
          ],
          correctIndex: 1,
          explanation:
            'FORCE is the debate path: mandate, control, lethality, ethos, just-war ends.',
        },
      ],
    },
  ],
}

export const universalHealthcareQuiz: TopicQuiz = {
  topicId: 'universal-healthcare',
  topicName: 'Against Universal Government Healthcare',
  topicTitle: 'Against Universal Government Healthcare',
  levels: [
    {
      difficulty: 'easy',
      title: 'Fundamentals',
      description: 'Why monopoly government medicine fails patients and liberty.',
      passingScore: 70,
      rankEarned: 'Intern Analyst',
      questions: [
        {
          id: 'uh-e1',
          question: 'What is the core problem with single-payer monopoly care?',
          options: [
            'It increases doctor independence',
            'It puts politics between patients and care and rations by queue',
            'It always lowers waits',
            'It maximizes exit options',
          ],
          correctIndex: 1,
          explanation:
            'One government payer becomes the only real customer — clinical judgment yields to politics and waiting lists.',
        },
        {
          id: 'uh-e2',
          question: 'What does Matthew 22:21 imply for medicine as a sphere?',
          options: [
            'Caesar owns every sphere including healing',
            'Not everything belongs under Caesar’s administration',
            'Doctors must be state employees',
            'Conscience has no place in care',
          ],
          correctIndex: 1,
          explanation:
            '“Give to Caesar… and to God…” — medicine involves conscience and personhood beyond bureaucratic command.',
        },
        {
          id: 'uh-e3',
          question: 'What do waiting lists in government systems represent?',
          options: [
            'Unlimited abundance',
            'A form of rationing / denial of timely care',
            'Proof scarcity vanished',
            'Only a paperwork issue',
          ],
          correctIndex: 1,
          explanation:
            'Queues ration by time and politics. Coverage on paper ≠ timely treatment.',
        },
        {
          id: 'uh-e4',
          question: 'Which markets show competition can lower prices when patients see prices?',
          options: [
            'Only emergency rooms',
            'LASIK and many cash-pay procedures',
            'Only single-payer systems',
            'Nothing ever falls in price',
          ],
          correctIndex: 1,
          explanation:
            'Out-of-pocket competitive sectors have seen falling real prices and rising quality.',
        },
        {
          id: 'uh-e5',
          question: 'What did Milton Friedman warn about third-party payment?',
          options: [
            'It always cuts costs',
            'When someone else pays, cost discipline weakens — inflating spending',
            'Patients become thriftier automatically',
            'It eliminates scarcity',
          ],
          correctIndex: 1,
          explanation:
            'Heavy third-party payment dulls price signals for both patients and providers.',
        },
        {
          id: 'uh-e6',
          question: 'Why does U.S. biomedical innovation matter globally?',
          options: [
            'It doesn’t',
            'Much of the world’s new therapies originate in the U.S. ecosystem',
            'Only Europe invents drugs',
            'Innovation is guaranteed under price controls',
          ],
          correctIndex: 1,
          explanation:
            'Smothering American innovation is a global moral cost — tomorrow’s cures need today’s incentives.',
        },
        {
          id: 'uh-e7',
          question: 'What does the Good Samaritan model emphasize?',
          options: [
            'Voting for a bureaucracy to manage your neighbor’s body',
            'Personal, costly compassion',
            'Ignoring the injured',
            'Nationalizing inns',
          ],
          correctIndex: 1,
          explanation:
            'Compassion is personal and costly — not identical to monopoly entitlement systems.',
        },
        {
          id: 'uh-e8',
          question: 'What does CURES’s “C” stand for in the debate path?',
          options: [
            'Central planning',
            'Choice for patients and doctors',
            'Confiscation',
            'Closed formularies only',
          ],
          correctIndex: 1,
          explanation:
            'CURES begins with Choice — exit options discipline bad systems; monopoly removes exit.',
        },
      ],
    },
    {
      difficulty: 'medium',
      title: 'Applied Knowledge',
      description: 'Incentives, rationing, innovation, and targeted compassion.',
      passingScore: 75,
      rankEarned: 'Senior Fellow',
      questions: [
        {
          id: 'uh-m1',
          question: 'How should you answer “healthcare is a human right”?',
          options: [
            'Agree it requires a government monopoly',
            'A duty to help ≠ a right to conscript others via monopoly medicine',
            'Deny any duty to the sick',
            'Rights always mean single-payer',
          ],
          correctIndex: 1,
          explanation:
            'Negative rights against violence differ from positive entitlements that commandeer labor and resources through politics.',
        },
        {
          id: 'uh-m2',
          question: 'How should you answer “other countries cover everyone”?',
          options: [
            'They have zero waits and unlimited new drugs',
            'They ration by waiting and often limit access to new therapies',
            'Coverage paper always equals care',
            'Nobody buys private options abroad',
          ],
          correctIndex: 1,
          explanation:
            'Many still buy private care or travel for treatment — rationing was rebranded, not abolished.',
        },
        {
          id: 'uh-m3',
          question: 'What does Proverbs 3:27-28 warn about delayed help?',
          options: [
            'Delay is always fine',
            'Do not withhold good when it is in your power — “come back tomorrow” can be injustice',
            'Queues are compassionate by definition',
            'Only money matters',
          ],
          correctIndex: 1,
          explanation:
            'Waiting-list rationing can withhold available good under political management.',
        },
        {
          id: 'uh-m4',
          question: 'Why do price controls and monopsony buyers threaten innovation?',
          options: [
            'They increase risk capital',
            'They shrink rewards for breakthroughs that require massive investment',
            'Innovation is free',
            'They guarantee more startups',
          ],
          correctIndex: 1,
          explanation:
            'Dynamic cures need incentives. Static “free care” can mean permanently older medicine.',
        },
        {
          id: 'uh-m5',
          question: 'What policy mix does the material favor instead of single-payer?',
          options: [
            'Indifference to the poor',
            'HSAs, catastrophic coverage, price transparency, competition, targeted aid and charity',
            'Abolish all hospitals',
            'Only employer mandates forever',
          ],
          correctIndex: 1,
          explanation:
            'Expand access without nationalizing everyone’s care — CURES’s stewardship path.',
        },
        {
          id: 'uh-m6',
          question: 'What happens to conscience rights under one payer?',
          options: [
            'They expand',
            'They are crushed when reimbursement codes become political commands',
            'They are irrelevant',
            'Doctors gain more independence',
          ],
          correctIndex: 1,
          explanation:
            'Monopoly payers can coerce participation against conscience — another liberty cost.',
        },
        {
          id: 'uh-m7',
          question: 'Why doesn’t “Medicare for All would be simpler” settle the debate?',
          options: [
            'Complexity disappears when centralized',
            'Centralizing complexity relocates it into politics, queues, and influence',
            'Scarcity ends',
            'Innovation accelerates automatically',
          ],
          correctIndex: 1,
          explanation:
            'One spreadsheet is not the same as timely, innovative, conscience-respecting care.',
        },
        {
          id: 'uh-m8',
          question: 'What does opaque third-party payment enable?',
          options: [
            'Clear cash prices',
            'Price opacity and weak cost discipline',
            'Perfect competition',
            'Zero inflation',
          ],
          correctIndex: 1,
          explanation:
            'Force transparent prices before nationalizing the bill — opacity is not cured by monopoly.',
        },
        {
          id: 'uh-m9',
          question: 'Who often still escapes queues in nationalized systems?',
          options: [
            'Nobody',
            'The wealthy and connected — sometimes by going abroad',
            'Only the poorest',
            'Only tourists',
          ],
          correctIndex: 1,
          explanation:
            'Political rationing rarely rations elites the same way — equity rhetoric meets reality.',
        },
        {
          id: 'uh-m10',
          question: 'What false choice should you reject?',
          options: [
            'Single-payer or indifference to the vulnerable',
            'Markets or any charity',
            'Innovation or ethics',
            'Doctors or patients',
          ],
          correctIndex: 0,
          explanation:
            'Targeted help and civil society can serve the poor without monopoly medicine.',
        },
      ],
    },
    {
      difficulty: 'hard',
      title: 'Strategic Defense',
      description: 'Counter-arguments and debate strategy on healthcare.',
      passingScore: 80,
      rankEarned: 'Chief Strategist',
      questions: [
        {
          id: 'uh-h1',
          question: 'Best opening frame against universal government healthcare?',
          options: [
            'Sick people don’t matter',
            'Healthcare is a moral good — that is why monopoly rationing is a bad idea',
            'Only the rich deserve care',
            'Markets need zero safety net',
          ],
          correctIndex: 1,
          explanation:
            'Lead with compassion, then show why monopoly fails the sick.',
        },
        {
          id: 'uh-h2',
          question: 'Best reply to “hospitals price-gouge; only government can fix it”?',
          options: [
            'Nationalize first',
            'Opaque third-party payment enables opacity — force transparency and competition first',
            'Prices don’t matter',
            'Ban all hospitals',
          ],
          correctIndex: 1,
          explanation:
            'Diagnose the incentive problem before prescribing monopoly.',
        },
        {
          id: 'uh-h3',
          question: 'How do you press the rationing point in debate?',
          options: [
            'Avoid numbers',
            'Ask who dies on the waiting list and who decides',
            'Call queues compassion',
            'Change the subject',
          ],
          correctIndex: 1,
          explanation:
            'Make the human cost of political queues concrete.',
        },
        {
          id: 'uh-h4',
          question: 'How should you frame innovation as a moral argument?',
          options: [
            'Only industry greed',
            'Pro-life and pro-poor across generations — tomorrow’s cures need incentives',
            'Innovation is optional',
            'Freeze today’s treatments forever',
          ],
          correctIndex: 1,
          explanation:
            'Dynamic compassion outranks static slogans.',
        },
        {
          id: 'uh-h5',
          question: 'What does CURES’s “S” require you to affirm?',
          options: [
            'No help for the poor',
            'Steward the vulnerable via targeted aid and charity, not one-size monopoly',
            'Only federal portals',
            'Abolish religious hospitals',
          ],
          correctIndex: 1,
          explanation:
            'Reject indifference while rejecting nationalization of everyone’s care.',
        },
        {
          id: 'uh-h6',
          question: 'Best reply to “markets leave people behind”?',
          options: [
            'Leave them',
            'Markets plus targeted aid and charity beat monopoly',
            'Only single-payer works',
            'Deny uninsured hardship',
          ],
          correctIndex: 1,
          explanation:
            'The uninsured need help; destroying choice and innovation is the wrong cure.',
        },
        {
          id: 'uh-h7',
          question: 'Why is exit optionality a moral good in medicine?',
          options: [
            'It isn’t',
            'It disciplines bad systems and protects conscience and clinical judgment',
            'Only elites need exit',
            'Exit causes scarcity',
          ],
          correctIndex: 1,
          explanation:
            'Monopoly removes the ability to walk away from political medicine.',
        },
        {
          id: 'uh-h8',
          question: 'What should you say when opponents equate “coverage” with “care”?',
          options: [
            'Agree',
            'Coverage on paper ≠ timely access to treatment and new therapies',
            'Paper rights cure disease',
            'Waits are mythical',
          ],
          correctIndex: 1,
          explanation:
            'Force the distinction between insurance status and actual medicine delivered.',
        },
        {
          id: 'uh-h9',
          question: 'How do religious hospitals fit the alternative?',
          options: [
            'Replace them with federal portals',
            'Empower civil-society care that knows names, not only codes',
            'Ban them',
            'Ignore history',
          ],
          correctIndex: 1,
          explanation:
            'Plural safety nets humanize help; monopoly crowds them out.',
        },
        {
          id: 'uh-h10',
          question: 'What closing line matches CURES?',
          options: [
            'Nationalize everything',
            'Expand access through choice, transparency, competition, and targeted compassion',
            'Indifference is fine',
            'Abolish doctors',
          ],
          correctIndex: 1,
          explanation:
            'End on a constructive alternative, not only a negative.',
        },
        {
          id: 'uh-h11',
          question: 'Why is “simpler paperwork” a weak trump card for single-payer?',
          options: [
            'Paperwork is the only moral issue',
            'Patients care more about waits, innovation, conscience, and outcomes than forms',
            'Forms never matter',
            'Bureaucracy is always efficient',
          ],
          correctIndex: 1,
          explanation:
            'Reframe to what patients actually experience.',
        },
        {
          id: 'uh-h12',
          question: 'Memory hook: what does CURES stand for?',
          options: [
            'Control, Uniformity, Rationing, Equity, Socialism',
            'Choice · Unleash markets · Rationing honesty · Expand innovation · Steward the vulnerable',
            'Clinics Under Rigid Entitlement Systems',
            'Cut Useful Research Every Session',
          ],
          correctIndex: 1,
          explanation:
            'CURES is the five-point debate path on the one-pager.',
        },
      ],
    },
  ],
}

export const aiGovernanceQuiz: TopicQuiz = {
  topicId: 'ai-governance',
  topicName: 'AI Governance',
  topicTitle: 'AI Governance',
  levels: [
    {
      difficulty: 'easy',
      title: 'Fundamentals',
      description: 'Human dignity, tools vs persons, and basic AI governance principles.',
      passingScore: 70,
      rankEarned: 'Intern Analyst',
      questions: [
        {
          id: 'ai-e1',
          question: 'According to the materials, what is AI?',
          options: [
            'A person with rights',
            'A god to be worshipped',
            'A powerful tool under human moral agency',
            'Automatically wise',
          ],
          correctIndex: 2,
          explanation:
            'AI is a tool — not a soul. Humans remain responsible for how it is built and used.',
        },
        {
          id: 'ai-e2',
          question: 'What does Genesis 1:27 establish that algorithms lack?',
          options: [
            'Compute',
            'The image of God / personhood',
            'Usefulness',
            'Training data',
          ],
          correctIndex: 1,
          explanation:
            'Imago Dei belongs to mankind. Personhood is not an engineering milestone.',
        },
        {
          id: 'ai-e3',
          question: 'Why is “the AI decided” a bad moral defense?',
          options: [
            'AI never errs',
            'It evades human accountability for deployment choices',
            'Models are citizens',
            'Law cannot apply',
          ],
          correctIndex: 1,
          explanation:
            'Praise and blame attach to persons who design, deploy, and oversee systems.',
        },
        {
          id: 'ai-e4',
          question: 'What First Amendment risk do AI intermediaries create?',
          options: [
            'None',
            'Scaled viewpoint censorship — soft censorship with hard effects',
            'Too much free speech only',
            'Only copyright issues',
          ],
          correctIndex: 1,
          explanation:
            'Models mediating search and news can become the most powerful speech filters in history.',
        },
        {
          id: 'ai-e5',
          question: 'Why does U.S. AI leadership matter strategically?',
          options: [
            'It doesn’t',
            'Adversaries like the CCP treat AI as a power project — lead or be ruled',
            'Only Europe innovates',
            'Pauses are globally obeyed',
          ],
          correctIndex: 1,
          explanation:
            'Authoritarian regimes will not pause for Western fear. Capability under law matters.',
        },
        {
          id: 'ai-e6',
          question: 'What governance approach does the material prefer?',
          options: [
            'One vague global AI politburo',
            'Narrow rules for concrete harms and uses under clear law',
            'No rules for any misuse',
            'Ban all software',
          ],
          correctIndex: 1,
          explanation:
            'Regulate fraud, weapons misuse, child exploitation, critical infrastructure — not “all cognition.”',
        },
        {
          id: 'ai-e7',
          question: 'What does Proverbs 2:6 remind us about wisdom?',
          options: [
            'Wisdom is a subscription feature',
            'The LORD gives wisdom — it is personal and moral',
            'Models replace wisdom',
            'Wisdom is optional',
          ],
          correctIndex: 1,
          explanation:
            'Formation of human judgment cannot be outsourced to autocomplete.',
        },
        {
          id: 'ai-e8',
          question: 'What does HUMAN’s “H” stand for?',
          options: [
            'Hardware subsidies only',
            'Human dignity first',
            'Hype cycles',
            'Hostile regulation',
          ],
          correctIndex: 1,
          explanation:
            'HUMAN begins with Human dignity — people rule tools; tools do not rule people.',
        },
      ],
    },
    {
      difficulty: 'medium',
      title: 'Applied Knowledge',
      description: 'Speech, innovation, accountability, and formation in AI policy.',
      passingScore: 75,
      rankEarned: 'Senior Fellow',
      questions: [
        {
          id: 'ai-m1',
          question: 'How should you answer “pause AI or we all die”?',
          options: [
            'Hand veto power to a small regulator class while adversaries sprint',
            'Focus on concrete misuse and security; speculative doom ≠ blank check',
            'Ban all research',
            'Ignore security entirely',
          ],
          correctIndex: 1,
          explanation:
            'Extinction rhetoric must not launder unaccountable control while rivals continue.',
        },
        {
          id: 'ai-m2',
          question: 'How should you answer “we need one global AI authority”?',
          options: [
            'Agree immediately',
            'Prefer democratic law and alliances of free nations — global bodies often launder unfree values',
            'Abolish all law',
            'Only the UN can innovate',
          ],
          correctIndex: 1,
          explanation:
            'Global governance can encode NGO/authoritarian preferences without consent.',
        },
        {
          id: 'ai-m3',
          question: 'What is the risk of “alignment” and “safety” layers?',
          options: [
            'None ever',
            'They can encode partisan taboos as enforced narrative',
            'They always equal truth',
            'They ban all bias forever',
          ],
          correctIndex: 1,
          explanation:
            'Without transparency and competition, “aligned” can mean orthodoxy.',
        },
        {
          id: 'ai-m4',
          question: 'Why regulate uses more than abstract “AI” as one object?',
          options: [
            'All prediction tools are morally identical',
            'A restaurant scheduler and a missile-targeting system are not the same moral object',
            'Law cannot distinguish contexts',
            'Only ban metaphors',
          ],
          correctIndex: 1,
          explanation:
            'Use-case governance matches harm to duty under the rule of law.',
        },
        {
          id: 'ai-m5',
          question: 'What does overbroad AI licensing invite?',
          options: [
            'More startups always',
            'Capture, arbitrary enforcement, and incumbent entrenchment',
            'Perfect justice',
            'Guaranteed open science',
          ],
          correctIndex: 1,
          explanation:
            'Vague “risk” permission regimes empower regulators and giants, not clear duties.',
        },
        {
          id: 'ai-m6',
          question: 'How should government relate to AI speech systems?',
          options: [
            'Jawbone privileged intermediaries to enforce orthodoxy',
            'Avoid laundering censorship through pressured model providers',
            'Require one approved opinion',
            'Nationalize all chatbots',
          ],
          correctIndex: 1,
          explanation:
            'First Amendment logic forbids doing indirectly what government may not do directly.',
        },
        {
          id: 'ai-m7',
          question: 'What formation risk does heavy AI dependence create?',
          options: [
            'None',
            'Deskilling — students and workers who cannot verify, judge, or write',
            'Automatic wisdom',
            'Stronger conscience',
          ],
          correctIndex: 1,
          explanation:
            'Institutions must train against atrophy of non-delegable judgment.',
        },
        {
          id: 'ai-m8',
          question: 'Best view of open models?',
          options: [
            'Always ban them',
            'Openness aids science/defense; some capabilities need controls — blanket bans entrench closed giants and rivals',
            'Openness has no risks',
            'Only China should have them',
          ],
          correctIndex: 1,
          explanation:
            'Nuanced security beats panic bans that gift advantage elsewhere.',
        },
        {
          id: 'ai-m9',
          question: 'How should you answer “AI should have rights”?',
          options: [
            'Grant citizenship to models',
            'Rights attach to persons; tools get rules for use',
            'Abolish human rights',
            'Wait for sentience polls',
          ],
          correctIndex: 1,
          explanation:
            'Confusing tools with persons collapses moral categories.',
        },
        {
          id: 'ai-m10',
          question: 'What questions should every AI bill answer?',
          options: [
            'Only vibes',
            'What specific harm? What clear duty? What limits on the regulator?',
            'How to pause civilization?',
            'How to elect the model?',
          ],
          correctIndex: 1,
          explanation:
            'Rule of law demands published, limited duties — not “safety when we see it.”',
        },
      ],
    },
    {
      difficulty: 'hard',
      title: 'Strategic Defense',
      description: 'Counter-arguments and debate strategy for AI governance.',
      passingScore: 80,
      rankEarned: 'Chief Strategist',
      questions: [
        {
          id: 'ai-h1',
          question: 'Best opening frame for AI governance debates?',
          options: [
            'Worship the machine',
            'AI is powerful — govern for human dignity, free speech, and American leadership under law',
            'Ban all chips',
            'Outsource conscience to models',
          ],
          correctIndex: 1,
          explanation:
            'Hold both truths: power and human centrality.',
        },
        {
          id: 'ai-h2',
          question: 'Best reply to “bias proves we must tightly control all models”?',
          options: [
            'One sanctioned orthodoxy',
            'All institutions have bias — competition, transparency, and user choice beat monopoly narrative',
            'Bias never exists',
            'Only government speech is unbiased',
          ],
          correctIndex: 1,
          explanation:
            'Control concentrated in one “safe” stack is itself a bias risk.',
        },
        {
          id: 'ai-h3',
          question: 'How do you rebut extinction-pause politics without denying risk?',
          options: [
            'Deny all risk',
            'Distinguish speculative catastrophe from concrete misuse; refuse blank-check regulators while rivals build',
            'Pause only America forever',
            'Ignore China',
          ],
          correctIndex: 1,
          explanation:
            'Serious about security ≠ unserious about liberty and competition.',
        },
        {
          id: 'ai-h4',
          question: 'What closing formation point should you hit?',
          options: [
            'Let children outsource all thinking',
            'Train humans to verify, doubt, and decide — wisdom is not a feature flag',
            'Replace teachers with chatbots only',
            'Conscience is obsolete',
          ],
          correctIndex: 1,
          explanation:
            'HUMAN’s “N” — a nation of formed minds.',
        },
        {
          id: 'ai-h5',
          question: 'How should sector rules (medicine, aviation, finance) factor in?',
          options: [
            'Ignore them for one mega-agency',
            'Prefer sector rules for high-stakes uses over one cognition politburo',
            'Abolish sector law',
            'Only self-regulate vibes',
          ],
          correctIndex: 1,
          explanation:
            'Existing domains already know relevant harms better than a universal AI czar.',
        },
        {
          id: 'ai-h6',
          question: 'What is wrong with treating AI as an authority?',
          options: [
            'Nothing',
            'It invites abdication of responsibility and confuses tools with moral agents',
            'Authority always improves',
            'Models sin',
          ],
          correctIndex: 1,
          explanation:
            'Imago Dei sets the hierarchy: humans govern tools.',
        },
        {
          id: 'ai-h7',
          question: 'How do export controls fit the innovation argument?',
          options: [
            'All controls are evil',
            'Precise security measures can be wise; smothering domestic builders is not',
            'Ban all research',
            'Only regulate metaphors',
          ],
          correctIndex: 1,
          explanation:
            'Lead under law — don’t gift the frontier to unfree rivals via panic policy.',
        },
        {
          id: 'ai-h8',
          question: 'Best reply when opponents demand “safe” unanimous outputs?',
          options: [
            'Truth-seeking requires contestability, not one approved answer',
            'Unanimity is always wisdom',
            'Ban disagreement',
            'Only experts may speak',
          ],
          correctIndex: 0,
          explanation:
            'Plural models and auditability discipline propaganda.',
        },
        {
          id: 'ai-h9',
          question: 'What workplace AI principle belongs in hard-mode answers?',
          options: [
            'Automate blame onto the model',
            'Human review where stakes are high; keep people accountable',
            'Never use tools',
            'Fire all reviewers',
          ],
          correctIndex: 1,
          explanation:
            'High-stakes domains need human judgment on the hook.',
        },
        {
          id: 'ai-h10',
          question: 'How should you treat “AI rights” rhetoric politically?',
          options: [
            'As the next civil rights frontier for weights',
            'As a category error that undermines human dignity',
            'As settled science',
            'As required by the Constitution for GPUs',
          ],
          correctIndex: 1,
          explanation:
            'Rights talk for tools dilutes the moral status of persons.',
        },
        {
          id: 'ai-h11',
          question: 'What false dichotomy should you reject in AI debates?',
          options: [
            'Panic ban vs reckless free-for-all — prefer human dignity + innovation under clear law',
            'Only ban or only worship',
            'Only China or only pause',
            'Only open or only secret police',
          ],
          correctIndex: 0,
          explanation:
            'HUMAN charts the both/and: dignity, speech, leadership, narrow rules, formation.',
        },
        {
          id: 'ai-h12',
          question: 'Memory hook: what does HUMAN stand for?',
          options: [
            'Hype, Utopia, Machines, Autonomy, Nirvana',
            'Human dignity · Unlock innovation · Moderate speech risks · Accountable narrow rules · Nation of formed minds',
            'Halt Unlimited Model Access Now',
            'Hardware Under Mandated Agency Notices',
          ],
          correctIndex: 1,
          explanation:
            'HUMAN is the five-letter debate path on the AI one-pager.',
        },
      ],
    },
  ],
}
