# SmithFit Launch Checklist

You're closer than it feels. The hard creative work is done — the course is recorded, the emails are written, the pages are built. What's left is mostly connection work: hooking up the pieces so the machine can actually run. This document breaks the remaining tasks into phases so you know exactly what to do next, in the right order, without having to hold the whole picture in your head at once.

**How to use this doc:** Work through the phases in order. Phase 1 must be done before anything else matters — without it, no one can buy. IJ handles Phases 1, 2, 4, and 5. The VA handles Phase 3. Phase 3 can run at the same time as Phase 2 — hand it off the moment you start Phase 2. Check off each item as you complete it.

**Estimated time per phase:**
- Phase 1 — Connect the Products: 1–2 hours
- Phase 2 — Build the 5 Workflows: 2–3 hours
- Phase 3 — VA Tasks (runs in parallel): 60–90 minutes for VA
- Phase 4 — Fill in the Blanks: 30–60 minutes
- Phase 5 — Test Before Launch: 30–45 minutes
- Phase 6 — Launch: 1 hour

---

## PHASE 1 — CONNECT THE PRODUCTS
**Owner: IJ | Do this first**
*Nothing else matters until people can actually buy. Right now the pages exist but aren't connected to real products — no one can check out. This phase fixes that.*

Log in to GHL at hub.courseiq.app. All product setup happens under **Payments → Products** in the left sidebar.

---

### Step 1 — Create the $27 Product
- [ ] Go to **Payments → Products → + New Product**
- [ ] Name it: `7-Day Shift-Proof Metabolism Reset`
- [ ] Set price to: `$27.00`
- [ ] Set type to: **One-time payment**
- [ ] Add a description (optional but helpful): "7-Day Shift-Proof Metabolism Reset — full course access"
- [ ] Save the product

---

### Step 2 — Create the $67/Month Membership Product
- [ ] Go to **Payments → Products → + New Product**
- [ ] Name it: `Metabolic Breakthrough Membership`
- [ ] Set price to: `$67.00`
- [ ] Set type to: **Recurring subscription**
- [ ] Set billing interval to: **Monthly**
- [ ] Save the product

---

### Step 3 — Create the 14-Day Free Trial Product
- [ ] Go to **Payments → Products → + New Product**
- [ ] Name it: `Metabolic Breakthrough Membership — Free Trial`
- [ ] Set price to: `$0.00` for the trial period, then `$67.00/month` after
- [ ] Set trial period to: **14 days**
- [ ] Set to **Require card at signup** (the card is charged automatically on Day 15 if not cancelled)
- [ ] Save the product
- [ ] Note: If GHL does not support a $0 trial natively on a subscription, create a coupon code for 100% off the first 14 days — ask your GHL support chat if you're unsure

---

### Step 4 — Create the 6-Month Bundle Product
- [ ] Go to **Payments → Products → + New Product**
- [ ] Name it: `SmithFit 6-Month Bundle`
- [ ] Set price to: `$335.00`
- [ ] Set type to: **One-time payment** (this covers 6 months of membership access)
- [ ] Save the product

---

### Step 5 — Create the 12-Month Bundle Product
- [ ] Go to **Payments → Products → + New Product**
- [ ] Name it: `SmithFit 12-Month Bundle`
- [ ] Set price to: `$588.00`
- [ ] Set type to: **One-time payment**
- [ ] Save the product

---

### Step 6 — Connect Buy Buttons on Each Sales Page
For each page, you'll go to the page editor, click on the buy button or order form, and link it to the product you just created.

- [ ] **$27 tripwire page** → connect order form to `7-Day Shift-Proof Metabolism Reset ($27)`
- [ ] **$67/mo upsell page** → connect order form to `Metabolic Breakthrough Membership ($67/mo)`
- [ ] **14-day free trial downsell page** → connect order form to `Metabolic Breakthrough Membership — Free Trial`
- [ ] **6-month bundle page** → connect order form to `SmithFit 6-Month Bundle ($335)`
- [ ] **12-month bundle page** → connect order form to `SmithFit 12-Month Bundle ($588)`

For each page: go to **Sites → Funnels → [your funnel name]** → click the step → edit the page → click the order form element → select the product from the dropdown → save.

---

