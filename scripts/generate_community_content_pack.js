// SmithFit Community Content Pack Generator
// Run: NODE_PATH=/usr/local/lib/node_modules node scripts/generate_community_content_pack.js

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, WidthType, ShadingType, BorderStyle,
  HeadingLevel, PageNumber, Header, Footer
} = require('docx');
const fs = require('fs');

const OUTPUT = "27 Course Funnel/Docs created Claude/SmithFit Community Content Pack.docx";

const C = {
  va:          '1F4E79',
  membership:  '2E75B6',
  seeding:     '375623',
  video:       '7030A0',
  templates:   'C55A11',
  incentives:  '833C00',
  white:       'FFFFFF',
  lightBlue:   'DEEAF1',
  lightGreen:  'E2EFDA',
  lightPurple: 'EAD1DC',
  lightOrange: 'FCE4D6',
  lightGrey:   'F2F2F2',
  yellow:      'FFF2CC',
  darkText:    '1A1A1A',
};

const b1 = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const bs = { top: b1, bottom: b1, left: b1, right: b1 };

function banner(text, bg, size = 28) {
  return new Paragraph({
    spacing: { before: 320, after: 100 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    indent: { left: 120, right: 120 },
    children: [new TextRun({ text, bold: true, color: C.white, size, font: 'Arial' })],
  });
}

function subBanner(text, bg) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    indent: { left: 120, right: 120 },
    children: [new TextRun({ text, bold: true, color: C.white, size: 24, font: 'Arial' })],
  });
}

function h2(text, color = C.darkText) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color, size: 24, font: 'Arial' })],
  });
}

function h3(text, color = C.darkText) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, bold: true, color, size: 22, font: 'Arial' })],
  });
}

function body(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 20, font: 'Arial' })],
  });
}

function italic(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 20, font: 'Arial', italics: true })],
  });
}

function note(text, bg = C.yellow) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    indent: { left: 180, right: 180 },
    children: [new TextRun({ text, size: 20, font: 'Arial', italics: true })],
  });
}

function sp(h = 80) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun('')] });
}

function rule() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 4 } },
    children: [new TextRun('')],
  });
}

function pageBreak() {
  return new Paragraph({ pageBreakBefore: true, children: [new TextRun('')] });
}

function box(lines, bg = C.lightGrey) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    indent: { left: 180, right: 180 },
    children: lines.map((l, i) => new TextRun({ text: l + (i < lines.length - 1 ? '\n' : ''), size: 20, font: 'Arial' })),
  });
}

// Monospace-style text block for copy-paste templates
function copyBlock(lines, label) {
  const kids = [];
  if (label) kids.push(new TextRun({ text: label + '\n', bold: true, size: 18, font: 'Arial', color: C.va }));
  lines.forEach((l, i) => {
    kids.push(new TextRun({ text: l + (i < lines.length - 1 ? '\n' : ''), size: 19, font: 'Courier New' }));
  });
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { fill: 'F0F0F0', type: ShadingType.CLEAR },
    indent: { left: 180, right: 180 },
    children: kids,
  });
}

function promptRow(day, label, theme, prompt, postIn) {
  return new TableRow({
    children: [
      cell2(day, C.lightGrey, 600, true),
      cell2(label, C.white, 1800),
      cell2(theme, C.white, 1800),
      cell2(prompt, C.white, 3600, false, true),
      cell2(postIn, C.white, 1560),
    ],
  });
}

function cell2(text, bg, w, bold_ = false, wrap = false) {
  return new TableCell({
    borders: bs,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: bold_, size: 18, font: 'Arial', color: C.darkText })],
    })],
  });
}

function hRow(labels, widths, bg) {
  return new TableRow({
    children: labels.map((l, i) => new TableCell({
      borders: bs,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: l, bold: true, size: 18, font: 'Arial', color: C.white })],
      })],
    })),
  });
}

// ── CONTENT ─────────────────────────────────────────────────────────────────
const ch = [];

// COVER
ch.push(sp(1440));
ch.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 120 },
  children: [new TextRun({ text: 'SmithFit', bold: true, size: 64, font: 'Arial', color: C.membership })],
}));
ch.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 80 },
  children: [new TextRun({ text: 'Community Content Pack', bold: true, size: 40, font: 'Arial', color: C.darkText })],
}));
ch.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 240 },
  children: [new TextRun({ text: 'VA Prompts \u2022 Launch Posts \u2022 Video Scripts \u2022 Templates', size: 24, font: 'Arial', color: '666666', italics: true })],
}));
ch.push(sp(1440));

