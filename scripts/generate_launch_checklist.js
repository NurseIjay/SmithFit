'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer
} = require('docx');
const fs   = require('fs');
const path = require('path');

const OUTPUT = path.resolve(
  __dirname,
  '../27 Course Funnel/Docs created Claude/SmithFit Launch Checklist.docx'
);

// ── colours ────────────────────────────────────────────────────────────────
const COL = {
  p1:    'C00000', // red
  p2:    '2E75B6', // blue
  p3:    '375623', // green
  p4:    'C55A11', // orange
  p5:    '7030A0', // purple
  p6:    '1F7744', // dark green
  navy:  '1F2D3D',
  gray:  '595959',
  lgray: 'AAAAAA',
  amber: 'B8860B',
  amberBg: 'FFF8E1',
  white: 'FFFFFF',
};
const phaseCol = n => [COL.p1,COL.p2,COL.p3,COL.p4,COL.p5,COL.p6][n-1];

// ── borders ─────────────────────────────────────────────────────────────────
const bdr = (color='CCCCCC', size=4) =>
  ({ style: BorderStyle.SINGLE, size, color });
const cellBorders = c => ({ top:bdr(c),bottom:bdr(c),left:bdr(c),right:bdr(c) });

// ── text helpers ─────────────────────────────────────────────────────────────
const t = (text, opts={}) =>
  new TextRun({ text, font:'Arial', size:22, ...opts });
const b = (text, opts={}) =>
  t(text, { bold:true, ...opts });

// ── paragraph helpers ─────────────────────────────────────────────────────────
function p(children, opts={}) {
  const arr = Array.isArray(children) ? children : [children];
  return new Paragraph({ children: arr, spacing:{ before:60, after:60 }, ...opts });
}
function sp() { return p(t(''), { spacing:{ before:60, after:60 } }); }
function divider() {
  return p([], {
    spacing:{ before:140, after:80 },
    border:{ bottom:{ style:BorderStyle.SINGLE, size:3, color:'DDDDDD', space:1 } }
  });
}
function note(text) {
  return p(t(text, { italics:true, color:COL.gray }), { spacing:{ before:60, after:100 } });
}
function warn(text) {
  return new Paragraph({
    spacing:{ before:80, after:100 },
    shading:{ fill:'FFF8E1', type:ShadingType.CLEAR },
    indent:{ left:240, right:240 },
    children:[
      t('Important: ', { bold:true, color:'7D4E00' }),
      t(text, { color:'7D4E00' })
    ]
  });
}

// ── checkbox items ────────────────────────────────────────────────────────────
function chk(text, sub=false) {
  return new Paragraph({
    numbering:{ reference: sub ? 'checks-sub' : 'checks', level:0 },
    spacing:{ before:40, after:40 },
    children:[ t(text) ]
  });
}

// ── phase heading (coloured banner row) ───────────────────────────────────────
function phaseHeader(num, title, owner, time, pageBreak=true) {
  const c = phaseCol(num);
  return [
    new Paragraph({
      pageBreakBefore: pageBreak && num > 1,
      spacing:{ before: num===1 ? 120 : 0, after:0 },
      shading:{ fill:c, type:ShadingType.CLEAR },
      children:[
        t(`  PHASE ${num} — ${title}`, { bold:true, size:32, color:'FFFFFF' })
      ]
    }),
    p([
      b(`Owner: `, { color:c }),
      t(owner, { color:c }),
      t('     |     ', { color:COL.lgray }),
      b(`Est. time: `, { color:COL.gray }),
      t(time, { color:COL.gray })
    ], { spacing:{ before:60, after:100 } })
  ];
}

// ── step sub-heading ──────────────────────────────────────────────────────────
function stepHead(text, color='000000') {
  return new Paragraph({
    spacing:{ before:200, after:80 },
    children:[ t(text, { bold:true, size:24, color }) ]
  });
}

