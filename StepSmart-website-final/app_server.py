#!/usr/bin/env python3
"""Local static dashboard server with a real, background scrape endpoint."""
import json
import mimetypes
import os
import threading
from datetime import timedelta
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
STATE = {"running": False, "last_run": None, "last_success": None, "error": None, "jobs": None, "message": None}
LOCK = threading.Lock()
LOG_PATH = ROOT / "data" / "sync_log.json"

try:
    if not (ROOT / "data" / "linkedin_posts.json").exists():
        raise FileNotFoundError
    records = json.loads(LOG_PATH.read_text(encoding="utf-8"))
    latest = records[0] if records else None
    if latest and latest.get("status") == "SUCCESS":
        STATE["last_success"] = latest.get("timestamp")
        STATE["jobs"] = latest.get("total_jobs")
        STATE["message"] = latest.get("message")
    elif latest and latest.get("status") == "ERROR":
        STATE["error"] = latest.get("message")
except (OSError, ValueError, TypeError):
    pass

def run_sync():
    try:
        from apify_scraper import load_env_file
        load_env_file()
        brave_key = os.getenv("BRAVE_SEARCH_API_KEY", "").strip()
        if brave_key and "your_brave_search_api_key" not in brave_key.lower():
            from brave_discovery import discover_candidates
            new_candidates, total_candidates = discover_candidates()
            jobs = []
            message = f"Brave Search discovered {new_candidates} new URL candidate(s); {total_candidates} awaiting human review."
        else:
            try:
                jobs = json.loads((ROOT / "data" / "linkedin_posts.json").read_text(encoding="utf-8"))
            except (OSError, ValueError):
                jobs = []
            message = f"Showing {len(jobs)} saved job record(s); no Apify search was started."
        STATE.update(last_success=datetime.now(timezone.utc).isoformat(), jobs=len(jobs), error=None, message=message)
        records = []
        try:
            records = json.loads(LOG_PATH.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            pass
        records.insert(0, {"timestamp": STATE["last_success"], "status": "SUCCESS", "total_jobs": len(jobs), "message": message})
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        LOG_PATH.write_text(json.dumps(records[:50], indent=2), encoding="utf-8")
    except Exception as exc:
        STATE["error"] = str(exc)
        records = []
        try:
            records = json.loads(LOG_PATH.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            pass
        records.insert(0, {"timestamp": datetime.now(timezone.utc).isoformat(), "status": "ERROR", "total_jobs": 0, "message": str(exc)})
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        LOG_PATH.write_text(json.dumps(records[:50], indent=2), encoding="utf-8")
    finally:
        STATE["running"] = False

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_HEAD(self):
        self.send_error(405)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/candidates":
            try:
                candidates = json.loads((ROOT / "data" / "linkedin_candidates.json").read_text(encoding="utf-8"))
            except (OSError, ValueError):
                candidates = []
            self.send_json(200, candidates)
            return
        if path == "/api/jobspy_status":
            jobspy_jobs = 0
            try:
                jobs_data = json.loads((ROOT / "data" / "jobs.json").read_text(encoding="utf-8"))
                jobspy_jobs = len(jobs_data)
            except Exception:
                pass
            self.send_json(200, {
                "status": "ACTIVE",
                "jobs": jobspy_jobs,
                "message": f"Daily Automated Scraper Active ({jobspy_jobs} live jobs)"
            })
            return

        if path == "/api/status":
            if not STATE["running"] and (ROOT / "data" / "linkedin_posts.json").exists():
                try:
                    records = json.loads(LOG_PATH.read_text(encoding="utf-8"))
                    latest = records[0] if records else None
                    if latest and latest.get("status") == "SUCCESS":
                        STATE.update(last_success=latest.get("timestamp"), jobs=latest.get("total_jobs"), error=None, message=latest.get("message"))
                    elif latest and latest.get("status") == "ERROR":
                        STATE["error"] = latest.get("message")
                except (OSError, ValueError, TypeError):
                    pass
            self.send_json(200, STATE)
            return

        rel_path = "index.html" if path in ["/", "/index.html"] else path.lstrip("/")
        file_path = (ROOT / rel_path).resolve()
        
        # Security check: ensure path stays within ROOT
        try:
            file_path.relative_to(ROOT)
        except ValueError:
            self.send_error(403)
            return

        if not file_path.is_file():
            self.send_error(404)
            return

        body = file_path.read_bytes()
        mime, _ = mimetypes.guess_type(str(file_path))
        self.send_response(200)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/review":
            origin = self.headers.get("Origin")
            if origin and urlparse(origin).netloc != self.headers.get("Host"):
                self.send_json(403, {"error": "Cross-origin review is not allowed"})
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if length < 1 or length > 30000:
                    raise ValueError("Invalid request size")
                payload = json.loads(self.rfile.read(length))
                candidate_id = str(payload.get("job_id", ""))
                action = str(payload.get("action", ""))
                if action not in {"verify", "dismiss"}:
                    raise ValueError("Unknown review action")
                candidates_path = ROOT / "data" / "linkedin_candidates.json"
                candidates = json.loads(candidates_path.read_text(encoding="utf-8"))
                candidate = next((c for c in candidates if c.get("job_id") == candidate_id), None)
                if not candidate:
                    self.send_json(404, {"error": "Candidate not found"})
                    return
                if action == "dismiss":
                    candidate["review_status"] = "dismissed"
                else:
                    body = str(payload.get("post_text", "")).strip()
                    posted = str(payload.get("posted_at", "")).strip()
                    role_title = str(payload.get("role_title", "")).strip()
                    company = str(payload.get("company", "")).strip()
                    location = str(payload.get("location", "")).strip() or "Not specified"
                    if len(body) < 20:
                        raise ValueError("Paste the original LinkedIn post description (at least 20 characters).")
                    if not role_title or not company:
                        raise ValueError("Enter the role title and company exactly as stated in the post.")
                    try:
                        posted_dt = datetime.fromisoformat(posted.replace("Z", "+00:00"))
                    except ValueError as exc:
                        raise ValueError("Enter the posting date and time shown on LinkedIn.") from exc
                    posted_dt = posted_dt.replace(tzinfo=timezone.utc) if posted_dt.tzinfo is None else posted_dt.astimezone(timezone.utc)
                    now = datetime.now(timezone.utc)
                    if posted_dt < now - timedelta(days=7) or posted_dt > now + timedelta(minutes=5):
                        raise ValueError("Only posts dated within the last seven days can be verified into the fresh feed.")
                    candidate.update(review_status="verified", posted_at=posted_dt.isoformat(), job_description=body,
                                     role_title=role_title, company=company, location=location,
                                     original_post_body_available=True, reviewed_at=now.isoformat(), source="brave_search_manual_verification")
                    existing_path = ROOT / "data" / "linkedin_posts.json"
                    try:
                        posts = json.loads(existing_path.read_text(encoding="utf-8"))
                    except (OSError, ValueError):
                        posts = []
                    if not any(p.get("post_url", "").split("?", 1)[0].rstrip("/") == candidate["post_url"] for p in posts):
                        posts.append({
                            "job_id": candidate_id, "post_url": candidate["post_url"], "job_description": body,
                            "text": body, "company": company, "role_title": role_title,
                            "seniority": role_title, "seniority_fit": "0-2y", "location": location,
                            "posted_at": posted_dt.isoformat(), "date_posted": posted_dt.date().isoformat(),
                            "age_days": max(0, (now - posted_dt).total_seconds() / 86400), "cached_result": False,
                            "original_post_body_available": True, "source": candidate["source"],
                            "review_status": "manually_verified", "author_name": "See LinkedIn post",
                            "author_title": "Source post manually checked", "apply_link": candidate["post_url"],
                            "quality_score": 60, "scraped_at": now.isoformat()
                        })
                        existing_path.write_text(json.dumps(posts, indent=2, ensure_ascii=False), encoding="utf-8")
                candidates_path.write_text(json.dumps(candidates, indent=2, ensure_ascii=False), encoding="utf-8")
                self.send_json(200, {"ok": True, "review_status": candidate["review_status"]})
            except (ValueError, OSError, TypeError) as exc:
                self.send_json(400, {"error": str(exc)})
            return
        if path != "/api/sync":
            self.send_error(404)
            return
        origin = self.headers.get("Origin")
        if origin and urlparse(origin).netloc != self.headers.get("Host"):
            self.send_json(403, {"error": "Cross-origin sync is not allowed"})
            return
        with LOCK:
            if STATE["running"]:
                self.send_json(409, STATE)
                return
            STATE.update(running=True, error=None, last_run=datetime.now(timezone.utc).isoformat())
        thread = threading.Thread(target=run_sync, daemon=True)
        thread.start()
        self.send_json(202, {"running": True, "message": "Scrape started"})

if __name__ == "__main__":
    print("Dashboard: http://127.0.0.1:3000")
    ThreadingHTTPServer(("127.0.0.1", int(os.getenv("PORT", "3000"))), Handler).serve_forever()
