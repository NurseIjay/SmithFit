# SmithFit Automated Content Workflow — Setup Guide

This guide walks you through setup once. After that, running the workflow is two commands.

---

## What This Does

**Every week, automatically:**
1. Scans nurse communities on Reddit to find what nurses are talking about right now
2. Identifies the best content angle for prospects (free lead magnet) and clients (bonus resource)
3. Writes both pieces completely — full content, email copy, and Instagram promo
4. Saves them to a review folder
5. You preview and approve each piece, then it sends via Resend to the right audience

---

## One-Time Setup

### Step 1 — Install Python packages

Open Terminal, navigate to this folder, and run:

```
cd /Users/ijsmith/SmithFit/scripts/workflow
pip3 install -r requirements.txt
```

---

### Step 2 — Get your Anthropic API key

1. Go to **https://console.anthropic.com/**
2. Sign in or create an account
3. Click **API Keys** in the left sidebar
4. Click **Create Key**, name it "SmithFit Workflow"
5. Copy the key (starts with `sk-ant-...`) — you only see it once

---

### Step 3 — Get your Resend API key

1. Go to **https://resend.com** and sign up (free tier works)
2. Verify your sending domain (e.g., smithfit.com) under **Domains**
   - If you don't have a domain yet, Resend lets you test with their sandbox
3. Go to **API Keys** → **Create API Key**, name it "SmithFit Workflow"
4. Copy the key (starts with `re_...`)

---

### Step 4 — Create your two audiences in Resend

1. In Resend, go to **Audiences** → **Create Audience**
2. Create: **"SmithFit Prospects"** — copy the ID shown
3. Create: **"SmithFit Clients"** — copy the ID shown

The IDs look like: `b6d24b8e-af0b-4c3c-be8c-de0cdfe9b4b8`

---

### Step 5 — Add contacts to each audience

- **Prospects**: Anyone who opted in for a free lead magnet (not yet a buyer)
- **Clients**: Anyone who purchased the $27 product

You can import a CSV in Resend under each Audience → **Add Contacts**.

---

### Step 6 — Create your .env file

In this folder (`scripts/workflow/`), copy `.env.example` to a new file called `.env`:

```
cp .env.example .env
```

Open `.env` and fill in:
- Your Anthropic API key
- Your Resend API key
- Your FROM email address (must match your verified Resend domain)
- Your two Audience IDs

Example `.env` when filled in:
```
ANTHROPIC_API_KEY=sk-ant-abc123...
RESEND_API_KEY=re_xyz789...
FROM_EMAIL=SmithFit <hello@smithfit.com>
REPLY_TO_EMAIL=hello@smithfit.com
RESEND_PROSPECTS_AUDIENCE_ID=b6d24b8e-af0b-4c3c-be8c-de0cdfe9b4b8
RESEND_CLIENTS_AUDIENCE_ID=c9e35c9f-bg1c-5d4d-cf9d-ef1edgf0c5c9
```

---

## Running the Workflow

### Every Monday (or whenever you want this week's content):

```
cd /Users/ijsmith/SmithFit/scripts/workflow
python3 run_weekly.py
```

This takes about 2–3 minutes. At the end, it prints what was generated and where it's saved.

---

### To review and send (whenever you're ready):

```
cd /Users/ijsmith/SmithFit/scripts/workflow
python3 approve.py
```

This shows you each piece one at a time. For each, you choose:
- **1** → Send now
- **2** → Skip (keep for later)
- **3** → Delete

---

## File Structure

```
scripts/workflow/
  run_weekly.py        ← Run this every week
  approve.py           ← Run this to review and send
  queue/               ← Generated content waiting for approval
  sent/                ← Archive of sent content
  .env                 ← Your private API keys (never share this)
```

---

## Weekly Rhythm

| When | What |
|------|------|
| Monday morning | Run `python3 run_weekly.py` |
| Monday afternoon (or whenever) | Run `python3 approve.py` to review and send |
| Ongoing | Add new prospects to "SmithFit Prospects" audience in Resend; add new buyers to "SmithFit Clients" |

---

## Troubleshooting

**"Missing required environment variables"** — Open `.env` and make sure all 5 values are filled in with no spaces around the `=`.

**"Resend domain not verified"** — You need to add DNS records for your domain in Resend before sending. Resend walks you through it under Domains.

**Content doesn't look right** — You can edit the `.md` file in the `queue/` folder before approving. It's just text.

**Want to re-generate a piece?** — Delete the file from `queue/` and run `run_weekly.py` again, or edit the file directly.

---

## Moving to Fully Automated (when you're ready)

Once you trust the output, you can skip the review step entirely by running the two scripts back-to-back, or set up a Mac scheduled task (launchd) to run `run_weekly.py` automatically every Monday. Ask Claude Code to set that up when you're ready.
