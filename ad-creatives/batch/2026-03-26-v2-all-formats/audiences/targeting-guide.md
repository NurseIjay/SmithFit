# SmithFit Audience Targeting Guide
**Batch:** 2026-03-26-v2-all-formats
**Updated:** 2026-03-26
**Platform:** Meta (Facebook + Instagram)

---

## Primary Audience Segments

### Segment 1: Nurse Identity (Broadest)
**Size estimate:** 2-4M reachable
**Interest targeting:**
- Nursing (profession)
- Registered Nurse (RN)
- Licensed Practical Nurse (LPN/LVN)
- Certified Nursing Assistant (CNA)
- Respiratory Therapist (RT)
- 12-hour shifts
- Night shift
- Healthcare worker

**Demographic filters:**
- Female, 35-52
- United States (expand to English-speaking countries in Wave 2)
- Household income: $60K+ (if available in targeting)

**Best concepts for this segment:** 01-Ghost, 02-Not Lazy, 03-Night Shift, 04-Coffee, 08-Quiz

---

### Segment 2: Health-Seeking Nurses (Narrower)
**Size estimate:** 500K-1.5M reachable
**Interest targeting:**
- Segment 1 interests PLUS:
- Weight loss
- Metabolism
- Healthy eating
- Fitness
- Cortisol / Stress management
- Hormone health

**Demographic filters:**
- Same as Segment 1

**Best concepts for this segment:** 05-Sarah, 06-Why Diet Fails, 07-Objection Buster

---

### Segment 3: Warm Retargeting (Highest Intent)
**Custom audiences:**
- Video viewers: 25%+ of any SmithFit video ad (past 30 days)
- Video viewers: 75%+ of any SmithFit video ad (past 14 days)
- Page engagers: Anyone who engaged with SmithFit Instagram or Facebook (past 30 days)
- Website visitors: Anyone who visited the course page (past 14 days)
- Website visitors: Anyone who visited the quiz page but didn't complete (past 7 days)
- Comment engagers: Anyone who commented "RESET" on any ad

**Best concepts for this segment:** 09-DoorDash, 10-Feel Like Yourself, 05-Sarah (carousel), 07-Objection Buster

---

### Segment 4: Lookalike Audiences
**Source audiences (build once data exists):**
- Lookalike 1%: Based on $27 purchasers (highest value)
- Lookalike 1%: Based on quiz completers (highest volume)
- Lookalike 1%: Based on video viewers 75%+ (engaged but not yet purchased)
- Lookalike 2-3%: Broader versions of above for scaling

**Best concepts for this segment:** TOF concepts (01, 02, 03, 04) -- let Meta's algorithm optimize

---

## Funnel-Based Targeting Strategy

### TOF (Cold) -- Concepts 01-04, 08
| Audience | Campaign Type | Daily Budget | Notes |
|----------|--------------|-------------|-------|
| Segment 1 (Nurse Identity) | Awareness / Reach | $5-10/ad | Cast wide net, let algorithm optimize |
| Segment 4 (Lookalikes) | Awareness | $5-10/ad | Available after 100+ purchases |
| Advantage+ broad | Advantage+ Shopping | $15-25 total | Let Meta find the audience with diverse creative |

### MOF (Warm) -- Concepts 05-07
| Audience | Campaign Type | Daily Budget | Notes |
|----------|--------------|-------------|-------|
| Segment 2 (Health-Seeking Nurses) | Consideration | $5-8/ad | Narrower targeting for education content |
| Segment 3 (Video viewers 25%+) | Consideration | $5-8/ad | Warm audience from TOF video ads |

### BOF (Hot) -- Concepts 08-10
| Audience | Campaign Type | Daily Budget | Notes |
|----------|--------------|-------------|-------|
| Segment 3 (Retargeting) | Conversion | $5-10/ad | Highest ROAS expected |
| Segment 3 (Comment engagers) | Conversion | $3-5/ad | Already expressed interest |
| Cart abandoners / Quiz incomplete | Conversion | $3-5/ad | Closest to purchase |

---

## Platform-Specific Notes

### Instagram
- **Reels:** Primary format for TOF. Deploy video concepts 01-04 as Reels.
- **Feed:** Static and carousel concepts. Feed placement for MOF/BOF.
- **Stories:** Stories placement for retargeting. Static concepts 09, 10 work well.
- **Posting time:** Schedule organic + paid for 10 PM-7 AM for night shift reach. Test 5-7 AM and 10 PM-2 AM windows.
- **Comment triggers:** "Comment RESET" CTAs trigger DM automation. Boost engagement signals for algorithm.

### Facebook
- **Feed:** Carousel concepts have highest ROAS here. Prioritize 05-Sarah, 07-Objection, 08-Quiz carousels.
- **Advantage+:** Use Advantage+ Shopping campaigns with broad targeting and diverse creative (all 4 formats of 2-3 concepts). Let Meta optimize.
- **Groups:** SmithFit community content angle for organic amplification.

---

## Exclusions (Apply to All Campaigns)

- Exclude existing $27 purchasers (from customer list -- upload hashed emails)
- Exclude existing membership + bundle members
- Exclude anyone who purchased in the last 7 days (prevent wasted spend on recent buyers)
- For TOF: exclude Segment 3 (warm retargeting) to avoid paying for already-warm users at cold CPMs

---

## Scaling Rules

1. **Start small:** $3-5/ad/day per concept
2. **After 3 days + $15 spend:** Kill anything below 0.3% CTR
3. **After 7 days + $35 spend:** Kill anything above $30 CPA (for $27 product)
4. **Scale winners:** Increase budget 20-30% every 3 days (not more -- avoids re-entering learning phase)
5. **Creative refresh:** New creative every 3-4 weeks to prevent fatigue
6. **Audience expansion:** Add Lookalike audiences after 100+ purchases
7. **New creative test:** Always run 1-2 new concepts alongside proven winners

---

## Tracking Setup Requirements

Before launching:
- [ ] Meta Pixel installed on course purchase page
- [ ] Purchase event configured as primary conversion event
- [ ] Quiz completion event configured as secondary conversion event
- [ ] Customer list uploaded for exclusion audiences
- [ ] UTM parameters added to all ad links: `?utm_source=meta&utm_medium=paid&utm_campaign=[concept-name]&utm_content=[format]`
- [ ] Conversions API (CAPI) configured for server-side tracking (improves attribution accuracy)
