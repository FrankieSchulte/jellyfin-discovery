import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const original=await readFile(new URL('../native/install.sh',import.meta.url),'utf8');
async function fixture(health){
  const root=await mkdtemp(path.join(tmpdir(),'faz-installer-'));
  const bin=path.join(root,'bin'), plugins=path.join(root,'plugins'), staging=path.join(root,'stage'),target=path.join(plugins,'FazFort.Discovery_0.3.3.0');
  await Promise.all([mkdir(bin),mkdir(target,{recursive:true}),mkdir(path.join(staging,'plugin'),{recursive:true})]);
  await writeFile(path.join(target,'FazFort.Discovery.dll'),'old-plugin');
  await mkdir(path.join(plugins,'FazFort.Shelves_1.0.2.0'));await writeFile(path.join(plugins,'FazFort.Shelves_1.0.2.0','keep'),'unchanged');
  let sums='';
  for(const name of ['FazFort.Discovery.dll','FazFort.Discovery.deps.json','meta.json']){const content='new-'+name;await writeFile(path.join(staging,'plugin',name),content);sums+=createHash('sha256').update(content).digest('hex')+'  plugin/'+name+'\n';}
  await writeFile(path.join(staging,'SHA256SUMS'),sums);
  const rootGuard='[[ "$EUID" == 0 ]] || { echo \'Run inside the Jellyfin container as root.\'; exit 1; }';
  assert.ok(original.includes(rootGuard));
  // The test runs unprivileged with fake service/package commands and a temporary plugin directory.
  await writeFile(path.join(staging,'install.sh'),original.replace(rootGuard,': # Root guard replaced only in this unprivileged command fixture.'));
  const commands={
    'dpkg-query':'#!/bin/sh\necho 12.4+ubu2404\n',
    systemctl:'#!/bin/sh\ncase "$1" in\nshow) case "$3" in --property=User) id -un;; --property=Group) id -gn;; esac;;\nis-active) test -f "$MOCK_SERVICE";;\nstop) rm -f "$MOCK_SERVICE";;\nstart) touch "$MOCK_SERVICE";;\nesac\n',
    curl:'#!/bin/sh\ntest "$MOCK_HEALTH" = healthy\n',
    sleep:'#!/bin/sh\nexit 0\n',
    chown:'#!/bin/sh\nprintf "%s\\n" "$@" > "$MOCK_CHOWN"\n'
  };
  for(const [name,body] of Object.entries(commands)){await writeFile(path.join(bin,name),body);await chmod(path.join(bin,name),0o755);}
  const service=path.join(root,'active');await writeFile(service,'');
  const env={...process.env,PATH:bin+path.delimiter+process.env.PATH,JELLYFIN_PLUGIN_DIR:plugins,FAZFORT_BACKUP_DIR:path.join(root,'backups'),MOCK_SERVICE:service,MOCK_HEALTH:health,MOCK_CHOWN:path.join(root,'owner')};
  return{root,target,env,run:mode=>spawnSync('bash',[path.join(staging,'install.sh'),mode],{env,encoding:'utf8'}),read:name=>readFile(path.join(root,name),'utf8'),close:()=>rm(root,{recursive:true,force:true})};
}
test('installer preflight preserves files and service state',{skip:process.platform==='win32'},async()=>{
  const f=await fixture('healthy');try{const r=f.run('--check');assert.equal(r.status,0,r.stderr);assert.equal(await readFile(path.join(f.target,'FazFort.Discovery.dll'),'utf8'),'old-plugin');assert.equal(await f.read('active'),'');}finally{await f.close();}
});
test('installer flow applies ownership and preserves other plugins',{skip:process.platform==='win32'},async()=>{
  const f=await fixture('healthy');try{const r=f.run('--install');assert.equal(r.status,0,r.stderr);assert.equal(await readFile(path.join(f.target,'FazFort.Discovery.dll'),'utf8'),'new-FazFort.Discovery.dll');assert.equal(await f.read('plugins/FazFort.Shelves_1.0.2.0/keep'),'unchanged');assert.match(await f.read('owner'),/FazFort.Discovery_0.3.3.0/);assert.equal(await f.read('active'),'');}finally{await f.close();}
});
test('failed readiness rolls companion back and restores the running service',{skip:process.platform==='win32'},async()=>{
  const f=await fixture('unhealthy');try{const r=f.run('--install');assert.equal(r.status,1);assert.equal(await readFile(path.join(f.target,'FazFort.Discovery.dll'),'utf8'),'old-plugin');assert.equal(await f.read('active'),'');assert.match(r.stderr,/previous companion was restored/);}finally{await f.close();}
});
test('standalone shelves blocks consolidation before service changes',{skip:process.platform==='win32'},async()=>{
  const f=await fixture('healthy');try{
    await writeFile(path.join(f.root,'plugins/FazFort.Shelves_1.0.2.0/FazFort.Shelves.dll'),'standalone');
    const r=f.run('--install');assert.equal(r.status,1);assert.match(r.stderr,/Standalone shelves found/);
    assert.equal(await f.read('active'),'');assert.equal(await readFile(path.join(f.target,'FazFort.Discovery.dll'),'utf8'),'old-plugin');
  }finally{await f.close();}
});
test('older discovery build blocks duplicate assemblies before service changes',{skip:process.platform==='win32'},async()=>{
  const f=await fixture('healthy');try{
    const old=path.join(f.root,'plugins/FazFort.Discovery_0.3.0.0');await mkdir(old);await writeFile(path.join(old,'FazFort.Discovery.dll'),'previous');
    const r=f.run('--install');assert.equal(r.status,1);assert.match(r.stdout,/Another companion build exists/);assert.equal(await f.read('active'),'');
  }finally{await f.close();}
});
