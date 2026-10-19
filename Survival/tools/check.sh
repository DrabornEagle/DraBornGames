#!/usr/bin/env bash
# Desktop/CI verification. Run the supplied test scene from Android Editor too.
set -euo pipefail
survival_project_path="$(cd "$(dirname "$0")/.." && pwd)"
survival_godot_bin="${GODOT_BIN:-godot}"
survival_test_data="$(mktemp -d)"
trap 'rm -rf "$survival_test_data"' EXIT
"$survival_godot_bin" --headless --editor --path "$survival_project_path" --import
XDG_DATA_HOME="$survival_test_data" "$survival_godot_bin" --headless --path "$survival_project_path" res://tests/run_all.tscn
