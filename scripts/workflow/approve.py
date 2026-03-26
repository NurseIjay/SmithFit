"""
SmithFit Content Approval & Delivery
──────────────────────────────────────
Review queued content and send to the right audience when ready.

Usage:
  python approve.py

What it does:
  1. Lists all content waiting in the queue
  2. Shows you a preview of each piece
  3. Asks: approve and send, skip, or delete
  4. On approval: sends via Resend to Prospects or Clients
  5. Moves sent content to the sent/ archive
"""

import os
import sys
import json
import re
import shutil
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import config
from deliver import deliver_lead_magnet, deliver_client_resource


def load_queue() -> list[dict]:
    """Load all pending items from the queue folder."""
    items = []
    for filename in sorted(os.listdir(config.QUEUE_DIR)):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(config.QUEUE_DIR, filename)
        with open(filepath, "r") as f:
            raw = f.read()

        # Parse metadata from HTML comment header
        meta_match = re.search(r"<!--\nMETADATA: (.+?)\n-->", raw, re.DOTALL)
        if not meta_match:
            continue
        try:
            metadata = json.loads(meta_match.group(1))
        except json.JSONDecodeError:
            continue

        # Content is everything after the metadata block
        content = re.sub(r"<!--\nMETADATA: .+?\n-->\n\n", "", raw, flags=re.DOTALL).strip()

        items.append({
            "filename": filename,
            "filepath": filepath,
            "metadata": metadata,
            "content": content,
        })
    return items


def print_banner():
    print("\n" + "═" * 60)
    print("  SMITHFIT CONTENT APPROVAL")
    print("═" * 60 + "\n")


def print_preview(item: dict):
    """Show a readable preview of a queued item."""
    meta = item["metadata"]
    content = item["content"]

    audience_label = "📧 PROSPECTS" if meta["audience"] == "prospects" else "🎁 CLIENTS"
    type_label = "Lead Magnet" if meta["type"] == "lead_magnet" else "Client Resource"

    print("\n" + "─" * 60)
    print(f"  {audience_label}  |  {type_label}")
    print(f"  Title    : {meta['title']}")
    print(f"  Format   : {meta['format']}")
    print(f"  Why now  : {meta['why_now']}")
    print(f"  Generated: {meta['generated_at'][:10]}")
    print("─" * 60)

    # Show first ~600 chars of content as preview
    preview = content[:600].strip()
    if len(content) > 600:
        preview += "\n\n  [... content continues ...]"
    print(f"\n{preview}\n")


def prompt_action(item: dict) -> str:
    """Ask the user what to do with this item. Returns: send / skip / delete."""
    meta = item["metadata"]
    audience = "Prospects" if meta["audience"] == "prospects" else "Clients"

    print(f"\n  What would you like to do with this piece?")
    print(f"  [1] ✅  Send to {audience} now")
    print(f"  [2] ⏭️   Skip for now (keep in queue)")
    print(f"  [3] 🗑️   Delete (don't send)")
    print()

    while True:
        choice = input("  Your choice (1/2/3): ").strip()
        if choice in ("1", "2", "3"):
            return {"1": "send", "2": "skip", "3": "delete"}[choice]
        print("  Please enter 1, 2, or 3.")


def archive_to_sent(item: dict):
    """Move a sent item to the sent/ archive."""
    src = item["filepath"]
    date_str = datetime.now().strftime("%Y-%m-%d")
    dest_name = item["filename"].replace("pending", "sent")
    dest = os.path.join(config.SENT_DIR, dest_name)
    shutil.move(src, dest)
    print(f"  ✓ Archived to sent/")


def main():
    print_banner()

    try:
        config.validate()
    except EnvironmentError as e:
        print(e)
        sys.exit(1)

    items = load_queue()

    if not items:
        print("  No content waiting in the queue.\n")
        print("  Run  python run_weekly.py  to generate this week's content.")
        print()
        return

    print(f"  {len(items)} piece(s) waiting for review.\n")

    sent_count = 0
    skipped_count = 0

    for i, item in enumerate(items, 1):
        meta = item["metadata"]
        print(f"\n  ── ITEM {i} of {len(items)} ──────────────────────────────")
        print_preview(item)

        action = prompt_action(item)

        if action == "send":
            print(f"\n  Sending...")
            try:
                if meta["type"] == "lead_magnet":
                    result = deliver_lead_magnet(item["content"])
                else:
                    result = deliver_client_resource(item["content"])
                print(f"  ✅  Sent successfully!")
                archive_to_sent(item)
                sent_count += 1
            except Exception as e:
                print(f"  ❌  Send failed: {e}")
                print(f"      The file stays in the queue so you can try again.")

        elif action == "delete":
            os.remove(item["filepath"])
            print(f"  🗑️   Deleted.")

        else:
            print(f"  ⏭️   Skipped. Still in queue.")
            skipped_count += 1

    print("\n" + "─" * 60)
    print(f"  Done. Sent: {sent_count}  |  Still in queue: {skipped_count}")
    print("─" * 60 + "\n")


if __name__ == "__main__":
    main()
