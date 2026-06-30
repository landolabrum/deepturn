#!/usr/bin/env sh
# MindBurn — x86 Linux entry installer (cert-free one-liner target).
# Served static at /download/x86.sh. Contains NO secrets: the caller passes a
# short-lived entitlement token minted (server-side) only for a subscribed
# customer. The bundle endpoint and registration re-verify that token.
#
#   curl -fsSL https://<host>/download/x86.sh | sh -s -- --token <jwt>
set -eu

CLASS="x86"
NETWORK_NAME="mindburn-net"
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
  x86_64|amd64) : ;;
  *) echo "This installer is for x86_64; detected '$ARCH'. Use the matching device installer." >&2; exit 1 ;;
esac
command -v docker >/dev/null 2>&1 || { echo "Docker is required. Install Docker Engine first." >&2; exit 1; }
docker compose version >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 \
  || { echo "Docker Compose v2 (or docker-compose) is required." >&2; exit 1; }

# ── fetch the entitlement-gated bundle (server re-checks the subscription) ──
mkdir -p "$DEST"
echo "Fetching the MindBurn bundle…"
curl -fsSL -H "Authorization: Bearer $TOKEN" "$HOST/download/bundle/$CLASS.tar.gz" | tar -xz -C "$DEST"
cd "$DEST"

# ── network + bring-up via the DRY base+overlay layout ───────────
docker network inspect "$NETWORK_NAME" >/dev/null 2>&1 || docker network create "$NETWORK_NAME" >/dev/null

# Internal device installer (network/registration/self-updater) ships INSIDE the
# bundle and is reached only post-extraction — it is never exposed publicly.
if [ -x "./scripts/devices/$CLASS/install-$CLASS-device.sh" ]; then
  ./scripts/devices/$CLASS/install-$CLASS-device.sh --token "$TOKEN" --host "$HOST" || true
fi

docker compose -f docker-compose.base.yml -f "docker-compose.$CLASS.yml" up -d
echo "MindBurn is starting. Check status with:  cd $DEST && docker compose ps"
