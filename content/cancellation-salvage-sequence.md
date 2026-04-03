# Cancellation Salvage Sequence — SmithFit Metabolic Breakthrough Membership

**GHL Trigger:** Tag added → `cancellation-requested`
**Filter:** Contact has tag `membership-active`
**Sequence:** 3 emails over 5 days
**Goal:** Save the member, offer alternatives, graceful exit if needed

---

## SAVE-01 — "We Hear You"

**Email ID:** SAVE-01
**Send Timing:** Day 0 (immediately after `cancellation-requested` tag applied)
**GHL Template Name:** `save-01-we-hear-you`

### Subject Line Options
1. Before you go — can I ask you one thing?
2. No guilt trip. Just a quick question.
3. Hey {{contact.first_name}}, I get it.

### Email Body

Hey {{contact.first_name}},

I saw your cancellation request come through, and I want you to know — no guilt trip is coming. No "but wait!" desperate energy. That's not how we do things here.

I just want to check in. Nurse to nurse.

Because here's what I've learned coaching 400+ nurses through this program: most of the time, the reason someone wants to cancel isn't actually "this doesn't work." It's "my life got louder than my plan."

And I respect that. I've been there. Three 12s in a row, kids needing rides, charting from your couch at 11 PM — and the last thing you want is one more subscription reminding you of something you "should" be doing.

So before we process anything, I want to offer you something most programs don't:

**A pause.**

You can freeze your membership for up to 30 days. No charge. No judgment. Your progress, your meal plans, your community access — all saved. Waiting for you when life calms down.

Because here's what I know about nurses: you don't quit because you stopped caring. You pause because you're carrying too much. And that's not a character flaw. That's just Thursday.

If pausing sounds right, just reply "PAUSE" and we'll freeze everything today.

If something else is going on — you're not getting what you expected, the workouts aren't fitting your schedule, whatever it is — reply and tell me. I read every one of these personally, and I want to hear it. No ego. Just honesty.

And if you've genuinely decided this isn't for you? I'll respect that completely. No hard feelings. You'll always be part of the SmithFit family.

Just let me know what feels right.

— IJ

P.S. You don't have to decide right now. Your membership stays active through this billing cycle regardless. Take a breath first.

**CTA Button Text:** Reply "PAUSE" to Freeze My Membership

---

## SAVE-02 — "What's Really Going On"

