"""
Email Delivery Module
Converts generated markdown content into HTML emails and sends
them to the correct contact list (Prospects or Clients).

Contact lists are plain text files — one email address per line:
  scripts/workflow/prospects.txt
  scripts/workflow/clients.txt
"""

import os
import re
import resend
from config import RESEND_API_KEY, FROM_EMAIL, REPLY_TO, BASE_DIR

resend.api_key = RESEND_API_KEY

PROSPECTS_LIST = os.path.join(BASE_DIR, "scripts", "workflow", "prospects.txt")
CLIENTS_LIST = os.path.join(BASE_DIR, "scripts", "workflow", "clients.txt")


# ── HTML Email Template ────────────────────────────────────────────────────────

EMAIL_HTML_WRAPPER = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{subject}</title>
  <style>
    body {{ margin: 0; padding: 0; background: #f7f4f0; font-family: Georgia, serif; }}
    .wrapper {{ max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }}
    .header {{ background: #1a1a2e; padding: 32px 40px; text-align: center; }}
    .header-brand {{ color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 0; }}
    .header-tagline {{ color: #a0a8c8; font-size: 13px; margin: 6px 0 0; }}
    .content {{ padding: 40px 40px 32px; color: #2d2d2d; line-height: 1.7; font-size: 16px; }}
    .content h2 {{ font-size: 24px; color: #1a1a2e; margin: 0 0 20px; line-height: 1.3; }}
    .content h3 {{ font-size: 18px; color: #1a1a2e; margin: 32px 0 12px; border-bottom: 2px solid #f0ebe4; padding-bottom: 8px; }}
    .content p {{ margin: 0 0 16px; }}
    .content ul {{ padding-left: 20px; margin: 0 0 16px; }}
    .content li {{ margin-bottom: 10px; }}
    .content strong {{ color: #1a1a2e; }}
    .highlight-box {{ background: #f7f4f0; border-left: 4px solid #c17b3c; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0; }}
    .highlight-box p {{ margin: 0; font-size: 15px; }}
    .cta-button {{ display: block; width: fit-content; margin: 32px auto; background: #c17b3c; color: #ffffff !important; text-decoration: none; padding: 16px 36px; border-radius: 6px; font-size: 16px; font-weight: bold; letter-spacing: 0.5px; text-align: center; }}
    .proof-bar {{ background: #f0ebe4; padding: 20px 40px; text-align: center; }}
    .proof-bar p {{ margin: 0; font-size: 13px; color: #888; }}
    .footer {{ padding: 24px 40px; background: #f7f4f0; text-align: center; font-size: 12px; color: #999; }}
    @media (max-width: 640px) {{
      .content {{ padding: 28px 24px; }}
    }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="header-brand">SMITHFIT</p>
      <p class="header-tagline">Built by a nurse, for nurses</p>
    </div>
    <div class="content">
      {body_html}
    </div>
    <div class="proof-bar">
      <p>400+ nurses transformed &nbsp;|&nbsp; 87% feel it by Day 3 &nbsp;|&nbsp; Avg 5 lbs Week 1</p>
    </div>
    <div class="footer">
      <p>You're receiving this because you're part of the SmithFit community.</p>
    </div>
  </div>
</body>
</html>"""


# ── Contact List Helpers ──────────────────────────────────────────────────────

def load_contacts(filepath: str) -> list[str]:
    """Load email addresses from a plain text file (one per line)."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        lines = f.read().splitlines()
    return [line.strip() for line in lines if line.strip() and "@" in line]


# ── Markdown → HTML Converter ─────────────────────────────────────────────────

def markdown_to_html(md: str) -> str:
    """Convert simple markdown to email-safe HTML."""
    lines = md.split("\n")
    html_lines = []
    in_ul = False

    for line in lines:
        stripped = line.strip()

        if in_ul and not stripped.startswith(("- ", "* ")):
            html_lines.append("</ul>")
            in_ul = False

        if not stripped:
            html_lines.append("")
        elif stripped.startswith("## "):
            html_lines.append(f"<h2>{stripped[3:]}</h2>")
        elif stripped.startswith("### "):
            html_lines.append(f"<h3>{stripped[4:]}</h3>")
        elif stripped.startswith("#### "):
            html_lines.append(f"<h4>{stripped[5:]}</h4>")
        elif stripped.startswith(("- ", "* ")):
            if not in_ul:
                html_lines.append("<ul>")
                in_ul = True
            item = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", stripped[2:])
            html_lines.append(f"  <li>{item}</li>")
        elif stripped.startswith("> "):
            content = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", stripped[2:])
            html_lines.append(f'<div class="highlight-box"><p>{content}</p></div>')
        else:
            text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", stripped)
            text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
            html_lines.append(f"<p>{text}</p>")

    if in_ul:
        html_lines.append("</ul>")

    return "\n".join(html_lines)


# ── Content Extraction ────────────────────────────────────────────────────────

def extract_email_wrapper(content: str) -> tuple[str, str, str]:
    """Extract subject, preview text, and email body from generated content."""
    wrapper_match = re.search(
        r"## EMAIL WRAPPER\n(.+?)(?=\n## |\Z)", content, re.DOTALL
    )
    if not wrapper_match:
        title_match = re.search(r"^## (.+)$", content, re.MULTILINE)
        title = title_match.group(1) if title_match else "A resource from SmithFit"
        return title, "Just for you — from SmithFit", content

    wrapper = wrapper_match.group(1)
    subject_match = re.search(r"1\.\s*(.+)", wrapper)
    subject = subject_match.group(1).strip() if subject_match else "From SmithFit"
    preview_match = re.search(r"\*\*Preview text\*\*[:\s]*(.+)", wrapper, re.IGNORECASE)
    preview = preview_match.group(1).strip() if preview_match else ""
    body_match = re.search(r"\*\*Email body\*\*[:\n]+(.+?)(?=\*\*|\Z)", wrapper, re.DOTALL | re.IGNORECASE)
    body = body_match.group(1).strip() if body_match else wrapper
    return subject, preview, body


def extract_main_content(content: str) -> str:
    """Extract the main body (everything before EMAIL WRAPPER section)."""
    parts = re.split(r"\n## EMAIL WRAPPER", content, flags=re.IGNORECASE)
    return parts[0].strip()


# ── Sending ───────────────────────────────────────────────────────────────────

def send_to_list(emails: list[str], subject: str, html: str) -> dict:
    """Send an email to a list of addresses using Resend batch API."""
    if not emails:
        return {"sent": 0, "skipped": "no contacts in list"}

    # Resend batch: send up to 100 at a time
    batch = [
        {
            "from": FROM_EMAIL,
            "to": [email],
            "reply_to": REPLY_TO,
            "subject": subject,
            "html": html,
        }
        for email in emails
    ]

    result = resend.Batch.send(batch)
    return {"sent": len(emails), "result": result}


def build_html(content: str) -> tuple[str, str]:
    """Build the final HTML email and return (subject, html)."""
    subject, preview, body_md = extract_email_wrapper(content)
    main_content = extract_main_content(content)
    full_md = f"{body_md}\n\n---\n\n{main_content}"
    body_html = markdown_to_html(full_md)
    html = EMAIL_HTML_WRAPPER.format(subject=subject, body_html=body_html)
    return subject, html


def deliver_lead_magnet(content: str) -> dict:
    """Send a lead magnet to all prospects."""
    emails = load_contacts(PROSPECTS_LIST)
    if not emails:
        raise ValueError(
            "No prospects found. Add email addresses to scripts/workflow/prospects.txt (one per line)."
        )
    subject, html = build_html(content)
    print(f"  Sending to {len(emails)} prospect(s): \"{subject}\"")
    return send_to_list(emails, subject, html)


def deliver_client_resource(content: str) -> dict:
    """Send a client resource to all clients."""
    emails = load_contacts(CLIENTS_LIST)
    if not emails:
        raise ValueError(
            "No clients found. Add email addresses to scripts/workflow/clients.txt (one per line)."
        )
    subject, html = build_html(content)
    print(f"  Sending to {len(emails)} client(s): \"{subject}\"")
    return send_to_list(emails, subject, html)
