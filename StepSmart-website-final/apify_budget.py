"""Conservative local guard for Apify usage on the $5 monthly free allowance.

This is a run-count safety cap, not a billing meter: actual Apify charges must
still be checked in the Apify console because actor compute and other usage vary.
"""
import fcntl
import json
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LEDGER = ROOT / "data" / "apify_budget.json"
LOCKFILE = ROOT / "data" / "apify_budget.lock"


def reserve_apify_run():
    """Reserve one run if both the monthly cap and minimum spacing allow it."""
    cap = max(1, int(os.getenv("APIFY_MAX_RUNS_PER_MONTH", "8")))
    min_hours = max(1, int(os.getenv("APIFY_MIN_INTERVAL_HOURS", "72")))
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(days=30)
    LEDGER.parent.mkdir(parents=True, exist_ok=True)

    with LOCKFILE.open("a+", encoding="utf-8") as lock:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        try:
            try:
                state = json.loads(LEDGER.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                state = {"runs": []}
            runs = []
            for timestamp in state.get("runs", []):
                try:
                    run_time = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
                    if run_time >= window_start:
                        runs.append(run_time.isoformat())
                except (AttributeError, TypeError, ValueError):
                    continue
            if len(runs) >= cap:
                return False, f"Apify safety cap reached ({cap} runs in the last 30 days); cache retained."
            if runs:
                try:
                    last_run = datetime.fromisoformat(runs[-1].replace("Z", "+00:00"))
                    if now - last_run < timedelta(hours=min_hours):
                        next_at = last_run + timedelta(hours=min_hours)
                        return False, f"Apify cooldown active until {next_at.isoformat()}; cache retained."
                except (TypeError, ValueError):
                    pass
            runs.append(now.isoformat())
            tmp = LEDGER.with_suffix(".tmp")
            tmp.write_text(json.dumps({"month": month_key, "runs": runs}, indent=2), encoding="utf-8")
            tmp.replace(LEDGER)
            return True, f"Reserved Apify run {len(runs)}/{cap} in the last 30 days."
        finally:
            fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
