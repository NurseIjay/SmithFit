// SmithFit Client Experience & Community Playbook Generator
// Run: NODE_PATH=/usr/local/lib/node_modules node scripts/generate_client_experience_playbook.js

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, WidthType, ShadingType, BorderStyle,
  HeadingLevel, PageNumber, Header, Footer
} = require('docx');
const fs = require('fs');

const OUTPUT_PATH = "27 Course Funnel/Docs created Claude/SmithFit Client Experience Playbook.docx";

// ── Colors ──────────────────────────────────────────────────────────────────
const C = {
  tripwire:    'C55A11', // orange
  membership:  '2E75B6', // blue
  trial:       '7030A0', // purple
  bundle6:     '375623', // dark green
  bundle12:    '1F5C2E', // deep green
  community:   '1F4E79', // navy
  va:          '4472C4', // medium blue
  calls:       'C00000', // red
  content:     '833C00', // brown-orange
  incentives:  '6B2FA0', // violet
  white:       'FFFFFF',
  lightGrey:   'F2F2F2',
  yellow:      'FFF2CC',
  lightBlue:   'DEEAF1',
  lightGreen:  'E2EFDA',
  lightPurple: 'EAD1DC',
  lightOrange: 'FCE4D6',
  darkText:    '1A1A1A',
};

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ── Helpers ──────────────────────────────────────────────────────────────────
function banner(text, bgColor, fontSize = 28) {
  return new Paragraph({
    spacing: { before: 320, after: 80 },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    children: [new TextRun({ text, bold: true, color: C.white, size: fontSize, font: 'Arial' })],
    indent: { left: 120, right: 120 },
  });
}

function subBanner(text, bgColor) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    children: [new TextRun({ text, bold: true, color: C.white, size: 24, font: 'Arial' })],
    indent: { left: 120, right: 120 },
  });
}

function heading(text, color = C.darkText) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color, size: 24, font: 'Arial' })],
  });
}

function subheading(text, color = C.darkText) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, bold: true, color, size: 22, font: 'Arial' })],
  });
}

function body(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 20, font: 'Arial', ...options })],
  });
}

function bold(text, color) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, bold: true, size: 20, font: 'Arial', color })],
  });
}

function note(text, bgColor = C.yellow) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    indent: { left: 180, right: 180 },
    children: [new TextRun({ text, size: 20, font: 'Arial', italics: true })],
  });
}

function spacer(before = 80) {
  return new Paragraph({ spacing: { before, after: 0 }, children: [new TextRun('')] });
}

function check(text, sub = false) {
  return new Paragraph({
    numbering: { reference: sub ? 'checks-sub' : 'checks', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: 'Arial' })],
  });
}

function bullet(text, sub = false) {
  return new Paragraph({
    numbering: { reference: sub ? 'bullets-sub' : 'bullets', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: 'Arial' })],
  });
}

function cell(text, bgColor, widthDXA, bold_ = false, color = C.darkText, align = AlignmentType.LEFT) {
  return new TableCell({
    borders,
    width: { size: widthDXA, type: WidthType.DXA },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: 'center',
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold: bold_, size: 20, font: 'Arial', color })],
    })],
  });
}

function hCell(text, bgColor, widthDXA, textColor = C.white) {
  return cell(text, bgColor, widthDXA, true, textColor, AlignmentType.CENTER);
}

function pageBreak() {
  return new Paragraph({ pageBreakBefore: true, children: [new TextRun('')] });
}

function labelBadge(label, bgColor) {
  return new TextRun({ text: `  ${label}  `, bold: true, size: 18, font: 'Arial', color: C.white, highlight: undefined });
}

// ── Tables ───────────────────────────────────────────────────────────────────
function twoCol(rows, col1w, col2w, headerColor) {
  return new Table({
    width: { size: col1w + col2w, type: WidthType.DXA },
    columnWidths: [col1w, col2w],
    rows: rows.map((r, i) => new TableRow({
      children: [
        cell(r[0], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), col1w, i === 0, i === 0 ? C.white : C.darkText),
        cell(r[1], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), col2w, i === 0, i === 0 ? C.white : C.darkText),
      ],
    })),
  });
}

function threeCol(rows, widths, headerColor) {
  const [w1, w2, w3] = widths;
  return new Table({
    width: { size: w1 + w2 + w3, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((r, i) => new TableRow({
      children: [
        cell(r[0], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w1, i === 0, i === 0 ? C.white : C.darkText),
        cell(r[1], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w2, i === 0, i === 0 ? C.white : C.darkText),
        cell(r[2], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w3, i === 0, i === 0 ? C.white : C.darkText),
      ],
    })),
  });
}

function fourCol(rows, widths, headerColor) {
  const [w1, w2, w3, w4] = widths;
  return new Table({
    width: { size: w1 + w2 + w3 + w4, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((r, i) => new TableRow({
      children: [
        cell(r[0], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w1, i === 0, i === 0 ? C.white : C.darkText),
        cell(r[1], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w2, i === 0, i === 0 ? C.white : C.darkText),
        cell(r[2], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w3, i === 0, i === 0 ? C.white : C.darkText),
        cell(r[3], i === 0 ? headerColor : (i % 2 === 1 ? C.lightGrey : C.white), w4, i === 0, i === 0 ? C.white : C.darkText),
      ],
    })),
  });
}

// ── DOCUMENT ─────────────────────────────────────────────────────────────────
const children = [];

// ── COVER ────────────────────────────────────────────────────────────────────
children.push(
  new Paragraph({ spacing: { before: 1440, after: 0 }, children: [new TextRun('')] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: 'SmithFit', bold: true, size: 64, font: 'Arial', color: C.membership })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Client Experience & Community Playbook', bold: true, size: 40, font: 'Arial', color: C.darkText })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'Full Operational Guide: Every Tier, Every Touch Point', size: 24, font: 'Arial', color: '666666', italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'IJ Smith, RN  |  SmithFit', size: 20, font: 'Arial', color: '888888' })],
  }),
  spacer(1440),
);

// ── HOW TO USE ───────────────────────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('How to Use This Document', C.membership));
children.push(spacer(120));
children.push(body('This playbook covers the full SmithFit client experience from the moment someone buys the $27 tripwire through every tier of the offer stack. It also contains your complete community structure, VA daily posting playbook, monthly call calendar system, educational content pipeline, and engagement incentive strategy.'));
children.push(spacer(80));
children.push(subheading('This document is organized into 6 parts:'));
children.push(bullet('Part 1 — Client Experience by Tier (what each client does, day by day)'));
children.push(bullet('Part 2 — Community Structure (3 groups, rules, access levels)'));
children.push(bullet('Part 3 — Daily VA Playbook (what to post, when, and how coaches respond)'));
children.push(bullet('Part 4 — Monthly Call Calendar (call types, who hosts, how to build each month)'));
children.push(bullet('Part 5 — Educational Content Pipeline (how lessons are created and delivered)'));
children.push(bullet('Part 6 — Engagement Incentives (wins culture, spotlights, milestones, referrals)'));
children.push(spacer(120));
children.push(note('Placeholders: Any item marked [LIKE THIS] is a link or detail still to be finalized. See the SmithFit Open Items Checklist for the full list.'));

