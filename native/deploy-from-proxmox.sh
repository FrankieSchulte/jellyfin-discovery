#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
mode="${1:---check}"
[[ "$mode" == --check || "$mode" == --install ]] || { echo 'Usage: bash deploy-from-proxmox.sh [--check|--install]'; exit 2; }
ct="${JELLYFIN_CT_ID:-100}"
pct exec "$ct" -- mkdir -p /root/fazfort-discovery-companion/plugin
for item in install.sh uninstall.sh SHA256SUMS plugin/FazFort.Discovery.dll plugin/FazFort.Discovery.deps.json plugin/meta.json;do
 pct push "$ct" "$PWD/$item" "/root/fazfort-discovery-companion/$item"
done
pct exec "$ct" -- bash /root/fazfort-discovery-companion/install.sh "$mode"
