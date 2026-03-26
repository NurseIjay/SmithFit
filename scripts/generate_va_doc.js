const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber
} = require('docx');
const fs = require('fs');

const BLUE = "1F4E79";
const LIGHT_BLUE = "D6E4F0";
const TEAL = "2E75B6";
const GRAY = "F5F5F5";
const BORDER_GRAY = "CCCCCC";

const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true, size: 32, color: BLUE, font: "Arial" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, color: TEAL, font: "Arial" })]
  });
}

function heading3(text) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22, color: "333333", font: "Arial" })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}

function boldBody(label, rest = "") {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, font: "Arial" }),
      new TextRun({ text: rest, size: 22, font: "Arial" })
    ]
  });
}

function spacer(before = 120) {
  return new Paragraph({ spacing: { before, after: 0 }, children: [new TextRun("")] });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "steps", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function checkbox(text) {
  return new Paragraph({
    numbering: { reference: "checks", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function quoteBlock(lines) {
  const children = [];
  lines.forEach((line, i) => {
    children.push(
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 200, type: WidthType.DXA },
            shading: { fill: TEAL, type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun("")] })]
          }),
          new TableCell({
            borders: noBorders,
            width: { size: 8960, type: WidthType.DXA },
            shading: { fill: "EBF3FB", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({
              spacing: { before: i === 0 ? 60 : 20, after: i === lines.length - 1 ? 60 : 20 },
              children: [new TextRun({ text: line, size: 22, font: "Arial", italics: true, color: "1A1A1A" })]
            })]
          })
        ]
      })
    );
  });
  return new Table({
    width: { size: 9160, type: WidthType.DXA },
    columnWidths: [200, 8960],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: children
  });
}

function navBox(text) {
  return new Table({
    width: { size: 9160, type: WidthType.DXA },
    columnWidths: [9160],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [new Paragraph({
          children: [
            new TextRun({ text: "Where to go in FitMetrics: ", bold: true, size: 22, font: "Arial", color: BLUE }),
            new TextRun({ text, size: 22, font: "Arial", color: "1A1A1A" })
          ]
        })]
      })]
    })]
  });
}

function warningBox(text) {
  return new Table({
    width: { size: 9160, type: WidthType.DXA },
    columnWidths: [9160],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 12, color: "E67E22" }, right: border },
        shading: { fill: "FEF9E7", type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        children: [new Paragraph({
          children: [
            new TextRun({ text: "⚠️  Note for VA: ", bold: true, size: 22, font: "Arial", color: "C0392B" }),
            new TextRun({ text, size: 22, font: "Arial" })
          ]
        })]
      })]
    })]
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER_GRAY, space: 1 } },
    spacing: { before: 160, after: 160 },
    children: [new TextRun("")]
  });
}

function sectionTag(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: `  ${text}  `, bold: true, size: 20, font: "Arial", color: "FFFFFF",
      shading: { type: ShadingType.CLEAR, fill: TEAL } })]
  });
}

// ── Document build ────────────────────────────────────────────────────────────

