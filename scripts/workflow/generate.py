"""
Content Generation Module
Uses Claude to write complete lead magnets and client resources
based on a researched topic. Output is structured markdown ready for
email formatting and review.
"""

import anthropic
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL


BRAND_CONTEXT = """
BRAND: SmithFit
PRODUCT: 7-Day Shift-Proof Metabolism Reset™ — $27 digital product
AVATAR: Female nurse, 35–52, works 12-hour shifts (days, nights, rotating).
  Belly fat that won't budge. Has tried keto, IF, cardio. Exhausted. Wears scrubs.
  Blames herself — real cause is chronically elevated cortisol from shift stress.
  Wants: feel like herself again, energy, clothes fitting better, confidence.
  Deepest fear: her body is just broken and nothing will work.

PROOF POINTS: 400+ nurses transformed | 87% feel a difference by Day 3 |
  Average 5 lbs lost in Week 1 | $27 one-time | 60-day money-back guarantee

VOICE: Warm, direct, nurse-to-nurse. Validate first, then educate.
  Never shame. No "just eat less, move more." Specific to shift work.
  Plain English — no jargon. Confident.

PHRASES TO USE: "shift workers" | "your metabolism isn't broken — it's stuck in fight-or-flight" |
  "built by a nurse, for nurses" | "no macros, no punishing cardio, no perfect schedule" |
  "feel the difference by Day 3"

PHRASES TO AVOID: "just" | "lazy" | "discipline" | generic fitness advice
"""


LEAD_MAGNET_PROMPT = """
{brand_context}

---

Create a COMPLETE lead magnet for SmithFit on this topic:

TOPIC: {topic}
WORKING TITLE: {title}
FORMAT: {format}
KEY INSIGHT TO CONVEY: {key_insight}

Produce the full piece in this structure. Write every section completely — no placeholders:

## {title}
*A free guide for nurses who work 12-hour shifts*

---

### WHY THIS IS HAPPENING
[2–3 short paragraphs. Name the root cause in plain language — cortisol, circadian disruption, shift-specific metabolism. Use one analogy. Make her feel understood, not lectured.]

---

### [CORE CONTENT SECTION — title based on format]
[If Checklist: 8–10 specific items, each with a one-line shift-specific explanation]
[If Mini-Guide: 3–4 steps, each with a "shift reality note" — what to do if you just finished nights]
[If Cheat Sheet: 2–3 categories, short bullets, visual-friendly]
[If 3-Day Plan: Day 1 / Day 2 / Day 3 — morning, during-shift, post-shift actions. Max 10 min each.]
[If Tips List: 7–10 tips, each doable without a perfect schedule]

Every item must be:
- Doable on a 12-hour shift day
- Free of generic fitness advice
- Specific to shift work physiology

---

### WHAT TO DO NEXT
[3 short paragraphs. Soft bridge to the $27 program. Do NOT hard sell.
 Frame it as: "These are the first steps. Here's what nurses who go further do next..."
 Include: "400+ nurses | 87% feel a difference by Day 3 | $27 | 60-day guarantee"
 End with: the product link placeholder [PRODUCT_LINK]]

---

### PROOF
[One specific transformation story — 3 sentences: nurse's situation → what changed → specific result.
 Keep it grounded: scrubs fitting, energy on a Tuesday, not dreading the scale.]

---

## EMAIL OPT-IN COPY
**Headline**: [Benefit-driven, nurse-specific]
**Subheadline**: [1 sentence — what they get and why it's different]
**Button text**: [e.g., "Send Me The Cheat Sheet"]
**Confirmation subject line**: [e.g., "Your Cortisol Cheat Sheet is inside ✓"]
**Confirmation preview text**: [1 line]

---

## INSTAGRAM PROMO POST
**Hook** (first frame, stops scroll):
[exact text]

**Caption**:
[Full caption: hook line / 3–4 short paragraphs / soft CTA to opt in / 6 hashtags]
"""


CLIENT_RESOURCE_PROMPT = """
{brand_context}

---

Create a COMPLETE bonus client resource for SmithFit on this topic.
This goes to nurses who have ALREADY purchased the 7-Day Shift-Proof Metabolism Reset™.

TOPIC: {topic}
WORKING TITLE: {title}
FORMAT: {format}
KEY INSIGHT TO CONVEY: {key_insight}

Produce the full piece in this structure. Write every section completely — no placeholders:

## {title}
*A bonus resource for SmithFit clients*

---

### OPENING
[2–3 sentences. Meet her where she is — acknowledge the specific situation this resource addresses.
 Make her feel like you wrote this for exactly the moment she's in. Zero shame.]

---

### [CORE CONTENT SECTION — title based on format]
[If Reset/Recovery: Day 1 / Day 2 / Day 3 back on track — morning / during-shift / post-shift for each]
[If Tips List: 7–10 tips, each with: the habit → why it works for shift workers → the shift hack]
[If Deep-dive: Section 1 root cause (100 words) → Section 2 the 3–5 fixes → Section 3 what to track]
[If Checklist: 8–10 items with shift-specific context for each]

Every item:
- Doable without a perfect schedule
- Specific to shift work physiology
- Builds on (not repeats) the core program

---

### CLOSING
[1 sentence. Reinforce her identity and capability. Grounded, not motivational-poster.
 E.g., "You already know how to push through hard things — your shifts prove it."]

---

## EMAIL WRAPPER
**Subject line options** (3):
1.
2.
3.
**Preview text**: [1 line]
**Email body**:
[4–5 short paragraphs: why you're sending this → what's inside → how to use it →
 one soft ask (reply with a question, share a small win).
 Sign off as a person, not a brand.]

---

## INSTAGRAM STORY FRAMES (3 frames to announce this to clients)
**Frame 1 — Setup/Hook**: [exact text]
**Frame 2 — What it is**: [exact text]
**Frame 3 — How to get it**: [exact text]
"""


def generate_lead_magnet(topic_data: dict) -> str:
    """Generate a complete lead magnet from a researched topic."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    prompt = LEAD_MAGNET_PROMPT.format(
        brand_context=BRAND_CONTEXT,
        topic=topic_data["topic"],
        title=topic_data["title"],
        format=topic_data["format"],
        key_insight=topic_data["key_insight"],
    )

    print(f"  Writing lead magnet: \"{topic_data['title']}\"...")
    message = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


def generate_client_resource(topic_data: dict) -> str:
    """Generate a complete client resource from a researched topic."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    prompt = CLIENT_RESOURCE_PROMPT.format(
        brand_context=BRAND_CONTEXT,
        topic=topic_data["topic"],
        title=topic_data["title"],
        format=topic_data["format"],
        key_insight=topic_data["key_insight"],
    )

    print(f"  Writing client resource: \"{topic_data['title']}\"...")
    message = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text
