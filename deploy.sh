#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

LOCK_FILE="$PROJECT_DIR/.deploy.lock"
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE" 2>/dev/null || stat -f %m "$LOCK_FILE") ))
  if [ "$LOCK_AGE" -lt 600 ]; then
    echo "[DEPLOY] Another deploy is running (${LOCK_AGE}s ago), skipping."
    exit 0
  fi
  echo "[DEPLOY] Stale lock detected (${LOCK_AGE}s), removing."
fi
echo $$ > "$LOCK_FILE"

restart_server() {
  echo "[DEPLOY] Restarting server..."
  if command -v pm2 &> /dev/null; then
    pm2 restart my-portfolio || pm2 restart all
  fi
}

trap 'restart_server; rm -f "$LOCK_FILE"' EXIT

LOG_FILE="$PROJECT_DIR/deploy.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=========================================="
echo "[DEPLOY] $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

echo "[1/5] git pull..."
git pull origin main || git pull origin master

echo "[2/5] npm install (if needed)..."
npm install --production=false

echo "[3/5] building to temp dir..."
NEXT_BUILD_DIR=.next-tmp npm run build

echo "[4/5] swapping build output..."
rm -rf .next
mv .next-tmp .next

echo "[5/5] restart handled by EXIT trap"
echo "[DEPLOY] Done at $(date '+%Y-%m-%d %H:%M:%S')"
