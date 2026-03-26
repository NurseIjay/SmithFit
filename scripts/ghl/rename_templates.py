"""
Renames all 25 SmithFit templates in GHL.
Run after create_templates.py if templates show as "New Template".

Usage:
  python3 scripts/ghl/rename_templates.py
"""

import sys, os, json, requests
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

config.validate()

NAMES = [
    "MEM-01: Welcome to SmithFit",
    "MEM-02: Did You Do the Cocktail",
    "MEM-03: One Week In",
    "MEM-04: Two Weeks",
    "MEM-05: One Month In",
    "MEM-06: Day 45 — The Upgrade Email",
    "BNDL-01: Welcome Bundle",
    "BNDL-02: Your Gameplan",
    "BNDL-03: One Week In",
    "BNDL-04: VIP Month Ending",
    "FOMO-A1: One Month In",
    "FOMO-A2: She Lost 31 lbs",
    "FOMO-A3: The Math on Month-to-Month",
    "FOMO-A4: Last Call",
    "FOMO-B1: 45 Days In",
    "FOMO-B2: Coach In Your Pocket",
    "FOMO-B3: Month 3 Is Coming",
    "FOMO-B4: Your 6-Month Commitment Ends",
    "MILE-30: One Month Strong",
    "MILE-60: 60-Day Shifter",
    "MILE-90: 90-Day Identity Shift",
    "MILE-180: Six-Month Transformation",
    "MILE-365: One Full Year",
    "MILE-50WO: 50 Workouts",
    "REF-01: Share SmithFit — Earn Your Membership Free",
    "FOMO-C1: Your 14-Day Free Trial Starts Now",
    "FOMO-C2: Day 3 Check-In",
    "FOMO-C3: Halfway",
    "FOMO-C4: Keep Everything for $2.23/Day",
    "FOMO-C5: She Almost Cancelled on Day 11",
    "FOMO-C6: Your Trial Ends Today",
    "FOMO-C7: You Left. The Door Is Still Open.",
    "CANC-01: Before You Go",
    "CANC-02: The Real Reason Most Nurses Quit",
    "CANC-03: Last Chance — Help You Decide Clearly",
]

def list_templates():
    r = requests.get(
        f"{config.BASE_URL}/emails/builder",
        headers=config.HEADERS,
        params={"locationId": config.GHL_LOCATION_ID, "limit": 100},
        timeout=15,
    )
    return r.json().get("builders", [])

def rename(tid, name):
    # Try PATCH first
    r = requests.patch(
        f"{config.BASE_URL}/emails/builder/{tid}",
        headers=config.HEADERS,
        json={"name": name, "title": name, "locationId": config.GHL_LOCATION_ID},
        timeout=15,
    )
    if r.status_code in (200, 201):
        return r.status_code, "PATCH"
    # Fall back to PUT
    r2 = requests.put(
        f"{config.BASE_URL}/emails/builder/{tid}",
        headers=config.HEADERS,
        json={"name": name, "title": name, "locationId": config.GHL_LOCATION_ID},
        timeout=15,
    )
    return r2.status_code, "PUT"

templates = list_templates()
print(f"Found {len(templates)} templates\n")

# Sort by createdAt so oldest (junk) come first — our 25 are most recent
templates.sort(key=lambda t: t.get("createdAt", ""))
our_25 = templates[-35:]  # most recently created 35

for i, (t, name) in enumerate(zip(our_25, NAMES)):
    tid = t.get("id", t.get("_id", ""))
    status, method = rename(tid, name)
    icon = "✅" if status in (200, 201) else "❌"
    print(f"{icon} [{method} {status}]  {name}  (id={tid})")