// ── PART 1 ───────────────────────────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('PART 1: Client Experience by Tier', C.darkText, 30));
children.push(spacer(80));
children.push(body('Use this section to understand exactly what each client receives and what they should do at each stage. Each tier has a client-facing checklist so you know exactly what to communicate to them.'));

// ── TIER 1: $27 ──────────────────────────────────────────────────────────────
children.push(spacer(160));
children.push(subBanner('Tier 1: $27 Tripwire — 7-Day Shift-Proof Metabolism Reset\u2122', C.tripwire));
children.push(spacer(80));
children.push(subheading('What They Get', C.tripwire));
children.push(bullet('Full 7-Day Shift-Proof Metabolism Reset\u2122 course (GHL — self-paced)'));
children.push(bullet('4 modules: Why You\'re Stuck / The 2-Step Reset / Shift-Proof Nutrition / Circadian Eating'));
children.push(bullet('Metabolic Cocktail protocol'));
children.push(bullet('Box breathing guide'));
children.push(bullet('60-day money-back guarantee'));
children.push(bullet('Email sequences via GHL'));
children.push(spacer(80));
children.push(subheading('What They Do NOT Get', C.tripwire));
children.push(bullet('No SmithFit app (Trainerize) access'));
children.push(bullet('No community access (FitMetrics)'));
children.push(bullet('No workout programming'));
children.push(bullet('No group calls'));
children.push(spacer(80));
children.push(subheading('Their Path After Purchase', C.tripwire));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 6960],
    rows: [
      new TableRow({ children: [hCell('Step', C.tripwire, 2400), hCell('What Happens', C.tripwire, 6960)] }),
      new TableRow({ children: [cell('Purchase $27', C.lightOrange, 2400, true), cell('Course access granted via GHL. Upsell page fires immediately.', C.white, 6960)] }),
      new TableRow({ children: [cell('Upsell: $67/mo', C.lightGrey, 2400, true), cell('SAYS YES \u2192 MEM-01 fires, full membership begins (see Tier 2)', C.white, 6960)] }),
      new TableRow({ children: [cell('Downsell: Free Trial', C.lightOrange, 2400, true), cell('SAYS NO to $67/mo \u2192 14-day free trial offered (see Tier 3)', C.white, 6960)] }),
      new TableRow({ children: [cell('Campaign 01', C.lightGrey, 2400, true), cell('SAYS NO to both \u2192 4-email re-offer sequence over ~38 days. Goal: convert to membership.', C.white, 6960)] }),
    ],
  })
);

// ── TIER 2: MEMBERSHIP ───────────────────────────────────────────────────────
children.push(spacer(240));
children.push(subBanner('Tier 2: $67/mo Metabolic Breakthrough Membership', C.membership));
children.push(spacer(80));
children.push(subheading('What They Get', C.membership));
children.push(bullet('Weekly shift-proof meal plans (Work Day / Off Day / Chaos Day templates)'));
children.push(bullet('1,000+ recipe database in SmithFit app (Trainerize)'));
children.push(bullet('15-minute cortisol-conscious workouts (progressive, home-friendly)'));
children.push(bullet('Chaos-Day Rescue Plans'));
children.push(bullet('Weekly FitMetrics AI check-ins (automated \u2014 NOT personal coaching)'));
children.push(bullet('1 group coaching call per week (live with IJ and SmithFit team)'));
children.push(bullet('SmithFit FAM community access (FitMetrics app)'));
children.push(bullet('Wins Board community access'));
children.push(note('\u26a0\ufe0f 1-way messaging only \u2014 members cannot DM coaches directly. This is intentional and creates natural upgrade motivation toward the bundle.'));

children.push(spacer(120));
children.push(subheading('Day 0 — Client Onboarding Checklist', C.membership));
children.push(note('IJ: MEM-01 email fires automatically. This checklist mirrors what that email instructs the client to do.'));
children.push(spacer(80));
children.push(check('\u2610  Download the SmithFit app (Trainerize) — link in your welcome email'));
children.push(check('\u2610  Create your Trainerize profile and complete the intake form'));
children.push(check('\u2610  Drink your first Metabolic Cocktail (recipe in your welcome email)'));
children.push(check('\u2610  Join the SmithFit FAM community in the FitMetrics app — link in welcome email'));
children.push(check('\u2610  Join the Wins Board group in the FitMetrics app'));
children.push(check('\u2610  Post your first introduction in SmithFit FAM: "Hi! I\u2019m [name], I\u2019m a [role] working [shift type]. My #1 goal is [goal]."'));
children.push(check('\u2610  Find and bookmark the weekly community call (link in your welcome email) \u2014 [ZOOM LINK]'));
children.push(check('\u2610  Look at your meal plan for this week and pick ONE day to start'));

children.push(spacer(120));
children.push(subheading('Week 1 Guide', C.membership));
children.push(body('Goal for Week 1: Just show up. One meal plan day. One workout. One call.'));
children.push(spacer(60));
children.push(check('\u2610  Complete your first 15-minute workout in the app'));
children.push(check('\u2610  Follow the meal plan on at least one work day and one off day'));
children.push(check('\u2610  Attend your first weekly group coaching call'));
children.push(check('\u2610  Post your first win in the Wins Board (any win \u2014 energy, sleep, craving calm)'));
children.push(check('\u2610  Complete your first FitMetrics AI check-in when prompted'));

children.push(spacer(120));
children.push(subheading('Month 1 Roadmap', C.membership));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 3680, 3680],
    rows: [
      new TableRow({ children: [hCell('When', C.membership, 2000), hCell('What Happens (Automated)', C.membership, 3680), hCell('Client Action', C.membership, 3680)] }),
      new TableRow({ children: [cell('Day 0', C.lightBlue, 2000, true), cell('MEM-01: Welcome email fires', C.white, 3680), cell('Download app, join community, intro post', C.white, 3680)] }),
      new TableRow({ children: [cell('Day 2', C.lightGrey, 2000, true), cell('MEM-02: Cocktail follow-up + FitMetrics check-in preview', C.white, 3680), cell('Complete first check-in, attend first call', C.white, 3680)] }),
      new TableRow({ children: [cell('Day 7', C.lightBlue, 2000, true), cell('MEM-03: Week 1 check-in email', C.white, 3680), cell('Post first Wins Board win', C.white, 3680)] }),
      new TableRow({ children: [cell('Day 14', C.lightGrey, 2000, true), cell('MEM-04: Two-week check-in email', C.white, 3680), cell('Review Chaos-Day plan, set Week 3 intention', C.white, 3680)] }),
      new TableRow({ children: [cell('Day 30', C.lightBlue, 2000, true), cell('MEM-05: One-month celebration + bundle seed', C.white, 3680), cell('Claim $5 Amazon gift card (milestone reward)', C.white, 3680)] }),
    ],
  })
);

