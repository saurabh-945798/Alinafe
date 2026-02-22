#!/usr/bin/env bash
set -euo pipefail

UPLOADS_DIR="/var/www/Alinafe/backend/uploads"
BACKUP_DIR="/var/backups/alinafe-uploads"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
ARCHIVE_NAME="uploads-${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"

mkdir -p "${BACKUP_DIR}"

if [ ! -d "${UPLOADS_DIR}" ]; then
  echo "[backup] uploads directory not found: ${UPLOADS_DIR}"
  exit 1
fi

tar -czf "${ARCHIVE_PATH}" -C "${UPLOADS_DIR}" .

echo "[backup] created ${ARCHIVE_PATH}"

# keep only latest 7 backups
ls -1t "${BACKUP_DIR}"/uploads-*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm -f

echo "[backup] retention cleanup complete"
