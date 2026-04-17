import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const candidates = [
  '/vercel/share/v0-project/lib/types.ts',
  process.cwd() + '/../lib/types.ts',
];
let filePath = candidates.find(p => existsSync(p));
if (!filePath) {
  // try to find it
  const found = execSync('find / -name types.ts -path "*/lib/*" 2>/dev/null | head -1').toString().trim();
  filePath = found;
}
console.log('[v0] Using file:', filePath);
const lines = readFileSync(filePath, 'utf8').split('\n');

// Keep everything up to and including line 1431 (index 1430)
const kept = lines.slice(0, 1431);

const newSection = `
  // ─── STRONG NATIONAL SECURITY ────────────────────────────────────────────────
  {
    id: 'national-security',
    slug: 'national-security',
    title: 'Strong National Security',
    shortDescription: 'Biblical, historical, strategic, and economic arguments for why America must maintain military strength, secure borders, and robust intelligence capabilities.',
    overview: \`America faces real threats from adversaries who reject freedom, despise Christianity, and seek to dominate. Strong national defense isn't militarism or aggression—it's fulfilling government's God-given mandate to protect citizens. As Christians, we support peace through strength, recognizing that in a fallen world, vigilance and preparedness preserve the freedoms that allow the Gospel to spread and flourishing to occur.\`,
    arguments: [
      {
        id: 'arg-1',
        title: \`The Biblical Argument: Government's Divine Mandate to Protect Citizens\`,
        summary: \`Romans 13 establishes that government bears the sword for a reason. Defending citizens from external threats is not optional — it is a sacred, God-ordained trust.\`,
        outlinePoints: [
          \`Romans 13:1-4: "Let everyone be subject to the governing authorities, for there is no authority except that which God has established... For the one in authority is God's servant for your good. But if you do wrong, be afraid, for rulers do not bear the sword for no reason. They are God's servants, agents of wrath to bring punishment on the wrongdoer"\`,
          \`1 Timothy 2:1-2: "I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people—for kings and all those in authority, that we may live peaceful and quiet lives in all godliness and holiness"\`,
          \`Nehemiah 4:14: "Remember the Lord, who is great and awesome, and fight for your families, your sons and your daughters, your wives and your homes"\`,
          \`Proverbs 21:31: "The horse is made ready for the day of battle, but victory rests with the LORD" - Prepare for defense while trusting God\`,
        ],
        evidence: [
          {
            type: 'scripture',
            title: \`God-Ordained Responsibility\`,
            content: \`Government's primary duty is protecting citizens from external threats and internal disorder. National defense is not optional but a sacred trust. Psalm 82:3-4: "Defend the weak and the fatherless; uphold the cause of the poor and the oppressed. Rescue the weak and the needy; deliver them from the hand of the wicked." A nation unable or unwilling to defend itself abandons God-given stewardship.\`,
          },
          {
            type: 'historical',
            title: 'Historical Biblical Examples',
            content: \`Nehemiah: Rebuilt Jerusalem's walls while armed against enemies (Nehemiah 4:17-18). David: Defended Israel against Philistines, established strong military. 2 Chronicles 32: Hezekiah prepared Jerusalem's defenses against Assyrian invasion. Preparation and vigilance are biblical wisdom, not lack of faith.\`,
          },
        ],
        application: \`The United States government has a God-ordained duty to maintain military strength and intelligence capabilities to protect its citizens from hostile nations and terrorist organizations. Weakness invites aggression; strength preserves peace.\`,
      },
      {
        id: 'arg-2',
        title: \`The "Peace Through Strength" Argument: Deterrence Prevents War\`,
        summary: \`Every major period of American peace and stability has followed strong defense investment. Every period of weakness has been followed by war, attack, or emboldened enemies.\`,
        outlinePoints: [
          \`Ronald Reagan: "We maintain the peace through our strength; weakness only invites aggression"\`,
          \`Reagan's military buildup contributed to Soviet collapse without direct war\`,
          \`Strong U.S. military prevented WWIII during Cold War through credible deterrence\`,
          \`George Washington: "To be prepared for war is one of the most effective means of preserving peace"\`,
        ],
        evidence: [
          {
            type: 'scripture',
            title: 'Biblical Wisdom on Strength',
            content: \`Proverbs 24:5-6: "The wise prevail through great power, and those who have knowledge muster their strength. Surely you need guidance to wage war, and victory is won through many advisers." Ecclesiastes 3:8: "A time to love and a time to hate, a time for war and a time for peace." Luke 14:31-32: Jesus uses military preparedness as an analogy for wisdom: "Or suppose a king is about to go to war against another king. Won't he first sit down and consider whether he is able with ten thousand men to oppose the one coming against him with twenty thousand?"\`,
          },
          {
            type: 'historical',
            title: 'CHINA - Rising Hegemonic Power',
            content: \`Largest military buildup since WWII; surpassed U.S. in naval ships. Aggressive expansion: South China Sea militarization, threats to Taiwan. Economic warfare: Intellectual property theft ($225-600 billion annually), unfair trade practices. Technological threat: 5G dominance, cyber espionage, AI development for military use. Human rights atrocities: Uyghur genocide, Hong Kong crackdown, religious persecution. General Mark Milley (Joint Chiefs Chairman): China is "the pacing threat" for U.S. military. Belt and Road Initiative: Economic colonization of developing nations. Xi Jinping's stated goal: Make China dominant global power by 2049.\`,
          },
          {
            type: 'historical',
            title: 'RUSSIA - Revanchist Aggressor',
            content: \`Invaded Ukraine (2022), Georgia (2008), annexed Crimea (2014). Nuclear threats, energy blackmail (weaponizing gas supplies to Europe). Cyber warfare: Election interference, infrastructure attacks, disinformation campaigns. Vladimir Putin: Seeks to restore Russian empire, undermine Western democracy. Alliance with China, Iran, North Korea creates axis of authoritarian states. Winston Churchill: "An appeaser is one who feeds a crocodile, hoping it will eat him last."\`,
          },
          {
            type: 'historical',
            title: 'IRAN - State Sponsor of Terror',
            content: \`Largest state sponsor of terrorism: Funds Hamas, Hezbollah, Houthis, militias in Iraq/Syria. Pursuing nuclear weapons despite agreements. "Death to America" official government slogan; seeks regional hegemony. Destabilizes Middle East, threatens Israel, American forces, and allies. Funds terrorism globally, including plots against U.S. officials on American soil. Ayatollah Khamenei: Openly calls for destruction of Israel and America.\`,
          },
          {
            type: 'historical',
            title: 'NORTH KOREA - Nuclear Blackmailer',
            content: \`Developed nuclear weapons and ICBMs capable of reaching U.S. mainland. Sells weapons technology to other rogue states (Syria, Iran). Massive human rights abuses, concentration camps, starvation of population. Provocative missile tests, threats against South Korea and Japan. Kim Jong Un: Unpredictable dictator with weapons of mass destruction.\`,
          },
          {
            type: 'historical',
            title: 'RADICAL ISLAM - Ideological Enemy',
            content: \`ISIS, Al-Qaeda, Taliban: Seek to establish global caliphate, destroy Western civilization. Attacks on American soil: 9/11 (2,977 killed), Fort Hood, San Bernardino, Boston Marathon, etc. Persecution of Christians and minorities throughout Muslim-majority world. Revelation 20:4: Prophetic warnings about beheadings; ISIS literally beheaded Christians on camera. Bernard Lewis (historian): "If the fighters of the Third Reich... had their way, they would have worn their Nazi uniforms with pride... The same is true of radical Islamists today."\`,
          },
          {
            type: 'philosophical',
            title: 'Deterrence Principle',
            content: \`Weakness invites testing and aggression. Theodore Roosevelt: "Speak softly and carry a big stick." Adversaries respect strength, exploit weakness. Proverbs 25:26: "Like a muddied spring or a polluted well are the righteous who give way to the wicked."\`,
          },
        ],
        application: \`History is unambiguous: strong nations that prepare for war experience longer periods of peace. Weak nations that disarm invite aggression.\`,
      },
      {
        id: 'arg-3',
        title: \`The Freedom and Civilization Defense Argument: America's Role in Preserving Liberty\`,
        summary: \`America, founded on Judeo-Christian principles, has a unique responsibility to defend freedom — not for empire, but because when America retreats, tyranny advances.\`,
        outlinePoints: [
          \`Matthew 5:14-16: "You are the light of the world... let your light shine before others, that they may see your good deeds and glorify your Father in heaven"\`,
          \`Ronald Reagan: "If we lose freedom here, there is no place to escape to. This is the last stand on earth"\`,
          \`John Winthrop: "We shall be as a city upon a hill, the eyes of all people are upon us"\`,
          \`U.S. sacrificed treasure and blood to liberate Europe (WWI, WWII), Asia (WWII, Korea), Middle East (Kuwait)\`,
          \`No territorial conquest; rebuilt former enemies (Marshall Plan, Japan, Germany)\`,
        ],
        evidence: [
          {
            type: 'scripture',
            title: 'Biblical Principle of Light in Darkness',
            content: \`Matthew 5:14-16: "You are the light of the world... let your light shine before others, that they may see your good deeds and glorify your Father in heaven." Philippians 2:15: "So that you may become blameless and pure, 'children of God without fault in a warped and crooked generation.' Then you will shine among them like stars in the sky." America, founded on Judeo-Christian principles, has responsibility to defend freedom.\`,
          },
          {
            type: 'historical',
            title: 'Religious Freedom at Stake',
            content: \`China: Arrests pastors, destroys churches, persecutes Muslims, bans Bibles. Russia: Restricts religious expression, persecution of evangelical Christians. Iran: Death penalty for converting from Islam, imprisons Christians. North Korea: Rated worst country for Christian persecution; owning Bible = death. Radical Islam: Systematically eliminates Christianity from Middle East. Hebrews 13:3: "Continue to remember those in prison... and those who are mistreated."\`,
          },
          {
            type: 'historical',
            title: 'Human Rights and Dignity at Stake',
            content: \`China: Social credit system, surveillance state, organ harvesting, forced abortions. Russia: Political assassinations, poisonings, imprisonment of dissidents. Iran: Executes homosexuals, oppresses women, public hangings including children. North Korea: Generational punishment camps, deliberate starvation, totalitarian control. ISIS: Sex slavery, genocide of Yazidis, mass executions. Genesis 1:27: Human dignity comes from being made in God's image; these regimes systematically violate this.\`,
          },
          {
            type: 'historical',
            title: 'Economic Freedom at Stake',
            content: \`Authoritarian states practice state-controlled economies, theft, corruption. Free markets require rule of law, property rights, limited government. Proverbs 13:11: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow." American economic strength enables military strength; both preserve liberty.\`,
          },
          {
            type: 'quote',
            title: 'Philosophical Support',
            content: \`Edmund Burke: "The only thing necessary for the triumph of evil is for good men to do nothing." Aleksandr Solzhenitsyn (Soviet dissident): "A decline in courage may be the most striking feature that an outside observer notices in the West today." Martin Luther King Jr.: "Injustice anywhere is a threat to justice everywhere." Winston Churchill: "Never give in—never, never, never, never."\`,
          },
        ],
        application: \`America does not seek empire — it rebuilt former enemies (Marshall Plan, Japan, Germany) and made no territorial conquest. But when America retreats, tyranny fills the vacuum. The freedoms that allow the Gospel to spread depend on the strength that protects them.\`,
      },
      {
        id: 'arg-4',
        title: 'The Strategic Preparedness Argument: Specific Capabilities for Specific Threats',
        summary: \`Prudent preparation requires specific capabilities matched to specific threats — military superiority, intelligence, alliances, energy independence, border security, and technological edge.\`,
        outlinePoints: [
          \`Proverbs 22:3: "The prudent see danger and take refuge, but the simple keep going and pay the penalty"\`,
          \`Naval dominance to counter China's fleet and protect sea lanes\`,
          \`Nuclear triad modernization — deterrent against Russia, China, North Korea\`,
          \`Ecclesiastes 4:12: "Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken"\`,
          \`Border security: Prevents terrorist infiltration; fentanyl from China via Mexico kills 100,000+ Americans annually\`,
        ],
        evidence: [
          {
            type: 'scripture',
            title: 'Biblical Wisdom on Preparation',
            content: \`Proverbs 22:3: "The prudent see danger and take refuge, but the simple keep going and pay the penalty." Proverbs 27:12: "The prudent see danger and take refuge, but the simple keep going and suffer for it." Luke 12:39: "If the owner of the house had known at what hour the thief was coming, he would not have let his house be broken into."\`,
          },
          {
            type: 'historical',
            title: 'Military Superiority Required',
            content: \`Naval dominance to counter China's fleet and protect sea lanes. Air superiority to deter Russian and Chinese advanced fighters. Nuclear triad modernization (deterrent against Russia, China, North Korea). Space capabilities (China and Russia developing anti-satellite weapons). Cyber warfare defense: Critical infrastructure protection against attacks. General James Mattis: "If you don't fund the State Department fully, then I need to buy more ammunition."\`,
          },
          {
            type: 'historical',
            title: 'Intelligence Gathering',
            content: \`Human intelligence (HUMINT) to penetrate terror networks. Signals intelligence (SIGINT) to monitor hostile communications. Satellite reconnaissance to track military buildups. Counterintelligence to prevent espionage (China operates massive spy networks in U.S.). Proverbs 20:18: "Plans are established by seeking advice; so if you wage war, obtain guidance." Proverbs 24:6: "Victory is won through many advisers."\`,
          },
          {
            type: 'historical',
            title: 'Alliance Building',
            content: \`NATO: United front against Russian aggression. AUKUS (Australia, UK, US): Counter China in Indo-Pacific. Abraham Accords: Arab-Israeli peace strengthens against Iran. Quad (US, Japan, India, Australia): Democratic coalition against Chinese expansion. Japan and South Korea: Critical allies against North Korea and China. Ecclesiastes 4:12: "Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken."\`,
          },
          {
            type: 'historical',
            title: 'Energy Independence and Border Security',
            content: \`Energy independence reduces funding to hostile regimes (Russia, Iran, Venezuela). Strategic advantage in conflicts (Europe's dependence on Russian gas enabled Putin). Genesis 1:28: Stewardship includes responsible development of resources. Fracking revolution weakened OPEC, reduced Iranian leverage. Border security prevents terrorist infiltration (ISIS repeatedly threatens southern border attacks). Stops drug trafficking (fentanyl from China via Mexico kills 100,000+ Americans annually). Nehemiah 7:3: Gates controlled and guarded for security.\`,
          },
          {
            type: 'historical',
            title: 'Technological Edge and Famous Military Thinkers',
            content: \`AI and machine learning for defense applications. Hypersonic weapons (China and Russia developing; U.S. must maintain parity). Directed energy weapons (lasers, electromagnetic pulse). Quantum computing (encryption and code-breaking implications). Autonomous systems and robotics. Whoever dominates emerging technologies dominates future conflicts. Sun Tzu: "The supreme art of war is to subdue the enemy without fighting" (requires overwhelming strength). Dwight Eisenhower: "Neither a wise man nor a brave man lies down on the tracks of history to wait for the train of the future to run over him." Douglas MacArthur: "In war there is no substitute for victory."\`,
          },
        ],
        application: \`Prudent preparation requires specific capabilities matched to specific threats. The prudent see danger and prepare — the simple ignore it and pay the penalty.\`,
      },
      {
        id: 'arg-5',
        title: 'The Ideological Warfare Argument: Defending Truth Against Tyranny',
        summary: \`America's adversaries recognize they are in an ideological war with the West. Christians cannot remain neutral when evil advances — supporting strong national defense is a moral imperative.\`,
        outlinePoints: [
          \`Ephesians 6:12: "Our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world"\`,
          \`Marxist-Leninist ideology: Atheistic materialism denies God — historical record: 100+ million deaths under communism\`,
          \`Chinese Social Control Model: AI-powered surveillance, social credit system being exported globally\`,
          \`Revelation 13:16-17: Prophetic warning about control systems preventing buying/selling\`,
          \`Dietrich Bonhoeffer: German pastor who opposed Nazis, understood need to resist evil with force\`,
        ],
        evidence: [
          {
            type: 'scripture',
            title: 'Biblical Framework for Spiritual Battle',
            content: \`Ephesians 6:12: "For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms." 2 Corinthians 10:4-5: "The weapons we fight with are not the weapons of the world... We demolish arguments and every pretension that sets itself up against the knowledge of God." John 8:32: "Then you will know the truth, and the truth will set you free."\`,
          },
          {
            type: 'historical',
            title: \`Marxist-Leninist Ideology (China, Russia's heritage)\`,
            content: \`Atheistic materialism denies God, elevates state. Historical record: 100+ million deaths under communism (Mao, Stalin, Pol Pot). Suppresses religion, individual rights, family. Colossians 2:8: "See to it that no one takes you captive through hollow and deceptive philosophy." R.J. Rummel: "Power kills; absolute power kills absolutely."\`,
          },
          {
            type: 'historical',
            title: 'Islamic Totalitarianism and Personality Cult Totalitarianism',
            content: \`Islamic Totalitarianism (Iran, Radical Islam): Theocratic tyranny, forced conversion, death for apostasy. Women as property, no religious freedom, barbaric punishments. Goal: Global sharia law, elimination of "infidels." Revelation 20:4: Describes martyrs "beheaded because of their testimony about Jesus" — ISIS literally fulfilled this. Personality Cult Totalitarianism (North Korea): Kim family deified, replaces God. Complete thought control, generational punishment. Most closed society on earth. Daniel 3: Nebuchadnezzar's demand for worship parallels Kim regime.\`,
          },
          {
            type: 'historical',
            title: 'Chinese Social Control Model',
            content: \`Social credit system: Total surveillance, behavioral manipulation. AI-powered tracking of every citizen. Punishment for wrong thoughts, associations, religious belief. Exporting this model globally through technology. Revelation 13:16-17: Prophetic warning about control systems preventing buying/selling. These regimes recognize they're in ideological war with the West. They promote moral relativism, undermine confidence in freedom and faith. Fund propaganda, influence operations, subversion in America. Chinese Unrestricted Warfare doctrine: All aspects of society are battlefields. Russian "Active Measures": Disinformation, sowing division, corrupting institutions.\`,
          },
          {
            type: 'quote',
            title: 'Historical Lessons',
            content: \`Dietrich Bonhoeffer: German pastor who opposed Nazis, understood need to resist evil with force. C.S. Lewis: "Enemy-occupied territory — that is what this world is." Martin Niemöller: "First they came for... then they came for me — and there was no one left to speak for me." Appeasement of evil leads to catastrophe. Thomas Aquinas: Just war theory — defending innocent from aggression is morally obligatory. Augustine: "Peace is not the absence of conflict, but the presence of justice." William F. Buckley Jr.: "I'd rather entrust the government of the United States to the first 400 people listed in the Boston telephone directory than to the faculty of Harvard University."\`,
          },
          {
            type: 'scripture',
            title: 'Christian Response',
            content: \`1 Peter 3:15: "Always be prepared to give an answer... with gentleness and respect." Cannot remain neutral when evil advances. Proverbs 29:2: "When the righteous thrive, the people rejoice; when the wicked rule, the people groan." Supporting strong national defense is moral imperative.\`,
          },
        ],
        application: \`America's adversaries recognize they are in an ideological war with the West. Christians cannot remain neutral. The same truth that sets individuals free (John 8:32) must be defended at the national level against ideologies that systematically suppress it.\`,
      },
    ],
    defenseTips: [
      'Biblical Balance: Strength AND Wisdom',
      'Avoiding Extremes:',
      \`Not Isolationism: Proverbs 18:1: "An unfriendly person pursues selfish ends and against all sound judgment starts quarrels." America cannot retreat from world; threats follow us home. 9/11 proved oceans don't protect us anymore. Evil unchecked grows stronger.\`,
      \`Not Endless War: Ecclesiastes 3:8: "A time for war and a time for peace." Military force is tool, not first resort. Must have clear objectives, exit strategies. James 4:1-2: "What causes fights and quarrels among you?" — examine motives.\`,
      \`Wisdom in Application: Proverbs 20:18: "Plans are established by seeking advice; so if you wage war, obtain guidance." Diplomacy backed by strength (Reagan: "Trust but verify"). Economic pressure before military force when possible. Proportional response, not over-reaction or under-reaction. Matthew 10:16: "Be as shrewd as snakes and as innocent as doves."\`,
      'Practical Policy Positions — What Strong National Security Requires:',
      \`1. Defense Budget: Maintain technological and numerical superiority. Currently ~3% GDP; historically 5-6% during threats. Isaiah 2:4 describes future peace, but we're not there yet.\`,
      '2. Intelligence Community: Robust funding and legal authorities. Balance security with civil liberties. Oversight to prevent abuse while maintaining effectiveness.',
      '3. Cyber Defense: Protect critical infrastructure (power, water, financial systems). China and Russia constantly probe U.S. systems. Offensive cyber capabilities to deter attacks.',
      '4. Space Force: Prevent adversaries from weaponizing space. Satellites critical for communications, GPS, early warning. China developing anti-satellite weapons.',
      '5. Nuclear Modernization: Aging arsenal requires updates. Submarines, bombers, missiles — triad ensures deterrence. New threats (Chinese expansion, Russian violations) require modern capabilities.',
      '6. Border Security: Wall, technology, personnel. Prevent terrorist infiltration and drug trafficking. Sovereignty requires knowing who enters.',
      '7. Energy Dominance: Produce more than we consume. Starves funding to hostile regimes. Strategic flexibility in conflicts.',
      \`8. Alliance Strengthening: NATO, Pacific partners, Middle East allies. Collective security more effective than going alone. Ecclesiastes 4:9: "Two are better than one."\`,
      '9. Economic Pressure: Sanctions on hostile regimes. Cut off funding for weapons programs and terrorism. Penalize human rights abuses.',
      '10. Information Warfare: Counter propaganda and disinformation. Truth is weapon against lies. Support dissidents, broadcast freedom\'s message.',
      'Addressing Counterarguments:',
      \`"Military spending takes from the poor": Government's first duty is security (Romans 13). Dead citizens can't be helped; defense preserves ability to help others. America's prosperity (enabled by security) funds massive humanitarian aid. Nehemiah 4: Built wall while helping poor — both/and, not either/or.\`,
      \`"We should focus on domestic issues": False choice — can do both. Threats don't wait for convenient timing. Domestic prosperity requires stable international order. 9/11 killed nearly 3,000, cost trillions — prevention cheaper than response.\`,
      \`"Diplomacy, not military strength": Diplomacy without strength is begging. Theodore Roosevelt: "Speak softly and carry a big stick." Adversaries respect power, exploit weakness. Reagan achieved peace through strength, not appeasement.\`,
      \`"Christians should be pacifists": Jesus commanded personal forgiveness, not national defense abdication. Luke 22:36: "If you don't have a sword, sell your cloak and buy one." Romans 13:4: Government "does not bear the sword for no reason." Ecclesiastes 3:8: "A time for war and a time for peace." Just war tradition (Augustine, Aquinas): Defending innocent is righteous.\`,
      \`"This is fear-mongering": Prudent recognition of real threats, not paranoia. Proverbs 27:12: "The prudent see danger and take refuge." China, Russia, Iran, North Korea openly hostile in words and deeds. Ignoring threats doesn't make them disappear.\`,
      \`The Christian's Response: Pray AND Prepare\`,
      \`1. Prayer for Leaders and Nation: 1 Timothy 2:1-2: Pray for those in authority. 2 Chronicles 7:14: "If my people... will humble themselves and pray." Spiritual warfare precedes physical (Ephesians 6:12).\`,
      '2. Support for Righteous Strength: Advocate for strong defense. Support military members and veterans. Elect leaders who understand threats. Stay informed about national security.',
      \`3. Trust in God's Sovereignty: Psalm 20:7: "Some trust in chariots and some in horses, but we trust in the name of the LORD our God." Prepare militarily while trusting ultimately in God. Proverbs 21:31: "The horse is made ready for the day of battle, but victory rests with the LORD."\`,
      'Final Biblical Encouragement:',
      \`Psalm 144:1: "Praise be to the LORD my Rock, who trains my hands for war, my fingers for battle."\`,
      \`2 Samuel 22:33-35: "It is God who arms me with strength... He trains my hands for battle."\`,
      \`Nehemiah 4:14: "Fight for your families, your sons and your daughters, your wives and your homes."\`,
      \`Psalm 33:12: "Blessed is the nation whose God is the LORD."\`,
      \`Ronald Reagan: "Freedom is never more than one generation away from extinction. We didn't pass it to our children in the bloodstream. It must be fought for, protected, and handed on for them to do the same."\`,
    ],
  },
];
`;

writeFileSync(filePath, kept.join('\n') + newSection);
console.log('[v0] File written. Total lines:', (kept.join('\n') + newSection).split('\n').length);
