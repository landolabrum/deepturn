#!/usr/bin/env sh
# MindBurn — x86 Linux entry installer (one-liner target; NO secrets inside).
#   curl -fsSL https://deepturn.com/download/x86.sh | sh -s -- --token <jwt>
# Fetches the entitlement-gated bundle, extracts it, and hands off to the
# in-bundle installer (prereqs → enroll → local DB stack → update timer).
set -eu

CLASS="x86"
TOKEN=""
API="${MB_MAIN_API_URL:-https://mb1-orch-1.tiktok.soy}"
DEST="${MB_INSTALL_DIR:-$HOME/MindBurner}"

while [ $# -gt 0 ]; do
  case "$1" in
    --token)   TOKEN="${2:-}"; shift 2 ;;
    --token=*) TOKEN="${1#*=}"; shift ;;
    --api)     API="${2:-}"; shift 2 ;;
    --api=*)   API="${1#*=}"; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done
[ -n "$TOKEN" ] || { echo "Missing --token. Copy the command from the Download page while subscribed." >&2; exit 2; }

case "$(uname -m)" in
  x86_64|amd64) : ;;
  *) echo "This installer is for x86_64; detected '$(uname -m)'. Use the matching installer." >&2; exit 1 ;;
esac

# Download to a file first (headers carry the build ref; never half-extract
# a broken pipe), then extract. The tarball roots under MindBurner/.
TMP="$(mktemp -d "${TMPDIR:-/tmp}/mb-install.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT
echo "Fetching the MindBurn bundle…"
curl -fsSL --retry 3 --retry-delay 3 --retry-all-errors -H "Authorization: Bearer $TOKEN" \
  -o "$TMP/bundle.tgz" -D "$TMP/headers" \
  "$API/download/bundle/$CLASS.tar.gz"
BUILD_REF="$(sed -n 's/^[Xx]-[Mm][Bb]-[Bb]uild-[Rr]ef: *//p' "$TMP/headers" | tr -d '\r\n')"

mkdir -p "$DEST"
tar -xzf "$TMP/bundle.tgz" --strip-components=1 -C "$DEST"

exec sh "$DEST/scripts/devices/shared/customer-install.sh" \
  --class "$CLASS" --token "$TOKEN" --api "$API" --build-ref "$BUILD_REF"
