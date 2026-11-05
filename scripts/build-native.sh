#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
dotnet_cmd="${FAZFORT_DOTNET:-dotnet}"
"$dotnet_cmd" build native/src -c Release --nologo
"$dotnet_cmd" run --project native/tests -c Release
stage="$(mktemp -d)"
trap 'rm -rf -- "$stage"' EXIT
mkdir -p "$stage/fazfort-discovery-companion/plugin" server
cp native/src/bin/Release/net10.0/FazFort.Discovery.dll native/src/bin/Release/net10.0/FazFort.Discovery.deps.json "$stage/fazfort-discovery-companion/plugin/"
cp native/meta.json "$stage/fazfort-discovery-companion/plugin/meta.json"
cp native/install.sh native/uninstall.sh native/deploy-from-proxmox.sh "$stage/fazfort-discovery-companion/"
(
cd "$stage/fazfort-discovery-companion"
sha256sum plugin/* > SHA256SUMS
)
tar -czf server/fazfort-discovery-companion-0.3.0.tar.gz -C "$stage" fazfort-discovery-companion
echo 'Built server/fazfort-discovery-companion-0.3.0.tar.gz. Nothing has been installed.'
