"""
GHL (GoHighLevel) Configuration
All credentials loaded from the project .env file.
"""

import os
from dotenv import load_dotenv

# Load from the workflow .env (same file, shared credentials)
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "workflow", ".env")
load_dotenv(env_path)

GHL_API_KEY     = os.getenv("GHL_API_KEY")
GHL_LOCATION_ID = os.getenv("GHL_LOCATION_ID")

BASE_URL = "https://services.leadconnectorhq.com"
HEADERS = {
    "Authorization": f"Bearer {GHL_API_KEY}",
    "Version":       "2021-07-28",
    "Content-Type":  "application/json",
}

# ── The 40 tags that should exist in GHL ──────────────────────────
EXPECTED_TAGS = [
    # Purchase & Status
    "membership-active", "bundle-active", "6-month-bundle", "12-month-bundle",
    "free-trial-active", "trial-converted", "trial-cancelled", "new-member", "new-bundle",
    # FOMO Sequences
    "fomo-track-a-active", "fomo-track-b-active", "fomo-track-c-active",
    "fomo-track-a-complete", "fomo-track-b-complete", "fomo-track-c-complete",
    # Coaching & Milestones
    "coach-review", "vip-month-complete", "upgrade-completed", "downgrade-completed",
    # Engagement
    "engagement-active", "engagement-at-risk", "re-engagement-sent",
    # FitMetrics
    "fitmetrics-setup", "first-log-complete", "day-30-progress-sent", "day-60-progress-sent",
    # Lifecycle
    "cancellation-requested", "cancellation-salvage-sent", "renewal-reminder-sent",
    "win-request-sent", "referral-prompt-sent", "anniversary-sent",
    # Launch
    "waitlist-active", "launch-email-sent",
]

# ── The 5 workflow triggers (tag → workflow name) ─────────────────
WORKFLOW_TRIGGERS = {
    "membership-active":   "Workflow 1: Membership Day 1 Onboarding",
    "bundle-active":       "Workflow 2: Bundle Onboarding",
    "fomo-track-a-active": "Workflow 3: FOMO Track A (Monthly → Bundle)",
    "6-month-bundle":      "Workflow 4: FOMO Track B (6-Month → 12-Month)",
    "free-trial-active":   "Workflow 5: FOMO Track C (Free Trial → Paid)",
}

def validate():
    missing = []
    if not GHL_API_KEY:
        missing.append("GHL_API_KEY")
    if not GHL_LOCATION_ID:
        missing.append("GHL_LOCATION_ID")
    if missing:
        raise EnvironmentError(
            f"\n❌ Missing GHL credentials: {', '.join(missing)}\n"
            "   Add them to scripts/workflow/.env — see .env.example for format.\n"
        )