// ── SECTION 1: VA PROMPT BANK ────────────────────────────────────────────────
ch.push(pageBreak());
ch.push(banner('SECTION 1: Month 1 VA Prompt Bank (28 Days)', C.va));
ch.push(sp(80));
ch.push(body('VA pre-writes all prompts at the end of the prior month and schedules via GHL broadcasts. IJ and Coach Sony review and approve the monthly batch before it goes live. Rotate prompts \u2014 never repeat the same prompt in back-to-back weeks.'));
ch.push(sp(80));
ch.push(note('Post times: VA posts each prompt in the morning before the day\'s shift starts for most members. Suggested time: 7:00\u20138:00 AM local.'));
ch.push(sp(120));

// WEEK 1
ch.push(subBanner('Week 1 \u2014 New Member Activation', C.va));
ch.push(sp(80));
ch.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [600, 1800, 1800, 3600, 1560],
  rows: [
    hRow(['Day', 'Label', 'Theme', 'Prompt (copy/paste ready)', 'Post In'], [600, 1800, 1800, 3600, 1560], C.va),
    promptRow('Mon', 'Week 1 \u2022 Day 1', 'Intention Setting', '"What\u2019s one thing you want to feel differently about your body by the end of this month? Drop it below \u2014 we see it. \ud83d\udc40"', 'SmithFit FAM'),
    promptRow('Tue', 'Week 1 \u2022 Day 2', 'Education Post', '[Post excerpt from this month\u2019s Lesson 1] \u2014 e.g., \u201cWhy your belly fat is a cortisol problem, not a willpower problem.\u201d Full lesson in the app.', 'SmithFit FAM'),
    promptRow('Wed', 'Week 1 \u2022 Day 3', 'Call Reminder', '"Community call is TODAY at [TIME]. What\u2019s one question you\u2019ve been too afraid to ask? Drop it here \u2014 IJ might answer it live. \ud83d\udcde [ZOOM LINK]"', 'SmithFit FAM'),
    promptRow('Thu', 'Week 1 \u2022 Day 4', 'Wins Prompt', '"First Wins Board day of the week. Drop your win \u2014 any win. \u2018I drank water today\u2019 counts. \u2018I didn\u2019t stress eat after my shift\u2019 absolutely counts. Head to the Wins Board and post it. \ud83c\udfc6"', 'FAM + Wins Board'),
    promptRow('Fri', 'Week 1 \u2022 Day 5', 'Habit Check-In', '"Honest question: What\u2019s one thing you did this week that past-you wouldn\u2019t have done? Drop it below \u2014 even if it feels tiny."', 'SmithFit FAM'),
    promptRow('Sat', 'Week 1 \u2022 Day 6', 'Call Recap + Resource', '"Call recap is up in SmithFit FAM. Also dropping this week\u2019s resource: [RESOURCE NAME]. Save this for your next shift day."', 'SmithFit FAM'),
    promptRow('Sun', 'Week 1 \u2022 Day 7', 'Weekly Reset', '"Weekly reset. Two questions: 1\ufe0f\u20e3 How did your nutrition feel this week? 2\ufe0f\u20e3 What\u2019s ONE thing you\u2019re committing to differently starting Monday? Drop your answer \u2014 we\u2019re reading every single one."', 'SmithFit FAM'),
  ],
}));