### Step 7 — Run a Test Purchase
- [ ] Use GHL's test card (4242 4242 4242 4242, any future expiry, any CVC) to purchase the $27 course as yourself
- [ ] Confirm you land on the order confirmation page
- [ ] Confirm you receive a purchase confirmation email
- [ ] Confirm the correct tag is applied to your test contact in GHL

---

## PHASE 2 — BUILD THE 5 EMAIL WORKFLOWS
**Owner: IJ | Do after Phase 1**
*The 32 email templates are already written and sitting in GHL. This phase connects them into automated sequences that fire at the right time for each customer. You are not writing anything — just clicking, selecting, and saving.*

**Before you start:** Log in to hub.courseiq.app → go to **Automation** in the left sidebar → click **Workflows** → create a folder called `SmithFit Automations` to keep things tidy.

> **Email templates status:** 35 templates are written and ready in `scripts/ghl/create_templates_v2.py`. To push them: delete the 32 old templates in GHL (Email Marketing → Templates → select all → delete), then run `python3 scripts/ghl/create_templates_v2.py` from your terminal. Templates include all 32 originals (rewritten + bug-fixed) plus 3 new CANC cancellation salvage emails.

---

### WORKFLOW 1 — Membership Day 1 Onboarding
**Trigger:** Someone buys the $67/month membership
**What it does:** Sends 6 emails over 45 days, then automatically starts the bundle upgrade sequence

- [ ] Click **+ New Workflow** → Start from scratch → Name it: `SmithFit — Membership Onboarding`
- [ ] Set trigger: **Contact Tag** → Tag added → `membership-active`
- [ ] Add action: **Send Email** → select template `MEM-01: Welcome to SmithFit`
- [ ] Add action: **Wait** → `2 days`
- [ ] Add action: **Send Email** → `MEM-02: Did You Do the Cocktail`
- [ ] Add action: **Wait** → `5 days`
- [ ] Add action: **Send Email** → `MEM-03: One Week In`
- [ ] Add action: **Wait** → `7 days`
- [ ] Add action: **Send Email** → `MEM-04: Two Weeks`
- [ ] Add action: **Wait** → `16 days`
- [ ] Add action: **Send Email** → `MEM-05: One Month In`
- [ ] Add action: **Wait** → `15 days`
- [ ] Add action: **Send Email** → `MEM-06: Day 45 — The Upgrade Email`
- [ ] Add action: **Add Tag** → `fomo-track-a-active`
- [ ] Click **Save** → toggle to **Published**

---

### WORKFLOW 2 — Bundle Onboarding
**Trigger:** Someone buys the 6-month or 12-month bundle
**What it does:** Sends 4 emails over 28 days and flags you (IJ) to do a personal check-in at Day 28

- [ ] Click **+ New Workflow** → Name it: `SmithFit — Bundle Onboarding`
- [ ] Set trigger: **Contact Tag** → Tag added → `bundle-active`
- [ ] Add action: **Send Email** → `BNDL-01: Welcome Bundle`
- [ ] Add action: **Add Tag** → `new-bundle`
- [ ] Add action: **Wait** → `1 day`
- [ ] Add action: **Send Email** → `BNDL-02: Your Gameplan`
- [ ] Add action: **Wait** → `6 days`
- [ ] Add action: **Send Email** → `BNDL-03: One Week In`
- [ ] Add action: **Wait** → `21 days`
- [ ] Add action: **Send Email** → `BNDL-04: VIP Month Ending`
- [ ] Add action: **Add Tag** → `coach-review`
- [ ] Click **Save** → toggle to **Published**

**Important:** The `coach-review` tag is your personal signal to check in with this client. Go to **Settings → Notifications** in GHL and set up an alert so you get notified any time that tag is applied.

---

### WORKFLOW 3 — FOMO Track A: Monthly Member to Bundle Upgrade
**Trigger:** Monthly member hits Day 45 (tag `fomo-track-a-active` is added automatically at the end of Workflow 1)
**What it does:** Runs a 75-day upgrade campaign with 4 emails encouraging the member to upgrade to a bundle. Stops automatically if they upgrade.