// ── time-estimate table ───────────────────────────────────────────────────────
function estimateTable() {
  const bdr4 = cellBorders('CCCCCC');
  const cols = [5040, 2160, 2160]; // sum = 9360
  const hdrFill = { fill:'1F2D3D', type:ShadingType.CLEAR };
  const rows = [
    ['Phase 1 — Connect the Products',      'IJ',       '1–2 hours'],
    ['Phase 2 — Build the 5 Workflows',     'IJ',       '2–3 hours'],
    ['Phase 3 — VA Tasks (runs in parallel)','VA',      '60–90 minutes'],
    ['Phase 4 — Fill in the Blanks',        'IJ',       '30–60 minutes'],
    ['Phase 5 — Test Before Launch',        'IJ + VA',  '30–45 minutes'],
    ['Phase 6 — Launch',                    'IJ',       '~1 hour'],
  ];
  const phColors = [COL.p1,COL.p2,COL.p3,COL.p4,COL.p5,COL.p6];

  const cell = (text, w, isHdr=false, color='000000', fill='FFFFFF') =>
    new TableCell({
      borders: bdr4,
      width:{ size:w, type:WidthType.DXA },
      shading:{ fill, type:ShadingType.CLEAR },
      margins:{ top:80, bottom:80, left:120, right:120 },
      children:[p([t(text, { size:20, bold:isHdr, color })])]
    });

  return new Table({
    width:{ size:9360, type:WidthType.DXA },
    columnWidths: cols,
    rows:[
      new TableRow({
        tableHeader:true,
        children:['Phase','Owner','Est. Time'].map((h,i) => cell(h, cols[i], true, 'FFFFFF', '1F2D3D'))
      }),
      ...rows.map((row, ri) => new TableRow({
        children:[
          cell(row[0], cols[0], true, phColors[ri], ri%2===0?'FFFFFF':'F9F9F9'),
          cell(row[1], cols[1], false, '000000', ri%2===0?'FFFFFF':'F9F9F9'),
          cell(row[2], cols[2], false, '000000', ri%2===0?'FFFFFF':'F9F9F9'),
        ]
      }))
    ]
  });
}

// ── open items table ──────────────────────────────────────────────────────────
function openItemsTable() {
  const bdr4 = cellBorders('CCCCCC');
  const cols = [3240, 900, 1260, 3960]; // sum = 9360
  const items = [
    ['Day 90 physical gift — decide the item','IJ','Not Started','Compression socks are on-brand; open to other ideas'],
    ['Calendly booking link','IJ','Not Started','Needed before BNDL-01 and BNDL-02 go live'],
    ['Weekly coaching call day + time','IJ','Not Started','Confirm before MEM-01 is sent to real members'],
    ['GHL referral tracking link','IJ','Not Started','Set up in GHL Marketing → Affiliate Manager'],
    ['Mailing address form (Day 90 gift)','IJ / VA','Not Started','Google Form or Typeform — 5-minute build'],
    ['1-on-1 coaching application link','IJ','Not Started','Used in high-ticket application emails'],
    ['Confirm milestone gift card amounts','IJ','Pending','Currently $5/$10/$15/$25/$75/$15 — confirm before Day 30'],
    ['Cancellation salvage email sequence (3 emails)','IJ / Claude','Not Started','For members who cancel — not written yet'],
    ['Welcome video scripts (MEM-02 through MEM-05)','IJ','Not Started','To be scripted in Claude — use /reel-script'],
    ['Truemed / HSA financing marketing angle','IJ / Claude','Not Started','Strong ad angle — nurses may use FSA/HSA funds'],
  ];

  const statusColor = s =>
    s==='Not Started' ? 'C00000' : s==='Pending' ? 'C55A11' : '375623';

  const cell = (text, w, isHdr=false, color='000000', fill='FFFFFF') =>
    new TableCell({
      borders: bdr4,
      width:{ size:w, type:WidthType.DXA },
      shading:{ fill, type:ShadingType.CLEAR },
      margins:{ top:80, bottom:80, left:120, right:120 },
      children:[p([t(text, { size:isHdr?20:18, bold:isHdr, color })])]
    });

  return new Table({
    width:{ size:9360, type:WidthType.DXA },
    columnWidths: cols,
    rows:[
      new TableRow({
        tableHeader:true,
        children:['Item','Owner','Status','Notes'].map((h,i)=>cell(h,cols[i],true,'FFFFFF','1F2D3D'))
      }),
      ...items.map((row,ri)=>{
        const fill = ri%2===0 ? 'FFFFFF' : 'F9F9F9';
        return new TableRow({ children:[
          cell(row[0], cols[0], false, '000000', fill),
          cell(row[1], cols[1], false, '000000', fill),
          cell(row[2], cols[2], false, statusColor(row[2]), fill),
          cell(row[3], cols[3], false, COL.gray, fill),
        ]});
      })
    ]
  });
}