**Email ID:** SAVE-02
**Send Timing:** Day 2 (48 hours after SAVE-01)
**GHL Template Name:** `save-02-whats-really-going-on`
**Filter:** Still has `cancellation-requested` tag (hasn't replied/resolved)

### Subject Line Options
1. The 3 reasons nurses almost quit (and what actually helps)
2. Quick — which one sounds like you?
3. {{contact.first_name}}, most nurses hit this wall at week 4-6

### Email Body

Hey {{contact.first_name}},

I've coached hundreds of nurses through this program. And when someone thinks about leaving, it almost always comes down to one of three things.

See if one of these sounds familiar:

**"I just don't have time."**

I hear this one the most — and it's real. Your schedule isn't a 9-to-5 where you can "just wake up earlier." You're working 12-hour shifts, sometimes back to back, sometimes nights.

But here's what you might have missed inside the membership: every single workout is 15 minutes or less. The Chaos Day meal templates exist specifically for days when your only meal is whatever you grabbed between rooms. You don't need an hour. You need 15 minutes and a system that doesn't punish you for having a real job.

**"I'm not seeing results fast enough."**

This one's tricky — because cortisol-driven weight doesn't leave the way regular weight does. The first 2-3 weeks, your body is literally recalibrating its stress response. The scale might not move. But your sleep shifts. Your cravings quiet down. Your energy stops crashing at 2 PM.

One of our members, a night-shift ER nurse and mom of two, saw nothing on the scale for 5 weeks. She almost quit. By week 6, she'd dropped 11 pounds and two scrub sizes — because her body finally got out of fight-or-flight and started releasing what it had been holding onto.

The results aren't late. They're loading.

**"Honestly? I forgot I signed up."**

No shame in that. Life gets loud. But here's what's happening inside the membership right now that you're missing:

- This week's shift-proof meal plan just dropped (work day, off day, and chaos day versions)
- A new 15-minute cortisol-conscious workout went live Monday
- Our Wednesday community call had a nurse share how she finally stopped stress-eating on night shifts

All of that is sitting there, ready for you. No catching up required. Jump in wherever you are.

**Which one sounds like you?** Hit reply and tell me. I'll personally point you to the exact thing inside the membership that addresses it — so you can see if this is worth one more month before you walk away.

— IJ

**CTA Button Text:** Tell Me Which One — I'll Help

---

## SAVE-03 — "Your Last Option (Then a Graceful Goodbye)"

**Email ID:** SAVE-03
**Send Timing:** Day 5 (3 days after SAVE-02)
**GHL Template Name:** `save-03-last-option`
**Filter:** Still has `cancellation-requested` tag (hasn't replied/resolved)

### Subject Line Options
1. Last thing from me — then I'll let you go
2. One final option before we close this out
3. {{contact.first_name}}, here's what I can do

### Email Body

Hey {{contact.first_name}},

This is my last email about your cancellation. I promised no guilt trips, and I meant it.

But before we close this chapter, I want to put two options on the table — because I've seen too many nurses walk away right before things click, and I'd rather give you every chance than wonder "what if."

**Option A: The 30-Day Pause**

Freeze your membership for 30 days. Zero charge. Everything saved — your progress, your plans, your community spot. When life settles (or your rotation changes, or you finish that stretch of nights), you pick back up exactly where you left off.

No restarting. No re-buying. Just a pause button for real life.

**Option B: Stay — and Get a Bonus Month**

If you're willing to give it one more month, I'll cut your next month to 50% off — that's $33.50 instead of $67. Use that month to actually try the Chaos Day templates, join one Wednesday call, and do three of the 15-minute workouts.

If you don't feel a difference after 30 days of actually using the system? Cancel with zero friction and my full respect. But give the system a real shot before you decide it doesn't work.

**Here's why I'm offering this:**

Because I've watched this pattern hundreds of times. A nurse signs up, life hits hard, she doesn't engage, and she cancels thinking the program didn't work — when really, the program never got a chance.

I'm not saying that's you. Maybe you gave it everything and it's genuinely not the right fit. If that's the case, I respect your decision completely, and I mean that.

But if there's even a small part of you that wonders whether this could still work — this is your lowest-risk way to find out.

**Reply with "PAUSE" or "STAY" and I'll set it up today.**

If I don't hear back, we'll process your cancellation at the end of your billing cycle. No surprise charges. No hoops to jump through.

Either way — you showed up. You tried something. That matters more than most people realize.

Take care of yourself out there, {{contact.first_name}}.

— IJ

P.S. If you do leave, you're always welcome back. The door stays open. And the $27 Reset Course you started with? That's yours forever.

**CTA Button Text:** Reply PAUSE or STAY

---

## GHL Implementation Notes

### Workflow Setup
1. **Trigger:** Tag added → `cancellation-requested`
2. **Filter condition:** Contact has tag `membership-active`
3. **Sequence:**
   - SAVE-01 → send immediately
   - Wait 2 days
   - **If/Else:** Tag `cancellation-requested` still present?
     - YES → send SAVE-02
     - NO → end workflow (member saved or paused)
   - Wait 3 days
   - **If/Else:** Tag `cancellation-requested` still present?
     - YES → send SAVE-03
     - NO → end workflow
   - Wait 3 days (grace period for reply)
   - **If/Else:** Tag `cancellation-requested` still present?
     - YES → Process cancellation:
       - Remove `membership-active`
       - Remove `cancellation-requested`
       - Add tag `membership-cancelled`
     - NO → end workflow (member saved)

### Reply Handling (Manual or Automation)
- **"PAUSE" reply:** Remove `cancellation-requested`, add `membership-paused`, freeze billing in Stripe/GHL for 30 days, set reminder to reactivate
- **"STAY" reply:** Remove `cancellation-requested`, apply 50% discount to next invoice, add internal note

### Tags Used
| Tag | Purpose |
|-----|---------|
| `cancellation-requested` | Triggers this sequence |
| `membership-active` | Filter — only run for active members |
| `membership-paused` | Applied when member chooses pause |
| `membership-cancelled` | Applied after sequence completes with no save |

### Metrics to Track
- **Save rate:** % of `cancellation-requested` contacts who do NOT end up `membership-cancelled`
- **Pause rate:** % who choose pause option
- **Re-engagement rate:** % of paused members who reactivate after 30 days
- **Reply rate per email:** Track which email drives the most replies
