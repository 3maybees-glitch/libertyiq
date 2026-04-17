"use client"

import { useMemo, useState } from "react"
import { BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ReferenceItem = {
  citation: string
  note?: string
}

type TopicReferences = {
  topicId: string
  topicTitle: string
  references: ReferenceItem[]
}

const referencesData: TopicReferences[] = [
  {
    topicId: "pro-life",
    topicTitle: "Pro-Life",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Psalm 139:13–16; Jeremiah 1:5; Luke 1:41–44; Exodus 20:13; Genesis 1:27; Proverbs 31:8–9; Psalm 82:3–4; Matthew 25:40.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "American College of Pediatricians. Position statements and materials on when human life begins.",
        note: "Used in the Scientific Argument.",
      },
      {
        citation:
          "Lejeune, Jérôme. Statements and writings on genetics and the beginning of human life.",
        note: "Used in the Scientific Argument.",
      },
      {
        citation:
          "Aquinas, Thomas. Writings on natural law and the preservation of human life.",
        note: "Used in the Natural Law Argument.",
      },
      {
        citation:
          "The Declaration of Independence. United States, 1776.",
        note: 'Used for the phrase "Life, Liberty and the pursuit of Happiness."',
      },
      {
        citation:
          "Teresa, Mother. Public statements and speeches on abortion.",
        note: "Used in the Moral Argument.",
      },
      {
        citation:
          "Bonhoeffer, Dietrich. Ethics and related writings concerning human dignity and unborn life.",
        note: "Used in the Moral Argument.",
      },
      {
        citation:
          "Lewis, C. S. The Abolition of Man.",
        note: "Used in the Consequences Argument.",
      },
    ],
  },
  {
    topicId: "illegal-immigration",
    topicTitle: "Illegal Immigration",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Romans 13:1–2; Titus 3:1; 1 Peter 2:13–14; Acts 17:26; Luke 14:28–30; 1 Timothy 5:8; Leviticus 19:15; Deuteronomy 16:20; Nehemiah 4:9, 14; Ruth 1:16; Leviticus 19:33–34; Matthew 25:35; Hebrews 13:2.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "Friedman, Milton. Writings and public statements on immigration and the welfare state.",
        note: "Used in the Stewardship Argument.",
      },
      {
        citation:
          "Aquinas, Thomas. Writings on prudence, governance, and the common good.",
        note: "Used in the Stewardship Argument.",
      },
      {
        citation:
          "King Jr., Martin Luther. Speeches and writings on justice.",
        note: 'Used for the quote "Injustice anywhere is a threat to justice everywhere."',
      },
      {
        citation:
          "Reagan, Ronald. Public statements on borders and national sovereignty.",
        note: "Used in the Security Argument.",
      },
      {
        citation:
          "Churchill, Winston. Public statements on government's duty to protect citizens.",
        note: "Used in the Security Argument.",
      },
      {
        citation:
          "Roosevelt, Theodore. Speeches and writings on assimilation and American identity.",
        note: "Used in the Assimilation Argument.",
      },
      {
        citation:
          "Sowell, Thomas. Writings on immigration, assimilation, and social cohesion.",
        note: "Used in the Assimilation Argument.",
      },
    ],
  },
  {
    topicId: "second-amendment",
    topicTitle: "Second Amendment",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Luke 22:36; Exodus 22:2–3; Nehemiah 4:13–14; 1 Timothy 5:8; Proverbs 22:3; Ecclesiastes 3:3, 8; 1 Samuel 8:10–18; Jeremiah 17:9; Mark 7:20–23; Proverbs 27:12; Luke 14:28; Proverbs 28:1.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "U.S. Constitution. Amendment II.",
        note: "Core constitutional reference.",
      },
      {
        citation:
          "District of Columbia v. Heller, 554 U.S. 570 (2008).",
        note: "Used in the Constitutional Argument.",
      },
      {
        citation:
          "Washington, George. Statements commonly attributed regarding arms and liberty.",
        note: "Verify exact wording before publication.",
      },
      {
        citation:
          "Jefferson, Thomas. Writings and statements on the use of arms and resistance to tyranny.",
        note: "Verify exact wording before publication.",
      },
      {
        citation:
          "Adams, Samuel. Writings and speeches regarding arms and liberty.",
        note: "Verify exact wording before publication.",
      },
      {
        citation:
          "Madison, James. Federalist-era writings and commentary on an armed citizenry.",
        note: "Used in the Constitutional Argument.",
      },
      {
        citation:
          "Lott, John. More Guns, Less Crime.",
        note: "Used in the Deterrence Argument.",
      },
      {
        citation:
          "Warren v. District of Columbia, 444 A.2d 1 (D.C. App. 1981).",
        note: "Used in the Deterrence Argument.",
      },
      {
        citation:
          "LaPierre, Wayne. Public statements on armed self-defense.",
        note: 'Used for the quote "The only thing that stops a bad guy with a gun is a good guy with a gun."',
      },
      {
        citation:
          "Rummel, R. J. Works on democide and death by government.",
        note: "Used in the Tyranny Prevention Argument.",
      },
      {
        citation:
          "Burke, Edmund. Political writings on liberty and delusion.",
        note: "Used in the Tyranny Prevention Argument.",
      },
      {
        citation:
          "Lewis, C. S. Writings on tyranny.",
        note: "Used in the Tyranny Prevention Argument.",
      },
      {
        citation:
          "Solzhenitsyn, Aleksandr. Gulag-era reflections on state terror and resistance.",
        note: "Used in the Tyranny Prevention Argument.",
      },
      {
        citation:
          "Sowell, Thomas. Writings on gun control and law-abiding citizens.",
        note: "Used in the Logical Fallacy Argument.",
      },
      {
        citation:
          "Franklin, Benjamin. Statements on liberty and safety.",
        note: "Verify exact wording before publication.",
      },
      {
        citation:
          "Reagan, Ronald. Statements on lawbreakers and responsibility.",
        note: "Used in the Logical Fallacy Argument.",
      },
      {
        citation:
          "Adams, John. Writings on the Constitution and moral people.",
        note: "Used in the section on what actually reduces violence.",
      },
    ],
  },
  {
    topicId: "marriage-one-man-one-woman",
    topicTitle: "Marriage – One Man-One Woman",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Genesis 1:27–28; Genesis 2:24; Matthew 19:4–6; Ephesians 5:22–33; Mark 10:6–9; Romans 1:26–27; Malachi 2:15; Psalm 127:3; Proverbs 22:6; Ephesians 6:1–4; Isaiah 5:20; 2 Timothy 4:3; Matthew 10:22; Genesis 11; Romans 1:25; 2 Timothy 3:16; Jude 1:3; Matthew 22:39; 1 Peter 3:15; Ephesians 4:15; Matthew 5:17–18; 1 Corinthians 6:9–11; Romans 5:12; Leviticus 18:22; 1 Timothy 1:9–10; Colossians 4:6; John 8:32; Galatians 1:10; Acts 5:29.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "Aquinas, Thomas. Writings on natural law, procreation, and complementarity.",
        note: "Used in the Natural Law Argument.",
      },
      {
        citation:
          "Lewis, C. S. Christian reflections on sexuality and purpose.",
        note: "Used in the Natural Law Argument.",
      },
      {
        citation:
          "Aristotle. Works on form, function, essence, and the family as social foundation.",
        note: "Used in multiple arguments.",
      },
      {
        citation:
          "Wilcox, W. Bradford. Research on child outcomes in married biological-parent households.",
        note: "Used in the Children's Welfare Argument.",
      },
      {
        citation:
          "Popenoe, David. Research and writings on fathers, mothers, and family structure.",
        note: "Used in the Children's Welfare Argument.",
      },
      {
        citation:
          "Mead, Margaret. Anthropological writings on family and society.",
        note: "Used in the Children's Welfare Argument.",
      },
      {
        citation:
          "Masterpiece Cakeshop, Ltd. v. Colorado Civil Rights Commission, 584 U.S. ___ (2018).",
        note: "Used in the Religious Liberty Argument.",
      },
      {
        citation:
          "Orwell, George. Writings on liberty and truth-telling.",
        note: "Used in the Religious Liberty Argument.",
      },
      {
        citation:
          "Tocqueville, Alexis de. Democracy in America.",
        note: "Used in the Religious Liberty Argument.",
      },
      {
        citation:
          "Locke, John. Writings on conscience and religious liberty.",
        note: "Used in the Religious Liberty Argument.",
      },
      {
        citation:
          "Scalia, Antonin. Obergefell dissent and related judicial writings.",
        note: "Used in the Religious Liberty Argument.",
      },
      {
        citation:
          "Plato. Writings on forms and essential natures.",
        note: "Used in the Definitional Argument.",
      },
      {
        citation:
          "Chesterton, G. K. Writings on institutions and tradition.",
        note: "Used in the Definitional Argument.",
      },
      {
        citation:
          "Scruton, Roger. Conservative writings on institutions and social meaning.",
        note: "Used in the Definitional Argument.",
      },
      {
        citation:
          "Kirk, Russell. Conservative thought on prudence and institutions.",
        note: "Used in the Definitional Argument.",
      },
      {
        citation:
          "Burke, Edmund. Reflections on society, continuity, and inheritance.",
        note: "Used in the Definitional Argument.",
      },
    ],
  },
  {
    topicId: "pro-israel",
    topicTitle: "Pro-Israel",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Genesis 12:1–3; Genesis 15:18; Genesis 17:7–8; Psalm 105:8–11; Romans 11:1–2, 25–29; Jeremiah 31:35–37; Matthew 23:39; Psalm 137:5–6; Matthew 7:16–20; Proverbs 27:10; Proverbs 17:17; Ecclesiastes 4:9–12; Ezekiel 37:21–22; Isaiah 66:8; Jeremiah 16:14–15; Zephaniah 3:9; Isaiah 35:1–2; Ezekiel 36:33–35; Zechariah 12:2–3, 10; Luke 21:24; Zechariah 14:4; Proverbs 31:8–9; 1 Chronicles 16:15–18; Psalm 122:6; Galatians 3:28; Isaiah 62:1; Psalm 129:5; Joel 3:2; Zechariah 2:8.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "The Balfour Declaration (1917).",
        note: "Used in the Historical and Legal Argument.",
      },
      {
        citation:
          "San Remo Conference resolutions (1920).",
        note: "Used in the Historical and Legal Argument.",
      },
      {
        citation:
          "League of Nations Mandate for Palestine (1922).",
        note: "Used in the Historical and Legal Argument.",
      },
      {
        citation:
          "United Nations Partition Plan for Palestine (1947).",
        note: "Used in the Historical and Legal Argument.",
      },
      {
        citation:
          "Israeli Declaration of Independence (1948).",
        note: "Used in the Historical and Legal Argument.",
      },
      {
        citation:
          "Peters, Joan. From Time Immemorial.",
        note: "Used in the Historical and Legal Argument.",
      },
      {
        citation:
          "Twain, Mark. The Innocents Abroad.",
        note: "Used for observations on nineteenth-century Palestine.",
      },
      {
        citation:
          "Meir, Golda. Speeches and public statements.",
        note: "Used in the Moral and Democratic Argument and counterarguments section.",
      },
      {
        citation:
          "Prager, Dennis. Public commentary on Israel and Arab-Israeli conflict.",
        note: "Used in the Moral and Democratic Argument.",
      },
      {
        citation:
          "Yousef, Mosab Hassan. Writings and interviews.",
        note: "Used in the Moral and Democratic Argument.",
      },
      {
        citation:
          "Oren, Michael. Writings on Israeli history and national rebirth.",
        note: "Used in the Moral and Democratic Argument.",
      },
      {
        citation:
          "Adams, John. Statements regarding the Hebrews and civilization.",
        note: "Used in the Strategic Alliance Argument.",
      },
      {
        citation:
          "Netanyahu, Benjamin. Public statements on the U.S.-Israel alliance.",
        note: "Used in the Strategic Alliance Argument.",
      },
      {
        citation:
          "Reagan, Ronald. Statements on Israel’s right to exist and secure borders.",
        note: "Used in the Strategic Alliance Argument.",
      },
      {
        citation:
          "King Jr., Martin Luther. Statements on Zionism and antisemitism.",
        note: "Used in the Strategic Alliance Argument.",
      },
      {
        citation:
          "Spurgeon, Charles. Sermons and writings on the restoration of the Jews.",
        note: "Used in the Prophetic Argument.",
      },
      {
        citation:
          "ten Boom, Corrie. Writings and public statements.",
        note: "Used in the Prophetic Argument.",
      },
      {
        citation:
          "Graham, Billy. Statements on the Jewish people.",
        note: "Used in the Prophetic Argument.",
      },
      {
        citation:
          "Eban, Abba. Public statements on Palestinian leadership and missed peace opportunities.",
        note: "Used in the compassion and counterarguments section.",
      },
      {
        citation:
          "Rostow, Eugene. Writings on Jewish settlement and legal claims in disputed territories.",
        note: "Used in the counterarguments section.",
      },
      {
        citation:
          "Kemp, Richard. Statements on Israeli military conduct in combat zones.",
        note: "Used in the counterarguments section.",
      },
      {
        citation:
          "Zoabi, Muhammad. Public statements as an Israeli Arab on Israel and apartheid claims.",
        note: "Used in the counterarguments section.",
      },
    ],
  },
  {
    topicId: "strong-national-security",
    topicTitle: "Strong National Security",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Romans 13:1–4; 1 Timothy 2:1–2; Nehemiah 4:14, 17–18; Proverbs 21:31; Psalm 82:3–4; Proverbs 24:5–6; Ecclesiastes 3:8; Luke 14:31–32; Proverbs 25:26; Matthew 5:14–16; Philippians 2:15; Hebrews 13:3; Genesis 1:27; Proverbs 13:11; Proverbs 22:3; Proverbs 27:12; Luke 12:39; Proverbs 20:18; Proverbs 24:6; Ecclesiastes 4:12; Genesis 1:28; Ephesians 6:12; 2 Corinthians 10:4–5; John 8:32; Colossians 2:8; Revelation 20:4; Daniel 3; Revelation 13:16–17; 1 Peter 3:15; Proverbs 29:2; Proverbs 18:1; James 4:1–2; Matthew 10:16; 2 Chronicles 7:14; Psalm 20:7; Psalm 144:1; 2 Samuel 22:33–35; Psalm 33:12.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "Reagan, Ronald. Speeches on peace through strength and freedom.",
        note: "Used in several arguments and conclusion.",
      },
      {
        citation:
          "Washington, George. Statements on preparedness and preserving peace.",
        note: "Used in the Peace Through Strength Argument.",
      },
      {
        citation:
          "Milley, Mark. Statements on China as the pacing threat.",
        note: "Used in the section on specific threats.",
      },
      {
        citation:
          "Churchill, Winston. Statements on appeasement and perseverance.",
        note: "Used in several arguments.",
      },
      {
        citation:
          "Lewis, Bernard. Writings on radical Islam.",
        note: "Used in the section on Radical Islam.",
      },
      {
        citation:
          "Roosevelt, Theodore. Statements on speaking softly and carrying a big stick.",
        note: "Used in deterrence and counterarguments.",
      },
      {
        citation:
          "Winthrop, John. “A Modell of Christian Charity.”",
        note: 'Used for the phrase "city upon a hill."',
      },
      {
        citation:
          "Burke, Edmund. Writings on evil and inaction.",
        note: "Used in the Freedom and Civilization Defense Argument.",
      },
      {
        citation:
          "Solzhenitsyn, Aleksandr. Writings on courage and the West.",
        note: "Used in the Freedom and Civilization Defense Argument.",
      },
      {
        citation:
          "King Jr., Martin Luther. Writings on injustice anywhere being a threat to justice everywhere.",
        note: "Used in the Freedom and Civilization Defense Argument.",
      },
      {
        citation:
          "Mattis, James. Public statements on diplomacy and defense funding.",
        note: "Used in the Strategic Preparedness Argument.",
      },
      {
        citation:
          "Sun Tzu. The Art of War.",
        note: "Used in the Strategic Preparedness Argument.",
      },
      {
        citation:
          "Eisenhower, Dwight D. Speeches and public statements.",
        note: "Used in the Strategic Preparedness Argument.",
      },
      {
        citation:
          "MacArthur, Douglas. Speeches and military writings.",
        note: "Used in the Strategic Preparedness Argument.",
      },
      {
        citation:
          "Rummel, R. J. Works on totalitarian power and mass death.",
        note: "Used in the Ideological Warfare Argument.",
      },
      {
        citation:
          "Bonhoeffer, Dietrich. Writings and life example regarding resistance to evil.",
        note: "Used in the Ideological Warfare Argument.",
      },
      {
        citation:
          "Lewis, C. S. Mere Christianity and related writings.",
        note: 'Used for the phrase "Enemy-occupied territory."',
      },
      {
        citation:
          "Niemöller, Martin. Public statements on totalitarianism and silence.",
        note: "Used in the Ideological Warfare Argument.",
      },
      {
        citation:
          "Aquinas, Thomas. Just war theory writings.",
        note: "Used in the Ideological Warfare Argument and pacifism counterargument.",
      },
      {
        citation:
          "Augustine. Writings on peace, justice, and just war.",
        note: "Used in the Ideological Warfare Argument and pacifism counterargument.",
      },
      {
        citation:
          "Buckley Jr., William F. Public statements and writings.",
        note: "Used in the Ideological Warfare Argument.",
      },
    ],
  },
  {
    topicId: "anti-climate-alarmists",
    topicTitle: "Anti-Climate Alarmists",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. Genesis 1:28–30; Genesis 2:15; Psalm 115:16; 1 Timothy 6:17; Proverbs 27:23–27; Deuteronomy 8:7–9; Matthew 25:14–30; Proverbs 13:22; Psalm 24:1; Proverbs 19:2; Ecclesiastes 1:9; Genesis 1:11–12; Proverbs 14:31; 1 Timothy 5:8; John 10:10; Proverbs 31:8–9; Genesis 41:33–36; Proverbs 20:18; Luke 14:28–30; Ecclesiastes 10:10; Genesis 1:28; Proverbs 24:27; Proverbs 27:12; Matthew 24:4–5; 2 Peter 2:1–3; 1 Timothy 4:1–4; Jeremiah 14:14; Revelation 21:4; Mark 13:32; Genesis 1:31; Psalm 8:5–6; Matthew 23:3; Romans 1:25; Colossians 1:16–17; Psalm 127:3–5; Acts 5:29; Genesis 8:22; Job 37:6–13; Psalm 104:5–9, 14–15; Matthew 8:26–27; Jeremiah 5:24; Psalm 19:1; 2 Timothy 1:7; Matthew 6:25–34; Philippians 4:6; 2 Peter 3:10–13; Revelation 21:1; Matthew 24:36; Proverbs 14:15; Revelation 11:18; Isaiah 40:28; Romans 8:28.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "Christy, John. Public statements and academic work on climate models and satellite data.",
        note: "Used in the Scientific Skepticism Argument.",
      },
      {
        citation:
          "Lindzen, Richard. Public statements and writings on climate sensitivity and alarmism.",
        note: "Used in the Scientific Skepticism Argument.",
      },
      {
        citation:
          "Moore, Patrick. Public statements and writings on climate alarmism.",
        note: "Used in the Scientific Skepticism Argument and counterarguments.",
      },
      {
        citation:
          "Curry, Judith. Public writings and commentary on uncertainty and politicization in climate science.",
        note: "Used in the Scientific Skepticism Argument.",
      },
      {
        citation:
          "Dyson, Freeman. Public statements on climate models.",
        note: "Used in the Scientific Skepticism Argument.",
      },
      {
        citation:
          "Popper, Karl. Writings on falsification and scientific method.",
        note: "Used in the Scientific Skepticism Argument.",
      },
      {
        citation:
          "Sowell, Thomas. Writings on knowledge, decision-making, and economics.",
        note: "Used in the Scientific Skepticism and economic sections.",
      },
      {
        citation:
          "Crichton, Michael. Public statements and essays on environmentalism and consensus.",
        note: "Used in the Scientific Skepticism and False Religion arguments.",
      },
      {
        citation:
          "Epstein, Alex. Fossil Future.",
        note: "Used in the Economic and Human Flourishing Argument.",
      },
      {
        citation:
          "Lomborg, Bjorn. Environmental and economic writings.",
        note: "Used in the Economic and Human Flourishing Argument.",
      },
      {
        citation:
          "Borlaug, Norman. Writings and public commentary on the Green Revolution.",
        note: "Used in the Economic and Human Flourishing Argument.",
      },
      {
        citation:
          "Simon, Julian. Writings on human ingenuity and resources.",
        note: "Used in the Economic and Human Flourishing Argument.",
      },
      {
        citation:
          "Ridley, Matt. Writings on fossil fuels and prosperity.",
        note: "Used in the Economic and Human Flourishing Argument.",
      },
      {
        citation:
          "Shellenberger, Michael. Public statements and writings on renewable energy limitations.",
        note: "Used in the Practical Solutions Argument.",
      },
      {
        citation:
          "Lewis, C. S. Writings on tyranny exercised for the supposed good of victims.",
        note: "Used in the False Religion Argument.",
      },
      {
        citation:
          "Mencken, H. L. Political commentary on keeping the populace alarmed.",
        note: "Used in the False Religion Argument.",
      },
      {
        citation:
          "Chesterton, G. K. Writings on belief and unbelief.",
        note: "Used in the False Religion Argument.",
      },
      {
        citation:
          "Pielke Jr., Roger. Writings on extreme weather trends.",
        note: "Used in the counterarguments section.",
      },
      {
        citation:
          "NASA satellite data on global greening and plant growth.",
        note: "Used in the CO2 Context discussion.",
      },
      {
        citation:
          "Cook, John. Studies and commentary regarding consensus claims on climate change.",
        note: "Used in the counterarguments section; verify exact characterization before publication.",
      },
    ],
  },
  {
    topicId: "limited-government-and-deregulation",
    topicTitle: "Limited Government and Deregulation",
    references: [
      {
        citation:
          "The Holy Bible, King James Version. 1 Samuel 8:7, 10–18; Deuteronomy 17:14–20; Proverbs 29:2, 4, 18; Exodus 18:21; 1 Kings 12:1–11; 1 Kings 12:4; Romans 13:1–7; Acts 5:29; Matthew 22:21; Colossians 2:20–23; Deuteronomy 6:6–7; 1 Timothy 5:8; 2 Thessalonians 3:10; Jeremiah 17:9; Ecclesiastes 5:8; Proverbs 13:11; Proverbs 14:23; Proverbs 6:6–8; Genesis 47:24–26; Exodus 20:15, 17; Acts 5:4; Leviticus 25:23–28; Galatians 5:1, 13; 2 Corinthians 3:17; John 8:32; 1 Corinthians 7:23; Proverbs 22:7, 16; 2 Corinthians 9:7; Acts 2:44–45; Luke 16:10; Proverbs 27:23; Matthew 25:14–30; Proverbs 15:22; Romans 13:8; Deuteronomy 28:12, 44; Proverbs 13:22; Ezekiel 18:20; Proverbs 20:21; Proverbs 24:27; Proverbs 11:1; Leviticus 19:35–36; Proverbs 21:5, 20; Luke 14:28; Proverbs 19:17; Proverbs 23:4–5; Micah 6:8; Psalm 33:12; Proverbs 11:25.",
        note: "Primary biblical references used throughout the topic.",
      },
      {
        citation:
          "The Declaration of Independence. United States, 1776.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Locke, John. Second Treatise of Government and related writings.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Jefferson, Thomas. Political writings and public statements.",
        note: "Used in several arguments and conclusion.",
      },
      {
        citation:
          "Madison, James. Federalist writings and public statements on government.",
        note: "Used in the Individual Liberty Argument and debt section.",
      },
      {
        citation:
          "Franklin, Benjamin. Political writings and public statements.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Washington, George. Statements on government as force.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Lewis, C. S. Writings on tyranny and paternalistic control.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Hayek, Friedrich A. The Road to Serfdom and related works.",
        note: "Used in the Individual Liberty and inefficiency arguments.",
      },
      {
        citation:
          "Tocqueville, Alexis de. Democracy in America.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Silverglate, Harvey. Three Felonies a Day.",
        note: "Used in the Individual Liberty Argument.",
      },
      {
        citation:
          "Smith, Adam. The Wealth of Nations and related writings.",
        note: "Used in the Economic Freedom and inefficiency arguments.",
      },
      {
        citation:
          "Friedman, Milton. Capitalism and Freedom and related writings.",
        note: "Used in the Economic Freedom, political freedom, and inefficiency arguments.",
      },
      {
        citation:
          "Mises, Ludwig von. Writings on credit expansion and impoverishment.",
        note: "Used in the Economic Freedom Argument.",
      },
      {
        citation:
          "Laffer, Arthur. Writings on the Laffer Curve and taxation.",
        note: "Used in the Economic Freedom Argument.",
      },
      {
        citation:
          "Sowell, Thomas. Writings on regulation, incentives, and economic decision-making.",
        note: "Used in the Economic Freedom Argument.",
      },
      {
        citation:
          "Buchanan, James. Public Choice Theory and related writings.",
        note: "Used in the Inefficiency Argument.",
      },
      {
        citation:
          "Olasky, Marvin. The Tragedy of American Compassion.",
        note: "Used in the counterarguments section on safety nets.",
      },
      {
        citation:
          "Murray, Charles. Writings on welfare, dependency, and social decline.",
        note: "Used in the counterarguments section on welfare and class decline.",
      },
      {
        citation:
          "Thatcher, Margaret. Public statements on socialism and money.",
        note: "Used in the counterarguments section on social democracies.",
      },
      {
        citation:
          "Paine, Thomas. Common Sense and related political writings.",
        note: "Used in the conclusion.",
      },
      {
        citation:
          "Henry, Patrick. Public statements on restraining government.",
        note: "Used in the conclusion.",
      },
      {
        citation:
          "Lincoln, Abraham. Public statements on American self-destruction and freedom.",
        note: "Used in the conclusion.",
      },
      {
        citation:
          "Reagan, Ronald. Public statements on limited government and freedom.",
        note: "Used in the conclusion.",
      },
    ],
  },
]

