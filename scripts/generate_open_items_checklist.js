'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  Header
} = require('docx');
const fs   = require('fs');
const path = require('path');

const OUTPUT = path.resolve(
  __dirname,
  '../27 Course Funnel/Docs created Claude/SmithFit Open Items Checklist.docx'
);

// ── colours ──────────────────────────────────────────────────────────────────
const COL = {
  g1:    '1F4E79', // group 1 — decisions — dark blue
  g2:    '375623', // group 2 — links/forms — green
  g3:    '7030A0', // group 3 — content — purple
  navy:  '1F2D3D',
  gray:  '595959',
  lgray: 'AAAAAA',
  white: 'FFFFFF',
};
const groupCol = n => [COL.g1, COL.g2, COL.g3][n-1];

// ── borders ───────────────────────────────────────────────────────────────────
const bdr  = (color='CCCCCC', size=4) => ({ style:BorderStyle.SINGLE, size, color });
const cBdr = c => ({ top:bdr(c), bottom:bdr(c), left:bdr(c), right:bdr(c) });

// ── text helpers ──────────────────────────────────────────────────────────────
const t = (text, opts={}) => new TextRun({ text, font:'Arial', size:22, ...opts });
const b = (text, opts={}) => t(text, { bold:true, ...opts });

// ── paragraph helpers ─────────────────────────────────────────────────────────
function p(children, opts={}) {
  const arr = Array.isArray(children) ? children : [children];
  return new Paragraph({ children:arr, spacing:{ before:60, after:60 }, ...opts });
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
      t('Note: ', { bold:true, color:'7D4E00' }),
      t(text, { color:'7D4E00' })
    ]
  });
}
function claudeTip(text) {
  return new Paragraph({
    spacing:{ before:80, after:100 },
    shading:{ fill:'EEF4FF', type:ShadingType.CLEAR },
    indent:{ left:240, right:240 },
    children:[
      t('Claude tip: ', { bold:true, color:'2E4057' }),
      t(text, { color:'2E4057' })
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

// ── group heading banner ──────────────────────────────────────────────────────
function groupHeader(num, title, owner, time, pageBreak=true) {
  const c = groupCol(num);
  return [
    new Paragraph({
      pageBreakBefore: pageBreak && num > 1,
      spacing:{ before: num===1 ? 120 : 0, after:0 },
      shading:{ fill:c, type:ShadingType.CLEAR },
      children:[ t(`  GROUP ${num} — ${title}`, { bold:true, size:32, color:'FFFFFF' }) ]
    }),
    p([
      b('Owner: ', { color:c }),
      t(owner, { color:c }),
      t('     |     ', { color:COL.lgray }),
      b('Est. time: ', { color:COL.gray }),
      t(time, { color:COL.gray })
    ], { spacing:{ before:60, after:100 } })
  ];
}

// ── item heading ─────────────────────────────────────────────────────────────
function itemHead(num, text, color) {
  return new Paragraph({
    spacing:{ before:200, after:80 },
    children:[ t(`${num}.  ${text}`, { bold:true, size:24, color }) ]
  });
}

// ── summary table at top ──────────────────────────────────────────────────────
function summaryTable() {
  const bd = cBdr('CCCCCC');
  const cols = [4320, 2160, 2880]; // sum = 9360
  const rows = [
    ['Group 1 — Decisions', 'IJ', '~30 minutes total', COL.g1],
    ['Group 2 — Links & Forms to Create', 'IJ / VA', '~1–2 hours total', COL.g2],
    ['Group 3 — Content to Create (with Claude)', 'IJ / Claude', 'Ongoing', COL.g3],
  ];
  const cell = (text, w, isHdr=false, color='000000', fill='FFFFFF') =>
    new TableCell({
      borders:bd, width:{ size:w, type:WidthType.DXA },
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
        children:['Group','Owner','Est. Time'].map((h,i)=>cell(h,cols[i],true,'FFFFFF','1F2D3D'))
      }),
      ...rows.map((row,ri) => new TableRow({ children:[
        cell(row[0], cols[0], true, row[3], ri%2===0?'FFFFFF':'F9F9F9'),
        cell(row[1], cols[1], false, '000000', ri%2===0?'FFFFFF':'F9F9F9'),
        cell(row[2], cols[2], false, '000000', ri%2===0?'FFFFFF':'F9F9F9'),
      ]}))
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
          children:[ t('SmithFit Open Items Checklist', { size:18, color:COL.lgray }) ]
        })
      ]})
    },
    children:[

      // ─ TITLE ─
      p(b('SmithFit', { size:52, color:COL.g2 }), { spacing:{ before:200, after:40 } }),
      p(t('Open Items Checklist', { size:44, bold:true, color:COL.navy }), { spacing:{ before:0, after:60 } }),
      p(t('Everything that does not block launch — but needs to be done before the funnel is fully complete', { size:22, italics:true, color:COL.gray }), { spacing:{ before:0, after:240 } }),

      // ─ INTRO ─
      p([
        t('The launch checklist covers what you need to go live. This document covers everything that comes right after — the finishing touches, the content still to be created, and the decisions that need to be made before members start hitting milestones. Work through these in order. Most are quick. A few require Claude\'s help.'),
      ]),
      sp(),
      summaryTable(),
      sp(), sp(),

      // ══════════ GROUP 1: DECISIONS ══════════
      ...groupHeader(1, 'DECISIONS', 'IJ — make these calls first', '~30 minutes total', false),
      note('These are pure decisions — no external setup required. Make them first because other tasks depend on them (gift card amounts affect email copy, call schedule affects MEM-01, etc.).'),

      divider(),
      itemHead(1, 'Confirm Milestone Gift Card Amounts', COL.g1),
      p([ b('What it is: '), t('The Amazon gift card amounts sent automatically at Day 30, 60, 90, 180, 365, and 50 workouts.') ]),
      p([ b('Why it matters: '), t('The email templates reference specific dollar amounts. Once a member hits a milestone, you have to follow through. Confirm before anyone reaches Day 30.') ]),
      p([ b('Current amounts: ') ]),
      p([ t('Day 30: $5  |  Day 60: $10  |  Day 90: $15  |  Day 180: $25  |  Day 365: $75  |  50 workouts: $15') ],
        { spacing:{ before:20, after:20 }, indent:{ left:400 } }),
      chk('Review the current amounts above'),
      chk('Confirm you are comfortable committing to these — or adjust the numbers now'),
      chk('If you change any amounts: go to GHL → Email Marketing → Templates → update MILE-30, MILE-60, MILE-90, MILE-180, MILE-365, and MILE-50WO with the correct dollar figures → save each one'),

      divider(),
      itemHead(2, 'Decide the Day 90 Physical Gift Item', COL.g1),
      p([ b('What it is: '), t('A physical item mailed to every member who hits 90 days. The email says "something in the mail" — you need to decide what it is before anyone gets there.') ]),
      p([ b('Why it matters: '), t('90 days from launch is roughly 3 months out. That feels far, but it will arrive faster than expected. Decide now so the sourcing is in place.') ]),
      p([ b('Ideas ranked by on-brand fit:') ]),
      p([ t('1. Compression socks (SmithFit branded or nurse-specific) — most on-brand, nurses love them, affordable') ],
        { indent:{ left:400 }, spacing:{ before:20, after:10 } }),
      p([ t('2. Insulated tumbler with SmithFit logo — high perceived value, daily use, visible brand') ],
        { indent:{ left:400 }, spacing:{ before:10, after:10 } }),
      p([ t('3. Handwritten card from IJ + small gift ($10–$15 value) — personal, emotional, scalable to low volume') ],
        { indent:{ left:400 }, spacing:{ before:10, after:20 } }),
      chk('Decide on the physical gift item'),
      chk('Update the Day 90 email template (MILE-90) in GHL to name the specific item — replace the generic "something in the mail" with what it actually is'),
      chk('Set up a sourcing method: Amazon Wishlist for manual ordering, Printful for on-demand branded items, or batch-order 10–20 to start'),

      divider(),
      itemHead(3, 'Confirm Weekly Coaching Call Schedule', COL.g1),
      p([ b('What it is: '), t('The day and time of the weekly live group coaching call that the $67/mo membership promises. This needs to be in the onboarding emails before members start receiving them.') ]),
      p([ b('What to decide: '), t('One day per week, one time, that consistently works for you and your wife. Consider your shift schedule and your target audience (nurses on night/rotating shifts — evenings or weekends often work best).') ]),
      chk('Decide on the weekly call day and time (example: Wednesdays at 7 PM CT or Saturdays at 10 AM CT)'),
      chk('Go to GHL → Email Marketing → Templates → open MEM-01 → find the reference to the weekly coaching call → add the specific day and time → save'),
      chk('Do the same in MEM-02 and any other membership email that mentions the call'),
      warn('Until this is decided, do not activate Workflow 1 (Membership Onboarding) — the emails will reference a vague call time, which undermines trust.'),

      // ══════════ GROUP 2: LINKS & FORMS ══════════
      ...groupHeader(2, 'LINKS & FORMS TO CREATE', 'IJ — create once, plug into emails', '~1–2 hours total'),
      note('These are one-time setups. Each one takes 5–30 minutes to create, and then it lives in the email templates forever. Your VA can help with items 4 and 5.'),

      divider(),
      itemHead(4, 'Create Calendly Booking Link', COL.g2),
      p([ b('What it is: '), t('The link bundle clients use to book their 60-minute personal gameplan call with IJ. This goes into BNDL-01 and BNDL-02. Without it, bundle clients have no way to book their call.') ]),
      p([ b('Where to create it: '), t('calendly.com — free plan is fine for this.') ]),
      chk('Go to calendly.com and sign in (or create a free account)'),
      chk('Click + New Event Type → One-on-One'),
      chk('Name it: SmithFit Bundle Onboarding Call'),
      chk('Set duration to: 60 minutes'),
      chk('Set your availability (block off times that conflict with your shift schedule)'),
      chk('Add a description so clients know what to expect on the call'),
      chk('Save and copy your booking link'),
      chk('GHL → Email Marketing → Templates → open BNDL-01 → find [CALENDLY LINK] → replace with your real Calendly URL → save'),
      chk('Do the same in BNDL-02'),
      chk('Search all other templates for [CALENDLY LINK] and replace any remaining instances'),

      divider(),
      itemHead(5, 'Create Mailing Address Form (Day 90 Gift)', COL.g2),
      p([ b('What it is: '), t('A short form where members who hit Day 90 submit their mailing address so you can send them the physical gift. The MILE-90 email sends them to this form.') ]),
      p([ b('Where to create it: '), t('Google Forms is the fastest option and it is free. Takes about 5 minutes.') ]),
      chk('Go to forms.google.com → click + Blank form'),
      chk('Title it: SmithFit Day 90 Gift — Mailing Address'),
      chk('Add fields: Full Name (short answer), Street Address (short answer), City (short answer), State (short answer), ZIP Code (short answer), Email Address (short answer)'),
      chk('Add a short description at the top: "You hit 90 days — your gift is coming! Fill this out and we will get it in the mail within 10 days."'),
      chk('Click the eye icon to preview, then click Send → copy the link'),
      chk('GHL → Email Marketing → Templates → find the MILE-90 template (Day 90 milestone email) → replace [MAILING FORM LINK] with your form link → save'),
      warn('Set up a Google Sheets response tracker so you see submissions in one place. In Google Forms, go to Responses → click the Sheets icon to create a connected spreadsheet.'),

      divider(),
      itemHead(6, 'Create 1-on-1 Coaching Application', COL.g2),
      p([ b('What it is: '), t('A link to apply for high-ticket 1-on-1 coaching with IJ. This is a separate, higher-priced offer — not included in the $67/mo membership or bundles. Several emails include a soft mention with this link.') ]),
      p([ b('What the form should ask: '), t('Questions to qualify applicants — goals, timeline, schedule, why they want 1-on-1 support, and budget/investment range. Keep it short (5–7 questions max).') ]),
      chk('Create the application form — Google Form or Typeform works fine'),
      chk('Form fields to include: Name, Email, Current situation (paragraph), What is your main goal (paragraph), What has not worked before (paragraph), What is your schedule like (multiple choice), Investment range (multiple choice), Why 1-on-1 vs the membership (paragraph)'),
      chk('Copy your form link'),
      chk('GHL → Email Marketing → Templates → search for [1-ON-1 APPLICATION LINK] → replace in every template that contains it → save each one'),

      divider(),
      itemHead(7, 'Set Up GHL Referral Tracking Link', COL.g2),
      p([ b('What it is: '), t('A unique link each member uses to refer other nurses. When someone buys through a member\'s link and stays 30+ days, the referrer earns $10. The REF-01 email fires at Day 45 and includes this link.') ]),
      p([ b('Where to set it up: '), t('GoHighLevel has a built-in affiliate/referral system.') ]),
      chk('In GHL, go to Marketing → Affiliate Manager (look in the left sidebar or search "Affiliate")'),
      chk('Create a new affiliate campaign — name it SmithFit Referral Program'),
      chk('Set commission to: $10 per qualified referral (member stays 30+ days)'),
      chk('Set up the referral link format — GHL will generate a unique link per member'),
      chk('Copy the referral link template (the base URL members will use)'),
      chk('GHL → Email Marketing → Templates → open REF-01 → replace [REFERRAL LINK] with the real link → save'),
      warn('If GHL Affiliate Manager is not available on your plan, Tapfiliate and ReferralHero are affordable third-party alternatives that integrate with GHL via webhook.'),

      // ══════════ GROUP 3: CONTENT ══════════
      ...groupHeader(3, 'CONTENT TO CREATE (WITH CLAUDE)', 'IJ + Claude', 'Ongoing — do after launch'),
      note('These are bigger content pieces that require Claude\'s help to write. None of them block launch. Schedule time for each one after the funnel is live — ideally in the first 4–6 weeks.'),

      divider(),
      itemHead(8, 'Cancellation Salvage Email Sequence (3 emails)', COL.g3),
      p([ b('What it is: '), t('3 emails that fire automatically when a member cancels or expresses cancellation intent. Goal: change their mind or get feedback. These are separate from the FOMO sequences.') ]),
      p([ b('What the 3 emails should cover:') ]),
      p([ t('Email 1 (immediate): Acknowledge the cancellation, no guilt — ask one question: "What got in the way?"') ],
        { indent:{ left:400 }, spacing:{ before:20, after:10 } }),
      p([ t('Email 2 (Day 3): Address the most common objection based on their reply — or if no reply, use the "it stopped working" objection') ],
        { indent:{ left:400 }, spacing:{ before:10, after:10 } }),
      p([ t('Email 3 (Day 7): Final re-invite — softer price, open door, no pressure CTA') ],
        { indent:{ left:400 }, spacing:{ before:10, after:20 } }),
      claudeTip('To get Claude to write this sequence, say: "Write a 3-email cancellation salvage sequence for SmithFit. Email 1 fires when someone cancels. The tone is warm, not desperate. No guilt. One question. Then Email 2 and 3 follow the structure in my open items checklist."'),
      chk('Draft 3 cancellation emails with Claude'),
      chk('Review and approve the copy'),
      chk('Create 3 new email templates in GHL (name them CANC-01, CANC-02, CANC-03)'),
      chk('Build a new GHL workflow: trigger = tag cancellation-requested, send CANC-01 immediately, CANC-02 at Day 3, CANC-03 at Day 7'),
      chk('Toggle workflow to Published'),

      divider(),
      itemHead(9, 'Welcome Video Scripts (MEM-02 through MEM-05)', COL.g3),
      p([ b('What it is: '), t('Word-for-word scripts for the in-email or course welcome videos that go inside the membership onboarding emails. MEM-01 already has a welcome video — MEM-02 through MEM-05 need their own short video scripts.') ]),
      p([ b('What each video should do:') ]),
      p([ t('MEM-02 (Day 2): Quick cocktail check-in — did you try it? What happened? Normalize struggle.') ],
        { indent:{ left:400 }, spacing:{ before:20, after:10 } }),
      p([ t('MEM-03 (Day 7): One week celebration — honor the first week, preview what Week 2 unlocks.') ],
        { indent:{ left:400 }, spacing:{ before:10, after:10 } }),
      p([ t('MEM-04 (Day 14): Address the "it\'s not working" wall — explain the biology, keep them in.') ],
        { indent:{ left:400 }, spacing:{ before:10, after:10 } }),
      p([ t('MEM-05 (Day 30): One month celebration — reinforce identity shift, seed the bundle upgrade naturally.') ],
        { indent:{ left:400 }, spacing:{ before:10, after:20 } }),
      claudeTip('To get Claude to write these, say: "Write a 90-second word-for-word video script for IJ to record for MEM-03, the Day 7 onboarding email. IJ is a nurse speaking to other nurses. Tone: warm, direct, like a colleague. Use the SmithFit brand voice from CLAUDE.md."'),
      chk('Ask Claude to write each script one at a time (use the tip above for each one)'),
      chk('Record each video — 60 to 90 seconds each, phone camera is fine'),
      chk('Upload videos to GHL or a hosting platform (Vimeo recommended for email embedding)'),
      chk('Add the video link or embed code to each corresponding email template in GHL'),

      divider(),
      itemHead(10, 'Truemed / HSA Financing Marketing Angle', COL.g3),
      p([ b('What it is: '), t('A marketing angle for ads, the sales page, and email copy that highlights the fact that nurses may be able to use their FSA or HSA funds to pay for SmithFit. This is a powerful objection-crusher — it removes the "I can\'t afford it" barrier.') ]),
      p([ b('Why it matters: '), t('Nurses often have FSA/HSA accounts through their hospital employer. If SmithFit qualifies (health coaching, nutrition — likely yes via Truemed), this could significantly increase conversions. The $27 course becomes essentially free to a nurse with HSA funds.') ]),
      p([ b('What needs to happen:') ]),
      p([ t('Step 1: Verify eligibility — contact Truemed (truemed.com) to confirm SmithFit qualifies') ],
        { indent:{ left:400 }, spacing:{ before:20, after:10 } }),
      p([ t('Step 2: Set up Truemed integration — they handle the payment processing for FSA/HSA') ],
        { indent:{ left:400 }, spacing:{ before:10, after:10 } }),
      p([ t('Step 3: Create marketing content — ads, a sales page section, and an email that explains the FSA/HSA angle') ],
        { indent:{ left:400 }, spacing:{ before:10, after:20 } }),
      claudeTip('Once you are set up with Truemed, say: "Write a short section (3–4 sentences) for the SmithFit sales page that explains nurses can use their FSA/HSA funds to pay for SmithFit through Truemed. Make it feel like a bonus discovery, not a finance pitch."'),
      chk('Go to truemed.com and submit an application for SmithFit'),
      chk('Confirm eligibility and complete setup with Truemed'),
      chk('Ask Claude to write the HSA/FSA section for the $27 sales page'),
      chk('Ask Claude to write a short Instagram Reel hook around the FSA/HSA angle ("Did you know your HSA pays for this?")'),
      chk('Add the Truemed payment option to the $27 checkout page'),
      chk('Update the sales page with the FSA/HSA section'),

      // ─ FOOTER ─
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
