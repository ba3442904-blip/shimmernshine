#!/usr/bin/env bash
# ESLint check (matches CI: npx eslint . --max-warnings=0)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
npx eslint . --max-warnings=0
