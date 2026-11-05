#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
dotnet build src/FazFort.Shelves.csproj -c Release --nologo
dotnet run --project tests/Tests.csproj -c Release
stage="$PWD/release/fazfort-shelves"
mkdir -p "$stage/plugin"
cp src/bin/Release/net10.0/FazFort.Shelves.dll src/bin/Release/net10.0/FazFort.Shelves.deps.json "$stage/plugin/"
cp plugin/meta.json "$stage/plugin/"
cp install.sh uninstall.sh deploy-from-proxmox.sh migrate-hss.js "$stage/"
(
  cd "$stage"
  sha256sum plugin/FazFort.Shelves.dll plugin/FazFort.Shelves.deps.json plugin/meta.json > SHA256SUMS
)
tar -czf release/fazfort-shelves-1.0.2.tar.gz -C release fazfort-shelves
printf '%s\n' 'Built release/fazfort-shelves-1.0.2.tar.gz. Nothing has been installed.'
