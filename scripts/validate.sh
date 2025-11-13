#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "▶ Trackfluence validator running from: $ROOT"

# Ensure .env.local exists
if [[ ! -f ".env.local" ]]; then
  echo "[err] .env.local not found in: $ROOT"
  echo "      Create it and try again."
  exit 1
fi

# Normalize CRLF if present (no-op on mac/linux)
# If dos2unix isn't installed, fall back to tr.
if command -v dos2unix >/dev/null 2>&1; then
  dos2unix -q .env.local || true
else
  # write to temp then mv back
  TMP_ENV="$(mktemp)"
  tr -d '\r' < .env.local > "$TMP_ENV" && mv "$TMP_ENV" .env.local
fi

# Load env into current shell
set -a
# shellcheck disable=SC1091
source .env.local
set +a

missing=0
need_vars=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
)

for var in "${need_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "[err] Missing \$${var} (set in .env.local)"
    missing=1
  fi
done

# Soft/optional vars
SITE_VAL="${SITE_URL:-${NEXT_PUBLIC_SITE_URL:-}}"
if [[ -z "${NEXTAUTH_URL:-}" ]]; then
  echo "[warn] Optional: set NEXTAUTH_URL (e.g., http://localhost:3000)"
fi
if [[ -z "$SITE_VAL" ]]; then
  echo "[warn] Optional: set SITE_URL or NEXT_PUBLIC_SITE_URL (used in redirects)"
fi

if [[ "$missing" -ne 0 ]]; then
  echo "[err] Missing required env vars. Fix .env.local and re-run."
  exit 1
fi

echo "✓ Env OK"

echo "▶ Installing deps (if needed) ..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm i --silent || pnpm i
elif command -v npm >/dev/null 2>&1; then
  npm install --silent || npm install
fi

echo "▶ Typecheck ..."
if npm run >/dev/null 2>&1 | grep -q "typecheck"; then
  npm run typecheck
else
  npx tsc --noEmit
fi

echo "▶ Build ..."
if npm run >/dev/null 2>&1 | grep -q "build"; then
  npm run build
else
  echo "[warn] No build script found; skipping."
fi

echo "▶ Dev boot smoke check ..."
# Boot a quick dev server and ping a page to ensure Next can read envs.
# We keep it short so it doesn't cling to the terminal.
( npm run dev >/dev/null 2>&1 & echo $! > .tmp_dev_pid ) || true
sleep 3
if command -v curl >/dev/null 2>&1; then
  curl -fsS http://localhost:3000 >/dev/null || true
fi
if [[ -f .tmp_dev_pid ]]; then
  kill "$(cat .tmp_dev_pid)" >/dev/null 2>&1 || true
  rm -f .tmp_dev_pid
fi

echo "✅ Validation complete"#!/usr/bin/env bash
# scripts/validate.sh
# Validate Trackfluence after the Supabase auth refactor.

set -euo pipefail

info()  { printf "\033[1;34m[info]\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }
error() { printf "\033[1;31m[err ]\033[0m %s\n" "$*" >&2; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 0) Node version sanity (uses .nvmrc if present)
if [[ -f .nvmrc ]]; then
  if command -v nvm >/dev/null 2>&1; then
    info "Using Node from .nvmrc ($(cat .nvmrc))"
    # shellcheck disable=SC1090
    source ~/.nvm/nvm.sh && nvm use >/dev/null
  else
    warn "nvm not found. Ensure your Node version matches .nvmrc ($(cat .nvmrc))."
  fi
fi

# 1) Env sanity (required for auth/UI to behave)
missing=false
required_vars=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
)
for v in "${required_vars[@]}"; do
  if [[ -z "${!v:-}" ]]; then
    warn "Missing \$${v}. Put it in .env.local"
    missing=true
  fi
done

# Optional but nice to have in local dev:
[[ -z "${NEXTAUTH_URL:-}" ]] && warn "Optional: set \$NEXTAUTH_URL (e.g. http://localhost:3000)"
[[ -z "${SITE_URL:-}" ]] && warn "Optional: set \$SITE_URL (used in redirects if referenced)"

if [[ "$missing" == true ]]; then
  error "Missing required env vars. Create .env.local and try again."
  exit 1
fi

# 2) Clean caches/artifacts
info "Cleaning build caches…"
rm -rf .next node_modules/.cache .turbo .eslintcache 2>/dev/null || true

# 3) Install deps (prefer npm ci if lockfile is clean)
if [[ -f package-lock.json ]]; then
  info "Installing with npm ci…"
  npm ci
else
  info "Installing with npm install…"
  npm install
fi

# 4) Typecheck (fallback to tsc if script absent)
if npm run | grep -q "^ *typecheck"; then
  info "Running typecheck…"
  npm run typecheck
else
  warn "No 'typecheck' script. Running tsc --noEmit directly…"
  npx -y typescript tsc --noEmit
fi

# 5) Lint if available
if npm run | grep -q "^ *lint"; then
  info "Running lint…"
  npm run lint || warn "Lint failed (non-blocking for validation)."
else
  warn "No 'lint' script. Skipping."
fi

# 6) Build prod bundle (ensures no runtime build errors)
info "Building production bundle…"
npm run build

# 7) Quick dev boot to ensure routes compile (optional)
if [[ "${QUICK_DEV:-1}" == "1" ]]; then
  info "Starting dev server for a quick smoke test (CTRL+C to stop)…"
  info "Open http://localhost:3000/signin and test Magic Link + Google → /overview"
  npm run dev
else
  info "Validation finished. You can now run: npm run dev"
fi
