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
  let reactionTimer, effectTimer, dirtLevel = 0, exploreBoosts = 0, exploreDay = "";
  const effectSymbols = {feed:["✦","·","✧"],play:["✦","✧","·","✦"],clean:["○","○","✧","✦","✧","✦"],rest:["Z","z","Z","z"],cuddle:["♡","♥","♡","♥","♡"],explore:["✧","✦","·","✧"]};
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
    const art=$("pet-art"), reaction=$("pet-reaction"), mouth=$("pet-mouth"), eyes=$("pet-closed-eyes");
    clearTimeout(reactionTimer);
    art.classList.remove("react-bounce","react-wiggle","react-snooze","react-run");
    mouth.classList.toggle("open",action==="feed");
    eyes.classList.toggle("closed",action==="rest");
    art.classList.add(action==="play"?"react-run":action==="rest"?"react-snooze":action==="cuddle"?"react-bounce":"react-bounce");
    reaction.textContent=action==="feed"?"nom nom":action==="play"?"✨":action==="clean"?"✦":action==="rest"?"":"♡";
    reaction.className=`pet-reaction reaction-${action}${action==="rest"?"":" pop"}`;
    spawnEffects(action);
    if(action!=="rest") {
      reactionTimer=setTimeout(()=>{
        art.classList.remove("react-bounce","react-wiggle","react-snooze","react-run");
        mouth.classList.remove("open"); eyes.classList.remove("closed"); reaction.classList.remove("pop");
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
    if (pet.evolvedForm) return PetEvolution.forms[pet.evolvedForm].art;
    return pet.stage === "juvenile" ? "assets/juvenile.svg" : "assets/hatchling.svg";
  }
  function render() {
    $("pet-name").textContent=pet.name;
    $("pet-art").src=artForPet();
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
        const discoveries=["a glittering pebble","a tiny moonflower","a strange musical shell","a speck of meteor glass","a singing seed","a sleepy glow-moth"];
        const found=discoveries[Math.floor(Math.random()*discoveries.length)];
        if((pet.exploreBoosts||0)<3){const trait=["curiosity","independence","energy","calmness","sociability"][Math.floor(Math.random()*5)];const boost=2+Math.floor(Math.random()*3);adjustTrait(trait,boost);pet.exploreBoosts=(pet.exploreBoosts||0)+1;note(`${pet.name} discovered ${found} and gained ${boost} ${trait}. (${pet.exploreBoosts}/3 exploration boosts today)`);say(`Found ${found}! ${trait[0].toUpperCase()+trait.slice(1)} +${boost}`);}
        else {note(`${pet.name} discovered ${found}, but was too tired for another personality boost today.`);say(`You found ${found}! That was quite an adventure.`);}
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