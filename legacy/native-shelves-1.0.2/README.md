# Existing native FazFort Shelves 1.0.2 source

This is the existing native Jellyfin/HSS extension retained for maintenance. It is separate from the new browser discovery feed. **Do not reinstall it for the Discovery 0.2.0 update.**

It targets .NET 10 and Jellyfin 12.4.0. Its plugin ID is `278398d1-df9f-46aa-9952-97b45795c957`. HSS 3.0.4 integration uses the public reflection-based registration contract. Existing RulesJson and saved native settings remain independent of the browser feed's profiles.

```sh
dotnet build src/FazFort.Shelves.csproj -c Release
dotnet run --project tests/Tests.csproj -c Release
bash build-package.sh
```

The last command creates `release/fazfort-shelves-1.0.2.tar.gz` within this directory. It does not install it. This archive has the same deploy structure as the earlier native release, including plugin-owned files, checksums and install/rollback scripts.

The provided deploy script targets **Proxmox container 100**. Review that assumption before using it elsewhere. Installation briefly restarts Jellyfin; it backs up replaced plugin folders, preserves existing configuration and assigns the plugin directory to the Jellyfin service account. It does not establish live readiness merely because systemd accepted a start request.

`migrate-hss.js` belongs only to the older 1.0.0 → 1.0.1+ selector-ID migration. Do not rerun it on an already migrated system just to enable the new browser feed.

No compiled DLL, credentials, server backups, user IDs or live configuration are included in this source directory. The source has not changed as part of Discovery 0.2.0.
