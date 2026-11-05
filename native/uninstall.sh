#!/usr/bin/env bash
set -euo pipefail
[[ "$EUID" == 0 ]] || { echo 'Run as root inside the Jellyfin container.';exit 1; }
target="${JELLYFIN_PLUGIN_DIR:-/var/lib/jellyfin/plugins}/FazFort.Discovery_0.4.0.0"
[[ -d "$target" ]] || { echo 'Companion is not installed.';exit 0; }
backup_dir="${FAZFORT_BACKUP_DIR:-/var/backups/fazfort-discovery}/uninstall-$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$backup_dir"
running=false
if systemctl is-active --quiet jellyfin;then running=true;systemctl stop jellyfin;fi
trap 'if [[ "$running" == true ]];then systemctl start jellyfin;fi' EXIT
mv -- "$target" "$backup_dir/"
echo "Companion removed from plugin loading. Arrival history and preferences were retained. Plugin backup: $backup_dir"
