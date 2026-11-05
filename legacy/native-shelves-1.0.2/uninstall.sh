#!/usr/bin/env bash
# Removes this plugin binary only; preserves configuration and all other plugins.
set -euo pipefail
[[ "$EUID" == 0 ]] || { echo 'Run as root inside CT 100.'; exit 1; }
plugin_root="${JELLYFIN_PLUGIN_DIR:-/var/lib/jellyfin/plugins}"
target="$plugin_root/FazFort.Shelves_1.0.2.0"
[[ -d "$target" ]] || { echo 'Plugin directory not found; nothing changed.'; exit 0; }
backup_dir="/var/backups/fazfort-shelves/removed-$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$backup_dir"
was_running=false
if systemctl is-active --quiet jellyfin; then was_running=true; systemctl stop jellyfin; fi
trap 'if [[ "$was_running" == true ]]; then systemctl start jellyfin; fi' EXIT
mv -- "$target" "$backup_dir/plugin"
printf 'Plugin moved outside the load directory to %s. Configuration was preserved.\n' "$backup_dir"
