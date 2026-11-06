import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
const source=await readFile(new URL('../requests/dist/web.js',import.meta.url),'utf8');
function fixture({deny=false,hash='#/home?requesthub=discover'}={}){
 const {document,window}=parseHTML('<html><head></head><body><header><div class="headerTabs"></div></header><div id="indexPage"><div id="native">Native Home</div></div></body></html>');
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollBy=function(){};
 let user='user-one';const listeners=new Map(),writes=[],reads=[];
 const location={hash};
 const item={id:42,type:'tv',title:'Series <script>untrusted</script>',overview:'Description',poster:'https://image.tmdb.org/t/p/w500/cover.jpg',status:0};
 const api={getCurrentUserId:()=>user,serverId:()=> 'server',getUrl:(path,query)=>({path,query}),getJSON:async ({path,query})=>{
  reads.push({path,query});if(deny)throw {status:403};if(path.endsWith('Details'))return {item,seasons:[1,2],canRequest:true};
  if(query.kind==='genres')return {results:[{id:1,name:'Action'}],pages:1};return {results:[item],pages:1,canRequest:true};
 },ajax:async options=>{writes.push(JSON.parse(options.data));return {message:'Submitted for approval'};}};
 const win={ApiClient:api,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 const ctx=vm.createContext({window:win,document,location,URL,URLSearchParams,Element:window.Element,console,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},MutationObserver:class{observe(){}disconnect(){}}});
 vm.runInContext(source,ctx);const settle=async()=>{for(let n=0;n<100;n++)await Promise.resolve();};
 return {document,window,writes,reads,settle,stop:()=>win.JellyfinRequestHub.stop(),navigate(hash){location.hash=hash;listeners.get('hashchange')?.();},logout(){user=null;listeners.get('hashchange')?.();}};
}
test('Request Hub mounts independently, escapes titles and restores native UI',async()=>{
 const f=fixture();await f.settle();assert.ok(f.document.querySelector('.rh-root'));assert.equal(f.document.querySelector('#native').dataset.rhHidden,'true');
 assert.ok(f.document.querySelector('.rh-card strong').textContent.includes('<script>'));assert.equal(f.document.querySelector('.rh-root script'),null);
 assert.ok(f.document.querySelector('[data-rh-link]'));f.navigate('#/home');assert.equal(f.document.querySelector('.rh-root'),null);assert.equal(f.document.querySelector('#native').hasAttribute('data-rh-hidden'),false);f.stop();
});
test('series requests require explicit seasons and a confirmation click',async()=>{
 const f=fixture();await f.settle();f.document.querySelector('.rh-card').click();await f.settle();const dialog=f.document.querySelector('.rh-dialog');assert.ok(dialog);
 const confirm=[...dialog.querySelectorAll('button')].find(b=>b.textContent==='Confirm request');confirm.click();await f.settle();assert.equal(f.writes.length,0);
 const season=dialog.querySelector('input');season.checked=true;season.dispatchEvent(new f.window.Event('change',{bubbles:true}));confirm.click();await f.settle();
 assert.deepEqual(f.writes,[{type:'tv',id:42,seasons:[1]}]);assert.ok(dialog.textContent.includes('Submitted for approval'));f.stop();
});
test('unmapped account errors do not show request controls or credentials',async()=>{
 const f=fixture({deny:true});await f.settle();assert.equal(f.document.querySelector('.rh-card'),null);assert.ok(f.document.querySelector('.rh-root').textContent.includes('account mapping'));assert.equal(f.writes.length,0);f.stop();
});
test('sign-out removes Request Hub and all navigation links',async()=>{
 const f=fixture();await f.settle();f.logout();assert.equal(f.document.querySelector('.rh-root'),null);assert.equal(f.document.querySelector('[data-rh-link]'),null);assert.equal(f.document.querySelector('[data-rh-hidden]'),null);f.stop();
});

test('direct media links open an in-app title dialog without a request side effect',async()=>{
 const f=fixture({hash:'#/home?requesthub=discover&mediaType=tv&mediaId=42'});await f.settle();assert.ok(f.document.querySelector('.rh-dialog'));assert.equal(f.writes.length,0);f.stop();
});

test('SleekFin header proxy receives Discover button before separator and registers toolbar source',async()=>{
 const f=fixture({hash:'#/home?requesthub=discover'});
 const header=f.document.querySelector('header');
 header.className='skinHeader';
 const left=f.document.createElement('div');left.className='headerLeft';header.prepend(left);
 const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
 const homeBtn=f.document.createElement('button');homeBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:home');homeBtn.setAttribute('data-sleekfin-current','true');
 const sep=f.document.createElement('span');sep.setAttribute('data-sleekfin-header-separator','true');
 proxy.append(homeBtn,sep);header.append(proxy);
 f.navigate('#/home?requesthub=discover');await f.settle();
 assert.ok(left.querySelector('[data-rh-source="true"]'));
 const link=proxy.querySelector('[data-rh-link="true"]');
 assert.ok(link);
 assert.equal(link.nextElementSibling,sep);
 assert.equal(link.dataset.sleekfinCurrent,'true');
 assert.equal(homeBtn.dataset.sleekfinCurrent,undefined);
 f.stop();
});
