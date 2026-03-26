# SmithFit — Master Business Context

## Business Overview
**Brand**: SmithFit
**Owner**: IJ Smith, RN (CEO, coach, face of brand)
**Platform**: GoHighLevel (hub.courseiq.app) + Instagram
**Mission**: Help nurses over 35 reset their metabolism without overhauling their life
**GHL Location ID**: TSWnCFvIE58IDjlDc4Ym (stored securely in .env)

### Team
- **IJ Smith (RN)**: CEO, coach, live coaching calls, face of brand
- **Wife**: Assistant coach, hosts workouts, Win Wednesday community calls
- **Mom**: Community DM monitoring, client communication
- **VA**: Broadcast scheduling, education posts, challenge tracking

---

## The Avatar — "Shift Nurse Sarah"
- Female nurse, 35–52, RN/LVN/LPN/CNA/RT
- Works 12-hour shifts (days, nights, rotating)
- Household income $60k–$130k, often a mom or family caregiver
- Belly fat that won't budge. Has tried keto, IF, cardio — nothing sticks
- Wears scrubs so body image hits differently (rings tight, uniform fitting wrong)
- Exhausted after shifts, can't meal prep perfectly, skips workouts out of necessity
- Blames herself — real cause is chronically elevated cortisol from shift stress
- Wants: feel like herself again, energy, clothes fitting better, confidence
- Deepest fear: her body is just broken and nothing will work

**Real quotes she says:**
- "I've tried everything" / "I'm good all week then blow it on night shifts"
- "I'm too tired to meal prep" / "My body just doesn't respond like it used to"
- "I'm living off coffee and vibes, honestly" / "I'm not lazy. I'm just exhausted."
- "I don't even recognize my body anymore" / "I need something that works with night shift"

**Identity she wants:** The woman who looks put-together without trying. Scrubs fitting, posture up, not sucking in stomach. Steady, not reactive. Food doesn't control her.

---

## Brand Voice
- **Tone**: Warm, direct, nurse-to-nurse — like a colleague who figured something out
- **Always validate first**: "It's not your fault" before any solution
- **Science-backed, plain language**: Explain cortisol, circadian rhythm, metabolism simply
- **Never shame**: No "just eat less, move more" energy
- **Specific**: Speak to 12-hour shifts, night shifts, rotating schedules, post-shift exhaustion

**Use**: "shift workers" | "stuck in fight-or-flight" | "built by a nurse, for nurses" | "no macros, no punishing cardio" | "feel the difference by Day 3"
**Avoid**: "just" | "lazy" | "discipline" | generic fitness advice | clinical jargon

---

## The 4-Stage Offer Stack (Complete Funnel)

### OFFER 1: $27 Tripwire — 7-Day Shift-Proof Metabolism Reset™
- **Purpose**: Low-risk entry point, identify buyers, build trust
- **Positioning**: Below pain threshold ($27), perceived value $679
- **Includes**: 4 modules (Why stuck / 2-Step Reset / Shift-proof nutrition / Circadian eating), metabolic cocktail protocol, box breathing, 60-day guarantee
- **Expected outcomes**: Stable energy 24–72hrs, calmer cravings, better sleep, fat-loss momentum
- **GHL trigger**: Purchase → apply tag (starts Campaign 01 or 02 depending on upsell taken)

### OFFER 2: $67/month Membership — Metabolic Breakthrough Membership (Upsell)
- **Purpose**: Recurring revenue, community, ongoing coaching
- **Shown**: Immediately after $27 purchase
- **Includes**:
  - Weekly shift-proof meal plans (Work Day / Off Day / Chaos Day templates)
  - 1,000+ recipe database in SmithFit app (Trainerize)
  - 15-minute cortisol-conscious workouts (progressive, home-friendly)
  - Chaos-Day Rescue Plans
  - Weekly FitMetrics AI check-ins (automated — NOT personal coaching)
  - 1 weekly group coaching call (live with IJ and SmithFit team)
  - New SmithFit FAM community (FitMetrics app)
  - 1-way messaging only — members cannot DM coaches directly
- **Note**: NO 1-on-1 calls. Those belong to the High Ticket offer (separate funnel) only.
- **GHL tag**: `membership-active` → triggers Membership Day 1 Onboarding workflow

### OFFER 3: 14-Day Free Trial — Downsale
- **Purpose**: Risk reversal for objectors who declined $67/month
- **Shown**: Only if prospect declines $67/month upsell
- **Includes**: Full membership access for 14 days (same as $67/mo — no 1-on-1 calls)
- **Day 14**: Must pay to keep access — FOMO Track C fires
- **GHL tag**: `free-trial-active` → triggers FOMO Track C workflow

