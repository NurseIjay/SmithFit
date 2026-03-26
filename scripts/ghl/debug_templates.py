"""
Diagnostic — tests the correct /emails/builder/data endpoint with required fields.
"""
import sys, os, json, requests
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

config.validate()

TEST_HTML = "<html><body><p style='font-size:18px;'>SMITHFIT TEST — if you see this, the update worked!</p></body></html>"

# 1. Get template list
print("\n── FETCHING TEMPLATES ──────────────────────────────────")
url = f"{config.BASE_URL}/emails/builder"
params = {"locationId": config.GHL_LOCATION_ID, "limit": 100}
r = requests.get(url, headers=config.HEADERS, params=params, timeout=15)
builders = r.json().get("builders", [])
target = next((b for b in builders if "MEM-01: Welcome to SmithFit" in b.get("name", "")), builders[0])
tid = target["id"]
print(f"Testing with: {target['name']} (id={tid})")

# 2. POST to /emails/builder/data with correct required fields
print("\n── TEST: POST /emails/builder/data ─────────────────────")
print(f"locationId value: '{config.GHL_LOCATION_ID}'")
payload = {
    "templateId": tid,
    "updatedBy": "SmithFit",
    "editorType": "html",
    "body": TEST_HTML,
    "html": TEST_HTML,
    "locationId": str(config.GHL_LOCATION_ID),
}
print(f"Payload keys: {list(payload.keys())}")
r2 = requests.post(f"{url}/data", headers=config.HEADERS, json=payload, timeout=15)
print(f"Status: {r2.status_code}")
print(json.dumps(r2.json() if r2.content else {}, indent=2)[:1000])