const children = [

  // Cover-style header
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: "SmithFit", bold: true, size: 52, font: "Arial", color: BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: "VA Setup Instructions: FitMetrics Automations", size: 30, font: "Arial", color: "555555" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: "Weekly Broadcasts + Milestone Messages + Habit Streaks", size: 24, font: "Arial", italics: true, color: "888888" })]
  }),
  divider(),

  // Intro table
  new Table({
    width: { size: 9160, type: WidthType.DXA },
    columnWidths: [2200, 6960],
    rows: [
      new TableRow({ children: [
        new TableCell({ borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "Who this is for", bold: true, size: 22, font: "Arial", color: BLUE })] })] }),
        new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "VA setting up automated messages in FitMetrics", size: 22, font: "Arial" })] })] })
      ]}),
      new TableRow({ children: [
        new TableCell({ borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "Time to complete", bold: true, size: 22, font: "Arial", color: BLUE })] })] }),
        new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "60\u201390 minutes", size: 22, font: "Arial" })] })] })
      ]}),
      new TableRow({ children: [
        new TableCell({ borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "Before you start", bold: true, size: 22, font: "Arial", color: BLUE })] })] }),
        new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "Log into FitMetrics and confirm you have admin access.", size: 22, font: "Arial" })] })] })
      ]}),
      new TableRow({ children: [
        new TableCell({ borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "What you\u2019ll set up", bold: true, size: 22, font: "Arial", color: BLUE })] })] }),
        new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [
            new Paragraph({ spacing: { before: 40, after: 20 }, children: [new TextRun({ text: "4 weekly recurring broadcasts (fire every week to all members, forever)", size: 22, font: "Arial" })] }),
            new Paragraph({ spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "8 milestone DMs (fire automatically on specific days per member)", size: 22, font: "Arial" })] }),
            new Paragraph({ spacing: { before: 20, after: 40 }, children: [new TextRun({ text: "5 habit streak messages (fire based on workout/habit milestones)", size: 22, font: "Arial" })] }),
          ]
        })
      ]}),
    ]
  }),
  spacer(240),

  // ── PART 1 ──
  heading1("PART 1 \u2014 WEEKLY RECURRING BROADCASTS"),
  body("These 4 messages send automatically every week to all active members. Set them up once and they run forever.", { bold: true }),
  spacer(80),
  navBox("Broadcasts \u2192 Scheduled \u2192 Recurring \u2192 + New Broadcast"),
  spacer(120),

  // Broadcast 1
  heading2("BROADCAST 1 OF 4 \u2014 MONDAY"),
  numbered("Click + New Broadcast (or equivalent \u201Ccreate\u201D button)"),
  numbered('Set the title/name to: Monday \u2014 New Week Activation'),
  numbered("Set the send day to: Monday"),
  numbered("Set the send time to: 8:00 AM"),
  numbered("Set the audience to: All active members (or whatever tag means active membership)"),
  numbered("Set repeat to: Every week / Recurring"),
  numbered("Copy and paste the message below exactly as written:"),
  spacer(80),
  quoteBlock(["Good morning, SmithFit FAM! New week. Your updated meal plan is live in the Nutrition tab \u2014 check it today. Your workouts have progressed in the Workouts tab. This week\u2019s live coaching call is pinned in the community group \u2014 link is there waiting for you. Let\u2019s make this week count. You\u2019ve got everything you need."]),
  spacer(80),
  numbered("Save and activate."),
  divider(),

  // Broadcast 2
  heading2("BROADCAST 2 OF 4 \u2014 WEDNESDAY"),
  numbered("Click + New Broadcast"),
  numbered("Name: Wednesday \u2014 Win Wednesday"),
  numbered("Send day: Wednesday"),
  numbered("Send time: 9:00 AM"),
  numbered("Audience: All active members"),
  numbered("Repeat: Every week"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["It\u2019s Win Wednesday inside the SmithFit FAM! This is your reminder that your wins count \u2014 ALL of them. Scale wins, non-scale wins, shift survival wins, habit streak wins. Drop yours in the community group right now. Tag a sister who you saw crushing it this week. We\u2019re celebrating EVERYONE today. No win is too small. Go."]),
  spacer(80),
  numbered("Save and activate."),
  divider(),

  // Broadcast 3
  heading2("BROADCAST 3 OF 4 \u2014 SATURDAY"),
  numbered("Click + New Broadcast"),
  numbered("Name: Saturday \u2014 Rest + Reflect"),
  numbered("Send day: Saturday"),
  numbered("Send time: 9:00 AM"),
  numbered("Audience: All active members"),
  numbered("Repeat: Every week"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["Weekend check-in. Open your app and look at your habit streaks from this week. How many days did you hit the cocktail? The steps? The breathing? Sleep log? Whatever number you see \u2014 that\u2019s your data, not your grade. No judgment. Next week we build on it. If you missed logging something this week, you can go back in the calendar and check off habits from previous days. Don\u2019t lose your streak over a missed log."]),
  spacer(80),
  numbered("Save and activate."),
  divider(),

  // Broadcast 4
  heading2("BROADCAST 4 OF 4 \u2014 SUNDAY"),
  numbered("Click + New Broadcast"),
  numbered("Name: Sunday \u2014 Prep + Preview"),
  numbered("Send day: Sunday"),
  numbered("Send time: 7:00 PM"),
  numbered("Audience: All active members"),
  numbered("Repeat: Every week"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["Sunday is SmithFit Prep Day. 20 minutes today will save you from 5 bad decisions this week. Quick checklist: Check your new meal plan in the app. Pick 2\u20133 recipes to prep. Make sure your cocktail ingredients are accessible. Look at your schedule and pick your 3 workout days. That\u2019s it. 20 minutes. The nurses who prep on Sundays hit their goals twice as fast. See you Monday."]),
  spacer(80),
  numbered("Save and activate."),
  spacer(80),
  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "\u2705  Part 1 complete. You should now have 4 active recurring broadcasts. Confirm all 4 show as \u201CActive\u201D or \u201CScheduled.\u201D", bold: true, size: 22, font: "Arial", color: "1A7A1A" })]
  }),

  spacer(200),

  // ── PART 2 ──
  heading1("PART 2 \u2014 MILESTONE DMs"),
  body("These messages fire automatically per member based on how many days they\u2019ve been in the program. Each fires once per member and never repeats.", { bold: true }),
  spacer(80),
  navBox("Automations \u2192 Milestone Rules \u2192 + New Rule"),
  spacer(80),
  boldBody("Important settings for every rule:"),
  body("\u2022  Trigger type: Days since membership start"),
  body("\u2022  Fire: Once per client (NOT repeating)"),
  body("\u2022  Add a tag after firing so it never repeats (see each rule below)"),
  spacer(120),

  // Helper function to build a milestone block
  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) {
      items.push(spacer(60));
      items.push(warningBox(warning));
    }
    if (communityAction) {
      items.push(spacer(60));
      items.push(boldBody("Community action: ", communityAction));
    }
    items.push(divider());
    return items;
  })(
    1, "First Week Done", 7, "MILESTONE-DAY-7",
    "You made it through your first week. That\u2019s not nothing \u2014 most people don\u2019t make it past Day 3. Your SmithFit First Week badge just dropped into your achievements tab. Go check it. And then go post in the community \u2014 you earned a shoutout.",
    null,
    "\u201C[NAME] just hit Day 7! First full week in the SmithFit FAM. Drop some love below! \uD83C\uDF89\u201D (IJ\u2019s wife posts in community group)"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    2, "Two-Week Warrior", 14, "MILESTONE-DAY-14",
    "Two weeks. The research on habit formation says that two weeks of consistent repetition starts rewiring the neural pathway. You\u2019re not just doing habits anymore. You\u2019re becoming someone who does habits. That\u2019s different. That matters. Go pull up your Day 1 progress photo and take a new one today. Side by side. The photos don\u2019t lie.",
    null,
    "\u201CTwo-Week Warrior alert \u2014 [NAME] is 14 days in and showing UP. Look how far she\u2019s come! \uD83D\uDCAA\u201D (wife posts)"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    3, "One Month Strong", 30, "MILESTONE-DAY-30",
    "ONE MONTH. You just crossed the line that separates the women who change from the women who almost changed. I\u2019m sending you a $5 Amazon gift card right now as a thank you for showing up. Your code is coming via email in the next few minutes. Go spend it on something that makes you feel good \u2014 you earned it.",
    "This milestone also triggers a GHL email with the $5 gift card code. Make sure IJ or whoever manages GHL knows this milestone is live so the workflow is connected.",
    "\u201C[NAME] just hit ONE MONTH in SmithFit! This is HUGE. [NAME], what is the biggest change you\u2019ve noticed so far? Drop it below. We want to celebrate YOU today. \uD83C\uDF8A\u201D (wife pins post for 24 hours)"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    4, "45-Day Milestone", 45, "MILESTONE-DAY-45",
    "45 days in. You\u2019re past the honeymoon phase and still showing up \u2014 that means this is becoming who you are, not what you\u2019re trying to do. Your FitMetrics data at 45 days is telling a real story. Check your AI check-in summary this week and see what your patterns look like. You\u2019ve built more than you realize.",
    null,
    "\u201C45 days strong \u2014 [NAME] is officially in the zone where results get undeniable. Keep going! \uD83D\uDD25\u201D (VA posts)"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    5, "60-Day Shifter", 60, "MILESTONE-DAY-60",
    "Sixty days. Two months of showing up for yourself. Do you know how rare that is? Most programs lose 60% of their members by now. You are still here. I\u2019m sending you a $10 Amazon gift card \u2014 code is in your email. I also want to ask: can we share your story? Reply to the email or drop a message in the community. Your transformation is going to help the next nurse who almost doesn\u2019t join.",
    "Also triggers a GHL email with the $10 gift card code.",
    "\u201C60-DAY SHIFTER \u2014 [NAME] has been here for 2 full months! Drop your most noticeable change in the comments, [NAME] \u2014 we want to hear everything. \uD83D\uDE4C\u201D"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    6, "90-Day Identity Shift", 90, "MILESTONE-DAY-90",
    "Ninety days. This is the milestone that almost nobody reaches \u2014 and the one where everything changes. You are not the same person who joined this community 90 days ago. Your body isn\u2019t in survival mode anymore. Your habits are becoming automatic. I\u2019m sending you $15 to your email AND something in the mail \u2014 keep an eye on your mailbox in the next 10 days. And I\u2019m going to ask you for one thing: a 30-second video of you telling someone watching right now why they should join SmithFit. Your story is going to change someone\u2019s life.",
    "Also triggers a GHL email with the $15 gift card + mailing address form for physical gift.",
    "\u201CTHREE MONTHS. [NAME] just hit the 90-Day Identity Shift milestone. This is exactly why we built SmithFit. [NAME] \u2014 we see you and we are SO proud of you. \uD83C\uDF1F\u201D (IJ or wife posts personally)"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    7, "Six-Month Transformation", 180, "MILESTONE-DAY-180",
    "Six months. Half a year. You walked in here as someone who was exhausted, stuck, and honestly \u2014 not sure if anything would ever work. And look at where you are now. I wrote you a personal letter. It\u2019s in your email. Read it when you have a quiet moment. And then call your mom, your best friend, whoever \u2014 and tell them what you just did. $25 gift card is coming too. You earned every dollar of it.",
    "Also triggers a GHL email with $25 gift card + personalized letter from IJ.",
    "\u201CI don\u2019t post these often enough \u2014 but [NAME] just hit SIX MONTHS in SmithFit. [NAME], you have become exactly who you said you wanted to be. We love you. \u2764\uFE0F\u201D (IJ posts personally \u2014 stays pinned for the week)"
  ),

  ...(function milestoneBlock(num, title, day, tag, message, warning, communityAction) {
    const items = [
      heading2(`MILESTONE ${num} \u2014 DAY ${day}`),
      numbered("Click + New Rule"),
      numbered(`Name: Day ${day} \u2014 ${title}`),
      numbered(`Trigger: Days since membership start = ${day}`),
      numbered("Fire once per client: YES"),
      numbered(`Add tag on fire: ${tag}`),
      numbered("Paste this message:"),
      spacer(80),
      quoteBlock([message]),
      spacer(80),
      numbered("Save and activate."),
    ];
    if (warning) { items.push(spacer(60)); items.push(warningBox(warning)); }
    if (communityAction) { items.push(spacer(60)); items.push(boldBody("Community action: ", communityAction)); }
    items.push(divider());
    return items;
  })(
    8, "One Full Year", 365, "MILESTONE-DAY-365",
    "One year. I don\u2019t have words for this that do it justice, so I\u2019ll just say: you did it. A full year of showing up for yourself. I\u2019m sending you $75 \u2014 it\u2019s in your email. Because you didn\u2019t just complete a program. You became a different person. And I need you to know that I am genuinely proud of you. There\u2019s an offer in your email \u2014 a way to stay in this community at a rate that reflects how much you mean to it. I hope you take it.",
    "Also triggers a GHL email with $75 gift card + alumni rate offer. IJ also posts personally on Instagram Stories.",
    "Full celebration post \u2014 before/after if client consents, the $75 reveal, and the alumni offer announcement. Tag the client. Make it a moment. (IJ posts personally + Instagram Stories)"
  ),

  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "\u2705  Part 2 complete. You should have 8 milestone rules set up. Confirm each one says \u201CActive\u201D and is set to fire once per client.", bold: true, size: 22, font: "Arial", color: "1A7A1A" })]
  }),

  spacer(200),

  // ── PART 3 ──
  heading1("PART 3 \u2014 HABIT STREAK AUTOMATIONS"),
  body("These fire based on workout count or habit streaks \u2014 independent of how many days someone has been a member.", { bold: true }),
  spacer(80),
  navBox("Automations \u2192 Habit Streak Rules (or Workout Rules)"),
  spacer(120),

  heading2("STREAK 1 \u2014 7-Day Habit Streak"),
  numbered("Click + New Rule"),
  numbered("Name: 7-Day Habit Streak"),
  numbered("Trigger: 7 consecutive days of any habit checked off"),
  numbered("Fire once per client: YES (or allow repeat \u2014 check with IJ)"),
  numbered("Add tag on fire: STREAK-7-DAY"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["SEVEN DAYS STRAIGHT. That habit is becoming part of who you are. Drop a fire emoji in the community \u2014 we want to celebrate this. \uD83D\uDD25"]),
  spacer(80),
  numbered("Save and activate."),
  divider(),

  heading2("STREAK 2 \u2014 21-Day Habit Streak"),
  numbered("Click + New Rule"),
  numbered("Name: 21-Day Habit Streak"),
  numbered("Trigger: 21 consecutive days of any habit checked off"),
  numbered("Fire once per client: YES"),
  numbered("Add tag on fire: STREAK-21-DAY"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["21 days. Science says a habit takes about 21 days to form a neural pathway. You just wired this in. This isn\u2019t effort anymore \u2014 it\u2019s you."]),
  spacer(80),
  numbered("Save and activate."),
  divider(),

  heading2("STREAK 3 \u2014 30-Day FULL RESET (All 4 Habits)"),
  numbered("Click + New Rule"),
  numbered("Name: 30-Day Full Reset \u2014 All 4 Habits"),
  numbered("Trigger: All 4 habits checked off for 30 consecutive days"),
  numbered("Fire once per client: YES"),
  numbered("Add tag on fire: STREAK-FULL-RESET-30"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["30 DAYS of all four habits. You hit the cocktail, the steps, the breathing, AND the sleep log for 30 straight days. That is elite-level consistency. IJ is being notified right now \u2014 she\u2019s going to post about this."]),
  spacer(80),
  numbered("Save and activate."),
  spacer(60),
  warningBox("When this fires, notify IJ immediately so she can post a community shoutout within 24 hours."),
  divider(),

  heading2("STREAK 4 \u2014 10 Workouts Completed"),
  numbered("Click + New Rule"),
  numbered("Name: 10 Workouts Completed"),
  numbered("Trigger: Workout completion count = 10"),
  numbered("Fire once per client: YES"),
  numbered("Add tag on fire: WORKOUT-10"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["Ten workouts logged. Ten times you chose to show up for your body instead of the couch after a shift. Your workout history is in the app \u2014 go look at it and let it sink in."]),
  spacer(80),
  numbered("Save and activate."),
  divider(),

  heading2("STREAK 5 \u2014 50 Workouts Completed"),
  numbered("Click + New Rule"),
  numbered("Name: 50 Workouts Completed"),
  numbered("Trigger: Workout completion count = 50"),
  numbered("Fire once per client: YES"),
  numbered("Add tag on fire: WORKOUT-50"),
  numbered("Paste this message:"),
  spacer(80),
  quoteBlock(["50 WORKOUTS. That number represents 50 decisions. Screenshot your workout count and post it in the community. We want to see it."]),
  spacer(80),
  numbered("Save and activate."),
  spacer(60),
  warningBox("This also triggers a GHL email with a $15 Amazon gift card. Make sure IJ knows this is live so the GHL workflow is connected."),
  spacer(80),
  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "\u2705  Part 3 complete. You should have 5 streak/workout rules set up.", bold: true, size: 22, font: "Arial", color: "1A7A1A" })]
  }),

  spacer(200),

  // ── FINAL CHECKLIST ──
  heading1("FINAL CHECKLIST \u2014 Confirm Before You\u2019re Done"),
  body("Go through every item below and confirm it\u2019s done before closing FitMetrics."),
  spacer(80),

  heading2("Weekly Broadcasts (4 total)"),
  checkbox("Monday 8:00 AM \u2014 New Week Activation \u2014 Active"),
  checkbox("Wednesday 9:00 AM \u2014 Win Wednesday \u2014 Active"),
  checkbox("Saturday 9:00 AM \u2014 Rest + Reflect \u2014 Active"),
  checkbox("Sunday 7:00 PM \u2014 Prep + Preview \u2014 Active"),
  spacer(80),

  heading2("Milestone DMs (8 total)"),
  checkbox("Day 7 \u2014 First Week Done \u2014 fires once per client"),
  checkbox("Day 14 \u2014 Two-Week Warrior \u2014 fires once per client"),
  checkbox("Day 30 \u2014 One Month Strong \u2014 fires once per client"),
  checkbox("Day 45 \u2014 Milestone \u2014 fires once per client"),
  checkbox("Day 60 \u2014 60-Day Shifter \u2014 fires once per client"),
  checkbox("Day 90 \u2014 90-Day Identity Shift \u2014 fires once per client"),
  checkbox("Day 180 \u2014 Six-Month Transformation \u2014 fires once per client"),
  checkbox("Day 365 \u2014 One Full Year \u2014 fires once per client"),
  spacer(80),

  heading2("Streak / Workout Automations (5 total)"),
  checkbox("7-day habit streak \u2014 Active"),
  checkbox("21-day habit streak \u2014 Active"),
  checkbox("30-day full reset (all 4 habits) \u2014 Active"),
  checkbox("10 workouts completed \u2014 Active"),
  checkbox("50 workouts completed \u2014 Active"),
  spacer(120),

  // Notes box
  new Table({
    width: { size: 9160, type: WidthType.DXA },
    columnWidths: [9160],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 12, color: BLUE }, right: border },
        shading: { fill: "EEF4FB", type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { before: 0, after: 100 }, children: [new TextRun({ text: "Notes for VA", bold: true, size: 24, font: "Arial", color: BLUE })] }),
          new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "Do not change the message copy. The wording has been specifically written for the SmithFit audience. If something looks off, flag it to IJ rather than editing it yourself.", size: 22, font: "Arial" })] }),
          new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "Gift card emails (Day 30, 60, 90, 180, 365, 50 workouts) are sent through GHL separately \u2014 FitMetrics just sends the DM notification. Let IJ know when each one is set up so the GHL side can be coordinated.", size: 22, font: "Arial" })] }),
          new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "Community posts labeled \u201Ccommunity action\u201D are NOT automated. They need to be done manually by IJ, her wife, or you when the milestone fires.", size: 22, font: "Arial" })] }),
          new Paragraph({ spacing: { before: 40, after: 0 }, children: [new TextRun({ text: "If you can\u2019t find a setting listed in these instructions, look for the closest match or flag it to IJ. Do not guess.", size: 22, font: "Arial" })] }),
        ]
      })]
    })]
  }),
];

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "steps",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "checks",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2610",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 280, after: 100 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children
  }]
});

const outPath = "/Users/ijsmith/SmithFit/27 Course Funnel/Docs created Claude/SmithFit Automation/VA_FitMetrics_Setup_Instructions.docx";

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("✅ Saved: " + outPath);
}).catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
