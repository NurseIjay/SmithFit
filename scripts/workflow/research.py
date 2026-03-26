"""
Topic Research Module
Pulls trending posts from nurse subreddits, then uses Claude to identify
the 2 best content angles for this week — one for prospects, one for clients.
"""

import requests
import anthropic
from config import ANTHROPIC_API_KEY, RESEARCH_SUBREDDITS, POSTS_TO_PULL

HEADERS = {"User-Agent": "SmithFit-ContentBot/1.0"}


def fetch_reddit_posts(subreddit: str, limit: int = 15) -> list[dict]:
    """Fetch top posts from a subreddit (no auth required)."""
    url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit={limit}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        posts = r.json()["data"]["children"]
        return [
            {
                "title": p["data"]["title"],
                "score": p["data"]["score"],
                "comments": p["data"]["num_comments"],
                "flair": p["data"].get("link_flair_text", ""),
            }
            for p in posts
            if not p["data"]["stickied"]
        ]
    except Exception as e:
        print(f"  ⚠️  Could not fetch r/{subreddit}: {e}")
        return []


def gather_all_posts() -> list[dict]:
    """Pull posts from all configured subreddits."""
    all_posts = []
    print("  Scanning nurse communities for trending topics...")
    for sub in RESEARCH_SUBREDDITS:
        posts = fetch_reddit_posts(sub, POSTS_TO_PULL)
        all_posts.extend(posts)
        print(f"    ✓ r/{sub}: {len(posts)} posts")
    return all_posts


def synthesize_topics(posts: list[dict]) -> dict:
    """
    Feed trending posts to Claude and ask it to identify the best content angles
    for this week — one lead magnet topic for prospects, one resource for clients.
    """
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    post_summary = "\n".join(
        f"- [{p['score']} upvotes, {p['comments']} comments] {p['title']}"
        for p in sorted(posts, key=lambda x: x["score"], reverse=True)[:40]
    )

    prompt = f"""You are a content strategist for SmithFit, a brand that sells a $27 digital product called the "7-Day Shift-Proof Metabolism Reset™" to female nurses aged 35–52 who work 12-hour shifts and struggle with belly fat, exhaustion, and cortisol-driven weight gain.

Here are the currently trending posts from nurse communities on Reddit this week:

{post_summary}

Based on these real conversations nurses are having RIGHT NOW, identify:

1. **LEAD MAGNET TOPIC** (for prospects — nurses who don't yet know SmithFit):
   - A free resource angle that directly addresses a pain they are actively expressing
   - Should naturally lead into the cortisol/metabolism reset concept
   - Must feel timely and specific, not generic

2. **CLIENT RESOURCE TOPIC** (for existing buyers of the 7-Day program):
   - A bonus resource angle that extends the program's value
   - Addresses a specific challenge clients commonly hit in Week 2+ or during tough shift rotations
   - Should reinforce the investment they made

For each, provide:
- **Topic**: One clear sentence describing the content angle
- **Working title**: A compelling title for the piece
- **Why now**: 1–2 sentences on why this is resonating this week specifically
- **Key insight**: The single most important thing this piece needs to convey
- **Format**: Best format (Cheat Sheet / Mini-Guide / 3-Day Plan / Checklist / Tips List)

Respond in this exact JSON structure:
{{
  "lead_magnet": {{
    "topic": "...",
    "title": "...",
    "why_now": "...",
    "key_insight": "...",
    "format": "..."
  }},
  "client_resource": {{
    "topic": "...",
    "title": "...",
    "why_now": "...",
    "key_insight": "...",
    "format": "..."
  }}
}}"""

    print("  Synthesizing topics with Claude...")
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    text = message.content[0].text.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


def research_weekly_topics() -> dict:
    """Main entry point: fetch posts and return synthesized topics."""
    posts = gather_all_posts()
    if not posts:
        print("  ⚠️  No posts fetched. Using Claude's built-in knowledge for topics.")
        return synthesize_topics([])
    return synthesize_topics(posts)
