// Visual editing works on a cloned configuration. Nothing persists until Apply.
export function createVisualEditor(host, initial, selectedPage, inventory, changed, {element,button,supplied}) {
  let draft=cloneJson(initial), page=selectedPage||'home', editing=null, explorerKind='director', explorerQuery='', libraryQuery='';
  const anchors={ContinueWatchingNextUp:'Continue Watching / Next Up',RecentlyAddedMovies:'Recently Added in Movies',RecentlyAddedShows:'Recently Added in Shows',DiscoverMovies:'Discover Movies',DiscoverTV:'Discover TV Shows',MyJellyseerrRequests:'My Requests',MyMedia:'My Media'};
  const families={theme:'Rotating theme',genre:'Rotating genre',director:'Directed by…',actor:'Starring…',decade:'Best of a decade',studio:'Studio / network',rating:'Highly rated',rewatch:'Worth another watch',runtime:'Short movies'};
  const emit=()=>changed(cloneJson(draft));
  function field(parent,label,value,save,choices=null,type='text') {
    const wrap=element('label','fx-editor-field',label), control=element(choices?'select':'input');
    control.setAttribute('aria-label',label);
    if(choices){choices.forEach(([v,t])=>{const o=element('option','',t);o.value=v;o.selected=String(value)===v;control.append(o);});}
    else {control.type=type;if(type==='checkbox')control.checked=!!value;else control.value=value??'';}
    control.addEventListener('change',()=>{save(type==='checkbox'?control.checked:control.value);emit();});wrap.append(control);parent.append(wrap);return control;
  }
  const layoutChoices=[['auto','Automatic'],['landscape','Landscape'],['portrait','Portrait']];
  const defaultTypesForPage=p=>p==='shows'?['Series']:p==='movies'?['Movie']:['Movie','Series'];
  const pageItems=()=>{
    const all=inventory?.items||[];
    if(page==='movies')return all.filter(i=>i.Type==='Movie');
    if(page==='shows')return all.filter(i=>i.Type==='Series');
    return all.filter(i=>i.Type==='Movie'||i.Type==='Series');
  };
  function countRuleMatches(rule){
    const items=pageItems();
    if(!items.length)return null;
    try{return items.filter(i=>matchesRule(i,rule,new Date().getMonth()+1)).length;}catch{return null;}
  }
  function slug(prefix,name){
    const clean=String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
    return `${prefix}-${clean||hash(String(name)).toString(16)}`;
  }
  function discoverCandidates(){
    const items=pageItems();
    const minCount=Math.max(1,Math.min(3,Number(draft.minimumItems)||2));
    const mediaWord=page==='movies'?'Movies':page==='shows'?'Shows':'Titles';
    const byDirector=new Map(), byActor=new Map(), byStudio=new Map(), byYear=new Map(), byDecade=new Map(), byGenre=new Map(), byTag=new Map();
    const bump=(map,name)=>{if(!name)return;const k=String(name).trim();if(!k)return;map.set(k,(map.get(k)||0)+1);};
    for(const item of items){
      for(const p of item.People||[]){
        if(p?.Type==='Director')bump(byDirector,p.Name);
        else if(p?.Type==='Actor')bump(byActor,p.Name);
      }
      for(const s of item.Studios||[])bump(byStudio,typeof s==='string'?s:s?.Name);
      for(const g of item.Genres||[])bump(byGenre,g);
      for(const t of item.Tags||[])bump(byTag,t);
      const yr=Number(item.ProductionYear);
      if(yr>=1900&&yr<=2100){
        bump(byYear,String(yr));
        bump(byDecade,String(Math.floor(yr/10)*10));
      }
    }
    const list=[];
    const toSorted=(map,limit=60)=>[...map.entries()].filter(([,c])=>c>=minCount||map.size<=12).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit);
    for(const [name,count] of toSorted(byDirector,60)){
      list.push({
        kind:'director',name,count,
        title:`Directed by ${name}`,
        key:slug('dir',name),
        match:r=>(r.DirectorsAny||[]).some(x=>x.toLowerCase()===name.toLowerCase())&&!(r.ActorsAny?.length)&&!(r.GenresAny?.length),
        create:()=>({Key:slug('dir',name),Title:`Directed by ${name}`,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[],DirectorsAny:[name],Months:[]})
      });
    }
    for(const [name,count] of toSorted(byActor,60)){
      list.push({
        kind:'actor',name,count,
        title:`Starring ${name}`,
        key:slug('cast',name),
        match:r=>(r.ActorsAny||[]).some(x=>x.toLowerCase()===name.toLowerCase())&&!(r.DirectorsAny?.length)&&!(r.GenresAny?.length),
        create:()=>({Key:slug('cast',name),Title:`Starring ${name}`,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[],ActorsAny:[name],Months:[]})
      });
    }
    for(const [name,count] of toSorted(byStudio,50)){
      list.push({
        kind:'studio',name,count,
        title:`From ${name}`,
        key:slug('studio',name),
        match:r=>(r.StudiosAny||[]).some(x=>x.toLowerCase()===name.toLowerCase()),
        create:()=>({Key:slug('studio',name),Title:`From ${name}`,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[],StudiosAny:[name],Months:[]})
      });
    }
    for(const [dec,count] of [...byDecade.entries()].sort((a,b)=>Number(b[0])-Number(a[0]))){
      const d=Number(dec);
      list.push({
        kind:'year',name:`${d}s`,count,
        title:`${mediaWord} from the ${d}s`,
        key:`decade-${d}s`,
        match:r=>r.Years?.[0]===d&&r.Years?.[1]===d+9,
        create:()=>({Key:`decade-${d}s`,Title:`${mediaWord} from the ${d}s`,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[],Years:[d,d+9],Months:[]})
      });
    }
    for(const [yr,count] of [...byYear.entries()].sort((a,b)=>Number(b[0])-Number(a[0])).slice(0,35)){
      const y=Number(yr);
      list.push({
        kind:'year',name:yr,count,
        title:`${mediaWord} from ${y}`,
        key:`year-${y}`,
        match:r=>r.Years?.[0]===y&&r.Years?.[1]===y,
        create:()=>({Key:`year-${y}`,Title:`${mediaWord} from ${y}`,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[],Years:[y,y],Months:[]})
      });
    }
    for(const [name,count] of toSorted(byGenre,40)){
      list.push({
        kind:'genre',name,count,
        title:`${name} Spotlight`,
        key:slug('genre',name),
        match:r=>(r.GenresAny||[]).length===1&&r.GenresAny[0].toLowerCase()===name.toLowerCase()&&!(r.TagsAny?.length),
        create:()=>({Key:slug('genre',name),Title:`${name} Spotlight`,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[name],TagsAny:[],Months:[]})
      });
    }
    for(const [name,count] of toSorted(byTag,50)){
      const pretty=name.replace(/\b\w/g,c=>c.toUpperCase());
      list.push({
        kind:'tag',name,count,
        title:pretty,
        key:slug('tag',name),
        match:r=>(r.TagsAny||[]).length===1&&r.TagsAny[0].toLowerCase()===name.toLowerCase()&&!(r.GenresAny?.length),
        create:()=>({Key:slug('tag',name),Title:pretty,Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[name],Months:[]})
      });
    }
    return list;
  }
  function ruleSummary(rule){
    const parts=[];
    const types=rule.Types?.length===2?'Movies & Shows':rule.Types?.[0]==='Series'?'Shows':'Movies';
    parts.push(types);
    if(rule.DirectorsAny?.length)parts.push(`Dir: ${rule.DirectorsAny.slice(0,2).join(', ')}`);
    if(rule.ActorsAny?.length)parts.push(`Cast: ${rule.ActorsAny.slice(0,2).join(', ')}`);
    if(rule.StudiosAny?.length)parts.push(`Studio: ${rule.StudiosAny.slice(0,2).join(', ')}`);
    if(rule.GenresAny?.length)parts.push(`Genres: ${rule.GenresAny.slice(0,2).join(', ')}`);
    if(rule.TagsAny?.length)parts.push(`Tags: ${rule.TagsAny.slice(0,2).join(', ')}`);
    if(rule.Years?.length===2){
      parts.push(rule.Years[0]===rule.Years[1]?`Year: ${rule.Years[0]}`:`Years: ${rule.Years[0]}–${rule.Years[1]}`);
    }
    if(rule.MinRating)parts.push(`${rule.MinRating}+ ★`);
    if(rule.MaxMinutes)parts.push(`< ${rule.MaxMinutes}m`);
    if(rule.Months?.length)parts.push(`Months: ${rule.Months.join(',')}`);
    const matches=countRuleMatches(rule);
    if(matches!==null)parts.push(`${matches} match${matches===1?'':'es'}`);
    return parts.join(' · ');
  }
  function uniqueValues(kind){
    const items=inventory?.items||[];
    if(kind==='DirectorsAny')return [...new Set(items.flatMap(i=>(i.People||[]).filter(p=>p?.Type==='Director').map(p=>p.Name)).filter(Boolean))].sort();
    if(kind==='ActorsAny')return [...new Set(items.flatMap(i=>(i.People||[]).filter(p=>p?.Type==='Actor').map(p=>p.Name)).filter(Boolean))].sort();
    if(kind==='StudiosAny')return [...new Set(items.flatMap(i=>(i.Studios||[]).map(s=>typeof s==='string'?s:s?.Name)).filter(Boolean))].sort();
    if(kind==='GenresAny')return [...new Set(items.flatMap(i=>i.Genres||[]).filter(Boolean))].sort();
    if(kind==='TagsAny')return [...new Set(items.flatMap(i=>i.Tags||[]).filter(Boolean))].sort();
    return [];
  }
  function createFromTemplate(kind){
    const profile=draft.pages[page];
    const key=`category-${hash(String(Date.now())+profile.rules.length+kind).toString(16)}`;
    const base={Key:key,Title:'New category',Enabled:true,Types:defaultTypesForPage(page),GenresAny:[],TagsAny:[],Months:[]};
    const dirs=uniqueValues('DirectorsAny'), actors=uniqueValues('ActorsAny'), studios=uniqueValues('StudiosAny');
    const yr=new Date().getFullYear();
    if(kind==='director'){base.Title=dirs[0]?`Directed by ${dirs[0]}`:'Directed by…';base.DirectorsAny=dirs[0]?[dirs[0]]:[];}
    else if(kind==='actor'){base.Title=actors[0]?`Starring ${actors[0]}`:'Starring…';base.ActorsAny=actors[0]?[actors[0]]:[];}
    else if(kind==='studio'){base.Title=studios[0]?`From ${studios[0]}`:'Studio Spotlight';base.StudiosAny=studios[0]?[studios[0]]:[];}
    else if(kind==='year'){base.Title=`${page==='shows'?'Shows':'Movies'} from ${yr-1}`;base.Years=[yr-1,yr];}
    else if(kind==='short'){base.Title='Under 100 Minutes';base.Types=['Movie'];base.MaxMinutes=100;}
    else if(kind==='acclaimed'){base.Title='Critics’ Choice (8.0+)';base.MinRating=8;}
    else if(kind==='seasonal'){base.Title='October Chills';base.GenresAny=['Horror','Thriller'];base.Months=[10];}
    profile.rules.push(base);
    editing=key;
    emit();
    draw();
    host.querySelector('[aria-label="Category title"]')?.focus();
  }
  function draw(){
    host.replaceChildren();
    const tabs=element('div','fx-editor-tabs');
    for(const name of ['home','movies','shows']){
      const b=button(name[0].toUpperCase()+name.slice(1),()=>{page=name;editing=null;draw();});
      b.className=`fx-tab-btn ${page===name?'is-active':''}`.trim();
      b.setAttribute('aria-pressed',String(page===name));
      tabs.append(b);
    }
    host.append(tabs);
    const profile=draft.pages[page];

    // 1. Shared feed preferences
    const sharedSec=element('section','fx-editor-section');
    sharedSec.append(element('h3','','Shared feed preferences'),element('p','fx-editor-help','Global display limits and behavior shared across Home, Movies and Shows.'));
    const general=element('div','fx-editor-fields');
    field(general,'Timezone',draft.timeZone,v=>draft.timeZone=v);
    field(general,'Cards per shelf',draft.cardsPerShelf,v=>draft.cardsPerShelf=Number(v),null,'number');
    field(general,'Minimum matching titles',draft.minimumItems,v=>draft.minimumItems=Number(v),null,'number');
    field(general,'Continuous scrolling',draft.endless,v=>draft.endless=v,null,'checkbox');
    field(general,'Hide watched titles',draft.hideWatched,v=>draft.hideWatched=v,null,'checkbox');
    sharedSec.append(general);
    host.append(sharedSec);

    // 2. Opening rows & organization
    const openingSec=element('section','fx-editor-section');
    openingSec.append(
      element('h3','','Opening rows & shelf order'),
      element('p','fx-editor-help','Arrange the exact shelves that appear at the top of this page. Mix core sections (Continue Watching, Recently Added), specific custom categories, and rotating pools (e.g. a random Director or Studio shelf). After these opening rows, the endless varied feed continues.')
    );
    const options=()=>[
      ...Object.entries(anchors).map(([key,label])=>[`anchor:${key}`,label]),
      ...profile.rules.map(r=>[`rule:${r.Key}`,r.Title]),
      ...Object.entries(families).map(([key,label])=>[`family:${key}`,label])
    ];
    const opening=profile.opening || profile.anchors.flatMap(a=>[`anchor:${a}`,'family:theme']);
    const updateOpening=()=>{profile.opening=[...opening];emit();draw();};

    const presetRow=element('div','fx-editor-presets');
    presetRow.append(
      button('Interleave Core & Custom',()=>{
        const core=profile.anchors.map(a=>`anchor:${a}`);
        const rot=['family:theme','family:director','family:actor','family:studio','family:decade','family:genre'];
        const nextOpening=[];
        const max=Math.max(core.length,rot.length);
        for(let i=0;i<max;i++){
          if(core[i])nextOpening.push(core[i]);
          if(rot[i])nextOpening.push(rot[i]);
        }
        profile.opening=nextOpening;emit();draw();
      }),
      button('Pin enabled categories first',()=>{
        const pinned=profile.rules.filter(r=>r.Enabled!==false).slice(0,6).map(r=>`rule:${r.Key}`);
        profile.opening=['anchor:ContinueWatchingNextUp',...pinned,'anchor:RecentlyAddedMovies','family:director','family:actor'];
        emit();draw();
      }),
      button('Use automatic ordering',()=>{delete profile.opening;emit();draw();})
    );
    openingSec.append(presetRow);

    const rows=element('ol','fx-order-list');
    opening.forEach((token,n)=>{
      const row=element('li','fx-order-row');
      const badgeType=token.startsWith('anchor:')?'Core':token.startsWith('rule:')?'Category':'Rotating';
      const badge=element('span',`fx-row-badge fx-row-badge-${badgeType.toLowerCase()}`,badgeType);
      const label=element('span','fx-order-label',options().find(([id])=>id===token)?.[1]||token);
      row.append(badge,label);
      const up=button('↑',()=>{[opening[n-1],opening[n]]=[opening[n],opening[n-1]];updateOpening();});
      up.disabled=n===0;up.setAttribute('aria-label',`Move row ${n+1} up`);
      const down=button('↓',()=>{[opening[n+1],opening[n]]=[opening[n],opening[n+1]];updateOpening();});
      down.disabled=n===opening.length-1;down.setAttribute('aria-label',`Move row ${n+1} down`);
      field(row,`Row ${n+1} artwork`,profile.layouts?.[token]||'auto',v=>{profile.layouts={...profile.layouts,[token]:v};profile.opening=[...opening];},layoutChoices);
      const rem=button('Remove',()=>{if(token.startsWith('anchor:'))profile.anchors=profile.anchors.filter(a=>a!==token.slice(7));opening.splice(n,1);updateOpening();});
      row.append(up,down,rem);
      rows.append(row);
    });
    openingSec.append(rows);
    const addRow=element('div','fx-editor-fields fx-add-opening-bar');
    let next=options()[0]?.[0]||'family:theme';
    field(addRow,'Add opening row',next,v=>next=v,options());
    addRow.append(button('Add row',()=>{if(next.startsWith('family:'))profile.families=[...new Set([...profile.families,next.slice(7)])];opening.push(next);updateOpening();}));
    openingSec.append(addRow);
    host.append(openingSec);

    // 3. Rotating category pools
    const rotSec=element('section','fx-editor-section');
    rotSec.append(
      element('h3','','Automatic rotating shelf pools'),
      element('p','fx-editor-help','Toggle which auto-generated shelf families can appear as you scroll (e.g. Directed by X, Starring X, Best of a decade, Studio / network).')
    );
    const rotation=element('div','fx-editor-fields fx-chip-toggles');
    Object.entries(families).forEach(([key,label])=>field(rotation,label,profile.families.includes(key),checked=>{profile.families=checked?[...new Set([...profile.families,key])]:profile.families.filter(k=>k!==key);},null,'checkbox'));
    rotSec.append(rotation);
    host.append(rotSec);

    // 4. Possible Categories Explorer (Discovered from library!)
    const explorerSec=element('section','fx-editor-section');
    explorerSec.append(
      element('h3','','Discover & toggle possible categories'),
      element('p','fx-editor-help','Browse directors, actors, studios, release years/decades, genres and tags discovered in your library. Toggle any item on to add it as a dedicated category shelf, or pin it directly to your Opening Rows.')
    );
    const candidates=discoverCandidates();
    const kindTabs=element('div','fx-explorer-tabs');
    const kindDefs=[
      ['director','Directed by…'],
      ['actor','Starring…'],
      ['studio','From Studio…'],
      ['year','Years & Decades'],
      ['genre','Genres'],
      ['tag','Themes & Tags']
    ];
    for(const [k,lbl] of kindDefs){
      const count=candidates.filter(c=>c.kind===k).length;
      const b=button(`${lbl} (${count})`,()=>{explorerKind=k;draw();});
      b.className=`fx-subtab-btn ${explorerKind===k?'is-active':''}`.trim();
      kindTabs.append(b);
    }
    const searchBar=element('div','fx-explorer-search');
    const searchInput=element('input');
    searchInput.type='search';
    searchInput.placeholder='Filter possible categories (e.g. Nolan, A24, 2024, Willem Dafoe, anime)…';
    searchInput.value=explorerQuery;
    searchInput.setAttribute('aria-label','Filter possible categories');
    searchInput.addEventListener('input',()=>{explorerQuery=searchInput.value;renderCandidateGrid();});
    searchBar.append(searchInput);
    const candidateGrid=element('div','fx-candidate-grid');
    function renderCandidateGrid(){
      candidateGrid.replaceChildren();
      const q=explorerQuery.trim().toLowerCase();
      const filtered=candidates.filter(c=>q?(c.title.toLowerCase().includes(q)||c.name.toLowerCase().includes(q)):c.kind===explorerKind).slice(0,36);
      if(!filtered.length){
        candidateGrid.append(element('p','fx-editor-empty',inventory?.items?.length?'No matching library categories found for this filter.':'Open Customize from Home, Movies, or Shows (or wait a moment) to scan library metadata for possible categories.'));
        return;
      }
      for(const cand of filtered){
        const existing=profile.rules.find(r=>r.Key===cand.key||cand.match(r));
        const active=Boolean(existing&&existing.Enabled!==false);
        const card=element('div',`fx-candidate-card ${active?'is-enabled':''}`.trim());
        const checkWrap=element('label','fx-candidate-main');
        const box=element('input');
        box.type='checkbox';
        box.checked=active;
        box.addEventListener('change',()=>{
          const found=profile.rules.find(r=>r.Key===cand.key||cand.match(r));
          if(box.checked){
            if(found)found.Enabled=true;
            else profile.rules.push(cand.create());
          }else if(found){
            found.Enabled=false;
          }
          emit();draw();
        });
        const textCol=element('div','fx-candidate-text');
        textCol.append(element('strong','',cand.title),element('span','fx-candidate-count',`${cand.count} title${cand.count===1?'':'s'}`));
        checkWrap.append(box,textCol);
        const pinBtn=button('Pin to top',()=>{
          let found=profile.rules.find(r=>r.Key===cand.key||cand.match(r));
          if(!found){found=cand.create();profile.rules.push(found);}
          found.Enabled=true;
          const token=`rule:${found.Key}`;
          const cur=profile.opening||profile.anchors.flatMap(a=>[`anchor:${a}`,'family:theme']);
          if(!cur.includes(token))cur.unshift(token);
          profile.opening=[...cur];
          emit();draw();
        });
        pinBtn.className='fx-btn-mini';
        card.append(checkWrap,pinBtn);
        candidateGrid.append(card);
      }
    }
    renderCandidateGrid();
    explorerSec.append(kindTabs,searchBar,candidateGrid);
    host.append(explorerSec);

    // 5. Category Library & Custom Category Builder
    const libSec=element('section','fx-editor-section');
    libSec.append(
      element('h3','','Category library'),
      element('p','fx-editor-help','Enable or disable categories, reorder them, pin them to Opening Rows, or craft your own custom categories from directors, actors, studios, years, ratings, runtime, genres and tags.')
    );
    const templateBar=element('div','fx-template-bar');
    templateBar.append(
      element('span','fx-template-label','Quick create:'),
      button('Add category',()=>{
        const key=`category-${hash(String(Date.now())+profile.rules.length).toString(16)}`;
        profile.rules.push({Key:key,Title:'New category',Enabled:true,Types:[page==='shows'?'Series':'Movie'],GenresAny:[],TagsAny:[],Months:[]});
        editing=key;emit();draw();host.querySelector('[aria-label="Category title"]')?.focus();
      }),
      button('+ Director Spotlight',()=>createFromTemplate('director')),
      button('+ Actor Spotlight',()=>createFromTemplate('actor')),
      button('+ Studio Collection',()=>createFromTemplate('studio')),
      button('+ Year / Era',()=>createFromTemplate('year')),
      button('+ Under 100m',()=>createFromTemplate('short')),
      button('+ 8.0+ Acclaimed',()=>createFromTemplate('acclaimed')),
      button('+ Seasonal',()=>createFromTemplate('seasonal')),
      button('Add supplied categories',()=>{
        for(const r of supplied.pages[page].rules){
          if(!profile.rules.some(x=>x.Key===r.Key))profile.rules.push(cloneJson(r));
        }
        emit();draw();
      })
    );
    libSec.append(templateBar);

    const ruleFilterBar=element('div','fx-library-toolbar');
    const ruleSearch=element('input');
    ruleSearch.type='search';
    ruleSearch.placeholder='Search your categories…';
    ruleSearch.value=libraryQuery;
    ruleSearch.setAttribute('aria-label','Search your categories');
    ruleSearch.addEventListener('input',()=>{libraryQuery=ruleSearch.value;renderRuleList();});
    const enableAllBtn=button('Enable all',()=>{profile.rules.forEach(r=>{r.Enabled=true;});emit();draw();});
    const disableAllBtn=button('Disable all',()=>{profile.rules.forEach(r=>{r.Enabled=false;});emit();draw();});
    ruleFilterBar.append(ruleSearch,enableAllBtn,disableAllBtn);
    libSec.append(ruleFilterBar);

    const ruleFormContainer=element('div','fx-rule-form-host');
    libSec.append(ruleFormContainer);

    const rules=element('div','fx-category-list');
    function renderRuleList(){
      rules.replaceChildren();
      const q=libraryQuery.trim().toLowerCase();
      profile.rules.forEach((r,n)=>{
        if(q&&!r.Title.toLowerCase().includes(q)&&!ruleSummary(r).toLowerCase().includes(q))return;
        const row=element('div',`fx-category-row ${editing===r.Key?'is-editing':''}`.trim());
        const mainInfo=element('div','fx-category-main');
        field(mainInfo,r.Title,r.Enabled!==false,v=>{r.Enabled=v;},null,'checkbox');
        mainInfo.append(element('span','fx-category-meta',ruleSummary(r)));
        const actions=element('div','fx-category-actions');
        const upBtn=button('↑',()=>{if(n>0){[profile.rules[n-1],profile.rules[n]]=[profile.rules[n],profile.rules[n-1]];emit();draw();}});
        upBtn.disabled=n===0;upBtn.title='Move category up';
        const downBtn=button('↓',()=>{if(n<profile.rules.length-1){[profile.rules[n+1],profile.rules[n]]=[profile.rules[n],profile.rules[n+1]];emit();draw();}});
        downBtn.disabled=n===profile.rules.length-1;downBtn.title='Move category down';
        const isPinned=(profile.opening||[]).includes(`rule:${r.Key}`);
        const pinBtn=button(isPinned?'Pinned':'Pin to top',()=>{
          const cur=profile.opening?[...profile.opening]:profile.anchors.flatMap(a=>[`anchor:${a}`,'family:theme']);
          const token=`rule:${r.Key}`;
          const idx=cur.indexOf(token);
          if(idx>=0)cur.splice(idx,1);
          else cur.unshift(token);
          profile.opening=cur;emit();draw();
        });
        pinBtn.className=`fx-btn-mini ${isPinned?'is-pinned':''}`.trim();
        const editBtn=button('Edit',()=>{editing=r.Key;draw();host.querySelector('[aria-label="Category title"]')?.focus();});
        const delBtn=button('Delete',()=>{
          profile.rules.splice(n,1);
          profile.opening=profile.opening?.filter(t=>t!==`rule:${r.Key}`);
          if(profile.layouts)delete profile.layouts[`rule:${r.Key}`];
          if(editing===r.Key)editing=null;
          emit();draw();
        });
        actions.append(upBtn,downBtn,pinBtn,editBtn,delBtn);
        row.append(mainInfo,actions);
        rules.append(row);
      });
    }
    renderRuleList();
    libSec.append(rules);

    const activeRule=profile.rules.find(r=>r.Key===editing);
    if(activeRule){
      const form=element('fieldset','fx-rule-form');
      const liveMatches=countRuleMatches(activeRule);
      form.append(element('legend','',`Edit category: ${activeRule.Title}${liveMatches!==null?` (${liveMatches} matching titles)`:''}`));
      const grid=element('div','fx-editor-fields');
      field(grid,'Category title',activeRule.Title,v=>{activeRule.Title=v;});
      field(grid,'Media type',activeRule.Types.length===2?'both':activeRule.Types[0],v=>activeRule.Types=v==='both'?['Movie','Series']:[v],[['Movie','Movies'],['Series','Shows'],['both','Movies and shows']]);
      field(grid,'Category artwork',activeRule.Layout||'auto',v=>activeRule.Layout=v,layoutChoices);
      field(grid,'Minimum community rating',activeRule.MinRating,v=>activeRule.MinRating=v===''?null:Number(v),null,'number');
      field(grid,'Under minutes',activeRule.MaxMinutes,v=>activeRule.MaxMinutes=v===''?null:Number(v),null,'number');
      field(grid,'Scheduled months',(activeRule.Months||[]).join(', '),v=>activeRule.Months=v.split(',').map(x=>x.trim()).filter(Boolean).map(Number));
      field(grid,'From year',activeRule.Years?.[0],v=>{activeRule.Years=v===''&&!activeRule.Years?.[1]?null:[v===''?0:Number(v),activeRule.Years?.[1]??9999];},null,'number');
      field(grid,'Through year',activeRule.Years?.[1],v=>{activeRule.Years=v===''&&!activeRule.Years?.[0]?null:[activeRule.Years?.[0]??0,v===''?9999:Number(v)];},null,'number');
      form.append(grid);

      const metaGrid=element('div','fx-editor-meta-grid');
      for(const [key,label,hint] of [
        ['GenresAny','Genres','e.g. Action, Sci-Fi, Horror'],
        ['TagsAny','Tags','e.g. superhero, anime, space'],
        ['DirectorsAny','Directors','e.g. Christopher Nolan, Denis Villeneuve'],
        ['ActorsAny','Cast','e.g. Willem Dafoe, Christian Bale'],
        ['StudiosAny','Studios','e.g. A24, Marvel Studios, Pixar']
      ]){
        const col=element('div','fx-meta-col');
        const control=field(col,label,(activeRule[key]||[]).join(', '),v=>{activeRule[key]=v.split(',').map(x=>x.trim()).filter(Boolean);});
        control.placeholder=hint||'Comma-separated names';
        const vals=uniqueValues(key);
        if(vals.length){
          const list=element('datalist');
          list.id=`fx-values-${key}`;
          vals.slice(0,250).forEach(v=>{const o=element('option');o.value=v;list.append(o);});
          control.setAttribute('list',list.id);
          col.append(list);
          const picks=element('div','fx-quick-picks');
          vals.slice(0,10).forEach(v=>{
            const active=(activeRule[key]||[]).some(x=>x.toLowerCase()===v.toLowerCase());
            const chip=button(active?`✓ ${v}`:`+ ${v}`,()=>{
              const cur=activeRule[key]||[];
              const idx=cur.findIndex(x=>x.toLowerCase()===v.toLowerCase());
              if(idx>=0)cur.splice(idx,1);
              else cur.push(v);
              activeRule[key]=[...cur];
              emit();draw();
            });
            chip.className=`fx-pick-chip ${active?'is-selected':''}`.trim();
            picks.append(chip);
          });
          col.append(picks);
        }
        metaGrid.append(col);
      }
      form.append(metaGrid);
      form.append(element('p','fx-editor-help','Months: blank = all year; 10 = October; 12 = December. Names match ignoring case. Each populated filter group must match; comma-separated values within a field act as OR alternatives.'));
      const formActions=element('div','fx-rule-form-actions');
      formActions.append(button('Done editing',()=>{editing=null;emit();draw();}));
      form.append(formActions);
      ruleFormContainer.append(form);
    }
    host.append(libSec);
  }
  draw();
  return {
    setConfig(config){draft=cloneJson(config);editing=null;draw();},
    setInventory(inv){inventory=inv;draw();},
    getConfig(){return cloneJson(draft);}
  };
}
