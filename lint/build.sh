#!/usr/bin/env bash
# Next.js build check (matches CI: npx next build)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
npx next build