children.push(spacer(120));
children.push(subheading('Ongoing Rhythm (Month 2+)', C.membership));
children.push(bullet('1 group coaching call per week (rotating formats \u2014 see Part 4)'));
children.push(bullet('Weekly FitMetrics AI check-in (automated prompt)'));
children.push(bullet('Weekly meal plan updated in app'));
children.push(bullet('VA daily community prompts (see Part 3)'));
children.push(bullet('Day 45: MEM-06 bundle upgrade pitch fires + REF-01 referral email fires'));
children.push(bullet('Day 60: $10 Amazon gift card milestone'));
children.push(bullet('Day 90: $15 Amazon gift card + physical gift (mailed) \u2014 [MAILING FORM LINK]'));

// ── TIER 3: FREE TRIAL ───────────────────────────────────────────────────────
children.push(spacer(240));
children.push(subBanner('Tier 3: 14-Day Free Trial (Downsale)', C.trial));
children.push(spacer(80));
children.push(body('Shown only to prospects who declined the $67/mo upsell. Full membership access for 14 days. Must convert to paid to keep access.'));
children.push(spacer(80));
children.push(subheading('What They Get (Same as Membership)', C.trial));
children.push(bullet('Full SmithFit app access (Trainerize)'));
children.push(bullet('Meal plans, workouts, Chaos-Day plans, FitMetrics AI check-ins'));
children.push(bullet('SmithFit FAM + Wins Board community access'));
children.push(bullet('Weekly group coaching call (1/week)'));
children.push(note('\u26a0\ufe0f No 1-on-1 calls. No VIP Lounge. Same access as standard membership.'));

children.push(spacer(120));
children.push(subheading('Day 0 Checklist (Same as Membership \u2014 Mirror MEM-01 steps)', C.trial));
children.push(check('\u2610  Download SmithFit app, complete intake form'));
children.push(check('\u2610  Drink first Metabolic Cocktail'));
children.push(check('\u2610  Join SmithFit FAM + Wins Board in FitMetrics app'));
children.push(check('\u2610  Post intro in SmithFit FAM'));
children.push(check('\u2610  Bookmark weekly coaching call \u2014 [ZOOM LINK]'));

children.push(spacer(120));
children.push(subheading('Day 0\u201314 Automated Sequence', C.trial));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1440, 3960, 3960],
    rows: [
      new TableRow({ children: [hCell('Day', C.trial, 1440), hCell('Email', C.trial, 3960), hCell('Goal', C.trial, 3960)] }),
      new TableRow({ children: [cell('Day 0', C.lightPurple, 1440, true), cell('FOMO-C1: Welcome to your trial', C.white, 3960), cell('Onboard fast, build momentum immediately', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 3', C.lightGrey, 1440, true), cell('FOMO-C2: "How\'s your first week feeling?"', C.white, 3960), cell('Check in, address doubt, reinforce value', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 7', C.lightPurple, 1440, true), cell('FOMO-C3: Halfway check-in', C.white, 3960), cell('Celebrate progress, seed conversion', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 10', C.lightGrey, 1440, true), cell('FOMO-C4: "Only 4 days left"', C.white, 3960), cell('Urgency, address price objection', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 12', C.lightPurple, 1440, true), cell('FOMO-C5: Direct conversion offer', C.white, 3960), cell('Clear CTA to go paid', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 14', C.lightGrey, 1440, true), cell('FOMO-C6: "Last day of your trial"', C.white, 3960), cell('Final push, loss aversion', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 15', C.lightPurple, 1440, true), cell('FOMO-C7 (if not converted): "Your trial has ended"', C.white, 3960), cell('Final offer + cancel tag applied if no action', C.white, 3960)] }),
    ],
  })
);

// ── TIER 4: 6-MONTH BUNDLE ────────────────────────────────────────────────────
children.push(pageBreak());
children.push(subBanner('Tier 4: 6-Month Bundle \u2014 $335', C.bundle6));
children.push(spacer(80));
children.push(subheading('What They Get', C.bundle6));
children.push(body('Everything in the $67/mo membership, PLUS:'));
children.push(bullet('1 x 60-minute personal gameplan call with IJ \u2014 book via [CALENDLY LINK]'));
children.push(bullet('MealLens AI (scan meals with phone camera for instant metabolic feedback)'));
children.push(bullet('BioSync Bloodwork Portal (upload labs, get metabolic interpretation)'));
children.push(bullet('VIP Lounge community access during Month 1'));
children.push(bullet('3 group coaching calls per week during Month 1 (same access as high-ticket)'));
children.push(bullet('Transitions to standard membership access (1 call/week) from Month 2 onward'));

children.push(spacer(120));
children.push(subheading('Day 0 VIP Onboarding Checklist', C.bundle6));
children.push(note('IJ: BNDL-01 email fires automatically. This checklist mirrors that email.'));
children.push(spacer(80));
children.push(check('\u2610  Book your 60-minute gameplan call with IJ \u2014 [CALENDLY LINK]'));
children.push(check('\u2610  Download the SmithFit app (Trainerize) \u2014 link in your welcome email'));
children.push(check('\u2610  Complete your intake form in the app'));
children.push(check('\u2610  Set up MealLens AI in the FitMetrics app \u2014 scan your first meal'));
children.push(check('\u2610  Upload your most recent bloodwork to the BioSync Portal \u2014 [BIOSYNC LINK]'));
children.push(check('\u2610  Join SmithFit FAM, Wins Board, AND VIP Lounge in the FitMetrics app'));
children.push(check('\u2610  Post your intro in VIP Lounge: your name, role, shift type, #1 goal'));
children.push(check('\u2610  Bookmark all 3 weekly coaching calls \u2014 [ZOOM LINK]'));

children.push(spacer(120));
children.push(subheading('Month 1 VIP Rhythm (3 calls/week)', C.bundle6));
children.push(bullet('Attend all 3 weekly group coaching calls (rotating formats \u2014 see Part 4)'));
children.push(bullet('Active in VIP Lounge: post questions, wins, and meal scans'));
children.push(bullet('Complete weekly FitMetrics AI check-ins'));
children.push(bullet('IJ personally reviews FitMetrics data at Day 28 (BNDL-04 email)'));

