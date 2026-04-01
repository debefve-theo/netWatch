#!/usr/bin/env python3
"""Run Ookla speedtest, append a CSV backup and push the result to the VPS API."""

from __future__ import annotations

import csv
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict


CONFIG = {
    "API_URL": os.getenv("SPEEDTEST_API_URL", "https://your-vps-domain.com/api/ingest/speedtest"),
    "API_KEY": os.getenv("SPEEDTEST_API_KEY", ""),
    "DEVICE_ID": os.getenv("SPEEDTEST_DEVICE_ID", ""),
    "CSV_PATH": os.getenv("SPEEDTEST_CSV_PATH", str(Path.home() / "speedtest_results.csv")),
    "CLI_BIN": os.getenv("SPEEDTEST_CLI_BIN", "speedtest"),
    "TIMEOUT_SECONDS": int(os.getenv("SPEEDTEST_TIMEOUT_SECONDS", "60")),
    "RETRY_COUNT": int(os.getenv("SPEEDTEST_RETRY_COUNT", "3")),
    "RETRY_DELAY_SECONDS": int(os.getenv("SPEEDTEST_RETRY_DELAY_SECONDS", "10")),
}

CSV_COLUMNS = [
    "deviceId",
    "measuredAt",
    "pingMs",
    "jitterMs",
    "downloadMbps",
    "uploadMbps",
    "packetLoss",
    "isp",
    "externalIp",
    "serverId",
    "serverName",
    "serverLocation",
    "serverCountry",
    "resultUrl",
]


def log(message: str) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[{timestamp}] {message}")


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("\"").strip("'"))


def validate_config() -> None:
    missing = [key for key in ("API_URL", "API_KEY", "DEVICE_ID") if not CONFIG[key]]
    if missing:
        raise RuntimeError(
            f"Missing required configuration values: {', '.join(missing)}. "
            "Set them in the environment or in a local .env file."
        )


def run_speedtest() -> Dict[str, Any]:
    command = [
        CONFIG["CLI_BIN"],
        "--accept-license",
        "--accept-gdpr",
        "-f",
        "json",
    ]
    log(f"Running speedtest command: {' '.join(command)}")
    completed = subprocess.run(
        command,
        check=True,
        capture_output=True,
        text=True,
        timeout=CONFIG["TIMEOUT_SECONDS"],
    )
    return json.loads(completed.stdout)


def bytes_per_second_to_mbps(value: Any) -> float:
    return round((float(value) * 8.0) / 1_000_000.0, 2)


def build_payload(raw: Dict[str, Any]) -> Dict[str, Any]:
    ping = raw.get("ping", {})
    server = raw.get("server", {})
    interface = raw.get("interface", {})
    result = raw.get("result", {})

    measured_at = raw.get("timestamp")
    if not measured_at:
        measured_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    packet_loss = raw.get("packetLoss")
    if packet_loss is None:
        packet_loss = 0

    payload = {
        "deviceId": CONFIG["DEVICE_ID"],
        "measuredAt": measured_at,
        "pingMs": round(float(ping.get("latency", 0)), 2),
        "jitterMs": round(float(ping.get("jitter", 0)), 2),
        "downloadMbps": bytes_per_second_to_mbps(raw.get("download", {}).get("bandwidth", 0)),
        "uploadMbps": bytes_per_second_to_mbps(raw.get("upload", {}).get("bandwidth", 0)),
        "packetLoss": round(float(packet_loss), 2),
        "isp": raw.get("isp"),
        "externalIp": interface.get("externalIp"),
        "serverId": str(server.get("id")) if server.get("id") is not None else None,
        "serverName": server.get("name"),
        "serverLocation": server.get("location"),
        "serverCountry": server.get("country"),
        "resultUrl": result.get("url"),
    }
    return payload


def append_csv(payload: Dict[str, Any]) -> None:
    csv_path = Path(CONFIG["CSV_PATH"]).expanduser()
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    file_exists = csv_path.exists()

    with csv_path.open("a", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_COLUMNS)
        if not file_exists:
            writer.writeheader()
        writer.writerow({key: payload.get(key) for key in CSV_COLUMNS})

    log(f"Stored local CSV backup in {csv_path}")


def post_payload(payload: Dict[str, Any]) -> bool:
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        CONFIG["API_URL"],
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {CONFIG['API_KEY']}",
        },
    )

    for attempt in range(1, CONFIG["RETRY_COUNT"] + 1):
        try:
            with urllib.request.urlopen(request, timeout=CONFIG["TIMEOUT_SECONDS"]) as response:
                body = response.read().decode("utf-8")
                log(f"Upload succeeded on attempt {attempt}: {body}")
                return True
        except urllib.error.HTTPError as error:
            body = error.read().decode("utf-8", errors="replace")
            log(f"Upload failed with HTTP {error.code} on attempt {attempt}: {body}")
            if 400 <= error.code < 500:
                return False
        except urllib.error.URLError as error:
            log(f"Network error on attempt {attempt}: {error}")
        except TimeoutError:
            log(f"Timeout on attempt {attempt}")

        if attempt < CONFIG["RETRY_COUNT"]:
            time.sleep(CONFIG["RETRY_DELAY_SECONDS"] * attempt)

    return False


def main() -> int:
    load_env_file(Path(__file__).with_name(".env"))

    for key in CONFIG:
        if key in os.environ:
            if key in ("TIMEOUT_SECONDS", "RETRY_COUNT", "RETRY_DELAY_SECONDS"):
                CONFIG[key] = int(os.environ[key])
            else:
                CONFIG[key] = os.environ[key]

    validate_config()

    raw_result = run_speedtest()
    payload = build_payload(raw_result)
    append_csv(payload)

    if not post_payload(payload):
        log("Remote API upload failed. Result kept locally in CSV.")
        return 1

    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        log(f"Fatal error: {exc}")
        sys.exit(1)
