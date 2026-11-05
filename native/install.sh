#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
mode="${1:---check}"
[[ "$mode" == --check || "$mode" == --install ]] || { echo 'Usage: bash install.sh [--check|--install]'; exit 2; }
plugin_root="${JELLYFIN_PLUGIN_DIR:-/var/lib/jellyfin/plugins}"
target="$plugin_root/FazFort.Discovery_0.3.2.0"
[[ -d "$plugin_root" ]] || { echo "Missing Jellyfin plugin directory: $plugin_root"; exit 1; }
version=$(dpkg-query -W -f='${Version}' jellyfin-server)
[[ "$version" =~ (^|[^0-9])12\.4(\.0)?([^0-9]|$) ]] || { echo "This companion targets Jellyfin 12.4.0. Found $version"; exit 1; }
service_user=$(systemctl show jellyfin --property=User --value)
[[ -n "$service_user" ]] || { echo 'Could not determine the Jellyfin service account.'; exit 1; }
service_group=$(systemctl show jellyfin --property=Group --value)
[[ -n "$service_group" ]] || service_group=$(id -gn "$service_user")
command -v curl >/dev/null
sha256sum -c SHA256SUMS
while IFS= read -r existing; do
 [[ "$existing" == "$target/FazFort.Discovery.dll" ]] || { echo "Another companion build exists: $existing. Move it outside plugins before installing."; exit 1; }
done < <(find "$plugin_root" -type f -name FazFort.Discovery.dll)
if find "$plugin_root" -type f -name FazFort.Shelves.dll -print -quit | read -r _; then
 echo 'Standalone shelves found. Export its rules/settings, stop Jellyfin and move its plugin directory outside plugins before installing. See docs/MIGRATION.md.' >&2
 exit 1
fi
echo "Preflight passed. Target: $target"
[[ "$mode" == --install ]] || { echo 'No changes made. Use --install to install and briefly restart Jellyfin.'; exit 0; }
[[ "$EUID" == 0 ]] || { echo 'Run inside the Jellyfin container as root.'; exit 1; }
backup_dir="${FAZFORT_BACKUP_DIR:-/var/backups/fazfort-discovery}/$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$backup_dir"
if [[ -d "$target" ]]; then cp -a "$target" "$backup_dir/plugin"; fi
was_running=false
if systemctl is-active --quiet jellyfin; then was_running=true;systemctl stop jellyfin;fi
success=false
recover(){
 if [[ "$success" != true ]]; then
  systemctl stop jellyfin || true
  rm -rf -- "$target"
  if [[ -d "$backup_dir/plugin" ]];then cp -a "$backup_dir/plugin" "$target";fi
  if [[ "$was_running" == true ]];then systemctl start jellyfin;fi
  echo "Installation did not pass readiness checks; the previous companion was restored. Backup: $backup_dir" >&2
 fi
}
trap recover EXIT
install -d -m 0755 "$target"
install -m 0644 plugin/FazFort.Discovery.dll plugin/FazFort.Discovery.deps.json plugin/meta.json "$target/"
chown -R -- "$service_user:$service_group" "$target"
if [[ "$was_running" == true ]];then
 systemctl start jellyfin
 health="${JELLYFIN_HEALTH_URL:-http://127.0.0.1:8096/health}"
 ready=false
 for attempt in $(seq 1 20);do
  if systemctl is-active --quiet jellyfin && curl --fail --silent --max-time 2 "$health" >/dev/null;then ready=true;break;fi
  sleep 2
 done
 [[ "$ready" == true ]] || { echo 'Jellyfin health check failed. Check JELLYFIN_HEALTH_URL if your local port/base URL is customized.' >&2;exit 1; }
fi
success=true
echo "Companion installed. Existing HSS settings were preserved. Backup: $backup_dir"
echo 'Install the matching browser script, then wait for the initial arrival baseline to finish. It does not badge the existing library.'
