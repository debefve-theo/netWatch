#!/bin/sh
set -eu

APP_IMAGE_INPUT="${1:-${APP_IMAGE:-}}"

if [ -z "$APP_IMAGE_INPUT" ]; then
  echo "APP_IMAGE is required" >&2
  exit 1
fi

export APP_IMAGE="$APP_IMAGE_INPUT"

docker compose pull app
docker compose up -d --no-build
docker compose ps
