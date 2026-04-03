# SmithFit Claude Code + Cowork Implementation

This doc summarizes the implementation started in the repository and how to run it.

## What is implemented

- Claude skill definitions:
  - `.claude/skills/onboard-client.md`
  - `.claude/skills/progress-summary.md`
  - (existing: `weekly-content.md`, `reel-script.md`, `image-prompts.md`, etc.)
- Cowork task templates:
  - `cowork/templates/onboarding-checklist.md`
  - `cowork/templates/progress-summary-review.md`
- Utility script:
  - `scripts/claude_cowork_workflow.py` (mock runner)
- Input samples:
  - `scripts/samples/onboard-input-sarah.json`
  - `scripts/samples/progress-input-sarah.json`
- Output sample files generated:
  - `scripts/samples/onboard-output-sarah.json`
  - `scripts/samples/progress-output-sarah.json`

## How to run

1. Open terminal in workspace (`/Users/ijsmith/SmithFit`).
2. Run either:

```bash
python3 scripts/claude_cowork_workflow.py onboard scripts/samples/onboard-input-sarah.json --out scripts/samples/onboard-output-sarah.json
python3 scripts/claude_cowork_workflow.py progress scripts/samples/progress-input-sarah.json --out scripts/samples/progress-output-sarah.json
```

3. Review generated JSON in `scripts/samples`

## Next implementation steps

- Replace `run_claude_skill()` placeholder with real Claude API call.
- Add Cowork API integration:
  - Read `cowork/templates/*.md`
  - Generate task payloads
  - Post to Cowork endpoint, e.g. `https://your-cowork-instance/api/tasks`
- Add a scheduler or GitHub Action to run content and task approval weekly.

## Example API hook (Claude + Anthropic)

In `scripts/claude_cowork_workflow.py`, replace the mock with actual call:

```python
def claude_call(prompt, model="claude-3.5-mini", api_key=None):
    import requests
    api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
    r = requests.post(
        "https://api.anthropic.com/v1/complete",
        headers={"x-api-key": api_key, "Content-Type": "application/json"},
        json={"model": model, "prompt": prompt, "max_tokens_to_sample": 900},
    )
    r.raise_for_status()
    return r.json()["completion"]
```

## Manual next step

Open `cowork/templates/onboarding-checklist.md`, copy the text into your Cowork message flow, and run a short manual check: create a task for `Sarah M.` and assign it.