children.push(spacer(120));
children.push(subheading('Month 2+ Transition (Standard Membership Level)', C.bundle6));
children.push(bullet('VIP Lounge access ends \u2014 transitions to SmithFit FAM + Wins Board'));
children.push(bullet('Drops to 1 group coaching call per week'));
children.push(bullet('All other membership features continue (app, meal plans, workouts, FitMetrics)'));
children.push(note('IJ: The transition from VIP to standard is a natural upsell moment. FOMO Track B fires at Day 45 to pitch the 12-month bundle upgrade.'));

children.push(spacer(120));
children.push(subheading('Automated Email Sequence', C.bundle6));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1440, 3960, 3960],
    rows: [
      new TableRow({ children: [hCell('Day', C.bundle6, 1440), hCell('Email', C.bundle6, 3960), hCell('Goal', C.bundle6, 3960)] }),
      new TableRow({ children: [cell('Day 0', C.lightGreen, 1440, true), cell('BNDL-01: VIP Welcome', C.white, 3960), cell('Book call, join VIP Lounge, set up MealLens/BioSync', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 1', C.lightGrey, 1440, true), cell('BNDL-02: Post-call gameplan', C.white, 3960), cell('Lock in 4-week roadmap using VIP tools', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 7', C.lightGreen, 1440, true), cell('BNDL-03: VIP Week 1 check-in', C.white, 3960), cell('Are they using MealLens, BioSync, attending calls?', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 28', C.lightGrey, 1440, true), cell('BNDL-04: Coach review', C.white, 3960), cell('IJ personally reviews FitMetrics data, adds coach-review tag', C.white, 3960)] }),
      new TableRow({ children: [cell('Day 45', C.lightGreen, 1440, true), cell('FOMO-B1: 12-month upgrade pitch begins', C.white, 3960), cell('Seed upgrade before VIP month is too distant a memory', C.white, 3960)] }),
    ],
  })
);

// ── TIER 5: 12-MONTH BUNDLE ───────────────────────────────────────────────────
children.push(spacer(240));
children.push(subBanner('Tier 5: 12-Month Bundle \u2014 $588', C.bundle12));
children.push(spacer(80));
children.push(body('Everything in the 6-month bundle, PLUS:'));
children.push(bullet('Quarterly 20-minute 1-on-1 coaching calls with IJ (throughout the year)'));
children.push(bullet('VIP 1-on-1 community access during Month 1 \u2014 agentic DM (can message coaches directly)'));
children.push(note('This is the highest tier in the automated funnel. 1-on-1 coaching calls are quarterly check-ins, not weekly calls. Weekly 1-on-1 calls belong to the separate high-ticket offer only.'));

children.push(spacer(120));
children.push(subheading('Day 0 Onboarding Checklist', C.bundle12));
children.push(check('\u2610  Book your 60-minute gameplan call with IJ \u2014 [CALENDLY LINK]'));
children.push(check('\u2610  Download SmithFit app, complete intake form'));
children.push(check('\u2610  Set up MealLens AI + BioSync Bloodwork Portal'));
children.push(check('\u2610  Join SmithFit FAM, Wins Board, AND VIP Lounge'));
children.push(check('\u2610  Send your first direct message to IJ or Coach Sony via the FitMetrics app (agentic DM \u2014 this is your direct access during Month 1)'));
children.push(check('\u2610  Post your intro in VIP Lounge'));
children.push(check('\u2610  Bookmark all 3 weekly coaching calls \u2014 [ZOOM LINK]'));
children.push(check('\u2610  Note your quarterly call schedule \u2014 IJ will confirm dates after your gameplan call'));

children.push(spacer(120));
children.push(subheading('Ongoing Quarterly Call Schedule', C.bundle12));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 7360],
    rows: [
      new TableRow({ children: [hCell('Quarter', C.bundle12, 2000), hCell('What Happens', C.bundle12, 7360)] }),
      new TableRow({ children: [cell('Month 1', C.lightGrey, 2000, true), cell('VIP Lounge + agentic DM + 3 calls/week + 60-min gameplan call with IJ', C.white, 7360)] }),
      new TableRow({ children: [cell('Month 2\u20133', C.white, 2000, true), cell('Standard community (1 call/week) + quarterly check-in call with IJ', C.white, 7360)] }),
      new TableRow({ children: [cell('Month 4\u20136', C.lightGrey, 2000, true), cell('Standard community (1 call/week) + quarterly check-in call with IJ', C.white, 7360)] }),
      new TableRow({ children: [cell('Month 7\u201312', C.white, 2000, true), cell('Standard community (1 call/week) + quarterly check-in calls with IJ', C.white, 7360)] }),
    ],
  })
);

// ── CALL STRUCTURE SUMMARY ───────────────────────────────────────────────────
children.push(spacer(240));
children.push(subBanner('Call Access Summary by Tier', C.darkText));
children.push(spacer(80));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 2120, 2120, 2120],
    rows: [
      new TableRow({ children: [hCell('Tier', C.darkText, 3000), hCell('Month 1 Calls/Week', C.darkText, 2120), hCell('Month 2+ Calls/Week', C.darkText, 2120), hCell('1-on-1 Calls', C.darkText, 2120)] }),
      new TableRow({ children: [cell('$27 Tripwire Only', C.lightGrey, 3000), cell('None', C.white, 2120), cell('None', C.white, 2120), cell('None', C.white, 2120)] }),
      new TableRow({ children: [cell('$67/mo Membership', C.lightBlue, 3000, true), cell('1 / week', C.white, 2120), cell('1 / week', C.white, 2120), cell('None', C.white, 2120)] }),
      new TableRow({ children: [cell('14-Day Free Trial', C.lightPurple, 3000, true), cell('1 / week', C.white, 2120), cell('(N/A \u2014 14 days)', C.white, 2120), cell('None', C.white, 2120)] }),
      new TableRow({ children: [cell('6-Month Bundle ($335)', C.lightGreen, 3000, true), cell('3 / week (VIP)', C.white, 2120), cell('1 / week', C.white, 2120), cell('1 x 60-min gameplan', C.white, 2120)] }),
      new TableRow({ children: [cell('12-Month Bundle ($588)', C.lightGreen, 3000, true), cell('3 / week (VIP)', C.white, 2120), cell('1 / week', C.white, 2120), cell('1 x 60-min + quarterly 20-min', C.white, 2120)] }),
      new TableRow({ children: [cell('High-Ticket (1-on-1)', C.lightOrange, 3000, true), cell('3 / week', C.white, 2120), cell('3 / week', C.white, 2120), cell('Weekly (separate funnel)', C.white, 2120)] }),
    ],
  })
);