ch.push(sp(160));
ch.push(subBanner('Week 2 \u2014 Building Momentum', C.va));
ch.push(sp(80));
ch.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [600, 1800, 1800, 3600, 1560],
  rows: [
    hRow(['Day', 'Label', 'Theme', 'Prompt (copy/paste ready)', 'Post In'], [600, 1800, 1800, 3600, 1560], C.va),
    promptRow('Mon', 'Week 2 \u2022 Day 8', 'Intention Setting', '"New week, same mission. What\u2019s your metabolism goal for this week? Be specific \u2014 not \u2018eat better,\u2019 but \u2018follow the Work Day plan on Tuesday and Thursday.\u2019 Specific wins."', 'SmithFit FAM'),
    promptRow('Tue', 'Week 2 \u2022 Day 9', 'Education Post', '[Post excerpt from this month\u2019s Lesson 2] \u2014 e.g., \u201cWhy you crave sugar at 2am on night shift \u2014 and it has nothing to do with willpower.\u201d', 'SmithFit FAM'),
    promptRow('Wed', 'Week 2 \u2022 Day 10', 'Call Reminder', '"Call today at [TIME]. Today\u2019s format: [CALL TYPE]. What question are you bringing? Drop it here \u2014 IJ might pull it live. [ZOOM LINK]"', 'SmithFit FAM'),
    promptRow('Thu', 'Week 2 \u2022 Day 11', 'Wins Prompt', '"Thursday = Wins Board Day. You\u2019ve been working all week. Name it. Head to the Wins Board and post your win for the week. IJ reads every single one."', 'FAM + Wins Board'),
    promptRow('Fri', 'Week 2 \u2022 Day 12', 'Habit Check-In', '"End of week check-in: What\u2019s one habit from this week you want to carry into next week? Drop it \u2014 this is how it sticks."', 'SmithFit FAM'),
    promptRow('Sat', 'Week 2 \u2022 Day 13', 'Resource Drop', '"Weekend resource: [RESOURCE NAME]. Perfect for shift prep this weekend. Save it."', 'SmithFit FAM'),
    promptRow('Sun', 'Week 2 \u2022 Day 14', 'Weekly Reset', '"Sunday reset: What was the hardest moment this week, nutritionally? Not looking for perfection \u2014 looking for honesty. Drop it below and let\u2019s problem-solve together."', 'SmithFit FAM'),
  ],
}));

ch.push(sp(160));
ch.push(subBanner('Week 3 \u2014 Depth + Community Building', C.va));
ch.push(sp(80));
ch.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [600, 1800, 1800, 3600, 1560],
  rows: [
    hRow(['Day', 'Label', 'Theme', 'Prompt (copy/paste ready)', 'Post In'], [600, 1800, 1800, 3600, 1560], C.va),
    promptRow('Mon', 'Week 3 \u2022 Day 15', 'Intention Setting', '"Monday intention: What\u2019s one non-scale victory you\u2019re chasing this week? Energy, sleep, how your scrubs fit, not reaching for coffee at hour 8. Name it."', 'SmithFit FAM'),
    promptRow('Tue', 'Week 3 \u2022 Day 16', 'Education Post', '[Post excerpt from this month\u2019s Lesson 3] \u2014 e.g., \u201cThe Chaos Day Rescue Plan: what to eat when everything falls apart on shift.\u201d', 'SmithFit FAM'),
    promptRow('Wed', 'Week 3 \u2022 Day 17', 'Call Reminder', '"Call today \u2014 [CALL TYPE]. Come ready to share ONE thing that\u2019s been working for you. [ZOOM LINK]"', 'SmithFit FAM'),
    promptRow('Thu', 'Week 3 \u2022 Day 18', 'Wins Prompt', '"Wins Board Thursday \ud83c\udfc6 Drop it. We\u2019re collecting wins like it\u2019s our job \u2014 because it kind of is. IJ celebrates every single one."', 'FAM + Wins Board'),
    promptRow('Fri', 'Week 3 \u2022 Day 19', 'Habit Check-In', '"Quick check: Are you still making the Metabolic Cocktail? If yes \u2014 drop a \ud83c\udf4b. If you fell off \u2014 no shame. Just\u2026 go make it today. The consistency compounds."', 'SmithFit FAM'),
    promptRow('Sat', 'Week 3 \u2022 Day 20', 'Shoutout Saturday', '"Shoutout Saturday: Tag a SmithFit FAM member who showed up for you this week. A comment that helped, a win that inspired you, someone who posted when you needed to see it."', 'SmithFit FAM'),
    promptRow('Sun', 'Week 3 \u2022 Day 21', 'Weekly Reset', '"How\u2019s your energy this month compared to when you started? Be honest. Rate it 1-10 then vs. now. This is your data. It matters."', 'SmithFit FAM'),
  ],
}));

