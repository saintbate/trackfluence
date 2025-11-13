#!/usr/bin/env bash
set -euo pipefail

# REQUIREMENTS:
#  - supabase CLI:  npm i -g supabase
#  - logged in:     supabase login       (or export SUPABASE_ACCESS_TOKEN)
#  - linked:        supabase link --project-ref zqmzwiuuplfshcstyfrt

echo "Generating TypeScript types for schema 'public'..."
supabase gen types typescript \
  --project-id "zqmzwiuuplfshcstyfrt" \
  --schema public > ./lib/types.ts

echo "✔ Wrote lib/types.ts"

