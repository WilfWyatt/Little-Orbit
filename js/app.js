/* Little Orbit interface and actions */
(() => {
  const $ = id => document.getElementById(id);
  let pet = PetSave.load();
  let toastTimer;
  const traitNames = {curiosity:"Curiosity",sociability:"Sociability",calmness:"Calmness",energy:"Energy",independence:"Independence"};
  const messages = {
    feed:["Mmm! Cosmic fruit is delicious.","A very satisfied little burble.","That hit the spot!"],
    play:["Wiggle wiggle!","Best game in the galaxy!","A happy little bounce."],
    clean:["Fresh as a moonbeam.","A tidy habitat feels lovely.","Sparkly!"],
    rest:["A peaceful little snooze.","Recharging tiny stardust batteries.","Sleep well, little star."],
    cuddle:["A warm little glow answers you.","Your bond grows a little stronger.","A happy chirrup just for you."],
    explore:["You found a glittering pebble!","A new smell. Fascinating.","A tiny mystery for the journal."]
  };
  function say(message) { pet.mood = message; $("pet-mood").textContent = message; }
  let reactionTimer, effectTimer, dirtLevel = 0, exploreBoosts = 0, exploreDay = "", activeExpression = "idle";
  const effectSymbols = {feed:["✦","·","✧"],play:["✦","✧","·","✦"],clean:["○","○","✧","✦","✧","✦"],rest:["Z","z","Z","z"],cuddle:["♡","♥","♡","♥","♡"],explore:["✧","✦","·","✧"]};
  const discoveryCatalogue = [
    {id:"moonflower",name:"Moonflower Seed",kind:"seed",icon:"✿",rarity:"Common",desc:"A pale seed that opens only beneath two moons.",plant:"Moonflower",decor:"✿"},
    {id:"glowmoth",name:"Glow-moth",kind:"life",icon:"🦋",rarity:"Common",desc:"A tiny fluttering visitor drawn to gentle light."},
    {id:"meteor-glass",name:"Meteor Glass",kind:"keepsake",icon:"◇",rarity:"Common",desc:"A smooth fragment that catches starlight."},
    {id:"singing-shell",name:"Singing Shell",kind:"keepsake",icon:"◖",rarity:"Uncommon",desc:"It hums softly when the nebula winds rise."},
    {id:"singing-seed",name:"Chorus Seed",kind:"seed",icon:"❋",rarity:"Uncommon",desc:"Plant it and it will sing to the evening sky.",plant:"Chorus Bloom",decor:"❋"},
    {id:"crystal-moss",name:"Star-moss",kind:"seed",icon:"❈",rarity:"Uncommon",desc:"Velvety moss that glimmers in the dark.",plant:"Star-moss",decor:"❈"},
    {id:"tiny-monolith",name:"Tiny Monolith",kind:"decor",icon:"▰",rarity:"Rare",desc:"A mysterious little stone with no visible markings.",decor:"▰"},
    {id:"comet-feather",name:"Comet Feather",kind:"keepsake",icon:"➶",rarity:"Rare",desc:"Weightless, cool to the touch, and faintly luminous."},
    {id:"orbit-orchid",name:"Orbit Orchid Seed",kind:"seed",icon:"✺",rarity:"Rare",desc:"A rare seed that grows in spirals, not stems.",plant:"Orbit Orchid",decor:"✺"},
    {id:"echo-stone",name:"Echo Stone",kind:"decor",icon:"◈",rarity:"Very rare",desc:"It repeats the last note of a sound you make.",decor:"◈"}
  ];
  const plantArt = {"Moonflower":"✿","Chorus Bloom":"❋","Star-moss":"❈","Orbit Orchid":"✺"};
  function ensureWorldData(){
    if(!pet.collection) pet.collection={};
    if(!Array.isArray(pet.planted)) pet.planted=[];
    if(!Array.isArray(pet.decorations)) pet.decorations=[];
    if(!pet.plantGrowth) pet.plantGrowth={};
    if(!pet.exploration) pet.exploration={lastAt:0,total:0};
  }
  function discoverSomething(){
    ensureWorldData();
    const undiscovered=discoveryCatalogue.filter(d=>!pet.collection[d.id]);
    // Common finds are more likely; rarities remain possible, and each expedition is never guaranteed new.
    const pool=undiscovered.length?discoveryCatalogue.filter(d=>!pet.collection[d.id] || Math.random()<0.13):discoveryCatalogue;
    const weights=pool.map(d=>d.rarity==="Common"?6:d.rarity==="Uncommon"?3:d.rarity==="Rare"?1.2:.35);
    let pick=Math.random()*weights.reduce((a,b)=>a+b,0), chosen=pool[0];
    for(let i=0;i<pool.length;i++){pick-=weights[i];if(pick<=0){chosen=pool[i];break;}}
    const isNew=!pet.collection[chosen.id];
    pet.collection[chosen.id]=(pet.collection[chosen.id]||0)+1;
    pet.exploration.total=(pet.exploration.total||0)+1;pet.exploration.lastAt=Date.now();
    return {item:chosen,isNew};
  }
  function renderCollection(){
    ensureWorldData();
    const found=discoveryCatalogue.filter(d=>pet.collection[d.id]);
    $("collection-badge").textContent=found.length;
    $("collection-progress").textContent=`${found.length} / ${discoveryCatalogue.length}`;
    $("collection-headline").textContent=found.length===discoveryCatalogue.length?"A complete little universe!":"Every little mystery matters.";
    $("collection-subline").textContent=`${found.length} of ${discoveryCatalogue.length} species and curiosities found · ${pet.exploration.total||0} expeditions`; 
    $("collection-grid").innerHTML=discoveryCatalogue.map(d=>{const count=pet.collection[d.id]||0;return `<article class="specimen ${count?'found':'unknown'}"><div class="specimen-art">${count?d.icon:'?'}</div><div class="specimen-copy"><strong>${count?d.name:'Undiscovered mystery'}</strong><span class="rarity rarity-${d.rarity.toLowerCase().replace(' ','-')}">${count?d.rarity:'Unknown rarity'}</span><p>${count?d.desc:'Explore the little world to learn what this could be.'}</p>${count>1?`<small>Found ${count} times</small>`:''}</div></article>`}).join("");
  }
  function renderHabitat(){
    ensureWorldData();
    const plants=$("habitat-plants"),decor=$("habitat-decor");
    plants.innerHTML=pet.planted.map((name,i)=>{const progress=Math.min(100,Math.floor((Date.now()-(pet.plantGrowth[name]||Date.now()))/3600000*20));return `<span class="habitat-plant plant-${i%4}" title="${escapeHtml(name)} · ${progress}% grown"><i>${plantArt[name]||'✿'}</i><small>${progress>=100?'Blooming':progress>=50?'Growing':'Sprout'}</small></span>`}).join("");
    decor.innerHTML=pet.decorations.map((symbol,i)=>`<span class="habitat-decoration decor-${i%4}">${symbol}</span>`).join("");
    $("planted-count").textContent=pet.planted.length;$("decor-count").textContent=pet.decorations.length;$("habitat-days").textContent=`Day ${Math.max(1,Math.floor(pet.ageHours/24)+1)}`;
    $("habitat-status").textContent=pet.planted.length?"Something is growing":"A world to make your own";
    const owned=discoveryCatalogue.filter(d=>(pet.collection[d.id]||0)>0 && (d.kind==='seed'||d.kind==='decor'));
    $("habitat-inventory-list").innerHTML=owned.length?owned.map(d=>{const planted=d.plant&&pet.planted.includes(d.plant);const placed=d.decor&&pet.decorations.filter(x=>x===d.decor).length;return `<article class="inventory-item"><span class="inventory-icon">${d.icon}</span><div><strong>${d.name}</strong><small>${d.plant?(planted?'Already planted': 'Can be planted'):d.decor?(placed?'Decoration unlocked':'Habitat keepsake'):'Keepsake'}</small></div>${d.plant?`<button class="mini-button" data-plant="${d.id}" ${planted?'disabled':''}>${planted?'Planted':'Plant'}</button>`:d.decor?`<button class="mini-button" data-decor="${d.id}">Place</button>`:''}</article>`}).join(""):'<p class="empty-inventory">Your first seed or keepsake is out there waiting. Try an expedition!</p>';
    $("habitat-inventory-list").querySelectorAll('[data-plant]').forEach(b=>b.addEventListener('click',()=>plantDiscovery(b.dataset.plant)));
    $("habitat-inventory-list").querySelectorAll('[data-decor]').forEach(b=>b.addEventListener('click',()=>placeDecoration(b.dataset.decor)));
  }
  function plantDiscovery(id){const d=discoveryCatalogue.find(x=>x.id===id);if(!d||!d.plant||pet.planted.includes(d.plant))return;pet.planted.push(d.plant);pet.plantGrowth[d.plant]=Date.now();note(`${pet.name} planted a ${d.name.toLowerCase()} in the habitat.`);render();toast(`${d.plant} planted! Give it time to grow.`);}
  function placeDecoration(id){const d=discoveryCatalogue.find(x=>x.id===id);if(!d||!d.decor)return;pet.decorations.push(d.decor);note(`${pet.name} added a ${d.name.toLowerCase()} to the habitat.`);render();toast('A little keepsake for home!');}
  function setView(view){document.querySelectorAll('.world-view').forEach(el=>el.hidden=el.id!==`${view}-view`);document.querySelectorAll('.world-tab').forEach(el=>el.classList.toggle('active',el.dataset.view===view));if(view==='habitat')renderHabitat();if(view==='collection')renderCollection();window.scrollTo({top:0,behavior:'smooth'});}

  function spawnEffects(action) {
    const layer=$("pet-effects"); layer.innerHTML=""; layer.className=`pet-effects effects-${action}`;
    const symbols=effectSymbols[action]||["✦"];
    const count=action==="clean"?18:action==="cuddle"?9:action==="rest"?4:action==="explore"?7:action==="play"?6:5;
    for(let i=0;i<count;i++){
      const node=document.createElement("span");
      node.className=`effect-particle particle-${i%6}`;
      node.textContent=symbols[i%symbols.length];
      node.style.setProperty("--delay",`${(i%count)*.42}s`);
      node.style.setProperty("--drift",`${((i%5)-2)*22}px`);
      layer.appendChild(node);
    }
    clearTimeout(effectTimer);
    // Rest is a state, not a one-shot burst: keep the snoozing Zs drifting until another action.
    if(action!=="rest") effectTimer=setTimeout(()=>{layer.innerHTML="";layer.className="pet-effects";},action==="clean"?2200:action==="cuddle"?2400:1800);
  }
  function react(action) {
    const art=$("pet-art"), reaction=$("pet-reaction");
    clearTimeout(reactionTimer);
    art.classList.remove("react-bounce","react-wiggle","react-snooze","react-run","react-feed");
    activeExpression = action === "rest" ? "rest" : action === "feed" ? "feed" : "idle";
    art.src = artForPet();
    art.classList.add(action==="play"?"react-run":action==="rest"?"react-snooze":action==="feed"?"react-feed":"react-bounce");
    reaction.textContent=action==="feed"?"nom nom":action==="play"?"✨":action==="clean"?"✦":action==="rest"?"":"♡";
    reaction.className=`pet-reaction reaction-${action}${action==="rest"?"":" pop"}`;
    spawnEffects(action);
    if(action!=="rest") {
      reactionTimer=setTimeout(()=>{
        art.classList.remove("react-bounce","react-wiggle","react-snooze","react-run","react-feed");
        activeExpression = "idle"; art.src = artForPet(); reaction.classList.remove("pop");
      },action==="clean"?2200:1600);
    }
  }
  function renderDirt() {
    const layer=$("pet-dirt"); layer.innerHTML=""; layer.classList.toggle("dirty",dirtLevel>0);
    const count=Math.min(10,Math.ceil(dirtLevel/10));
    const spots=[[35,48],[64,51],[43,61],[57,64],[31,68],[68,69],[47,74],[60,43],[38,41],[55,55]];
    for(let i=0;i<count;i++){const dot=document.createElement("i");dot.style.left=spots[i][0]+"%";dot.style.top=spots[i][1]+"%";dot.style.opacity=String(.45+((i%3)*.18));layer.appendChild(dot);}
  }
  function toast(message) {
    const el=$("toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
  }
  function note(text) {
    pet.journal.unshift({at:Date.now(),text});
    pet.journal = pet.journal.slice(0,8);
  }
  function setNeed(key, delta) { pet.needs[key] = PetModel.clamp(pet.needs[key] + delta); }
  function adjustTrait(key, delta) { pet.traits[key] = PetModel.clamp(pet.traits[key] + delta); }
  function artForPet() {
    let base;
    if (pet.evolvedForm) base = PetEvolution.forms[pet.evolvedForm].art;
    else base = pet.stage === "juvenile" ? "assets/juvenile.svg" : "assets/hatchling.svg";
    if (activeExpression === "idle") return base;
    const variant = activeExpression === "rest" ? "sleep" : activeExpression === "feed" ? "feed" : "";
    if (!variant) return base;
    return base.replace(/\.svg$/, `-${variant}.svg`);
  }
  function render() {
    if(pet) ensureWorldData();
    $("pet-name").textContent=pet.name;
    const desiredArt=artForPet();
    if ($("pet-art").getAttribute("src") !== desiredArt) $("pet-art").src=desiredArt;
    $("pet-art").alt=`${pet.name}, your ${pet.stage === "adult" ? PetEvolution.forms[pet.evolvedForm].name : pet.stage + " alien"}`;
    dirtLevel=Number.isFinite(pet.dirtLevel)?pet.dirtLevel:0; renderDirt();
    $("stage-label").textContent=`${pet.stage.toUpperCase()} · DAY ${Math.max(1,Math.floor(pet.ageHours/24)+1)}`;
    const form=PetEvolution.current(pet);
    $("pet-description").textContent=form ? form.description : pet.stage==="juvenile" ? "Growing braver, brighter and more themselves every day." : "A curious little life from somewhere far away.";
    const growth=Math.min(100,Math.round((pet.ageHours/72)*100));
    $("growth-fill").style.width=`${growth}%`; $("growth-label").textContent=`${growth}%`;
    const needGrid=$("needs-grid");
    needGrid.innerHTML=Object.entries(PetModel.labels).map(([key,meta])=>{
      const v=pet.needs[key], state=v<30?"low":v<60?"mid":"good";
      return `<div class="need-card"><div class="need-top"><span class="need-emoji">${meta.icon}</span><span>${meta.label}</span><span class="need-value">${v}%</span></div><div class="need-track"><div class="need-fill ${state}" style="width:${v}%"></div></div></div>`;
    }).join("");
    $("status-chip").textContent=pet.needs.health<60?"Needs gentle care":Math.min(pet.needs.hunger,pet.needs.energy,pet.needs.happiness)<35?"Could use some love":"Doing okay";
    $("traits-list").innerHTML=Object.entries(pet.traits).map(([key,v])=>`<div class="trait-row"><span class="trait-name">${traitNames[key]}</span><div class="trait-track"><div class="trait-fill" style="width:${v}%"></div></div><span class="trait-number">${v}</span></div>`).join("");
    $("journal-count").textContent=`${pet.journal.length} ${pet.journal.length===1?"note":"notes"}`;
    $("journal-list").innerHTML=pet.journal.length?pet.journal.slice(0,5).map(j=>`<li><span class="journal-dot">✦</span><span>${escapeHtml(j.text)}</span></li>`).join(""):'<li class="empty-journal">Your story is just beginning.</li>';
    renderCollection(); renderHabitat();
    PetSave.save(pet);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function doAction(action) {
    if (!pet) return;
    const changes = {
      feed:()=>{setNeed("hunger",28);setNeed("happiness",4);setNeed("cleanliness",-5);dirtLevel=Math.min(100,dirtLevel+7);adjustTrait("calmness",1);},
      play:()=>{setNeed("happiness",23);setNeed("energy",-13);setNeed("hunger",-7);setNeed("cleanliness",-8);dirtLevel=Math.min(100,dirtLevel+12);adjustTrait("energy",5);adjustTrait("sociability",2);},
      clean:()=>{setNeed("cleanliness",35);setNeed("happiness",3);dirtLevel=Math.max(0,dirtLevel-48);adjustTrait("calmness",2);},
      rest:()=>{setNeed("energy",28);setNeed("happiness",3);adjustTrait("calmness",4);},
      cuddle:()=>{setNeed("happiness",16);adjustTrait("sociability",5);adjustTrait("calmness",1);},
      explore:()=>{
        setNeed("energy",-19);setNeed("hunger",-13);setNeed("cleanliness",-15);setNeed("happiness",10);dirtLevel=Math.min(100,dirtLevel+18);
        const today=new Date().toISOString().slice(0,10);if(pet.exploreDay!==today){pet.exploreDay=today;pet.exploreBoosts=0;}
        const result=discoverSomething(), found=result.item;
        if((pet.exploreBoosts||0)<3){const trait=["curiosity","independence","energy","calmness","sociability"][Math.floor(Math.random()*5)];const boost=2+Math.floor(Math.random()*3);adjustTrait(trait,boost);pet.exploreBoosts=(pet.exploreBoosts||0)+1;note(`${pet.name} ${result.isNew?'discovered':'found another'} ${found.name}${result.isNew?'':' (duplicate)'} and gained ${boost} ${trait}. (${pet.exploreBoosts}/3 exploration boosts today)`);say(`${result.isNew?'New discovery':'Another find'}: ${found.name}! ${trait} +${boost}`);}
        else {note(`${pet.name} ${result.isNew?'discovered':'found another'} ${found.name}${result.isNew?'':' (duplicate)'}, but was too tired for another personality boost today.`);say(`${result.isNew?'New discovery':'Another find'}: ${found.name}!`);}
        if(found.kind==='seed'&&result.isNew)say(`You found ${found.name}! You can plant it at home.`);
      }
    };
    changes[action]?.();
    pet.actions[action]=(pet.actions[action]||0)+1;
    pet.dirtLevel=dirtLevel;
    pet.lastSeen=Date.now();
    if(action!=="explore" || (pet.exploreBoosts||0)>=3) say(messages[action][Math.floor(Math.random()*messages[action].length)]);
    react(action);
    if (action!=="explore") note(`${pet.name} spent a little time with you: ${action}.`);
    const result=PetEvolution.updateStage(pet);
    render();
    if(result.evolved) {
      $("pet-art").classList.remove("evolved-pop"); void $("pet-art").offsetWidth; $("pet-art").classList.add("evolved-pop");
      say(`${pet.name} evolved into ${result.form.name}!`); render();
      toast(`A new form! ${result.form.name} ✨`);
    } else toast(messages[action][Math.floor(Math.random()*messages[action].length)]);
  }
  function start(name) {
    pet=PetModel.defaultPet((name||"Pip").trim().slice(0,18)||"Pip");
    dirtLevel=0; pet.dirtLevel=0;
    PetSave.save(pet); $("welcome-dialog").close(); render(); toast(`${pet.name} has arrived!`);
  }
  document.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>{
    doAction(btn.dataset.action);
    // On phones, keep care one tap away and bring the pet back into view to show the reaction.
    if(btn.closest(".care-dock")) {
      setView("pet");
      window.setTimeout(()=>document.querySelector(".pet-card")?.scrollIntoView({behavior:"smooth",block:"start"}),40);
    }
  }));
  $("welcome-form").addEventListener("submit",e=>{e.preventDefault();start($("new-name").value);});
  $("rename-button").addEventListener("click",()=>{
    const name=prompt("What shall we call your alien?",pet.name);
    if(name && name.trim()){pet.name=name.trim().slice(0,18);note(`You chose the name ${pet.name}.`);say("I like the sound of that!");render();toast("Name updated.");}
  });
  $("export-button").addEventListener("click",()=>{PetSave.exportSave(pet);toast("Save exported.");});
  const titleScreen=$("title-screen"), gameScreen=$("game-screen");
  document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.view)));
  let soundEnabled=localStorage.getItem("littleOrbit.sound")!=="off";
  function syncSound(){const b=$("title-sound-toggle");b.textContent=soundEnabled?"♫":"♪̸";b.setAttribute("aria-label",soundEnabled?"Mute sound":"Enable sound");b.classList.toggle("sound-off",!soundEnabled);}
  syncSound();
  $("title-sound-toggle").addEventListener("click",e=>{e.stopPropagation();soundEnabled=!soundEnabled;localStorage.setItem("littleOrbit.sound",soundEnabled?"on":"off");syncSound();});
  $("title-play").addEventListener("click",()=>{titleScreen.hidden=true;gameScreen.hidden=false;window.scrollTo(0,0);pet=PetSave.load();if(!pet){pet=PetModel.defaultPet("Pip");$("welcome-dialog").showModal();}else{PetTime.advance(pet);const result=PetEvolution.updateStage(pet);render();if(result.evolved)toast(`${pet.name} evolved into ${result.form.name}!`);}});
  // Load the saved pet only when Play is pressed on the title screen.
  pet = null;
  setInterval(()=>{
    if(!pet)return;
    const before=pet.stage;
    PetTime.advance(pet,Date.now());
    const result=PetEvolution.updateStage(pet);
    render();
    if(result.evolved)toast(`${pet.name} evolved into ${result.form.name}!`);
  },60000);
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"&&pet){PetTime.advance(pet);const result=PetEvolution.updateStage(pet);render();if(result.evolved)toast(`${pet.name} evolved into ${result.form.name}!`);}
    else if(pet){pet.lastSeen=Date.now();PetSave.save(pet);}
  });
  window.addEventListener("pagehide",()=>{if(pet){pet.lastSeen=Date.now();PetSave.save(pet);}});
  // Allow importing a backup through a long press on Export Save.
  $("export-button").addEventListener("contextmenu",e=>{e.preventDefault();$("import-save").click();});
  $("import-save").addEventListener("change",async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{pet=await PetSave.importSave(file);pet.lastSeen=Date.now();PetSave.save(pet);render();toast("Your little friend is back!");}
    catch(err){toast(err.message||"Could not import save.");}
    e.target.value="";
  });
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();