ch.push(sp(160));
ch.push(subBanner('Week 4 \u2014 Retention + 30-Day Milestone', C.va));
ch.push(sp(80));
ch.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [600, 1800, 1800, 3600, 1560],
  rows: [
    hRow(['Day', 'Label', 'Theme', 'Prompt (copy/paste ready)', 'Post In'], [600, 1800, 1800, 3600, 1560], C.va),
    promptRow('Mon', 'Week 4 \u2022 Day 22', 'Intention Setting', '"30-day milestone is approaching for some of you. What\u2019s changed since Day 1? Drop your honest answer \u2014 even if the changes feel small. Small is how it starts."', 'SmithFit FAM'),
    promptRow('Tue', 'Week 4 \u2022 Day 23', 'Education Post', '[Post excerpt from this month\u2019s Lesson 4] \u2014 e.g., \u201cWhy your metabolism responds differently on night shifts \u2014 and the fix that isn\u2019t eating less.\u201d', 'SmithFit FAM'),
    promptRow('Wed', 'Week 4 \u2022 Day 24', 'Call Reminder', '"Call today \u2014 [CALL TYPE]. If you\u2019re approaching your 30-day milestone, IJ wants to hear from you on this call. [ZOOM LINK]"', 'SmithFit FAM'),
    promptRow('Thu', 'Week 4 \u2022 Day 25', 'Wins Prompt', '"This week\u2019s Wins Board prompt: Your biggest non-scale win from the past 30 days. The one that made you go \u2018wait\u2026 something is actually changing.\u2019 Drop it in the Wins Board."', 'FAM + Wins Board'),
    promptRow('Fri', 'Week 4 \u2022 Day 26', 'Habit Check-In', '"Month 1 is almost done. What\u2019s the ONE thing that made the biggest difference for you? Not what you expected \u2014 what actually moved the needle."', 'SmithFit FAM'),
    promptRow('Sat', 'Week 4 \u2022 Day 27', 'Resource + Milestone Alert', '"Resource drop: [RESOURCE NAME]. Reminder: 30-day milestone rewards are coming for those hitting the mark this week. Watch your email. \ud83c\udf81"', 'SmithFit FAM'),
    promptRow('Sun', 'Week 4 \u2022 Day 28', 'Weekly Reset', '"Last Sunday of Month 1. How are you walking into Month 2? Drop your intention below \u2014 what are you committed to doing differently, more of, or for the first time in Month 2?"', 'SmithFit FAM'),
  ],
}));

// ── SECTION 2: COMMUNITY LAUNCH SEEDING POSTS ───────────────────────────────
ch.push(pageBreak());
ch.push(banner('SECTION 2: Community Launch Seeding Posts', C.seeding));
ch.push(sp(80));
ch.push(body('Post these three pieces on Day 1 when each community group opens. IJ writes Post 1 personally (or VA posts it from IJ\u2019s account). VA handles Posts 2 and 3.'));
ch.push(sp(120));

ch.push(h2('Post 1 \u2014 SmithFit FAM Welcome (from IJ)', C.seeding));
ch.push(note('IJ writes this one. VA can post it from IJ\u2019s account if needed.'));
ch.push(sp(80));
ch.push(copyBlock([
  'SmithFit FAM is officially OPEN. \ud83c\udf89',
  '',
  "I'm IJ Smith, RN \u2014 nurse, coach, and the person who built this entire system because I was watching my fellow nurses destroy their health trying to get healthy.",
  '',
  'The rules here are simple:',
  '\ud83d\udce3 Ask any question. No judgment, no shame.',
  '\ud83c\udfc6 Head to the Wins Board when you have a win \u2014 any win counts.',
  '\ud83d\udcac Reply to each other. A community of nurses who have your back is the whole point.',
  '',
  'To start: drop your intro below.',
  'Your name | Your specialty/unit | Your shift type | Your #1 goal.',
  '',
  "I read every single one. Welcome home. \u2014 IJ",
], 'COPY/PASTE (IJ\u2019s voice):'));

ch.push(sp(160));
ch.push(h2('Post 2 \u2014 Wins Board Welcome (from VA)', C.seeding));
ch.push(sp(80));
ch.push(copyBlock([
  'Welcome to the Wins Board. \ud83c\udfc6',
  '',
  'One rule: wins only.',
  'No questions. No general chat. Just wins.',
  '',
  'What counts as a win?',
  '\u2705 Energy on your shift',
  '\u2705 Didn\u2019t stress-eat in the break room',
  '\u2705 Drank your Metabolic Cocktail',
  '\u2705 Got off the couch when you didn\u2019t want to',
  '\u2705 Scrubs feeling looser',
  '\u2705 Down 2 lbs',
  '\u2705 Slept like a human for the first time in weeks',
  '',
  'IJ personally celebrates every single win posted here.',
  'Not a bot. Not a VA. IJ.',
  '',
  'Drop your first win when you\u2019re ready. We\u2019re watching.',
], 'COPY/PASTE (VA posts in Wins Board):'));