- [ ] Click **+ New Workflow** → Name it: `SmithFit — FOMO Track A (Monthly → Bundle)`
- [ ] Set trigger: **Contact Tag** → Tag added → `fomo-track-a-active`
- [ ] Add a **Filter/Condition** at the top of the workflow: Contact does NOT have tag `bundle-active` (this stops the sequence if they already bought a bundle)
- [ ] Add action: **Send Email** → `FOMO-A1: One Month In`
- [ ] Add action: **Wait** → `15 days`
- [ ] Add action: **Send Email** → `FOMO-A2: She Lost 31 lbs`
- [ ] Add action: **Wait** → `15 days`
- [ ] Add action: **Send Email** → `FOMO-A3: The Math on Month-to-Month`
- [ ] Add action: **Wait** → `15 days`
- [ ] Add action: **Send Email** → `FOMO-A4: Last Call`
- [ ] Add action: **Remove Tag** → `fomo-track-a-active`
- [ ] Add action: **Add Tag** → `fomo-track-a-complete`
- [ ] Click **Save** → toggle to **Published**

---

### WORKFLOW 4 — FOMO Track B: 6-Month to 12-Month Upgrade
**Trigger:** Someone purchases the 6-month bundle (tag `6-month-bundle` is applied)
**What it does:** Runs a 140-day upgrade campaign with 4 emails encouraging the client to upgrade to 12 months. Stops if they upgrade.

- [ ] Click **+ New Workflow** → Name it: `SmithFit — FOMO Track B (6-Month → 12-Month)`
- [ ] Set trigger: **Contact Tag** → Tag added → `6-month-bundle`
- [ ] Add a **Filter/Condition**: Contact does NOT have tag `12-month-bundle`
- [ ] Add action: **Wait** → `45 days`
- [ ] Add action: **Send Email** → `FOMO-B1: 45 Days In`
- [ ] Add action: **Wait** → `30 days`
- [ ] Add action: **Send Email** → `FOMO-B2: Coach In Your Pocket`
- [ ] Add action: **Wait** → `25 days`
- [ ] Add action: **Send Email** → `FOMO-B3: Month 3 Is Coming`
- [ ] Add action: **Wait** → `40 days`
- [ ] Add action: **Send Email** → `FOMO-B4: Your 6-Month Commitment Ends`
- [ ] Add action: **Remove Tag** → `fomo-track-b-active`
- [ ] Add action: **Add Tag** → `fomo-track-b-complete`
- [ ] Click **Save** → toggle to **Published**

---

### WORKFLOW 5 — FOMO Track C: Free Trial to Paid Conversion
**Trigger:** Someone starts the 14-day free trial (tag `free-trial-active` is applied)
**What it does:** Sends 6 emails over 14 days encouraging conversion, then checks on Day 15 whether they paid. If yes, ends. If no, sends a final email and marks them as cancelled.

