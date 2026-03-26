# SmithFit — GHL Workflow Build Guide
### Step-by-step instructions for building all 5 automation workflows in GoHighLevel

Your 25 email templates and 40 tags are already live. This guide walks you through building the 5 workflows that connect them. Each workflow is triggered automatically when a tag is applied to a contact (which happens via `python3 scripts/ghl/enroll.py`).

---

## Before You Start

1. Log in to **hub.courseiq.app**
2. Go to **Automation** in the left sidebar
3. Click **Workflows**
4. Create a folder called **SmithFit Automations** to keep things organized

---

## WORKFLOW 1: Membership Day 1 Onboarding

**What it does**: When someone buys the $67/month membership, this sends 6 emails over 45 days and then starts the upgrade sequence.

**Steps to build:**

1. Click **+ New Workflow** → Start from scratch → Name it: `SmithFit — Membership Onboarding`
2. Set trigger: **Contact Tag** → Tag added → `membership-active`
3. Add action: **Send Email** → select template `MEM-01: Welcome to SmithFit`
4. Add action: **Wait** → 2 days
5. Add action: **Send Email** → `MEM-02: Did You Do the Cocktail`
6. Add action: **Wait** → 5 days
7. Add action: **Send Email** → `MEM-03: One Week In`
8. Add action: **Wait** → 7 days
9. Add action: **Send Email** → `MEM-04: Two Weeks`
10. Add action: **Wait** → 16 days
11. Add action: **Send Email** → `MEM-05: One Month In`
12. Add action: **Wait** → 15 days
13. Add action: **Send Email** → `MEM-06: Day 45 — The Upgrade Email`
14. Add action: **Add Tag** → `fomo-track-a-active`
15. Click **Save** → Toggle to **Published**

---

## WORKFLOW 2: Bundle Onboarding

**What it does**: When someone buys a bundle (6-month or 12-month), this sends 4 emails and flags IJ for a coaching review at Day 28.

**Steps to build:**

1. **+ New Workflow** → Name it: `SmithFit — Bundle Onboarding`
2. Trigger: **Contact Tag** → Tag added → `bundle-active`
3. Add action: **Send Email** → `BNDL-01: Welcome Bundle`
4. Add action: **Add Tag** → `new-bundle`
5. Add action: **Wait** → 1 day
6. Add action: **Send Email** → `BNDL-02: Your Gameplan`
7. Add action: **Wait** → 6 days
8. Add action: **Send Email** → `BNDL-03: One Week In`
9. Add action: **Wait** → 21 days
10. Add action: **Send Email** → `BNDL-04: VIP Month Ending`
11. Add action: **Add Tag** → `coach-review`
12. **Save** → **Published**

> **Note**: The `coach-review` tag is your signal to personally check in with this client. Set up a GHL notification under Settings > Notifications to alert you when this tag is applied.

---

## WORKFLOW 3: FOMO Track A — Monthly Member → Bundle Upsell

**What it does**: For members who are paying month-to-month, this runs a 75-day upgrade campaign with 4 emails. Stops automatically if they buy a bundle.

**Steps to build:**

1. **+ New Workflow** → Name it: `SmithFit — FOMO Track A (Monthly → Bundle)`
2. Trigger: **Contact Tag** → Tag added → `fomo-track-a-active`
3. Add a **Filter/Condition** at the top: Contact does NOT have tag `bundle-active`
   *(This stops the sequence if they already upgraded)*
4. Add action: **Send Email** → `FOMO-A1: One Month In`
5. Add action: **Wait** → 15 days
6. Add action: **Send Email** → `FOMO-A2: She Lost 31 lbs`
7. Add action: **Wait** → 15 days
8. Add action: **Send Email** → `FOMO-A3: The Math on Month-to-Month`
9. Add action: **Wait** → 15 days
10. Add action: **Send Email** → `FOMO-A4: Last Call`
11. Add action: **Remove Tag** → `fomo-track-a-active`
12. Add action: **Add Tag** → `fomo-track-a-complete`
13. **Save** → **Published**

---

## WORKFLOW 4: FOMO Track B — 6-Month → 12-Month Upgrade

**What it does**: For clients on the 6-month bundle, this runs a 140-day upgrade campaign to move them to 12-month. Stops if they upgrade.

**Steps to build:**

1. **+ New Workflow** → Name it: `SmithFit — FOMO Track B (6-Month → 12-Month)`
2. Trigger: **Contact Tag** → Tag added → `6-month-bundle`
3. Add a **Filter/Condition**: Contact does NOT have tag `12-month-bundle`
4. Add action: **Wait** → 45 days
5. Add action: **Send Email** → `FOMO-B1: 45 Days In`
6. Add action: **Wait** → 30 days
7. Add action: **Send Email** → `FOMO-B2: Coach In Your Pocket`
8. Add action: **Wait** → 25 days
9. Add action: **Send Email** → `FOMO-B3: Month 3 Is Coming`
10. Add action: **Wait** → 40 days
11. Add action: **Send Email** → `FOMO-B4: Your 6-Month Commitment Ends`
12. Add action: **Remove Tag** → `fomo-track-b-active`
13. Add action: **Add Tag** → `fomo-track-b-complete`
14. **Save** → **Published**

---

## WORKFLOW 5: FOMO Track C — Free Trial → Paid Conversion

**What it does**: When a contact starts the 14-day free trial, this sends 7 emails over 15 days and uses an IF/ELSE to handle conversions vs. cancellations.

**Steps to build:**

1. **+ New Workflow** → Name it: `SmithFit — FOMO Track C (Free Trial → Paid)`
2. Trigger: **Contact Tag** → Tag added → `free-trial-active`
3. Add action: **Send Email** → `FOMO-C1: Your 14-Day Free Trial Starts Now`
4. Add action: **Wait** → 3 days
5. Add action: **Send Email** → `FOMO-C2: Day 3 Check-In`
6. Add action: **Wait** → 4 days
7. Add action: **Send Email** → `FOMO-C3: Halfway`
8. Add action: **Wait** → 3 days
9. Add action: **Send Email** → `FOMO-C4: Keep Everything for $2.25/Day`
10. Add action: **Wait** → 2 days
11. Add action: **Send Email** → `FOMO-C5: She Almost Cancelled on Day 11`
12. Add action: **Wait** → 1 day
13. Add action: **Send Email** → `FOMO-C6: Your Trial Ends Today`
14. Add action: **Wait** → 1 day
15. Add action: **If/Else** →
    - Condition: Contact HAS tag `trial-converted`
    - **YES branch**: End workflow (no action needed)
    - **NO branch**:
      1. Send Email → `FOMO-C7: You Left. The Door Is Still Open.`
      2. Remove Tag → `free-trial-active`
      3. Add Tag → `trial-cancelled`
16. **Save** → **Published**

---

## After Building All 5 Workflows

Run the verification tool to confirm everything is in place:

```
cd /Users/ijsmith/SmithFit/scripts/ghl
python3 verify.py
```

Then test with a real email address:

```
python3 enroll.py
```

Enter your own email, pick "Bought $67/month membership", and confirm you receive MEM-01 in your inbox within a few minutes.

---

## Quick Reference: Tag → Workflow

| Tag Applied | Workflow Triggered |
|-------------|-------------------|
| `membership-active` | Workflow 1: Membership Onboarding |
| `bundle-active` | Workflow 2: Bundle Onboarding |
| `fomo-track-a-active` | Workflow 3: FOMO Track A |
| `6-month-bundle` | Workflow 4: FOMO Track B |
| `free-trial-active` | Workflow 5: FOMO Track C |
