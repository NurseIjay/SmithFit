"""
SmithFit Workflow Configuration
All settings are loaded from environment variables (.env file).
"""

import os
from dotenv import load_dotenv

load_dotenv()

# --- API Keys ---
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

# --- Email Sender ---
FROM_EMAIL = os.getenv("FROM_EMAIL", "SmithFit <hello@smithfit.online>")
REPLY_TO = os.getenv("REPLY_TO_EMAIL", "hello@smithfit.online")

# --- GoHighLevel ---
GHL_API_KEY     = os.getenv("GHL_API_KEY")
GHL_LOCATION_ID = os.getenv("GHL_LOCATION_ID", "TSWnCFvIE58IDjlDc4Ym")

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QUEUE_DIR = os.path.join(BASE_DIR, "scripts", "workflow", "queue")
SENT_DIR = os.path.join(BASE_DIR, "scripts", "workflow", "sent")

# --- Content Settings ---
CLAUDE_MODEL = "claude-sonnet-4-6"

# Subreddits to scan for trending nurse topics
RESEARCH_SUBREDDITS = ["nursing", "nurses", "NurseLife", "StudentNurse"]

# Number of top posts to pull per subreddit for topic research
POSTS_TO_PULL = 15


def validate():
    """Check that required environment variables are set before running."""
    missing = []
    if not ANTHROPIC_API_KEY:
        missing.append("ANTHROPIC_API_KEY")
    if not RESEND_API_KEY:
        missing.append("RESEND_API_KEY")
    if missing:
        raise EnvironmentError(
            f"\n❌ Missing required environment variables: {', '.join(missing)}\n"
            "   Copy .env.example to .env and fill in your values.\n"
            "   See scripts/workflow/SETUP_GUIDE.md for instructions."
        )
