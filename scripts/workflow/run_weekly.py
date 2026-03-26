"""
SmithFit Weekly Content Workflow
─────────────────────────────────
Run this every week to research, generate, and queue content for review.

Usage:
  python run_weekly.py

What it does:
  1. Scans nurse communities (Reddit) for trending topics this week
  2. Uses Claude to identify the best angles for prospects + clients
  3. Generates a complete lead magnet (for prospects)
  4. Generates a complete client resource (for existing buyers)
  5. Saves both to the queue/ folder for your review
  6. Prints a summary of what was created

After running:
  Run `python approve.py` to review and send the queued content.
"""

import os
import sys
import json
from datetime import datetime

# Allow imports from this directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
from research import research_weekly_topics
from generate import generate_lead_magnet, generate_client_resource


def save_to_queue(content: str, content_type: str, topic_data: dict) -> str:
    """Save generated content to the queue folder and return the file path."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    slug = topic_data["title"].lower()
    slug = "".join(c if c.isalnum() else "-" for c in slug)[:50].strip("-")
    filename = f"{date_str}_{content_type}_{slug}.md"
    filepath = os.path.join(config.QUEUE_DIR, filename)

    # Build the file with metadata header
    metadata = {
        "type": content_type,
        "title": topic_data["title"],
        "topic": topic_data["topic"],
        "format": topic_data["format"],
        "why_now": topic_data["why_now"],
        "generated_at": datetime.now().isoformat(),
        "status": "pending_review",
        "audience": "prospects" if content_type == "lead_magnet" else "clients",
    }

    file_content = f"""<!--
METADATA: {json.dumps(metadata, indent=2)}
-->

{content}
"""
    with open(filepath, "w") as f:
        f.write(file_content)

    return filepath


def print_banner():
    print("\n" + "═" * 60)
    print("  SMITHFIT WEEKLY CONTENT WORKFLOW")
    print("═" * 60)
    print(f"  {datetime.now().strftime('%A, %B %d, %Y')}")
    print("═" * 60 + "\n")


def print_summary(lead_magnet_path: str, client_resource_path: str, topics: dict):
    print("\n" + "─" * 60)
    print("  ✅  CONTENT GENERATED — READY FOR REVIEW")
    print("─" * 60)
    print(f"\n  📧  LEAD MAGNET  (→ Prospects)")
    print(f"      Title : {topics['lead_magnet']['title']}")
    print(f"      Format: {topics['lead_magnet']['format']}")
    print(f"      File  : {os.path.basename(lead_magnet_path)}")
    print(f"\n  🎁  CLIENT RESOURCE  (→ Clients)")
    print(f"      Title : {topics['client_resource']['title']}")
    print(f"      Format: {topics['client_resource']['format']}")
    print(f"      File  : {os.path.basename(client_resource_path)}")
    print(f"\n  📁  Queue folder: scripts/workflow/queue/")
    print(f"\n  ▶   Next step: run  python approve.py  to review and send")
    print("─" * 60 + "\n")


def main():
    print_banner()

    # Validate environment before doing any work
    try:
        config.validate()
    except EnvironmentError as e:
        print(e)
        sys.exit(1)

    # Step 1: Research
    print("① RESEARCHING TRENDING TOPICS\n")
    topics = research_weekly_topics()

    print(f"\n  Lead magnet angle : {topics['lead_magnet']['title']}")
    print(f"  Why now           : {topics['lead_magnet']['why_now']}")
    print(f"\n  Client resource   : {topics['client_resource']['title']}")
    print(f"  Why now           : {topics['client_resource']['why_now']}\n")

    # Step 2: Generate lead magnet
    print("② GENERATING LEAD MAGNET\n")
    lead_magnet_content = generate_lead_magnet(topics["lead_magnet"])
    lead_magnet_path = save_to_queue(lead_magnet_content, "lead_magnet", topics["lead_magnet"])
    print(f"  ✓ Saved to queue\n")

    # Step 3: Generate client resource
    print("③ GENERATING CLIENT RESOURCE\n")
    client_resource_content = generate_client_resource(topics["client_resource"])
    client_resource_path = save_to_queue(client_resource_content, "client_resource", topics["client_resource"])
    print(f"  ✓ Saved to queue\n")

    # Step 4: Summary
    print_summary(lead_magnet_path, client_resource_path, topics)


if __name__ == "__main__":
    main()
