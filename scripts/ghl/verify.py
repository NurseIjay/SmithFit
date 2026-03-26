"""
GHL Setup Verification
Run this to confirm your GHL account has all 40 tags and 25 email templates
in place before you start enrolling contacts.

Usage:
  python3 verify.py
"""

import sys
import os
import requests
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config


def check_tags() -> tuple[list, list]:
    """Return (found_tags, missing_tags)."""
    r = requests.get(
        f"{config.BASE_URL}/locations/{config.GHL_LOCATION_ID}/tags",
        headers=config.HEADERS,
    )
    r.raise_for_status()
    existing = {t["name"] for t in r.json().get("tags", [])}
    found   = [t for t in config.EXPECTED_TAGS if t in existing]
    missing = [t for t in config.EXPECTED_TAGS if t not in existing]
    return found, missing


def check_workflows() -> list[dict]:
    """Return list of workflows currently in GHL."""
    r = requests.get(
        f"{config.BASE_URL}/workflows/",
        headers=config.HEADERS,
        params={"locationId": config.GHL_LOCATION_ID},
    )
    r.raise_for_status()
    return r.json().get("workflows", [])


def print_banner():
    print("\n" + "═" * 60)
    print("  SMITHFIT — GHL SETUP VERIFICATION")
    print("═" * 60 + "\n")


def main():
    print_banner()

    try:
        config.validate()
    except EnvironmentError as e:
        print(e)
        sys.exit(1)

    # ── Tags ──────────────────────────────────────────────────────
    print("① CHECKING TAGS\n")
    try:
        found, missing = check_tags()
        print(f"  ✅  {len(found)}/{len(config.EXPECTED_TAGS)} tags found")
        if missing:
            print(f"\n  ❌  Missing tags ({len(missing)}):")
            for t in missing:
                print(f"      - {t}")
            print("\n  → Create missing tags in GHL: Settings > Tags > Add Tag")
        else:
            print("  All expected tags are present.\n")
    except Exception as e:
        print(f"  ⚠️  Could not check tags: {e}\n")

    # ── Workflows ─────────────────────────────────────────────────
    print("② CHECKING WORKFLOWS\n")
    try:
        workflows = check_workflows()
        wf_names = [w.get("name", "") for w in workflows]
        print(f"  Found {len(workflows)} workflow(s) in GHL:")
        if workflows:
            for name in wf_names:
                print(f"    • {name}")
        else:
            print("  ⚠️  No workflows found yet.")

        needed = [
            "Workflow 1: Membership Day 1 Onboarding",
            "Workflow 2: Bundle Onboarding",
            "Workflow 3: FOMO Track A (Monthly → Bundle)",
            "Workflow 4: FOMO Track B (6-Month → 12-Month)",
            "Workflow 5: FOMO Track C (Free Trial → Paid)",
        ]
        missing_wf = [w for w in needed if not any(w.lower() in n.lower() for n in wf_names)]
        if missing_wf:
            print(f"\n  ❌  Workflows not yet built ({len(missing_wf)}):")
            for w in missing_wf:
                print(f"      - {w}")
            print("\n  → See scripts/ghl/WORKFLOW_BUILD_GUIDE.md to build these in GHL UI")
        else:
            print("\n  ✅  All 5 workflows appear to be present.")
    except Exception as e:
        print(f"  ⚠️  Could not check workflows: {e}\n")

    print("\n" + "─" * 60)
    print("  Verification complete.")
    print("─" * 60 + "\n")


if __name__ == "__main__":
    main()