### OFFER 4: Bundle Upgrades (Upsell after membership)
- **6-Month Bundle**: $335 ($55.83/mo) — everything in membership PLUS: 1 x 60-min personal gameplan call with IJ [CALENDLY LINK], MealLens AI, BioSync Bloodwork Portal, VIP community Month 1 then standard
- **12-Month Bundle**: $588 ($49/mo) — everything in 6-month PLUS: quarterly 20-min coaching calls with IJ, VIP 1-on-1 community access Month 1 (agentic DM)
- **GHL tags**: `bundle-active` + `6-month-bundle` or `12-month-bundle` → triggers Bundle Onboarding workflow

---

## GHL Tag System (40 Tags — All Live)

### Purchase & Status
| Tag | Meaning |
|-----|---------|
| `membership-active` | $67/mo purchase confirmed |
| `bundle-active` | Any bundle purchased |
| `6-month-bundle` | 6-month purchase |
| `12-month-bundle` | 12-month purchase |
| `free-trial-active` | Free trial started (removed Day 14) |
| `trial-converted` | Trial → paid |
| `trial-cancelled` | Trial ended, no conversion |
| `new-member` | Any new purchase |
| `new-bundle` | Bundle just purchased |

### FOMO Sequence Tracking
| Tag | Meaning |
|-----|---------|
| `fomo-track-a-active` | Monthly → bundle upgrade sequence running |
| `fomo-track-b-active` | 6-month → 12-month upgrade sequence running |
| `fomo-track-c-active` | Free trial → paid conversion sequence running |
| `fomo-track-a-complete` | Track A finished |
| `fomo-track-b-complete` | Track B finished |
| `fomo-track-c-complete` | Track C finished |

### Coaching & Lifecycle
| Tag | Meaning |
|-----|---------|
| `coach-review` | Day 28 bundle alert — IJ reviews |
| `vip-month-complete` | End of VIP month (bundle clients) |
| `engagement-active` | Actively logging/participating |
| `engagement-at-risk` | Hasn't logged in X days |
| `cancellation-requested` | Expressed cancellation intent |
| `win-request-sent` | Testimonial request sent (Day 60–90) |
| `referral-prompt-sent` | Referral incentive sent |
| `waitlist-active` | On launch waitlist |

---

## The 5 GHL Automation Workflows (Email Templates Live, Workflows Need Building)

### Workflow 1: Membership Day 1 Onboarding
**Trigger**: Tag added → `membership-active`
**Emails**: MEM-01 (Day 0) → MEM-02 (Day 2) → MEM-03 (Day 7) → MEM-04 (Day 14) → MEM-05 (Day 30) → MEM-06 (Day 45)
**End action**: Add tag `fomo-track-a-active`

### Workflow 2: Bundle Onboarding
**Trigger**: Tag added → `bundle-active`
**Emails**: BNDL-01 (Day 0) → BNDL-02 (Day 1) → BNDL-03 (Day 7) → BNDL-04 (Day 28)
**End action**: Add tag `coach-review`

### Workflow 3: FOMO Track A — Monthly → Bundle Upsell
**Trigger**: Tag added → `fomo-track-a-active` (filter: NOT `bundle-active`)
**Emails**: FOMO-A1 (Day 30) → FOMO-A2 (Day 45) → FOMO-A3 (Day 60) → FOMO-A4 (Day 75)
**End action**: Remove `fomo-track-a-active`, add `fomo-track-a-complete`

### Workflow 4: FOMO Track B — 6-Month → 12-Month Upsell
**Trigger**: Tag added → `6-month-bundle` (filter: NOT `12-month-bundle`)
**Emails**: FOMO-B1 (Day 45) → FOMO-B2 (Day 75) → FOMO-B3 (Day 100) → FOMO-B4 (Day 140)
**End action**: Remove `fomo-track-b-active`, add `fomo-track-b-complete`

### Workflow 5: FOMO Track C — Free Trial → Paid
**Trigger**: Tag added → `free-trial-active`
**Emails**: FOMO-C1 (Day 0) → FOMO-C2 (Day 3) → FOMO-C3 (Day 7) → FOMO-C4 (Day 10) → FOMO-C5 (Day 12) → FOMO-C6 (Day 14)
**Day 15 IF/ELSE**: Has `trial-converted`? YES → end. NO → Send FOMO-C7 → remove `free-trial-active` → add `trial-cancelled`

