#!/usr/bin/env bash
# TypeScript type check (matches CI: npx tsc --noEmit)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
npx tsc --noEmit