- [ ] Click **+ New Workflow** → Name it: `SmithFit — FOMO Track C (Free Trial → Paid)`
- [ ] Set trigger: **Contact Tag** → Tag added → `free-trial-active`
- [ ] Add action: **Send Email** → `FOMO-C1: Your 14-Day Free Trial Starts Now`
- [ ] Add action: **Wait** → `3 days`
- [ ] Add action: **Send Email** → `FOMO-C2: Day 3 Check-In`
- [ ] Add action: **Wait** → `4 days`
- [ ] Add action: **Send Email** → `FOMO-C3: Halfway`
- [ ] Add action: **Wait** → `3 days`
- [ ] Add action: **Send Email** → `FOMO-C4: Keep Everything for $2.23/Day`
- [ ] Add action: **Wait** → `2 days`
- [ ] Add action: **Send Email** → `FOMO-C5: She Almost Cancelled on Day 11`
- [ ] Add action: **Wait** → `1 day`
- [ ] Add action: **Send Email** → `FOMO-C6: Your Trial Ends Today`
- [ ] Add action: **Wait** → `1 day`
- [ ] Add action: **If/Else** with this condition: Contact HAS tag `trial-converted`
  - **YES branch:** End the workflow (no action — they paid, they're good)
  - **NO branch:**
    - [ ] Add action: **Send Email** → `FOMO-C7: You Left. The Door Is Still Open.`
    - [ ] Add action: **Remove Tag** → `free-trial-active`
    - [ ] Add action: **Add Tag** → `trial-cancelled`
- [ ] Click **Save** → toggle to **Published**

---

### After All 5 Workflows Are Built
- [ ] Confirm all 5 workflows show as **Published** (not Draft) in the Workflows list
- [ ] Run a quick verification: from your computer terminal, run `python3 /Users/ijsmith/SmithFit/scripts/ghl/verify.py` to confirm all tags and templates are in place
- [ ] Hand off Phase 3 to VA (if you haven't already)

---

## PHASE 3 — VA TASKS
**Owner: VA | Run in parallel with Phase 2**
*These tasks don't depend on Phase 2 being finished. Hand this phase off to your VA the same day you start Phase 2. VA has a detailed instruction document already — this is the summary of what's in it.*

The full step-by-step instructions for the VA are in this file:
`SmithFit/27 Course Funnel/Docs created Claude/SmithFit Automation/VA_FitMetrics_Setup_Instructions.md`

---

### Part A — Weekly Recurring Broadcasts in FitMetrics (4 total)
Set up once, they run forever to all active members. All four are written in the VA doc.

- [ ] Monday 8:00 AM — `New Week Activation` — set to recurring weekly — **Activate**
- [ ] Wednesday 9:00 AM — `Win Wednesday` — set to recurring weekly — **Activate**
- [ ] Saturday 9:00 AM — `Rest + Reflect` — set to recurring weekly — **Activate**
- [ ] Sunday 7:00 PM — `Prep + Preview` — set to recurring weekly — **Activate**
- [ ] Confirm all 4 show as **Active** in FitMetrics before marking this done

---

### Part B — Milestone DMs in FitMetrics (8 total)
These fire automatically per member at specific day milestones. Each message is written in the VA doc — copy/paste only, no editing.

- [ ] Day 7 — First Week Done — fire once per client — **Activate**
- [ ] Day 14 — Two-Week Warrior — fire once per client — **Activate**
- [ ] Day 30 — One Month Strong — fire once per client — **Activate** *(also triggers $5 gift card email via GHL — notify IJ when live)*
- [ ] Day 45 — Milestone — fire once per client — **Activate**
- [ ] Day 60 — 60-Day Shifter — fire once per client — **Activate** *(also triggers $10 gift card email via GHL)*
- [ ] Day 90 — 90-Day Identity Shift — fire once per client — **Activate** *(also triggers $15 gift card + mailing address form via GHL)*
- [ ] Day 180 — Six-Month Transformation — fire once per client — **Activate** *(also triggers $25 gift card via GHL)*
- [ ] Day 365 — One Full Year — fire once per client — **Activate** *(also triggers $75 gift card via GHL)*
- [ ] Confirm all 8 show as **Active** and set to fire once per client

---

### Part C — Habit Streak and Workout Automations in FitMetrics (5 total)
These fire based on habit streaks and workout counts, independent of membership days.

- [ ] 7-day habit streak — **Activate**
- [ ] 21-day habit streak — **Activate**
- [ ] 30-day full reset (all 4 habits completed 30 consecutive days) — **Activate** *(VA must notify IJ when this fires so she can post in the community)*
- [ ] 10 workouts completed — **Activate**
- [ ] 50 workouts completed — **Activate** *(also triggers $15 gift card email via GHL)*
- [ ] Confirm all 5 show as **Active**

---

### Part D — Course Homepage Cosmetic Edit
- [ ] Log in to the course platform (GHL or Trainerize — wherever the course homepage lives)
- [ ] Update the banner image to something that looks polished and on-brand before launch
- [ ] Confirm the homepage looks presentable — not just a default template
- [ ] Screenshot and send to IJ for approval before marking done

---

## PHASE 4 — FILL IN THE BLANKS
**Owner: IJ | Before going fully live**
*Seven placeholders exist in the email templates that need real links and decisions before launch. If you go live without fixing these, customers will see broken or empty links. This phase takes 30–60 minutes once you have the information.*

---

### 1. [CALENDLY LINK] — Your bundle onboarding booking link
**What it is:** The link bundle clients use to book their 60-minute personal gameplan call with you.
**Where to create it:** Go to calendly.com → create a new event type → set it to 60 minutes → give it a descriptive name like "SmithFit Bundle Onboarding Call" → copy the link.
**Which emails contain this placeholder:** BNDL-01, BNDL-02
**Action:**
- [ ] Create the Calendly event and copy your link
- [ ] Go to **Email Marketing → Templates** in GHL → open BNDL-01 → find `[CALENDLY LINK]` → replace with your real Calendly URL → save
- [ ] Do the same in BNDL-02
- [ ] Search all other templates for `[CALENDLY LINK]` and replace if found

---

### 2. Weekly Coaching Call Day + Time — update the onboarding emails
**What it is:** The day and time of your weekly group coaching call mentioned in the membership onboarding emails.
**Where to confirm it:** Decide on your weekly call schedule — pick a day and time that works for you and your wife. This is the live call the membership promises.
**Which emails reference the call:** MEM-01, MEM-02, and others in the membership sequence
**Action:**
- [ ] Confirm your weekly call day and time (example: "Wednesdays at 7 PM CT")
- [ ] Go to **Email Marketing → Templates** in GHL → open MEM-01 → find any reference to the call day/time → update it → save
- [ ] Repeat for MEM-02 and any other membership emails that mention the call schedule

---

### 3. [REFERRAL LINK] — Your referral tracking link
**What it is:** The unique link members use to refer other nurses. When someone uses this link and buys, it gets credited to the referrer.
**Where to create it:** In GHL, go to **Marketing → Affiliate Manager** (or search "Affiliates" in GHL) → set up a referral/affiliate program → copy the tracking link template.
**Which email contains this placeholder:** REF-01 (fires at Day 45 of membership)
**Action:**
- [ ] Set up the GHL affiliate/referral module and copy your referral link format
- [ ] Open template REF-01 in GHL → replace `[REFERRAL LINK]` with the real link → save

---

### 4. [MAILING FORM LINK] — Address collection form for Day 90 physical gift
**What it is:** A simple form where Day 90 members submit their mailing address so you can send them the physical gift.
**Where to create it:** Use Google Forms, Typeform, or a GHL form — it just needs to collect name, mailing address, and email. Takes 5 minutes to build.
**Which email contains this placeholder:** The Day 90 milestone email (MILE-90 or equivalent)
**Action:**
- [ ] Create a short mailing address collection form (Google Form is fine)
- [ ] Copy the form link
- [ ] Find the Day 90 email template in GHL → replace `[MAILING FORM LINK]` with your form link → save

---

### 5. [1-ON-1 APPLICATION LINK] — Application for high-ticket coaching
**What it is:** A link to apply for 1-on-1 personal coaching with IJ. This is a separate, higher-ticket offer — it is NOT part of the $67/month membership or bundles.
**Where to create it:** Any form works — Google Form, Typeform, or GHL survey. Ask the questions you'd need to qualify someone for high-ticket coaching (goals, schedule, budget, etc.).
**Which emails contain this placeholder:** Check your email templates — search for `[1-ON-1 APPLICATION LINK]` in GHL
**Action:**
- [ ] Create a short coaching application form
- [ ] Copy the link
- [ ] Search GHL email templates for `[1-ON-1 APPLICATION LINK]` → replace in all instances → save

---

### 6. Confirm Milestone Gift Card Amounts
**What they are:** Amazon gift cards sent at Day 30, 60, 90, 180, 365, and 50 workouts. Current amounts: $5 / $10 / $15 / $25 / $75 / $15.
**Why this matters:** Once you go live and members start hitting milestones, these amounts need to be real commitments you can follow through on.
**Action:**
- [ ] Review the current amounts: $5 (Day 30) / $10 (Day 60) / $15 (Day 90) / $25 (Day 180) / $75 (Day 365) / $15 (50 workouts)
- [ ] Confirm or adjust the amounts based on what you're comfortable committing to
- [ ] If you change any amounts, update the relevant email templates in GHL to reflect the new numbers

---

### 7. Decide the Day 90 Physical Gift Item
**What it is:** The physical item you mail to members who hit 90 days. The Day 90 milestone message says "something in the mail." You need to decide what that something is before members start reaching that milestone.
**Ideas:** Compression socks (very on-brand for nurses), a SmithFit branded item (tumbler, bag), a small self-care gift, a handwritten card. Something that feels personal and nurse-specific.
**Action:**
- [ ] Decide on the physical gift item
- [ ] Update the Day 90 email template in GHL to name the specific item (so members know what to expect)
- [ ] Set up a way to source and mail these (Amazon wish list link, Printful, manual ordering — whatever works for your volume)

---

## PHASE 5 — TEST BEFORE LAUNCH
**Owner: IJ + VA | Final check before going public**
*Do not announce to the public until you have personally walked through the full purchase experience. This catches broken links, missing emails, and tag errors before real customers see them.*

Use a real email address you can check (not your main email — use a Gmail alias or a test account).

---

### Purchase Flow Tests
- [ ] Buy the $27 course as a test customer → confirm you land on the correct thank-you/upsell page → confirm you receive a purchase confirmation email
- [ ] Accept the $67/month upsell → confirm tag `membership-active` is applied to your test contact in GHL → confirm email MEM-01 arrives in your inbox within a few minutes
- [ ] In a separate test: decline $67/month, then accept the free trial → confirm tag `free-trial-active` is applied → confirm FOMO-C1 email arrives
- [ ] In a separate test: purchase a bundle → confirm tag `bundle-active` is applied → confirm BNDL-01 arrives

---

### FitMetrics Confirmation (VA)
- [ ] Confirm all 4 weekly broadcasts show as **Active** and scheduled
- [ ] Confirm all 8 milestone DMs show as **Active** and set to fire once per client
- [ ] Confirm all 5 streak/workout automations show as **Active**
- [ ] Spot-check: trigger one test milestone manually if FitMetrics allows it, confirm the message sends

---

### Final Link and Page Check
- [ ] Click every buy button on every sales page — confirm each one loads a working checkout form
- [ ] Click the [CALENDLY LINK] in a test email — confirm it opens and works
- [ ] Click the mailing address form link — confirm it loads and submits correctly
- [ ] Check one email for mobile formatting — confirm it reads well on a phone

---

## PHASE 6 — LAUNCH
**Owner: IJ | Once Phases 1–3 are done (4 and 5 strongly recommended)**
*You do not need everything to be perfect. You need the purchase flow to work, the onboarding emails to fire, and the FitMetrics app to be ready. The rest can be polished in the first week.*

- [ ] Post a launch Reel on Instagram (hook: the problem nurses face, CTA: link in bio)
- [ ] Post a launch Story with a direct link to the $27 tripwire page
- [ ] Send an email to your warm leads and waitlist announcing the launch
- [ ] Post in any existing community or group you're in
- [ ] DM 3–5 people who have already expressed interest — personal, direct, not a copy/paste

---

## OPEN ITEMS TRACKER

These items don't block launch but need to be resolved. Review this list weekly until everything is done.

| Item | Owner | Status | Notes |
|------|-------|--------|-------|
| Day 90 physical gift — decide the item | IJ | Not Started | Compression socks are a strong, on-brand option — open to other ideas |
| Calendly booking link | IJ | Not Started | Needed before BNDL-01 and BNDL-02 go live |
| Weekly coaching call day + time | IJ | Not Started | Confirm schedule before MEM-01 is sent to real members |
| GHL referral tracking link | IJ | Not Started | Set up in GHL Affiliate Manager module |
| Mailing address form (Day 90) | IJ / VA | Not Started | Google Form or Typeform — 5-minute build |
| 1-on-1 coaching application link | IJ | Not Started | Any form works — used in high-ticket emails |
| Confirm milestone gift card amounts | IJ | Pending | Currently $5 / $10 / $15 / $25 / $75 / $15 — confirm before first member hits Day 30 |
| Cancellation salvage email sequence (3 emails) | IJ / Claude | ✅ Done | CANC-01, CANC-02, CANC-03 written — included in `create_templates_v2.py`, will push with the other 32 templates |
| Welcome video scripts (MEM-02 through MEM-05) | IJ | ✅ Done | Scripts written — see `SmithFit Community Content Pack.docx` |
| Truemed / HSA financing marketing angle | IJ / Claude | Not Started | Strong ad angle — nurses can potentially use FSA/HSA funds |

---

*Document created by Claude Code for SmithFit. Last updated March 2026.*