export default function ReferencesButton({ fullWidth }: { fullWidth?: boolean }) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all")

  const filteredTopics = useMemo(() => {
    if (selectedTopicId === "all") return referencesData
    return referencesData.filter((topic) => topic.topicId === selectedTopicId)
  }, [selectedTopicId])

  const totalCount = useMemo(() => {
    return filteredTopics.reduce((sum, t) => sum + t.references.length, 0)
  }, [filteredTopics])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={fullWidth ? "w-full rounded-2xl" : "rounded-2xl"}>
          <BookOpen className="mr-2 h-4 w-4" />
          References / Works Cited
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col h-[90vh] w-[95vw] max-w-5xl overflow-hidden rounded-2xl p-0">

        {/* Header */}
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <FileText className="h-5 w-5 text-primary" />
              References / Works Cited
            </DialogTitle>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {totalCount} sources
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Verified bibliography — scripture, legal documents, academic works, and public statements.
          </DialogDescription>
        </DialogHeader>

        {/* Mobile: horizontal pill bar */}
        <div className="sm:hidden shrink-0 border-b overflow-x-auto">
          <div className="flex gap-2 px-4 py-3 w-max">
            {[{ topicId: "all", topicTitle: "All", references: referencesData.flatMap(t => t.references) }, ...referencesData].map((topic) => (
              <button
                key={topic.topicId}
                onClick={() => setSelectedTopicId(topic.topicId)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  selectedTopicId === topic.topicId
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {topic.topicTitle}
                <span className="ml-1 opacity-70">({topic.references.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body: sidebar + content (desktop) / content only (mobile) */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* Left sidebar — desktop only */}
          <nav className="hidden sm:flex shrink-0 flex-col w-52 border-r overflow-y-auto bg-muted/30 py-3">
            <button
              onClick={() => setSelectedTopicId("all")}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                selectedTopicId === "all"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              All Topics
              <span className="ml-1 text-xs opacity-60">
                ({referencesData.reduce((s, t) => s + t.references.length, 0)})
              </span>
            </button>
            {referencesData.map((topic) => (
              <button
                key={topic.topicId}
                onClick={() => setSelectedTopicId(topic.topicId)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-l-2 ${
                  selectedTopicId === topic.topicId
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {topic.topicTitle}
                <span className="ml-1 text-xs opacity-60">({topic.references.length})</span>
              </button>
            ))}
          </nav>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5">
            <div className="space-y-6">
              {filteredTopics.map((topic) => (
                <section key={topic.topicId}>
                  {selectedTopicId === "all" && (
                    <h3 className="text-base font-bold text-foreground mb-3 pb-2 border-b">
                      {topic.topicTitle}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {topic.references.length} sources
                      </span>
                    </h3>
                  )}
                  <ol className="space-y-3 list-none">
                    {topic.references.map((ref, index) => (
                      <li
                        key={`${topic.topicId}-${index}`}
                        className="flex gap-3 rounded-lg border bg-card p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                      >
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm leading-relaxed text-foreground">{ref.citation}</p>
                          {ref.note && (
                            <p className="mt-1.5 text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                              {ref.note}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
