"""
GHL Contact Management
Create, find, update contacts and apply tags that trigger automation workflows.
"""

import requests
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import BASE_URL, HEADERS, GHL_LOCATION_ID, WORKFLOW_TRIGGERS


def find_contact(email: str) -> dict | None:
    """Search for an existing contact by email."""
    r = requests.get(
        f"{BASE_URL}/contacts/",
        headers=HEADERS,
        params={"locationId": GHL_LOCATION_ID, "query": email},
    )
    r.raise_for_status()
    contacts = r.json().get("contacts", [])
    for c in contacts:
        if c.get("email", "").lower() == email.lower():
            return c
    return None


def create_contact(email: str, first_name: str = "", last_name: str = "", phone: str = "") -> dict:
    """Create a new contact in GHL."""
    payload = {
        "locationId": GHL_LOCATION_ID,
        "email": email,
        "firstName": first_name,
        "lastName": last_name,
    }
    if phone:
        payload["phone"] = phone

    r = requests.post(f"{BASE_URL}/contacts/", headers=HEADERS, json=payload)
    r.raise_for_status()
    return r.json().get("contact", r.json())


def get_or_create_contact(email: str, first_name: str = "", last_name: str = "", phone: str = "") -> dict:
    """Find existing contact or create a new one."""
    contact = find_contact(email)
    if contact:
        return contact
    return create_contact(email, first_name, last_name, phone)


def add_tags(contact_id: str, tags: list[str]) -> dict:
    """Add one or more tags to a contact. This triggers any GHL workflows listening for those tags."""
    r = requests.post(
        f"{BASE_URL}/contacts/{contact_id}/tags",
        headers=HEADERS,
        json={"tags": tags},
    )
    r.raise_for_status()
    return r.json()


def remove_tags(contact_id: str, tags: list[str]) -> dict:
    """Remove one or more tags from a contact."""
    r = requests.delete(
        f"{BASE_URL}/contacts/{contact_id}/tags",
        headers=HEADERS,
        json={"tags": tags},
    )
    r.raise_for_status()
    return r.json()


def get_contact_tags(contact_id: str) -> list[str]:
    """Get all tags currently on a contact."""
    r = requests.get(f"{BASE_URL}/contacts/{contact_id}", headers=HEADERS)
    r.raise_for_status()
    return r.json().get("contact", {}).get("tags", [])


def enroll_contact(
    email: str,
    purchase_type: str,
    first_name: str = "",
    last_name: str = "",
    phone: str = "",
) -> dict:
    """
    Add a contact to GHL and apply the correct tag to start their automation workflow.

    purchase_type options:
      "membership"    → applies membership-active (starts Workflow 1)
      "bundle-6mo"    → applies bundle-active + 6-month-bundle (starts Workflows 2 + 4)
      "bundle-12mo"   → applies bundle-active + 12-month-bundle (starts Workflow 2)
      "free-trial"    → applies free-trial-active (starts Workflow 5)
      "tripwire-only" → applies new-member (no workflow — manual campaign assignment)
    """
    contact = get_or_create_contact(email, first_name, last_name, phone)
    contact_id = contact["id"]

    tag_map = {
        "membership":    ["membership-active", "new-member"],
        "bundle-6mo":    ["bundle-active", "6-month-bundle", "new-member", "new-bundle"],
        "bundle-12mo":   ["bundle-active", "12-month-bundle", "new-member", "new-bundle"],
        "free-trial":    ["free-trial-active"],
        "tripwire-only": ["new-member"],
    }

    tags = tag_map.get(purchase_type)
    if not tags:
        raise ValueError(
            f"Unknown purchase_type: '{purchase_type}'\n"
            f"Valid options: {list(tag_map.keys())}"
        )

    add_tags(contact_id, tags)

    triggered = [WORKFLOW_TRIGGERS[t] for t in tags if t in WORKFLOW_TRIGGERS]
    return {
        "contact_id": contact_id,
        "email": email,
        "tags_applied": tags,
        "workflows_triggered": triggered,
    }
