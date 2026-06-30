#!/usr/bin/env sh
# MindBurn — Raspberry Pi 5 entry installer (cert-free one-liner target).
# Served static at /download/pi5.sh. Contains NO secrets.
#
#   curl -fsSL https://<host>/download/pi5.sh | sh -s -- --token <jwt>
set -eu

CLASS="pi5"
# The Pi keeps its isolated bridge. base's parameterized network reads
# NETWORK_NAME, so it MUST be exported here or the Pi attaches to mindburn-net.
NETWORK_NAME="mindburn-pi-net"
TOKEN=""
HOST="${MB_DOWNLOAD_HOST:-https://deepturn.com}"
DEST="${MB_INSTALL_DIR:-$HOME/MindBurner}"

while [ $# -gt 0 ]; do
  case "$1" in
    --token) TOKEN="${2:-}"; shift 2 ;;
    --token=*) TOKEN="${1#*=}"; shift ;;
    --host) HOST="${2:-}"; shift 2 ;;
    --host=*) HOST="${1#*=}"; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

[ -n "$TOKEN" ] || { echo "Missing --token. Copy the command from the Download page while subscribed." >&2; exit 2; }

# ── prerequisites ────────────────────────────────────────────────
ARCH="$(uname -m)"
case "$ARCH" in
  aarch64|arm64) : ;;
  *) echo "This installer is for Raspberry Pi 5 (arm64/aarch64); detected '$ARCH'." >&2; exit 1 ;;
esac
if [ -r /proc/device-tree/model ] && ! grep -qi "raspberry pi 5" /proc/device-tree/model; then
  echo "Warning: this does not look like a Raspberry Pi 5 — continuing anyway." >&2
fi
command -v docker >/dev/null 2>&1 || { echo "Docker is required. Install Docker Engine first." >&2; exit 1; }
docker compose version >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 \
  || { echo "Docker Compose v2 (or docker-compose) is required." >&2; exit 1; }

# ── fetch the entitlement-gated bundle (server re-checks the subscription) ──
mkdir -p "$DEST"
echo "Fetching the MindBurn bundle…"
curl -fsSL -H "Authorization: Bearer $TOKEN" "$HOST/download/bundle/$CLASS.tar.gz" | tar -xz -C "$DEST"
cd "$DEST"

# ── network + bring-up via the DRY base+overlay layout ───────────
export NETWORK_NAME
docker network inspect "$NETWORK_NAME" >/dev/null 2>&1 || docker network create "$NETWORK_NAME" >/dev/null

if [ -x "./scripts/devices/$CLASS/install-$CLASS-device.sh" ]; then
  ./scripts/devices/$CLASS/install-$CLASS-device.sh --token "$TOKEN" --host "$HOST" || true
fi

NETWORK_NAME="$NETWORK_NAME" docker compose -f docker-compose.base.yml -f "docker-compose.$CLASS.yml" up -d
echo "MindBurn is starting. Check status with:  cd $DEST && docker compose ps"