---

## The 5 Email Campaigns (Contact Segments)

| Campaign | Who | Goal |
|----------|-----|------|
| Campaign 01 | $27 buyer, declined membership + trial | Re-offer membership 4x over ~38 days |
| Campaign 02 | $27 + $67/mo buyer, declined bundle | Over-deliver, offer bundle 3x |
| Campaign 03 | Full buyer ($27 + membership + bundle) | VIP treatment, collect testimonial, set up renewal |
| Campaign 04 | $27 + free trial (trial running) | Convert before Day 14, prevent churn |
| Campaign 05 | Cold/warm leads (no purchase) | Re-offer tripwire 4x, warm up, convert |

---

## Key Objections & One-Line Reframes
1. "Works on nights?" → "This isn't clock-based. It's shift-based."
2. "Do I track macros?" → "Structure beats tracking. We stabilize first."
3. "What if I miss breaks?" → "Built for missed breaks. That's why it works."
4. "I've tried everything." → "You tried effort. You haven't tried regulation first."
5. "Menopause/peri — nothing works." → "Hormones make stress sensitivity higher — regulation becomes the unlock."
6. "Too exhausted to work out." → "We're not chasing sweat. We're sending a signal."
7. "Just a meal plan?" → "It's a shift-proof physiology system with templates."

---

## Proof Points
- 400+ nurses transformed
- 87% feel a difference by Day 3
- Average 5 lbs lost in Week 1
- 60-day money-back guarantee
- $27 one-time payment | $67/month membership | $335 six-month | $588 twelve-month

---

## Referral Program

### Structure
- **Per referral:** $10 gift card for every nurse who joins and stays 30+ days (stacks with all other tiers)
- **5 active referrals:** Referrer's membership is free every month while they maintain 5+ active members
- **10 active referrals:** $50 cash bonus every quarter they maintain 10+ active members
- **Referred friend:** Gets the $27 Reset Course free (their entry into the funnel)

### GHL
- Referral trigger email: **REF-01** (fires at Day 45 of membership)
- Tag: `referral-prompt-sent` — added when REF-01 fires (prevents duplicate sends)
- Placeholder in REF-01: `[REFERRAL LINK]` — replace with GHL affiliate/referral tracking link

---

## Milestone Reward Schedule

| Milestone | Reward |
|-----------|--------|
| Day 30 | $5 Amazon gift card |
| Day 60 | $10 Amazon gift card |
| Day 90 | $15 Amazon gift card + physical gift (mailed — item TBD, collecting address via [MAILING FORM LINK]) |
| Day 180 | $25 Amazon gift card |
| Day 365 | $75 Amazon gift card |
| 50 workouts | $15 Amazon gift card |

---

## Technical Stack
- **CRM + Email + Automations**: GoHighLevel (hub.courseiq.app)
- **App + Workouts**: Trainerize (SmithFit white-label)
- **AI Coaching**: FitMetrics (check-ins, MealLens, BioSync bloodwork portal, agentic DMs)
- **Content + Scripting**: Claude Code (this workspace)
- **Social**: Instagram (primary)

---

## GHL Tooling (scripts/ghl/)
- `python3 scripts/ghl/verify.py` — check all tags + templates exist in GHL
- `python3 scripts/ghl/enroll.py` — add a contact and apply the correct tag to start their workflow
- `scripts/ghl/WORKFLOW_BUILD_GUIDE.md` — step-by-step instructions to build all 5 workflows in GHL UI

---

## Skills Available

### Marketing Engine (Full Automation)
- `/marketing-engine` — Full marketing team replacement. Generates email sequences, campaigns, lead magnets (with Gamma visuals), bonus packs, seasonal campaigns (Nurses Week / Holiday), re-engagement sequences, broadcast emails, subject line variations, and rolling content pipeline. Use this for anything email or lead generation related.

### Instagram Content
- `/weekly-content` — Full week of 7 Instagram posts (hooks, scripts, captions, hashtags)
- `/reel-script` — Detailed Reel script for a specific topic or post type
- `/image-prompts` — Image/graphic prompts for Midjourney or ChatGPT

### Lead Generation & Email (Legacy — use /marketing-engine for new work)
- `/lead-magnet` — Quick lead magnet content generation
- `/email-sequence` — Quick 5-email nurture or welcome sequence
- `/client-resource` — Bonus resource for existing clients (reset guides, snack lists, night shift tools)