// ── PART 2: COMMUNITY ────────────────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('PART 2: Community Structure', C.community));
children.push(spacer(120));
children.push(body('All community groups live inside the FitMetrics app. Members access them from the same place they do their AI check-ins, MealLens scans, and BioSync uploads.'));

children.push(spacer(160));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 3080, 4080],
    rows: [
      new TableRow({ children: [hCell('Group', C.community, 2200), hCell('Who\u2019s In', C.community, 3080), hCell('Purpose', C.community, 4080)] }),
      new TableRow({ children: [cell('SmithFit FAM', C.lightBlue, 2200, true, C.community), cell('ALL members ($67/mo, trial, bundle, high-ticket)', C.white, 3080), cell('Daily prompts, education posts, call announcements, general conversation', C.white, 4080)] }),
      new TableRow({ children: [cell('Wins Board', C.lightGrey, 2200, true), cell('ALL members', C.white, 3080), cell('WINS ONLY \u2014 NSVs, results, habits, energy, clothes fitting. No questions allowed here.', C.white, 4080)] }),
      new TableRow({ children: [cell('VIP Lounge', C.lightGreen, 2200, true, C.bundle6), cell('Bundle clients (Month 1 only) + High-ticket clients (ongoing)', C.white, 3080), cell('Intimate space, closer access, direct coaching conversations, agentic DMs for 12-month clients', C.white, 4080)] }),
    ],
  })
);

children.push(spacer(160));
children.push(subheading('Group Rules & Culture', C.community));

children.push(heading('SmithFit FAM \u2014 Rules', C.community));
children.push(bullet('Questions go here (not in Wins Board)'));
children.push(bullet('Respond to daily VA prompts here'));
children.push(bullet('Call reminders and announcements posted here by VA'));
children.push(bullet('Educational posts dropped here by VA from content pipeline'));
children.push(bullet('Cheer each other on, tag people who inspire you'));

children.push(spacer(80));
children.push(heading('Wins Board \u2014 Rules', C.community));
children.push(bullet('ONE RULE: Wins only. No questions, no general conversation.'));
children.push(bullet('Wins can be anything: "Had energy on my night shift," "Didn\'t binge after a 12-hour," "Scrubs feel looser," "Down 3 lbs"'));
children.push(bullet('IJ reacts to and celebrates every post personally \u2014 this is non-negotiable for community culture'));
children.push(bullet('VA prompts the Wins Board every Thursday'));
children.push(bullet('Monthly SmithFit Spotlight winner is selected from this board'));

children.push(spacer(80));
children.push(heading('VIP Lounge \u2014 Rules', C.community));
children.push(bullet('Bundle clients: access for Month 1 only, then transitions to SmithFit FAM'));
children.push(bullet('High-ticket clients: ongoing access'));
children.push(bullet('12-month bundle clients in Month 1: agentic DM \u2014 can message IJ and Coach Sony directly'));
children.push(bullet('6-month bundle clients in Month 1: community posting, but no direct DM to coaches'));
children.push(bullet('More personal, more direct \u2014 coaches engage here daily during VIP period'));

children.push(spacer(120));
children.push(subheading('Who Can Message Coaches Directly', C.community));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3600, 5760],
    rows: [
      new TableRow({ children: [hCell('Tier', C.community, 3600), hCell('DM Access', C.community, 5760)] }),
      new TableRow({ children: [cell('$67/mo Membership', C.lightGrey, 3600), cell('1-way messaging only \u2014 cannot DM coaches', C.white, 5760)] }),
      new TableRow({ children: [cell('Free Trial', C.white, 3600), cell('1-way messaging only \u2014 cannot DM coaches', C.white, 5760)] }),
      new TableRow({ children: [cell('6-Month Bundle \u2014 Month 1', C.lightGrey, 3600), cell('Community posting in VIP Lounge, no direct DM to coaches', C.white, 5760)] }),
      new TableRow({ children: [cell('12-Month Bundle \u2014 Month 1', C.white, 3600), cell('Agentic DM \u2014 can message IJ and Coach Sony directly in FitMetrics', C.white, 5760)] }),
      new TableRow({ children: [cell('High-Ticket (1-on-1)', C.lightGrey, 3600), cell('Full direct access \u2014 DM anytime', C.white, 5760)] }),
    ],
  })
);

// ── PART 3: VA PLAYBOOK ──────────────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('PART 3: Daily VA Community Playbook', C.va));
children.push(spacer(120));
children.push(body('The VA runs the daily community rhythm. IJ and Coach Sony respond to flagged questions and celebrate wins. Mom monitors DMs and escalates anything requiring a coach.'));

children.push(spacer(120));
children.push(subheading('Day-of-Week Posting Schedule', C.va));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 2000, 3160, 2000, 1000],
    rows: [
      new TableRow({ children: [hCell('Day', C.va, 1200), hCell('Theme', C.va, 2000), hCell('Sample Prompt', C.va, 3160), hCell('Post In', C.va, 2000), hCell('Who', C.va, 1000)] }),
      new TableRow({ children: [cell('Monday', C.lightBlue, 1200, true), cell('Intention Setting', C.white, 2000), cell('"What\u2019s one metabolism goal for your week? Drop it below \u2014 we see it."', C.white, 3160), cell('SmithFit FAM', C.white, 2000), cell('VA', C.white, 1000)] }),
      new TableRow({ children: [cell('Tuesday', C.lightGrey, 1200, true), cell('Education Post', C.white, 2000), cell('Drop Gamma lesson excerpt or tip from content pipeline', C.white, 3160), cell('SmithFit FAM', C.white, 2000), cell('VA', C.white, 1000)] }),
      new TableRow({ children: [cell('Wednesday', C.lightBlue, 1200, true), cell('Call Reminder', C.white, 2000), cell('"Community call is TODAY at [TIME]. What question are you bringing?" + Zoom link', C.white, 3160), cell('SmithFit FAM', C.white, 2000), cell('VA', C.white, 1000)] }),
      new TableRow({ children: [cell('Thursday', C.lightGrey, 1200, true), cell('Wins Prompt', C.white, 2000), cell('"Drop your win this week in the Wins Board. No win too small. Energy counts. Sleep counts. Not blowing it at 3am counts."', C.white, 3160), cell('SmithFit FAM + Wins Board', C.white, 2000), cell('VA', C.white, 1000)] }),
      new TableRow({ children: [cell('Friday', C.lightBlue, 1200, true), cell('Habit Check-In', C.white, 2000), cell('"What\u2019s one thing you did this week that past-you wouldn\u2019t have done?"', C.white, 3160), cell('SmithFit FAM', C.white, 2000), cell('VA', C.white, 1000)] }),
      new TableRow({ children: [cell('Saturday', C.lightGrey, 1200, true), cell('Call Reminder + Resource', C.white, 2000), cell('Call reminder + post companion resource from content pipeline', C.white, 3160), cell('SmithFit FAM', C.white, 2000), cell('VA', C.white, 1000)] }),
      new TableRow({ children: [cell('Sunday', C.lightBlue, 1200, true), cell('Weekly Reset', C.white, 2000), cell('"How did your nutrition and movement feel this week? What\u2019s one thing you\u2019ll do differently starting Monday?"', C.white, 3160), cell('SmithFit FAM', C.white, 2000), cell('VA', C.white, 1000)] }),
    ],
  })
);