ch.push(sp(160));
ch.push(h2('Post 3 \u2014 VIP Lounge Welcome (from IJ, Bundle + High-Ticket only)', C.seeding));
ch.push(sp(80));
ch.push(copyBlock([
  'Welcome to the VIP Lounge. You earned this.',
  '',
  'This space is different. Smaller. More personal. More direct.',
  'If you have a question \u2014 ask it here.',
  'If you have a win \u2014 post it here first.',
  '',
  'A few things to do right now:',
  '\ud83d\udcc5 Book your 60-minute gameplan call with me: [CALENDLY LINK]',
  '\ud83d\udd2c Set up MealLens and BioSync in your FitMetrics app \u2014 use them this week',
  '\ud83d\udcde You get 3 calls per week this month \u2014 check the schedule and show up to all three if you can',
  '',
  'This is your fastest path to results.',
  'Use everything.',
  '',
  '\u2014 IJ',
], 'COPY/PASTE (IJ\u2019s voice, VIP Lounge only):'));

// ── SECTION 3: WELCOME VIDEO SCRIPTS ────────────────────────────────────────
ch.push(pageBreak());
ch.push(banner('SECTION 3: Welcome Video Scripts (MEM-02 through MEM-05)', C.video));
ch.push(sp(80));
ch.push(body('These are short videos (2\u20133 minutes) IJ records and posts to SmithFit FAM. They supplement the automated email sequence and give clients a personal touchpoint at each milestone. Read naturally \u2014 do not read word-for-word off the script.'));
ch.push(sp(80));
ch.push(note('Filming tip: Record on your phone. Casual is better. Scrubs or SmithFit gear. No need for a studio setup.'));
ch.push(sp(120));

ch.push(subBanner('MEM-02 Video \u2014 Day 2: Cocktail Follow-Up + App Walkthrough', C.video));
ch.push(sp(80));
ch.push(note('When to post: Day 2 of new member\u2019s membership. Can be recorded once and reused for all new members. Post in SmithFit FAM as a pinned message in the first week.'));
ch.push(sp(80));
ch.push(body('TARGET LENGTH: 2\u20133 minutes'));
ch.push(sp(60));
ch.push(copyBlock([
  "Hey \u2014 it\u2019s IJ. Day 2. I want to check in.",
  '',
  "Did you make the Metabolic Cocktail yesterday? If you did \u2014 I want you to notice something. How did you feel an hour after? Most people report one of three things: steadier energy, less of a mid-morning crash, or a craving that just\u2026 didn\u2019t show up when it usually does.",
  '',
  "That\u2019s not placebo. That\u2019s your cortisol system responding to the signal you sent it.",
  '',
  "If you didn\u2019t make it yet \u2014 that\u2019s okay. Make it today. The recipe is in your welcome email and in the app. It takes two minutes.",
  '',
  "Today\u2019s focus: Your first FitMetrics check-in is coming. When you get that prompt \u2014 take five minutes and answer it honestly. Don\u2019t write what you think I want to read. Write what\u2019s actually true. The AI learns your patterns and the data only works if it\u2019s real.",
  '',
  "Also \u2014 your first workout is in the app. 15 minutes. Pick any one that fits your day. If you\u2019re post-night-shift, do the Foundation version. There\u2019s no wrong choice as long as you open the app and press play.",
  '',
  "One last thing: Find the SmithFit FAM community in your FitMetrics app and post your introduction if you haven\u2019t yet. I read every single one. Your name, your shift type, your one goal. That\u2019s it.",
  '',
  "Day 2. You\u2019re here. That\u2019s everything. \u2014 IJ",
]));

ch.push(sp(160));
ch.push(subBanner('MEM-03 Video \u2014 Day 7: Week 1 Check-In', C.video));
ch.push(sp(80));
ch.push(note('When to post: Day 7. Post in SmithFit FAM tagged to new members\u2019 intro thread if possible, or as a standalone post.'));
ch.push(sp(80));
ch.push(body('TARGET LENGTH: 2\u20133 minutes'));
ch.push(sp(60));
ch.push(copyBlock([
  "Hey \u2014 one week in.",
  '',
  "I want to be really honest with you about something: Week 1 almost never goes perfectly. And that\u2019s supposed to happen. Your body is recalibrating. Your schedule is fighting you. The habits are new.",
  '',
  "What I want to know is the honest version of your week \u2014 not the Instagram version.",
  '',
  "Did you make the cocktail? Even three times? Good.",
  "Did you move your body once? Good.",
  "Did you look at a meal plan template, even if you didn\u2019t follow it? Good.",
  '',
  "Here\u2019s what I see happening by Day 7 in almost every member: the all-or-nothing thinking starts to loosen. The \u2018I blew it, might as well quit\u2019 reflex gets quieter. You\u2019re learning to not throw out the whole week over one bad night shift.",
  '',
  "That\u2019s the real Week 1 win. That\u2019s the metabolism reset starting to work \u2014 not in your body yet, but in your brain.",
  '',
  "This week: I want you to post in the Wins Board. One thing. Any thing. Energy felt steadier. A craving didn\u2019t happen. Slept differently. Scale moved or didn\u2019t move and you\u2019re still here.",
  '',
  "Head to the Wins Board and post it. I celebrate every single one personally.",
  '',
  "See you on the call this week. \u2014 IJ",
]));