---

## Content Pillars & Weekly Mix

### Weekly Content Plan (7 posts)
| Day | Type | Funnel Stage | Purpose |
|-----|------|-------------|---------|
| Mon | Transformation Story | BOF | Social proof, aspiration |
| Tue | Mechanism/Education | MOF | Explain the cortisol-belly fat link |
| Wed | Relatable Pain Point | TOF | Reach new nurses, stop the scroll |
| Thu | Objection Handling | MOF | Bust a myth or address a doubt |
| Fri | Transformation Story | BOF | End-of-week conversion push |
| Sat | Tips/Quick Win | MOF | Value, save-worthy content |
| Sun | Direct CTA | BOF | "It's $27, here's why it works" |

### Reels Format
- Hook (0–3 sec): Stop scroll
- Problem (3–8 sec): Validate the pain
- Mechanism/Story (8–25 sec): Insight or transformation
- CTA (last 3 sec): "Link in bio" or "Comment RESET"

### Captions
- Line 1: Hook | Lines 2–5: Story with line breaks | Soft CTA | Hard CTA (BOF only) | 5–8 hashtags

---

## Project Tracker — What's Been Delivered

### $27 Course Enhancement (March 2026)
**Status**: Interactive hubs complete, error-free. Loom video reviews pending for Pillars 2-5.

**Course Structure (confirmed)**:
- Pillar 1: Diagnose (Module 1, Lessons 1-3)
- Pillar 2: Stabilize (Module 2, Lessons 1-2 — Lesson 3 was misplaced NS Reset, belongs in Pillar 3)
- Pillar 3: Calm (Module 3, Lessons 1-3)
- Pillar 4: Strengthen (Module 4, Lessons 1-3)
- Pillar 5: Sustain (Module 5, Lessons 1-3)

**Interactive Pillar Hubs** (all in `27 Course Funnel/Docs created Claude/`):

| File | Tabs/Tools Included |
|------|-------------------|
| `pillar-1-diagnose-hub.html` | Metabolism Stress-Type Quiz (15Q), Metabolic Stress Cycle (animated), 7-Day Proof Tracker, If-This-Then-That |
| `pillar-2-stabilize-hub.html` | Shift-Proof Meal Builder, Protein Tracker, If-This-Then-That, 3×3 Plate Formula |
| `pillar-3-calm-hub.html` | Guided NS Reset Timer (animated breathing), Caffeine Timing Calculator, Sleep Switch Guide, 7-Day Calm Tracker, Morning Cocktail + If-This-Then-That |
| `pillar-4-strengthen-hub.html` | Movement Level Finder (5Q quiz), Workout Cards (3 levels), Too-Tired 5-Min Backup Timer, Movement Tracker, If-This-Then-That (10 scenarios) |
| `pillar-5-sustain-hub.html` | Sustain Map Builder, Pivot Ladder Decision Tool, 14-Day Momentum Map, 7-Day Check-In, 15-Scenario If-This-Then-That Library |
| `lead-magnet-quiz.html` | Standalone lead magnet version of the Stress-Type Quiz with email capture gate, $27 CTA, social sharing. Needs: webhook URL + purchase link URL configured |

**Optimization Reports** (all in `27 Course Funnel/Docs created Claude/`):
- `Pillar-1-Optimization-Report.md` + `Pillar-1-Video-Review.md`
- `Pillar-2-Optimization-Report.md` — flags Lesson 3 misplacement
- `Pillar-3-Optimization-Report.md` — highlights NS Reset Timer as top upgrade
- `Pillar-4-Optimization-Report.md` — module mapping confirmed correct
- `Pillar-5-Optimization-Report.md` — strongest pillar analysis

**Standalone Pillar 1 Tools** (originals, before hub consolidation):
- `metabolism-stress-type-quiz.html`
- `7-day-proof-tracker.html`
- `metabolic-stress-cycle.html`

### Pending / Next Steps
- Loom video reviews for Pillars 2-5 (need links or Chrome access)
- Configure lead magnet quiz webhook URL + purchase link URL in GHL
- Exercise demo videos for Pillar 4 (IJ to record, Level 1 priority)
- Build GHL workflows (5 automation workflows — email templates exist, workflows need building per `scripts/ghl/WORKFLOW_BUILD_GUIDE.md`)
- Instagram content generation (skills ready: `/weekly-content`, `/reel-script`, `/image-prompts`)
- Email campaign sequences (5 campaigns defined in CLAUDE.md, templates needed)
