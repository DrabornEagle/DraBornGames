#!/usr/bin/env bash
# Non-Gradle export: requires matching 4.5.2 templates and configured Android SDK/JDK17.
# On the phone use Godot Android Editor's Export dialog instead of this Linux CLI.
set -euo pipefail
survival_project_path="$(cd "$(dirname "$0")/.." && pwd)"
survival_godot_bin="${GODOT_BIN:-godot}"
mkdir -p "$survival_project_path/builds"
"$survival_godot_bin" --headless --editor --path "$survival_project_path" --import
"$survival_godot_bin" --headless --path "$survival_project_path" --export-debug Android "$survival_project_path/builds/DraBornGames-Survival-v0.1.0-android.apk"