ch.push(sp(160));
ch.push(subBanner('MEM-04 Video \u2014 Day 14: The Two-Week Wall', C.video));
ch.push(sp(80));
ch.push(note('When to post: Day 14. This one is important \u2014 many members hit a discouragement wall here. Post in SmithFit FAM.'));
ch.push(sp(80));
ch.push(body('TARGET LENGTH: 2\u20133 minutes'));
ch.push(sp(60));
ch.push(copyBlock([
  "Two weeks. Let\u2019s talk about the wall.",
  '',
  "If you\u2019re feeling like it\u2019s not working \u2014 you\u2019re probably hitting the cortisol stabilization wall. It\u2019s real. It happens between Day 10 and Day 21 for most people. Your body is adjusting, your hormones are recalibrating, and results feel slow or invisible.",
  '',
  "Here\u2019s what\u2019s actually happening underneath: Your blood sugar regulation is improving. Your cortisol peaks are getting lower. Your hunger signals are starting to sync with your actual needs instead of your stress response.",
  '',
  "You can\u2019t feel all of that yet. But it\u2019s happening.",
  '',
  "The nurses who break through this wall are the ones who are still here at Day 30. And Day 30 is when you actually start to SEE what\u2019s been happening under the surface.",
  '',
  "What I need from you this week: Pull up your Chaos Day Rescue Plan in the app. Review it. This is the tool for the weeks when everything falls apart \u2014 night shift, double shifts, family emergencies, bad weeks. You\u2019re going to need it. Get familiar with it now, not during the chaos.",
  '',
  "Also \u2014 have you been coming to the weekly call? If not, the replay is always in SmithFit FAM. But I want you live if you can. The call is where breakthroughs happen.",
  '',
  "Two weeks. Stay in the room. \u2014 IJ",
]));

ch.push(sp(160));
ch.push(subBanner('MEM-05 Video \u2014 Day 30: One Month Milestone', C.video));
ch.push(sp(80));
ch.push(note('When to post: Day 30. This is a celebration video. Genuine energy \u2014 IJ means every word of this one.'));
ch.push(sp(80));
ch.push(body('TARGET LENGTH: 2\u20133 minutes'));
ch.push(sp(60));
ch.push(copyBlock([
  "One month. You cleared the line that most people never reach.",
  '',
  "I want to say something that might surprise you: most people who buy a program like this never make it to 30 days. They quit at Day 4, or Day 12, or they ghost after Week 2. You didn\u2019t.",
  '',
  "That means something.",
  '',
  "Your $5 Amazon gift card milestone is on its way \u2014 watch your email. But more than the reward: I want you to do something this week. Pull up the FitMetrics check-in from your first week. Compare it to how you\u2019re feeling now.",
  '',
  "Is your energy different? Is sleep different? Are cravings less demanding? Do you feel more like yourself at work?",
  '',
  "That\u2019s the reset working. That\u2019s 30 days of small signals adding up into real metabolic change.",
  '',
  "Now \u2014 I want to have an honest conversation with you about Month 2 and beyond. A lot of members at this stage start wondering what the next level looks like. If you\u2019ve been curious about the bundle options \u2014 the gameplan call, MealLens, BioSync, more direct access \u2014 your Day 45 email is going to have a real conversation about that.",
  '',
  "But for today: you\u2019re here. You\u2019re 30 days in. And I\u2019m genuinely proud of you.",
  '',
  "Post in the Wins Board today. Your one-month win. We\u2019re all watching. \u2014 IJ",
]));