children.push(spacer(120));
children.push(subheading('Team Roles in the Community', C.va));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 3680, 3680],
    rows: [
      new TableRow({ children: [hCell('Who', C.va, 2000), hCell('Responsibility', C.va, 3680), hCell('How Often', C.va, 3680)] }),
      new TableRow({ children: [cell('VA', C.lightGrey, 2000, true), cell('Daily prompts in SmithFit FAM, Thursday Wins Board prompt, call reminders, content pipeline posts', C.white, 3680), cell('Daily', C.white, 3680)] }),
      new TableRow({ children: [cell('IJ', C.white, 2000, true), cell('Celebrate every Wins Board post personally. Answer flagged questions from FAM. Host coaching calls.', C.white, 3680), cell('Daily Wins Board + calls', C.white, 3680)] }),
      new TableRow({ children: [cell('Coach Sony (Wife)', C.lightGrey, 2000, true), cell('Co-host calls (workouts, hot girl walks, some Q&As). Engage in VIP Lounge. Support IJ on call hosting.', C.white, 3680), cell('Calls + as needed', C.white, 3680)] }),
      new TableRow({ children: [cell('Mom', C.white, 2000, true), cell('Monitor DMs across all groups. Flag anything requiring a coach response. Handle general questions.', C.white, 3680), cell('Daily monitoring', C.white, 3680)] }),
    ],
  })
);

children.push(spacer(120));
children.push(subheading('Monthly VA Pre-Writing Process', C.va));
children.push(bullet('At the end of each month, VA pre-writes the following month\u2019s full prompt bank'));
children.push(bullet('Use the day-of-week themes above as the framework'));
children.push(bullet('Rotate prompts \u2014 don\u2019t repeat the same prompt in back-to-back weeks'));
children.push(bullet('IJ reviews and approves the monthly prompt batch before it goes live'));
children.push(bullet('Prompts are scheduled in GHL broadcast system'));

// ── PART 4: CALL CALENDAR ────────────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('PART 4: Monthly Call Calendar', C.calls));
children.push(spacer(120));
children.push(body('Calls are held on Zoom. The specific schedule (days/times) will be set each month and can rotate. At the end of each month, IJ and VA build the next month\u2019s call calendar, announce it in SmithFit FAM, and send a GHL email broadcast with the Zoom registration link.'));

children.push(spacer(120));
children.push(subheading('Available Call Types', C.calls));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 2400, 4560],
    rows: [
      new TableRow({ children: [hCell('Call Type', C.calls, 2400), hCell('Best Host', C.calls, 2400), hCell('Format', C.calls, 4560)] }),
      new TableRow({ children: [cell('Q&A', C.lightGrey, 2400, true), cell('IJ', C.white, 2400), cell('Open format. Members submit questions live. IJ answers. Great for high-engagement months.', C.white, 4560)] }),
      new TableRow({ children: [cell('Hack Week', C.white, 2400, true), cell('IJ or Coach Sony', C.white, 2400), cell('3\u20135 specific actionable tips around that month\u2019s theme (e.g., surviving holiday eating, starting a new rotation).', C.white, 4560)] }),
      new TableRow({ children: [cell('Educational Series', C.lightGrey, 2400, true), cell('IJ', C.white, 2400), cell('IJ teaches using Gamma slides. Companion resource dropped in community after. 1x per month.', C.white, 4560)] }),
      new TableRow({ children: [cell('Common Pitfalls', C.white, 2400, true), cell('IJ', C.white, 2400), cell('IJ reviews the most common struggles from community that month and walks through fixes.', C.white, 4560)] }),
      new TableRow({ children: [cell('Week Audit', C.lightGrey, 2400, true), cell('IJ or Coach Sony', C.white, 2400), cell('Members submit their week in advance. IJ or Coach Sony reviews 2\u20133 live on the call. Highly activating \u2014 creates competition to submit.', C.white, 4560)] }),
      new TableRow({ children: [cell('Group Workout', C.white, 2400, true), cell('Coach Sony', C.white, 2400), cell('Short 15-minute cortisol-conscious workout. Coach Sony leads. Form corrections welcome. Low barrier to join.', C.white, 4560)] }),
      new TableRow({ children: [cell('Hot Girl Walk', C.lightGrey, 2400, true), cell('Coach Sony or IJ', C.white, 2400), cell('Casual community-building call. No agenda. Walk and talk. Great for culture and retention.', C.white, 4560)] }),
    ],
  })
);

children.push(spacer(120));
children.push(subheading('Sample Monthly Calendar Template', C.calls));
children.push(note('IJ: Build this at the end of each prior month. The specific days/times flex \u2014 this is an example structure, not a fixed schedule.'));
children.push(spacer(80));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1440, 2160, 2880, 2880],
    rows: [
      new TableRow({ children: [hCell('Week', C.calls, 1440), hCell('Call Type', C.calls, 2160), hCell('Who Attends', C.calls, 2880), hCell('Host', C.calls, 2880)] }),
      new TableRow({ children: [cell('Week 1', C.lightGrey, 1440, true), cell('Educational Series', C.white, 2160), cell('All members (membership, bundle, high-ticket)', C.white, 2880), cell('IJ', C.white, 2880)] }),
      new TableRow({ children: [cell('Week 2', C.white, 1440, true), cell('Group Workout', C.white, 2160), cell('All members', C.white, 2880), cell('Coach Sony', C.white, 2880)] }),
      new TableRow({ children: [cell('Week 3', C.lightGrey, 1440, true), cell('Q&A', C.white, 2160), cell('All members', C.white, 2880), cell('IJ', C.white, 2880)] }),
      new TableRow({ children: [cell('Week 4', C.white, 1440, true), cell('Hack Week or Week Audit', C.white, 2160), cell('All members', C.white, 2880), cell('IJ or Coach Sony', C.white, 2880)] }),
    ],
  })
);
children.push(spacer(80));
children.push(note('Bundle VIP (Month 1) and high-ticket clients attend all 3 of their weekly calls using this same rotating format. The 3 calls/week are different sessions \u2014 not the same call three times.'));

