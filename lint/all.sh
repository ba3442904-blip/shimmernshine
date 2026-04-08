#!/usr/bin/env bash
# Run all CI checks locally (mirrors .github/workflows/ci.yml)
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Lint ==="
bash "$DIR/eslint.sh"

echo ""
echo "=== Type Check ==="
bash "$DIR/typecheck.sh"

echo ""
echo "=== Build ==="
bash "$DIR/build.sh"

echo ""
echo "=== Dependency Audit ==="
bash "$DIR/audit.sh"

echo ""
echo "All checks passed."