// ── SECTION 4: WEEK AUDIT SUBMISSION TEMPLATE ───────────────────────────────
ch.push(pageBreak());
ch.push(banner('SECTION 4: Week Audit Submission Template', C.templates));
ch.push(sp(80));
ch.push(body('Members submit this before a Week Audit call. VA announces submissions open 5 days before the call. IJ selects 2\u20133 submissions to review live. Post this template in SmithFit FAM in the announcement for each Week Audit call.'));
ch.push(sp(80));
ch.push(note('VA: Copy the template below into the community announcement post so members can fill it out directly in their reply.'));
ch.push(sp(120));
ch.push(copyBlock([
  '\u2500\u2500 WEEK AUDIT SUBMISSION \u2500\u2500',
  'Submit by: [DEADLINE DATE/TIME]',
  '',
  'Your name:',
  'Shift type (Day / Night / Rotating):',
  'Days worked this week:',
  '',
  '\u25ba NUTRITION',
  'What did eating look like on your work days?',
  'What did eating look like on your off days?',
  'Biggest nutritional challenge this week:',
  'Did you use a Chaos Day plan? (Yes / No / Needed it but didn\u2019t)',
  '',
  '\u25ba MOVEMENT',
  'Workouts completed (how many, which type):',
  'Any other movement (walks, active shifts, etc.):',
  '',
  '\u25ba ENERGY + SLEEP',
  'Average energy on shift (1\u201310):',
  'Average sleep quality (1\u201310):',
  'Any notable patterns (crashed mid-shift, couldn\u2019t fall asleep after nights, etc.):',
  '',
  '\u25ba YOUR WIN + YOUR HARD MOMENT',
  'Biggest win this week (non-scale preferred):',
  'Hardest moment this week:',
  '',
  '\u25ba WHAT YOU WANT IJ TO LOOK AT',
  'What do you want feedback on specifically?',
  'Is there something you keep doing/not doing that you don\u2019t understand?',
  '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
]));

ch.push(sp(120));
ch.push(h2('Week Audit Call Announcement Template', C.templates));
ch.push(sp(80));
ch.push(body('VA posts this in SmithFit FAM 5 days before each Week Audit call:'));
ch.push(sp(80));
ch.push(copyBlock([
  '\ud83d\udd0d WEEK AUDIT CALL \u2014 [DATE] at [TIME]',
  '',
  'This is your chance to have IJ personally review YOUR week live on the call.',
  '',
  'Submit your week using the form below and IJ will select 2\u20133 to review live.',
  'If you\u2019re not selected, you\u2019ll still get a response \u2014 IJ reviews all submissions.',
  '',
  'HOW TO SUBMIT:',
  'Copy the template below, fill it out, and reply to this post.',
  'Deadline: [DEADLINE DATE] at [TIME]',
  '',
  '[PASTE WEEK AUDIT SUBMISSION TEMPLATE HERE]',
  '',
  'Zoom link for the call: [ZOOM LINK]',
  "See you there. \u2014 IJ's team",
]));

// ── SECTION 5: SMITHFIT SPOTLIGHT TEMPLATE ───────────────────────────────────
ch.push(pageBreak());
ch.push(banner('SECTION 5: Monthly SmithFit Spotlight Template', C.incentives));
ch.push(sp(80));
ch.push(body('VA creates this post at the end of each month. IJ selects the winner from Wins Board posts. VA builds the post using this template and IJ reviews before it goes live. Post in SmithFit FAM and Instagram (with member permission).'));
ch.push(sp(120));
ch.push(h2('How to Select the Monthly Spotlight Winner', C.incentives));
ch.push(body('1. VA reviews all Wins Board posts from the month and shortlists 3\u20135 candidates'));
ch.push(body('2. Criteria: Most consistent poster, most emotionally resonant win, biggest transformation story, or someone who showed up for other members'));
ch.push(body('3. VA sends shortlist to IJ \u2014 IJ picks winner'));
ch.push(body('4. VA DMs the winner to ask permission to feature them and request a photo (optional) and a one-line quote'));
ch.push(body('5. VA builds the post below and sends to IJ for a personal note (2\u20133 sentences from IJ about what stood out)'));
ch.push(sp(120));
ch.push(copyBlock([
  '\ud83c\udfc6 SMITHFIT SPOTLIGHT \u2014 [MONTH] [YEAR]',
  '',
  'This month\u2019s Spotlight goes to [MEMBER NAME], [ROLE/SPECIALTY] working [SHIFT TYPE].',
  '',
  '[MEMBER NAME] has been in SmithFit FAM for [X] days/weeks/months.',
  '',
  'In their own words:',
  '"[Member quote \u2014 copy directly from their Wins Board post or from the quote they gave you]"',
  '',
  'What IJ noticed:',
  '[2\u20133 sentences from IJ about what stood out \u2014 their consistency, a specific win, how they showed up for the community]',
  '',
  '[MEMBER NAME], you earned this. The whole SmithFit FAM is cheering for you. \ud83d\udc9b',
  '',
  '\u2192 Drop a \ud83c\udfc6 in the comments for [MEMBER NAME].',
  '',
  '[For Instagram only]: Tag a nurse who needs to see this. This is what showing up for yourself looks like.',
  '',
  '\u2014 IJ Smith, RN',
], 'COMMUNITY POST (copy/paste and fill in brackets):'));