children.push(spacer(120));
children.push(subheading('Monthly Calendar Build Process', C.calls));
children.push(bullet('Step 1: IJ selects 4 call types for the month (one per week) \u2014 can vary month to month'));
children.push(bullet('Step 2: VA schedules dates and times on Zoom and creates registration link'));
children.push(bullet('Step 3: VA posts the full month\u2019s call calendar in SmithFit FAM'));
children.push(bullet('Step 4: VA sends GHL email broadcast to all active members with the calendar + Zoom link'));
children.push(bullet('Step 5: For the Educational Series call, VA confirms the topic and companion resource is ready in advance'));
children.push(bullet('Timing: Calendar is built and announced by the last week of the prior month'));

children.push(spacer(120));
children.push(subheading('Post-Call Process', C.calls));
children.push(bullet('VA posts a call recap in SmithFit FAM within 24 hours (key takeaways, any resource from the call)'));
children.push(bullet('For Educational Series calls: VA emails the companion resource to all members via GHL broadcast'));
children.push(bullet('Week Audit calls: VA tags the clients who were audited so IJ can follow up personally'));

// ── PART 5: CONTENT PIPELINE ─────────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('PART 5: Educational Content Pipeline', C.content));
children.push(spacer(120));
children.push(body('Every month, 4 educational lessons are created, delivered in community, and used as content for the Educational Series call. Each lesson has two deliverables: a Gamma slide presentation and a companion resource (1-pager checklist or template).'));

children.push(spacer(120));
children.push(subheading('Monthly Workflow', C.content));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 3480, 3880],
    rows: [
      new TableRow({ children: [hCell('Step', C.content, 2000), hCell('Who Does It', C.content, 3480), hCell('How', C.content, 3880)] }),
      new TableRow({ children: [cell('1. Research topics', C.lightOrange, 2000, true), cell('VA', C.white, 3480), cell('Review this month\u2019s community questions, FitMetrics check-in trends, and search what nurses are asking about on social. Propose 6 topics.', C.white, 3880)] }),
      new TableRow({ children: [cell('2. Approve 4 topics', C.lightGrey, 2000, true), cell('IJ', C.white, 3480), cell('IJ selects 4 from the VA\u2019s list. One will be the Educational Series call topic.', C.white, 3880)] }),
      new TableRow({ children: [cell('3. Create Gamma lessons', C.lightOrange, 2000, true), cell('VA (or IJ for complex ones)', C.white, 3480), cell('Build slide deck in Gamma for each lesson. Keep it visual, scannable, nurse-friendly.', C.white, 3880)] }),
      new TableRow({ children: [cell('4. Create companion resources', C.lightGrey, 2000, true), cell('VA', C.white, 3480), cell('One 1-pager per lesson: checklist, template, or quick-reference guide. Can also be created in Gamma or Canva.', C.white, 3880)] }),
      new TableRow({ children: [cell('5. Deliver in community', C.lightOrange, 2000, true), cell('VA', C.white, 3480), cell('Post lesson as a Tuesday education post in SmithFit FAM. Drop companion resource same day or on Saturday.', C.white, 3880)] }),
      new TableRow({ children: [cell('6. Deliver via email', C.lightGrey, 2000, true), cell('VA', C.white, 3480), cell('Send companion resource to all active members via GHL broadcast same week.', C.white, 3880)] }),
      new TableRow({ children: [cell('7. Teach on call', C.lightOrange, 2000, true), cell('IJ', C.white, 3480), cell('One lesson per month becomes the live Educational Series call. IJ teaches using the Gamma slides.', C.white, 3880)] }),
    ],
  })
);

children.push(spacer(120));
children.push(subheading('Lesson Topic Ideas (Rotating Library)', C.content));
children.push(body('Topics should pull from the SmithFit core pillars: cortisol, circadian rhythm, metabolism, shift-proof nutrition, sleep, and mindset. Suggested starter topics:'));
children.push(spacer(60));
children.push(bullet('Why your belly fat is a cortisol problem, not a willpower problem'));
children.push(bullet('The Chaos Day Rescue Plan: how to eat like a nurse on your worst days'));
children.push(bullet('Circadian eating for shift workers: when to eat based on your shift type'));
children.push(bullet('The 3 hormones that control night shift cravings (and how to manage them)'));
children.push(bullet('How to build a Week 1 meal plan you\u2019ll actually follow'));
children.push(bullet('Reading your bloodwork as a shift nurse: what the BioSync portal flags for you'));
children.push(bullet('Sleep anchor protocol: getting quality sleep in any schedule'));
children.push(bullet('Progress that isn\u2019t the scale: 10 NSVs that mean your metabolism is shifting'));
children.push(bullet('Fast food survival guide: how to eat at drive-throughs without blowing your reset'));
children.push(bullet('The 15-minute workout: why short is the whole point'));

// ── PART 6: ENGAGEMENT INCENTIVES ────────────────────────────────────────────
children.push(pageBreak());
children.push(banner('PART 6: Engagement Incentives', C.incentives));
children.push(spacer(120));
children.push(body('Engagement is driven by four levers: culture (IJ\u2019s personal reactions), recognition (spotlight + milestones), accountability (week audits), and incentives (rewards and referrals).'));

children.push(spacer(120));
children.push(subheading('1. Wins Board Culture', C.incentives));
children.push(body('This is your most powerful engagement tool. The rule is simple: IJ reacts personally to every win posted. No exceptions during the first 90 days. When members see IJ celebrating them, they post more. When they post more, they get more results. When they get more results, they stay.'));
children.push(spacer(80));
children.push(bullet('IJ reacts to every Wins Board post \u2014 even if it\u2019s just a heart or a short reply'));
children.push(bullet('VA prompts Wins Board every Thursday and tags recent members who haven\u2019t posted yet'));
children.push(bullet('Mom monitors and flags any win that deserves a special IJ response (big milestone, emotional share)'));
children.push(bullet('Monthly: VA compiles top wins of the month to inform the SmithFit Spotlight selection'));

children.push(spacer(120));
children.push(subheading('2. Monthly SmithFit Spotlight', C.incentives));
children.push(body('Each month, one member is featured as the SmithFit Spotlight. This is the highest-visibility recognition in the community.'));
children.push(spacer(80));
children.push(bullet('IJ selects winner from Wins Board posts (most consistent, most inspiring, or biggest transformation that month)'));
children.push(bullet('VA creates a short spotlight post (member photo if available + their win + IJ\u2019s personal note)'));
children.push(bullet('Posted in SmithFit FAM community + IJ\u2019s Instagram (with member permission)'));
children.push(bullet('Member receives a personal DM from IJ congratulating them'));
children.push(note('Why this works: nurses are caregivers who rarely get recognized. Public recognition from IJ is extraordinarily motivating. The prospect of being featured drives ongoing community activity.'));

