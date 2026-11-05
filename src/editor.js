// Visual editing works on a cloned configuration. Nothing persists until Apply.
export function createVisualEditor(host, initial, selectedPage, inventory, changed, {element,button,supplied}) {
  let draft=cloneJson(initial), page=selectedPage, editing=null;
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
  function draw(){
    host.replaceChildren();
    const tabs=element('div','fx-editor-tabs');
    for(const name of ['home','movies','shows']){const b=button(name[0].toUpperCase()+name.slice(1),()=>{page=name;editing=null;draw();});b.setAttribute('aria-pressed',String(page===name));tabs.append(b);}host.append(tabs);
    const profile=draft.pages[page];
    host.append(element('h3','','Shared feed preferences'));
    const general=element('div','fx-editor-fields');
    field(general,'Timezone',draft.timeZone,v=>draft.timeZone=v);
    field(general,'Cards per shelf',draft.cardsPerShelf,v=>draft.cardsPerShelf=Number(v),null,'number');
    field(general,'Minimum matching titles',draft.minimumItems,v=>draft.minimumItems=Number(v),null,'number');
    field(general,'Continuous scrolling',draft.endless,v=>draft.endless=v,null,'checkbox');
    field(general,'Hide watched titles',draft.hideWatched,v=>draft.hideWatched=v,null,'checkbox');host.append(general);
    host.append(element('h3','','Opening rows'),element('p','','Arrange a fixed opening, mixing default sections, specific categories and rotating slots. Afterwards the varied feed continues. Empty or out-of-season rows are skipped. Unlisted default sections follow the opening.'));
    const options=()=>[
      ...Object.entries(anchors).map(([key,label])=>[`anchor:${key}`,label]),
      ...profile.rules.map(r=>[`rule:${r.Key}`,r.Title]),
      ...Object.entries(families).map(([key,label])=>[`family:${key}`,label])];
    const opening=profile.opening || profile.anchors.flatMap(a=>[`anchor:${a}`,'family:theme']);
    const rows=element('ol','fx-order-list');
    const updateOpening=()=>{profile.opening=[...opening];emit();draw();};
    opening.forEach((token,n)=>{
      const row=element('li','fx-order-row');row.append(element('span','',options().find(([id])=>id===token)?.[1]||token));
      const up=button('↑',()=>{[opening[n-1],opening[n]]=[opening[n],opening[n-1]];updateOpening();});up.disabled=n===0;up.setAttribute('aria-label',`Move row ${n+1} up`);
      const down=button('↓',()=>{[opening[n+1],opening[n]]=[opening[n],opening[n+1]];updateOpening();});down.disabled=n===opening.length-1;down.setAttribute('aria-label',`Move row ${n+1} down`);
      field(row,`Row ${n+1} artwork`,profile.layouts?.[token]||'auto',v=>{profile.layouts={...profile.layouts,[token]:v};profile.opening=[...opening];},layoutChoices);
      row.append(up,down,button('Remove',()=>{if(token.startsWith('anchor:'))profile.anchors=profile.anchors.filter(a=>a!==token.slice(7));opening.splice(n,1);updateOpening();}));rows.append(row);
    });host.append(rows);
    const addRow=element('div','fx-editor-fields');let next=options()[0][0];
    field(addRow,'Add opening row',next,v=>next=v,options());addRow.append(button('Add row',()=>{if(next.startsWith('family:'))profile.families=[...new Set([...profile.families,next.slice(7)])];opening.push(next);updateOpening();}));
    addRow.append(button('Use automatic ordering',()=>{delete profile.opening;emit();draw();}));host.append(addRow);
    host.append(element('h3','','Category library'),element('p','','Enable categories, change their matching rules, or add your own. Artwork can be set per category or opening-row type.'));
    const rules=element('div','fx-category-list');
    profile.rules.forEach((rule,n)=>{
      const row=element('div','fx-category-row');
      field(row,rule.Title,rule.Enabled!==false,v=>rule.Enabled=v,null,'checkbox');
      row.append(button('Edit',()=>{editing=rule.Key;draw();host.querySelector('[aria-label="Category title"]')?.focus();}),button('Delete',()=>{
        profile.rules.splice(n,1);profile.opening=profile.opening?.filter(t=>t!==`rule:${rule.Key}`);if(profile.layouts)delete profile.layouts[`rule:${rule.Key}`];editing=null;emit();draw();
      }));rules.append(row);
    });host.append(rules,button('Add supplied categories',()=>{for(const rule of supplied.pages[page].rules){if(!profile.rules.some(r=>r.Key===rule.Key))profile.rules.push(cloneJson(rule));}emit();draw();}),button('Add category',()=>{
      const key=`category-${hash(String(Date.now())+profile.rules.length).toString(16)}`;
      profile.rules.push({Key:key,Title:'New category',Enabled:true,Types:[page==='shows'?'Series':'Movie'],GenresAny:[],TagsAny:[],Months:[]});editing=key;emit();draw();host.querySelector('[aria-label="Category title"]')?.focus();
    }));
    const rule=profile.rules.find(r=>r.Key===editing);
    if(rule){
      const form=element('fieldset','fx-rule-form');form.append(element('legend','','Edit category'));
      field(form,'Category title',rule.Title,v=>{rule.Title=v;});
      field(form,'Media type',rule.Types.length===2?'both':rule.Types[0],v=>rule.Types=v==='both'?['Movie','Series']:[v],[['Movie','Movies'],['Series','Shows'],['both','Movies and shows']]);
      for(const [key,label] of [['GenresAny','Genres'],['TagsAny','Tags'],['DirectorsAny','Directors'],['ActorsAny','Cast'],['StudiosAny','Studios']]){
        const control=field(form,label,(rule[key]||[]).join(', '),v=>rule[key]=v.split(',').map(x=>x.trim()).filter(Boolean));control.placeholder='Comma-separated names';
        const known=key==='GenresAny'?'Genres':key==='TagsAny'?'Tags':null;
        if(known){const list=element('datalist');list.id=`fx-values-${key}`;[...new Set((inventory?.items||[]).flatMap(i=>i[known]||[]))].sort().forEach(v=>{const o=element('option');o.value=v;list.append(o);});control.setAttribute('list',list.id);form.append(list);}
      }
      field(form,'Minimum community rating',rule.MinRating,v=>rule.MinRating=v===''?null:Number(v),null,'number');
      field(form,'Under minutes',rule.MaxMinutes,v=>rule.MaxMinutes=v===''?null:Number(v),null,'number');
      field(form,'Scheduled months',(rule.Months||[]).join(', '),v=>rule.Months=v.split(',').map(x=>x.trim()).filter(Boolean).map(Number));
      field(form,'From year',rule.Years?.[0],v=>{rule.Years=v===''&&!rule.Years?.[1]?null:[v===''?0:Number(v),rule.Years?.[1]??9999];},null,'number');
      field(form,'Through year',rule.Years?.[1],v=>{rule.Years=v===''&&!rule.Years?.[0]?null:[rule.Years?.[0]??0,v===''?9999:Number(v)];},null,'number');
      form.append(element('p','','Months: blank = all year; 10 = October; 12 = December. Names match exactly, ignoring case. Each filter group must match; names within one group are alternatives.'));
      field(form,'Category artwork',rule.Layout||'auto',v=>rule.Layout=v,layoutChoices);
      form.append(button('Done editing',()=>{editing=null;emit();draw();}));host.append(form);
    }
    host.append(element('h3','','Rotating category types'));
    const rotation=element('div','fx-editor-fields');
    Object.entries(families).forEach(([key,label])=>field(rotation,label,profile.families.includes(key),checked=>{profile.families=checked?[...new Set([...profile.families,key])]:profile.families.filter(k=>k!==key);},null,'checkbox'));host.append(rotation);
  }
  draw();
  return {setConfig(config){draft=cloneJson(config);editing=null;draw();},getConfig(){return cloneJson(draft);}};
}