ch.push(sp(120));
ch.push(h2('Instagram Version (shorter)', C.incentives));
ch.push(sp(80));
ch.push(copyBlock([
  '\ud83c\udfc6 SmithFit Spotlight: [MEMBER NAME]',
  '',
  '"[Member quote]"',
  '',
  '[1\u20132 sentences from IJ about why this win matters]',
  '',
  'This is [X] days in. Still here. Still showing up.',
  "That's the whole thing. \ud83d\udc9b",
  '',
  '#SmithFit #NurseLife #MetabolismReset #ShiftWorkFitness #NurseFitness',
], 'INSTAGRAM CAPTION:'));

// ── SECTION 6: POST-CALL RECAP TEMPLATE ────────────────────────────────────
ch.push(pageBreak());
ch.push(banner('SECTION 6: Post-Call Recap Template', C.templates));
ch.push(sp(80));
ch.push(body('VA posts this in SmithFit FAM within 24 hours of every call. Fill in the brackets based on what happened on the call. If a resource was shared, attach it or link it in the post.'));
ch.push(sp(120));
ch.push(copyBlock([
  '\ud83d\udccb CALL RECAP \u2014 [CALL TYPE] | [DATE]',
  '',
  "Thanks to everyone who showed up live \u2014 and for those watching the replay, we see you. \ud83d\udc4b",
  '',
  'WHAT WE COVERED:',
  '\u2022 [Key point 1 from the call]',
  '\u2022 [Key point 2 from the call]',
  '\u2022 [Key point 3 from the call]',
  '',
  "IJ\u2019S QUOTE OF THE CALL:",
  '"[Most memorable or useful thing IJ said \u2014 write it down during the call]"',
  '',
  'RESOURCE FROM TODAY:',
  '[Attach resource or write: "No resource this week \u2014 IJ will drop one Thursday."]',
  '',
  'YOUR ACTION ITEM BEFORE NEXT CALL:',
  '[One thing IJ told everyone to do before the next call \u2014 be specific]',
  '',
  'NEXT CALL:',
  '[Date] at [Time] \u2014 Format: [CALL TYPE]',
  'Zoom link: [ZOOM LINK]',
  '',
  "Missed the call and can\u2019t watch the replay? Reply to this post and IJ will send you the key takeaway.",
  '',
  '\u2014 SmithFit Team',
], 'COPY/PASTE (VA posts in SmithFit FAM within 24 hours of every call):'));

ch.push(sp(120));
ch.push(h2('Notes for VA', C.templates));
ch.push(body('1. Write down IJ\u2019s quote during the call \u2014 set a note open on your phone while watching'));
ch.push(body('2. If IJ shares a resource live, request the file immediately after the call so you can attach it to the recap'));
ch.push(body('3. The action item should be specific ("Do the box breathing protocol before your next shift") not vague ("work on your nutrition")'));
ch.push(body('4. Tag the clients who were audited in a Week Audit recap so IJ can follow up personally'));
ch.push(body('5. If a member shared a breakthrough on the call, ask their permission and feature it as a Wins Board post or Instagram story'));

// ── BUILD ────────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 280 } } },
        }],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 20 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.membership, space: 4 } },
          children: [new TextRun({ text: 'SmithFit Community Content Pack', size: 16, font: 'Arial', color: '888888' })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC', space: 4 } },
          children: [
            new TextRun({ text: 'SmithFit Confidential  |  Page ', size: 16, font: 'Arial', color: '888888' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Arial', color: '888888' }),
          ],
        })],
      }),
    },
    children: ch,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  console.log(`\u2705 Saved: ${OUTPUT} (${(buf.length/1024).toFixed(1)} KB)`);
}).catch(err => { console.error('\u274c', err); process.exit(1); });
