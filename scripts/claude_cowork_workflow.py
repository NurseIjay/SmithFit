#!/usr/bin/env python3
"""SmithFit Claude + Cowork workflow helper.

Usage
-----
$ python scripts/claude_cowork_workflow.py onboard samples/onboard-input-sarah.json
$ python scripts/claude_cowork_workflow.py progress samples/progress-input-sarah.json

This script runs a LOFI mock of the Claude skill output so you can quickly validate file-based automation.
To go live, implement `claude_call()` in `run_claude_skill()` with your Claude/Cowork API details.
"""

import argparse
import json
import os
from pathlib import Path


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def run_claude_skill(skill_name, skill_input):
    # Production mode: implement actual Claude API call here.
    # Example using Anthropics API is given below in comments.
    # For now this is a local deterministic fallback.

    if skill_name == "onboard-client":
        return {
            "welcome_message": f"{skill_input.get('client_name', 'Client')} — it's not your fault. Small shift-friendly wins matter.",
            "starter_plan": [
                {"day": i + 1, "focus": "shift-friendly habit", "meals": ["simple protein + whole food option"], "movement": "5 minute walk/stair break"}
                for i in range(7)
            ],
            "flags": [skill_input.get("allergies_or_restrictions", "none")],
            "next_steps": ["Assign coach", "Send welcome email", "Schedule 15-min call"],
            "cowork_task": {
                "title": f"Onboard {skill_input.get('client_name', 'Client')}",
                "description": "- [ ] Verify intake\n- [ ] Assign coach\n- [ ] Send onboarding message"
            }
        }

    if skill_name == "progress-summary":
        checkins = skill_input.get("checkins", [])
        wins = []
        concerns = []
        for item in checkins:
            note = item.get("notes", "")
            if "missed" in note.lower():
                concerns.append("Missed check-in or planned nutrition")
            if "energy" in note.lower() or "sleep" in note.lower():
                wins.append("Improved night-shift energy pattern")

        return {
            "summary": "Good work this week — progress is happening with shift-aware tweaks.",
            "wins": wins or ["Consistently logged meals and movement"],
            "concerns": concerns or ["Check fasting and breaks during overtime"],
            "micro_goals": [
                "Pack two quick protein snacks for each shift",
                "Drink 1 bottle water every 4 hours",
                "Journal 1 energy note after each shift"
            ],
            "recommended_actions": [
                "Send 1:1 encouragement message by tomorrow",
                "Schedule call to re-align with night-shift snack plan"
            ],
            "cowork_task": {
                "title": f"Review {skill_input.get('client_name', 'Client')} progress ({skill_input.get('date_range', 'week')})",
                "description": "- [ ] Confirm wins\n- [ ] Note escalations\n- [ ] Send follow-up message"
            }
        }

    raise ValueError(f"Unknown skill: {skill_name}")


def save_output(out_path, payload):
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"Saved: {out_path}")


def main():
    parser = argparse.ArgumentParser(description="Run SmithFit Claude skill workflow sample")
    parser.add_argument("mode", choices=["onboard", "progress"], help="Which workflow to run")
    parser.add_argument("input", help="Input JSON file path")
    parser.add_argument("--out", default=None, help="Output JSON path")
    args = parser.parse_args()

    input_data = load_json(args.input)
    skill_name = "onboard-client" if args.mode == "onboard" else "progress-summary"
    output = run_claude_skill(skill_name, input_data)

    out_path = args.out or f"out-{args.mode}.json"
    save_output(out_path, output)
    print(json.dumps(output, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
