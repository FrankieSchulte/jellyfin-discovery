// Run once in the Jellyfin browser console as administrator AFTER installing 1.0.1.
// Migrates custom shelf IDs and locks these rows to the server-managed selection.
(async () => {
  const pluginId = "b8298e01-2697-407a-b44d-aa8dc795e850";
  const mapping = {
  "9792073d-5c64-2b83-a1ba-11cba4f6662e": "a792073d-5c64-2b83-a1ba-11cba4f6662e",
  "85c0d652-e82a-5b0e-ce05-a77fc6b2fdd4": "a5c0d652-e82a-5b0e-ce05-a77fc6b2fdd4",
  "55d73082-f687-3629-27a5-c64b9bfaa7ab": "a5d73082-f687-3629-27a5-c64b9bfaa7ab",
  "1baa9140-cdc1-2739-2aa7-f6c28b93ded0": "abaa9140-cdc1-2739-2aa7-f6c28b93ded0",
  "8e742cca-0deb-a9cc-a201-fa069648220e": "ae742cca-0deb-a9cc-a201-fa069648220e",
  "50494c81-d3c7-e9d0-1922-86b91918add4": "a0494c81-d3c7-e9d0-1922-86b91918add4",
  "14082529-5bff-2e96-275e-413a80884de3": "a4082529-5bff-2e96-275e-413a80884de3",
  "79e9c77c-2585-77db-f909-98a07aa580e0": "a9e9c77c-2585-77db-f909-98a07aa580e0",
  "4e2add47-5e28-78eb-fdaa-3da65ac06c1c": "ae2add47-5e28-78eb-fdaa-3da65ac06c1c",
  "08467483-2937-fb2e-9ccc-5d57ad8bd6ba": "a8467483-2937-fb2e-9ccc-5d57ad8bd6ba",
  "71cc5c1b-4481-c3b9-b19d-785091060fe7": "a1cc5c1b-4481-c3b9-b19d-785091060fe7",
  "843dd145-5214-bf55-5ac1-eac9e62b8102": "a43dd145-5214-bf55-5ac1-eac9e62b8102"
};
  const customIds = new Set(["a01c72ac-3105-04b5-4374-3d724f785c1c", "f71d2715-56b0-bbbb-75ff-6dd2cdedea09", "9792073d-5c64-2b83-a1ba-11cba4f6662e", "85c0d652-e82a-5b0e-ce05-a77fc6b2fdd4", "55d73082-f687-3629-27a5-c64b9bfaa7ab", "1baa9140-cdc1-2739-2aa7-f6c28b93ded0", "aed58c8d-3d80-8aaf-3e32-3fa1ebd97b8d", "8e742cca-0deb-a9cc-a201-fa069648220e", "50494c81-d3c7-e9d0-1922-86b91918add4", "14082529-5bff-2e96-275e-413a80884de3", "ffaa605e-05b3-1d0c-ac8b-1547419d783e", "d9d8ad8a-d179-106e-27ec-75fde29d5c98", "79e9c77c-2585-77db-f909-98a07aa580e0", "4e2add47-5e28-78eb-fdaa-3da65ac06c1c", "08467483-2937-fb2e-9ccc-5d57ad8bd6ba", "71cc5c1b-4481-c3b9-b19d-785091060fe7", "ca391e1d-46ee-4062-a69c-49a2fb8925eb", "d1207701-ce01-f982-096f-6172eaed28e1", "843dd145-5214-bf55-5ac1-eac9e62b8102", "ed753665-d986-b9c6-3334-2c9b075bf7b7", "b1746d34-260d-de1a-5de4-0f6161230e36"]);
  const config = await ApiClient.getPluginConfiguration(pluginId);
  const registry = await ApiClient.getJSON(ApiClient.getUrl("ModularHomeViews/Sections"));
  const registered = new Set((registry.Items || []).map(s => s.Section));
  if (!Object.values(mapping).every(id => registered.has(id)))
    throw new Error("Corrected shelf IDs are not registered. Check that version 1.0.1.0 is installed before migrating.");
  const original = (config.SectionSettings || []).filter(s => customIds.has(s.SectionId));
  localStorage.setItem("fazfort-shelves-id-backup-v1", JSON.stringify(original));
  const configured = new Set(config.SectionSettings.map(s => s.SectionId));
  let migrated = 0;
  const redundantNewIds = new Set(Object.entries(mapping).filter(([oldId]) => configured.has(oldId)).map(([,newId]) => newId));
  config.SectionSettings = config.SectionSettings.filter(s => !redundantNewIds.has(s.SectionId));
  for (const row of config.SectionSettings) {
    if (mapping[row.SectionId]) { row.SectionId = mapping[row.SectionId]; migrated++; }
    if (customIds.has(row.SectionId) || Object.values(mapping).includes(row.SectionId)) row.AllowUserOverride = false;
  }
  await ApiClient.updatePluginConfiguration(pluginId, config);
  console.log("Migrated " + migrated + " custom row IDs. Built-in rows and shelf rules preserved. Restart Jellyfin, then reload Home.");
})().catch(console.error);
