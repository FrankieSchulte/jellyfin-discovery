#!/usr/bin/env bash
# Run on FazFort Proxmox host. Explicit --install is required for mutations.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
[[ "${1:-}" == --install ]] || { echo 'Usage on Proxmox host: bash deploy-from-proxmox.sh --install'; exit 2; }
command -v pct >/dev/null || { echo 'Run this on the Proxmox host.'; exit 1; }
pct exec 100 -- mkdir -p /root/fazfort-shelves/plugin
for item in install.sh uninstall.sh SHA256SUMS plugin/FazFort.Shelves.dll plugin/FazFort.Shelves.deps.json plugin/meta.json; do
 pct push 100 "$PWD/$item" "/root/fazfort-shelves/$item"
done
pct exec 100 -- bash /root/fazfort-shelves/install.sh --check
pct exec 100 -- bash /root/fazfort-shelves/install.sh --install
