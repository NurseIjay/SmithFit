"""
SmithFit GHL Template Cleanup
──────────────────────────────
Deletes duplicate/old templates from GHL, keeping only the 25 official
SmithFit templates (MEM-01 through FOMO-C7).

Usage:
  python3 scripts/ghl/cleanup_templates.py
"""

import sys
import os
import json
import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

config.validate()

# ── The 25 official template names to KEEP ────────────────────────────────────
KEEP_NAMES = {
    "MEM-01: Welcome to SmithFit",
    "MEM-02: Did You Do the Cocktail",
    "MEM-03: Your First Week Check-In",
    "MEM-04: Two Weeks In — Real Talk",
    "MEM-05: 30 Days — What's Possible Next",
    "MEM-06: 45 Days — You've Built Something Real",
    "BNDL-01: Welcome to the Bundle",
    "BNDL-02: Your VIP Roadmap",
    "BNDL-03: Week 1 Check-In",
    "BNDL-04: 28-Day Coach Review",
    "FOMO-A1: One Thing Monthly Members Miss",
    "FOMO-A2: The Math on Your Membership",
    "FOMO-A3: Real Results from Bundle Members",
    "FOMO-A4: Last Chance — Bundle Offer Closing",
    "FOMO-B1: You're 45 Days In — Here's What's Next",
    "FOMO-B2: The Difference One Year Makes",
    "FOMO-B3: A Note from IJ — 100 Days",
    "FOMO-B4: Final Call — Lock In Your Year",
    "FOMO-C1: Your 14-Day Trial Starts Now",
    "FOMO-C2: Day 3 — Are You Feeling It?",
    "FOMO-C3: Halfway — Let's Talk",
    "FOMO-C4: 4 Days Left — Here's What to Do",
    "FOMO-C5: 48 Hours — Don't Let This Slip",
    "FOMO-C6: Last Day — Trial Ends Tonight",
    "FOMO-C7: Your Trial Ended — Come Back",
}


def list_all_templates():
    url = f"{config.BASE_URL}/emails/builder"
    params = {"locationId": config.GHL_LOCATION_ID, "limit": 100}
    resp = requests.get(url, headers=config.HEADERS, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json().get("builders", [])


def delete_template(template_id: str) -> int:
    url = f"{config.BASE_URL}/emails/builder/{template_id}"
    params = {"locationId": config.GHL_LOCATION_ID}
    resp = requests.delete(url, headers=config.HEADERS, params=params, timeout=15)
    return resp.status_code


def main():
    print("\n── FETCHING ALL TEMPLATES ──────────────────────────────────")
    templates = list_all_templates()
    print(f"Found {len(templates)} total templates in GHL")

    to_delete = [t for t in templates if t.get("name", "") not in KEEP_NAMES]
    to_keep   = [t for t in templates if t.get("name", "") in KEEP_NAMES]

    print(f"\nKeeping  : {len(to_keep)} official SmithFit templates")
    print(f"Deleting : {len(to_delete)} duplicates/old templates")

    if not to_delete:
        print("\n✅ Nothing to delete — all clean!")
        return

    print("\n── DELETING DUPLICATES ─────────────────────────────────────")
    deleted = 0
    failed  = 0
    for t in to_delete:
        name = t.get("name", "(unnamed)")
        tid  = t.get("id", t.get("_id", ""))
        status = delete_template(tid)
        if status in (200, 204):
            print(f"  🗑  DELETED  {name}  (id={tid})")
            deleted += 1
        else:
            print(f"  ❌ FAILED ({status})  {name}  (id={tid})")
            failed += 1

    print(f"\nDone. Deleted: {deleted}  |  Failed: {failed}")
    print("\nRemaining templates:")
    for t in to_keep:
        print(f"  ✅  {t.get('name', '(unnamed)')}")


if __name__ == "__main__":
    main()
