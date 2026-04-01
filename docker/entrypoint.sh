#!/bin/sh
set -eu

if [ "${RUN_DB_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Running Prisma migrations"
  npm run db:migrate
fi

exec "$@"
