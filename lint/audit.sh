#!/usr/bin/env bash
# Dependency audit (matches CI: npm audit --audit-level=high)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
npm audit --audit-level=high