// ══════════════════════════════════════════════════════════════════════════════
//  BUILD DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering:{
    config:[
      {
        reference:'checks',
        levels:[{
          level:0, format:LevelFormat.BULLET, text:'\u2610',
          alignment:AlignmentType.LEFT,
          style:{
            run:{ font:'Segoe UI Symbol', size:22 },
            paragraph:{ indent:{ left:400, hanging:400 } }
          }
        }]
      },
      {
        reference:'checks-sub',
        levels:[{
          level:0, format:LevelFormat.BULLET, text:'\u2610',
          alignment:AlignmentType.LEFT,
          style:{
            run:{ font:'Segoe UI Symbol', size:22 },
            paragraph:{ indent:{ left:800, hanging:400 } }
          }
        }]
      }
    ]
  },
  sections:[{
    properties:{
      page:{
        size:{ width:12240, height:15840 },
        margin:{ top:1440, right:1440, bottom:1440, left:1440 }
      }
    },
    headers:{
      default: new Header({ children:[
        new Paragraph({
          spacing:{ before:0, after:80 },
          border:{ bottom:{ style:BorderStyle.SINGLE, size:3, color:'DDDDDD', space:1 } },
          children:[ t('SmithFit Launch Checklist', { size:18, color:COL.lgray }) ]
        })
      ]})
    },
    children:[

      // ─ TITLE ─
      p(b('SmithFit', { size:52, color:COL.p2 }), { spacing:{ before:200, after:40 } }),
      p(t('Launch Checklist', { size:44, bold:true, color:COL.navy }),{ spacing:{ before:0, after:60 } }),
      p(t('Your complete step-by-step guide to launching the $27 funnel — in the right order', { size:22, italics:true, color:COL.gray }),{ spacing:{ before:0, after:240 } }),

      // ─ INTRO ─
      p([
        t("You're closer than it feels. The hard creative work is done — the course is recorded, the emails are written, the pages are nearly ready. What remains is mostly connection work: hooking up the pieces so the machine can run. "),
        b('Work through phases in order. '),
        t('Phase 1 must happen before anything else. Phases 2 and 3 run at the same time (hand Phase 3 to your VA the moment you start Phase 2). Check off each item as you complete it.'),
      ]),
      sp(),

      // ─ ESTIMATES TABLE ─
      p(b('Time estimates per phase:', { size:22, color:COL.navy }), { spacing:{ before:80, after:60 } }),
      estimateTable(),
      sp(), sp(),

      // ══════════ PHASE 1 ══════════
      ...phaseHeader(1, 'CONNECT THE PRODUCTS', 'IJ — do this first', '1–2 hours', false),
      note("Nothing else matters until people can actually buy. The pages exist but aren't connected to real products — nobody can check out yet. This phase fixes that."),
      p([
        t('Log in to GHL at hub.courseiq.app. All product setup is under '),
        b('Payments → Products'),
        t(' in the left sidebar.'),
      ]),

      divider(),
      stepHead('Step 1 — Create the $27 Product', COL.p1),
      chk('Go to Payments → Products → + New Product'),
      chk('Name it: 7-Day Shift-Proof Metabolism Reset'),
      chk('Set price to: $27.00'),
      chk('Set type to: One-time payment'),
      chk('Description (optional): "7-Day Shift-Proof Metabolism Reset — full course access"'),
      chk('Save the product'),

      divider(),
      stepHead('Step 2 — Create the $67/Month Membership Product', COL.p1),
      chk('Go to Payments → Products → + New Product'),
      chk('Name it: Metabolic Breakthrough Membership'),
      chk('Set price to: $67.00'),
      chk('Set type to: Recurring subscription'),
      chk('Set billing interval to: Monthly'),
      chk('Save the product'),

      divider(),
      stepHead('Step 3 — Create the 14-Day Free Trial Product', COL.p1),
      chk('Go to Payments → Products → + New Product'),
      chk('Name it: Metabolic Breakthrough Membership — Free Trial'),
      chk('Set price to: $0.00 for trial period, then $67.00/month after'),
      chk('Set trial period to: 14 days'),
      chk('Set to Require card at signup (auto-charges Day 15 if not cancelled)'),
      chk('Save the product'),
      note('Note: If GHL does not support a $0 trial natively on a subscription, create a 100% off coupon for 14 days — ask GHL support chat if unsure.'),

      divider(),
      stepHead('Step 4 — Create the 6-Month Bundle Product', COL.p1),
      chk('Go to Payments → Products → + New Product'),
      chk('Name it: SmithFit 6-Month Bundle'),
      chk('Set price to: $335.00'),
      chk('Set type to: One-time payment (covers 6 months of membership access)'),
      chk('Save the product'),

      divider(),
      stepHead('Step 5 — Create the 12-Month Bundle Product', COL.p1),
      chk('Go to Payments → Products → + New Product'),
      chk('Name it: SmithFit 12-Month Bundle'),
      chk('Set price to: $588.00'),
      chk('Set type to: One-time payment'),
      chk('Save the product'),

      divider(),
      stepHead('Step 6 — Connect Buy Buttons on Each Sales Page', COL.p1),
      p([
        t('For each page: '),
        b('Sites → Funnels → [your funnel name]'),
        t(' → click the step → edit the page → click the order form element → select the product from the dropdown → save.'),
      ]),
      sp(),
      chk('$27 tripwire page → connect order form to 7-Day Shift-Proof Metabolism Reset ($27)'),
      chk('$67/mo upsell page → connect order form to Metabolic Breakthrough Membership ($67/mo)'),
      chk('14-day free trial downsell page → connect order form to Metabolic Breakthrough Membership — Free Trial'),
      chk('6-month bundle page → connect order form to SmithFit 6-Month Bundle ($335)'),
      chk('12-month bundle page → connect order form to SmithFit 12-Month Bundle ($588)'),

      divider(),
      stepHead('Step 7 — Run a Test Purchase', COL.p1),
      chk('Use GHL test card: 4242 4242 4242 4242, any future expiry, any CVC'),
      chk('Purchase the $27 course as yourself'),
      chk('Confirm you land on the correct confirmation/upsell page'),
      chk('Confirm you receive a purchase confirmation email'),
      chk('Confirm the correct tag is applied to your test contact in GHL'),

      // ══════════ PHASE 2 ══════════
      ...phaseHeader(2, 'BUILD THE 5 EMAIL WORKFLOWS', 'IJ — do after Phase 1', '2–3 hours'),
      note('The 32 email templates are already written and sitting in GHL. You are not writing anything — just clicking, selecting, and saving. These workflows fire the right emails at the right time automatically.'),
      p([
        t('Go to '),
        b('Automation → Workflows'),
        t(' in the left sidebar. Create a folder called '),
        b('SmithFit Automations'),
        t(' to stay organized.'),
      ]),

      divider(),
      stepHead('Workflow 1 — Membership Day 1 Onboarding', COL.p2),
      p([ b('Trigger: '), t('Tag added → membership-active'), t('  |  '), b('Sends: '), t('6 emails over 45 days') ]),
      sp(),
      chk('Click + New Workflow → Start from scratch → Name it: SmithFit — Membership Onboarding'),
      chk('Set trigger: Contact Tag → Tag added → membership-active'),
      chk('Add action: Send Email → MEM-01: Welcome to SmithFit'),
      chk('Add action: Wait → 2 days'),
      chk('Add action: Send Email → MEM-02: Did You Do the Cocktail'),
      chk('Add action: Wait → 5 days'),
      chk('Add action: Send Email → MEM-03: One Week In'),
      chk('Add action: Wait → 7 days'),
      chk('Add action: Send Email → MEM-04: Two Weeks'),
      chk('Add action: Wait → 16 days'),
      chk('Add action: Send Email → MEM-05: One Month In'),
      chk('Add action: Wait → 15 days'),
      chk('Add action: Send Email → MEM-06: Day 45 — The Upgrade Email'),
      chk('Add action: Add Tag → fomo-track-a-active'),
      chk('Click Save → toggle to Published'),

      divider(),
      stepHead('Workflow 2 — Bundle Onboarding', COL.p2),
      p([ b('Trigger: '), t('Tag added → bundle-active'), t('  |  '), b('Sends: '), t('4 emails over 28 days') ]),
      sp(),
      chk('Click + New Workflow → Name it: SmithFit — Bundle Onboarding'),
      chk('Set trigger: Contact Tag → Tag added → bundle-active'),
      chk('Add action: Send Email → BNDL-01: Welcome Bundle'),
      chk('Add action: Add Tag → new-bundle'),
      chk('Add action: Wait → 1 day'),
      chk('Add action: Send Email → BNDL-02: Your Gameplan'),
      chk('Add action: Wait → 6 days'),
      chk('Add action: Send Email → BNDL-03: One Week In'),
      chk('Add action: Wait → 21 days'),
      chk('Add action: Send Email → BNDL-04: VIP Month Ending'),
      chk('Add action: Add Tag → coach-review'),
      chk('Click Save → toggle to Published'),
      warn('The coach-review tag is your personal signal to check in with this client. Go to Settings → Notifications in GHL and set up an alert so you get notified when this tag is applied.'),

      divider(),
      stepHead('Workflow 3 — FOMO Track A: Monthly Member → Bundle Upgrade', COL.p2),
      p([ b('Trigger: '), t('Tag added → fomo-track-a-active (auto-added at end of Workflow 1)'), t('  |  '), b('4 emails over 75 days') ]),
      sp(),
      chk('Click + New Workflow → Name it: SmithFit — FOMO Track A (Monthly → Bundle)'),
      chk('Set trigger: Contact Tag → Tag added → fomo-track-a-active'),
      chk('Add Filter/Condition at the top: Contact does NOT have tag bundle-active'),
      chk('Add action: Send Email → FOMO-A1: One Month In'),
      chk('Add action: Wait → 15 days'),
      chk('Add action: Send Email → FOMO-A2: She Lost 31 lbs'),
      chk('Add action: Wait → 15 days'),
      chk('Add action: Send Email → FOMO-A3: The Math on Month-to-Month'),
      chk('Add action: Wait → 15 days'),
      chk('Add action: Send Email → FOMO-A4: Last Call'),
      chk('Add action: Remove Tag → fomo-track-a-active'),
      chk('Add action: Add Tag → fomo-track-a-complete'),
      chk('Click Save → toggle to Published'),

      divider(),
      stepHead('Workflow 4 — FOMO Track B: 6-Month → 12-Month Upgrade', COL.p2),
      p([ b('Trigger: '), t('Tag added → 6-month-bundle'), t('  |  '), b('4 emails over 140 days') ]),
      sp(),
      chk('Click + New Workflow → Name it: SmithFit — FOMO Track B (6-Month → 12-Month)'),
      chk('Set trigger: Contact Tag → Tag added → 6-month-bundle'),
      chk('Add Filter/Condition: Contact does NOT have tag 12-month-bundle'),
      chk('Add action: Wait → 45 days'),
      chk('Add action: Send Email → FOMO-B1: 45 Days In'),
      chk('Add action: Wait → 30 days'),
      chk('Add action: Send Email → FOMO-B2: Coach In Your Pocket'),
      chk('Add action: Wait → 25 days'),
      chk('Add action: Send Email → FOMO-B3: Month 3 Is Coming'),
      chk('Add action: Wait → 40 days'),
      chk('Add action: Send Email → FOMO-B4: Your 6-Month Commitment Ends'),
      chk('Add action: Remove Tag → fomo-track-b-active'),
      chk('Add action: Add Tag → fomo-track-b-complete'),
      chk('Click Save → toggle to Published'),

      divider(),
      stepHead('Workflow 5 — FOMO Track C: Free Trial → Paid Conversion', COL.p2),
      p([ b('Trigger: '), t('Tag added → free-trial-active'), t('  |  '), b('6 emails over 14 days, then branch on Day 15') ]),
      sp(),
      chk('Click + New Workflow → Name it: SmithFit — FOMO Track C (Free Trial → Paid)'),
      chk('Set trigger: Contact Tag → Tag added → free-trial-active'),
      chk('Add action: Send Email → FOMO-C1: Your 14-Day Free Trial Starts Now'),
      chk('Add action: Wait → 3 days'),
      chk('Add action: Send Email → FOMO-C2: Day 3 Check-In'),
      chk('Add action: Wait → 4 days'),
      chk('Add action: Send Email → FOMO-C3: Halfway'),
      chk('Add action: Wait → 3 days'),
      chk('Add action: Send Email → FOMO-C4: Keep Everything for $2.25/Day'),
      chk('Add action: Wait → 2 days'),
      chk('Add action: Send Email → FOMO-C5: She Almost Cancelled on Day 11'),
      chk('Add action: Wait → 1 day'),
      chk('Add action: Send Email → FOMO-C6: Your Trial Ends Today'),
      chk('Add action: Wait → 1 day'),
      chk('Add action: If/Else → condition: Contact HAS tag trial-converted'),
      p([ b('  YES branch: '), t('End the workflow — no action needed (they paid, they stay)') ],
        { spacing:{ before:40, after:20 }, indent:{ left:400 } }),
      p([ b('  NO branch: '), t('complete the three steps below') ],
        { spacing:{ before:20, after:40 }, indent:{ left:400 } }),
      chk('Send Email → FOMO-C7: You Left. The Door Is Still Open.', true),
      chk('Remove Tag → free-trial-active', true),
      chk('Add Tag → trial-cancelled', true),
      chk('Click Save → toggle to Published'),

      divider(),
      stepHead('After All 5 Workflows Are Built', COL.p2),
      chk('Confirm all 5 workflows show as Published (not Draft) in the Workflows list'),
      chk('From your computer terminal, run: python3 /Users/ijsmith/SmithFit/scripts/ghl/verify.py'),
      chk('Hand off Phase 3 to VA (if you have not already)'),

      // ══════════ PHASE 3 ══════════
      ...phaseHeader(3, 'VA TASKS', 'VA — runs in parallel with Phase 2', '60–90 minutes'),
      note('These tasks do not depend on Phase 2 being finished. Hand this to your VA the same day you start Phase 2. Full step-by-step instructions with message copy are in the file: VA_FitMetrics_Setup_Instructions.docx'),

      divider(),
      stepHead('Part A — Weekly Recurring Broadcasts in FitMetrics (4 total)', COL.p3),
      note('Set up once — these run forever to all active members. Message copy is in the VA doc.'),
      chk('Monday 8:00 AM — New Week Activation — set to recurring weekly — Activate'),
      chk('Wednesday 9:00 AM — Win Wednesday — set to recurring weekly — Activate'),
      chk('Saturday 9:00 AM — Rest + Reflect — set to recurring weekly — Activate'),
      chk('Sunday 7:00 PM — Prep + Preview — set to recurring weekly — Activate'),
      chk('Confirm all 4 show as Active in FitMetrics before marking this done'),

      divider(),
      stepHead('Part B — Milestone DMs in FitMetrics (8 total)', COL.p3),
      note('Copy and paste message copy from the VA doc exactly. Do not edit the wording.'),
      chk('Day 7 — First Week Done — fire once per client — Activate'),
      chk('Day 14 — Two-Week Warrior — fire once per client — Activate'),
      chk('Day 30 — One Month Strong — fire once per client — Activate  (also triggers $5 gift card email via GHL — notify IJ when live)'),
      chk('Day 45 — Milestone — fire once per client — Activate'),
      chk('Day 60 — 60-Day Shifter — fire once per client — Activate  (also triggers $10 gift card email via GHL)'),
      chk('Day 90 — 90-Day Identity Shift — fire once per client — Activate  (also triggers $15 gift card + mailing address form via GHL)'),
      chk('Day 180 — Six-Month Transformation — fire once per client — Activate  (also triggers $25 gift card via GHL)'),
      chk('Day 365 — One Full Year — fire once per client — Activate  (also triggers $75 gift card via GHL)'),
      chk('Confirm all 8 show as Active and set to fire once per client'),

      divider(),
      stepHead('Part C — Habit Streak & Workout Automations in FitMetrics (5 total)', COL.p3),
      chk('7-day habit streak — Activate'),
      chk('21-day habit streak — Activate'),
      chk('30-day full reset (all 4 habits checked 30 consecutive days) — Activate  (VA must notify IJ when this fires so she can post in the community)'),
      chk('10 workouts completed — Activate'),
      chk('50 workouts completed — Activate  (also triggers $15 gift card email via GHL)'),
      chk('Confirm all 5 show as Active'),

      divider(),
      stepHead('Part D — Course Homepage Cosmetic Edit', COL.p3),
      chk('Log in to the course platform (GHL or Trainerize — wherever the course homepage lives)'),
      chk('Update the banner image to something polished and on-brand'),
      chk('Confirm the homepage looks presentable — not a default template'),
      chk('Screenshot and send to IJ for approval before marking done'),

      // ══════════ PHASE 4 ══════════
      ...phaseHeader(4, 'FILL IN THE BLANKS', 'IJ — before going fully live', '30–60 minutes'),
      note('Seven placeholders exist in the email templates that need real links and decisions. If you go live without fixing these, customers will see broken or missing links in their emails.'),

      divider(),
      stepHead('1.  [CALENDLY LINK] — Bundle onboarding booking link', COL.p4),
      p([ b('What it is: '), t('The link bundle clients use to book their 60-minute personal gameplan call with you.') ]),
      p([ b('Where to create it: '), t('Go to calendly.com → create a new event type → set it to 60 minutes → name it "SmithFit Bundle Onboarding Call" → copy the link.') ]),
      p([ b('Which emails: '), t('BNDL-01, BNDL-02') ]),
      chk('Create the Calendly event and copy your booking link'),
      chk('GHL → Email Marketing → Templates → open BNDL-01 → find [CALENDLY LINK] → replace with your real URL → save'),
      chk('Do the same in BNDL-02'),
      chk('Search all other templates for [CALENDLY LINK] and replace if found'),

      divider(),
      stepHead('2.  Weekly Coaching Call Day + Time', COL.p4),
      p([ b('What it is: '), t('The day and time of your weekly group coaching call mentioned in the membership onboarding emails.') ]),
      p([ b('Which emails: '), t('MEM-01, MEM-02, and others in the membership sequence') ]),
      chk('Confirm your weekly call day and time (example: Wednesdays at 7 PM CT)'),
      chk('GHL → Email Marketing → Templates → open MEM-01 → find the call day/time reference → update it → save'),
      chk('Repeat for MEM-02 and any other membership emails that reference the call'),

      divider(),
      stepHead('3.  [REFERRAL LINK] — Referral tracking link', COL.p4),
      p([ b('What it is: '), t('The unique link members use to refer other nurses. Credited to the referrer when used.') ]),
      p([ b('Where to create it: '), t('GHL → Marketing → Affiliate Manager → set up a referral program → copy the tracking link format.') ]),
      p([ b('Which email: '), t('REF-01 (fires at Day 45 of membership)') ]),
      chk('Set up GHL affiliate/referral module and copy your referral link'),
      chk('Open template REF-01 in GHL → replace [REFERRAL LINK] with the real link → save'),

      divider(),
      stepHead('4.  [MAILING FORM LINK] — Day 90 address collection form', COL.p4),
      p([ b('What it is: '), t('A simple form where Day 90 members submit their mailing address for the physical gift.') ]),
      p([ b('Where to create it: '), t('Google Forms or Typeform — collect name, mailing address, and email. Takes 5 minutes.') ]),
      p([ b('Which email: '), t('Day 90 milestone email (MILE-90)') ]),
      chk('Create the mailing address collection form'),
      chk('Copy the form link'),
      chk('Find the Day 90 email template in GHL → replace [MAILING FORM LINK] → save'),

      divider(),
      stepHead('5.  [1-ON-1 APPLICATION LINK] — High-ticket coaching application', COL.p4),
      p([ b('What it is: '), t('Link to apply for 1-on-1 personal coaching with IJ. This is separate from and above the membership — a higher-ticket offer.') ]),
      p([ b('Where to create it: '), t('Any form works — Google Form, Typeform, or GHL survey. Ask questions to qualify high-ticket applicants.') ]),
      chk('Create a short coaching application form'),
      chk('Copy the link'),
      chk('Search GHL email templates for [1-ON-1 APPLICATION LINK] → replace in all instances → save'),

      divider(),
      stepHead('6.  Confirm Milestone Gift Card Amounts', COL.p4),
      p([ b('Current amounts: '), t('$5 (Day 30)  /  $10 (Day 60)  /  $15 (Day 90)  /  $25 (Day 180)  /  $75 (Day 365)  /  $15 (50 workouts)') ]),
      p([ t('These need to be real commitments you can follow through on once members start hitting milestones.') ]),
      chk('Review and confirm the amounts — or adjust before launch'),
      chk('If you change any amounts, update the relevant GHL email templates to match'),

      divider(),
      stepHead('7.  Decide the Day 90 Physical Gift Item', COL.p4),
      p([ b('What it is: '), t('The physical item you mail to members who hit 90 days. The email says "something in the mail" — decide what that is.') ]),
      p([ b('Ideas: '), t('Compression socks (very on-brand for nurses), a SmithFit branded tumbler or bag, a handwritten card, or a small self-care gift.') ]),
      chk('Decide on the physical gift item'),
      chk('Update the Day 90 email template in GHL to name the specific item'),
      chk('Set up a way to source and mail these (Amazon, Printful, or manual ordering)'),

      // ══════════ PHASE 5 ══════════
      ...phaseHeader(5, 'TEST BEFORE LAUNCH', 'IJ + VA — final check', '30–45 minutes'),
      note('Do not announce publicly until you have walked through the full purchase experience yourself. This catches broken links, missing emails, and tag errors before real customers see them.'),
      p([ t('Use a real email address you can check — not your main email. Use a Gmail alias or a test account.') ]),

      divider(),
      stepHead('Purchase Flow Tests', COL.p5),
      chk('Buy the $27 course as a test customer → confirm you land on the correct thank-you/upsell page → confirm you receive a purchase confirmation email'),
      chk('Accept the $67/month upsell → confirm tag membership-active is applied in GHL → confirm MEM-01 arrives in your inbox within a few minutes'),
      chk('Separate test: decline $67/month → accept free trial → confirm tag free-trial-active is applied → confirm FOMO-C1 arrives'),
      chk('Separate test: purchase a bundle → confirm tag bundle-active is applied → confirm BNDL-01 arrives'),

      divider(),
      stepHead('FitMetrics Confirmation (VA completes this)', COL.p5),
      chk('Confirm all 4 weekly broadcasts show as Active and scheduled'),
      chk('Confirm all 8 milestone DMs show as Active and set to fire once per client'),
      chk('Confirm all 5 streak/workout automations show as Active'),
      chk('Spot-check: trigger one test milestone manually if FitMetrics allows it, confirm the message sends'),

      divider(),
      stepHead('Final Link and Page Check', COL.p5),
      chk('Click every buy button on every sales page — confirm each one loads a working checkout'),
      chk('Click the Calendly link in a test BNDL-01 email — confirm it opens and works'),
      chk('Click the mailing address form link — confirm it loads and submits'),
      chk('Open one email on your phone — confirm it reads well on mobile'),

      // ══════════ PHASE 6 ══════════
      ...phaseHeader(6, 'LAUNCH', 'IJ', '~1 hour'),
      note('You do not need everything to be perfect. You need the purchase flow to work, the onboarding emails to fire, and the FitMetrics app to be ready. Everything else can be polished in the first week.'),
      sp(),
      chk('Post a launch Reel on Instagram — hook: the problem nurses face, CTA: link in bio'),
      chk('Post a launch Story with a direct link to the $27 tripwire page'),
      chk('Send an email to your warm leads and waitlist announcing the launch'),
      chk('Post in any existing community or group'),
      chk('DM 3–5 people who have expressed interest — personal, direct, not a copy/paste'),

      // ══════════ OPEN ITEMS ══════════
      new Paragraph({
        pageBreakBefore: true,
        spacing:{ before:0, after:80 },
        children:[ b('OPEN ITEMS TRACKER', { size:32, color:COL.navy }) ]
      }),
      p([ t('These items do not block launch but need to be resolved. Review this list weekly until everything is checked off.') ]),
      sp(),
      openItemsTable(),
      sp(), sp(),
      p([ t('Document created by Claude Code for SmithFit. Last updated March 2026.', { size:18, italics:true, color:COL.lgray }) ]),

    ] // end children
  }]
});

Packer.toBuffer(doc)
  .then(buf => {
    fs.writeFileSync(OUTPUT, buf);
    console.log('Done:', OUTPUT);
  })
  .catch(err => { console.error(err); process.exit(1); });