children.push(spacer(120));
children.push(subheading('3. Milestone Reward Schedule', C.incentives));
children.push(body('Rewards are automated via GHL email sequences. When a milestone fires, the community also celebrates publicly.'));
children.push(spacer(80));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 3480, 3480],
    rows: [
      new TableRow({ children: [hCell('Milestone', C.incentives, 2400), hCell('Reward', C.incentives, 3480), hCell('Community Callout', C.incentives, 3480)] }),
      new TableRow({ children: [cell('Day 30', C.lightPurple, 2400, true), cell('$5 Amazon gift card', C.white, 3480), cell('VA posts "30-Day Club" shoutout in SmithFit FAM', C.white, 3480)] }),
      new TableRow({ children: [cell('Day 60', C.lightGrey, 2400, true), cell('$10 Amazon gift card', C.white, 3480), cell('VA posts shoutout tagging all Day 60 members', C.white, 3480)] }),
      new TableRow({ children: [cell('Day 90', C.lightPurple, 2400, true), cell('$15 Amazon gift card + physical gift mailed', C.white, 3480), cell('IJ personally posts congratulations. Big moment.', C.white, 3480)] }),
      new TableRow({ children: [cell('Day 180', C.lightGrey, 2400, true), cell('$25 Amazon gift card', C.white, 3480), cell('VA spotlight post in FAM', C.white, 3480)] }),
      new TableRow({ children: [cell('Day 365', C.lightPurple, 2400, true), cell('$75 Amazon gift card', C.white, 3480), cell('IJ personal video message + community celebration', C.white, 3480)] }),
      new TableRow({ children: [cell('50 Workouts', C.lightGrey, 2400, true), cell('$15 Amazon gift card', C.white, 3480), cell('VA posts "50 Strong" badge shoutout in FAM', C.white, 3480)] }),
    ],
  })
);
children.push(note('Mailing address for Day 90 physical gift: collect via [MAILING FORM LINK] \u2014 add to Day 30 email or intake form so it\u2019s ready by Day 90.'));

children.push(spacer(120));
children.push(subheading('4. Week Audit as Engagement Driver', C.incentives));
children.push(body('The Week Audit call type is one of the best engagement tools in the playbook. Members compete to submit their week because being selected means getting personalized feedback from IJ live on a call.'));
children.push(spacer(80));
children.push(bullet('VA announces Week Audit call in FAM 5 days in advance: "Submit your week for a chance to have IJ review it live"'));
children.push(bullet('Members submit via a simple format: what they ate, workouts, sleep, wins, biggest struggle'));
children.push(bullet('IJ selects 2\u20133 submissions to review live'));
children.push(bullet('VA follows up with ALL submitters post-call to confirm they watched'));
children.push(bullet('Creates recurring culture of self-tracking and accountability'));

children.push(spacer(120));
children.push(subheading('5. Referral Program', C.incentives));
children.push(body('REF-01 fires automatically at Day 45 of membership. The referral program is also a community engagement tool \u2014 nurses refer other nurses they work with, which creates friend groups inside the community and dramatically improves retention.'));
children.push(spacer(80));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    rows: [
      new TableRow({ children: [hCell('Tier', C.incentives, 3000), hCell('Reward', C.incentives, 6360)] }),
      new TableRow({ children: [cell('Per referral (30+ days)', C.lightPurple, 3000, true), cell('$10 gift card for every nurse who joins and stays 30+ days', C.white, 6360)] }),
      new TableRow({ children: [cell('5 active referrals', C.lightGrey, 3000, true), cell('Referrer\u2019s membership is FREE every month they maintain 5+ active members', C.white, 6360)] }),
      new TableRow({ children: [cell('10 active referrals', C.lightPurple, 3000, true), cell('$50 cash bonus every quarter they maintain 10+ active members', C.white, 6360)] }),
      new TableRow({ children: [cell('Referred friend', C.lightGrey, 3000, true), cell('Gets the $27 Reset Course free (their entry point into the funnel)', C.white, 6360)] }),
    ],
  })
);
children.push(spacer(80));
children.push(note('Referral tracking link: [REFERRAL LINK] \u2014 replace this placeholder with your GHL affiliate/referral tracking link when ready.'));

// ── FINAL PAGE: PLACEHOLDERS SUMMARY ─────────────────────────────────────────
children.push(pageBreak());
children.push(banner('Open Placeholders in This Playbook', '888888'));
children.push(spacer(120));
children.push(body('The following items need to be finalized before this playbook is fully operational. See the SmithFit Open Items Checklist for step-by-step instructions on each.'));
children.push(spacer(80));
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3480, 5880],
    rows: [
      new TableRow({ children: [hCell('Placeholder', '888888', 3480), hCell('What It Is', '888888', 5880)] }),
      new TableRow({ children: [cell('[CALENDLY LINK]', C.lightGrey, 3480, true), cell('Booking link for 60-min onboarding call with IJ (bundle clients)', C.white, 5880)] }),
      new TableRow({ children: [cell('[ZOOM LINK]', C.white, 3480, true), cell('Recurring Zoom link for weekly community calls', C.white, 5880)] }),
      new TableRow({ children: [cell('[BIOSYNC LINK]', C.lightGrey, 3480, true), cell('BioSync Bloodwork Portal access link', C.white, 5880)] }),
      new TableRow({ children: [cell('[MAILING FORM LINK]', C.white, 3480, true), cell('Form to collect mailing address for Day 90 physical gift', C.white, 5880)] }),
      new TableRow({ children: [cell('[REFERRAL LINK]', C.lightGrey, 3480, true), cell('GHL affiliate/referral tracking link for REF-01 email and community posts', C.white, 5880)] }),
      new TableRow({ children: [cell('[1-ON-1 APPLICATION LINK]', C.white, 3480, true), cell('Application link for high-ticket 1-on-1 coaching (used in select upgrade emails)', C.white, 5880)] }),
    ],
  })
);

// ── BUILD DOC ────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'checks',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 400 } } },
        }],
      },
      {
        reference: 'checks-sub',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 800, hanging: 400 } } },
        }],
      },
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
      {
        reference: 'bullets-sub',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 800, hanging: 280 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 20 } },
    },
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
          children: [new TextRun({ text: 'SmithFit Client Experience & Community Playbook', size: 16, font: 'Arial', color: '888888' })],
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
    children,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`✅ Saved: ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(1)} KB)`);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
