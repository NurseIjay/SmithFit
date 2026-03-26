"""
SmithFit GHL Contact Enrollment
────────────────────────────────
Add a new buyer or prospect to GHL and start their automation workflow
by applying the correct tag. The tag triggers the workflow automatically.

Usage:
  python3 enroll.py

You'll be asked for:
  - Email address
  - First name (optional)
  - Last name (optional)
  - Purchase type (what they bought)
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config
from contacts import enroll_contact, get_contact_tags


PURCHASE_OPTIONS = {
    "1": ("membership",    "Bought $67/month membership"),
    "2": ("bundle-6mo",    "Bought 6-month bundle ($335)"),
    "3": ("bundle-12mo",   "Bought 12-month bundle ($588)"),
    "4": ("free-trial",    "Started 14-day free trial"),
    "5": ("tripwire-only", "Bought $27 tripwire only (declined upsells)"),
}


def print_banner():
    print("\n" + "═" * 60)
    print("  SMITHFIT — ENROLL A CONTACT IN GHL")
    print("═" * 60 + "\n")


def ask(prompt: str, required: bool = True) -> str:
    while True:
        val = input(f"  {prompt}: ").strip()
        if val or not required:
            return val
        print("  (required — please enter a value)")


def main():
    print_banner()

    try:
        config.validate()
    except EnvironmentError as e:
        print(e)
        sys.exit(1)

    # Collect contact info
    email      = ask("Email address")
    first_name = ask("First name (press Enter to skip)", required=False)
    last_name  = ask("Last name (press Enter to skip)", required=False)

    # Purchase type
    print("\n  What did they purchase?\n")
    for key, (_, label) in PURCHASE_OPTIONS.items():
        print(f"  [{key}] {label}")
    print()

    while True:
        choice = input("  Your choice (1–5): ").strip()
        if choice in PURCHASE_OPTIONS:
            purchase_type, label = PURCHASE_OPTIONS[choice]
            break
        print("  Please enter a number from 1 to 5.")

    # Enroll
    print(f"\n  Enrolling {email} as: {label}...")
    try:
        result = enroll_contact(email, purchase_type, first_name, last_name)
        print(f"\n  ✅  Done!")
        print(f"      Contact ID  : {result['contact_id']}")
        print(f"      Tags applied: {', '.join(result['tags_applied'])}")
        if result["workflows_triggered"]:
            print(f"      Workflows triggered:")
            for wf in result["workflows_triggered"]:
                print(f"        → {wf}")
        else:
            print("      No workflow auto-triggered (tripwire-only — assign campaign manually in GHL)")
    except Exception as e:
        print(f"\n  ❌  Enrollment failed: {e}")
        sys.exit(1)

    print()


if __name__ == "__main__":
    main()
