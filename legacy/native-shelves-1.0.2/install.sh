#!/usr/bin/env bash
# Run inside Jellyfin CT 100, not on the Proxmox host.
set -Eeuo pipefail
trap 'code=$?; printf "Installer failed at line %s (exit %s).\n" "$LINENO" "$code" >&2' ERR
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
plugin_root="${JELLYFIN_PLUGIN_DIR:-/var/lib/jellyfin/plugins}"
target="$plugin_root/FazFort.Shelves_1.0.2.0"
legacy_targets=("$plugin_root/FazFort.Shelves_1.0.0.0" "$plugin_root/FazFort.Shelves_1.0.1.0")
mode="${1:---check}"
[[ "$mode" == --check || "$mode" == --install ]] || { echo 'Usage: bash install.sh [--check|--install]'; exit 2; }
[[ -d "$plugin_root" ]] || { echo "Missing plugin directory: $plugin_root. Set JELLYFIN_PLUGIN_DIR if customized."; exit 1; }
command -v systemctl >/dev/null
systemctl cat jellyfin >/dev/null
service_user=$(systemctl show jellyfin --property=User --value)
[[ -n "$service_user" ]] || { echo 'Could not determine Jellyfin service user; no files changed.' >&2; exit 1; }
service_group=$(systemctl show jellyfin --property=Group --value)
if [[ -z "$service_group" ]]; then service_group=$(id -gn "$service_user"); fi
id "$service_user" >/dev/null
# Read the Debian package version without launching the Jellyfin server executable.
if ! server_version=$(dpkg-query -W -f='${Version}' jellyfin-server 2>&1); then
 echo "Could not read the installed jellyfin-server package version: $server_version" >&2
 exit 1
fi
printf 'Detected jellyfin-server package: %s\n' "$server_version"
[[ "$server_version" =~ (^|[^0-9])12\.4(\.0)?([^0-9]|$) ]] || { echo "This build targets Jellyfin 12.4.0. Detected: $server_version"; exit 1; }
find "$plugin_root" -type f -name Jellyfin.Plugin.HomeScreenSections.dll -print -quit | read -r _ || { echo 'Home Screen Sections DLL not found. Install HSS 3.0.4.0 first.'; exit 1; }
sha256sum -c SHA256SUMS
printf 'Preflight passed. Install target: %s\n' "$target"
if [[ "$mode" == --check ]]; then echo 'No changes made. Use --install to install and briefly restart Jellyfin.'; exit 0; fi
[[ "$EUID" == 0 ]] || { echo 'Run installation as root inside CT 100.'; exit 1; }
# Refuse side-by-side copies of our assembly; Jellyfin must load only one version.
while IFS= read -r existing; do
 [[ "$existing" == "$target/FazFort.Shelves.dll" || "$existing" == "${legacy_targets[0]}/FazFort.Shelves.dll" || "$existing" == "${legacy_targets[1]}/FazFort.Shelves.dll" ]] || { echo "Another FazFort build exists at $existing. Remove or move it outside plugins first."; exit 1; }
done < <(find "$plugin_root" -type f -name FazFort.Shelves.dll)
backup_dir="/var/backups/fazfort-shelves/$(date -u +%Y%m%dT%H%M%SZ)-$$"
mkdir -p "$backup_dir"
if [[ -d "$target" ]]; then cp -a "$target" "$backup_dir/plugin"; fi
was_running=false
if systemctl is-active --quiet jellyfin; then was_running=true; systemctl stop jellyfin; fi
success=false
recover() {
 if [[ "$success" != true ]]; then
  rm -rf -- "$target"
  if [[ -d "$backup_dir/plugin" ]]; then cp -a "$backup_dir/plugin" "$target"; fi
  for legacy_target in "${legacy_targets[@]}"; do
   saved="$backup_dir/previous-plugins/$(basename "$legacy_target")"
   if [[ -d "$saved" ]]; then mv -- "$saved" "$legacy_target"; fi
  done
  echo "Installation failed; previous plugin restored. Backup: $backup_dir" >&2
 fi
 if [[ "$was_running" == true ]]; then systemctl start jellyfin; fi
}
trap recover EXIT
mkdir -p "$backup_dir/previous-plugins"
for legacy_target in "${legacy_targets[@]}"; do
 if [[ -d "$legacy_target" ]]; then mv -- "$legacy_target" "$backup_dir/previous-plugins/"; fi
done
install -d -m 0755 "$target"
install -m 0644 plugin/FazFort.Shelves.dll plugin/FazFort.Shelves.deps.json plugin/meta.json "$target/"
# Jellyfin updates meta.json during startup. Its service user must own this
# directory and manifest, not just have read access to the assembly.
chown -R -- "$service_user:$service_group" "$target"
success=true
printf 'Installed. Existing Jellyfin and HSS settings were preserved. Backup: %s\n' "$backup_dir"
echo 'Next: open HSS Section Settings, configure/save the new rows, then reload Home.'
